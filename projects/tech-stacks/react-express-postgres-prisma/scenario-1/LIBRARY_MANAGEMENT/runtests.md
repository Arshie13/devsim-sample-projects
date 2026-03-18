# Library Management Tests

This folder contains the test suite for the Library Management System levels and tasks.

## Running Tests

Tests are organized by level and task, matching the structure in the `levels/` folder.

### Run All Tests Concurrently

```bash
# From the project root
npm test
# Or from this folder
npm run test:all
```

### Run Server and Client Tests Separately

```bash
# Server tests only
npm run test:server

# Client tests only
npm run test:client
```

### Run Client Task Tests

```bash
# From project root
npm run test:task:client:l1:t2
npm run test:task:client:l2:t2

# Run both mapped client tasks concurrently
npm run test:tasks:client
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

## Test Structure

- `client/` - Client-side tests and setup
- `client/level-1/task-2/` - Header branding tests
- `client/level-2/task-2/` - Helpers utility tests
- `server/` - Server-side tests and setup
- `server/level-2/task-1/` - Borrow availability logic tests
- `server/level-3/task-1/` - Overdue records API tests
- `server/level-4/task-2/` - Transaction safety tests
- `server/level-5/task-1/` - Overdue classification stability tests
- `server/level-5/task-2/` - Overdue fix tests

## Notes

- Tests use Vitest framework
- Both server (Express/Prisma) and client (React) tests run concurrently
- Hidden edge case tests are included in each test file
