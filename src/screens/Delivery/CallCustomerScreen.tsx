import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CallCustomer'>;

const QUICK_MESSAGES = ['I\'m outside your building', 'Please come to the gate', 'Where should I leave the package?'];

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {return '?';}
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function CallCustomerScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);

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
  const orderMeta = order
    ? [`Order #${order.orderNumber}`, order.address.city].filter(Boolean).join(' · ')
    : `Order #${orderId}`;

  return (
    <View style={styles.container}>
      <View style={styles.callInfo}>
        <Avatar initials={initialsFor(customerName)} size={80} />
        <Text style={styles.name}>{customerName}</Text>
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>Calling</Text>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <Text style={styles.orderText}>{orderMeta}</Text>
      </View>

      <View style={styles.messagesBlock}>
        <Text style={styles.messagesLabel}>Can't connect? Send a quick message:</Text>
        <View style={styles.messagesList}>
          {QUICK_MESSAGES.map(message => (
            <TouchableOpacity
              key={message}
              style={styles.messageChip}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('MessageCustomer', {orderId})}>
              <Text style={styles.messageChipText}>{message}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.sendMessageButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('MessageCustomer', {orderId})}>
          <Text style={styles.sendMessageText}>Send Message</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.controlButton} activeOpacity={0.8} onPress={() => setMuted(m => !m)}>
          <Icon name="mic-off" size={22} color={muted ? colors.danger : colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.hangupButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Icon name="phone-off" size={26} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} activeOpacity={0.8} onPress={() => setSpeakerOn(s => !s)}>
          <Icon name="volume-2" size={22} color={speakerOn ? colors.primary : colors.white} />
        </TouchableOpacity>
      </View>

      <Text style={styles.supportText}>Call not connecting? Contact Support</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.dark900, paddingTop: 80, paddingBottom: spacing.xxl},
  callInfo: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingHorizontal: spacing.xl},
  name: {...typography.h4, fontSize: 22, color: colors.white, marginTop: spacing.sm},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  statusText: {...typography.bodyLg, color: 'rgba(255,255,255,0.65)'},
  dot: {width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary},
  orderText: {...typography.label, color: 'rgba(255,255,255,0.5)', marginTop: spacing.xs},
  messagesBlock: {paddingHorizontal: spacing.xl, gap: spacing.sm},
  messagesLabel: {...typography.label, color: 'rgba(255,255,255,0.6)'},
  messagesList: {gap: spacing.sm},
  messageChip: {backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  messageChipText: {...typography.label, color: colors.white},
  sendMessageButton: {borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', borderRadius: radius.lg, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xs},
  sendMessageText: {...typography.bodySemibold, fontSize: 14, color: colors.white},
  controlsRow: {flexDirection: 'row', gap: spacing.xxl, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxl},
  controlButton: {width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center'},
  hangupButton: {width: 72, height: 72, borderRadius: 36, backgroundColor: '#D92D20', alignItems: 'center', justifyContent: 'center'},
  supportText: {...typography.label, color: 'rgba(255,255,255,0.45)', textAlign: 'center'},
});
