import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, CartProvider } from './context';
import { Layout } from './components/layout';
import {
  LoginPage,
  RegisterPage,
  DashboardPage,
  POSPage,
  ProductsPage,
  CategoriesPage,
  OrdersPage,
  InventoryPage,
  ReportsPage,
  SettingsPage,
} from './pages';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <Layout>
                  <DashboardPage />
                </Layout>
              }
            />
            <Route
              path="/pos"
              element={
                <Layout>
                  <POSPage />
                </Layout>
              }
            />
            <Route
              path="/products"
              element={
                <Layout>
                  <ProductsPage />
                </Layout>
              }
            />
            <Route
              path="/categories"
              element={
                <Layout>
                  <CategoriesPage />
                </Layout>
              }
            />
            <Route
              path="/orders"
              element={
                <Layout>
                  <OrdersPage />
                </Layout>
              }
            />
            <Route
              path="/inventory"
              element={
                <Layout>
                  <InventoryPage />
                </Layout>
              }
            />
            <Route
              path="/reports"
              element={
                <Layout>
                  <ReportsPage />
                </Layout>
              }
            />
            <Route
              path="/settings"
              element={
                <Layout>
                  <SettingsPage />
                </Layout>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
