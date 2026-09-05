'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center py-24">
      <Container className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold text-red-600">Error</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mt-3 text-foreground/70">
          An unexpected error occurred. It has been logged{error.digest ? ` (ref: ${error.digest})` : ''}.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={reset} variant="accent">
            Try again
          </Button>
          <Button href="/" variant="outline">
            Back to home
          </Button>
        </div>
      </Container>
    </main>
  );
}
