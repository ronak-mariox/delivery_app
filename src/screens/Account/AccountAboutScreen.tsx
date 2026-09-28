import React from 'react';
import {Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconName} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {emailSupport} from '../Support/supportContacts';
import {version as APP_VERSION} from '../../../package.json';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountAbout'>;

const SYSTEM_INFO = [
  {label: 'App version', value: APP_VERSION},
  {label: 'Platform', value: `${Platform.OS === 'ios' ? 'iOS' : 'Android'} ${Platform.Version}`},
];

export function AccountAboutScreen({navigation}: Props) {
  const moreLinks: {label: string; icon: IconName; onPress: () => void}[] = [
    {label: 'Send Feedback', icon: 'message-circle', onPress: () => emailSupport('App feedback')},
    {label: 'Report a Bug', icon: 'alert-circle', onPress: () => emailSupport(`Bug report (v${APP_VERSION})`)},
    {label: 'Help & Support', icon: 'headphones', onPress: () => navigation.navigate('SupportHub')},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About & Version</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.appCard}>
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>VR</Text>
          </View>
          <Text style={styles.appName}>Verdant Rider</Text>
          <Text style={styles.appVersion}>Version {APP_VERSION}</Text>
        </View>

        <Text style={styles.groupTitle}>SYSTEM INFO</Text>
        <View style={styles.card}>
          {SYSTEM_INFO.map((row, index) => (
            <View key={row.label} style={[styles.infoRow, index < SYSTEM_INFO.length - 1 && styles.rowBorder]}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.groupTitle}>MORE</Text>
        <View style={styles.card}>
          {moreLinks.map((link, index) => (
            <TouchableOpacity
              key={link.label}
              style={[styles.linkRow, index < moreLinks.length - 1 && styles.rowBorder]}
              activeOpacity={0.7}
              onPress={link.onPress}>
              <Icon name={link.icon} size={18} color={colors.primary} />
              <Text style={styles.linkText}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footerText}>© 2026 Verdant Technologies</Text>
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
  body: {padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxxl},
  appCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.xs},
  appIcon: {width: 64, height: 64, borderRadius: radius.xxl, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm},
  appIconText: {...typography.h3, fontSize: 20, color: colors.white},
  appName: {...typography.bodyBold, fontSize: 18, color: colors.textPrimary},
  appVersion: {...typography.label, fontSize: 13, color: colors.textSecondary},
  groupTitle: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.8, marginTop: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  infoLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  infoValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
  linkRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  linkText: {...typography.bodyMedium, fontSize: 14, color: colors.primary},
  footerText: {...typography.caption, fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs},
});
