import React, {useState} from 'react';
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconName} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountSecurity'>;

const TIPS = ['Never share your OTP with anyone', 'Use a strong, unique PIN', 'Log out from devices you no longer use'];

export function AccountSecurityScreen({navigation}: Props) {
  const [twoFactor, setTwoFactor] = useState(true);

  const rows: {icon: IconName; label: string; danger?: boolean; badge?: string; onPress: () => void}[] = [
    {icon: 'phone', label: 'Change Mobile Number', onPress: () => navigation.navigate('AccountChangeMobileNumber')},
    {icon: 'lock', label: 'Change Password', onPress: () => {}},
    {icon: 'monitor', label: 'Active Sessions', badge: '2 devices', onPress: () => navigation.navigate('AccountActiveSessions')},
    {icon: 'log-out', label: 'Logout', danger: true, onPress: () => navigation.navigate('AccountLogout')},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.secureCard}>
          <View style={styles.secureRow}>
            <Icon name="shield" size={18} color={colors.primary} />
            <Text style={styles.secureTitle}>Your account is secure</Text>
          </View>
          <Text style={styles.secureSubtitle}>Last login: Sep 6, 2:30 PM · Bengaluru, IN</Text>
        </View>

        <View style={styles.card}>
          {rows.map((row, index) => (
            <TouchableOpacity
              key={row.label}
              style={[styles.row, index < rows.length - 1 && styles.rowBorder]}
              activeOpacity={0.7}
              onPress={row.onPress}>
              <View style={styles.rowIcon}>
                <Icon name={row.icon} size={20} color={row.danger ? colors.danger : colors.textPrimary} />
              </View>
              <Text style={[styles.rowLabel, row.danger && styles.rowLabelDanger]}>{row.label}</Text>
              {row.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{row.badge}</Text>
                </View>
              )}
              <Icon name="chevron-right" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleTitle}>Two-Factor Authentication</Text>
            <Text style={styles.toggleSubtitle}>OTP on login</Text>
          </View>
          <Switch value={twoFactor} onValueChange={setTwoFactor} trackColor={{false: colors.border, true: colors.primary}} thumbColor={colors.white} />
        </View>

        <Text style={styles.sectionTitle}>Security Tips</Text>
        <View style={styles.card}>
          {TIPS.map(tip => (
            <View key={tip} style={styles.tipRow}>
              <Icon name="check" size={16} color={colors.primary} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
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
  body: {padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl},
  secureCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, padding: spacing.md},
  secureRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  secureTitle: {...typography.bodySemibold, fontSize: 14, color: colors.primary},
  secureSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  row: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowIcon: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center'},
  rowLabel: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, flex: 1},
  rowLabelDanger: {color: colors.danger},
  badge: {backgroundColor: colors.primarySurface, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 3},
  badgeText: {...typography.bodySemibold, fontSize: 11, color: colors.primary},
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  toggleTitle: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  toggleSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  sectionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  tipRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.lg, paddingVertical: spacing.sm},
  tipText: {...typography.label, fontSize: 13, color: '#374151'},
});
