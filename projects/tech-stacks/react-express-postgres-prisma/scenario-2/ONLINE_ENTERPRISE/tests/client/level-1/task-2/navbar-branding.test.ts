import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const NAVBAR_PATH = path.resolve(ROOT, 'client/src/components/layout/Navbar.tsx');

describe('L1T2: Navbar Brand Identity', () => {
  it('Navbar.tsx exists', () => {
    const { existsSync } = require('fs');
    expect(existsSync(NAVBAR_PATH)).toBe(true);
  });

  it('Navbar renders the exact brand string "UrbanPottery Artisan Ceramics"', () => {
    const content = readFileSync(NAVBAR_PATH, 'utf-8');
    expect(content).toContain('UrbanPottery Artisan Ceramics');
  });

  it('Brand string appears in the JSX markup (not just a comment)', () => {
    const content = readFileSync(NAVBAR_PATH, 'utf-8');
    // Must be in a JSX text node or string literal, not a comment
    const uncommented = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(uncommented).toContain('UrbanPottery Artisan Ceramics');
  });
});
