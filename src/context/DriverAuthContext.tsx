import React, {createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import axios from 'axios';
import {api, clearTokens, getAccessToken, getRefreshToken, registerForcedLogoutHandler, setTokens} from '../services/api';

const SESSION_RESTORE_RETRIES = 2;
const SESSION_RESTORE_RETRY_DELAY_MS = 800;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export interface Driver {
  id: string;
  phone: string;
  fullName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  status?: 'pending' | 'active' | 'suspended' | 'rejected';
  kycStatus?: 'pending' | 'verified' | 'rejected';
  registrationStep?: string | null;
  [key: string]: unknown;
}

export interface OtpRequestResult {
  message: string;
  devOtp?: string;
}

export interface OtpVerifyResult {
  accessToken: string;
  refreshToken: string;
  isNewDriver: boolean;
  driver: Driver;
}

interface DriverAuthContextValue {
  driver: Driver | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requestOtp: (phone: string) => Promise<OtpRequestResult>;
  verifyOtp: (phone: string, otp: string, intent?: 'login' | 'register') => Promise<OtpVerifyResult>;
  logout: () => Promise<void>;
  refreshDriver: () => Promise<Driver | null>;
}

const DriverAuthContext = createContext<DriverAuthContextValue | undefined>(undefined);

export function DriverAuthProvider({children}: PropsWithChildren<{}>) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    setDriver(null);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    registerForcedLogoutHandler(() => clearSession());
    return () => registerForcedLogoutHandler(null);
  }, [clearSession]);

  // Critically, a network failure here (server unreachable, brief connectivity blip) must
  // NOT clear the stored session — only a genuine auth rejection (401, meaning the
  // interceptor already tried to refresh and the backend rejected that too) should log the
  // driver out. Losing this distinction was why reopening the app after a moment offline
  // forced a fresh login even though the session was still perfectly valid.
  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      for (let attempt = 0; attempt <= SESSION_RESTORE_RETRIES; attempt++) {
        try {
          const response = await api.get<Driver>('/driver/me');
          setDriver(response.data);
          setIsAuthenticated(true);
          break;
        } catch (err) {
          const status = axios.isAxiosError(err) ? err.response?.status : undefined;
          if (status === 401) {
            await clearTokens();
            clearSession();
            break;
          }
          if (attempt === SESSION_RESTORE_RETRIES) {
            // Couldn't reach the server after retrying — keep the stored tokens (they're
            // likely still valid) rather than forcing a fresh login over a network problem.
            break;
          }
          await sleep(SESSION_RESTORE_RETRY_DELAY_MS);
        }
      }
      setIsLoading(false);
    })();
  }, [clearSession]);

  const requestOtp = useCallback(async (phone: string): Promise<OtpRequestResult> => {
    const response = await api.post<OtpRequestResult>('/driver/auth/otp/request', {phone});
    return response.data;
  }, []);

  const verifyOtp = useCallback(async (phone: string, otp: string, intent?: 'login' | 'register'): Promise<OtpVerifyResult> => {
    const response = await api.post<OtpVerifyResult>('/driver/auth/otp/verify', {phone, otp, ...(intent && {intent})});
    const {accessToken, refreshToken, driver: verifiedDriver} = response.data;
    await setTokens(accessToken, refreshToken);
    setDriver(verifiedDriver);
    setIsAuthenticated(true);
    return response.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await api.post('/auth/logout', {refreshToken});
      }
    } catch (err) {
      // Best-effort — always clear local session regardless of server response.
    } finally {
      await clearTokens();
      clearSession();
    }
  }, [clearSession]);

  const refreshDriver = useCallback(async (): Promise<Driver | null> => {
    try {
      const response = await api.get<Driver>('/driver/me');
      setDriver(response.data);
      return response.data;
    } catch (err) {
      return null;
    }
  }, []);

  const value = useMemo<DriverAuthContextValue>(
    () => ({driver, isAuthenticated, isLoading, requestOtp, verifyOtp, logout, refreshDriver}),
    [driver, isAuthenticated, isLoading, requestOtp, verifyOtp, logout, refreshDriver],
  );

  return <DriverAuthContext.Provider value={value}>{children}</DriverAuthContext.Provider>;
}

export function useDriverAuth(): DriverAuthContextValue {
  const ctx = useContext(DriverAuthContext);
  if (!ctx) {
    throw new Error('useDriverAuth must be used within a DriverAuthProvider');
  }
  return ctx;
}
