import { RefreshToken } from '../entities/refresh-token';
import { BaseRepository } from './base-repository';

export abstract class RefreshTokensRepository extends BaseRepository<
  RefreshToken,
  string
> {}
