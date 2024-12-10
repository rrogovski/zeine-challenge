import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Crypt } from '../helpers/crypt';
import { PrismaService } from '../../infra/database/prisma/prisma.service';
import { CreateUserDto } from '../../infra/http/dtos/create-user.dto';
import { Request } from 'express';
import ms = require('ms');

import { UsersService } from '../services/users-service';
import { IGeneretedToken, Tokens } from './types';
import { GenerateTokenParams, IToken } from './types';
import { randomUUID } from 'crypto';
import {roles_enum, status_enum, user} from '@prisma/client';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  #tokens: IGeneretedToken[] = [];

  async register(newUser: CreateUserDto): Promise<Tokens> {
    const userToCreate = {
      id: randomUUID(),
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      created_at: new Date(),
      updated_at: new Date(),
      status: status_enum.PENDING,
      roles: [roles_enum.PATIENT],
      confirmed_at: null,
    };

    const user = await this.usersService.create(userToCreate);

    if (!user.id || !user.name || !user.email) {
      throw new NotFoundException(`User not found`);
    }

    return await this.#generateTokens({
      userId: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login({
    userCredentials,
    ipAddress,
    userAgent,
    platform,
  }): Promise<Tokens | undefined> {
    try {
      console.log(ipAddress, userAgent, platform);
      const user = await this.validateUser(
        userCredentials.email,
        userCredentials.password,
      );

      if (!user.id || !user.name || !user.email) {
        throw new NotFoundException(`User not found`);
      }

      const tokens = await this.#generateTokens({
        userId: user.id,
        name: user.name,
        email: user.email,
      });

      this.#addTokens({ tokens, user, ipAddress, userAgent, platform });

      return tokens;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Invalid credentials`);
      } else {
        throw error;
      }
    }
  }

  async logout(request: Request) {
    const accessToken = request.headers.authorization?.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.#tokens = this.#tokens.filter(
      (token) => token.accessToken !== accessToken,
    );
  }

  async logoutAll(userId: string) {
    //TODO: implementar
  }

  async refreshTokens({
    refreshToken,
    ipAddress,
    userAgent,
    platform,
  }): Promise<Tokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const oldRefreshToken = this.#tokens.find(
      (token) => token.refreshToken !== refreshToken,
    );

    if (!oldRefreshToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const oldRefreshTokenDecode = await this.#decodeToken(
      oldRefreshToken.refreshToken,
    );

    const payloadRefreshTokenDecoded = await this.#decodeToken(refreshToken);

    const isValidToken = await this.#validateGeneratedToken({
      generetedTokenDecoded: oldRefreshTokenDecode,
      paylodTokenDecoded: payloadRefreshTokenDecoded,
      expirationTime: oldRefreshToken.refreshTokenExpiration,
    });

    if (!isValidToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.usersService.findById(oldRefreshTokenDecode.sub);

    if (user === null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.#tokens = this.#tokens.filter(
      (token) => token.refreshToken !== refreshToken,
    );

    if (!user.id || !user.name || !user.email) {
      throw new NotFoundException(`User not found`);
    }

    const tokens = await this.#generateTokens({
      userId: user.id,
      name: user.name,
      email: user.email,
      oldRefreshToken: refreshToken,
    });

    this.#addTokens({ tokens, user, ipAddress, userAgent, platform });

    return tokens;
  }

  async validateUser(email: string, password: string): Promise<Partial<user>> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!user.password) throw new UnauthorizedException('Invalid credentials');

    const passwordMatches = await new Crypt().compare(user.password, password);

    if (!passwordMatches)
      throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async validateFirebaseUser(
    firebaseUser: DecodedIdToken,
  ): Promise<Partial<user>> {
    if (!firebaseUser.email) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.usersService.findByEmail(firebaseUser.email);
    if (!user) {
      const userToCreate = {
        id: randomUUID(),
        name: firebaseUser.name,
        email: firebaseUser.email,
        password: "",
        created_at: new Date(),
        updated_at: new Date(),
        status: status_enum.PENDING,
        roles: [roles_enum.PATIENT],
        confirmed_at: null,
      };

      return await this.usersService.create(userToCreate);
    }

    return user;
  }

  async #generateTokens({
    userId,
    name,
    email,
    oldRefreshToken,
  }: GenerateTokenParams): Promise<Tokens> {
    const tokenPayload = {
      sub: userId,
      name,
      email,
      issuer: this.config.get('JWT_ISSUER'),
      audience: this.config.get('JWT_AUDIENCE'),
      iat: Date.now(),
    };
    const accessTokenOptions = {
      secret: this.config.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_TOKEN_EXPIRATION'),
    };
    const refreshTokenOptions = {
      secret: this.config.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRATION'),
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(tokenPayload, accessTokenOptions),
      this.jwtService.signAsync(tokenPayload, refreshTokenOptions),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async #handleReuseDetected(userId: string) {
    await this.logoutAll(userId);
    throw new UnauthorizedException('Invalid Credentials');
  }

  async validatePayloadAccessToken(payload: any): Promise<boolean> {
    console.log(payload['headers']['authorization']);
    const _token = payload['headers']['authorization'].split(' ')[1];
    const tokenFound = this.#tokens.find(
      (token) => token.accessToken === _token,
    );

    if (tokenFound) {
      const generatedTokenDecoded = await this.#decodeToken(
        tokenFound.accessToken,
      );

      const paylaodTokenDecoded = await this.#decodeToken(_token);

      return await this.#validateGeneratedToken({
        generetedTokenDecoded: generatedTokenDecoded,
        paylodTokenDecoded: paylaodTokenDecoded,
        expirationTime: tokenFound.accessTokenExpiration,
      });
    }

    return false;
  }

  async #validateGeneratedToken({
    generetedTokenDecoded,
    paylodTokenDecoded,
    expirationTime,
  }): Promise<boolean> {
    return (
      generetedTokenDecoded.audience === this.config.get('JWT_AUDIENCE') &&
      paylodTokenDecoded.audience === this.config.get('JWT_AUDIENCE') &&
      generetedTokenDecoded.issuer === this.config.get('JWT_ISSUER') &&
      paylodTokenDecoded.issuer === this.config.get('JWT_ISSUER') &&
      expirationTime > Date.now()
    );
  }

  async #decodeToken(token: string): Promise<IToken> {
    return this.jwtService.decode(token, {
      json: true,
    }) as IToken;
  }

  async #addTokens({ tokens, user, userAgent, ipAddress, platform }) {
    const accessTokenDecoded = await this.#decodeToken(tokens.accessToken);
    const refreshTokenDecoded = await this.#decodeToken(tokens.refreshToken);

    const timestampExpirationAccesstoken = ms(
      this.config.get('JWT_ACCESS_TOKEN_EXPIRATION'),
      accessTokenDecoded.iat,
    ) as number;

    const timestampExpirationRefreshtoken = ms(
      this.config.get('JWT_REFRESH_TOKEN_EXPIRATION'),
      refreshTokenDecoded.iat,
    ) as number;

    const accessTokenExpiration = Math.floor(
      accessTokenDecoded.exp + timestampExpirationAccesstoken,
    );

    const refreshTokenExpiration = Math.floor(
      refreshTokenDecoded.exp + timestampExpirationRefreshtoken,
    );

    this.#tokens.push({
      userId: user.id,
      accessToken: tokens.accessToken,
      accessTokenExpiration,
      refreshToken: tokens.refreshToken,
      refreshTokenExpiration,
      userAgent,
      ipAddress,
      platform,
    });
  }
}
