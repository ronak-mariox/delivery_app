import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateSessionExpired'>;

const SESSION_ROWS = [
  {label: 'Device', value: 'Samsung Galaxy A53'},
  {label: 'Location', value: 'Bengaluru, IN'},
  {label: 'Last active', value: 'Sep 6, 2:30 PM'},
];

export function StateSessionExpiredScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <Icon name="clock" size={30} color={colors.textMuted} />
        </View>
        <Text style={styles.title}>Session Expired</Text>
        <Text style={styles.subtitle}>Your session has timed out for security. Please log in again.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session Info</Text>
          {SESSION_ROWS.map(row => (
            <View key={row.label} style={styles.row}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.safeBanner}>
          <Icon name="shield" size={16} color={colors.primary} />
          <Text style={styles.safeText}>Your earnings and data are safe. Session expiry is a routine security measure.</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Log In Again" onPress={() => navigation.navigate('StateSessionRecovery')} />
        <Button label="Use Different Account" variant="ghost" onPress={() => navigation.navigate('Login')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl},
  body: {alignItems: 'center'},
  iconCircle: {width: 88, height: 88, borderRadius: radius.xxl, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  title: {...typography.h4, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl},
  card: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg},
  cardTitle: {...typography.overline, color: colors.textMuted, letterSpacing: 0.5, marginBottom: spacing.sm},
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.xxs},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  safeBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, width: '100%', backgroundColor: colors.primarySurface, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  safeText: {flex: 1, ...typography.caption, color: colors.primaryDark, lineHeight: 18},
  actions: {gap: spacing.sm, marginTop: spacing.xxl},
});
