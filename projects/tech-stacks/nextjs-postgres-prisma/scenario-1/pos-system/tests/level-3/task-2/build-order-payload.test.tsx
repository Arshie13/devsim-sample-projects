// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import React from 'react';

// Candidate creates: src/components/OrderSummary.tsx
//
// Default-exports a React component:
//   <OrderSummary
//     customerName={string}
//     items={{ product_id: string; product_name: string; price: number; cartQuantity: number }[]}
//     coupon?={{ coupon_id: string; code: string; discount_percent: number }}
//   />
//
// Rules:
//  - Renders the customer name (data-testid="customer-name").
//  - Renders one row per item (data-testid="order-item") showing the name and
//    a subtotal of price × cartQuantity formatted as "₱X.XX".
//  - Renders the total (data-testid="order-total"). With a coupon, also
//    renders the discount (data-testid="order-discount").

const cart = [
  { product_id: 'p1', product_name: 'Espresso', price: 100, cartQuantity: 2 }, // 200
  { product_id: 'p2', product_name: 'Latte', price: 50, cartQuantity: 1 },     // 50
];

const load = () => import('../../../src/components/OrderSummary');

describe('L3T2: <OrderSummary />', () => {
  it('is a React component (default export)', async () => {
    const mod = await load();
    expect(typeof mod.default).toBe('function');
  });

  it('shows the customer name', async () => {
    const { default: OrderSummary } = await load();
    render(<OrderSummary customerName="Ada Lovelace" items={cart} />);
    expect(screen.getByTestId('customer-name')).toHaveTextContent('Ada Lovelace');
  });

  it('renders one row per cart item with a peso-formatted subtotal', async () => {
    const { default: OrderSummary } = await load();
    render(<OrderSummary customerName="Walk-in" items={cart} />);
    const rows = screen.getAllByTestId('order-item');
    expect(rows).toHaveLength(2);
    expect(within(rows[0]).getByText(/Espresso/)).toBeInTheDocument();
    expect(within(rows[0]).getByText(/₱200\.00/)).toBeInTheDocument();
  });

  it('shows the total equal to the subtotal when no coupon is applied', async () => {
    const { default: OrderSummary } = await load();
    render(<OrderSummary customerName="Walk-in" items={cart} />);
    expect(screen.getByTestId('order-total')).toHaveTextContent('₱250.00');
    expect(screen.queryByTestId('order-discount')).not.toBeInTheDocument();
  });

  it('applies a coupon discount and updates the total', async () => {
    const { default: OrderSummary } = await load();
    render(
      <OrderSummary
        customerName="Walk-in"
        items={cart}
        coupon={{ coupon_id: 'c1', code: 'SAVE20', discount_percent: 20 }}
      />,
    );
    expect(screen.getByTestId('order-discount')).toHaveTextContent('₱50.00');
    expect(screen.getByTestId('order-total')).toHaveTextContent('₱200.00');
  });
});
