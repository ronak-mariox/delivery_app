import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentDrivingLicence'>;

const INFO_ROWS = [
  {label: 'Licence Number', value: 'KA0120230012345'},
  {label: 'Class', value: 'LMV, MCWG'},
  {label: 'Issue Date', value: 'May 4, 2023'},
  {label: 'Expiry Date', value: 'May 4, 2033'},
];

export function DocumentDrivingLicenceScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driving Licence</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.docCard}>
          <View style={styles.docTopRow}>
            <View>
              <Text style={styles.docLabel}>DRIVING LICENCE</Text>
              <Text style={styles.docNumber}>KA0120230012345</Text>
            </View>
            <Icon name="user" size={28} color="rgba(255,255,255,0.8)" />
          </View>
          <View style={styles.docDetailsRow}>
            <View>
              <Text style={styles.docDetailLabel}>Name</Text>
              <Text style={styles.docDetailValue}>RAVI KUMAR</Text>
            </View>
            <View>
              <Text style={styles.docDetailLabel}>DOB</Text>
              <Text style={styles.docDetailValue}>12-08-1995</Text>
            </View>
          </View>
          <View style={styles.docBottomRow}>
            <Text style={styles.docValidText}>Valid: 04-05-2028 to 04-05-2033</Text>
            <View style={styles.verifiedPill}>
              <Text style={styles.verifiedPillText}>VERIFIED</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          {INFO_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.infoRow, index < INFO_ROWS.length - 1 && styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentDetail')}>
          <Text style={styles.outlineButtonText}>View Full Document</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentReplaceLicence')}>
          <Text style={styles.outlineButtonText}>Replace Licence</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadRow} activeOpacity={0.7}>
          <Icon name="download" size={16} color={colors.textSecondary} />
          <Text style={styles.downloadText}>Download</Text>
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
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  docCard: {backgroundColor: colors.dark800, borderRadius: radius.xxl, padding: spacing.xl, gap: spacing.md},
  docTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  docLabel: {...typography.overline, fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, textTransform: 'uppercase'},
  docNumber: {...typography.h4, fontSize: 18, color: colors.white, letterSpacing: 1, marginTop: spacing.xs},
  docDetailsRow: {flexDirection: 'row', justifyContent: 'space-between'},
  docDetailLabel: {...typography.caption, fontSize: 10, color: 'rgba(255,255,255,0.5)'},
  docDetailValue: {...typography.captionSemibold, fontSize: 12, color: colors.white, marginTop: 2},
  docBottomRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  docValidText: {...typography.caption, fontSize: 10, color: 'rgba(255,255,255,0.6)'},
  verifiedPill: {backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: spacing.xxs},
  verifiedPillText: {...typography.captionSemibold, fontSize: 9, color: colors.white, letterSpacing: 0.5},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  infoRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  infoLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  infoValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  outlineButton: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, height: 48, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  downloadRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 48},
  downloadText: {...typography.bodyMedium, fontSize: 14, color: colors.textSecondary},
});
