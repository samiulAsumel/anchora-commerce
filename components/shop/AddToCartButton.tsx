'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { apiFetch, ClientApiError } from '@/lib/client-api';

export function AddToCartButton({ productId, disabled }: { productId: string; disabled?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      await apiFetch('/api/v1/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      setAdded(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button variant="accent" size="lg" className="w-full" onClick={handleClick} disabled={disabled || loading}>
        {disabled ? 'Sold out' : loading ? 'Adding…' : added ? 'Added to cart' : 'Add to cart'}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
