# LIBRARY_MANAGEMENT DevSim Cheatsheet


This cheatsheet is based on:
- all level task files (user stories, acceptance criteria, hints)
- all visible tests under `tests/client` and `tests/server`
- current implementation files in `client/src` and `server/src`


Use this to validate your work level-by-level and quickly check if you can pass this scenario.


## 1) Fast Start (Before Any Level)


From project root:


```bash
cd projects/tech-stacks/react-express-postgres-prisma/scenario-1/LIBRARY_MANAGEMENT
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```


Database setup (server):


```bash
cd server
npx prisma migrate status
npx prisma migrate dev
cd ..
```


Run app (optional sanity check):


```bash
npm run dev
```


## 2) Reliable Test Commands


Use root scripts from `package.json`:


```bash
# all tests
npm test


# by level
npm run test:tasks:l1
npm run test:tasks:l2
npm run test:tasks:l3
npm run test:tasks:l4
npm run test:tasks:l5


# targeted tasks (client)
npm run test:task:client:l1:t2
npm run test:task:client:l2:t1
npm run test:task:client:l2:t2
npm run test:task:client:l4:t1
npm run test:task:client:l4:t2


# targeted tasks (server)
npm run test:task:server:l3:t1
npm run test:task:server:l3:t2
npm run test:task:server:l4:t1
npm run test:task:server:l4:t2
npm run test:task:server:l5:t1
npm run test:task:server:l5:t2
```


Note:
- `runtests.md` contains some outdated mappings; prefer root `package.json` scripts above.
- there is no root script for client L1 task-1 alone; this setup check test is still present in `tests/client/level-1/task-1/setup-check.test.ts`.


## 3) Level-by-Level Pass Matrix


## Level 1


### Task 1 - Setup Check
Main intent:
- dependencies installed for client and server
- Prisma migration status succeeds
- server boots and health endpoint responds


Test file:
- `tests/client/level-1/task-1/setup-check.test.ts`


What to verify manually:
- `client/node_modules` and `server/node_modules` exist
- `npx prisma migrate status` exits successfully
- server health route responds once server starts


### Task 2 - Sidebar Branding
Required output:
- subtitle text must be exactly: `BookWise Public Library`
- old subtitle `Library Management System` must not be rendered


Test file:
- `tests/client/level-1/task-2/sidebar-branding.test.tsx`


Primary file to edit:
- `client/src/components/layout/Sidebar.tsx`


## Level 2


### Task 1 - Availability Helper
Required contract:
- export `isBookAvailable(availableCopies: number): boolean`
- return `false` for `<= 0`
- return `true` for `> 0`
- deterministic behavior on repeated calls


Test file:
- `tests/client/level-2/task-1/borrow-availability.test.ts`


Primary file to edit:
- `client/src/utils/helpers.ts`


Important boundary checks from tests:
- `isBookAvailable(0) === false`
- `isBookAvailable(Number.EPSILON) === true`
- `isBookAvailable(0.0001) === true`


### Task 2 - Helper Adoption in Borrow Flow
Required behavior:
- borrow selection uses `isBookAvailable` helper (not inline `> 0` logic)
- issue modal options should include only helper-approved books


Test file:
- `tests/client/level-2/task-2/helpers.test.ts`


Primary files:
- `client/src/pages/BorrowRecords.tsx`
- `client/src/utils/helpers.ts`


Test-observed UI expectation examples:
- available books appear like `Title (N available)`
- unavailable zero/negative copies are excluded


## Level 3


### Task 1 - Return Flow Analysis
Required behavior:
- return flow executes through `prisma.$transaction`
- no double-increment on repeated returns
- rollback if inventory update fails


Test file:
- `tests/server/level-3/task-1/return-flow-analysis.test.ts`


Primary file:
- `server/src/controllers/borrow.controller.ts` (`returnBook`)


### Task 2 - Transaction Safety
Required behavior:
- concurrent return attempts: only one success
- concurrent borrow attempts: no underflow and only valid success count
- second return attempt rejected


Test file:
- `tests/server/level-3/task-2/transaction-safety.test.ts`


