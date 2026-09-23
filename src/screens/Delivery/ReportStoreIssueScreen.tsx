import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ReportStoreIssue'>;

const ISSUES = [
  'Order not ready',
  'Wrong items in order',
  'Store is closed',
  'Store cannot find order',
  'Items out of stock',
  'Other issue',
];

export function ReportStoreIssueScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [selected, setSelected] = useState(ISSUES[0]);
  const [notes, setNotes] = useState('');

  return (
    <Screen edges={['top', 'bottom']} keyboardAvoiding>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Report Store Issue</Text>
          <Text style={styles.headerSubtitle}>Order #{orderId}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>SELECT ISSUE TYPE</Text>
        <View style={styles.issuesList}>
          {ISSUES.map(issue => {
            const isSelected = issue === selected;
            return (
              <TouchableOpacity
                key={issue}
                style={[styles.issueRow, isSelected && styles.issueRowSelected]}
                activeOpacity={0.85}
                onPress={() => setSelected(issue)}>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
                <Text style={[styles.issueText, isSelected && styles.issueTextSelected]}>{issue}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>ADDITIONAL NOTES</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Describe the issue in detail…"
          placeholderTextColor={colors.textMuted}
          value={notes}
          onChangeText={setNotes}
          multiline
          textAlignVertical="top"
        />

        <View style={styles.warningBanner}>
          <Icon name="alert-triangle" size={18} color={colors.warning} />
          <Text style={styles.warningText}>Reporting this issue may delay your delivery. Support will assist you.</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Cancel" variant="secondary" style={styles.cancelButton} onPress={() => navigation.goBack()} />
        <Button
          label="Submit Issue"
          icon="arrow-right"
          iconPosition="right"
          style={styles.submitButton}
          onPress={() => navigation.navigate('PickupSupport', {orderId})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerText: {flex: 1},
  headerTitle: {...typography.titleSm, color: colors.textPrimary},
  headerSubtitle: {...typography.label, color: colors.textSecondary, marginTop: 1},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.sm},
  sectionLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.8, marginTop: spacing.sm, marginBottom: spacing.xs},
  issuesList: {gap: spacing.sm},
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  issueRowSelected: {borderColor: colors.danger, backgroundColor: '#FFF1F0'},
  radio: {width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.danger},
  radioDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger},
  issueText: {...typography.body, color: colors.textPrimary},
  issueTextSelected: {...typography.bodySemibold, color: colors.danger},
  notesInput: {
    height: 100,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  warningBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.xl, padding: spacing.md, marginTop: spacing.sm},
  warningText: {...typography.label, color: colors.warningText, flex: 1},
  footer: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  cancelButton: {flex: 1},
  submitButton: {flex: 2, backgroundColor: colors.danger},
});
