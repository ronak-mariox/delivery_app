import React, {useEffect, useRef} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, ProgressBar, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'PickupConfirmation'>;

const STEPS = [
  {id: 'arrived', label: 'Arrived at store', status: 'done' as const},
  {id: 'verified', label: 'Order verified', status: 'done' as const},
  {id: 'confirming', label: 'Confirming pickup', status: 'active' as const},
  {id: 'navigate', label: 'Start navigation to customer', status: 'upcoming' as const},
];

export function PickupConfirmationScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {confirmPickup} = useOrders();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    confirmPickup(orderId)
      .then(({devOtp}) => {
        if (__DEV__ && devOtp) {
          Alert.alert('Pickup Confirmed', `Dev OTP for this delivery: ${devOtp}`, [
            {text: 'OK', onPress: () => navigation.replace('OrderPickedUp', {orderId})},
          ]);
        } else {
          navigation.replace('OrderPickedUp', {orderId});
        }
      })
      .catch((err) => {
        Alert.alert('Pickup Confirmation Failed', getApiErrorMessage(err, 'Could not confirm pickup. Please try again.'), [
          {text: 'OK', onPress: () => navigation.replace('PickupFailed', {orderId})},
        ]);
      });
  }, [orderId, confirmPickup, navigation]);

  return (
    <Screen edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.iconOuter}>
        <View style={styles.iconRing}>
          <Icon name="refresh" size={32} color={colors.primary} />
        </View>
      </View>
      <Text style={styles.title}>Confirming Pickup…</Text>
      <Text style={styles.subtitle}>Logging your pickup with the store</Text>

      <ProgressBar progress={0.7} height={8} style={styles.progressBar} />

      <View style={styles.card}>
        {STEPS.map((step, index) => (
          <View key={step.id} style={[styles.stepRow, index > 0 && styles.stepRowBorder]}>
            <View
              style={[
                styles.stepDot,
                step.status === 'done' && styles.stepDotDone,
                step.status === 'active' && styles.stepDotActive,
              ]}>
              {step.status === 'done' && <Icon name="check" size={14} color={colors.white} />}
              {step.status === 'active' && <View style={styles.stepDotActiveInner} />}
            </View>
            <Text style={[styles.stepLabel, step.status === 'active' && styles.stepLabelActive]}>{step.label}</Text>
            {step.status === 'active' && (
              <View style={styles.progressTag}>
                <Text style={styles.progressTagText}>In progress</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      <Text style={styles.hintText}>This usually takes a few seconds</Text>

      <View style={styles.spacer} />

      <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('PickupFailed', {orderId})}>
        <Text style={styles.troubleLink}>Having trouble?</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.huge},
  iconOuter: {marginBottom: spacing.lg},
  iconRing: {width: 80, height: 80, borderRadius: 40, backgroundColor: colors.successSurface, borderWidth: 3, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.xxs, marginBottom: spacing.xl},
  progressBar: {width: '100%', marginBottom: spacing.xl},
  card: {width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  stepRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  stepRowBorder: {borderTopWidth: 1, borderTopColor: colors.border},
  stepDot: {width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  stepDotDone: {backgroundColor: colors.primary, borderColor: colors.primary},
  stepDotActive: {borderColor: colors.primary},
  stepDotActiveInner: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  stepLabel: {...typography.body, color: colors.textSecondary, flex: 1},
  stepLabelActive: {...typography.bodySemibold, color: colors.textPrimary},
  progressTag: {backgroundColor: colors.successSurface, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2},
  progressTagText: {...typography.captionSemibold, color: colors.primary},
  hintText: {...typography.label, color: colors.textSecondary, marginTop: spacing.lg},
  spacer: {flex: 1},
  troubleLink: {...typography.body, color: colors.textSecondary, textDecorationLine: 'underline', paddingVertical: spacing.lg},
});
