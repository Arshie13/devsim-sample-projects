// @vitest-environment node

/**
 * Level 1 Task 1: Environment Setup Verification
 *
 * This suite partially verifies setup outcomes:
 * - Dependencies exist for client/server
 * - Prisma migration status command succeeds
 * - Server boots and responds on /health
 */

import { describe, expect, it } from 'vitest';
import { spawn, spawnSync, type ChildProcess } from 'child_process';
import { join, resolve } from 'path';
import fs from 'fs';
import http from 'http';

// Tests run from the client package directory via npm script.
const projectRoot = resolve(process.cwd(), '..');
const clientRoot = join(projectRoot, 'client');
const serverRoot = join(projectRoot, 'server');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const safeEnv = Object.fromEntries(
  Object.entries(process.env).filter(([, value]) => typeof value === 'string'),
) as NodeJS.ProcessEnv;

const runCommand = (
  command: string,
  args: string[],
  cwd: string,
  timeout = 90_000,
) => {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf-8',
    timeout,
    env: safeEnv,
    shell: true,
    windowsHide: true,
  });

  return {
    status: result.status,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error,
  };
};

const httpGet = (url: string): Promise<{ statusCode: number; body: string }> =>
  new Promise((resolveRequest, rejectRequest) => {
    const req = http.get(url, (res: http.IncomingMessage) => {
      let body = '';
      res.on('data', (chunk: Buffer | string) => {
        body += String(chunk);
      });
      res.on('end', () => {
        resolveRequest({
          statusCode: res.statusCode ?? 0,
          body,
        });
      });
    });

    req.on('error', rejectRequest);
    req.end();
  });

const sleep = (ms: number) => new Promise((resolveSleep) => setTimeout(resolveSleep, ms));

describe('Level 1 Task 1: Setup Check', () => {
  it('should have dependencies installed for both client and server', () => {
    expect(fs.existsSync(join(clientRoot, 'node_modules'))).toBe(true);
    expect(fs.existsSync(join(serverRoot, 'node_modules'))).toBe(true);

    // Output-oriented dependency signals
    expect(fs.existsSync(join(clientRoot, 'node_modules', 'react'))).toBe(true);
    expect(fs.existsSync(join(serverRoot, 'node_modules', 'express'))).toBe(true);
    expect(fs.existsSync(join(serverRoot, 'node_modules', '@prisma', 'client'))).toBe(true);
  });

  //should be tested, remove if problematic
  it('should report prisma migration status successfully', () => {
    const result = runCommand(
      npxCmd,
      ['prisma', 'migrate', 'status', '--schema', 'prisma/schema.prisma'],
      serverRoot,
      120_000,
    );

    if (result.error) {
      throw result.error;
    }

    expect(result.status).toBe(0);
  });

  //should be tested, remove if problematic
  it('should not show migration errors in command output', () => {
    const result = runCommand(
      npxCmd,
      ['prisma', 'migrate', 'status', '--schema', 'prisma/schema.prisma'],
      serverRoot,
      120_000,
    );

    if (result.error) {
      throw result.error;
    }

    const combinedOutput = `${result.stdout}\n${result.stderr}`.toLowerCase();
    expect(result.status).toBe(0);
    expect(combinedOutput.includes('error')).toBe(false);
  });

  it('should boot the server and respond from the health endpoint', async () => {
    const port = '5051';
    let serverProcess: ChildProcess | null = null;

    try {
      serverProcess = spawn(npmCmd, ['run', 'dev'], {
        cwd: serverRoot,
        env: {
          ...safeEnv,
          PORT: port,
        },
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: true,
        windowsHide: true,
      });

      if (!serverProcess.stdout || !serverProcess.stderr) {
        throw new Error('Server process output streams were not initialized.');
      }

      let logs = '';
      serverProcess.stdout.on('data', (chunk: Buffer | string) => {
        logs += String(chunk);
      });
      serverProcess.stderr.on('data', (chunk: Buffer | string) => {
        logs += String(chunk);
      });

      const maxAttempts = 25;
      let healthy = false;

      for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        if (!serverProcess) {
          break;
        }

        if (serverProcess.exitCode !== null) {
          break;
        }

        try {
          const res = await httpGet(`http://127.0.0.1:${port}/health`);
          if (res.statusCode === 200 && res.body.includes('ok')) {
            healthy = true;
            break;
          }
        } catch {
          // Server may still be starting.
        }

        await sleep(500);
      }

      expect(healthy, `Server did not become healthy. Logs:\n${logs}`).toBe(true);
    } finally {
      if (serverProcess && serverProcess.exitCode === null) {
        serverProcess.kill('SIGTERM');
      }
    }
  }, 30_000);
});
