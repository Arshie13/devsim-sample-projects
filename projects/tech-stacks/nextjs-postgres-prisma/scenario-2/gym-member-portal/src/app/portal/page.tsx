import { prisma } from '@/lib/prisma';
import MembershipDetails from '@/components/membership-details';
import AttendanceHistory from '@/components/attendance-history';
import { BookedClassesProvider } from '@/components/booked-classes-context';
import MyBookedClasses from '@/components/my-booked-classes';
import ClassBooking from '@/components/class-booking';

export default async function Portal() {
  // Authentication has been removed — the portal loads the first seeded member.
  const user = await prisma.user.findFirst({ orderBy: { created_at: 'asc' } });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
          <h1 className="text-xl font-bold text-gray-800 mb-2">No member found</h1>
          <p className="text-gray-500">
            Run <code className="bg-gray-100 px-1 rounded">pnpm prisma:seed</code> to
            populate the database with a demo member.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BookedClassesProvider userId={user.user_id}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">FitTech Gym Portal</h1>
                <p className="text-blue-100 mt-1">Welcome back, {user.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <MembershipDetails userId={user.user_id} />
              <MyBookedClasses />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <ClassBooking userId={user.user_id} />
              <AttendanceHistory userId={user.user_id} />
            </div>
          </div>
        </main>

        <footer className="bg-gray-800 text-gray-400 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2024 FitTech Systems. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </BookedClassesProvider>
  );
}
