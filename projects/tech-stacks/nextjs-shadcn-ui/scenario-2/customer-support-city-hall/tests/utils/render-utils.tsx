/**
 * Shared test utilities and mock data for City Hall Customer Support tests.
 */

export interface MockCustomer {
  id: string
  fullName: string
  address: string
  city: string
  zipCode: string
  complaint: string
}

export interface MockMessage {
  id: string
  role: 'customer' | 'agent' | 'system'
  content: string
  timestamp: Date
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

export const mockComplaintHistory = [
  {
    fullName: 'Jane Tester',
    address: '101 Test Way',
    city: 'Springfield',
    zipCode: '12345',
    complaint: 'Streetlight on my block has been out for two weeks.',
    submittedAt: '2026-04-20T10:00:00.000Z',
  },
  {
    fullName: 'Jane Tester',
    address: '101 Test Way',
    city: 'Springfield',
    zipCode: '12345',
    complaint: 'Followup on the streetlight repair request.',
    submittedAt: '2026-05-01T15:30:00.000Z',
  },
]

export const mockConversations: MockConversation[] = [
  {
    id: 'conv-1',
    customer: {
      id: 'c1',
      fullName: 'John Smith',
      address: '456 Oak Avenue',
      city: 'Springfield',
      zipCode: '12345',
      complaint: 'Trash was not collected last Tuesday.',
    },
    status: 'active',
    unreadCount: 2,
    lastMessage: 'I need help immediately!',
    createdAt: new Date('2026-05-07T10:00:00.000Z'),
    messages: [
      {
        id: 'm1',
        role: 'system',
        content: 'Customer connected to agent',
        timestamp: new Date('2026-05-07T10:00:00.000Z'),
      },
      {
        id: 'm2',
        role: 'customer',
        content: 'Hi, my trash was not collected.',
        timestamp: new Date('2026-05-07T10:01:00.000Z'),
      },
      {
        id: 'm3',
        role: 'customer',
        content: 'I need help immediately!',
        timestamp: new Date('2026-05-07T10:02:00.000Z'),
      },
    ],
  },
  {
    id: 'conv-2',
    customer: {
      id: 'c2',
      fullName: 'Maria Garcia',
      address: '789 Pine Street',
      city: 'Springfield',
      zipCode: '12346',
      complaint: 'Need information on a business permit.',
    },
    status: 'waiting',
    unreadCount: 0,
    lastMessage: 'Thank you, I will wait.',
    createdAt: new Date('2026-05-07T09:00:00.000Z'),
    messages: [],
  },
  {
    id: 'conv-3',
    customer: {
      id: 'c3',
      fullName: 'Robert Johnson',
      address: '321 Maple Drive',
      city: 'Springfield',
      zipCode: '12347',
      complaint: 'Property tax assessment dispute.',
    },
    status: 'resolved',
    unreadCount: 0,
    lastMessage: 'Thank you for your help!',
    createdAt: new Date('2026-05-06T08:00:00.000Z'),
    messages: [],
  },
]

/**
 * Date utilities re-implemented for use in test assertions.
 * Mirrors the contract students implement in `src/lib/dateUtils.ts` (Level 5 Task 2).
 */
export function formatDate(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function isOverdue(dateString: string): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return false
  return date.getTime() < Date.now()
}
