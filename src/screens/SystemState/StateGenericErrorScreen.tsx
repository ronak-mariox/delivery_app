import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateGenericError'>;

export function StateGenericErrorScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <Icon name="alert-triangle" size={60} color={colors.textMuted} strokeWidth={1.5} />
      <Text style={styles.title}>Something Went Wrong</Text>
      <Text style={styles.subtitle}>An unexpected error occurred. Please try again.</Text>

      <View style={styles.codeBadge}>
        <Text style={styles.codeText}>ERR-2906-VRDLR</Text>
        <Icon name="copy" size={14} color={colors.textSecondary} />
      </View>

      <View style={styles.actions}>
        <Button label="Try Again" onPress={() => navigation.navigate('StateRetrying')} />
        <Button label="Go Home" variant="outline" onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})} />
        <Button label="Contact Support" variant="ghost" textColor={colors.textSecondary} onPress={() => navigation.navigate('SupportHub')} />
      </View>

      <Text style={styles.footerNote}>If this keeps happening, our team can help resolve it.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl},
  title: {...typography.h4, fontSize: 20, color: colors.textPrimary, textAlign: 'center', marginTop: spacing.lg},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, maxWidth: 300},
  codeBadge: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginTop: spacing.xl, marginBottom: spacing.xxl},
  codeText: {fontFamily: 'Courier', fontSize: 12, color: colors.textSecondary},
  actions: {width: '100%', gap: spacing.sm},
  footerNote: {...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg, maxWidth: 280},
});
