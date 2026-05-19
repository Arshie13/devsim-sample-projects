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
import { spawn, spawnSync, type ChildProcess } from 'child_process';
import { join, resolve } from 'path';
import fs from 'fs';
import http from 'http';

// Path resolution — overridable via env so a Docker grader can relocate things.
const projectRoot = process.env.DEVSIM_PROJECT_ROOT ?? resolve(__dirname, '../../..');
const APP_HOST = process.env.DEVSIM_APP_HOST ?? '127.0.0.1';
const APP_PORT = process.env.DEVSIM_APP_PORT ?? '3457';

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

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

const httpGet = (url: string): Promise<{ statusCode: number; body: string }> =>
  new Promise((resolvePromise, reject) => {
    const req = http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk: Buffer | string) => { body += String(chunk); });
      res.on('end', () => resolvePromise({ statusCode: res.statusCode ?? 0, body }));
    });
    req.on('error', reject);
    req.end();
  });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Poll a URL until the server answers with any non-server-error status. */
const waitForHttp = async (
  url: string,
  { maxAttempts = 60, intervalMs = 1000, process: proc = null as ChildProcess | null } = {},
): Promise<{ healthy: boolean; lastError: string }> => {
  let lastError = '';
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await httpGet(url);
      if (res.statusCode >= 200 && res.statusCode < 500) {
        return { healthy: true, lastError: '' };
      }
      lastError = `status=${res.statusCode}`;
    } catch (err: unknown) {
      lastError = String(err);
    }
    if (proc && proc.exitCode !== null) {
      lastError = `Process exited prematurely with code ${proc.exitCode}`;
      break;
    }
    await sleep(intervalMs);
  }
  return { healthy: false, lastError };
};

/** Kill a spawned process and its whole child tree (Windows-safe). */
const killProcess = (proc: ChildProcess) => {
  if (proc.exitCode !== null) return;
  if (process.platform === 'win32' && proc.pid) {
    spawnSync('taskkill', ['/T', '/F', '/PID', String(proc.pid)], { shell: true, windowsHide: true });
  } else {
    proc.kill('SIGTERM');
  }
};

describe('Level 1 Task 1: Environment Setup', () => {
  it('has project dependencies installed (run "npm install")', () => {
    expect(
      fs.existsSync(join(projectRoot, 'node_modules')),
      'node_modules missing — run "npm install".',
    ).toBe(true);
    expect(
      fs.existsSync(join(projectRoot, 'node_modules', 'next')),
      'Dependency "next" missing — run "npm install".',
    ).toBe(true);
  });

  it('has the Prisma client dependency installed', () => {
    expect(
      fs.existsSync(join(projectRoot, 'node_modules', '@prisma', 'client')),
      'Dependency "@prisma/client" missing — run "npm install".',
    ).toBe(true);
  });

  it('generates the Prisma client without errors', () => {
    const result = runCommand(npxCmd, ['prisma', 'generate'], projectRoot, 120_000);
    expect(
      result.status,
      `"prisma generate" failed.\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
    ).toBe(0);
  }, 150_000);

  it('applies database migrations with "prisma migrate deploy"', () => {
    const result = runCommand(npxCmd, ['prisma', 'migrate', 'deploy'], projectRoot, 120_000);
    expect(
      result.status,
      `"prisma migrate deploy" failed.\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
    ).toBe(0);
  }, 150_000);

  it('connects to the database and finds seeded data (DB_OK)', () => {
    // db-check.ts runs SELECT 1, then counts the classes table — proving
    // connectivity, applied migrations, and a populated seed in one shot.
    const result = runCommand(npxCmd, ['tsx', 'scripts/db-check.ts'], projectRoot, 45_000);
    expect(
      result.status,
      `Database check failed — verify .env DATABASE_URL, migrations and seed.\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
    ).toBe(0);
    expect(result.stdout, 'Expected DB_OK signal from db-check').toContain('DB_OK');

    const rows = Number(/ROWS=(\d+)/.exec(result.stdout)?.[1] ?? '0');
    expect(rows, 'Database has no seeded rows — run "npm run prisma:seed".').toBeGreaterThan(0);
  }, 60_000);

  it('starts the Next.js dev server and serves the app', async () => {
    let devProcess: ChildProcess | null = null;
    let logs = '';
    try {
      devProcess = spawn(npmCmd, ['run', 'dev'], {
        cwd: projectRoot,
        env: { ...safeEnv, PORT: APP_PORT },
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true,
        windowsHide: true,
      });
      devProcess.stdout?.on('data', (c: Buffer | string) => { logs += String(c); });
      devProcess.stderr?.on('data', (c: Buffer | string) => { logs += String(c); });

      const url = `http://${APP_HOST}:${APP_PORT}`;
      const { healthy, lastError } = await waitForHttp(url, { process: devProcess });
      expect(
        healthy,
        `Dev server did not become healthy at ${url}.\nLast error: ${lastError}\n\nLogs:\n${logs}`,
      ).toBe(true);
    } finally {
      if (devProcess) killProcess(devProcess);
    }
  }, 90_000);
});
