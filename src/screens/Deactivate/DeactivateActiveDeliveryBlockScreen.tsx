import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeactivateActiveDeliveryBlock'>;

const DELIVERY_ROWS = [
  {label: 'Order', value: '#VR-84821'},
  {label: 'Customer', value: 'Priya Mehta'},
  {label: 'Destination', value: 'HSR Layout'},
  {label: 'Status', value: 'In progress'},
];

export function DeactivateActiveDeliveryBlockScreen({navigation}: Props) {
  const completeDelivery = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Icon name="alert-triangle" size={28} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>You Have an Active Delivery</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.introText}>You cannot deactivate your account while a delivery is in progress. Please complete or cancel the delivery first.</Text>
        </View>

        <View style={styles.deliveryCard}>
          <Text style={styles.deliveryTitle}>Active Delivery</Text>
          {DELIVERY_ROWS.map(row => (
            <View key={row.label} style={styles.deliveryRow}>
              <Text style={styles.deliveryLabel}>{row.label}</Text>
              <Text style={styles.deliveryValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Options</Text>
          <View style={styles.optionRecommended}>
            <Icon name="check-circle" size={16} color={colors.primary} />
            <View>
              <Text style={styles.optionRecommendedTitle}>Complete the delivery first</Text>
              <Text style={styles.optionRecommendedSubtitle}>Recommended</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7} onPress={() => navigation.navigate('SupportHub')}>
            <Icon name="headphones" size={16} color={colors.textPrimary} />
            <Text style={styles.optionText}>Contact support to cancel delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow} activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <Icon name="clock" size={16} color={colors.textSecondary} />
            <Text style={styles.optionTextMuted}>Return to deactivation later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={completeDelivery}>
          <Text style={styles.primaryButtonText}>Complete Delivery</Text>
          <Icon name="arrow-right" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: colors.warning, alignItems: 'center', gap: spacing.sm, paddingTop: 44, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  heroIcon: {width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center'},
  heroTitle: {...typography.h4, fontSize: 20, color: colors.white, textAlign: 'center'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 120},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  introText: {...typography.body, fontSize: 14, color: colors.textSecondary, lineHeight: 22.4},
  deliveryCard: {backgroundColor: colors.warningSurface, borderWidth: 1.5, borderColor: colors.warning, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs},
  deliveryTitle: {...typography.bodyBold, fontSize: 14, color: '#92400E', marginBottom: spacing.xs},
  deliveryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3},
  deliveryLabel: {...typography.label, fontSize: 13, color: '#92400E'},
  deliveryValue: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  optionRecommended: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: '#A7E3CC', borderRadius: radius.sm, padding: spacing.md},
  optionRecommendedTitle: {...typography.bodySemibold, fontSize: 14, color: '#13845A'},
  optionRecommendedSubtitle: {...typography.caption, fontSize: 12, color: colors.primary, marginTop: 1},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: spacing.md},
  optionText: {...typography.body, fontSize: 14, color: colors.textPrimary},
  optionTextMuted: {...typography.body, fontSize: 14, color: colors.textSecondary},
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  primaryButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.md, height: 52},
  primaryButtonText: {...typography.bodyBold, fontSize: 16, color: colors.white},
});
