import { Prisma, PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import times from 'lodash/times'

const prisma = new PrismaClient()

async function main() {
  const userCount = 30000

  console.log(`Creating ${userCount} users with a raw query....`)
  const users = times(userCount, n => ({ id: faker.datatype.uuid(), email: `${n}-${faker.internet.email()}` }))

  const values = users.map(u => Prisma.sql`(${u.id}::uuid, ${u.email})`)
  const query = Prisma.sql`
    insert into "User" (id, email)
    values ${Prisma.join(values)};
  `

  await prisma.$queryRaw(query)
  console.log('Done creating users.')
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
