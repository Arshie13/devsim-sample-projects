import { PrismaClient, UserRole, OrderStatus, PaymentMethod } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Seed Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@brewhaven.com',
      password: hashedPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  const customer = await prisma.user.create({
    data: {
      email: 'customer@brewhaven.com',
      password: hashedPassword,
      name: 'Customer User',
      role: UserRole.CUSTOMER,
    },
  });
  console.log('✅ Customer user created:', customer.email);

  // Seed Categories
  const coffeeBeans = await prisma.category.create({
    data: { name: 'Coffee Beans' },
  });
  const brewingEquipment = await prisma.category.create({
    data: { name: 'Brewing Equipment' },
  });
  const accessories = await prisma.category.create({
    data: { name: 'Accessories' },
  });
  const giftSets = await prisma.category.create({
    data: { name: 'Gift Sets' },
  });
  console.log('✅ Categories created');

  // Seed Products
  const products = [
    {
      name: 'Ethiopian Yirgacheffe',
      description: 'Bright, floral notes with hints of citrus and jasmine. Light roast.',
      price: 18.99,
      image: 'https://example.com/images/ethiopian-yirgacheffe.jpg',
      sku: 'COFFEE-ETH-250',
      weight: '250g',
      roastLevel: 'Light',
      stock: 45,
      categoryId: coffeeBeans.id,
    },
    {
      name: 'Colombian Supremo',
      description: 'Rich, balanced flavor with caramel sweetness. Medium roast.',
      price: 16.99,
      image: 'https://example.com/images/colombian-supremo.jpg',
      sku: 'COFFEE-COL-500',
      weight: '500g',
      roastLevel: 'Medium',
      stock: 60,
      categoryId: coffeeBeans.id,
    },
    {
      name: 'Sumatra Mandheling',
      description: 'Bold, earthy flavor with herbal notes. Dark roast.',
      price: 19.99,
      image: 'https://example.com/images/sumatra-mandheling.jpg',
      sku: 'COFFEE-SUM-250',
      weight: '250g',
      roastLevel: 'Dark',
      stock: 30,
      categoryId: coffeeBeans.id,
    },
    {
      name: 'Brazilian Santos',
      description: 'Smooth, nutty with chocolate undertones. Medium roast.',
      price: 15.99,
      image: 'https://example.com/images/brazilian-santos.jpg',
      sku: 'COFFEE-BRA-500',
      weight: '500g',
      roastLevel: 'Medium',
      stock: 50,
      categoryId: coffeeBeans.id,
    },
    {
      name: 'Pour-Over Coffee Kit',
      description: 'Complete pour-over setup with dripper, filters, and carafe.',
      price: 49.99,
      image: 'https://example.com/images/pour-over-kit.jpg',
      sku: 'EQUIP-POUR-001',
      weight: null,
      roastLevel: null,
      stock: 25,
      categoryId: brewingEquipment.id,
    },
    {
      name: 'French Press',
      description: 'Classic 34oz French press with stainless steel construction.',
      price: 39.99,
      image: 'https://example.com/images/french-press.jpg',
      sku: 'EQUIP-FRENCH-001',
      weight: null,
      roastLevel: null,
      stock: 35,
      categoryId: brewingEquipment.id,
    },
    {
      name: 'Ceramic Dripper',
      description: 'Hand-crafted ceramic V60 dripper for perfect extraction.',
      price: 29.99,
      image: 'https://example.com/images/ceramic-dripper.jpg',
      sku: 'EQUIP-DRIP-001',
      weight: null,
      roastLevel: null,
      stock: 40,
      categoryId: brewingEquipment.id,
    },
    {
      name: 'Insulated Travel Mug',
      description: 'Double-walled stainless steel mug keeps coffee hot for 6 hours.',
      price: 24.99,
      image: 'https://example.com/images/travel-mug.jpg',
      sku: 'ACC-MUG-001',
      weight: null,
      roastLevel: null,
      stock: 55,
      categoryId: accessories.id,
    },
    {
      name: 'Coffee Grinder',
      description: 'Burr grinder with 15 grind settings for consistent results.',
      price: 69.99,
      image: 'https://example.com/images/coffee-grinder.jpg',
      sku: 'ACC-GRIND-001',
      weight: null,
      roastLevel: null,
      stock: 20,
      categoryId: accessories.id,
    },
    {
      name: 'Coffee Lover Gift Box',
      description: 'Curated selection of 3 origin coffees with brewing guide.',
      price: 54.99,
      image: 'https://example.com/images/gift-box.jpg',
      sku: 'GIFT-BOX-001',
      weight: '750g total',
      roastLevel: null,
      stock: 15,
      categoryId: giftSets.id,
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }
  console.log('✅ Products created');

  // Seed Sample Orders
  const orderNumber1 = `ORD-${Date.now()}-001`;
  const product1 = await prisma.product.findFirst({ where: { sku: 'COFFEE-ETH-250' } });
  const product2 = await prisma.product.findFirst({ where: { sku: 'EQUIP-POUR-001' } });

  await prisma.order.create({
    data: {
      orderNumber: orderNumber1,
      userId: customer.id,
      subtotal: 68.98,
      tax: 5.52,
      discount: 0,
      total: 74.50,
      status: OrderStatus.DELIVERED,
      shippingAddress: '123 Coffee Street, Manila, Philippines',
      paymentMethod: PaymentMethod.CARD,
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            unitPrice: 18.99,
            subtotal: 18.99,
          },
          {
            productId: product2.id,
            quantity: 1,
            unitPrice: 49.99,
            subtotal: 49.99,
          },
        ],
      },
    },
  });

  const orderNumber2 = `ORD-${Date.now()}-002`;
  const product3 = await prisma.product.findFirst({ where: { sku: 'COFFEE-COL-500' } });
  const product4 = await prisma.product.findFirst({ where: { sku: 'ACC-MUG-001' } });

  await prisma.order.create({
    data: {
      orderNumber: orderNumber2,
      userId: customer.id,
      subtotal: 41.98,
      tax: 3.36,
      discount: 0,
      total: 45.34,
      status: OrderStatus.PROCESSING,
      shippingAddress: '123 Coffee Street, Manila, Philippines',
      paymentMethod: PaymentMethod.CASH,
      items: {
        create: [
          {
            productId: product3.id,
            quantity: 1,
            unitPrice: 16.99,
            subtotal: 16.99,
          },
          {
            productId: product4.id,
            quantity: 1,
            unitPrice: 24.99,
            subtotal: 24.99,
          },
        ],
      },
    },
  });

  console.log('✅ Sample orders created');
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
