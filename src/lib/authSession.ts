export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const AUTH_SESSION_KEY = 'nlbb_auth_session';

type StoredSession = SessionTokens & {
  updatedAt: string;
};

const normalizeSession = (session: SessionTokens): StoredSession => ({
  ...session,
  updatedAt: new Date().toISOString(),
});

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const getStoredSession = async (): Promise<SessionTokens | null> => {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (
      typeof parsed.accessToken !== 'string' ||
      typeof parsed.refreshToken !== 'string' ||
      typeof parsed.expiresIn !== 'number'
    ) {
      return null;
    }

    return {
      accessToken: parsed.accessToken,
      refreshToken: parsed.refreshToken,
      expiresIn: parsed.expiresIn,
    };
  } catch {
    return null;
  }
};

export const setStoredSession = async (session: SessionTokens | null): Promise<void> => {
  if (!canUseStorage()) {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(normalizeSession(session)));
};

export const clearStoredSession = async (): Promise<void> => {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.removeItem(AUTH_SESSION_KEY);
};

export const getAccessToken = async (): Promise<string | null> => {
  const session = await getStoredSession();
  return session?.accessToken ?? null;
};

export const getRefreshToken = async (): Promise<string | null> => {
  const session = await getStoredSession();
  return session?.refreshToken ?? null;
};