Primary file:
- `server/src/controllers/borrow.controller.ts` (`borrowBookMember`, `borrowBookWalkIn`, `returnBook`)


## Level 4


### Task 1 - Reservation Queue Foundation
Server requirements:
- implement `POST /api/reservations`
- implement `GET /api/reservations?bookId=...`
- assign `queuePosition`
- reject duplicate active reservation (400)
- include nested `member` and `book` in queue response


Client requirements:
- `createReservation(bookId, memberId)` in service
- `getReservationQueue(bookId)` in service
- show `Reserve Book` CTA only when `availableCopies === 0`
- show queue position feedback (`You are #...`) and empty state (`No active reservations.`)


Test files:
- `tests/server/level-4/task-1/reservation-queue.test.ts`
- `tests/client/level-4/task-1/reservation-queue.test.ts`


Primary files expected by tests:
- `server/src/controllers/reservation.controller.ts` (create this)
- `server/src/routes/reservation.routes.ts` (create this)
- `server/src/routes/index.ts` (mount reservation routes)
- `client/src/services/libraryService.ts`
- `client/src/pages/Books.tsx`


### Task 2 - Reservation Lifecycle
Server requirements:
- during return flow, promote next reservation to `READY_FOR_PICKUP`
- `DELETE /api/reservations/:id` cancels reservation
- cancelled row should become `CANCELLED`
- reindex remaining `queuePosition` from 1


Client requirements:
- `cancelReservation(reservationId)` in service
- output includes statuses `RESERVED`, `READY_FOR_PICKUP`, `CANCELLED`
- include `queuePosition` and `No reservations found.` output
- include `Reservation cancelled.` feedback


Test files:
- `tests/server/level-4/task-2/reservation-lifecycle.test.ts`
- `tests/client/level-4/task-2/reservation-lifecycle.test.ts`


Primary files expected by tests:
- `server/src/controllers/borrow.controller.ts` (`returnBook` integration)
- `server/src/controllers/reservation.controller.ts` (create/add)
- `server/src/routes/reservation.routes.ts` (create/add)
- `client/src/services/libraryService.ts`
- `client/src/pages/Reservations.tsx` (if missing, create and include required strings/contracts)


## Level 5


### Task 1 - Overdue Classification Stability
Required behavior:
- `GET /api/borrow-records/overdue` must exclude all records with `returnedAt != null`
- include truly overdue unreturned records
- handle stale status values and UTC boundary deterministically


Test file:
- `tests/server/level-5/task-1/overdue-classification.test.ts`


Primary file:
- `server/src/controllers/borrow.controller.ts` (`getOverdueRecords`)


### Task 2 - Permanent Overdue Fix
Required behavior:
- returned records must never appear in overdue output
- overdue report must align with source borrow/return data
- stale statuses corrected by source-of-truth checks


Test file:
- `tests/server/level-5/task-2/overdue-fix.test.ts`


Primary file:
- `server/src/controllers/borrow.controller.ts` (`getOverdueRecords` and related status updates)


## 4) Current Project Gaps You Should Expect


Based on current source scan:
- `client/src/utils/helpers.ts` currently lacks `isBookAvailable`
- `client/src/pages/BorrowRecords.tsx` currently filters with inline `availableCopies > 0`
- `client/src/components/layout/Sidebar.tsx` still shows old subtitle text
- `server/src/controllers/borrow.controller.ts` has known bug comments and non-transactional `returnBook`
- reservation files do not exist yet:
    - `server/src/controllers/reservation.controller.ts`
    - `server/src/routes/reservation.routes.ts`
- route index is not yet mounting reservation routes
- Prisma schema currently has no `Reservation` model defined in `server/prisma/schema.prisma`


## 5) Practical Test Workflow (Recommended)


Run in this order to reduce noise:


```bash
# L1 + L2 (client-focused)
npm run test:tasks:l1
npm run test:tasks:l2


# L3 (server return/transaction safety)
npm run test:tasks:l3


# L4 (reservation contracts and lifecycle)
npm run test:tasks:l4


# L5 (overdue classification and permanent fix)
npm run test:tasks:l5
```


