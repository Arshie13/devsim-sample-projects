/**
 * Shared test fixtures for the City Hall Customer Support test suite.
 *
 * Most suites build the small objects they need inline; this file provides
 * typed conversation/message fixtures for tests that want a fuller shape.
 */

export interface MockMessage {
  id: string
  role: 'customer' | 'agent' | 'system'
  content: string
  timestamp: Date
}

export interface MockCustomer {
  id: string
  fullName: string
  address: string
  city: string
  zipCode: string
  complaint: string
}

export interface MockConversation {
  id: string
  customer: MockCustomer
  status: 'active' | 'waiting' | 'resolved'
  unreadCount: number
  lastMessage: string
  messages: MockMessage[]
  createdAt: Date
}

export const mockCustomer: MockCustomer = {
  id: 'c-test',
  fullName: 'Jane Tester',
  address: '101 Test Way',
  city: 'Springfield',
  zipCode: '12345',
  complaint: 'Streetlight on my block has been out for two weeks.',
}

let seq = 0

/**
 * Build a conversation fixture. Pass overrides for the fields a test cares
 * about; everything else falls back to a sensible default.
 */
export function makeConversation(
  overrides: Partial<MockConversation> = {},
): MockConversation {
  seq += 1
  return {
    id: `conv-${seq}`,
    customer: { ...mockCustomer, id: `c-${seq}` },
    status: 'active',
    unreadCount: 0,
    lastMessage: 'Test message',
    messages: [],
    createdAt: new Date(),
    ...overrides,
  }
}

export const mockConversations: MockConversation[] = [
  makeConversation({
    status: 'active',
    unreadCount: 2,
    customer: { ...mockCustomer, id: 'c1', fullName: 'John Smith' },
  }),
  makeConversation({
    status: 'waiting',
    customer: { ...mockCustomer, id: 'c2', fullName: 'Maria Garcia' },
  }),
  makeConversation({
    status: 'resolved',
    customer: { ...mockCustomer, id: 'c3', fullName: 'Robert Johnson' },
  }),
]
