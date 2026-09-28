import {Linking} from 'react-native';

export const SUPPORT_PHONE = '+911800123456';
export const SUPPORT_PHONE_DISPLAY = '1800 123 456';
export const SUPPORT_EMAIL = 'support@verdant.example';

export function callSupport(): void {
  Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() => {});
}

export function emailSupport(subject?: string): void {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  Linking.openURL(`mailto:${SUPPORT_EMAIL}${query}`).catch(() => {});
}
