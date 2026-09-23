import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyModeActive'>;

const CHECKLIST = ['Order #VR-84821 has been paused.', 'Support team notified.', 'Your location is being shared.'];

export function EmergencyModeActiveScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <View style={styles.pulseDot} />
        <Text style={styles.statusTitle}>Emergency Mode Active</Text>
      </View>

      <View style={styles.center}>
        <View style={styles.iconRing}>
          <Icon name="phone" size={36} color={colors.white} />
        </View>
        <Text style={styles.connecting}>Connecting to Emergency Services</Text>
        <View style={styles.dotsRow}>
          <View style={styles.dotActive} />
          <View style={styles.dotInactive} />
          <View style={styles.dotInactive} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Order Automatically Paused</Text>
        {CHECKLIST.map(item => (
          <View key={item} style={styles.checkRow}>
            <Icon name="check" size={14} color={colors.primary} />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.locationLabel}>Your location</Text>
      <Text style={styles.locationValue}>Koramangala 5th Block — Sep 6, 3:15 PM</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.cancelButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Cancel Emergency</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callAgainButton} activeOpacity={0.85}>
          <Text style={styles.callAgainButtonText}>Call Again</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerHint}>Stay calm. Help is on the way. Do not leave your location if safe.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#111827', alignItems: 'center'},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: 52},
  pulseDot: {width: 16, height: 16, borderRadius: 8, backgroundColor: colors.danger},
  statusTitle: {...typography.h4, fontSize: 20, color: colors.white},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg, paddingHorizontal: spacing.xl},
  iconRing: {width: 80, height: 80, borderRadius: 40, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center'},
  connecting: {...typography.bodyLgMedium, fontSize: 18, color: colors.white},
  dotsRow: {flexDirection: 'row', gap: spacing.sm},
  dotActive: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.danger},
  dotInactive: {width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.4)'},
  card: {backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, marginHorizontal: spacing.lg, width: '100%', maxWidth: 382, gap: spacing.sm},
  cardTitle: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  checkRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  checkText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  locationLabel: {...typography.caption, fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: spacing.lg},
  locationValue: {...typography.bodyMedium, fontSize: 13, color: colors.white, marginTop: spacing.xs},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, width: '100%', maxWidth: 382, paddingHorizontal: spacing.lg, marginTop: spacing.lg},
  cancelButton: {flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderRadius: radius.md, height: 48, alignItems: 'center', justifyContent: 'center'},
  cancelButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.white},
  callAgainButton: {flex: 1, backgroundColor: colors.danger, borderRadius: radius.md, height: 48, alignItems: 'center', justifyContent: 'center'},
  callAgainButtonText: {...typography.bodyBold, fontSize: 14, color: colors.white},
  footerHint: {...typography.caption, fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'center', paddingHorizontal: spacing.xl, paddingBottom: spacing.xl, marginTop: spacing.lg},
});
