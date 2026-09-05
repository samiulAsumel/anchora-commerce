import { cookies } from 'next/headers';
import { REFRESH_TOKEN_COOKIE } from '@/lib/auth';
import { refreshSession } from '@/lib/services/auth-service';
import { ok, fail, AppError } from '@/lib/api';
import { setAuthCookies } from '@/lib/set-auth-cookies';

export async function POST() {
  try {
    const store = await cookies();
    const presented = store.get(REFRESH_TOKEN_COOKIE)?.value;
    if (!presented) {
      throw new AppError('No refresh token presented', 401, 'MISSING_REFRESH_TOKEN');
    }

    const { accessToken, refreshToken } = await refreshSession(presented);
    const res = ok({ refreshed: true }, 'Session refreshed');
    return setAuthCookies(res, { accessToken, refreshToken });
  } catch (error) {
    return fail(error as Error);
  }
}
