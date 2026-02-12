# POS System - Developer Challenge Levels

Welcome to IPPO Software Solutions! You've been hired as a full-stack developer and assigned to maintain our POS System. Complete these challenges to level up your developer skills!

---

## 🎮 Level 1: Environment Setup & Minor Updates
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**

### Scenario
Your team lead has asked you to set up your local development environment and make some minor UI changes requested by the client.

### Tasks

#### Task 1.1: Environment Setup
1. Navigate to the project root directory
2. Install all dependencies: `npm install`
3. Set up the server environment (create `.env` file in `/server`)
4. Run database migrations
5. Start both client and server: `npm run dev`

#### Task 1.2: UI Changes
The client has requested the following changes:

1. **Login Button Text** - Change the login button text from "Sign In" to "Login"
   - File: `client/src/pages/auth/LoginPage.tsx`
   - Find the Button component and update the text

2. **Add Company Logo** - Add the IPPO logo text in the sidebar header
   - File: `client/src/components/layout/Sidebar.tsx`
   - Update the subtitle from "IPPO Solutions" to "IPPO Software Solutions"

### Success Criteria
- [ ] Application runs without errors
- [ ] Login page shows "Login" instead of "Sign In"
- [ ] Sidebar displays correct company name

---

## 🎮 Level 2: Refactoring & Bug Fixes
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1 hour**

### Scenario
A bug has been reported in the POS checkout system, and there's some code that needs refactoring.

### Tasks

#### Task 2.1: Bug Fix - "Add to Cart" Not Working for Low Stock Items
**Bug Report:** Users cannot add products to cart even when they still have stock available. Products with low stock (but not zero) should still be addable.

- File: `client/src/pages/pos/POSPage.tsx`
- Find the `handleAddToCart` function
- The bug is in the low stock check logic
- Fix: Items should only be blocked when `quantity === 0`, not when they're just low stock

**Current buggy code:**
```typescript
const isLowStock = product.inventory && product.inventory.quantity <= product.inventory.lowStock;
if (isLowStock) {
  return; // This incorrectly blocks all low stock items
}
```

**Expected behavior:**
- Products with 0 quantity: Cannot add to cart
- Products with low stock (e.g., 5 items when threshold is 10): CAN add to cart
- Products with normal stock: CAN add to cart

#### Task 2.2: Refactor - Improve Product Grid Rendering
The product grid in POS page has some redundant code. Refactor the `isLowStock` and `isOutOfStock` checks to be cleaner.

### Success Criteria
- [ ] Low stock items can be added to cart
- [ ] Out of stock items cannot be added
- [ ] Code is cleaner and more readable

---

## 🎮 Level 3: Feature Development
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2-3 hours**

### Scenario
The client wants additional reporting features. You need to implement new functionality.

### Tasks

#### Task 3.1: Implement Weekly Sales Report
Add a weekly view to the Reports page that shows:
- Sales comparison for the last 7 days
- Simple bar chart visualization
- Week-over-week change percentage

**Files to modify:**
- `client/src/pages/reports/ReportsPage.tsx`
- `client/src/services/orderService.ts`

#### Task 3.2: Add Export to CSV
Add a button to export the daily report to CSV format:
- Include date, order count, total sales, and top products
- Download automatically when clicked

#### Task 3.3 (Bonus): Add Product Category Filter to Dashboard
Add the ability to filter dashboard stats by product category.

### Success Criteria
- [ ] Weekly report displays 7-day data
- [ ] CSV export downloads correct data
- [ ] Bonus: Category filter works on dashboard

---

## 🎮 Level 4: Integration Bug Fix
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2-3 hours**

### Scenario
There's a critical integration issue between the frontend and backend. The checkout process sometimes fails silently.

### Tasks

#### Task 4.1: Debug Checkout Flow
The checkout process occasionally fails with no error message shown to users.

**Investigation hints:**
1. Check the order creation in `client/src/pages/pos/POSPage.tsx`
2. Verify the API call in `client/src/services/orderService.ts`
3. Check the backend route in `server/src/routes/orders.ts`
4. Look for potential race conditions or validation issues

**Common issues to look for:**
- Inventory race conditions (two cashiers checking out same product)
- Decimal precision issues between frontend and backend
- Missing error handling

#### Task 4.2: Implement Proper Error Handling
Add comprehensive error handling:
- Show specific error messages to users
- Handle network errors gracefully
- Add retry logic for failed operations

### Success Criteria
- [ ] Checkout errors are properly displayed
- [ ] Users can understand what went wrong
- [ ] System handles edge cases gracefully

---

## 🎮 Level 5: Client Issue Resolution
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3-4 hours**

### Scenario
A client has reported an issue with screenshots and vague descriptions. You need to investigate and fix it.

### Issue Report

**From:** Store Manager at ABC Retail
**Subject:** System showing wrong numbers!!

*"The daily report is showing different totals than what we see in the orders list. We had 15 orders today but the report only shows 12. Also sometimes when we apply a discount the final total looks wrong. Please fix ASAP!"*

**Attached Screenshots:**
(Imagine screenshots showing discrepancy between Reports page and Orders page)

### Tasks

#### Task 5.1: Investigate the Discrepancy
1. Compare order counts between Orders page and Reports page
2. Check date filtering logic on both pages
3. Verify timezone handling

#### Task 5.2: Debug Discount Calculation
1. Review discount application in POS page
2. Check how discounts are stored and retrieved
3. Verify calculation order (subtotal → tax → discount → total)

#### Task 5.3: Fix All Identified Issues
Document your findings and implement fixes.

### Success Criteria
- [ ] Order counts match across all views
- [ ] Discount calculations are correct
- [ ] All edge cases are handled
- [ ] Documentation of what was wrong and how you fixed it

---

## 📝 Submission Guidelines

For each level completed:

1. Create a branch named `level-X-solution` (e.g., `level-1-solution`)
2. Commit your changes with clear messages
3. Document any assumptions or decisions made
4. Submit a pull request with:
   - Summary of changes
   - Testing steps
   - Screenshots (if applicable)

## 🏆 Scoring

- Level 1: 10 points
- Level 2: 25 points  
- Level 3: 40 points
- Level 4: 60 points
- Level 5: 75 points
- **Bonus Points:** Clean code, extra features, documentation

Good luck, developer! 🚀
