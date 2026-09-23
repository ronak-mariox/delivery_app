import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyIncidentReport'>;

const INCIDENT_TYPES = ['Accident or injury', 'Threatening/abusive customer', 'Unsafe location', 'Vehicle theft or break-in', 'Other safety concern'];

export function EmergencyIncidentReportScreen({navigation}: Props) {
  const [incidentType, setIncidentType] = useState(INCIDENT_TYPES[0]);
  const [description, setDescription] = useState('Customer became aggressive and threatening when I arrived at the delivery location.');
  const [medicalNeeded, setMedicalNeeded] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Incident Report</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Incident Type</Text>
          <View style={styles.radioList}>
            {INCIDENT_TYPES.map(type => {
              const active = type === incidentType;
              return (
                <TouchableOpacity
                  key={type}
                  style={[styles.radioRow, active && styles.radioRowActive]}
                  activeOpacity={0.8}
                  onPress={() => setIncidentType(type)}>
                  <View style={[styles.radioCircle, active && styles.radioCircleActive]}>{active && <View style={styles.radioDot} />}</View>
                  <Text style={[styles.radioText, active && styles.radioTextActive]}>{type}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Incident Details</Text>
          <View>
            <Text style={styles.label}>Date & Time</Text>
            <View style={styles.field}>
              <Text style={styles.fieldText}>Sep 6, 3:15 PM</Text>
            </View>
          </View>
          <View>
            <Text style={styles.label}>Location</Text>
            <View style={styles.field}>
              <Text style={styles.fieldText}>Koramangala 5th Block</Text>
            </View>
          </View>
          <View>
            <Text style={styles.label}>Description</Text>
            <TextInput style={styles.textArea} value={description} onChangeText={setDescription} multiline />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Evidence (Optional)</Text>
          <View style={styles.evidenceRow}>
            <TouchableOpacity style={styles.evidenceButton} activeOpacity={0.85}>
              <Icon name="camera" size={18} color={colors.textSecondary} />
              <Text style={styles.evidenceButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.evidenceButton} activeOpacity={0.85}>
              <Icon name="image" size={18} color={colors.textSecondary} />
              <Text style={styles.evidenceButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.thumbnailPlaceholder}>
            <Icon name="image" size={22} color={colors.textMuted} />
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
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyIncidentReported')}>
          <Text style={styles.primaryButtonText}>Submit Incident Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencySupport')}>
          <Text style={styles.outlineButtonText}>Call Support Instead</Text>
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
    height: 80,
    textAlignVertical: 'top',
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  evidenceRow: {flexDirection: 'row', gap: spacing.sm},
  evidenceButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, height: 44},
  evidenceButtonText: {...typography.label, fontSize: 13, color: colors.textSecondary},
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
  outlineButton: {borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, height: 44, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
});
