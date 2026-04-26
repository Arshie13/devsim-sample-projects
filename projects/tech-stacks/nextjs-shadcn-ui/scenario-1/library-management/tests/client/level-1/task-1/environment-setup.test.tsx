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

  it('should have .env.local file at project root with correct environment variables', () => {
    // Check that .env.local exists at the library-management project root
    const envLocalPath = join(projectRoot, '.env.local');
    expect(
      fs.existsSync(envLocalPath),
      `.env.local file not found at ${envLocalPath}. Create it with NEXT_PUBLIC_APP_NAME and NEXT_PUBLIC_API_URL.`
    ).toBe(true);

    // Read and verify the .env.local file contents
    const envContent = fs.readFileSync(envLocalPath, 'utf-8');
    expect(
      envContent,
      '.env.local should contain NEXT_PUBLIC_APP_NAME with value BookStop Library'
    ).toMatch(/NEXT_PUBLIC_APP_NAME\s*=[\s\"]*BookStop Library[\"]*/);
    expect(
      envContent,
      '.env.local should contain NEXT_PUBLIC_API_URL with value http://localhost:3000/api'
    ).toMatch(/NEXT_PUBLIC_API_URL\s*=\s*http:\/\/localhost:3000\/api/);
  });

  it('should have NEXT_PUBLIC_APP_NAME environment variable defined', () => {
    // Load environment variables from .env.local file
    const envLocalPath = join(projectRoot, '.env.local');
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf-8');
      envContent.split('\n').forEach((line) => {
        const match = line.match(/^NEXT_PUBLIC_APP_NAME\s*=\s*[\s\"]*(.+?)[\s\"]*$/);
        if (match) {
          process.env.NEXT_PUBLIC_APP_NAME = match[1].trim();
        }
      });
    }
    expect(process.env.NEXT_PUBLIC_APP_NAME).toBe('BookStop Library');
  });

  it('should have NEXT_PUBLIC_API_URL environment variable defined', () => {
    // Load environment variables from .env.local file
    const envLocalPath = join(projectRoot, '.env.local');
    if (fs.existsSync(envLocalPath)) {
      const envContent = fs.readFileSync(envLocalPath, 'utf-8');
      envContent.split('\n').forEach((line) => {
        const match = line.match(/^NEXT_PUBLIC_API_URL\s*=\s*(.+)$/);
        if (match) {
          process.env.NEXT_PUBLIC_API_URL = match[1].trim();
        }
      });
    }
    expect(process.env.NEXT_PUBLIC_API_URL).toBe('http://localhost:3000/api');
  });
});
