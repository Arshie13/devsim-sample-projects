import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data (respecting foreign keys)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.coupon.deleteMany();

  // Seed products
  await prisma.product.createMany({
    data: [
      { product_name: 'Espresso', price: 120, quantity: 50 },
      { product_name: 'Cappuccino', price: 150, quantity: 40 },
      { product_name: 'Caramel Macchiato', price: 180, quantity: 30 },
      { product_name: 'Blueberry Muffin', price: 95, quantity: 25 },
      { product_name: 'Chocolate Croissant', price: 110, quantity: 20 },
      { product_name: 'Iced Latte', price: 165, quantity: 0 },
    ],
  });
  console.log('✅ Products created');

  // Seed coupons
  await prisma.coupon.createMany({
    data: [
      { code: 'WELCOME10', discount_percent: 10, is_active: true },
      { code: 'SAVE20', discount_percent: 20, is_active: true },
      { code: 'HOLIDAY15', discount_percent: 15, is_active: false },
    ],
  });
  console.log('✅ Coupons created');

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
