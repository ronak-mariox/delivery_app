import React, {useCallback, useEffect, useState} from 'react';
import {Alert, RefreshControl, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/types';
import {Badge, Button, Card, Icon, Loader, ProgressBar, Screen, StatTile, ToggleSwitch} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {api, getApiErrorMessage} from '../../services/api';
import {
  EarningsSummary,
  Incentive,
  PerformanceSummary,
  getEarningsSummary,
  getPerformanceSummary,
  getUnreadNotificationCount,
  listIncentives,
} from '../../services/driverApi';
import {driverName, useDriverAuth} from '../../context/DriverAuthContext';
import {useOrders} from '../../context/OrdersContext';
import {routeForDriver} from '../../utils/driverRouting';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const AVAILABLE_POLL_INTERVAL_MS = 8000;

interface HomeSummary {
  todayEarnings: number;
  todayDeliveries: number;
  activeOrderId: string | null;
}

function greetingForNow(): string {
  const hour = new Date().getHours();
  if (hour < 12) {return 'Good morning';}
  if (hour < 17) {return 'Good afternoon';}
  return 'Good evening';
}

export function HomeScreen({navigation}: Props) {
  const {driver, refreshDriver} = useDriverAuth();
  const {
    availableOrders,
    activeOrders,
    historyOrders,
    refreshAvailable,
    refreshActive,
    refreshHistory,
    dismissOrder,
    isOrderDismissed,
    lostOrder,
    clearLostOrder,
  } = useOrders();

  const [online, setOnline] = useState(!!driver?.isOnline);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [summary, setSummary] = useState<HomeSummary | null>(null);
  const [weekSummary, setWeekSummary] = useState<EarningsSummary | null>(null);
  const [performance, setPerformance] = useState<PerformanceSummary | null>(null);
  const [incentive, setIncentive] = useState<Incentive | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [focused, setFocused] = useState(false);

  const activeOrder = activeOrders[0];
  const lastDelivery = historyOrders[0];
  const isActiveAccount = driver?.status === 'active';

  // Pending/rejected/suspended accounts must never see the online toggle — send them to
  // the matching status screen instead.
  useEffect(() => {
    if (!driver || isActiveAccount) {
      return;
    }
    const target = routeForDriver(driver);
    navigation.reset({index: 0, routes: [{name: target.name, params: target.params} as never]});
  }, [driver, isActiveAccount, navigation]);

  const loadSummary = useCallback(async () => {
    try {
      const response = await api.get<HomeSummary>('/driver/home-summary');
      setSummary(response.data);
    } catch {
      // Non-critical — stats simply stay blank/stale until the next successful poll.
    }
  }, []);

  const loadSecondary = useCallback(async () => {
    const [week, perf, incentives, unread] = await Promise.allSettled([
      getEarningsSummary('week'),
      getPerformanceSummary(),
      listIncentives(),
      getUnreadNotificationCount(),
    ]);
    if (week.status === 'fulfilled') {setWeekSummary(week.value);}
    if (perf.status === 'fulfilled') {setPerformance(perf.value);}
    if (incentives.status === 'fulfilled') {setIncentive(incentives.value.find((i) => i.progress.status === 'in_progress') ?? incentives.value[0] ?? null);}
    if (unread.status === 'fulfilled') {setUnreadCount(unread.value);}
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setFocused(true);
      (async () => {
        const latest = await refreshDriver();
        if (!cancelled && latest) {setOnline(!!latest.isOnline);}
      })();
      loadSummary();
      loadSecondary();
      refreshActive().catch(() => {});
      refreshHistory('completed').catch(() => {});
      return () => {
        cancelled = true;
        setFocused(false);
      };
    }, [refreshDriver, loadSummary, loadSecondary, refreshActive, refreshHistory]),
  );

  // Backend is pull-based (no push), so poll for offers while online — but only while this
  // screen is focused so a request screen isn't interrupted by the next poll.
  useEffect(() => {
    if (!online || !focused || !isActiveAccount) {return;}
    refreshAvailable().catch(() => {});
    const interval = setInterval(() => {
      refreshAvailable().catch(() => {});
      refreshActive().catch(() => {});
    }, AVAILABLE_POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [online, focused, isActiveAccount, refreshAvailable, refreshActive]);

  useEffect(() => {
    if (!lostOrder || !focused) {return;}
    clearLostOrder();
    if (lostOrder.order?.status === 'cancelled') {
      navigation.navigate('OrderCancelledByCustomer', {orderId: lostOrder.orderId});
    } else {
      Alert.alert('Order no longer assigned', 'This delivery was removed from your active orders.');
    }
  }, [lostOrder, focused, clearLostOrder, navigation]);

  // Auto-surface the next available order as a full-screen request — only when there's no
  // delivery in progress, and never for an offer the driver already saw or dismissed.
  useEffect(() => {
    if (!online || !focused || activeOrders.length > 0) {return;}
    const next = availableOrders.find((o) => !isOrderDismissed(o.id));
    if (!next) {return;}
    dismissOrder(next.id);
    navigation.navigate('NewOrderRequest', {orderId: next.id});
  }, [online, focused, availableOrders, activeOrders, navigation, dismissOrder, isOrderDismissed]);

  const handleToggleOnline = useCallback(
    async (next: boolean) => {
      setOnline(next);
      setUpdatingStatus(true);
      try {
        await api.patch('/driver/status', {isOnline: next});
      } catch (err) {
        setOnline(!next);
        Alert.alert('Could not update status', getApiErrorMessage(err));
      } finally {
        setUpdatingStatus(false);
      }
    },
    [],
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadSummary(),
        loadSecondary(),
        refreshActive().catch(() => {}),
        refreshHistory('completed').catch(() => {}),
        online ? refreshAvailable().catch(() => {}) : Promise.resolve(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [loadSummary, loadSecondary, refreshActive, refreshHistory, refreshAvailable, online]);

  const addressLine = (() => {
    const addr = driver?.address;
    if (addr?.area && addr?.city) {return `${addr.area}, ${addr.city}`;}
    if (addr?.city) {return addr.city;}
    return 'Location not set';
  })();

  const incentiveRemaining = incentive ? Math.max(0, incentive.targetDeliveries - incentive.progress.currentProgress) : 0;
  const incentiveProgress = incentive && incentive.targetDeliveries > 0 ? Math.min(1, incentive.progress.currentProgress / incentive.targetDeliveries) : 0;
  const ratingLabel = performance?.rating != null ? performance.rating.toFixed(2) : '—';
  const acceptanceLabel = performance ? `${performance.acceptanceRate}%` : '—';

  if (!driver || !isActiveAccount) {
    return (
      <Screen backgroundColor={colors.background} edges={['top', 'bottom']}>
        <Loader />
      </Screen>
    );
  }

  return (
    <Screen
      backgroundColor={online ? colors.primary : colors.dark900}
      statusBarStyle="light-content"
      edges={['top', 'bottom']}
      scroll
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.white} />}>
      <View style={[styles.header, {backgroundColor: online ? colors.primary : colors.dark900}]}>
        <View style={styles.headerTop}>
          <View style={styles.headerUser}>
            <View style={[styles.avatarRing, online && styles.avatarRingOnline]}>
              <Icon name="user" size={22} color={colors.white} />
            </View>
            <View>
              <Text style={[styles.greeting, {color: online ? 'rgba(255,255,255,0.7)' : colors.textMuted}]}>{greetingForNow()}</Text>
              <Text style={styles.name}>{driverName(driver)}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.bellButton, {backgroundColor: online ? 'rgba(255,255,255,0.15)' : colors.dark800}]}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              accessibilityLabel="Emergency"
              onPress={() => navigation.navigate('EmergencySafetyHub')}>
              <Icon name="shield" size={18} color={colors.danger} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bellButton, {backgroundColor: online ? 'rgba(255,255,255,0.15)' : colors.dark800}]}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
              accessibilityLabel="Notifications"
              onPress={() => navigation.navigate('Notifications')}>
              <Icon name="bell" size={18} color={colors.white} />
              {unreadCount > 0 && <View style={styles.bellDot} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.statusCard, {backgroundColor: online ? 'rgba(255,255,255,0.15)' : colors.dark800}]}>
          <View style={styles.statusTextWrap}>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, {backgroundColor: online ? '#A7F3D0' : colors.dark600}]} />
              <Text style={[styles.statusLabel, {color: online ? colors.white : colors.textMuted}]}>
                {online ? 'ONLINE' : 'OFFLINE'}
              </Text>
            </View>
            <Text style={[styles.statusHint, {color: online ? 'rgba(255,255,255,0.7)' : colors.dark600}]}>
              {online ? "You're visible to nearby stores" : 'You are not receiving orders'}
            </Text>
          </View>
          <ToggleSwitch
            value={online}
            onValueChange={handleToggleOnline}
            disabled={updatingStatus}
            activeTrackColor="rgba(255,255,255,0.3)"
            inactiveTrackColor={colors.dark700}
          />
        </View>

        <TouchableOpacity style={styles.locationRow} activeOpacity={0.7} onPress={() => navigation.navigate('ProfileAddress')}>
          <Icon name="map-pin" size={13} color={online ? 'rgba(255,255,255,0.8)' : colors.dark600} />
          <Text style={[styles.locationText, {color: online ? 'rgba(255,255,255,0.8)' : colors.dark600}]}>{addressLine}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.flex} activeOpacity={0.8} onPress={() => navigation.navigate('EarningsDashboard')}>
            <StatTile value={`₹${summary?.todayEarnings ?? 0}`} label="Today's Earnings" valueColor={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flex}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DeliveriesCompleted')}>
            <StatTile value={`${summary?.todayDeliveries ?? 0}`} label="Deliveries" valueColor={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flex}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(online ? 'CustomerRating' : 'AcceptanceRate')}>
            <StatTile value={online ? ratingLabel : acceptanceLabel} label={online ? 'Rating' : 'Acceptance'} valueColor={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {online && activeOrder && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('HomeActiveDelivery', {orderId: activeOrder.id})}>
            <Card style={styles.activeDeliveryCard}>
              <View style={styles.activeDeliveryHeader}>
                <Badge label="ACTIVE DELIVERY" tone="primary" />
                <Text style={styles.activeDeliveryOrder}>#{activeOrder.orderNumber}</Text>
              </View>
              <Text style={styles.activeDeliveryRoute} numberOfLines={1}>
                {activeOrder.pickup.name} → {activeOrder.address.city}
              </Text>
              <Text style={styles.activeDeliveryMeta}>
                {activeOrder.status === 'out_for_delivery' ? 'Out for delivery' : 'Heading to pickup'} · ₹
                {activeOrder.driverEarnings?.total ?? activeOrder.pricing.deliveryFee}
              </Text>
            </Card>
          </TouchableOpacity>
        )}

        {online && !activeOrder && (
          <Card style={styles.waitingCard}>
            <TouchableOpacity style={styles.waitingContent} activeOpacity={0.8} onPress={() => refreshAvailable().catch(() => {})}>
              <View style={styles.waitingIcon}>
                <Icon name="clock" size={26} color={colors.primary} />
              </View>
              <Text style={styles.waitingTitle}>{'Waiting for orders…'}</Text>
              <Text style={styles.waitingSubtitle}>Stay in your zone for faster assignments</Text>
            </TouchableOpacity>
            {availableOrders.length > 1 ? (
              <TouchableOpacity style={styles.waitingTipsLink} activeOpacity={0.7} onPress={() => navigation.navigate('MultipleOrders')}>
                <Text style={styles.waitingTipsLinkText}>{availableOrders.length} orders available nearby</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.waitingTipsLink} activeOpacity={0.7} onPress={() => navigation.navigate('NoOrdersInZone')}>
                <Text style={styles.waitingTipsLinkText}>No orders yet? See what you can do</Text>
              </TouchableOpacity>
            )}
          </Card>
        )}

        {incentive && (
          <Card style={styles.incentiveCard} padded={false}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.incentiveCardTouchable}
              onPress={() => navigation.navigate('IncentiveDetail', {incentiveId: incentive.id})}>
              <View style={styles.incentiveHeader}>
                <View style={styles.flex}>
                  <Text style={styles.incentiveTitle}>{incentive.title}</Text>
                  <Text style={styles.incentiveSubtitle}>
                    {incentiveRemaining > 0
                      ? `${incentiveRemaining} more ${incentiveRemaining === 1 ? 'delivery' : 'deliveries'} → ₹${incentive.rewardAmount} bonus`
                      : `₹${incentive.rewardAmount} bonus unlocked`}
                  </Text>
                </View>
                <Badge label={`${incentive.progress.currentProgress}/${incentive.targetDeliveries}`} tone="primary" />
              </View>
              <ProgressBar progress={incentiveProgress} height={online ? 8 : 6} style={styles.incentiveProgress} />
            </TouchableOpacity>
          </Card>
        )}

        {!online && (
          <View style={styles.quickGrid}>
            <QuickAction icon="credit-card" title="Earnings" subtitle="View history" onPress={() => navigation.navigate('EarningsDashboard')} />
            <QuickAction icon="bar-chart" title="Performance" subtitle="Stats & ratings" onPress={() => navigation.navigate('Performance')} />
            <QuickAction icon="headphones" title="Support" subtitle="Get help" onPress={() => navigation.navigate('SupportHub')} />
            <QuickAction icon="user" title="Profile" subtitle="My account" onPress={() => navigation.navigate('Profile')} />
          </View>
        )}

        {online && weekSummary && (
          <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('WeeklyEarnings')}>
            <Card style={styles.weekCard}>
              <Text style={styles.weekTitle}>This Week</Text>
              <View style={styles.weekRows}>
                <WeekRow label="Total Earnings" value={`₹${weekSummary.totalEarnings}`} highlight />
                <WeekRow label="Deliveries Completed" value={`${weekSummary.deliveries}`} />
                {performance && <WeekRow label="On-time Rate" value={`${performance.onTimeRate}%`} />}
                {performance?.rating != null && <WeekRow label="Customer Rating" value={`${performance.rating.toFixed(2)} ★`} tone={colors.warning} />}
              </View>
            </Card>
          </TouchableOpacity>
        )}

        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('DeliveryHistory')}>
          <Card style={styles.lastDeliveryCard}>
            <Text style={styles.lastDeliveryTitle}>Last Delivery</Text>
            {lastDelivery ? (
              <View style={styles.lastDeliveryRow}>
                <View style={styles.lastDeliveryInfo}>
                  <Text style={styles.lastDeliveryOrder}>Order #{lastDelivery.orderNumber}</Text>
                  <Text style={styles.lastDeliveryRoute} numberOfLines={1}>
                    {lastDelivery.pickup.name} → {lastDelivery.address.city}
                  </Text>
                  <Text style={styles.lastDeliveryMeta}>
                    {lastDelivery.deliveredAt ? new Date(lastDelivery.deliveredAt).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'}) : ''}
                  </Text>
                </View>
                <View style={styles.lastDeliveryAmountWrap}>
                  <Text style={styles.lastDeliveryAmount}>₹{lastDelivery.driverEarnings?.total ?? lastDelivery.pricing.deliveryFee}</Text>
                  <Badge label="Delivered" tone="success" />
                </View>
              </View>
            ) : (
              <Text style={styles.lastDeliveryMeta}>No deliveries yet</Text>
            )}
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button
          label={online ? 'Go Offline' : 'Go Online'}
          variant={online ? 'secondary' : 'primary'}
          icon={online ? undefined : 'arrow-right'}
          iconPosition="right"
          disabled={updatingStatus}
          onPress={() => handleToggleOnline(!online)}
        />
      </View>
    </Screen>
  );
}

