import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconName} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportHub'>;

type CategoryRoute =
  | 'SupportDeliveryIssues'
  | 'SupportPaymentIssues'
  | 'SupportAccountIssues'
  | 'SupportDocumentIssues'
  | 'SupportVehicleIssues'
  | 'SupportOtherIssues';

const CATEGORIES: {label: string; icon: IconName; route: CategoryRoute}[] = [
  {label: 'Delivery Issue', icon: 'clock', route: 'SupportDeliveryIssues'},
  {label: 'Payment Issue', icon: 'dollar-sign', route: 'SupportPaymentIssues'},
  {label: 'Account Issue', icon: 'user', route: 'SupportAccountIssues'},
  {label: 'Document Issue', icon: 'file-text', route: 'SupportDocumentIssues'},
  {label: 'Vehicle Issue', icon: 'wrench', route: 'SupportVehicleIssues'},
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
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.85} onPress={() => navigation.navigate('SupportSelectIssueType')}>
          <Icon name="search" size={18} color={colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search for help…</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Issue Categories</Text>
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

        <View style={styles.statsBanner}>
          <Text style={styles.statsBannerText}>Avg response: 2 min · 98% resolution rate · 24/7 support</Text>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity style={styles.activityRow} activeOpacity={0.7} onPress={() => navigation.navigate('TicketStatus')}>
          <View>
            <Text style={styles.activityTitle}>Ticket #ISS-29847</Text>
            <Text style={styles.activitySub}>Sep 6 · Customer Unreachable</Text>
          </View>
          <View style={styles.resolvedPill}>
            <Text style={styles.resolvedPillText}>Resolved</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Start Live Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85}>
          <Text style={styles.outlineButtonText}>Call Support</Text>
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
  searchBar: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  searchPlaceholder: {...typography.body, fontSize: 14, color: colors.textMuted},
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
  statsBanner: {backgroundColor: colors.primarySurface, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center'},
  statsBannerText: {...typography.captionMedium, fontSize: 12, color: '#13845A'},
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  activityTitle: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  activitySub: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  resolvedPill: {backgroundColor: colors.primarySurface, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4},
  resolvedPillText: {...typography.captionSemibold, fontSize: 12, color: colors.primary},
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
