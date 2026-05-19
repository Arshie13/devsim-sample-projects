'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    try {
      const res = await fetch(`/api/bookings?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setBookedClasses(data as BookedClassData[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: number) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshBookedClasses();
        return true;
      }
    } catch (err) {
      console.error(err);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
