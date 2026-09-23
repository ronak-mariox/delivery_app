import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleVerificationFailed'>;

const REJECTION_REASONS = [
  {title: 'Registration Certificate', reason: 'Photo unclear, please re-upload'},
  {title: 'Vehicle photo', reason: 'Does not match registration details'},
];

const UPLOAD_SLOTS = ['RC Document', 'Vehicle Photo'];

export function VehicleVerificationFailedScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification Failed</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Icon name="x-circle" size={48} color={colors.danger} />
          <Text style={styles.heroTitle}>Vehicle Verification Failed</Text>
          <Text style={styles.heroSubtitle}>Please fix the issues below and resubmit.</Text>
        </View>

        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>REJECTION REASONS</Text>
          {REJECTION_REASONS.map(item => (
            <View key={item.title} style={styles.reasonCard}>
              <Icon name="alert-triangle" size={16} color={colors.danger} />
              <View style={styles.flex}>
                <Text style={styles.reasonTitle}>{item.title}</Text>
                <Text style={styles.reasonText}>{item.reason}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionGroup}>
          <Text style={styles.sectionLabel}>RE-UPLOAD DOCUMENTS</Text>
          {UPLOAD_SLOTS.map(slot => (
            <View key={slot} style={styles.uploadSlot}>
              <Text style={styles.uploadSlotTitle}>{slot}</Text>
              <View style={styles.uploadSlotActions}>
                <TouchableOpacity style={styles.cameraButton} activeOpacity={0.85}>
                  <Icon name="camera" size={16} color={colors.primary} />
                  <Text style={styles.cameraButtonText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.galleryButton} activeOpacity={0.85}>
                  <Icon name="image" size={16} color={colors.textSecondary} />
                  <Text style={styles.galleryButtonText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.warningBanner}>
          <Icon name="alert-triangle" size={16} color={colors.warning} />
          <Text style={styles.warningText}>
            Please resubmit within <Text style={styles.warningBold}>7 days</Text> to avoid account suspension.
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('VehicleVerificationStatus')}>
          <Text style={styles.primaryButtonText}>Resubmit Documents</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85}>
          <Text style={styles.outlineButtonText}>Contact Support</Text>
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl},
  hero: {backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.xxl, alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg},
  heroTitle: {...typography.h4, fontSize: 18, color: colors.danger, textAlign: 'center', marginTop: spacing.md},
  heroSubtitle: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs, textAlign: 'center'},
  sectionGroup: {gap: spacing.sm},
  sectionLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase'},
  reasonCard: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.lg, padding: spacing.md},
  reasonTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  reasonText: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  uploadSlot: {borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed', borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm},
  uploadSlotTitle: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  uploadSlotActions: {flexDirection: 'row', gap: spacing.sm},
  cameraButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, backgroundColor: colors.primarySurface, borderRadius: radius.md, height: 40},
  cameraButtonText: {...typography.captionSemibold, fontSize: 13, color: colors.primary},
  galleryButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, backgroundColor: '#F3F4F6', borderRadius: radius.md, height: 40},
  galleryButtonText: {...typography.captionSemibold, fontSize: 13, color: colors.textSecondary},
  warningBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.lg, padding: spacing.md},
  warningText: {...typography.label, fontSize: 13, color: colors.warningText, flex: 1},
  warningBold: {...typography.bodyBold, fontSize: 13, color: colors.warningText},
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, height: 50, alignItems: 'center', justifyContent: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  outlineButton: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, height: 48, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
});
