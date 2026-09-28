import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_BASE_URL, API_ORIGIN, API_TIMEOUT_MS} from '../config';

const BASE_URL = API_BASE_URL;
const SERVER_ORIGIN = API_ORIGIN;

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

export type ForcedLogoutReason = 'session_expired' | 'account_restricted';

// Called whenever the API client gives up on refreshing the session (refresh
// token missing/expired) or the backend says the account is restricted, so the
// app can reset navigation back to Welcome. Wired up by DriverAuthContext.
let onForcedLogout: ((reason: ForcedLogoutReason, message?: string) => void) | null = null;
export function registerForcedLogoutHandler(handler: ((reason: ForcedLogoutReason, message?: string) => void) | null) {
  onForcedLogout = handler;
}

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT_MS,
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
      await clearTokens();
      onForcedLogout?.('session_expired');
    }

    const body = error.response?.data as ApiErrorBody | undefined;
    if (error.response?.status === 403 && body?.reason === 'account_restricted') {
      await clearTokens();
      onForcedLogout?.('account_restricted', body.error);
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
  reason?: string;
  details?: ApiErrorDetail[];
  attemptsLeft?: number;
}

export function getApiErrorStatus(err: unknown): number | undefined {
  return axios.isAxiosError(err) ? err.response?.status : undefined;
}

export function getApiErrorBody(err: unknown): ApiErrorBody | undefined {
  return axios.isAxiosError(err) ? (err.response?.data as ApiErrorBody | undefined) : undefined;
}

/** Lists may come back as a bare array or wrapped as `{items}` — normalise both. */
export function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (data && typeof data === 'object' && Array.isArray((data as {items?: unknown}).items)) {
    return (data as {items: T[]}).items;
  }
  return [];
}

/** Uploads a picked image as issue/emergency evidence and returns its public URL. */
export async function uploadEvidence(asset: PickedAsset): Promise<string> {
  const formData = new FormData();
  formData.append('file', {
    uri: asset.uri,
    type: asset.type || 'image/jpeg',
    name: asset.fileName || `evidence-${Date.now()}.jpg`,
  } as unknown as Blob);
  const response = await api.post<{url: string}>('/driver/uploads/evidence', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });
  return response.data.url;
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
