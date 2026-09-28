import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CannotLocateCustomer'>;

export function CannotLocateCustomerScreen({route, navigation}: Props) {
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
        <View style={styles.headerIcon}>
          <Icon name="user" size={30} color={colors.white} />
        </View>
      </View>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Cannot Locate Customer</Text>
        <Text style={styles.subtitle}>{`${customerName} is not at the given address.`}</Text>
        <View style={styles.tagsRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>#{order?.orderNumber ?? orderId}</Text>
          </View>
          {!!order?.address.city && (
            <View style={styles.tag}>
              <Text style={styles.tagTextMuted}>{order.address.city}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.optionCard, styles.optionCardPrimary]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('RetryDelivery', {orderId})}>
          <View style={styles.optionIconGreen}>
            <Icon name="refresh" size={20} color={colors.primary} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.optionTitlePrimary}>Retry contact via support</Text>
            <Text style={styles.optionSubtitle}>Support will call customer</Text>
            <View style={styles.recommendedTag}>
              <Text style={styles.recommendedTagText}>Recommended</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('OtpEntry', {orderId})}>
          <View style={styles.optionIconNeutral}>
            <Icon name="package" size={20} color={colors.textSecondary} />
          </View>
          <Text style={styles.optionTitleMuted}>Safe drop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, styles.optionCardDanger]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('CannotComplete', {orderId})}>
          <View style={styles.optionIconDanger}>
            <Icon name="x" size={20} color={colors.danger} />
          </View>
          <Text style={styles.optionTitleDanger}>Cannot complete delivery</Text>
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Escalate to Support"
          style={styles.escalateButton}
          fullWidth={false}
          onPress={() => navigation.navigate('ReportIssue', {orderId})}
        />
        <Button
          label="Return Order"
          variant="secondary"
          style={styles.returnButton}
          fullWidth={false}
          textColor={colors.danger}
          onPress={() => navigation.navigate('ReturnOrder', {orderId})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.warning, alignItems: 'center', justifyContent: 'center', height: 100},
  headerIcon: {width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center'},
  titleBlock: {alignItems: 'center', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.lg, gap: spacing.xs},
  title: {...typography.h4, fontSize: 20, color: colors.textPrimary},
  subtitle: {...typography.label, fontSize: 13, color: colors.textSecondary},
  tagsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs},
  tag: {backgroundColor: colors.background, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4},
  tagText: {...typography.captionSemibold, color: colors.textPrimary},
  tagTextMuted: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  optionCard: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  optionCardPrimary: {borderColor: colors.primary},
  optionCardDanger: {borderColor: colors.dangerBorder},
  optionIconGreen: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  optionIconNeutral: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  optionIconDanger: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.dangerSurface, alignItems: 'center', justifyContent: 'center'},
  optionText: {flex: 1},
  optionTitlePrimary: {...typography.bodySemibold, fontSize: 14, color: colors.primary},
  optionTitleMuted: {...typography.bodySemibold, fontSize: 14, color: colors.textSecondary, flex: 1, alignSelf: 'center'},
  optionTitleDanger: {...typography.bodySemibold, fontSize: 14, color: colors.danger, flex: 1, alignSelf: 'center'},
  optionSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  recommendedTag: {alignSelf: 'flex-start', backgroundColor: colors.primarySurface, borderRadius: 4, paddingHorizontal: spacing.xs, paddingVertical: 2, marginTop: spacing.xs},
  recommendedTagText: {...typography.captionSemibold, fontSize: 11, color: colors.primary},
  noteBanner: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.caption, fontSize: 12, color: colors.warningText},
  footer: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  escalateButton: {flex: 2},
  returnButton: {flex: 1, borderColor: colors.dangerBorder},
});
