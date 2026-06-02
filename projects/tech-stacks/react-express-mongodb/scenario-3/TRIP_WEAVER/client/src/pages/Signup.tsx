import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register as registerService } from "../services/auth.service";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await registerService({ name, username, email, password });
      login(token, user);
      navigate("/trips");
    } catch {
      setError("Registration failed. Username or email may already be taken.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h1>
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-sky-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
