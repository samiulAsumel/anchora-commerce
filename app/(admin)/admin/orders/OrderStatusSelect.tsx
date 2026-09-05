'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '@/lib/client-api';

const statuses = ['PENDING', 'PAID', 'FULFILLED', 'CANCELLED'] as const;

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleChange(next: string) {
    setPending(true);
    await apiFetch(`/api/v1/orders/${orderId}`, { method: 'PATCH', body: JSON.stringify({ status: next }) });
    router.refresh();
  }

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
