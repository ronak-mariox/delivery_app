import React, {useEffect} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateRetrying'>;

export function StateRetryingScreen({navigation}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('StateSuccess');
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name="refresh" size={36} color={colors.primary} />
      </View>
      <Text style={styles.title}>Retrying...</Text>
      <Text style={styles.subtitle}>Please wait while we try again.</Text>

      <View style={styles.dotsRow}>
        <View style={styles.dotInactive} />
        <View style={styles.dotActive} />
        <View style={styles.dotInactive} />
      </View>

      <View style={styles.attemptBadge}>
        <Text style={styles.attemptText}>Attempt 2 of 3</Text>
      </View>
      <Text style={styles.giveUpNote}>Giving up after 3 attempts</Text>

      <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
      <Pressable style={styles.supportButton} onPress={() => navigation.navigate('SupportHub')}>
        <Text style={styles.supportText}>Contact Support</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl},
  iconCircle: {width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl},
  title: {...typography.h4, fontSize: 20, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, marginTop: spacing.sm},
  dotsRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xxl},
  dotActive: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  dotInactive: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primaryBorder},
  attemptBadge: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, marginTop: spacing.xxl},
  attemptText: {...typography.labelSemibold, fontSize: 13, color: '#B45309'},
  giveUpNote: {...typography.caption, color: colors.textMuted, marginTop: spacing.sm},
  cancelButton: {marginTop: spacing.xxl, paddingVertical: spacing.sm, paddingHorizontal: spacing.md},
  cancelText: {...typography.bodyMedium, color: colors.textSecondary},
  supportButton: {paddingVertical: spacing.sm, paddingHorizontal: spacing.md},
  supportText: {...typography.label, fontSize: 13, color: colors.textMuted},
});
