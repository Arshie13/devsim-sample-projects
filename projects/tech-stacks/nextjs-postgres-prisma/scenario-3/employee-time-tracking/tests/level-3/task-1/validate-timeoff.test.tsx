import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/timeoff.ts
const load = () => import('../../../src/lib/timeoff');

const valid = {
  start_date: '2026-06-01',
  end_date: '2026-06-05',
  hours: 32,
  request_type: 'vacation',
};

describe('L3T1: validateTimeOffRequest', () => {
  it('is exported as a function', async () => {
    const { validateTimeOffRequest } = await load();
    expect(typeof validateTimeOffRequest).toBe('function');
  });

  it('accepts a well-formed request', async () => {
    const { validateTimeOffRequest } = await load();
    expect(validateTimeOffRequest(valid)).toEqual({ ok: true, errors: [] });
  });

  it('rejects an end date before the start date', async () => {
    const { validateTimeOffRequest } = await load();
    const result = validateTimeOffRequest({ ...valid, start_date: '2026-06-10' });
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects non-positive hours', async () => {
    const { validateTimeOffRequest } = await load();
    expect(validateTimeOffRequest({ ...valid, hours: 0 }).ok).toBe(false);
    expect(validateTimeOffRequest({ ...valid, hours: -8 }).ok).toBe(false);
  });

  it('rejects an unknown request type', async () => {
    const { validateTimeOffRequest } = await load();
    expect(validateTimeOffRequest({ ...valid, request_type: 'holiday' }).ok).toBe(false);
  });

  it('accepts every supported request type', async () => {
    const { validateTimeOffRequest } = await load();
    for (const type of ['vacation', 'sick', 'personal', 'unpaid']) {
      expect(validateTimeOffRequest({ ...valid, request_type: type }).ok).toBe(true);
    }
  });
});
