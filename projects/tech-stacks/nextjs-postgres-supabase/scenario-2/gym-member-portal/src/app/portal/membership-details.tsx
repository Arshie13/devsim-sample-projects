import { createServerClient } from '@/lib/supabase';

export default async function MembershipDetails({ userId }: { userId: string }) {
  const supabase = await createServerClient();
  const { data: membership } = await supabase
    .from('memberships')
    .select('*')
    .eq('user_id', userId)
    .single();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Membership</h2>
      </div>
      
      {membership ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Type</span>
            <span className="font-medium text-gray-800 capitalize">{membership.type}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              membership.status === 'active' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {membership.status}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Start Date</span>
            <span className="font-medium text-gray-800">
              {new Date(membership.start_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">End Date</span>
            <span className="font-medium text-gray-800">
              {new Date(membership.end_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-yellow-700 font-medium">No Active Membership</p>
          <p className="text-sm text-gray-500 mt-1">Please renew your membership to access all features</p>
        </div>
      )}
    </div>
  );
}
