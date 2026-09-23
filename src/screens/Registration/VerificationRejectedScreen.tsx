import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, ErrorState, Icon, IconBackButton, Loader, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {api, getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'VerificationRejected'>;

interface RegistrationStatusResponse {
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  kycStatus: 'pending' | 'verified' | 'rejected';
  referenceId?: string;
  rejectionReason?: string | null;
}

const RESUBMIT_STEPS = ['Fix the issues listed above', 'Ensure documents are clear and readable', "Click 'Resubmit Application' when done"];

export function VerificationRejectedScreen({navigation}: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RegistrationStatusResponse | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<RegistrationStatusResponse>('/driver/registration/status');
      setData(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load your application status.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <Screen backgroundColor="#FEF2F2" edges={['top', 'bottom']}>
        <Loader fullscreen label="Loading your application status…" />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen backgroundColor={colors.background} edges={['top', 'bottom']}>
        <ErrorState title="Could not load status" description={error} onRetry={load} />
      </Screen>
    );
  }

  const rejectionReason = data?.rejectionReason || 'Your application did not pass verification. Please contact support for details.';

  return (
    <Screen backgroundColor="#FEF2F2" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.backWrap}>
          <IconBackButton onPress={() => navigation.goBack()} />
        </View>
        <View style={styles.iconWrap}>
          <Icon name="alert-circle" size={34} color={colors.danger} />
        </View>
        <View style={styles.rejectedBadge}>
          <Text style={styles.rejectedBadgeText}>APPLICATION REJECTED</Text>
        </View>
        <Text style={styles.title}>Verification Failed</Text>
        <Text style={styles.subtitle}>
          {data?.referenceId ? <Text style={styles.subtitleStrong}>{data.referenceId}</Text> : 'Your application'} requires corrections
        </Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Reason for Rejection</Text>
        <View style={styles.issueCard}>
          <View style={styles.issueRow}>
            <View style={styles.issueIcon}>
              <Icon name="alert-circle" size={14} color={colors.danger} />
            </View>
            <View style={styles.issueText}>
              <Text style={styles.issueDescription}>{rejectionReason}</Text>
            </View>
          </View>
        </View>

        <View style={styles.resubmitCard}>
          <Text style={styles.resubmitTitle}>How to resubmit</Text>
          {RESUBMIT_STEPS.map((step, index) => (
            <View key={step} style={styles.resubmitRow}>
              <View style={styles.resubmitBadge}>
                <Text style={styles.resubmitBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.resubmitText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button label="Resubmit Application" onPress={() => navigation.navigate('ReviewApplication')} />
          <Button label="Contact Support" variant="secondary" />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: '#FEF2F2', alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.xxl, paddingBottom: spacing.xl},
  backWrap: {position: 'absolute', left: spacing.xl, top: spacing.xxl},
  iconWrap: {width: 72, height: 72, borderRadius: 36, backgroundColor: colors.dangerSurface, borderWidth: 3, borderColor: colors.dangerBorder, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md},
  rejectedBadge: {backgroundColor: colors.danger, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4, marginBottom: spacing.sm},
  rejectedBadgeText: {...typography.overline, fontSize: 11, color: colors.white},
  title: {...typography.h4, fontSize: 22, color: colors.textPrimary},
  subtitle: {...typography.label, color: colors.textSecondary, marginTop: spacing.xxs, textAlign: 'center'},
  subtitleStrong: {...typography.labelSemibold, color: colors.textPrimary},
  body: {backgroundColor: colors.background, padding: spacing.xl, gap: spacing.lg},
  sectionTitle: {...typography.labelSemibold, color: colors.textLabel},
  issueCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.dangerBorder, borderRadius: radius.lg, padding: spacing.lg},
  issueRow: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm},
  issueIcon: {width: 28, height: 28, borderRadius: radius.sm, backgroundColor: colors.dangerSurface, alignItems: 'center', justifyContent: 'center'},
  issueText: {flex: 1},
  issueDescription: {...typography.label, color: colors.textPrimary, lineHeight: 20},
  resubmitCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.sm},
  resubmitTitle: {...typography.labelSemibold, color: colors.textLabel},
  resubmitRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  resubmitBadge: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  resubmitBadgeText: {...typography.overline, fontSize: 11, color: colors.primary},
  resubmitText: {flex: 1, ...typography.label, color: colors.textSecondary},
  actions: {gap: spacing.sm},
});
