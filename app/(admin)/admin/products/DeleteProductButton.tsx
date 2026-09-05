'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '@/lib/client-api';

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setPending(true);
    await apiFetch(`/api/v1/products/${productId}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      onBlur={() => setConfirming(false)}
      disabled={pending}
      className="text-sm text-foreground/50 hover:text-red-600 disabled:opacity-40"
    >
      {confirming ? 'Confirm delete?' : 'Delete'}
    </button>
  );
}
