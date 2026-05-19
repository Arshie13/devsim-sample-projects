/**
 * Level 4 Task 2 [Client]: Budgets Page & Alerts — Contract Grader
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

describe('Level 4 Task 2 [Client]: Budgets page & alerts', () => {
  it('should create src/app/budgets/page.tsx', async () => {
    const page = await read('src/app/budgets/page.tsx');
    expect(page.length).toBeGreaterThan(0);
  });

  it('should let the user set a budget per category via the budgets API', async () => {
    const page = await read('src/app/budgets/page.tsx');
    expect(page).toMatch(/category/i);
    expect(page).toMatch(/\/api\/budgets/);
  });

  it('should show a progress bar for each budget', async () => {
    const page = await read('src/app/budgets/page.tsx');
    expect(page).toMatch(/progress|width:/i);
  });

  it('should display an over-budget warning', async () => {
    const page = await read('src/app/budgets/page.tsx');
    expect(page).toMatch(/over.?budget|warning|exceed|alert/i);
  });
});
