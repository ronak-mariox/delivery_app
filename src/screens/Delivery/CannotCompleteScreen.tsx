import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'CannotComplete'>;

export function CannotCompleteScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder, reportIssue} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId).then((o) => { if (!cancelled) {setOrder(o);} }).catch(() => {});
    return () => { cancelled = true; };
  }, [orderId, getOrder]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const result = await reportIssue(orderId, {type: 'delivery_failed', description: 'Delivery could not be completed'});
      navigation.navigate('DeliveryFailed', {orderId, order: result.order});
    } catch (err) {
      Alert.alert('Could Not Report', getApiErrorMessage(err, 'Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} tone="dark" />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Cannot Complete Delivery</Text>
          <Text style={styles.headerSubtitle}>{`Order #${order?.orderNumber ?? orderId}${order?.address.contactName ? ` · ${order.address.contactName}` : ''}`}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.optionCard}>
          <View style={styles.optionRow}>
            <View style={styles.optionIcon}>
              <Icon name="store" size={20} color={colors.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Return to store</Text>
              <Text style={styles.optionSubtitle}>Take the order back to the vendor</Text>
            </View>
          </View>
          <Button label="Return to store" onPress={() => navigation.navigate('ReturnOrder', {orderId})} />
        </View>

        <View style={styles.optionCard}>
          <View style={styles.optionRow}>
            <View style={styles.optionIcon}>
              <Icon name="map-pin" size={20} color={colors.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Safe drop at location</Text>
              <Text style={styles.optionSubtitle}>Leave the order at a safe spot, if allowed</Text>
            </View>
          </View>
          <Button label="Safe drop (enter OTP)" variant="secondary" onPress={() => navigation.navigate('OtpEntry', {orderId})} />
        </View>

        <View style={styles.optionCard}>
          <View style={styles.optionRow}>
            <View style={styles.optionIcon}>
              <Icon name="headphones" size={20} color={colors.primary} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Escalate — Support takes over</Text>
              <Text style={styles.optionSubtitle}>Report a different issue for this order</Text>
            </View>
          </View>
          <Button label="Escalate to support" variant="secondary" onPress={() => navigation.navigate('ReportIssue', {orderId})} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={submitting ? 'Reporting…' : 'Confirm Cannot Complete'}
          style={styles.dangerButton}
          disabled={submitting}
          onPress={handleConfirm}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.danger, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg},
  headerText: {flex: 1},
  headerTitle: {...typography.title, fontSize: 17, color: colors.white},
  headerSubtitle: {...typography.caption, color: 'rgba(255,255,255,0.85)'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  optionCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  optionIcon: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  optionText: {flex: 1},
  optionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  optionSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  dangerButton: {backgroundColor: colors.danger},
});
