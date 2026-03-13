import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/books', label: 'Books', icon: '📚' },
  { to: '/members', label: 'Members', icon: '👥' },
  { to: '/borrow', label: 'Borrow / Return', icon: '🔄' },
  { to: '/overdue', label: 'Overdue', icon: '⚠️' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-indigo-900 text-white flex flex-col min-h-screen">
      <div className="px-6 py-6 border-b border-indigo-800">
        <h1 className="text-xl font-bold">📚 BookWise</h1>
        <p className="text-indigo-300 text-xs mt-1">Library Management System</p>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-800 text-white border-r-4 border-indigo-400'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-indigo-800">
        {user && (
          <div className="mb-3">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-indigo-300">{user.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full text-sm text-indigo-300 hover:text-white transition-colors text-left"
        >
          🚪 Sign Out
        </button>
      </div>

      <div className="px-6 py-4 border-t border-indigo-800 text-indigo-400 text-xs">
        &copy; {new Date().getFullYear()} BookWise Library
      </div>
    </aside>
  );
}
