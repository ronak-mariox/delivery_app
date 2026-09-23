import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountActiveSessions'>;

export function AccountActiveSessionsScreen({navigation}: Props) {
  const [otherLoggedOut, setOtherLoggedOut] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Sessions</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>Devices currently logged in to your account.</Text>

        <View style={styles.deviceCardActive}>
          <View style={styles.deviceTopRow}>
            <View style={styles.deviceLeft}>
              <Icon name="monitor" size={22} color={colors.textPrimary} />
              <View>
                <Text style={styles.deviceName}>Samsung Galaxy A53</Text>
                <Text style={styles.deviceOs}>Android 13</Text>
              </View>
            </View>
            <View style={styles.thisDevicePill}>
              <Text style={styles.thisDevicePillText}>This Device</Text>
            </View>
          </View>
          <Text style={styles.deviceLocation}>Bengaluru, IN · Active now</Text>
          <Text style={styles.deviceHint}>Cannot logout current device</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('StateSessionExpired')}>
            <Text style={styles.sessionExpiryLink}>What happens if this session expires?</Text>
          </TouchableOpacity>
        </View>

        {!otherLoggedOut && (
          <View style={styles.deviceCard}>
            <View style={styles.deviceLeft}>
              <Icon name="smartphone" size={22} color={colors.textPrimary} />
              <View>
                <Text style={styles.deviceName}>iPhone 12</Text>
                <Text style={styles.deviceOs}>iOS 16</Text>
              </View>
            </View>
            <Text style={styles.deviceLocation}>Mumbai, IN · Last active Sep 2, 2026</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setOtherLoggedOut(true)}>
              <Text style={styles.logoutDeviceText}>Logout from this device</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.dangerBanner}>
          <Text style={styles.dangerText}>If you do not recognize a device, logout immediately and contact support.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.dangerButton} activeOpacity={0.85} onPress={() => navigation.navigate('AccountLoggingOut')}>
          <Text style={styles.dangerButtonText}>Logout All Other Devices</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} activeOpacity={0.85} onPress={() => navigation.navigate('SupportHub')}>
          <Text style={styles.ghostButtonText}>Contact Support</Text>
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
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 140},
  intro: {...typography.label, fontSize: 13, color: colors.textSecondary},
  deviceCardActive: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  deviceCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  deviceTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  deviceLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  deviceName: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  deviceOs: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  thisDevicePill: {backgroundColor: colors.primarySurface, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4},
  thisDevicePillText: {...typography.bodyBold, fontSize: 11, color: colors.primary},
  deviceLocation: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  deviceHint: {...typography.caption, fontSize: 12, color: colors.textMuted, fontStyle: 'italic'},
  sessionExpiryLink: {...typography.captionSemibold, fontSize: 12, color: colors.primary, marginTop: 2},
  logoutDeviceText: {...typography.bodySemibold, fontSize: 13, color: colors.danger, textAlign: 'center'},
  dangerBanner: {backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: '#FECDCA', borderRadius: radius.md, padding: spacing.md},
  dangerText: {...typography.label, fontSize: 13, color: '#912018'},
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
  dangerButton: {borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  dangerButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.danger},
  ghostButton: {alignItems: 'center', paddingVertical: spacing.xs},
  ghostButtonText: {...typography.label, fontSize: 13, color: colors.textSecondary},
});
