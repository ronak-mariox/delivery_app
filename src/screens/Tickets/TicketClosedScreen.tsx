import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketClosed'>;

const SUMMARY_ROWS = [
  {label: 'Issue', value: 'Customer Unreachable'},
  {label: 'Closed at', value: 'Sep 6, 3:24 PM'},
  {label: 'Resolution', value: '₹40 credited'},
  {label: 'Satisfaction', value: '4/5 ★'},
];

export function TicketClosedScreen({navigation}: Props) {
  const backToHelp = () => navigation.reset({index: 0, routes: [{name: 'SupportHub'}]});

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Icon name="check" size={32} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Ticket Closed</Text>
        <Text style={styles.heroSubtitle}>#ISS-30012</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {SUMMARY_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.summaryRow, index < SUMMARY_ROWS.length - 1 && styles.rowBorder]}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.noteCard}>
          <Icon name="info" size={18} color={colors.textMuted} />
          <Text style={styles.noteText}>This ticket is now closed. If the issue recurs, please open a new ticket and reference this ticket ID.</Text>
        </View>

        <TouchableOpacity style={styles.historyLink} activeOpacity={0.7} onPress={() => navigation.navigate('TicketStatus')}>
          <Text style={styles.historyLinkText}>View Ticket History</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('SupportSelectIssueType')}>
          <Text style={styles.outlineButtonText}>Open New Ticket</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={backToHelp}>
          <Text style={styles.primaryButtonText}>Back to Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: '#4B5563', alignItems: 'center', gap: spacing.sm, paddingTop: 60, paddingBottom: spacing.xxl, paddingHorizontal: spacing.xl},
  heroIcon: {width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center'},
  heroTitle: {...typography.h3, fontSize: 22, color: colors.white},
  heroSubtitle: {...typography.label, fontSize: 14, color: 'rgba(255,255,255,0.85)'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 120},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  summaryLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  summaryValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  noteCard: {flexDirection: 'row', gap: spacing.sm, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.lg},
  noteText: {...typography.label, fontSize: 13, color: '#6B7280', flex: 1},
  historyLink: {alignItems: 'center', paddingVertical: spacing.sm},
  historyLinkText: {...typography.label, fontSize: 13, color: colors.textSecondary, textDecorationLine: 'underline'},
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
  outlineButton: {flex: 1, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.primary},
  primaryButton: {flex: 1, backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.white},
});
