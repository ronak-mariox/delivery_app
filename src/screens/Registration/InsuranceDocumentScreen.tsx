import React, {useState} from 'react';
import {Alert, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {ChipGroup, FormField, Icon, InfoBanner, UploadDropzone, WizardFooter, WizardScreen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {api, getApiErrorMessage, PickedAsset, uploadDriverDocument} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'InsuranceDocument'>;

const INSURANCE_TYPES = [
  {label: 'Third-Party', value: 'third-party'},
  {label: 'Comprehensive', value: 'comprehensive'},
  {label: 'Zero Dep', value: 'zero-dep'},
];

function formatDisplayDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function InsuranceDocumentScreen({navigation}: Props) {
  const [insuranceType, setInsuranceType] = useState('third-party');
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [policyNumber, setPolicyNumber] = useState('');
  const [validFrom, setValidFrom] = useState<Date | null>(null);
  const [validUntil, setValidUntil] = useState<Date | null>(null);
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showUntilPicker, setShowUntilPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onPicked = async (asset: PickedAsset) => {
    setUploading(true);
    try {
      const result = await uploadDriverDocument('insurance', asset);
      setDocUrl(result.url);
    } catch (err) {
      Alert.alert('Upload failed', getApiErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleResponse = (response: {didCancel?: boolean; errorMessage?: string; assets?: PickedAsset[]}) => {
    if (response.didCancel) {
      return;
    }
    if (response.errorMessage) {
      Alert.alert('Error', response.errorMessage);
      return;
    }
    const asset = response.assets?.[0];
    if (asset) {
      onPicked(asset);
    }
  };

  const isValid = !!docUrl && policyNumber.trim().length > 0 && !!validFrom && !!validUntil && validUntil > validFrom;

  const handleContinue = async () => {
    if (!isValid || !validFrom || !validUntil || submitting) {
      return;
    }
    setSubmitting(true);
    try {
      await api.patch('/driver/registration/insurance-details', {
        insuranceType,
        policyNumber: policyNumber.trim(),
        validFrom: toIsoDate(validFrom),
        validUntil: toIsoDate(validUntil),
      });
      navigation.navigate('PaymentDetails');
    } catch (err) {
      Alert.alert('Could not save', getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <WizardScreen
      title="Insurance Document"
      subtitle="Valid vehicle insurance certificate"
      step={9}
      totalSteps={10}
      stepLabel="Insurance"
      onBack={() => navigation.goBack()}
      footer={
        <WizardFooter onBack={() => navigation.goBack()} onContinue={handleContinue} continueDisabled={!isValid || submitting} />
      }>
      <View style={styles.typesBlock}>
        <ChipGroup options={INSURANCE_TYPES} value={insuranceType} onChange={setInsuranceType} equalWidth={false} pill />
      </View>

      <UploadDropzone
        icon="shield"
        title={uploading ? 'Uploading…' : docUrl ? 'Policy Uploaded' : 'Upload Insurance Policy'}
        subtitle="JPG, PNG or PDF · Max 10 MB"
        large
        onCamera={() => launchCamera({mediaType: 'photo', quality: 0.8}, handleResponse)}
        onGallery={() => launchImageLibrary({mediaType: 'photo', quality: 0.8}, handleResponse)}
      />

      <FormField label="Policy Number" value={policyNumber} onChangeText={setPolicyNumber} placeholder="e.g. OG-22-2411-1801-00097892" />

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Valid From</Text>
          <TouchableOpacity style={styles.dateField} activeOpacity={0.8} onPress={() => setShowFromPicker(true)}>
            <Icon name="calendar" size={16} color={colors.textSecondary} />
            <Text style={[styles.dateText, !validFrom && styles.dateTextPlaceholder]}>{validFrom ? formatDisplayDate(validFrom) : 'DD/MM/YYYY'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rowItem}>
          <Text style={styles.label}>Valid Until</Text>
          <TouchableOpacity style={styles.dateField} activeOpacity={0.8} onPress={() => setShowUntilPicker(true)}>
            <Icon name="calendar" size={16} color={colors.textSecondary} />
            <Text style={[styles.dateText, !validUntil && styles.dateTextPlaceholder]}>{validUntil ? formatDisplayDate(validUntil) : 'DD/MM/YYYY'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showFromPicker && (
        <DateTimePicker
          value={validFrom ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event: DateTimePickerEvent, selected?: Date) => {
            setShowFromPicker(Platform.OS === 'ios');
            if (event.type === 'set' && selected) {
              setValidFrom(selected);
            }
          }}
        />
      )}
      {showUntilPicker && (
        <DateTimePicker
          value={validUntil ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event: DateTimePickerEvent, selected?: Date) => {
            setShowUntilPicker(Platform.OS === 'ios');
            if (event.type === 'set' && selected) {
              setValidUntil(selected);
            }
          }}
        />
      )}

      <InfoBanner
        tone="warning"
        title="Expiry Notice"
        description="Your insurance must be valid for at least 30 days from today. Expired insurance will not be accepted."
      />
    </WizardScreen>
  );
}

const styles = StyleSheet.create({
  typesBlock: {},
  row: {flexDirection: 'row', gap: spacing.md},
  rowItem: {flex: 1, gap: spacing.xs},
  label: {...typography.label, color: colors.textLabel},
  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 50,
    backgroundColor: colors.surface,
  },
  dateText: {flex: 1, ...typography.body, color: colors.textPrimary},
  dateTextPlaceholder: {color: colors.textMuted},
});
