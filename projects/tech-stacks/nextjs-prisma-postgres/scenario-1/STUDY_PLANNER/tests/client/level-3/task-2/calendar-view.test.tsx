/**
 * Level 3 Task 2: Calendar View - Client Unit Contract Tests
 *
 * These tests are output-oriented and intentionally fail on starter code.
 * They verify the required implementation contract directly in real source files.
 */

import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

const readCalendarPage = async () =>
  readFile('../../../../src/app/calendar/page.tsx', 'utf8');

const readTasksPage = async () =>
  readFile('../../../../src/app/page.tsx', 'utf8');

describe('Level 3 Task 2: Calendar View Client Contracts', () => {
  describe('AC-1: Calendar Navigation', () => {
    it('should have navigation controls in calendar', async () => {
      const pageCode = await readCalendarPage();

      expect(pageCode).toMatch(/previous.*next|prev.*next|<.*>/i);
    });

    it('should display month and year', async () => {
      const pageCode = await readCalendarPage();

      expect(pageCode).toMatch(/January|February|March|April|May|June|July|August|September|October|November|December/i);
      expect(pageCode).toMatch(/20\d{2}|202\d|20\d{2}/i);
    });
  });

  describe('AC-2: Calendar Grid', () => {
    it('should display days of the week header', async () => {
      const pageCode = await readCalendarPage();

      expect(pageCode).toMatch(/Sun|Mon|Tue|Wed|Thu|Fri|Sat/i);
    });

    it('should render calendar grid cells', async () => {
      const pageCode = await readCalendarPage();

      expect(pageCode).toMatch(/grid|table|row.*col|cell/i);
    });
  });

  describe('AC-3: Task Display', () => {
    it('should show task indicators on dates', async () => {
      const pageCode = await readCalendarPage();

      expect(pageCode).toMatch(/task.*dot|indicator|marker|event/i);
    });

    it('should color-code tasks by subject or priority', async () => {
      const pageCode = await readCalendarPage();

      expect(pageCode).toMatch(/color|style|class.*priority|class.*subject/i);
    });
  });

  describe('AC-4: View Toggle', () => {
    it('should have view toggle buttons', async () => {
      const pageCode = await readCalendarPage();

      expect(pageCode).toMatch(/month.*week.*day|week.*day|month.*day/i);
    });

    it('should support week view', async () => {
      const pageCode = await readCalendarPage();

      expect(pageCode).toMatch(/week|Week/i);
    });

    it('should support day view', async () => {
      const pageCode = await readCalendarPage();

      expect(pageCode).toMatch(/day|Day/i);
    });
  });
});

describe('Level 3 Task 2: Hidden Contract Guards', () => {
  it('should highlight today date', async () => {
    const pageCode = await readCalendarPage();

    expect(pageCode).toMatch(/today|current.*date|highlight.*today/i);
  });

  it('should allow adding task from date cell', async () => {
    const pageCode = await readCalendarPage();

    expect(pageCode).toMatch(/add.*task|new.*task|create.*task|onClick.*add/i);
  });
});