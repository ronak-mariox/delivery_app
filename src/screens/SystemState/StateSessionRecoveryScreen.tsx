import React, {useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, ProgressBar} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateSessionRecovery'>;

const CHECKLIST = [
  {label: 'Reconnected to server', status: 'done'},
  {label: 'Session restored', status: 'done'},
  {label: 'Loading your data...', status: 'active'},
] as const;

export function StateSessionRecoveryScreen({navigation}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({index: 0, routes: [{name: 'Home'}]});
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigation]);

  const goHome = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name="shield" size={36} color={colors.primary} />
      </View>
      <Text style={styles.title}>Recovering Your Session</Text>
      <Text style={styles.subtitle}>We&apos;re restoring your last activity.</Text>

      <View style={styles.checklistCard}>
        {CHECKLIST.map(item => (
          <View key={item.label} style={styles.checkRow}>
            {item.status === 'done' ? (
              <View style={styles.checkDoneIcon}>
                <Icon name="check" size={12} color={colors.white} />
              </View>
            ) : (
              <View style={styles.checkActiveIcon}>
                <View style={styles.checkActiveDot} />
              </View>
            )}
            <Text style={item.status === 'active' ? styles.checkLabelActive : styles.checkLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>Recovery progress</Text>
          <Text style={styles.progressValue}>66%</Text>
        </View>
        <ProgressBar progress={0.66} style={styles.progressBar} />
      </View>

      <View style={styles.activityCard}>
        <Icon name="package" size={16} color={colors.textMuted} />
        <View style={styles.activityText}>
          <Text style={styles.activityLabel}>Previous activity</Text>
          <Text style={styles.activityValue}>Last delivery: #VR-84821 · In progress</Text>
        </View>
      </View>

      <Pressable style={styles.skipButton} onPress={goHome}>
        <Text style={styles.skipText}>Skip Recovery — Go Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl},
  iconCircle: {width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl},
  title: {...typography.h4, fontSize: 20, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.xl},
  checklistCard: {width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md, marginBottom: spacing.lg},
  checkRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  checkDoneIcon: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  checkActiveIcon: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primarySurface, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  checkActiveDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  checkLabel: {...typography.label, fontSize: 13, color: colors.textPrimary},
  checkLabelActive: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  progressSection: {width: '100%', marginBottom: spacing.xl},
  progressLabelRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs},
  progressLabel: {...typography.caption, color: colors.textSecondary},
  progressValue: {...typography.captionSemibold, color: colors.primary},
  progressBar: {height: 8},
  activityCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginBottom: spacing.xxl},
  activityText: {flex: 1},
  activityLabel: {...typography.caption, color: colors.textMuted},
  activityValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, marginTop: 2},
  skipButton: {paddingVertical: spacing.sm, paddingHorizontal: spacing.md},
  skipText: {...typography.bodyMedium, color: colors.textSecondary},
});
