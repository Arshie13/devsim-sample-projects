import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Avatar size="lg" alt={user.name} src={user.avatarUrl} />
        <div>
          <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-gray-500 text-sm">@{user.username}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Email</span>
          <span className="text-gray-900">{user.email}</span>
        </div>
        {user.homeCity && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Home City</span>
            <span className="text-gray-900">{user.homeCity}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Timezone</span>
          <span className="text-gray-900">{user.timezone}</span>
        </div>
        {user.bio && (
          <div className="text-sm">
            <span className="text-gray-500 block mb-1">Bio</span>
            <p className="text-gray-700">{user.bio}</p>
          </div>
        )}
      </div>
      <Button variant="secondary" onClick={handleLogout} className="w-full">
        Sign Out
      </Button>
    </div>
  );
}
