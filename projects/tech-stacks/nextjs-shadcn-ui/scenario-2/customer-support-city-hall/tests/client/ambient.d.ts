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
  export function formatRelativeTime(date: Date | string): string
  export function isStale(date: Date | string): boolean
  export function formatTimestamp(date: Date | string): string
}

declare module '@/hooks/useLocalStorage' {
  export function useLocalStorage<T>(
    key: string,
    initialValue: T,
  ): [T, (value: T) => void]
  const _default: typeof useLocalStorage
  export default _default
}

declare module '@/app/support/history/page' {
  const HistoryPage: () => JSX.Element
  export default HistoryPage
}

declare module '@/components/MessageBubble' {
  export interface MessageBubbleProps {
    message: {
      id: string
      role: 'customer' | 'agent' | 'user' | 'ai' | 'system'
      content: string
      timestamp: Date
    }
    viewer: 'customer' | 'agent'
  }
  export const MessageBubble: (props: MessageBubbleProps) => JSX.Element
  export default MessageBubble
}
