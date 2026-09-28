import React, {useState} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {driverName, useDriverAuth} from '../../context/DriverAuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountLogout'>;

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');
}

export function AccountLogoutScreen({navigation}: Props) {
  const {driver, logout} = useDriverAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const name = driverName(driver);

  const confirmLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigation.reset({index: 0, routes: [{name: 'Welcome'}]});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={loggingOut} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Logout</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Avatar initials={initialsOf(name) || 'D'} size={48} backgroundColor={colors.primary} textColor={colors.white} />
          <View>
            <Text style={styles.profileName}>{name}</Text>
            {driver?.phone ? <Text style={styles.profilePhone}>{driver.phone}</Text> : null}
          </View>
        </View>

        <View style={styles.noteBanner}>
          <Icon name="info" size={16} color={colors.textSecondary} />
          <Text style={styles.noteText}>You will be signed out on this device and will need to log in again with your mobile number and OTP.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.primaryButton, loggingOut && styles.primaryButtonDisabled]} activeOpacity={0.85} disabled={loggingOut} onPress={confirmLogout}>
          {loggingOut ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryButtonText}>Confirm Logout</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} activeOpacity={0.85} disabled={loggingOut} onPress={() => navigation.goBack()}>
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
  body: {padding: spacing.lg, gap: spacing.lg, paddingBottom: 160},
  profileCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  profileName: {...typography.bodySemibold, fontSize: 16, color: colors.textPrimary},
  profilePhone: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 2},
  noteBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.label, fontSize: 13, color: colors.textSecondary, flex: 1, lineHeight: 20},
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  primaryButton: {backgroundColor: colors.danger, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center', minHeight: 48, justifyContent: 'center'},
  primaryButtonDisabled: {opacity: 0.7},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  cancelButton: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  cancelButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary},
});
