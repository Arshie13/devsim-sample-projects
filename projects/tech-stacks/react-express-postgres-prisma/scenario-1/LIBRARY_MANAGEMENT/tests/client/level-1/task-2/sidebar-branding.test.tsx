/**
 * Level 1 Task 2: Header Branding
 * Tests for the sidebar branding
 *
 * Acceptance Criteria:
 * - AC-1: Header subtitle is exactly "BookWise Public Library"
 * - AC-2: Subtitle renders correctly on desktop and mobile layouts
 */

/// <reference types="@testing-library/jest-dom" />

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from '../../../../client/src/components/layout/Sidebar';

const EXPECTED_SUBTITLE = 'BookWise Public Library';
const OLD_SUBTITLE = 'Library Management System';

// Wrapper if Sidebar uses router links
const renderSidebar = () =>
  render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>
  );

describe('Level 1 Task 2: Header Branding', () => {

  describe('Subtitle Validation', () => {
    it('should render the correct subtitle in the sidebar', () => {
      renderSidebar();
      expect(screen.getByText(EXPECTED_SUBTITLE)).toBeInTheDocument();
    });

    it('should not display the old subtitle', () => {
      renderSidebar();
      expect(screen.queryByText(OLD_SUBTITLE)).toBeNull();
    });

    it('should be case sensitive', () => {
      renderSidebar();
      expect(screen.queryByText('bookwise public library')).toBeNull();
      expect(screen.queryByText('BOOKWISE PUBLIC LIBRARY')).toBeNull();
    });
  });

  describe('Branding Requirements', () => {
    it('should have BookWise in the sidebar header', () => {
      renderSidebar();
      // Checks the title/logo area
      expect(screen.getByText(/BookWise/i)).toBeInTheDocument();
    });

    it('should render subtitle as visible text', () => {
      renderSidebar();
      const subtitleEl = screen.getByText(EXPECTED_SUBTITLE);
      expect(subtitleEl).toBeVisible();
    });
  });

});

describe('Level 1 Task 2: Hidden Branding Tests', () => {
  it('should not accept subtitle with extra leading/trailing whitespace', () => {
    renderSidebar();
    // getByText exact match — padded versions won't match
    expect(screen.queryByText(' BookWise Public Library')).toBeNull();
    expect(screen.queryByText('BookWise Public Library ')).toBeNull();
  });

  it('should not accept subtitle with double spaces', () => {
    renderSidebar();
    expect(screen.queryByText('BookWise  Public Library')).toBeNull();
  });

  it('should not accept subtitle with special characters appended', () => {
    renderSidebar();
    expect(screen.queryByText('BookWise Public Library!')).toBeNull();
    expect(screen.queryByText('BookWise Public Library - Test')).toBeNull();
  });

});