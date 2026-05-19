import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Wipe existing data, children before parents.
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Admin account — sign in with admin@novo.test / password123
  const passwordHash = await bcrypt.hash("password123", 10);
  await prisma.user.create({
    data: {
      email: "admin@novo.test",
      password: passwordHash,
      firstName: "Admin",
      lastName: "User",
      name: "Admin User",
    },
  });

  // Inventory
  const [espresso, latte, croissant, muffin] = await Promise.all([
    prisma.product.create({ data: { product_name: "Espresso", price: 3.5, quantity: 100 } }),
    prisma.product.create({ data: { product_name: "Latte", price: 4.75, quantity: 80 } }),
    prisma.product.create({ data: { product_name: "Croissant", price: 3.25, quantity: 40 } }),
    prisma.product.create({ data: { product_name: "Blueberry Muffin", price: 2.95, quantity: 25 } }),
  ]);

  // Coupons
  const welcome = await prisma.coupon.create({
    data: { code: "WELCOME10", discount_percent: 10 },
  });
  await prisma.coupon.create({
    data: { code: "SUMMER25", discount_percent: 25 },
  });
  await prisma.coupon.create({
    data: { code: "EXPIRED50", discount_percent: 50, is_active: false },
  });

  // One completed order using the WELCOME10 coupon
  const line1 = { product: espresso, qty: 2 };
  const line2 = { product: croissant, qty: 1 };
  const sub1 = line1.product.price * line1.qty;
  const sub2 = line2.product.price * line2.qty;
  const gross = sub1 + sub2;
  const discount = Number((gross * (welcome.discount_percent / 100)).toFixed(2));

  await prisma.order.create({
    data: {
      customer_name: "Jane Doe",
      total_amount: Number((gross - discount).toFixed(2)),
      discount_amount: discount,
      coupon_id: welcome.coupon_id,
      items: {
        create: [
          {
            product_id: line1.product.product_id,
            quantity: line1.qty,
            unit_price: line1.product.price,
            subtotal: sub1,
          },
          {
            product_id: line2.product.product_id,
            quantity: line2.qty,
            unit_price: line2.product.price,
            subtotal: sub2,
          },
        ],
      },
    },
  });

  console.log("Seed complete: 1 user, 4 products, 3 coupons, 1 order.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
