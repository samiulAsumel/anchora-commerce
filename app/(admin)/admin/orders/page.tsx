import type { Metadata } from 'next';
import { OrderStatusSelect } from './OrderStatusSelect';
import { getSession } from '@/lib/session';
import { getManagedStore } from '@/lib/services/store-context';
import { listOrders } from '@/lib/services/order-service';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'Orders' };

export default async function AdminOrdersPage() {
  const session = await getSession();
  const store = await getManagedStore(session!.sub);
  const { items, total } = await listOrders({ storeId: store.id, page: 1, limit: 100, skip: 0 });

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-foreground/60">{total} total</p>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-foreground/60">No orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-foreground/60">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3.5 font-mono text-xs">{order.id.slice(0, 8)}</td>
                  <td className="px-5 py-3.5">{order.items.length}</td>
                  <td className="px-5 py-3.5 font-medium">{formatPrice(order.totalCents, order.currency)}</td>
                  <td className="px-5 py-3.5">
                    <OrderStatusSelect orderId={order.id} status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
