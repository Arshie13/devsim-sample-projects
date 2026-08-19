// @vitest-environment node

/**
 * Level 1 Task 1: Environment Setup Verification (MERN)
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

import { describe, expect, it, afterAll } from "vitest";
import { spawn, spawnSync, type ChildProcess } from "child_process";
import { join, resolve } from "path";
import fs from "fs";
import http from "http";

// ---------------------------------------------------------------------------
// Path resolution — driven by env vars so Docker containers can override
// these without touching the test file.
// ---------------------------------------------------------------------------
const projectRoot =
  process.env.DEVSIM_PROJECT_ROOT ?? resolve(process.cwd(), "..");
const clientRoot =
  process.env.DEVSIM_CLIENT_ROOT ?? join(projectRoot, "client");
const serverRoot =
  process.env.DEVSIM_SERVER_ROOT ?? join(projectRoot, "server");

// Host/port are also overridable for Docker networking
const SERVER_HOST = process.env.DEVSIM_SERVER_HOST ?? "127.0.0.1";
const SERVER_PORT = process.env.DEVSIM_SERVER_PORT ?? "5000";
const CLIENT_HOST = process.env.DEVSIM_CLIENT_HOST ?? "127.0.0.1";
const CLIENT_PORT = process.env.DEVSIM_CLIENT_PORT ?? "3000";

const pnpmCmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const pnpmExecCmd = "pnpm exec";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Kill a spawned process and its entire child tree.
 * On Windows, `shell: true` wraps the command in cmd.exe, so a plain
 * SIGTERM only kills the shell and leaves the grandchild (node/vite) alive
 * holding the port.  `taskkill /T /F` terminates the whole tree.
 */
function killTree(proc: ChildProcess): void {
  if (proc.exitCode !== null) return;
  if (process.platform === "win32" && proc.pid) {
    spawnSync("taskkill", ["/T", "/F", "/PID", String(proc.pid)], {
      shell: false,
      windowsHide: true,
    });
  } else {
    proc.kill("SIGTERM");
  }
}

/** Filter out any env values that are not strings (spawnSync requirement). */
const safeEnv = Object.fromEntries(
  Object.entries(process.env).filter(([, v]) => typeof v === "string"),
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
  extraEnv: NodeJS.ProcessEnv = {},
) => {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf-8",
    timeout: timeoutMs,
    env: { ...safeEnv, ...extraEnv },
    shell: true,
    windowsHide: true,
  });

  if (result.error) throw result.error;

  return {
    status: result.status ?? -1,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
};

