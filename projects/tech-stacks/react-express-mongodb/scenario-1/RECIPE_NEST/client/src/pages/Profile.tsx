import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProfile } from "../services/user.service";
import type { User } from "../types/user";
import type { Recipe } from "../types/recipe";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Avatar } from "../components/ui/Avatar";

export function ProfilePage() {
  const { username = "" } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    getProfile(username).then((p) => {
      setUser(p.user);
      setRecipes(p.recipes);
      setFollowerCount(p.followerCount);
      setFollowingCount(p.followingCount);
    });
  }, [username]);

  if (!user) return <LoadingSpinner label="Loading profile..." />;

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-4">
        <Avatar src={user.avatarUrl} name={user.name} size={64} />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-slate-500">@{user.username}</p>
          <p className="text-sm text-slate-600 mt-1">
            {followerCount} followers · {followingCount} following
          </p>
        </div>
      </header>
      <h3 className="font-semibold mt-6">Recipes ({recipes.length})</h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        {recipes.map((r) => (
          <li key={r._id}>
            <Link to={`/recipes/${r._id}`} className="text-brand-700 hover:underline">
              {r.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
