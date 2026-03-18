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
import { AuthProvider } from '../../../../client/src/context/AuthContext';

const EXPECTED_SUBTITLE = 'BookWise Public Library';
const OLD_SUBTITLE = 'Library Management System';

// Wrapper if Sidebar uses router links
const renderSidebar = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
      <Sidebar />
      </AuthProvider>
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
  });

  describe('Branding Requirements', () => {
    it('should render subtitle as visible text', () => {
      renderSidebar();
      const subtitleEl = screen.getByText(EXPECTED_SUBTITLE);
      expect(subtitleEl).toBeVisible();
    });
  });

});