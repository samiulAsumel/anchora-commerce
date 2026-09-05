import { registerSchema } from '@/lib/validations';
import { registerUser } from '@/lib/services/auth-service';
import { created, fail, AppError } from '@/lib/api';
import { setAuthCookies } from '@/lib/set-auth-cookies';
import { rateLimit, clientKey } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    if (!rateLimit(`register:${clientKey(req)}`, 5, 60_000)) {
      throw new AppError('Too many attempts, try again shortly', 429, 'RATE_LIMITED');
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError('Invalid input', 422, 'VALIDATION_ERROR', parsed.error.issues);
    }

    const { user, accessToken, refreshToken } = await registerUser(parsed.data);
    const res = created(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      'Account created',
    );
    return setAuthCookies(res, { accessToken, refreshToken });
  } catch (error) {
    return fail(error as Error);
  }
}
