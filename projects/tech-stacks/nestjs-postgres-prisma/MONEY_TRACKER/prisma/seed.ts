import { PrismaClient, Role, AccountType, CategoryType, TransactionType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create users
  console.log('Creating users...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@FlexiSpend.com' },
    update: {},
    create: {
      email: 'admin@FlexiSpend.com',
      password: hashedPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@FlexiSpend.com' },
    update: {},
    create: {
      email: 'user@FlexiSpend.com',
      password: hashedPassword,
      name: 'Regular User',
      role: Role.USER,
    },
  });

  console.log(`✅ Created users: ${admin.email}, ${user.email}`);

  // Create default categories
  console.log('Creating default categories...');
  const incomeCategories = [
    { name: 'Salary', type: CategoryType.INCOME, icon: '💼' },
    { name: 'Freelance', type: CategoryType.INCOME, icon: '💻' },
    { name: 'Investment', type: CategoryType.INCOME, icon: '📈' },
    { name: 'Other Income', type: CategoryType.INCOME, icon: '💰' },
  ];

  const expenseCategories = [
    { name: 'Food', type: CategoryType.EXPENSE, icon: '🍔' },
    { name: 'Transport', type: CategoryType.EXPENSE, icon: '🚗' },
    { name: 'Utilities', type: CategoryType.EXPENSE, icon: '💡' },
    { name: 'Shopping', type: CategoryType.EXPENSE, icon: '🛍️' },
    { name: 'Entertainment', type: CategoryType.EXPENSE, icon: '🎬' },
    { name: 'Health', type: CategoryType.EXPENSE, icon: '🏥' },
    { name: 'Education', type: CategoryType.EXPENSE, icon: '📚' },
    { name: 'Other Expense', type: CategoryType.EXPENSE, icon: '📦' },
  ];

  const categories = [];

  for (const cat of [...incomeCategories, ...expenseCategories]) {
    const category = await prisma.category.upsert({
      where: { id: `default-${cat.name.toLowerCase().replace(/\s/g, '-')}` },
      update: {},
      create: {
        id: `default-${cat.name.toLowerCase().replace(/\s/g, '-')}`,
        name: cat.name,
        type: cat.type,
        icon: cat.icon,
        isDefault: true,
        userId: null,
      },
    });
    categories.push(category);
  }

  console.log(`✅ Created ${categories.length} default categories`);

  // Create accounts for regular user
  console.log('Creating accounts...');
  const cashAccount = await prisma.account.create({
    data: {
      name: 'Cash Wallet',
      type: AccountType.CASH,
      balance: 5000,
      userId: user.id,
    },
  });

  const bankAccount = await prisma.account.create({
    data: {
      name: 'BDO Savings',
      type: AccountType.BANK,
      balance: 25000,
      userId: user.id,
    },
  });

  const ewalletAccount = await prisma.account.create({
    data: {
      name: 'GCash',
      type: AccountType.E_WALLET,
      balance: 3500,
      userId: user.id,
    },
  });

  console.log(`✅ Created 3 accounts`);

  // Create sample transactions for the past 30 days
  console.log('Creating sample transactions...');
  const salaryCategory = categories.find((c) => c.name === 'Salary');
  const foodCategory = categories.find((c) => c.name === 'Food');
  const transportCategory = categories.find((c) => c.name === 'Transport');
  const utilitiesCategory = categories.find((c) => c.name === 'Utilities');
  const shoppingCategory = categories.find((c) => c.name === 'Shopping');
  const entertainmentCategory = categories.find((c) => c.name === 'Entertainment');

  const now = new Date();
  const transactions = [];

  // Salary income
  transactions.push({
    amount: 30000,
    type: TransactionType.INCOME,
    description: 'Monthly Salary',
    note: 'January 2026 salary',
    date: new Date(now.getFullYear(), now.getMonth(), 5),
    accountId: bankAccount.id,
    categoryId: salaryCategory!.id,
    userId: user.id,
  });

  // Food expenses
  for (let i = 0; i < 8; i++) {
    transactions.push({
      amount: Math.floor(Math.random() * 500) + 100,
      type: TransactionType.EXPENSE,
      description: `Grocery shopping ${i + 1}`,
      date: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      accountId: i % 2 === 0 ? cashAccount.id : ewalletAccount.id,
      categoryId: foodCategory!.id,
      userId: user.id,
    });
  }

  // Transport expenses
  for (let i = 0; i < 5; i++) {
    transactions.push({
      amount: Math.floor(Math.random() * 300) + 50,
      type: TransactionType.EXPENSE,
      description: 'Commute / Grab ride',
      date: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      accountId: ewalletAccount.id,
      categoryId: transportCategory!.id,
      userId: user.id,
    });
  }

  // Utilities
  transactions.push({
    amount: 2500,
    type: TransactionType.EXPENSE,
    description: 'Electricity bill',
    date: new Date(now.getFullYear(), now.getMonth(), 10),
    accountId: bankAccount.id,
    categoryId: utilitiesCategory!.id,
    userId: user.id,
  });

  // Shopping
  transactions.push({
    amount: 1500,
    type: TransactionType.EXPENSE,
    description: 'New shoes',
    note: 'Nike Air Max',
    date: new Date(now.getFullYear(), now.getMonth(), 15),
    accountId: bankAccount.id,
    categoryId: shoppingCategory!.id,
    userId: user.id,
  });

  // Entertainment
  transactions.push({
    amount: 800,
    type: TransactionType.EXPENSE,
    description: 'Movie night',
    date: new Date(now.getFullYear(), now.getMonth(), 20),
    accountId: cashAccount.id,
    categoryId: entertainmentCategory!.id,
    userId: user.id,
  });

  await prisma.transaction.createMany({ data: transactions });

  console.log(`✅ Created ${transactions.length} sample transactions`);

  // Create monthly budgets
  console.log('Creating budgets...');
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const budgets = [
    {
      amount: 8000,
      month: currentMonth,
      year: currentYear,
      categoryId: foodCategory!.id,
      userId: user.id,
    },
    {
      amount: 3000,
      month: currentMonth,
      year: currentYear,
      categoryId: transportCategory!.id,
      userId: user.id,
    },
    {
      amount: 2000,
      month: currentMonth,
      year: currentYear,
      categoryId: entertainmentCategory!.id,
      userId: user.id,
    },
  ];

  await prisma.budget.createMany({ data: budgets });

  console.log(`✅ Created ${budgets.length} budgets`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
