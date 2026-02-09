import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <Link to="/" className="text-2xl font-bold hover:text-indigo-200">
            📚 BookWise
          </Link>
          <p className="text-indigo-200 text-sm">BookWise Library</p>
        </div>

        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-indigo-200">
            Home
          </Link>
          <Link to="/catalog" className="hover:text-indigo-200">
            Catalog
          </Link>

          {isAuthenticated && (
            <Link to="/dashboard" className="hover:text-indigo-200">
              Dashboard
            </Link>
          )}

          {isAuthenticated &&
            user &&
            (user.role === 'LIBRARIAN' || user.role === 'ADMIN') && (
              <>
                <Link to="/admin/books" className="hover:text-indigo-200">
                  Manage Books
                </Link>
                <Link to="/admin/records" className="hover:text-indigo-200">
                  Records
                </Link>
                <Link to="/admin/overdue" className="hover:text-indigo-200">
                  Overdue
                </Link>
              </>
            )}

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <span className="text-indigo-200 text-sm">
                {user.name}{' '}
                <span className="bg-indigo-600 px-2 py-0.5 rounded text-xs">
                  {user.role}
                </span>
              </span>
              <button
                onClick={logout}
                className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
