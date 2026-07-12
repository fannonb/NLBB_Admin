const normalizeBaseUrl = (value: string) =>
  value
    .trim()
    .replace(/\/+$/, '')
    .replace(/\.+$/, '')
    .replace(/\/+$/, '');

interface RuntimeWindowEnv {
  VITE_API_BASE_URL?: string;
}

interface ImportMetaEnvShape {
  VITE_API_BASE_URL?: string;
  VITE_APP_ENV?: string;
}

declare global {
  interface Window {
    __NLBB_ENV__?: RuntimeWindowEnv;
  }
}

const appendUnique = (list: string[], value: string | null | undefined) => {
  if (!value) {
    return;
  }
  const normalized = normalizeBaseUrl(value);
  if (!normalized || list.includes(normalized)) {
    return;
  }
  list.push(normalized);
};

const buildApiBaseUrls = () => {
  const urls: string[] = [];
  const buildTimeBaseUrl = (import.meta as ImportMeta & { env?: ImportMetaEnvShape }).env?.VITE_API_BASE_URL;
  appendUnique(urls, buildTimeBaseUrl);
  appendUnique(urls, window.__NLBB_ENV__?.VITE_API_BASE_URL);
  appendUnique(urls, 'http://localhost:4000/api');
  appendUnique(urls, 'http://127.0.0.1:4000/api');
  return urls;
};

export const API_BASE_URLS = buildApiBaseUrls();
export const API_BASE_URL = API_BASE_URLS[0] ?? 'http://localhost:4000/api';
export const WEB_APP_ENV =
  (import.meta as ImportMeta & { env?: ImportMetaEnvShape }).env?.VITE_APP_ENV ?? 'development';
