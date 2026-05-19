/**
 * Level 3 Task 2 [Client]: Recurring Expense UI — Contract Grader
 *
 * Output-oriented contract test. Reads the candidate's real source files and
 * verifies the required implementation. Every assertion targets code that does
 * NOT exist in the untouched starter, so the whole file fails until the task
 * is completed.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const read = (rel: string): Promise<string> =>
  readFile(path.join(__dirname, '..', '..', '..', '..', rel), 'utf8');

describe('Level 3 Task 2 [Client]: Recurring expense UI', () => {
  it('should add a recurring checkbox to the add-expense form', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/recurring/i);
    expect(page).toMatch(/type=["']checkbox["']/i);
  });

  it('should provide a frequency selector', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/weekly|monthly|frequency/i);
  });

  it('should mark recurring expenses with a badge', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/recurring/i);
    expect(page).toMatch(/badge|tag|label/i);
  });

  it('should surface upcoming generated entries', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/upcoming/i);
  });
});
