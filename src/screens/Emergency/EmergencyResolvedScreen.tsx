import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {ErrorState, Icon, Loader} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {getApiErrorMessage} from '../../services/api';
import {EmergencyIncident, getEmergencyIncident} from '../../services/driverApi';
import {formatDateTime, incidentStatusLabel, incidentTypeLabel, shortIncidentId} from './incidentLabels';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyResolved'>;

export function EmergencyResolvedScreen({navigation, route}: Props) {
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

  const resolved = incident?.status === 'resolved';

  const detailRows = incident
    ? [
        {label: 'Incident #', value: shortIncidentId(incident.id)},
        {label: 'Type', value: incidentTypeLabel(incident.type)},
        {label: 'Reported at', value: formatDateTime(incident.createdAt)},
        {label: 'Status', value: incidentStatusLabel(incident.status)},
        ...(incident.resolvedAt ? [{label: 'Resolved at', value: formatDateTime(incident.resolvedAt)}] : []),
        ...(incident.actionTaken ? [{label: 'Action taken', value: incident.actionTaken}] : []),
      ]
    : [];

  const statusItems = incident
    ? [
        {key: 'safe', label: 'You have marked yourself safe', done: true},
        {key: 'order', label: incident.orderReassigned ? 'Order reassigned to another rider' : 'Your active order remains paused', done: incident.orderReassigned},
        ...(incident.earningsProtectedAmount != null ? [{key: 'earnings', label: `Earnings protected: Rs. ${incident.earningsProtectedAmount}`, done: true}] : []),
      ]
    : [];

  return (
    <View style={styles.container}>
      <View style={[styles.hero, !resolved && styles.heroPending]}>
        <View style={styles.heroIcon}>
          <Icon name={resolved ? 'check' : 'clock'} size={28} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>{resolved ? 'Emergency Resolved' : 'Glad you are safe'}</Text>
        <Text style={styles.heroSubtitle}>
          {incident ? (resolved ? `Incident #${shortIncidentId(incident.id)} closed.` : `Incident #${shortIncidentId(incident.id)} is ${incidentStatusLabel(incident.status).toLowerCase()}.`) : ''}
        </Text>
      </View>

      {loading ? (
        <Loader fullscreen label="Loading incident…" />
      ) : error || !incident ? (
        <ErrorState title="Could not load incident" description={error ?? undefined} onRetry={load} />
      ) : (
        <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{resolved ? 'Resolution Details' : 'Incident Details'}</Text>
            {detailRows.map((row, index) => (
              <View key={row.label} style={[styles.summaryRow, index < detailRows.length - 1 && styles.rowBorder]}>
                <Text style={styles.summaryLabel}>{row.label}</Text>
                <Text style={styles.summaryValue}>{row.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Status</Text>
            {statusItems.map(item => (
              <View key={item.key} style={styles.statusRow}>
                <View style={[styles.statusDot, !item.done && styles.statusDotPending]}>
                  <Icon name={item.done ? 'check' : 'clock'} size={13} color={colors.white} />
                </View>
                <Text style={styles.statusText}>{item.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.noteBanner}>
            <Text style={styles.noteText}>
              {resolved
                ? 'Take a moment before continuing. You can go offline anytime.'
                : 'The safety team is still reviewing this incident and will follow up with you. Take a moment before continuing.'}
            </Text>
          </View>
        </ScrollView>
      )}

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={returnHome}>
          <Text style={styles.primaryButtonText}>Return to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencySupport')}>
          <Text style={styles.outlineButtonText}>Contact Safety Team</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: colors.primary, alignItems: 'center', gap: spacing.xs, paddingTop: 44, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  heroPending: {backgroundColor: colors.warning},
  heroIcon: {width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm},
  heroTitle: {...typography.h4, fontSize: 20, color: colors.white},
  heroSubtitle: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 140},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, paddingVertical: spacing.xs},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  summaryLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  summaryValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary, flexShrink: 1, textAlign: 'right'},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  statusDot: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  statusDotPending: {backgroundColor: colors.warning},
  statusText: {...typography.body, fontSize: 14, color: colors.textPrimary, flex: 1},
  noteBanner: {backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.label, fontSize: 13, color: colors.primaryDark},
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
});
