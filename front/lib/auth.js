const TOKEN_KEY = "eventsync_token";
const ADMIN_KEY = "eventsync_admin";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}

export function getStoredAdmin() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredAdmin(admin) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function isAuthenticated() {
  return !!getToken();
}
