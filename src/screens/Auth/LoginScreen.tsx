import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {getApiErrorMessage} from '../../services/api';
import LogoMark from '../../assets/brand/logo-mark.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({navigation}: Props) {
  const {requestOtp} = useDriverAuth();
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const isValid = mobile.replace(/\D/g, '').length === 10;

  const handleSendOtp = async () => {
    if (!isValid || loading) {
      return;
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    setLoading(true);
    try {
      await requestOtp(cleanMobile);
      navigation.navigate('VerifyRegistrationOtp', {mobile: cleanMobile, flow: 'login'});
    } catch (err) {
      Alert.alert('Could not send OTP', getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']} scroll keyboardAvoiding>
      <View style={styles.header}>
        <LogoMark width={36} height={36} />
        <Text style={styles.headerTitle}>Welcome back</Text>
        <Text style={styles.headerSubtitle}>Sign in to your rider account</Text>
        <View style={styles.decorCircle} />
      </View>
      <View style={styles.body}>
        <View style={styles.fields}>
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.fieldRow}>
            <View style={styles.countryCode}>
              <Text style={styles.flag}>{'🇮🇳'}</Text>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <View style={[styles.numberField, isValid && styles.numberFieldValid]}>
              <Icon name="phone" size={17} color={colors.textSecondary} />
              <TextInput
                style={styles.numberInput}
                placeholder="98765 43210"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={10}
                value={mobile}
                onChangeText={t => setMobile(t.replace(/\D/g, ''))}
                autoComplete="tel"
              />
              {isValid && <Icon name="check" size={16} color={colors.primary} />}
            </View>
          </View>
          <Text style={styles.hint}>We'll send a one-time password to verify your identity.</Text>
        </View>
        <Button label="Send OTP" disabled={!isValid} loading={loading} onPress={handleSendOtp} style={styles.signInButton} />
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            New rider?{' '}
            <Text style={styles.footerLink} onPress={() => navigation.navigate('RegistrationLanding')}>
              Create Account
            </Text>
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, paddingHorizontal: spacing.xxl, paddingTop: spacing.xl, paddingBottom: spacing.huge, overflow: 'hidden'},
  headerTitle: {...typography.h4, color: colors.textInverse, marginTop: spacing.md},
  headerSubtitle: {...typography.body, color: 'rgba(255,255,255,0.75)', marginTop: 2},
  decorCircle: {position: 'absolute', right: -30, top: -80, width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(255,255,255,0.07)'},
  body: {flex: 1, backgroundColor: colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing.xxl, gap: spacing.xl},
  fields: {gap: spacing.xs},
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
  signInButton: {marginTop: spacing.xs},
  footer: {alignItems: 'center', marginTop: 'auto', paddingTop: spacing.xl},
  footerText: {...typography.body, color: colors.textSecondary},
  footerLink: {color: colors.primary, fontWeight: '600'},
});
