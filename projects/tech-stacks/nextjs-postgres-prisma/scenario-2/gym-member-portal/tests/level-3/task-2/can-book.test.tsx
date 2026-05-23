// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Candidate creates: src/components/BookingButton.tsx
//
// Default-exports a React component:
//   <BookingButton
//     classId={number}
//     capacity={number}
//     booked={number}
//     userBookedClassIds={number[]}
//     onBook={(classId: number) => void}
//   />
//
// Rules:
//  - Renders a button (role="button"). The label is "Book" by default.
//  - When the user has already booked this class, the button label becomes
//    "Already booked" and the button is disabled.
//  - When booked >= capacity AND the user has NOT booked, the label becomes
//    "Class full" and the button is disabled.
//  - "Already booked" takes precedence when both conditions are true.
//  - Clicking a non-disabled button calls onBook(classId) exactly once.

const load = () => import('../../../src/components/BookingButton');

describe('L3T2: <BookingButton />', () => {
  it('is a React component (default export)', async () => {
    const mod = await load();
    expect(typeof mod.default).toBe('function');
  });

  it('renders an enabled "Book" button when seats remain and the user has not booked', async () => {
    const { default: BookingButton } = await load();
    render(
      <BookingButton
        classId={3}
        capacity={20}
        booked={5}
        userBookedClassIds={[1, 2]}
        onBook={() => {}}
      />,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeEnabled();
    expect(btn).toHaveTextContent(/^book$/i);
  });

  it('shows "Already booked" and disables the button when the user has booked this class', async () => {
    const { default: BookingButton } = await load();
    render(
      <BookingButton
        classId={2}
        capacity={20}
        booked={5}
        userBookedClassIds={[1, 2]}
        onBook={() => {}}
      />,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/already booked/i);
  });

  it('shows "Class full" and disables the button when the class is full', async () => {
    const { default: BookingButton } = await load();
    render(
      <BookingButton
        classId={3}
        capacity={20}
        booked={20}
        userBookedClassIds={[1, 2]}
        onBook={() => {}}
      />,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent(/class full/i);
  });

  it('prefers "Already booked" over "Class full" when both are true', async () => {
    const { default: BookingButton } = await load();
    render(
      <BookingButton
        classId={2}
        capacity={20}
        booked={20}
        userBookedClassIds={[2]}
        onBook={() => {}}
      />,
    );
    expect(screen.getByRole('button')).toHaveTextContent(/already booked/i);
  });

  it('calls onBook(classId) when a bookable button is clicked', async () => {
    const { default: BookingButton } = await load();
    const onBook = vi.fn();
    render(
      <BookingButton
        classId={3}
        capacity={20}
        booked={5}
        userBookedClassIds={[]}
        onBook={onBook}
      />,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));
    expect(onBook).toHaveBeenCalledWith(3);
    expect(onBook).toHaveBeenCalledTimes(1);
  });
});
