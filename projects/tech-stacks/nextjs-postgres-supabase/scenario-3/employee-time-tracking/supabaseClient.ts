import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

// Database types based on schema
export interface Employee {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'employee' | 'manager' | 'admin';
  manager_id: number | null;
  hourly_rate: number | null;
  created_at: string;
}

export interface TimeEntry {
  id: number;
  employee_id: number;
  clock_in: string;
  clock_out: string | null;
  notes: string | null;
  created_at: string;
}

export interface TimeOffRequest {
  id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
  hours: number;
  request_type: string;
  status: 'pending' | 'approved' | 'rejected';
  notes: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface PayrollPeriod {
  id: number;
  start_date: string;
  end_date: string;
  status: 'open' | 'processing' | 'closed';
  processed_at: string | null;
  created_at: string;
}

export interface PayrollRecord {
  id: number;
  payroll_period_id: number;
  employee_id: number;
  regular_hours: number;
  overtime_hours: number;
  total_hours: number;
  hourly_rate: number;
  gross_pay: number;
  created_at: string;
}

// Combined payroll data with employee info
export interface PayrollWithEmployee extends PayrollRecord {
  employee_name: string;
  department: string;
}

// Helper function to get today's date in ISO format (YYYY-MM-DD)
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper function to get start of current week (Monday)
export function getStartOfWeek(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

// Helper function to calculate hours between two timestamps
export function calculateHours(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
}
