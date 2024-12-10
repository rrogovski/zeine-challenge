import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    if (process.env.NODE_ENV !== 'production') {
      super({
        log: [
          {
            emit: 'event',
            level: 'query',
          },
          {
            emit: 'stdout',
            level: 'error',
          },
          {
            emit: 'stdout',
            level: 'info',
          },
          {
            emit: 'stdout',
            level: 'warn',
          },
        ],
        errorFormat: 'pretty',
      });
    } else {
      super();
    }
  }

  async onModuleInit() {
    await this.$connect();
    if (process.env.NODE_ENV !== 'production') {
      /* eslint-disable */
      // @ts-ignore
      this.$on<any>('query', async (e: Prisma.QueryEvent) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        console.log('Query: ' + e.query);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        console.log('Params: ' + e.params);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        console.log('Duration: ' + e.duration + 'ms');
      });
    }
    this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      console.log('Disconnecting Prisma Client');
      await app.close();
    });
  }
}
