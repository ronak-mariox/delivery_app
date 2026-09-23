import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountRestricted'>;

const REASONS = [
  {title: 'Insurance Expired', description: 'Your vehicle insurance expired on 12 Aug 2026. Upload a valid policy to continue.', tone: 'danger' as const},
  {title: 'Multiple Customer Complaints', description: '3 complaints received in the last 7 days. Review quality guidelines.', tone: 'warning' as const},
];

const RESTORE_STEPS = [
  {label: 'Upload valid insurance document', action: 'Upload Now'},
  {label: 'Complete de-escalation training', action: 'Start'},
  {label: 'Wait for team review (1–2 business days)', action: null},
];

export function AccountRestrictedScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.danger} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerIcon}>
            <Icon name="shield" size={26} color={colors.white} />
          </View>
          <View>
            <Text style={styles.headerLabel}>ACCOUNT STATUS</Text>
            <Text style={styles.headerTitle}>Access Restricted</Text>
          </View>
        </View>
        <View style={styles.headerBanner}>
          <Text style={styles.headerBannerText}>
            Your account has been temporarily restricted. You cannot go online or accept deliveries until this is resolved.
          </Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.reasonsCard}>
          <View style={styles.reasonsHeader}>
            <View style={styles.reasonsHeaderIcon}>
              <Icon name="alert-circle" size={16} color={colors.danger} />
            </View>
            <Text style={styles.reasonsTitle}>Reason for Restriction</Text>
          </View>
          {REASONS.map(reason => (
            <View
              key={reason.title}
              style={[styles.reasonItem, reason.tone === 'danger' ? styles.reasonItemDanger : styles.reasonItemWarning]}>
              <Text style={[styles.reasonItemTitle, {color: reason.tone === 'danger' ? '#B42318' : '#B54708'}]}>{reason.title}</Text>
              <Text style={[styles.reasonItemDescription, {color: reason.tone === 'danger' ? colors.danger : colors.warningText}]}>
                {reason.description}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>Steps to restore access</Text>
          {RESTORE_STEPS.map((step, index) => (
            <View key={step.label} style={[styles.stepRow, index > 0 && styles.stepRowBorder]}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepLabel}>{step.label}</Text>
              {step.action && (
                <TouchableOpacity onPress={() => index === 0 && navigation.navigate('InsuranceDocument')}>
                  <Text style={styles.stepAction}>{step.action}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View style={styles.mistakeBanner}>
          <Icon name="message-circle" size={20} color={colors.primary} />
          <View style={styles.mistakeText}>
            <Text style={styles.mistakeTitle}>Believe this is a mistake?</Text>
            <Text style={styles.mistakeSubtitle}>Contact our rider support team</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Button label="Upload Insurance Document" style={styles.dangerButton} onPress={() => navigation.navigate('InsuranceDocument')} />
        <Button label="Contact Support" variant="secondary" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.danger, paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.lg, gap: spacing.md},
  headerRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  headerIcon: {width: 48, height: 48, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  headerLabel: {...typography.overline, fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5},
  headerTitle: {...typography.title, fontSize: 18, color: colors.white},
  headerBanner: {backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.md, padding: spacing.md},
  headerBannerText: {...typography.label, color: 'rgba(255,255,255,0.9)', lineHeight: 19},
  body: {backgroundColor: colors.background, padding: spacing.xl, gap: spacing.lg},
  reasonsCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.dangerBorder, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md},
  reasonsHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  reasonsHeaderIcon: {width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.dangerSurface, alignItems: 'center', justifyContent: 'center'},
  reasonsTitle: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  reasonItem: {borderWidth: 1, borderRadius: radius.md, padding: spacing.md, gap: 3},
  reasonItemDanger: {backgroundColor: colors.dangerSurface, borderColor: colors.dangerBorder},
  reasonItemWarning: {backgroundColor: '#FFFAEB', borderColor: '#FEC84B'},
  reasonItemTitle: {...typography.bodyBold, fontSize: 13},
  reasonItemDescription: {...typography.caption, lineHeight: 16},
  stepsCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  stepsTitle: {...typography.bodyBold, fontSize: 13, color: colors.textLabel, marginBottom: spacing.sm},
  stepRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm},
  stepRowBorder: {borderTopWidth: 1, borderTopColor: '#F3F4F6'},
  stepBadge: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  stepBadgeText: {...typography.captionSemibold, color: colors.textMuted},
  stepLabel: {flex: 1, ...typography.label, color: colors.textLabel},
  stepAction: {...typography.captionSemibold, color: colors.primary},
  mistakeBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.lg, padding: spacing.md},
  mistakeText: {flex: 1},
  mistakeTitle: {...typography.labelSemibold, color: '#13845A'},
  mistakeSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  actions: {gap: spacing.sm, padding: spacing.xl, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  dangerButton: {backgroundColor: colors.danger},
});
