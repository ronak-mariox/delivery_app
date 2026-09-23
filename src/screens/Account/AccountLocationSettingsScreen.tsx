import React, {useState} from 'react';
import {Linking, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountLocationSettings'>;

const REASONS = ['GPS navigation for deliveries', 'Zone detection and order assignment', 'Pickup routing and ETA calculation'];

export function AccountLocationSettingsScreen({navigation}: Props) {
  const [backgroundLocation, setBackgroundLocation] = useState(true);
  const [preciseLocation, setPreciseLocation] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Location Settings</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <Icon name="map-pin" size={18} color={colors.primary} />
            <Text style={styles.statusTitle}>Location access: Always allowed</Text>
          </View>
          <Text style={styles.statusSubtitle}>Location is required for delivery operations.</Text>
        </View>

        <View style={styles.card}>
          <View style={[styles.row, styles.rowBorder]}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Always allow</Text>
              <Text style={styles.rowSub}>Required for delivery — cannot be disabled</Text>
            </View>
            <Switch value disabled trackColor={{false: colors.border, true: colors.primary}} thumbColor={colors.white} />
          </View>
          <View style={[styles.row, styles.rowBorder]}>
            <Text style={styles.rowLabel}>Background location</Text>
            <Switch
              value={backgroundLocation}
              onValueChange={setBackgroundLocation}
              trackColor={{false: colors.border, true: colors.primary}}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Precise location</Text>
            <Switch
              value={preciseLocation}
              onValueChange={setPreciseLocation}
              trackColor={{false: colors.border, true: colors.primary}}
              thumbColor={colors.white}
            />
          </View>
        </View>

        <View style={styles.whyCard}>
          <Text style={styles.whyTitle}>Why location is needed</Text>
          {REASONS.map(reason => (
            <View key={reason} style={styles.whyRow}>
              <Icon name="check" size={14} color={colors.primary} />
              <Text style={styles.whyText}>{reason}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => Linking.openSettings()}>
          <Text style={styles.outlineButtonText}>Open Phone Settings</Text>
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
  statusCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, padding: spacing.md},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  statusTitle: {...typography.bodySemibold, fontSize: 14, color: colors.primary},
  statusSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowText: {flex: 1, paddingRight: spacing.md},
  rowLabel: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  rowSub: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  whyCard: {backgroundColor: colors.primarySurface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  whyTitle: {...typography.bodySemibold, fontSize: 13, color: '#13845A'},
  whyRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  whyText: {...typography.label, fontSize: 13, color: '#374151'},
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
  outlineButton: {borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.primary},
});
