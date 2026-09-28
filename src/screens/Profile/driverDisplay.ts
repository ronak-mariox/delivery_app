import {BadgeTone, IconName} from '../../components';
import {Driver, DriverDocumentKey, DriverStatus, KycStatus, VehicleType} from '../../context/DriverAuthContext';

export {SUPPORT_EMAIL, SUPPORT_PHONE} from '../Support/supportContacts';

export const DOCUMENT_KEYS: DriverDocumentKey[] = ['license_front', 'license_back', 'rc', 'insurance'];

export const DOCUMENT_META: Record<DriverDocumentKey, {title: string; description: string; icon: IconName}> = {
  license_front: {title: 'Driving Licence (Front)', description: 'Front side of your driving licence', icon: 'file-text'},
  license_back: {title: 'Driving Licence (Back)', description: 'Back side of your driving licence', icon: 'file-text'},
  rc: {title: 'Registration Certificate', description: 'RC book of your registered vehicle', icon: 'file-text'},
  insurance: {title: 'Vehicle Insurance', description: 'Active insurance policy for your vehicle', icon: 'shield'},
};

export const VEHICLE_TYPE_LABEL: Record<VehicleType, string> = {
  motorbike: 'Motorbike',
  scooter: 'Scooter',
  bicycle: 'Bicycle',
  other: 'Other',
};

export const VEHICLE_TYPE_ICON: Record<VehicleType, IconName> = {
  motorbike: 'motorbike',
  scooter: 'scooter',
  bicycle: 'bicycle',
  other: 'truck',
};

export function kycBadge(kycStatus?: KycStatus | null): {label: string; tone: BadgeTone} {
  switch (kycStatus) {
    case 'verified':
      return {label: 'Verified', tone: 'success'};
    case 'rejected':
      return {label: 'Rejected', tone: 'warning'};
    default:
      return {label: 'Under review', tone: 'warning'};
  }
}

export function statusBadge(status?: DriverStatus | null): {label: string; tone: BadgeTone} {
  switch (status) {
    case 'active':
      return {label: 'Active', tone: 'success'};
    case 'suspended':
      return {label: 'Suspended', tone: 'warning'};
    case 'rejected':
      return {label: 'Rejected', tone: 'warning'};
    default:
      return {label: 'Pending approval', tone: 'neutral'};
  }
}

export function formatDate(value?: string | null): string {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'});
}

export function formatPhone(phone?: string | null): string {
  if (!phone) {
    return '—';
  }
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

export function maskAccountNumber(accountNumber?: string | null): string {
  if (!accountNumber) {
    return '—';
  }
  const digits = accountNumber.replace(/\s/g, '');
  if (digits.length <= 4) {
    return digits;
  }
  return `${'•'.repeat(Math.min(digits.length - 4, 8))} ${digits.slice(-4)}`;
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.slice(0, 2).map(part => part[0]?.toUpperCase() ?? '');
  return letters.join('') || 'D';
}

export function isExpired(validUntil?: string | null): boolean {
  if (!validUntil) {
    return false;
  }
  const date = new Date(validUntil);
  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
}

export function documentUrl(driver: Driver | null, key: DriverDocumentKey): string | undefined {
  return driver?.documents?.[key] || undefined;
}
