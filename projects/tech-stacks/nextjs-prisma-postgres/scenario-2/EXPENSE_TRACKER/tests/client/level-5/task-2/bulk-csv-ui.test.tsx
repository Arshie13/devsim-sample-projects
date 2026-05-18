/**
 * Level 5 Task 2 [Client]: Bulk & CSV UI — Contract Grader
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

describe('Level 5 Task 2 [Client]: Bulk & CSV UI', () => {
  it('should render a checkbox per expense row', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/type=["']checkbox["']/i);
  });

  it('should provide a select-all control and a selected-count display', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/select.?all/i);
    expect(page).toMatch(/selected/i);
  });

  it('should provide an export control wired to the export route', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/\/api\/expenses\/export/);
  });

  it('should provide a CSV file-upload input wired to the import route', async () => {
    const page = await read('src/app/page.tsx');
    expect(page).toMatch(/type=["']file["']/i);
    expect(page).toMatch(/\/api\/expenses\/import/);
  });
});
