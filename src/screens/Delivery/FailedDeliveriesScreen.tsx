import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, Icon, IconBackButton, Loader} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'FailedDeliveries'>;

function formatDateTime(iso?: string): string {
  if (!iso) {
    return '';
  }
  const d = new Date(iso);
  return `${d.toLocaleDateString([], {month: 'short', day: 'numeric'})}, ${d.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}`;
}

export function FailedDeliveriesScreen({navigation}: Props) {
  const {historyOrders, isLoadingHistory, refreshHistory} = useOrders();

  useEffect(() => {
    refreshHistory('cancelled');
  }, [refreshHistory]);

  const failedItems = historyOrders.filter(o => o.status === 'cancelled' && o.cancelledBy === 'driver');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Failed Deliveries</Text>
      </View>

      <View style={styles.subheader}>
        <Text style={styles.subheaderText}>
          {`${failedItems.length} deliver${failedItems.length === 1 ? 'y' : 'ies'} you reported as undeliverable`}
        </Text>
      </View>

      {isLoadingHistory && <Loader label="Loading…" fullscreen />}

      {!isLoadingHistory && failedItems.length === 0 && (
        <EmptyState icon="check-circle" title="Nothing here" description="Deliveries you report as undeliverable will show up here." />
      )}

      {!isLoadingHistory && failedItems.length > 0 && (
        <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          {failedItems.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.topRow}>
                <Text style={styles.orderId}>#{item.orderNumber}</Text>
                <View style={styles.failedPill}>
                  <Text style={styles.failedPillText}>CANCELLED</Text>
                </View>
              </View>
              <Text style={styles.route}>{`${item.pickup.name} → ${item.address.city}`}</Text>
              <Text style={styles.time}>{formatDateTime(item.statusHistory[item.statusHistory.length - 1]?.at ?? item.updatedAt)}</Text>
              <View style={styles.bottomRow}>
                <Text style={styles.reason}>{item.cancelReason ?? 'Delivery could not be completed'}</Text>
              </View>
              <View style={styles.issueRow}>
                <Text style={styles.issueLabel}>Issue:</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('IssueResolution', {orderId: item.id})}>
                  <Text style={styles.issueLink}>View Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
  subheader: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  subheaderText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, ...shadows.sm},
  topRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  orderId: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  failedPill: {backgroundColor: '#FEF3F2', borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 2},
  failedPillText: {...typography.captionSemibold, fontSize: 10, color: '#D92D20'},
  route: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 4},
  time: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 2},
  bottomRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm},
  reason: {...typography.captionMedium, fontSize: 12, color: colors.warning},
  issueRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm},
  issueLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  issueLink: {...typography.captionSemibold, fontSize: 12, color: colors.primary},
});
