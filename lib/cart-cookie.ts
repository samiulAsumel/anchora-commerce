import crypto from 'node:crypto';
import { cookies } from 'next/headers';

export const CART_TOKEN_COOKIE = 'anchora_cart';
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getOrCreateCartToken(): Promise<{ token: string; isNew: boolean }> {
  const store = await cookies();
  const existing = store.get(CART_TOKEN_COOKIE)?.value;
  if (existing) {
    return { token: existing, isNew: false };
  }
  return { token: crypto.randomBytes(24).toString('hex'), isNew: true };
}

export function cartCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: CART_COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  };
}
