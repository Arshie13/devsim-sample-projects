import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@urbanpottery.com' },
    update: {},
    create: {
      email: 'admin@urbanpottery.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create customer user
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'Jane Smith',
      role: 'CUSTOMER',
    },
  });
  console.log('✅ Customer user created:', customer.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Vases' },
      update: {},
      create: { name: 'Vases', description: 'Beautiful handcrafted vases' },
    }),
    prisma.category.upsert({
      where: { name: 'Bowls' },
      update: {},
      create: { name: 'Bowls', description: 'Artisan ceramic bowls' },
    }),
    prisma.category.upsert({
      where: { name: 'Plates' },
      update: {},
      create: { name: 'Plates', description: 'Elegant dinner plates' },
    }),
    prisma.category.upsert({
      where: { name: 'Mugs' },
      update: {},
      create: { name: 'Mugs', description: 'Handmade coffee mugs' },
    }),
    prisma.category.upsert({
      where: { name: 'Planters' },
      update: {},
      create: { name: 'Planters', description: 'Decorative plant pots' },
    }),
  ]);
  console.log('✅ Categories created:', categories.length);

  // Create products
  const products = [
    {
      name: 'Rustic Terracotta Vase',
      description: 'A beautifully handcrafted terracotta vase with a rustic finish. Perfect for dried flowers or as a standalone decorative piece.',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500',
      stock: 15,
      categoryId: categories[0].id,
    },
    {
      name: 'Midnight Blue Ceramic Bowl',
      description: 'Elegant deep blue ceramic bowl with a glossy glaze. Ideal for serving salads or as a fruit bowl.',
      price: 54.99,
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500',
      stock: 23,
      categoryId: categories[1].id,
    },
    {
      name: 'Speckled Stoneware Dinner Plate',
      description: 'Set of handmade speckled stoneware dinner plates. Each piece is unique with its own character.',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500',
      stock: 45,
      categoryId: categories[2].id,
    },
    {
      name: 'Artisan Coffee Mug',
      description: 'Cozy handmade coffee mug with a comfortable handle. Holds 12oz of your favorite beverage.',
      price: 28.99,
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
      stock: 67,
      categoryId: categories[3].id,
    },
    {
      name: 'Geometric Succulent Planter',
      description: 'Modern geometric planter perfect for succulents and small plants. Features drainage hole.',
      price: 42.99,
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
      stock: 31,
      categoryId: categories[4].id,
    },
    {
      name: 'Japanese Raku Vase',
      description: 'Traditional Raku-fired vase with unique crackling glaze pattern. Each piece is one-of-a-kind.',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=500',
      stock: 5,
      categoryId: categories[0].id,
    },
    {
      name: 'Minimalist White Serving Bowl',
      description: 'Clean and modern white ceramic serving bowl. Perfect for contemporary table settings.',
      price: 64.99,
      image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=500',
      stock: 19,
      categoryId: categories[1].id,
    },
    {
      name: 'Hand-Painted Floral Plate',
      description: 'Delicate hand-painted ceramic plate featuring botanical designs. Food safe glaze.',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1603199506016-5d0a23e29e7e?w=500',
      stock: 28,
      categoryId: categories[2].id,
    },
    {
      name: 'Oversized Latte Mug',
      description: 'Extra large ceramic mug for those who love big cups of coffee. Holds 16oz.',
      price: 32.99,
      image: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=500',
      stock: 0,
      categoryId: categories[3].id,
    },
    {
      name: 'Hanging Macrame Planter',
      description: 'Bohemian style hanging planter with handwoven macrame holder. Includes ceramic pot.',
      price: 56.99,
      image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500',
      stock: 3,
      categoryId: categories[4].id,
    },
    {
      name: 'Earthenware Pitcher',
      description: 'Rustic earthenware pitcher perfect for serving water, juice, or as a flower vase.',
      price: 74.99,
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500',
      stock: 12,
      categoryId: categories[0].id,
    },
    {
      name: 'Nesting Bowl Set',
      description: 'Set of 3 nesting ceramic bowls in graduated sizes. Great for food prep or serving.',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500',
      stock: 8,
      categoryId: categories[1].id,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log('✅ Products created:', products.length);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
