import {IconName} from '../../components';
import {DriverNotification, NotificationCategory} from '../../services/driverApi';
import {colors} from '../../theme';

export type NotificationSection = 'Today' | 'Yesterday' | 'Earlier';
export const SECTIONS: NotificationSection[] = ['Today', 'Yesterday', 'Earlier'];

export interface CategoryAccent {
  bg: string;
  color: string;
  border: string;
}

const CATEGORY_ICON: Record<NotificationCategory, IconName> = {
  Orders: 'package',
  Earnings: 'wallet',
  Account: 'shield',
  System: 'megaphone',
};

const CATEGORY_ACCENT: Record<NotificationCategory, CategoryAccent> = {
  Orders: {bg: colors.primarySurface, color: colors.primary, border: colors.primary},
  Earnings: {bg: colors.warningSurface, color: colors.warning, border: colors.warning},
  Account: {bg: colors.infoSurface, color: colors.info, border: colors.info},
  System: {bg: colors.dark800, color: colors.white, border: colors.dark800},
};

const FALLBACK_ACCENT: CategoryAccent = {bg: '#F3F4F6', color: colors.textSecondary, border: colors.border};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function iconFor(category: string): IconName {
  return CATEGORY_ICON[category as NotificationCategory] ?? 'bell';
}

export function accentFor(category: string): CategoryAccent {
  return CATEGORY_ACCENT[category as NotificationCategory] ?? FALLBACK_ACCENT;
}

export function orderIdFor(n: DriverNotification): string | undefined {
  if (n.orderId) {
    return n.orderId;
  }
  if (n.relatedEntityType?.toLowerCase() === 'order' && n.relatedEntityId) {
    return n.relatedEntityId;
  }
  return undefined;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function sectionFor(iso: string): NotificationSection {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return 'Earlier';
  }
  const today = startOfDay(new Date());
  const day = startOfDay(d);
  if (day >= today) {
    return 'Today';
  }
  if (day >= today - 24 * 60 * 60 * 1000) {
    return 'Yesterday';
  }
  return 'Earlier';
}

function formatClock(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${m} ${suffix}`;
}

export function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const diffMin = Math.floor((Date.now() - d.getTime()) / 60000);
  if (diffMin < 1) {
    return 'Just now';
  }
  if (diffMin < 60) {
    return `${diffMin} min ago`;
  }
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24 && sectionFor(iso) === 'Today') {
    return `${diffHrs} ${diffHrs === 1 ? 'hr' : 'hrs'} ago`;
  }
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  const section = sectionFor(iso);
  if (section === 'Today' || section === 'Yesterday') {
    return `${section}, ${formatClock(d)}`;
  }
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${formatClock(d)}`;
}
