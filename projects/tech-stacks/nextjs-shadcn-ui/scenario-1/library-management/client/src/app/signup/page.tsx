'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

interface NewLibrarian {
  username: string;
  password: string;
  name: string;
}

export default function SignupPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Get existing librarians from localStorage
    const existingLibrarians = JSON.parse(localStorage.getItem('librarians') || '[]');
    
    // Check if username already exists
    const usernameExists = existingLibrarians.some(
      (lib: NewLibrarian) => lib.username === username
    );

    if (usernameExists) {
      setError('Username already exists');
      return;
    }

    // Add new librarian
    const newLibrarian: NewLibrarian = {
      username,
      password,
      name,
    };

    localStorage.setItem('librarians', JSON.stringify([...existingLibrarians, newLibrarian]));
    setSuccess(true);

    // Redirect to login after 2 seconds
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 dark:bg-amber-950">
      <Card className="w-full max-w-md border-amber-200 dark:border-amber-800">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-serif text-amber-900 dark:text-amber-100">SM Tech Library</CardTitle>
          <CardDescription className="text-amber-700 dark:text-amber-400">Create Librarian Account</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-6">
              <div className="text-green-600 text-lg font-medium mb-2">
                Account created successfully!
              </div>
              <p className="text-amber-600 text-sm">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950 rounded-md border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>

              <div className="text-center text-sm text-amber-700 dark:text-amber-400 mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-amber-800 dark:text-amber-300 hover:underline font-medium">
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
