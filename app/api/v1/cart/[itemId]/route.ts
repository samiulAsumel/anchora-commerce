import { cookies } from 'next/headers';
import { z } from 'zod';
import { ok, noContent, fail, AppError } from '@/lib/api';
import { updateCartItem, removeCartItem } from '@/lib/services/cart-service';
import { CART_TOKEN_COOKIE } from '@/lib/cart-cookie';

interface Params {
  params: Promise<{ itemId: string }>;
}

const quantitySchema = z.object({ quantity: z.number().int().min(0).max(99) });

async function getToken(): Promise<string> {
  const store = await cookies();
  const token = store.get(CART_TOKEN_COOKIE)?.value;
  if (!token) {
    throw new AppError('No cart found', 404, 'CART_NOT_FOUND');
  }
  return token;
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { itemId } = await params;
    const token = await getToken();

    const body = await req.json();
    const parsed = quantitySchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError('Invalid input', 422, 'VALIDATION_ERROR', parsed.error.issues);
    }

    const item = await updateCartItem(token, itemId, parsed.data.quantity);
    return ok(item, 'Cart updated');
  } catch (error) {
    return fail(error as Error);
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { itemId } = await params;
    const token = await getToken();
    await removeCartItem(token, itemId);
    return noContent();
  } catch (error) {
    return fail(error as Error);
  }
}
