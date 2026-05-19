import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">NOVO Enterprises POS</h1>
          <nav className="flex gap-4">
            <Link href="/admin/pos" className="hover:text-blue-200">POS</Link>
            <Link href="/admin/orders" className="hover:text-blue-200">Orders</Link>
            <Link href="/admin/coupons" className="hover:text-blue-200">Coupons</Link>
            <Link href="/admin/inventory" className="hover:text-blue-200">Inventory</Link>
          </nav>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
