# Key Takeaway

Database transactions in Express with Prisma are essential for maintaining data integrity when performing multiple related operations. Without transactions, if one operation fails partway through, you can end up with partial data—some changes applied, others not—leaving your PostgreSQL database in an inconsistent state. Prisma's `$transaction` API ensures all operations succeed together or all fail together.

**Why this is important:**

Transactions prevent partial updates that corrupt data, which is critical for financial and operational systems in your library application. Imagine you're processing a book return—you update the borrow record to "returned" and increment the book's available count. If the system crashes after the first update but before the second, you have inconsistent data: the borrow shows as returned but the book count is wrong. Prisma transactions prevent this by ensuring both operations happen or neither happens. Without transactions, every multi-step operation is a potential data disaster waiting to happen.

Prisma transactions handle concurrent requests safely by serializing operations, preventing race conditions. When multiple users are doing something at the same time through your Express API, transactions ensure they don't interfere with each other. Without transactions, two users might both try to borrow the last copy of a book at the exact same moment. With Prisma's interactive transactions, you can check availability, reserve the book, and create the borrow record in a single atomic operation—preventing overselling.

When any step fails, the entire operation rolls back automatically, making error handling much simpler in your Express routes. You don't need to manually undo changes—Prisma transactions do this for you. In a borrow operation that involves checking availability, creating a borrow record, and updating the book's status, if updating the status fails, all changes are automatically rolled back. This prevents the confusing situation of having records that don't match reality.

They maintain referential integrity across your PostgreSQL tables, ensuring your data makes sense. In a library system with Prisma, a borrow record should reference a valid member and book. Transactions ensure these relationships stay consistent. Without transactions, you might end up with borrow records pointing to books that were deleted, or members that no longer exist—creating "orphaned" data that causes problems throughout your React frontend and Express backend.

This concept applies to any database technology with Prisma. Whether using PostgreSQL, MySQL, or SQLite with Prisma, understanding transactions is crucial for building reliable systems that handle multiple operations safely.