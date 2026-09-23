import React, {useState} from 'react';
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountNotificationSettings'>;

type ToggleGroup = {title: string; items: {key: string; label: string; defaultOn: boolean}[]};

const GROUPS: ToggleGroup[] = [
  {
    title: 'Delivery',
    items: [
      {key: 'new_delivery_requests', label: 'New delivery requests', defaultOn: true},
      {key: 'order_updates', label: 'Order updates', defaultOn: true},
      {key: 'pickup_ready', label: 'Pickup ready', defaultOn: true},
      {key: 'customer_messages', label: 'Customer messages', defaultOn: true},
    ],
  },
  {
    title: 'Earnings',
    items: [
      {key: 'payouts_credited', label: 'Payouts credited', defaultOn: true},
      {key: 'earnings_summary', label: 'Earnings summary', defaultOn: true},
      {key: 'bonus_earned', label: 'Bonus earned', defaultOn: true},
    ],
  },
  {
    title: 'Account',
    items: [
      {key: 'document_expiry_alerts', label: 'Document expiry alerts', defaultOn: true},
      {key: 'security_alerts', label: 'Security alerts', defaultOn: true},
      {key: 'account_updates', label: 'Account updates', defaultOn: false},
    ],
  },
  {
    title: 'Promotions',
    items: [
      {key: 'incentive_alerts', label: 'Incentive alerts', defaultOn: true},
      {key: 'app_updates', label: 'App updates', defaultOn: false},
      {key: 'surveys', label: 'Surveys', defaultOn: false},
    ],
  },
];

export function AccountNotificationSettingsScreen({navigation}: Props) {
  const [values, setValues] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    GROUPS.forEach(group => group.items.forEach(item => (initial[item.key] = item.defaultOn)));
    return initial;
  });

  const toggle = (key: string) => setValues(prev => ({...prev, [key]: !prev[key]}));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {GROUPS.map(group => (
          <View key={group.title}>
            <Text style={styles.groupTitle}>{group.title.toUpperCase()}</Text>
            <View style={styles.card}>
              {group.items.map((item, index) => (
                <View key={item.key} style={[styles.row, index < group.items.length - 1 && styles.rowBorder]}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Switch
                    value={values[item.key]}
                    onValueChange={() => toggle(item.key)}
                    trackColor={{false: colors.border, true: colors.primary}}
                    thumbColor={colors.white}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 18, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.lg, paddingBottom: 120},
  groupTitle: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.8, marginBottom: spacing.sm},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowLabel: {...typography.body, fontSize: 14, color: colors.textPrimary},
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
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
});
