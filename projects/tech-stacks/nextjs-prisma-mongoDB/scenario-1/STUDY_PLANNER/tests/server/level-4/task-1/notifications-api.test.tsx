/**
 * Level 4 Task 1 [Server]: Notification Model & Reminders API — Contract Grader
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

describe('Level 4 Task 1 [Server]: Notifications API', () => {
  it('should define a Notification model with message, read and createdAt', async () => {
    const schema = await read('prisma/schema.prisma');
    expect(schema).toMatch(/model\s+Notification/);
    const model = schema.slice(
      schema.indexOf('model Notification'),
      schema.indexOf('}', schema.indexOf('model Notification')) + 1,
    );
    expect(model).toMatch(/message/i);
    expect(model).toMatch(/read|isRead/i);
    expect(model).toMatch(/createdAt/);
  });

  it('should expose GET and POST handlers on the notifications route', async () => {
    const code = await read('src/app/api/notifications/route.ts');
    expect(code).toMatch(/export\s+(async\s+)?function\s+GET|export\s+const\s+GET/);
    expect(code).toMatch(/export\s+(async\s+)?function\s+POST|export\s+const\s+POST/);
  });

  it('should generate reminders from upcoming deadlines', async () => {
    const code = await read('src/app/api/notifications/route.ts');
    expect(code).toMatch(/deadline/);
    expect(code).toMatch(/1|3|7|day|week/i);
  });

  it('should expose a PATCH handler that marks a notification read', async () => {
    const code = await read('src/app/api/notifications/[id]/route.ts');
    expect(code).toMatch(/export\s+(async\s+)?function\s+(PATCH|PUT)|export\s+const\s+(PATCH|PUT)/);
    expect(code).toMatch(/update/);
    expect(code).toMatch(/read|isRead/);
  });
});
