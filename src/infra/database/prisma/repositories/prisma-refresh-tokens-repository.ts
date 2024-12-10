// import { PrismaRefreshTokenMapper } from './../mappers/prisma-refresh-token-mapper';
// import { PrismaUserMapper } from './../mappers/prisma-user-mapper';
// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '@infra/database/prisma/prisma.service';
// import { RefreshTokensRepository } from '@src/application/repositories/refresh-tokens-repository';
// import {
//   RefreshToken,
//   RefreshTokenProps,
// } from '@src/application/entities/refresh-token';

// @Injectable()
// export class PrismaRefreshTokensRepository implements RefreshTokensRepository {
//   constructor(private readonly prismaService: PrismaService) {}
//   private async getRefreshTokenUser(userId: string) {
//     const userFound = await this.prismaService.user.findUniqueOrThrow({
//       where: { id: userId },
//     });

//     return PrismaUserMapper.toDomain(userFound);
//   }
//   async findById(refreshTokenId: string): Promise<RefreshToken | null> {
//     const refreshToken = await this.prismaService.refreshToken.findUnique({
//       where: { id: refreshTokenId },
//     });

//     if (!refreshToken) {
//       return null;
//     }

//     const user = await this.getRefreshTokenUser(refreshToken.userId);

//     return PrismaRefreshTokenMapper.toDomain(refreshToken, user);
//   }

//   async save(refreshToken: RefreshToken): Promise<RefreshToken> {
//     const raw = PrismaRefreshTokenMapper.toPrisma(refreshToken);

//     const refreshTokenUpdated = await this.prismaService.refreshToken.update({
//       where: { id: raw.id },
//       data: raw,
//     });

//     const user = await this.getRefreshTokenUser(refreshToken.userId);

//     return PrismaRefreshTokenMapper.toDomain(refreshTokenUpdated, user);
//   }

//   async search(
//     search: Partial<RefreshTokenProps>,
//     take: number,
//   ): Promise<RefreshToken[]> {
//     throw new Error('Method not implemented.');
//   }

//   searchPagination(
//     search: Partial<RefreshToken>,
//     page: number,
//     limit: number,
//   ): Promise<RefreshToken[]> {
//     throw new Error('Method not implemented.');
//   }

//   async create(refreshToken: RefreshToken): Promise<RefreshToken> {
//     const raw = PrismaRefreshTokenMapper.toPrisma(refreshToken);
//     const refreshTokenCreated = await this.prismaService.refreshToken.create({
//       data: raw,
//     });

//     return PrismaRefreshTokenMapper.toDomain(
//       refreshTokenCreated,
//       refreshToken.user,
//     );
//   }
// }
