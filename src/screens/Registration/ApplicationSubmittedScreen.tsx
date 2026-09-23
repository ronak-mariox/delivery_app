import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ApplicationSubmitted'>;

const NEXT_STEPS = [
  {title: 'Document Verification', subtitle: '24–48 hrs'},
  {title: 'Background Check', subtitle: '2–3 days'},
  {title: 'Account Activation', subtitle: 'After approval'},
  {title: 'Start Delivering!', subtitle: 'Go live'},
];

export function ApplicationSubmittedScreen({route, navigation}: Props) {
  const {referenceId} = route.params;
  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.checkCircle}>
          <Icon name="check" size={40} color={colors.white} />
        </View>
        <Text style={styles.title}>Application Submitted!</Text>
        <Text style={styles.subtitle}>
          Reference ID: <Text style={styles.subtitleStrong}>{referenceId}</Text>
        </Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Your application is now under review. You'll be notified within <Text style={styles.descriptionStrong}>24–48 hours</Text>.
        </Text>

        <View style={styles.nextStepsCard}>
          <Text style={styles.nextStepsTitle}>What happens next?</Text>
          {NEXT_STEPS.map((step, index) => (
            <View key={step.title} style={styles.stepRow}>
              <View style={styles.stepBadgeWrap}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{index + 1}</Text>
                </View>
                {index < NEXT_STEPS.length - 1 && <View style={styles.stepConnector} />}
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.referenceCard}>
          <View>
            <Text style={styles.referenceLabel}>APPLICATION REFERENCE</Text>
            <Text style={styles.referenceValue}>{referenceId}</Text>
          </View>
          <TouchableOpacity style={styles.copyButton} activeOpacity={0.8}>
            <Text style={styles.copyButtonText}>Copy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <Button label="Track Application Status" onPress={() => navigation.navigate('VerificationInProgress')} />
          <Button label="Return to Home" variant="secondary" onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, alignItems: 'center', paddingVertical: spacing.huge, gap: spacing.xs},
  checkCircle: {width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  title: {...typography.h4, fontSize: 22, color: colors.white},
  subtitle: {...typography.body, color: 'rgba(255,255,255,0.75)'},
  subtitleStrong: {fontWeight: '700', color: 'rgba(255,255,255,0.9)'},
  body: {backgroundColor: colors.background, padding: spacing.xxl, gap: spacing.lg},
  description: {...typography.bodyLg, fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 24},
  descriptionStrong: {...typography.bodyLgMedium, fontSize: 15, fontWeight: '600', color: colors.textPrimary},
  nextStepsCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  nextStepsTitle: {...typography.labelSemibold, color: colors.textLabel, marginBottom: spacing.sm},
  stepRow: {flexDirection: 'row', gap: spacing.md},
  stepBadgeWrap: {alignItems: 'center'},
  stepBadge: {width: 30, height: 30, borderRadius: 15, backgroundColor: colors.background, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  stepBadgeText: {...typography.captionSemibold, color: colors.textMuted},
  stepConnector: {width: 2, flex: 1, minHeight: 24, backgroundColor: colors.border},
  stepText: {flex: 1, paddingBottom: spacing.md, paddingTop: 4},
  stepTitle: {...typography.labelSemibold, color: colors.textPrimary},
  stepSubtitle: {...typography.caption, color: colors.textMuted, marginTop: 2},
  referenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primarySurface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  referenceLabel: {...typography.overline, fontSize: 11, color: colors.textSecondary, letterSpacing: 0.5},
  referenceValue: {...typography.title, fontSize: 18, color: colors.primary, marginTop: 2},
  copyButton: {height: 36, paddingHorizontal: spacing.md, borderWidth: 1.5, borderColor: colors.primaryBorder, borderRadius: radius.sm, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  copyButtonText: {...typography.captionSemibold, color: colors.primary},
  actions: {gap: spacing.sm},
});
