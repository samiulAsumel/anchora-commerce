import { prisma } from '@/lib/db';
import { AppError } from '@/lib/api';

/**
 * Single-tenant demo assumption: an OWNER manages the store they own; any
 * other staff (ADMIN) manages the first store in the system. A real
 * multi-tenant version would join staff to stores explicitly.
 */
export async function getManagedStore(userId: string) {
  const owned = await prisma.store.findFirst({ where: { ownerId: userId } });
  if (owned) return owned;

  const fallback = await prisma.store.findFirst({ orderBy: { createdAt: 'asc' } });
  if (!fallback) {
    throw new AppError('No store found', 404, 'STORE_NOT_FOUND');
  }
  return fallback;
}
