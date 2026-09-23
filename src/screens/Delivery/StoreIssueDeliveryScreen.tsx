import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton, Loader, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'StoreIssueDelivery'>;

export function StoreIssueDeliveryScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getOrder(orderId)
      .then(o => { if (!cancelled) setOrder(o); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [orderId, getOrder]);

  const subtitle = order
    ? [`Order #${order.orderNumber}`, order.address.contactName, order.address.city].filter(Boolean).join(' · ')
    : `Order #${orderId}`;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Store Issue — Delivery</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>

      {loading && <Loader label="Loading…" fullscreen />}

      {!loading && (
      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>ISSUE SUMMARY</Text>
          <Text style={styles.summaryStore}>{order?.pickup.name ?? 'Store'}</Text>
          <Text style={styles.summaryText}>Review the order before proceeding</Text>
        </View>

        <Text style={styles.sectionLabel}>Your Options</Text>

        <TouchableOpacity style={[styles.optionRow, styles.optionRowPrimary]} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <View style={styles.optionIconGreen}>
            <Icon name="check" size={20} color={colors.primary} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitlePrimary}>Order looks fine — Proceed to deliver</Text>
            <Text style={styles.optionSubtitle}>No visible issues with the order</Text>
          </View>
          <View style={styles.recommendedTag}>
            <Text style={styles.recommendedTagText}>Recommended</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionRow} activeOpacity={0.85} onPress={() => navigation.navigate('PackageIssue', {orderId})}>
          <View style={styles.optionIconNeutral}>
            <Icon name="camera" size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Document the issue — Photo upload</Text>
            <Text style={styles.optionSubtitle}>Take photos before proceeding</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('PickupSupport', {orderId})}>
          <View style={styles.optionIconNeutral}>
            <Icon name="alert-circle" size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitle}>Report to support for review</Text>
            <Text style={styles.optionSubtitle}>Get guidance from the team</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, styles.optionRowDanger]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NavigateToStore', {orderId})}>
          <View style={styles.optionIconDanger}>
            <Icon name="refresh" size={20} color={colors.danger} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitleDanger}>Return order to store</Text>
            <Text style={styles.optionSubtitle}>If issue cannot be resolved</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>
            Riders are not responsible for item quality. Document and report any issues to protect yourself from liability.
          </Text>
        </View>
      </ScrollView>
      )}
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
  summaryCard: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.lg, padding: spacing.md},
  summaryLabel: {...typography.captionSemibold, fontSize: 12, color: colors.warningText, letterSpacing: 0.6, textTransform: 'uppercase'},
  summaryStore: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginTop: spacing.sm},
  summaryText: {...typography.label, fontSize: 13, color: colors.textLabel, marginTop: 2},
  sectionLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  optionRowPrimary: {borderColor: colors.primary},
  optionRowDanger: {borderColor: colors.dangerBorder},
  optionIconGreen: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  optionIconNeutral: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  optionIconDanger: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.dangerSurface, alignItems: 'center', justifyContent: 'center'},
  optionText: {flex: 1},
  optionTitlePrimary: {...typography.bodySemibold, fontSize: 14, color: colors.primary},
  optionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  optionTitleDanger: {...typography.bodySemibold, fontSize: 14, color: colors.danger},
  optionSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  recommendedTag: {backgroundColor: colors.primarySurface, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2},
  recommendedTagText: {...typography.captionSemibold, fontSize: 10, color: colors.primary},
  noteBanner: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.caption, fontSize: 12, color: colors.textSecondary},
});
