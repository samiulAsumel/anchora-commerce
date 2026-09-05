import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ProductThumb } from '@/components/shop/ProductThumb';
import { DeleteProductButton } from './DeleteProductButton';
import { getSession } from '@/lib/session';
import { getManagedStore } from '@/lib/services/store-context';
import { listProducts } from '@/lib/services/product-service';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'Products' };

export default async function AdminProductsPage() {
  const session = await getSession();
  const store = await getManagedStore(session!.sub);
  const { items, total } = await listProducts({ storeSlug: store.slug, page: 1, limit: 100, skip: 0 });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-foreground/60">{total} total</p>
        </div>
        <Button href="/admin/products/new" variant="accent">
          Add product
        </Button>
      </div>

      <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
        {items.map((product) => (
          <div key={product.id} data-testid="product-row" className="flex items-center gap-4 px-5 py-3.5">
            <ProductThumb name={product.name} className="h-12 w-12 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="text-xs text-foreground/50">{product.inventory} in stock</p>
            </div>
            <span className="text-sm font-medium">{formatPrice(product.priceCents, product.currency)}</span>
            <Link
              href={`/admin/products/${product.id}`}
              className="text-sm text-navy hover:underline dark:text-navy-light"
            >
              Edit
            </Link>
            <DeleteProductButton productId={product.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
