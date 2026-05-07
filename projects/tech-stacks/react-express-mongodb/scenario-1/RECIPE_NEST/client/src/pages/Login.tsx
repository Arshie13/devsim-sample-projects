import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(emailOrUsername, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err?.message ?? "Login failed");
    }
  }

  return (
    <form onSubmit={submit} className="max-w-sm space-y-3">
      <h2 className="text-2xl font-bold">Log in</h2>
      <Input placeholder="Email or username" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      <Button type="submit">Log in</Button>
    </form>
  );
}
