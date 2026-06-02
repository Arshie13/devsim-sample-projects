import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40" role="banner">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-sky-500">TripWeaver</span>
          {/* L1-T2 BUG (intentional): subtitle is a placeholder.
              Students must change this to "Plan Together. Travel Smarter." */}
          <span className="text-xs text-gray-400">Your Tagline Here</span>
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/trips/new" className="text-sm text-gray-600 hover:text-sky-500">New Trip</Link>
              <Link to={`/profile/${user.username}`} className="text-sm text-gray-600 hover:text-sky-500">
                @{user.username}
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link to="/signup"><Button size="sm">Sign up</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
