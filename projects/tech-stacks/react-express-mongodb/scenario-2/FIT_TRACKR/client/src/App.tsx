import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";
import { Feed } from "./pages/Feed";
import { WorkoutDetail } from "./pages/WorkoutDetail";
import { WorkoutForm } from "./pages/WorkoutForm";
import { Profile } from "./pages/Profile";
import { MyStreak } from "./pages/MyStreak";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/workouts/:id" element={<WorkoutDetail />} />
            <Route path="/log" element={<WorkoutForm />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/streak" element={<MyStreak />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
