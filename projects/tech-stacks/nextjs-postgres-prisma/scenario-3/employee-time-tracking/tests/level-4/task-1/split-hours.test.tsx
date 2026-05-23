// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Candidate creates: src/components/HoursBreakdown.tsx
//
// Default-exports a React component:
//   <HoursBreakdown totalHours={number} threshold?={number} />
//
// Rules (mirrors splitHours from the original task):
//  - Splits totalHours into regular (up to threshold) and overtime (above).
//  - Default threshold is 40.
//  - Renders both values with these test ids:
//      data-testid="regular-hours"
//      data-testid="overtime-hours"

const load = () => import('../../../src/components/HoursBreakdown');

describe('L4T1: <HoursBreakdown />', () => {
  it('is a React component (default export)', async () => {
    const mod = await load();
    expect(typeof mod.default).toBe('function');
  });

  it('treats all hours as regular below the 40-hour threshold', async () => {
    const { default: HoursBreakdown } = await load();
    render(<HoursBreakdown totalHours={35} />);
    expect(screen.getByTestId('regular-hours')).toHaveTextContent('35');
    expect(screen.getByTestId('overtime-hours')).toHaveTextContent('0');
  });

  it('splits hours above the threshold into overtime', async () => {
    const { default: HoursBreakdown } = await load();
    render(<HoursBreakdown totalHours={48} />);
    expect(screen.getByTestId('regular-hours')).toHaveTextContent('40');
    expect(screen.getByTestId('overtime-hours')).toHaveTextContent('8');
  });

  it('handles exactly the threshold', async () => {
    const { default: HoursBreakdown } = await load();
    render(<HoursBreakdown totalHours={40} />);
    expect(screen.getByTestId('regular-hours')).toHaveTextContent('40');
    expect(screen.getByTestId('overtime-hours')).toHaveTextContent('0');
  });

  it('accepts a custom threshold', async () => {
    const { default: HoursBreakdown } = await load();
    render(<HoursBreakdown totalHours={45} threshold={35} />);
    expect(screen.getByTestId('regular-hours')).toHaveTextContent('35');
    expect(screen.getByTestId('overtime-hours')).toHaveTextContent('10');
  });
});
