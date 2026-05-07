import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold text-sky-700 mb-4">TripWeaver</h1>
        <p className="text-xl text-gray-600 mb-8">
          Plan together. Explore the world — one stop at a time.
        </p>
        <div className="flex gap-4 justify-center">
          {user ? (
            <Link
              to="/trips"
              className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors"
            >
              My Trips
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-white text-sky-600 border border-sky-300 rounded-xl font-semibold hover:bg-sky-50 transition-colors"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
