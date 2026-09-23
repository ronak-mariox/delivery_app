import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Input} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileEdit'>;

const GENDERS = ['Male', 'Female', 'Other'] as const;

export function ProfileEditScreen({navigation}: Props) {
  const [gender, setGender] = useState<(typeof GENDERS)[number]>('Male');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('StateChangesNotSaved')}>
          <Text style={styles.saveLink}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Input label="Full Name" defaultValue="Ravi Kumar" />
        <Input label="Email" defaultValue="ravi.kumar@email.com" keyboardType="email-address" />
        <Input label="Date of Birth" defaultValue="12 Aug 1995" icon="calendar" />

        <View style={styles.genderBlock}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderRow}>
            {GENDERS.map(g => (
              <TouchableOpacity key={g} style={[styles.genderPill, gender === g && styles.genderPillActive]} activeOpacity={0.8} onPress={() => setGender(g)}>
                <View style={[styles.radioOuter, gender === g && styles.radioOuterActive]}>{gender === g && <View style={styles.radioInner} />}</View>
                <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoBanner}>
          <Icon name="info" size={14} color={colors.textSecondary} />
          <Text style={styles.infoBannerText}>Mobile number cannot be changed here. Visit Security settings.</Text>
        </View>

        <TouchableOpacity style={styles.saveButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
        <Text style={styles.footnote}>Changes require re-verification for sensitive fields.</Text>
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
  saveLink: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
  body: {padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxxl},
  label: {...typography.label, color: colors.textLabel},
  genderBlock: {gap: spacing.sm},
  genderRow: {flexDirection: 'row', gap: spacing.sm},
  genderPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
  },
  genderPillActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  radioOuter: {width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.borderStrong},
  radioOuterActive: {borderColor: colors.primary, backgroundColor: colors.primary},
  radioInner: {},
  genderText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  genderTextActive: {...typography.labelSemibold, color: colors.primary},
  infoBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  infoBannerText: {...typography.caption, fontSize: 12, color: colors.textSecondary, flex: 1},
  saveButton: {backgroundColor: colors.primary, borderRadius: radius.lg, height: 54, alignItems: 'center', justifyContent: 'center'},
  saveButtonText: {...typography.bodyBold, fontSize: 16, color: colors.white},
  footnote: {...typography.caption, color: colors.textMuted, textAlign: 'center'},
});
