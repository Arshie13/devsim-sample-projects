import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
// import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { BookDetails } from './pages/BookDetails';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/dashboard/Dashboard';
import { BorrowHistory } from './pages/dashboard/BorrowHistory';
import { ManageBooks } from './pages/admin/ManageBooks';
import { BorrowRecords } from './pages/admin/BorrowRecords';
import { Overdue } from './pages/admin/Overdue';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Member Routes - No auth required for dev */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/history" element={<BorrowHistory />} />

        {/* Librarian / Admin Routes - No auth required for dev */}
        <Route path="/admin/books" element={<ManageBooks />} />
        <Route path="/admin/records" element={<BorrowRecords />} />
        <Route path="/admin/overdue" element={<Overdue />} />
      </Route>
    </Routes>
  );
}

export default App;
