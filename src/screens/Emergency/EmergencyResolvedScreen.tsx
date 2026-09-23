import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyResolved'>;

const RESOLUTION_ROWS = [
  {label: 'Incident', value: 'Threatening customer'},
  {label: 'Resolved at', value: 'Sep 6, 3:23 PM'},
  {label: 'Action taken', value: 'Customer flagged, order reassigned'},
  {label: 'Support team', value: 'Vikram S.'},
];

const STATUS_ITEMS = ['You are safe', 'Order reassigned to another rider', 'Earnings protected: Rs. 40'];

export function EmergencyResolvedScreen({navigation}: Props) {
  const returnHome = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Icon name="check" size={28} color={colors.white} />
        </View>
        <Text style={styles.heroTitle}>Emergency Resolved</Text>
        <Text style={styles.heroSubtitle}>You are safe. Incident #INC-00291 closed.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resolution Details</Text>
          {RESOLUTION_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.summaryRow, index < RESOLUTION_ROWS.length - 1 && styles.rowBorder]}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Status</Text>
          {STATUS_ITEMS.map(item => (
            <View key={item} style={styles.statusRow}>
              <View style={styles.statusDot}>
                <Icon name="check" size={13} color={colors.white} />
              </View>
              <Text style={styles.statusText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>Take a moment before continuing. You can go offline anytime.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={returnHome}>
          <Text style={styles.primaryButtonText}>Return to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={returnHome}>
          <Text style={styles.outlineButtonText}>Go Offline</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyIncidentReport')}>
          <Text style={styles.ghostButtonText}>View Incident</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  hero: {backgroundColor: colors.primary, alignItems: 'center', gap: spacing.xs, paddingTop: 44, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  heroIcon: {width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm},
  heroTitle: {...typography.h4, fontSize: 20, color: colors.white},
  heroSubtitle: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.85)'},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 160},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  summaryLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  summaryValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  statusDot: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  statusText: {...typography.body, fontSize: 14, color: colors.textPrimary},
  noteBanner: {backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: '#A7E3CC', borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.label, fontSize: 13, color: '#13845A'},
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
  outlineButton: {borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, height: 44, alignItems: 'center', justifyContent: 'center'},
  outlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  ghostButton: {height: 40, alignItems: 'center', justifyContent: 'center'},
  ghostButtonText: {...typography.body, fontSize: 14, color: colors.textSecondary},
});
