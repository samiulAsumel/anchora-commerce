import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ProductThumb } from '@/components/shop/ProductThumb';
import { AddToCartButton } from '@/components/shop/AddToCartButton';
import { getProductBySlug } from '@/lib/services/product-service';
import { AppError } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string; productSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, productSlug } = await params;
  try {
    const { product } = await getProductBySlug(slug, productSlug);
    return { title: product.name, description: product.description };
  } catch {
    return { title: 'Product' };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug, productSlug } = await params;

  let result;
  try {
    result = await getProductBySlug(slug, productSlug);
  } catch (error) {
    if (error instanceof AppError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }

  const { product, store } = result;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <Link href={`/store/${slug}`} className="text-sm text-foreground/60 hover:text-foreground">
          &larr; Back to {store.name}
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <ProductThumb name={product.name} className="aspect-square w-full rounded-2xl" />

          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <p className="mt-2 text-xl text-foreground/80">{formatPrice(product.priceCents, product.currency)}</p>
            <p className="mt-6 text-foreground/70">{product.description}</p>

            <p className="mt-4 text-sm text-foreground/60">
              {product.inventory > 0 ? `${product.inventory} in stock` : 'Currently sold out'}
            </p>

            <div className="mt-6">
              <AddToCartButton productId={product.id} disabled={product.inventory === 0} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
