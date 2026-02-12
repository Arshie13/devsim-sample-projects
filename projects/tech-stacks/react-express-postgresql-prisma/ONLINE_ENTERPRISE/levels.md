# UrbanPottery - Developer Challenge Levels

Welcome to the UrbanPottery development team! You've been hired as a Junior Full Stack Developer at a software consultancy. Complete these challenges to level up your skills and deliver a polished e-commerce platform!

---

## 🎮 Level 1: Environment Setup & Branding
**Difficulty: ⭐ Easy**  
**Estimated Time: 30 minutes**  
**Points: 10**

### Scenario
Your team lead has onboarded you to the project. Your first task is to get the development environment running and make some quick branding updates requested by the client.

### Tasks

#### Task 1.1: Environment Setup
1. Navigate to the `client/` directory and run `npm install`.
2. Navigate to the `server/` directory and run `npm install`.
3. Create a `.env` file in the `server/` directory with database credentials.
4. Run Prisma migrations: `npm run db:migrate`.
5. Start both applications: `npm run dev` in each folder.

#### Task 1.2: Branding Updates
The client reviewed the homepage and requested changes:

1. **Hero Banner Text**  
   Change the main banner text from "Welcome to UrbanPottery" to "Handcrafted Ceramics for Modern Living".
   - *File:* `client/src/pages/Home.tsx`

2. **Footer Copyright Year**  
   The footer shows a hardcoded "2023". Update it to display the current year dynamically.
   - *File:* `client/src/components/layout/Footer.tsx`
   - *Hint:* Use `new Date().getFullYear()`

3. **Update Favicon**  
   Replace the default Vite favicon with the UrbanPottery logo.
   - *File:* `client/index.html`

### Success Criteria
- [ ] Both client and server run without errors.
- [ ] Homepage displays updated hero text.
- [ ] Footer shows the current year dynamically.
- [ ] Favicon is updated.

---

## 🎮 Level 2: Bug Fixes & Refactoring
**Difficulty: ⭐⭐ Medium**  
**Estimated Time: 1 hour**  
**Points: 25**

### Scenario
QA has reported some bugs and the tech lead wants you to refactor repetitive code before the next sprint.

### Tasks

#### Task 2.1: Fix "Infinite Cart" Bug
**Bug Report:** Users can add more items to the cart than are available in stock.

- *Behavior:* Product has 5 in stock, but user can add 10 to cart.
- *File:* `client/src/context/CartContext.tsx`
- *Fix:* In the `addToCart` function, check if the requested quantity exceeds available stock. If so, cap it at the max available.

**Expected Behavior:**
- User cannot add more items than available stock.
- Show a toast/alert when stock limit is reached.

#### Task 2.2: Refactor Price Formatting
Prices are formatted manually in multiple places using template literals like `` `$${price}` ``.

- *Task:* Create a utility function `formatCurrency(amount: number): string` in `client/src/utils/formatCurrency.ts`.
- *Implement in:* `ProductCard`, `CartDrawer`, `ProductDetails`, `OrderSummary`.

#### Task 2.3: Fix Missing Loading States
Several pages fetch data but don't show loading indicators.

- *Files:* `Shop.tsx`, `ProductDetails.tsx`, `admin/Orders.tsx`
- *Fix:* Add a loading spinner or skeleton while data is being fetched.

### Success Criteria
- [ ] Cart respects stock limits.
- [ ] Price formatting uses the shared utility function.
- [ ] Loading states are visible during data fetches.

---

## 🎮 Level 3: New Feature - Product Reviews
**Difficulty: ⭐⭐⭐ Hard**  
**Estimated Time: 2-3 hours**  
**Points: 40**

### Scenario
The client wants customers to be able to leave reviews on products to build trust and engagement.

### Tasks

#### Task 3.1: Backend - Database & API
1. **Update Prisma Schema**  
   Add a `Review` model:
   ```prisma
   model Review {
     id        String   @id @default(uuid())
     rating    Int      // 1-5
     comment   String
     userId    String
     user      User     @relation(fields: [userId], references: [id])
     productId String
     product   Product  @relation(fields: [productId], references: [id])
     createdAt DateTime @default(now())
   }
   ```

2. **Create API Endpoints** in `server/src/routes/reviews.ts`:
   - `GET /api/products/:productId/reviews` - Get all reviews for a product.
   - `POST /api/products/:productId/reviews` - Create a review (Auth required).

3. **Run migration:** `npm run db:migrate`

#### Task 3.2: Frontend - Reviews UI
1. **Reviews Section** on `ProductDetails.tsx`:
   - Display list of reviews with rating stars, comment, and user name.
   - Show average rating at the top.

2. **Review Form** (only for logged-in users):
   - Star rating selector (1-5).
   - Text area for comment.
   - Submit button.

