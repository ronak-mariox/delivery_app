import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for the Verdant backend.
//
//  - iOS Simulator: http://localhost:4000 works as-is.
//  - Android emulator: `localhost` refers to the emulator itself, not the host
//    machine — use `http://10.0.2.2:4000` instead.
//  - Physical device on the same Wi-Fi: use your computer's LAN IP, e.g.
//    `http://192.168.1.23:4000`.
//
// Swap the value below depending on where you're running the app.
const BASE_URL = 'http://localhost:4000/api';

// The server root (no trailing `/api`) — used to resolve relative asset URLs
// such as uploaded avatars/documents (served from `/uploads/...`).
const SERVER_ORIGIN = BASE_URL.replace(/\/api\/?$/, '');

/** Turns a relative `/uploads/...` path from the backend into an absolute URL. */
export function resolveAssetUrl(url?: string | null): string | undefined {
  if (!url) {
    return undefined;
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  return `${SERVER_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

export const ACCESS_TOKEN_KEY = 'driver_access_token';
export const REFRESH_TOKEN_KEY = 'driver_refresh_token';

export async function getAccessToken(): Promise<string | null> {
  return AsyncStorage.getItem(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  await AsyncStorage.multiSet([
    [ACCESS_TOKEN_KEY, accessToken],
    [REFRESH_TOKEN_KEY, refreshToken],
  ]);
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
}

// Called whenever the API client gives up on refreshing the session (refresh
// token missing/expired) so the app can reset navigation back to login. Wired
// up by DriverAuthContext.
let onForcedLogout: (() => void) | null = null;
export function registerForcedLogoutHandler(handler: (() => void) | null) {
  onForcedLogout = handler;
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & {_retry?: boolean};

// Only one refresh request should be in flight at a time; queue any other
// 401s behind it and retry them once it resolves.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
          return null;
        }
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {refreshToken});
        const {accessToken, refreshToken: newRefreshToken} = response.data;
        await setTokens(accessToken, newRefreshToken);
        return accessToken as string;
      } catch (err) {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
      // Refresh failed — force logout.
      await clearTokens();
      onForcedLogout?.();
    }

    return Promise.reject(error);
  },
);

export type DriverDocumentType = 'license_front' | 'license_back' | 'rc' | 'insurance';

export interface PickedAsset {
  uri?: string;
  type?: string;
  fileName?: string;
}

/** Uploads a picked image as one of the driver's KYC documents. */
export async function uploadDriverDocument(type: DriverDocumentType, asset: PickedAsset): Promise<{type: string; url: string}> {
  const formData = new FormData();
  formData.append('type', type);
  formData.append('file', {
    uri: asset.uri,
    type: asset.type || 'image/jpeg',
    name: asset.fileName || `${type}.jpg`,
  } as unknown as Blob);
  const response = await api.post<{type: string; url: string}>('/driver/registration/documents', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
  return response.data;
}

export interface ApiErrorDetail {
  path?: string;
  msg?: string;
}

export interface ApiErrorBody {
  error?: string;
  details?: ApiErrorDetail[];
}

/** Extracts a human-readable message from a backend error response. */
export function getApiErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorBody | undefined;
    if (data?.details?.length) {
      return data.details.map(d => d.msg).filter(Boolean).join('\n');
    }
    if (data?.error) {
      return data.error;
    }
    if (err.message) {
      return err.message;
    }
  }
  return fallback;
}
