// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Candidate creates: src/components/TimeOffRequestForm.tsx
//
// Default-exports a React component:
//   <TimeOffRequestForm onSubmit={(req: {
//     start_date: string; end_date: string; hours: number; request_type: string;
//   }) => void} />
//
// Rules:
//  - Renders inputs labelled "Start date", "End date", "Hours" and a
//    select labelled "Type" (with options vacation/sick/personal/unpaid).
//  - Submitting with valid values calls onSubmit with the typed request.
//  - When end_date is before start_date OR hours <= 0, the form must
//    NOT call onSubmit and must render a data-testid="form-error" element.

const load = () => import('../../../src/components/TimeOffRequestForm');

describe('L3T1: <TimeOffRequestForm />', () => {
  it('is a React component (default export)', async () => {
    const mod = await load();
    expect(typeof mod.default).toBe('function');
  });

  it('renders start, end, hours, and type inputs', async () => {
    const { default: TimeOffRequestForm } = await load();
    render(<TimeOffRequestForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hours/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
  });

  it('submits a well-formed request', async () => {
    const { default: TimeOffRequestForm } = await load();
    const onSubmit = vi.fn();
    render(<TimeOffRequestForm onSubmit={onSubmit} />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/start date/i), '2026-06-01');
    await user.type(screen.getByLabelText(/end date/i), '2026-06-05');
    await user.clear(screen.getByLabelText(/hours/i));
    await user.type(screen.getByLabelText(/hours/i), '32');
    await user.selectOptions(screen.getByLabelText(/type/i), 'vacation');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        start_date: '2026-06-01',
        end_date: '2026-06-05',
        hours: 32,
        request_type: 'vacation',
      }),
    );
  });

  it('blocks submit and shows an error when end is before start', async () => {
    const { default: TimeOffRequestForm } = await load();
    const onSubmit = vi.fn();
    render(<TimeOffRequestForm onSubmit={onSubmit} />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/start date/i), '2026-06-10');
    await user.type(screen.getByLabelText(/end date/i), '2026-06-05');
    await user.clear(screen.getByLabelText(/hours/i));
    await user.type(screen.getByLabelText(/hours/i), '16');
    await user.selectOptions(screen.getByLabelText(/type/i), 'vacation');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('form-error')).toBeInTheDocument();
  });

  it('blocks submit when hours are non-positive', async () => {
    const { default: TimeOffRequestForm } = await load();
    const onSubmit = vi.fn();
    render(<TimeOffRequestForm onSubmit={onSubmit} />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/start date/i), '2026-06-01');
    await user.type(screen.getByLabelText(/end date/i), '2026-06-02');
    await user.clear(screen.getByLabelText(/hours/i));
    await user.type(screen.getByLabelText(/hours/i), '0');
    await user.selectOptions(screen.getByLabelText(/type/i), 'sick');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('form-error')).toBeInTheDocument();
  });
});
