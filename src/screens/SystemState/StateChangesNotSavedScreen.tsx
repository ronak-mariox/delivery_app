import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateChangesNotSaved'>;

export function StateChangesNotSavedScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} scroll contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Icon name="file-text" size={40} color={colors.textMuted} />
          <View style={styles.badge}>
            <Icon name="x" size={10} color={colors.white} />
          </View>
        </View>
        <Text style={styles.title}>Changes Not Saved</Text>
        <Text style={styles.subtitle}>We couldn't save your changes. Please try again.</Text>

        <View style={styles.reasonCard}>
          <View style={styles.reasonIcon}>
            <Icon name="alert-triangle" size={16} color={colors.warning} />
          </View>
          <View style={styles.reasonText}>
            <Text style={styles.reasonTitle}>Network error during save</Text>
            <Text style={styles.reasonSubtitle}>Your original data is unchanged.</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Try Again" onPress={() => navigation.goBack()} />
        <Button label="Discard Changes" variant="ghost" textColor={colors.danger} onPress={() => navigation.goBack()} />
        <Text style={styles.footerNote}>If this persists, contact support — your data is safe.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingVertical: spacing.huge},
  body: {alignItems: 'center'},
  iconWrap: {width: 64, height: 64, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  badge: {
    position: 'absolute',
    right: -4,
    top: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {...typography.h4, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl},
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  reasonIcon: {paddingTop: 1},
  reasonText: {flex: 1},
  reasonTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  reasonSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: spacing.xxs},
  actions: {gap: spacing.xs},
  footerNote: {...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs},
});
