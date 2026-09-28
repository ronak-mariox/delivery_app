import {api, unwrapList} from './api';
import {DeliveryOrder, OrderEarnings} from '../context/OrdersContext';

// ---------------------------------------------------------------------------
// Earnings
// ---------------------------------------------------------------------------

export type EarningsPeriod = 'today' | 'week' | 'month';

export interface EarningsSummary {
  totalEarnings: number;
  deliveries: number;
  breakdown: {
    deliveryFee: number;
    distanceBonus: number;
    onTimeBonus: number;
    incentiveBonus: number;
  };
  changeLabel: string;
  direction: 'up' | 'down' | 'flat';
}

export type LedgerType = 'delivery_fee' | 'distance_bonus' | 'ontime_bonus' | 'incentive_bonus' | 'earnings_protection' | 'payout';
export type LedgerStatus = 'pending' | 'settled' | 'paid';

export interface LedgerEntry {
  id: string;
  orderId?: string;
  type: LedgerType;
  amount: number;
  balanceAfter: number;
  status: LedgerStatus;
  reason: string;
  createdAt: string;
}

export interface Paged<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EarningsBreakdown {
  orderNumber: string;
  driverEarnings: OrderEarnings | null;
  ledger: LedgerEntry[];
}

export interface PayoutStatus {
  pendingAmount: number;
  lifetimePaid: number;
  nextPayoutDate: string;
}

export async function getEarningsSummary(period: EarningsPeriod): Promise<EarningsSummary> {
  const {data} = await api.get<EarningsSummary>('/driver/earnings/summary', {params: {period}});
  return data;
}

export async function getEarningsHistory(page = 1, limit = 30): Promise<Paged<LedgerEntry>> {
  const {data} = await api.get<Paged<LedgerEntry> | LedgerEntry[]>('/driver/earnings/history', {params: {page, limit}});
  if (Array.isArray(data)) {
    return {items: data, page, limit, total: data.length, totalPages: 1};
  }
  return data;
}

export async function getEarningsBreakdown(orderId: string): Promise<EarningsBreakdown> {
  const {data} = await api.get<EarningsBreakdown>(`/driver/earnings/breakdown/${orderId}`);
  return data;
}

export async function getPayoutStatus(): Promise<PayoutStatus> {
  const {data} = await api.get<PayoutStatus>('/driver/earnings/payout-status');
  return data;
}

// ---------------------------------------------------------------------------
// Incentives
// ---------------------------------------------------------------------------

export type IncentiveProgressStatus = 'in_progress' | 'completed' | 'expired' | 'partial';

export interface IncentiveCondition {
  label: string;
  type: string;
  threshold: number;
}

export interface Incentive {
  id: string;
  title: string;
  description: string;
  rewardAmount: number;
  targetDeliveries: number;
  startAt: string;
  expiresAt: string;
  status: 'active' | 'expired';
  conditions: IncentiveCondition[];
  progress: {
    currentProgress: number;
    status: IncentiveProgressStatus;
    completedAt: string | null;
    payoutAmount: number | null;
  };
}

export async function listIncentives(): Promise<Incentive[]> {
  const {data} = await api.get('/driver/incentives');
  return unwrapList<Incentive>(data);
}

export async function getIncentiveProgress(): Promise<Incentive[]> {
  const {data} = await api.get('/driver/incentives/progress');
  return unwrapList<Incentive>(data);
}

export async function getIncentive(id: string): Promise<Incentive> {
  const {data} = await api.get<Incentive>(`/driver/incentives/${id}`);
  return data;
}

export async function getBonusHistory(page = 1, limit = 30): Promise<Paged<LedgerEntry>> {
  const {data} = await api.get<Paged<LedgerEntry> | LedgerEntry[]>('/driver/incentives/bonus-history', {params: {page, limit}});
  if (Array.isArray(data)) {
    return {items: data, page, limit, total: data.length, totalPages: 1};
  }
  return data;
}

// ---------------------------------------------------------------------------
// Performance
// ---------------------------------------------------------------------------

export interface PerformanceSummary {
  acceptanceRate: number;
  completionRate: number;
  onTimeRate: number;
  rating: number | null;
  ratingCount: number;
  totalDeliveries: number;
}

export interface AcceptanceRate {
  accepted: number;
  rejected: number;
  total: number;
  rate: number;
}

export interface CompletionRate {
  delivered: number;
  cancelled: number;
  total: number;
  rate: number;
}

export interface RatingReview {
  stars: number;
  reviewText?: string;
  createdAt: string;
}

export interface RatingSummary {
  average: number | null;
  count: number;
  reviews: RatingReview[];
}

