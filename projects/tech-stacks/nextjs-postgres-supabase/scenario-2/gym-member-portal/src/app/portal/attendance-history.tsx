import { createServerClient } from '@/lib/supabase';

interface AttendanceItem {
  id: number;
  attended_at: string;
  classes: {
    name: string;
    instructor: string;
  }[];
}

export default async function AttendanceHistory({ userId }: { userId: string }) {
  const supabase = await createServerClient();
  const { data: attendances } = await supabase
    .from('attendances')
    .select(`
      id,
      attended_at,
      classes!inner(name, instructor)
    `)
    .eq('user_id', userId)
    .order('attended_at', { ascending: false });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Attendance History</h2>
      </div>

      {attendances && attendances.length > 0 ? (
        <div className="space-y-3">
          {attendances.map((att: AttendanceItem) => (
            <div
              key={att.id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100"
            >
              <div>
                <p className="font-medium text-gray-800">{att.classes[0]?.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(att.attended_at).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">Instructor: {att.classes[0]?.instructor}</p>
              </div>
              <div className="flex items-center text-green-500">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Attended</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500">No attendance records yet</p>
          <p className="text-sm text-gray-400 mt-1">Start attending classes to see your history</p>
        </div>
      )}
    </div>
  );
}
