import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconName} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleTypeChange'>;

const CURRENT_TYPE = 'Motorbike';

const VEHICLES: {name: string; icon: IconName; capacity: string; note: string}[] = [
  {name: 'Bicycle', icon: 'bicycle', capacity: '0 cc', note: 'Electric / manual'},
  {name: 'Scooter', icon: 'scooter', capacity: 'Up to 125cc', note: 'Best for short distances'},
  {name: 'Motorbike', icon: 'motorbike', capacity: 'Up to 350cc', note: 'Most popular'},
  {name: 'Van / Car', icon: 'truck', capacity: 'For heavy loads', note: 'Larger deliveries'},
];

export function VehicleTypeChangeScreen({navigation}: Props) {
  const [selected, setSelected] = useState('Motorbike');
  const isSame = selected === CURRENT_TYPE;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Type</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>Changing your vehicle type requires re-verification of documents.</Text>

        {VEHICLES.map(v => {
          const isSelected = selected === v.name;
          return (
            <TouchableOpacity key={v.name} style={[styles.card, isSelected && styles.cardActive]} activeOpacity={0.8} onPress={() => setSelected(v.name)}>
              <View style={[styles.iconWrap, isSelected && styles.iconWrapActive]}>
                <Icon name={v.icon} size={28} color={isSelected ? colors.primary : colors.textSecondary} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.cardTitle}>{v.name}</Text>
                <Text style={styles.cardCapacity}>{v.capacity}</Text>
                <Text style={styles.cardNote}>{v.note}</Text>
              </View>
              <View style={[styles.radio, isSelected && styles.radioActive]}>{isSelected && <View style={styles.radioDot} />}</View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.verifiedBanner}>
          <Icon name="check-circle" size={14} color={colors.primary} />
          <Text style={styles.verifiedBannerText}>Your account is verified for {CURRENT_TYPE}.</Text>
        </View>

        <View style={styles.warningBanner}>
          <Icon name="alert-triangle" size={16} color={colors.warning} />
          <Text style={styles.warningBannerText}>
            Switching to a different vehicle type will require new document verification and may pause your deliveries for 24-48 hours.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, isSame && styles.confirmButtonDisabled]}
          activeOpacity={0.85}
          disabled={isSame}
          onPress={() => navigation.navigate('VehicleVerificationStatus')}>
          <Text style={styles.confirmButtonText}>Confirm Change to {selected}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.switchButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.switchButtonText}>Switch to Different Type</Text>
        </TouchableOpacity>
      </ScrollView>
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  intro: {...typography.label, fontSize: 13, color: colors.textSecondary},
  card: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardActive: {borderColor: colors.primary},
  iconWrap: {width: 54, height: 54, borderRadius: radius.lg, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center'},
  iconWrapActive: {backgroundColor: colors.primarySurface},
  cardTitle: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  cardCapacity: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 1},
  cardNote: {...typography.caption, fontSize: 12, color: colors.textMuted, marginTop: 2},
  radio: {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.borderStrong},
  radioActive: {borderColor: colors.primary, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  radioDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white},
  verifiedBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primarySurface, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  verifiedBannerText: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  warningBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.lg, padding: spacing.md},
  warningBannerText: {...typography.caption, fontSize: 12, color: colors.warningText, flex: 1},
  confirmButton: {backgroundColor: colors.primary, borderRadius: radius.lg, height: 50, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm},
  confirmButtonDisabled: {backgroundColor: colors.borderStrong},
  confirmButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
  switchButton: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, height: 50, alignItems: 'center', justifyContent: 'center'},
  switchButtonText: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary},
});
