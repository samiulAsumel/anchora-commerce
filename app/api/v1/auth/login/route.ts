import { loginSchema } from '@/lib/validations';
import { loginUser } from '@/lib/services/auth-service';
import { ok, fail, AppError } from '@/lib/api';
import { setAuthCookies } from '@/lib/set-auth-cookies';
import { rateLimit, clientKey } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    if (!rateLimit(`login:${clientKey(req)}`, 10, 60_000)) {
      throw new AppError('Too many attempts, try again shortly', 429, 'RATE_LIMITED');
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError('Invalid input', 422, 'VALIDATION_ERROR', parsed.error.issues);
    }

    const { user, accessToken, refreshToken } = await loginUser(parsed.data);
    const res = ok(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      'Logged in',
    );
    return setAuthCookies(res, { accessToken, refreshToken });
  } catch (error) {
    return fail(error as Error);
  }
}
