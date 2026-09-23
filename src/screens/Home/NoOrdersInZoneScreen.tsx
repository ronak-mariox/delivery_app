import React, {useCallback, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {api, getApiErrorMessage} from '../../services/api';
import {useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'NoOrdersInZone'>;

export function NoOrdersInZoneScreen({navigation}: Props) {
  const {refreshAvailable} = useOrders();
  const [goingOffline, setGoingOffline] = useState(false);

  const handleGoOffline = useCallback(async () => {
    setGoingOffline(true);
    try {
      await api.patch('/driver/status', {isOnline: false});
      navigation.reset({index: 0, routes: [{name: 'Home'}]});
    } catch (err) {
      Alert.alert('Could not go offline', getApiErrorMessage(err));
      setGoingOffline(false);
    }
  }, [navigation]);

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineBadgeText}>ONLINE</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.iconOuter}>
          <View style={[styles.ring, styles.ringLg]} />
          <View style={[styles.ring, styles.ringMd]} />
          <View style={styles.iconInner}>
            <Icon name="bicycle" size={44} color={colors.textMuted} />
          </View>
        </View>
        <Text style={styles.title}>No Orders Right Now</Text>
        <Text style={styles.subtitle}>
          There are no available deliveries matching your current location right now. Stay online — orders can appear anytime.
        </Text>

        <View style={styles.card}>
          <Button
            label="Check for New Orders"
            variant="secondary"
            icon="refresh"
            onPress={() => refreshAvailable().catch(() => {})}
          />
        </View>

        <Text style={styles.footnote}>You're still online — orders will be assigned automatically</Text>
      </View>

      <View style={styles.footer}>
        <Button label="Go Offline" variant="secondary" loading={goingOffline} onPress={handleGoOffline} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.lg},
  onlineBadge: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 5},
  onlineDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#A7F3D0'},
  onlineBadgeText: {...typography.bodyBold, fontSize: 12, color: colors.white},
  body: {flex: 1, alignItems: 'center', backgroundColor: colors.background, padding: spacing.xl, gap: spacing.md},
  iconOuter: {width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  ring: {position: 'absolute', borderRadius: 100, borderWidth: 1.5, borderColor: colors.border},
  ringLg: {width: 200, height: 200, opacity: 0.5},
  ringMd: {width: 170, height: 170, opacity: 0.75},
  iconInner: {width: 140, height: 140, borderRadius: 70, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.sm},
  card: {width: '100%'},
  footnote: {...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
