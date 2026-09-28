import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon, IconName} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {callSupport, emailSupport} from './supportContacts';

export interface SupportFaqItem {
  question: string;
  answer: string;
}

export interface SupportTopicBanner {
  tone: 'info' | 'warning' | 'danger';
  icon: IconName;
  text: string;
}

interface SupportTopicScreenProps {
  title: string;
  intro: string;
  faqs: SupportFaqItem[];
  banner?: SupportTopicBanner;
  onBack: () => void;
}

const BANNER_STYLES = {
  info: {bg: colors.primarySurface, fg: '#13845A'},
  warning: {bg: colors.warningSurface, fg: colors.warningText},
  danger: {bg: colors.dangerSurface, fg: colors.dangerText},
};

export function SupportTopicScreen({title, intro, faqs, banner, onBack}: SupportTopicScreenProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>{intro}</Text>

        {banner && (
          <View style={[styles.banner, {backgroundColor: BANNER_STYLES[banner.tone].bg}]}>
            <Icon name={banner.icon} size={16} color={BANNER_STYLES[banner.tone].fg} />
            <Text style={[styles.bannerText, {color: BANNER_STYLES[banner.tone].fg}]}>{banner.text}</Text>
          </View>
        )}

        {faqs.map((faq, index) => {
          const open = index === openIndex;
          return (
            <View key={faq.question} style={styles.faqCard}>
              <TouchableOpacity style={styles.faqRow} activeOpacity={0.7} onPress={() => setOpenIndex(open ? null : index)}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Icon name={open ? 'chevron-down' : 'chevron-right'} size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              {open && (
                <View style={styles.faqAnswerWrap}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
            </View>
          );
        })}

        <Text style={styles.stillNeedHelp}>Still need help? Reach the support team directly.</Text>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={callSupport}>
          <Icon name="phone" size={16} color={colors.white} />
          <Text style={styles.primaryButtonText}>Call Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => emailSupport(title)}>
          <Icon name="mail" size={16} color={colors.primary} />
          <Text style={styles.outlineButtonText}>Email Support</Text>
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
  banner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.xs},
  bannerText: {...typography.label, fontSize: 13, flex: 1},
  faqCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  faqRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg},
  faqQuestion: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, flex: 1, paddingRight: spacing.sm},
  faqAnswerWrap: {borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.md},
  faqAnswer: {...typography.label, fontSize: 13, color: colors.textSecondary, lineHeight: 20.8},
  stillNeedHelp: {...typography.caption, fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: spacing.md},
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
  primaryButton: {flex: 1, flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  outlineButton: {flex: 1, flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
});
