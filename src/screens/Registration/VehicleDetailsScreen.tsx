import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {FormField, Icon, WizardFooter, WizardScreen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {api, getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleDetails'>;

const VEHICLE_LABELS: Record<Props['route']['params']['vehicleType'], string> = {
  motorbike: 'Motorbike',
  scooter: 'Scooter',
  bicycle: 'Bicycle / E-Bike',
  other: 'Other Vehicle',
};

const COLORS = [
  {label: 'Black', value: '#1F2937'},
  {label: 'Red', value: '#D92D20'},
  {label: 'Blue', value: '#2563EB'},
  {label: 'White', value: '#F9FAFB'},
  {label: 'Silver', value: '#9CA3AF'},
];

export function VehicleDetailsScreen({route, navigation}: Props) {
  const {vehicleType} = route.params;
  const vehicleLabel = VEHICLE_LABELS[vehicleType];

  const [regNumber, setRegNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [color, setColor] = useState('#1F2937');
  const [capacity, setCapacity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid = regNumber.trim().length > 0 && brand.trim().length > 0 && model.trim().length > 0 && year.trim().length === 4 && fuelType.trim().length > 0;

  const handleContinue = async () => {
    if (!isValid || submitting) {
      return;
    }
    setSubmitting(true);
    try {
      await api.patch('/driver/registration/vehicle-details', {
        registrationNumber: regNumber.trim(),
        brand: brand.trim(),
        model: model.trim(),
        year: Number(year),
        fuelType: fuelType.trim(),
        color,
        capacity: capacity.trim() || undefined,
      });
      navigation.navigate('DrivingLicence');
    } catch (err) {
      Alert.alert('Could not save', getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <WizardScreen
      title="Vehicle Details"
      subtitle={`Enter your ${vehicleLabel.toLowerCase()} information`}
      step={6}
      totalSteps={10}
      stepLabel="Vehicle Information"
      onBack={() => navigation.goBack()}
      footer={<WizardFooter onBack={() => navigation.goBack()} onContinue={handleContinue} continueDisabled={!isValid || submitting} />}>
      <View style={styles.selectedBanner}>
        <Icon name="check" size={18} color={colors.primary} />
        <Text style={styles.selectedText}>{vehicleLabel} selected</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.changeLink}>Change</Text>
        </TouchableOpacity>
      </View>

      <FormField
        label="Vehicle Registration Number"
        state={regNumber.trim().length > 0 ? 'valid' : 'default'}
        value={regNumber}
        onChangeText={setRegNumber}
        autoCapitalize="characters"
        placeholder="e.g. KA 05 MG 7734"
        rightElement={regNumber.trim().length > 0 ? <Icon name="check" size={16} color={colors.primary} /> : undefined}
        helperText="As shown on your RC document"
      />
      <SelectField label="Vehicle Brand" value={brand} onChangeText={setBrand} placeholder="e.g. Honda" />
      <SelectField label="Vehicle Model" value={model} onChangeText={setModel} placeholder="e.g. CB Shine 125cc" />
      <FormField label="Manufacturing Year" value={year} onChangeText={setYear} keyboardType="number-pad" maxLength={4} placeholder="e.g. 2022" />
      <SelectField label="Fuel Type" value={fuelType} onChangeText={setFuelType} placeholder="e.g. Petrol" />

      <View style={styles.colorBlock}>
        <Text style={styles.label}>Vehicle Color</Text>
        <View style={styles.colorRow}>
          {COLORS.map(c => {
            const selected = c.value === color;
            return (
              <TouchableOpacity key={c.value} style={styles.colorItem} activeOpacity={0.8} onPress={() => setColor(c.value)}>
                <View
                  style={[
                    styles.swatch,
                    {backgroundColor: c.value},
                    selected ? styles.swatchSelected : c.value === '#F9FAFB' && styles.swatchBordered,
                  ]}
                />
                <Text style={[styles.colorLabel, selected && styles.colorLabelSelected]}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FormField
        label="Engine / Battery Capacity"
        state="active"
        value={capacity}
        onChangeText={setCapacity}
        placeholder="e.g. 125cc or 2.5 kWh"
      />
    </WizardScreen>
  );
}

function SelectField({label, value, onChangeText, placeholder}: {label: string; value: string; onChangeText: (t: string) => void; placeholder?: string}) {
  return (
    <FormField
      label={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      rightElement={<Icon name="chevron-down" size={16} color={colors.textMuted} />}
    />
  );
}

const styles = StyleSheet.create({
  selectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primarySurface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectedText: {...typography.labelSemibold, color: '#13845A', flex: 1},
  changeLink: {...typography.caption, color: colors.primary},
  colorBlock: {gap: spacing.sm},
  label: {...typography.label, color: colors.textLabel},
  colorRow: {flexDirection: 'row', gap: spacing.md},
  colorItem: {alignItems: 'center', gap: spacing.xxs},
  swatch: {width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: colors.border},
  swatchSelected: {borderWidth: 3, borderColor: colors.primary, shadowColor: colors.white, shadowOpacity: 1, shadowRadius: 0, shadowOffset: {width: 0, height: 0}},
  swatchBordered: {borderColor: colors.border},
  colorLabel: {...typography.overline, fontSize: 10, color: colors.textMuted},
  colorLabelSelected: {color: colors.primary},
});
