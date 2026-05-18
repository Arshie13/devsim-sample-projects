/**
 * Level 1 Task 2 [Client]: Highlight Overdue Tasks — Contract Grader
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

describe('Level 1 Task 2 [Client]: Overdue task highlighting', () => {
  it('should mark overdue tasks on the homepage', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/overdue/i);
  });

  it('should determine overdue tasks by comparing the deadline to the current date', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/new Date\(\s*\)|Date\.now/);
    expect(page).toMatch(/deadline/);
  });
});
