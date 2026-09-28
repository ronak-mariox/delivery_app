import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerContacted'>;

export function CustomerContactedScreen({route, navigation}: Props) {
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

  const customerName = order?.address.contactName ?? 'Customer';

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Icon name="check" size={36} color={colors.white} />
        <Text style={styles.headerTitle}>Customer Contacted!</Text>
        <Text style={styles.headerSubtitle}>{`${customerName} has been reached.`}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ORDER</Text>
          <View style={styles.statusRow}>
            <Icon name="package" size={14} color={colors.textSecondary} />
            <Text style={styles.statusText}>{`Order #${order?.orderNumber ?? orderId}`}</Text>
          </View>
          {!!order?.address.line1 && (
            <View style={styles.statusRow}>
              <Icon name="map-pin" size={14} color={colors.textSecondary} />
              <Text style={styles.statusText}>{order.address.line1}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Proceed to Deliver" onPress={() => navigation.navigate('DeliveryVerification', {orderId})} />
        <Button
          label="Contact Again"
          variant="secondary"
          icon="phone"
          onPress={() => navigation.navigate('CallingException', {orderId})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, alignItems: 'center', gap: spacing.xxs, paddingTop: spacing.xl, paddingBottom: spacing.xl},
  headerTitle: {...typography.title, fontSize: 18, color: colors.white, marginTop: spacing.xs},
  headerSubtitle: {...typography.label, color: 'rgba(255,255,255,0.85)'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  cardLabel: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: spacing.sm},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs},
  statusText: {...typography.label, color: colors.textSecondary},
  footer: {padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
