import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors, spacing} from '../theme';
import {Button} from './Button';

interface WizardFooterProps {
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
  backLabel?: string;
  continueDisabled?: boolean;
}

export function WizardFooter({onBack, onContinue, continueLabel = 'Continue', backLabel = 'Back', continueDisabled}: WizardFooterProps) {
  return (
    <View style={styles.container}>
      <Button label={backLabel} variant="secondary" onPress={onBack} style={styles.backButton} />
      <Button label={continueLabel} onPress={onContinue} disabled={continueDisabled} style={styles.continueButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  backButton: {flex: 1},
  continueButton: {flex: 2},
});
