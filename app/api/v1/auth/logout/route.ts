import { cookies } from 'next/headers';
import { REFRESH_TOKEN_COOKIE } from '@/lib/auth';
import { logoutUser } from '@/lib/services/auth-service';
import { ok, fail } from '@/lib/api';
import { clearAuthCookies } from '@/lib/set-auth-cookies';

export async function POST() {
  try {
    const store = await cookies();
    const presented = store.get(REFRESH_TOKEN_COOKIE)?.value;
    if (presented) {
      await logoutUser(presented);
    }

    const res = ok({ loggedOut: true }, 'Logged out');
    return clearAuthCookies(res);
  } catch (error) {
    return fail(error as Error);
  }
}
