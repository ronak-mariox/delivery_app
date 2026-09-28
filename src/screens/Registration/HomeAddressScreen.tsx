import React, {useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {ChipGroup, FormField, Icon, WizardFooter, WizardScreen} from '../../components';
import {colors, spacing, typography} from '../../theme';
import {api, getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeAddress'>;

const ADDRESS_TYPE_OPTIONS = [
  {label: 'Home', value: 'home'},
  {label: 'Work', value: 'work'},
  {label: 'Other', value: 'other'},
];

export function HomeAddressScreen({navigation}: Props) {
  const [house, setHouse] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [addressType, setAddressType] = useState('home');
  const [submitting, setSubmitting] = useState(false);

  const isValid = house.trim().length > 0 && area.trim().length > 0 && city.trim().length > 0 && state.trim().length > 0 && pincode.trim().length === 6;

  const handleContinue = async () => {
    if (!isValid || submitting) {
      return;
    }
    setSubmitting(true);
    try {
      const line1 = [house.trim(), street.trim()].filter(Boolean).join(', ');
      await api.patch('/driver/registration/address', {
        line1,
        area: area.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        addressType,
      });
      navigation.navigate('EmergencyContact');
    } catch (err) {
      Alert.alert('Could not save', getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <WizardScreen
      title="Home Address"
      subtitle="This is used for your rider profile"
      step={3}
      totalSteps={10}
      stepLabel="Address"
      onBack={() => navigation.goBack()}
      footer={
        <WizardFooter onBack={() => navigation.goBack()} onContinue={handleContinue} continueDisabled={!isValid || submitting} />
      }>

      <FormField label="House / Flat / Building No." value={house} onChangeText={setHouse} placeholder="e.g. 42B, Green Valley Towers" />
      <FormField
        label="Street / Lane"
        state={street.trim().length > 0 ? 'valid' : 'default'}
        value={street}
        onChangeText={setStreet}
        placeholder="e.g. MG Road, Koramangala 4th Block"
        rightElement={street.trim().length > 0 ? <Icon name="check" size={16} color={colors.primary} /> : undefined}
      />
      <FormField label="Area / Locality" state={area.length > 0 ? 'active' : 'default'} value={area} onChangeText={setArea} placeholder="Enter your area or locality" />
      <FormField label="City" value={city} onChangeText={setCity} placeholder="e.g. Bengaluru" />
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <FormField label="State" value={state} onChangeText={setState} placeholder="e.g. Karnataka" />
        </View>
        <View style={styles.rowItem}>
          <FormField
            label="Pincode"
            state={pincode.length === 0 ? 'default' : pincode.length === 6 ? 'valid' : 'error'}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="number-pad"
            maxLength={6}
            helperText={pincode.length > 0 && pincode.length !== 6 ? 'Please enter a valid 6-digit pincode' : undefined}
            helperTone="error"
          />
        </View>
      </View>

      <View style={styles.addressTypeBlock}>
        <Text style={styles.label}>Address Type</Text>
        <ChipGroup options={ADDRESS_TYPE_OPTIONS} value={addressType} onChange={setAddressType} />
      </View>
    </WizardScreen>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', gap: spacing.md},
  rowItem: {flex: 1},
  addressTypeBlock: {gap: spacing.xs},
  label: {...typography.label, color: colors.textLabel},
});
