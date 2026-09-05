import { getSession } from '@/lib/session';
import { AppError } from '@/lib/api';
import type { AccessTokenPayload } from '@/lib/auth';

export async function requireAuth(): Promise<AccessTokenPayload> {
  const session = await getSession();
  if (!session) {
    throw new AppError('Authentication required', 401, 'UNAUTHENTICATED');
  }
  return session;
}

export async function requireRole(...roles: AccessTokenPayload['role'][]): Promise<AccessTokenPayload> {
  const session = await requireAuth();
  if (!roles.includes(session.role)) {
    throw new AppError('You do not have permission to do this', 403, 'FORBIDDEN');
  }
  return session;
}
