import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors, radius, spacing, typography} from '../theme';
import {Icon, IconName} from './Icon';

interface UploadDropzoneProps {
  icon: IconName;
  title: string;
  subtitle: string;
  onCamera?: () => void;
  onGallery?: () => void;
  large?: boolean;
}

export function UploadDropzone({icon, title, subtitle, onCamera, onGallery, large}: UploadDropzoneProps) {
  return (
    <View style={[styles.container, large && styles.containerLarge]}>
      <View style={[styles.iconWrap, large && styles.iconWrapLarge]}>
        <Icon name={icon} size={large ? 30 : 22} color={colors.textMuted} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={onCamera}>
          <Text style={styles.actionButtonText}>Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.8} onPress={onGallery}>
          <Text style={styles.actionButtonText}>Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    borderRadius: radius.xxl,
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    gap: spacing.xs,
  },
  containerLarge: {paddingVertical: spacing.huge},
  iconWrap: {width: 48, height: 48, borderRadius: radius.lg, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs},
  iconWrapLarge: {width: 64, height: 64, borderRadius: 16},
  title: {...typography.bodySemibold, color: colors.textLabel},
  subtitle: {...typography.caption, color: colors.textMuted},
  actions: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs},
  actionButton: {
    height: 40,
    paddingHorizontal: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {...typography.labelSemibold, color: colors.textLabel},
});
