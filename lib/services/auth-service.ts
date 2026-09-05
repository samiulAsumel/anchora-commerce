import { prisma } from '@/lib/db';
import { AppError } from '@/lib/api';
import {
  hashPassword,
  verifyPassword,
  signAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
} from '@/lib/auth';
import type { LoginInput, RegisterInput } from '@/lib/validations';

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError('An account with this email already exists', 409, 'EMAIL_TAKEN');
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash },
  });

  const accessToken = await signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = await issueRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const accessToken = await signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = await issueRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function refreshSession(presentedToken: string) {
  const rotated = await rotateRefreshToken(presentedToken);
  if (!rotated) {
    throw new AppError('Refresh token is invalid or expired', 401, 'INVALID_REFRESH_TOKEN');
  }

  const accessToken = await signAccessToken({ sub: rotated.userId, role: rotated.role });
  return { accessToken, refreshToken: rotated.newToken };
}

export async function logoutUser(presentedToken: string) {
  await revokeRefreshToken(presentedToken);
}
