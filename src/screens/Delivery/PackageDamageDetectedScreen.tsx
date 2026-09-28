import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'PackageDamageDetected'>;

export function PackageDamageDetectedScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder, reportIssue} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId).then((o) => { if (!cancelled) {setOrder(o);} }).catch(() => {});
    return () => { cancelled = true; };
  }, [orderId, getOrder]);

  const handleReport = async () => {
    setSubmitting(true);
    try {
      await reportIssue(orderId, {type: 'package_damage', description: 'Package damage noticed before handover'});
      Alert.alert('Reported', 'This has been logged on the order. You can continue with the delivery.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (err) {
      Alert.alert('Could Not Report', getApiErrorMessage(err, 'Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Package Damage Detected</Text>
          <Text style={styles.headerSubtitle}>{`Order #${order?.orderNumber ?? orderId}`}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!!order?.items.length && (
          <View style={styles.itemsCard}>
            <Text style={styles.itemsLabel}>ORDER ITEMS</Text>
            {order.items.map((item) => (
              <View key={item.productId + item.variantId} style={styles.itemRow}>
                <Text style={styles.itemName}>{`${item.name} × ${item.quantity}`}</Text>
                <Text style={styles.itemPrice}>{`₹${item.subtotal}`}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.hintBanner}>
          <Icon name="alert-triangle" size={16} color={colors.warningText} />
          <Text style={styles.hintText}>
            Reporting package damage keeps the order with you — it will not be unassigned. Use this before handover so
            support has a record.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label={submitting ? 'Reporting…' : 'Report and continue delivery'} disabled={submitting} onPress={handleReport} />
        <Button
          label="Contact support — customer may refuse"
          variant="secondary"
          disabled={submitting}
          onPress={() => navigation.navigate('IssueSupportContact', {orderId, order: order ?? undefined})}
        />
        <Button
          label="Return order if damage is severe"
          variant="secondary"
          disabled={submitting}
          onPress={() => navigation.navigate('NavigateToStore', {orderId})}
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
  headerText: {flex: 1},
  headerTitle: {...typography.title, fontSize: 16, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  itemsCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, gap: spacing.xs},
  itemsLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.xs},
  itemRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xxs},
  itemName: {...typography.label, color: colors.textPrimary, flex: 1, marginRight: spacing.sm},
  itemPrice: {...typography.labelSemibold, color: colors.textPrimary},
  hintBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.sm, padding: spacing.md},
  hintText: {...typography.label, color: colors.warningText, flex: 1},
  footer: {padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
