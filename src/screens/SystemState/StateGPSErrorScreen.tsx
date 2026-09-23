import React from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateGPSError'>;

const STATUS_ROWS = [
  {label: 'Location permission', value: 'Granted', ok: true},
  {label: 'GPS hardware', value: 'Not detecting signal', ok: false},
  {label: 'High accuracy mode', value: 'Enabled', ok: true},
  {label: 'Network location', value: 'Available', ok: true},
];

const FIX_STEPS = ['Move to open space away from buildings', 'Restart GPS in phone Settings', 'Restart the Verdant Rider app'];

export function StateGPSErrorScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} scroll contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <Icon name="map-pin-off" size={30} color={colors.danger} />
        </View>
        <Text style={styles.title}>GPS Not Working</Text>
        <Text style={styles.subtitle}>Unable to determine your location. Deliveries require accurate GPS.</Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>GPS Status</Text>
          {STATUS_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.statusRow, index > 0 && styles.statusRowBorder]}>
              <Text style={styles.statusLabel}>{row.label}</Text>
              <View style={styles.statusValueRow}>
                <Icon name={row.ok ? 'check' : 'x'} size={14} color={row.ok ? colors.primary : colors.danger} />
                <Text style={[styles.statusValue, {color: row.ok ? colors.primary : colors.danger}]}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.fixCard}>
          <Text style={styles.fixTitle}>How to fix</Text>
          {FIX_STEPS.map((step, index) => (
            <View key={step} style={styles.fixRow}>
              <View style={styles.fixNumber}>
                <Text style={styles.fixNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.fixText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button label="Open Location Settings" onPress={() => Linking.openSettings()} />
          <Button label="Use Network Location" variant="outline" onPress={() => navigation.goBack()} />
          <Button label="Contact Support" variant="ghost" onPress={() => navigation.navigate('SupportHub')} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl, paddingVertical: spacing.xxl},
  body: {alignItems: 'center'},
  iconCircle: {width: 88, height: 88, borderRadius: radius.xxl, backgroundColor: colors.dangerSurface, borderWidth: 1.5, borderColor: colors.dangerBorder, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  title: {...typography.h4, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg},
  statusCard: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, marginBottom: spacing.lg, overflow: 'hidden'},
  statusTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border},
  statusRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  statusRowBorder: {borderTopWidth: 1, borderTopColor: colors.border},
  statusLabel: {...typography.label, fontSize: 13, color: colors.textPrimary},
  statusValueRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  statusValue: {...typography.captionMedium},
  fixCard: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md, marginBottom: spacing.xl},
  fixTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  fixRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md},
  fixNumber: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  fixNumberText: {...typography.captionSemibold, color: colors.primary},
  fixText: {flex: 1, ...typography.label, fontSize: 13, color: colors.textSecondary},
  actions: {width: '100%', gap: spacing.sm},
});
