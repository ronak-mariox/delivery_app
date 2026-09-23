import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'EnterMobileNumber'>;

export function EnterMobileNumberScreen({navigation}: Props) {
  const {requestOtp} = useDriverAuth();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const isValid = mobile.replace(/\D/g, '').length === 10;

  const handleSendOtp = async () => {
    if (!isValid || loading) {
      return;
    }
    setLoading(true);
    try {
      await requestOtp(mobile);
      navigation.navigate('VerifyRegistrationOtp', {mobile, flow: 'register'});
    } catch (err) {
      Alert.alert('Could not send OTP', getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} keyboardAvoiding>
      <View style={styles.headerRow}>
        <IconBackButton onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.body}>
        <View style={styles.iconBadge}>
          <Icon name="phone" size={28} color={colors.primary} />
        </View>
        <Text style={styles.title}>{'Enter your mobile\nnumber'}</Text>
        <Text style={styles.subtitle}>{"We'll send a one-time password to verify your identity."}</Text>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.fieldRow}>
            <View style={styles.countryCode}>
              <Text style={styles.flag}>{'🇮🇳'}</Text>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <View style={[styles.numberField, isValid && styles.numberFieldValid]}>
              <TextInput
                style={styles.numberInput}
                placeholder="98765 43210"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={10}
                value={mobile}
                onChangeText={t => setMobile(t.replace(/\D/g, ''))}
                autoFocus
              />
              {isValid && <Icon name="check" size={16} color={colors.primary} />}
            </View>
          </View>
          <Text style={styles.hint}>Standard messaging rates may apply</Text>
        </View>

        <View style={styles.privacyBanner}>
          <Icon name="info" size={18} color={colors.primary} />
          <Text style={styles.privacyText}>Your number is used only for verification and will never be shared with third parties.</Text>
        </View>

        <View style={styles.spacer} />
        <Button label="Send OTP" disabled={!isValid} loading={loading} onPress={handleSendOtp} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {paddingHorizontal: spacing.xl, paddingTop: spacing.lg},
  body: {flex: 1, paddingHorizontal: spacing.xxl, paddingTop: spacing.xl, paddingBottom: spacing.huge},
  iconBadge: {width: 60, height: 60, borderRadius: 18, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  title: {...typography.h3, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.sm},
  fieldBlock: {marginTop: spacing.xxl, gap: spacing.xs},
  label: {...typography.label, color: colors.textLabel},
  fieldRow: {flexDirection: 'row', gap: spacing.sm},
  countryCode: {
    width: 74,
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  flag: {fontSize: 18},
  countryCodeText: {...typography.label, color: colors.textPrimary},
  numberField: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  numberFieldValid: {borderColor: colors.primary},
  numberInput: {flex: 1, ...typography.bodyLg, letterSpacing: 0.5, color: colors.textPrimary, padding: 0},
  hint: {...typography.caption, color: colors.textSecondary},
  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primarySurface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  privacyText: {...typography.caption, color: colors.primary, flex: 1, lineHeight: 16},
  spacer: {flex: 1},
});
