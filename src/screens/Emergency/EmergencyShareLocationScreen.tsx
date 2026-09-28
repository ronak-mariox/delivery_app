import React, {useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage} from '../../services/api';
import {LocationShare, shareEmergencyLocation, stopSharingEmergencyLocation} from '../../services/driverApi';
import {formatDateTime} from './incidentLabels';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyShareLocation'>;

function parseCoordinate(raw: string, min: number, max: number): number | null {
  const trimmed = raw.trim();
  if (!trimmed || !/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return null;
  }
  const value = Number(trimmed);
  return value >= min && value <= max ? value : null;
}

export function EmergencyShareLocationScreen({navigation, route}: Props) {
  const incidentId = route.params?.incidentId;
  const {activeOrders} = useOrders();
  const activeOrder = activeOrders[0];
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [share, setShare] = useState<LocationShare | null>(null);
  const [sharing, setSharing] = useState(false);
  const [stopping, setStopping] = useState(false);

  const lat = parseCoordinate(latInput, -90, 90);
  const lng = parseCoordinate(lngInput, -180, 180);
  const latInvalid = latInput.trim().length > 0 && lat === null;
  const lngInvalid = lngInput.trim().length > 0 && lng === null;
  const canShare = lat !== null && lng !== null && !sharing && !stopping;

  const shareNow = async () => {
    if (lat === null || lng === null) {
      return;
    }
    setSharing(true);
    try {
      setShare(await shareEmergencyLocation({lat, lng, orderId: activeOrder?.id, incidentId}));
    } catch (err) {
      Alert.alert('Could not share location', getApiErrorMessage(err));
    } finally {
      setSharing(false);
    }
  };

  const stopSharing = async () => {
    setStopping(true);
    try {
      await stopSharingEmergencyLocation();
      setShare(null);
    } catch (err) {
      Alert.alert('Could not stop sharing', getApiErrorMessage(err));
    } finally {
      setStopping(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share My Location</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.mapPlaceholder}>
          <Icon name="map-pin" size={28} color={colors.white} />
          {share ? (
            <View style={styles.coordsBadge}>
              <Text style={styles.coordsText}>
                {share.lat.toFixed(5)}, {share.lng.toFixed(5)}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Coordinates</Text>
          <Text style={styles.helpText}>Copy your latitude and longitude from your maps app and enter them below so the safety team can find you.</Text>
          <View>
            <Text style={styles.label}>Latitude</Text>
            <TextInput
              style={[styles.input, latInvalid && styles.inputError]}
              value={latInput}
              onChangeText={setLatInput}
              placeholder="e.g. 12.97160"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {latInvalid ? <Text style={styles.errorText}>Enter a number between -90 and 90</Text> : null}
          </View>
          <View>
            <Text style={styles.label}>Longitude</Text>
            <TextInput
              style={[styles.input, lngInvalid && styles.inputError]}
              value={lngInput}
              onChangeText={setLngInput}
              placeholder="e.g. 77.59460"
              placeholderTextColor={colors.textMuted}
              keyboardType="numbers-and-punctuation"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {lngInvalid ? <Text style={styles.errorText}>Enter a number between -180 and 180</Text> : null}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sharing Status</Text>
          {share ? (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sharing since</Text>
                <Text style={styles.infoValue}>{formatDateTime(share.startedAt)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Shared with</Text>
                <Text style={styles.infoValue}>Verdant safety team</Text>
              </View>
            </>
          ) : (
            <Text style={styles.helpText}>Not sharing. Your location is only sent when you tap Share Location.</Text>
          )}
          {activeOrder ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Linked order</Text>
              <Text style={styles.infoValue}>#{activeOrder.orderNumber}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.primaryButton, !canShare && styles.buttonDisabled]} activeOpacity={0.85} onPress={shareNow} disabled={!canShare}>
          {sharing ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryButtonText}>{share ? 'Update Shared Location' : 'Share Location'}</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.outlineButton, (!share || stopping) && styles.buttonDisabled]} activeOpacity={0.85} onPress={stopSharing} disabled={!share || stopping}>
          {stopping ? <ActivityIndicator color={colors.textSecondary} /> : <Text style={styles.outlineButtonText}>Stop Sharing</Text>}
        </TouchableOpacity>
      </View>
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
  backButton: {width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 140},
  mapPlaceholder: {height: 160, backgroundColor: '#1F2937', borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  coordsBadge: {position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 6, paddingHorizontal: spacing.sm, paddingVertical: 4},
  coordsText: {...typography.caption, fontSize: 12, color: colors.white, fontFamily: 'Courier'},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  helpText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  label: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginBottom: spacing.xs},
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    height: 44,
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  inputError: {borderColor: colors.danger},
  errorText: {...typography.caption, fontSize: 12, color: colors.danger, marginTop: spacing.xs},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between'},
  infoLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  infoValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
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
  buttonDisabled: {opacity: 0.5},
  outlineButton: {borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, height: 44, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.textSecondary},
});
