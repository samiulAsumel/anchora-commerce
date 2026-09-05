import { cookies } from 'next/headers';
import { ok, created, fail, parsePagination, AppError } from '@/lib/api';
import { createOrderFromCart, listOrders } from '@/lib/services/order-service';
import { requireAuth, requireRole } from '@/lib/require-auth';
import { CART_TOKEN_COOKIE } from '@/lib/cart-cookie';

export async function GET(req: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = parsePagination(searchParams);

    const isStaff = session.role === 'ADMIN' || session.role === 'OWNER';
    const storeId = searchParams.get('storeId') ?? undefined;
    if (isStaff && !storeId) {
      throw new AppError('Query param "storeId" is required', 422, 'VALIDATION_ERROR');
    }
    if (isStaff) {
      await requireRole('ADMIN', 'OWNER');
    }

    const { items, total } = await listOrders({
      page,
      limit,
      skip,
      ...(isStaff ? { storeId } : { customerId: session.sub }),
    });

    return ok(items, 'Orders fetched', { page, limit, total });
  } catch (error) {
    return fail(error as Error);
  }
}

export async function POST() {
  try {
    const session = await requireAuth();
    const store = await cookies();
    const cartToken = store.get(CART_TOKEN_COOKIE)?.value;
    if (!cartToken) {
      throw new AppError('Your cart is empty', 422, 'EMPTY_CART');
    }

    const order = await createOrderFromCart(cartToken, session.sub);
    return created(order, 'Order placed');
  } catch (error) {
    return fail(error as Error);
  }
}
