import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketReopen'>;

const MIN_CHARS = 20;

export function TicketReopenScreen({navigation}: Props) {
  const [reason, setReason] = useState('');
  const canSubmit = reason.length >= MIN_CHARS;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reopen Issue</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.warningBanner}>
          <Icon name="alert-triangle" size={20} color={colors.warning} />
          <View style={styles.flex}>
            <Text style={styles.warningTitle}>Reopening Ticket</Text>
            <Text style={styles.warningSubtitle}>You are about to reopen ticket #ISS-30012.</Text>
          </View>
        </View>

        <View>
          <Text style={styles.label}>
            Why are you reopening this ticket? <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Please describe why the issue is not resolved (min 20 characters)…"
            placeholderTextColor="rgba(31,41,55,0.5)"
            value={reason}
            onChangeText={setReason}
            multiline
          />
          <Text style={[styles.charCount, canSubmit && styles.charCountValid]}>
            {canSubmit ? `${reason.length} / ${MIN_CHARS} characters` : `${reason.length} / ${MIN_CHARS} min characters`}
          </Text>
        </View>

        <View style={styles.originalCard}>
          <Text style={styles.originalLabel}>Original Resolution</Text>
          <Text style={styles.originalValue}>₹40 partial earnings credited · Sep 6, 3:24 PM</Text>
        </View>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>Reopening adds this ticket to the priority queue. Expected response: 10 minutes.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}
          activeOpacity={0.85}
          disabled={!canSubmit}
          onPress={() => navigation.navigate('TicketDetail')}>
          <Text style={styles.primaryButtonText}>Reopen Ticket</Text>
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
  warningBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.lg, padding: spacing.lg},
  warningTitle: {...typography.bodySemibold, fontSize: 14, color: '#92400E'},
  warningSubtitle: {...typography.label, fontSize: 13, color: colors.warningText, marginTop: 2},
  label: {...typography.labelSemibold, fontSize: 13, color: '#374151', marginBottom: spacing.sm},
  required: {color: colors.danger},
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
  charCount: {...typography.caption, fontSize: 12, color: colors.warning, marginTop: spacing.xs},
  charCountValid: {color: colors.primary},
  originalCard: {backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  originalLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary},
  originalValue: {...typography.label, fontSize: 13, color: '#374151', marginTop: spacing.xs},
  noteBanner: {backgroundColor: colors.primarySurface, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.caption, fontSize: 12, color: '#13845A'},
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
  primaryButtonDisabled: {backgroundColor: '#D1D5DB'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  cancelButton: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  cancelButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
