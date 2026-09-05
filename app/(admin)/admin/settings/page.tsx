import type { Metadata } from 'next';
import { getSession } from '@/lib/session';
import { getManagedStore } from '@/lib/services/store-context';
import { prisma } from '@/lib/db';

export const metadata: Metadata = { title: 'Settings' };

export default async function AdminSettingsPage() {
  const session = await getSession();
  const store = await getManagedStore(session!.sub);
  const owner = await prisma.user.findUnique({ where: { id: store.ownerId } });

  const rows = [
    { label: 'Store name', value: store.name },
    { label: 'Store slug', value: store.slug },
    { label: 'Storefront URL', value: `/store/${store.slug}` },
    { label: 'Owner', value: owner ? `${owner.name} (${owner.email})` : 'Unknown' },
    { label: 'Your role', value: session!.role },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-foreground/60">Read-only in this demo — editable settings are out of scope.</p>

      <dl className="mt-6 max-w-lg divide-y divide-border rounded-2xl border border-border bg-surface">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-5 py-3.5 text-sm">
            <dt className="text-foreground/60">{row.label}</dt>
            <dd className="font-medium">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
