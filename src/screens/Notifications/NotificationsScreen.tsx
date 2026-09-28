import React, {useCallback, useState} from 'react';
import {Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, ErrorState, Icon, Loader} from '../../components';
import {getApiErrorMessage} from '../../services/api';
import {
  clearAllNotifications,
  deleteNotification,
  DriverNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  NotificationCategory,
} from '../../services/driverApi';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {accentFor, formatRelativeTime, iconFor, orderIdFor, sectionFor, SECTIONS} from './notificationHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

type Tab = 'All' | NotificationCategory;
const TABS: Tab[] = ['All', 'Orders', 'Earnings', 'Account', 'System'];

export function NotificationsScreen({navigation}: Props) {
  const [tab, setTab] = useState<Tab>('All');
  const [items, setItems] = useState<DriverNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems(await listNotifications());
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const handleRetry = useCallback(() => {
    setLoading(true);
    load();
  }, [load]);

  const unreadCount = items.filter(n => !n.isRead).length;

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setItems(prev => prev.map(n => ({...n, isRead: true})));
      load();
    } catch (err) {
      Alert.alert('Could not mark as read', getApiErrorMessage(err));
    }
  };

  const handleClearAll = () => {
    Alert.alert('Clear all notifications?', 'This will permanently remove all your notifications.', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Clear all',
        style: 'destructive',
        onPress: async () => {
          try {
            await clearAllNotifications();
            setItems([]);
          } catch (err) {
            Alert.alert('Could not clear notifications', getApiErrorMessage(err));
          }
        },
      },
    ]);
  };

  const handleDelete = (item: DriverNotification) => {
    Alert.alert('Delete notification?', item.title, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNotification(item.id);
            setItems(prev => prev.filter(n => n.id !== item.id));
          } catch (err) {
            Alert.alert('Could not delete', getApiErrorMessage(err));
          }
        },
      },
    ]);
  };

  const handlePress = (item: DriverNotification) => {
    if (!item.isRead) {
      setItems(prev => prev.map(n => (n.id === item.id ? {...n, isRead: true} : n)));
      markNotificationRead(item.id).catch(() => {});
    }
    const orderId = orderIdFor(item);
    if (orderId) {
      navigation.navigate('DeliveryHistoryDetail', {orderId});
    } else {
      navigation.navigate('NotificationDetail', {id: item.id});
    }
  };

  const filtered = items.filter(n => tab === 'All' || n.category === tab);

  const renderList = () => {
    if (loading) {
      return <Loader fullscreen />;
    }
    if (error && items.length === 0) {
      return <ErrorState title="Couldn't load notifications" description={error} onRetry={handleRetry} />;
    }

    return (
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="bell"
            title={tab === 'All' ? 'No notifications yet' : `No ${tab.toLowerCase()} notifications`}
            description="You're all caught up. New updates will show up here."
          />
        ) : (
          SECTIONS.map(section => {
            const sectionItems = filtered.filter(n => sectionFor(n.createdAt) === section);
            if (sectionItems.length === 0) {
              return null;
            }
            return (
              <View key={section} style={styles.section}>
                <Text style={styles.sectionLabel}>{section.toUpperCase()}</Text>
                {sectionItems.map(item => {
                  const unread = !item.isRead;
                  const accent = accentFor(item.category);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.row, unread && {borderColor: accent.border}]}
                      activeOpacity={0.7}
                      onPress={() => handlePress(item)}
                      onLongPress={() => handleDelete(item)}>
                      {unread && <View style={styles.unreadDot} />}
                      <View style={[styles.iconCircle, {backgroundColor: unread ? accent.bg : '#F3F4F6'}]}>
                        <Icon name={iconFor(item.category)} size={18} color={unread ? accent.color : colors.textMuted} />
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
                        <Text style={styles.rowTime}>{formatRelativeTime(item.createdAt)}</Text>
                        <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}} onPress={() => handleDelete(item)} accessibilityLabel="Delete notification">
                          <Icon name="trash" size={14} color={colors.textMuted} />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })
        )}
      </ScrollView>
    );
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
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}} onPress={handleMarkAllRead}>
              <Text style={styles.markReadLink}>Mark all read</Text>
            </TouchableOpacity>
          )}
          {items.length > 0 && (
            <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}} onPress={handleClearAll} accessibilityLabel="Clear all notifications">
              <Icon name="trash" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow} style={styles.tabScroll}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={[styles.tabPill, tab === t && styles.tabPillActive]} activeOpacity={0.8} onPress={() => setTab(t)}>
            <Text style={[styles.tabPillText, tab === t && styles.tabPillTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {renderList()}
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
  headerRight: {flexDirection: 'row', alignItems: 'center', gap: spacing.lg},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  unreadBadge: {backgroundColor: '#D92D20', borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 2},
  unreadBadgeText: {...typography.captionSemibold, fontSize: 11, color: colors.white},
  markReadLink: {...typography.captionMedium, fontSize: 12, color: colors.primary},
  tabScroll: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, flexGrow: 0},
  tabRow: {flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  tabPill: {backgroundColor: '#F3F4F6', borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 5},
  tabPillActive: {backgroundColor: colors.primary},
  tabPillText: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary},
  tabPillTextActive: {color: colors.white},
  body: {padding: spacing.lg, paddingBottom: spacing.xxxl, flexGrow: 1},
  section: {marginBottom: spacing.md},
  sectionLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5},
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
  rowRight: {alignItems: 'flex-end', gap: 6},
  rowTime: {...typography.caption, fontSize: 11, color: colors.textMuted},
});
