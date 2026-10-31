import { API_BASE_URLS } from '../config';
import { clearStoredSession } from '../authSession';
import { fetchWithApiBaseUrlFallback } from './baseUrl';

interface ApiErrorPayload {
  code?: string;
  message?: string;
  details?: unknown;
}

interface ApiResponseEnvelope<T> {
  success: boolean;
  data: T;
  error?: ApiErrorPayload;
}

interface RefreshPayload {
  expiresIn: number;
}

export type ApiClientError = Error & {
  name: 'ApiClientError';
  status: number;
  code?: string;
  details?: unknown;
};

export const createApiClientError = (
  message: string,
  status: number,
  code?: string,
  details?: unknown
): ApiClientError => {
  const error = new Error(message) as ApiClientError;
  error.name = 'ApiClientError';
  error.status = status;
  error.code = code;
  error.details = details;
  return error;
};

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

let refreshPromise: Promise<RefreshPayload | null> | null = null;
const performRefresh = async (): Promise<RefreshPayload | null> => {
  const { response } = await fetchWithApiBaseUrlFallback('auth/refresh', {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({}),
  });

  if (!response) {
    return null;
  }

  let payload: ApiResponseEnvelope<RefreshPayload> | null = null;
  try {
    payload = (await response.json()) as ApiResponseEnvelope<RefreshPayload>;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    await clearStoredSession();
    return null;
  }

  return payload.data;
};

const refreshStoredSession = () => {
  if (!refreshPromise) refreshPromise = performRefresh().finally(() => { refreshPromise = null; });
  return refreshPromise;
};

const request = async <T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
  retryOnUnauthorized = true
) => {
  const { response, resolvedBaseUrl, attemptedBaseUrls, errors: networkErrors } =
    await fetchWithApiBaseUrlFallback(path, {
      method,
      headers: {
        ...defaultHeaders,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  if (!response) {
    throw createApiClientError(`Cannot reach backend. Tried: ${API_BASE_URLS.join(', ')}`, 0, 'BACKEND_UNREACHABLE', {
      attemptedBaseUrls,
      errors: networkErrors,
    });
  }

  let payload: ApiResponseEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as ApiResponseEnvelope<T>;
  } catch {
    payload = null;
  }

  if (response.status === 401 && retryOnUnauthorized && path !== 'auth/refresh') {
    const refreshed = await refreshStoredSession();
    if (refreshed) {
      return request<T>(method, path, body, false);
    }
  }

  if (!response.ok || !payload?.success) {
    const error = payload?.error;
    throw createApiClientError(
      error?.message ?? `Request failed (${response.status}) via ${resolvedBaseUrl ?? 'unknown-base-url'}`,
      response.status,
      error?.code,
      error?.details
    );
  }

  return payload.data;
};

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
