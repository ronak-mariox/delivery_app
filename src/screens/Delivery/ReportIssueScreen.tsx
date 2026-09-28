import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, IconName, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryIssueType, DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportIssue'>;

const DEDICATED_SCREENS: Partial<Record<DeliveryIssueType, 'WrongAddress' | 'VehicleProblem' | 'RoadBlockage' | 'SafetyConcern'>> = {
  wrong_address: 'WrongAddress',
  vehicle_problem: 'VehicleProblem',
  road_blockage: 'RoadBlockage',
  safety_concern: 'SafetyConcern',
};

const CATEGORIES: {type: DeliveryIssueType; label: string; subtitle: string; icon: IconName}[] = [
  {type: 'wrong_address', label: 'Wrong address', subtitle: 'Delivery location does not match the order', icon: 'map-pin'},
  {type: 'package_damage', label: 'Package damaged', subtitle: 'Item packaging is torn or broken', icon: 'package'},
  {type: 'vehicle_problem', label: 'Vehicle problem', subtitle: 'Flat tyre, breakdown, or accident', icon: 'alert-triangle'},
  {type: 'road_blockage', label: 'Road blockage', subtitle: 'Cannot reach the location by road', icon: 'navigation'},
  {type: 'safety_concern', label: 'Safety concern', subtitle: 'You feel unsafe continuing this delivery', icon: 'shield'},
  {type: 'delivery_failed', label: 'Other — cannot complete', subtitle: 'Any other reason this delivery cannot be finished', icon: 'x-circle'},
];

export function ReportIssueScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [selected, setSelected] = useState<DeliveryIssueType | null>(null);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId).then((o) => { if (!cancelled) {setOrder(o);} }).catch(() => {});
    return () => { cancelled = true; };
  }, [orderId, getOrder]);

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Report Delivery Issue</Text>
          <Text style={styles.headerSubtitle}>{`Order #${order?.orderNumber ?? orderId}`}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>What went wrong?</Text>
        {CATEGORIES.map((category) => {
          const active = selected === category.type;
          return (
            <TouchableOpacity
              key={category.type}
              style={[styles.optionRow, active && styles.optionRowActive]}
              activeOpacity={0.85}
              onPress={() => setSelected(category.type)}>
              <View style={[styles.optionIcon, active && styles.optionIconActive]}>
                <Icon name={category.icon} size={20} color={active ? colors.primary : colors.textSecondary} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{category.label}</Text>
                <Text style={styles.optionSubtitle}>{category.subtitle}</Text>
              </View>
              {active && <Icon name="check-circle" size={20} color={colors.primary} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Continue"
          disabled={!selected}
          onPress={() => {
            if (!selected) {
              return;
            }
            const dedicated = DEDICATED_SCREENS[selected];
            if (dedicated) {
              navigation.navigate(dedicated, {orderId});
            } else {
              navigation.navigate('UploadEvidence', {orderId, issueType: selected});
            }
          }}
        />
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.sm},
  sectionLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.xs},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  optionRowActive: {borderColor: colors.primary, backgroundColor: colors.primarySurface},
  optionIcon: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  optionIconActive: {backgroundColor: colors.white},
  optionText: {flex: 1},
  optionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  optionSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  footer: {padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
