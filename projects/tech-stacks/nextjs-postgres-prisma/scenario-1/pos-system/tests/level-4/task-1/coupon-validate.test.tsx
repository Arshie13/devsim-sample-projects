import { describe, it, expect } from 'vitest';

// Candidate creates: src/lib/coupon.ts
const load = () => import('../../../src/lib/coupon');

describe('L4T1: normalizeCode', () => {
  it('is exported as a function', async () => {
    const { normalizeCode } = await load();
    expect(typeof normalizeCode).toBe('function');
  });

  it('trims, uppercases, and removes internal whitespace', async () => {
    const { normalizeCode } = await load();
    expect(normalizeCode('  save 10 ')).toBe('SAVE10');
    expect(normalizeCode('summer sale')).toBe('SUMMERSALE');
  });
});

describe('L4T1: isCouponValid', () => {
  const now = new Date('2026-06-01T00:00:00Z');

  it('is exported as a function', async () => {
    const { isCouponValid } = await load();
    expect(typeof isCouponValid).toBe('function');
  });

  it('rejects an inactive coupon', async () => {
    const { isCouponValid } = await load();
    expect(isCouponValid({ is_active: false, expires_at: null }, now)).toBe(false);
  });

  it('accepts an active coupon with no expiry', async () => {
    const { isCouponValid } = await load();
    expect(isCouponValid({ is_active: true, expires_at: null }, now)).toBe(true);
  });

  it('rejects an active coupon that has expired', async () => {
    const { isCouponValid } = await load();
    expect(isCouponValid({ is_active: true, expires_at: '2026-05-01T00:00:00Z' }, now)).toBe(false);
  });

  it('accepts an active coupon that has not yet expired', async () => {
    const { isCouponValid } = await load();
    expect(isCouponValid({ is_active: true, expires_at: '2026-12-31T00:00:00Z' }, now)).toBe(true);
  });
});
