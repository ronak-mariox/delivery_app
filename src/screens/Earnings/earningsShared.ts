import {useCallback, useEffect, useState} from 'react';
import {BadgeTone} from '../../components';
import {getApiErrorMessage} from '../../services/api';
import {EarningsPeriod, getEarningsHistory, Incentive, LedgerEntry, LedgerStatus, LedgerType} from '../../services/driverApi';

export const BASE_PAY_PER_DELIVERY = 30;

export function formatMoney(amount: number | null | undefined): string {
  const value = Number(amount ?? 0);
  const sign = value < 0 ? '-' : '';
  return `${sign}₹${Math.abs(value).toLocaleString('en-IN', {maximumFractionDigits: 2})}`;
}

export function formatDate(iso?: string | null): string {
  if (!iso) {
    return '—';
  }
  return new Date(iso).toLocaleDateString([], {month: 'short', day: 'numeric'});
}

export function formatTime(iso?: string | null): string {
  if (!iso) {
    return '';
  }
  return new Date(iso).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) {
    return '—';
  }
  return `${formatDate(iso)}, ${formatTime(iso)}`;
}

export function formatLongDate(iso?: string | null): string {
  if (!iso) {
    return '—';
  }
  return new Date(iso).toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'});
}

export const LEDGER_TYPE_LABELS: Record<LedgerType, string> = {
  delivery_fee: 'Delivery fee',
  distance_bonus: 'Distance bonus',
  ontime_bonus: 'On-time bonus',
  incentive_bonus: 'Incentive bonus',
  earnings_protection: 'Earnings protection',
  payout: 'Payout',
};

export const LEDGER_STATUS_LABELS: Record<LedgerStatus, string> = {
  pending: 'PENDING',
  settled: 'SETTLED',
  paid: 'PAID',
};

export const LEDGER_STATUS_TONE: Record<LedgerStatus, BadgeTone> = {
  pending: 'warning',
  settled: 'primary',
  paid: 'success',
};

export function ledgerTypeLabel(type: LedgerType): string {
  return LEDGER_TYPE_LABELS[type] ?? type;
}

export function isEarningEntry(entry: LedgerEntry): boolean {
  return entry.type !== 'payout';
}

// Mirrors the backend's periodRange(): today = since midnight, week = last 7 days, month = last 30 days.
export function periodStart(period: EarningsPeriod): Date {
  const now = new Date();
  if (period === 'today') {
    now.setHours(0, 0, 0, 0);
    return now;
  }
  const days = period === 'week' ? 7 : 30;
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

export function periodLabel(period: EarningsPeriod): string {
  if (period === 'today') {
    return new Date().toLocaleDateString([], {weekday: 'long', month: 'short', day: 'numeric'});
  }
  const from = periodStart(period);
  return `${formatDate(from.toISOString())} – ${formatDate(new Date().toISOString())}`;
}

// The history endpoint is paged newest-first, so keep pulling pages until we pass the period start.
export async function fetchLedgerForPeriod(period: EarningsPeriod, maxPages = 10): Promise<LedgerEntry[]> {
  const start = periodStart(period).getTime();
  const items: LedgerEntry[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const res = await getEarningsHistory(page, 100);
    items.push(...res.items.filter(i => new Date(i.createdAt).getTime() >= start));
    const oldest = res.items[res.items.length - 1];
    if (res.items.length === 0 || page >= res.totalPages || (oldest && new Date(oldest.createdAt).getTime() < start)) {
      break;
    }
  }
  return items;
}

export interface DayTotal {
  key: string;
  label: string;
  value: number;
}

export function groupByDay(entries: LedgerEntry[], days: number): DayTotal[] {
  const totals = new Map<string, number>();
  entries.filter(isEarningEntry).forEach(entry => {
    const key = new Date(entry.createdAt).toDateString();
    totals.set(key, (totals.get(key) ?? 0) + entry.amount);
  });
  const result: DayTotal[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    result.push({key, label: d.toLocaleDateString([], {weekday: 'short'}), value: totals.get(key) ?? 0});
  }
  return result;
}

export function useAsyncData<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      try {
        setData(await loader());
      } catch (err) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loader],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return {data, loading, refreshing, error, reload};
}

export function isIncentiveExpired(incentive: Incentive, now = Date.now()): boolean {
  return incentive.status === 'expired' || incentive.progress?.status === 'expired' || new Date(incentive.expiresAt).getTime() < now;
}

export function isIncentiveCompleted(incentive: Incentive): boolean {
  return incentive.progress?.status === 'completed';
}

export function isIncentiveActive(incentive: Incentive, now = Date.now()): boolean {
  return !isIncentiveExpired(incentive, now) && !isIncentiveCompleted(incentive) && new Date(incentive.startAt).getTime() <= now;
}

export function isIncentiveUpcoming(incentive: Incentive, now = Date.now()): boolean {
  return !isIncentiveExpired(incentive, now) && new Date(incentive.startAt).getTime() > now;
}

export function incentiveProgressRatio(incentive: Incentive): number {
  const current = incentive.progress?.currentProgress ?? 0;
  const target = incentive.targetDeliveries || 0;
  if (target <= 0) {
    return isIncentiveCompleted(incentive) ? 1 : 0;
  }
  return Math.min(1, Math.max(0, current / target));
}

export function incentiveEarned(incentive: Incentive): number {
  return incentive.progress?.payoutAmount ?? incentive.rewardAmount ?? 0;
}

export function incentiveTimeLeft(expiresAt: string, now = Date.now()): string {
  const diff = new Date(expiresAt).getTime() - now;
  if (Number.isNaN(diff)) {
    return '';
  }
  if (diff <= 0) {
    return 'Expired';
  }
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) {
    return `Ends in ${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Ends in ${hours}h ${minutes % 60}m`;
  }
  const days = Math.floor(hours / 24);
  return `Ends in ${days}d ${hours % 24}h`;
}
