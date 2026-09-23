import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'MissingItemReported'>;

export function MissingItemReportedScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId).then((o) => { if (!cancelled) setOrder(o); }).catch(() => {});
    return () => { cancelled = true; };
  }, [orderId, getOrder]);

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Missing Item</Text>
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
          <Icon name="info" size={16} color={colors.warningText} />
          <Text style={styles.hintText}>
            Check the checklist above against what's in the bag. If something the customer ordered is missing, report it
            to support — do not guess or improvise a substitute.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Deliver remaining items" onPress={() => navigation.goBack()} />
        <Button label="Report missing item to support" variant="secondary" onPress={() => navigation.navigate('ReportIssue', {orderId})} />
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
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
