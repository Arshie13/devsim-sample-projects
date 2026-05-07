import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";
import Landing from "./pages/Landing";
import TripList from "./pages/TripList";
import TripDetail from "./pages/TripDetail";
import TripForm from "./pages/TripForm";
import ExpenseForm from "./pages/ExpenseForm";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/trips" element={<TripList />} />
            <Route path="/trips/new" element={<TripForm />} />
            <Route path="/trips/:slug" element={<TripDetail />} />
            <Route path="/trips/:slug/expenses/new" element={<ExpenseForm />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
