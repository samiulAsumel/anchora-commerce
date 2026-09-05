import { ok, fail, AppError } from '@/lib/api';
import { orderStatusSchema } from '@/lib/validations';
import { getOrderById, updateOrderStatus } from '@/lib/services/order-service';
import { requireAuth, requireRole } from '@/lib/require-auth';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const order = await getOrderById(id);

    const isStaff = session.role === 'ADMIN' || session.role === 'OWNER';
    if (!isStaff && order.customerId !== session.sub) {
      throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    }

    return ok(order, 'Order fetched');
  } catch (error) {
    return fail(error as Error);
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireRole('ADMIN', 'OWNER');
    const { id } = await params;

    const body = await req.json();
    const parsed = orderStatusSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError('Invalid input', 422, 'VALIDATION_ERROR', parsed.error.issues);
    }

    const order = await updateOrderStatus(id, parsed.data.status);
    return ok(order, 'Order updated');
  } catch (error) {
    return fail(error as Error);
  }
}
