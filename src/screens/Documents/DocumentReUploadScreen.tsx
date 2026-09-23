import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentReUpload'>;

const SIDES = ['Front', 'Back'];
const CHECKS = ['Good lighting', 'No flash glare', 'Full document visible'];
const GUIDELINES = ['Document must be clearly readable', 'Ensure all four corners are visible', 'Make sure all text is legible'];

export function DocumentReUploadScreen({navigation}: Props) {
  const [side, setSide] = useState('Front');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerEyebrow}>Re-Upload Document</Text>
          <Text style={styles.headerTitle}>Driving Licence</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.rejectedBanner}>
          <Text style={styles.rejectedText}>
            <Text style={styles.rejectedBold}>Rejected: </Text>
            Image quality too low.
          </Text>
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
          <Icon name="camera" size={40} color={colors.textMuted} />
          <Text style={styles.dropZoneText}>Tap to upload {side.toLowerCase()} side</Text>
        </View>

        <View style={styles.checksCard}>
          <View style={styles.checksRow}>
            {CHECKS.map(check => (
              <View key={check} style={styles.checkItem}>
                <Icon name="check" size={14} color={colors.textMuted} />
                <Text style={styles.checkText}>{check}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Guidelines</Text>
          {GUIDELINES.map(g => (
            <View key={g} style={styles.guidelineRow}>
              <View style={styles.bullet} />
              <Text style={styles.guidelineText}>{g}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentUnderReview')}>
          <Text style={styles.primaryButtonText}>Submit New Document</Text>
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
  headerEyebrow: {...typography.label, fontSize: 13, color: colors.textSecondary},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  rejectedBanner: {backgroundColor: colors.dangerSurface, borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  rejectedText: {...typography.label, fontSize: 13, color: colors.dangerText},
  rejectedBold: {...typography.bodyBold, fontSize: 13, color: colors.danger},
  sideToggle: {flexDirection: 'row', gap: 4, backgroundColor: colors.surface, borderRadius: radius.md, padding: 4},
  sideButton: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.sm, borderRadius: radius.sm},
  sideButtonActive: {backgroundColor: colors.white, ...shadows.sm},
  sideButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textSecondary},
  sideButtonTextActive: {color: colors.primary, fontWeight: '600'},
  dropZone: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: radius.xl,
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dropZoneText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  checksCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  checksRow: {flexDirection: 'row', justifyContent: 'center', gap: spacing.lg, flexWrap: 'wrap'},
  checkItem: {flexDirection: 'row', alignItems: 'center', gap: 5},
  checkText: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, marginBottom: spacing.sm},
  guidelineRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs},
  bullet: {width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#CBD5E1'},
  guidelineText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  cancelButton: {paddingVertical: spacing.md, alignItems: 'center'},
  cancelButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
