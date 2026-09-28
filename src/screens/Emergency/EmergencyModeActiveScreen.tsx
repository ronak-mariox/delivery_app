import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {ErrorState, Icon, Loader} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {getApiErrorMessage} from '../../services/api';
import {EmergencyIncident, getEmergencyIncident} from '../../services/driverApi';
import {formatDateTime, incidentStatusLabel, incidentTypeLabel, shortIncidentId} from './incidentLabels';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyModeActive'>;

const EMERGENCY_NUMBER = '112';

export function EmergencyModeActiveScreen({navigation, route}: Props) {
  const {incidentId} = route.params;
  const [incident, setIncident] = useState<EmergencyIncident | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setIncident(await getEmergencyIncident(incidentId));
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [incidentId]);

  useEffect(() => {
    load();
  }, [load]);

  const callEmergencyServices = () => {
    Linking.openURL(`tel:${EMERGENCY_NUMBER}`).catch(() => Alert.alert('Unable to place call', `Please dial ${EMERGENCY_NUMBER} manually.`));
  };

  const checklist = incident
    ? [
        {key: 'notified', label: `Safety team notified at ${formatDateTime(incident.createdAt)}`, done: true},
        {key: 'status', label: `Status: ${incidentStatusLabel(incident.status)}`, done: incident.status !== 'notified'},
        {key: 'reassigned', label: incident.orderReassigned ? 'Your active order has been reassigned' : 'Your active order is paused', done: incident.orderReassigned},
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <View style={styles.pulseDot} />
        <Text style={styles.statusTitle}>Emergency Mode Active</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <Loader label="Loading incident…" />
        </View>
      ) : error || !incident ? (
        <View style={styles.center}>
          <View style={styles.errorCard}>
            <ErrorState title="Could not load incident" description={error ?? undefined} onRetry={load} />
          </View>
        </View>
      ) : (
        <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.iconRing}>
            <Icon name="shield" size={36} color={colors.white} />
          </View>
          <Text style={styles.headline}>{incidentTypeLabel(incident.type)}</Text>
          <Text style={styles.subline}>Incident #{shortIncidentId(incident.id)}</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>What we have done</Text>
            {checklist.map(item => (
              <View key={item.key} style={styles.checkRow}>
                <Icon name={item.done ? 'check' : 'clock'} size={14} color={item.done ? colors.primary : colors.warning} />
                <Text style={styles.checkText}>{item.label}</Text>
              </View>
            ))}
            {incident.earningsProtectedAmount != null ? (
              <View style={styles.checkRow}>
                <Icon name="check" size={14} color={colors.primary} />
                <Text style={styles.checkText}>Earnings protected: Rs. {incident.earningsProtectedAmount}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.metaBlock}>
            <Text style={styles.metaLabel}>Occurred at</Text>
            <Text style={styles.metaValue}>{formatDateTime(incident.occurredAt)}</Text>
            {incident.location ? (
              <>
                <Text style={styles.metaLabel}>Shared location</Text>
                <Text style={styles.metaValue}>{incident.location.address ?? `${incident.location.lat}, ${incident.location.lng}`}</Text>
              </>
            ) : null}
          </View>

          <TouchableOpacity style={styles.callButton} activeOpacity={0.85} onPress={callEmergencyServices}>
            <Icon name="phone" size={18} color={colors.white} />
            <Text style={styles.callButtonText}>Call {EMERGENCY_NUMBER}</Text>
          </TouchableOpacity>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyShareLocation', {incidentId})}>
              <Text style={styles.outlineButtonText}>Share Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.safeButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyResolved', {incidentId})}>
              <Text style={styles.safeButtonText}>I'm Safe</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerHint}>Stay calm. Do not leave your location if it is safe to stay. The safety team will follow up with you.</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#111827'},
  flex: {flex: 1},
  statusRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingTop: 52},
  pulseDot: {width: 16, height: 16, borderRadius: 8, backgroundColor: colors.danger},
  statusTitle: {...typography.h4, fontSize: 20, color: colors.white},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg},
  errorCard: {backgroundColor: colors.white, borderRadius: radius.lg, width: '100%'},
  body: {alignItems: 'center', gap: spacing.md, padding: spacing.lg, paddingBottom: spacing.xxl},
  iconRing: {width: 80, height: 80, borderRadius: 40, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg},
  headline: {...typography.bodyLgMedium, fontSize: 18, color: colors.white, textAlign: 'center'},
  subline: {...typography.caption, fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: -spacing.sm},
  card: {backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, width: '100%', gap: spacing.sm},
  cardTitle: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  checkRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  checkText: {...typography.label, fontSize: 13, color: colors.textSecondary, flex: 1},
  metaBlock: {alignItems: 'center', gap: spacing.xs},
  metaLabel: {...typography.caption, fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: spacing.xs},
  metaValue: {...typography.bodyMedium, fontSize: 13, color: colors.white},
  callButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.danger, borderRadius: radius.md, height: 52, width: '100%'},
  callButtonText: {...typography.bodyBold, fontSize: 15, color: colors.white},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, width: '100%'},
  outlineButton: {flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', borderRadius: radius.md, height: 48, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.white},
  safeButton: {flex: 1, backgroundColor: colors.primary, borderRadius: radius.md, height: 48, alignItems: 'center', justifyContent: 'center'},
  safeButtonText: {...typography.bodyBold, fontSize: 14, color: colors.white},
  footerHint: {...typography.caption, fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'center', paddingHorizontal: spacing.md},
});
