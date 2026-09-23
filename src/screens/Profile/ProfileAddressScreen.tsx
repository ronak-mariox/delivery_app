import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Input} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileAddress'>;

export function ProfileAddressScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Address</Text>
        <TouchableOpacity>
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View style={styles.homeIcon}>
              <Icon name="home" size={18} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.cardTitle}>Home Address</Text>
              <View style={styles.primaryPill}>
                <Text style={styles.primaryPillText}>Primary</Text>
              </View>
            </View>
          </View>
          <Text style={styles.addressLine}>42, 3rd Cross, Koramangala 4th Block</Text>
          <Text style={styles.addressLine}>Bengaluru, Karnataka 560034</Text>
          <View style={styles.gpsRow}>
            <Icon name="map-pin" size={14} color={colors.textSecondary} />
            <Text style={styles.gpsText}>Detected via GPS · Last updated Sep 1</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Edit Address</Text>
        <Input label="Flat / Door No" defaultValue="42" />
        <Input label="Street / Colony" defaultValue="3rd Cross, Koramangala 4th Block" />
        <Input label="City" defaultValue="Bengaluru" />
        <Input label="State" defaultValue="Karnataka" />
        <View>
          <Text style={styles.label}>Pincode</Text>
          <View style={styles.pincodeField}>
            <Text style={styles.pincodeText}>560034</Text>
            <Icon name="check" size={16} color={colors.primary} />
          </View>
        </View>

        <TouchableOpacity style={styles.detectButton} activeOpacity={0.8}>
          <Icon name="navigation" size={16} color={colors.primary} />
          <Text style={styles.detectButtonText}>Detect Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  editLink: {...typography.bodyMedium, fontSize: 14, color: colors.primary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardTopRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  homeIcon: {width: 34, height: 34, borderRadius: radius.sm, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  primaryPill: {backgroundColor: colors.primarySurface, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 1, marginTop: spacing.xxs, alignSelf: 'flex-start'},
  primaryPillText: {...typography.captionSemibold, fontSize: 10, color: colors.primary},
  addressLine: {...typography.bodyMedium, fontSize: 14, color: colors.textLabel, marginTop: spacing.sm},
  gpsRow: {flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm},
  gpsText: {...typography.caption, color: colors.textSecondary},
  sectionLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary, marginTop: spacing.sm},
  label: {...typography.label, color: colors.textLabel, marginBottom: spacing.xs},
  pincodeField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  pincodeText: {...typography.body, fontSize: 15, color: colors.textPrimary},
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    height: 48,
    marginTop: spacing.sm,
  },
  detectButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.primary},
  saveButton: {backgroundColor: colors.primary, borderRadius: radius.lg, height: 50, alignItems: 'center', justifyContent: 'center'},
  saveButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
});
