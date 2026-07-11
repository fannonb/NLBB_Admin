import { API_BASE_URL, API_BASE_URLS } from '../config';

type FetchWithFallbackResult = {
  response: Response | null;
  resolvedBaseUrl: string | null;
  attemptedBaseUrls: string[];
  errors: Array<{ baseUrl: string; message: string }>;
};

const joinPath = (baseUrl: string, path: string) => {
  const normalizedPath = path.replace(/^\/+/, '');
  return `${baseUrl}/${normalizedPath}`;
};

export const fetchWithApiBaseUrlFallback = async (
  path: string,
  init?: RequestInit
): Promise<FetchWithFallbackResult> => {
  const attemptedBaseUrls: string[] = [];
  const errors: Array<{ baseUrl: string; message: string }> = [];

  for (const baseUrl of API_BASE_URLS) {
    attemptedBaseUrls.push(baseUrl);
    try {
      const response = await fetch(joinPath(baseUrl, path), init);
      return {
        response,
        resolvedBaseUrl: baseUrl,
        attemptedBaseUrls,
        errors,
      };
    } catch (error) {
      errors.push({
        baseUrl,
        message: error instanceof Error ? error.message : 'Network failure',
      });
    }
  }

  return {
    response: null,
    resolvedBaseUrl: API_BASE_URL,
    attemptedBaseUrls,
    errors,
  };
};
