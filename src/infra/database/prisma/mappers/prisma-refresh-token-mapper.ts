// import { RefreshToken as PrismaRefreshToken } from '@prisma/client';
// import { RefreshToken } from '@application/entities/refresh-token';
// import { User } from '@src/application/entities/user';

// export class PrismaRefreshTokenMapper {
//   static toPrisma(refreshToken: RefreshToken) {
//     return {
//       id: refreshToken.id,
//       token: refreshToken.token,
//       isUsed: refreshToken.isUsed,
//       isRevoked: refreshToken.isRevoked,
//       createdAt: refreshToken.createdAt,
//       updatedAt: refreshToken.updatedAt,
//       userId: refreshToken.userId,
//     };
//   }

//   static toDomain(
//     prismaRefreshToken: PrismaRefreshToken,
//     user: User,
//   ): RefreshToken {
//     return new RefreshToken({
//       id: prismaRefreshToken.id,
//       token: prismaRefreshToken.token,
//       isUsed: prismaRefreshToken.isUsed,
//       isRevoked: prismaRefreshToken.isRevoked,
//       createdAt: prismaRefreshToken.createdAt,
//       updatedAt: prismaRefreshToken.updatedAt,
//       userId: prismaRefreshToken.userId,
//       user: user,
//     });
//   }
// }
