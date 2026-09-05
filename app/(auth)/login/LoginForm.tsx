'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthCard } from '@/components/ui/AuthCard';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { apiFetch, ClientApiError } from '@/lib/client-api';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);

    try {
      await apiFetch('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      });
      router.push(searchParams.get('next') ?? '/');
      router.refresh();
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Log in" subtitle="Welcome back to Anchora Commerce.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="email" name="email" label="Email" type="email" autoComplete="email" required />
        <FormField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" variant="accent" className="w-full" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/60">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-medium text-navy dark:text-navy-light">
          Create one
        </Link>
      </p>
    </AuthCard>
  );
}
