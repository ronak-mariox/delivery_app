import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Badge, IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {ContactSupport} from '../Profile/ContactSupport';
import {documentUrl, kycBadge} from '../Profile/driverDisplay';
import {DocumentImageCard} from '../Documents/DocumentImageCard';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleRcDocument'>;

export function VehicleRcDocumentScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const vehicle = driver?.vehicleDetails;
  const rcUrl = documentUrl(driver, 'rc');
  const kyc = kycBadge(driver?.kycStatus);

  const rows = [
    {label: 'Registration Number', value: vehicle?.registrationNumber || '—'},
    {label: 'Brand / Model', value: vehicle ? `${vehicle.brand} ${vehicle.model}`.trim() : '—'},
    {label: 'Year', value: vehicle?.year ? String(vehicle.year) : '—'},
    {label: 'Document', value: rcUrl ? 'Uploaded' : 'Not uploaded'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>RC Document</Text>
        <Badge label={kyc.label} tone={kyc.tone} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <DocumentImageCard docKey="rc" url={rcUrl} onPress={rcUrl ? () => navigation.navigate('DocumentPreview', {docKey: 'rc'}) : undefined} />

        <View style={styles.card}>
          {rows.map((row, index) => (
            <View key={row.label} style={[styles.row, index < rows.length - 1 && styles.rowBorder]}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <ContactSupport description="To replace your RC document, contact support." />
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
