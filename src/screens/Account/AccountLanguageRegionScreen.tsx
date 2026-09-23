import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountLanguageRegion'>;

const LANGUAGES = ['English (India)', 'Hindi / हिंदी', 'Kannada / ಕನ್ನಡ', 'Tamil / தமிழ்', 'Telugu / తెలుగు', 'Marathi / मराठी'];

export function AccountLanguageRegionScreen({navigation}: Props) {
  const [language, setLanguage] = useState('English (India)');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language & Region</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.groupTitle}>LANGUAGE</Text>
        <View style={styles.card}>
          {LANGUAGES.map((lang, index) => {
            const active = lang === language;
            return (
              <TouchableOpacity
                key={lang}
                style={[styles.row, active && styles.rowActive, index < LANGUAGES.length - 1 && styles.rowBorder]}
                activeOpacity={0.7}
                onPress={() => setLanguage(lang)}>
                <Text style={[styles.rowLabel, active && styles.rowLabelActive]}>{lang}</Text>
                {active && <Icon name="check" size={18} color={colors.primary} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.groupTitle}>REGION</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>India</Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('SupportHub')}>
          <Text style={styles.hint}>Contact support to change your region.</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={() => navigation.goBack()}>
          <Text style={styles.primaryButtonText}>Save Language</Text>
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
  body: {padding: spacing.lg, gap: spacing.sm, paddingBottom: 120},
  groupTitle: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.8, marginTop: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.lg},
  rowActive: {backgroundColor: colors.primarySurface},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowLabel: {...typography.body, fontSize: 14, color: colors.textPrimary},
  rowLabelActive: {color: colors.primary, fontWeight: '600'},
  hint: {...typography.caption, fontSize: 12, color: colors.textMuted},
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
  primaryButton: {backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  primaryButtonText: {...typography.bodySemibold, fontSize: 15, color: colors.white},
});
