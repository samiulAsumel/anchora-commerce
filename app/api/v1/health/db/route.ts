import { prisma } from '@/lib/db';
import { fail, ok } from '@/lib/api';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return ok({ status: 'ok', database: 'connected' });
  } catch (error) {
    return fail(error as Error);
  }
}
