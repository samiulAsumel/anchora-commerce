import { prisma } from '@/lib/db';
import { AppError } from '@/lib/api';
import type { ProductInput } from '@/lib/validations';

interface ListParams {
  storeSlug: string;
  page: number;
  limit: number;
  skip: number;
  q?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc';
}

const sortMap = {
  newest: { createdAt: 'desc' as const },
  'price-asc': { priceCents: 'asc' as const },
  'price-desc': { priceCents: 'desc' as const },
};

export async function listProducts(params: ListParams) {
  const store = await prisma.store.findUnique({ where: { slug: params.storeSlug } });
  if (!store) {
    throw new AppError('Store not found', 404, 'STORE_NOT_FOUND');
  }

  const where = {
    storeId: store.id,
    deletedAt: null,
    ...(params.q ? { name: { contains: params.q, mode: 'insensitive' as const } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: sortMap[params.sort ?? 'newest'],
      skip: params.skip,
      take: params.limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total, store };
}

export async function getProductBySlug(storeSlug: string, productSlug: string) {
  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) {
    throw new AppError('Store not found', 404, 'STORE_NOT_FOUND');
  }

  const product = await prisma.product.findFirst({
    where: { storeId: store.id, slug: productSlug, deletedAt: null },
  });

  if (!product) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }

  return { product, store };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.deletedAt) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }
  return product;
}

export async function createProduct(storeId: string, input: ProductInput) {
  const existing = await prisma.product.findUnique({
    where: { storeId_slug: { storeId, slug: input.slug } },
  });
  if (existing) {
    throw new AppError('A product with this slug already exists', 409, 'SLUG_TAKEN');
  }

  return prisma.product.create({ data: { ...input, storeId } });
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  await getProductById(id);
  return prisma.product.update({ where: { id }, data: input });
}

export async function deleteProduct(id: string) {
  await getProductById(id);
  await prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
}
