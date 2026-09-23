import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentUnderReview'>;

type StepState = 'done' | 'active' | 'pending';
const STEPS: {label: string; state: StepState}[] = [
  {label: 'Uploaded', state: 'done'},
  {label: 'Submitted', state: 'done'},
  {label: 'Under review', state: 'active'},
  {label: 'Decision', state: 'pending'},
];

const EXPECTATIONS: {icon: 'bell' | 'truck' | 'phone'; text: string}[] = [
  {icon: 'bell', text: 'You will receive a notification when complete'},
  {icon: 'truck', text: 'Your other deliveries continue uninterrupted'},
  {icon: 'phone', text: 'Contact support if review takes more than 24 hours'},
];

export function DocumentUnderReviewScreen({navigation}: Props) {
  const viewAllDocuments = () => navigation.reset({index: 0, routes: [{name: 'DocumentsHub'}]});

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Icon name="clock" size={40} color="#1E40AF" />
        </View>
        <Text style={styles.heroTitle}>Document Under Review</Text>
        <Text style={styles.heroDoc}>Driving Licence</Text>
        <Text style={styles.heroSub}>Submitted at 2:00 PM, Sep 6</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            {STEPS.map((step, index) => (
              <React.Fragment key={step.label}>
                <View style={styles.progressStep}>
                  {step.state === 'done' && (
                    <View style={styles.stepDotDone}>
                      <Icon name="check" size={12} color={colors.white} />
                    </View>
                  )}
                  {step.state === 'active' && (
                    <View style={styles.stepDotActive}>
                      <View style={styles.stepDotActiveInner} />
                    </View>
                  )}
                  {step.state === 'pending' && <View style={styles.stepDotPending} />}
                  <Text
                    style={[
                      styles.stepLabel,
                      step.state === 'active' && styles.stepLabelActive,
                      step.state === 'pending' && styles.stepLabelPending,
                    ]}>
                    {step.label}
                  </Text>
                </View>
                {index < STEPS.length - 1 && <View style={[styles.stepConnector, step.state === 'done' && styles.stepConnectorDone]} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>Verification typically takes 1–4 hours during business hours.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What to expect</Text>
          {EXPECTATIONS.map(item => (
            <View key={item.text} style={styles.expectRow}>
              <Icon name={item.icon} size={16} color={colors.textSecondary} />
              <Text style={styles.expectText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={viewAllDocuments}>
          <Text style={styles.outlineButtonText}>View All Documents</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} activeOpacity={0.85}>
          <Text style={styles.ghostButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {
    backgroundColor: colors.infoSurface,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: 56,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  heroIcon: {width: 80, height: 80, borderRadius: 40, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center'},
  heroTitle: {...typography.h4, fontSize: 20, color: '#1E40AF', textAlign: 'center'},
  heroDoc: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary, marginTop: spacing.xs},
  heroSub: {...typography.label, fontSize: 13, color: colors.textSecondary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  progressCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  progressRow: {flexDirection: 'row', alignItems: 'flex-start'},
  progressStep: {alignItems: 'center', gap: 6, width: 60},
  stepConnector: {flex: 1, height: 2, backgroundColor: colors.border, marginTop: 13},
  stepConnectorDone: {backgroundColor: colors.primary},
  stepDotDone: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  stepDotActive: {width: 28, height: 28, borderRadius: 14, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center'},
  stepDotActiveInner: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white},
  stepDotPending: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.border},
  stepLabel: {...typography.captionMedium, fontSize: 10, color: colors.primary, textAlign: 'center'},
  stepLabelActive: {color: '#3B82F6', fontWeight: '700'},
  stepLabelPending: {color: colors.textMuted},
  noteBanner: {backgroundColor: '#DBEAFE', borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  noteText: {...typography.label, fontSize: 13, color: '#1E40AF'},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.sm},
  expectRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginTop: spacing.xs},
  expectText: {...typography.label, fontSize: 13, color: colors.textSecondary, flex: 1},
  outlineButton: {borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
  ghostButton: {paddingVertical: spacing.md, alignItems: 'center'},
  ghostButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
