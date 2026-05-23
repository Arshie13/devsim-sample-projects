// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Candidate creates: src/components/MemberStatsCard.tsx
//
// Default-exports a React component:
//   <MemberStatsCard
//     bookings={{ class_id: number }[]}
//     attendances={{ class_id: number }[]}
//     classes={{ id: number; name: string }[]}
//   />
//
// Rules (mirror the original computeMemberStats):
//  - data-testid="total-booked"      -> bookings.length
//  - data-testid="total-attended"    -> attendances.length
//  - data-testid="attendance-rate"   -> round(totalAttended / totalBooked * 100) as "N%"
//                                       (0% when there are no bookings, no division by zero)
//  - data-testid="favorite-class"    -> name of the most-attended class
//                                       (renders "—" when there is no attendance)

const classes = [
  { id: 1, name: 'Morning Yoga' },
  { id: 2, name: 'HIIT Bootcamp' },
  { id: 3, name: 'Spin Class' },
];

const load = () => import('../../../src/components/MemberStatsCard');

describe('L5T1: <MemberStatsCard />', () => {
  it('is a React component (default export)', async () => {
    const mod = await load();
    expect(typeof mod.default).toBe('function');
  });

  it('shows total bookings and attendances', async () => {
    const { default: MemberStatsCard } = await load();
    render(
      <MemberStatsCard
        bookings={[{ class_id: 1 }, { class_id: 2 }, { class_id: 3 }, { class_id: 1 }]}
        attendances={[{ class_id: 1 }, { class_id: 1 }, { class_id: 3 }]}
        classes={classes}
      />,
    );
    expect(screen.getByTestId('total-booked')).toHaveTextContent('4');
    expect(screen.getByTestId('total-attended')).toHaveTextContent('3');
  });

  it('renders the attendance rate as a rounded percentage', async () => {
    const { default: MemberStatsCard } = await load();
    render(
      <MemberStatsCard
        bookings={[{ class_id: 1 }, { class_id: 2 }, { class_id: 3 }]}
        attendances={[{ class_id: 1 }, { class_id: 3 }]}
        classes={classes}
      />,
    );
    expect(screen.getByTestId('attendance-rate')).toHaveTextContent('67%');
  });

  it('shows the most-attended class name as the favourite', async () => {
    const { default: MemberStatsCard } = await load();
    render(
      <MemberStatsCard
        bookings={[{ class_id: 1 }]}
        attendances={[{ class_id: 1 }, { class_id: 1 }, { class_id: 3 }]}
        classes={classes}
      />,
    );
    expect(screen.getByTestId('favorite-class')).toHaveTextContent('Morning Yoga');
  });

  it('is safe with zero bookings/attendance', async () => {
    const { default: MemberStatsCard } = await load();
    render(<MemberStatsCard bookings={[]} attendances={[]} classes={classes} />);
    expect(screen.getByTestId('total-booked')).toHaveTextContent('0');
    expect(screen.getByTestId('total-attended')).toHaveTextContent('0');
    expect(screen.getByTestId('attendance-rate')).toHaveTextContent('0%');
    expect(screen.getByTestId('favorite-class')).toHaveTextContent('—');
  });
});
