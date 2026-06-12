// @vitest-environment node

/**
 * Level 1 Task 1: Environment Setup Verification
 *
 * Output-oriented grader — each test RUNS a real command and verifies the
 * outcome, rather than assuming a pre-existing state. The candidate's
 * Postgres password is never read here: the grader simply runs the
 * candidate's own environment and checks that it works end to end.
 */
import { describe, expect, it } from 'vitest';
import { spawnSync } from 'child_process';
import { join, resolve } from 'path';
import fs from 'fs';

// Path resolution — overridable via env so a Docker grader can relocate things.
const projectRoot = process.env.DEVSIM_PROJECT_ROOT ?? resolve(__dirname, '../../..');

const pnpmExecCmd = 'pnpm exec';

/** Only string env values — spawnSync rejects non-string values. */
const safeEnv = Object.fromEntries(
  Object.entries(process.env).filter(([, v]) => typeof v === 'string'),
) as NodeJS.ProcessEnv;

const runCommand = (command: string, args: string[], cwd: string, timeoutMs = 120_000) => {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf-8',
    timeout: timeoutMs,
    env: safeEnv,
    shell: true,
    windowsHide: true,
  });
  if (result.error) throw result.error;
  return {
    status: result.status ?? -1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
};

describe('Level 1 Task 1: Environment Setup', () => {
  it('has project dependencies installed (run "pnpm install")', () => {
    expect(
      fs.existsSync(join(projectRoot, 'node_modules')),
      'node_modules missing — run "pnpm install".',
    ).toBe(true);
    expect(
      fs.existsSync(join(projectRoot, 'node_modules', 'next')),
      'Dependency "next" missing — run "pnpm install".',
    ).toBe(true);
  });

  it('has the Prisma client dependency installed', () => {
    expect(
      fs.existsSync(join(projectRoot, 'node_modules', '@prisma', 'client')),
      'Dependency "@prisma/client" missing — run "pnpm install".',
    ).toBe(true);
  });

  it('generates the Prisma client without errors', () => {
    const result = runCommand(pnpmExecCmd, ['prisma', 'generate'], projectRoot, 120_000);
    expect(
      result.status,
      `"prisma generate" failed.\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
    ).toBe(0);
  }, 150_000);

  it('applies database migrations with "prisma migrate deploy"', () => {
    const result = runCommand(pnpmExecCmd, ['prisma', 'migrate', 'deploy'], projectRoot, 120_000);
    expect(
      result.status,
      `"prisma migrate deploy" failed.\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
    ).toBe(0);
  }, 150_000);

  it('connects to the database and finds seeded data (DB_OK)', () => {
    const result = runCommand(pnpmExecCmd, ['tsx', 'scripts/db-check.ts'], projectRoot, 45_000);
    expect(
      result.status,
      `Database check failed — verify .env DATABASE_URL, migrations and seed.\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
    ).toBe(0);
    expect(result.stdout, 'Expected DB_OK signal from db-check').toContain('DB_OK');

    const rows = Number(/ROWS=(\d+)/.exec(result.stdout)?.[1] ?? '0');
    expect(rows, 'Database has no seeded rows — run "pnpm prisma:seed".').toBeGreaterThan(0);
  }, 60_000);
});
