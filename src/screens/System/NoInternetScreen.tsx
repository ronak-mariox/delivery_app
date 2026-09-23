import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NoInternet'>;

const STATUS_ROWS = [
  {label: 'Mobile Data', value: 'Off', ok: false},
  {label: 'Wi-Fi', value: 'Not Connected', ok: false},
  {label: 'VPN', value: 'Active', ok: true},
];

const FIXES = ['Turn mobile data on and try again', 'Connect to a Wi-Fi network', 'Move to an area with better signal', 'Disable VPN temporarily'];

export function NoInternetScreen({}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} scroll contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Icon name="wifi-off" size={44} color={colors.danger} />
          <View style={styles.badge}>
            <Icon name="x" size={12} color={colors.white} />
          </View>
        </View>
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.subtitle}>You need an active internet connection to receive and accept delivery requests.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Connection Status</Text>
          {STATUS_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.statusRow, index > 0 && styles.statusRowBorder]}>
              <View style={[styles.statusIcon, {backgroundColor: row.ok ? colors.primarySurface : colors.dangerSurface}]}>
                <Icon name={row.ok ? 'check' : 'x'} size={12} color={row.ok ? colors.primary : colors.danger} />
              </View>
              <Text style={styles.statusLabel}>{row.label}</Text>
              <Text style={[styles.statusValue, {color: row.ok ? colors.primary : colors.danger}]}>{row.value}</Text>
            </View>
          ))}
          <View style={[styles.statusRow, styles.statusRowBorder]}>
            <View style={styles.statusIconNeutral}>
              <View style={styles.statusDotNeutral} />
            </View>
            <Text style={styles.statusLabel}>Last Online</Text>
            <Text style={styles.statusValueNeutral}>4 minutes ago</Text>
          </View>
        </View>

        <View style={styles.fixesCard}>
          <Text style={styles.fixesTitle}>Try these fixes</Text>
          {FIXES.map(fix => (
            <View key={fix} style={styles.fixRow}>
              <Icon name="check" size={12} color={colors.primary} />
              <Text style={styles.fixText}>{fix}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Retry Connection" icon="refresh" />
        <Button label="Open Network Settings" variant="secondary" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingVertical: spacing.huge},
  body: {alignItems: 'center'},
  iconWrap: {width: 120, height: 120, borderRadius: 60, backgroundColor: colors.dangerSurface, borderWidth: 2, borderColor: colors.dangerBorder, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl},
  badge: {position: 'absolute', right: -2, bottom: -2, width: 36, height: 36, borderRadius: 18, backgroundColor: colors.danger, borderWidth: 3, borderColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h3, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl},
  card: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.lg},
  cardTitle: {...typography.bodyBold, fontSize: 13, color: colors.textLabel, marginBottom: spacing.sm},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm},
  statusRowBorder: {borderTopWidth: 1, borderTopColor: '#F3F4F6'},
  statusIcon: {width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center'},
  statusIconNeutral: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  statusDotNeutral: {width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textMuted},
  statusLabel: {flex: 1, ...typography.label, color: colors.textLabel},
  statusValue: {...typography.captionSemibold},
  statusValueNeutral: {...typography.captionSemibold, color: colors.textMuted},
  fixesCard: {width: '100%', backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.lg, padding: spacing.md, gap: spacing.xs},
  fixesTitle: {...typography.captionSemibold, color: '#13845A', marginBottom: 2},
  fixRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  fixText: {...typography.caption, color: colors.textLabel},
  actions: {gap: spacing.sm},
});
