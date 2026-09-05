'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { apiFetch, ClientApiError } from '@/lib/client-api';

interface OrderResult {
  id: string;
}

export function PlaceOrderButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const order = await apiFetch<OrderResult>('/api/v1/orders', { method: 'POST' });
      router.push(`/order/${order.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div>
      <Button variant="accent" size="lg" className="w-full" onClick={handleClick} disabled={loading}>
        {loading ? 'Placing order…' : 'Place order (mock payment)'}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
