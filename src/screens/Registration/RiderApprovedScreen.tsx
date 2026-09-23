import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import LogoMark from '../../assets/brand/logo-mark.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'RiderApproved'>;

const DETAILS = [
  {label: 'Rider ID', value: 'VR-088234'},
  {label: 'Vehicle', value: 'KA 05 MG 7734'},
  {label: 'Zone', value: 'Bengaluru Central'},
  {label: 'Active Since', value: 'Today'},
];

const CHECKLIST = [
  'Download the Verdant Rider Partner App',
  'Complete mandatory safety training (15 min)',
  'Review delivery zone guidelines',
  'Set your first availability slot',
];

export function RiderApprovedScreen({navigation}: Props) {
  const [checked, setChecked] = useState<boolean[]>(() => CHECKLIST.map(() => false));

  const toggle = (index: number) => {
    setChecked(prev => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.checkCircle}>
          <View style={styles.checkCircleInner}>
            <Icon name="check" size={30} color={colors.primary} />
          </View>
        </View>
        <Text style={styles.title}>{"You're Approved!"}</Text>
        <Text style={styles.subtitle}>Welcome to the Verdant Rider family</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.profileAvatar}>
              <Icon name="user" size={28} color={colors.primary} />
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>Rahul Sharma</Text>
              <View style={styles.profileStatusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.profileStatus}>Active Rider</Text>
              </View>
            </View>
            <LogoMark width={32} height={32} />
          </View>
          <View style={styles.detailsGrid}>
            {DETAILS.map(item => (
              <View key={item.label} style={styles.detailItem}>
                <Text style={styles.detailLabel}>{item.label.toUpperCase()}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.checklistCard}>
          <Text style={styles.checklistTitle}>Before your first delivery</Text>
          {CHECKLIST.map((item, index) => (
            <TouchableOpacity key={item} style={styles.checklistRow} activeOpacity={0.8} onPress={() => toggle(index)}>
              <View style={[styles.checklistBox, checked[index] && styles.checklistBoxChecked]}>
                {checked[index] && <Icon name="check" size={13} color={colors.white} />}
              </View>
              <Text style={[styles.checklistText, checked[index] && styles.checklistTextDone]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actions}>
          <Button label="Go to Dashboard" onPress={() => navigation.reset({index: 0, routes: [{name: 'LocationPermission'}]})} />
          <Button label="Download Rider App" variant="secondary" />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, alignItems: 'center', paddingVertical: spacing.huge, gap: 4},
  checkCircle: {width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  checkCircleInner: {width: 76, height: 76, borderRadius: 38, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  title: {...typography.h4, fontSize: 24, color: colors.white},
  subtitle: {...typography.body, color: 'rgba(255,255,255,0.8)'},
  body: {backgroundColor: colors.background, padding: spacing.xl, gap: spacing.lg},
  profileCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg},
  profileRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  profileAvatar: {width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primarySurface, borderWidth: 3, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  profileText: {flex: 1},
  profileName: {...typography.title, fontSize: 16, color: colors.textPrimary},
  profileStatusRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2},
  statusDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  profileStatus: {...typography.captionSemibold, color: colors.primary},
  detailsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md},
  detailItem: {width: '47%', backgroundColor: colors.background, borderRadius: radius.sm, padding: spacing.sm},
  detailLabel: {...typography.micro, fontSize: 10, color: colors.textMuted, letterSpacing: 0.4},
  detailValue: {...typography.labelSemibold, color: colors.textPrimary, marginTop: 2},
  checklistCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md},
  checklistTitle: {...typography.labelSemibold, color: colors.textLabel},
  checklistRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  checklistBox: {width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center'},
  checklistBoxChecked: {backgroundColor: colors.primary, borderColor: colors.primary},
  checklistText: {flex: 1, ...typography.label, color: colors.textLabel},
  checklistTextDone: {color: colors.textMuted, textDecorationLine: 'line-through'},
  actions: {gap: spacing.sm},
});
