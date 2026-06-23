// @vitest-environment node

/**
 * Level 1 Task 1.1: Environment Setup Verification (Client)
 *
 * Output-oriented test suite — each test RUNS the relevant command
 * and verifies the outcome, rather than assuming a pre-existing state.
 *
 * Test structure per case:
 *   1. CHECK for node_modules and key dependencies
 *   2. SURFACE actionable error messages
 */

import { describe, expect, it } from 'vitest';
import { join, resolve } from 'path';
import fs from 'fs';

// ---------------------------------------------------------------------------
// Path resolution — driven by env vars so Docker containers can override
// these without touching the test file.
// ---------------------------------------------------------------------------
const projectRoot =
  process.env.DEVSIM_PROJECT_ROOT ?? '/workspace';

// ---------------------------------------------------------------------------
// .env.local parsing helper
//
// Tolerant of how the file was authored — LF or CRLF line endings, surrounding
// whitespace, `export ` prefixes, and single/double quoted values. Splitting
// only on '\n' left a trailing '\r' on CRLF-authored files that the anchored
// `$` regex could not match (JS `.` does not match '\r'), making the test pass
// only for LF-only files.
// ---------------------------------------------------------------------------
function readEnvValue(envContent: string, key: string): string | undefined {
  for (const rawLine of envContent.split(/\r?\n/)) {
    const line = rawLine.trim();
    const match = line.match(
      new RegExp(`^(?:export\\s+)?${key}\\s*=\\s*(.*)$`)
    );
    if (match) {
      // Strip a single matching pair of surrounding quotes, if present.
      return match[1].trim().replace(/^(['"])(.*)\1$/, '$2').trim();
    }
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Level 1 Task 1.1: Environment Setup', () => {
  it('should have dependencies already installed', () => {
    expect(
      fs.existsSync(join(projectRoot, 'node_modules')),
      'node_modules missing. Run "pnpm install" first.'
    ).toBe(true);

    expect(
      fs.existsSync(join(projectRoot, 'node_modules', 'react')),
      'Dependency "react" missing. Run "pnpm install" first.'
    ).toBe(true);
  });

  it('should have .env.local file at the project root with correct environment variables', () => {
    // .env.local must live alongside the Next.js config (the project root),
    // since that is the directory `next dev` reads NEXT_PUBLIC_* variables from.
    const envLocalPath = join(projectRoot, '.env.local');
    expect(
      fs.existsSync(envLocalPath),
      `.env.local file not found at ${envLocalPath}. Create it with NEXT_PUBLIC_APP_NAME and NEXT_PUBLIC_API_URL.`
    ).toBe(true);

    // Parse with the same tolerant helper the tests below use, so quoting
    // style, LF/CRLF line endings, and surrounding whitespace are all handled
    // in one place — instead of per-variable regexes that drift out of sync.
    const envContent = fs.readFileSync(envLocalPath, 'utf-8');
    expect(
      readEnvValue(envContent, 'NEXT_PUBLIC_APP_NAME'),
      '.env.local should contain NEXT_PUBLIC_APP_NAME with value SM Tech Library'
    ).toBe('SM Tech Library');
    expect(
      readEnvValue(envContent, 'NEXT_PUBLIC_API_URL'),
      '.env.local should contain NEXT_PUBLIC_API_URL with value http://localhost:3000/api'
    ).toBe('http://localhost:3000/api');
  });

  it('should have NEXT_PUBLIC_APP_NAME environment variable defined', () => {
    // Load environment variables from .env.local file
    const envLocalPath = join(projectRoot, '.env.local');
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf-8');
      const value = readEnvValue(envContent, 'NEXT_PUBLIC_APP_NAME');
      if (value !== undefined) {
        process.env.NEXT_PUBLIC_APP_NAME = value;
      }
    }
    expect(process.env.NEXT_PUBLIC_APP_NAME).toBe('SM Tech Library');
  });

  it('should have NEXT_PUBLIC_API_URL environment variable defined', () => {
    // Load environment variables from .env.local file
    const envLocalPath = join(projectRoot, '.env.local');
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf-8');
      const value = readEnvValue(envContent, 'NEXT_PUBLIC_API_URL');
      if (value !== undefined) {
        process.env.NEXT_PUBLIC_API_URL = value;
      }
    }
    expect(process.env.NEXT_PUBLIC_API_URL).toBe('http://localhost:3000/api');
  });
});
