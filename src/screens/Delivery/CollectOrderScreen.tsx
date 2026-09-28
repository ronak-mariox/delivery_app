import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Card, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import QrCodeIcon from '../../assets/brand/qr-code.svg';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CollectOrder'>;

const STEPS = ['Scan QR or note Order ID', 'Hand over packed order', 'Rider confirms receipt'];

export function CollectOrderScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);

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

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Collect Order</Text>
        <Text style={styles.subtitle}>Show this screen to the store staff</Text>
      </View>

      <View style={styles.body}>
        <Card style={styles.qrCard}>
          <View style={styles.qrWrap}>
            <QrCodeIcon width={140} height={140} />
          </View>
          <Text style={styles.orderId}>#{order?.orderNumber ?? orderId}</Text>
          <Text style={styles.orderHint}>Scan to confirm handover</Text>
        </Card>

        <Card style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>INSTRUCTIONS FOR STORE STAFF</Text>
          {STEPS.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </Card>
      </View>

      <View style={styles.footer}>
        <Button
          label="I've Collected the Order"
          style={styles.collectButton}
          onPress={() => navigation.navigate('PickupConfirmation', {orderId})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.xxl, paddingBottom: spacing.xxxl, gap: spacing.xs},
  title: {...typography.h3, fontSize: 26, color: colors.white},
  subtitle: {...typography.body, color: 'rgba(255,255,255,0.85)'},
  body: {flex: 1, padding: spacing.lg, gap: spacing.lg},
  qrCard: {alignItems: 'center', gap: spacing.xs},
  qrWrap: {width: 180, height: 180, borderRadius: radius.sm, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  orderId: {...typography.title, fontSize: 18, color: colors.textPrimary},
  orderHint: {...typography.label, color: colors.textSecondary},
  stepsCard: {gap: spacing.md},
  stepsTitle: {...typography.labelSemibold, color: colors.textSecondary, letterSpacing: 0.4},
  stepRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  stepBadge: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  stepBadgeText: {...typography.captionSemibold, fontSize: 12, color: colors.primary},
  stepText: {...typography.body, color: colors.textPrimary},
  footer: {borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.md},
  collectButton: {height: 56},
});
