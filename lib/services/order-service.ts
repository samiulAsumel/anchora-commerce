import { prisma } from '@/lib/db';
import { AppError } from '@/lib/api';
import type { OrderStatus } from '@/lib/generated/prisma/enums';

export async function createOrderFromCart(cartToken: string, customerId: string) {
  const cart = await prisma.cart.findUnique({
    where: { token: cartToken },
    include: { items: { include: { product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError('Your cart is empty', 422, 'EMPTY_CART');
  }

  const storeId = cart.items[0].product.storeId;
  if (cart.items.some((item) => item.product.storeId !== storeId)) {
    throw new AppError('Cart contains items from multiple stores', 422, 'MULTI_STORE_CART');
  }

  for (const item of cart.items) {
    if (item.product.deletedAt) {
      throw new AppError(`"${item.product.name}" is no longer available`, 422, 'PRODUCT_UNAVAILABLE');
    }
    if (item.product.inventory < item.quantity) {
      throw new AppError(`Not enough stock for "${item.product.name}"`, 422, 'INSUFFICIENT_STOCK');
    }
  }

  const totalCents = cart.items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        storeId,
        customerId,
        totalCents,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPriceCents: item.product.priceCents,
            nameSnapshot: item.product.name,
          })),
        },
      },
      include: { items: true },
    });

    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { inventory: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return created;
  });

  return order;
}

interface ListOrdersParams {
  storeId?: string;
  customerId?: string;
  page: number;
  limit: number;
  skip: number;
}

export async function listOrders(params: ListOrdersParams) {
  const where = {
    ...(params.storeId ? { storeId: params.storeId } : {}),
    ...(params.customerId ? { customerId: params.customerId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: params.skip,
      take: params.limit,
      include: { items: true },
    }),
    prisma.order.count({ where }),
  ]);

  return { items, total };
}

export async function getOrderById(id: string) {
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) {
    throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
  }
  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await getOrderById(id);
  return prisma.order.update({ where: { id }, data: { status } });
}
