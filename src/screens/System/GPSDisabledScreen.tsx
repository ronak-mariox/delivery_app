import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'GPSDisabled'>;

const BLOCKED = ['Receive nearby delivery requests', 'Get turn-by-turn navigation', 'Track your delivery route'];

const STATUS_ROWS = [
  {label: 'Location Permission', value: 'OK', ok: true},
  {label: 'GPS / Device Location', value: 'OFF', ok: false},
  {label: 'Internet Connection', value: 'OK', ok: true},
  {label: 'Account Status', value: 'OK', ok: true},
];

export function GPSDisabledScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} scroll contentContainerStyle={styles.container}>
      <View style={styles.banner}>
        <View style={styles.bannerDot} />
        <Text style={styles.bannerText}>GPS IS DISABLED</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.iconOuter}>
          <Icon name="shield" size={30} color={colors.warning} />
        </View>
        <Text style={styles.title}>GPS is Turned Off</Text>
        <Text style={styles.subtitle}>Your device GPS is disabled. Enable it to allow the app to detect your location and connect you with deliveries.</Text>

        <View style={styles.warningCard}>
          <Text style={styles.warningTitle}>Without GPS you cannot:</Text>
          {BLOCKED.map(item => (
            <View key={item} style={styles.warningRow}>
              <Icon name="x" size={14} color={colors.warning} />
              <Text style={styles.warningText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>System Status</Text>
          {STATUS_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.statusRow, index > 0 && styles.statusRowBorder]}>
              <View style={[styles.statusIcon, {backgroundColor: row.ok ? colors.primarySurface : '#FFFAEB'}]}>
                <Icon name={row.ok ? 'check' : 'alert-circle'} size={12} color={row.ok ? colors.primary : colors.warning} />
              </View>
              <Text style={[styles.statusLabel, !row.ok && styles.statusLabelWarning]}>{row.label}</Text>
              <Text style={[styles.statusValue, {color: row.ok ? colors.primary : colors.warning}]}>{row.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Enable GPS Now" onPress={() => navigation.navigate('EnableGPSInstructions')} />
        <Button label="Retry" variant="secondary" onPress={() => navigation.navigate('LocationPermission')} />
        <Button label="GPS enabled but still not working?" variant="ghost" textColor={colors.textSecondary} onPress={() => navigation.navigate('StateGPSError')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'space-between'},
  banner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: '#FFFAEB', borderBottomWidth: 2, borderBottomColor: '#FEC84B', paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.md},
  bannerDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning},
  bannerText: {...typography.overline, color: '#B54708', letterSpacing: 0.5},
  body: {alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.xl},
  iconOuter: {width: 160, height: 160, borderRadius: 80, borderWidth: 2, borderColor: colors.borderStrong, borderStyle: 'dashed', backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl},
  warningCard: {width: '100%', backgroundColor: '#FFFAEB', borderWidth: 1, borderColor: '#FEC84B', borderRadius: radius.lg, padding: spacing.md, gap: spacing.xs, marginBottom: spacing.lg},
  warningTitle: {...typography.bodyBold, fontSize: 12, color: '#B54708'},
  warningRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  warningText: {...typography.label, fontSize: 13, color: colors.warningText},
  statusCard: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  statusTitle: {...typography.captionSemibold, color: colors.textLabel, marginBottom: spacing.sm},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm},
  statusRowBorder: {borderTopWidth: 1, borderTopColor: '#F3F4F6'},
  statusIcon: {width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center'},
  statusLabel: {flex: 1, ...typography.label, color: colors.textLabel},
  statusLabelWarning: {...typography.labelSemibold, color: '#B54708'},
  statusValue: {...typography.captionSemibold},
  actions: {gap: spacing.sm, padding: spacing.xxl},
});
