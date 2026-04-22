Ready for review
Select text to add comments on the plan
ONLINE_ENTERPRISE — Level Design Plan (Design Phase)
Context
The LIBRARY_MANAGEMENT sample project under the PERN stack is organized as 5 progressive levels (setup → frontend → backend → full-stack → production bug) with 2 tasks each. Tests live in a tests/ folder at the project root, split by client/ vs server/ and nested by level-N/task-M/. Learning content lives in the DB-seeded learningSections array inside seed_reference.ts.

We now need the same 5-level challenge structure on top of ONLINE_ENTERPRISE — an UrbanPottery e-commerce app (React 18 + Express + Prisma + PostgreSQL) — with:

Same 5 levels, same difficulty curve
Different concrete tasks from LIBRARY_MANAGEMENT (user explicit requirement)
Matching learning content per task (crash courses different from levels 2+)
Tests mirroring the LM pattern but adapted to ONLINE_ENTERPRISE's domain
Seed data appended to scenario-2/seed_reference.ts without touching the LIBRARY_MANAGEMENT entries
This plan file covers the level/task design only — the user wants to approve it before I start wiring tests, controllers, seed data, and learning content.

ONLINE_ENTERPRISE codebase snapshot (what we're designing against)
Domain: single-merchant e-commerce (UrbanPottery ceramics)
Client: React 18 + Vite + Tailwind. Pages: Home, Shop, ProductDetails, Cart, Checkout, OrderConfirmation, auth/, admin/(Dashboard, Products, Orders, Inventory). Context: CartContext, AuthContext. Services in src/services/ (productService, orderService, etc.). Utilities: src/utils/formatters.ts (formatCurrency, formatDate, truncateText, getStarRating). Brand text "UrbanPottery" is hardcoded in src/components/layout/Navbar.tsx.
Server: Express + Prisma 6. Models: User, Category, Product (with stock: Int), Order (status enum), OrderItem, Review. Order creation already runs under prisma.$transaction and decrements stock. PATCH /api/orders/:id/status only flips status — does NOT restore stock on cancel (a real gap we can exploit for L3/L5). Admin Dashboard aggregates order totals for a revenue metric.
Missing: no tests/ folder, no root monorepo package.json, no test scripts in client or server. These will be added during implementation (not in this plan phase).
Level design (the thing I need your approval on)
Level 1 — Getting Familiar with the Codebase
Mirrors LM L1 — setup + tiny UI tweak. Same shape since setup is universal.

Task 1: Prepare Development Environment
Run npm install at root, client/, server/; run Prisma migrations; start both dev servers; verify /health and the React root render.
testType: "client" (same convention as LM — output-oriented setup checks).
Task 2: Update Brand Identity in Navbar
Student edits client/src/components/layout/Navbar.tsx: change the brand <span> from "UrbanPottery" to the exact string "UrbanPottery Artisan Ceramics".
Parallel to LM's "BookWise Public Library" subtitle change — same difficulty, different exact string, different component.
Level 2 — Client-Side Exploration
Mirrors LM L2 — frontend helper + refactor usage. Different domain logic.

Task 1: Add Stock Status Classifier Helper
Implement and export getStockStatus(stock: number): "OUT_OF_STOCK" | "LOW_STOCK" | "IN_STOCK" from client/src/utils/formatters.ts.
Thresholds: <= 0 → "OUT_OF_STOCK", 1..5 → "LOW_STOCK", > 5 → "IN_STOCK". Pure, deterministic.
Distinct from LM's boolean isBookAvailable — returns a 3-state enum with multiple thresholds.
Task 2: Adopt Stock Helper in ProductCard & Shop Filter
Refactor client/src/components/ProductCard.tsx to use getStockStatus(product.stock) for its badge display (currently inline stock === 0 / stock <= 5 checks).
Add a "Hide out-of-stock" toggle on the Shop page (client/src/pages/Shop.tsx) that filters via getStockStatus(product.stock) !== "OUT_OF_STOCK".
Parallel to LM L2T2 (adopting isBookAvailable in BorrowRecords filter) but adds a user-visible toggle.
Level 3 — Backend Debugging & Transactional Consistency
Mirrors LM L3 — diagnose a data-integrity flaw, then enforce transactions. Different flaw.

Task 1: Diagnose Cancelled-Order Stock Leak
Current PATCH /api/orders/:id/status in server/src/routes/orders.ts flips order.status without restoring stock. Also, the creation path has no guard against concurrent checkout reducing stock below zero (two buyers both see the last unit).
Student documents the failure paths with evidence (test that shows stock trending negative, or stock stuck low after cancellation).
testType: "server".
Task 2: Atomic Order Cancellation + Concurrency Guard
Implement cancelOrder in a new server/src/controllers/order.controller.ts (or inside routes/orders.ts — acceptance criteria will name the exact symbol). Behavior inside a single prisma.$transaction:
Flip status to CANCELLED only if currently PENDING or PROCESSING.
Set a new cancelledAt: DateTime? column (schema migration required — we use this in L5).
Restore each OrderItem.quantity back to Product.stock via increment.
Retrofit the checkout path to use updateMany with guard { stock: { gte: quantity } } so concurrent orders can never drive stock negative.
Distinct from LM L3 (which fixed a return flow). This fixes a cancel flow and adds the concurrency guard at checkout.
Level 4 — Full-Stack Feature: Coupon / Discount Codes
Mirrors LM L4 (Reservation Queue) — 2-model full-stack feature with create + lifecycle. Different domain entity, different business rules.

Task 1: Validate & Apply Coupon at Checkout (Full Stack)
Backend: new Coupon model (code, discountPercent, maxUses, usedCount, expiresAt, isActive). Seed a couple of test coupons. Endpoints:
POST /api/coupons/validate → { success, data: { discountPercent, finalTotal } } given { code, subtotal }.
Extend POST /api/orders to accept optional couponCode; server re-validates, applies discount to total, and increments usedCount inside the existing order transaction.
Frontend: new client/src/services/couponService.ts with validateCoupon(code, subtotal). Add a coupon input + "Apply" button to Checkout.tsx that renders discount state (applied / invalid / expired / exhausted) from the server response and displays a revised total.
testType: "both" (matches LM L4T1).
Task 2: Coupon Lifecycle + Usage Integrity
Backend: enforce usedCount < maxUses and expiresAt > now atomically (prevent race conditions where two concurrent orders consume the last slot). GET /api/coupons (admin-only) lists coupons with usage stats. Add cancelOrder path from L3 to decrement usedCount when a coupon-bearing order is cancelled (atomic).
Frontend: small admin-only coupon list panel (either a new route or a section in pages/admin/Dashboard.tsx) showing each coupon's code, remaining uses, expiry. Cancel-a-coupon-order flow visibly refreshes the UI (e.g., after cancellation, the coupon list shows usedCount restored).
Distinct from LM L4T2 (queue promotion / reindex). Same lifecycle-state idea (usage counter + expiry) but simpler state machine and different atomicity concerns.
Level 5 — The Production Struggle: Sales Revenue Bug
Mirrors LM L5 (overdue stale-status bug) — trust the source-of-truth timestamps, not the mutable status field.

Client complaint: "The admin Dashboard's total revenue is inflated — it shows revenue from orders we already cancelled. Finance can't close the books."
Task 1: Stabilize Revenue Classification
Bug: the dashboard/reporting query in server/src/routes/orders.ts (or a new /api/orders/stats) sums order.total across all orders, including cancelled ones. Worse — if an admin clicks the status dropdown and accidentally moves a cancelled order back to PENDING, status is now stale but cancelledAt (from L3) still holds the truth.
Fix: replace status-based filtering with cancelledAt IS NULL source-of-truth. Tests must include a "stale status" scenario where status = 'PENDING' but cancelledAt != null — that order must be excluded from revenue.
testType: "server", both a client complaint and backend query fix.
Task 2: Permanent Fix + Centralization + Postmortem
Extract the revenue predicate into a shared utility (e.g., server/src/utils/revenueUtils.ts exporting isRevenueEligibleOrder or a Prisma where-clause builder). Update the admin Dashboard endpoint and any other report endpoints to use it.
Add regression tests for: cancelled-but-status-stale order excluded; pending order included; delivered order included; refunded (if applicable) excluded.
Student writes a short postmortem file (server/POSTMORTEM_REVENUE.md) with Symptom / Root Cause / Fix / Prevention sections — same structure LM L5T2 asks for.
testType: "server". Mirrors LM L5T2 format exactly.
Why these tasks differ from LIBRARY_MANAGEMENT (per user's rule #2)
Level	LM task	OE task	How they differ
1	Brand subtitle swap	Brand name extension in Navbar	Same shape, different file/string
2	Boolean isBookAvailable + borrow filter	3-state getStockStatus + ProductCard refactor + Shop toggle	Enum vs boolean, multi-threshold, adds UI toggle
3	Return flow transaction + guard	Order cancel flow transaction + checkout guard + new cancelledAt column	Cancel path instead of return; adds schema migration
4	Reservation queue (queuePosition, promotion, reindex)	Coupon codes (usage count, expiry, atomic decrement)	Different entity, different lifecycle (counter vs ordered queue)
5	Overdue stale-status bug	Revenue stale-status bug	Different report, different stale field, same source-of-truth pattern
Crash course / Learning content plan (per user's rule #4)
Every task gets its own learningSections array, all different from LM's for levels 2+:

L1T1: same PERN/env/Prisma fundamentals as LM (setup is universal) — OK to reuse structure.
L1T2: React component editing (same as LM; it's the universal "first change"), but examples will reference Navbar.tsx and e-commerce branding.
L2T1: pure functions returning union types (vs LM's boolean return), threshold-based classification, exhaustive testing across three buckets.
L2T2: refactoring inline UI checks into helpers, plus introducing a new user-facing filter control (different from LM's dropdown filter).
L3T1: diagnosing cancel-path data leaks (different symptom than LM's return bug — stock stuck high instead of going negative), plus concurrent-oversell race.
L3T2: Prisma schema migrations (adding cancelledAt), updateMany guard conditions, multi-step transactions across 3 tables (Order, OrderItem, Product).
L4T1: building a validation endpoint + extending an existing transaction (vs LM's net-new feature), service layer for discount state, conditional UI.
L4T2: atomic counter mutations (increment/decrement with guard), expiry-based validity, admin-only observability panel.
L5T1: source-of-truth timestamps for financial reporting (not availability reporting), stale-status scenarios from manual admin edits.
L5T2: centralizing a Prisma where-clause, regression tests for financial integrity, postmortem for a revenue incident.
Each task keeps LM's 7–10 section shape (Overview → 4–6 concept sections → 1 interactive lab → Key Takeaway), 3–4 hints, and 4–8 acceptance criteria.

Test plan (per user's rule #3)
Mirrors LM's tests/{client|server}/level-N/task-M/ layout. Tests will be created during implementation, not now.

Level	Task	Test file location	Type	Key assertions
1	1	tests/client/level-1/task-1/setup-check.test.ts	Output (node env)	deps installed, Prisma migrated, servers respond
1	2	tests/client/level-1/task-2/navbar-branding.test.tsx	Component (jsdom)	Navbar renders exact brand string
2	1	tests/client/level-2/task-1/stock-status.test.ts	Unit	getStockStatus returns correct bucket across thresholds + boundaries
2	2	tests/client/level-2/task-2/product-card-and-shop.test.tsx	Component	ProductCard badge driven by helper; Shop toggle hides out-of-stock
3	1	tests/server/level-3/task-1/cancel-flow-analysis.test.ts	Integration	Reproduces stock-leak after status PATCH; reproduces oversell under concurrency
3	2	tests/server/level-3/task-2/atomic-cancel.test.ts	Integration	Cancel restores stock atomically; guard blocks oversell; cancelledAt set
4	1	`tests/{client,server}/level-4/task-1/coupon-apply.test.(ts	tsx)`	Integration + component
4	2	`tests/{client,server}/level-4/task-2/coupon-lifecycle.test.(ts	tsx)`	Integration + component
5	1	tests/server/level-5/task-1/revenue-classification.test.ts	Integration	Excludes stale-status cancelled orders; includes pending/delivered
5	2	tests/server/level-5/task-2/revenue-fix.test.ts	Integration	Uses shared utility; regression cases pass; postmortem file exists
Test scripts will be wired into a root package.json following LM's test:task:l{N}:t{M} convention.

Seed data plan (per user's requirement)
Appended to scenario-2/seed_reference.ts:

New scenario entry: id: "scenario-2", name "UrbanPottery Online Enterprise", difficulty "expert".
New levels level-6..level-10 (or level-1..level-5 namespaced under scenarioId: "scenario-2" — will confirm the ID convention by inspecting the existing schema — likely the Level id is scoped per scenario, so level-1..5 is fine with a different scenarioId).
Each level gets 2 tasks, each with learningSections (7–10 entries incl. 1 interactive lab), hints (3–4), and acceptanceCriteria (4–8).
Existing scenario-1 and its 5 levels will remain byte-identical.
What's out of scope for this plan file
Writing any code, tests, learning content, seed entries, or readme updates (those happen after you approve this design).
Root monorepo package.json wiring and test framework install (Vitest + supertest + @testing-library/react) — will be part of implementation.
Prisma migration for cancelledAt and Coupon model — will be part of implementation.
Confirmed design decisions
L4 entity: Coupon { code, discountPercent, maxUses, usedCount, expiresAt, isActive }.
L2T2 scope: refactor ProductCard and add a visible "Hide out-of-stock" toggle on Shop.tsx.
L3T2 schema: add cancelledAt DateTime? to the Order model via Prisma migration; L5 will depend on it as source-of-truth.
L5T2 postmortem location: ONLINE_ENTERPRISE/server/POSTMORTEM_REVENUE.md.
Critical files that will be created or modified during implementation
New files:

ONLINE_ENTERPRISE/package.json (root monorepo orchestrator)
ONLINE_ENTERPRISE/tests/{client,server}/setup.ts
ONLINE_ENTERPRISE/tests/client/level-{1,2,4}/task-{1,2}/*.test.{ts,tsx}
ONLINE_ENTERPRISE/tests/server/level-{3,4,5}/task-{1,2}/*.test.ts
ONLINE_ENTERPRISE/server/src/controllers/order.controller.ts (extracted from routes/orders.ts during L3)
ONLINE_ENTERPRISE/server/src/controllers/coupon.controller.ts (L4)
ONLINE_ENTERPRISE/server/src/routes/coupons.ts (L4)
ONLINE_ENTERPRISE/server/src/utils/revenueUtils.ts (L5)
ONLINE_ENTERPRISE/server/POSTMORTEM_REVENUE.md (L5)
ONLINE_ENTERPRISE/client/src/services/couponService.ts (L4)
ONLINE_ENTERPRISE/client/vitest.config.ts, ONLINE_ENTERPRISE/server/vitest.config.ts
Modified files:

ONLINE_ENTERPRISE/client/package.json, ONLINE_ENTERPRISE/server/package.json (test scripts, vitest deps)
ONLINE_ENTERPRISE/client/src/components/layout/Navbar.tsx (L1T2 reference target)
ONLINE_ENTERPRISE/client/src/utils/formatters.ts (L2T1 — add getStockStatus)
ONLINE_ENTERPRISE/client/src/components/ProductCard.tsx (L2T2)
ONLINE_ENTERPRISE/client/src/pages/Shop.tsx (L2T2 toggle)
ONLINE_ENTERPRISE/client/src/pages/Checkout.tsx (L4 coupon UI)
ONLINE_ENTERPRISE/server/prisma/schema.prisma (L3 cancelledAt, L4 Coupon model)
ONLINE_ENTERPRISE/server/src/routes/orders.ts (L3 cancel + checkout guard, L4 coupon application, L5 revenue query)
scenario-2/seed_reference.ts (append scenario-2 + 5 levels + tasks; do not touch scenario-1 entries)
Verification (end-to-end)
After implementation, verify by:

cd ONLINE_ENTERPRISE && npm install and per-workspace installs succeed.
npm run dev starts both servers; visit Shop page and confirm stock toggle works (L2), checkout coupon input works (L4).
npm run test:tasks:l1 through npm run test:tasks:l5 all pass against a properly-implemented solution.
Manually walk a full flow: add to cart → apply coupon → checkout → cancel order → verify stock restored, cancelledAt set, dashboard revenue excludes the cancelled order.
Run npx tsx scenario-2/seed_reference.ts against a fresh DB; confirm scenario-1 levels remain identical and scenario-2 levels appear.