function QuickAction({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ComponentProps<typeof Icon>['name'];
  title: string;
  subtitle: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.quickAction} activeOpacity={0.8} onPress={onPress} disabled={!onPress}>
      <View style={styles.quickActionIcon}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.quickActionText}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

function WeekRow({label, value, highlight, tone}: {label: string; value: string; highlight?: boolean; tone?: string}) {
  return (
    <View style={styles.weekRow}>
      <Text style={styles.weekRowLabel}>{label}</Text>
      <Text style={[styles.weekRowValue, highlight && {color: colors.primary}, tone && {color: tone}]}>{value}</Text>
    </View>
  );
}

const avatarSize = 40;

const styles = StyleSheet.create({
  header: {paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md},
  headerTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  headerUser: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  avatarRing: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    backgroundColor: colors.dark800,
    borderWidth: 2,
    borderColor: colors.dark700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRingOnline: {backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.5)'},
  greeting: {...typography.caption},
  name: {...typography.bodyBold, color: colors.white},
  headerActions: {flexDirection: 'row', gap: spacing.sm},
  bellButton: {width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center'},
  bellDot: {position: 'absolute', top: 7, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning, borderWidth: 2, borderColor: colors.primary},
  statusCard: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: radius.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  statusTextWrap: {flex: 1, gap: 4},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  statusDot: {width: 10, height: 10, borderRadius: 5},
  statusLabel: {...typography.bodyBold, fontSize: 14},
  statusHint: {...typography.caption},
  locationRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  locationText: {...typography.caption},
  body: {padding: spacing.lg, gap: spacing.lg, backgroundColor: colors.background},
  statsRow: {flexDirection: 'row', gap: spacing.sm},
  flex: {flex: 1},
  activeDeliveryCard: {gap: spacing.xs, borderWidth: 2, borderColor: colors.primary},
  activeDeliveryHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  activeDeliveryOrder: {...typography.captionSemibold, color: colors.textSecondary},
  activeDeliveryRoute: {...typography.labelSemibold, color: colors.textPrimary},
  activeDeliveryMeta: {...typography.caption, color: colors.textSecondary},
  waitingCard: {alignItems: 'center', paddingVertical: spacing.xl},
  waitingContent: {alignItems: 'center', gap: spacing.xs},
  waitingIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySurface,
    borderWidth: 2,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  waitingTitle: {...typography.bodyLgMedium, fontSize: 15, color: colors.textPrimary},
  waitingSubtitle: {...typography.label, color: colors.textSecondary},
  waitingTipsLink: {marginTop: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border},
  waitingTipsLinkText: {...typography.captionSemibold, color: colors.primary, textAlign: 'center'},
  incentiveCard: {gap: spacing.sm},
  incentiveCardTouchable: {gap: spacing.sm, padding: spacing.lg},
  incentiveHeader: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'},
  incentiveTitle: {...typography.labelSemibold, color: colors.textPrimary, fontSize: 13},
  incentiveSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  incentiveProgress: {marginTop: 2},
  quickGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  quickAction: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  quickActionIcon: {width: 38, height: 38, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  quickActionText: {flex: 1},
  quickActionTitle: {...typography.labelSemibold, color: colors.textPrimary},
  quickActionSubtitle: {...typography.caption, color: colors.textMuted},
  weekCard: {gap: spacing.sm},
  weekTitle: {...typography.labelSemibold, color: colors.textLabel, fontSize: 13},
  weekRows: {gap: spacing.sm},
  weekRow: {flexDirection: 'row', justifyContent: 'space-between'},
  weekRowLabel: {...typography.label, color: colors.textSecondary},
  weekRowValue: {...typography.labelSemibold, color: colors.textPrimary},
  lastDeliveryCard: {gap: spacing.sm},
  lastDeliveryTitle: {...typography.labelSemibold, color: colors.textLabel, fontSize: 13},
  lastDeliveryRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  lastDeliveryInfo: {flex: 1, gap: 2},
  lastDeliveryOrder: {...typography.caption, color: colors.textSecondary},
  lastDeliveryRoute: {...typography.labelSemibold, color: colors.textPrimary},
  lastDeliveryMeta: {...typography.caption, color: colors.textMuted},
  lastDeliveryAmountWrap: {alignItems: 'flex-end', gap: 4},
  lastDeliveryAmount: {...typography.title, color: colors.primary, fontSize: 18},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
