import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentBankVerificationStatus'>;

type StepState = 'done' | 'active' | 'pending';
const STEPS: {label: string; state: StepState}[] = [
  {label: 'Details submitted', state: 'done'},
  {label: 'Penny drop initiated', state: 'done'},
  {label: 'Awaiting bank confirmation', state: 'active'},
  {label: 'Verified', state: 'pending'},
];

export function PaymentBankVerificationStatusScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Icon name="clock" size={40} color="#1E40AF" />
        </View>
        <Text style={styles.heroTitle}>Bank Account Verification In Progress</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {STEPS.map((step, index) => (
            <View key={step.label} style={styles.stepRow}>
              <View style={styles.stepTrack}>
                {step.state === 'done' && (
                  <View style={styles.stepDotDone}>
                    <Icon name="check" size={13} color={colors.white} />
                  </View>
                )}
                {step.state === 'active' && (
                  <View style={styles.stepDotActive}>
                    <View style={styles.stepDotActiveInner} />
                  </View>
                )}
                {step.state === 'pending' && <View style={styles.stepDotPending} />}
                {index < STEPS.length - 1 && <View style={[styles.stepLine, step.state === 'done' && styles.stepLineDone]} />}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  step.state === 'active' && styles.stepLabelActive,
                  step.state === 'pending' && styles.stepLabelPending,
                ]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>
            A verification amount of <Text style={styles.noteBold}>₹1</Text> has been sent to your account ending{' '}
            <Text style={styles.noteBold}>****1234</Text>. This will be refunded within 24 hours.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Verification usually completes within 2–4 hours.</Text>
        </View>

        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('PaymentBankVerified')}>
          <Text style={styles.outlineButtonText}>Check Status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} activeOpacity={0.85}>
          <Text style={styles.ghostButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {
    backgroundColor: colors.infoSurface,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: 56,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  heroIcon: {width: 80, height: 80, borderRadius: 40, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center'},
  heroTitle: {...typography.h4, fontSize: 20, color: '#1E40AF', textAlign: 'center'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  stepRow: {flexDirection: 'row', gap: spacing.md},
  stepTrack: {alignItems: 'center'},
  stepDotDone: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  stepDotActive: {width: 28, height: 28, borderRadius: 14, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center'},
  stepDotActiveInner: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white},
  stepDotPending: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.border},
  stepLine: {width: 2, flex: 1, minHeight: 20, backgroundColor: colors.border, marginVertical: 2},
  stepLineDone: {backgroundColor: colors.primary},
  stepLabel: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, paddingBottom: spacing.md, paddingTop: 2},
  stepLabelActive: {...typography.bodyBold, color: '#3B82F6'},
  stepLabelPending: {color: colors.textMuted},
  noteBanner: {backgroundColor: '#DBEAFE', borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  noteText: {...typography.label, fontSize: 13, color: '#1E40AF', lineHeight: 20.8},
  noteBold: {...typography.bodyBold, fontSize: 13, color: '#1E40AF'},
  infoCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  infoText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  outlineButton: {borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
  ghostButton: {paddingVertical: spacing.md, alignItems: 'center'},
  ghostButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
