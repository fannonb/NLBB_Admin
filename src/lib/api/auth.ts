import { apiClient, createApiClientError } from './client';
import { API_BASE_URLS } from '../config';
import { fetchWithApiBaseUrlFallback } from './baseUrl';
import type { BackendUserProfile, UserRole } from '../../types';

export interface AuthSessionResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: BackendUserProfile | null;
}

const requestAuth = async <T>(path: string, body?: unknown) => {
  const { response, resolvedBaseUrl, attemptedBaseUrls, errors: networkErrors } =
    await fetchWithApiBaseUrlFallback(path, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  if (!response) {
    throw createApiClientError(`Cannot reach backend. Tried: ${API_BASE_URLS.join(', ')}`, 0, 'BACKEND_UNREACHABLE', {
      attemptedBaseUrls,
      errors: networkErrors,
    });
  }

  type Envelope = { success: boolean; data: T; error?: { code?: string; message?: string } };
  let payload: Envelope | null = null;
  try {
    payload = (await response.json()) as Envelope;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    throw createApiClientError(
      payload?.error?.message ?? `Request failed (${response.status}) via ${resolvedBaseUrl ?? 'unknown-base-url'}`,
      response.status,
      payload?.error?.code,
      undefined
    );
  }

  return payload.data;
};

export const authApi = {
  register: (payload: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: Exclude<UserRole, 'admin'>;
    location?: string;
  }) => requestAuth<AuthSessionResponse>('auth/register', payload),
  login: (payload: { email: string; password: string }) => requestAuth<AuthSessionResponse>('auth/login', payload),
  logout: () => apiClient.post<{ revoked: boolean }>('auth/logout'),
  getMe: () => apiClient.get<BackendUserProfile | null>('auth/me'),
};
