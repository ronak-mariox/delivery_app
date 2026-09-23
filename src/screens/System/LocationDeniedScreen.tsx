import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationDenied'>;

const STEPS = ['Open device Settings', 'Tap Apps → Verdant Rider', 'Tap Permissions → Location', 'Select "Allow all the time"'];

export function LocationDeniedScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Icon name="map-pin" size={52} color={colors.danger} />
          <View style={styles.badge}>
            <Icon name="x" size={14} color={colors.white} />
          </View>
        </View>
        <View style={styles.deniedBadge}>
          <Text style={styles.deniedBadgeText}>LOCATION DENIED</Text>
        </View>
        <Text style={styles.title}>Location Access Denied</Text>
        <Text style={styles.subtitle}>Without location access, you cannot receive delivery requests. Enable it manually in your device settings.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>How to enable location</Text>
          {STEPS.map((step, index) => (
            <View key={step} style={[styles.stepRow, index > 0 && styles.stepRowBorder]}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Open Settings" icon="shield" onPress={() => navigation.navigate('LocationPermission')} />
        <Button label="Try Again" variant="secondary" onPress={() => navigation.navigate('LocationPermission')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingVertical: spacing.huge},
  body: {alignItems: 'center'},
  iconWrap: {width: 110, height: 110, borderRadius: 55, backgroundColor: colors.dangerSurface, borderWidth: 2, borderColor: colors.dangerBorder, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  badge: {position: 'absolute', right: -2, bottom: -2, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.danger, borderWidth: 3, borderColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  deniedBadge: {backgroundColor: colors.danger, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4, marginBottom: spacing.md},
  deniedBadgeText: {...typography.overline, fontSize: 11, color: colors.white},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl},
  card: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodyBold, fontSize: 13, color: colors.textLabel, marginBottom: spacing.sm},
  stepRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm},
  stepRowBorder: {borderTopWidth: 1, borderTopColor: '#F3F4F6'},
  stepBadge: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primarySurface, borderWidth: 1.5, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  stepBadgeText: {...typography.captionSemibold, color: colors.primary},
  stepText: {flex: 1, ...typography.label, color: colors.textLabel},
  actions: {gap: spacing.sm},
});
