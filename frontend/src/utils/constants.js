const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const BASE_URL =
  configuredApiUrl ||
  (import.meta.env.DEV ? "http://localhost:3000" : window.location.origin);