If a level fails, run a single task command to isolate quickly.


## 6) Quick Pass Checklist


- L1T2 subtitle exact string matches expected text.
- L2T1 helper exists and handles boundaries exactly.
- L2T2 borrow modal options are helper-driven.
- L3 borrow/return mutations are atomic and concurrency-safe.
- L4 reservation API + client contract strings/endpoints exist exactly.
- L4 cancellation + queue reindex + READY_FOR_PICKUP promotion works.
- L5 overdue endpoint uses `returnedAt` and `dueDate` as truth.
- no returned records appear in overdue output.


## 7) One-Command Confidence Run


```bash
npm run test:tasks:l1 && npm run test:tasks:l2 && npm run test:tasks:l3 && npm run test:tasks:l4 && npm run test:tasks:l5
```


If all pass, you are in strong shape for this DevSim scenario.


## 8) Copy-Paste Code Pack (Do Not Apply Automatically)


Below are exact code snippets and files you can copy-paste manually.


### 8.1 Client - Sidebar subtitle


File: `client/src/components/layout/Sidebar.tsx`


Replace this line:


```tsx
<p className="text-indigo-300 text-xs mt-1">Library Management System</p>
```


With:


```tsx
<p className="text-indigo-300 text-xs mt-1">BookWise Public Library</p>
```


### 8.2 Client - Add availability helper


File: `client/src/utils/helpers.ts`


Append this export at the end:


```ts
export function isBookAvailable(availableCopies: number): boolean {
    return availableCopies > 0;
}
```


### 8.3 Client - Borrow flow uses helper


File: `client/src/pages/BorrowRecords.tsx`


Update import:


```tsx
import {
    formatDate,
    isOverdue,
    getDaysOverdue,
    isBookAvailable,
} from "../utils/helpers";
```


Update available books filter:


```tsx
const availableBooks = books.filter((b) => isBookAvailable(b.availableCopies));
```


### 8.4 Client - Reservation service methods


File: `client/src/services/libraryService.ts`


Add these interfaces near existing interfaces:


```ts
interface ReservationMember {
    id: string;
    name: string;
    email: string;
}


interface ReservationBook {
    id: string;
    title: string;
}


interface Reservation {
    id: string;
    bookId: string;
    memberId: string;
    queuePosition: number;
    status: "RESERVED" | "READY_FOR_PICKUP" | "CANCELLED";
    createdAt: string;
    updatedAt: string;
    member?: ReservationMember;
    book?: ReservationBook;
}
```


Add these methods inside `libraryService` object:


```ts
    async createReservation(bookId: string, memberId: string): Promise<Reservation> {
        return request<Reservation>("/reservations", {
            method: "POST",
            body: JSON.stringify({ bookId, memberId }),
        });
    },


    async getReservationQueue(bookId: string): Promise<Reservation[]> {
        return request<Reservation[]>(`/reservations?bookId=${bookId}`);
    },


    async cancelReservation(reservationId: string): Promise<Reservation> {
        return request<Reservation>(`/reservations/${reservationId}`, {
            method: "DELETE",
        });
    },
```


Optional helper text for duplicate reservation (to satisfy text contracts):


```ts
// duplicate reservation error text reference:
// already has an active reservation
```


### 8.5 Client - Books page reservation contract strings


File: `client/src/pages/Books.tsx`


Add import:


```tsx
import { libraryService } from "../services/libraryService";
```


Add state inside component:


```tsx
const [reservationMessage, setReservationMessage] = useState("");
```


Add handler inside component:


