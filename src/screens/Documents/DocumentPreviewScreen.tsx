import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentPreview'>;

export function DocumentPreviewScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerEyebrow}>Preview</Text>
          <Text style={styles.headerTitle}>Driving Licence</Text>
        </View>
      </View>

      <View style={styles.previewArea}>
        <View style={styles.docCard}>
          <Text style={styles.docTitle}>KARNATAKA DRIVING LICENCE</Text>
          <View style={[styles.docLine, {width: 208}]} />
          <View style={[styles.docLine, {width: 153}]} />
          <View style={[styles.docLine, {width: 181}]} />
          <View style={[styles.docLine, {width: 139}]} />
          <View style={[styles.docLine, {width: 195}]} />
          <View style={styles.docBottomRow}>
            <Text style={styles.docNumber}>DL No: KA0120230012345</Text>
            <View style={styles.verifiedPill}>
              <Icon name="check-circle" size={14} color={colors.white} />
              <Text style={styles.verifiedPillText}>VERIFIED</Text>
            </View>
          </View>
        </View>

        <View style={styles.zoomRow}>
          <TouchableOpacity style={styles.zoomButton} activeOpacity={0.85}>
            <Icon name="zoom-out" size={18} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.zoomHint}>Pinch to zoom</Text>
          <TouchableOpacity style={styles.zoomButton} activeOpacity={0.85}>
            <Icon name="zoom-in" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.statusRow}>
          <View>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={styles.statusValue}>Verified · Aug 15, 2024</Text>
          </View>
          <View style={styles.statusIcon}>
            <Icon name="check-circle" size={20} color={colors.primary} />
          </View>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.replaceButton} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentVerificationFailed')}>
            <Icon name="refresh" size={18} color={colors.white} />
            <Text style={styles.replaceButtonText}>Replace Document</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadButton} activeOpacity={0.85}>
            <Icon name="download" size={18} color="#9CA3AF" />
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#111827'},
  header: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: 52, paddingBottom: spacing.md},
  headerEyebrow: {...typography.bodyMedium, fontSize: 14, color: '#9CA3AF'},
  headerTitle: {...typography.title, fontSize: 17, color: colors.white},
  previewArea: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, padding: spacing.xl},
  docCard: {backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.lg, width: 310, gap: 6},
  docTitle: {...typography.bodyBold, fontSize: 11, color: colors.textPrimary, letterSpacing: 1, marginBottom: spacing.xs},
  docLine: {height: 8, borderRadius: 3, backgroundColor: colors.border},
  docBottomRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.md},
  docNumber: {...typography.bodyBold, fontSize: 11, color: colors.textPrimary},
  verifiedPill: {flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary, borderRadius: 6, paddingHorizontal: spacing.sm, paddingVertical: 4},
  verifiedPillText: {...typography.bodyBold, fontSize: 10, color: colors.white},
  zoomRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.lg},
  zoomButton: {width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  zoomHint: {...typography.caption, fontSize: 12, color: '#9CA3AF'},
  bottomSheet: {backgroundColor: '#1F2937', borderTopLeftRadius: radius.xxl, borderTopRightRadius: radius.xxl, padding: spacing.xl, gap: spacing.md},
  statusRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  statusLabel: {...typography.label, fontSize: 13, color: '#9CA3AF'},
  statusValue: {...typography.bodySemibold, fontSize: 15, color: colors.primary, marginTop: 2},
  statusIcon: {width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  actionsRow: {flexDirection: 'row', gap: spacing.sm},
  replaceButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: '#374151', borderRadius: radius.md, paddingVertical: spacing.md},
  replaceButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.white},
  downloadButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: radius.md, paddingVertical: spacing.md},
  downloadButtonText: {...typography.bodyMedium, fontSize: 14, color: '#9CA3AF'},
});
