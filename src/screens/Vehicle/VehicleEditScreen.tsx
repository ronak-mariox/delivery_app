import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Input} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleEdit'>;

const VEHICLE_TYPES = ['Bicycle', 'Scooter', 'Motorbike', 'Van'] as const;
const FUEL_TYPES = ['Petrol', 'Electric', 'Diesel'] as const;
const COLOURS = ['#E53E3E', '#3182CE', '#2D3748', '#1CA672', '#F6E05E'];

export function VehicleEditScreen({navigation}: Props) {
  const [vehicleType] = useState<(typeof VEHICLE_TYPES)[number]>('Motorbike');
  const [fuelType, setFuelType] = useState<(typeof FUEL_TYPES)[number]>('Petrol');
  const [colour, setColour] = useState(COLOURS[0]);

  const selectVehicleType = (t: (typeof VEHICLE_TYPES)[number]) => {
    if (t === vehicleType) {
      return;
    }
    navigation.navigate('VehicleTypeChange');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Vehicle</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.saveLink}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.label}>Vehicle Type</Text>
          <View style={styles.pillRow}>
            {VEHICLE_TYPES.map(t => (
              <TouchableOpacity key={t} style={[styles.pill, vehicleType === t && styles.pillActive]} activeOpacity={0.8} onPress={() => selectVehicleType(t)}>
                <Text style={[styles.pillText, vehicleType === t && styles.pillTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('VehicleRegistration')}>
          <Text style={styles.label}>Registration Number</Text>
          <View style={styles.verifiedField}>
            <Text style={styles.verifiedFieldText}>KA-01-AB-1234</Text>
            <Icon name="check-circle" size={18} color={colors.primary} />
          </View>
        </TouchableOpacity>

        <Input label="Brand" defaultValue="Honda" />
        <Input label="Model" defaultValue="Activa 6G" />
        <Input label="Year" defaultValue="2022" keyboardType="number-pad" />

        <View>
          <Text style={styles.label}>Fuel Type</Text>
          <View style={styles.pillRow}>
            {FUEL_TYPES.map(f => (
              <TouchableOpacity key={f} style={[styles.fuelPill, fuelType === f && styles.pillActive]} activeOpacity={0.8} onPress={() => setFuelType(f)}>
                <Text style={[styles.pillText, fuelType === f && styles.pillTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.label}>Colour</Text>
          <View style={styles.colourRow}>
            {COLOURS.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.swatch, {backgroundColor: c}, colour === c && styles.swatchActive]}
                activeOpacity={0.8}
                onPress={() => setColour(c)}
              />
            ))}
          </View>
        </View>

        <Input label="Engine CC" defaultValue="109.5" keyboardType="decimal-pad" />

        <View style={styles.infoBanner}>
          <Icon name="info" size={14} color={colors.textSecondary} />
          <Text style={styles.infoBannerText}>Registration number changes require document re-verification.</Text>
        </View>

        <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
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
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  saveLink: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
  body: {padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl},
  label: {...typography.label, color: colors.textLabel, marginBottom: spacing.sm},
  pillRow: {flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap'},
  pill: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  fuelPill: {flex: 1, alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingVertical: spacing.sm},
  pillActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  pillText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  pillTextActive: {...typography.labelSemibold, color: colors.primary},
  verifiedField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  verifiedFieldText: {...typography.body, fontSize: 15, color: colors.textPrimary},
  colourRow: {flexDirection: 'row', gap: spacing.md},
  swatch: {width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: 'transparent'},
  swatchActive: {borderColor: colors.primary},
  infoBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  infoBannerText: {...typography.caption, fontSize: 12, color: colors.textSecondary, flex: 1},
  saveButton: {backgroundColor: colors.primary, borderRadius: radius.lg, height: 52, alignItems: 'center', justifyContent: 'center'},
  saveButtonText: {...typography.bodyBold, fontSize: 16, color: colors.white},
});
