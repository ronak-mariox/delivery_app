import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportFaq'>;

const TABS = ['Popular', 'Delivery', 'Earnings'];

const FAQS = [
  {question: 'How is my delivery earnings calculated?'},
  {question: 'What happens if a customer is unreachable?'},
  {question: 'How do I update my bank details?'},
  {question: 'Why was my document rejected?'},
  {
    question: 'How do I report a safety issue?',
    answer:
      'Tap the emergency button on the home screen or in-delivery screen. Support is available 24/7 for safety issues. Your location will be shared with our safety team immediately upon activation.',
  },
  {question: 'When are payouts processed?'},
  {question: 'How can I improve my acceptance rate?'},
  {question: 'What is the cancellation policy?'},
];

export function SupportFaqScreen({navigation}: Props) {
  const [activeTab, setActiveTab] = useState('Popular');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Icon name="search" size={16} color={colors.textMuted} />
          <Text style={styles.searchPlaceholder}>Search FAQs…</Text>
        </View>
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
        {FAQS.map(faq => (
          <View key={faq.question} style={styles.faqCard}>
            <View style={styles.faqRow}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Icon name="chevron-down" size={18} color={colors.textSecondary} />
            </View>
            {faq.answer && (
              <View style={styles.faqAnswerWrap}>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Text style={styles.bottomHint}>Still need help?</Text>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('SupportHub')}>
          <Text style={styles.primaryButtonText}>Contact Support</Text>
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
  searchWrap: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, padding: spacing.lg},
  searchBar: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  searchPlaceholder: {...typography.body, fontSize: 14, color: colors.textMuted},
  tabsWrap: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md},
  tab: {backgroundColor: '#F3F4F6', borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  tabActive: {backgroundColor: colors.primary},
  tabText: {...typography.bodySemibold, fontSize: 13, color: colors.textSecondary},
  tabTextActive: {color: colors.white},
  body: {padding: spacing.lg, gap: spacing.sm, paddingBottom: 120},
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
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
});
