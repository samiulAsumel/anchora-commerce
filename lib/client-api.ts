interface ApiSuccess<T> {
  success: true;
  data: T;
  message: string;
}

interface ApiFailure {
  success: false;
  error: string;
  message: string;
  details: unknown[];
}

export class ClientApiError extends Error {
  code: string;
  details: unknown[];

  constructor(failure: ApiFailure) {
    super(failure.message);
    this.code = failure.error;
    this.details = failure.details;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    credentials: 'include',
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const body = (await res.json()) as ApiSuccess<T> | ApiFailure;

  if (!body.success) {
    throw new ClientApiError(body);
  }

  return body.data;
}
