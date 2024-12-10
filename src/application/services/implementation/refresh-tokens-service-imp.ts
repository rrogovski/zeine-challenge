import { BaseServiceImp } from './base-service-imp';
import { Injectable } from '@nestjs/common';
import { RefreshToken } from './../../entities/refresh-token';
import { RefreshTokensRepository } from './../../repositories/refresh-tokens-repository';
import { RefreshTokensService } from '../refresh-tokens-service';

@Injectable()
export class RefreshTokensServiceImp
  extends BaseServiceImp<RefreshToken, string, RefreshTokensRepository>
  implements RefreshTokensService
{
  constructor(repository: RefreshTokensRepository) {
    super(repository);
  }
}
