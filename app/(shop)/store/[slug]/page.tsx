import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/shop/ProductCard';
import { listProducts } from '@/lib/services/product-service';
import { AppError } from '@/lib/api';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 12;

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
] as const;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string; q?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Storefront · ${slug}` };
}

export default async function StorePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const sort = (sp.sort as (typeof sortOptions)[number]['value']) || 'newest';

  let result;
  try {
    result = await listProducts({
      storeSlug: slug,
      page,
      limit: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      q: sp.q,
      sort,
    });
  } catch (error) {
    if (error instanceof AppError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }

  const totalPages = Math.max(1, Math.ceil(result.total / PAGE_SIZE));

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{result.store.name}</h1>
            <p className="mt-1 text-sm text-foreground/60">{result.total} products</p>
          </div>

          <form className="flex gap-2">
            <input type="hidden" name="page" value="1" />
            <input
              type="search"
              name="q"
              placeholder="Search products…"
              defaultValue={sp.q}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
            />
            <select
              name="sort"
              defaultValue={sort}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </form>
        </div>

        {result.items.length === 0 ? (
          <p className="mt-16 text-center text-foreground/60">No products match your search.</p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {result.items.map((product) => (
              <ProductCard
                key={product.id}
                storeSlug={slug}
                slug={product.slug}
                name={product.name}
                priceCents={product.priceCents}
                currency={product.currency}
                inventory={product.inventory}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`?page=${p}${sort ? `&sort=${sort}` : ''}${sp.q ? `&q=${sp.q}` : ''}`}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium',
                  p === page ? 'bg-navy text-white' : 'border border-border hover:bg-surface',
                )}
              >
                {p}
              </Link>
            ))}
          </nav>
        )}
      </Container>
    </section>
  );
}
