// Browser credentials are HttpOnly cookies owned by the API.
// Delete plaintext sessions left by previous versions.
export const clearStoredSession = async (): Promise<void> => {
  try { window.localStorage.removeItem('nlbb_auth_session'); } catch { /* storage may be unavailable */ }
};
