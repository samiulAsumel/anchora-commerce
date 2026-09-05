import { prisma } from '@/lib/db';

export async function getDashboardStats(storeId: string) {
  const [revenue, orderCount, productCount, pendingCount, recentOrders] = await Promise.all([
    prisma.order.aggregate({
      where: { storeId, status: { not: 'CANCELLED' } },
      _sum: { totalCents: true },
    }),
    prisma.order.count({ where: { storeId } }),
    prisma.product.count({ where: { storeId, deletedAt: null } }),
    prisma.order.count({ where: { storeId, status: 'PENDING' } }),
    prisma.order.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { customer: { select: { name: true, email: true } } },
    }),
  ]);

  return {
    totalRevenueCents: revenue._sum.totalCents ?? 0,
    orderCount,
    productCount,
    pendingCount,
    recentOrders,
  };
}
