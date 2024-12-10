import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersService } from '../../application/services/users-service';
import { UsersServiceImp } from '../../application/services/implementation/users-service-imp';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [
    {
      provide: UsersService,
      useClass: UsersServiceImp,
    },
  ],
  exports: [UsersService],
})
export class HttpModule {}
