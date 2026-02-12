import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderOpen,
  ClipboardList,
  BarChart3,
  Settings,
  AlertTriangle,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'POS / Checkout', href: '/pos', icon: ShoppingCart },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Categories', href: '/categories', icon: FolderOpen },
  { name: 'Orders', href: '/orders', icon: ClipboardList },
  { name: 'Inventory', href: '/inventory', icon: AlertTriangle },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

// Demo user for testing without auth
const demoUser = {
  name: 'Demo Admin',
  role: 'ADMIN' as const,
};

export default function Sidebar() {

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">POS System</h1>
        <p className="text-sm text-gray-400">IPPO Solutions</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
            <span className="text-sm font-medium">
              {demoUser.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{demoUser.name}</p>
            <p className="text-xs text-gray-400">{demoUser.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
