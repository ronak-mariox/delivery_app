import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateUploadFailed'>;

const SUGGESTIONS = ['Compress the image before uploading', 'Use WiFi for large files', 'Try uploading again'];

export function StateUploadFailedScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} scroll contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconWrap}>
          <Icon name="upload" size={40} color={colors.textMuted} />
          <View style={styles.badge}>
            <Icon name="x" size={10} color={colors.white} />
          </View>
        </View>
        <Text style={styles.title}>Upload Failed</Text>
        <Text style={styles.subtitle}>Your document could not be uploaded.</Text>

        <View style={styles.reasonCard}>
          <View style={styles.reasonIcon}>
            <Icon name="alert-circle" size={16} color={colors.dangerText} />
          </View>
          <View style={styles.reasonText}>
            <Text style={styles.reasonTitle}>File size too large (8.2 MB)</Text>
            <Text style={styles.reasonSubtitle}>Maximum allowed: 5 MB</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Suggestions</Text>
          {SUGGESTIONS.map(item => (
            <View key={item} style={styles.suggestionRow}>
              <View style={styles.dot} />
              <Text style={styles.suggestionText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Retry Upload" onPress={() => navigation.navigate('DocumentUpload')} />
        <Button label="Choose Different File" variant="outline" onPress={() => navigation.navigate('DocumentUpload')} />
        <Button label="Contact Support" variant="ghost" textColor={colors.textSecondary} onPress={() => navigation.navigate('SupportHub')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: spacing.xxl, paddingVertical: spacing.huge},
  body: {alignItems: 'center'},
  iconWrap: {width: 64, height: 64, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  badge: {
    position: 'absolute',
    right: -4,
    top: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {...typography.h4, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl},
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    width: '100%',
    backgroundColor: colors.dangerSurface,
    borderWidth: 1.5,
    borderColor: colors.dangerBorder,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  reasonIcon: {paddingTop: 1},
  reasonText: {flex: 1},
  reasonTitle: {...typography.labelSemibold, fontSize: 13, color: colors.dangerText},
  reasonSubtitle: {...typography.caption, color: '#B91C1C', marginTop: spacing.xxs},
  card: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.xxl},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary, marginBottom: spacing.sm},
  suggestionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xs},
  dot: {width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary},
  suggestionText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  actions: {gap: spacing.xs},
});
