import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, ProgressBar} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'IncentiveDetail'>;

type ConditionState = 'met' | 'inProgress' | 'pending';

const CONDITIONS: {label: string; state: ConditionState}[] = [
  {label: 'Online during peak hours (12–5 PM)', state: 'met'},
  {label: 'Acceptance rate above 80%', state: 'met'},
  {label: '5 more deliveries needed', state: 'inProgress'},
  {label: 'Complete by 5:00 PM', state: 'pending'},
];

export function IncentiveDetailScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Peak Hour Bonus</Text>
        <View style={styles.activePill}>
          <Text style={styles.activePillText}>ACTIVE</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroAmount}>₹150</Text>
          <Text style={styles.heroLabel}>Bonus reward</Text>
          <View style={styles.timerPill}>
            <Icon name="clock" size={14} color={colors.white} />
            <Text style={styles.timerPillText}>Ends in 1h 42m</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.progressTitle}>10 of 15 deliveries completed</Text>
          <Text style={styles.progressSubtitle}>5 more deliveries needed</Text>
          <ProgressBar progress={10 / 15} height={12} style={styles.progressBar} />
          <View style={styles.progressAxisRow}>
            <Text style={styles.progressAxisText}>0</Text>
            <Text style={styles.progressAxisText}>67%</Text>
            <Text style={styles.progressAxisText}>15</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Conditions</Text>
          {CONDITIONS.map((condition, index) => (
            <View key={condition.label} style={[styles.conditionRow, index < CONDITIONS.length - 1 && styles.conditionRowBorder]}>
              <View
                style={[
                  styles.conditionIcon,
                  condition.state === 'met' && styles.conditionIconMet,
                  condition.state === 'inProgress' && styles.conditionIconInProgress,
                  condition.state === 'pending' && styles.conditionIconPending,
                ]}>
                {condition.state === 'met' ? (
                  <Icon name="check" size={11} color={colors.primary} />
                ) : (
                  <View
                    style={[
                      styles.conditionDot,
                      condition.state === 'inProgress' && styles.conditionDotInProgress,
                      condition.state === 'pending' && styles.conditionDotPending,
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  styles.conditionText,
                  condition.state === 'inProgress' && styles.conditionTextInProgress,
                  condition.state === 'pending' && styles.conditionTextPending,
                ]}>
                {condition.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Earnings if completed</Text>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Base earnings today</Text>
            <Text style={styles.earningsValue}>₹428</Text>
          </View>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>+ This bonus</Text>
            <Text style={styles.earningsValue}>₹150</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹578</Text>
          </View>
        </View>

        <Button label="Continue Delivering" icon="arrow-right" iconPosition="right" onPress={() => navigation.navigate('IncentiveBonusEarned')} />
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
    paddingHorizontal: spacing.lg,
    paddingTop: 48,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary, flex: 1},
  activePill: {backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  activePillText: {...typography.captionSemibold, fontSize: 11, color: colors.primary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  heroCard: {backgroundColor: colors.primary, borderRadius: radius.xxl, paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl, alignItems: 'center'},
  heroAmount: {...typography.display, fontSize: 40, color: colors.white, fontWeight: '800'},
  heroLabel: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2},
  timerPill: {flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginTop: spacing.md},
  timerPillText: {...typography.labelSemibold, fontSize: 13, color: colors.white},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  progressTitle: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  progressSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  progressBar: {marginTop: spacing.md},
  progressAxisRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs},
  progressAxisText: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  cardTitle: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary, marginBottom: spacing.sm},
  conditionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs},
  conditionRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  conditionIcon: {width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center'},
  conditionIconMet: {backgroundColor: colors.primarySurface},
  conditionIconInProgress: {backgroundColor: colors.warningSurface},
  conditionIconPending: {backgroundColor: '#F3F4F6'},
  conditionDot: {width: 8, height: 8, borderRadius: 4},
  conditionDotInProgress: {backgroundColor: colors.warning},
  conditionDotPending: {backgroundColor: colors.borderStrong},
  conditionText: {...typography.label, fontSize: 13, color: colors.textPrimary, flex: 1},
  conditionTextInProgress: {color: colors.warningText},
  conditionTextPending: {color: colors.textMuted},
  earningsRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  earningsLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  earningsValue: {...typography.label, fontSize: 13, color: colors.textSecondary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.xs},
  totalLabel: {...typography.bodyBold, fontSize: 15, color: colors.primary},
  totalValue: {...typography.bodyBold, fontSize: 15, color: colors.primary},
});
