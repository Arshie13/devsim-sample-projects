import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create categories
  const foodCategory = await prisma.category.create({
    data: {
      name: 'Food',
    },
  })

  const transportCategory = await prisma.category.create({
    data: {
      name: 'Transport',
    },
  })

  const entertainmentCategory = await prisma.category.create({
    data: {
      name: 'Entertainment',
    },
  })

  const utilitiesCategory = await prisma.category.create({
    data: {
      name: 'Utilities',
    },
  })

  console.log('Created categories:', 4)

  // Create sample expenses
  await prisma.expense.create({
    data: {
      description: 'Lunch at cafe',
      amount: 15.50,
      date: new Date('2026-04-10'),
      categoryId: foodCategory.id,
    },
  })

  await prisma.expense.create({
    data: {
      description: 'Bus ticket',
      amount: 2.50,
      date: new Date('2026-04-09'),
      categoryId: transportCategory.id,
    },
  })

  await prisma.expense.create({
    data: {
      description: 'Movie tickets',
      amount: 25.00,
      date: new Date('2026-04-08'),
      categoryId: entertainmentCategory.id,
    },
  })

  await prisma.expense.create({
    data: {
      description: 'Electricity bill',
      amount: 120.00,
      date: new Date('2026-04-07'),
      categoryId: utilitiesCategory.id,
    },
  })

  await prisma.expense.create({
    data: {
      description: 'Dinner out',
      amount: 45.75,
      date: new Date('2026-04-06'),
      categoryId: foodCategory.id,
    },
  })

  console.log('Created expenses:', 5)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })