import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerRating'>;

const DISTRIBUTION = [
  {stars: 5, pct: 78},
  {stars: 4, pct: 14},
  {stars: 3, pct: 5},
  {stars: 2, pct: 2},
  {stars: 1, pct: 1},
];

const REVIEWS = [
  {stars: 5, text: 'Fast and professional', date: 'Sep 5'},
  {stars: 5, text: 'Quick delivery', date: 'Sep 4'},
  {stars: 4, text: 'Package was intact', date: 'Sep 3'},
];

function StarRow({count, size = 12}: {count: number; size?: number}) {
  return (
    <View style={styles.starRow}>
      {Array.from({length: 5}).map((_, i) => (
        <Icon key={i} name="star" size={size} color={colors.primary} filled={i < count} />
      ))}
    </View>
  );
}

export function CustomerRatingScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Customer Rating</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Icon name="star" size={40} color={colors.primary} filled />
          <Text style={styles.heroValue}>4.8</Text>
          <Text style={styles.heroLabel}>out of 5.0</Text>
          <Text style={styles.heroSub}>Based on 234 ratings</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rating Distribution</Text>
          {DISTRIBUTION.map(d => (
            <View key={d.stars} style={styles.distRow}>
              <Text style={styles.distNumber}>{d.stars}</Text>
              <Icon name="star" size={12} color={colors.primary} filled />
              <View style={styles.distTrack}>
                <View style={[styles.distFill, {width: `${d.pct}%`}]} />
              </View>
              <Text style={styles.distPct}>{d.pct}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Reviews</Text>
          {REVIEWS.map((r, index) => (
            <View key={r.text} style={[styles.reviewRow, index < REVIEWS.length - 1 && styles.reviewRowBorder]}>
              <View style={styles.reviewHeader}>
                <StarRow count={r.stars} />
                <Text style={styles.reviewDate}>{r.date}</Text>
              </View>
              <Text style={styles.reviewText}>{r.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.keepBanner}>
          <Text style={styles.keepTitle}>Keep It Up</Text>
          <Text style={styles.keepText}>Ratings below 4.5 trigger review. You are well above threshold.</Text>
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
    paddingHorizontal: spacing.xl,
    paddingTop: 48,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  heroCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.xxl, alignItems: 'center'},
  heroValue: {...typography.display, fontSize: 48, color: colors.primary, fontWeight: '800', marginTop: spacing.sm},
  heroLabel: {...typography.body, fontSize: 14, color: colors.textSecondary, marginTop: 2},
  heroSub: {...typography.caption, color: colors.textMuted, marginTop: 4},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  distRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.md},
  distNumber: {...typography.caption, color: colors.textSecondary, width: 10, textAlign: 'right'},
  distTrack: {flex: 1, height: 8, borderRadius: 4, backgroundColor: '#F3F4F6', overflow: 'hidden'},
  distFill: {height: 8, borderRadius: 4, backgroundColor: colors.primary},
  distPct: {...typography.caption, color: colors.textMuted, width: 30, textAlign: 'right'},
  reviewRow: {paddingVertical: spacing.sm},
  reviewRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  reviewHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  reviewDate: {...typography.caption, fontSize: 11, color: colors.textMuted},
  reviewText: {...typography.label, fontSize: 13, color: colors.textPrimary, marginTop: spacing.xs},
  keepBanner: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: '#FDE8C8', borderRadius: radius.lg, padding: spacing.lg},
  keepTitle: {...typography.bodyBold, fontSize: 13, color: colors.warningText},
  keepText: {...typography.label, fontSize: 13, color: '#78350F', marginTop: 3},
  starRow: {flexDirection: 'row', gap: 2},
});
