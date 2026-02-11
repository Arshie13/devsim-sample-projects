'use client';

import { useBookedClasses } from './booked-classes-context';

export default function MyBookedClasses() {
  const { bookedClasses, loading, cancelBooking } = useBookedClasses();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">My Booked Classes</h2>
        <div className="animate-pulse space-y-3">
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">My Booked Classes</h2>
      {bookedClasses.length > 0 ? (
        <div className="space-y-3">
          {bookedClasses.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
            >
              <div>
                <p className="font-medium text-gray-800">{booking.classes.name}</p>
                <p className="text-sm text-gray-500">
                  {booking.classes.schedule} • {booking.classes.instructor}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Booked: {new Date(booking.booked_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={async () => {
                  if (confirm('Are you sure you want to cancel this booking?')) {
                    await cancelBooking(booking.id);
                  }
                }}
                className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-3 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>No classes booked yet</p>
          <p className="text-sm">Book a class to see it here</p>
        </div>
      )}
    </div>
  );
}
