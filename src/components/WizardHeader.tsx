import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, radius, spacing, typography} from '../theme';
import {IconBackButton} from './IconBackButton';
import {ProgressBar} from './ProgressBar';

interface WizardHeaderProps {
  title: string;
  subtitle: string;
  step: number;
  totalSteps: number;
  stepLabel: string;
  onBack: () => void;
}

export function WizardHeader({title, subtitle, step, totalSteps, stepLabel, onBack}: WizardHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <IconBackButton onPress={onBack} />
        <View style={styles.titleText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.progressWrap}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.stepText}>
            Step {step} of {totalSteps}
          </Text>
          <Text style={styles.stepLabel}>{stepLabel}</Text>
        </View>
        <ProgressBar progress={step / totalSteps} height={4} trackColor={colors.border} style={styles.progressBar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.xl, paddingBottom: spacing.lg},
  titleRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  titleText: {flex: 1},
  title: {...typography.subtitle, fontSize: 16, color: colors.textPrimary},
  subtitle: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  progressWrap: {marginTop: spacing.lg},
  progressLabelRow: {flexDirection: 'row', justifyContent: 'space-between'},
  stepText: {...typography.captionMedium, color: colors.primary},
  stepLabel: {...typography.caption, color: colors.textSecondary},
  progressBar: {marginTop: spacing.xs, borderRadius: radius.sm},
});
