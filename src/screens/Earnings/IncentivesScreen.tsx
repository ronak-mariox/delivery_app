import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, ProgressBar, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Incentives'>;

const UPCOMING = [
  {title: 'Night Owl Bonus', subtitle: 'Starts 8 PM tonight', amount: '₹80'},
  {title: 'New Zone Bonus', subtitle: 'Whitefield area', amount: '₹120'},
];

export function IncentivesScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Incentives</Text>
        <Text style={styles.headerSubtitle}>₹254 bonus potential this week</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>ACTIVE INCENTIVES</Text>

        <TouchableOpacity activeOpacity={0.85} style={[styles.incentiveCard, styles.incentiveCardGreen]} onPress={() => navigation.navigate('IncentiveDetail')}>
          <View style={styles.incentiveRow}>
            <View style={styles.incentiveTextBlock}>
              <Text style={styles.incentiveTitleGreen}>Peak Hour Bonus</Text>
              <Text style={styles.incentiveDesc}>Complete 5 more deliveries by 5 PM today</Text>
            </View>
            <View style={styles.rewardPillGreen}>
              <Text style={styles.rewardPillText}>₹150</Text>
            </View>
          </View>
          <View style={styles.progressMetaRow}>
            <Text style={styles.progressMetaText}>10 of 15 deliveries</Text>
            <Text style={styles.progressMetaText}>67%</Text>
          </View>
          <ProgressBar progress={10 / 15} height={8} trackColor="#C6EAD9" style={styles.progressBarSpacing} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.85} style={[styles.incentiveCard, styles.incentiveCardOrange]} onPress={() => navigation.navigate('IncentiveExpired')}>
          <View style={styles.incentiveRow}>
            <View style={styles.incentiveTextBlock}>
              <Text style={styles.incentiveTitleOrange}>Weekend Surge</Text>
              <Text style={styles.incentiveDesc}>Complete 20 deliveries this weekend</Text>
            </View>
            <View style={styles.rewardPillOrange}>
              <Text style={styles.rewardPillText}>₹250</Text>
            </View>
          </View>
          <View style={styles.progressMetaRow}>
            <Text style={styles.progressMetaText}>6 of 20 deliveries</Text>
            <Text style={styles.progressMetaText}>30%</Text>
          </View>
          <ProgressBar progress={6 / 20} height={8} trackColor="#FDE8C8" fillColor={colors.warning} style={styles.progressBarSpacing} />
        </TouchableOpacity>

        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>UPCOMING INCENTIVES</Text>

        {UPCOMING.map(item => (
          <View key={item.title} style={styles.upcomingRow}>
            <View>
              <Text style={styles.upcomingTitle}>{item.title}</Text>
              <Text style={styles.upcomingSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.upcomingAmount}>{item.amount}</Text>
          </View>
        ))}

        <View style={styles.actionsRow}>
          <Button label="View All Incentives" variant="outline" style={styles.flex} onPress={() => navigation.navigate('IncentiveProgress')} />
          <Button label="Incentive History" variant="ghost" textColor={colors.textSecondary} style={styles.flex} onPress={() => navigation.navigate('BonusHistory')} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xxl, gap: 4},
  headerTitle: {...typography.h4, fontSize: 22, color: colors.white},
  headerSubtitle: {...typography.body, color: 'rgba(255,255,255,0.8)'},
  body: {padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.background, paddingBottom: spacing.xxxl},
  sectionLabel: {...typography.captionSemibold, fontSize: 13, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: spacing.xs},
  sectionLabelSpaced: {marginTop: spacing.lg},
  incentiveCard: {borderRadius: radius.xxl, borderWidth: 1.5, padding: spacing.lg, marginBottom: spacing.sm},
  incentiveCardGreen: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  incentiveCardOrange: {backgroundColor: colors.warningSurface, borderColor: colors.warning},
  incentiveRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  incentiveTextBlock: {flex: 1, paddingRight: spacing.md},
  incentiveTitleGreen: {...typography.bodyBold, fontSize: 15, color: colors.primaryDark},
  incentiveTitleOrange: {...typography.bodyBold, fontSize: 15, color: '#B54708'},
  incentiveDesc: {...typography.label, fontSize: 13, color: colors.textPrimary, marginTop: 3},
  rewardPillGreen: {backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4},
  rewardPillOrange: {backgroundColor: colors.warning, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4},
  rewardPillText: {...typography.bodyBold, fontSize: 13, color: colors.white},
  progressMetaRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm},
  progressMetaText: {...typography.caption, color: colors.textSecondary},
  progressBarSpacing: {marginTop: spacing.xs},
  upcomingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  upcomingTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  upcomingSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  upcomingAmount: {...typography.bodyBold, fontSize: 14, color: colors.textSecondary},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md},
});
