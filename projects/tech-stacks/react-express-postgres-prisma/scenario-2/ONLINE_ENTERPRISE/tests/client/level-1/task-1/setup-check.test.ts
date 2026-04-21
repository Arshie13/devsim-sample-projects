import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../..');

describe('L1T1: Development Environment Setup', () => {
  it('client dependencies are installed (client/node_modules exists)', () => {
    expect(existsSync(path.resolve(ROOT, 'client/node_modules'))).toBe(true);
  });

  it('server dependencies are installed (server/node_modules exists)', () => {
    expect(existsSync(path.resolve(ROOT, 'server/node_modules'))).toBe(true);
  });

  it('Prisma client is generated (server/node_modules/.prisma exists)', () => {
    expect(existsSync(path.resolve(ROOT, 'server/node_modules/.prisma'))).toBe(true);
  });

  it('client package.json has required React dependencies', () => {
    const pkg = JSON.parse(
      require('fs').readFileSync(path.resolve(ROOT, 'client/package.json'), 'utf-8')
    );
    expect(pkg.dependencies?.react).toBeDefined();
    expect(pkg.dependencies?.['react-dom']).toBeDefined();
  });

  it('server package.json has required Express + Prisma dependencies', () => {
    const pkg = JSON.parse(
      require('fs').readFileSync(path.resolve(ROOT, 'server/package.json'), 'utf-8')
    );
    expect(pkg.dependencies?.express).toBeDefined();
    expect(pkg.dependencies?.['@prisma/client']).toBeDefined();
  });
});
