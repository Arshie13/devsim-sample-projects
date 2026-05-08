/**
 * Ambient declarations for modules that students implement during the
 * challenge but don't yet exist in the starter code. Without these,
 * TypeScript would flag dynamic imports of `@/lib/dateUtils`, etc., as
 * red-line errors before the student has had a chance to create them.
 *
 * The actual implementations replace these declarations once the file is
 * created — TypeScript prefers the real source over an ambient stub.
 */

declare module '@/lib/dateUtils' {
  export function formatDueDate(date: Date | string): string
  export function isOverdue(date: Date | string): boolean
  export function daysUntilDue(date: Date | string): number
}

declare module '@/hooks/useLocalStorage' {
  export function useLocalStorage<T>(
    key: string,
    initialValue: T,
  ): [T, (value: T) => void]
  const _default: typeof useLocalStorage
  export default _default
}

declare module '@/app/dashboard/notes/page' {
  const NotesPage: () => JSX.Element
  export default NotesPage
}

declare module '@/components/StatCard' {
  import type { LucideIcon } from 'lucide-react'
  export interface StatCardProps {
    title: string
    value: string | number
    subtitle?: string
    icon: LucideIcon
    valueClassName?: string
  }
  export const StatCard: (props: StatCardProps) => JSX.Element
  export default StatCard
}
