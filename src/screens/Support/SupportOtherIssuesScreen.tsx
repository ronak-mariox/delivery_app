import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportOtherIssues'>;

const MIN_CHARS = 50;
const CATEGORIES = ['Delivery', 'Payment', 'Account', 'Vehicle', 'Other'];

export function SupportOtherIssuesScreen({navigation}: Props) {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');

  const remaining = Math.max(0, MIN_CHARS - description.length);
  const canContinue = description.length >= MIN_CHARS;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Other Issues</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>Describe your issue and we will route it to the right team.</Text>

        <View>
          <Text style={styles.label}>Describe Your Issue</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Please describe your issue in detail…"
            placeholderTextColor="rgba(31,41,55,0.5)"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <Text style={[styles.charCount, canContinue && styles.charCountValid]}>
            {canContinue ? `${description.length} / ${MIN_CHARS} characters` : `${description.length} / ${MIN_CHARS} min characters (${remaining} more needed)`}
          </Text>
        </View>

        <View>
          <Text style={styles.label}>Category (auto-detected or select)</Text>
          <View style={styles.chipsWrap}>
            {CATEGORIES.map(cat => {
              const active = cat === category;
              return (
                <TouchableOpacity key={cat} style={[styles.chip, active && styles.chipActive]} activeOpacity={0.8} onPress={() => setCategory(cat)}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
          activeOpacity={0.85}
          disabled={!canContinue}
          onPress={() => navigation.navigate('TicketUploadEvidence')}>
          <Text style={styles.continueButtonText}>Continue →</Text>
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
  body: {padding: spacing.lg, gap: spacing.lg, paddingBottom: 120},
  intro: {...typography.body, fontSize: 14, color: colors.textSecondary},
  label: {...typography.labelSemibold, fontSize: 13, color: '#374151', marginBottom: spacing.sm},
  textArea: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    height: 140,
    textAlignVertical: 'top',
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  charCount: {...typography.caption, fontSize: 12, color: colors.warning, marginTop: spacing.xs},
  charCountValid: {color: colors.primary},
  chipsWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  chip: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  chipActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  chipText: {...typography.bodyMedium, fontSize: 13, color: colors.textSecondary},
  chipTextActive: {color: colors.primary},
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
  continueButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  continueButtonDisabled: {backgroundColor: '#9CA3AF'},
  continueButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
});
