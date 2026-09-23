import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {ChipGroup, FormField, Icon, InfoBanner, WizardFooter, WizardScreen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {api, getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyContact'>;

const RELATIONSHIP_OPTIONS = [
  {label: 'Spouse', value: 'spouse'},
  {label: 'Parent', value: 'parent'},
  {label: 'Sibling', value: 'sibling'},
  {label: 'Friend', value: 'friend'},
  {label: 'Other', value: 'other'},
];

export function EmergencyContactScreen({navigation}: Props) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('spouse');
  const [mobile, setMobile] = useState('');
  const [altMobile, setAltMobile] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const cleanMobile = mobile.replace(/\D/g, '');
  const isValid = name.trim().length > 0 && cleanMobile.length === 10 && consent;

  const handleContinue = async () => {
    if (!isValid || submitting) {
      return;
    }
    setSubmitting(true);
    try {
      await api.patch('/driver/registration/emergency-contact', {
        name: name.trim(),
        relationship,
        mobile: cleanMobile,
        altMobile: altMobile.replace(/\D/g, '') || undefined,
      });
      navigation.navigate('VehicleType');
    } catch (err) {
      Alert.alert('Could not save', getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <WizardScreen
      title="Emergency Contact"
      subtitle="Someone we can reach in case of emergency"
      step={4}
      totalSteps={10}
      stepLabel="Emergency Contact"
      onBack={() => navigation.goBack()}
      footer={<WizardFooter onBack={() => navigation.goBack()} onContinue={handleContinue} continueDisabled={!isValid || submitting} />}>
      <InfoBanner description="This contact will be notified only in case of an accident or emergency during your deliveries." />

      <FormField
        label="Contact Full Name"
        state={name.trim().length > 0 ? 'valid' : 'default'}
        leftIcon="user"
        value={name}
        onChangeText={setName}
        placeholder="Full name"
        rightElement={name.trim().length > 0 ? <Icon name="check" size={16} color={colors.primary} /> : undefined}
      />

      <View style={styles.block}>
        <Text style={styles.label}>Relationship</Text>
        <ChipGroup options={RELATIONSHIP_OPTIONS} value={relationship} onChange={setRelationship} equalWidth={false} pill />
      </View>

      <FormField
        label="Mobile Number"
        state={cleanMobile.length === 10 ? 'valid' : mobile.length > 0 ? 'active' : 'default'}
        leftIcon="phone"
        value={mobile}
        onChangeText={setMobile}
        placeholder="+91 XXXXX XXXXX"
        keyboardType="phone-pad"
      />
      <FormField
        label="Alternate Number (Optional)"
        leftIcon="phone"
        value={altMobile}
        onChangeText={setAltMobile}
        placeholder="+91 XXXXX XXXXX"
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.consentRow} activeOpacity={0.85} onPress={() => setConsent(c => !c)}>
        <View style={[styles.checkbox, consent && styles.checkboxChecked]}>{consent && <Icon name="check" size={12} color={colors.white} />}</View>
        <Text style={styles.consentText}>
          I confirm this person is aware they are listed as my emergency contact and has consented to be contacted by Verdant Rider.
        </Text>
      </TouchableOpacity>
    </WizardScreen>
  );
}

const styles = StyleSheet.create({
  block: {gap: spacing.xs},
  label: {...typography.label, color: colors.textLabel},
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  checkbox: {width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 1},
  checkboxChecked: {backgroundColor: colors.primary, borderColor: colors.primary},
  consentText: {flex: 1, ...typography.label, color: colors.textSecondary, lineHeight: 19},
});
