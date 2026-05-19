/**
 * Level 4 Task 2 [Client]: Notifications Page & Unread Badge — Contract Grader
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

const readAny = async (rels: string[]): Promise<string> => {
  for (const rel of rels) {
    try {
      return await read(rel);
    } catch {
      /* try the next candidate path */
    }
  }
  throw new Error(`Expected one of these files to exist: ${rels.join(', ')}`);
};

describe('Level 4 Task 2 [Client]: Notifications page & unread badge', () => {
  it('should create src/app/notifications/page.tsx', async () => {
    const page = await read('src/app/notifications/page.tsx');
    expect(page.length).toBeGreaterThan(0);
  });

  it('should fetch and render the notification list', async () => {
    const page = await read('src/app/notifications/page.tsx');
    expect(page).toMatch(/\/api\/notifications/);
    expect(page).toMatch(/map\s*\(/);
  });

  it('should show an unread-count badge in a shared UI surface', async () => {
    const code = await readAny([
      'src/app/layout.tsx',
      'src/app/notifications/page.tsx',
    ]);
    expect(code).toMatch(/unread/i);
    expect(code).toMatch(/badge|count/i);
  });

  it('should offer a mark-as-read action per notification', async () => {
    const page = await read('src/app/notifications/page.tsx');
    expect(page).toMatch(/mark.*read|read/i);
    expect(page).toMatch(/onClick/);
  });
});
