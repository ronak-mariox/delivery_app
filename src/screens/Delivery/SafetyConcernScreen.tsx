import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'SafetyConcern'>;

const CONCERNS = ['Unsafe delivery location', 'Threatening customer behavior', 'Unsafe road conditions', 'Other safety concern'];

export function SafetyConcernScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {reportIssue} = useOrders();
  const [selected, setSelected] = useState(CONCERNS[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleReport = async () => {
    setSubmitting(true);
    try {
      await reportIssue(orderId, {type: 'safety_concern', description: selected});
      Alert.alert(
        'Reported',
        'This order has been unassigned from you and will be reassigned. Our safety team will follow up.',
        [{text: 'OK', onPress: () => navigation.reset({index: 0, routes: [{name: 'Home'}]})}],
      );
    } catch (err) {
      Alert.alert('Could Not Report', getApiErrorMessage(err, 'Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerEyebrow}>IMPORTANT — URGENT</Text>
        <Icon name="shield" size={44} color={colors.white} />
        <Text style={styles.headerTitle}>Safety Concern</Text>
        <Text style={styles.headerSubtitle}>Your safety is our top priority. Do not proceed to deliver if you feel unsafe.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Select safety concern</Text>
        <View style={styles.optionsList}>
          {CONCERNS.map(concern => {
            const isSelected = concern === selected;
            return (
              <TouchableOpacity
                key={concern}
                style={[styles.concernRow, isSelected && styles.concernRowSelected]}
                activeOpacity={0.8}
                onPress={() => setSelected(concern)}>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>{isSelected && <View style={styles.radioDot} />}</View>
                <Text style={styles.concernText}>{concern}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button
          label="Emergency Services — 112"
          icon="phone"
          style={styles.emergencyButton}
          onPress={() => navigation.navigate('EmergencyModeActive')}
        />
        <Button
          label={submitting ? 'Reporting…' : 'Report — Priority'}
          icon="headphones"
          style={styles.supportButton}
          disabled={submitting}
          onPress={handleReport}
        />

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>
            Reporting this will <Text style={styles.noteBold}>unassign the order from you</Text> and notify our safety team.
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: '#991B1B', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl, paddingBottom: spacing.xxl, paddingHorizontal: spacing.xl},
  headerEyebrow: {...typography.captionSemibold, fontSize: 11, color: '#FCA5A5', letterSpacing: 2, textTransform: 'uppercase'},
  headerTitle: {...typography.h3, fontSize: 24, color: colors.white},
  headerSubtitle: {...typography.body, color: '#FECACA', textAlign: 'center'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  sectionLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  optionsList: {gap: spacing.sm},
  concernRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  concernRowSelected: {borderColor: colors.danger},
  radio: {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.danger},
  radioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.danger},
  concernText: {...typography.bodyLgMedium, color: colors.textPrimary},
  emergencyButton: {backgroundColor: colors.danger},
  supportButton: {backgroundColor: colors.dark900},
  noteBanner: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.label, fontSize: 13, color: colors.textSecondary, textAlign: 'center'},
  noteBold: {fontWeight: '700', color: colors.textPrimary},
});