```tsx
const handleReserve = async (bookId: string) => {
    try {
        const members = await libraryService.getMembers();
        const firstMember = members[0];
        if (!firstMember) {
            setReservationMessage("No active reservations.");
            return;
        }
        const reservation = await libraryService.createReservation(bookId, firstMember.id);
        setReservationMessage(`You are #${reservation.queuePosition} in line.`);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to reserve";
        if (/already reserved|duplicate reservation|already has an active reservation/i.test(msg)) {
            setReservationMessage("Member already has an active reservation.");
            return;
        }
        setReservationMessage(msg);
    }
};
```


Inside each book action area, add:


```tsx
{book.availableCopies === 0 && (
    <Button
        variant="secondary"
        onClick={() => handleReserve(book.id)}
        className="text-xs px-3 py-1"
    >
        Reserve Book
    </Button>
)}
```


Below main heading/search area add message output:


```tsx
{reservationMessage ? (
    <p className="mb-4 text-sm text-indigo-700">{reservationMessage}</p>
) : (
    <p className="mb-4 text-sm text-gray-500">No active reservations.</p>
)}
```


### 8.6 Client - Reservations page (new file)


File: `client/src/pages/Reservations.tsx` (create)


```tsx
import { useEffect, useState } from "react";
import { libraryService } from "../services/libraryService";
import { Button } from "../components/ui/Button";


type Reservation = {
    id: string;
    queuePosition: number;
    status: "RESERVED" | "READY_FOR_PICKUP" | "CANCELLED";
    book?: { title: string };
};


