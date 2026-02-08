'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useBookedClasses } from './booked-classes-context';

interface ClassItem {
  id: number;
  name: string;
  schedule: string;
  instructor: string;
  capacity: number;
}

interface BookingCount {
  class_id: number;
  count: number;
}

export default function ClassBooking({ userId }: { userId: string }) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingClassId, setBookingClassId] = useState<number | null>(null);
  const [bookingCounts, setBookingCounts] = useState<BookingCount[]>([]);
  const [error, setError] = useState('');
  const { refreshBookedClasses, bookedClasses } = useBookedClasses();
  const supabase = createClient();

  const fetchBookingCounts = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('class_id');
    
    if (data) {
      const counts: Record<number, number> = {};
      data.forEach((item) => {
        counts[item.class_id] = (counts[item.class_id] || 0) + 1;
      });
      
      const countsArray = Object.entries(counts).map(([classId, count]) => ({
        class_id: parseInt(classId),
        count: count as number,
      }));
      
      setBookingCounts(countsArray);
    }
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data } = await supabase.from('classes').select('*').order('id');
      if (data && mounted) {
        setClasses(data as ClassItem[]);
      }
      await fetchBookingCounts();
      if (mounted) {
        setLoading(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      await fetchBookingCounts();
    };
    if (mounted) {
      init();
    }
    return () => {
      mounted = false;
    };
  }, [bookedClasses]);

  const getAvailableSpots = (classItem: ClassItem) => {
    const bookedCount = bookingCounts.find((c) => c.class_id === classItem.id)?.count || 0;
    return classItem.capacity - bookedCount;
  };

  const isAlreadyBooked = (classId: number) => {
    return bookedClasses.some((b) => b.class_id === classId);
  };

  const bookClass = async (classId: number) => {
    setBookingClassId(classId);
    setError('');

    if (isAlreadyBooked(classId)) {
      setError('You have already booked this class!');
      setBookingClassId(null);
      return;
    }

    const { error } = await supabase.from('bookings').insert({ user_id: userId, class_id: classId });
    
    if (error) {
      setError(`Error booking class: ${error.message}`);
    } else {
      await refreshBookedClasses();
      setBookingCounts((prev) => {
        const existing = prev.find((c) => c.class_id === classId);
        if (existing) {
          return prev.map((c) => c.class_id === classId ? { ...c, count: c.count + 1 } : c);
        }
        return [...prev, { class_id: classId, count: 1 }];
      });
      alert('Class booked successfully!');
    }
    setBookingClassId(null);
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Classes</h2>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Available Classes</h2>
      </div>

      {error && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <p className="text-yellow-700 text-sm">{error}</p>
        </div>
      )}

      {classes.length > 0 ? (
        <div className="space-y-3">
          {classes.map((cls) => {
            const availableSpots = getAvailableSpots(cls);
            const isBooked = isAlreadyBooked(cls.id);
            const isFull = availableSpots <= 0;

            return (
              <div
                key={cls.id}
                className={`p-4 rounded-lg border ${
                  isBooked
                    ? 'bg-gray-50 border-gray-200 opacity-75'
                    : isFull
                    ? 'bg-red-50 border-red-100'
                    : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{cls.name}</p>
                    <p className="text-sm text-gray-500">{cls.schedule}</p>
                    <p className="text-sm text-gray-500">Instructor: {cls.instructor}</p>
                    <p className={`text-xs mt-1 font-medium ${
                      isFull ? 'text-red-500' : availableSpots <= 3 ? 'text-yellow-600' : 'text-emerald-600'
                    }`}>
                      {isFull
                        ? 'Class is full'
                        : `${availableSpots} spots available`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {isBooked ? (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        ✓ Booked
                      </span>
                    ) : (
                      <button
                        onClick={() => bookClass(cls.id)}
                        disabled={bookingClassId === cls.id || isFull}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isFull
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        }`}
                      >
                        {bookingClassId === cls.id ? 'Booking...' : 'Book'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No classes available</p>
        </div>
      )}
    </div>
  );
}
