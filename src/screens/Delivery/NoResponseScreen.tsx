import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'NoResponse'>;

export function NoResponseScreen({route, navigation}: Props) {
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
        <Icon name="phone" size={28} color={colors.textSecondary} />
        <Text style={styles.title}>No Response</Text>
        <Text style={styles.subtitle}>{`${customerName} did not answer.`}</Text>
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
        <Text style={styles.sectionLabel}>What to do now</Text>

        <TouchableOpacity
          style={styles.optionRow}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('MessageCustomer', {orderId})}>
          <View style={styles.optionIconGreen}>
            <Icon name="message-circle" size={20} color={colors.primary} />
          </View>
          <Text style={styles.optionTitle}>Send a message</Text>
          <View style={styles.recommendedTag}>
            <Text style={styles.recommendedTagText}>Recommended</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, styles.optionRowWarning]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('WaitingForCustomer', {orderId})}>
          <View style={styles.optionIconNeutral}>
            <Icon name="clock" size={20} color={colors.warning} />
          </View>
          <Text style={styles.optionTitleWarning}>Wait at location (5 min)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionRow}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('OtpEntry', {orderId})}>
          <View style={styles.optionIconNeutral}>
            <Icon name="home" size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.optionTextCol}>
            <Text style={styles.optionTitle}>Leave at door</Text>
            <Text style={styles.optionSubtitle}>Only if delivery instructions allow</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionRow, styles.optionRowDanger]}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('CannotLocateCustomer', {orderId})}>
          <View style={styles.optionIconNeutral}>
            <Icon name="alert-circle" size={20} color={colors.danger} />
          </View>
          <Text style={styles.optionTitleDanger}>Report & Escalate</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {alignItems: 'center', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingTop: spacing.xxl, paddingBottom: spacing.lg, gap: spacing.xs},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary},
  tagsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs},
  tag: {backgroundColor: colors.background, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4},
  tagText: {...typography.captionSemibold, color: colors.textPrimary},
  tagTextMuted: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.sm},
  sectionLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  optionRowWarning: {borderWidth: 1.5, borderColor: colors.warning},
  optionRowDanger: {borderWidth: 1.5, borderColor: colors.dangerBorder},
  optionIconGreen: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  optionIconNeutral: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  optionTextCol: {flex: 1},
  optionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, flex: 1},
  optionTitleWarning: {...typography.bodySemibold, fontSize: 14, color: colors.warning, flex: 1},
  optionTitleDanger: {...typography.bodySemibold, fontSize: 14, color: colors.danger, flex: 1},
  optionSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  recommendedTag: {backgroundColor: colors.primarySurface, borderRadius: 4, paddingHorizontal: spacing.xs, paddingVertical: 2},
  recommendedTagText: {...typography.captionSemibold, fontSize: 11, color: colors.primary},
});
