import { cookies } from 'next/headers';
import { ok, fail, AppError } from '@/lib/api';
import { cartItemSchema } from '@/lib/validations';
import { getCartByToken, addCartItem } from '@/lib/services/cart-service';
import { getOrCreateCartToken, cartCookieOptions, CART_TOKEN_COOKIE } from '@/lib/cart-cookie';

export async function GET() {
  try {
    const store = await cookies();
    const token = store.get(CART_TOKEN_COOKIE)?.value;
    if (!token) {
      return ok({ items: [], subtotalCents: 0 }, 'Cart fetched');
    }

    const cart = await getCartByToken(token);
    const items = cart?.items ?? [];
    const subtotalCents = items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
    return ok({ items, subtotalCents }, 'Cart fetched');
  } catch (error) {
    return fail(error as Error);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = cartItemSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError('Invalid input', 422, 'VALIDATION_ERROR', parsed.error.issues);
    }

    const { token, isNew } = await getOrCreateCartToken();
    await addCartItem(token, parsed.data.productId, parsed.data.quantity);

    const res = ok({ added: true }, 'Added to cart');
    if (isNew) {
      res.cookies.set(CART_TOKEN_COOKIE, token, cartCookieOptions());
    }
    return res;
  } catch (error) {
    return fail(error as Error);
  }
}
