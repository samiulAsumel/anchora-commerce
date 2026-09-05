import Link from 'next/link';
import { ProductThumb } from '@/components/shop/ProductThumb';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  storeSlug: string;
  slug: string;
  name: string;
  priceCents: number;
  currency: string;
  inventory: number;
}

export function ProductCard({ storeSlug, slug, name, priceCents, currency, inventory }: ProductCardProps) {
  return (
    <Link
      href={`/store/${storeSlug}/products/${slug}`}
      className="group block overflow-hidden rounded-xl border border-border transition-shadow hover:shadow-md"
    >
      <ProductThumb name={name} className="aspect-square w-full" />
      <div className="p-3">
        <p className="text-sm font-medium group-hover:underline">{name}</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm text-foreground/70">{formatPrice(priceCents, currency)}</p>
          {inventory === 0 && <p className="text-xs font-medium text-red-600">Sold out</p>}
        </div>
      </div>
    </Link>
  );
}
