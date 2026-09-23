import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, OtpInput} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountVerifyNewNumber'>;

export function AccountVerifyNewNumberScreen({navigation}: Props) {
  const [otp, setOtp] = useState('');
  const canVerify = otp.length === 6;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify New Number</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.iconCircle}>
          <Icon name="phone" size={28} color={colors.primary} />
        </View>
        <Text style={styles.title}>Enter the 6-digit OTP</Text>
        <Text style={styles.subtitle}>Sent to +91 XXXXX 43210 (new number)</Text>

        <View style={styles.otpWrap}>
          <OtpInput length={6} value={otp} onChange={setOtp} />
        </View>

        <Text style={styles.resendHint}>
          Resend OTP in <Text style={styles.resendTime}>0:42</Text>
        </Text>
        <TouchableOpacity activeOpacity={0.7} disabled>
          <Text style={styles.resendDisabled}>Resend OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <Text style={styles.changeNumber}>Change Number</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.primaryButton, !canVerify && styles.primaryButtonDisabled]}
          activeOpacity={0.85}
          disabled={!canVerify}
          onPress={() => navigation.reset({index: 0, routes: [{name: 'AccountSecurity'}]})}>
          <Text style={styles.primaryButtonText}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 18, color: colors.textPrimary},
  body: {padding: spacing.xl, paddingTop: spacing.xxl, alignItems: 'center', paddingBottom: 120},
  iconCircle: {width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  title: {...typography.bodyLgMedium, fontSize: 16, color: colors.textPrimary},
  subtitle: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.xxl},
  otpWrap: {marginBottom: spacing.xl},
  resendHint: {...typography.label, fontSize: 13, color: colors.textSecondary},
  resendTime: {...typography.bodySemibold, fontSize: 13, color: colors.primary},
  resendDisabled: {...typography.label, fontSize: 13, color: colors.textMuted, marginTop: spacing.md},
  changeNumber: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: spacing.md},
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonDisabled: {backgroundColor: '#9CA3AF'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
});
