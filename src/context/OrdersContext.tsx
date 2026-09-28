import React, {createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api, unwrapList} from '../services/api';

const DISMISSED_ORDERS_KEY = 'driver_dismissed_order_ids';
const MAX_DISMISSED_ORDERS = 200;

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'rejected';

export type HistoryTab = 'completed' | 'cancelled' | 'all';

export type DeliveryIssueType =
  | 'wrong_address'
  | 'package_damage'
  | 'vehicle_problem'
  | 'road_blockage'
  | 'safety_concern'
  | 'delivery_failed';

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  imageUrl?: string;
  price: number;
  mrp: number;
  quantity: number;
  subtotal: number;
}

export interface OrderAddress {
  contactName?: string;
  contactPhone?: string;
  line1: string;
  line2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
}

export interface OrderPricing {
  itemsTotal: number;
  taxTotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  grandTotal: number;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  at: string;
  note?: string;
}

export interface OrderPickupInfo {
  name: string;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface OrderEarnings {
  base: number;
  distance: number;
  onTimeBonus: number;
  incentiveBonus: number;
  total: number;
}

// Matches the shape driverOrderController's withPickupInfo()/toSafeJson() send over the wire.
export interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  vendorId: string;
  driverId?: string;
  items: OrderItem[];
  address: OrderAddress;
  pricing: OrderPricing;
  paymentMethod: 'cod' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  specialInstructions?: string;
  cancelReason?: string;
  cancelledBy?: 'customer' | 'vendor' | 'admin' | 'driver';
  placedAt: string;
  deliveredAt?: string;
  pickupConfirmedAt?: string;
  driverEarnings?: OrderEarnings;
  pickup: OrderPickupInfo;
  createdAt: string;
  updatedAt: string;
}

export interface ConfirmPickupResult {
  order: DeliveryOrder;
  devOtp?: string;
}

export interface ReportIssueResult {
  issue: {id: string; type: DeliveryIssueType; description?: string; evidenceUrls?: string[]};
  order: DeliveryOrder;
}

interface OrdersContextValue {
  availableOrders: DeliveryOrder[];
  activeOrders: DeliveryOrder[];
  historyOrders: DeliveryOrder[];
  isLoadingAvailable: boolean;
  isLoadingActive: boolean;
  isLoadingHistory: boolean;
  refreshAvailable: () => Promise<void>;
  refreshActive: () => Promise<void>;
  refreshHistory: (tab?: HistoryTab) => Promise<void>;
  acceptOrder: (orderId: string) => Promise<DeliveryOrder>;
  rejectOrder: (orderId: string, reasonCode?: string) => Promise<void>;
  confirmPickup: (orderId: string) => Promise<ConfirmPickupResult>;
  verifyDeliveryOtp: (orderId: string, otp: string) => Promise<DeliveryOrder>;
  reportIssue: (
    orderId: string,
    payload: {type: DeliveryIssueType; description?: string; evidenceUrls?: string[]},
  ) => Promise<ReportIssueResult>;
  getOrder: (orderId: string) => Promise<DeliveryOrder>;
  getOrderTimeline: (orderId: string) => Promise<OrderStatusEvent[]>;
  /** Marks an offer as seen so it is never auto-prompted again (persisted across launches). */
  dismissOrder: (orderId: string) => void;
  isOrderDismissed: (orderId: string) => boolean;
  /** An active order that disappeared on refresh without this driver completing it; `order` is null when it is no longer visible to us. */
  lostOrder: LostOrder | null;
  clearLostOrder: () => void;
}

