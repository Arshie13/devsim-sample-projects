// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Candidate creates: src/components/SalesSummary.tsx
//
// Default-exports a React component:
//   <SalesSummary orders={{ total_amount: number; discount_amount: number }[]} />
//
// Rules:
//  - data-testid="total-revenue"    -> Σ total_amount,  peso-formatted
//  - data-testid="total-discount"   -> Σ discount_amount, peso-formatted
//  - data-testid="order-count"      -> number of orders
//  - data-testid="average-order"    -> totalRevenue / orderCount rounded to 2dp
//                                       (0 when there are no orders, no division by zero),
//                                       peso-formatted
//  - Money is rendered as "₱X,XXX.XX".

const orders = [
  { total_amount: 100, discount_amount: 0 },
  { total_amount: 250, discount_amount: 50 },
  { total_amount: 400, discount_amount: 25 },
];

const load = () => import('../../../src/components/SalesSummary');

describe('L5T1: <SalesSummary />', () => {
  it('is a React component (default export)', async () => {
    const mod = await load();
    expect(typeof mod.default).toBe('function');
  });

  it('shows total revenue, total discount and order count', async () => {
    const { default: SalesSummary } = await load();
    render(<SalesSummary orders={orders} />);
    expect(screen.getByTestId('total-revenue')).toHaveTextContent('₱750.00');
    expect(screen.getByTestId('total-discount')).toHaveTextContent('₱75.00');
    expect(screen.getByTestId('order-count')).toHaveTextContent('3');
  });

  it('renders the average order value rounded to two decimals', async () => {
    const { default: SalesSummary } = await load();
    render(<SalesSummary orders={orders} />);
    expect(screen.getByTestId('average-order')).toHaveTextContent('₱250.00');
  });

  it('renders zeroes for no orders (no division by zero)', async () => {
    const { default: SalesSummary } = await load();
    render(<SalesSummary orders={[]} />);
    expect(screen.getByTestId('total-revenue')).toHaveTextContent('₱0.00');
    expect(screen.getByTestId('total-discount')).toHaveTextContent('₱0.00');
    expect(screen.getByTestId('order-count')).toHaveTextContent('0');
    expect(screen.getByTestId('average-order')).toHaveTextContent('₱0.00');
  });
});
