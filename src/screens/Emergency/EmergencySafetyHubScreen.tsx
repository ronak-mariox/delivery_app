import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencySafetyHub'>;

const TIPS = ['Report unsafe locations', 'Leave immediately if you feel threatened', 'Your order will be reassigned'];

export function EmergencySafetyHubScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Icon name="shield" size={48} color={colors.white} />
        <Text style={styles.heroTitle}>Emergency & Safety</Text>
        <Text style={styles.heroSubtitle}>Your safety is our top priority</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.emergencyButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyModeActive')}>
          <Icon name="phone" size={24} color={colors.white} />
          <Text style={styles.emergencyButtonText}>Call Emergency Services — 112</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.safetyButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencySupport')}>
          <Icon name="headphones" size={22} color={colors.white} />
          <Text style={styles.safetyButtonText}>Contact Verdant Safety Team</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Safety Tips</Text>
          {TIPS.map(tip => (
            <View key={tip} style={styles.tipRow}>
              <Icon name="check" size={16} color={colors.primary} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.warningBanner}>
          <Icon name="alert-triangle" size={18} color={colors.warning} />
          <Text style={styles.warningText}>
            Active delivery <Text style={styles.warningBold}>#VR-84821</Text> will be safely handled
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyShareLocation')}>
          <Text style={styles.outlineButtonText}>Share My Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerOutlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyIncidentReport')}>
          <Text style={styles.dangerOutlineButtonText}>Incident Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: '#D92D20', alignItems: 'center', gap: spacing.xs, paddingTop: 56, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  heroTitle: {...typography.h4, fontSize: 20, color: colors.white, marginTop: spacing.sm},
  heroSubtitle: {...typography.label, fontSize: 14, color: 'rgba(255,255,255,0.8)'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 120},
  emergencyButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.danger, borderRadius: radius.lg, height: 64},
  emergencyButtonText: {...typography.bodyBold, fontSize: 16, color: colors.white},
  safetyButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: '#1F2937', borderRadius: radius.lg, height: 60},
  safetyButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  tipRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  tipText: {...typography.body, fontSize: 14, color: colors.textSecondary},
  warningBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.md, padding: spacing.md},
  warningText: {...typography.label, fontSize: 13, color: colors.warningText, flex: 1},
  warningBold: {...typography.bodyBold, fontSize: 13, color: colors.warningText},
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
  outlineButton: {flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, height: 44, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  dangerOutlineButton: {flex: 1, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.md, height: 44, alignItems: 'center', justifyContent: 'center'},
  dangerOutlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.danger},
});
