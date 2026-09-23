import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateVerificationFailed'>;

const RED = '#D92D20';

export function StateVerificationFailedScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Icon name="x-circle" size={32} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Verification Failed</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.itemCard}>
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>RC Document</Text>
            <Text style={styles.itemReason}>Image too blurry</Text>
          </View>
          <TouchableOpacity
            style={styles.reuploadButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('VehicleRcDocument')}>
            <Text style={styles.reuploadText}>Re-upload</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemCard}>
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>Vehicle Photo</Text>
            <Text style={styles.itemReason}>Does not match RC</Text>
          </View>
          <TouchableOpacity style={styles.reuploadButton} activeOpacity={0.85} onPress={() => navigation.navigate('VehicleEdit')}>
            <Text style={styles.reuploadText}>Re-upload</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.warningBanner}>
          <Icon name="alert-triangle" size={16} color={RED} />
          <Text style={styles.warningText}>You cannot receive delivery orders until verification is complete.</Text>
        </View>

        <View style={styles.noteBanner}>
          <Icon name="clock" size={16} color={colors.textSecondary} />
          <Text style={styles.noteText}>Resubmit within 7 days (by Sep 13, 2026).</Text>
        </View>

        <View style={styles.actions}>
          <Button label="Go to Documents" onPress={() => navigation.navigate('DocumentsHub')} />
          <Button label="Contact Support" variant="outline" onPress={() => navigation.navigate('SupportHub')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: RED, alignItems: 'center', paddingTop: 52, paddingBottom: spacing.xxl, paddingHorizontal: spacing.xxl},
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {...typography.h4, fontSize: 20, color: colors.white},
  body: {padding: spacing.xl, gap: spacing.md, paddingBottom: spacing.xxxl},
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: RED,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.sm,
  },
  itemText: {flex: 1, marginRight: spacing.md},
  itemTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  itemReason: {...typography.caption, color: RED, marginTop: spacing.xxs},
  reuploadButton: {backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  reuploadText: {...typography.captionSemibold, color: colors.white},
  warningBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.dangerBorder, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  warningText: {flex: 1, ...typography.caption, color: '#991B1B', lineHeight: 18},
  noteBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  noteText: {...typography.caption, color: colors.textSecondary},
  actions: {gap: spacing.sm, marginTop: spacing.xs},
});
