import React, {useState} from 'react';
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencyShareLocation'>;

const LOCATION_INFO = [
  {label: 'Address', value: 'Koramangala 5th Block, Bengaluru'},
  {label: 'Accuracy', value: '±5 meters (GPS)'},
  {label: 'Last updated', value: 'Just now'},
];

export function EmergencyShareLocationScreen({navigation}: Props) {
  const [shareEmergency, setShareEmergency] = useState(true);
  const [shareSupport, setShareSupport] = useState(true);
  const [shareContact, setShareContact] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Share My Location</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapPin} />
          <View style={styles.coordsBadge}>
            <Text style={styles.coordsText}>12.9716° N, 77.5946° E</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Location Info</Text>
          {LOCATION_INFO.map(row => (
            <View key={row.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Share With</Text>
          <View style={styles.shareRow}>
            <Text style={styles.shareLabel}>Emergency Services</Text>
            <Switch value={shareEmergency} onValueChange={setShareEmergency} trackColor={{false: colors.border, true: colors.primary}} thumbColor={colors.white} />
          </View>
          <View style={styles.shareRow}>
            <Text style={styles.shareLabel}>Verdant Support Team</Text>
            <Switch value={shareSupport} onValueChange={setShareSupport} trackColor={{false: colors.border, true: colors.primary}} thumbColor={colors.white} />
          </View>
          <View style={styles.shareRow}>
            <Text style={styles.shareLabel}>Emergency Contact (Meena Kumar)</Text>
            <Switch value={shareContact} onValueChange={setShareContact} trackColor={{false: colors.border, true: colors.primary}} thumbColor={colors.white} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryButtonText}>Share Location Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.outlineButtonText}>Stop Sharing</Text>
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
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: 140},
  mapPlaceholder: {height: 200, backgroundColor: '#1F2937', borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  mapPin: {width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary, borderWidth: 3, borderColor: colors.white},
  coordsBadge: {position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 6, paddingHorizontal: spacing.sm, paddingVertical: 4},
  coordsText: {...typography.caption, fontSize: 12, color: colors.white, fontFamily: 'Courier'},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between'},
  infoLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  infoValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
  shareRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  shareLabel: {...typography.body, fontSize: 14, color: colors.textPrimary, flex: 1, paddingRight: spacing.md},
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
  outlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.textSecondary},
});
