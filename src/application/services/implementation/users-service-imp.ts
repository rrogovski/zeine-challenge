import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { user } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { UsersService } from '../users-service';
import { Crypt } from './../../helpers/crypt';
import { UsersRepository } from './../../repositories/users-repository';
import { BaseServiceImp } from './base-service-imp';

@Injectable()
export class UsersServiceImp
  extends BaseServiceImp<user, string, UsersRepository>
  implements UsersService
{
  constructor(repository: UsersRepository) {
    super(repository);
  }

  async create(entity: user): Promise<Partial<user>> {
    if (entity.password) {
      const passwordHashed = await new Crypt().hash(entity.password);
      entity.password = passwordHashed;
    }

    return await this.repository.create(entity).catch((error) => {
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException('Email already in use');
      }
      throw error;
    });
  }

  async findByEmail(email: string): Promise<Partial<user> | null> {
    return await this.repository.findByEmail(email);
  }
}
