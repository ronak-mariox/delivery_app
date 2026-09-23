import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentOther'>;

export function DocumentOtherScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Other Documents</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Icon name="file-text" size={20} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={styles.rowLabel}>Aadhaar Card</Text>
              <Text style={styles.rowSub}>Uploaded</Text>
            </View>
          </View>
          <View style={styles.verifiedPill}>
            <Icon name="check-circle" size={16} color={colors.primary} />
            <Text style={styles.verifiedPillText}>VERIFIED</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Icon name="file-text" size={20} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={styles.rowLabel}>PAN Card</Text>
              <Text style={styles.rowSub}>Uploaded</Text>
            </View>
          </View>
          <View style={styles.verifiedPill}>
            <Icon name="check-circle" size={16} color={colors.primary} />
            <Text style={styles.verifiedPillText}>VERIFIED</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Icon name="file-text" size={20} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={styles.rowLabel}>Pollution Certificate</Text>
              <Text style={styles.rowSub}>Not uploaded</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.uploadPill} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentUpload')}>
            <Text style={styles.uploadPillText}>Upload</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <View style={styles.rowIcon}>
              <Icon name="file-text" size={20} color={colors.textSecondary} />
            </View>
            <View>
              <Text style={styles.rowLabel}>Medical Certificate</Text>
              <Text style={styles.rowSub}>Not required for current vehicle type</Text>
            </View>
          </View>
          <Text style={styles.naText}>N/A</Text>
        </View>

        <TouchableOpacity style={styles.uploadButton} activeOpacity={0.85} onPress={() => navigation.navigate('DocumentUpload')}>
          <Icon name="upload" size={20} color={colors.primary} />
          <Text style={styles.uploadButtonText}>Upload New Document</Text>
        </TouchableOpacity>

        <View style={styles.lockRow}>
          <Icon name="lock" size={14} color={colors.textSecondary} />
          <Text style={styles.lockText}>Documents are encrypted and stored securely.</Text>
        </View>
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
  headerTitle: {...typography.title, fontSize: 18, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  rowIcon: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  rowLabel: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary},
  rowSub: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  verifiedPill: {flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primarySurface, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4},
  verifiedPillText: {...typography.captionSemibold, fontSize: 12, color: colors.primary},
  uploadPill: {borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  uploadPillText: {...typography.captionSemibold, fontSize: 13, color: colors.primary},
  naText: {...typography.caption, fontSize: 12, color: colors.textSecondary, fontStyle: 'italic'},
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  uploadButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
  lockRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  lockText: {...typography.label, fontSize: 13, color: colors.textSecondary, flex: 1},
});
