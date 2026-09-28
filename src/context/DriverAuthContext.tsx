import React, {createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {Alert} from 'react-native';
import axios from 'axios';
import {api, clearTokens, ForcedLogoutReason, getAccessToken, getRefreshToken, registerForcedLogoutHandler, setTokens} from '../services/api';
import {resetToRoute} from '../navigation/navigationRef';

const SESSION_RESTORE_RETRIES = 2;
const SESSION_RESTORE_RETRY_DELAY_MS = 800;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms));
}

export type DriverStatus = 'pending' | 'active' | 'suspended' | 'rejected';
export type KycStatus = 'pending' | 'verified' | 'rejected';
export type VehicleType = 'motorbike' | 'scooter' | 'bicycle' | 'other';
export type DriverDocumentKey = 'license_front' | 'license_back' | 'rc' | 'insurance';

export interface DriverPersonalInfo {
  fullName?: string | null;
  email?: string | null;
  dob?: string | null;
  gender?: 'female' | 'male' | 'other' | null;
}

export interface DriverAddress {
  line1: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  addressType: 'home' | 'work' | 'other';
}

export interface DriverEmergencyContact {
  name: string;
  relationship: string;
  mobile: string;
  altMobile?: string;
}

export interface DriverVehicleDetails {
  registrationNumber: string;
  brand: string;
  model: string;
  year: number;
  fuelType: string;
  color: string;
  capacity?: string;
}

export interface DriverInsuranceDetails {
  insuranceType: string;
  policyNumber: string;
  validFrom: string;
  validUntil: string;
}

export interface DriverBankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifsc: string;
  upiId?: string;
}

export interface Driver {
  id: string;
  phone: string;
  // The backend has sent these both flat and nested under `personalInfo` — read via driverName()/driverPersonalInfo().
  fullName?: string | null;
  email?: string | null;
  dob?: string | null;
  gender?: 'female' | 'male' | 'other' | null;
  personalInfo?: DriverPersonalInfo | null;
  avatarUrl?: string | null;
  status?: DriverStatus;
  kycStatus?: KycStatus;
  registrationStep?: string | null;
  referenceId?: string | null;
  rejectionReason?: string | null;
  isOnline?: boolean;
  address?: DriverAddress | null;
  emergencyContact?: DriverEmergencyContact | null;
  vehicleType?: VehicleType | null;
  vehicleDetails?: DriverVehicleDetails | null;
  documents?: Partial<Record<DriverDocumentKey, string>> | null;
  insuranceDetails?: DriverInsuranceDetails | null;
  bankDetails?: DriverBankDetails | null;
  currentLocation?: {lat: number; lng: number; updatedAt: string} | null;
  createdAt?: string;
  updatedAt?: string;
}

export function driverPersonalInfo(driver: Driver | null | undefined): DriverPersonalInfo {
  return {
    fullName: driver?.personalInfo?.fullName ?? driver?.fullName ?? null,
    email: driver?.personalInfo?.email ?? driver?.email ?? null,
    dob: driver?.personalInfo?.dob ?? driver?.dob ?? null,
    gender: driver?.personalInfo?.gender ?? driver?.gender ?? null,
  };
}

export function driverName(driver: Driver | null | undefined, fallback = 'Driver'): string {
  return driverPersonalInfo(driver).fullName || fallback;
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
    registerForcedLogoutHandler((reason: ForcedLogoutReason, message?: string) => {
      clearSession();
      resetToRoute('Welcome');
      if (reason === 'account_restricted') {
        Alert.alert('Account restricted', message ?? 'This account has been restricted. Contact support for help.');
      } else {
        Alert.alert('Session expired', 'Your session has timed out. Please log in again.');
      }
    });
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
