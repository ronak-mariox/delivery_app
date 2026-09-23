import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TodaysEarnings'>;

const HOURLY_DATA = [
  {hour: '10AM', value: 30},
  {hour: '11AM', value: 20},
  {hour: '12PM', value: 85, peak: true},
  {hour: '1PM', value: 100, peak: true},
  {hour: '2PM', value: 72, peak: true},
  {hour: '3PM', value: 35},
  {hour: '4PM', value: 55},
  {hour: '5PM', value: 15},
];

const DELIVERIES = [
  {orderId: 'VR-84821', route: 'Swiggy Instamart → HSR', amount: '₹82', time: '3:04PM'},
  {orderId: 'VR-84815', route: "McDonald's → Koramangala", amount: '₹94', time: '1:32PM'},
  {orderId: 'VR-84803', route: 'BigBasket → Ejipura', amount: '₹76', time: '12:48PM'},
  {orderId: 'VR-84796', route: 'Zomato Express → BTM', amount: '₹62', time: '11:55AM'},
  {orderId: 'VR-84782', route: "Domino's → Indiranagar", amount: '₹114', time: '10:41AM'},
];

export function TodaysEarningsScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{"Today's Earnings"}</Text>
          <Text style={styles.headerSubtitle}>Sep 6, 2026</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Total earned today</Text>
          <Text style={styles.heroValue}>₹428</Text>
          <View style={styles.heroRow}>
            <Text style={styles.heroRowTextStrong}>6 deliveries</Text>
            <Text style={styles.heroRowTextFaint}>·</Text>
            <Text style={styles.heroRowTextStrong}>Avg ₹71.3</Text>
          </View>
          <View style={styles.heroRow}>
            <Text style={styles.heroRowTextMuted}>Online: 5h 20min</Text>
            <Text style={styles.heroRowTextFaintSm}>·</Text>
            <Text style={styles.heroRowTextMuted}>42 km</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hourly Breakdown</Text>
          <View style={styles.chart}>
            {HOURLY_DATA.map(h => (
              <View key={h.hour} style={styles.chartColumn}>
                <View style={[styles.chartBar, {height: Math.max(4, h.value)}, h.peak ? styles.chartBarPeak : styles.chartBarNormal]} />
                <Text style={styles.chartHour}>{h.hour}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.chartCaption}>Peak hours 12PM–2PM highlighted</Text>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.listTitle}>Deliveries</Text>
          {DELIVERIES.map((d, index) => (
            <TouchableOpacity
              key={d.orderId}
              style={[styles.deliveryRow, index < DELIVERIES.length - 1 && styles.deliveryRowBorder]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('DeliveryEarnings', {orderId: d.orderId})}>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryOrderId}>#{d.orderId}</Text>
                <Text style={styles.deliveryRoute} numberOfLines={1}>
                  {d.route}
                </Text>
              </View>
              <View style={styles.deliveryMeta}>
                <Text style={styles.deliveryAmount}>{d.amount}</Text>
                <Text style={styles.deliveryTime}>{d.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.loadMore} activeOpacity={0.7}>
          <Text style={styles.loadMoreText}>Load more</Text>
        </TouchableOpacity>
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
  headerText: {flex: 1},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  heroCard: {backgroundColor: colors.primary, borderRadius: radius.xxl, padding: spacing.xl, gap: 2},
  heroLabel: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.75)'},
  heroValue: {...typography.display, fontSize: 38, color: colors.white, letterSpacing: -1, marginTop: 2},
  heroRow: {flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm, alignItems: 'center'},
  heroRowTextStrong: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.85)'},
  heroRowTextFaint: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.5)'},
  heroRowTextMuted: {...typography.caption, color: 'rgba(255,255,255,0.75)'},
  heroRowTextFaintSm: {...typography.caption, color: 'rgba(255,255,255,0.5)'},
  card: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  chart: {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 110, paddingTop: spacing.md},
  chartColumn: {flex: 1, alignItems: 'center', justifyContent: 'flex-end'},
  chartBar: {width: 16, borderRadius: 5},
  chartBarNormal: {backgroundColor: colors.primarySurface},
  chartBarPeak: {backgroundColor: colors.primary},
  chartHour: {...typography.micro, color: colors.textSecondary, marginTop: 6},
  chartCaption: {...typography.caption, fontSize: 11, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm},
  listCard: {backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', ...shadows.sm},
  listTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, borderBottomWidth: 1, borderBottomColor: colors.border, padding: spacing.lg, paddingBottom: spacing.sm},
  deliveryRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  deliveryRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  deliveryInfo: {flex: 1, gap: 2},
  deliveryOrderId: {...typography.captionSemibold, color: colors.textSecondary},
  deliveryRoute: {...typography.label, fontSize: 13, color: colors.textPrimary},
  deliveryMeta: {alignItems: 'flex-end', gap: 2, paddingLeft: spacing.md},
  deliveryAmount: {...typography.bodyBold, fontSize: 14, color: colors.primary},
  deliveryTime: {...typography.captionMedium, fontSize: 11, color: colors.textSecondary},
  loadMore: {alignItems: 'center', paddingVertical: spacing.sm},
  loadMoreText: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
});
