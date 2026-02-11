/// <reference types="node" />
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.borrowRecord.deleteMany();
  await prisma.walkInBorrower.deleteMany();
  await prisma.member.deleteMany();
  await prisma.book.deleteMany();

  console.log('🧹 Cleared existing data');

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
    // Member borrow
    prisma.borrowRecord.create({
      data: {
        bookId: books[0]!.id,
        memberId: members[0]!.id,
        borrowerType: 'MEMBER',
        borrowedAt: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: 'BORROWED',
      },
    }),
    // Walk-in borrow
    prisma.borrowRecord.create({
      data: {
        bookId: books[1]!.id,
        walkInBorrowerId: walkInBorrowers[0]!.id,
        borrowerType: 'WALK_IN',
        borrowedAt: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'BORROWED',
      },
    }),
    // Returned record
    prisma.borrowRecord.create({
      data: {
        bookId: books[2]!.id,
        memberId: members[1]!.id,
        borrowerType: 'MEMBER',
        borrowedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        returnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        status: 'RETURNED',
      },
    }),
  ]);

  // Update book available copies
  await prisma.book.update({
    where: { id: books[0]!.id },
    data: { availableCopies: 4 },
  });
  await prisma.book.update({
    where: { id: books[1]!.id },
    data: { availableCopies: 2 },
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
