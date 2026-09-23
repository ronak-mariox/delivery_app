import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'WaitingForCustomer'>;

const START_SECONDS = 5 * 60;
const RING_SIZE = 168;
const STROKE_WIDTH = 8;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function WaitingForCustomerScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS);

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

  useEffect(() => {
    if (secondsLeft <= 0) {return;}
    const timer = setTimeout(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const progress = 1 - secondsLeft / START_SECONDS;
  const customerName = order?.address.contactName ?? 'Customer';
  const addressLine = order?.address.line1;
  const addressSubtitle = order ? [order.address.line2, order.address.city].filter(Boolean).join(', ') : null;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>WAITING FOR CUSTOMER</Text>
        <View style={styles.timerWrap}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} stroke={colors.border} strokeWidth={STROKE_WIDTH} fill="none" />
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              stroke={colors.warning}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
              rotation={-90}
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>
          <View style={styles.timerLabel}>
            <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
            <Text style={styles.timerSubtext}>remaining</Text>
          </View>
        </View>
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>#{order?.orderNumber ?? orderId}</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagTextMuted}>{customerName}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!!addressLine && (
          <View style={styles.locationCard}>
            <Text style={styles.cardLabel}>LOCATION</Text>
            <View style={styles.locationRow}>
              <Icon name="map-pin" size={14} color={colors.textSecondary} />
              <View>
                <Text style={styles.locationTitle}>{addressLine}</Text>
                {!!addressSubtitle && <Text style={styles.locationSubtitle}>{addressSubtitle}</Text>}
              </View>
            </View>
          </View>
        )}

        <Text style={styles.sectionLabel}>Actions while waiting</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('CallingException', {orderId})}>
            <Icon name="phone" size={20} color={colors.textLabel} />
            <Text style={styles.actionLabel}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MessageCustomer', {orderId})}>
            <Icon name="message-circle" size={20} color={colors.textLabel} />
            <Text style={styles.actionLabel}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
            <Icon name="navigation" size={20} color={colors.textLabel} />
            <Text style={styles.actionLabel}>Navigate Back</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.primaryOption}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('DeliveryVerification', {orderId})}>
          <Text style={styles.primaryOptionTitle}>Customer arrived — Proceed to deliver</Text>
          <Text style={styles.primaryOptionSubtitle}>Tap when customer is here</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryOption}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NoResponse', {orderId})}>
          <Text style={styles.secondaryOptionTitle}>Customer still unavailable — Next steps</Text>
          <Text style={styles.secondaryOptionSubtitle}>View escalation options</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('NoResponse', {orderId})}>
          <Text style={styles.expiredLink}>Timer expired? View options →</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {alignItems: 'center', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingTop: spacing.xxl, paddingBottom: spacing.lg, gap: spacing.md},
  headerLabel: {...typography.captionMedium, fontSize: 13, color: colors.textSecondary, letterSpacing: 0.78, textTransform: 'uppercase'},
  timerWrap: {width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center'},
  timerLabel: {position: 'absolute', alignItems: 'center'},
  timerText: {...typography.h2, fontSize: 34, color: colors.textPrimary, letterSpacing: -1},
  timerSubtext: {...typography.caption, color: colors.textSecondary},
  tagsRow: {flexDirection: 'row', gap: spacing.sm},
  tag: {backgroundColor: colors.background, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4},
  tagText: {...typography.captionSemibold, color: colors.textPrimary},
  tagTextMuted: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  locationCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  cardLabel: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: spacing.sm},
  locationRow: {flexDirection: 'row', gap: spacing.sm},
  locationTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  locationSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  sectionLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  actionsRow: {flexDirection: 'row', gap: spacing.sm},
  actionButton: {flex: 1, alignItems: 'center', gap: 6, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.md},
  actionLabel: {...typography.captionMedium, fontSize: 12, color: colors.textLabel},
  primaryOption: {backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.lg},
  primaryOptionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.white},
  primaryOptionSubtitle: {...typography.caption, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2},
  secondaryOption: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.lg},
  secondaryOptionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  secondaryOptionSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  expiredLink: {...typography.label, fontSize: 13, color: colors.primary, textDecorationLine: 'underline'},
});
