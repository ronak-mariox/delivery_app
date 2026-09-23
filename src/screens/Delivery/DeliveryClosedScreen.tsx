import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryClosed'>;

export function DeliveryClosedScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const goHome = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  return (
    <Screen edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconRing}>
          <Icon name="check" size={36} color={colors.textSecondary} />
        </View>
        <Text style={styles.title}>Delivery Closed</Text>
        <Text style={styles.subtitle}>Issue #ISS-29847 resolved.</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order</Text>
            <Text style={styles.rowValue}>#{orderId} — Closed</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Outcome</Text>
            <Text style={styles.rowValue}>Undeliverable · Reassigned</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Your earnings</Text>
            <Text style={styles.rowValueGreen}>₹40 — Credited tonight</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Time</Text>
            <Text style={styles.rowValue}>3:16 PM</Text>
          </View>
        </View>

        <View style={styles.onlineBanner}>
          <View style={styles.onlineHeader}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineTitle}>You are back online</Text>
          </View>
          <Text style={styles.onlineText}>You are back online and available for orders. New orders will appear automatically.</Text>
        </View>

        <Text style={styles.footnote}>Your performance score was not affected.</Text>
      </View>

      <View style={styles.footer}>
        <Button label="Return to Dashboard" icon="arrow-right" iconPosition="right" onPress={goHome} />
        <TouchableOpacity onPress={goHome}>
          <Text style={styles.reportLink}>View Full Report</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  body: {flex: 1, alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.huge, gap: spacing.lg},
  iconRing: {width: 80, height: 80, borderRadius: 40, backgroundColor: colors.background, borderWidth: 3, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h2, fontSize: 26, color: colors.textPrimary},
  subtitle: {...typography.bodyLg, color: colors.textSecondary, marginTop: -spacing.md},
  card: {width: '100%', backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  rowLabel: {...typography.body, color: colors.textSecondary},
  rowValue: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  rowValueGreen: {...typography.bodyBold, fontSize: 14, color: colors.primary},
  divider: {height: 1, backgroundColor: colors.border, marginVertical: spacing.xs},
  onlineBanner: {width: '100%', backgroundColor: colors.primarySurfaceAlt, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.xl, padding: spacing.xl},
  onlineHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  onlineDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  onlineTitle: {...typography.bodyBold, fontSize: 15, color: colors.primaryDark},
  onlineText: {...typography.label, color: colors.textSecondary, marginTop: spacing.sm},
  footnote: {...typography.body, color: colors.textSecondary, textAlign: 'center'},
  footer: {padding: spacing.xl, gap: spacing.md, alignItems: 'center'},
  reportLink: {...typography.body, color: colors.textSecondary, textDecorationLine: 'underline'},
});
