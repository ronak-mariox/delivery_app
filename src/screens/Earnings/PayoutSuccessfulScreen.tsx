import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PayoutSuccessful'>;

const DETAIL_ROWS = [
  {label: 'Amount', value: '₹1,284', strong: true},
  {label: 'Credited to', value: 'UPI · HDFC ****1234'},
  {label: 'Transaction ID', value: 'TXN-8840291'},
  {label: 'Time', value: 'Sep 9, 11:43 AM'},
];

const BREAKDOWN_ROWS = [
  {label: 'Base pay', value: '₹756'},
  {label: 'Distance pay', value: '₹374'},
  {label: 'Bonuses', value: '₹154'},
];

export function PayoutSuccessfulScreen({navigation}: Props) {
  const goToDashboard = () => navigation.reset({index: 0, routes: [{name: 'EarningsDashboard'}]});

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Icon name="check" size={36} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Payout Successful!</Text>
        <Text style={styles.heroSubtitle}>₹1,284 credited to your account</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Transaction Details</Text>
            <View style={styles.successPill}>
              <Text style={styles.successPillText}>SUCCESS</Text>
            </View>
          </View>
          {DETAIL_ROWS.map(row => (
            <View key={row.label} style={styles.detailRow}>
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={row.strong ? styles.detailValueStrong : styles.detailValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitleSm}>Breakdown</Text>
          {BREAKDOWN_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.breakdownRow, index < BREAKDOWN_ROWS.length - 1 && styles.breakdownRowBorder]}>
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.trendBanner}>
          <View style={styles.trendIconWrap}>
            <Icon name="arrow-right" size={16} color={colors.primaryDark} />
          </View>
          <Text style={styles.trendText}>This is ₹138 more than last week. Keep it up!</Text>
        </View>

        <View style={styles.actions}>
          <Button label="View Payment History" variant="outline" onPress={() => navigation.navigate('PaymentHistory')} />
          <Button label="Back to Dashboard" variant="primary" onPress={goToDashboard} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: colors.primary, alignItems: 'center', paddingTop: 52, paddingBottom: spacing.xxxl, paddingHorizontal: spacing.xxl},
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {...typography.h3, fontSize: 28, color: colors.white, textAlign: 'center'},
  heroSubtitle: {...typography.body, color: 'rgba(255,255,255,0.75)', marginTop: spacing.xs},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  card: {backgroundColor: colors.surface, borderRadius: radius.xxl, padding: spacing.lg, ...shadows.sm},
  cardHeaderRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  cardTitleSm: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  successPill: {backgroundColor: colors.primarySurface, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  successPillText: {...typography.captionSemibold, fontSize: 11, color: colors.primaryDark},
  detailRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingVertical: spacing.sm, marginTop: spacing.xs},
  detailLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  detailValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  detailValueStrong: {...typography.h4, fontSize: 18, color: colors.primary},
  breakdownRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, marginTop: spacing.xs},
  breakdownRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  trendBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primarySurface, borderRadius: radius.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  trendIconWrap: {transform: [{rotate: '-45deg'}]},
  trendText: {...typography.labelSemibold, fontSize: 13, color: colors.primaryDark, flex: 1},
  actions: {gap: spacing.sm, marginTop: spacing.xs},
});
