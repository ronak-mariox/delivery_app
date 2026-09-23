import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateAccessDenied'>;

const REASONS: {icon: 'clock' | 'info' | 'lock'; color: string; text: string}[] = [
  {icon: 'clock', color: colors.textMuted, text: 'Account verification pending'},
  {icon: 'info', color: colors.textMuted, text: 'Feature not available for your account type'},
  {icon: 'lock', color: colors.danger, text: 'Security restriction applied to your account'},
];

export function StateAccessDeniedScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} scroll contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <Icon name="lock" size={56} color={colors.textMuted} />
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.subtitle}>You don't have permission to view this page.</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Possible Reasons</Text>
          {REASONS.map((reason, index) => (
            <View key={reason.text} style={[styles.reasonRow, index > 0 && styles.reasonRowBorder]}>
              <Icon name={reason.icon} size={18} color={reason.color} />
              <Text style={styles.reasonText}>{reason.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Go to Dashboard" onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})} />
        <Button label="Contact Support" variant="outline" onPress={() => navigation.navigate('SupportHub')} />
        <Button
          label="Log Out"
          variant="ghost"
          size="md"
          textColor={colors.danger}
          onPress={() => navigation.navigate('AccountLogout')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingVertical: spacing.huge},
  body: {alignItems: 'center'},
  title: {...typography.h4, color: colors.textPrimary, textAlign: 'center', marginTop: spacing.lg},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xxl},
  card: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, overflow: 'hidden'},
  cardTitle: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  reasonRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  reasonRowBorder: {borderTopWidth: 1, borderTopColor: colors.border},
  reasonText: {...typography.label, fontSize: 13, color: colors.textPrimary, flex: 1},
  actions: {gap: spacing.xs},
});
