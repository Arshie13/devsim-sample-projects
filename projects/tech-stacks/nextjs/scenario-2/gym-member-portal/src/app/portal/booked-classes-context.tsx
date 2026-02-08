'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase';

interface BookedClassData {
  id: number;
  class_id: number;
  booked_at: string;
  classes: {
    id: number;
    name: string;
    schedule: string;
    instructor: string;
    capacity: number;
  };
}

interface BookedClassesContextType {
  bookedClasses: BookedClassData[];
  loading: boolean;
  refreshBookedClasses: () => Promise<void>;
  cancelBooking: (bookingId: number) => Promise<boolean>;
}

const BookedClassesContext = createContext<BookedClassesContextType | undefined>(undefined);

export function BookedClassesProvider({ children, userId }: { children: ReactNode; userId: string }) {
  const [bookedClasses, setBookedClasses] = useState<BookedClassData[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshBookedClasses = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        id,
        class_id,
        booked_at,
        classes (
          id,
          name,
          schedule,
          instructor,
          capacity
        )
      `)
      .eq('user_id', userId)
      .order('booked_at', { ascending: false });

    if (!error && data) {
      const formattedData = data.map((item) => ({
        id: item.id,
        class_id: item.class_id,
        booked_at: item.booked_at,
        classes: Array.isArray(item.classes) ? item.classes[0] : item.classes,
      }));
      setBookedClasses(formattedData as BookedClassData[]);
    }
    setLoading(false);
  };

  const cancelBooking = async (bookingId: number) => {
    const supabase = createClient();
    const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
    
    if (!error) {
      await refreshBookedClasses();
      return true;
    }
    return false;
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      await refreshBookedClasses();
    };
    if (mounted) {
      init();
    }
    return () => {
      mounted = false;
    };
  }, [userId]);

  return (
    <BookedClassesContext.Provider value={{ bookedClasses, loading, refreshBookedClasses, cancelBooking }}>
      {children}
    </BookedClassesContext.Provider>
  );
}

export function useBookedClasses() {
  const context = useContext(BookedClassesContext);
  if (context === undefined) {
    throw new Error('useBookedClasses must be used within a BookedClassesProvider');
  }
  return context;
}
