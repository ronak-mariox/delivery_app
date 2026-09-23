import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryEarnings'>;

const INFO_ROWS = [
  {label: 'Store', value: 'Swiggy Instamart, Koramangala'},
  {label: 'Customer', value: 'HSR Layout Sector 2'},
  {label: 'Delivered', value: '3:04 PM · 22 min'},
  {label: 'Distance', value: '4.8 km total'},
];

const BREAKDOWN_ROWS = [
  {label: 'Base pay', value: '₹50.00'},
  {label: 'Distance pay (3.6 km × ₹7)', value: '₹25.20'},
  {label: 'Pickup bonus', value: '₹4.00'},
  {label: 'On-time bonus', value: '₹2.80'},
];

const TIMELINE = [
  {label: 'Assigned', time: '2:19 PM'},
  {label: 'Picked up', time: '2:41 PM'},
  {label: 'Delivered', time: '3:04 PM'},
];

export function DeliveryEarningsScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Delivery #{orderId}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Info</Text>
          {INFO_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.infoRow, index < INFO_ROWS.length - 1 && styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Earnings Breakdown</Text>
          {BREAKDOWN_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.infoRow, index < BREAKDOWN_ROWS.length - 1 && styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total earned</Text>
            <Text style={styles.totalValue}>₹82.00</Text>
          </View>
          <View style={styles.paidBanner}>
            <Text style={styles.paidText}>Credited to UPI · HDFC ****1234</Text>
            <View style={styles.paidPill}>
              <Text style={styles.paidPillText}>PAID</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Route Timeline</Text>
          {TIMELINE.map((step, index) => (
            <View key={step.label} style={styles.timelineRow}>
              <View style={styles.timelineTrack}>
                <View style={styles.timelineDot}>
                  <Icon name="check" size={12} color={colors.white} />
                </View>
                {index < TIMELINE.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineText}>
                <Text style={styles.timelineLabel}>{step.label}</Text>
                <Text style={styles.timelineTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>
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
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: 52,
    paddingBottom: spacing.lg,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  card: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm},
  infoRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  infoLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  infoValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  divider: {height: 1, backgroundColor: colors.border, marginTop: spacing.xs},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md},
  totalLabel: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  totalValue: {...typography.bodyBold, fontSize: 14, color: colors.primary},
  paidBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primarySurface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  paidText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  paidPill: {backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  paidPillText: {...typography.captionSemibold, fontSize: 11, color: colors.white},
  timelineRow: {flexDirection: 'row', gap: spacing.md},
  timelineTrack: {alignItems: 'center'},
  timelineDot: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  timelineLine: {width: 2, flex: 1, minHeight: 24, backgroundColor: colors.primaryBorder, marginVertical: 2},
  timelineText: {paddingBottom: spacing.md, paddingTop: 1},
  timelineLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  timelineTime: {...typography.caption, color: colors.textSecondary, marginTop: 1},
});
