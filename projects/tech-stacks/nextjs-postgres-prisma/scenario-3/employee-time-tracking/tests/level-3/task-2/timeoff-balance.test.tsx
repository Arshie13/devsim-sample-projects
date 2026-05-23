// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Candidate creates: src/components/TimeOffBalance.tsx
//
// Default-exports a React component:
//   <TimeOffBalance
//     allowance={number}
//     requests={{ hours: number; status: 'approved'|'pending'|'rejected';
//                 request_type: 'vacation'|'sick'|'personal'|'unpaid' }[]}
//   />
//
// Rules (mirrors computeTimeOffBalance from the original task):
//  - "Used" = sum of hours where status === 'approved' AND request_type !== 'unpaid'.
//  - "Pending" = sum of hours where status === 'pending'.
//  - "Remaining" = allowance - used.
//
// The component must render these as labelled values:
//   data-testid="used-hours", "pending-hours", "remaining-hours"

const requests = [
  { hours: 40, status: 'approved', request_type: 'vacation' },
  { hours: 8, status: 'approved', request_type: 'sick' },
  { hours: 16, status: 'pending', request_type: 'vacation' },
  { hours: 24, status: 'approved', request_type: 'unpaid' },  // unpaid — not counted
  { hours: 8, status: 'rejected', request_type: 'personal' }, // rejected — not counted
];

const load = () => import('../../../src/components/TimeOffBalance');

describe('L3T2: <TimeOffBalance />', () => {
  it('is a React component (default export)', async () => {
    const mod = await load();
    expect(typeof mod.default).toBe('function');
  });

  it('shows the used hours (approved, non-unpaid)', async () => {
    const { default: TimeOffBalance } = await load();
    render(<TimeOffBalance allowance={120} requests={requests} />);
    expect(screen.getByTestId('used-hours')).toHaveTextContent('48');
  });

  it('shows the pending hours', async () => {
    const { default: TimeOffBalance } = await load();
    render(<TimeOffBalance allowance={120} requests={requests} />);
    expect(screen.getByTestId('pending-hours')).toHaveTextContent('16');
  });

  it('computes remaining as allowance minus used', async () => {
    const { default: TimeOffBalance } = await load();
    render(<TimeOffBalance allowance={120} requests={requests} />);
    expect(screen.getByTestId('remaining-hours')).toHaveTextContent('72');
  });

  it('shows the full allowance when there are no requests', async () => {
    const { default: TimeOffBalance } = await load();
    render(<TimeOffBalance allowance={120} requests={[]} />);
    expect(screen.getByTestId('used-hours')).toHaveTextContent('0');
    expect(screen.getByTestId('pending-hours')).toHaveTextContent('0');
    expect(screen.getByTestId('remaining-hours')).toHaveTextContent('120');
  });
});
