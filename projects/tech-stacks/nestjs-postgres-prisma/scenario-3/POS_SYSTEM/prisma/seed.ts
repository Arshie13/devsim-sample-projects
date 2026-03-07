import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.setting.deleteMany();

  // Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@ippo.com',
      password: hashedPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  const cashier = await prisma.user.create({
    data: {
      email: 'cashier@ippo.com',
      password: hashedPassword,
      name: 'Cashier User',
      role: UserRole.CASHIER,
    },
  });
  console.log('✅ Cashier user created:', cashier.email);

  // Seed Categories
  const beverages = await prisma.category.create({
    data: { name: 'Beverages' },
  });
  const snacks = await prisma.category.create({
    data: { name: 'Snacks' },
  });
  const essentials = await prisma.category.create({
    data: { name: 'Essentials' },
  });
  console.log('✅ Categories created');

  // Seed Products with Inventory
  const products = [
    {
      name: 'Coca-Cola 330ml',
      description: 'Classic Coca-Cola can',
      price: 1.50,
      sku: 'BEV-001',
      categoryId: beverages.id,
      stock: 100,
    },
    {
      name: 'Mineral Water 500ml',
      description: 'Natural spring water',
      price: 0.99,
      sku: 'BEV-002',
      categoryId: beverages.id,
      stock: 150,
    },
    {
      name: 'Potato Chips',
      description: 'Salted potato chips 150g',
      price: 2.49,
      sku: 'SNK-001',
      categoryId: snacks.id,
      stock: 75,
    },
    {
      name: 'Chocolate Bar',
      description: 'Milk chocolate 100g',
      price: 1.99,
      sku: 'SNK-002',
      categoryId: snacks.id,
      stock: 60,
    },
    {
      name: 'Paper Towels',
      description: 'Pack of 2 rolls',
      price: 3.49,
      sku: 'ESS-001',
      categoryId: essentials.id,
      stock: 40,
    },
  ];

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        price: p.price,
        sku: p.sku,
        categoryId: p.categoryId,
      },
    });

    await prisma.inventory.create({
      data: {
        productId: product.id,
        quantity: p.stock,
        lowStock: 10,
      },
    });
  }
  console.log('✅ Products and inventory created');

  // Seed Settings
  await prisma.setting.create({
    data: {
      storeName: 'IPPO POS Store',
      storeAddress: '123 Main Street, Manila, Philippines',
      taxRate: 12.0,
      acceptCash: true,
      acceptCard: true,
    },
  });
  console.log('✅ Store settings created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
