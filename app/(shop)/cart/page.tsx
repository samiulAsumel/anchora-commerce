import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { CartItemRow } from '@/components/shop/CartItemRow';
import { getCartByToken } from '@/lib/services/cart-service';
import { CART_TOKEN_COOKIE } from '@/lib/cart-cookie';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'Cart' };

export default async function CartPage() {
  const store = await cookies();
  const token = store.get(CART_TOKEN_COOKIE)?.value;
  const cart = token ? await getCartByToken(token) : null;
  const items = cart?.items ?? [];
  const subtotalCents = items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);

  return (
    <section className="py-12 sm:py-16">
      <Container className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-surface p-10 text-center">
            <p className="text-foreground/70">Your cart is empty.</p>
            <Button href="/store/demo-store" variant="outline" className="mt-4">
              Browse the demo store
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface px-5">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  id={item.id}
                  name={item.product.name}
                  priceCents={item.product.priceCents}
                  currency={item.product.currency}
                  quantity={item.quantity}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(subtotalCents, items[0]?.product.currency ?? 'USD')}</span>
            </div>

            <Button href="/checkout" variant="accent" size="lg" className="mt-6 w-full">
              Checkout
            </Button>
          </>
        )}
      </Container>
    </section>
  );
}
