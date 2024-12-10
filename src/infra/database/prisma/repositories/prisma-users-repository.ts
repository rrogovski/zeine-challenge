import {Injectable} from '@nestjs/common';
import {user} from '@prisma/client';

import {UsersRepository} from '../../../../application/repositories/users-repository';
import {PrismaService} from '../prisma.service';
import {UserSearchRequest} from 'src/infra/http/dtos/user-search-request';
import {UserSearchPaginationRequest} from 'src/infra/http/dtos/user-search-pagination-request';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: string): Promise<Partial<user>[]> {
    return this.prismaService.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            email: {
              contains: query,
            },
          },
        ],
      },
      orderBy: [{name: 'asc'}],
    });
  }
  async findById(userId: string): Promise<user | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string): Promise<user | null> {
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });

    return user;
  }

  async save(user: user): Promise<user> {
    const userUpdated = await this.prismaService.user.update({
      where: { id: user.id },
      data: user,
    });

    return user;
  }

  async search(search: UserSearchRequest): Promise<Partial<user>[]> {
    const where = {};

    if (search.name) {
      where['name'] = { contains: search.name };
    }

    const users = await this.prismaService.user.findMany({
      take: search.limit,
      where,
      orderBy: [{ name: 'asc' }],
    });

    return users;
  }

  searchPagination(search: UserSearchPaginationRequest): Promise<user[]> {
    throw new Error('Method not implemented.');
  }

  async create(user: user): Promise<user> {
    const userCreated = await this.prismaService.user.create({
      data: user,
    });

    return userCreated;
  }
}
