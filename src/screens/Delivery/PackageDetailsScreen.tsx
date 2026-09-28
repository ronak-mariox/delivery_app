import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PackageDetails'>;

export function PackageDetailsScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [condition, setCondition] = useState<'good' | 'damaged'>('good');

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

  const items = order?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirm = () => {
    if (condition === 'damaged') {
      navigation.navigate('SelectIssueReason', {orderId});
      return;
    }
    navigation.navigate('CollectOrder', {orderId});
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Package Details</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Icon name="package" size={28} color={colors.textSecondary} />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>
              {itemCount} Item{itemCount === 1 ? '' : 's'}
            </Text>
            <Text style={styles.summarySubtitle}>Order #{order?.orderNumber ?? orderId}</Text>
          </View>
        </View>

        <View style={styles.itemsCard}>
          <Text style={styles.cardLabel}>ITEMS</Text>
          {items.map((item, index) => (
            <View key={`${item.productId}-${item.variantId}`} style={[styles.itemRow, index > 0 && styles.itemRowBorder]}>
              <View style={styles.itemIcon}>
                <Icon name="package" size={20} color={colors.info} />
              </View>
              <View style={styles.itemText}>
                <Text style={styles.itemName}>{item.name}</Text>
                {!!item.variantLabel && <Text style={styles.itemPrice}>{item.variantLabel}</Text>}
              </View>
              <Text style={styles.itemQty}>{item.quantity}×</Text>
            </View>
          ))}
        </View>

        <View style={styles.conditionCard}>
          <Text style={styles.conditionTitle}>Package Condition</Text>
          <TouchableOpacity style={styles.conditionRow} activeOpacity={0.8} onPress={() => setCondition('good')}>
            <View style={[styles.radio, condition === 'good' && styles.radioSelected]}>
              {condition === 'good' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.conditionLabel}>Package looks good</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.conditionRow} activeOpacity={0.8} onPress={() => setCondition('damaged')}>
            <View style={[styles.radio, condition === 'damaged' && styles.radioSelected]}>
              {condition === 'damaged' && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.conditionLabel}>Package seems damaged</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Confirm Package Details" icon="arrow-right" iconPosition="right" onPress={handleConfirm} />
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
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  summaryCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  summaryIcon: {width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  summaryText: {flex: 1},
  summaryTitle: {...typography.bodyLgMedium, color: colors.textPrimary},
  summarySubtitle: {...typography.label, color: colors.textSecondary, marginTop: spacing.xxs},
  itemsCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.5, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  itemRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  itemRowBorder: {borderTopWidth: 1, borderTopColor: colors.border},
  itemIcon: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.infoSurface, alignItems: 'center', justifyContent: 'center'},
  itemText: {flex: 1},
  itemName: {...typography.bodyMedium, color: colors.textPrimary},
  itemPrice: {...typography.label, color: colors.textSecondary, marginTop: 2},
  itemQty: {...typography.bodyMedium, color: colors.textSecondary},
  conditionCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md},
  conditionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  conditionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  radio: {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.primary},
  radioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  conditionLabel: {...typography.body, color: colors.textPrimary},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
