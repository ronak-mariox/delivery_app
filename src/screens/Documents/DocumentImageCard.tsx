import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DriverDocumentKey} from '../../context/DriverAuthContext';
import {resolveAssetUrl} from '../../services/api';
import {DOCUMENT_META} from '../Profile/driverDisplay';

interface DocumentImageCardProps {
  docKey: DriverDocumentKey;
  url?: string | null;
  onPress?: () => void;
}

export function DocumentImageCard({docKey, url, onPress}: DocumentImageCardProps) {
  const uri = resolveAssetUrl(url);
  const meta = DOCUMENT_META[docKey];

  if (!uri) {
    return (
      <View style={[styles.card, styles.missing]}>
        <Icon name="file-text" size={28} color={colors.textMuted} />
        <Text style={styles.missingTitle}>{meta.title}</Text>
        <Text style={styles.missingText}>Not uploaded</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} activeOpacity={onPress ? 0.85 : 1} disabled={!onPress} onPress={onPress}>
      <Image source={{uri}} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay}>
        <Text style={styles.overlayTitle}>{meta.title}</Text>
        {onPress ? <Text style={styles.overlayHint}>Tap to view full document</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {height: 180, borderRadius: radius.xxl, backgroundColor: colors.dark800, overflow: 'hidden'},
  image: {width: '100%', height: '100%'},
  overlay: {position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  overlayTitle: {...typography.labelSemibold, color: colors.white},
  overlayHint: {...typography.caption, fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 1},
  missing: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: spacing.xs},
  missingTitle: {...typography.labelSemibold, color: colors.textLabel},
  missingText: {...typography.caption, color: colors.textMuted},
});
