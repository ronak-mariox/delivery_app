import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {ContactSupport} from '../Profile/ContactSupport';
import {documentUrl, VEHICLE_TYPE_LABEL} from '../Profile/driverDisplay';
import {DocumentImageCard} from '../Documents/DocumentImageCard';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleRegistration'>;

export function VehicleRegistrationScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const vehicle = driver?.vehicleDetails;
  const vehicleType = driver?.vehicleType ?? null;

  const rows = vehicle
    ? [
        {label: 'Registration Number', value: vehicle.registrationNumber},
        {label: 'Vehicle Type', value: vehicleType ? VEHICLE_TYPE_LABEL[vehicleType] : '—'},
        {label: 'Brand', value: vehicle.brand},
        {label: 'Model', value: vehicle.model},
        {label: 'Year', value: vehicle.year ? String(vehicle.year) : '—'},
        {label: 'Fuel Type', value: vehicle.fuelType},
        {label: 'Colour', value: vehicle.color},
        ...(vehicle.capacity ? [{label: 'Capacity', value: vehicle.capacity}] : []),
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Vehicle Registration</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {vehicle ? (
          <>
            <View style={styles.plateCard}>
              <Text style={styles.plateLabel}>REGISTRATION NUMBER</Text>
              <Text style={styles.plateValue}>{vehicle.registrationNumber || '—'}</Text>
            </View>

            <View style={styles.card}>
              {rows.map((row, index) => (
                <View key={row.label} style={[styles.row, index < rows.length - 1 && styles.rowBorder]}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowValue}>{row.value || '—'}</Text>
                </View>
              ))}
            </View>

            <DocumentImageCard docKey="rc" url={documentUrl(driver, 'rc')} onPress={() => navigation.navigate('VehicleRcDocument')} />
          </>
        ) : (
          <EmptyState icon="bicycle" title="No vehicle on file" description="Vehicle details were not captured during registration." />
        )}

        <ContactSupport description="To change your vehicle registration details, contact support." />
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
  plateCard: {backgroundColor: colors.dark900, borderRadius: radius.xxl, alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.xs},
  plateLabel: {...typography.overline, fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 1},
  plateValue: {...typography.h4, fontSize: 24, color: colors.white, letterSpacing: 2},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, flexShrink: 1, textAlign: 'right'},
});
