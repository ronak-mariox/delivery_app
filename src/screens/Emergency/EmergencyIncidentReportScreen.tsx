import React, {useState} from 'react';
import {ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage, PickedAsset, uploadEvidence} from '../../services/api';
import {EmergencyIncidentType, reportEmergencyIncident} from '../../services/driverApi';
import {INCIDENT_TYPE_OPTIONS} from './incidentLabels';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyIncidentReport'>;

const MAX_EVIDENCE = 5;

export function EmergencyIncidentReportScreen({navigation}: Props) {
  const {activeOrders} = useOrders();
  const activeOrder = activeOrders[0];
  const [incidentType, setIncidentType] = useState<EmergencyIncidentType>('accident');
  const [description, setDescription] = useState('');
  const [medicalNeeded, setMedicalNeeded] = useState(false);
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePicked = async (response: {didCancel?: boolean; errorMessage?: string; assets?: PickedAsset[]}) => {
    if (response.didCancel) {
      return;
    }
    if (response.errorMessage) {
      Alert.alert('Error', response.errorMessage);
      return;
    }
    const asset = response.assets?.[0];
    if (!asset?.uri) {
      return;
    }
    setUploading(true);
    try {
      const url = await uploadEvidence(asset);
      setEvidenceUrls(prev => [...prev, url]);
    } catch (err) {
      Alert.alert('Upload failed', getApiErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const pickFromCamera = () => launchCamera({mediaType: 'photo', quality: 0.8}, handlePicked);
  const pickFromGallery = () => launchImageLibrary({mediaType: 'photo', quality: 0.8}, handlePicked);
  const removeEvidence = (url: string) => setEvidenceUrls(prev => prev.filter(u => u !== url));

  const canSubmit = !submitting && !uploading;

  const submit = async () => {
    if (!canSubmit) {
      return;
    }
    setSubmitting(true);
    try {
      const incident = await reportEmergencyIncident({
        type: incidentType,
        description: description.trim() || undefined,
        medicalNeeded,
        evidenceUrls,
        orderId: activeOrder?.id,
      });
      navigation.navigate('EmergencyIncidentReported', {incidentId: incident.id});
    } catch (err) {
      Alert.alert('Could not submit report', getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Incident Report</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Incident Type</Text>
          <View style={styles.radioList}>
            {INCIDENT_TYPE_OPTIONS.map(option => {
              const active = option.value === incidentType;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.radioRow, active && styles.radioRowActive]}
                  activeOpacity={0.8}
                  onPress={() => setIncidentType(option.value)}>
                  <View style={[styles.radioCircle, active && styles.radioCircleActive]}>{active && <View style={styles.radioDot} />}</View>
                  <Text style={[styles.radioText, active && styles.radioTextActive]}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Incident Details</Text>
          {activeOrder ? (
            <View>
              <Text style={styles.label}>Linked order</Text>
              <View style={styles.field}>
                <Text style={styles.fieldText}>#{activeOrder.orderNumber}</Text>
              </View>
            </View>
          ) : null}
          <View>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what happened, where you are, and whether anyone else is involved."
              placeholderTextColor={colors.textMuted}
              multiline
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Evidence (Optional)</Text>
          <View style={styles.evidenceRow}>
            <TouchableOpacity style={styles.evidenceButton} activeOpacity={0.85} onPress={pickFromCamera} disabled={uploading || evidenceUrls.length >= MAX_EVIDENCE}>
              <Icon name="camera" size={18} color={colors.textSecondary} />
              <Text style={styles.evidenceButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.evidenceButton} activeOpacity={0.85} onPress={pickFromGallery} disabled={uploading || evidenceUrls.length >= MAX_EVIDENCE}>
              <Icon name="image" size={18} color={colors.textSecondary} />
              <Text style={styles.evidenceButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.thumbnailRow}>
            {evidenceUrls.map(url => (
              <View key={url} style={styles.thumbnailWrap}>
                <Image source={{uri: url}} style={styles.thumbnail} />
                <TouchableOpacity style={styles.thumbnailRemove} onPress={() => removeEvidence(url)} hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
                  <Icon name="x" size={12} color={colors.white} />
                </TouchableOpacity>
              </View>
            ))}
            {uploading ? (
              <View style={styles.thumbnailPlaceholder}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : evidenceUrls.length === 0 ? (
              <View style={styles.thumbnailPlaceholder}>
                <Icon name="image" size={22} color={colors.textMuted} />
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Medical Attention Needed?</Text>
          <View style={styles.yesNoRow}>
            <TouchableOpacity
              style={[styles.yesNoButton, medicalNeeded && styles.yesNoButtonActive]}
              activeOpacity={0.8}
              onPress={() => setMedicalNeeded(true)}>
              <Text style={[styles.yesNoText, medicalNeeded && styles.yesNoTextActive]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.yesNoButton, !medicalNeeded && styles.yesNoButtonActive]}
              activeOpacity={0.8}
              onPress={() => setMedicalNeeded(false)}>
              <Text style={[styles.yesNoText, !medicalNeeded && styles.yesNoTextActive]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.primaryButton, !canSubmit && styles.buttonDisabled]} activeOpacity={0.85} onPress={submit} disabled={!canSubmit}>
          {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryButtonText}>Submit Incident Report</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencySupport')}>
          <Text style={styles.outlineButtonText}>Contact Support Instead</Text>
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
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  radioList: {gap: spacing.sm},
  radioRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  radioRowActive: {backgroundColor: colors.dangerSurface, borderColor: colors.danger},
  radioCircle: {width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.border},
  radioCircleActive: {borderColor: colors.danger, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center'},
  radioDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white},
  radioText: {...typography.body, fontSize: 14, color: colors.textPrimary},
  radioTextActive: {color: colors.danger, fontWeight: '600'},
  label: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginBottom: spacing.xs},
  field: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  fieldText: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  textArea: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    height: 100,
    textAlignVertical: 'top',
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  evidenceRow: {flexDirection: 'row', gap: spacing.sm},
  evidenceButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, height: 44},
  evidenceButtonText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  thumbnailRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  thumbnailWrap: {width: 64, height: 64},
  thumbnail: {width: 64, height: 64, borderRadius: radius.sm, backgroundColor: colors.border},
  thumbnailRemove: {position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center'},
  thumbnailPlaceholder: {width: 64, height: 64, borderRadius: radius.sm, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  yesNoRow: {flexDirection: 'row', gap: spacing.sm},
  yesNoButton: {flex: 1, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, height: 40, alignItems: 'center', justifyContent: 'center'},
  yesNoButtonActive: {backgroundColor: colors.primarySurface, borderWidth: 2, borderColor: colors.primary},
  yesNoText: {...typography.body, fontSize: 14, color: colors.textSecondary},
  yesNoTextActive: {color: colors.primary, fontWeight: '600'},
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
  buttonDisabled: {opacity: 0.6},
  outlineButton: {borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, height: 44, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
});
