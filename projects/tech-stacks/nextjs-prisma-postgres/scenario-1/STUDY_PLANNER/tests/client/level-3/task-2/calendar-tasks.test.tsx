/**
 * Level 3 Task 2 [Client]: Show Tasks on Calendar Dates — Contract Grader
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

describe('Level 3 Task 2 [Client]: Tasks rendered on calendar dates', () => {
  it('should show an indicator for dates that have tasks', async () => {
    const page = await read('src/app/calendar/page.tsx');
    expect(page).toMatch(/indicator|dot|count|badge/i);
  });

  it('should react to clicking a date', async () => {
    const page = await read('src/app/calendar/page.tsx');
    expect(page).toMatch(/onClick/);
  });

  it('should allow adding a task from a date cell', async () => {
    const page = await read('src/app/calendar/page.tsx');
    expect(page).toMatch(/add|new/i);
    expect(page).toMatch(/task/i);
  });
});
