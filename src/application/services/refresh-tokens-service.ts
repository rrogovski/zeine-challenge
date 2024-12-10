import { RefreshToken, RefreshTokenProps } from '../entities/refresh-token';
import { RefreshTokensRepository } from '../repositories/refresh-tokens-repository';
import { BaseService } from './base-service';

export type RefreshTokenRequest = Partial<RefreshTokenProps>;

export abstract class RefreshTokensService extends BaseService<
  RefreshToken,
  string,
  RefreshTokensRepository
> {}
