import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'RejectReason'>;

const REASONS = [
  {id: 'too-far', title: 'Too far from current location', subtitle: 'Pickup or delivery too distant'},
  {id: 'too-heavy', title: 'Order too heavy / bulky', subtitle: 'Cannot carry on my vehicle'},
  {id: 'break', title: 'Taking a short break', subtitle: 'Personal reason'},
  {id: 'traffic', title: 'Heavy traffic on route', subtitle: 'Route is congested right now'},
  {id: 'technical', title: 'Technical issue with app', subtitle: 'App malfunction or error'},
  {id: 'other', title: 'Other reason', subtitle: 'Specify below'},
];

export function RejectReasonScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {rejectOrder} = useOrders();
  const [selected, setSelected] = useState('too-far');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedReason = REASONS.find(r => r.id === selected);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await rejectOrder(orderId, notes.trim() ? `${selected}: ${notes.trim()}` : selected);
      navigation.replace('OrderRejected', {orderId, reason: selectedReason?.title ?? 'Other reason'});
    } catch (err) {
      Alert.alert('Could not reject order', getApiErrorMessage(err, 'Please try again.'));
      setSubmitting(false);
    }
  };

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} keyboardAvoiding>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Reason for Rejection</Text>
          <Text style={styles.headerSubtitle}>Required · Helps us improve assignments</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.reasonsList}>
          {REASONS.map(reason => {
            const isSelected = reason.id === selected;
            return (
              <TouchableOpacity
                key={reason.id}
                style={[styles.reasonRow, isSelected && styles.reasonRowSelected]}
                activeOpacity={0.85}
                onPress={() => setSelected(reason.id)}>
                <View style={styles.reasonText}>
                  <Text style={styles.reasonTitle}>{reason.title}</Text>
                  <Text style={styles.reasonSubtitle}>{reason.subtitle}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.notesBlock}>
          <Text style={styles.notesLabel}>Additional notes (optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder={'Describe your reason…'}
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Back" variant="secondary" style={styles.backButton} onPress={() => navigation.goBack()} disabled={submitting} />
        <Button
          label="Confirm Rejection"
          style={styles.confirmButton}
          loading={submitting}
          onPress={handleConfirm}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerText: {flex: 1},
  headerTitle: {...typography.title, fontSize: 15, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  body: {flex: 1, padding: spacing.lg, gap: spacing.lg},
  reasonsList: {gap: spacing.sm},
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  reasonRowSelected: {borderColor: colors.danger, backgroundColor: colors.surface, shadowColor: colors.danger, shadowOpacity: 0.08, shadowRadius: 0, shadowOffset: {width: 0, height: 0}},
  reasonText: {flex: 1},
  reasonTitle: {...typography.labelSemibold, color: colors.textPrimary},
  reasonSubtitle: {...typography.caption, color: colors.textMuted, marginTop: 1},
  radio: {width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.danger, backgroundColor: colors.danger},
  radioDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white},
  notesBlock: {gap: spacing.xs},
  notesLabel: {...typography.label, color: colors.textLabel},
  notesInput: {
    height: 98,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  footer: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  backButton: {flex: 1, height: 54},
  confirmButton: {flex: 2, height: 54, backgroundColor: colors.danger},
});
