import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, ProgressBar, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import LogoMark from '../../assets/brand/logo-mark.svg';
import {driverName, useDriverAuth} from '../../context/DriverAuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'FirstTimeSetup'>;

function maskAccount(accountNumber?: string): string {
  if (!accountNumber) {
    return 'Not added';
  }
  return `•••• ${accountNumber.slice(-4)}`;
}

export function FirstTimeSetupScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const documents = driver?.documents ?? {};
  const docCount = ['license_front', 'license_back', 'rc', 'insurance'].filter((k) => !!documents[k as keyof typeof documents]).length;

  const items = [
    {title: 'Profile', subtitle: driver?.kycStatus === 'verified' ? 'Identity verified' : `KYC ${driver?.kycStatus ?? 'pending'}`, done: driver?.kycStatus === 'verified'},
    {title: 'Documents', subtitle: `${docCount} of 4 uploaded`, done: docCount >= 3},
    {
      title: 'Vehicle',
      subtitle: driver?.vehicleDetails?.registrationNumber ?? driver?.vehicleType ?? 'Not added',
      done: !!driver?.vehicleDetails?.registrationNumber,
    },
    {title: 'Bank details', subtitle: maskAccount(driver?.bankDetails?.accountNumber), done: !!driver?.bankDetails?.accountNumber},
    {title: 'Account', subtitle: driver?.status === 'active' ? 'Active' : driver?.status ?? 'pending', done: driver?.status === 'active'},
  ];
  const completedSteps = items.filter((i) => i.done).length;
  const totalSteps = items.length;

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <LogoMark width={32} height={32} />
          <View style={styles.headerText}>
            <Text style={styles.welcome}>Welcome, {driverName(driver)}!</Text>
            <Text style={styles.headline}>You're ready to go live</Text>
          </View>
        </View>
        <View style={styles.progressBlock}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Setup progress</Text>
            <Text style={styles.progressValue}>
              {completedSteps} / {totalSteps} complete
            </Text>
          </View>
          <ProgressBar progress={completedSteps / totalSteps} height={8} trackColor="rgba(255,255,255,0.2)" fillColor={colors.white} style={styles.progressBar} />
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View key={item.title} style={styles.itemRow}>
            <View style={[styles.itemIcon, item.done ? styles.itemIconDone : styles.itemIconPending]}>
              <Icon name={item.done ? 'check' : 'alert-circle'} size={18} color={item.done ? colors.primary : colors.warning} />
            </View>
            <View style={styles.itemText}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.itemDone}>{item.done ? 'Done' : 'Pending'}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Go to Home" onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xl},
  headerTop: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  headerText: {flex: 1},
  welcome: {...typography.caption, color: 'rgba(255,255,255,0.6)'},
  headline: {...typography.bodyBold, color: colors.white},
  progressBlock: {marginTop: spacing.lg},
  progressLabelRow: {flexDirection: 'row', justifyContent: 'space-between'},
  progressLabel: {...typography.caption, color: 'rgba(255,255,255,0.8)'},
  progressValue: {...typography.captionSemibold, color: colors.white},
  progressBar: {marginTop: spacing.xs},
  body: {backgroundColor: colors.background, padding: spacing.lg, gap: spacing.sm},
  itemRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  itemIcon: {width: 36, height: 36, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center'},
  itemIconDone: {backgroundColor: colors.primarySurface},
  itemIconPending: {backgroundColor: '#FFFAEB'},
  itemText: {flex: 1},
  itemTitle: {...typography.labelSemibold, color: colors.textPrimary},
  itemSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  itemDone: {...typography.captionSemibold, color: colors.primary},
  footer: {padding: spacing.xl, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
