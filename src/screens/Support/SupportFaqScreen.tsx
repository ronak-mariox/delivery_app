import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {callSupport, emailSupport} from './supportContacts';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportFaq'>;

type FaqTab = 'Popular' | 'Delivery' | 'Earnings';

const TABS: FaqTab[] = ['Popular', 'Delivery', 'Earnings'];

const FAQS: {tabs: FaqTab[]; question: string; answer: string}[] = [
  {
    tabs: ['Popular', 'Earnings'],
    question: 'How are my delivery earnings calculated?',
    answer:
      'Each delivery pays a base amount plus a distance component. Active incentives and bonuses are added on top. Open any delivery in Earnings to see its full breakdown.',
  },
  {
    tabs: ['Popular', 'Delivery'],
    question: 'What happens if a customer is unreachable?',
    answer:
      'Call the customer from the delivery screen and wait at the drop location for a few minutes. If there is still no response, use the "Customer unavailable" option so the order is handled correctly and your rating is not affected.',
  },
  {
    tabs: ['Popular', 'Earnings'],
    question: 'How do I update my bank details?',
    answer: 'Go to Account > Payment settings. Updating your bank account or UPI ID puts it back into verification, which usually completes within a business day.',
  },
  {
    tabs: ['Popular'],
    question: 'Why was my document rejected?',
    answer:
      'The reason is shown on the document in Documents. Common causes are blurry photos, cut-off edges, mismatched names or an expired document. Upload a clear photo of the full document to re-submit.',
  },
  {
    tabs: ['Popular', 'Delivery'],
    question: 'How do I report a safety issue?',
    answer:
      'Use the emergency button on the delivery screen. For anything that is not urgent, call or email support; safety reports are handled as a priority.',
  },
  {
    tabs: ['Popular', 'Earnings'],
    question: 'When are payouts processed?',
    answer: 'Payouts are processed weekly to your verified bank account or UPI ID. The schedule and past payouts are shown under Payment History.',
  },
  {
    tabs: ['Delivery'],
    question: 'How can I improve my acceptance rate?',
    answer:
      'Acceptance rate is the share of order requests you accept. Going online only when you are ready to deliver, and staying in busy zones, keeps the rate high. Check Performance for your current rate.',
  },
  {
    tabs: ['Delivery', 'Earnings'],
    question: 'What is the cancellation policy?',
    answer:
      'Orders cancelled by the customer or store after you have picked up are compensated. Cancelling an accepted order yourself may affect your completion rate; use the in-app issue options instead so the cancellation is recorded correctly.',
  },
  {
    tabs: ['Delivery'],
    question: 'What should I do if the store is closed?',
    answer: 'Use "Report store issue" on the pickup screen and wait for the order to be cancelled or reassigned. You will not be penalised for a reported store-side problem.',
  },
];

export function SupportFaqScreen({navigation}: Props) {
  const [activeTab, setActiveTab] = useState<FaqTab>('Popular');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const visible = FAQS.filter(faq => faq.tabs.includes(activeTab));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
      </View>

      <View style={styles.tabsWrap}>
        {TABS.map(tab => {
          const active = tab === activeTab;
          return (
            <TouchableOpacity key={tab} style={[styles.tab, active && styles.tabActive]} activeOpacity={0.8} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {visible.map(faq => {
          const open = faq.question === openQuestion;
          return (
            <View key={faq.question} style={styles.faqCard}>
              <TouchableOpacity style={styles.faqRow} activeOpacity={0.7} onPress={() => setOpenQuestion(open ? null : faq.question)}>
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
      </ScrollView>

      <View style={styles.bottomBar}>
        <Text style={styles.bottomHint}>Still need help?</Text>
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={callSupport}>
            <Text style={styles.primaryButtonText}>Call Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => emailSupport()}>
            <Text style={styles.outlineButtonText}>Email Support</Text>
          </TouchableOpacity>
        </View>
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
  tabsWrap: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md},
  tab: {backgroundColor: '#F3F4F6', borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  tabActive: {backgroundColor: colors.primary},
  tabText: {...typography.bodySemibold, fontSize: 13, color: colors.textSecondary},
  tabTextActive: {color: colors.white},
  body: {padding: spacing.lg, gap: spacing.sm, paddingBottom: 140},
  faqCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  faqRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg},
  faqQuestion: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, flex: 1, paddingRight: spacing.sm},
  faqAnswerWrap: {borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.md},
  faqAnswer: {...typography.label, fontSize: 13, color: colors.textSecondary, lineHeight: 20.8},
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  bottomHint: {...typography.body, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.sm},
  bottomButtons: {flexDirection: 'row', gap: spacing.sm},
  primaryButton: {flex: 1, backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  outlineButton: {flex: 1, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
});
