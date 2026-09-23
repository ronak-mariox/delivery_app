import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountPrivacyPolicy'>;

const SECTIONS = [
  {
    title: '1. Data Collection',
    body: 'We collect personal information including your name, phone number, location data, device identifiers, and usage activity when you use the Verdant Rider platform.',
  },
  {
    title: '2. How We Use Data',
    body: 'Your data is used to provide delivery services, process payments, improve app performance, send relevant notifications, and ensure platform safety and compliance.',
  },
  {
    title: '3. Data Sharing',
    body: 'We may share your data with delivery partners, payment processors, and regulatory authorities as required by law. We do not sell your personal data to third parties.',
  },
  {
    title: '4. Data Security',
    body: 'We implement industry-standard security measures including encryption, access controls, and regular audits to protect your personal data from unauthorized access.',
  },
  {
    title: '5. Your Rights',
    body: 'You have the right to access, correct, or delete your personal data. You may also request data portability or object to certain data processing activities by contacting our team.',
  },
  {
    title: '6. Cookies',
    body: 'The Verdant Rider app uses cookies and similar technologies to remember preferences and improve your experience. You can manage cookie settings in your device settings.',
  },
  {
    title: '7. Contact Us',
    body: 'For privacy-related queries or requests, contact our Data Protection Officer at privacy@verdant.in. We aim to respond within 30 business days.',
  },
  {
    title: '8. Changes to Policy',
    body: 'We may update this Privacy Policy periodically. We will notify you of significant changes via the app or email. Continued use of the platform constitutes acceptance.',
  },
];

export function AccountPrivacyPolicyScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="chevron-left" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
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
        <TouchableOpacity style={styles.closeButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.closeButtonText}>Close</Text>
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
  closeButton: {backgroundColor: '#F3F4F6', borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  closeButtonText: {...typography.bodySemibold, fontSize: 15, color: '#374151'},
});
