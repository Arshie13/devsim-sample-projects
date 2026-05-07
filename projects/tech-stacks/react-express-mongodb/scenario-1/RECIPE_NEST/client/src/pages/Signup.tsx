import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await signup({ name, username, email, password });
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err?.message ?? "Signup failed");
    }
  }

  return (
    <form onSubmit={submit} className="max-w-sm space-y-3">
      <h2 className="text-2xl font-bold">Sign up</h2>
      <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      <Button type="submit">Create account</Button>
    </form>
  );
}
