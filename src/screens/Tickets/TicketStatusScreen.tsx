import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketStatus'>;

const TABS = ['Open', 'Resolved', 'Closed'];

export function TicketStatusScreen({navigation}: Props) {
  const [activeTab, setActiveTab] = useState('Open');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket Status</Text>
      </View>

      <View style={styles.tabsWrap}>
        {TABS.map(tab => {
          const active = tab === activeTab;
          return (
            <TouchableOpacity key={tab} style={[styles.tab, active && styles.tabActive]} activeOpacity={0.8} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {activeTab === 'Open' ? (
          <TouchableOpacity style={styles.ticketRow} activeOpacity={0.8} onPress={() => navigation.navigate('TicketDetail')}>
            <View style={styles.ticketTopRow}>
              <Text style={styles.ticketId}>#ISS-30012</Text>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>OPEN</Text>
              </View>
            </View>
            <Text style={styles.ticketMeta}>Delivery Issue · Sep 6</Text>
            <Text style={styles.ticketAgent}>Agent: Vikram S.</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.emptyText}>No {activeTab.toLowerCase()} tickets.</Text>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('SupportSelectIssueType')}>
          <Text style={styles.primaryButtonText}>Create New Ticket</Text>
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
  tabsWrap: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  tab: {backgroundColor: '#F3F4F6', borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  tabActive: {backgroundColor: colors.primary},
  tabText: {...typography.bodySemibold, fontSize: 13, color: colors.textSecondary},
  tabTextActive: {color: colors.white},
  body: {padding: spacing.lg, gap: spacing.sm, paddingBottom: 120},
  ticketRow: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  ticketTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  ticketId: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  statusPill: {backgroundColor: colors.warningSurface, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 3},
  statusPillText: {...typography.bodyBold, fontSize: 11, color: '#B45309'},
  ticketMeta: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs},
  ticketAgent: {...typography.caption, fontSize: 12, color: colors.primary, marginTop: 2},
  emptyText: {...typography.body, fontSize: 14, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xxl},
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
