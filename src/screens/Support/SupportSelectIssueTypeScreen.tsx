import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconName} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportSelectIssueType'>;

type CategoryRoute =
  | 'SupportDeliveryIssues'
  | 'SupportPaymentIssues'
  | 'SupportAccountIssues'
  | 'SupportDocumentIssues'
  | 'SupportVehicleIssues'
  | 'SupportOtherIssues';

const TYPES: {label: string; subtitle: string; icon: IconName; route: CategoryRoute}[] = [
  {label: 'Delivery Issue', subtitle: 'Problems during active delivery', icon: 'package', route: 'SupportDeliveryIssues'},
  {label: 'Payment / Earnings', subtitle: 'Payouts, bonuses, credits', icon: 'credit-card', route: 'SupportPaymentIssues'},
  {label: 'Account', subtitle: 'Login, profile, verification', icon: 'user', route: 'SupportAccountIssues'},
  {label: 'Documents', subtitle: 'Upload, rejection, expiry', icon: 'file-text', route: 'SupportDocumentIssues'},
  {label: 'Vehicle', subtitle: 'Vehicle verification, RC, insurance', icon: 'wrench', route: 'SupportVehicleIssues'},
  {label: 'Other', subtitle: 'Anything not listed above', icon: 'help-circle', route: 'SupportOtherIssues'},
];

export function SupportSelectIssueTypeScreen({navigation}: Props) {
  const [selected, setSelected] = useState<CategoryRoute | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Issue Type</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>What kind of issue are you experiencing?</Text>

        {TYPES.map(type => {
          const active = type.route === selected;
          return (
            <TouchableOpacity
              key={type.label}
              style={[styles.row, active && styles.rowActive]}
              activeOpacity={0.8}
              onPress={() => setSelected(type.route)}>
              <View style={styles.rowIcon}>
                <Icon name={type.icon} size={22} color={colors.textPrimary} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.rowTitle}>{type.label}</Text>
                <Text style={styles.rowSubtitle}>{type.subtitle}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.continueButton, !selected && styles.continueButtonDisabled]}
          activeOpacity={0.85}
          disabled={!selected}
          onPress={() => selected && navigation.navigate(selected)}>
          <Text style={styles.continueButtonText}>Continue →</Text>
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
  body: {padding: spacing.lg, gap: spacing.sm, paddingBottom: 120},
  intro: {...typography.label, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xs},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  rowActive: {borderColor: colors.primary},
  rowIcon: {width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center'},
  rowTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  rowSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
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
  continueButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  continueButtonDisabled: {backgroundColor: '#D1D5DB'},
  continueButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
});
