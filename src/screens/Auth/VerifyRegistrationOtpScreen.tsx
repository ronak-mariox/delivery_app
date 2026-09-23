import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, OtpInput, Screen} from '../../components';
import {colors, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {api, getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyRegistrationOtp'>;

const OTP_LENGTH = 6;
const RESEND_SECONDS = 42;

interface RegistrationStatusResponse {
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  kycStatus: 'pending' | 'verified' | 'rejected';
  referenceId?: string;
  rejectionReason?: string | null;
}

export function VerifyRegistrationOtpScreen({route, navigation}: Props) {
  const {mobile, flow = 'register'} = route.params;
  const {verifyOtp, requestOtp} = useDriverAuth();
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const isComplete = otp.length === OTP_LENGTH;

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }
    const timer = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formattedTime = `00:${String(secondsLeft).padStart(2, '0')}`;

  const routeAfterExistingDriverVerify = async () => {
    try {
      const {data} = await api.get<RegistrationStatusResponse>('/driver/registration/status');
      switch (data.status) {
        case 'active':
          navigation.reset({index: 0, routes: [{name: 'Home'}]});
          return;
        case 'pending':
          navigation.navigate('VerificationInProgress');
          return;
        case 'rejected':
          navigation.navigate('VerificationRejected');
          return;
        case 'suspended':
          navigation.navigate('AccountRestricted');
          return;
        default:
          navigation.navigate('VerificationInProgress');
      }
    } catch (err) {
      Alert.alert('Could not load account status', getApiErrorMessage(err));
    }
  };

  const handleVerify = async () => {
    if (!isComplete || verifying) {
      return;
    }
    setVerifying(true);
    try {
      const result = await verifyOtp(mobile, otp, flow);
      if (result.isNewDriver) {
        navigation.navigate('PersonalInformation', {mobile});
      } else {
        await routeAfterExistingDriverVerify();
      }
    } catch (err) {
      if (flow === 'login' && axios.isAxiosError(err) && err.response?.status === 404 && err.response?.data?.reason === 'account_not_found') {
        Alert.alert(
          'Account Not Found',
          "We couldn't find a rider account for this number. Please register first to continue.",
          [
            {text: 'Try Different Number', style: 'cancel', onPress: () => navigation.navigate('Login')},
            {text: 'Register Now', onPress: () => navigation.navigate('RegistrationLanding')},
          ],
        );
        return;
      }
      navigation.navigate('IncorrectOtp', {mobile, flow, reason: getApiErrorMessage(err, 'The code you entered doesn\'t match. Please check and try again.')});
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) {
      return;
    }
    setResending(true);
    try {
      await requestOtp(mobile);
      setOtp('');
      setSecondsLeft(RESEND_SECONDS);
    } catch (err) {
      Alert.alert('Could not resend OTP', getApiErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} keyboardAvoiding>
      <View style={styles.headerRow}>
        <IconBackButton onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.body}>
        <View style={styles.iconBadge}>
          <Icon name="message-circle" size={28} color={colors.primary} />
        </View>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit OTP sent to <Text style={styles.subtitleStrong}>+91 {mobile}</Text>
        </Text>

        <View style={styles.otpWrap}>
          <OtpInput length={OTP_LENGTH} value={otp} onChange={setOtp} />
        </View>

        <View style={styles.timerRow}>
          <Icon name="clock" size={15} color={colors.textSecondary} />
          <Text style={styles.timerText}>
            Resend OTP in <Text style={styles.timerValue}>{formattedTime}</Text>
          </Text>
        </View>

        <Button label="Verify OTP" disabled={!isComplete} loading={verifying} onPress={handleVerify} style={styles.verifyButton} />

        <TouchableOpacity onPress={handleResend} disabled={secondsLeft > 0 || resending} style={styles.resendButton}>
          <Text style={[styles.resendText, secondsLeft === 0 && styles.resendTextActive]}>{resending ? 'Resending…' : 'Resend OTP'}</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          {"Didn't receive the OTP? "}
          <Text style={styles.footerLink} onPress={() => navigation.navigate('ResendOtpMethod', {mobile, flow})}>
            Try another method
          </Text>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {paddingHorizontal: spacing.xl, paddingTop: spacing.lg},
  body: {flex: 1, alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.xl},
  iconBadge: {width: 60, height: 60, borderRadius: 18, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start', marginBottom: spacing.lg},
  title: {...typography.h3, color: colors.textPrimary, alignSelf: 'flex-start'},
  subtitle: {...typography.body, color: colors.textSecondary, alignSelf: 'flex-start', marginTop: spacing.xs},
  subtitleStrong: {...typography.bodySemibold, color: colors.textPrimary},
  otpWrap: {marginTop: spacing.xxl, marginBottom: spacing.xxl},
  timerRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xxl},
  timerText: {...typography.body, color: colors.textSecondary},
  timerValue: {...typography.bodySemibold, color: colors.primary},
  verifyButton: {marginBottom: spacing.md},
  resendButton: {height: 52, alignItems: 'center', justifyContent: 'center', width: '100%'},
  resendText: {...typography.bodyMedium, color: colors.textMuted},
  resendTextActive: {color: colors.primary, fontWeight: '600'},
  footerText: {...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl},
  footerLink: {color: colors.primary},
});