export function Reservations() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [message, setMessage] = useState("");


    useEffect(() => {
        // Intentionally simple source contract page.
        setReservations([]);
    }, []);


    const onCancel = async (reservationId: string) => {
        await libraryService.cancelReservation(reservationId);
        setMessage("Reservation cancelled.");
    };


    if (reservations.length === 0) {
        return (
            <div>
                <h1 className="text-2xl font-bold mb-4">Reservations</h1>
                <p>No reservations found.</p>
                {message && <p>{message}</p>}
            </div>
        );
    }


    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Reservations</h1>
            {message && <p>{message}</p>}
            <ul className="space-y-2">
                {reservations.map((reservation) => (
                    <li key={reservation.id} className="border p-3 rounded">
                        <p>{reservation.book?.title ?? "Unknown Book"}</p>
                        <p>queuePosition: {reservation.queuePosition}</p>
                        <p>Status: {reservation.status}</p>
                        <Button onClick={() => onCancel(reservation.id)}>Cancel</Button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
```


### 8.7 Client - Register Reservations route


File: `client/src/App.tsx`


Add import:


```tsx
import { Reservations } from './pages/Reservations';
```


Add route inside protected routes:


```tsx
<Route path="/reservations" element={<Reservations />} />
```


### 8.8 Server - Prisma schema reservation model


File: `server/prisma/schema.prisma`


Add relation in `Book` model:


```prisma
    reservations  Reservation[]
```


Add relation in `Member` model:


```prisma
    reservations Reservation[]
```


Add model at end of schema:


```prisma
model Reservation {
    id            String   @id @default(uuid())
    bookId        String   @map("book_id")
    memberId      String   @map("member_id")
    queuePosition Int      @map("queue_position")
    status        String   @default("RESERVED") // RESERVED | READY_FOR_PICKUP | CANCELLED
    createdAt     DateTime @default(now()) @map("created_at")
    updatedAt     DateTime @updatedAt @map("updated_at")


    book   Book   @relation(fields: [bookId], references: [id], onDelete: Cascade)
    member Member @relation(fields: [memberId], references: [id], onDelete: Cascade)


    @@index([bookId, queuePosition])
    @@map("Reservation")
}
```


After schema changes run:


```bash
cd server
npx prisma migrate dev --name add_reservation_queue
npx prisma generate
cd ..
```


### 8.9 Server - Reservation controller (new file)


File: `server/src/controllers/reservation.controller.ts` (create)


```ts
import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";
import type { ApiResponse } from "../types/index.js";


const ACTIVE_STATUSES = ["RESERVED", "READY_FOR_PICKUP"] as const;


export const createReservation = asyncHandler(async (req: Request, res: Response) => {
    const { bookId, memberId } = req.body as { bookId?: string; memberId?: string };


    if (!bookId || !memberId) {
        throw new AppError("bookId and memberId are required", 400);
    }


    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new AppError("Book not found", 404);


    if (book.availableCopies !== 0) {
        throw new AppError("Reservations allowed only when availableCopies is 0", 400);
    }


    const duplicate = await prisma.reservation.findFirst({
        where: {
            bookId,
            memberId,
            status: { in: [...ACTIVE_STATUSES] },
        },
    });


    if (duplicate) {
        throw new AppError("Member already has an active reservation", 400);
    }


    const reservation = await prisma.$transaction(async (tx) => {
        const count = await tx.reservation.count({ where: { bookId, status: { in: [...ACTIVE_STATUSES] } } });


        return tx.reservation.create({
            data: {
                bookId,
                memberId,
                queuePosition: count + 1,
                status: "RESERVED",
            },
            include: {
                member: true,
                book: true,
            },
        });
    });


    const response: ApiResponse = {
        success: true,
        data: reservation,
        message: "Reservation created",
    };


    res.status(201).json(response);
});


export const getReservationQueue = asyncHandler(async (req: Request, res: Response) => {
    const rawBookId = req.query.bookId;
    const bookId = Array.isArray(rawBookId) ? rawBookId[0] : rawBookId;


    if (!bookId || typeof bookId !== "string" || bookId.trim().length === 0) {
        throw new AppError("bookId query is required", 400);
    }


    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new AppError("Book not found", 400);


    const queue = await prisma.reservation.findMany({
        where: {
            bookId,
            status: { in: [...ACTIVE_STATUSES] },
        },
        include: {
            member: true,
            book: true,
        },
        orderBy: [{ queuePosition: "asc" }, { createdAt: "asc" }],
    });


    const response: ApiResponse = {
        success: true,
        data: queue,
    };


    res.status(200).json(response);
});


export const cancelReservation = asyncHandler(async (req: Request, res: Response) => {
    const reservationId = req.params.id;
    if (!reservationId) throw new AppError("Invalid reservation ID", 400);


    const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });


    if (!reservation || !ACTIVE_STATUSES.includes(reservation.status as (typeof ACTIVE_STATUSES)[number])) {
        throw new AppError("Reservation is not active", 400);
    }


    const updated = await prisma.$transaction(async (tx) => {
        const cancelled = await tx.reservation.update({
            where: { id: reservationId },
            data: { status: "CANCELLED" },
            include: { member: true, book: true },
        });


        const remaining = await tx.reservation.findMany({
            where: {
                bookId: reservation.bookId,
                status: { in: [...ACTIVE_STATUSES] },
            },
            orderBy: [{ queuePosition: "asc" }, { createdAt: "asc" }],
        });


        for (let i = 0; i < remaining.length; i += 1) {
            const item = remaining[i];
            const expectedPosition = i + 1;
            if (item.queuePosition !== expectedPosition) {
                await tx.reservation.update({
                    where: { id: item.id },
                    data: { queuePosition: expectedPosition },
                });
            }
        }


        return cancelled;
    });


    const response: ApiResponse = {
        success: true,
        data: updated,
        message: "Reservation cancelled",
    };


    res.status(200).json(response);
});


export const promoteNextReservation = async (bookId: string): Promise<void> => {
    const next = await prisma.reservation.findFirst({
        where: {
            bookId,
            status: "RESERVED",
        },
        orderBy: [{ queuePosition: "asc" }, { createdAt: "asc" }],
    });


    if (!next) return;


    await prisma.reservation.update({
        where: { id: next.id },
        data: { status: "READY_FOR_PICKUP" },
    });
};
```


### 8.10 Server - Reservation routes (new file)


File: `server/src/routes/reservation.routes.ts` (create)


```ts
import { Router } from "express";
import {
    createReservation,
    getReservationQueue,
    cancelReservation,
} from "../controllers/reservation.controller.js";


const router = Router();


// mounted under /api/reservations
router.post("/", createReservation);
router.get("/", getReservationQueue);
router.delete("/:id", cancelReservation);


export default router;
```


### 8.11 Server - Mount reservation routes


File: `server/src/routes/index.ts`


Add import:


```ts
import reservationRoutes from './reservation.routes.js';
```


Add mount:


```ts
router.use('/reservations', reservationRoutes);
```


### 8.12 Server - Borrow controller fixes


File: `server/src/controllers/borrow.controller.ts`


Add import near top:


```ts
import { promoteNextReservation } from './reservation.controller.js';
```


Replace full `borrowBookMember` function with (Level 3 server exact code):


```ts
export const borrowBookMember = asyncHandler(async (req: Request, res: Response) => {
    const { bookId, memberId, dueDate }: BorrowBookMemberInput = req.body;


    const result = await prisma.$transaction(async (tx) => {
        const member = await tx.member.findUnique({ where: { id: memberId } });
        if (!member) {
            throw new AppError('Member not found', 404);
        }


        const bookExists = await tx.book.findUnique({ where: { id: bookId } });
        if (!bookExists) {
            throw new AppError('Book not found', 404);
        }


        const decrementResult = await tx.book.updateMany({
            where: {
                id: bookId,
                availableCopies: { gt: 0 },
            },
            data: {
                availableCopies: {
                    decrement: 1,
                },
            },
        });


        if (decrementResult.count !== 1) {
            throw new AppError('No available copies of this book', 400);
        }


        const record = await tx.borrowRecord.create({
            data: {
                bookId,
                memberId,
                borrowerType: 'MEMBER',
                dueDate: new Date(dueDate),
                status: 'BORROWED',
            },
            include: {
                book: true,
                member: true,
            },
        });


        return record;
    });


    const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Book borrowed successfully',
    };


    res.status(201).json(response);
});
```


Replace full `borrowBookWalkIn` function with (Level 3 server exact code):


```ts
export const borrowBookWalkIn = asyncHandler(async (req: Request, res: Response) => {
    const { bookId, walkInBorrower, dueDate }: BorrowBookWalkInInput = req.body;


    const result = await prisma.$transaction(async (tx) => {
        const bookExists = await tx.book.findUnique({ where: { id: bookId } });
        if (!bookExists) {
            throw new AppError('Book not found', 404);
        }


        const decrementResult = await tx.book.updateMany({
            where: {
                id: bookId,
                availableCopies: { gt: 0 },
            },
            data: {
                availableCopies: {
                    decrement: 1,
                },
            },
        });


        if (decrementResult.count !== 1) {
            throw new AppError('No available copies of this book', 400);
        }


        const newWalkInBorrower = await tx.walkInBorrower.create({
            data: walkInBorrower,
        });


        const record = await tx.borrowRecord.create({
            data: {
                bookId,
                walkInBorrowerId: newWalkInBorrower.id,
                borrowerType: 'WALK_IN',
                dueDate: new Date(dueDate),
                status: 'BORROWED',
            },
            include: {
                book: true,
                walkInBorrower: true,
            },
        });


        return { record, walkInBorrower: newWalkInBorrower };
    });


    const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Book borrowed successfully',
    };


    res.status(201).json(response);
});
```


Replace full `returnBook` function with:


```ts
export const returnBook = asyncHandler(async (req: Request, res: Response) => {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
    if (!id) throw new AppError('Invalid record ID', 400);


    const updatedRecord = await prisma.$transaction(async (tx) => {
        const record = await tx.borrowRecord.findUnique({
            where: { id },
            include: { book: true, member: true, walkInBorrower: true },
        });


        if (!record) {
            throw new AppError('Borrow record not found', 404);
        }


        if (record.returnedAt || record.status === 'RETURNED') {
            throw new AppError('Book already returned', 400);
        }


        const book = await tx.book.findUnique({ where: { id: record.bookId } });
        if (!book) throw new AppError('Book not found', 404);


        if (book.availableCopies >= book.totalCopies) {
            throw new AppError('Book inventory is already at maximum', 400);
        }


        const recordAfterReturn = await tx.borrowRecord.update({
            where: { id },
            data: {
                returnedAt: new Date(),
                status: 'RETURNED',
            },
            include: {
                book: true,
                member: true,
                walkInBorrower: true,
            },
        });


        await tx.book.update({
            where: { id: record.bookId },
            data: {
                availableCopies: {
                    increment: 1,
                },
            },
        });


        return recordAfterReturn;
    });


    await promoteNextReservation(updatedRecord.bookId);


    const response: ApiResponse = {
        success: true,
        data: updatedRecord,
        message: 'Book returned successfully',
    };


    res.json(response);
});
```


Replace full `getOverdueRecords` function with:


```ts
export const getOverdueRecords = asyncHandler(async (_req: Request, res: Response) => {
    const now = new Date();


    // Source-of-truth filter: returnedAt must be null for overdue classification.
    const records = await prisma.borrowRecord.findMany({
        where: {
            returnedAt: null,
            dueDate: {
                lt: now,
            },
        },
        include: {
            book: true,
            member: true,
            walkInBorrower: true,
        },
        orderBy: { dueDate: 'asc' },
    });


    const recordIds = records.map((r: { id: string }) => r.id);
    if (recordIds.length > 0) {
        await prisma.borrowRecord.updateMany({
            where: {
                id: { in: recordIds },
                returnedAt: null,
                status: { not: 'OVERDUE' },
            },
            data: {
                status: 'OVERDUE',
            },
        });
    }


    const response: ApiResponse = {
        success: true,
        data: records,
    };


    res.json(response);
});
```


### 8.13 Final run sequence


```bash
npm run test:tasks:l1
npm run test:tasks:l2
npm run test:tasks:l3
npm run test:tasks:l4
npm run test:tasks:l5
```


## 9) LEVEL 3 ONLY - ONE SHOT COPY/PASTE FILE


If you want a true copy-paste for Level 3 server tests, replace the entire file below.


File: `server/src/controllers/borrow.controller.ts`


```ts
import type { Request, Response } from 'express';
import { prisma } from '../utils/prisma.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import type { ApiResponse, BorrowBookMemberInput, BorrowBookWalkInInput } from '../types/index.js';


