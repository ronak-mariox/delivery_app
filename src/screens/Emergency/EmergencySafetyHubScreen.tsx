import React, {useState} from 'react';
import {ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage} from '../../services/api';
import {activateEmergency, EmergencyIncidentType} from '../../services/driverApi';
import {INCIDENT_TYPE_OPTIONS} from './incidentLabels';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencySafetyHub'>;

const EMERGENCY_NUMBER = '112';
const TIPS = ['Report unsafe locations', 'Leave immediately if you feel threatened', 'Your active order will be reassigned'];

export function EmergencySafetyHubScreen({navigation}: Props) {
  const {activeOrders} = useOrders();
  const activeOrder = activeOrders[0];
  const [selectedType, setSelectedType] = useState<EmergencyIncidentType>('other');
  const [activating, setActivating] = useState(false);

  const callEmergencyServices = () => {
    Linking.openURL(`tel:${EMERGENCY_NUMBER}`).catch(() => Alert.alert('Unable to place call', `Please dial ${EMERGENCY_NUMBER} manually.`));
  };

  const activate = async () => {
    setActivating(true);
    try {
      const incident = await activateEmergency({type: selectedType, orderId: activeOrder?.id});
      navigation.navigate('EmergencyModeActive', {incidentId: incident.id});
    } catch (err) {
      Alert.alert('Could not activate emergency', getApiErrorMessage(err));
    } finally {
      setActivating(false);
    }
  };

  const confirmActivate = () => {
    Alert.alert('Activate emergency mode?', 'The safety team will be alerted immediately and your active order will be paused.', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Activate', style: 'destructive', onPress: activate},
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Icon name="shield" size={48} color={colors.white} />
        <Text style={styles.heroTitle}>Emergency & Safety</Text>
        <Text style={styles.heroSubtitle}>Your safety is our top priority</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.emergencyButton} activeOpacity={0.85} onPress={callEmergencyServices}>
          <Icon name="phone" size={24} color={colors.white} />
          <Text style={styles.emergencyButtonText}>Call Emergency Services — {EMERGENCY_NUMBER}</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What is happening?</Text>
          <View style={styles.chipsWrap}>
            {INCIDENT_TYPE_OPTIONS.map(option => {
              const active = option.value === selectedType;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.chip, active && styles.chipActive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedType(option.value)}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={[styles.sosButton, activating && styles.buttonDisabled]} activeOpacity={0.85} onPress={confirmActivate} disabled={activating}>
            {activating ? <ActivityIndicator color={colors.white} /> : <Text style={styles.sosButtonText}>SOS — Alert Safety Team</Text>}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.safetyButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencySupport')}>
          <Icon name="headphones" size={22} color={colors.white} />
          <Text style={styles.safetyButtonText}>Contact Verdant Safety Team</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Safety Tips</Text>
          {TIPS.map(tip => (
            <View key={tip} style={styles.tipRow}>
              <Icon name="check" size={16} color={colors.primary} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {activeOrder ? (
          <View style={styles.warningBanner}>
            <Icon name="alert-triangle" size={18} color={colors.warning} />
            <Text style={styles.warningText}>
              Active delivery <Text style={styles.warningBold}>#{activeOrder.orderNumber}</Text> will be attached to any alert you raise
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyShareLocation', undefined)}>
          <Text style={styles.outlineButtonText}>Share My Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerOutlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyIncidentReport')}>
          <Text style={styles.dangerOutlineButtonText}>Incident Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: '#D92D20', alignItems: 'center', gap: spacing.xs, paddingTop: 56, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  heroTitle: {...typography.h4, fontSize: 20, color: colors.white, marginTop: spacing.sm},
  heroSubtitle: {...typography.label, fontSize: 14, color: 'rgba(255,255,255,0.8)'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 120},
  emergencyButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.danger, borderRadius: radius.lg, height: 64},
  emergencyButtonText: {...typography.bodyBold, fontSize: 16, color: colors.white},
  safetyButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: '#1F2937', borderRadius: radius.lg, height: 60},
  safetyButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  chipsWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  chip: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  chipActive: {backgroundColor: colors.dangerSurface, borderColor: colors.danger},
  chipText: {...typography.label, fontSize: 13, color: colors.textPrimary},
  chipTextActive: {color: colors.danger, fontWeight: '600'},
  sosButton: {backgroundColor: colors.danger, borderRadius: radius.md, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: spacing.xs},
  sosButtonText: {...typography.bodyBold, fontSize: 15, color: colors.white},
  buttonDisabled: {opacity: 0.6},
  tipRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  tipText: {...typography.body, fontSize: 14, color: colors.textSecondary},
  warningBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.md, padding: spacing.md},
  warningText: {...typography.label, fontSize: 13, color: colors.warningText, flex: 1},
  warningBold: {...typography.bodyBold, fontSize: 13, color: colors.warningText},
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  outlineButton: {flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, height: 44, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  dangerOutlineButton: {flex: 1, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.md, height: 44, alignItems: 'center', justifyContent: 'center'},
  dangerOutlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.danger},
});
