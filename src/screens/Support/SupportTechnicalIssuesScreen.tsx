import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportTechnicalIssues'>;

const ISSUES = [
  'App crashing or not loading',
  'GPS not working',
  'Navigation issue',
  'Notification not received',
  'Login / session issue',
  'Other technical problem',
];

export function SupportTechnicalIssuesScreen({navigation}: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Technical Issues</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>Select the type of technical issue you are experiencing.</Text>

        {ISSUES.map(issue => {
          const active = issue === selected;
          return (
            <TouchableOpacity key={issue} style={[styles.row, active && styles.rowActive]} activeOpacity={0.8} onPress={() => setSelected(issue)}>
              <Text style={styles.rowText}>{issue}</Text>
              <Icon name="chevron-right" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          );
        })}

        <View style={styles.deviceCard}>
          <Text style={styles.deviceLabel}>YOUR DEVICE INFO</Text>
          <Text style={styles.deviceValue}>App v3.2.1 · Android 13 · Device: Samsung Galaxy A53</Text>
          <Text style={styles.deviceHint}>Auto-detected</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('TicketIssueDetails')}>
          <Text style={styles.primaryButtonText}>Create Ticket</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85}>
          <Text style={styles.outlineButtonText}>Restart App</Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  rowActive: {borderColor: colors.primary, borderWidth: 1.5},
  rowText: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  deviceCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.sm},
  deviceLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase'},
  deviceValue: {...typography.caption, fontSize: 12, color: colors.textMuted, marginTop: spacing.sm},
  deviceHint: {...typography.caption, fontSize: 11, color: '#D1D5DB', marginTop: spacing.xs},
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
