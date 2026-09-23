import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, Icon, Loader} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryHistory'>;

type Tab = 'All' | 'Active' | 'Completed' | 'Cancelled';
const TABS: Tab[] = ['All', 'Active', 'Completed', 'Cancelled'];

function formatDateTime(iso?: string): string {
  if (!iso) {
    return '';
  }
  const d = new Date(iso);
  return `${d.toLocaleDateString([], {month: 'short', day: 'numeric'})}, ${d.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}`;
}

function lastEventAt(order: DeliveryOrder): string | undefined {
  return order.statusHistory[order.statusHistory.length - 1]?.at ?? order.updatedAt;
}

function routeText(order: DeliveryOrder): string {
  return `${order.pickup.name} → ${order.address.city}`;
}

export function DeliveryHistoryScreen({navigation}: Props) {
  const [tab, setTab] = useState<Tab>('All');
  const {
    activeOrders,
    historyOrders,
    isLoadingActive,
    isLoadingHistory,
    refreshActive,
    refreshHistory,
  } = useOrders();

  useEffect(() => {
    if (tab === 'Active') {
      refreshActive();
    } else if (tab === 'Completed') {
      refreshHistory('completed');
    } else if (tab === 'Cancelled') {
      refreshHistory('cancelled');
    } else {
      refreshHistory('all');
    }
  }, [tab, refreshActive, refreshHistory]);

  const deliveredOrders = historyOrders.filter(o => o.status === 'delivered');
  const cancelledOrders = historyOrders.filter(o => o.status === 'cancelled');
  const totalEarnings = deliveredOrders.reduce((sum, o) => sum + (o.driverEarnings?.total ?? 0), 0);
  const avgEarnings = deliveredOrders.length ? Math.round((totalEarnings / deliveredOrders.length) * 10) / 10 : 0;
  const bestEarnings = deliveredOrders.reduce((max, o) => Math.max(max, o.driverEarnings?.total ?? 0), 0);
  const isLoading = tab === 'Active' ? isLoadingActive : isLoadingHistory;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery History</Text>
        <View style={{width: 22}} />
      </View>

      {tab === 'All' && historyOrders.length > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{historyOrders.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{deliveredOrders.length}</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>{`₹${totalEarnings}`}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow} style={styles.tabScroll}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={[styles.tabPill, tab === t && styles.tabPillActive]} activeOpacity={0.8} onPress={() => setTab(t)}>
            <Text style={[styles.tabPillText, tab === t && styles.tabPillTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {isLoading && <Loader label="Loading…" />}

        {!isLoading && tab === 'All' && historyOrders.length === 0 && (
          <EmptyState icon="clock" title="No deliveries yet" description="Your completed and cancelled deliveries will show up here." />
        )}
        {!isLoading &&
          tab === 'All' &&
          historyOrders.map(item => {
            const isDelivered = item.status === 'delivered';
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.allRow}
                activeOpacity={0.7}
                onPress={() => {
                  if (isDelivered) {
                    navigation.navigate('DeliveryHistoryDetail', {orderId: item.id});
                  } else {
                    setTab('Cancelled');
                  }
                }}>
                <View style={[styles.dot, {backgroundColor: isDelivered ? colors.primary : colors.textMuted}]} />
                <View style={styles.flex}>
                  <View style={styles.allRowTop}>
                    <Text style={styles.allOrderId}>#{item.orderNumber}</Text>
                    <Text style={styles.allAmount}>{isDelivered ? `₹${item.driverEarnings?.total ?? 0}` : '₹0'}</Text>
                  </View>
                  <View style={styles.allRowMid}>
                    <Text style={styles.allRouteText}>{routeText(item)}</Text>
                    <View style={[styles.statusPill, {backgroundColor: isDelivered ? colors.primarySurface : '#F3F4F6'}]}>
                      <Text style={[styles.statusPillText, {color: isDelivered ? colors.primary : '#6B7280'}]}>
                        {isDelivered ? 'DELIVERED' : 'CANCELLED'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.allTime}>{formatDateTime(item.deliveredAt ?? lastEventAt(item))}</Text>
                </View>
              </TouchableOpacity>
            );
          })}

        {!isLoading && tab === 'Active' && activeOrders.length === 0 && (
          <EmptyState icon="scooter" title="No active deliveries" description="Orders you accept will show up here." />
        )}
        {!isLoading &&
          tab === 'Active' &&
          activeOrders.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.activeCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('HomeActiveDelivery', {orderId: item.id})}>
              <View style={styles.activeTopRow}>
                <View style={styles.flex}>
                  <Text style={styles.activeOrderId}>#{item.orderNumber}</Text>
                  <Text style={styles.activeStore}>{item.pickup.name}</Text>
                </View>
                <Text style={styles.activeAmount}>{`₹${item.pricing.grandTotal}`}</Text>
              </View>
              <View style={styles.activeStatusRow}>
                <View style={styles.activeStatusDot} />
                <Text style={styles.activeStatusText}>
                  {item.status === 'out_for_delivery' ? 'En Route to Customer' : 'Heading to Store'}
                </Text>
              </View>
              <View style={styles.activeMetaRow}>
                <View>
                  <Text style={styles.activeMetaLabel}>Customer</Text>
                  <Text style={styles.activeMetaValue}>{item.address.line1}</Text>
                </View>
                <View>
                  <Text style={styles.activeMetaLabel}>City</Text>
                  <Text style={styles.activeMetaValue}>{item.address.city}</Text>
                </View>
              </View>
              <Text style={styles.activeEarningsNote}>{`Earnings: ₹${item.pricing.grandTotal} (pending)`}</Text>
            </TouchableOpacity>
          ))}

        {!isLoading && tab === 'Completed' && deliveredOrders.length === 0 && (
          <EmptyState icon="check-circle" title="No completed deliveries" description="Deliveries you finish will show up here." />
        )}
        {!isLoading &&
          tab === 'Completed' &&
          deliveredOrders.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.completedRow}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('DeliveryHistoryDetail', {orderId: item.id})}>
              <View style={[styles.dot, {backgroundColor: colors.primary}]} />
              <View style={styles.flex}>
                <View style={styles.allRowTop}>
                  <Text style={styles.allOrderId}>#{item.orderNumber}</Text>
                  <Text style={styles.completedAmount}>{`₹${item.driverEarnings?.total ?? 0}`}</Text>
                </View>
                <Text style={styles.completedTime}>{formatDateTime(item.deliveredAt)}</Text>
              </View>
              <Icon name="chevron-right" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        {!isLoading && tab === 'Completed' && deliveredOrders.length > 0 && (
          <View style={styles.completedFooter}>
            <View style={styles.completedFooterCol}>
              <Text style={styles.completedFooterValue}>{`₹${totalEarnings}`}</Text>
              <Text style={styles.completedFooterLabel}>Total</Text>
            </View>
            <View style={styles.completedFooterDivider} />
            <View style={styles.completedFooterCol}>
              <Text style={styles.completedFooterValue}>{`₹${avgEarnings}`}</Text>
              <Text style={styles.completedFooterLabel}>Avg</Text>
            </View>
            <View style={styles.completedFooterDivider} />
            <View style={styles.completedFooterCol}>
              <Text style={[styles.completedFooterValue, styles.completedFooterValueGreen]}>{`₹${bestEarnings}`}</Text>
              <Text style={styles.completedFooterLabel}>Best</Text>
            </View>
          </View>
        )}

        {!isLoading && tab === 'Cancelled' && cancelledOrders.length === 0 && (
          <EmptyState icon="x-circle" title="No cancelled deliveries" description="Deliveries that get cancelled will show up here." />
        )}
        {!isLoading &&
          tab === 'Cancelled' &&
          cancelledOrders.map(item => (
            <View key={item.id} style={styles.cancelCard}>
              <View style={styles.allRowTop}>
                <Text style={styles.allOrderId}>#{item.orderNumber}</Text>
                <View style={styles.cancelledPill}>
                  <Text style={styles.cancelledPillText}>CANCELLED</Text>
                </View>
              </View>
              <Text style={styles.cancelRoute}>{routeText(item)}</Text>
              <Text style={styles.cancelTime}>{formatDateTime(lastEventAt(item))}</Text>
              <Text style={styles.cancelReason}>{item.cancelReason ?? `Cancelled by ${item.cancelledBy ?? 'system'}`}</Text>
            </View>
          ))}
        {!isLoading && tab === 'Cancelled' && (
          <TouchableOpacity style={styles.infoBanner} activeOpacity={0.8} onPress={() => navigation.navigate('FailedDeliveries')}>
            <Icon name="info" size={16} color={colors.primary} />
            <Text style={styles.infoBannerText}>Deliveries you reported as undeliverable — view them here.</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  statsRow: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, padding: spacing.lg},
  statTile: {flex: 1, backgroundColor: colors.background, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center'},
  statValue: {...typography.h4, fontSize: 18, color: colors.textPrimary},
  statLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 2},
  tabScroll: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, flexGrow: 0},
  tabRow: {flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  tabPill: {backgroundColor: '#F3F4F6', borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs},
  tabPillActive: {backgroundColor: colors.primary},
  tabPillText: {...typography.labelSemibold, fontSize: 13, color: colors.textSecondary},
  tabPillTextActive: {color: colors.white},
  body: {padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxxl},
  dot: {width: 10, height: 10, borderRadius: 5, marginTop: 4},
  allRow: {flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  allRowTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  allRowMid: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2},
  allOrderId: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  allAmount: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  allRouteText: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  allTime: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 2},
  statusPill: {borderRadius: radius.sm, paddingHorizontal: 7, paddingVertical: 2},
  statusPillText: {...typography.captionSemibold, fontSize: 10},
  activeCard: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.md,
  },
  activeTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  activeOrderId: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  activeStore: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  activeAmount: {...typography.h4, fontSize: 16, color: colors.primary},
  activeStatusRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  activeStatusDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  activeStatusText: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  activeMetaRow: {flexDirection: 'row', gap: spacing.xl},
  activeMetaLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  activeMetaValue: {...typography.captionMedium, fontSize: 12, color: colors.textPrimary, marginTop: 1},
  activeEarningsNote: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  completedRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  completedAmount: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  completedTime: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  completedFooter: {flexDirection: 'row', backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: spacing.md, marginTop: spacing.sm},
  completedFooterCol: {flex: 1, alignItems: 'center'},
  completedFooterDivider: {width: 1, backgroundColor: colors.border},
  completedFooterValue: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary},
  completedFooterValueGreen: {color: colors.primary},
  completedFooterLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 2},
  cancelCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  cancelledPill: {backgroundColor: '#F3F4F6', borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 2},
  cancelledPillText: {...typography.captionSemibold, fontSize: 10, color: '#6B7280'},
  cancelRoute: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 4},
  cancelTime: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 4},
  cancelReason: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: spacing.sm},
  infoBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.xs},
  infoBannerText: {...typography.label, fontSize: 13, color: colors.primaryDark, flex: 1},
});
