import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleVerificationStatus'>;

type StepState = 'done' | 'active' | 'pending';
const STEPS: {label: string; state: StepState}[] = [
  {label: 'Documents uploaded', state: 'done'},
  {label: 'Details submitted', state: 'done'},
  {label: 'Under review', state: 'active'},
  {label: 'Verification complete', state: 'pending'},
];

const DOC_STATUS = [
  {label: 'Registration Certificate', status: 'Under review', color: '#F59E0B'},
  {label: 'Insurance Document', status: 'Verified', color: colors.primary},
  {label: 'Vehicle Number', status: 'Verified', color: colors.primary},
  {label: 'Photo of Vehicle', status: 'Under review', color: '#F59E0B'},
];

export function VehicleVerificationStatusScreen({navigation}: Props) {
  const backToProfile = () => navigation.reset({index: 0, routes: [{name: 'Profile'}]});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification Status</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Icon name="clock" size={48} color={colors.primary} />
          <Text style={styles.heroTitle}>Vehicle Verification In Progress</Text>
          <Text style={styles.heroSubtitle}>We are reviewing your submitted documents.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>PROGRESS</Text>
          {STEPS.map((step, index) => (
            <View key={step.label} style={styles.stepRow}>
              <View style={styles.stepTrack}>
                {step.state === 'done' && (
                  <View style={styles.stepDotDone}>
                    <Icon name="check" size={14} color={colors.white} />
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
              <Text style={[styles.stepLabel, step.state === 'active' && styles.stepLabelActive, step.state === 'pending' && styles.stepLabelPending]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            Verification usually completes within <Text style={styles.noteBold}>24-48 hours</Text>. You submitted on{' '}
            <Text style={styles.noteBold}>Sep 6 at 2:00 PM</Text>.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>WHAT WE ARE VERIFYING</Text>
          {DOC_STATUS.map((doc, index) => (
            <View key={doc.label} style={[styles.docRow, index < DOC_STATUS.length - 1 && styles.docRowBorder]}>
              <View style={[styles.docDot, {backgroundColor: doc.color}]} />
              <Text style={styles.docLabel}>{doc.label}</Text>
              <Text style={[styles.docStatus, {color: doc.color}]}>{doc.status}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85}>
            <Text style={styles.outlineButtonText}>Contact Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostButton} activeOpacity={0.85} onPress={backToProfile}>
            <Text style={styles.ghostButtonText}>Back to Profile</Text>
          </TouchableOpacity>
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
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  hero: {backgroundColor: colors.infoSurface, borderWidth: 1, borderColor: '#BAE6FD', borderRadius: radius.xxl, alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg},
  heroTitle: {...typography.h4, fontSize: 18, color: colors.textPrimary, textAlign: 'center', marginTop: spacing.md},
  heroSubtitle: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center'},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, ...shadows.sm},
  cardLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase'},
  stepRow: {flexDirection: 'row', gap: spacing.md, marginTop: spacing.md},
  stepTrack: {alignItems: 'center'},
  stepDotDone: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  stepDotActive: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primarySurface, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  stepDotActiveInner: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  stepDotPending: {width: 28, height: 28, borderRadius: 14, backgroundColor: '#F3F4F6', borderWidth: 2, borderColor: colors.border},
  stepLine: {width: 2, flex: 1, minHeight: 24, backgroundColor: colors.border, marginVertical: 2},
  stepLineDone: {backgroundColor: colors.primary},
  stepLabel: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, paddingBottom: spacing.md, paddingTop: 2},
  stepLabelActive: {...typography.bodySemibold},
  stepLabelPending: {color: colors.textMuted},
  noteCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  noteText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  noteBold: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  docRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, marginTop: spacing.xs},
  docRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  docDot: {width: 8, height: 8, borderRadius: 4},
  docLabel: {...typography.label, fontSize: 13, color: colors.textPrimary, flex: 1},
  docStatus: {...typography.captionMedium, fontSize: 12},
  actionsRow: {flexDirection: 'row', gap: spacing.sm},
  outlineButton: {flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, height: 48, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  ghostButton: {flex: 1, alignItems: 'center', justifyContent: 'center', height: 48},
  ghostButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textSecondary},
});
