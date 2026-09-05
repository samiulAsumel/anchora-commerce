import { prisma } from '@/lib/db';
import { AppError } from '@/lib/api';

export async function getCartByToken(token: string) {
  return prisma.cart.findUnique({
    where: { token },
    include: { items: { include: { product: true }, orderBy: { id: 'asc' } } },
  });
}

export async function getOrCreateCart(token: string) {
  const existing = await prisma.cart.findUnique({ where: { token } });
  if (existing) return existing;
  return prisma.cart.create({ data: { token } });
}

export async function addCartItem(token: string, productId: string, quantity: number) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || product.deletedAt) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }

  const cart = await getOrCreateCart(token);

  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  }

  return prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
}

export async function updateCartItem(token: string, itemId: string, quantity: number) {
  const cart = await getOrCreateCart(token);
  const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
  if (!item) {
    throw new AppError('Cart item not found', 404, 'CART_ITEM_NOT_FOUND');
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: item.id } });
    return null;
  }

  return prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
}

export async function removeCartItem(token: string, itemId: string) {
  const cart = await getOrCreateCart(token);
  await prisma.cartItem.deleteMany({ where: { id: itemId, cartId: cart.id } });
}
