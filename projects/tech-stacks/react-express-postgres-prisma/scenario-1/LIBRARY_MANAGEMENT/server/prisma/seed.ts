/// <reference types="node" />
import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.borrowRecord.deleteMany();
  await prisma.walkInBorrower.deleteMany();
  await prisma.member.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleared existing data');

  // Seed Users (Librarian only)
  const hashedPassword = await bcrypt.hash('password123', 10);
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@bookwise.com',
        password: hashedPassword,
        name: 'Admin Librarian',
        role: 'LIBRARIAN',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Seed Books
  const books = await Promise.all([
    prisma.book.create({
      data: {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        description: 'A classic novel of modern American literature.',
        isbn: '978-0-06-112008-4',
        totalCopies: 5,
        availableCopies: 5,
      },
    }),
    prisma.book.create({
      data: {
        title: '1984',
        author: 'George Orwell',
        genre: 'Science Fiction',
        description: 'A dystopian social science fiction novel.',
        isbn: '978-0-452-28423-4',
        totalCopies: 3,
        availableCopies: 3,
      },
    }),
    prisma.book.create({
      data: {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        description: 'A novel about the American Dream in the 1920s.',
        isbn: '978-0-7432-7356-5',
        totalCopies: 4,
        availableCopies: 4,
      },
    }),
    prisma.book.create({
      data: {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        genre: 'Technology',
        description: 'A handbook of agile software craftsmanship.',
        isbn: '978-0-13-235088-4',
        totalCopies: 2,
        availableCopies: 2,
      },
    }),
    prisma.book.create({
      data: {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        genre: 'History',
        description: 'A brief history of humankind.',
        isbn: '978-0-06-231609-7',
        totalCopies: 3,
        availableCopies: 3,
      },
    }),
  ]);

  console.log(`✅ Created ${books.length} books`);

  // Seed Members
  const members = await Promise.all([
    prisma.member.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        idNumber: 'ID-001',
        idPhoto: null,
      },
    }),
    prisma.member.create({
      data: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567891',
        idNumber: 'ID-002',
        idPhoto: null,
      },
    }),
    prisma.member.create({
      data: {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        phone: '+1234567892',
        idNumber: 'ID-003',
        idPhoto: null,
      },
    }),
  ]);

  console.log(`✅ Created ${members.length} members`);

  // Seed Walk-in Borrowers
  const walkInBorrowers = await Promise.all([
    prisma.walkInBorrower.create({
      data: {
        name: 'Alice Williams',
        email: 'alice.williams@example.com',
        phone: '+1234567893',
        idNumber: 'ID-W001',
        idPhoto: null,
      },
    }),
    prisma.walkInBorrower.create({
      data: {
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        phone: '+1234567894',
        idNumber: 'ID-W002',
        idPhoto: null,
      },
    }),
  ]);

  console.log(`✅ Created ${walkInBorrowers.length} walk-in borrowers`);

  // Seed Borrow Records
  const borrowRecords = await Promise.all([
    // --- ORIGINAL RECORDS ---

    // [1] Active borrow — Member, due in 14 days
    prisma.borrowRecord.create({
      data: {
        bookId: books[0]!.id,
        memberId: members[0]!.id,
        borrowerType: 'MEMBER',
        borrowedAt: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'BORROWED',
      },
    }),

    // [2] Active borrow — Walk-in, due in 7 days
    prisma.borrowRecord.create({
      data: {
        bookId: books[1]!.id,
        walkInBorrowerId: walkInBorrowers[0]!.id,
        borrowerType: 'WALK_IN',
        borrowedAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'BORROWED',
      },
    }),

    // [3] Returned on time — Member (Jane), borrowed 20 days ago, returned 5 days ago
    prisma.borrowRecord.create({
      data: {
        bookId: books[2]!.id,
        memberId: members[1]!.id,
        borrowerType: 'MEMBER',
        borrowedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: 'RETURNED',
      },
    }),

    // --- NEW RECORDS ---

    // [4] Overdue — Member (Bob), borrowed 30 days ago, was due 16 days ago, not yet returned
    prisma.borrowRecord.create({
      data: {
        bookId: books[3]!.id,
        memberId: members[2]!.id,
        borrowerType: 'MEMBER',
        borrowedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        status: 'OVERDUE',
      },
    }),

    // [5] Overdue — Walk-in (Charlie), borrowed 25 days ago, was due 11 days ago, not yet returned
    prisma.borrowRecord.create({
      data: {
        bookId: books[4]!.id,
        walkInBorrowerId: walkInBorrowers[1]!.id,
        borrowerType: 'WALK_IN',
        borrowedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        status: 'OVERDUE',
      },
    }),

    // [6] Returned late — Member (John), borrowed 40 days ago, due 26 days ago, returned 20 days ago
    prisma.borrowRecord.create({
      data: {
        bookId: books[1]!.id,
        memberId: members[0]!.id,
        borrowerType: 'MEMBER',
        borrowedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        status: 'RETURNED',
      },
    }),

    // [7] Returned on time — Walk-in (Alice), borrowed 10 days ago, due in 4 days, returned yesterday
    prisma.borrowRecord.create({
      data: {
        bookId: books[2]!.id,
        walkInBorrowerId: walkInBorrowers[0]!.id,
        borrowerType: 'WALK_IN',
        borrowedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'RETURNED',
      },
    }),

    // [8] Active borrow — Member (Jane), borrowed 3 days ago, due in 11 days
    prisma.borrowRecord.create({
      data: {
        bookId: books[4]!.id,
        memberId: members[1]!.id,
        borrowerType: 'MEMBER',
        borrowedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
        status: 'BORROWED',
      },
    }),
  ]);

  // Update book available copies to reflect active/overdue borrows
  // books[0] — 1 active borrow (record 1)
  await prisma.book.update({
    where: { id: books[0]!.id },
    data: { availableCopies: 4 },
  });
  // books[1] — 1 active borrow (record 2); record 6 was returned
  await prisma.book.update({
    where: { id: books[1]!.id },
    data: { availableCopies: 2 },
  });
  // books[2] — records 3 and 7 both returned, no active borrows
  await prisma.book.update({
    where: { id: books[2]!.id },
    data: { availableCopies: 4 },
  });
  // books[3] — 1 overdue borrow (record 4)
  await prisma.book.update({
    where: { id: books[3]!.id },
    data: { availableCopies: 1 },
  });
  // books[4] — 1 overdue (record 5) + 1 active (record 8)
  await prisma.book.update({
    where: { id: books[4]!.id },
    data: { availableCopies: 1 },
  });

  console.log(`✅ Created ${borrowRecords.length} borrow records`);

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