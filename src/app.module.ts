import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './application/auth/auth.module';
import { AccessTokenGuard } from './application/auth/guards';
import { DatabaseModule } from './infra/database/database.module';
import { HttpModule } from './infra/http/http.module';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
