import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateSuccess'>;

export function StateSuccessScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconCircle}>
          <Icon name="check" size={28} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Success!</Text>
        <Text style={styles.heroSubtitle}>Your action was completed successfully.</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ACTION COMPLETED</Text>
          <View style={styles.cardRow}>
            <View style={styles.cardIcon}>
              <Icon name="package" size={20} color={colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Delivery Completed</Text>
              <Text style={styles.cardSubtitle}>All steps finished without issues.</Text>
            </View>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterLabel}>Completed at</Text>
            <Text style={styles.cardFooterValue}>Today, 2:45 PM</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button label="Continue" onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})} />
          <Button label="View Details" variant="ghost" textColor={colors.textSecondary} onPress={() => navigation.navigate('DeliveryHistory')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  hero: {backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingTop: 68, paddingBottom: spacing.xxl},
  iconCircle: {width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm},
  heroTitle: {...typography.h4, fontSize: 22, color: colors.white},
  heroSubtitle: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: spacing.xxs},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, paddingHorizontal: spacing.lg, paddingVertical: spacing.xl, ...shadows.sm},
  cardLabel: {...typography.captionSemibold, fontSize: 11, letterSpacing: 0.5, color: colors.textMuted, textTransform: 'uppercase'},
  cardRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md},
  cardIcon: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  cardText: {flex: 1},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  cardSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  cardFooter: {flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, marginTop: spacing.md, paddingTop: spacing.md},
  cardFooterLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  cardFooterValue: {...typography.captionSemibold, fontSize: 12, color: colors.textPrimary},
  actions: {gap: spacing.xs},
});
