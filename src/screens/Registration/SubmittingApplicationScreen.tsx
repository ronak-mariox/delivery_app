import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, ProgressBar, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {api, getApiErrorMessage} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'SubmittingApplication'>;

const STEPS = ['Encrypting personal data', 'Verifying documents', 'Processing your application'];

interface SubmitResponse {
  referenceId: string;
  status: string;
  kycStatus: string;
}

export function SubmittingApplicationScreen({navigation}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;
  const hasSubmitted = useRef(false);

  useEffect(() => {
    const loop = Animated.loop(Animated.timing(spin, {toValue: 1, duration: 900, easing: Easing.linear, useNativeDriver: true}));
    loop.start();
    return () => loop.stop();
  }, [spin]);
  const spinDeg = spin.interpolate({inputRange: [0, 1], outputRange: ['0deg', '360deg']});

  // A short, cosmetic step animation runs in parallel with the real submit
  // request so the screen doesn't flash by instantly.
  useEffect(() => {
    if (activeIndex >= STEPS.length) {
      return;
    }
    const timeout = setTimeout(() => setActiveIndex(i => i + 1), 500);
    return () => clearTimeout(timeout);
  }, [activeIndex]);

  useEffect(() => {
    if (hasSubmitted.current) {
      return;
    }
    hasSubmitted.current = true;

    const submit = async () => {
      const minDelay = new Promise(resolve => setTimeout(resolve, 1200));
      try {
        const [response] = await Promise.all([api.post<SubmitResponse>('/driver/registration/submit'), minDelay]);
        navigation.replace('ApplicationSubmitted', {referenceId: response.data.referenceId});
      } catch (err) {
        await minDelay;
        navigation.replace('ReviewApplication', {submitError: getApiErrorMessage(err, 'Could not submit your application. Please try again.')});
      }
    };

    submit();
  }, [navigation]);

  const progress = Math.min(activeIndex, STEPS.length) / STEPS.length;
  const progressPercent = Math.round(progress * 100);

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="file-text" size={36} color={colors.primary} />
      </View>
      <Text style={styles.title}>{'Submitting Your\nApplication'}</Text>
      <Text style={styles.subtitle}>Please wait while we securely upload your documents and process your application.</Text>

      <View style={styles.checklist}>
        {STEPS.map((step, index) => {
          const isDone = index < activeIndex;
          const isActive = index === activeIndex;
          return (
            <View key={step} style={styles.stepRow}>
              {isDone ? (
                <View style={styles.stepIconDone}>
                  <Icon name="check" size={14} color={colors.white} />
                </View>
              ) : isActive ? (
                <View style={styles.stepIconActive}>
                  <View style={styles.stepIconActiveDot} />
                </View>
              ) : (
                <View style={styles.stepIconPending}>
                  <View style={styles.stepIconPendingDot} />
                </View>
              )}
              <Text style={[styles.stepText, isDone && styles.stepTextDone, isActive && styles.stepTextActive]}>{step}</Text>
              {isActive && (
                <Animated.View style={[styles.spinner, {transform: [{rotate: spinDeg}]}]}>
                  <Icon name="refresh" size={14} color={colors.primary} />
                </Animated.View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>Overall progress</Text>
          <Text style={styles.progressValue}>{progressPercent}%</Text>
        </View>
        <ProgressBar progress={progress} height={6} trackColor={colors.border} style={styles.progressBar} />
      </View>

      <Text style={styles.footNote}>Do not close or navigate away from this screen</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, paddingVertical: spacing.huge},
  iconWrap: {width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xxl},
  title: {...typography.h3, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md, marginBottom: spacing.xxl},
  checklist: {width: '100%', gap: spacing.md, marginBottom: spacing.xxl},
  stepRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  stepIconDone: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  stepIconActive: {width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center'},
  stepIconActiveDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  stepIconPending: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  stepIconPendingDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.borderStrong},
  stepText: {flex: 1, ...typography.label, color: colors.textMuted},
  stepTextDone: {color: colors.primary},
  stepTextActive: {...typography.labelSemibold, color: colors.textPrimary},
  spinner: {marginLeft: spacing.sm},
  progressBlock: {width: '100%'},
  progressLabelRow: {flexDirection: 'row', justifyContent: 'space-between'},
  progressLabel: {...typography.caption, color: colors.textSecondary},
  progressValue: {...typography.captionSemibold, color: colors.primary},
  progressBar: {marginTop: spacing.xs, borderRadius: radius.sm},
  footNote: {...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl},
});
