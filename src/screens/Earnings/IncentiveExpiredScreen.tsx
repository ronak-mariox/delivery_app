import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, ProgressBar} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'IncentiveExpired'>;

const SUMMARY_ROWS = [
  {label: 'Incentive', value: 'Weekend Surge'},
  {label: 'Reward', value: '₹250'},
  {label: 'Your progress', value: '6/20 deliveries'},
  {label: 'Expired', value: 'Sun Aug 31, 11:59 PM'},
];

const SIMILAR = [
  {title: 'Next Weekend Surge', subtitle: 'Sep 13', amount: '₹250', active: false},
  {title: 'Daily Bonus', subtitle: 'Today 4–7 PM', amount: '₹80', active: true},
];

export function IncentiveExpiredScreen({navigation}: Props) {
  const goToDashboard = () => navigation.reset({index: 0, routes: [{name: 'EarningsDashboard'}]});

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Icon name="ban" size={28} color={colors.textMuted} />
        </View>
        <Text style={styles.heroTitle}>Incentive Expired</Text>
        <Text style={styles.heroSubtitle}>Weekend Surge bonus has ended.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Incentive Summary</Text>
          {SUMMARY_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.summaryRow, index < SUMMARY_ROWS.length - 1 && styles.summaryRowBorder]}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          ))}
          <View style={styles.expiredPillRow}>
            <View style={styles.expiredPill}>
              <Text style={styles.expiredPillText}>EXPIRED</Text>
            </View>
          </View>
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressMetaRow}>
            <Text style={styles.progressMetaText}>6 of 20 completed</Text>
            <Text style={styles.progressMetaText}>30%</Text>
          </View>
          <ProgressBar progress={6 / 20} height={8} trackColor="#F3F4F6" fillColor={colors.borderStrong} style={styles.progressBarSpacing} />
        </View>

        <View style={styles.missBanner}>
          <Text style={styles.missTitle}>Miss Analysis</Text>
          <Text style={styles.missText}>You were 14 deliveries short. If you had completed 5 more, you would have earned ₹100 partial bonus.</Text>
        </View>

        <Text style={styles.sectionLabel}>SIMILAR UPCOMING INCENTIVES</Text>
        {SIMILAR.map(item => (
          <View key={item.title} style={[styles.similarRow, item.active && styles.similarRowActive]}>
            <View>
              <Text style={styles.similarTitle}>{item.title}</Text>
              <Text style={styles.similarSubtitle}>{item.subtitle}</Text>
            </View>
            <View style={styles.similarRight}>
              <Text style={[styles.similarAmount, item.active && styles.similarAmountActive]}>{item.amount}</Text>
              {item.active && (
                <View style={styles.activePill}>
                  <Text style={styles.activePillText}>ACTIVE</Text>
                </View>
              )}
            </View>
          </View>
        ))}

        <View style={styles.actionsRow}>
          <Button label="View Active Incentives" variant="primary" style={styles.flex} onPress={() => navigation.navigate('Incentives')} />
          <Button label="Back to Dashboard" variant="secondary" style={styles.flex} onPress={goToDashboard} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: '#F3F4F6', borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'center', paddingTop: 48, paddingBottom: spacing.xxl, paddingHorizontal: spacing.lg},
  iconCircle: {width: 64, height: 64, borderRadius: 32, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  heroTitle: {...typography.h4, fontSize: 20, color: colors.textLabel},
  heroSubtitle: {...typography.label, fontSize: 13, color: colors.textMuted, marginTop: spacing.xs},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  card: {backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodyBold, fontSize: 13, color: colors.textLabel},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, marginTop: spacing.xs},
  summaryRowBorder: {borderBottomWidth: 1, borderBottomColor: colors.border},
  summaryLabel: {...typography.label, fontSize: 13, color: colors.textMuted},
  summaryValue: {...typography.labelSemibold, fontSize: 13, color: colors.textLabel},
  expiredPillRow: {alignItems: 'flex-end', marginTop: spacing.sm},
  expiredPill: {backgroundColor: colors.border, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  expiredPillText: {...typography.captionSemibold, fontSize: 11, color: colors.textMuted},
  progressCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  progressMetaRow: {flexDirection: 'row', justifyContent: 'space-between'},
  progressMetaText: {...typography.caption, color: colors.textMuted},
  progressBarSpacing: {marginTop: spacing.xs},
  missBanner: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: '#FDE8C8', borderRadius: radius.lg, padding: spacing.md},
  missTitle: {...typography.bodyBold, fontSize: 13, color: colors.warningText},
  missText: {...typography.label, fontSize: 13, color: '#78350F', marginTop: spacing.xxs},
  sectionLabel: {...typography.captionSemibold, fontSize: 13, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginTop: spacing.xs},
  similarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  similarRowActive: {borderWidth: 1.5, borderColor: colors.primary},
  similarTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  similarSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  similarRight: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  similarAmount: {...typography.bodyBold, fontSize: 14, color: colors.textSecondary},
  similarAmountActive: {color: colors.primary},
  activePill: {backgroundColor: colors.primarySurface, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2},
  activePillText: {...typography.captionSemibold, fontSize: 10, color: colors.primary},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md},
});
