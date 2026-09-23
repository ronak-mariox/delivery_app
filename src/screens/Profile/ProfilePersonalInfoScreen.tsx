import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Icon, IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfilePersonalInfo'>;

function VerifiedBadge() {
  return (
    <View style={styles.verifiedBadge}>
      <Icon name="check" size={9} color={colors.primary} />
      <Text style={styles.verifiedBadgeText}>Verified</Text>
    </View>
  );
}

export function ProfilePersonalInfoScreen({navigation}: Props) {
  const rows = [
    {label: 'Full Name', value: 'Ravi Kumar', verified: false, onPress: () => navigation.navigate('ProfileEdit')},
    {label: 'Mobile Number', value: '+91 98765 43210', verified: true, onPress: undefined},
    {label: 'Email', value: 'ravi.kumar@email.com', verified: true, onPress: () => navigation.navigate('ProfileEdit')},
    {label: 'Date of Birth', value: '12 Aug 1995', verified: false, onPress: () => navigation.navigate('ProfileEdit')},
    {label: 'Gender', value: 'Male', verified: false, onPress: () => navigation.navigate('ProfileEdit')},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Personal Information</Text>
        <TouchableOpacity style={styles.editLink} onPress={() => navigation.navigate('ProfileEdit')}>
          <Icon name="edit" size={16} color={colors.primary} />
          <Text style={styles.editLinkText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Avatar initials="RK" size={56} />
          <View>
            <Text style={styles.summaryName}>Ravi Kumar</Text>
            <Text style={styles.summarySub}>Rider ID: #VR-2024-087234</Text>
          </View>
        </View>

        <View style={styles.card}>
          {rows.map((row, index) => (
            <TouchableOpacity
              key={row.label}
              style={[styles.row, index < rows.length - 1 && styles.rowBorder]}
              activeOpacity={row.onPress ? 0.7 : 1}
              disabled={!row.onPress}
              onPress={row.onPress}>
              <View style={styles.flex}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <View style={styles.rowValueRow}>
                  <Text style={styles.rowValue}>{row.value}</Text>
                  {row.verified && <VerifiedBadge />}
                </View>
              </View>
              <Icon name="chevron-right" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.emergencyRow} activeOpacity={0.7} onPress={() => navigation.navigate('ProfileEmergencyContact')}>
            <View style={styles.flex}>
              <Text style={styles.rowLabel}>Emergency Contact</Text>
              <Text style={styles.rowValue}>Meena Kumar (Wife)</Text>
              <Text style={styles.rowValueSub}>+91 87654 32109</Text>
            </View>
            <Icon name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoBanner}>
          <Icon name="info" size={14} color={colors.textSecondary} />
          <Text style={styles.infoBannerText}>Some fields require support to change. Tap Edit to update allowed fields.</Text>
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary, flex: 1},
  editLink: {flexDirection: 'row', alignItems: 'center', gap: 4},
  editLinkText: {...typography.bodyMedium, fontSize: 14, color: colors.primary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  summaryCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  summaryName: {...typography.bodyBold, fontSize: 16, color: colors.textPrimary},
  summarySub: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  row: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  rowValueRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 3},
  rowValue: {...typography.bodyMedium, fontSize: 15, color: colors.textPrimary},
  rowValueSub: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 2},
  verifiedBadge: {flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.primarySurface, borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 2},
  verifiedBadgeText: {...typography.captionSemibold, fontSize: 10, color: colors.primary},
  emergencyRow: {flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  infoBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  infoBannerText: {...typography.caption, fontSize: 12, color: colors.textSecondary, flex: 1},
});
