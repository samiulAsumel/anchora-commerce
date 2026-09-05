import type { Metadata } from 'next';
import { ProductForm } from '../ProductForm';
import { getSession } from '@/lib/session';
import { getManagedStore } from '@/lib/services/store-context';

export const metadata: Metadata = { title: 'New product' };

export default async function NewProductPage() {
  const session = await getSession();
  const store = await getManagedStore(session!.sub);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">New product</h1>
      <div className="mt-6">
        <ProductForm storeId={store.id} />
      </div>
    </div>
  );
}
