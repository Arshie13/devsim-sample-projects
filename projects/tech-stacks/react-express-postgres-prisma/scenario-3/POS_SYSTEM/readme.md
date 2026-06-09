This is a POS SYSTEM.

## Brief instructions & features (starter)
Use this as the feature checklist for the starter code:

1) Authentication
- Admin and cashier login
- Role-based access for settings and reports

2) Product catalog
- Create, edit, deactivate products
- Categories and basic search

3) Inventory
- Track stock levels per product
- Low-stock indicator

4) Sales / checkout
- Add items to cart, update quantities, remove items
- Calculate totals, tax, and discounts
- Record payment method (cash/card)

5) Orders
- Persist completed sales
- View daily sales list and details

6) Receipts
- Generate a printable receipt view

7) Basic reporting
- Daily totals and top-selling items

8) Settings
- Store profile (name, address, tax rate)
- Payment method toggles

## Challenge Levels

This project is the host for a 5-level / 10-task DevSim challenge. See [plan.md](./plan.md) for the full level design and acceptance criteria. Tests are wired per task under `tests/{client,server}/level-N/task-M/`.

Run a single level:

```
pnpm run test:tasks:l1   # environment + sidebar brand
pnpm run test:tasks:l2   # getStockLevel + POS/Inventory refactor
pnpm run test:tasks:l3   # void flow + oversell-safe checkout
pnpm run test:tasks:l4   # PromoCode full-stack feature
pnpm run test:tasks:l5   # revenue bug + postmortem
```

Run a single task:

```
pnpm run test:task:l3:t2   # atomic void + updateMany gte guard
```