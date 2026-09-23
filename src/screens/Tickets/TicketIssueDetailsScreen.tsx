import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketIssueDetails'>;

const IMPACTS = ['Missed delivery', 'Earnings affected', 'Other'];
const SEVERITIES = ['Low', 'Medium', 'High'];

export function TicketIssueDetailsScreen({navigation}: Props) {
  const [impact, setImpact] = useState('Missed delivery');
  const [severity, setSeverity] = useState('Medium');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Icon name="chevron-left" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Issue Details</Text>
        </View>
        <Text style={styles.headerSubtitle}>Delivery Issue — Customer Unreachable</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.label}>Order ID</Text>
          <View style={styles.field}>
            <Text style={styles.fieldText}>VR-84821</Text>
          </View>
        </View>

        <View>
          <Text style={styles.label}>Date</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldText}>Sep 6, 2026</Text>
            <Icon name="calendar" size={18} color={colors.textSecondary} />
          </View>
        </View>

        <View>
          <Text style={styles.label}>Issue Summary</Text>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>Customer did not respond after multiple attempts</Text>
          </View>
        </View>

        <View>
          <Text style={styles.label}>Impact</Text>
          <View style={styles.chipsRow}>
            {IMPACTS.map(item => {
              const active = item === impact;
              return (
                <TouchableOpacity key={item} style={[styles.chip, active && styles.chipActive]} activeOpacity={0.8} onPress={() => setImpact(item)}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View>
          <Text style={styles.label}>Severity</Text>
          <View style={styles.severityRow}>
            {SEVERITIES.map(item => {
              const active = item === severity;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.severityButton, active && styles.severityButtonActive]}
                  activeOpacity={0.8}
                  onPress={() => setSeverity(item)}>
                  <Text style={[styles.severityText, active && styles.severityTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={styles.addScreenshot} activeOpacity={0.8}>
          <Icon name="upload" size={18} color={colors.textSecondary} />
          <Text style={styles.addScreenshotText}>Add Screenshot</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('TicketUploadEvidence')}>
          <Text style={styles.primaryButtonText}>Continue to Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  headerTitle: {...typography.title, fontSize: 18, color: colors.textPrimary},
  headerSubtitle: {...typography.label, fontSize: 13, color: colors.textSecondary, marginLeft: 34, marginTop: spacing.xs},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 120},
  label: {...typography.labelSemibold, fontSize: 13, color: '#374151', marginBottom: spacing.sm},
  field: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  fieldText: {...typography.body, fontSize: 14, color: colors.textPrimary},
  summaryBox: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.md, padding: spacing.md, minHeight: 80},
  summaryText: {...typography.body, fontSize: 14, color: colors.textPrimary},
  chipsRow: {flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap'},
  chip: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  chipActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  chipText: {...typography.bodyMedium, fontSize: 13, color: colors.textSecondary},
  chipTextActive: {color: colors.primary},
  severityRow: {flexDirection: 'row', gap: spacing.sm},
  severityButton: {flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center'},
  severityButtonActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  severityText: {...typography.bodySemibold, fontSize: 13, color: colors.textSecondary},
  severityTextActive: {color: colors.primary},
  addScreenshot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  addScreenshotText: {...typography.body, fontSize: 14, color: colors.textSecondary},
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
});
