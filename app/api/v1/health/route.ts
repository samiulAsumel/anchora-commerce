import { ok } from '@/lib/api';

export async function GET() {
  return ok({ status: 'ok', uptime: process.uptime(), version: process.env.npm_package_version ?? '0.1.0' });
}
