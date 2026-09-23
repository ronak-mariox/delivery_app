import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentVerified'>;

const SUMMARY_ROWS = [
  {label: 'Verified on', value: 'Sep 6, 2026'},
  {label: 'Valid until', value: 'May 4, 2033'},
  {label: 'Verified by', value: 'Verdant Team'},
];

export function DocumentVerifiedScreen({navigation}: Props) {
  const backToDocuments = () => navigation.reset({index: 0, routes: [{name: 'DocumentsHub'}]});

  return (
    <View style={styles.container}>
      <View style={styles.heroHeader}>
        <View style={styles.checkCircle}>
          <Icon name="check" size={36} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Document Verified!</Text>
        <Text style={styles.heroSubtitle}>Driving Licence · KA0120230012345</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>VERIFICATION SUMMARY</Text>
          {SUMMARY_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.summaryRow, index < SUMMARY_ROWS.length - 1 && styles.rowBorder]}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />

        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentDetail')}>
          <Text style={styles.outlineButtonText}>View Document</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={backToDocuments}>
          <Text style={styles.primaryButtonText}>Back to Documents</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  heroHeader: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingTop: 56,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  checkCircle: {width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center'},
  heroTitle: {...typography.h3, fontSize: 22, color: colors.white},
  heroSubtitle: {...typography.label, fontSize: 14, color: 'rgba(255,255,255,0.85)'},
  body: {padding: spacing.lg, gap: spacing.md, flexGrow: 1, paddingBottom: spacing.xxxl},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, overflow: 'hidden', ...shadows.sm},
  cardLabel: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase', padding: spacing.lg, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  summaryLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  summaryValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  spacer: {flex: 1, minHeight: spacing.xl},
  outlineButton: {borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
});
