/**
 * Level 2 Task 2 [Client]: Category Customization UI — Contract Grader
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

describe('Level 2 Task 2 [Client]: Category customization UI', () => {
  it('should provide a color picker for categories', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/type=["']color["']/i);
  });

  it('should provide an icon selector for categories', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/icon/i);
  });

  it('should support inline editing of category names', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/editingCategory|editCategory|isEditing|inline/i);
  });

  it('should show a delete confirmation modal', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/modal|dialog/i);
  });

  it('should show the expense count per category', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/_count/);
  });
});
