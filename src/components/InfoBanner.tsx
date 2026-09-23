import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, radius, spacing, typography} from '../theme';
import {Icon, IconName} from './Icon';

export type InfoBannerTone = 'primary' | 'warning' | 'neutral';

interface InfoBannerProps {
  tone?: InfoBannerTone;
  icon?: IconName;
  title?: string;
  description: string;
}

const TONE_ICON: Record<InfoBannerTone, IconName> = {primary: 'info', warning: 'alert-triangle', neutral: 'info'};

export function InfoBanner({tone = 'primary', icon, title, description}: InfoBannerProps) {
  const palette = palettes[tone];
  return (
    <View style={[styles.container, {backgroundColor: palette.bg, borderColor: palette.border}]}>
      <Icon name={icon ?? TONE_ICON[tone]} size={16} color={palette.icon} />
      <View style={styles.textWrap}>
        {!!title && <Text style={[styles.title, {color: palette.title}]}>{title}</Text>}
        <Text style={[styles.description, {color: palette.text}]}>{description}</Text>
      </View>
    </View>
  );
}

const palettes: Record<InfoBannerTone, {bg: string; border: string; icon: string; title: string; text: string}> = {
  primary: {bg: colors.primarySurface, border: colors.primaryBorder, icon: colors.primary, title: colors.primary, text: colors.primary},
  warning: {bg: colors.warningSurface, border: colors.warningBorder, icon: '#B54708', title: '#B54708', text: colors.warningText},
  neutral: {bg: colors.background, border: colors.border, icon: colors.textSecondary, title: colors.textLabel, text: colors.textSecondary},
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, borderWidth: 1.5, borderRadius: radius.md, padding: spacing.md, width: '100%'},
  textWrap: {flex: 1, gap: 2},
  title: {...typography.captionSemibold},
  description: {...typography.caption, lineHeight: 16},
});
