import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {FormField, Icon, InfoBanner, WizardFooter, WizardScreen} from '../../components';
import {colors, radius, shadows, typography} from '../../theme';
import {api, getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentDetails'>;

type Tab = 'bank' | 'upi';

export function PaymentDetailsScreen({navigation}: Props) {
  const [tab, setTab] = useState<Tab>('bank');
  const [holderName, setHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [upiId, setUpiId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid =
    holderName.trim().length > 0 &&
    accountNumber.trim().length > 0 &&
    accountNumber === confirmAccountNumber &&
    ifsc.trim().length === 11;

  const handleContinue = async () => {
    if (!isValid || submitting) {
      return;
    }
    setSubmitting(true);
    try {
      await api.patch('/driver/registration/bank-details', {
        accountHolderName: holderName.trim(),
        accountNumber: accountNumber.trim(),
        confirmAccountNumber: confirmAccountNumber.trim(),
        ifsc: ifsc.trim().toUpperCase(),
        upiId: upiId.trim() || undefined,
      });
      navigation.navigate('ReviewApplication');
    } catch (err) {
      Alert.alert('Could not save', getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <WizardScreen
      title="Payment Details"
      subtitle="For receiving your delivery earnings"
      step={10}
      totalSteps={10}
      stepLabel="Bank / UPI Details"
      onBack={() => navigation.goBack()}
      footer={
        <WizardFooter
          onBack={() => navigation.goBack()}
          continueLabel="Review Application"
          onContinue={handleContinue}
          continueDisabled={!isValid || submitting}
        />
      }>
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === 'bank' && styles.tabActive]} activeOpacity={0.85} onPress={() => setTab('bank')}>
          <Text style={[styles.tabText, tab === 'bank' && styles.tabTextActive]}>Bank Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === 'upi' && styles.tabActive]} activeOpacity={0.85} onPress={() => setTab('upi')}>
          <Text style={[styles.tabText, tab === 'upi' && styles.tabTextActive]}>UPI</Text>
        </TouchableOpacity>
      </View>

      <FormField
        label="Account Holder Name"
        state={holderName.trim().length > 0 ? 'valid' : 'default'}
        leftIcon="user"
        value={holderName}
        onChangeText={setHolderName}
        placeholder="Full name as per bank records"
        rightElement={holderName.trim().length > 0 ? <Icon name="check" size={16} color={colors.primary} /> : undefined}
      />
      <FormField
        label="Account Number"
        state={accountNumber.trim().length > 0 ? 'valid' : 'default'}
        leftIcon="credit-card"
        value={accountNumber}
        onChangeText={setAccountNumber}
        placeholder="Enter account number"
        keyboardType="number-pad"
        rightElement={accountNumber.trim().length > 0 ? <Icon name="check" size={16} color={colors.primary} /> : undefined}
      />
      <FormField
        label="Confirm Account Number"
        state={confirmAccountNumber.length > 0 ? (confirmAccountNumber === accountNumber ? 'valid' : 'error') : 'default'}
        leftIcon="credit-card"
        value={confirmAccountNumber}
        onChangeText={setConfirmAccountNumber}
        placeholder="Re-enter account number"
        keyboardType="number-pad"
        helperText={confirmAccountNumber.length > 0 && confirmAccountNumber !== accountNumber ? 'Account numbers do not match' : undefined}
        helperTone="error"
      />
      <FormField
        label="IFSC Code"
        leftIcon="shield"
        value={ifsc}
        onChangeText={t => setIfsc(t.toUpperCase())}
        autoCapitalize="characters"
        maxLength={11}
        placeholder="11-character IFSC code"
        helperText="11-character IFSC code"
      />

      <FormField label="UPI ID (Optional)" value={upiId} onChangeText={setUpiId} placeholder="yourname@upi" autoCapitalize="none" helperText="For instant payment option" />

      <InfoBanner tone="neutral" description="Bank details are encrypted with AES-256 and stored securely. We will never share your financial information." />
    </WizardScreen>
  );
}

const styles = StyleSheet.create({
  tabs: {flexDirection: 'row', backgroundColor: colors.background, borderRadius: radius.lg, padding: 4, gap: 4},
  tab: {flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md},
  tabActive: {backgroundColor: colors.surface, ...shadows.sm},
  tabText: {...typography.labelSemibold, color: colors.textMuted, fontWeight: '400'},
  tabTextActive: {color: colors.textPrimary, fontWeight: '600'},
});
