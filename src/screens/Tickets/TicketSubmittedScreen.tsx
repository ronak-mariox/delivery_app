import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketSubmitted'>;

const SUMMARY_ROWS = [
  {label: 'Ticket ID', value: '#ISS-30012'},
  {label: 'Category', value: 'Delivery Issue'},
  {label: 'Priority', value: 'Medium'},
  {label: 'Submitted', value: 'Sep 6, 3:20 PM'},
];

const STEPS = [
  {number: '1', title: 'Support reviews your ticket', subtitle: 'Our team reviews the details and evidence you provided.'},
  {number: '2', title: 'Agent contacts you', subtitle: 'A support agent will reach out via your preferred contact method.'},
  {number: '3', title: 'Issue resolved', subtitle: 'We work to resolve your issue and confirm with you.'},
];

export function TicketSubmittedScreen({navigation}: Props) {
  const backToHelp = () => navigation.reset({index: 0, routes: [{name: 'SupportHub'}]});

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Icon name="check" size={32} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Ticket Submitted!</Text>
        <Text style={styles.heroSubtitle}>Issue #ISS-30012 created</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {SUMMARY_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.summaryRow, index < SUMMARY_ROWS.length - 1 && styles.rowBorder]}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>What Happens Next</Text>
        {STEPS.map((step, index) => (
          <View key={step.number} style={styles.stepRow}>
            <View style={styles.stepTrack}>
              <View style={styles.stepDot}>
                <Text style={styles.stepDotText}>{step.number}</Text>
              </View>
              {index < STEPS.length - 1 && <View style={styles.stepLine} />}
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('TicketDetail')}>
          <Text style={styles.primaryButtonText}>View Ticket</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={backToHelp}>
          <Text style={styles.outlineButtonText}>Back to Help</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: colors.primary, alignItems: 'center', gap: spacing.sm, paddingTop: 60, paddingBottom: spacing.xxl, paddingHorizontal: spacing.xl},
  heroIcon: {width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center'},
  heroTitle: {...typography.h3, fontSize: 22, color: colors.white},
  heroSubtitle: {...typography.label, fontSize: 14, color: 'rgba(255,255,255,0.85)'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 120},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  summaryLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  summaryValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  sectionTitle: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary, marginTop: spacing.sm},
  stepRow: {flexDirection: 'row', gap: spacing.md},
  stepTrack: {alignItems: 'center'},
  stepDot: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primarySurface, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  stepDotText: {...typography.bodyBold, fontSize: 12, color: colors.primary},
  stepLine: {width: 2, flex: 1, minHeight: 30, backgroundColor: colors.border, marginVertical: 2},
  stepText: {flex: 1, paddingBottom: spacing.md},
  stepTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  stepSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
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
  primaryButton: {flex: 1, backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  outlineButton: {flex: 1, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
});
