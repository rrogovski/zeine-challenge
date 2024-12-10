import { user } from '@prisma/client';

import { BaseRepository } from './base-repository';

export abstract class UsersRepository extends BaseRepository<user, string> {
  abstract findByEmail(email: string): Promise<user | null>;
}
