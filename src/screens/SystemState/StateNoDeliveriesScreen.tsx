import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateNoDeliveries'>;

const TIPS = ['Move to a busier zone', 'Peak hours: 12–2 PM and 7–9 PM', 'Check incentive zones'];

export function StateNoDeliveriesScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <Icon name="bicycle" size={30} color={colors.textMuted} />
        </View>
        <Text style={styles.title}>No deliveries available</Text>
        <Text style={styles.subtitle}>You are online and ready. Orders will appear here as they come in.</Text>

        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Quick Tips</Text>
          {TIPS.map(tip => (
            <View key={tip} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="View Incentive Zones" variant="outline" onPress={() => navigation.navigate('Incentives')} />
        <Button label="Go Offline" variant="secondary" onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl},
  body: {alignItems: 'center'},
  iconCircle: {width: 88, height: 88, borderRadius: radius.xxl, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  title: {...typography.title, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xxl},
  tipsCard: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  tipsTitle: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.5, marginBottom: spacing.xxs},
  tipRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  tipDot: {width: 4, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong},
  tipText: {...typography.body, color: colors.textSecondary},
  actions: {gap: spacing.sm, marginTop: spacing.xxl},
});
