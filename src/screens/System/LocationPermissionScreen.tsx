import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationPermission'>;

export function LocationPermissionScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconOuter}>
          <View style={styles.iconRing} />
          <Icon name="map-pin" size={64} color={colors.primary} filled />
        </View>
        <Text style={styles.title}>Allow Location Access</Text>
        <Text style={styles.subtitle}>
          Verdant Rider needs your precise location to show you nearby delivery requests and navigate to pickup points.
        </Text>

        <View style={styles.reasons}>
          <ReasonRow icon="map-pin" title="Real-time location" subtitle="For receiving nearby delivery requests" />
          <ReasonRow icon="clock" title="Background location" subtitle="While the app is running in background" />
        </View>

        <Text style={styles.footnote}>
          Your location data is never shared with third parties and is used only to connect you with deliveries.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label="Allow Location Access" onPress={() => navigation.navigate('EnableNotifications')} />
        <Button label="Not Now" variant="ghost" onPress={() => navigation.navigate('EnableNotifications')} />
      </View>
    </Screen>
  );
}

function ReasonRow({icon, title, subtitle}: {icon: React.ComponentProps<typeof Icon>['name']; title: string; subtitle: string}) {
  return (
    <View style={styles.reasonRow}>
      <View style={styles.reasonIcon}>
        <Icon name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.reasonText}>
        <Text style={styles.reasonTitle}>{title}</Text>
        <Text style={styles.reasonSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingVertical: spacing.huge},
  body: {alignItems: 'center'},
  iconOuter: {width: 180, height: 180, borderRadius: 90, backgroundColor: colors.primarySurfaceAlt, borderWidth: 2, borderColor: colors.primaryBorder, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xxl},
  iconRing: {position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: colors.primary, opacity: 0.3},
  title: {...typography.h3, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xxl},
  reasons: {width: '100%', gap: spacing.md, marginBottom: spacing.xxl},
  reasonRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  reasonIcon: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  reasonText: {flex: 1},
  reasonTitle: {...typography.labelSemibold, color: colors.textPrimary},
  reasonSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  footnote: {...typography.caption, color: colors.textMuted, textAlign: 'center'},
  actions: {gap: spacing.sm},
});
