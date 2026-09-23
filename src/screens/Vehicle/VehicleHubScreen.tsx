import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleHub'>;

const INFO_ROWS = [
  {label: 'Vehicle Type', value: 'Motorbike'},
  {label: 'Registration No', value: 'KA-01-AB-1234'},
  {label: 'Brand / Model', value: 'Honda Activa 6G'},
  {label: 'Fuel Type', value: 'Petrol'},
  {label: 'Colour', value: 'Red'},
  {label: 'Engine (CC)', value: '109.5 cc'},
];

export function VehicleHubScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Details</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VehicleEdit')}>
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <TouchableOpacity activeOpacity={0.8} style={styles.verificationBanner} onPress={() => navigation.navigate('StateVerificationFailed')}>
          <Icon name="alert-triangle" size={16} color={colors.danger} />
          <Text style={styles.verificationBannerText}>Some documents need re-verification — view status</Text>
        </TouchableOpacity>

        <View style={styles.hero}>
          <Icon name="motorbike" size={40} color={colors.white} />
          <Text style={styles.heroLabel}>MOTORBIKE</Text>
          <Text style={styles.heroValue}>Honda Activa 6G · Red · KA-01 AB-1234</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>VEHICLE INFO</Text>
          {INFO_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.infoRow, index < INFO_ROWS.length - 1 && styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>DOCUMENTS</Text>
          <TouchableOpacity style={[styles.docRow, styles.docRowBorder]} activeOpacity={0.7} onPress={() => navigation.navigate('VehicleRcDocument')}>
            <Icon name="check-circle" size={16} color={colors.primary} />
            <View>
              <Text style={styles.docTitle}>RC Document</Text>
              <Text style={styles.docSubGreen}>Verified</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.docRow, styles.docRowBorder]} activeOpacity={0.7} onPress={() => navigation.navigate('VehicleInsurance')}>
            <Icon name="alert-triangle" size={16} color={colors.warning} />
            <View>
              <Text style={styles.docTitle}>Insurance</Text>
              <Text style={styles.docSubWarning}>Expires Sep 13, 2026</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.docRow} activeOpacity={0.7} onPress={() => navigation.navigate('DocumentOther')}>
            <Icon name="check-circle" size={16} color={colors.primary} />
            <View>
              <Text style={styles.docTitle}>Pollution Certificate</Text>
              <Text style={styles.docSub}>Valid</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.85} onPress={() => navigation.navigate('VehicleEdit')}>
            <Text style={styles.editButtonText}>Edit Vehicle Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateButton} activeOpacity={0.85} onPress={() => navigation.navigate('VehicleInsurance')}>
            <Text style={styles.updateButtonText}>Update Documents</Text>
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
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  editLink: {...typography.bodyMedium, fontSize: 14, color: colors.primary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  verificationBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.dangerBorder, borderRadius: radius.lg, padding: spacing.md},
  verificationBannerText: {...typography.label, fontSize: 12, color: colors.danger, flex: 1},
  hero: {backgroundColor: colors.primary, borderRadius: radius.xxl, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl, gap: spacing.xs},
  heroLabel: {...typography.overline, fontSize: 11, color: 'rgba(255,255,255,0.8)', letterSpacing: 1, textTransform: 'uppercase'},
  heroValue: {...typography.bodyBold, fontSize: 15, color: colors.white},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  cardLabel: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', padding: spacing.lg, paddingBottom: spacing.sm},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  infoRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  infoLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  infoValue: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  docRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  docRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  docTitle: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  docSub: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  docSubGreen: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  docSubWarning: {...typography.caption, color: colors.warning, marginTop: 1},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm},
  editButton: {flex: 1, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.md, height: 46, alignItems: 'center', justifyContent: 'center'},
  editButtonText: {...typography.bodySemibold, fontSize: 13, color: colors.primary},
  updateButton: {flex: 1, borderWidth: 1.5, borderColor: colors.warning, borderRadius: radius.md, height: 46, alignItems: 'center', justifyContent: 'center'},
  updateButtonText: {...typography.bodySemibold, fontSize: 13, color: colors.warning},
});
