import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export {}

async function main() {
  const saltRounds = 10
  const defaultPassword = await bcrypt.hash('password123', saltRounds)

  // Create 3 default users
  const users = [
    {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      password: defaultPassword
    },
    {
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      password: defaultPassword
    },
    {
      name: 'Bob Johnson',
      username: 'bjohnson',
      email: 'bob@example.com',
      password: defaultPassword
    }
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    })
  }

  console.log('Database has been seeded with default users')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })