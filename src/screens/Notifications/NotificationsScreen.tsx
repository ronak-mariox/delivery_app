import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {NOTIFICATIONS, NotificationAccent, NotificationCategory, NotificationListItem, NotificationSection} from './notificationsData';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

type Tab = 'All' | NotificationCategory;
const TABS: Tab[] = ['All', 'Orders', 'Earnings', 'Account', 'System'];
const SECTIONS: NotificationSection[] = ['Today', 'Yesterday'];

const ACCENT_ICON_BG: Record<NotificationAccent, string> = {
  green: colors.primarySurface,
  amber: colors.warningSurface,
  blue: colors.infoSurface,
  gray: '#F3F4F6',
  dark: colors.dark800,
};
const ACCENT_ICON_COLOR: Record<NotificationAccent, string> = {
  green: colors.primary,
  amber: colors.warning,
  blue: colors.info,
  gray: colors.textSecondary,
  dark: colors.white,
};
const ACCENT_BORDER: Record<NotificationAccent, string> = {
  green: colors.primary,
  amber: colors.warning,
  blue: colors.info,
  gray: colors.border,
  dark: colors.dark800,
};

export function NotificationsScreen({navigation}: Props) {
  const [tab, setTab] = useState<Tab>('All');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const isUnread = (item: NotificationListItem) => item.defaultUnread && !readIds.has(item.id);
  const unreadCount = NOTIFICATIONS.filter(isUnread).length;

  const markRead = (id: string) => setReadIds(prev => new Set(prev).add(id));
  const markSectionRead = (section: NotificationSection) => {
    setReadIds(prev => {
      const next = new Set(prev);
      NOTIFICATIONS.filter(n => n.section === section).forEach(n => next.add(n.id));
      return next;
    });
  };

  const handlePress = (item: NotificationListItem) => {
    markRead(item.id);
    if (item.id === 'legacy-delivery-completed') {
      navigation.navigate('DeliveryHistoryDetail', {orderId: 'VR-84821'});
    } else if (item.id === 'legacy-payout-processed') {
      navigation.navigate('PayoutSuccessful');
    } else if (item.id === 'sync-failed') {
      navigation.navigate('StateGenericError');
    } else {
      navigation.navigate('NotificationDetail', {id: item.id});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="filter" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow} style={styles.tabScroll}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={[styles.tabPill, tab === t && styles.tabPillActive]} activeOpacity={0.8} onPress={() => setTab(t)}>
            <Text style={[styles.tabPillText, tab === t && styles.tabPillTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {SECTIONS.map(section => {
          const items = NOTIFICATIONS.filter(n => n.section === section && (tab === 'All' || n.category === tab));
          if (items.length === 0) {
            return null;
          }
          return (
            <View key={section} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>{section.toUpperCase()}</Text>
                <TouchableOpacity onPress={() => markSectionRead(section)}>
                  <Text style={styles.markReadLink}>Mark all read</Text>
                </TouchableOpacity>
              </View>
              {items.map(item => {
                const unread = isUnread(item);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.row, unread && {borderColor: ACCENT_BORDER[item.accent]}]}
                    activeOpacity={0.7}
                    onPress={() => handlePress(item)}>
                    {unread && <View style={styles.unreadDot} />}
                    <View style={[styles.iconCircle, {backgroundColor: unread ? ACCENT_ICON_BG[item.accent] : '#F3F4F6'}]}>
                      <Icon name={item.icon} size={18} color={unread ? ACCENT_ICON_COLOR[item.accent] : colors.textMuted} />
                    </View>
                    <View style={styles.rowText}>
                      <Text style={[styles.rowTitle, !unread && styles.rowTitleRead]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.rowSubtitle} numberOfLines={1}>
                        {item.subtitle}
                      </Text>
                    </View>
                    <View style={styles.rowRight}>
                      <Text style={styles.rowTime}>{item.time}</Text>
                      <Icon name="chevron-right" size={14} color={colors.textMuted} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
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
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  unreadBadge: {backgroundColor: '#D92D20', borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 2},
  unreadBadgeText: {...typography.captionSemibold, fontSize: 11, color: colors.white},
  tabScroll: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, flexGrow: 0},
  tabRow: {flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  tabPill: {backgroundColor: '#F3F4F6', borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 5},
  tabPillActive: {backgroundColor: colors.primary},
  tabPillText: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary},
  tabPillTextActive: {color: colors.white},
  body: {padding: spacing.lg, paddingBottom: spacing.xxxl},
  section: {marginBottom: spacing.md},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  sectionLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5},
  markReadLink: {...typography.captionMedium, fontSize: 12, color: colors.primary},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    ...shadows.sm,
  },
  unreadDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#D92D20'},
  iconCircle: {width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center'},
  rowText: {flex: 1},
  rowTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  rowTitleRead: {...typography.label, fontWeight: '400', color: colors.textSecondary},
  rowSubtitle: {...typography.caption, fontSize: 12, color: colors.textMuted, marginTop: 2},
  rowRight: {alignItems: 'flex-end', gap: 4},
  rowTime: {...typography.caption, fontSize: 11, color: colors.textMuted},
});
