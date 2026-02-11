 import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';
import MembershipDetails from './membership-details';
import AttendanceHistory from './attendance-history';
import { BookedClassesProvider } from './booked-classes-context';
import MyBookedClasses from './my-booked-classes';
import ClassBooking from './class-booking';
import LogoutButton from './logout-button';

export default async function Portal() {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/');
  }

  return (
    <BookedClassesProvider userId={user.id}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-6 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">FitTech Gym Portal</h1>
                <p className="text-blue-100 mt-1">Welcome back, {user.email}</p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <MembershipDetails userId={user.id} />
              <MyBookedClasses />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <ClassBooking userId={user.id} />
              <AttendanceHistory userId={user.id} />
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
