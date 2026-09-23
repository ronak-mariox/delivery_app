import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleVerified'>;

const SUMMARY_ROWS = [
  {label: 'Verified on', value: 'Sep 6, 2026'},
  {label: 'RC Renewal', value: 'Aug 2034'},
  {label: 'Documents', value: 'All verified'},
];

const DOC_STATUS = [
  {label: 'RC Document', sub: undefined as string | undefined},
  {label: 'Insurance', sub: 'Expires Sep 13, 2026'},
  {label: 'Vehicle Photo', sub: undefined as string | undefined},
];

export function VehicleVerifiedScreen({navigation}: Props) {
  const goToDashboard = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  return (
    <View style={styles.container}>
      <View style={styles.heroHeader}>
        <View style={styles.checkCircle}>
          <Icon name="check" size={36} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Vehicle Verified!</Text>
        <Text style={styles.heroSubtitle}>Honda Activa 6G · KA-01-AB-1234</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>VERIFICATION SUMMARY</Text>
          {SUMMARY_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.summaryRow, index < SUMMARY_ROWS.length - 1 && styles.rowBorder]}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={[styles.summaryValue, row.label === 'Documents' && styles.summaryValuePrimary]}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>DOCUMENT STATUS</Text>
          {DOC_STATUS.map((doc, index) => (
            <View key={doc.label} style={[styles.docRow, index < DOC_STATUS.length - 1 && styles.rowBorder]}>
              <Icon name="check-circle" size={18} color={colors.primary} />
              <View style={styles.flex}>
                <Text style={styles.docLabel}>{doc.label}</Text>
                {doc.sub && <Text style={styles.docSub}>{doc.sub}</Text>}
              </View>
              <Text style={styles.docVerified}>Verified</Text>
            </View>
          ))}
        </View>

        <View style={styles.successBanner}>
          <Icon name="check-circle" size={16} color={colors.primary} />
          <Text style={styles.successText}>You are fully cleared to deliver with this vehicle.</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={goToDashboard}>
          <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('VehicleHub')}>
          <Text style={styles.outlineButtonText}>View Documents</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  heroHeader: {
    height: 200,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    gap: spacing.xs,
  },
  checkCircle: {width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm},
  heroTitle: {...typography.h3, fontSize: 20, color: colors.white},
  heroSubtitle: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.85)'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl, marginTop: -spacing.lg},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  cardLabel: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase', padding: spacing.lg, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  summaryLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  summaryValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  summaryValuePrimary: {color: colors.primary},
  docRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  docLabel: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  docSub: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 1},
  docVerified: {...typography.captionSemibold, fontSize: 12, color: colors.primary},
  successBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primarySurface, borderRadius: radius.lg, padding: spacing.md},
  successText: {...typography.label, fontSize: 13, color: colors.primary, flex: 1},
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  outlineButton: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, height: 48, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
});
