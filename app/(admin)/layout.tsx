import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/layouts/AdminSidebar';
import { getSession } from '@/lib/session';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'OWNER')) {
    redirect('/login?next=/admin');
  }

  return (
    <div className="flex flex-1">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-6 sm:p-10">{children}</main>
    </div>
  );
}
