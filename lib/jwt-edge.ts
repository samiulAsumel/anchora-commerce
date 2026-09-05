import { jwtVerify } from 'jose';
import type { UserRole } from '@/lib/generated/prisma/enums';

/**
 * Edge-safe subset of lib/auth.ts — no bcrypt/node:crypto/prisma imports, so
 * middleware (edge runtime) can verify the access token without pulling in
 * Node-only APIs the bundler can't ship there.
 */
export async function verifyAccessTokenEdge(
  token: string,
  secret: string,
): Promise<{ sub: string; role: UserRole }> {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  return { sub: payload.sub as string, role: payload.role as UserRole };
}
