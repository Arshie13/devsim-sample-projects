import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, LogOut, Package } from 'lucide-react';
import { useAuth, useCart } from '../../context';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const isActiveLink = (path: string) => location.pathname === path;

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white border-b border-warm-100'
        }`}
      >
        <div className="page-container">
          <div className="flex justify-between h-18 py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">U</span>
                </div>
                <span className="text-xl font-bold text-warm-900">UrbanPottery</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActiveLink('/') ? 'text-primary-600 bg-primary-50' : 'text-warm-600 hover:text-primary-600'
                }`}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActiveLink('/shop') ? 'text-primary-600 bg-primary-50' : 'text-warm-600 hover:text-primary-600'
                }`}
              >
                Shop
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActiveLink('/about') ? 'text-primary-600 bg-primary-50' : 'text-warm-600 hover:text-primary-600'
                }`}
              >
                About
              </Link>
            </div>

            {/* Desktop Right Section */}
            <div className="hidden md:flex items-center gap-3">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-warm-600 hover:text-primary-600 hover:bg-warm-50 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Auth */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-warm-600 hover:bg-warm-50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-warm-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-warm-100">
                        <p className="text-sm font-semibold text-warm-800">{user?.name}</p>
                        <p className="text-xs text-warm-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-warm-700 hover:bg-warm-50 transition-colors"
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>
                      <div className="border-t border-warm-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-warm-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="px-4 py-2 text-warm-600 hover:text-primary-600 font-medium transition-colors">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 text-warm-600 hover:text-primary-600 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 text-warm-600 hover:text-primary-600 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-warm-100 bg-white">
            <div className="px-4 py-3 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg font-medium ${
                  isActiveLink('/') ? 'text-primary-600 bg-primary-50' : 'text-warm-600 hover:bg-warm-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg font-medium ${
                  isActiveLink('/shop') ? 'text-primary-600 bg-primary-50' : 'text-warm-600 hover:bg-warm-50'
                }`}
              >
                Shop
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg font-medium ${
                  isActiveLink('/about') ? 'text-primary-600 bg-primary-50' : 'text-warm-600 hover:bg-warm-50'
                }`}
              >
                About
              </Link>
              {isAuthenticated ? (
                <>
                  <div className="border-t border-warm-100 my-2 pt-2">
                    <div className="px-4 py-2 text-xs font-semibold text-warm-400 uppercase tracking-wider">Account</div>
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-warm-600 hover:bg-warm-50 rounded-lg"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2.5 text-warm-600 hover:bg-red-50 hover:text-red-600 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="border-t border-warm-100 mt-2 pt-3 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-center text-warm-600 hover:bg-warm-50 rounded-lg font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-center bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
