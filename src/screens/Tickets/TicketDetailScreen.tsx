import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketDetail'>;

const DETAIL_ROWS = [
  {label: 'Issue Type', value: 'Delivery Issue'},
  {label: 'Category', value: 'Customer Unreachable'},
  {label: 'Order', value: '#VR-84821'},
  {label: 'Description', value: 'Customer did not respond after multiple attempts at the delivery address.'},
  {label: 'Evidence', value: '2 photos'},
  {label: 'Priority', value: 'Medium'},
  {label: 'Created', value: 'Sep 6, 3:20 PM'},
];

const ACTIVITY = [
  {title: 'Ticket created', time: 'Sep 6, 3:20 PM', done: true},
  {title: 'Agent assigned', time: 'Sep 6, 3:22 PM', sub: 'Vikram S. from Verdant Support', done: true},
  {title: 'Under investigation', time: 'Sep 6, 3:24 PM', done: false},
];

export function TicketDetailScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>#ISS-30012</Text>
        <View style={styles.flex} />
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>OPEN</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {DETAIL_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.detailRow, index < DETAIL_ROWS.length - 1 && styles.rowBorder]}>
              <Text style={styles.detailLabel}>{row.label}</Text>
              <Text style={styles.detailValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Activity</Text>
        {ACTIVITY.map((item, index) => (
          <View key={item.title} style={styles.activityRow}>
            <View style={styles.activityTrack}>
              <View style={[styles.activityDot, item.done ? styles.activityDotDone : styles.activityDotActive]}>
                {item.done ? <Icon name="check" size={12} color={colors.white} /> : <View style={styles.activityDotActiveInner} />}
              </View>
              {index < ACTIVITY.length - 1 && <View style={styles.activityLine} />}
            </View>
            <View style={styles.activityText}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityTime}>{item.time}</Text>
              {item.sub && <Text style={styles.activitySub}>{item.sub}</Text>}
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('TicketChat')}>
          <Text style={styles.primaryButtonText}>Reply to Agent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} activeOpacity={0.85} onPress={() => navigation.navigate('TicketClosed')}>
          <Text style={styles.ghostButtonText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('TicketEscalate')}>
          <Text style={styles.outlineButtonText}>Escalate</Text>
        </TouchableOpacity>
      </View>
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
  statusPill: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4},
  statusPillText: {...typography.bodyBold, fontSize: 12, color: '#B45309'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 120},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  detailRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  detailLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  detailValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary, textAlign: 'right', flexShrink: 1},
  sectionTitle: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary, marginTop: spacing.sm},
  activityRow: {flexDirection: 'row', gap: spacing.md},
  activityTrack: {alignItems: 'center'},
  activityDot: {width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  activityDotDone: {backgroundColor: colors.primarySurface},
  activityDotActive: {backgroundColor: colors.primary},
  activityDotActiveInner: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.white},
  activityLine: {width: 2, flex: 1, minHeight: 24, backgroundColor: colors.border, marginVertical: 2},
  activityText: {flex: 1, paddingBottom: spacing.lg},
  activityTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  activityTime: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  activitySub: {...typography.caption, fontSize: 12, color: colors.primary, marginTop: 2},
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
  primaryButton: {flex: 1.3, backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 13, color: colors.white},
  ghostButton: {flex: 0.6, alignItems: 'center', justifyContent: 'center'},
  ghostButtonText: {...typography.bodyMedium, fontSize: 13, color: colors.textSecondary},
  outlineButton: {flex: 1, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 13, color: colors.primary},
});
