import React, {createContext, PropsWithChildren, useCallback, useContext, useMemo, useRef, useState} from 'react';
import {api} from '../services/api';

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
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({children}: PropsWithChildren<{}>) {
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<DeliveryOrder[]>([]);
  const [historyOrders, setHistoryOrders] = useState<DeliveryOrder[]>([]);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
  const [isLoadingActive, setIsLoadingActive] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // The backend doesn't remove an order from "available" just because this driver
  // rejected it (it only logs a DriverOrderResponse) — filter it out locally so it
  // doesn't reappear on the next poll.
  const dismissedOrderIdsRef = useRef<Set<string>>(new Set());

  const refreshAvailable = useCallback(async () => {
    setIsLoadingAvailable(true);
    try {
      const response = await api.get<DeliveryOrder[]>('/driver/orders/available');
      setAvailableOrders(response.data.filter((o) => !dismissedOrderIdsRef.current.has(o.id)));
    } finally {
      setIsLoadingAvailable(false);
    }
  }, []);

  const refreshActive = useCallback(async () => {
    setIsLoadingActive(true);
    try {
      const response = await api.get<DeliveryOrder[]>('/driver/orders/active');
      setActiveOrders(response.data);
    } finally {
      setIsLoadingActive(false);
    }
  }, []);

  const refreshHistory = useCallback(async (tab: HistoryTab = 'all') => {
    setIsLoadingHistory(true);
    try {
      const response = await api.get<DeliveryOrder[]>('/driver/orders/history', {params: {tab}});
      setHistoryOrders(response.data);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  const acceptOrder = useCallback(async (orderId: string): Promise<DeliveryOrder> => {
    const response = await api.post<DeliveryOrder>(`/driver/orders/${orderId}/accept`);
    setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
    setActiveOrders((prev) => [response.data, ...prev.filter((o) => o.id !== orderId)]);
    return response.data;
  }, []);

  const rejectOrder = useCallback(async (orderId: string, reasonCode?: string): Promise<void> => {
    await api.post(`/driver/orders/${orderId}/reject`, {reasonCode});
    dismissedOrderIdsRef.current.add(orderId);
    setAvailableOrders((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  const confirmPickup = useCallback(async (orderId: string): Promise<ConfirmPickupResult> => {
    const response = await api.post<DeliveryOrder & {devOtp?: string}>(`/driver/orders/${orderId}/pickup-confirm`);
    const {devOtp, ...order} = response.data;
    setActiveOrders((prev) => prev.map((o) => (o.id === orderId ? order : o)));
    return {order, devOtp};
  }, []);

  const verifyDeliveryOtp = useCallback(async (orderId: string, otp: string): Promise<DeliveryOrder> => {
    const response = await api.post<DeliveryOrder>(`/driver/orders/${orderId}/verify-otp`, {otp});
    setActiveOrders((prev) => prev.filter((o) => o.id !== orderId));
    setHistoryOrders((prev) => [response.data, ...prev.filter((o) => o.id !== orderId)]);
    return response.data;
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
    const response = await api.get<DeliveryOrder>(`/driver/orders/${orderId}`);
    return response.data;
  }, []);

  const getOrderTimeline = useCallback(async (orderId: string): Promise<OrderStatusEvent[]> => {
    const response = await api.get<OrderStatusEvent[]>(`/driver/orders/${orderId}/timeline`);
    return response.data;
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
