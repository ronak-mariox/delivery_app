import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketEscalate'>;

const REASONS = ['Agent unresponsive', 'Resolution unsatisfactory', 'Issue still ongoing', 'Urgent — safety issue'];

export function TicketEscalateScreen({navigation}: Props) {
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escalate Issue</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.levelRow}>
            <View style={styles.dotPrimary} />
            <View style={styles.flex}>
              <Text style={styles.levelTitle}>Current: Level 1 Support</Text>
              <Text style={styles.levelSubtitle}>Agent: Vikram S.</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.levelRow}>
            <View style={styles.dotWarning} />
            <View style={styles.flex}>
              <Text style={styles.levelTitle}>Next: Level 2 — Senior Support Team</Text>
              <Text style={styles.levelSubtitle}>Avg response: 15 minutes</Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.label}>Escalation Reason (select one)</Text>
          <View style={styles.chipsWrap}>
            {REASONS.map(item => {
              const active = item === reason;
              return (
                <TouchableOpacity key={item} style={[styles.chip, active && styles.chipActive]} activeOpacity={0.8} onPress={() => setReason(item)}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View>
          <Text style={styles.label}>Additional Details</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Please describe why you need escalation…"
            placeholderTextColor="rgba(31,41,55,0.5)"
            value={details}
            onChangeText={setDetails}
            multiline
          />
        </View>

        <View style={styles.warningBanner}>
          <Icon name="alert-triangle" size={16} color={colors.warning} />
          <Text style={styles.warningText}>Escalation is reserved for urgent or unresolved issues. Average wait: 15 minutes.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.primaryButton, !reason && styles.primaryButtonDisabled]}
          activeOpacity={0.85}
          disabled={!reason}
          onPress={() => navigation.navigate('TicketDetail')}>
          <Text style={styles.primaryButtonText}>Escalate Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  levelRow: {flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start'},
  divider: {height: 1, backgroundColor: '#F3F4F6', marginVertical: spacing.sm},
  dotPrimary: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 5},
  dotWarning: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning, marginTop: 5},
  levelTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  levelSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  label: {...typography.labelSemibold, fontSize: 13, color: '#374151', marginBottom: spacing.sm},
  chipsWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  chip: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  chipActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  chipText: {...typography.bodyMedium, fontSize: 13, color: colors.textSecondary},
  chipTextActive: {color: colors.primary},
  textArea: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    height: 100,
    textAlignVertical: 'top',
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  warningBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.md, padding: spacing.md},
  warningText: {...typography.label, fontSize: 13, color: colors.warningText, flex: 1},
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
  primaryButton: {flex: 1.6, backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonDisabled: {backgroundColor: '#D1D5DB'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  cancelButton: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  cancelButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
