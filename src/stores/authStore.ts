import { create } from 'zustand';
import { authApi, AuthSessionResponse } from '../lib/api/auth';
import { clearStoredSession, getStoredSession, setStoredSession } from '../lib/authSession';
import type { BackendUserProfile, User, UserRole } from '../types';

interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  location?: string;
  role: Exclude<UserRole, 'admin'>;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isInitializing: boolean;
  isReady: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ success: boolean; role: UserRole | null; error?: string }>;
  signup: (payload: SignupPayload) => Promise<{ success: boolean; role: UserRole | null; error?: string }>;
  logout: () => Promise<void>;
}

const mapBackendUserToAppUser = (profile: BackendUserProfile): User => ({
  id: profile.id,
  name: profile.name,
  email: profile.email ?? '',
  phone: profile.phone,
  avatar: profile.avatar ?? undefined,
  role: profile.role,
  location: profile.location ?? undefined,
});

const persistSession = async (session: AuthSessionResponse) => {
  await setStoredSession({
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    expiresIn: session.expiresIn,
  });
};

const applySession = async (set: (state: Partial<AuthState>) => void, session: AuthSessionResponse) => {
  if (!session.user) {
    await clearStoredSession();
    set({ user: null, isLoggedIn: false });
    return null;
  }

  await persistSession(session);
  const user = mapBackendUserToAppUser(session.user);
  set({ user, isLoggedIn: true });
  return user;
};

let initialized = false;
let initializePromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isInitializing: false,
  isReady: false,

  initialize: async () => {
    if (initialized) {
      return;
    }

    if (initializePromise) {
      await initializePromise;
      return;
    }

    initialized = true;
    set({ isInitializing: true });

    initializePromise = (async () => {
      try {
        const session = await getStoredSession();
        if (!session) {
          set({ user: null, isLoggedIn: false, isReady: true, isInitializing: false });
          return;
        }

        const profile = await authApi.getMe();
        if (!profile) {
          await clearStoredSession();
          set({ user: null, isLoggedIn: false, isReady: true, isInitializing: false });
          return;
        }

        set({ user: mapBackendUserToAppUser(profile), isLoggedIn: true, isReady: true, isInitializing: false });
      } catch {
        await clearStoredSession();
        set({ user: null, isLoggedIn: false, isReady: true, isInitializing: false });
      } finally {
        initializePromise = null;
      }
    })();

    await initializePromise;
  },

  login: async (email: string, password: string) => {
    try {
      const session = await authApi.login({ email: email.trim(), password });
      const user = await applySession(set, session);
      return { success: true, role: user?.role ?? null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in.';
      return { success: false, role: null, error: message };
    }
  },

  signup: async (payload: SignupPayload) => {
    try {
      const session = await authApi.register({
        fullName: payload.name,
        email: payload.email.trim(),
        password: payload.password,
        phone: payload.phone,
        role: payload.role,
        location: payload.location,
      });
      const user = await applySession(set, session);
      return { success: true, role: user?.role ?? null };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create account.';
      return { success: false, role: null, error: message };
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // We always clear local session, even if backend logout fails.
    }
    await clearStoredSession();
    set({ user: null, isLoggedIn: false });
  },
}));
