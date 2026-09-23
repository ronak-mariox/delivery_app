import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketReviewSubmit'>;

const SUMMARY_ROWS = [
  {label: 'Issue Type', value: 'Delivery Issue'},
  {label: 'Category', value: 'Customer Unreachable'},
  {label: 'Order', value: '#VR-84821'},
  {label: 'Description', value: 'Customer did not respond after multiple…'},
  {label: 'Evidence', value: '2 photos attached'},
  {label: 'Priority', value: 'Medium'},
];

const CONTACT_OPTIONS = ['Live Chat', 'Email', 'Phone'];

export function TicketReviewSubmitScreen({navigation}: Props) {
  const [contact, setContact] = useState('Live Chat');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review & Submit</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Ticket Summary</Text>
          {SUMMARY_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.summaryRow, index < SUMMARY_ROWS.length - 1 && styles.rowBorder]}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.noteBanner}>
          <Text style={styles.noteTitle}>Response time estimate</Text>
          <Text style={styles.noteText}>5–10 minutes (live chat) · 2–4 hours (email)</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabelPlain}>Contact Preference</Text>
          <View style={styles.contactRow}>
            {CONTACT_OPTIONS.map(option => {
              const active = option === contact;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.contactButton, active && styles.contactButtonActive]}
                  activeOpacity={0.8}
                  onPress={() => setContact(option)}>
                  <Text style={[styles.contactText, active && styles.contactTextActive]}>{option}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('TicketSubmitted')}>
          <Text style={styles.primaryButtonText}>Submit Ticket</Text>
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
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 120},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  cardLabel: {...typography.labelSemibold, fontSize: 13, color: '#374151', backgroundColor: '#F9FAFB', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  cardLabelPlain: {...typography.labelSemibold, fontSize: 13, color: '#374151', padding: spacing.lg, paddingBottom: 0},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  summaryLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  summaryValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary, textAlign: 'right', flexShrink: 1},
  noteBanner: {backgroundColor: colors.primarySurface, borderRadius: radius.md, padding: spacing.md},
  noteTitle: {...typography.bodyMedium, fontSize: 13, color: '#13845A'},
  noteText: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs},
  contactRow: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, paddingTop: spacing.md},
  contactButton: {flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center'},
  contactButtonActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  contactText: {...typography.bodySemibold, fontSize: 12, color: colors.textSecondary},
  contactTextActive: {color: colors.primary},
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
