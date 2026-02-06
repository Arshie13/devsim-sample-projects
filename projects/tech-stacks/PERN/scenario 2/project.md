# Single-Merchant Enterprise E-Commerce Starter (PERN Stack)

**Prompt for AI / Developer:**

"Act as a Junior Full Stack Developer at a leading software consultancy. Your task is to scaffold a complete, production-ready starter project for a new client: **'UrbanPottery'**, a local artisanal ceramics company expanding to online direct-to-consumer sales.

**Project Scope:**
Build a robust, scalable enterprise e-commerce web application using the **PERN Stack (PostgreSQL, Express, React, Node.js)** with **TypeScript** throughout. The app operates as a single-merchant store (not a marketplace).

**Tech Stack Specifications:**
- **Database:** PostgreSQL (using Prisma ORM for schema and migrations).
- **Backend:** Node.js with Express, written in TypeScript.
- **Frontend:** React 18 using Vite, TypeScript, and Tailwind CSS for styling.
- **State Management:** React Context API or Zustand.
- **Validation:** Zod for both client and server schema validation.

**Required Workspace Structure & Features:**
Please generate the folders and code for the following 'monorepo-style' structure:

1.  **`server/` directory:**
    -   Setup `package.json` with scripts for `dev`, `build`, and `prisma`.
    -   Configure `tsconfig.json` for backend.
    -   **Prisma Schema (`schema.prisma`):** Models for `User` (Role: ADMIN/CUSTOMER), `Product` (with stock/inventory tracking), `Order`, and `OrderItem`.
    -   **API Routes:**
        -   `Auth` (Register/Login with JWT).
        -   `Products` (Public GET, Admin POST/PUT/DELETE).
        -   `Orders` (Customer create, Admin view).
    -   **Middleware:** Authentication (verify JWT) and Error Handling.

2.  **`client/` directory:**
    -   Setup Vite + React + TypeScript environment.
    -   Configure Tailwind CSS.
    -   **project structure:** `components` (UI kit), `pages` (Public: Home, Shop, ProductDetails, Cart; Private/Admin: Dashboard, Inventory), `context` (Auth, Cart), `hooks`.
    -   **Key Components:** Navigation Bar (responsive), ProductCard, CartDrawer.

3.  **Core Functionality to Implement:**
    -   **Public Facing:** Landing page displaying featured items. Product grid with category filtering.
    -   **Customer Experience:** Add to cart functionality, basic checkout form (simulate payment), data persistence for cart.
    -   **Admin Panel:** Protected route. Simple table to view orders and button to add/edit products.

**Deliverables:**
Provide the full file structure, configuration files (pacakge.json, tsconfig, etc.), and the source code for the critical files mentioned above. Ensure the code follows best practices for an enterprise environment (clean architecture, proper typing, error handling)."

---

## 🎮 UrbanPottery - Developer Challenge Levels

Welcome to the UrbanPottery development team! Complete these challenges to improve the platform.

### 🎮 Level 1: Environment Setup & Branding
**Difficulty: ⭐ Easy**
**Estimated Time: 30 minutes**

#### Task 1.1: Environment Setup
1.  Install dependencies for server and client.
2.  Setup PostgreSQL database and run Prisma migrations.
3.  Start the development environment.

#### Task 1.2: Branding Updates
The client wants to update their brand messaging before launch.
1.  **Hero Text:** Change the main banner text on the homepage from "Welcome to UrbanPottery" to "Handcrafted Ceramics for Modern Living".
    -   *Location:* `client/src/pages/Home.tsx`
2.  **Footer Year:** The footer copyright year is hardcoded to "2023". Update it to dynamically show the current year.
    -   *Location:* `client/src/components/layout/Footer.tsx`

### 🎮 Level 2: Logic Fixes & Refactoring
**Difficulty: ⭐⭐ Medium**
**Estimated Time: 1 hour**

#### Task 2.1: Fix "Infinite Cart" Bug
Users can currently add more items to the cart than are available in stock.
-   *Behavior:* If a product has 5 items in stock, a user can add 10 to their cart.
-   *Fix:* Enforce stock limits in the `addToCart` function in `CartContext`.

#### Task 2.2: Refactor Product Price formatting
Prices are manually formatted like ``$${price}`` in multiple components.
-   *Task:* Create a reusable `formatCurrency(amount: number)` utility function and implement it in `ProductCard`, `CartDrawer`, and `OrderDetails`.

### 🎮 Level 3: New Feature - Product Reviews
**Difficulty: ⭐⭐⭐ Hard**
**Estimated Time: 2-3 hours**

#### Task 3.1: Backend - Reviews API
The client wants customers to leave reviews.
1.  Update `schema.prisma` to add a `Review` model (rating: Int, comment: String, user relation, product relation).
2.  Create API endpoints: `POST /api/products/:id/comments` and `GET /api/products/:id/comments`.

#### Task 3.2: Frontend - Reviews Section
1.  Add a "Customer Reviews" section to the `ProductDetails` page.
2.  Display existing reviews.
3.  Add a form for logged-in users to submit a new review.

### 🎮 Level 4: Checkout Integration Issues
**Difficulty: ⭐⭐⭐⭐ Expert**
**Estimated Time: 2-3 hours**

#### Task 4.1: Debug Silent Order Failures
Occasionally, clicking "Place Order" does nothing. No error, no success.
-   *Investigation:* The `createOrder` API call might be timing out or failing validation without feedback.
-   *Fix:* Implement proper try/catch blocks in the checkout flow and display a toast notification with the specific error message returned from the server.

#### Task 4.2: Prevent Double Submission
Users can accidentally click "Place Order" twice, creating duplicate orders.
-   *Fix:* Disable the submit button and show a loading spinner immediately after the first click until the request completes.

### 🎮 Level 5: Concurrency & Data Integrity
**Difficulty: ⭐⭐⭐⭐⭐ Master**
**Estimated Time: 3-4 hours**

#### Scenario: The "Phantom Inventory" Incident
**Report:** "We had 1 'Sunset Bowl' left. Two customers bought it at the exact same second. Now we have -1 inventory and two angry customers."

#### Task 5.1: Reproduce & Fix Race Condition
1.  Analyze the `createOrder` logic in `server/src/routes/orders.ts`.
2.  Implement a database transaction with proper locking (or atomic updates) using Prisma to ensure stock is checked and decremented atomically.
    -   *Hint:* Look into Prisma's interactive transactions (`$transaction`).

#### Task 5.2: Reconciliation Script
Create a script (or admin endpoint) that checks for any products with negative inventory and generates a report of affected orders.

