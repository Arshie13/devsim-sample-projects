// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Candidate creates: src/components/CouponInput.tsx
//
// Default-exports a React component:
//   <CouponInput onApply={(normalizedCode: string) => void} />
//
// Rules:
//  - Renders a text input (role="textbox", placeholder /coupon/i) and an
//    "Apply" button (role="button", name /apply/i).
//  - On clicking Apply, calls `onApply` with the normalized code: trimmed,
//    uppercased, internal whitespace removed (e.g. "  save 10 " -> "SAVE10").
//  - If the input is empty/whitespace, the button is disabled and onApply
//    is NOT called.
//  - After a successful apply, the input is cleared.

const load = () => import('../../../src/components/CouponInput');

describe('L4T1: <CouponInput />', () => {
  it('is a React component (default export)', async () => {
    const mod = await load();
    expect(typeof mod.default).toBe('function');
  });

  it('renders a coupon input and an Apply button', async () => {
    const { default: CouponInput } = await load();
    render(<CouponInput onApply={() => {}} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply/i })).toBeInTheDocument();
  });

  it('disables Apply while the input is empty', async () => {
    const { default: CouponInput } = await load();
    render(<CouponInput onApply={() => {}} />);
    expect(screen.getByRole('button', { name: /apply/i })).toBeDisabled();
  });

  it('normalizes the code and calls onApply on click', async () => {
    const { default: CouponInput } = await load();
    const onApply = vi.fn();
    render(<CouponInput onApply={onApply} />);
    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), '  save 10 ');
    await user.click(screen.getByRole('button', { name: /apply/i }));
    expect(onApply).toHaveBeenCalledWith('SAVE10');
  });

  it('does not call onApply for whitespace-only input', async () => {
    const { default: CouponInput } = await load();
    const onApply = vi.fn();
    render(<CouponInput onApply={onApply} />);
    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), '   ');
    const button = screen.getByRole('button', { name: /apply/i });
    expect(button).toBeDisabled();
    expect(onApply).not.toHaveBeenCalled();
  });

  it('clears the input after a successful apply', async () => {
    const { default: CouponInput } = await load();
    render(<CouponInput onApply={() => {}} />);
    const user = userEvent.setup();
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await user.type(input, 'summer sale');
    await user.click(screen.getByRole('button', { name: /apply/i }));
    expect(input.value).toBe('');
  });
});