3. **Service Layer:**
   - Add `getReviews(productId)` and `createReview(productId, data)` to `reviewService.ts`.

### Success Criteria
- [ ] Reviews are stored in the database.
- [ ] Product page displays existing reviews.
- [ ] Logged-in users can submit reviews.
- [ ] Average rating is calculated and displayed.

---

## 🎮 Level 4: Checkout Integration & Error Handling
**Difficulty: ⭐⭐⭐⭐ Expert**  
**Estimated Time: 2-3 hours**  
**Points: 60**

### Scenario
Users are reporting issues with the checkout process. Orders sometimes fail silently, and some users have accidentally placed duplicate orders.

### Tasks

#### Task 4.1: Debug Silent Order Failures
**Bug Report:** Clicking "Place Order" sometimes does nothing—no error, no confirmation.

- *Investigation Steps:*
  1. Check `client/src/pages/Checkout.tsx` for proper error handling.
  2. Verify `orderService.createOrder()` catches and surfaces errors.
  3. Check `server/src/routes/orders.ts` for validation issues.

- *Fix:*
  - Wrap API calls in try/catch blocks.
  - Display toast notifications with specific error messages.
  - Log errors to console for debugging.

#### Task 4.2: Prevent Double Submission
**Bug Report:** Users clicking "Place Order" multiple times create duplicate orders.

- *Fix:*
  - Disable the submit button immediately on click.
  - Show a loading spinner on the button.
  - Re-enable only after the request completes (success or failure).

- *File:* `client/src/pages/Checkout.tsx`

#### Task 4.3: Improve Validation Feedback
- Add client-side validation for the checkout form (address, phone, etc.).
- Display inline error messages for invalid fields.
- Use Zod for schema validation.

### Success Criteria
- [ ] All checkout errors display user-friendly messages.
- [ ] Double-click does not create duplicate orders.
- [ ] Form validation prevents submission of incomplete data.

---

## 🎮 Level 5: Concurrency & Data Integrity
**Difficulty: ⭐⭐⭐⭐⭐ Master**  
**Estimated Time: 3-4 hours**  
**Points: 75**

### Scenario: The "Phantom Inventory" Incident

**Support Ticket from Store Manager:**  
> "We had 1 'Sunset Bowl' left in stock. Two customers ordered it at the exact same time. Now inventory shows -1 and we have two angry customers expecting their bowl!"

### Tasks

#### Task 5.1: Reproduce the Race Condition
1. Open two browser windows on the same product page.
2. Add the last item to cart in both windows.
3. Complete checkout in both windows simultaneously.
4. Observe that both orders succeed (bug!).

#### Task 5.2: Fix the Race Condition
- *File:* `server/src/routes/orders.ts`
- *Solution:* Use Prisma's interactive transactions with row-level locking.

```typescript
// Example approach
await prisma.$transaction(async (tx) => {
  // 1. Lock and fetch current stock
  const product = await tx.product.findUnique({
    where: { id: productId },
  });
  
  // 2. Check stock availability
  if (product.stock < requestedQuantity) {
    throw new Error('Insufficient stock');
  }
  
  // 3. Decrement stock atomically
  await tx.product.update({
    where: { id: productId },
    data: { stock: { decrement: requestedQuantity } },
  });
  
  // 4. Create order item
  // ...
});
```

#### Task 5.3: Create Inventory Reconciliation Script
Create an admin endpoint or script that:
1. Finds all products with negative stock.
2. Identifies orders that caused the oversell.
3. Generates a report for manual review.

- *Endpoint:* `GET /api/admin/inventory/reconcile`

### Success Criteria
- [ ] Concurrent checkouts cannot oversell inventory.
- [ ] Proper error returned when stock is insufficient.
- [ ] Reconciliation endpoint identifies problematic orders.
- [ ] Documentation of the fix approach.

---

## 📝 Submission Guidelines

For each level completed:

1. **Create a branch:** `level-X-solution` (e.g., `level-1-solution`).
2. **Commit changes** with clear, descriptive messages.
3. **Document assumptions** in comments or a `NOTES.md` file.
4. **Submit a Pull Request** with:
   - Summary of changes.
   - Steps to test.
   - Screenshots (if UI changes).

---

## 🏆 Scoring Summary

| Level   | Points | Difficulty        |
| ------- | ------ | ----------------- |
| Level 1 | 10     | ⭐ Easy           |
| Level 2 | 25     | ⭐⭐ Medium       |
| Level 3 | 40     | ⭐⭐⭐ Hard       |
| Level 4 | 60     | ⭐⭐⭐⭐ Expert   |
| Level 5 | 75     | ⭐⭐⭐⭐⭐ Master |

**Bonus Points:** Clean code, extra features, comprehensive documentation, unit tests.

---

Good luck, developer! 🚀
