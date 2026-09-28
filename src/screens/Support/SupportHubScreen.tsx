import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconName} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {callSupport, emailSupport, SUPPORT_EMAIL, SUPPORT_PHONE_DISPLAY} from './supportContacts';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportHub'>;

type CategoryRoute =
  | 'SupportDeliveryIssues'
  | 'SupportPaymentIssues'
  | 'SupportAccountIssues'
  | 'SupportDocumentIssues'
  | 'SupportVehicleIssues'
  | 'SupportStoreIssues'
  | 'SupportCustomerIssues'
  | 'SupportTechnicalIssues'
  | 'SupportOtherIssues';

const CATEGORIES: {label: string; icon: IconName; route: CategoryRoute}[] = [
  {label: 'Delivery Issue', icon: 'clock', route: 'SupportDeliveryIssues'},
  {label: 'Payment Issue', icon: 'dollar-sign', route: 'SupportPaymentIssues'},
  {label: 'Account Issue', icon: 'user', route: 'SupportAccountIssues'},
  {label: 'Document Issue', icon: 'file-text', route: 'SupportDocumentIssues'},
  {label: 'Vehicle Issue', icon: 'wrench', route: 'SupportVehicleIssues'},
  {label: 'Store Issue', icon: 'store', route: 'SupportStoreIssues'},
  {label: 'Customer Issue', icon: 'user-x', route: 'SupportCustomerIssues'},
  {label: 'Technical Issue', icon: 'smartphone', route: 'SupportTechnicalIssues'},
  {label: 'Other', icon: 'help-circle', route: 'SupportOtherIssues'},
];

export function SupportHubScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Help & Support</Text>
        <Text style={styles.heroSubtitle}>How can we help you today?</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.faqBar} activeOpacity={0.85} onPress={() => navigation.navigate('SupportFaq')}>
          <Icon name="help-circle" size={18} color={colors.primary} />
          <Text style={styles.faqBarText}>Browse frequently asked questions</Text>
          <Icon name="chevron-right" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Help by topic</Text>
        <View style={styles.grid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.label} style={styles.categoryCard} activeOpacity={0.8} onPress={() => navigation.navigate(cat.route)}>
              <View style={styles.categoryIcon}>
                <Icon name={cat.icon} size={24} color={colors.primary} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Contact us</Text>
        <View style={styles.contactCard}>
          <TouchableOpacity style={[styles.contactRow, styles.contactRowBorder]} activeOpacity={0.7} onPress={callSupport}>
            <Icon name="phone" size={18} color={colors.primary} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Call support</Text>
              <Text style={styles.contactValue}>{SUPPORT_PHONE_DISPLAY}</Text>
            </View>
            <Icon name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactRow} activeOpacity={0.7} onPress={() => emailSupport()}>
            <Icon name="mail" size={18} color={colors.primary} />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Email support</Text>
              <Text style={styles.contactValue}>{SUPPORT_EMAIL}</Text>
            </View>
            <Icon name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={callSupport}>
          <Text style={styles.primaryButtonText}>Call Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => emailSupport()}>
          <Text style={styles.outlineButtonText}>Email Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: colors.primary, paddingTop: 48, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  heroTitle: {...typography.h3, fontSize: 22, color: colors.white},
  heroSubtitle: {...typography.body, fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: spacing.xs},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 100},
  faqBar: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  faqBarText: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, flex: 1},
  sectionTitle: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary, marginTop: spacing.xs},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md},
  categoryCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryIcon: {width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  categoryLabel: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary, textAlign: 'center'},
  contactCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  contactRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  contactRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  contactText: {flex: 1},
  contactLabel: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  contactValue: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  primaryButton: {flex: 1, backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  outlineButton: {flex: 1, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
});
