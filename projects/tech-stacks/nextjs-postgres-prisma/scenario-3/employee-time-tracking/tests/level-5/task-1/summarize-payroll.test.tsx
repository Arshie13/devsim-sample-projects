// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Candidate creates: src/components/PayrollSummary.tsx
//
// Default-exports a React component:
//   <PayrollSummary
//     records={{
//       regular_hours: number; overtime_hours: number;
//       total_hours: number; gross_pay: number;
//     }[]}
//   />
//
// Rules (mirror the original summarizePayroll):
//  - data-testid="total-regular"   -> Σ regular_hours
//  - data-testid="total-overtime"  -> Σ overtime_hours
//  - data-testid="total-hours"     -> Σ total_hours
//  - data-testid="total-gross"     -> Σ gross_pay, dollar-formatted "$X,XXX.XX"
//  - data-testid="average-gross"   -> totalGross / records.length, rounded 2dp,
//                                     dollar-formatted (0 when there are no
//                                     records — no division by zero)

const records = [
  { regular_hours: 40, overtime_hours: 5, total_hours: 45, gross_pay: 3375 },
  { regular_hours: 40, overtime_hours: 2, total_hours: 42, gross_pay: 2795 },
  { regular_hours: 38, overtime_hours: 0, total_hours: 38, gross_pay: 2280 },
];

const load = () => import('../../../src/components/PayrollSummary');

describe('L5T1: <PayrollSummary />', () => {
  it('is a React component (default export)', async () => {
    const mod = await load();
    expect(typeof mod.default).toBe('function');
  });

  it('totals regular, overtime, hours and gross pay', async () => {
    const { default: PayrollSummary } = await load();
    render(<PayrollSummary records={records} />);
    expect(screen.getByTestId('total-regular')).toHaveTextContent('118');
    expect(screen.getByTestId('total-overtime')).toHaveTextContent('7');
    expect(screen.getByTestId('total-hours')).toHaveTextContent('125');
    expect(screen.getByTestId('total-gross')).toHaveTextContent('$8,450.00');
  });

  it('renders the average gross pay rounded to two decimals', async () => {
    const { default: PayrollSummary } = await load();
    render(<PayrollSummary records={records} />);
    // 8450 / 3 = 2816.666... -> "$2,816.67"
    expect(screen.getByTestId('average-gross')).toHaveTextContent('$2,816.67');
  });

  it('renders zeroes for no records (no division by zero)', async () => {
    const { default: PayrollSummary } = await load();
    render(<PayrollSummary records={[]} />);
    expect(screen.getByTestId('total-regular')).toHaveTextContent('0');
    expect(screen.getByTestId('total-overtime')).toHaveTextContent('0');
    expect(screen.getByTestId('total-hours')).toHaveTextContent('0');
    expect(screen.getByTestId('total-gross')).toHaveTextContent('$0.00');
    expect(screen.getByTestId('average-gross')).toHaveTextContent('$0.00');
  });
});