export interface LostOrder {
  orderId: string;
  order: DeliveryOrder | null;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

// Order endpoints have returned both a bare order and `{order}` — accept either.
type OrderEnvelope = DeliveryOrder | {order: DeliveryOrder};

function unwrapOrder(data: OrderEnvelope): DeliveryOrder {
  return 'order' in data && data.order && typeof data.order === 'object' ? data.order : (data as DeliveryOrder);
}

export function OrdersProvider({children}: PropsWithChildren<{}>) {
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<DeliveryOrder[]>([]);
  const [historyOrders, setHistoryOrders] = useState<DeliveryOrder[]>([]);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
  const [isLoadingActive, setIsLoadingActive] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [lostOrder, setLostOrder] = useState<LostOrder | null>(null);
  const activeOrderIdsRef = useRef<string[]>([]);

  useEffect(() => {
    activeOrderIdsRef.current = activeOrders.map((o) => o.id);
  }, [activeOrders]);

  // Offers the driver already rejected, timed out on or dismissed must not be
  // re-prompted, even after an app restart — so the set is persisted.
  const dismissedOrderIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem(DISMISSED_ORDERS_KEY)
      .then((raw) => {
        if (!raw) {
          return;
        }
        const ids = JSON.parse(raw) as string[];
        ids.forEach((id) => dismissedOrderIdsRef.current.add(id));
        setAvailableOrders((prev) => prev.filter((o) => !dismissedOrderIdsRef.current.has(o.id)));
      })
      .catch(() => {});
  }, []);

  const dismissOrder = useCallback((orderId: string) => {
    dismissedOrderIdsRef.current.add(orderId);
    setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
    const ids = Array.from(dismissedOrderIdsRef.current).slice(-MAX_DISMISSED_ORDERS);
    AsyncStorage.setItem(DISMISSED_ORDERS_KEY, JSON.stringify(ids)).catch(() => {});
  }, []);

  const isOrderDismissed = useCallback((orderId: string) => dismissedOrderIdsRef.current.has(orderId), []);

  const refreshAvailable = useCallback(async () => {
    setIsLoadingAvailable(true);
    try {
      const response = await api.get('/driver/orders/available');
      setAvailableOrders(unwrapList<DeliveryOrder>(response.data).filter((o) => !dismissedOrderIdsRef.current.has(o.id)));
    } finally {
      setIsLoadingAvailable(false);
    }
  }, []);

  const refreshActive = useCallback(async () => {
    setIsLoadingActive(true);
    try {
      const response = await api.get('/driver/orders/active');
      const next = unwrapList<DeliveryOrder>(response.data);
      const missingId = activeOrderIdsRef.current.find((id) => !next.some((o) => o.id === id));
      setActiveOrders(next);
      if (missingId) {
        const order = await api
          .get<OrderEnvelope>(`/driver/orders/${missingId}`)
          .then((res) => unwrapOrder(res.data))
          .catch(() => null);
        if (order?.status !== 'delivered') {
          setLostOrder({orderId: missingId, order});
        }
      }
    } finally {
      setIsLoadingActive(false);
    }
  }, []);

  const clearLostOrder = useCallback(() => setLostOrder(null), []);

  const refreshHistory = useCallback(async (tab: HistoryTab = 'all') => {
    setIsLoadingHistory(true);
    try {
      const response = await api.get('/driver/orders/history', {params: {tab}});
      setHistoryOrders(unwrapList<DeliveryOrder>(response.data));
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const acceptOrder = useCallback(async (orderId: string): Promise<DeliveryOrder> => {
    const response = await api.post<OrderEnvelope>(`/driver/orders/${orderId}/accept`);
    const order = unwrapOrder(response.data);
    setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
    setActiveOrders((prev) => [order, ...prev.filter((o) => o.id !== orderId)]);
    return order;
  }, []);

  const rejectOrder = useCallback(
    async (orderId: string, reasonCode?: string): Promise<void> => {
      dismissOrder(orderId);
      await api.post(`/driver/orders/${orderId}/reject`, {reasonCode});
    },
    [dismissOrder],
  );

  const confirmPickup = useCallback(async (orderId: string): Promise<ConfirmPickupResult> => {
    const response = await api.post<OrderEnvelope & {devOtp?: string}>(`/driver/orders/${orderId}/pickup-confirm`);
    const {devOtp, ...rest} = response.data;
    const order = unwrapOrder(rest);
    setActiveOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)));
    return {order, devOtp};
  }, []);

  const verifyDeliveryOtp = useCallback(async (orderId: string, otp: string): Promise<DeliveryOrder> => {
    const response = await api.post<OrderEnvelope>(`/driver/orders/${orderId}/verify-otp`, {otp});
    const order = unwrapOrder(response.data);
    setActiveOrders((prev) => prev.filter((o) => o.id !== orderId));
    setHistoryOrders((prev) => [order, ...prev.filter((o) => o.id !== orderId)]);
    return order;
  }, []);

  const reportIssue = useCallback(
    async (
      orderId: string,
      payload: {type: DeliveryIssueType; description?: string; evidenceUrls?: string[]},
    ): Promise<ReportIssueResult> => {
      const response = await api.post<ReportIssueResult>(`/driver/orders/${orderId}/issue`, payload);
      const {order} = response.data;
      if (order.status === 'cancelled' || !order.driverId) {
        // Issue unassigned the order (back to available) or cancelled it outright —
        // either way it's no longer this driver's active delivery.
        setActiveOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        setActiveOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)));
      }
      return response.data;
    },
    [],
  );

  const getOrder = useCallback(async (orderId: string): Promise<DeliveryOrder> => {
    const response = await api.get<OrderEnvelope>(`/driver/orders/${orderId}`);
    return unwrapOrder(response.data);
  }, []);

  const getOrderTimeline = useCallback(async (orderId: string): Promise<OrderStatusEvent[]> => {
    const response = await api.get(`/driver/orders/${orderId}/timeline`);
    return unwrapList<OrderStatusEvent>(response.data);
  }, []);

  const value = useMemo<OrdersContextValue>(
    () => ({
      availableOrders,
      activeOrders,
      historyOrders,
      isLoadingAvailable,
      isLoadingActive,
      isLoadingHistory,
      refreshAvailable,
      refreshActive,
      refreshHistory,
      acceptOrder,
      rejectOrder,
      confirmPickup,
      verifyDeliveryOtp,
      reportIssue,
      getOrder,
      getOrderTimeline,
      dismissOrder,
      isOrderDismissed,
      lostOrder,
      clearLostOrder,
    }),
    [
      availableOrders,
      activeOrders,
      historyOrders,
      isLoadingAvailable,
      isLoadingActive,
      isLoadingHistory,
      refreshAvailable,
      refreshActive,
      refreshHistory,
      acceptOrder,
      rejectOrder,
      confirmPickup,
      verifyDeliveryOtp,
      reportIssue,
      getOrder,
      getOrderTimeline,
      dismissOrder,
      isOrderDismissed,
      lostOrder,
      clearLostOrder,
    ],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return ctx;
}
