import { user as PrismaUser } from '@prisma/client';
import { User } from 'src/application/entities/user';

export class PrismaUserMapper {
  static toPrisma(user: User): PrismaUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      created_at: user.created_at,
      updated_at: user.updated_at,
      confirmed_at: user.confirmed_at,
      status: user.status,
      roles: user.roles,
    };
  }

  static toDomain(prismaUser: PrismaUser): User {
    return new User({
      uuid: prismaUser.id,
      name: prismaUser.name,
      email: prismaUser.email,
      password: prismaUser.password,
      confirmed_at: prismaUser.confirmed_at,
    });
  }
}
