import React, {useState} from 'react';
import {Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Input} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileEmergencyContact'>;

const RELATIONSHIPS = ['Spouse', 'Parent', 'Sibling', 'Other'] as const;
const CONTACT_PHONE = '+91 87654 32109';

export function ProfileEmergencyContactScreen({navigation}: Props) {
  const [relationship, setRelationship] = useState<(typeof RELATIONSHIPS)[number]>('Spouse');
  const [consented, setConsented] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contact</Text>
        <TouchableOpacity>
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.contactIcon}>
              <Icon name="user" size={18} color={colors.primary} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.contactName}>Meena Kumar</Text>
              <Text style={styles.contactRelation}>Relationship: Wife</Text>
              <View style={styles.phoneRow}>
                <Text style={styles.contactPhone}>{CONTACT_PHONE}</Text>
                <View style={styles.verifiedBadge}>
                  <Icon name="check" size={9} color={colors.primary} />
                  <Text style={styles.verifiedBadgeText}>Verified</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.callButton} activeOpacity={0.8} onPress={() => Linking.openURL(`tel:${CONTACT_PHONE.replace(/\s/g, '')}`)}>
              <Icon name="phone" size={16} color={colors.primary} />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
              <Icon name="edit" size={16} color={colors.textSecondary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Edit Contact</Text>
          <Input label="Contact Name" defaultValue="Meena Kumar" />
          <View style={styles.fieldSpacing}>
            <Text style={styles.label}>Relationship</Text>
            <View style={styles.relRow}>
              {RELATIONSHIPS.map(r => (
                <TouchableOpacity key={r} style={[styles.relPill, relationship === r && styles.relPillActive]} activeOpacity={0.8} onPress={() => setRelationship(r)}>
                  <Text style={[styles.relPillText, relationship === r && styles.relPillTextActive]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.fieldSpacing}>
            <Input label="Mobile Number" defaultValue={CONTACT_PHONE} keyboardType="phone-pad" />
          </View>
          <TouchableOpacity style={styles.consentRow} activeOpacity={0.8} onPress={() => setConsented(v => !v)}>
            <View style={[styles.checkbox, consented && styles.checkboxChecked]}>{consented && <Icon name="check" size={11} color={colors.white} />}</View>
            <Text style={styles.consentText}>I confirm this person has consented to be listed as my emergency contact</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.saveButtonText}>Save Emergency Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.removeButtonText}>Remove Contact</Text>
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
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md},
  topRow: {flexDirection: 'row', gap: spacing.md},
  contactIcon: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  contactName: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary},
  contactRelation: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  phoneRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs},
  contactPhone: {...typography.label, fontSize: 13, color: colors.textLabel},
  verifiedBadge: {flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.primarySurface, borderRadius: radius.pill, paddingHorizontal: 7, paddingVertical: 2},
  verifiedBadgeText: {...typography.captionSemibold, fontSize: 10, color: colors.primary},
  actionsRow: {flexDirection: 'row', gap: spacing.sm},
  callButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.primarySurface, borderRadius: radius.sm, height: 38},
  callButtonText: {...typography.bodySemibold, fontSize: 13, color: colors.primary},
  editButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, height: 38},
  editButtonText: {...typography.bodyMedium, fontSize: 13, color: colors.textSecondary},
  sectionLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  fieldSpacing: {marginTop: spacing.xs},
  label: {...typography.label, color: colors.textLabel, marginBottom: spacing.sm},
  relRow: {flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap'},
  relPill: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  relPillActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  relPillText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  relPillTextActive: {...typography.labelSemibold, color: colors.primary},
  consentRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: '#F9FAFB', borderRadius: radius.md, padding: spacing.md},
  checkbox: {width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center', marginTop: 1},
  checkboxChecked: {backgroundColor: colors.primary, borderColor: colors.primary},
  consentText: {...typography.caption, fontSize: 12, color: colors.textSecondary, flex: 1},
  saveButton: {backgroundColor: colors.primary, borderRadius: radius.lg, height: 50, alignItems: 'center', justifyContent: 'center'},
  saveButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  removeButton: {borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.lg, height: 50, alignItems: 'center', justifyContent: 'center'},
  removeButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.danger},
});
