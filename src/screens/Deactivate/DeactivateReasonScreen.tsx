import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeactivateReason'>;

const REASONS = ['Taking a long break', 'Health reasons', 'Found another job', 'Not earning enough', 'Issues with the platform', 'Other'];

export function DeactivateReasonScreen({navigation}: Props) {
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Why Are You Leaving?</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>Select the reason that best applies</Text>

        {REASONS.map(item => {
          const active = item === reason;
          return (
            <TouchableOpacity key={item} style={[styles.reasonRow, active && styles.reasonRowActive]} activeOpacity={0.8} onPress={() => setReason(item)}>
              <View style={[styles.radioCircle, active && styles.radioCircleActive]}>{active && <View style={styles.radioDot} />}</View>
              <Text style={[styles.reasonText, active && styles.reasonTextActive]}>{item}</Text>
            </TouchableOpacity>
          );
        })}

        <View>
          <Text style={styles.label}>Tell us more (optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tell us more..."
            placeholderTextColor="rgba(31,41,55,0.5)"
            value={details}
            onChangeText={setDetails}
            multiline
          />
        </View>

        <View style={styles.noteBanner}>
          <Icon name="info" size={18} color={colors.primary} />
          <View style={styles.flex}>
            <Text style={styles.noteTitle}>Before you leave</Text>
            <Text style={styles.noteText}>
              You earned <Text style={styles.noteBold}>Rs. 428</Text> today. Your weekly target is <Text style={styles.noteBold}>76% complete!</Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}>
          <Text style={styles.primaryButtonText}>Stay and Continue Delivering</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerButton} activeOpacity={0.85} onPress={() => navigation.navigate('DeactivateConfirm')}>
          <Text style={styles.dangerButtonText}>Continue</Text>
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
  body: {padding: spacing.lg, gap: spacing.sm, paddingBottom: 140},
  intro: {...typography.body, fontSize: 14, color: colors.textSecondary, marginBottom: spacing.xs},
  reasonRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  reasonRowActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  radioCircle: {width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.border},
  radioCircleActive: {borderColor: colors.primary, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  radioDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white},
  reasonText: {...typography.body, fontSize: 14, color: colors.textPrimary},
  reasonTextActive: {color: colors.primary, fontWeight: '600'},
  label: {...typography.label, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xs, marginTop: spacing.sm},
  textArea: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    height: 72,
    textAlignVertical: 'top',
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  noteBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: '#A7E3CC', borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.sm},
  noteTitle: {...typography.bodyBold, fontSize: 13, color: '#13845A'},
  noteText: {...typography.label, fontSize: 13, color: '#13845A', marginTop: spacing.xs},
  noteBold: {...typography.bodyBold, fontSize: 13, color: '#13845A'},
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
  dangerButton: {borderWidth: 1.5, borderColor: colors.danger, borderRadius: radius.md, height: 44, alignItems: 'center', justifyContent: 'center'},
  dangerButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.danger},
});
