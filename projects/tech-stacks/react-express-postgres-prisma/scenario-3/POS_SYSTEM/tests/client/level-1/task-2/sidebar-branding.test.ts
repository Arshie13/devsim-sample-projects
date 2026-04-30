import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');
const SIDEBAR_PATH = path.resolve(ROOT, 'client/src/components/layout/Sidebar.tsx');

describe('L1T2: Sidebar Brand Identity', () => {
  it('Sidebar.tsx exists', () => {
    expect(existsSync(SIDEBAR_PATH)).toBe(true);
  });

  it('Sidebar renders the exact brand subtitle "IPPO Software Solutions"', () => {
    const content = readFileSync(SIDEBAR_PATH, 'utf-8');
    expect(content).toContain('IPPO Software Solutions');
  });

  it('Brand subtitle appears in the JSX markup (not just a comment)', () => {
    const content = readFileSync(SIDEBAR_PATH, 'utf-8');
    const uncommented = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(uncommented).toContain('IPPO Software Solutions');
  });

  it('Old subtitle "IPPO Solutions" (without "Software") is no longer rendered on its own', () => {
    const content = readFileSync(SIDEBAR_PATH, 'utf-8');
    // Allow the new string to contain the old substring, but the old bare string
    // shouldn't appear without "Software" preceding "Solutions"
    const hasOldBareString = /IPPO Solutions(?!\s*Software)/.test(content) &&
      !/IPPO Software Solutions/.test(content.replace(/IPPO Software Solutions/g, ''));
    // Simpler assertion: after stripping the new string, old string must not remain
    const stripped = content.replace(/IPPO Software Solutions/g, '');
    expect(stripped).not.toContain('IPPO Solutions');
  });
});
