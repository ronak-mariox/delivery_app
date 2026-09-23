import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, IconName, Screen} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EnableGPSInstructions'>;

type Tab = 'android' | 'ios';

const STEPS: Record<Tab, {icon: IconName; title: string; subtitle: string}[]> = {
  android: [
    {icon: 'arrow-down', title: 'Swipe down from the top of your screen', subtitle: 'Open the Quick Settings panel'},
    {icon: 'map-pin', title: 'Find the Location tile', subtitle: 'Look for the map pin or "Location" icon'},
    {icon: 'toggle', title: 'Tap to toggle Location ON', subtitle: 'The tile will turn green when active'},
    {icon: 'refresh', title: 'Return to Verdant Rider', subtitle: 'The app will auto-detect your location'},
  ],
  ios: [
    {icon: 'shield', title: 'Open Settings app', subtitle: 'Scroll down and tap Privacy & Security'},
    {icon: 'map-pin', title: 'Tap Location Services', subtitle: 'Make sure the toggle is switched on'},
    {icon: 'toggle', title: 'Find Verdant Rider in the list', subtitle: 'Set it to "While Using the App"'},
    {icon: 'refresh', title: 'Return to Verdant Rider', subtitle: 'The app will auto-detect your location'},
  ],
};

export function EnableGPSInstructionsScreen({navigation}: Props) {
  const [tab, setTab] = useState<Tab>('android');

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Enable GPS</Text>
          <Text style={styles.headerSubtitle}>Follow these steps on your device</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.tabs}>
          <TabButton label="Android" active={tab === 'android'} onPress={() => setTab('android')} />
          <TabButton label="iPhone (iOS)" active={tab === 'ios'} onPress={() => setTab('ios')} />
        </View>

        <View style={styles.steps}>
          {STEPS[tab].map((step, index) => (
            <View key={step.title} style={styles.stepCard}>
              <View style={styles.stepIcon}>
                <Icon name={step.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.stepText}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>STEP {index + 1}</Text>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.altCard}>
          <Text style={styles.altTitle}>Alternative method</Text>
          <Text style={styles.altText}>
            Settings → Location → turn on <Text style={styles.altStrong}>Use Location</Text> → set mode to{' '}
            <Text style={styles.altStrong}>High Accuracy</Text>
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="I've Enabled GPS — Retry" onPress={() => navigation.navigate('LocationPermission')} />
        <Button label="Open Device Settings" variant="secondary" />
      </View>
    </Screen>
  );
}

function TabButton({label, active, onPress}: {label: string; active: boolean; onPress: () => void}) {
  return (
    <TouchableOpacity style={[styles.tab, active && styles.tabActive]} activeOpacity={0.8} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.lg},
  headerText: {flex: 1},
  headerTitle: {...typography.subtitle, fontSize: 16, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  body: {flex: 1, padding: spacing.xl, gap: spacing.lg},
  tabs: {flexDirection: 'row', backgroundColor: colors.background, borderRadius: radius.lg, padding: 4, gap: 4},
  tab: {flex: 1, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md},
  tabActive: {backgroundColor: colors.surface, ...shadows.sm},
  tabText: {...typography.labelSemibold, color: colors.textMuted, fontWeight: '400'},
  tabTextActive: {color: colors.textPrimary, fontWeight: '600'},
  steps: {gap: spacing.md},
  stepCard: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.md},
  stepIcon: {width: 40, height: 40, borderRadius: radius.lg, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  stepText: {flex: 1},
  stepBadge: {alignSelf: 'flex-start', backgroundColor: colors.primarySurface, borderRadius: 4, paddingHorizontal: spacing.xs, paddingVertical: 1, marginBottom: 4},
  stepBadgeText: {...typography.micro, fontSize: 10, color: colors.primary, fontWeight: '700'},
  stepTitle: {...typography.bodySemibold, color: colors.textPrimary},
  stepSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  altCard: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  altTitle: {...typography.captionSemibold, color: colors.textLabel, marginBottom: 4},
  altText: {...typography.caption, color: colors.textSecondary, lineHeight: 18},
  altStrong: {fontWeight: '700', color: colors.textPrimary},
  actions: {gap: spacing.sm, padding: spacing.xl},
});
