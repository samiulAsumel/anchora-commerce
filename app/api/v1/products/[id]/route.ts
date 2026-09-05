import { ok, noContent, fail, AppError } from '@/lib/api';
import { productUpdateSchema } from '@/lib/validations';
import { getProductById, updateProduct, deleteProduct } from '@/lib/services/product-service';
import { requireRole } from '@/lib/require-auth';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    return ok(product, 'Product fetched');
  } catch (error) {
    return fail(error as Error);
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireRole('ADMIN', 'OWNER');
    const { id } = await params;

    const body = await req.json();
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      throw new AppError('Invalid input', 422, 'VALIDATION_ERROR', parsed.error.issues);
    }

    const product = await updateProduct(id, parsed.data);
    return ok(product, 'Product updated');
  } catch (error) {
    return fail(error as Error);
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireRole('ADMIN', 'OWNER');
    const { id } = await params;
    await deleteProduct(id);
    return noContent();
  } catch (error) {
    return fail(error as Error);
  }
}
