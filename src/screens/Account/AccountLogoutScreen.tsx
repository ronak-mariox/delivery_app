import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountLogout'>;

export function AccountLogoutScreen({navigation}: Props) {
  const [option, setOption] = useState<'device' | 'all'>('device');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Logout</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Avatar initials="RK" size={48} backgroundColor={colors.primary} textColor={colors.white} />
          <View>
            <Text style={styles.profileName}>Ravi Kumar</Text>
            <Text style={styles.profilePhone}>+91 98765 43210</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Logout options</Text>

        <TouchableOpacity
          style={[styles.optionCard, option === 'device' && styles.optionCardActive]}
          activeOpacity={0.8}
          onPress={() => setOption('device')}>
          <View style={styles.optionTopRow}>
            <Text style={styles.optionTitle}>Logout from this device only</Text>
            {option === 'device' && <Icon name="check" size={18} color={colors.primary} />}
          </View>
          <Text style={styles.optionSubtitle}>Remains logged in on other devices</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, option === 'all' && styles.optionCardActive]}
          activeOpacity={0.8}
          onPress={() => setOption('all')}>
          <View style={styles.optionTopRow}>
            <Text style={styles.optionTitle}>Logout from all devices</Text>
            {option === 'all' && <Icon name="check" size={18} color={colors.primary} />}
          </View>
          <Text style={styles.optionSubtitle}>Logs out from every active session</Text>
        </TouchableOpacity>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>You will need to log in again on any device you logout from.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('AccountLoggingOut')}>
          <Text style={styles.primaryButtonText}>Confirm Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
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
  body: {padding: spacing.xl, alignItems: 'center', gap: spacing.md, paddingBottom: 120},
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xxl,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    width: '100%',
    marginBottom: spacing.md,
  },
  profileName: {...typography.bodyBold, fontSize: 16, color: colors.textPrimary},
  profilePhone: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 2},
  sectionTitle: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary, alignSelf: 'flex-start'},
  optionCard: {width: '100%', borderWidth: 2, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  optionCardActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  optionTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  optionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  optionSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs},
  noteBanner: {width: '100%', backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm},
  noteText: {...typography.label, fontSize: 13, color: colors.textSecondary, textAlign: 'center'},
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  primaryButton: {flex: 1.6, backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  cancelButton: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  cancelButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
