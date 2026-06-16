import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach access token from cookie on every request.
// Note: accessToken is stored as a regular (non-httpOnly) cookie so the
// browser JS can read it. The refreshToken is httpOnly and is only
// accessed by the Next.js API routes server-side.
api.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
    if (match) {
      config.headers.Authorization = `Bearer ${decodeURIComponent(match[1])}`;
    }
  }
  return config;
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const requestUrl: string = originalRequest.url || '';
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/signup');

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshing &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await fetch('/api/auth/refresh', { method: 'POST' });
        if (res.ok) {
          isRefreshing = false;
          return api(originalRequest);
        }
      } catch {
        // fall through to redirect
      }

      isRefreshing = false;
      await fetch('/api/auth/logout', { method: 'POST' });
      if (typeof window !== 'undefined') {
        window.location.href = '/sign-in';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
