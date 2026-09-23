import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Icon, IconName} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

const STATS = [
  {value: '142', label: 'Total Deliveries'},
  {value: '4.9★', label: 'Rating'},
  {value: '94%', label: 'Acceptance'},
  {value: '₹8,240/mo', label: 'Earnings'},
];

export function ProfileScreen({navigation}: Props) {
  const profileItems: {icon: IconName; label: string; onPress?: () => void}[] = [
    {icon: 'user', label: 'Personal Information', onPress: () => navigation.navigate('ProfilePersonalInfo')},
    {icon: 'bicycle', label: 'Vehicle Details', onPress: () => navigation.navigate('VehicleHub')},
    {icon: 'file-text', label: 'Documents', onPress: () => navigation.navigate('DocumentsHub')},
    {icon: 'credit-card', label: 'Payment Details', onPress: () => navigation.navigate('PaymentHub')},
    {icon: 'shield', label: 'Security', onPress: () => navigation.navigate('AccountSecurity')},
  ];
  const accountItems: {icon: IconName; label: string; onPress?: () => void}[] = [
    {icon: 'bell', label: 'Notification Settings', onPress: () => navigation.navigate('AccountNotificationSettings')},
    {icon: 'map-pin', label: 'Location Settings', onPress: () => navigation.navigate('AccountLocationSettings')},
    {icon: 'globe', label: 'Language & Region', onPress: () => navigation.navigate('AccountLanguageRegion')},
    {icon: 'lock', label: 'Privacy', onPress: () => navigation.navigate('AccountPrivacy')},
    {icon: 'help-circle', label: 'Help & Support', onPress: () => navigation.navigate('SupportHub')},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.editBadge} activeOpacity={0.8} onPress={() => navigation.navigate('ProfileEdit')}>
          <Icon name="edit" size={18} color={colors.white} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('ProfilePhotoEdit')}>
          <View style={styles.avatarRing}>
            <Avatar initials="RK" size={80} backgroundColor="rgba(255,255,255,0.25)" textColor={colors.white} />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>Ravi Kumar</Text>
        <View style={styles.metaRow}>
          <Icon name="star" size={14} color={colors.white} filled />
          <Text style={styles.metaText}>4.9 · Gold Rider · #VR-2024-087234</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {STATS.map(stat => (
            <View key={stat.label} style={styles.statTile}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>PROFILE</Text>
        <View style={styles.card}>
          {profileItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.row, index < profileItems.length - 1 && styles.rowBorder]}
              activeOpacity={item.onPress ? 0.7 : 1}
              disabled={!item.onPress}
              onPress={item.onPress}>
              <View style={styles.rowIcon}>
                <Icon name={item.icon} size={18} color={colors.primary} />
              </View>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Icon name="chevron-right" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>ACCOUNT</Text>
        <View style={styles.card}>
          {accountItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.row, index < accountItems.length - 1 && styles.rowBorder]}
              activeOpacity={item.onPress ? 0.7 : 1}
              disabled={!item.onPress}
              onPress={item.onPress}>
              <View style={styles.rowIconMuted}>
                <Icon name={item.icon} size={18} color={colors.textSecondary} />
              </View>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Icon name="chevron-right" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>RIDER PERKS</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => navigation.navigate('StateAccessDenied')}>
            <View style={styles.rowIconMuted}>
              <Icon name="lock" size={18} color={colors.textSecondary} />
            </View>
            <Text style={styles.rowLabel}>Rider Council</Text>
            <Icon name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={[styles.card, styles.sectionLabelSpaced]}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => navigation.navigate('DeactivateAccount')}>
            <View style={styles.rowIconDanger}>
              <Icon name="user-x" size={18} color={colors.danger} />
            </View>
            <Text style={styles.rowLabelDanger}>Deactivate Account</Text>
            <Icon name="chevron-right" size={16} color={colors.danger} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('AccountAbout')}>
          <Text style={styles.version}>Verdant Rider v3.2.1</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, alignItems: 'center', paddingTop: 52, paddingBottom: spacing.xxl},
  editBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)', borderRadius: 44, padding: 2},
  name: {...typography.h4, fontSize: 22, color: colors.white, marginTop: spacing.md},
  metaRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.xs},
  metaText: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.85)'},
  body: {padding: spacing.lg, paddingBottom: spacing.xxxl},
  statsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 1, backgroundColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  statTile: {flexBasis: '49.7%', flexGrow: 1, backgroundColor: colors.surface, paddingVertical: spacing.md, alignItems: 'center'},
  statValue: {...typography.h4, fontSize: 18, color: colors.textPrimary},
  statLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 2},
  sectionLabel: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: spacing.xl, marginBottom: spacing.xs},
  sectionLabelSpaced: {marginTop: spacing.xl},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  row: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, height: 52},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowIcon: {width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  rowIconMuted: {width: 32, height: 32, borderRadius: radius.sm, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center'},
  rowIconDanger: {width: 32, height: 32, borderRadius: radius.sm, backgroundColor: '#FEF3F2', alignItems: 'center', justifyContent: 'center'},
  rowLabel: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, flex: 1},
  rowLabelDanger: {...typography.bodyMedium, fontSize: 14, color: colors.danger, flex: 1},
  version: {...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl},
});
