import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, ProgressBar, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'ResendOtpMethod'>;

type Method = 'sms' | 'voice' | 'email';

const METHODS: {id: Method; icon: React.ComponentProps<typeof Icon>['name']; title: string; subtitle: string; label: string}[] = [
  {id: 'sms', icon: 'message-circle', title: 'SMS', subtitle: 'Receive a text message', label: 'SMS'},
  {id: 'voice', icon: 'phone', title: 'Voice Call', subtitle: 'Receive a phone call with the code', label: 'Voice Call'},
  {id: 'email', icon: 'mail', title: 'Email', subtitle: 'Send to ra••••@gmail.com', label: 'Email'},
];

const MAX_ATTEMPTS = 3;
const USED_ATTEMPTS = 1;

export function ResendOtpMethodScreen({route, navigation}: Props) {
  const {mobile, flow} = route.params;
  const {requestOtp} = useDriverAuth();
  const [method, setMethod] = useState<Method>('sms');
  const [sending, setSending] = useState(false);
  const selectedLabel = METHODS.find(m => m.id === method)?.label ?? 'SMS';

  const handleSendNewOtp = async () => {
    if (sending) {
      return;
    }
    setSending(true);
    try {
      // The backend only supports SMS-style OTP delivery today; the method
      // picker above is preserved for UX but always resends via the same
      // request-otp endpoint.
      await requestOtp(mobile);
      navigation.navigate('VerifyRegistrationOtp', {mobile, flow});
    } catch (err) {
      Alert.alert('Could not resend OTP', getApiErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
        <IconBackButton onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.body}>
        <View style={styles.iconBadge}>
          <Icon name="refresh" size={26} color={colors.primary} />
        </View>
        <Text style={styles.title}>Resend OTP</Text>
        <Text style={styles.subtitle}>
          Choose how you'd like to receive your new verification code for <Text style={styles.subtitleStrong}>+91 {mobile}</Text>
        </Text>

        <View style={styles.methodList}>
          {METHODS.map(m => {
            const selected = m.id === method;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.methodRow, selected && styles.methodRowSelected]}
                activeOpacity={0.8}
                onPress={() => setMethod(m.id)}>
                <View style={[styles.methodIcon, selected && styles.methodIconSelected]}>
                  <Icon name={m.icon} size={20} color={selected ? colors.white : colors.textSecondary} />
                </View>
                <View style={styles.methodText}>
                  <Text style={styles.methodTitle}>{m.title}</Text>
                  <Text style={styles.methodSubtitle}>{m.subtitle}</Text>
                </View>
                <View style={[styles.radio, selected && styles.radioSelected]}>{selected && <View style={styles.radioDot} />}</View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.attemptsCard}>
          <View style={styles.attemptsHeader}>
            <Text style={styles.attemptsLabel}>Resend attempts</Text>
            <Text style={styles.attemptsValue}>
              {USED_ATTEMPTS} / {MAX_ATTEMPTS}
            </Text>
          </View>
          <ProgressBar progress={USED_ATTEMPTS / MAX_ATTEMPTS} height={4} trackColor={colors.border} style={styles.attemptsProgress} />
          <Text style={styles.attemptsHint}>{MAX_ATTEMPTS - USED_ATTEMPTS} attempts remaining before temporary lock</Text>
        </View>

        <View style={styles.spacer} />
        <Button label={`Send New OTP via ${selectedLabel}`} loading={sending} onPress={handleSendNewOtp} />
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
  subtitleStrong: {...typography.bodySemibold, color: colors.textPrimary},
  methodList: {gap: spacing.md, marginTop: spacing.xxl, marginBottom: spacing.lg},
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  methodRowSelected: {borderColor: colors.primary, backgroundColor: colors.primarySurface},
  methodIcon: {width: 44, height: 44, borderRadius: radius.lg, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  methodIconSelected: {backgroundColor: colors.primary},
  methodText: {flex: 1},
  methodTitle: {...typography.bodySemibold, color: colors.textPrimary},
  methodSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  radio: {width: 20, height: 20, borderRadius: radius.md, borderWidth: 2, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.primary, backgroundColor: colors.primary},
  radioDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white},
  attemptsCard: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  attemptsHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  attemptsLabel: {...typography.caption, color: colors.textSecondary},
  attemptsValue: {...typography.captionSemibold, color: colors.textPrimary},
  attemptsProgress: {marginTop: spacing.sm},
  attemptsHint: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: spacing.xs},
  spacer: {flex: 1, minHeight: spacing.xl},
});
