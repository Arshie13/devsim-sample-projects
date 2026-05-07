import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../services/user.service";
import type { User } from "../types/user";
import type { Workout } from "../types/workout";
import { Avatar } from "../components/ui/Avatar";
import { WorkoutCard } from "../components/workout/WorkoutCard";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export function Profile() {
  const { username } = useParams<{ username: string }>();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    getUserProfile(username)
      .then(({ user, workouts }) => {
        setProfileUser(user);
        setWorkouts(workouts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner size="lg" /></div>;
  if (!profileUser) return <div className="text-center py-16 text-gray-400">User not found.</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Avatar initials={profileUser.username} size="lg" src={profileUser.avatarUrl} />
        <div>
          <h1 className="text-xl font-bold text-gray-800">{profileUser.name}</h1>
          <p className="text-sm text-gray-500">@{profileUser.username}</p>
          {profileUser.bio && <p className="text-sm text-gray-600 mt-1">{profileUser.bio}</p>}
          <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700 capitalize">{profileUser.role}</span>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-700">Workouts ({workouts.length})</h2>
      {workouts.length === 0 && <p className="text-gray-400">No workouts logged yet.</p>}
      <div className="flex flex-col gap-4">
        {workouts.map((w) => <WorkoutCard key={w._id} workout={w} />)}
      </div>
    </div>
  );
}
