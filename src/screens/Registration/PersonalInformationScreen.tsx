import React, {useState} from 'react';
import {Alert, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, ChipGroup, FormField, Icon, WizardScreen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {api, getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'PersonalInformation'>;

const GENDER_OPTIONS = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'Other', value: 'other'},
];

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDisplayDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function calculateAge(date: Date): number {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1;
  }
  return age;
}

const today = new Date();
const MAX_DOB = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
const MIN_DOB = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

export function PersonalInformationScreen({route, navigation}: Props) {
  const {mobile} = route.params;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [gender, setGender] = useState('male');
  const [showPicker, setShowPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isAdult = dob ? calculateAge(dob) >= 18 : false;
  const dobState = !dob ? 'default' : isAdult ? 'valid' : 'error';
  const canContinue = fullName.trim().length > 0 && !!dob && isAdult && !submitting;

  const onChangeDob = (event: DateTimePickerEvent, selected?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (event.type === 'set' && selected) {
      setDob(selected);
    }
  };

  const handleContinue = async () => {
    if (!canContinue || !dob) {
      return;
    }
    setSubmitting(true);
    try {
      await api.patch('/driver/registration/personal-info', {
        fullName: fullName.trim(),
        email: email.trim(),
        dob: toIsoDate(dob),
        gender,
      });
      navigation.navigate('ProfilePhoto');
    } catch (err) {
      Alert.alert('Could not save', getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <WizardScreen
      title="Personal Information"
      subtitle="Fill in your personal details accurately"
      step={1}
      totalSteps={10}
      stepLabel="Personal Info"
      onBack={() => navigation.goBack()}
      footer={
        <View style={styles.footer}>
          <Button label="Save Draft" variant="secondary" style={styles.saveDraft} />
          <Button label="Continue" style={styles.continueButton} disabled={!canContinue} loading={submitting} onPress={handleContinue} />
        </View>
      }>
      <FormField
        label="Full Name"
        state={fullName.trim().length > 0 ? 'valid' : 'default'}
        leftIcon="user"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Your full name, as on your ID"
        rightElement={fullName.trim().length > 0 ? <Icon name="check" size={16} color={colors.primary} /> : undefined}
        helperText="As it appears on your ID"
      />
      <FormField label="Mobile Number" leftIcon="phone" value={`+91 ${mobile}`} editable={false} helperText="Verified number" />
      <FormField
        label="Email Address"
        state="active"
        leftIcon="mail"
        value={email}
        onChangeText={setEmail}
        placeholder="rahul@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.dateFieldWrapper}>
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={[styles.dateField, dobState === 'valid' && styles.dateFieldValid, dobState === 'error' && styles.dateFieldError]}
          activeOpacity={0.8}
          onPress={() => setShowPicker(true)}>
          <Icon name="calendar" size={17} color={colors.textSecondary} />
          <Text style={[styles.dateText, !dob && styles.dateTextPlaceholder]}>{dob ? formatDisplayDate(dob) : 'Select your date of birth'}</Text>
          {dob && <Icon name={isAdult ? 'check' : 'alert-circle'} size={16} color={isAdult ? colors.primary : colors.danger} />}
        </TouchableOpacity>
        {dob && !isAdult && <Text style={styles.dateHelperError}>You must be at least 18 years old to register</Text>}
        {!dob && <Text style={styles.dateHelper}>You must be at least 18 years old to register</Text>}
      </View>

      {showPicker && (
        <DateTimePicker
          value={dob ?? MAX_DOB}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={today}
          minimumDate={MIN_DOB}
          onChange={onChangeDob}
        />
      )}

      <View style={styles.genderBlock}>
        <Text style={styles.label}>Gender</Text>
        <ChipGroup options={GENDER_OPTIONS} value={gender} onChange={setGender} />
      </View>
      <FormField label="Registered Mobile" leftIcon="phone" value={`+91 ${mobile}`} editable={false} helperText="Cannot be changed after verification" />
    </WizardScreen>
  );
}

const styles = StyleSheet.create({
  genderBlock: {gap: spacing.xs},
  label: {...typography.label, color: colors.textLabel},
  dateFieldWrapper: {gap: spacing.xs},
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
  dateFieldValid: {borderColor: colors.primary, backgroundColor: colors.primarySurface},
  dateFieldError: {borderColor: colors.danger, backgroundColor: colors.dangerSurface},
  dateText: {flex: 1, ...typography.body, color: colors.textPrimary},
  dateTextPlaceholder: {color: colors.textMuted},
  dateHelper: {...typography.caption, color: colors.textMuted},
  dateHelperError: {...typography.caption, color: colors.dangerText},
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  saveDraft: {flex: 1},
  continueButton: {flex: 2},
});
