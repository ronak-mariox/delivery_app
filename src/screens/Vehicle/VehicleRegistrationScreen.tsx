import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleRegistration'>;

const STATUS_ROWS = [
  {label: 'RC Document', value: 'Verified'},
  {label: 'Matches RC', value: 'Confirmed'},
  {label: 'Last updated', value: 'Aug 14, 2024'},
];

export function VehicleRegistrationScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Registration</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <Text style={styles.heroText}>KA-01-AB-1234</Text>
          <View style={styles.verifiedPill}>
            <Text style={styles.verifiedPillText}>Verified</Text>
          </View>
        </View>

        <View>
          <Text style={styles.label}>Registration Number</Text>
          <View style={styles.field}>
            <Text style={styles.fieldText}>KA-01-AB-1234</Text>
            <Icon name="check-circle" size={18} color={colors.primary} />
          </View>
          <Text style={styles.hint}>Format: XX-00-XX-0000</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>VERIFICATION STATUS</Text>
          {STATUS_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.statusRow, index < STATUS_ROWS.length - 1 && styles.statusRowBorder]}>
              <Icon name="check-circle" size={16} color={colors.primary} />
              <Text style={styles.statusLabel}>{row.label}</Text>
              <Text style={styles.statusValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoBanner}>
          <Icon name="info" size={14} color={colors.textSecondary} />
          <Text style={styles.infoBannerText}>Changing your registration number requires uploading a new RC document.</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('VehicleVerified')}>
          <Text style={styles.primaryButtonText}>Update Number</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>
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
  body: {padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl},
  heroRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg},
  heroText: {...typography.h4, fontSize: 22, color: colors.primary, letterSpacing: 2},
  verifiedPill: {backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xxs},
  verifiedPillText: {...typography.captionSemibold, fontSize: 11, color: colors.white},
  label: {...typography.label, color: colors.textLabel, marginBottom: spacing.xs},
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  fieldText: {...typography.bodySemibold, fontSize: 16, color: colors.textPrimary, letterSpacing: 1},
  hint: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: spacing.xs},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  cardLabel: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase', padding: spacing.lg, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  statusRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  statusLabel: {...typography.label, fontSize: 13, color: colors.textPrimary, flex: 1},
  statusValue: {...typography.label, fontSize: 13, color: colors.textSecondary},
  infoBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  infoBannerText: {...typography.caption, fontSize: 12, color: colors.textSecondary, flex: 1},
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, height: 50, alignItems: 'center', justifyContent: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  secondaryButton: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, height: 50, alignItems: 'center', justifyContent: 'center'},
  secondaryButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
