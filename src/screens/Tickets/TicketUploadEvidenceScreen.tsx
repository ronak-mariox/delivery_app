import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketUploadEvidence'>;

const FILES = [
  {name: 'IMG_0423.jpg', size: '1.2 MB'},
  {name: 'IMG_0424.jpg', size: '980 KB'},
];

export function TicketUploadEvidenceScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Evidence</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.hintBanner}>
          <Text style={styles.hintText}>Add screenshots, photos, or videos to support your issue report. Clear evidence helps resolve your ticket faster.</Text>
        </View>

        <View style={styles.filesGrid}>
          {FILES.map(file => (
            <View key={file.name} style={styles.fileTile}>
              <Icon name="image" size={28} color={colors.primary} />
              <View style={styles.fileLabel}>
                <Text style={styles.fileName}>{file.name}</Text>
                <Text style={styles.fileSize}>{file.size}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addTile} activeOpacity={0.8}>
            <Icon name="plus" size={24} color={colors.textMuted} />
            <Text style={styles.addTileText}>Add</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.supportedText}>Supported: Images, Videos, PDF · Max 10MB per file</Text>

        <View style={styles.sourceRow}>
          <TouchableOpacity style={styles.sourceButton} activeOpacity={0.85}>
            <Icon name="camera" size={20} color={colors.textPrimary} />
            <Text style={styles.sourceButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sourceButton} activeOpacity={0.85}>
            <Icon name="image" size={20} color={colors.textPrimary} />
            <Text style={styles.sourceButtonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sourceButton} activeOpacity={0.85}>
            <Icon name="folder" size={20} color={colors.textPrimary} />
            <Text style={styles.sourceButtonText}>Files</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.skipButton} activeOpacity={0.85} onPress={() => navigation.navigate('TicketReviewSubmit')}>
          <Text style={styles.skipButtonText}>Skip — No Evidence</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueButton} activeOpacity={0.85} onPress={() => navigation.navigate('TicketReviewSubmit')}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 18, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.lg, paddingBottom: 120},
  hintBanner: {backgroundColor: colors.primarySurface, borderRadius: radius.md, padding: spacing.md},
  hintText: {...typography.label, fontSize: 13, color: '#13845A', lineHeight: 20.8},
  filesGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  fileTile: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.primarySurface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fileLabel: {position: 'absolute', bottom: 4, left: 4, right: 4, backgroundColor: 'rgba(28,166,114,0.9)', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2},
  fileName: {...typography.caption, fontSize: 9, color: colors.white},
  fileSize: {...typography.caption, fontSize: 9, color: 'rgba(255,255,255,0.75)'},
  addTile: {
    width: '31%',
    aspectRatio: 1,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addTileText: {...typography.caption, fontSize: 11, color: colors.textMuted},
  supportedText: {...typography.caption, fontSize: 12, color: colors.textMuted, textAlign: 'center'},
  sourceRow: {flexDirection: 'row', gap: spacing.sm},
  sourceButton: {flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, alignItems: 'center', paddingVertical: spacing.md, gap: 6},
  sourceButtonText: {...typography.bodyMedium, fontSize: 12, color: '#374151'},
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  skipButton: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  skipButtonText: {...typography.bodyMedium, fontSize: 14, color: colors.textSecondary},
  continueButton: {flex: 1.6, backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  continueButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
});
