import type { Metadata } from 'next';
import Link from 'next/link';
import { KpiCard } from '@/components/ui/KpiCard';
import { getSession } from '@/lib/session';
import { getManagedStore } from '@/lib/services/store-context';
import { getDashboardStats } from '@/lib/services/admin-service';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'Dashboard' };

const statusStyles: Record<string, string> = {
  PENDING: 'bg-orange/10 text-orange',
  PAID: 'bg-navy/10 text-navy dark:text-navy-light',
  FULFILLED: 'bg-green-500/10 text-green-600',
  CANCELLED: 'bg-red-500/10 text-red-600',
};

export default async function AdminDashboardPage() {
  const session = await getSession();
  const store = await getManagedStore(session!.sub);
  const stats = await getDashboardStats(store.id);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{store.name}</h1>
      <p className="mt-1 text-sm text-foreground/60">Here&apos;s how the store is doing.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Revenue" value={formatPrice(stats.totalRevenueCents)} hint="Excludes cancelled orders" />
        <KpiCard label="Orders" value={String(stats.orderCount)} hint={`${stats.pendingCount} pending`} />
        <KpiCard label="Products" value={String(stats.productCount)} />
        <KpiCard label="Pending orders" value={String(stats.pendingCount)} hint="Awaiting fulfillment" />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-navy dark:text-navy-light">
            View all
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <p className="p-5 text-sm text-foreground/60">No orders yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-foreground/50">{order.customer.email}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[order.status]}`}>
                  {order.status}
                </span>
                <span className="font-medium">{formatPrice(order.totalCents, order.currency)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
