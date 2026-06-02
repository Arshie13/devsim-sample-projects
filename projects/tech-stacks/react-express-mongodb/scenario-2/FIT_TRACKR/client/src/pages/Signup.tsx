import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

export function Signup() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await signup(name, username, email, password);
      setAuth(token, user);
      navigate("/");
    } catch {
      setError("Could not create account. Username or email may already be taken.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <Card>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create an account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Creating…" : "Create account"}
          </Button>
        </form>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account? <Link to="/login" className="text-orange-500 hover:underline">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}
