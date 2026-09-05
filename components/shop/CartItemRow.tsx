'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ProductThumb } from '@/components/shop/ProductThumb';
import { apiFetch } from '@/lib/client-api';
import { formatPrice } from '@/lib/utils';

interface CartItemRowProps {
  id: string;
  name: string;
  priceCents: number;
  currency: string;
  quantity: number;
}

export function CartItemRow({ id, name, priceCents, currency, quantity }: CartItemRowProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function updateQuantity(next: number) {
    setPending(true);
    await apiFetch(`/api/v1/cart/${id}`, { method: 'PATCH', body: JSON.stringify({ quantity: next }) });
    router.refresh();
  }

  async function remove() {
    setPending(true);
    await apiFetch(`/api/v1/cart/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4 py-4">
      <ProductThumb name={name} className="h-16 w-16 shrink-0 rounded-lg" />

      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-sm text-foreground/60">{formatPrice(priceCents, currency)}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => updateQuantity(quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-6 text-center text-sm">{quantity}</span>
        <button
          type="button"
          disabled={pending}
          onClick={() => updateQuantity(quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border disabled:opacity-40"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={remove}
        className="text-sm text-foreground/50 hover:text-red-600 disabled:opacity-40"
      >
        Remove
      </button>
    </div>
  );
}
