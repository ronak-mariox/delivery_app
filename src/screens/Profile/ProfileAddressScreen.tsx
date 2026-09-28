import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Badge, EmptyState, Icon, IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {ContactSupport} from './ContactSupport';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileAddress'>;

const ADDRESS_TYPE_LABEL = {home: 'Home', work: 'Work', other: 'Other'} as const;

export function ProfileAddressScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const address = driver?.address;

  const rows = address
    ? [
        {label: 'Address line', value: address.line1},
        {label: 'Area / Locality', value: address.area},
        {label: 'City', value: address.city},
        {label: 'State', value: address.state},
        {label: 'PIN code', value: address.pincode},
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Home Address</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {address ? (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Icon name="map-pin" size={20} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.summaryText}>
                  {address.line1}, {address.area}
                </Text>
                <Text style={styles.summarySub}>
                  {address.city}, {address.state} {address.pincode}
                </Text>
              </View>
              <Badge label={ADDRESS_TYPE_LABEL[address.addressType] ?? 'Other'} tone="primary" />
            </View>

            <View style={styles.card}>
              {rows.map((row, index) => (
                <View key={row.label} style={[styles.row, index < rows.length - 1 && styles.rowBorder]}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowValue}>{row.value || '—'}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <EmptyState icon="map-pin" title="No address on file" description="Your home address was not captured during registration." />
        )}

        <ContactSupport description="To change your address, contact support." />
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
  summaryIcon: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  summaryText: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  summarySub: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  row: {paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 15, color: colors.textPrimary, marginTop: 3},
});
