import { Public } from './../../application/common/decorators';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './../../infra/http/dtos/create-user.dto';
import {ApiExcludeController, ApiExcludeEndpoint} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthDto, RefreshTokenDto } from './dto';
import { LocalGuard } from './guards/local.guard';
import { Tokens } from './types';

// @ApiExcludeController()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  register(@Body() newUser: CreateUserDto): Promise<Tokens> {
    return this.authService.register(newUser);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  login(
    @Request() request,
    @Body() userCredentials: AuthDto,
    @Ip() ipAddress: string,
    // @Headers('origin') origin: string,
  ): Promise<Tokens | undefined> {
    // console.log(origin);
    return this.authService.login({
      userCredentials,
      ipAddress,
      userAgent: request.headers['user-agent'],
      platform: request.headers['platform'],
    });
  }

  @ApiExcludeEndpoint()
  @Post('login-local')
  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  loginLocal(@Request() request) {
    /* TODO document why this method 'loginLocal' is empty */
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Request() request) {
    return this.authService.logout(request);
  }

  @Post('refresh-token')
  @Public()
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @Request() request,
    @Body() refreshTokenDto: RefreshTokenDto,
    @Ip() ipAddress: string,
    @Headers('origin') origin: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens({
      refreshToken: refreshTokenDto.refreshToken,
      ipAddress,
      userAgent: request.headers['user-agent'],
      platform: request.headers['platform'],
    });
  }
}
