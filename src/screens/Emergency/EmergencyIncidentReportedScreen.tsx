import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyIncidentReported'>;

const SUMMARY_ROWS = [
  {label: 'Incident #', value: 'INC-00291'},
  {label: 'Type', value: 'Threatening customer'},
  {label: 'Submitted', value: 'Sep 6, 3:16 PM'},
  {label: 'Location', value: 'Koramangala 5th Block'},
  {label: 'Order #VR-84821', value: 'Paused'},
];

export function EmergencyIncidentReportedScreen({navigation}: Props) {
  const returnHome = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Icon name="check" size={28} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Incident Reported</Text>
        <Text style={styles.heroSubtitle}>Your report has been received</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Report Summary</Text>
          {SUMMARY_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.summaryRow, index < SUMMARY_ROWS.length - 1 && styles.rowBorder]}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next Steps</Text>
          <View style={styles.stepRow}>
            <View style={styles.stepDotDone}>
              <Icon name="check" size={13} color={colors.white} />
            </View>
            <Text style={styles.stepText}>Safety team notified</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepDotActive} />
            <Text style={styles.stepText}>Reviewing your report</Text>
            <Text style={styles.stepStatus}>In progress</Text>
          </View>
          <View style={styles.stepRow}>
            <View style={styles.stepDotPending} />
            <Text style={styles.stepTextMuted}>Follow-up in 5 minutes</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencySupport')}>
          <Text style={styles.primaryButtonText}>Contact Support Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyIncidentReport')}>
          <Text style={styles.outlineButtonText}>View Incident Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} activeOpacity={0.85} onPress={returnHome}>
          <Text style={styles.ghostButtonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: colors.warning, alignItems: 'center', gap: spacing.xs, paddingTop: 44, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  heroIcon: {width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm},
  heroTitle: {...typography.h4, fontSize: 20, color: colors.white},
  heroSubtitle: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.85)'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 160},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  summaryLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  summaryValue: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  stepRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  stepDotDone: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  stepDotActive: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.warning},
  stepDotPending: {width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border},
  stepText: {...typography.body, fontSize: 14, color: colors.textPrimary, flex: 1},
  stepTextMuted: {...typography.body, fontSize: 14, color: colors.textSecondary, flex: 1},
  stepStatus: {...typography.bodySemibold, fontSize: 11, color: colors.warning},
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
  outlineButton: {borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, height: 44, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  ghostButton: {height: 40, alignItems: 'center', justifyContent: 'center'},
  ghostButtonText: {...typography.body, fontSize: 14, color: colors.textSecondary},
});
