import { user } from '@prisma/client';
import { UsersRepository } from '../repositories/users-repository';
import { BaseService } from './base-service';

export type UserRequest = Omit<user, 'password' | 'comfirmed_at'>;

export abstract class UsersService extends BaseService<
  user,
  string,
  UsersRepository
> {
  abstract findByEmail(email: string): Promise<Partial<user> | null>;
}
