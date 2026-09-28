import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerUnavailable'>;

export function CustomerUnavailableScreen({route, navigation}: Props) {
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
          <Icon name="user" size={32} color={colors.textSecondary} />
        </View>
      </View>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Customer Unavailable</Text>
        <Text style={styles.subtitle}>{customerName} is not responding</Text>
      </View>
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

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.optionCard}>
          <View style={styles.optionRow}>
            <View style={styles.optionIconGreen}>
              <Icon name="phone" size={24} color={colors.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Call Customer</Text>
              <Text style={styles.optionSubtitle}>Try reaching them directly</Text>
            </View>
          </View>
          <Button
            label={`Call ${customerName}`}
            style={styles.callButton}
            onPress={() => navigation.navigate('CallingException', {orderId})}
          />
        </View>

        <View style={[styles.optionCard, styles.optionCardWarning]}>
          <View style={styles.optionRow}>
            <View style={styles.optionIconWarning}>
              <Icon name="clock" size={24} color={colors.warning} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Wait 5 Minutes</Text>
              <Text style={styles.optionSubtitle}>Give them time to respond</Text>
            </View>
          </View>
          <Button
            label="Start Timer"
            variant="outline"
            style={styles.timerButton}
            textColor={colors.warning}
            onPress={() => navigation.navigate('WaitingForCustomer', {orderId})}
          />
        </View>

        <View style={styles.optionCard}>
          <View style={styles.optionRow}>
            <View style={styles.optionIconNeutral}>
              <Icon name="message-circle" size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Send Message</Text>
              <Text style={styles.optionSubtitle}>Send a quick text</Text>
            </View>
          </View>
          <Button
            label="Send Message"
            variant="secondary"
            style={styles.messageButton}
            onPress={() => navigation.navigate('MessageCustomer', {orderId})}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Report Unavailable"
          variant="secondary"
          fullWidth={false}
          style={styles.reportButton}
          onPress={() => navigation.navigate('CannotLocateCustomer', {orderId})}
        />
        <TouchableOpacity onPress={() => navigation.navigate('CannotLocateCustomer', {orderId})}>
          <Text style={styles.supportLink}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    backgroundColor: colors.warning,
  },
  headerIcon: {width: 56, height: 56, borderRadius: 28, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  titleBlock: {alignItems: 'center', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.lg},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.xxs},
  tagsRow: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.xl, paddingVertical: spacing.md},
  tag: {backgroundColor: colors.background, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4},
  tagText: {...typography.captionSemibold, color: colors.textPrimary},
  tagTextMuted: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.xl, gap: spacing.md},
  optionCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md},
  optionCardWarning: {borderColor: colors.warning},
  optionRow: {flexDirection: 'row', gap: spacing.md},
  optionIconGreen: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  optionIconWarning: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.warningSurface, alignItems: 'center', justifyContent: 'center'},
  optionIconNeutral: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  optionText: {flex: 1},
  optionTitle: {...typography.bodyLgMedium, color: colors.textPrimary},
  optionSubtitle: {...typography.label, color: colors.textSecondary, marginTop: 1},
  callButton: {height: 41},
  timerButton: {height: 44, borderColor: colors.warning},
  messageButton: {height: 44},
  footer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.xl, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  reportButton: {},
  supportLink: {...typography.bodySemibold, fontSize: 14, color: colors.primary, textDecorationLine: 'underline'},
});
