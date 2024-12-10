import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './../../infra/database/prisma/prisma.service';
import { PrismaUsersRepository } from './../../infra/database/prisma/repositories/prisma-users-repository';

import { UsersRepository } from '../repositories/users-repository';
import { UsersServiceImp } from '../services/implementation/users-service-imp';
import { UsersService } from '../services/users-service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    LocalStrategy,
    {
      provide: UsersService,
      useClass: UsersServiceImp,
    },
    {
      provide: PrismaService,
      useClass: PrismaService,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
