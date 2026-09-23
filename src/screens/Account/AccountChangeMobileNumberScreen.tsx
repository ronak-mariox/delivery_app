import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountChangeMobileNumber'>;

const STEPS = ['Enter new number', 'Verify OTP', 'Confirm'];

export function AccountChangeMobileNumberScreen({navigation}: Props) {
  const [newNumber, setNewNumber] = useState('');
  const canSend = newNumber.length >= 10;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Mobile Number</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.label}>Current Number</Text>
          <View style={styles.fieldDisabled}>
            <Text style={styles.fieldTextDisabled}>+91 98765 43210</Text>
          </View>
        </View>

        <View>
          <Text style={styles.label}>New Mobile Number</Text>
          <View style={styles.numberRow}>
            <View style={styles.codeField}>
              <Text style={styles.codeText}>+91</Text>
            </View>
            <TextInput
              style={styles.numberInput}
              placeholder="Enter new mobile number"
              placeholderTextColor="rgba(31,41,55,0.5)"
              keyboardType="phone-pad"
              value={newNumber}
              onChangeText={setNewNumber}
            />
          </View>
        </View>

        <View style={styles.stepsRow}>
          {STEPS.map((step, index) => {
            const active = index === 0;
            return (
              <React.Fragment key={step}>
                <View style={styles.stepItem}>
                  <View style={[styles.stepDot, active && styles.stepDotActive]}>
                    <Text style={[styles.stepDotText, active && styles.stepDotTextActive]}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{step}</Text>
                </View>
                {index < STEPS.length - 1 && <View style={styles.stepConnector} />}
              </React.Fragment>
            );
          })}
        </View>

        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>Your old number will receive a security alert when the change is initiated.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.primaryButton, !canSend && styles.primaryButtonDisabled]}
          activeOpacity={0.85}
          disabled={!canSend}
          onPress={() => navigation.navigate('AccountVerifyNewNumber')}>
          <Text style={styles.primaryButtonText}>Send OTP</Text>
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
  headerTitle: {...typography.title, fontSize: 18, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.lg, paddingBottom: 120},
  label: {...typography.labelSemibold, fontSize: 13, color: '#374151', marginBottom: spacing.sm},
  fieldDisabled: {backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  fieldTextDisabled: {...typography.body, fontSize: 14, color: colors.textMuted},
  numberRow: {flexDirection: 'row', gap: spacing.sm},
  codeField: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, justifyContent: 'center'},
  codeText: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  numberInput: {flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, ...typography.body, fontSize: 14, color: colors.textPrimary},
  stepsRow: {flexDirection: 'row', alignItems: 'flex-start'},
  stepItem: {alignItems: 'center', width: 90},
  stepDot: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  stepDotActive: {backgroundColor: colors.primary},
  stepDotText: {...typography.bodyBold, fontSize: 12, color: colors.textMuted},
  stepDotTextActive: {color: colors.white},
  stepLabel: {...typography.caption, fontSize: 10, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center'},
  stepLabelActive: {color: colors.primary, fontWeight: '600'},
  stepConnector: {flex: 1, height: 2, backgroundColor: colors.border, marginTop: 13},
  warningBanner: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.md, padding: spacing.md},
  warningText: {...typography.label, fontSize: 13, color: colors.warningText},
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xl,
  },
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonDisabled: {backgroundColor: '#D1D5DB'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
});
