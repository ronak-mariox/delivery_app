import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {driverName, useDriverAuth} from '../../context/DriverAuthContext';
import {VEHICLE_TYPE_LABEL} from '../Profile/driverDisplay';
import LogoMark from '../../assets/brand/logo-mark.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'RiderApproved'>;

export function RiderApprovedScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const details = [
    {label: 'Reference ID', value: driver?.referenceId},
    {label: 'Vehicle', value: driver?.vehicleDetails?.registrationNumber},
    {label: 'Vehicle Type', value: driver?.vehicleType ? VEHICLE_TYPE_LABEL[driver.vehicleType] : null},
  ].filter((item): item is {label: string; value: string} => Boolean(item.value));

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.checkCircle}>
          <View style={styles.checkCircleInner}>
            <Icon name="check" size={30} color={colors.primary} />
          </View>
        </View>
        <Text style={styles.title}>{"You're Approved!"}</Text>
        <Text style={styles.subtitle}>Welcome to the Verdant Rider family</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.profileAvatar}>
              <Icon name="user" size={28} color={colors.primary} />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{driverName(driver)}</Text>
              <View style={styles.profileStatusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.profileStatus}>Active Rider</Text>
              </View>
            </View>
            <LogoMark width={32} height={32} />
          </View>
          {details.length > 0 && (
            <View style={styles.detailsGrid}>
              {details.map(item => (
                <View key={item.label} style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{item.label.toUpperCase()}</Text>
                  <Text style={styles.detailValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Button label="Go to Dashboard" onPress={() => navigation.reset({index: 0, routes: [{name: 'LocationPermission'}]})} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, alignItems: 'center', paddingVertical: spacing.huge, gap: 4},
  checkCircle: {width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  checkCircleInner: {width: 76, height: 76, borderRadius: 38, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h4, fontSize: 24, color: colors.white},
  subtitle: {...typography.body, color: 'rgba(255,255,255,0.8)'},
  body: {backgroundColor: colors.background, padding: spacing.xl, gap: spacing.lg},
  profileCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg},
  profileRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  profileAvatar: {width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primarySurface, borderWidth: 3, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  profileText: {flex: 1},
  profileName: {...typography.title, fontSize: 16, color: colors.textPrimary},
  profileStatusRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2},
  statusDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  profileStatus: {...typography.captionSemibold, color: colors.primary},
  detailsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md},
  detailItem: {width: '47%', backgroundColor: colors.background, borderRadius: radius.sm, padding: spacing.sm},
  detailLabel: {...typography.micro, fontSize: 10, color: colors.textMuted, letterSpacing: 0.4},
  detailValue: {...typography.labelSemibold, color: colors.textPrimary, marginTop: 2},
  actions: {gap: spacing.sm},
});
