import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconName} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountAbout'>;

const SYSTEM_INFO = [
  {label: 'OS', value: 'Android 13'},
  {label: 'Device', value: 'Samsung Galaxy A53'},
  {label: 'Network', value: 'WiFi'},
  {label: 'App ID', value: 'com.verdant.rider'},
];

export function AccountAboutScreen({navigation}: Props) {
  const moreLinks: {label: string; icon?: IconName; onPress?: () => void}[] = [
    {label: 'Open Source Licenses'},
    {label: 'Rate the App', icon: 'star'},
    {label: 'Send Feedback', icon: 'message-circle'},
    {label: 'Report a Bug', icon: 'alert-circle', onPress: () => navigation.navigate('SupportOtherIssues')},
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
          <Text style={styles.appVersion}>Version 3.2.1 (build 320100)</Text>
          <View style={styles.upToDatePill}>
            <Text style={styles.upToDateText}>Up to date</Text>
          </View>
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
              activeOpacity={link.onPress ? 0.7 : 1}
              disabled={!link.onPress}
              onPress={link.onPress}>
              {link.icon && <Icon name={link.icon} size={18} color={colors.primary} />}
              <Text style={styles.linkText}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footerText}>Build date: Sep 1, 2026</Text>
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
  upToDatePill: {backgroundColor: colors.primarySurface, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 4, marginTop: spacing.sm},
  upToDateText: {...typography.bodySemibold, fontSize: 12, color: colors.primary},
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