export interface Milestone {
  target: number;
  achieved: boolean;
  progress: number;
}

export interface Milestones {
  totalDeliveries: number;
  milestones: Milestone[];
}

export async function getPerformanceSummary(): Promise<PerformanceSummary> {
  const {data} = await api.get<PerformanceSummary>('/driver/performance/summary');
  return data;
}

export async function getAcceptanceRate(): Promise<AcceptanceRate> {
  const {data} = await api.get<AcceptanceRate>('/driver/performance/acceptance-rate');
  return data;
}

export async function getCompletionRate(): Promise<CompletionRate> {
  const {data} = await api.get<CompletionRate>('/driver/performance/completion-rate');
  return data;
}

export async function getRating(): Promise<RatingSummary> {
  const {data} = await api.get<RatingSummary>('/driver/performance/rating');
  return {...data, reviews: unwrapList<RatingReview>(data.reviews)};
}

export async function getMilestones(): Promise<Milestones> {
  const {data} = await api.get<Milestones>('/driver/performance/milestones');
  return data;
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export type NotificationCategory = 'Orders' | 'Earnings' | 'Account' | 'System';

export interface DriverNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  subtitle: string;
  isRead: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  orderId?: string;
  orderNumber?: string;
  data?: Record<string, unknown>;
  createdAt: string;
}

export async function listNotifications(): Promise<DriverNotification[]> {
  const {data} = await api.get('/driver/notifications');
  return unwrapList<DriverNotification>(data);
}

export async function getUnreadNotificationCount(): Promise<number> {
  const {data} = await api.get<{count: number}>('/driver/notifications/unread-count');
  return data.count ?? 0;
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.patch(`/driver/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch('/driver/notifications/read-all');
}

export async function deleteNotification(id: string): Promise<void> {
  await api.delete(`/driver/notifications/${id}`);
}

export async function clearAllNotifications(): Promise<void> {
  await api.delete('/driver/notifications');
}

// ---------------------------------------------------------------------------
// Emergency
// ---------------------------------------------------------------------------

export type EmergencyIncidentType = 'accident' | 'medical' | 'harassment' | 'theft' | 'vehicle_breakdown' | 'other';
export type EmergencyIncidentStatus = 'notified' | 'reviewing' | 'follow_up_scheduled' | 'resolved';

export interface EmergencyIncident {
  id: string;
  orderId?: string;
  type: EmergencyIncidentType;
  description?: string;
  medicalNeeded: boolean;
  evidenceUrls: string[];
  location?: {lat: number; lng: number; address?: string};
  occurredAt: string;
  status: EmergencyIncidentStatus;
  resolvedAt?: string;
  actionTaken?: string;
  earningsProtectedAmount?: number;
  orderReassigned: boolean;
  createdAt: string;
}

export interface IncidentInput {
  type: EmergencyIncidentType;
  orderId?: string;
  description?: string;
  medicalNeeded?: boolean;
  evidenceUrls?: string[];
  lat?: number;
  lng?: number;
}

export interface LocationShare {
  id: string;
  lat: number;
  lng: number;
  startedAt: string;
  endedAt?: string | null;
}

export async function activateEmergency(input: IncidentInput): Promise<EmergencyIncident> {
  const {data} = await api.post<EmergencyIncident>('/driver/emergency/activate', input);
  return data;
}

export async function reportEmergencyIncident(input: IncidentInput): Promise<EmergencyIncident> {
  const {data} = await api.post<EmergencyIncident>('/driver/emergency/incidents', input);
  return data;
}

export async function getEmergencyIncident(id: string): Promise<EmergencyIncident> {
  const {data} = await api.get<EmergencyIncident>(`/driver/emergency/incidents/${id}`);
  return data;
}

export async function shareEmergencyLocation(input: {lat: number; lng: number; orderId?: string; incidentId?: string}): Promise<LocationShare> {
  const {data} = await api.post<LocationShare>('/driver/emergency/share-location', input);
  return data;
}

export async function stopSharingEmergencyLocation(): Promise<void> {
  await api.post('/driver/emergency/stop-sharing');
}

export async function contactEmergencySupport(message: string, orderId?: string): Promise<void> {
  await api.post('/driver/emergency/support-contact', {message, ...(orderId && {orderId})});
}

// ---------------------------------------------------------------------------
// Orders (typed helpers that don't need context state)
// ---------------------------------------------------------------------------

export async function fetchOrder(orderId: string): Promise<DeliveryOrder> {
  const {data} = await api.get<DeliveryOrder>(`/driver/orders/${orderId}`);
  return data;
}
