import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateServerError'>;

export function StateServerErrorScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <Icon name="server" size={30} color={colors.textMuted} />
          </View>
          <View style={styles.badge}>
            <Icon name="alert-triangle" size={12} color={colors.white} />
          </View>
        </View>
        <Text style={styles.title}>Server Error</Text>
        <Text style={styles.subtitle}>We're having trouble connecting to our servers. This is likely temporary.</Text>

        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>ERR_503</Text>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>Our team has been notified and is working on a fix.</Text>
          <Text style={styles.noteSubtext}>Usually resolves in 2–5 minutes.</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Retry" onPress={() => navigation.navigate('StateRetrying')} />
        <Button label="Contact Support" variant="ghost" onPress={() => navigation.navigate('SupportHub')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl},
  body: {alignItems: 'center'},
  iconWrap: {marginBottom: spacing.xl},
  iconCircle: {width: 88, height: 88, borderRadius: radius.xxl, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  badge: {position: 'absolute', right: -2, bottom: -2, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.danger, borderWidth: 3, borderColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h4, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg},
  codeBadge: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xxs, marginBottom: spacing.xl},
  codeText: {...typography.caption, color: colors.textSecondary, fontVariant: ['tabular-nums']},
  noteCard: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center'},
  noteText: {...typography.label, color: colors.textSecondary, textAlign: 'center'},
  noteSubtext: {...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs},
  actions: {gap: spacing.sm, marginTop: spacing.xxl, alignItems: 'stretch'},
});
