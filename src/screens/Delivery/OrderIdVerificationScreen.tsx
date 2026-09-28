import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderIdVerification'>;

export function OrderIdVerificationScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [manualId, setManualId] = useState('');
  const [verified, setVerified] = useState(false);
  const [mismatch, setMismatch] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId)
      .then((o) => {
        if (!cancelled) {
          setOrder(o);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [orderId, getOrder]);

  const handleVerify = () => {
    const typed = manualId.replace(/[^a-z0-9]/gi, '').toUpperCase();
    const expected = (order?.orderNumber ?? '').replace(/[^a-z0-9]/gi, '').toUpperCase();
    const ok = !!expected && typed.length >= 4 && (typed === expected || expected.endsWith(typed));
    setVerified(ok);
    setMismatch(!ok);
  };

  const itemCount = order?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.scanArea}>
        <View style={styles.viewfinder}>
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>
        <Text style={styles.scanHint}>Match the order number printed on the order slip</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <Text style={styles.manualLabel}>Enter Order ID manually</Text>
        <View style={styles.manualRow}>
          <TextInput
            style={styles.manualInput}
            value={manualId}
            onChangeText={setManualId}
            placeholder="Last 4–6 characters of the order number"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="characters"
            onSubmitEditing={handleVerify}
          />
          <TouchableOpacity style={styles.verifyButton} activeOpacity={0.85} onPress={handleVerify} disabled={!order}>
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>

        {mismatch && <Text style={styles.mismatchText}>That doesn't match this order. Check the slip and try again.</Text>}

        {verified && (
          <View style={styles.verifiedCard}>
            <View style={styles.verifiedHeader}>
              <View style={styles.verifiedIcon}>
                <Icon name="check" size={18} color={colors.white} />
              </View>
              <Text style={styles.verifiedTitle}>Order ID Verified</Text>
            </View>
            <View style={styles.verifiedRow}>
              <Text style={styles.verifiedLabel}>Order ID</Text>
              <Text style={styles.verifiedValue}>#{order?.orderNumber ?? orderId}</Text>
            </View>
            <View style={styles.verifiedRow}>
              <Text style={styles.verifiedLabel}>Store</Text>
              <Text style={styles.verifiedValue}>{order?.pickup.name ?? '—'}</Text>
            </View>
            <View style={styles.verifiedRow}>
              <Text style={styles.verifiedLabel}>Items</Text>
              <Text style={styles.verifiedValue}>{itemCount}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Proceed to Collect"
          disabled={!verified}
          onPress={() => navigation.navigate('PackageDetails', {orderId})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mismatchText: {...typography.caption, color: colors.danger, marginTop: spacing.sm},
  scanArea: {backgroundColor: colors.dark900, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.huge},
  viewfinder: {width: 220, height: 220, backgroundColor: colors.dark800, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center'},
  corner: {position: 'absolute', width: 24, height: 24, borderColor: colors.white},
  cornerTL: {left: 0, top: 0, borderLeftWidth: 3, borderTopWidth: 3},
  cornerTR: {right: 0, top: 0, borderRightWidth: 3, borderTopWidth: 3},
  cornerBL: {left: 0, bottom: 0, borderLeftWidth: 3, borderBottomWidth: 3},
  cornerBR: {right: 0, bottom: 0, borderRightWidth: 3, borderBottomWidth: 3},
  scanLine: {position: 'absolute', left: 0, right: 0, top: '40%', height: 2, backgroundColor: colors.primary, opacity: 0.85},
  scanHint: {...typography.label, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xl},
  flex: {flex: 1},
  body: {padding: spacing.xl, gap: spacing.md},
  dividerRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  dividerLine: {flex: 1, height: 1, backgroundColor: colors.border},
  dividerText: {...typography.labelSemibold, color: colors.textSecondary},
  manualLabel: {...typography.labelSemibold, color: colors.textSecondary},
  manualRow: {flexDirection: 'row', gap: spacing.sm},
  manualInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    height: 48,
    ...typography.bodyLg,
    color: colors.textPrimary,
  },
  verifyButton: {backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.xl, alignItems: 'center', justifyContent: 'center'},
  verifyButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.white},
  verifiedCard: {backgroundColor: colors.successSurface, borderWidth: 1, borderColor: '#A7F3D0', borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  verifiedHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  verifiedIcon: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  verifiedTitle: {...typography.bodyLgMedium, fontSize: 15, color: colors.primary},
  verifiedRow: {flexDirection: 'row', justifyContent: 'space-between'},
  verifiedLabel: {...typography.label, color: colors.textSecondary},
  verifiedValue: {...typography.labelSemibold, color: colors.textPrimary},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
