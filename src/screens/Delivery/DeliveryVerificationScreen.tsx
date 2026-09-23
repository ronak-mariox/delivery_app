import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, IconName, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryVerification'>;

const METHODS: {icon: IconName; title: string; subtitle: string; available: boolean}[] = [
  {icon: 'smartphone', title: 'Customer OTP', subtitle: "Ask customer for their 4-digit code", available: true},
  {icon: 'camera', title: 'Photo Proof', subtitle: 'Coming soon', available: false},
  {icon: 'edit', title: 'Digital Signature', subtitle: 'Coming soon', available: false},
];

export function DeliveryVerificationScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Verify Delivery</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBanner}>
          <Icon name="alert-circle" size={18} color={colors.primary} />
          <Text style={styles.infoText}>To complete delivery, verify the customer's identity using one of these methods.</Text>
        </View>

        {METHODS.map(method => {
          const isSelected = method.available;
          return (
            <View
              key={method.title}
              style={[styles.methodRow, isSelected && styles.methodRowSelected, !method.available && styles.methodRowDisabled]}>
              <View style={[styles.methodIcon, isSelected && styles.methodIconSelected]}>
                <Icon name={method.icon} size={22} color={isSelected ? colors.primary : colors.textSecondary} />
              </View>
              <View style={styles.methodText}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
              </View>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <Icon name="check" size={12} color={colors.white} />}
              </View>
            </View>
          );
        })}

        <View style={styles.noteBanner}>
          <Icon name="shield" size={18} color={colors.textSecondary} />
          <Text style={styles.noteText}>Verification protects both rider and customer. Required for all deliveries.</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Continue with OTP →" onPress={() => navigation.navigate('OtpEntry', {orderId})} />
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.subtitle, color: colors.textPrimary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  infoBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.primarySurfaceAlt, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.lg, padding: spacing.md},
  infoText: {...typography.label, color: colors.primary, flex: 1},
  methodRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  methodRowSelected: {borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.primarySurfaceAlt},
  methodRowDisabled: {opacity: 0.5},
  methodIcon: {width: 48, height: 48, borderRadius: radius.lg, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  methodIconSelected: {backgroundColor: colors.successSurface},
  methodText: {flex: 1},
  methodTitle: {...typography.bodyLgMedium, color: colors.textPrimary},
  methodSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  radio: {width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {backgroundColor: colors.primary, borderColor: colors.primary},
  noteBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.label, color: colors.textSecondary, flex: 1},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
