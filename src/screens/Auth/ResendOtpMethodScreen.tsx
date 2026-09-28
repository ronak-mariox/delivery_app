import React, {useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, InfoBanner, Screen} from '../../components';
import {colors, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {getApiErrorMessage, getApiErrorStatus} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'ResendOtpMethod'>;

export function ResendOtpMethodScreen({route, navigation}: Props) {
  const {mobile, flow} = route.params;
  const {requestOtp} = useDriverAuth();
  const [sending, setSending] = useState(false);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);

  const handleSendNewOtp = async () => {
    if (sending) {
      return;
    }
    setSending(true);
    try {
      await requestOtp(mobile);
      navigation.navigate('VerifyRegistrationOtp', {mobile, flow});
    } catch (err) {
      if (getApiErrorStatus(err) === 429) {
        setLimitMessage(getApiErrorMessage(err, 'Too many OTP requests. Please try again in a few minutes.'));
      } else {
        Alert.alert('Could not resend OTP', getApiErrorMessage(err));
      }
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
          We'll send a new 6-digit verification code to <Text style={styles.subtitleStrong}>+91 {mobile}</Text>
        </Text>

        <View style={styles.banner}>
          {limitMessage ? (
            <InfoBanner tone="warning" title="Too many requests" description={limitMessage} />
          ) : (
            <InfoBanner
              title="Didn't get the code?"
              description="Codes can take up to a minute to arrive. Requesting a new code invalidates the previous one."
            />
          )}
        </View>

        <View style={styles.spacer} />
        <Button label="Send New OTP" loading={sending} disabled={!!limitMessage} onPress={handleSendNewOtp} />
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
  banner: {marginTop: spacing.xxl},
  spacer: {flex: 1, minHeight: spacing.xl},
});
