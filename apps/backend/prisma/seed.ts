import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const roles = [
    { name: 'admin' },
    { name: 'user' },
  ]

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    })
  }

  const addressTypes = [
    { name: 'home' },
    { name: 'location' },
    { name: 'billing' },
    { name: 'shipping' }
  ]

  for (const type of addressTypes) {
    await prisma.addressType.upsert({
      where: { name: type.name },
      update: {},
      create: type
    })
  }

  console.log('✅ Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })