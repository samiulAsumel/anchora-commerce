import { cookies } from 'next/headers';
import { verifyAccessToken, type AccessTokenPayload } from '@/lib/auth';
import { ACCESS_TOKEN_COOKIE } from '@/lib/auth-constants';

export async function getSession(): Promise<AccessTokenPayload | null> {
  const store = await cookies();
  const token = store.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    return await verifyAccessToken(token);
  } catch {
    return null;
  }
}
