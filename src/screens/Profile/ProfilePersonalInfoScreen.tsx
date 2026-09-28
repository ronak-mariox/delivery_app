import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {driverName, driverPersonalInfo, useDriverAuth} from '../../context/DriverAuthContext';
import {resolveAssetUrl} from '../../services/api';
import {ContactSupport} from './ContactSupport';
import {formatDate, formatPhone, initialsOf} from './driverDisplay';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfilePersonalInfo'>;

const GENDER_LABEL = {female: 'Female', male: 'Male', other: 'Other'} as const;

export function ProfilePersonalInfoScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const name = driverName(driver);
  const info = driverPersonalInfo(driver);
  const avatarUri = resolveAssetUrl(driver?.avatarUrl);

  const rows = [
    {label: 'Full Name', value: info.fullName || '—'},
    {label: 'Mobile Number', value: formatPhone(driver?.phone)},
    {label: 'Email', value: info.email || '—'},
    {label: 'Date of Birth', value: formatDate(info.dob)},
    {label: 'Gender', value: info.gender ? GENDER_LABEL[info.gender] : '—'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Personal Information</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          {avatarUri ? <Image source={{uri: avatarUri}} style={styles.avatarImage} /> : <Avatar initials={initialsOf(name)} size={56} />}
          <View style={styles.flex}>
            <Text style={styles.summaryName}>{name}</Text>
            {driver?.referenceId ? <Text style={styles.summarySub}>Ref {driver.referenceId}</Text> : null}
          </View>
        </View>

        <View style={styles.card}>
          {rows.map((row, index) => (
            <View key={row.label} style={[styles.row, index < rows.length - 1 && styles.rowBorder]}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <ContactSupport />
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary, flex: 1},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  summaryCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  avatarImage: {width: 56, height: 56, borderRadius: 28},
  summaryName: {...typography.bodyBold, fontSize: 16, color: colors.textPrimary},
  summarySub: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  row: {paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 15, color: colors.textPrimary, marginTop: 3},
});
