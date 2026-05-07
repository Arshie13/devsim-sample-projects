import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginService } from "../services/auth.service";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await loginService({ email, password });
      login(token, user);
      navigate("/trips");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h1>
        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-gray-500 text-center">
          No account?{" "}
          <Link to="/signup" className="text-sky-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
