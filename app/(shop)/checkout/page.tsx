import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PlaceOrderButton } from '@/components/shop/PlaceOrderButton';
import { getCartByToken } from '@/lib/services/cart-service';
import { CART_TOKEN_COOKIE } from '@/lib/cart-cookie';
import { getSession } from '@/lib/session';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'Checkout' };

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login?next=/checkout');
  }

  const store = await cookies();
  const token = store.get(CART_TOKEN_COOKIE)?.value;
  const cart = token ? await getCartByToken(token) : null;
  const items = cart?.items ?? [];

  if (items.length === 0) {
    redirect('/cart');
  }

  const subtotalCents = items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);

  return (
    <section className="py-12 sm:py-16">
      <Container className="mx-auto max-w-lg">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="mt-2 text-sm text-foreground/60">
          This is a demo — no real payment is collected, but placing an order writes a real row to
          Postgres and decrements real inventory.
        </p>

        <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface px-5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 text-sm">
              <span>
                {item.product.name} &times; {item.quantity}
              </span>
              <span>{formatPrice(item.product.priceCents * item.quantity, item.product.currency)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(subtotalCents, items[0]?.product.currency ?? 'USD')}</span>
        </div>

        <div className="mt-6">
          <PlaceOrderButton />
        </div>
      </Container>
    </section>
  );
}
