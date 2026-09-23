import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, Icon, IconBackButton, Loader} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {OrderStatus, OrderStatusEvent, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderTimeline'>;

const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: 'Order placed',
  accepted: 'Order accepted',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready for pickup',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Order cancelled',
  rejected: 'Order rejected',
};

function formatTime(iso?: string): string {
  if (!iso) {
    return '';
  }
  return new Date(iso).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}

export function OrderTimelineScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrderTimeline} = useOrders();
  const [events, setEvents] = useState<OrderStatusEvent[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getOrderTimeline(orderId)
      .then(list => { if (!cancelled) setEvents(list); })
      .catch(() => { if (!cancelled) setEvents([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [orderId, getOrderTimeline]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View>
          <Text style={styles.headerTitle}>{`Order Timeline · #${orderId}`}</Text>
          <Text style={styles.headerSubtitle}>Complete order journey</Text>
        </View>
      </View>

      {loading && <Loader label="Loading timeline…" fullscreen />}

      {!loading && (!events || events.length === 0) && (
        <EmptyState icon="clock" title="No timeline yet" description="Status updates for this order will show up here." />
      )}

      {!loading && events && events.length > 0 && (
        <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            {events.map((step, index) => (
              <View key={`${step.status}-${step.at}-${index}`} style={styles.stepRow}>
                <View style={styles.stepTrack}>
                  <View style={styles.stepDot}>
                    <Icon name="check" size={12} color={colors.white} />
                  </View>
                  {index < events.length - 1 && <View style={styles.stepLine} />}
                </View>
                <View style={styles.stepText}>
                  <View style={styles.stepHeaderRow}>
                    <Text style={styles.stepTime}>{formatTime(step.at)}</Text>
                    <Text style={styles.stepLabel}>{STATUS_LABEL[step.status]}</Text>
                  </View>
                  {!!step.note && <Text style={styles.stepSub}>{step.note}</Text>}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  body: {padding: spacing.lg, paddingBottom: spacing.xxxl},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  stepRow: {flexDirection: 'row', gap: spacing.md},
  stepTrack: {alignItems: 'center'},
  stepDot: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  stepLine: {width: 2, flex: 1, minHeight: 24, backgroundColor: colors.primarySurface, marginVertical: 2},
  stepText: {paddingBottom: spacing.lg, flex: 1},
  stepHeaderRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  stepTime: {...typography.captionSemibold, fontSize: 12, color: colors.primary},
  stepLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  stepSub: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
});
