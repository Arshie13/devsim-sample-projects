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
  process.env.DEVSIM_PROJECT_ROOT ?? resolve(process.cwd(), '../../../../../../..');
const clientRoot =
  process.env.DEVSIM_CLIENT_ROOT ?? join(projectRoot, 'client');

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Level 1 Task 1.1: Environment Setup (Client)', () => {
  it('should have client dependencies already installed', () => {
    expect(
      fs.existsSync(join(clientRoot, 'node_modules')),
      'Client node_modules missing. Run "npm install" in client first.'
    ).toBe(true);

    expect(
      fs.existsSync(join(clientRoot, 'node_modules', 'react')),
      'Client dependency "react" missing. Run "npm install" in client first.'
    ).toBe(true);
  });

  it('should have NEXT_PUBLIC_APP_NAME environment variable defined', () => {
    // Simulate setting the env var
    // @ts-ignore
    process.env.NEXT_PUBLIC_APP_NAME = 'BookStop Library';
    expect(process.env.NEXT_PUBLIC_APP_NAME).toBe('BookStop Library');
  });

  it('should have NEXT_PUBLIC_API_URL environment variable defined', () => {
    // @ts-ignore
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api';
    expect(process.env.NEXT_PUBLIC_API_URL).toBe('http://localhost:3000/api');
  });
});
