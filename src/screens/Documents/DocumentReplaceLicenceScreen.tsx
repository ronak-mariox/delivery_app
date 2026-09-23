import React from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentReplaceLicence'>;

export function DocumentReplaceLicenceScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Replace Driving Licence</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.warningBanner}>
          <Icon name="alert-triangle" size={16} color={colors.warning} />
          <Text style={styles.warningText}>
            Replacing this document will require re-verification, which may take 24–48 hours. Your deliveries will not be paused during review.
          </Text>
        </View>

        <View>
          <Text style={styles.sectionLabel}>Current Document</Text>
          <View style={styles.currentRow}>
            <View style={styles.currentLeft}>
              <View style={styles.currentIcon}>
                <Icon name="file-text" size={20} color={colors.textSecondary} />
              </View>
              <View>
                <Text style={styles.currentTitle}>DL · KA0120230012345</Text>
                <Text style={styles.currentSub}>Verified Aug 15, 2024</Text>
              </View>
            </View>
            <Text style={styles.willReplaceText}>Will be replaced</Text>
          </View>
        </View>

        <View>
          <Text style={styles.sectionLabel}>New Document</Text>
          <View style={styles.dropZone}>
            <Icon name="camera" size={40} color={colors.textMuted} />
            <Text style={styles.dropZoneText}>Tap to upload new document</Text>
            <View style={styles.dropZoneActions}>
              <TouchableOpacity style={styles.miniButton} activeOpacity={0.85}>
                <Icon name="camera" size={16} color={colors.textPrimary} />
                <Text style={styles.miniButtonText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.miniButton} activeOpacity={0.85}>
                <Icon name="image" size={18} color={colors.textPrimary} />
                <Text style={styles.miniButtonText}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.reasonLabel}>
            Reason <Text style={styles.reasonOptional}>(optional)</Text>
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Why are you replacing this document?"
            placeholderTextColor="rgba(31,41,55,0.5)"
            multiline
          />
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentUnderReview')}>
          <Text style={styles.primaryButtonText}>Submit Replacement</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
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
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  warningBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.lg, padding: spacing.md},
  warningText: {...typography.label, fontSize: 13, color: colors.warningText, flex: 1},
  sectionLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, marginBottom: spacing.sm},
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  currentLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  currentIcon: {width: 40, height: 40, borderRadius: radius.sm, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  currentTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  currentSub: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  willReplaceText: {...typography.caption, fontSize: 12, color: colors.textSecondary, fontStyle: 'italic'},
  dropZone: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: radius.xl,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dropZoneText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  dropZoneActions: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs},
  miniButton: {flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  miniButtonText: {...typography.label, fontSize: 13, color: colors.textPrimary},
  reasonLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary, marginBottom: spacing.sm},
  reasonOptional: {...typography.label, fontSize: 13, color: colors.textSecondary, fontWeight: '400'},
  textArea: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    height: 80,
    textAlignVertical: 'top',
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  cancelButton: {paddingVertical: spacing.md, alignItems: 'center'},
  cancelButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
