import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportAccountIssues'>;

const ISSUES = ['Cannot log in', 'OTP not received', 'Account suspended', 'Profile update failed', 'Password / PIN issue', 'Other account problem'];

export function SupportAccountIssuesScreen({navigation}: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Issues</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>Select the type of account issue you are experiencing.</Text>

        {ISSUES.map(issue => {
          const active = issue === selected;
          return (
            <TouchableOpacity key={issue} style={[styles.row, active && styles.rowActive]} activeOpacity={0.8} onPress={() => setSelected(issue)}>
              <Text style={styles.rowText}>{issue}</Text>
              <Icon name="chevron-right" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          );
        })}

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>For urgent account issues like suspension, our team responds within 30 minutes.</Text>
        </View>

        {selected === 'Account suspended' && (
          <TouchableOpacity style={styles.restrictedLink} activeOpacity={0.8} onPress={() => navigation.navigate('AccountRestricted')}>
            <Text style={styles.restrictedLinkText}>View restriction details</Text>
            <Icon name="chevron-right" size={16} color={colors.danger} />
          </TouchableOpacity>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('TicketIssueDetails')}>
          <Text style={styles.primaryButtonText}>Create Ticket</Text>
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
  noteBanner: {backgroundColor: colors.primarySurface, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm},
  restrictedLink: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.dangerBorder, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginTop: spacing.sm},
  restrictedLinkText: {...typography.bodySemibold, fontSize: 13, color: colors.danger},
  noteText: {...typography.label, fontSize: 13, color: '#13845A'},
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
