import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, EmptyState, ErrorState, Icon, Loader} from '../../components';
import {getApiErrorMessage} from '../../services/api';
import {DriverNotification, listNotifications, markNotificationRead} from '../../services/driverApi';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {accentFor, formatDateTime, iconFor, orderIdFor} from './notificationHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationDetail'>;

function InfoRow({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function NotificationDetailScreen({route, navigation}: Props) {
  const {id} = route.params;
  const [item, setItem] = useState<DriverNotification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const found = (await listNotifications()).find(n => n.id === id) ?? null;
      setItem(found);
      if (found && !found.isRead) {
        markNotificationRead(found.id).catch(() => {});
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const renderBody = () => {
    if (loading) {
      return <Loader fullscreen />;
    }
    if (error) {
      return <ErrorState title="Couldn't load notification" description={error} onRetry={load} />;
    }
    if (!item) {
      return <EmptyState icon="bell" title="Notification not found" description="It may have been removed." />;
    }

    const accent = accentFor(item.category);
    const isSystem = item.category === 'System';
    const orderId = orderIdFor(item);

    return (
      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, {backgroundColor: isSystem ? colors.dark900 : accent.bg}]}>
          <View style={[styles.bannerIconWrap, isSystem && styles.bannerIconWrapDark]}>
            <Icon name={iconFor(item.category)} size={22} color={accent.color} />
          </View>
          <View style={styles.flex}>
            <Text style={[styles.bannerTitle, {color: isSystem ? colors.white : colors.textPrimary}]}>{item.title}</Text>
            <Text style={[styles.bannerTime, {color: isSystem ? colors.textMuted : accent.color}]}>{formatDateTime(item.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.bodyText}>{item.subtitle}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Details</Text>
          <InfoRow label="Category" value={item.category} />
          {!!item.orderNumber && <InfoRow label="Order" value={`#${item.orderNumber}`} />}
          <InfoRow label="Received" value={formatDateTime(item.createdAt)} />
        </View>

        {orderId && <Button label="Open order" onPress={() => navigation.navigate('DeliveryHistoryDetail', {orderId})} />}
        <Button label="Dismiss" variant="secondary" onPress={() => navigation.goBack()} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
      </View>
      {renderBody()}
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
    paddingHorizontal: spacing.xl,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  banner: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radius.xxl, padding: spacing.lg},
  bannerIconWrap: {width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  bannerIconWrapDark: {backgroundColor: 'rgba(255,255,255,0.12)'},
  bannerTitle: {...typography.bodyBold, fontSize: 15},
  bannerTime: {...typography.caption, fontSize: 12, marginTop: 2},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg, ...shadows.sm},
  bodyText: {...typography.body, fontSize: 14, color: colors.textPrimary, lineHeight: 22},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs, marginTop: spacing.xs, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  infoLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  infoValue: {...typography.captionMedium, fontSize: 12, color: colors.textPrimary},
});
