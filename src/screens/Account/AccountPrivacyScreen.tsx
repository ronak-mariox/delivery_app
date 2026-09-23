import React, {useState} from 'react';
import {ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountPrivacy'>;

const CONTROLS = [
  {key: 'share_location', label: 'Share location with support during issues', sub: undefined as string | undefined, defaultOn: true},
  {key: 'analytics', label: 'Analytics data', sub: 'Help improve the app', defaultOn: true},
  {key: 'crash_reports', label: 'Crash reports', sub: undefined as string | undefined, defaultOn: true},
  {key: 'personalized', label: 'Personalized notifications', sub: undefined as string | undefined, defaultOn: false},
];

export function AccountPrivacyScreen({navigation}: Props) {
  const [values, setValues] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CONTROLS.forEach(c => (initial[c.key] = c.defaultOn));
    return initial;
  });

  const toggle = (key: string) => setValues(prev => ({...prev, [key]: !prev[key]}));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.groupTitle}>PRIVACY CONTROLS</Text>
        <View style={styles.card}>
          {CONTROLS.map((control, index) => (
            <View key={control.key} style={[styles.row, index < CONTROLS.length - 1 && styles.rowBorder]}>
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{control.label}</Text>
                {control.sub && <Text style={styles.rowSub}>{control.sub}</Text>}
              </View>
              <Switch
                value={values[control.key]}
                onValueChange={() => toggle(control.key)}
                trackColor={{false: colors.border, true: colors.primary}}
                thumbColor={colors.white}
              />
            </View>
          ))}
        </View>

        <Text style={styles.groupTitle}>DATA CONTROLS</Text>
        <TouchableOpacity style={styles.outlineButton} activeOpacity={0.85}>
          <Text style={styles.outlineButtonText}>Download My Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerButton} activeOpacity={0.85}>
          <Text style={styles.dangerButtonText}>Delete Account</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <TouchableOpacity style={[styles.row, styles.rowBorder]} activeOpacity={0.7} onPress={() => navigation.navigate('AccountPrivacyPolicy')}>
            <Text style={styles.linkText}>View Privacy Policy →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => navigation.navigate('AccountTerms')}>
            <Text style={styles.linkText}>View Terms & Conditions →</Text>
          </TouchableOpacity>
        </View>
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
  headerTitle: {...typography.title, fontSize: 18, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxxl},
  groupTitle: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.8, marginTop: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowText: {flex: 1, paddingRight: spacing.md},
  rowLabel: {...typography.body, fontSize: 14, color: colors.textPrimary},
  rowSub: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  outlineButton: {borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.xs},
  outlineButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.primary},
  dangerButton: {borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  dangerButtonText: {...typography.bodySemibold, fontSize: 14, color: colors.danger},
  linkText: {...typography.bodyMedium, fontSize: 14, color: colors.primary},
});
