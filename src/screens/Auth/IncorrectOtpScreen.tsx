import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'IncorrectOtp'>;

export function IncorrectOtpScreen({route, navigation}: Props) {
  const {mobile, reason, flow, attemptsLeft} = route.params;

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
        <IconBackButton onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.body}>
        <View style={styles.iconBadge}>
          <Icon name="x" size={24} color={colors.danger} />
        </View>
        <Text style={styles.title}>Incorrect OTP</Text>
        <Text style={styles.subtitle}>{reason || "The code you entered doesn't match. Please check and try again."}</Text>

        {typeof attemptsLeft === 'number' && (
          <View style={styles.attemptsRow}>
            <Icon name="alert-circle" size={14} color={colors.danger} />
            <Text style={styles.attemptsText}>
              <Text style={styles.attemptsStrong}>{attemptsLeft}</Text> {attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining
            </Text>
          </View>
        )}

        <View style={styles.errorBanner}>
          <Icon name="alert-triangle" size={18} color={colors.dangerText} />
          <View style={styles.errorTextWrap}>
            <Text style={styles.errorTitle}>Check the 6-digit code</Text>
            <Text style={styles.errorDescription}>Make sure you entered the latest code sent to +91 {mobile}. Codes expire after a few minutes.</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button label="Try Again" onPress={() => navigation.goBack()} />
          <Button label="Resend OTP" variant="secondary" onPress={() => navigation.navigate('ResendOtpMethod', {mobile, flow})} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {paddingHorizontal: spacing.xl, paddingTop: spacing.lg},
  body: {flex: 1, paddingHorizontal: spacing.xxl, paddingTop: spacing.xl},
  iconBadge: {width: 60, height: 60, borderRadius: 18, backgroundColor: colors.dangerSurface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  title: {...typography.h3, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.sm},
  attemptsRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.lg, marginBottom: spacing.lg},
  attemptsText: {...typography.label, color: colors.danger},
  attemptsStrong: {fontWeight: '600'},
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.dangerSurface,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  errorTextWrap: {flex: 1, gap: 2},
  errorTitle: {...typography.labelSemibold, color: colors.dangerText},
  errorDescription: {...typography.caption, color: colors.danger, lineHeight: 16},
  actions: {gap: spacing.md},
});