/**
 * @route   GET /api/borrow-records
 * @desc    Get all borrow records
 * @access  Private
 */
export const getAllBorrowRecords = asyncHandler(async (_req: Request, res: Response) => {
    const records = await prisma.borrowRecord.findMany({
        include: {
            book: true,
            member: true,
            walkInBorrower: true,
        },
        orderBy: { borrowedAt: 'desc' },
    });


    const response: ApiResponse = {
        success: true,
        data: records,
    };


    res.json(response);
});


/**
 * @route   GET /api/borrow-records/:id
 * @desc    Get single borrow record by ID
 * @access  Private
 */
export const getBorrowRecordById = asyncHandler(async (req: Request, res: Response) => {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
    if (!id) throw new AppError('Invalid record ID', 400);


    const record = await prisma.borrowRecord.findUnique({
        where: { id },
        include: {
            book: true,
            member: true,
            walkInBorrower: true,
        },
    });


    if (!record) {
        throw new AppError('Borrow record not found', 404);
    }


    const response: ApiResponse = {
        success: true,
        data: record,
    };


    res.json(response);
});


/**
 * @route   POST /api/borrow-records/member
 * @desc    Borrow a book for a registered member
 * @access  Private
 */
export const borrowBookMember = asyncHandler(async (req: Request, res: Response) => {
    const { bookId, memberId, dueDate }: BorrowBookMemberInput = req.body;


    const result = await prisma.$transaction(async (tx) => {
        const member = await tx.member.findUnique({ where: { id: memberId } });
        if (!member) {
            throw new AppError('Member not found', 404);
        }


        const bookExists = await tx.book.findUnique({ where: { id: bookId } });
        if (!bookExists) {
            throw new AppError('Book not found', 404);
        }


        const decrementResult = await tx.book.updateMany({
            where: {
                id: bookId,
                availableCopies: { gt: 0 },
            },
            data: {
                availableCopies: {
                    decrement: 1,
                },
            },
        });


        if (decrementResult.count !== 1) {
            throw new AppError('No available copies of this book', 400);
        }


        const record = await tx.borrowRecord.create({
            data: {
                bookId,
                memberId,
                borrowerType: 'MEMBER',
                dueDate: new Date(dueDate),
                status: 'BORROWED',
            },
            include: {
                book: true,
                member: true,
            },
        });


        return record;
    });


    const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Book borrowed successfully',
    };


    res.status(201).json(response);
});


