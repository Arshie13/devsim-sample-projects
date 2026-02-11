'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, Employee, TimeEntry, TimeOffRequest, PayrollPeriod, PayrollRecord, PayrollWithEmployee, getTodayDate, getStartOfWeek, calculateHours } from '../../supabaseClient';


interface EmployeeWithStatus {
  id: number;
  name: string;
  department: string;
  position: string;
  avatar: string;
  status: 'clocked-in' | 'clocked-out' | 'on-break' | 'off-site';
  clockInTime: string;
  clockOutTime: string | null;
  totalHoursToday: number;
  totalHoursThisWeek: number;
}


function getStatusColor(status: string): string {
  switch (status) {
    case 'clocked-in':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'clocked-out':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'on-break':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'off-site':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}


function getTimeOffTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'vacation':
      return 'bg-blue-100 text-blue-800';
    case 'sick':
      return 'bg-red-100 text-red-800';
    case 'personal':
      return 'bg-purple-100 text-purple-800';
    case 'unpaid':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState<'attendance' | 'timeoff' | 'payroll'>('attendance');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [payrollPeriods, setPayrollPeriods] = useState<PayrollPeriod[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollWithEmployee[]>([]);
  const [employeesWithStatus, setEmployeesWithStatus] = useState<EmployeeWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .neq('role', 'admin');

      if (employeesError) throw employeesError;
      setEmployees(employeesData || []);

      const weekStart = getStartOfWeek();

      const { data: timeEntriesData, error: timeEntriesError } = await supabase
        .from('time_entries')
        .select('*')
        .gte('clock_in', weekStart);

      if (timeEntriesError) throw timeEntriesError;
      setTimeEntries(timeEntriesData || []);

      const { data: timeOffData, error: timeOffError } = await supabase
        .from('time_off_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (timeOffError) throw timeOffError;
      setTimeOffRequests(timeOffData || []);

      const { data: periodsData, error: periodsError } = await supabase
        .from('payroll_periods')
        .select('*')
        .order('start_date', { ascending: false });

      if (periodsError) throw periodsError;
      setPayrollPeriods(periodsData || []);

      const { data: recordsData, error: recordsError } = await supabase
        .from('payroll_records')
        .select('*')
        .order('id', { ascending: false });

      if (recordsError) throw recordsError;

      const enrichedRecords: PayrollWithEmployee[] = (recordsData || []).map((record) => {
        const emp = employeesData?.find((e) => e.id === record.employee_id);
        return {
          ...record,
          employee_name: emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown',
          department: emp?.first_name === 'Sarah' || emp?.first_name === 'Robert' ? 'Engineering' :
                       emp?.first_name === 'Michael' ? 'Design' :
                       emp?.first_name === 'Emily' ? 'Marketing' :
                       emp?.first_name === 'James' ? 'Sales' : 'HR',
        };
      });

      setPayrollRecords(enrichedRecords);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data from database. Using demo data.');
      loadDemoData();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadDemoData = () => {
    const demoEmployees: Employee[] = [
      { id: 1, email: 'sarah@workpulse.com', first_name: 'Sarah', last_name: 'Johnson', role: 'employee', manager_id: null, hourly_rate: 75, created_at: '2024-01-01' },
      { id: 2, email: 'michael@workpulse.com', first_name: 'Michael', last_name: 'Chen', role: 'employee', manager_id: null, hourly_rate: 65, created_at: '2024-01-15' },
      { id: 3, email: 'emily@workpulse.com', first_name: 'Emily', last_name: 'Davis', role: 'employee', manager_id: null, hourly_rate: 70, created_at: '2024-02-01' },
      { id: 4, email: 'james@workpulse.com', first_name: 'James', last_name: 'Wilson', role: 'employee', manager_id: null, hourly_rate: 55, created_at: '2024-02-15' },
      { id: 5, email: 'lisa@workpulse.com', first_name: 'Lisa', last_name: 'Anderson', role: 'employee', manager_id: null, hourly_rate: 60, created_at: '2024-03-01' },
      { id: 6, email: 'robert@workpulse.com', first_name: 'Robert', last_name: 'Taylor', role: 'employee', manager_id: null, hourly_rate: 80, created_at: '2024-03-15' },
    ];

    const demoTimeEntries: TimeEntry[] = [
      { id: 1, employee_id: 1, clock_in: '2026-02-09T09:00:00', clock_out: null, notes: null, created_at: '2026-02-09' },
      { id: 2, employee_id: 2, clock_in: '2026-02-09T08:45:00', clock_out: null, notes: null, created_at: '2026-02-09' },
      { id: 3, employee_id: 3, clock_in: '2026-02-09T09:15:00', clock_out: null, notes: null, created_at: '2026-02-09' },
      { id: 4, employee_id: 4, clock_in: '2026-02-09T08:30:00', clock_out: null, notes: null, created_at: '2026-02-09' },
      { id: 5, employee_id: 5, clock_in: '2026-02-09T09:00:00', clock_out: '2026-02-09T18:00:00', notes: null, created_at: '2026-02-09' },
      { id: 6, employee_id: 6, clock_in: '2026-02-09T07:30:00', clock_out: null, notes: null, created_at: '2026-02-09' },
    ];

    const demoTimeOffRequests: TimeOffRequest[] = [
      { id: 1, employee_id: 1, start_date: '2026-02-20', end_date: '2026-02-24', hours: 40, request_type: 'vacation', status: 'pending', notes: 'Family vacation', reviewed_by: null, reviewed_at: null, created_at: '2026-02-01' },
      { id: 2, employee_id: 3, start_date: '2026-02-10', end_date: '2026-02-10', hours: 8, request_type: 'sick', status: 'pending', notes: 'Not feeling well', reviewed_by: null, reviewed_at: null, created_at: '2026-02-09' },
      { id: 3, employee_id: 2, start_date: '2026-02-15', end_date: '2026-02-15', hours: 8, request_type: 'personal', status: 'pending', notes: 'Personal appointment', reviewed_by: null, reviewed_at: null, created_at: '2026-02-05' },
      { id: 4, employee_id: 4, start_date: '2026-03-01', end_date: '2026-03-05', hours: 40, request_type: 'vacation', status: 'approved', notes: 'Spring break', reviewed_by: 1, reviewed_at: '2026-01-20', created_at: '2026-01-15' },
    ];

    const demoPayrollPeriods: PayrollPeriod[] = [
      { id: 1, start_date: '2026-02-01', end_date: '2026-02-15', status: 'closed', processed_at: '2026-02-16T10:00:00', created_at: '2026-02-01' },
      { id: 2, start_date: '2026-02-16', end_date: '2026-02-28', status: 'open', processed_at: null, created_at: '2026-02-16' },
    ];

    const demoPayrollRecords: PayrollWithEmployee[] = [
      { id: 1, payroll_period_id: 1, employee_id: 1, regular_hours: 40, overtime_hours: 5, total_hours: 45, hourly_rate: 75, gross_pay: 3375, created_at: '2026-02-16', employee_name: 'Sarah Johnson', department: 'Engineering' },
      { id: 2, payroll_period_id: 1, employee_id: 2, regular_hours: 40, overtime_hours: 2, total_hours: 42, hourly_rate: 65, gross_pay: 2795, created_at: '2026-02-16', employee_name: 'Michael Chen', department: 'Design' },
      { id: 3, payroll_period_id: 1, employee_id: 3, regular_hours: 38, overtime_hours: 4, total_hours: 42, hourly_rate: 70, gross_pay: 3080, created_at: '2026-02-16', employee_name: 'Emily Davis', department: 'Marketing' },
      { id: 4, payroll_period_id: 1, employee_id: 5, regular_hours: 40, overtime_hours: 0, total_hours: 40, hourly_rate: 60, gross_pay: 2400, created_at: '2026-02-16', employee_name: 'Lisa Anderson', department: 'HR' },
      { id: 5, payroll_period_id: 1, employee_id: 6, regular_hours: 40, overtime_hours: 8, total_hours: 48, hourly_rate: 80, gross_pay: 4160, created_at: '2026-02-16', employee_name: 'Robert Taylor', department: 'Engineering' },
    ];

    setEmployees(demoEmployees);
    setTimeEntries(demoTimeEntries);
    setTimeOffRequests(demoTimeOffRequests);
    setPayrollPeriods(demoPayrollPeriods);
    setPayrollRecords(demoPayrollRecords);
  };

  useEffect(() => {
    if (employees.length === 0) return;

    const today = getTodayDate();
    const weekStart = getStartOfWeek();

    const processedEmployees: EmployeeWithStatus[] = employees.map((emp) => {
      const todayEntry = timeEntries.find(
        (entry) => entry.employee_id === emp.id && entry.clock_in.startsWith(today)
      );

      const weekEntries = timeEntries.filter(
        (entry) => entry.employee_id === emp.id && entry.clock_in >= weekStart
      );

      let hoursToday = 0;
      if (todayEntry) {
        if (todayEntry.clock_out) {
          hoursToday = calculateHours(todayEntry.clock_in, todayEntry.clock_out);
        } else {
          hoursToday = calculateHours(todayEntry.clock_in, new Date().toISOString());
        }
      }

      let hoursThisWeek = 0;
      weekEntries.forEach((entry) => {
        if (entry.clock_out) {
          hoursThisWeek += calculateHours(entry.clock_in, entry.clock_out);
        }
      });

      let status: EmployeeWithStatus['status'] = 'clocked-out';
      if (todayEntry) {
        status = todayEntry.clock_out ? 'clocked-out' : 'clocked-in';
      }

      const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      };

      return {
        id: emp.id,
        name: `${emp.first_name} ${emp.last_name}`,
        department: emp.first_name === 'Sarah' || emp.first_name === 'Robert' ? 'Engineering' :
                    emp.first_name === 'Michael' ? 'Design' :
                    emp.first_name === 'Emily' ? 'Marketing' :
                    emp.first_name === 'James' ? 'Sales' : 'HR',
        position: emp.first_name === 'Sarah' ? 'Senior Developer' :
                  emp.first_name === 'Robert' ? 'DevOps Engineer' :
                  emp.first_name === 'Michael' ? 'UI/UX Designer' :
                  emp.first_name === 'Emily' ? 'Marketing Manager' :
                  emp.first_name === 'James' ? 'Sales Representative' : 'HR Specialist',
        avatar: `${emp.first_name[0]}${emp.last_name[0]}`,
        status,
        clockInTime: todayEntry ? formatTime(todayEntry.clock_in) : '-',
        clockOutTime: todayEntry?.clock_out ? formatTime(todayEntry.clock_out) : null,
        totalHoursToday: Math.round(hoursToday * 10) / 10,
        totalHoursThisWeek: Math.round(hoursThisWeek * 10) / 10,
      };
    });

    setEmployeesWithStatus(processedEmployees);
  }, [employees, timeEntries]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTimeOffAction = async (requestId: number, action: 'approved' | 'rejected') => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('time_off_requests')
        .update({
          status: action,
          reviewed_by: 1,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      setTimeOffRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: action } : req))
      );
    } catch (err) {
      console.error('Error updating request:', err);
      setTimeOffRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: action } : req))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    totalEmployees: employeesWithStatus.length,
    clockedIn: employeesWithStatus.filter((e) => e.status === 'clocked-in').length,
    onBreak: employeesWithStatus.filter((e) => e.status === 'on-break').length,
    offSite: employeesWithStatus.filter((e) => e.status === 'off-site').length,
    pendingRequests: timeOffRequests.filter((r) => r.status === 'pending').length,
    totalPayroll: payrollRecords.reduce((sum, p) => sum + p.gross_pay, 0),
  };

  const getEmployeeName = (employeeId: number): string => {
    const emp = employees.find((e) => e.id === employeeId);
    return emp ? `${emp.first_name} ${emp.last_name}` : 'Unknown';
  };

  if (isLoading && employees.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WorkPulse</h1>
                <p className="text-sm text-gray-500">Manager Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchData}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Refresh Data
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">John Manager</p>
                <p className="text-xs text-gray-500">HR Manager</p>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">JM</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Currently Working</p>
                <p className="text-2xl font-bold text-gray-900">{stats.clockedIn + stats.onBreak + stats.offSite}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Payroll</p>
                <p className="text-2xl font-bold text-gray-900">${(stats.totalPayroll / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'attendance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Team Attendance
            </button>
            <button
              onClick={() => setActiveTab('timeoff')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'timeoff'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Time-Off Requests
              {stats.pendingRequests > 0 && (
                <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs">
                  {stats.pendingRequests}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('payroll')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'payroll'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payroll Reports
            </button>
          </nav>
        </div>

        {activeTab === 'attendance' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Team Attendance Today</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Export Report
              </button>
            </div>
            {employeesWithStatus.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No employee data found. Connect to Supabase to view attendance.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clock In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clock Out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours Today
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hours This Week
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employeesWithStatus.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-700">{employee.avatar}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                              <div className="text-sm text-gray-500">{employee.position}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(employee.status)}`}>
                            {employee.status.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.clockInTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.clockOutTime || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.totalHoursToday.toFixed(1)}h
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.totalHoursThisWeek.toFixed(1)}h
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeoff' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Pending Time-Off Requests</h2>
              </div>
              {timeOffRequests.filter((r) => r.status === 'pending').length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No pending time-off requests
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {timeOffRequests
                    .filter((r) => r.status === 'pending')
                    .map((request) => (
                      <div key={request.id} className="px-6 py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-sm font-medium text-gray-900">{getEmployeeName(request.employee_id)}</span>
                              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getTimeOffTypeColor(request.request_type)}`}>
                                {request.request_type.charAt(0).toUpperCase() + request.request_type.slice(1)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {request.start_date} → {request.end_date} ({request.hours} hours)
                            </p>
                            <p className="text-sm text-gray-500">{request.notes || 'No reason provided'}</p>
                            <p className="text-xs text-gray-400 mt-1">Submitted: {request.created_at.split('T')[0]}</p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleTimeOffAction(request.id, 'approved')}
                              disabled={isLoading}
                              className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleTimeOffAction(request.id, 'rejected')}
                              disabled={isLoading}
                              className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Request History</h2>
              </div>
              {timeOffRequests.filter((r) => r.status !== 'pending').length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No request history
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Range
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {timeOffRequests
                        .filter((r) => r.status !== 'pending')
                        .map((request) => (
                          <tr key={request.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {getEmployeeName(request.employee_id)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getTimeOffTypeColor(request.request_type)}`}>
                                {request.request_type.charAt(0).toUpperCase() + request.request_type.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {request.start_date} → {request.end_date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {request.created_at.split('T')[0]}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'payroll' && (
          <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Payroll Periods</h3>
                  <p className="text-sm text-gray-500 mt-1">Select a period to view payroll records</p>
                </div>
                <div className="flex space-x-3">
                  {payrollPeriods.map((period) => (
                    <button
                      key={period.id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        period.status === 'open'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      {period.start_date} - {period.end_date}
                      <span className="ml-2 text-xs uppercase">{period.status}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

              <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Payroll Records</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Export CSV
                </button>
              </div>
              {payrollRecords.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No payroll records available
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Regular Hours
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Overtime Hours
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Hours
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hourly Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gross Pay
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payrollRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{record.employee_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.regular_hours.toFixed(1)}h
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.overtime_hours > 0 ? (
                              <span className="text-red-600 font-medium">{record.overtime_hours.toFixed(1)}h</span>
                            ) : (
                              <span className="text-gray-400">0h</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.total_hours.toFixed(1)}h
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${record.hourly_rate.toFixed(2)}/hr
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ${record.gross_pay.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900">
                          Total
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {payrollRecords.reduce((sum, p) => sum + p.total_hours, 0).toFixed(1)}h
                        </td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4 text-sm font-bold text-green-600">
                          ${stats.totalPayroll.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {payrollRecords.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Regular Hours</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {payrollRecords.reduce((sum, p) => sum + p.regular_hours, 0).toFixed(1)}h
                  </p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Overtime Hours</h3>
                  <p className="text-2xl font-bold text-red-600">
                    {payrollRecords.reduce((sum, p) => sum + p.overtime_hours, 0).toFixed(1)}h
                  </p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Hours</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {payrollRecords.reduce((sum, p) => sum + p.total_hours, 0).toFixed(1)}h
                  </p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Gross Pay</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ${payrollRecords.reduce((sum, p) => sum + p.gross_pay, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
