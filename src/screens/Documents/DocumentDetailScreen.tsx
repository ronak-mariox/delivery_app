import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentDetail'>;

const INFO_ROWS = [
  {label: 'Document Type', value: 'Driving Licence'},
  {label: 'Document Number', value: 'KA0120230012345'},
  {label: 'Uploaded On', value: 'Aug 14, 2024'},
  {label: 'Verified On', value: 'Aug 15, 2024'},
  {label: 'Expiry Date', value: 'May 4, 2033'},
];

const TIMELINE = [
  {label: 'Uploaded', date: 'Aug 14, 2024'},
  {label: 'Under Review', date: 'Aug 14, 2024'},
  {label: 'Verified', date: 'Aug 15, 2024'},
];

export function DocumentDetailScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driving Licence</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.thumbCard} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentPreview')}>
          <View style={styles.thumbInner}>
            <View style={[styles.thumbLine, {width: 136}]} />
            <View style={[styles.thumbLine, {width: 102}]} />
            <View style={[styles.thumbLine, {width: 119}]} />
            <View style={[styles.thumbLine, {width: 85}]} />
            <View style={[styles.thumbLine, {width: 110}]} />
            <View style={styles.thumbIcon}>
              <Icon name="file-text" size={32} color={colors.border} />
            </View>
          </View>
          <View style={styles.thumbOverlay}>
            <Text style={styles.thumbOverlayText}>Tap to view full document</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.card}>
          {INFO_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.infoRow, index < INFO_ROWS.length - 1 && styles.infoRowBorder]}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.timelineTitle}>Verification Timeline</Text>
          {TIMELINE.map((step, index) => (
            <View key={step.label} style={styles.timelineRow}>
              <View style={styles.timelineTrack}>
                <View style={styles.timelineDot}>
                  <Icon name="check" size={14} color={colors.primary} />
                </View>
                {index < TIMELINE.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineText}>
                <Text style={styles.timelineLabel}>{step.label}</Text>
                <Text style={styles.timelineDate}>{step.date}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentPreview')}>
            <Icon name="eye" size={18} color={colors.white} />
            <Text style={styles.primaryButtonText}>View Full</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentReplaceLicence')}>
            <Icon name="refresh" size={18} color={colors.textPrimary} />
            <Text style={styles.outlineButtonText}>Replace</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85}>
            <Icon name="download" size={18} color={colors.textSecondary} />
            <Text style={styles.outlineButtonTextMuted}>Download</Text>
          </TouchableOpacity>
        </View>
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
  thumbCard: {height: 160, borderRadius: radius.xxl, backgroundColor: colors.dark800, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  thumbInner: {backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.md, width: 190, gap: 6},
  thumbLine: {height: 7, borderRadius: 3, backgroundColor: colors.border},
  thumbIcon: {alignSelf: 'flex-end', marginTop: spacing.md},
  thumbOverlay: {position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', paddingVertical: spacing.sm},
  thumbOverlayText: {...typography.label, fontSize: 13, color: colors.white},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, ...shadows.sm},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm},
  infoRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  infoLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  infoValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  timelineTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.sm},
  timelineRow: {flexDirection: 'row', gap: spacing.md},
  timelineTrack: {alignItems: 'center'},
  timelineDot: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  timelineLine: {width: 2, flex: 1, minHeight: 20, backgroundColor: colors.primary, marginVertical: 2},
  timelineText: {paddingBottom: spacing.md, paddingTop: 2},
  timelineLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  timelineDate: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  actionsRow: {flexDirection: 'row', gap: spacing.sm},
  primaryButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.md},
  primaryButtonText: {...typography.captionSemibold, fontSize: 13, color: colors.white},
  outlineButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, paddingVertical: spacing.md},
  outlineButtonText: {...typography.captionSemibold, fontSize: 13, color: colors.textPrimary},
  outlineButtonTextMuted: {...typography.captionSemibold, fontSize: 13, color: colors.textSecondary},
});
