/**
 * Level 2 Task 2 [Client]: Filter & Search Controls — Contract Grader
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

describe('Level 2 Task 2 [Client]: Filter & search controls', () => {
  it('should render a subject filter dropdown', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/<select/i);
  });

  it('should offer a pending/completed status filter', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/pending/i);
  });

  it('should render a task search input', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/placeholder=["'][^"']*search/i);
  });

  it('should send the selected filters to the tasks API', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/URLSearchParams|[?&](subjectId|completed|search|status)=/);
  });
});
