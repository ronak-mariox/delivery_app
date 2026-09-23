import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, ProgressBar, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmingDelivery'>;

const STEPS = [
  {id: 'verified', label: 'Customer verified', status: 'done' as const},
  {id: 'handed', label: 'Package handed over', status: 'done' as const},
  {id: 'recording', label: 'Recording delivery', status: 'active' as const},
  {id: 'earnings', label: 'Earnings updated', status: 'upcoming' as const},
];

export function ConfirmingDeliveryScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [confirmedAt] = useState(() => new Date());

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('DeliverySuccess', {orderId}), 1800);
    return () => clearTimeout(timer);
  }, [navigation, orderId]);

  return (
    <Screen edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.iconRing}>
        <Icon name="refresh" size={40} color={colors.primary} />
      </View>
      <Text style={styles.title}>Confirming Delivery…</Text>
      <Text style={styles.subtitle}>{`Logging delivery at ${confirmedAt.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}`}</Text>

      <View style={styles.card}>
        {STEPS.map((step, index) => (
          <View key={step.id} style={[styles.stepRow, index > 0 && styles.stepRowBorder]}>
            <View
              style={[
                styles.stepDot,
                step.status === 'done' && styles.stepDotDone,
                step.status === 'active' && styles.stepDotActive,
              ]}>
              {step.status === 'done' && <Icon name="check" size={12} color={colors.white} />}
              {step.status === 'active' && <View style={styles.stepDotActiveInner} />}
            </View>
            <Text style={[styles.stepLabel, step.status === 'active' && styles.stepLabelActive]}>{step.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Processing delivery record</Text>
        <Text style={styles.progressValue}>75%</Text>
      </View>
      <ProgressBar progress={0.75} height={8} style={styles.progressBar} />

      <Text style={styles.hint}>Just a moment — updating your delivery record</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl},
  iconRing: {width: 96, height: 96, borderRadius: 48, backgroundColor: colors.successSurface, borderWidth: 3, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  title: {...typography.h3, fontSize: 24, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.xxs, marginBottom: spacing.xl},
  card: {width: '100%', backgroundColor: colors.background, borderRadius: radius.xxl, padding: spacing.xl, marginBottom: spacing.lg},
  stepRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm},
  stepRowBorder: {borderTopWidth: 1, borderTopColor: colors.border},
  stepDot: {width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  stepDotDone: {backgroundColor: colors.primary, borderColor: colors.primary},
  stepDotActive: {backgroundColor: colors.successSurface, borderColor: colors.primary},
  stepDotActiveInner: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  stepLabel: {...typography.body, color: colors.textPrimary},
  stepLabelActive: {...typography.bodySemibold, color: colors.primary},
  progressRow: {flexDirection: 'row', justifyContent: 'space-between', width: '100%'},
  progressLabel: {...typography.label, color: colors.textSecondary},
  progressValue: {...typography.labelSemibold, color: colors.primary},
  progressBar: {marginTop: spacing.sm, marginBottom: spacing.lg},
  hint: {...typography.label, color: colors.textSecondary, textAlign: 'center'},
});
