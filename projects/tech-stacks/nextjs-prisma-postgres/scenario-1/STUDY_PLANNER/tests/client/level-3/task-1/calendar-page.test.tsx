/**
 * Level 3 Task 1 [Client]: Month Calendar Page — Contract Grader
 *
 * Output-oriented contract test. Reads the candidate's real source files and
 * verifies the required implementation. Every assertion targets code that does
 * NOT exist in the untouched starter, so the whole file fails until the task
 * is completed.
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const read = (rel: string): Promise<string> =>
  readFile(fileURLToPath(new URL(`../../../../${rel}`, import.meta.url)), 'utf8');

describe('Level 3 Task 1 [Client]: Calendar page', () => {
  it('should create src/app/calendar/page.tsx', async () => {
    const page = await read('src/app/calendar/page.tsx');
    expect(page.length).toBeGreaterThan(0);
  });

  it('should display month names', async () => {
    const page = await read('src/app/calendar/page.tsx');
    expect(page).toMatch(/January|February|March|months?/i);
  });

  it('should provide previous / next month navigation', async () => {
    const page = await read('src/app/calendar/page.tsx');
    expect(page).toMatch(/prev|previous/i);
    expect(page).toMatch(/next/i);
  });

  it('should lay out a weekday grid', async () => {
    const page = await read('src/app/calendar/page.tsx');
    expect(page).toMatch(/Sun|Mon|Tue|Wed|Thu|Fri|Sat|grid-cols-7/i);
  });
});
