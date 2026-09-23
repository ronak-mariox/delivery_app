import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, ErrorState, Icon, Loader, ProgressBar, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {api, getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'VerificationInProgress'>;

interface RegistrationStatusResponse {
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  kycStatus: 'pending' | 'verified' | 'rejected';
  referenceId?: string;
  rejectionReason?: string | null;
}

type StepStatus = 'done' | 'active' | 'pending';

function stepsForStatus(status: RegistrationStatusResponse['status'] | null): {title: string; status: StepStatus}[] {
  const identityDone = status === 'active' || status === 'suspended';
  return [
    {title: 'Application Submitted', status: 'done'},
    {title: 'Documents Received', status: 'done'},
    {title: 'Identity & Vehicle Verification', status: identityDone ? 'done' : 'active'},
    {title: 'Background Check', status: identityDone ? 'done' : 'pending'},
    {title: 'Account Activation', status: status === 'active' ? 'done' : 'pending'},
  ];
}

export function VerificationInProgressScreen({navigation}: Props) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RegistrationStatusResponse | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await api.get<RegistrationStatusResponse>('/driver/registration/status');
      setData(response.data);
      if (response.data.status === 'active') {
        navigation.reset({index: 0, routes: [{name: 'RiderApproved'}]});
      } else if (response.data.status === 'rejected') {
        navigation.replace('VerificationRejected');
      } else if (response.data.status === 'suspended') {
        navigation.replace('AccountRestricted');
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load your verification status.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [navigation]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Screen backgroundColor="#FFFAEB" edges={['top', 'bottom']}>
        <Loader fullscreen label="Checking your verification status…" />
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen backgroundColor={colors.background} edges={['top', 'bottom']}>
        <ErrorState title="Could not load status" description={error ?? undefined} onRetry={() => load()} />
      </Screen>
    );
  }

  const steps = stepsForStatus(data.status);
  const doneCount = steps.filter(s => s.status === 'done').length;
  const progress = doneCount / steps.length;

  return (
    <Screen backgroundColor="#FFFAEB" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>UNDER REVIEW</Text>
        </View>
        <View style={styles.iconWrap}>
          <Icon name="clock" size={34} color={colors.warning} />
        </View>
        <Text style={styles.title}>Verification in Progress</Text>
        <Text style={styles.subtitle}>
          Your application {data.referenceId ? <Text style={styles.subtitleStrong}>{data.referenceId}</Text> : null} is being reviewed by our
          team.
        </Text>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />}>
        <View style={styles.card}>
          <View style={styles.estimateRow}>
            <View>
              <Text style={styles.estimateLabel}>STATUS</Text>
              <Text style={styles.estimateValue}>{data.status === 'pending' ? 'Under Review' : data.status}</Text>
            </View>
            <View style={styles.estimateRight}>
              <Text style={styles.estimateLabel}>KYC STATUS</Text>
              <Text style={styles.estimateValueSmall}>{data.kycStatus}</Text>
            </View>
          </View>
          <ProgressBar progress={progress} height={6} trackColor="#F3F4F6" fillColor={colors.warning} style={styles.progressBar} />
          <View style={styles.progressLabelsRow}>
            <Text style={styles.progressLabelText}>Submitted</Text>
            <Text style={styles.progressLabelText}>In Progress</Text>
            <Text style={styles.progressLabelText}>Complete</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Verification Steps</Text>
          {steps.map((step, index) => (
            <View key={step.title} style={[styles.stepRow, index > 0 && styles.stepRowBorder]}>
              {step.status === 'done' ? (
                <View style={styles.stepIconDone}>
                  <Icon name="check" size={14} color={colors.primary} />
                </View>
              ) : step.status === 'active' ? (
                <View style={styles.stepIconActive}>
                  <View style={styles.stepIconActiveDot} />
                </View>
              ) : (
                <View style={styles.stepIconPending}>
                  <View style={styles.stepIconPendingDot} />
                </View>
              )}
              <Text style={[styles.stepText, step.status === 'active' && styles.stepTextActive]}>{step.title}</Text>
              {step.status !== 'pending' && (
                <Text style={[styles.stepStatusText, step.status === 'active' && styles.stepStatusActive]}>
                  {step.status === 'done' ? 'Done' : 'In Progress'}
                </Text>
              )}
            </View>
          ))}
        </View>

        <View style={styles.updateBanner}>
          <Icon name="bell" size={20} color={colors.primary} />
          <View style={styles.updateBannerText}>
            <Text style={styles.updateBannerTitle}>Stay Updated</Text>
            <Text style={styles.updateBannerDescription}>Pull to refresh to check for the latest status. We'll also notify you by SMS and email.</Text>
          </View>
        </View>

        <Button label="Contact Support" />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: '#FFFAEB', paddingHorizontal: spacing.xxl, paddingTop: spacing.xxl, paddingBottom: spacing.xxl, gap: spacing.xs},
  badge: {
    position: 'absolute',
    right: spacing.xl,
    top: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEC84B',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  badgeDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: '#B54708'},
  badgeText: {...typography.overline, fontSize: 11, color: '#B54708'},
  iconWrap: {width: 72, height: 72, borderRadius: 36, backgroundColor: '#FEF3C7', borderWidth: 3, borderColor: '#FEC84B', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  title: {...typography.h3, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary},
  subtitleStrong: {...typography.bodyBold, color: colors.textPrimary},
  body: {backgroundColor: colors.background, padding: spacing.xl, gap: spacing.lg},
  card: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  estimateRow: {flexDirection: 'row', justifyContent: 'space-between'},
  estimateRight: {alignItems: 'flex-end'},
  estimateLabel: {...typography.overline, fontSize: 11, color: colors.textMuted, letterSpacing: 0.5},
  estimateValue: {...typography.title, fontSize: 18, color: colors.textPrimary, marginTop: spacing.xxs, textTransform: 'capitalize'},
  estimateValueSmall: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginTop: spacing.xxs, textTransform: 'capitalize'},
  progressBar: {marginTop: spacing.md},
  progressLabelsRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs},
  progressLabelText: {...typography.caption, fontSize: 11, color: colors.textMuted},
  cardTitle: {...typography.labelSemibold, color: colors.textLabel, marginBottom: spacing.sm},
  stepRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm},
  stepRowBorder: {borderTopWidth: 1, borderTopColor: '#F9FAFB'},
  stepIconDone: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  stepIconActive: {width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFFAEB', borderWidth: 2, borderColor: colors.warning, alignItems: 'center', justifyContent: 'center'},
  stepIconActiveDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning},
  stepIconPending: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  stepIconPendingDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.borderStrong},
  stepText: {flex: 1, ...typography.label, color: colors.textMuted},
  stepTextActive: {...typography.labelSemibold, color: colors.textPrimary},
  stepStatusText: {...typography.caption, fontSize: 11, color: colors.primary},
  stepStatusActive: {...typography.captionSemibold, fontSize: 11, color: colors.warning},
  updateBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.primarySurface,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  updateBannerText: {flex: 1},
  updateBannerTitle: {...typography.labelSemibold, color: '#13845A'},
  updateBannerDescription: {...typography.caption, color: colors.textSecondary, marginTop: 2},
});
