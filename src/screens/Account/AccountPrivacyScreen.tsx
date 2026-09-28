import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconName} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {emailSupport} from '../Support/supportContacts';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountPrivacy'>;

const DATA_USES: {icon: IconName; title: string; body: string}[] = [
  {icon: 'map-pin', title: 'Location', body: 'Used while you are online to assign nearby orders, navigate and share your position with the customer during a delivery.'},
  {icon: 'user', title: 'Profile & documents', body: 'Your identity, vehicle and bank details are used to verify your account and pay your earnings.'},
  {icon: 'phone', title: 'Contact details', body: 'Your mobile number is used to sign in and so support and customers can reach you about an active order.'},
];

export function AccountPrivacyScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.groupTitle}>HOW YOUR DATA IS USED</Text>
        <View style={styles.card}>
          {DATA_USES.map((item, index) => (
            <View key={item.title} style={[styles.row, index < DATA_USES.length - 1 && styles.rowBorder]}>
              <Icon name={item.icon} size={18} color={colors.primary} />
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{item.title}</Text>
                <Text style={styles.rowSub}>{item.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.groupTitle}>YOUR RIGHTS</Text>
        <Text style={styles.paragraph}>
          You can ask for a copy of the data we hold about you, request corrections, or ask for your account to be closed. Requests are handled by the support team and pending payouts are settled before an account is closed.
        </Text>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => emailSupport('Data request')}>
          <Icon name="mail" size={16} color={colors.primary} />
          <Text style={styles.outlineButtonText}>Contact support about my data</Text>
        </TouchableOpacity>

        <Text style={styles.groupTitle}>POLICIES</Text>
        <View style={styles.card}>
          <TouchableOpacity style={[styles.linkRow, styles.rowBorder]} activeOpacity={0.7} onPress={() => navigation.navigate('AccountPrivacyPolicy')}>
            <Text style={styles.linkText}>View Privacy Policy</Text>
            <Icon name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow} activeOpacity={0.7} onPress={() => navigation.navigate('AccountTerms')}>
            <Text style={styles.linkText}>View Terms & Conditions</Text>
            <Icon name="chevron-right" size={18} color={colors.textMuted} />
          </TouchableOpacity>
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
  body: {padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxxl},
  groupTitle: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.8, marginTop: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  row: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowText: {flex: 1},
  rowLabel: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  rowSub: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 18},
  paragraph: {...typography.label, fontSize: 13, color: colors.textSecondary, lineHeight: 20},
  outlineButton: {flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.xs},
  outlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.primary},
  linkRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  linkText: {...typography.bodyMedium, fontSize: 14, color: colors.primary},
});
