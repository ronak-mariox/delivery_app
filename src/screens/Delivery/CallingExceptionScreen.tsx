import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CallingException'>;

const QUICK_MESSAGES = ['I\'m outside', 'Please come down', 'Where to leave it?'];

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function CallingExceptionScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);

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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.exceptionBadge}>
          <Text style={styles.exceptionBadgeText}>Delivery exception call</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initialsFor(customerName)}</Text>
        </View>
        <Text style={styles.callingText}>{`Calling ${customerName}…`}</Text>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotDim]} />
          <View style={[styles.dot, styles.dotMid]} />
          <View style={styles.dot} />
        </View>
      </View>

      <View style={styles.contextCard}>
        <Text style={styles.contextLabel}>ORDER CONTEXT</Text>
        <Text style={styles.contextOrder}>#{order?.orderNumber ?? orderId}</Text>
        {!!order?.address.city && <Text style={styles.contextAddress}>{order.address.city}</Text>}
      </View>

      <View style={styles.quickBlock}>
        <Text style={styles.quickLabel}>Quick message to send:</Text>
        <View style={styles.quickRow}>
          {QUICK_MESSAGES.map(message => (
            <TouchableOpacity
              key={message}
              style={styles.quickChip}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CustomerContacted', {orderId})}>
              <Text style={styles.quickChipText}>{message}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.controlButton} activeOpacity={0.8} onPress={() => setMuted(m => !m)}>
          <Icon name="mic-off" size={22} color={muted ? colors.danger : colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.hangupButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Icon name="phone-off" size={24} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} activeOpacity={0.8} onPress={() => setSpeakerOn(s => !s)}>
          <Icon name="volume-2" size={22} color={speakerOn ? colors.primary : colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.spacer} />

      <View style={styles.footer}>
        <Text style={styles.noAnswerText}>No answer?</Text>
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={styles.messageButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MessageCustomer', {orderId})}>
            <Icon name="message-circle" size={16} color={colors.textPrimary} />
            <Text style={styles.messageButtonText}>Send Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.retryButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('WaitingForCustomer', {orderId})}>
            <Text style={styles.retryButtonText}>Wait & Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  header: {backgroundColor: colors.dark900, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingTop: 56, paddingBottom: spacing.xl},
  exceptionBadge: {position: 'absolute', right: spacing.lg, top: 48, backgroundColor: colors.warning, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4},
  exceptionBadgeText: {...typography.captionSemibold, fontSize: 11, color: colors.white},
  avatar: {width: 60, height: 60, borderRadius: 30, backgroundColor: colors.dark800, alignItems: 'center', justifyContent: 'center'},
  avatarText: {...typography.h4, fontSize: 22, color: colors.white},
  callingText: {...typography.bodySemibold, fontSize: 16, color: colors.white},
  dots: {flexDirection: 'row', gap: 4},
  dot: {width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textMuted},
  dotDim: {opacity: 0.6},
  dotMid: {opacity: 0.8},
  contextCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, margin: spacing.lg, padding: spacing.md},
  contextLabel: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase'},
  contextOrder: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginTop: spacing.xs},
  contextAddress: {...typography.label, color: colors.textSecondary, marginTop: 2},
  contextDivider: {height: 1, backgroundColor: colors.border, marginTop: spacing.sm, marginBottom: spacing.sm},
  contextAttempt: {...typography.labelSemibold, color: colors.warning},
  quickBlock: {paddingHorizontal: spacing.lg},
  quickLabel: {...typography.label, color: colors.textSecondary, marginBottom: spacing.sm},
  quickRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  quickChip: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  quickChipText: {...typography.label, color: colors.textPrimary},
  controlsRow: {flexDirection: 'row', gap: spacing.xxl, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl},
  controlButton: {width: 52, height: 52, borderRadius: 26, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  hangupButton: {width: 64, height: 64, borderRadius: 32, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center'},
  spacer: {flex: 1},
  footer: {backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, gap: spacing.sm},
  noAnswerText: {...typography.label, color: colors.textSecondary, textAlign: 'center'},
  footerRow: {flexDirection: 'row', gap: spacing.sm},
  messageButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, height: 48, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md},
  messageButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  retryButton: {flex: 1, alignItems: 'center', justifyContent: 'center', height: 48, backgroundColor: colors.primary, borderRadius: radius.md},
  retryButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.white},
});
