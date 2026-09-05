import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductForm } from '../ProductForm';
import { getProductById } from '@/lib/services/product-service';
import { AppError } from '@/lib/api';

export const metadata: Metadata = { title: 'Edit product' };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch (error) {
    if (error instanceof AppError && error.statusCode === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Edit product</h1>
      <div className="mt-6">
        <ProductForm storeId={product.storeId} initial={product} />
      </div>
    </div>
  );
}
