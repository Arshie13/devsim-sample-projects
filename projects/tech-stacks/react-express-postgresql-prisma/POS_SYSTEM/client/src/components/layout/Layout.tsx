import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-64 p-6">
        {children}
      </main>
    </div>
  );
}
