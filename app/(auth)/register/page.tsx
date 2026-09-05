'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthCard } from '@/components/ui/AuthCard';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { apiFetch, ClientApiError } from '@/lib/client-api';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);

    try {
      await apiFetch('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          password: form.get('password'),
        }),
      });
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Create your account" subtitle="Start building your storefront in minutes.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="name" name="name" label="Name" type="text" autoComplete="name" required />
        <FormField id="email" name="email" label="Email" type="email" autoComplete="email" required />
        <FormField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" variant="accent" className="w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/60">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-navy dark:text-navy-light">
          Log in
        </Link>
      </p>
    </AuthCard>
  );
}
