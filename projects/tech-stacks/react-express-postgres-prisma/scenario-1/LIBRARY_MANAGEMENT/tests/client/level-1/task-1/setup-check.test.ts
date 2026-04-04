// @vitest-environment node

/**
 * Level 1 Task 1: Environment Setup Verification
 *
 * Output-oriented test suite — each test RUNS the relevant command
 * and verifies the outcome, rather than assuming a pre-existing state.
 *
 * Test structure per case:
 *   1. RUN the command the student is expected to have configured
 *   2. CHECK exit code (did it succeed?)
 *   3. CHECK a specific output signal or artifact (did it do the right thing?)
 *   4. SURFACE stderr on failure (actionable feedback for the student)
 */

import { describe, expect, it } from 'vitest';
import { spawn, spawnSync, type ChildProcess } from 'child_process';
import { join, resolve } from 'path';
import fs from 'fs';
import http from 'http';

// ---------------------------------------------------------------------------
// Path resolution — driven by env vars so Docker containers can override
// these without touching the test file.
// ---------------------------------------------------------------------------
const projectRoot =
  process.env.DEVSIM_PROJECT_ROOT ?? resolve(process.cwd(), '..');
const clientRoot =
  process.env.DEVSIM_CLIENT_ROOT ?? join(projectRoot, 'client');
const serverRoot =
  process.env.DEVSIM_SERVER_ROOT ?? join(projectRoot, 'server');

// Host/port are also overridable for Docker networking
const SERVER_HOST = process.env.DEVSIM_SERVER_HOST ?? '127.0.0.1';
const SERVER_PORT = process.env.DEVSIM_SERVER_PORT ?? '5051';
const CLIENT_HOST = process.env.DEVSIM_CLIENT_HOST ?? '127.0.0.1';
const CLIENT_PORT = process.env.DEVSIM_CLIENT_PORT ?? '5173';

const npmCmd  = process.platform === 'win32' ? 'npm.cmd'  : 'npm';
const npxCmd  = process.platform === 'win32' ? 'npx.cmd'  : 'npx';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Filter out any env values that are not strings (spawnSync requirement). */
const safeEnv = Object.fromEntries(
  Object.entries(process.env).filter(([, v]) => typeof v === 'string'),
) as NodeJS.ProcessEnv;

/**
 * Run a command synchronously and return exit code + output.
 * Throws if the OS-level spawn itself errors (e.g. binary not found).
 */
const runCommand = (
  command: string,
  args: string[],
  cwd: string,
  timeoutMs = 120_000,
) => {
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
    status:  result.status ?? -1,
    stdout:  result.stdout  ?? '',
    stderr:  result.stderr  ?? '',
  };
};

/** Make an HTTP GET request and resolve with status + body. */
const httpGet = (url: string): Promise<{ statusCode: number; body: string }> =>
  new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk: Buffer | string) => { body += String(chunk); });
      res.on('end', () => resolve({ statusCode: res.statusCode ?? 0, body }));
    });
    req.on('error', reject);
    req.end();
  });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Poll a URL until it responds with the expected status code, or until the
 * attempt budget is exhausted.  Returns true when healthy.
 */
