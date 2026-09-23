import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Card, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountNotFound'>;

export function AccountNotFoundScreen({route, navigation}: Props) {
  const {mobile} = route.params;

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']}>
      <View style={styles.headerRow}>
        <IconBackButton onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <Icon name="user" size={48} color={colors.textMuted} />
          </View>
          <View style={styles.badge}>
            <Icon name="x" size={12} color={colors.danger} />
          </View>
        </View>

        <Text style={styles.title}>Account Not Found</Text>
        <Text style={styles.subtitle}>{"We couldn't find a rider account linked to"}</Text>
        <View style={styles.mobileChip}>
          <Text style={styles.mobileChipText}>+91 {mobile}</Text>
        </View>

        <View style={styles.actions}>
          <Button label="Create New Account" onPress={() => navigation.navigate('RegistrationLanding')} />
          <Button label="Try Different Number" variant="secondary" onPress={() => navigation.goBack()} />
        </View>

        <Card style={styles.supportCard}>
          <Text style={styles.supportTitle}>Already registered?</Text>
          <Text style={styles.supportDescription}>
            If you registered with a different number, contact our support team and we'll help you recover access.
          </Text>
          <TouchableOpacity style={styles.supportLink} activeOpacity={0.8}>
            <Icon name="message-circle" size={15} color={colors.primary} />
            <Text style={styles.supportLinkText}>Contact Support</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {paddingHorizontal: spacing.xl, paddingTop: spacing.lg},
  body: {flex: 1, alignItems: 'center', paddingHorizontal: spacing.xxl, paddingTop: spacing.huge},
  iconWrap: {marginBottom: spacing.xxl},
  iconCircle: {width: 120, height: 120, borderRadius: 60, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dangerSurface,
    borderWidth: 3,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {...typography.h3, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs},
  mobileChip: {backgroundColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, marginTop: spacing.md, marginBottom: spacing.xxl},
  mobileChipText: {...typography.bodyLgMedium, fontSize: 15, color: colors.textPrimary},
  actions: {width: '100%', gap: spacing.md, marginBottom: spacing.xl},
  supportCard: {width: '100%', gap: spacing.xs},
  supportTitle: {...typography.labelSemibold, color: colors.textPrimary},
  supportDescription: {...typography.label, color: colors.textSecondary, lineHeight: 19},
  supportLink: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm},
  supportLinkText: {...typography.labelSemibold, color: colors.primary},
});
