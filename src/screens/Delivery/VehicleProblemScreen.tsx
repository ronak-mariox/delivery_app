import React, {useEffect, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleProblem'>;

const ISSUES = ['Flat tyre', 'Engine / battery issue', 'Brake problem', 'Accident'];

export function VehicleProblemScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder, reportIssue} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [selected, setSelected] = useState(ISSUES[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId).then((o) => { if (!cancelled) {setOrder(o);} }).catch(() => {});
    return () => { cancelled = true; };
  }, [orderId, getOrder]);

  const handleReport = async () => {
    setSubmitting(true);
    try {
      await reportIssue(orderId, {type: 'vehicle_problem', description: selected});
      Alert.alert(
        'Reported',
        'This order has been unassigned from you and will be reassigned to another delivery partner.',
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
        <Icon name="bicycle" size={48} color={colors.white} />
        <Text style={styles.headerTitle}>Vehicle Problem</Text>
        <Text style={styles.headerSubtitle}>Cannot continue delivery due to vehicle issue.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.riskCard}>
          <Text style={styles.riskLabel}>ORDER</Text>
          <Text style={styles.riskOrder}>
            {`#${order?.orderNumber ?? orderId}${order?.address.contactName ? ` · ${order.address.contactName}` : ''}`}
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Select vehicle issue</Text>
        <View style={styles.optionsList}>
          {ISSUES.map(issue => {
            const isSelected = issue === selected;
            return (
              <TouchableOpacity
                key={issue}
                style={[styles.issueRow, isSelected && styles.issueRowSelected]}
                activeOpacity={0.8}
                onPress={() => setSelected(issue)}>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>{isSelected && <View style={styles.radioDot} />}</View>
                <Text style={[styles.issueText, isSelected && styles.issueTextSelected]}>{issue}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>
            Reporting this will <Text style={styles.noteBold}>unassign the order from you</Text> so it can be reassigned.
          </Text>
        </View>

        <Button
          label={submitting ? 'Reporting…' : 'Request reassignment — Save order'}
          icon="shield"
          disabled={submitting}
          onPress={handleReport}
        />
        <Button
          label="Contact support for help"
          variant="secondary"
          icon="phone"
          disabled={submitting}
          onPress={() => navigation.navigate('IssueSupportContact', {orderId, order: order ?? undefined})}
        />

        <View style={styles.emergencyBanner}>
          <Text style={styles.emergencyText}>If you were in an accident, tap Emergency Assist.</Text>
          <Button label="Emergency Assist" style={styles.emergencyButton} onPress={() => navigation.navigate('EmergencySafetyHub')} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.warning, alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  headerTitle: {...typography.h4, fontSize: 22, color: colors.white},
  headerSubtitle: {...typography.body, color: colors.warningSurface, textAlign: 'center'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  riskCard: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.lg, padding: spacing.md},
  riskLabel: {...typography.captionSemibold, fontSize: 12, color: colors.warning, letterSpacing: 0.5, textTransform: 'uppercase'},
  riskOrder: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary, marginTop: spacing.xs},
  sectionLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  optionsList: {gap: spacing.sm},
  issueRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  issueRowSelected: {borderColor: colors.warning},
  radio: {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.warning},
  radioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.warning},
  issueText: {...typography.bodyLg, color: colors.textPrimary},
  issueTextSelected: {...typography.bodyLgMedium, color: colors.textPrimary},
  noteBanner: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  noteBold: {fontWeight: '700', color: colors.textPrimary},
  emergencyBanner: {backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm},
  emergencyText: {...typography.label, fontSize: 13, color: colors.danger},
  emergencyButton: {backgroundColor: colors.danger},
});
