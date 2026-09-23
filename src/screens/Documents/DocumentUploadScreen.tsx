import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentUpload'>;

const DOC_TYPES = ['Driving Licence', 'RC', 'Insurance', 'Aadhaar', 'PAN', 'Other'];
const SIDES = ['Front', 'Back'];

const GUIDELINES = ['Document must be clearly readable', 'No glare or shadows', 'Upload front and back if required', 'Make sure all text is legible'];

export function DocumentUploadScreen({navigation}: Props) {
  const [docType, setDocType] = useState('Driving Licence');
  const [side, setSide] = useState('Front');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Document</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.sectionLabel}>Document Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {DOC_TYPES.map(type => {
              const active = type === docType;
              return (
                <TouchableOpacity key={type} style={[styles.chip, active && styles.chipActive]} activeOpacity={0.8} onPress={() => setDocType(type)}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{type}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.sideToggle}>
          {SIDES.map(s => {
            const active = s === side;
            return (
              <TouchableOpacity key={s} style={[styles.sideButton, active && styles.sideButtonActive]} activeOpacity={0.8} onPress={() => setSide(s)}>
                <Text style={[styles.sideButtonText, active && styles.sideButtonTextActive]}>{s}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.dropZone}>
          <Icon name="camera" size={48} color={colors.textMuted} />
          <Text style={styles.dropZoneTitle}>Tap to take photo or upload file</Text>
          <Text style={styles.dropZoneHint}>Accepted: JPG, PNG, PDF · Max 5MB</Text>
          <View style={styles.dropZoneActions}>
            <TouchableOpacity style={styles.miniButton} activeOpacity={0.85}>
              <Icon name="camera" size={16} color={colors.textPrimary} />
              <Text style={styles.miniButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.miniButton} activeOpacity={0.85}>
              <Icon name="image" size={18} color={colors.textPrimary} />
              <Text style={styles.miniButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.miniButton} activeOpacity={0.85} onPress={() => navigation.navigate('StateUploadFailed')}>
              <Icon name="folder" size={18} color={colors.textPrimary} />
              <Text style={styles.miniButtonText}>Files</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Guidelines</Text>
          {GUIDELINES.map(g => (
            <View key={g} style={styles.guidelineRow}>
              <Icon name="check" size={14} color={colors.primary} />
              <Text style={styles.guidelineText}>{g}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentVerified')}>
          <Text style={styles.primaryButtonText}>Upload Document</Text>
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
  body: {padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl},
  sectionLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, marginBottom: spacing.sm},
  chipsRow: {gap: spacing.sm},
  chip: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  chipActive: {backgroundColor: colors.primary, borderColor: colors.primary},
  chipText: {...typography.label, fontSize: 13, color: colors.textPrimary},
  chipTextActive: {color: colors.white, fontWeight: '600'},
  sideToggle: {flexDirection: 'row', gap: 4, backgroundColor: colors.background, borderRadius: radius.md, padding: 4},
  sideButton: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.sm, borderRadius: radius.sm},
  sideButtonActive: {backgroundColor: colors.surface},
  sideButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textSecondary},
  sideButtonTextActive: {color: colors.primary, fontWeight: '600'},
  dropZone: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: radius.xxl,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dropZoneTitle: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  dropZoneHint: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  dropZoneActions: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs},
  miniButton: {flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  miniButtonText: {...typography.label, fontSize: 13, color: colors.textPrimary},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, marginBottom: spacing.sm},
  guidelineRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs},
  guidelineText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  cancelButton: {paddingVertical: spacing.md, alignItems: 'center'},
  cancelButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
