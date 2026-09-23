import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateWarningInsurance'>;

export function StateWarningInsuranceScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Icon name="alert-triangle" size={40} color={colors.white} />
        <Text style={styles.heroTitle}>Warning</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.warningCard}>
          <Icon name="alert-triangle" size={18} color={colors.warning} />
          <View style={styles.warningText}>
            <Text style={styles.warningTitle}>Insurance Expiring Soon</Text>
            <Text style={styles.warningSubtitle}>Your insurance expires in 7 days. Deliveries may be affected.</Text>
          </View>
        </View>

        <View style={styles.impactBanner}>
          <Text style={styles.impactTitle}>What happens if not resolved</Text>
          <Text style={styles.impactText}>Your account will be automatically paused after insurance expires.</Text>
        </View>

        <View style={styles.actions}>
          <Button label="Resolve Now" onPress={() => navigation.navigate('VehicleInsurance')} />
          <Button label="Remind Me Later" variant="outline" onPress={() => navigation.goBack()} />
          <Button label="Dismiss" variant="ghost" textColor={colors.textSecondary} onPress={() => navigation.goBack()} />
        </View>

        <Text style={styles.footerNote}>Ignoring this warning may affect your delivery availability.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  hero: {backgroundColor: colors.warning, alignItems: 'center', justifyContent: 'center', paddingTop: 52, paddingBottom: spacing.xl, gap: spacing.xs},
  heroTitle: {...typography.title, color: colors.white},
  body: {padding: spacing.lg, gap: spacing.lg},
  warningCard: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.warning, borderRadius: radius.xl, padding: spacing.lg},
  warningText: {flex: 1},
  warningTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  warningSubtitle: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: spacing.xs},
  impactBanner: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warningBorder, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  impactTitle: {...typography.captionSemibold, color: colors.warningText},
  impactText: {...typography.caption, color: '#B45309', marginTop: spacing.xxs},
  actions: {gap: spacing.sm},
  footerNote: {...typography.caption, color: colors.textMuted, textAlign: 'center', maxWidth: 280, alignSelf: 'center'},
});
