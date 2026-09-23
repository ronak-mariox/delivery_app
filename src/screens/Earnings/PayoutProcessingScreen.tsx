import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, ProgressBar} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PayoutProcessing'>;

type StepState = 'done' | 'active' | 'pending';

const STEPS: {label: string; time: string; state: StepState}[] = [
  {label: 'Payout initiated', time: 'Sep 9, 9:00 AM', state: 'done'},
  {label: 'Bank processing', time: 'In progress', state: 'active'},
  {label: 'Credited to account', time: 'Pending', state: 'pending'},
  {label: 'Confirmation sent', time: 'Pending', state: 'pending'},
];

export function PayoutProcessingScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconRingOuter}>
          <View style={styles.iconRing}>
            <Icon name="refresh" size={44} color={colors.white} />
          </View>
        </View>

        <Text style={styles.title}>Processing Payout</Text>
        <Text style={styles.amount}>₹1,284</Text>
        <Text style={styles.method}>UPI · HDFC ****1234</Text>

        <ProgressBar progress={0.5} height={8} style={styles.progressBar} />
        <Text style={styles.caption}>Processing may take 2–4 hours</Text>

        <View style={styles.stepsCard}>
          {STEPS.map((step, index) => (
            <View key={step.label} style={styles.stepRow}>
              <View style={styles.stepTrack}>
                {step.state === 'done' && (
                  <View style={styles.stepDotDone}>
                    <Icon name="check" size={12} color={colors.white} />
                  </View>
                )}
                {step.state === 'active' && (
                  <View style={styles.stepDotActive}>
                    <View style={styles.stepDotActiveInner} />
                  </View>
                )}
                {step.state === 'pending' && <View style={styles.stepDotPending} />}
                {index < STEPS.length - 1 && (
                  <View style={[styles.stepLine, step.state === 'done' && styles.stepLineDone]} />
                )}
              </View>
              <View style={styles.stepText}>
                <Text style={[styles.stepLabel, step.state === 'active' && styles.stepLabelActive, step.state === 'pending' && styles.stepLabelPending]}>
                  {step.label}
                </Text>
                <Text style={styles.stepTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.footnote}>You will receive a notification when payment is complete.</Text>
      </View>

      <View style={styles.footer}>
        <Button label="View Payment Status" variant="outline" onPress={() => navigation.navigate('PayoutFailed')} />
        <Button label="Contact Support" variant="ghost" textColor={colors.textSecondary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.white},
  body: {flex: 1, alignItems: 'center', paddingTop: 40, paddingHorizontal: spacing.xxl},
  iconRingOuter: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: 'rgba(28,166,114,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  iconRing: {width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary},
  amount: {...typography.display, fontSize: 38, color: colors.primary, letterSpacing: -1, marginTop: spacing.xs},
  method: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs},
  progressBar: {width: '100%', marginTop: spacing.xxl},
  caption: {...typography.caption, color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.xxl},
  stepsCard: {width: '100%', backgroundColor: colors.background, borderRadius: radius.xl, padding: spacing.lg},
  stepRow: {flexDirection: 'row', gap: spacing.md},
  stepTrack: {alignItems: 'center'},
  stepDotDone: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  stepDotActive: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActiveInner: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  stepDotPending: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.border},
  stepLine: {width: 2, flex: 1, minHeight: 24, backgroundColor: colors.border, marginVertical: 2},
  stepLineDone: {backgroundColor: colors.primaryBorder},
  stepText: {paddingBottom: spacing.md, paddingTop: 1},
  stepLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  stepLabelActive: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  stepLabelPending: {color: colors.textMuted, fontWeight: '500'},
  stepTime: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 1},
  footnote: {...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl, marginBottom: spacing.xl},
  footer: {gap: spacing.sm, paddingHorizontal: spacing.xxl, paddingBottom: spacing.huge},
});
