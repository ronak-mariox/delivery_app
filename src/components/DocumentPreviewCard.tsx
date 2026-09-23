import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, radius, spacing, typography} from '../theme';
import {Icon, IconName} from './Icon';

interface DocumentPreviewCardProps {
  tone: 'dark' | 'primary';
  badgeLabel: string;
  icon: IconName;
  thumbnailLabel: string;
  overline: string;
  title: string;
  lines: string[];
  onReplace?: () => void;
  onRemove?: () => void;
}

export function DocumentPreviewCard({tone, badgeLabel, icon, thumbnailLabel, overline, title, lines, onReplace, onRemove}: DocumentPreviewCardProps) {
  const isDark = tone === 'dark';
  return (
    <View style={styles.container}>
      <View style={[styles.header, {backgroundColor: isDark ? colors.dark900 : colors.primary}]}>
        <View style={styles.thumbnail}>
          <Icon name={icon} size={28} color={colors.white} />
          <Text style={styles.thumbnailLabel}>{thumbnailLabel}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.overline}>{overline}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {lines.map(line => (
            <Text key={line} style={styles.line} numberOfLines={1}>
              {line}
            </Text>
          ))}
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={onReplace}>
          <Icon name="refresh" size={13} color={colors.textSecondary} />
          <Text style={styles.actionText}>Replace</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.removeButton]} activeOpacity={0.8} onPress={onRemove}>
          <Icon name="x" size={13} color={colors.dangerText} />
          <Text style={[styles.actionText, styles.removeText]}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.xxl, overflow: 'hidden', backgroundColor: colors.surface},
  header: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, minHeight: 110},
  thumbnail: {width: 60, height: 80, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', gap: 4},
  thumbnailLabel: {...typography.micro, fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: 1},
  info: {flex: 1, gap: 2},
  overline: {...typography.micro, fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: 1},
  title: {...typography.bodyBold, color: colors.white},
  line: {...typography.caption, fontSize: 11, color: 'rgba(255,255,255,0.7)'},
  badge: {position: 'absolute', right: spacing.md, top: spacing.md, backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2},
  badgeText: {...typography.overline, fontSize: 9, color: colors.white},
  actions: {flexDirection: 'row', gap: spacing.sm, padding: spacing.md},
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  removeButton: {borderColor: colors.dangerBorder, backgroundColor: colors.dangerSurface},
  actionText: {...typography.caption, color: colors.textSecondary},
  removeText: {color: colors.dangerText},
});
