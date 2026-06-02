import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/recipe-nest-logo.svg" alt="RecipeNest" width={36} height={36} />
          <div>
            <h1 className="text-lg font-bold text-brand-700 leading-none">RecipeNest</h1>
            {/*
              L1-T2 BUG (intentional): the brand subtitle below is a placeholder.
              The required final text is "Cook. Share. Inspire." — students must
              update this single JSX text node in Level 1 task 2.
            */}
            <p className="brand-subtitle text-xs text-slate-500 mt-0.5">Your kitchen, online</p>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" className={({ isActive }) => (isActive ? "text-brand-700 font-medium" : "text-slate-700")}>
            Feed
          </NavLink>
          {user ? (
            <>
              <NavLink to="/saved" className={({ isActive }) => (isActive ? "text-brand-700 font-medium" : "text-slate-700")}>
                Saved
              </NavLink>
              <NavLink to="/recipes/new" className={({ isActive }) => (isActive ? "text-brand-700 font-medium" : "text-slate-700")}>
                New Recipe
              </NavLink>
              <Link to={`/profile/${user.username}`} className="flex items-center gap-2">
                <Avatar src={user.avatarUrl} name={user.name} size={28} />
                <span className="hidden sm:inline text-slate-700">@{user.username}</span>
              </Link>
              <Button variant="ghost" onClick={logout}>Log out</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-700">Log in</Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