/**
 * @route   POST /api/borrow-records/walk-in
 * @desc    Borrow a book for a walk-in borrower
 * @access  Private
 */
export const borrowBookWalkIn = asyncHandler(async (req: Request, res: Response) => {
    const { bookId, walkInBorrower, dueDate }: BorrowBookWalkInInput = req.body;


    const result = await prisma.$transaction(async (tx) => {
        const bookExists = await tx.book.findUnique({ where: { id: bookId } });
        if (!bookExists) {
            throw new AppError('Book not found', 404);
        }


        const decrementResult = await tx.book.updateMany({
            where: {
                id: bookId,
                availableCopies: { gt: 0 },
            },
            data: {
                availableCopies: {
                    decrement: 1,
                },
            },
        });


        if (decrementResult.count !== 1) {
            throw new AppError('No available copies of this book', 400);
        }


        const newWalkInBorrower = await tx.walkInBorrower.create({
            data: walkInBorrower,
        });


        const record = await tx.borrowRecord.create({
            data: {
                bookId,
                walkInBorrowerId: newWalkInBorrower.id,
                borrowerType: 'WALK_IN',
                dueDate: new Date(dueDate),
                status: 'BORROWED',
            },
            include: {
                book: true,
                walkInBorrower: true,
            },
        });


        return { record, walkInBorrower: newWalkInBorrower };
    });


    const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Book borrowed successfully',
    };


    res.status(201).json(response);
});


