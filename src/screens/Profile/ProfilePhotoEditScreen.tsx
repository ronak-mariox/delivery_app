import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfilePhotoEdit'>;

const OPTIONS = [
  {icon: 'camera' as const, title: 'Take New Photo', subtitle: 'Use your camera', tone: 'primary' as const},
  {icon: 'image' as const, title: 'Choose from Gallery', subtitle: 'Upload from your device', tone: 'primary' as const},
  {icon: 'trash' as const, title: 'Remove Photo', subtitle: 'Revert to initials', tone: 'danger' as const},
];

const GUIDELINES = ['Face clearly visible', 'Well-lit, no filters', 'White or plain background', 'No sunglasses'];

export function ProfilePhotoEditScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Photo</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarWrap}>
          <Avatar initials="RK" size={120} />
          <View style={styles.cameraBadge}>
            <Icon name="camera" size={16} color={colors.white} />
          </View>
        </View>

        <View style={styles.card}>
          {OPTIONS.map((opt, index) => (
            <TouchableOpacity key={opt.title} style={[styles.optionRow, index < OPTIONS.length - 1 && styles.optionRowBorder]} activeOpacity={0.7}>
              <View style={[styles.optionIcon, opt.tone === 'danger' && styles.optionIconDanger]}>
                <Icon name={opt.icon} size={20} color={opt.tone === 'danger' ? colors.danger : colors.primary} />
              </View>
              <View>
                <Text style={[styles.optionTitle, opt.tone === 'danger' && styles.optionTitleDanger]}>{opt.title}</Text>
                <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>PHOTO GUIDELINES</Text>
          {GUIDELINES.map(g => (
            <View key={g} style={styles.guidelineRow}>
              <Icon name="check" size={14} color={colors.primary} />
              <Text style={styles.guidelineText}>{g}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.saveButtonText}>Save Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl},
  avatarWrap: {alignSelf: 'center', marginTop: spacing.sm},
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg},
  optionRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  optionIcon: {width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  optionIconDanger: {backgroundColor: '#FEF3F2'},
  optionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  optionTitleDanger: {color: colors.danger},
  optionSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  guidelinesCard: {backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  guidelinesTitle: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.6},
  guidelineRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  guidelineText: {...typography.label, fontSize: 13, color: colors.textLabel},
  saveButton: {backgroundColor: colors.primary, borderRadius: radius.lg, height: 50, alignItems: 'center', justifyContent: 'center'},
  saveButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  cancelButton: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, height: 50, alignItems: 'center', justifyContent: 'center'},
  cancelButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
