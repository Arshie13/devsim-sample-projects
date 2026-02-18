'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockLibrarians } from '../../lib/mockData';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check mock librarians first
    const mockLibrarian = mockLibrarians.find(
      (lib) => lib.username === username && lib.password === password
    );

    if (mockLibrarian) {
      localStorage.setItem('librarian', JSON.stringify(mockLibrarian));
      router.push('/dashboard');
      return;
    }

    // Check registered librarians from localStorage
    const registeredLibrarians = JSON.parse(localStorage.getItem('librarians') || '[]');
    const registeredLibrarian = registeredLibrarians.find(
      (lib: { username: string; password: string; name: string }) => lib.username === username && lib.password === password
    );

    if (registeredLibrarian) {
      localStorage.setItem('librarian', JSON.stringify(registeredLibrarian));
      router.push('/dashboard');
    } else {
      setError('Invalid username or password');
    }
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
          <CardDescription className="text-amber-700 dark:text-amber-400">Librarian Portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950 rounded-md border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
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
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="text-center text-sm text-amber-700 dark:text-amber-400 mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-amber-800 dark:text-amber-300 hover:underline font-medium">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
