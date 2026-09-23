import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Input} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'BankUPIVerificationIssue'>;

type VerifyState = 'done' | 'failed' | 'pending';

const VERIFY_STEPS: {label: string; state: VerifyState}[] = [
  {label: 'UPI ID format valid', state: 'done'},
  {label: 'Bank verification failed', state: 'failed'},
  {label: 'Penny drop pending', state: 'pending'},
  {label: 'Account confirmed', state: 'pending'},
];

const FIX_OPTIONS = [
  {title: 'Re-enter UPI ID', subtitle: 'Most common fix', selected: true},
  {title: 'Try different payment method', subtitle: 'Add bank / new UPI', selected: false},
  {title: 'Contact bank support', subtitle: 'If account issue', selected: false},
];

const RED = '#D92D20';

export function BankUPIVerificationIssueScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Payment Method Issue</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.warnCard}>
          <Text style={styles.warnTitle}>Verification Required</Text>
          <View style={styles.warnRowBorder}>
            <View>
              <Text style={styles.warnLabel}>UPI ID</Text>
              <Text style={styles.warnValue}>ravi.kumar@hdfc</Text>
            </View>
            <View style={styles.unverifiedPill}>
              <Text style={styles.unverifiedPillText}>UNVERIFIED</Text>
            </View>
          </View>
          <View style={styles.warnRow}>
            <View>
              <Text style={styles.warnLabel}>Bank</Text>
              <Text style={styles.warnValue}>HDFC Bank ****1234</Text>
            </View>
            <Text style={styles.needsVerification}>Needs verification</Text>
          </View>
          <View style={styles.warnBanner}>
            <Text style={styles.warnBannerText}>Your UPI ID could not be verified with the bank</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Verification Status</Text>
          {VERIFY_STEPS.map((step, index) => (
            <View key={step.label} style={styles.stepRow}>
              <View style={styles.stepTrack}>
                {step.state === 'done' && (
                  <View style={styles.stepDotDone}>
                    <Icon name="check" size={11} color={colors.white} />
                  </View>
                )}
                {step.state === 'failed' && (
                  <View style={styles.stepDotFailed}>
                    <Icon name="x" size={11} color={colors.white} />
                  </View>
                )}
                {step.state === 'pending' && <View style={styles.stepDotPending} />}
                {index < VERIFY_STEPS.length - 1 && <View style={styles.stepLine} />}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  step.state === 'failed' && styles.stepLabelFailed,
                  step.state === 'pending' && styles.stepLabelPending,
                ]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.fixSection}>
          <Text style={styles.cardTitle}>Fix Options</Text>
          <View style={styles.fixList}>
            {FIX_OPTIONS.map(option => (
              <TouchableOpacity key={option.title} style={[styles.fixOption, option.selected && styles.fixOptionSelected]} activeOpacity={0.8}>
                <View>
                  <Text style={[styles.fixOptionTitle, option.selected && styles.fixOptionTitleSelected]}>{option.title}</Text>
                  <Text style={styles.fixOptionSubtitle}>{option.subtitle}</Text>
                </View>
                <Icon name="chevron-right" size={18} color={option.selected ? colors.primary : colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Input label="UPI ID" defaultValue="ravi.kumar@hdfc" error="UPI verification failed — please check and re-enter" />
        </View>

        <View style={styles.actions}>
          <Button label="Verify UPI" variant="primary" onPress={() => navigation.navigate('PayoutSuccessful')} />
          <Button label="Add New Method" variant="outline" />
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
  warnCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.warning, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  warnTitle: {...typography.bodyBold, fontSize: 13, color: colors.warningText},
  warnRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm},
  warnRowBorder: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#FEF3C7', marginTop: spacing.sm},
  warnLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  warnValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, marginTop: 2},
  unverifiedPill: {backgroundColor: '#FEF3F2', borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  unverifiedPillText: {...typography.captionSemibold, fontSize: 10, color: RED},
  needsVerification: {...typography.labelSemibold, fontSize: 12, color: colors.warning},
  warnBanner: {backgroundColor: colors.warningSurface, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginTop: spacing.xs},
  warnBannerText: {...typography.caption, color: colors.warningText},
  card: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  cardTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  stepRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginTop: spacing.md},
  stepTrack: {alignItems: 'center'},
  stepDotDone: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  stepDotFailed: {width: 22, height: 22, borderRadius: 11, backgroundColor: RED, alignItems: 'center', justifyContent: 'center'},
  stepDotPending: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.border},
  stepLine: {width: 2, flex: 1, minHeight: 20, backgroundColor: colors.border, marginVertical: 2},
  stepLabel: {...typography.label, fontSize: 13, color: colors.textPrimary, marginTop: 3},
  stepLabelFailed: {...typography.labelSemibold, color: RED},
  stepLabelPending: {color: colors.textMuted},
  fixSection: {gap: spacing.sm},
  fixList: {gap: spacing.sm},
  fixOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.sm,
  },
  fixOptionSelected: {borderColor: colors.primary},
  fixOptionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  fixOptionTitleSelected: {color: colors.primary},
  fixOptionSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  actions: {gap: spacing.sm, marginTop: spacing.xs},
});
