import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {ErrorState, Icon, Loader} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {getApiErrorMessage} from '../../services/api';
import {EmergencyIncident, getEmergencyIncident} from '../../services/driverApi';
import {formatDateTime, incidentStatusLabel, incidentTypeLabel, shortIncidentId} from './incidentLabels';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyIncidentReported'>;

const STATUS_ORDER: EmergencyIncident['status'][] = ['notified', 'reviewing', 'follow_up_scheduled', 'resolved'];

export function EmergencyIncidentReportedScreen({navigation, route}: Props) {
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

  const returnHome = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  const summaryRows = incident
    ? [
        {label: 'Incident #', value: shortIncidentId(incident.id)},
        {label: 'Type', value: incidentTypeLabel(incident.type)},
        {label: 'Submitted', value: formatDateTime(incident.createdAt)},
        {label: 'Status', value: incidentStatusLabel(incident.status)},
        {label: 'Medical attention', value: incident.medicalNeeded ? 'Requested' : 'Not needed'},
        {label: 'Evidence', value: incident.evidenceUrls.length ? `${incident.evidenceUrls.length} photo(s)` : 'None'},
        ...(incident.orderId ? [{label: 'Linked order', value: incident.orderReassigned ? 'Reassigned' : 'Paused'}] : []),
      ]
    : [];

  const currentStep = incident ? STATUS_ORDER.indexOf(incident.status) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Icon name="check" size={28} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Incident Reported</Text>
        <Text style={styles.heroSubtitle}>Your report has been received</Text>
      </View>

      {loading ? (
        <Loader fullscreen label="Loading report…" />
      ) : error || !incident ? (
        <ErrorState title="Could not load report" description={error ?? undefined} onRetry={load} />
      ) : (
        <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Report Summary</Text>
            {summaryRows.map((row, index) => (
              <View key={row.label} style={[styles.summaryRow, index < summaryRows.length - 1 && styles.rowBorder]}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={styles.summaryValue}>{row.value}</Text>
              </View>
            ))}
            {incident.description ? <Text style={styles.description}>{incident.description}</Text> : null}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Next Steps</Text>
            {STATUS_ORDER.map((status, index) => {
              const done = index < currentStep || status === 'resolved' && incident.status === 'resolved';
              const active = index === currentStep;
              return (
                <View key={status} style={styles.stepRow}>
                  {done ? (
                    <View style={styles.stepDotDone}>
                      <Icon name="check" size={13} color={colors.white} />
                    </View>
                  ) : active ? (
                    <View style={styles.stepDotActive} />
                  ) : (
                    <View style={styles.stepDotPending} />
                  )}
                  <Text style={done || active ? styles.stepText : styles.stepTextMuted}>{incidentStatusLabel(status)}</Text>
                  {active && status !== 'resolved' ? <Text style={styles.stepStatus}>In progress</Text> : null}
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencySupport')}>
          <Text style={styles.primaryButtonText}>Contact Support Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyShareLocation', {incidentId})}>
          <Text style={styles.outlineButtonText}>Share My Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} activeOpacity={0.85} onPress={returnHome}>
          <Text style={styles.ghostButtonText}>Return to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: colors.warning, alignItems: 'center', gap: spacing.xs, paddingTop: 44, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  heroIcon: {width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm},
  heroTitle: {...typography.h4, fontSize: 20, color: colors.white},
  heroSubtitle: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.85)'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 160},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, paddingVertical: spacing.xs},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  summaryLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  summaryValue: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary, flexShrink: 1, textAlign: 'right'},
  description: {...typography.body, fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs},
  stepRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  stepDotDone: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  stepDotActive: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.warning},
  stepDotPending: {width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border},
  stepText: {...typography.body, fontSize: 14, color: colors.textPrimary, flex: 1},
  stepTextMuted: {...typography.body, fontSize: 14, color: colors.textSecondary, flex: 1},
  stepStatus: {...typography.bodySemibold, fontSize: 11, color: colors.warning},
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
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.md, height: 48, alignItems: 'center', justifyContent: 'center'},
  primaryButtonText: {...typography.bodyBold, fontSize: 15, color: colors.white},
  outlineButton: {borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, height: 44, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  ghostButton: {height: 40, alignItems: 'center', justifyContent: 'center'},
  ghostButtonText: {...typography.body, fontSize: 14, color: colors.textSecondary},
});
