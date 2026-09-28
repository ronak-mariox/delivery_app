import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'RoadBlockage'>;

export function RoadBlockageScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder, reportIssue} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId).then((o) => { if (!cancelled) {setOrder(o);} }).catch(() => {});
    return () => { cancelled = true; };
  }, [orderId, getOrder]);

  const addressLine = [order?.address.line1, order?.address.line2].filter(Boolean).join(', ');

  const handleReport = async () => {
    setSubmitting(true);
    try {
      await reportIssue(orderId, {type: 'road_blockage'});
      Alert.alert(
        'Reported',
        'This order has been unassigned from you and will be reassigned to another delivery partner.',
        [{text: 'OK', onPress: () => navigation.reset({index: 0, routes: [{name: 'Home'}]})}],
      );
    } catch (err) {
      Alert.alert('Could Not Report', getApiErrorMessage(err, 'Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Icon name="alert-triangle" size={44} color={colors.white} />
        <Text style={styles.headerTitle}>Road Blockage</Text>
        <Text style={styles.headerSubtitle}>Unable to reach delivery location.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ORDER</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order</Text>
            <Text style={styles.rowValue}>{`#${order?.orderNumber ?? orderId}`}</Text>
          </View>
          {!!addressLine && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Destination</Text>
              <Text style={styles.rowValue}>{addressLine}</Text>
            </View>
          )}
        </View>

        <Text style={styles.fallbackLabel}>If you cannot reach the location</Text>
        <Button label={submitting ? 'Reporting…' : 'Report Road Blockage'} disabled={submitting} onPress={handleReport} />
        <Button
          label="Escalate to Support"
          variant="secondary"
          disabled={submitting}
          onPress={() => navigation.navigate('IssueSupportContact', {orderId, order: order ?? undefined})}
        />

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>
            Reporting a road blockage will <Text style={styles.noteBold}>unassign this order from you</Text> so it can be reassigned.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.warning, alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  headerTitle: {...typography.h4, fontSize: 22, color: colors.white},
  headerSubtitle: {...typography.body, color: colors.warningSurface, textAlign: 'center'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  cardLabel: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xxs},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, color: colors.textPrimary},
  fallbackLabel: {...typography.label, color: colors.textSecondary, textAlign: 'center'},
  noteBanner: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.label, fontSize: 13, color: colors.textSecondary, textAlign: 'center'},
  noteBold: {fontWeight: '700', color: colors.textPrimary},
});
