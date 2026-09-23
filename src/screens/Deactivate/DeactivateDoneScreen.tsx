import React from 'react';
import {BackHandler, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeactivateDone'>;

const SUMMARY_ROWS = [
  {label: 'Account', value: 'Ravi Kumar'},
  {label: 'Deactivated', value: 'Sep 6, 3:30 PM'},
  {label: 'Pending payout', value: 'Rs. 1,284 (Sep 9)'},
  {label: 'Data retained until', value: 'Dec 6, 2026'},
];

const NEXT_STEPS = [
  {label: 'Payout of Rs. 1,284 processed', tag: 'Sep 9'},
  {label: 'Account data retained', tag: '90 days'},
  {label: 'Data permanently deleted', tag: 'Dec 6, 2026'},
];

export function DeactivateDoneScreen({navigation}: Props) {
  const reactivate = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});
  const closeApp = () => {
    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Icon name="user-x" size={28} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Account Deactivated</Text>
        <Text style={styles.heroSubtitle}>Your account has been put on hold</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Summary</Text>
          {SUMMARY_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.summaryRow, index < SUMMARY_ROWS.length - 1 && styles.rowBorder]}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.noteBanner}>
          <Icon name="info" size={18} color={colors.primary} />
          <View style={styles.flex}>
            <Text style={styles.noteTitle}>Changed your mind?</Text>
            <Text style={styles.noteText}>You can reactivate your account anytime within 90 days by logging in and following the prompts.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What Happens Next</Text>
          {NEXT_STEPS.map(step => (
            <View key={step.label} style={styles.stepRow}>
              <Text style={styles.stepLabel}>{step.label}</Text>
              <View style={styles.stepTag}>
                <Text style={styles.stepTagText}>{step.tag}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={reactivate}>
          <Text style={styles.primaryButtonText}>Reactivate Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} activeOpacity={0.85} onPress={closeApp}>
          <Text style={styles.ghostButtonText}>Close App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: '#4B5563', alignItems: 'center', gap: spacing.xs, paddingTop: 48, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  heroIcon: {width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm},
  heroTitle: {...typography.h3, fontSize: 22, color: colors.white},
  heroSubtitle: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.75)'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 140},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  summaryLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  summaryValue: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  noteBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: '#A7E3CC', borderRadius: radius.lg, padding: spacing.lg},
  noteTitle: {...typography.bodyBold, fontSize: 13, color: '#13845A'},
  noteText: {...typography.label, fontSize: 13, color: '#13845A', marginTop: spacing.xs},
  stepRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.xs},
  stepLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  stepTag: {backgroundColor: colors.background, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2},
  stepTagText: {...typography.bodySemibold, fontSize: 12, color: colors.textPrimary},
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.md, height: 48, alignItems: 'center', justifyContent: 'center'},
  primaryButtonText: {...typography.bodyBold, fontSize: 15, color: colors.white},
  ghostButton: {height: 40, alignItems: 'center', justifyContent: 'center'},
  ghostButtonText: {...typography.body, fontSize: 14, color: colors.textSecondary},
});
