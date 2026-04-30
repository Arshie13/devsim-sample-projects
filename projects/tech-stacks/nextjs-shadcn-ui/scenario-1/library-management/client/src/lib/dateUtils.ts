/**
 * Date utility functions for the library management system
 */

/**
 * Formats a date string (YYYY-MM-DD) to a readable format (Mon DD, YYYY)
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string or empty string if invalid
 */
export function formatDate(dateString: string): string {
  if (!dateString || typeof dateString !== 'string') {
    return ''
  }

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return ''
    }

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }

    return date.toLocaleDateString('en-US', options)
  } catch {
    return ''
  }
}

/**
 * Checks if a date string represents an overdue date (in the past)
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns true if the date is in the past, false otherwise
 */
export function isOverdue(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false
  }

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return false
    }

    // Set time to end of day to avoid timezone issues
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return endOfDay < today
  } catch {
    return false
  }
}