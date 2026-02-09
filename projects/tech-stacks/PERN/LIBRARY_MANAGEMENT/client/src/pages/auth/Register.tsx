import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function Register() {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    clearError();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? '');
        if (key && !errors[key]) {
          errors[key] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    const success = await register(result.data);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create Account
        </h1>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="name"
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.currentTarget.value)}
            error={fieldErrors.name}
            placeholder="Enter your full name"
          />

          <Input
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.currentTarget.value)}
            error={fieldErrors.email}
            placeholder="Enter your email"
          />

          <Input
            id="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.currentTarget.value)}
            error={fieldErrors.password}
            placeholder="Create a password (min 6 characters)"
          />

          <Button type="submit" loading={loading} className="mt-2">
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Login
          </Link>
        </p>
      </Card>
    </div>
  );
}
