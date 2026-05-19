'use client';

import { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">NOVO Enterprises POS</h1>
          <div className="flex items-center gap-6">
            <nav className="flex gap-4">
              <Link href="/admin/pos" className="hover:text-blue-200">POS</Link>
              <Link href="/admin/orders" className="hover:text-blue-200">Orders</Link>
              <Link href="/admin/coupons" className="hover:text-blue-200">Coupons</Link>
              <Link href="/admin/inventory" className="hover:text-blue-200">Inventory</Link>
            </nav>
            <button
              onClick={handleLogout}
              className="bg-white/20 px-4 py-2 rounded hover:bg-white/30"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