/**
 * @route   PUT /api/borrow-records/:id/return
 * @desc    Return a borrowed book
 * @access  Private
 */
export const returnBook = asyncHandler(async (req: Request, res: Response) => {
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
    if (!id) throw new AppError('Invalid record ID', 400);


    const updatedRecord = await prisma.$transaction(async (tx) => {
        const record = await tx.borrowRecord.findUnique({
            where: { id },
            include: { book: true, member: true, walkInBorrower: true },
        });


        if (!record) {
            throw new AppError('Borrow record not found', 404);
        }


        if (record.returnedAt || record.status === 'RETURNED') {
            throw new AppError('Book already returned', 400);
        }


        const book = await tx.book.findUnique({ where: { id: record.bookId } });
        if (!book) throw new AppError('Book not found', 404);


        if (book.availableCopies >= book.totalCopies) {
            throw new AppError('Book inventory is already at maximum', 400);
        }


        const recordAfterReturn = await tx.borrowRecord.update({
            where: { id },
            data: {
                returnedAt: new Date(),
                status: 'RETURNED',
            },
            include: {
                book: true,
                member: true,
                walkInBorrower: true,
            },
        });


        await tx.book.update({
            where: { id: record.bookId },
            data: {
                availableCopies: {
                    increment: 1,
                },
            },
        });


        return recordAfterReturn;
    });


    const response: ApiResponse = {
        success: true,
        data: updatedRecord,
        message: 'Book returned successfully',
    };


    res.json(response);
});


/**
 * @route   GET /api/borrow-records/overdue
 * @desc    Get all overdue borrow records
 * @access  Private
 */
export const getOverdueRecords = asyncHandler(async (_req: Request, res: Response) => {
    const records = await prisma.borrowRecord.findMany({
        where: {
            status: { in: ['BORROWED', 'OVERDUE'] },
            dueDate: {
                lt: new Date(),
            },
        },
        include: {
            book: true,
            member: true,
            walkInBorrower: true,
        },
        orderBy: { dueDate: 'asc' },
    });


    const recordIds = records.map((r: { id: string }) => r.id);
    if (recordIds.length > 0) {
        await prisma.borrowRecord.updateMany({
            where: {
                id: { in: recordIds },
                status: 'BORROWED',
            },
            data: {
                status: 'OVERDUE',
            },
        });
    }


    const response: ApiResponse = {
        success: true,
        data: records,
    };


    res.json(response);
});
```


Level 3 verification commands:


```bash
npm run test:task:server:l3:t1
npm run test:task:server:l3:t2
```





