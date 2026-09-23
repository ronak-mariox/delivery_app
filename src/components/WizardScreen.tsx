import React, {PropsWithChildren, ReactNode} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {colors, spacing} from '../theme';
import {Screen} from './Screen';
import {WizardHeader} from './WizardHeader';

interface WizardScreenProps {
  title: string;
  subtitle: string;
  step: number;
  totalSteps: number;
  stepLabel: string;
  onBack: () => void;
  footer: ReactNode;
}

export function WizardScreen({title, subtitle, step, totalSteps, stepLabel, onBack, footer, children}: PropsWithChildren<WizardScreenProps>) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} keyboardAvoiding>
      <WizardHeader title={title} subtitle={subtitle} step={step} totalSteps={totalSteps} stepLabel={stepLabel} onBack={onBack} />
      <ScrollView style={styles.flex} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      {footer}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  body: {padding: spacing.xl, gap: spacing.lg},
});
