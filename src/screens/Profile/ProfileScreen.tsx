import React from 'react';
import {Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Badge, Icon, IconName} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {driverName, useDriverAuth} from '../../context/DriverAuthContext';
import {resolveAssetUrl} from '../../services/api';
import {formatPhone, initialsOf, kycBadge, statusBadge, SUPPORT_EMAIL} from './driverDisplay';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export function ProfileScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const name = driverName(driver);
  const avatarUri = resolveAssetUrl(driver?.avatarUrl);
  const status = statusBadge(driver?.status);
  const kyc = kycBadge(driver?.kycStatus);

  const profileItems: {icon: IconName; label: string; onPress: () => void}[] = [
    {icon: 'user', label: 'Personal Information', onPress: () => navigation.navigate('ProfilePersonalInfo')},
    {icon: 'home', label: 'Home Address', onPress: () => navigation.navigate('ProfileAddress')},
    {icon: 'phone', label: 'Emergency Contact', onPress: () => navigation.navigate('ProfileEmergencyContact')},
    {icon: 'bicycle', label: 'Vehicle Details', onPress: () => navigation.navigate('VehicleHub')},
    {icon: 'file-text', label: 'Documents', onPress: () => navigation.navigate('DocumentsHub')},
    {icon: 'credit-card', label: 'Payment Details', onPress: () => navigation.navigate('PaymentHub')},
  ];
  const accountItems: {icon: IconName; label: string; onPress: () => void}[] = [
    {icon: 'help-circle', label: 'Help & Support', onPress: () => navigation.navigate('SupportHub')},
    {icon: 'info', label: 'About', onPress: () => navigation.navigate('AccountAbout')},
    {icon: 'file-text', label: 'Terms of Service', onPress: () => navigation.navigate('AccountTerms')},
    {icon: 'lock', label: 'Privacy', onPress: () => navigation.navigate('AccountPrivacy')},
    {icon: 'log-out', label: 'Log Out', onPress: () => navigation.navigate('AccountLogout')},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('ProfilePhotoEdit')}>
          <View style={styles.avatarRing}>
            {avatarUri ? (
              <Image source={{uri: avatarUri}} style={styles.avatarImage} />
            ) : (
              <Avatar initials={initialsOf(name)} size={80} backgroundColor="rgba(255,255,255,0.25)" textColor={colors.white} />
            )}
          </View>
          <View style={styles.cameraBadge}>
            <Icon name="camera" size={14} color={colors.primary} />
          </View>
        </TouchableOpacity>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.phone}>{formatPhone(driver?.phone)}</Text>
        <View style={styles.badgeRow}>
          <Badge label={status.label} tone={status.tone} />
          <Badge label={`KYC: ${kyc.label}`} tone={kyc.tone} />
        </View>
        {driver?.referenceId ? <Text style={styles.reference}>Ref {driver.referenceId}</Text> : null}
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {driver?.status === 'rejected' && driver.rejectionReason ? (
          <View style={styles.rejectionBanner}>
            <Icon name="alert-triangle" size={16} color={colors.danger} />
            <Text style={styles.rejectionText}>{driver.rejectionReason}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionLabel}>PROFILE</Text>
        <View style={styles.card}>
          {profileItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.row, index < profileItems.length - 1 && styles.rowBorder]}
              activeOpacity={0.7}
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
              activeOpacity={0.7}
              onPress={item.onPress}>
              <View style={styles.rowIconMuted}>
                <Icon name={item.icon} size={18} color={colors.textSecondary} />
              </View>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Icon name="chevron-right" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.card, styles.sectionLabelSpaced]}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {})}>
            <View style={styles.rowIcon}>
              <Icon name="mail" size={18} color={colors.primary} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.rowLabel}>Contact support</Text>
              <Text style={styles.rowSub}>Need to change your details or close your account? Email {SUPPORT_EMAIL}</Text>
            </View>
            <Icon name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, alignItems: 'center', paddingTop: 52, paddingBottom: spacing.xxl, paddingHorizontal: spacing.lg},
  avatarRing: {borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)', borderRadius: 44, padding: 2, overflow: 'hidden'},
  avatarImage: {width: 80, height: 80, borderRadius: 40},
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {...typography.h4, fontSize: 22, color: colors.white, marginTop: spacing.md},
  phone: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: spacing.xxs},
  badgeRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm},
  reference: {...typography.caption, color: 'rgba(255,255,255,0.75)', marginTop: spacing.sm},
  body: {padding: spacing.lg, paddingBottom: spacing.xxxl},
  rejectionBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.dangerBorder, borderRadius: radius.lg, padding: spacing.md},
  rejectionText: {...typography.label, fontSize: 12, color: colors.dangerText, flex: 1},
  sectionLabel: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase', marginTop: spacing.xl, marginBottom: spacing.xs},
  sectionLabelSpaced: {marginTop: spacing.xl},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  row: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, minHeight: 52, paddingVertical: spacing.sm},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowIcon: {width: 32, height: 32, borderRadius: radius.sm, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  rowIconMuted: {width: 32, height: 32, borderRadius: radius.sm, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center'},
  rowLabel: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, flex: 1},
  rowSub: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 2},
});
