import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'WrongAddress'>;

export function WrongAddressScreen({route, navigation}: Props) {
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

  const customerName = order?.address.contactName ?? 'the customer';
  const addressLines = [order?.address.line1, order?.address.line2, order?.address.landmark].filter(Boolean).join(', ');

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="map-pin-off" size={30} color={colors.white} />
        </View>
      </View>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Wrong Address</Text>
        <Text style={styles.subtitle}>Delivery location does not match.</Text>
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>#{order?.orderNumber ?? orderId}</Text>
          </View>
          {!!order?.address.contactName && (
            <View style={styles.tag}>
              <Text style={styles.tagTextMuted}>{order.address.contactName}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!!addressLines && (
          <View style={styles.mismatchCard}>
            <Text style={styles.mismatchLabel}>ORDER ADDRESS</Text>
            <Text style={styles.mismatchFieldValue}>{addressLines}</Text>
          </View>
        )}

        <View style={styles.hintBanner}>
          <Text style={styles.hintText}>{`Ask ${customerName} for the correct address`}</Text>
        </View>

        <View style={styles.actionCard}>
          <View style={styles.actionRow}>
            <View style={styles.actionIcon}>
              <Icon name="phone" size={20} color={colors.primary} />
            </View>
            <Text style={styles.actionTitle}>Call customer for correct address</Text>
          </View>
          <Button label="Call Now" style={styles.callButton} onPress={() => navigation.navigate('CallCustomer', {orderId})} />
        </View>

        <View style={styles.smallActionCard}>
          <View style={styles.actionIconSmall}>
            <Icon name="map-pin" size={20} color={colors.textSecondary} />
          </View>
          <Text style={styles.smallActionTitle}>Update address in app</Text>
          <TouchableOpacity
            style={styles.smallActionButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('UpdateAddress', {orderId})}>
            <Text style={styles.smallActionButtonText}>Update Address</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.smallActionCard}>
          <View style={styles.actionIconSmall}>
            <Icon name="navigation" size={20} color={colors.textSecondary} />
          </View>
          <Text style={styles.smallActionTitleFlex}>Navigate to registered address</Text>
          <TouchableOpacity
            style={styles.smallActionButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('CustomerStartNavigation', {orderId})}>
            <Text style={styles.smallActionButtonText}>Navigate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('UpdateAddress', {orderId})}>
          <Text style={styles.footerLink}>Report Address Issue</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('IssueSupportContact', {orderId})}>
          <Text style={styles.footerSupportLink}>Support</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', height: 100},
  headerIcon: {width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center'},
  titleBlock: {alignItems: 'center', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.lg, gap: spacing.xs},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary},
  tagsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs},
  tag: {backgroundColor: colors.background, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4},
  tagText: {...typography.captionSemibold, color: colors.textPrimary},
  tagTextMuted: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  mismatchCard: {backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.dangerBorder, borderRadius: radius.lg, padding: spacing.md},
  mismatchLabel: {...typography.captionSemibold, fontSize: 12, color: colors.danger, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: spacing.sm},
  mismatchFieldValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  hintBanner: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.sm, padding: spacing.md},
  hintText: {...typography.label, color: colors.warningText},
  actionCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm},
  actionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  actionIcon: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  actionTitle: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary, flex: 1},
  callButton: {height: 43},
  smallActionCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  actionIconSmall: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  smallActionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, flex: 1},
  smallActionTitleFlex: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, flex: 1},
  smallActionButton: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  smallActionButtonText: {...typography.labelSemibold, fontSize: 13, color: colors.textLabel},
  footer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.xl, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  footerLink: {...typography.bodyMedium, color: colors.textSecondary},
  footerSupportLink: {...typography.bodySemibold, color: colors.primary, textDecorationLine: 'underline'},
});
