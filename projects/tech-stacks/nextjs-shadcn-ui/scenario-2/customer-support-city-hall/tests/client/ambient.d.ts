/**
 * Ambient declarations for modules that students implement during the
 * challenge but don't yet exist in the starter code. Without these,
 * TypeScript would flag dynamic imports of `@/lib/intentMatcher`, etc., as
 * red-line errors before the student has had a chance to create them.
 *
 * The actual implementations replace these declarations once the file is
 * created — TypeScript prefers the real source over an ambient stub.
 */

declare module '@/lib/intentMatcher' {
  export function matchIntent(input: string): { intent: string; score: number }
  export function getAssistantReply(input: string): string
}

declare module '@/lib/quickReplies' {
  export interface QuickReply {
    id: string
    label: string
    text: string
  }
  export const quickReplies: QuickReply[]
  const _default: QuickReply[]
  export default _default
}

declare module '@/lib/priority' {
  interface PriorityConversation {
    status: string
    unreadCount: number
    createdAt: Date | string
  }
  export function getPriorityScore(conversation: PriorityConversation): number
  export function getPriorityLevel(
    conversation: PriorityConversation,
  ): 'low' | 'normal' | 'high' | 'urgent'
}

declare module '@/lib/sla' {
  interface SlaConversation {
    status: string
    messages: { role: string }[]
  }
  export function hasAgentReplied(conversation: { messages: { role: string }[] }): boolean
  export function getServiceState(
    conversation: SlaConversation,
  ): 'awaiting-first-reply' | 'in-progress' | 'resolved'
}

declare module '@/lib/queue' {
  export function estimateWaitMinutes(position: number, avgHandleMinutes?: number): number
  export function formatWait(minutes: number): string
}

declare module '@/lib/transcript' {
  interface TranscriptConversation {
    customer: { fullName: string }
    status?: string
    messages: { role: string; content: string; timestamp: Date | string }[]
  }
  export function formatTranscript(conversation: TranscriptConversation): string
}
