import React from 'react';
import {Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, Icon, IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {ContactSupport} from './ContactSupport';
import {formatPhone, initialsOf} from './driverDisplay';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileEmergencyContact'>;

export function ProfileEmergencyContactScreen({navigation}: Props) {
  const {driver} = useDriverAuth();
  const contact = driver?.emergencyContact;

  const call = (number: string) => Linking.openURL(`tel:${number.replace(/\s/g, '')}`).catch(() => {});

  const rows = contact
    ? [
        {label: 'Name', value: contact.name},
        {label: 'Relationship', value: contact.relationship},
        {label: 'Mobile', value: formatPhone(contact.mobile), phone: contact.mobile},
        ...(contact.altMobile ? [{label: 'Alternate mobile', value: formatPhone(contact.altMobile), phone: contact.altMobile}] : []),
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Emergency Contact</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {contact ? (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initialsOf(contact.name)}</Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.summaryName}>{contact.name}</Text>
                <Text style={styles.summarySub}>{contact.relationship}</Text>
              </View>
              <TouchableOpacity style={styles.callButton} activeOpacity={0.8} onPress={() => call(contact.mobile)}>
                <Icon name="phone" size={16} color={colors.white} />
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              {rows.map((row, index) => (
                <TouchableOpacity
                  key={row.label}
                  style={[styles.row, index < rows.length - 1 && styles.rowBorder]}
                  activeOpacity={row.phone ? 0.7 : 1}
                  disabled={!row.phone}
                  onPress={() => row.phone && call(row.phone)}>
                  <View style={styles.flex}>
                    <Text style={styles.rowLabel}>{row.label}</Text>
                    <Text style={styles.rowValue}>{row.value || '—'}</Text>
                  </View>
                  {row.phone ? <Icon name="phone" size={16} color={colors.primary} /> : null}
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <EmptyState icon="user" title="No emergency contact" description="An emergency contact was not captured during registration." />
        )}

        <ContactSupport description="To change your emergency contact, contact support." />
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
  avatar: {width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  avatarText: {...typography.bodyBold, fontSize: 16, color: colors.primary},
  summaryName: {...typography.bodyBold, fontSize: 16, color: colors.textPrimary},
  summarySub: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  callButton: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 36},
  callButtonText: {...typography.labelSemibold, color: colors.white},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  row: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 15, color: colors.textPrimary, marginTop: 3},
});
