import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getOrderById } from '@/lib/services/order-service';
import { getSession } from '@/lib/session';
import { AppError } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'Order confirmation' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const { id } = await params;

  let order;
  try {
    order = await getOrderById(id);
  } catch (error) {
    if (error instanceof AppError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }

  const isStaff = session.role === 'ADMIN' || session.role === 'OWNER';
  if (!isStaff && order.customerId !== session.sub) {
    notFound();
  }

  return (
    <section className="py-12 sm:py-16">
      <Container className="mx-auto max-w-lg text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy/10">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12.5 9.5 17 19 6.5"
              stroke="currentColor"
              className="text-navy dark:text-navy-light"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">Order placed</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Order <span className="font-mono">{order.id}</span> — status: {order.status}
        </p>

        <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-surface px-5 text-left">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 text-sm">
              <span>
                {item.nameSnapshot} &times; {item.quantity}
              </span>
              <span>{formatPrice(item.unitPriceCents * item.quantity, order.currency)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.totalCents, order.currency)}</span>
        </div>

        <Button href="/" variant="outline" className="mt-8">
          Back to home
        </Button>
      </Container>
    </section>
  );
}
