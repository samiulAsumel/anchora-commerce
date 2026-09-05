'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { apiFetch, ClientApiError } from '@/lib/client-api';
import { slugify } from '@/lib/utils';

interface ProductFormValues {
  id?: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  inventory: number;
}

export function ProductForm({ storeId, initial }: { storeId: string; initial?: ProductFormValues }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(initial?.id);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const name = String(form.get('name'));
    const payload = {
      name,
      slug: String(form.get('slug') || slugify(name)),
      description: String(form.get('description')),
      priceCents: Math.round(Number(form.get('price')) * 100),
      inventory: Number(form.get('inventory')),
    };

    try {
      if (isEdit) {
        await apiFetch(`/api/v1/products/${initial!.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await apiFetch(`/api/v1/products?storeId=${storeId}`, { method: 'POST', body: JSON.stringify(payload) });
      }
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      setError(err instanceof ClientApiError ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <FormField id="name" name="name" label="Name" type="text" defaultValue={initial?.name} required />
      <FormField
        id="slug"
        name="slug"
        label="Slug"
        type="text"
        defaultValue={initial?.slug}
        placeholder="auto-generated from name if left blank"
      />

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initial?.description}
          required
          className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          id="price"
          name="price"
          label="Price (USD)"
          type="number"
          step="0.01"
          min="0"
          defaultValue={initial ? (initial.priceCents / 100).toFixed(2) : undefined}
          required
        />
        <FormField
          id="inventory"
          name="inventory"
          label="Inventory"
          type="number"
          min="0"
          defaultValue={initial?.inventory}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" variant="accent" disabled={loading}>
        {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create product'}
      </Button>
    </form>
  );
}
