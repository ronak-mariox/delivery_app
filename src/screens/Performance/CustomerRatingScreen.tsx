import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, ErrorState, Icon, IconBackButton, Loader} from '../../components';
import {getApiErrorMessage} from '../../services/api';
import {getRating, RatingSummary} from '../../services/driverApi';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerRating'>;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STAR_LEVELS = [5, 4, 3, 2, 1];

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

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
  const [data, setData] = useState<RatingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getRating());
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const renderBody = () => {
    if (loading) {
      return <Loader fullscreen />;
    }
    if (error || !data) {
      return <ErrorState title="Couldn't load ratings" description={error ?? undefined} onRetry={load} />;
    }
    if (data.count === 0 && data.reviews.length === 0) {
      return <EmptyState icon="star" title="No ratings yet" description="Customer ratings will appear here after your first rated delivery." />;
    }

    const distribution = STAR_LEVELS.map(stars => {
      const n = data.reviews.filter(r => Math.round(r.stars) === stars).length;
      return {stars, pct: data.reviews.length === 0 ? 0 : Math.round((n / data.reviews.length) * 100)};
    });

    return (
      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Icon name="star" size={40} color={colors.primary} filled />
          <Text style={styles.heroValue}>{data.average === null ? '—' : data.average.toFixed(1)}</Text>
          <Text style={styles.heroLabel}>out of 5.0</Text>
          <Text style={styles.heroSub}>
            Based on {data.count} {data.count === 1 ? 'rating' : 'ratings'}
          </Text>
        </View>

        {data.reviews.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Rating Distribution</Text>
            {distribution.map(d => (
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
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Reviews</Text>
          {data.reviews.length === 0 ? (
            <Text style={styles.noReviews}>No written reviews yet.</Text>
          ) : (
            data.reviews.map((r, index) => (
              <View key={`${r.createdAt}-${index}`} style={[styles.reviewRow, index < data.reviews.length - 1 && styles.reviewRowBorder]}>
                <View style={styles.reviewHeader}>
                  <StarRow count={Math.round(r.stars)} />
                  <Text style={styles.reviewDate}>{formatDate(r.createdAt)}</Text>
                </View>
                <Text style={[styles.reviewText, !r.reviewText && styles.reviewTextMuted]}>{r.reviewText || 'No comment left'}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Customer Rating</Text>
      </View>
      {renderBody()}
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
  noReviews: {...typography.label, fontSize: 13, color: colors.textMuted, marginTop: spacing.sm},
  reviewRow: {paddingVertical: spacing.sm},
  reviewRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  reviewHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  reviewDate: {...typography.caption, fontSize: 11, color: colors.textMuted},
  reviewText: {...typography.label, fontSize: 13, color: colors.textPrimary, marginTop: spacing.xs},
  reviewTextMuted: {color: colors.textMuted},
  starRow: {flexDirection: 'row', gap: 2},
});
