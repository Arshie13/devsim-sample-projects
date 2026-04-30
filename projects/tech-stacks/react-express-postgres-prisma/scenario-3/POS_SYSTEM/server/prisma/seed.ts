/// <reference types="node" />
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.storeSetting.deleteMany();

  console.log('🧹 Cleared existing data');

  const hashedPassword = await bcrypt.hash('password123', 10);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@ippo.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    }),
    prisma.user.create({
      data: {
        email: 'cashier@ippo.com',
        password: hashedPassword,
        name: 'Cashier User',
        role: 'CASHIER',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Appetizers' } }),
    prisma.category.create({ data: { name: 'Main Courses' } }),
    prisma.category.create({ data: { name: 'Beverages' } }),
    prisma.category.create({ data: { name: 'Desserts' } }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  const products = await Promise.all([
    prisma.product.create({
      data: { name: 'Spring Rolls', price: 5.99, sku: 'APP-001', categoryId: categories[0].id },
    }),
    prisma.product.create({
      data: { name: 'Garlic Bread', price: 3.99, sku: 'APP-002', categoryId: categories[0].id },
    }),
    prisma.product.create({
      data: { name: 'Grilled Salmon', price: 18.99, sku: 'MAIN-001', categoryId: categories[1].id },
    }),
    prisma.product.create({
      data: { name: 'Beef Steak', price: 24.99, sku: 'MAIN-002', categoryId: categories[1].id },
    }),
    prisma.product.create({
      data: { name: 'Chicken Pasta', price: 14.99, sku: 'MAIN-003', categoryId: categories[1].id },
    }),
    prisma.product.create({
      data: { name: 'Soft Drink', price: 2.49, sku: 'BEV-001', categoryId: categories[2].id },
    }),
    prisma.product.create({
      data: { name: 'Coffee', price: 3.99, sku: 'BEV-002', categoryId: categories[2].id },
    }),
    prisma.product.create({
      data: { name: 'Fresh Juice', price: 4.99, sku: 'BEV-003', categoryId: categories[2].id },
    }),
    prisma.product.create({
      data: { name: 'Chocolate Cake', price: 6.99, sku: 'DES-001', categoryId: categories[3].id },
    }),
    prisma.product.create({
      data: { name: 'Ice Cream', price: 4.99, sku: 'DES-002', categoryId: categories[3].id },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);

  const inventories = await Promise.all(
    products.map((p) =>
      prisma.inventory.create({
        data: { productId: p.id, quantity: Math.floor(Math.random() * 50) + 10, lowStock: 10 },
      })
    )
  );

  console.log(`✅ Created ${inventories.length} inventory records`);

  const promoCodes = await Promise.all([
    prisma.promoCode.create({
      data: { code: 'WELCOME10', discountPercent: 10, maxUses: 100, usedCount: 0, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    }),
    prisma.promoCode.create({
      data: { code: 'SAVE20', discountPercent: 20, maxUses: 50, usedCount: 5, expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
    }),
  ]);

  console.log(`✅ Created ${promoCodes.length} promo codes`);

  const storeSetting = await prisma.storeSetting.create({
    data: { name: 'IPPO Restaurant', address: '123 Main Street', taxRate: 8.5, cashEnabled: true, cardEnabled: true },
  });

  console.log(`✅ Created store settings`);

  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: users[1].id,
        subtotal: 29.97,
        tax: 2.55,
        discount: 0,
        total: 32.52,
        paymentMethod: 'CASH',
        status: 'COMPLETED',
        items: {
          create: [
            { productId: products[0].id, quantity: 2, price: 5.99 },
            { productId: products[5].id, quantity: 3, price: 2.49 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[1].id,
        subtotal: 43.97,
        tax: 3.74,
        discount: 4.4,
        total: 43.31,
        paymentMethod: 'CARD',
        status: 'COMPLETED',
        promoCodeId: promoCodes[0].id,
        items: {
          create: [
            { productId: products[2].id, quantity: 1, price: 18.99 },
            { productId: products[6].id, quantity: 2, price: 3.99 },
            { productId: products[8].id, quantity: 2, price: 6.99 },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[1].id,
        subtotal: 14.99,
        tax: 1.27,
        discount: 0,
        total: 16.26,
        paymentMethod: 'CARD',
        status: 'COMPLETED',
        items: {
          create: [{ productId: products[4].id, quantity: 1, price: 14.99 }],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${orders.length} orders`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });