// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Candidate creates: src/components/ClassSpotsIndicator.tsx
//
// Default-exports a React component:
//   <ClassSpotsIndicator capacity={number} booked={number} />
//
// Rules:
//  - Shows "X spots left" (data-testid="spots-left"), where X = max(capacity - booked, 0).
//  - When booked >= capacity, shows a badge "Class Full" (data-testid="full-badge").
//  - The "full" badge is NOT rendered while seats remain.

const load = () => import('../../../src/components/ClassSpotsIndicator');

describe('L3T1: <ClassSpotsIndicator />', () => {
  it('is a React component (default export)', async () => {
    const mod = await load();
    expect(typeof mod.default).toBe('function');
  });

  it('reports the remaining seat count', async () => {
    const { default: ClassSpotsIndicator } = await load();
    render(<ClassSpotsIndicator capacity={15} booked={4} />);
    expect(screen.getByTestId('spots-left')).toHaveTextContent(/11/);
  });

  it('never shows a negative seat count', async () => {
    const { default: ClassSpotsIndicator } = await load();
    render(<ClassSpotsIndicator capacity={10} booked={14} />);
    expect(screen.getByTestId('spots-left')).toHaveTextContent(/0/);
  });

  it('does not show the full badge while seats remain', async () => {
    const { default: ClassSpotsIndicator } = await load();
    render(<ClassSpotsIndicator capacity={15} booked={14} />);
    expect(screen.queryByTestId('full-badge')).not.toBeInTheDocument();
  });

  it('shows the full badge once the class is at capacity', async () => {
    const { default: ClassSpotsIndicator } = await load();
    render(<ClassSpotsIndicator capacity={15} booked={15} />);
    expect(screen.getByTestId('full-badge')).toHaveTextContent(/full/i);
  });

  it('shows the full badge once the class is over capacity', async () => {
    const { default: ClassSpotsIndicator } = await load();
    render(<ClassSpotsIndicator capacity={15} booked={16} />);
    expect(screen.getByTestId('full-badge')).toBeInTheDocument();
  });
});
