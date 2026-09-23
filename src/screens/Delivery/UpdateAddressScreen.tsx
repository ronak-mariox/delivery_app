import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'UpdateAddress'>;

export function UpdateAddressScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder, reportIssue} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
  const onFileAddress = [order?.address.line1, order?.address.line2, order?.address.landmark]
    .filter(Boolean)
    .join(', ');

  const handleConfirm = async () => {
    if (!address.trim()) {
      Alert.alert('Enter Address', 'Please enter the correct delivery address.');
      return;
    }
    setSubmitting(true);
    try {
      await reportIssue(orderId, {type: 'wrong_address', description: address.trim()});
      Alert.alert('Reported', 'The corrected address has been sent to support. Continue the delivery.');
      navigation.navigate('NearCustomer', {orderId});
    } catch (err) {
      Alert.alert('Could Not Report', getApiErrorMessage(err, 'Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']} keyboardAvoiding>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Update Delivery Address</Text>
          <Text style={styles.headerSubtitle}>{`Order #${order?.orderNumber ?? orderId} · ${customerName}`}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!!onFileAddress && (
          <View style={styles.onFileCard}>
            <Text style={styles.onFileLabel}>ADDRESS ON FILE</Text>
            <Text style={styles.onFileText}>{onFileAddress}</Text>
          </View>
        )}

        <Text style={styles.fieldLabel}>Correct Address</Text>
        <TextInput
          style={styles.addressInput}
          value={address}
          onChangeText={setAddress}
          multiline
          textAlignVertical="top"
          placeholder="Enter the correct delivery address as told by the customer"
          placeholderTextColor={colors.textMuted}
        />

        <View style={styles.hintBanner}>
          <Text style={styles.hintText}>
            This sends the corrected address to support so the order can be updated. It does not change your
            current delivery route automatically.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label={submitting ? 'Reporting…' : 'Report Correct Address'} disabled={submitting} onPress={handleConfirm} />
        <Button label="Cancel" variant="secondary" onPress={() => navigation.goBack()} />
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
  onFileCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  onFileLabel: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 0.55, textTransform: 'uppercase'},
  onFileText: {...typography.body, color: colors.textPrimary, marginTop: spacing.xs},
  fieldLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  addressInput: {
    height: 96,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    marginTop: -spacing.sm,
  },
  hintBanner: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.sm, padding: spacing.md},
  hintText: {...typography.label, color: colors.warningText},
  footer: {padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