const waitForHttp = async (
  url: string,
  {
    expectedStatus  = 200,
    bodyIncludes    = '',
    maxAttempts     = 30,
    intervalMs      = 500,
    process: proc   = null as ChildProcess | null,
  } = {},
): Promise<{ healthy: boolean; lastError: string }> => {
  let lastError = '';

  for (let i = 0; i < maxAttempts; i++) {
    // Bail early if the spawned process already exited
    if (proc && proc.exitCode !== null) {
      lastError = `Process exited prematurely with code ${proc.exitCode}`;
      break;
    }

    try {
      const res = await httpGet(url);
      if (
        res.statusCode === expectedStatus &&
        (bodyIncludes === '' || res.body.includes(bodyIncludes))
      ) {
        return { healthy: true, lastError: '' };
      }
      lastError = `status=${res.statusCode} body=${res.body.slice(0, 120)}`;
    } catch (err: unknown) {
      lastError = String(err);
    }

    await sleep(intervalMs);
  }

  return { healthy: false, lastError };
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Level 1 Task 1: Environment Setup', () => {

  // -------------------------------------------------------------------------
  // Test 1 — Root dependencies precondition
  // -------------------------------------------------------------------------
  it('should have root dependencies already installed', () => {
    expect(
      fs.existsSync(join(projectRoot, 'node_modules')),
      'Root node_modules missing. Run "npm install" in project root first.',
    ).toBe(true);

    expect(
      fs.existsSync(join(projectRoot, 'node_modules', 'concurrently')),
      'Root dependency "concurrently" missing. Run "npm install" in project root first.',
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Test 2 — Client dependencies precondition
  // -------------------------------------------------------------------------
  it('should have client dependencies already installed', () => {
    expect(
      fs.existsSync(join(clientRoot, 'node_modules')),
      'Client node_modules missing. Run "npm install" in client first.',
    ).toBe(true);

    expect(
      fs.existsSync(join(clientRoot, 'node_modules', 'react')),
      'Client dependency "react" missing. Run "npm install" in client first.',
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Test 3 — Server dependencies precondition
  // -------------------------------------------------------------------------
  it('should have server dependencies already installed', () => {
    expect(
      fs.existsSync(join(serverRoot, 'node_modules')),
      'Server node_modules missing. Run "npm install" in server first.',
    ).toBe(true);

    expect(
      fs.existsSync(join(serverRoot, 'node_modules', 'express')),
      'Server dependency "express" missing. Run "npm install" in server first.',
    ).toBe(true);

    expect(
      fs.existsSync(join(serverRoot, 'node_modules', '@prisma', 'client')),
      'Server dependency "@prisma/client" missing. Run "npm install" in server first.',
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Test 4 — Database connectivity
  // -------------------------------------------------------------------------
  it(
    'should connect to the database successfully',
    () => {
      /**
       * We run a dedicated smoke-query script rather than relying on Prisma's
       * internal CLI messages (which can include the word "error" in non-error
       * contexts, making string-matching brittle).
       *
       * The script at server/scripts/db-check.ts does:
       *   await prisma.$queryRaw`SELECT 1`
       *   console.log('DB_OK')
       *   process.exit(0)
       *
       * A non-zero exit code means the DB is unreachable or misconfigured.
       */
      const result = runCommand(
        npxCmd,
        ['tsx', 'scripts/db-check.ts'],
        serverRoot,
        30_000,
      );

      expect(
        result.status,
        `Database connectivity check failed.\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
      ).toBe(0);

      // Explicit output token — we control this, so it won't false-positive
      expect(
        result.stdout.trim(),
        'Expected DB_OK signal from db-check script',
      ).toContain('DB_OK');
    },
    30_000,
  );

  // -------------------------------------------------------------------------
  // Test 5 — Prisma migrations
  // -------------------------------------------------------------------------
  it(
    'should apply database migrations without errors',
    () => {
      /**
       * We run `prisma migrate deploy` (idempotent — safe to run repeatedly)
       * instead of `migrate status`.  A zero exit code means all migrations
       * were applied successfully.  We then re-run status and look for the
       * explicit "Database schema is up to date" signal.
       */
      const deploy = runCommand(
        npxCmd,
        ['prisma', 'migrate', 'deploy', '--schema', 'prisma/schema.prisma'],
        serverRoot,
        120_000,
      );

      expect(
        deploy.status,
        `"prisma migrate deploy" failed.\n\nSTDOUT:\n${deploy.stdout}\n\nSTDERR:\n${deploy.stderr}`,
      ).toBe(0);

      // Secondary: confirm status reports everything is in sync
      const status = runCommand(
        npxCmd,
        ['prisma', 'migrate', 'status', '--schema', 'prisma/schema.prisma'],
        serverRoot,
        60_000,
      );

      const combinedOutput = `${status.stdout}\n${status.stderr}`;

      expect(
        status.status,
        `"prisma migrate status" failed after deploy.\n\nOutput:\n${combinedOutput}`,
      ).toBe(0);

      // Prisma's exact phrase when everything is applied
      expect(
        combinedOutput,
        'Expected migrations to be fully applied but status reports otherwise',
      ).toContain('Database schema is up to date');
    },
    180_000,
  );

  // -------------------------------------------------------------------------
  // Test 6 — Backend health endpoint
  // -------------------------------------------------------------------------
  it(
    'should start the backend server and respond on the /health endpoint',
    async () => {
      let serverProcess: ChildProcess | null = null;
      let logs = '';

      try {
        serverProcess = spawn(npmCmd, ['run', 'dev'], {
          cwd: serverRoot,
          env: { ...safeEnv, PORT: SERVER_PORT },
          stdio: ['ignore', 'pipe', 'pipe'],
          shell: true,
          windowsHide: true,
        });

        serverProcess.stdout?.on('data', (c: Buffer | string) => { logs += String(c); });
        serverProcess.stderr?.on('data', (c: Buffer | string) => { logs += String(c); });

        const url = `http://${SERVER_HOST}:${SERVER_PORT}/health`;
        const { healthy, lastError } = await waitForHttp(url, {
          bodyIncludes: 'ok',
          process: serverProcess,
        });

        expect(
          healthy,
          `Backend did not become healthy at ${url}.\nLast HTTP error: ${lastError}\n\nServer logs:\n${logs}`,
        ).toBe(true);
      } finally {
        if (serverProcess && serverProcess.exitCode === null) {
          serverProcess.kill('SIGTERM');
        }
      }
    },
    30_000,
  );

  // -------------------------------------------------------------------------
  // Test 7 — Frontend dev server
  // -------------------------------------------------------------------------
  it(
    'should start the client dev server and serve the application',
    async () => {
      let clientProcess: ChildProcess | null = null;
      let logs = '';

      try {
        clientProcess = spawn(npmCmd, ['run', 'dev'], {
          cwd: clientRoot,
          env: {
            ...safeEnv,
            PORT: CLIENT_PORT,  // CRA
            VITE_PORT: CLIENT_PORT,  // Vite (set in vite.config if needed)
          },
          stdio: ['ignore', 'pipe', 'pipe'],
          shell: true,
          windowsHide: true,
        });

        clientProcess.stdout?.on('data', (c: Buffer | string) => { logs += String(c); });
        clientProcess.stderr?.on('data', (c: Buffer | string) => { logs += String(c); });

        const url = `http://${CLIENT_HOST}:${CLIENT_PORT}`;
        const { healthy, lastError } = await waitForHttp(url, {
          // Vite / CRA both serve an HTML page — we look for the React root div
          bodyIncludes: '<div id="root">',
          process: clientProcess,
          maxAttempts: 40, // Vite cold-start can take longer on first run
          intervalMs: 500,
        });

        expect(
          healthy,
          `Client dev server did not become healthy at ${url}.\nLast HTTP error: ${lastError}\n\nClient logs:\n${logs}`,
        ).toBe(true);
      } finally {
        if (clientProcess && clientProcess.exitCode === null) {
          clientProcess.kill('SIGTERM');
        }
      }
    },
    30_000,
  );
});