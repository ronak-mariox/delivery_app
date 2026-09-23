import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateActionFailed'>;

const RED = '#D92D20';

const OPTIONS = [
  {icon: 'refresh', title: 'Retry the action', subtitle: 'Try the same action again', action: 'Retry', variant: 'solid'},
  {icon: 'headphones', title: 'Call support', subtitle: 'Action will be completed manually', action: 'Call', variant: 'outline'},
  {icon: 'alert-circle', title: 'Report and skip', subtitle: 'Order will be reassigned', action: 'Skip', variant: 'danger'},
] as const;

export function StateActionFailedScreen({navigation}: Props) {
  const handlePress = (action: (typeof OPTIONS)[number]['action']) => {
    if (action === 'Retry') {
      navigation.navigate('StateRetrying');
    } else if (action === 'Call') {
      navigation.navigate('SupportHub');
    } else {
      navigation.reset({index: 0, routes: [{name: 'Home'}]});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Icon name="package" size={36} color={colors.white} />
        <Text style={styles.heroTitle}>Action Failed</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.reasonCard}>
          <Text style={styles.reasonIntro}>We couldn't complete that action</Text>
          <Text style={styles.reasonError}>A network or server error interrupted the request. Try again, or get help below.</Text>
        </View>

        <Text style={styles.sectionTitle}>Recovery Options</Text>

        <View style={styles.optionsList}>
          {OPTIONS.map(option => (
            <View key={option.title} style={styles.optionRow}>
              <Icon name={option.icon} size={18} color={option.variant === 'danger' ? RED : colors.primary} />
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <TouchableAction variant={option.variant} label={option.action} onPress={() => handlePress(option.action)} />
            </View>
          ))}
        </View>

        <View style={styles.safeBanner}>
          <Icon name="shield" size={16} color={colors.primaryDark} />
          <Text style={styles.safeText}>Any steps you already completed on this order stay on record even if this action fails.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function TouchableAction({variant, label, onPress}: {variant: 'solid' | 'outline' | 'danger'; label: string; onPress: () => void}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.actionButton,
        variant === 'solid' && styles.actionButtonSolid,
        variant === 'outline' && styles.actionButtonOutline,
        variant === 'danger' && styles.actionButtonDanger,
      ]}>
      <Text
        style={[
          styles.actionButtonText,
          variant === 'solid' && styles.actionButtonTextSolid,
          variant === 'outline' && styles.actionButtonTextOutline,
          variant === 'danger' && styles.actionButtonTextDanger,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: RED, alignItems: 'center', justifyContent: 'center', paddingTop: 52, paddingBottom: spacing.xl, gap: spacing.xs},
  heroTitle: {...typography.title, color: colors.white},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  reasonCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.dangerBorder, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  reasonIntro: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  reasonError: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: spacing.sm},
  sectionTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  optionsList: {gap: spacing.sm},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  optionText: {flex: 1},
  optionTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  optionSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  actionButton: {borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, alignItems: 'center', justifyContent: 'center'},
  actionButtonSolid: {backgroundColor: colors.primary},
  actionButtonOutline: {borderWidth: 1.5, borderColor: colors.primary},
  actionButtonDanger: {borderWidth: 1.5, borderColor: RED},
  actionButtonText: {...typography.captionSemibold, fontSize: 12},
  actionButtonTextSolid: {color: colors.white},
  actionButtonTextOutline: {color: colors.primary},
  actionButtonTextDanger: {color: RED},
  safeBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.primarySurface, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  safeText: {...typography.caption, fontSize: 12, color: colors.primaryDark, flex: 1},
});
