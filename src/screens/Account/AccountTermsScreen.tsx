import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountTerms'>;

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using the Verdant Rider platform, you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use of the platform immediately.',
  },
  {
    title: '2. Rider Eligibility',
    body: 'You must be at least 18 years of age, hold a valid driving license, and have a registered vehicle to operate as a rider on the Verdant platform. All documents must be verified before onboarding.',
  },
  {
    title: '3. Delivery Standards',
    body: 'Riders are expected to maintain a minimum acceptance rate and handle deliveries with care. Repeated violations of delivery standards may result in temporary or permanent account suspension.',
  },
  {
    title: '4. Earnings & Payments',
    body: 'Earnings are calculated based on completed deliveries, applicable incentives, and bonuses. Payouts are processed weekly to your registered bank account subject to verification.',
  },
  {
    title: '5. Account Suspension',
    body: 'Verdant reserves the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or consistently fail to meet delivery and quality standards.',
  },
  {
    title: '6. Privacy & Data',
    body: 'We collect and process your personal data as described in our Privacy Policy. By using the platform, you consent to the collection of location data, device information, and usage analytics.',
  },
  {
    title: '7. Liability',
    body: 'Verdant is not liable for losses arising from unforeseen circumstances, third-party failures, or events beyond our control. Riders are responsible for their own safety and vehicle maintenance.',
  },
  {
    title: '8. Amendments',
    body: 'Verdant may update these Terms at any time. Continued use of the platform after notice of changes constitutes acceptance of the updated Terms and Conditions.',
  },
];

export function AccountTermsScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="chevron-left" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
        </View>
        <Text style={styles.headerSubtitle}>Last updated: Jan 1, 2026</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {SECTIONS.map(section => (
          <View key={section.title}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryButtonText}>I Agree</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  headerTitle: {...typography.title, fontSize: 18, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, fontSize: 12, color: colors.textMuted, marginLeft: 34, marginTop: spacing.xs},
  body: {padding: spacing.lg, gap: spacing.lg, paddingBottom: 120},
  sectionTitle: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  sectionBody: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 22.1},
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
