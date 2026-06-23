/**
 * Level 5 - Task 5.2: Date Utilities & Documentation
 * Tests for date utility functions and documentation completeness
 */

import { describe, it, expect, beforeEach } from 'vitest'
// Import the candidate's own date utilities, not the test helper.
import { formatDate, isOverdue } from '@/lib/dateUtils'

// Helper function to get all files recursively with specific extensions
function getAllFiles(dir: string, extensions: string[]): string[] {
  const fs = require('fs');
  const path = require('path');
  
  let results: string[] = [];
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, extensions));
    } else {
      if (extensions.some(ext => filePath.endsWith(ext))) {
        results.push(filePath);
      }
    }
  }
  
  return results;
}

describe('Level 5 - Task 5.2: Utilities & Documentation', () => {
  describe('Date Utilities', () => {
    it('should format date string to readable format', () => {
      const formatted = formatDate('2026-01-15')
      expect(formatted).toBe('Jan 15, 2026')
    })

    it('should return false for invalid dates', () => {
      expect(formatDate('invalid')).toBe('')
      expect(formatDate('')).toBe('')
    })

    it('should identify overdue dates', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      expect(isOverdue(pastDate)).toBe(true)
    })

    it('should identify non-overdue dates', () => {
      const futureDate = new Date(Date.now() + 1209600000).toISOString().split('T')[0]
      expect(isOverdue(futureDate)).toBe(false)
    })

    it('should handle invalid date strings gracefully', () => {
      expect(isOverdue('invalid')).toBe(false)
      expect(isOverdue('')).toBe(false)
    })
  })

  describe('Documentation', () => {
    beforeEach(() => {
      const mockLibrarian = {
        id: '1',
        username: 'admin',
        password: 'admin123',
        name: 'Admin Librarian',
      }
      localStorage.setItem('librarian', JSON.stringify(mockLibrarian))
    })

    it('should have README.md with feature documentation', () => {
      const fs = require('fs');
      const path = require('path');
      
      const readmePath = path.resolve(__dirname, '../../../../README.md');
      expect(fs.existsSync(readmePath)).toBe(true);
      
      const readmeContent = fs.readFileSync(readmePath, 'utf8');
      // The default create-next-app README is generic boilerplate. The task
      // requires documenting THIS project's own features, so check for
      // library-management-specific documentation the candidate must add.
      expect(readmeContent).toMatch(/library management/i);
      expect(readmeContent).toMatch(/\bbook/i);
      expect(readmeContent).toMatch(/feature/i);
      expect(readmeContent.length).toBeGreaterThan(100); // Reasonable length
    })

    it('should have code comments in source files', () => {
      const fs = require('fs');
      const path = require('path');
      
      const srcDir = path.resolve(__dirname, '../../../src');
      const files = getAllFiles(srcDir, ['.tsx', '.ts']);
      
      let totalFiles = 0;
      let filesWithComments = 0;
      
      for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        totalFiles++;
        
        // Check for JSDoc comments (/**) or regular comments (// or /*)
        if (content.includes('/**') || content.includes('//') || content.includes('/*')) {
          filesWithComments++;
        }
      }
      
      // At least 80% of files should have some form of comments
      expect(filesWithComments / totalFiles).toBeGreaterThanOrEqual(0.8);
    })
  })
})
