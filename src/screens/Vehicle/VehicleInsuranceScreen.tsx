import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Badge, EmptyState, IconBackButton, InfoBanner} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {ContactSupport} from '../Profile/ContactSupport';
import {documentUrl, formatDate, isExpired, kycBadge} from '../Profile/driverDisplay';
import {DocumentImageCard} from '../Documents/DocumentImageCard';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleInsurance'>;

export function VehicleInsuranceScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const insurance = driver?.insuranceDetails;
  const insuranceUrl = documentUrl(driver, 'insurance');
  const expired = isExpired(insurance?.validUntil);
  const kyc = kycBadge(driver?.kycStatus);

  const rows = insurance
    ? [
        {label: 'Insurance Type', value: insurance.insuranceType},
        {label: 'Policy Number', value: insurance.policyNumber},
        {label: 'Valid From', value: formatDate(insurance.validFrom)},
        {label: 'Valid Until', value: formatDate(insurance.validUntil)},
        {label: 'Vehicle', value: driver?.vehicleDetails?.registrationNumber || '—'},
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Vehicle Insurance</Text>
        <Badge label={expired ? 'Expired' : kyc.label} tone={expired ? 'warning' : kyc.tone} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {expired ? (
          <InfoBanner tone="warning" icon="alert-triangle" title="Policy expired" description={`This policy expired on ${formatDate(insurance?.validUntil)}. Contact support to update it.`} />
        ) : null}

        <DocumentImageCard docKey="insurance" url={insuranceUrl} onPress={insuranceUrl ? () => navigation.navigate('DocumentPreview', {docKey: 'insurance'}) : undefined} />

        {insurance ? (
          <View style={styles.card}>
            {rows.map((row, index) => (
              <View key={row.label} style={[styles.row, index < rows.length - 1 && styles.rowBorder]}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowValue}>{row.value || '—'}</Text>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState icon="shield" title="No insurance details" description="Insurance details were not captured during registration." />
        )}

        <ContactSupport description="To update your insurance policy, contact support." />
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
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, flexShrink: 1, textAlign: 'right'},
});
