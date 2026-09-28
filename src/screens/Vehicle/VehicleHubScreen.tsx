import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Badge, EmptyState, Icon, IconBackButton, InfoBanner} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {ContactSupport} from '../Profile/ContactSupport';
import {documentUrl, formatDate, isExpired, kycBadge, VEHICLE_TYPE_ICON, VEHICLE_TYPE_LABEL} from '../Profile/driverDisplay';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleHub'>;

export function VehicleHubScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const vehicle = driver?.vehicleDetails;
  const insurance = driver?.insuranceDetails;
  const vehicleType = driver?.vehicleType ?? null;
  const kyc = kycBadge(driver?.kycStatus);
  const hasRc = !!documentUrl(driver, 'rc');
  const hasInsuranceDoc = !!documentUrl(driver, 'insurance');
  const insuranceExpired = isExpired(insurance?.validUntil);

  const infoRows = [
    {label: 'Vehicle Type', value: vehicleType ? VEHICLE_TYPE_LABEL[vehicleType] : '—'},
    {label: 'Registration No', value: vehicle?.registrationNumber || '—'},
    {label: 'Brand / Model', value: vehicle ? `${vehicle.brand} ${vehicle.model}`.trim() : '—'},
    {label: 'Year', value: vehicle?.year ? String(vehicle.year) : '—'},
    {label: 'Fuel Type', value: vehicle?.fuelType || '—'},
    {label: 'Colour', value: vehicle?.color || '—'},
    ...(vehicle?.capacity ? [{label: 'Capacity', value: vehicle.capacity}] : []),
  ];

  const docRows = [
    {
      title: 'RC Document',
      sub: hasRc ? 'Uploaded' : 'Not uploaded',
      present: hasRc,
      onPress: () => navigation.navigate('VehicleRcDocument'),
    },
    {
      title: 'Insurance',
      sub: insurance ? (insuranceExpired ? `Expired ${formatDate(insurance.validUntil)}` : `Valid until ${formatDate(insurance.validUntil)}`) : hasInsuranceDoc ? 'Uploaded' : 'Not uploaded',
      present: hasInsuranceDoc && !insuranceExpired,
      onPress: () => navigation.navigate('VehicleInsurance'),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Vehicle Details</Text>
        <Badge label={kyc.label} tone={kyc.tone} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {insuranceExpired ? (
          <InfoBanner tone="warning" icon="alert-triangle" title="Insurance expired" description="Your vehicle insurance has expired. Contact support to update your policy." />
        ) : null}

        {vehicle || vehicleType ? (
          <>
            <TouchableOpacity style={styles.hero} activeOpacity={0.85} onPress={() => navigation.navigate('VehicleRegistration')}>
              <Icon name={vehicleType ? VEHICLE_TYPE_ICON[vehicleType] : 'truck'} size={40} color={colors.white} />
              <Text style={styles.heroLabel}>{vehicleType ? VEHICLE_TYPE_LABEL[vehicleType] : 'Vehicle'}</Text>
              <Text style={styles.heroValue}>{[vehicle?.brand, vehicle?.model, vehicle?.color, vehicle?.registrationNumber].filter(Boolean).join(' · ') || 'Details pending'}</Text>
            </TouchableOpacity>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>VEHICLE INFO</Text>
              {infoRows.map((row, index) => (
                <View key={row.label} style={[styles.infoRow, index < infoRows.length - 1 && styles.infoRowBorder]}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <EmptyState icon="bicycle" title="No vehicle on file" description="Vehicle details were not captured during registration." />
        )}

        <View style={styles.card}>
          <Text style={styles.cardLabel}>DOCUMENTS</Text>
          {docRows.map((row, index) => (
            <TouchableOpacity key={row.title} style={[styles.docRow, index < docRows.length - 1 && styles.docRowBorder]} activeOpacity={0.7} onPress={row.onPress}>
              <Icon name={row.present ? 'check-circle' : 'alert-circle'} size={16} color={row.present ? colors.primary : colors.warning} />
              <View style={styles.flex}>
                <Text style={styles.docTitle}>{row.title}</Text>
                <Text style={[styles.docSub, !row.present && styles.docSubWarning]}>{row.sub}</Text>
              </View>
              <Icon name="chevron-right" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <ContactSupport description="To change your vehicle or its documents, contact support." />
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary, flex: 1},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  hero: {backgroundColor: colors.primary, borderRadius: radius.xxl, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, gap: spacing.xs},
  heroLabel: {...typography.overline, fontSize: 11, color: 'rgba(255,255,255,0.8)', letterSpacing: 1, textTransform: 'uppercase'},
  heroValue: {...typography.bodyBold, fontSize: 15, color: colors.white, textAlign: 'center'},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  cardLabel: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', padding: spacing.lg, paddingBottom: spacing.sm},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  infoRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  infoLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  infoValue: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, flexShrink: 1, textAlign: 'right'},
  docRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  docRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  docTitle: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  docSub: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  docSubWarning: {color: colors.warning},
});
