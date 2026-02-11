import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components';
import {
  Home,
  Shop,
  ProductDetails,
  Cart,
  Checkout,
  OrderConfirmation,
  Login,
  Register,
  About,
} from './pages';

// NOTE: Auth restrictions are disabled for development/testing
// All pages are directly accessible without login
// Re-enable AdminRoute, ProtectedRoute, GuestRoute when backend is connected

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/shop" element={<Layout><Shop /></Layout>} />
      <Route path="/products/:id" element={<Layout><ProductDetails /></Layout>} />
      <Route path="/cart" element={<Layout><Cart /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />

      {/* Auth Routes - accessible without restrictions for now */}
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />

      {/* Customer Routes - accessible without auth for now */}
      <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
      <Route path="/order-confirmation/:orderId" element={<Layout><OrderConfirmation /></Layout>} />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
