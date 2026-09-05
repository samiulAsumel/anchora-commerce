import { NextResponse } from 'next/server';

export class AppError extends Error {
  statusCode: number;
  errorCode: string;
  details: unknown[];

  constructor(message: string, statusCode: number, errorCode: string, details: unknown[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export function ok<T>(data: T, message = 'Success', pagination?: Pagination) {
  return NextResponse.json({ success: true, data, message, ...(pagination ? { pagination } : {}) });
}

export function created<T>(data: T, message = 'Created') {
  return NextResponse.json({ success: true, data, message }, { status: 201 });
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

export function fail(error: AppError | Error) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, error: error.errorCode, message: error.message, details: error.details },
      { status: error.statusCode },
    );
  }

  console.error(error);
  return NextResponse.json(
    { success: false, error: 'INTERNAL_ERROR', message: 'Something went wrong', details: [] },
    { status: 500 },
  );
}

export function withErrorHandling(
  handler: (req: Request, ctx: unknown) => Promise<NextResponse>,
) {
  return async (req: Request, ctx: unknown): Promise<NextResponse> => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      return fail(error as Error);
    }
  };
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 20));
  return { page, limit, skip: (page - 1) * limit };
}
