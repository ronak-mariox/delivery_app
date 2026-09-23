import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentVerificationFailed'>;

const TIPS = ['Good lighting', 'No glare', 'All corners visible', 'Legible text'];

export function DocumentVerificationFailedScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Icon name="x-circle" size={40} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Document Verification Failed</Text>
        <Text style={styles.heroSub}>Driving Licence</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.reasonCard}>
          <Text style={styles.reasonTitle}>Rejection Reason</Text>
          <Text style={styles.reasonText}>Photo quality too low — text is not clearly readable. Please retake in good lighting.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tips for re-upload</Text>
          <View style={styles.tipsWrap}>
            {TIPS.map(tip => (
              <View key={tip} style={styles.tipPill}>
                <Icon name="check" size={14} color={colors.primary} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.retakeZone}>
          <Icon name="camera" size={30} color={colors.danger} />
          <View style={styles.retakeActions}>
            <TouchableOpacity style={styles.retakeButton} activeOpacity={0.85}>
              <Text style={styles.retakeButtonText}>Retake Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.galleryButton} activeOpacity={0.85}>
              <Text style={styles.galleryButtonText}>Upload from Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>Resubmit within 7 days to keep your account active.</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentReUpload')}>
          <Text style={styles.primaryButtonText}>Resubmit Document</Text>
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
  hero: {backgroundColor: '#B42318', alignItems: 'center', gap: spacing.sm, paddingTop: 56, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  heroIcon: {width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  heroTitle: {...typography.h4, fontSize: 20, color: colors.white, textAlign: 'center'},
  heroSub: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.8)'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  reasonCard: {backgroundColor: colors.dangerSurface, borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.lg, padding: spacing.lg},
  reasonTitle: {...typography.bodyBold, fontSize: 13, color: colors.danger},
  reasonText: {...typography.label, fontSize: 13, color: colors.dangerText, marginTop: spacing.xs, lineHeight: 20.8},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, marginBottom: spacing.sm},
  tipsWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  tipPill: {flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primarySurface, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 6},
  tipText: {...typography.caption, fontSize: 12, color: colors.textPrimary},
  retakeZone: {
    backgroundColor: colors.dangerSurface,
    borderWidth: 2,
    borderColor: colors.danger,
    borderStyle: 'dashed',
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  retakeActions: {flexDirection: 'row', gap: spacing.sm},
  retakeButton: {borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  retakeButtonText: {...typography.label, fontSize: 13, color: colors.danger},
  galleryButton: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  galleryButtonText: {...typography.label, fontSize: 13, color: colors.textPrimary},
  warningBanner: {backgroundColor: colors.warningSurface, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center'},
  warningText: {...typography.label, fontSize: 13, color: colors.warningText},
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  outlineButton: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textPrimary},
});
