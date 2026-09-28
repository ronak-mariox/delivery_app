import React, {useState} from 'react';
import {Alert, Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {WizardFooter, WizardScreen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {api, getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleType'>;

type VehicleId = 'motorbike' | 'scooter' | 'bicycle' | 'other';

const VEHICLES: {
  id: VehicleId;
  title: string;
  tags: {label: string; highlighted?: boolean}[];
  subtitle: string;
  image: ImageSourcePropType;
}[] = [
  {
    id: 'motorbike',
    title: 'Motorbike',
    tags: [{label: 'Most Popular', highlighted: true}, {label: 'Higher Pay', highlighted: true}],
    subtitle: '100cc – 350cc engine',
    image: require('../../assets/images/vehicle-motorbike.png'),
  },
  {
    id: 'scooter',
    title: 'Scooter',
    tags: [{label: 'Easy Ride'}],
    subtitle: '50cc – 125cc automatic',
    image: require('../../assets/images/vehicle-scooter.png'),
  },
  {
    id: 'bicycle',
    title: 'Bicycle / E-Bike',
    tags: [{label: 'Eco Friendly'}],
    subtitle: 'Pedal or electric assist',
    image: require('../../assets/images/vehicle-bicycle.png'),
  },
  {
    id: 'other',
    title: 'Other Vehicle',
    tags: [{label: 'Cargo'}, {label: 'High Capacity'}],
    subtitle: '3-wheeler, van, cargo',
    image: require('../../assets/images/vehicle-other.png'),
  },
];

export function VehicleTypeScreen({navigation}: Props) {
  const [selected, setSelected] = useState<VehicleId>('motorbike');
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    try {
      await api.patch('/driver/registration/vehicle-type', {vehicleType: selected});
      navigation.navigate('VehicleDetails', {vehicleType: selected});
    } catch (err) {
      Alert.alert('Could not save', getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <WizardScreen
      title="Choose Vehicle Type"
      subtitle="Select the vehicle you'll use for deliveries"
      step={5}
      totalSteps={10}
      stepLabel="Vehicle Type"
      onBack={() => navigation.goBack()}
      footer={<WizardFooter onBack={() => navigation.goBack()} onContinue={handleContinue} continueDisabled={submitting} />}>
      {VEHICLES.map(vehicle => {
        const isSelected = vehicle.id === selected;
        return (
          <TouchableOpacity
            key={vehicle.id}
            style={[styles.card, isSelected && styles.cardSelected]}
            activeOpacity={0.85}
            onPress={() => setSelected(vehicle.id)}>
            <View style={[styles.imageWrap, isSelected && styles.imageWrapSelected]}>
              <Image source={vehicle.image} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{vehicle.title}</Text>
                {vehicle.tags.map(tag => (
                  <View key={tag.label} style={[styles.tag, tag.highlighted && styles.tagHighlighted]}>
                    <Text style={[styles.tagText, tag.highlighted && styles.tagTextHighlighted]}>{tag.label}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.subtitle}>{vehicle.subtitle}</Text>
            </View>
            <View style={[styles.radio, isSelected && styles.radioSelected]}>{isSelected && <View style={styles.radioDot} />}</View>
          </TouchableOpacity>
        );
      })}
      <Text style={styles.footNote}>You can add multiple vehicles after completing registration.</Text>
    </WizardScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  cardSelected: {borderColor: colors.primary, backgroundColor: colors.surface},
  imageWrap: {width: 80, height: 56, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  imageWrapSelected: {backgroundColor: colors.primarySurface},
  image: {width: '100%', height: '100%'},
  info: {flex: 1, gap: 2},
  titleRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap'},
  title: {...typography.bodyLgMedium, fontSize: 15, fontWeight: '700', color: colors.textPrimary},
  tag: {backgroundColor: colors.background, borderRadius: radius.pill, paddingHorizontal: spacing.xs, paddingVertical: 2},
  tagHighlighted: {backgroundColor: colors.primary},
  tagText: {...typography.overline, fontSize: 10, color: colors.textSecondary},
  tagTextHighlighted: {color: colors.white},
  subtitle: {...typography.caption, color: colors.textSecondary},
  radio: {width: 24, height: 24, borderRadius: radius.md, borderWidth: 2, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.primary, backgroundColor: colors.primary},
  radioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.white},
  footNote: {...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs},
});
