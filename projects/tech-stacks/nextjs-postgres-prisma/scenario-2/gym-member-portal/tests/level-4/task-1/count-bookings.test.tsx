// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import React from 'react';

// Candidate creates: src/components/BookingsByClassList.tsx
//
// Default-exports a React component:
//   <BookingsByClassList
//     bookings={{ class_id: number }[]}
//     classes={{ id: number; name: string }[]}
//   />
//
// Rules:
//  - Counts bookings per class_id and renders one row per class with at
//    least one booking (data-testid="booking-row").
//  - Each row shows the class name and the booking count (the count must
//    appear in the rendered text).
//  - Rows are sorted by class id ascending.
//  - When there are no bookings, render an empty-state message with
//    data-testid="empty-state".

const classes = [
  { id: 1, name: 'Morning Yoga' },
  { id: 2, name: 'HIIT Bootcamp' },
  { id: 3, name: 'Spin Class' },
];

const bookings = [
  { class_id: 3 },
  { class_id: 1 },
  { class_id: 3 },
  { class_id: 3 },
  { class_id: 1 },
];

const load = () => import('../../../src/components/BookingsByClassList');

describe('L4T1: <BookingsByClassList />', () => {
  it('is a React component (default export)', async () => {
    const mod = await load();
    expect(typeof mod.default).toBe('function');
  });

  it('renders one row per class that has bookings', async () => {
    const { default: BookingsByClassList } = await load();
    render(<BookingsByClassList bookings={bookings} classes={classes} />);
    const rows = screen.getAllByTestId('booking-row');
    expect(rows).toHaveLength(2);
  });

  it('shows the class name and the booking count', async () => {
    const { default: BookingsByClassList } = await load();
    render(<BookingsByClassList bookings={bookings} classes={classes} />);
    const rows = screen.getAllByTestId('booking-row');
    expect(within(rows[0]).getByText(/Morning Yoga/)).toBeInTheDocument();
    expect(within(rows[0]).getByText(/2/)).toBeInTheDocument();
    expect(within(rows[1]).getByText(/Spin Class/)).toBeInTheDocument();
    expect(within(rows[1]).getByText(/3/)).toBeInTheDocument();
  });

  it('sorts rows by class id ascending', async () => {
    const { default: BookingsByClassList } = await load();
    render(<BookingsByClassList bookings={bookings} classes={classes} />);
    const rows = screen.getAllByTestId('booking-row');
    // Class id 1 (Morning Yoga) should appear before class id 3 (Spin Class).
    expect(rows[0].textContent).toMatch(/Morning Yoga/);
    expect(rows[1].textContent).toMatch(/Spin Class/);
  });

  it('renders an empty state when there are no bookings', async () => {
    const { default: BookingsByClassList } = await load();
    render(<BookingsByClassList bookings={[]} classes={classes} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.queryAllByTestId('booking-row')).toHaveLength(0);
  });
});
