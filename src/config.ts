import {Platform} from 'react-native';

// Set this to your machine's LAN IP (e.g. 'http://192.168.1.23:4000') when running on
// a physical device; leave empty to use the simulator/emulator defaults below.
const DEV_API_ORIGIN_OVERRIDE = 'http://192.168.1.33:4000';

const DEV_API_PORT = 4000;

const PROD_API_ORIGIN = 'https://api.verdant.example';

function resolveOrigin(): string {
  if (!__DEV__) {
    return PROD_API_ORIGIN;
  }
  if (DEV_API_ORIGIN_OVERRIDE) {
    return DEV_API_ORIGIN_OVERRIDE;
  }
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${host}:${DEV_API_PORT}`;
}

export const API_ORIGIN = resolveOrigin();
export const API_BASE_URL = `${API_ORIGIN}/api`;
export const API_TIMEOUT_MS = 15000;
