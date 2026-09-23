import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryOtpIncorrect'>;

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function DeliveryOtpIncorrectScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId)
      .then((o) => {
        if (!cancelled) setOrder(o);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [orderId, getOrder]);

  const customerName = order?.address.contactName ?? 'Customer';

  return (
    <Screen edges={['top', 'bottom']} keyboardAvoiding>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Enter Delivery OTP</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.errorBanner}>
          <Icon name="alert-circle" size={18} color={colors.danger} />
          <Text style={styles.errorText}>Incorrect OTP. Please ask the customer to check their SMS.</Text>
        </View>

        <View style={styles.customerPill}>
          <View style={styles.customerAvatar}>
            <Text style={styles.customerAvatarText}>{initialsFor(customerName)}</Text>
          </View>
          <Text style={styles.customerName}>{customerName}</Text>
        </View>

        <View style={styles.otpRow}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={styles.otpBox}>
              <View style={styles.otpDot} />
            </View>
          ))}
        </View>

        <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}} onPress={() => navigation.navigate('StateActionFailed')}>
          <Text style={styles.helpLink}>Customer doesn't have OTP?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button label="Retry OTP" onPress={() => navigation.replace('OtpEntry', {orderId})} />
        <Button
          label="Call Customer"
          variant="outline"
          onPress={() => navigation.navigate('CallCustomer', {orderId})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.subtitle, color: colors.textPrimary},
  body: {flex: 1, alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.xl, gap: spacing.lg},
  errorBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, width: '100%', backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: '#FDA29B', borderRadius: radius.lg, padding: spacing.md},
  errorText: {...typography.labelSemibold, color: colors.dangerText, flex: 1},
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
  otpRow: {flexDirection: 'row', gap: spacing.md},
  otpBox: {width: 64, height: 72, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.danger, backgroundColor: colors.dangerSurface, alignItems: 'center', justifyContent: 'center'},
  otpDot: {width: 12, height: 12, borderRadius: 6, backgroundColor: colors.danger},
  attemptsText: {...typography.labelSemibold, color: colors.danger},
  helpLink: {...typography.label, color: colors.textSecondary},
  footer: {gap: spacing.md, padding: spacing.xl, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
