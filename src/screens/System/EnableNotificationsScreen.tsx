import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EnableNotifications'>;

const PREVIEWS = [
  {icon: 'bicycle' as const, title: 'New delivery request', subtitle: 'Shown full-screen while you are online', time: '', highlighted: true},
  {icon: 'credit-card' as const, title: 'Earnings updates', subtitle: 'When a delivery is paid out', time: '', highlighted: false},
  {icon: 'credit-card' as const, title: 'Incentive progress', subtitle: 'When you unlock a bonus', time: '', highlighted: false},
];

const ALERTS = ['New delivery requests while online', 'Earnings & payout updates', 'Bonus & incentive unlocks', 'Account & support updates'];

export function EnableNotificationsScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} scroll contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Icon name="bell" size={40} color={colors.primary} />
        </View>
        <Text style={styles.title}>In-app alerts</Text>
        <Text style={styles.subtitle}>New requests and updates appear inside the app while it is open. Check the bell icon on Home for anything you missed.</Text>

        <Text style={styles.previewLabel}>PREVIEW</Text>
        <View style={styles.previewList}>
          {PREVIEWS.map(item => (
            <View key={item.title} style={[styles.previewRow, item.highlighted && styles.previewRowHighlighted]}>
              <View style={[styles.previewIcon, item.highlighted && styles.previewIconHighlighted]}>
                <Icon name={item.icon} size={18} color={item.highlighted ? colors.white : colors.textSecondary} />
              </View>
              <View style={styles.previewText}>
                <Text style={styles.previewTitle}>{item.title}</Text>
                <Text style={styles.previewSubtitle}>{item.subtitle}</Text>
              </View>
              <Text style={styles.previewTime}>{item.time}</Text>
            </View>
          ))}
        </View>

        <View style={styles.alertsCard}>
          <Text style={styles.alertsTitle}>You will receive alerts for</Text>
          {ALERTS.map(alert => (
            <View key={alert} style={styles.alertRow}>
              <Icon name="check" size={13} color={colors.primary} />
              <Text style={styles.alertText}>{alert}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Continue" onPress={() => navigation.navigate('FirstTimeSetup')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.huge, gap: spacing.xxl},
  body: {alignItems: 'center'},
  iconWrap: {width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl},
  previewLabel: {...typography.overline, color: colors.textMuted, letterSpacing: 0.5, alignSelf: 'flex-start', marginBottom: spacing.sm},
  previewList: {width: '100%', gap: spacing.sm, marginBottom: spacing.lg},
  previewRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.md},
  previewRowHighlighted: {borderColor: colors.primary},
  previewIcon: {width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  previewIconHighlighted: {backgroundColor: colors.primary},
  previewText: {flex: 1},
  previewTitle: {...typography.labelSemibold, color: colors.textPrimary},
  previewSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  previewTime: {...typography.caption, fontSize: 11, color: colors.textMuted},
  alertsCard: {width: '100%', backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.lg, padding: spacing.md, gap: spacing.xs},
  alertsTitle: {...typography.captionSemibold, color: '#13845A', marginBottom: 2},
  alertRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  alertText: {...typography.caption, color: colors.textLabel},
  actions: {gap: spacing.sm},
});
