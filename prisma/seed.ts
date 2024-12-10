import {PrismaClient} from '@prisma/client'
import {randomUUID} from "crypto";
import {Crypt} from "../src/application/helpers/crypt";

const prisma = new PrismaClient()
async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mail.com' },
    update: {},
    create: {
      id: randomUUID(),
      email: 'admin@mail.com',
      name: 'Admin',
      password: await new Crypt().hash('admin'),
      status: 'ACTIVE',
      roles: ['ADMIN'],
    },
  })
  console.log({ admin })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