/** Make an HTTP GET request and resolve with status + body. */
const httpGet = (url: string): Promise<{ statusCode: number; body: string }> =>
  new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let body = "";
      res.on("data", (chunk: Buffer | string) => {
        body += String(chunk);
      });
      res.on("end", () => resolve({ statusCode: res.statusCode ?? 0, body }));
    });
    req.on("error", reject);
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
    expectedStatus = 200,
    bodyIncludes = "",
    maxAttempts = 30,
    intervalMs = 500,
    process: proc = null as ChildProcess | null,
  } = {},
): Promise<{ healthy: boolean; lastError: string }> => {
  let lastError = "";

  for (let i = 0; i < maxAttempts; i++) {
    if (proc && proc.exitCode !== null) {
      lastError = `Process exited prematurely with code ${proc.exitCode}`;
      break;
    }

    try {
      const res = await httpGet(url);
      if (
        res.statusCode === expectedStatus &&
        (bodyIncludes === "" || res.body.includes(bodyIncludes))
      ) {
        return { healthy: true, lastError: "" };
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

// Tracks processes spawned during the suite so afterAll can clean up even
// if a test times out or Vitest is interrupted mid-run.
const spawnedProcesses: ChildProcess[] = [];

describe("Level 1 Task 1: Environment Setup", () => {
  afterAll(() => {
    for (const proc of spawnedProcesses) killTree(proc);
    spawnedProcesses.length = 0;
  });

  // -------------------------------------------------------------------------
  // Test 1 — Root dependencies precondition
  // -------------------------------------------------------------------------
  it("should have root dependencies already installed", () => {
    expect(
      fs.existsSync(join(projectRoot, "node_modules")),
      'Root node_modules missing. Run "npm install" in project root first.',
    ).toBe(true);

    expect(
      fs.existsSync(join(projectRoot, "node_modules", "concurrently")),
      'Root dependency "concurrently" missing. Run "npm install" in project root first.',
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Test 2 — Client dependencies precondition
  // -------------------------------------------------------------------------
  it("should have client dependencies already installed", () => {
    expect(
      fs.existsSync(join(clientRoot, "node_modules")),
      'Client node_modules missing. Run "npm install" in client first.',
    ).toBe(true);

    expect(
      fs.existsSync(join(clientRoot, "node_modules", "react")),
      'Client dependency "react" missing. Run "npm install" in client first.',
    ).toBe(true);

    expect(
      fs.existsSync(join(clientRoot, "node_modules", "axios")),
      'Client dependency "axios" missing. Run "npm install" in client first.',
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Test 3 — Server dependencies precondition
  // -------------------------------------------------------------------------
  it("should have server dependencies already installed", () => {
    expect(
      fs.existsSync(join(serverRoot, "node_modules")),
      'Server node_modules missing. Run "npm install" in server first.',
    ).toBe(true);

    expect(
      fs.existsSync(join(serverRoot, "node_modules", "express")),
      'Server dependency "express" missing. Run "npm install" in server first.',
    ).toBe(true);

    expect(
      fs.existsSync(join(serverRoot, "node_modules", "mongoose")),
      'Server dependency "mongoose" missing. Run "npm install" in server first.',
    ).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Test 4 — MongoDB connectivity (in-memory, isolated from local Mongo)
  // -------------------------------------------------------------------------
  it("should be able to connect to MongoDB via mongoose", () => {
    /**
     * We use mongodb-memory-server (already a server devDependency) to spin
     * up an isolated Mongo instance and verify mongoose can connect. This
     * avoids depending on a locally-running mongod and proves the server's
     * Mongo stack is wired up correctly.
     */
    const script = `
        import mongoose from 'mongoose';
        import { MongoMemoryServer } from 'mongodb-memory-server';
        (async () => {
          const mem = await MongoMemoryServer.create();
          await mongoose.connect(mem.getUri());
          await mongoose.disconnect();
          await mem.stop();
          console.log('DB_OK');
          process.exit(0);
        })().catch((err) => { console.error(err); process.exit(1); });
      `;

    const tmpFile = join(serverRoot, ".db-check.tmp.mjs");
    fs.writeFileSync(tmpFile, script);

    try {
      const result = runCommand(
        pnpmExecCmd,
        ["tsx", ".db-check.tmp.mjs"],
        serverRoot,
        60_000,
      );

      expect(
        result.status,
        `MongoDB connectivity check failed.\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
      ).toBe(0);

      expect(
        result.stdout.trim(),
        "Expected DB_OK signal from connectivity check",
      ).toContain("DB_OK");
    } finally {
      try {
        fs.unlinkSync(tmpFile);
      } catch {
        /* ignore */
      }
    }
  }, 90_000);

  // -------------------------------------------------------------------------
  // Test 5 — Backend server starts and responds on /api/health
  // -------------------------------------------------------------------------
  it("should start the backend server and respond on the /api/health endpoint", async () => {
    let serverProcess: ChildProcess | null = null;
    let logs = "";

    try {
      serverProcess = spawn(pnpmCmd, ["run", "dev"], {
        cwd: serverRoot,
        env: {
          ...safeEnv,
          PORT: SERVER_PORT,
          JWT_SECRET: safeEnv.JWT_SECRET ?? "test-secret-change-me",
        },
        stdio: ["ignore", "pipe", "pipe"],
        shell: true,
        windowsHide: true,
      });
      spawnedProcesses.push(serverProcess);

      serverProcess.stdout?.on("data", (c: Buffer | string) => {
        logs += String(c);
      });
      serverProcess.stderr?.on("data", (c: Buffer | string) => {
        logs += String(c);
      });

      const url = `http://${SERVER_HOST}:${SERVER_PORT}/api/health`;
      const { healthy, lastError } = await waitForHttp(url, {
        bodyIncludes: "ok",
        process: serverProcess,
        maxAttempts: 40,
        intervalMs: 500,
      });

      expect(
        healthy,
        `Backend did not become healthy at ${url}.\nLast HTTP error: ${lastError}\n\nServer logs:\n${logs}`,
      ).toBe(true);
    } finally {
      if (serverProcess) killTree(serverProcess);
    }
  }, 60_000);

  // -------------------------------------------------------------------------
  // Test 6 — Frontend dev server
  // -------------------------------------------------------------------------
  it("should start the client dev server and serve the application", async () => {
    let clientProcess: ChildProcess | null = null;
    let logs = "";

    try {
      clientProcess = spawn(
        pnpmCmd,
        ["run", "dev", "--", "--port", CLIENT_PORT],
        {
          cwd: clientRoot,
          env: {
            ...safeEnv,
            PORT: CLIENT_PORT,
            VITE_PORT: CLIENT_PORT,
          },
          stdio: ["ignore", "pipe", "pipe"],
          shell: true,
          windowsHide: true,
        },
      );
      spawnedProcesses.push(clientProcess);

      clientProcess.stdout?.on("data", (c: Buffer | string) => {
        logs += String(c);
      });
      clientProcess.stderr?.on("data", (c: Buffer | string) => {
        logs += String(c);
      });

      const url = `http://${CLIENT_HOST}:${CLIENT_PORT}`;
      const { healthy, lastError } = await waitForHttp(url, {
        bodyIncludes: '<div id="root">',
        process: clientProcess,
        maxAttempts: 40,
        intervalMs: 500,
      });

      expect(
        healthy,
        `Client dev server did not become healthy at ${url}.\nLast HTTP error: ${lastError}\n\nClient logs:\n${logs}`,
      ).toBe(true);
    } finally {
      if (clientProcess) killTree(clientProcess);
    }
  }, 60_000);
});
