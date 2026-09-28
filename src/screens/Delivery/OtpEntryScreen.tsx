import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, OtpInput, Screen, ScreenHeader} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';
import {getApiErrorBody, getApiErrorMessage, getApiErrorStatus} from '../../services/api';

const OTP_LENGTH = 6;

type Props = NativeStackScreenProps<RootStackParamList, 'OtpEntry'>;

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {return '?';}
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function OtpEntryScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder, verifyDeliveryOtp} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const isComplete = otp.length === OTP_LENGTH;

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId)
      .then((o) => {
        if (!cancelled) {setOrder(o);}
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [orderId, getOrder]);

  const customerName = order?.address.contactName ?? 'Customer';

  const handleVerify = async () => {
    if (!isComplete) {
      return;
    }
    setVerifying(true);
    try {
      await verifyDeliveryOtp(orderId, otp);
      navigation.replace('DeliverySuccess', {orderId});
    } catch (err) {
      const status = getApiErrorStatus(err);
      if (status === 422) {
        const body = getApiErrorBody(err);
        navigation.replace('DeliveryOtpIncorrect', {
          orderId,
          attemptsLeft: typeof body?.attemptsLeft === 'number' ? body.attemptsLeft : undefined,
          message: body?.error,
        });
      } else if (status === 429) {
        Alert.alert(
          'Too many attempts',
          getApiErrorMessage(err, 'OTP attempts exhausted for this order. Please call the customer or contact support.'),
          [{text: 'OK', onPress: () => navigation.navigate('ArrivedAtCustomer', {orderId})}],
        );
      } else {
        Alert.alert('Verification Failed', getApiErrorMessage(err, 'Could not verify OTP. Please try again.'));
      }
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Screen backgroundColor={colors.surface} edges={['top', 'bottom']} keyboardAvoiding>
      <ScreenHeader title="Enter Delivery OTP" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <Text style={styles.instructions}>
          Ask the customer for the 6-digit delivery code sent to their registered mobile number.
        </Text>

        <View style={styles.customerPill}>
          <View style={styles.customerAvatar}>
            <Text style={styles.customerAvatarText}>{initialsFor(customerName)}</Text>
          </View>
          <Text style={styles.customerName}>{customerName}</Text>
        </View>

        <OtpInput length={OTP_LENGTH} value={otp} onChange={setOtp} />

        <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}} onPress={() => navigation.navigate('CallCustomer', {orderId})}>
          <Text style={styles.otpHelp}>Customer doesn't have the code? Call them</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button label="Clear" variant="outline" fullWidth={false} style={styles.clearButton} onPress={() => setOtp('')} />
        <Button
          label="Verify OTP →"
          fullWidth={false}
          style={styles.verifyButton}
          disabled={!isComplete}
          loading={verifying}
          onPress={handleVerify}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.xxl, gap: spacing.xxl},
  instructions: {...typography.body, color: colors.textSecondary, textAlign: 'center'},
  customerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingLeft: spacing.sm,
    paddingRight: spacing.lg,
    paddingVertical: spacing.sm,
  },
  customerAvatar: {width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  customerAvatarText: {...typography.captionSemibold, color: colors.white},
  customerName: {...typography.bodySemibold, color: colors.textPrimary},
  otpHelp: {...typography.label, color: colors.primary},
  footer: {flexDirection: 'row', gap: spacing.md, padding: spacing.xl, borderTopWidth: 1, borderTopColor: colors.border},
  clearButton: {flex: 1},
  verifyButton: {flex: 2},
});
