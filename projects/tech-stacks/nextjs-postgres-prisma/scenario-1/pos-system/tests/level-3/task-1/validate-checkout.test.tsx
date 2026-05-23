// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Candidate creates: src/components/CheckoutErrors.tsx
//
// Default-exports a React component:
//   <CheckoutErrors errors={string[]} />
//
// Rules:
//  - When errors is empty, the component renders a "ready to checkout"
//    confirmation with role="status".
//  - Otherwise it renders role="alert" containing one <li> per error.

const load = () => import('../../../src/components/CheckoutErrors');

describe('L3T1: <CheckoutErrors />', () => {
  it('is a React component (default export)', async () => {
    const mod = await load();
    expect(typeof mod.default).toBe('function');
  });

  it('renders a status message when there are no errors', async () => {
    const { default: CheckoutErrors } = await load();
    render(<CheckoutErrors errors={[]} />);
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/ready to checkout/i);
  });

  it('renders an alert with one item per error', async () => {
    const { default: CheckoutErrors } = await load();
    render(
      <CheckoutErrors
        errors={[
          'Cart is empty',
          'p2 exceeds available stock',
          'ghost is not a known product',
        ]}
      />,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('shows each error message text', async () => {
    const { default: CheckoutErrors } = await load();
    render(<CheckoutErrors errors={['p2 exceeds available stock']} />);
    expect(
      screen.getByText(/p2 exceeds available stock/i),
    ).toBeInTheDocument();
  });

  it('does not render a status banner when there are errors', async () => {
    const { default: CheckoutErrors } = await load();
    render(<CheckoutErrors errors={['Cart is empty']} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
