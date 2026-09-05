import { ok, created, fail, parsePagination, AppError } from '@/lib/api';
import { productSchema } from '@/lib/validations';
import { listProducts, createProduct } from '@/lib/services/product-service';
import { requireRole } from '@/lib/require-auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeSlug = searchParams.get('store');
    if (!storeSlug) {
      throw new AppError('Query param "store" is required', 422, 'VALIDATION_ERROR');
    }

    const { page, limit, skip } = parsePagination(searchParams);
    const q = searchParams.get('q') ?? undefined;
    const sort = (searchParams.get('sort') as 'newest' | 'price-asc' | 'price-desc' | null) ?? undefined;

    const { items, total } = await listProducts({ storeSlug, page, limit, skip, q, sort });
    return ok(items, 'Products fetched', { page, limit, total });
  } catch (error) {
    return fail(error as Error);
  }
}

export async function POST(req: Request) {
  try {
    await requireRole('ADMIN', 'OWNER');

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get('storeId');
    if (!storeId) {
      throw new AppError('Query param "storeId" is required', 422, 'VALIDATION_ERROR');
    }

    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError('Invalid input', 422, 'VALIDATION_ERROR', parsed.error.issues);
    }

    const product = await createProduct(storeId, parsed.data);
    return created(product, 'Product created');
  } catch (error) {
    return fail(error as Error);
  }
}
