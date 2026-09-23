import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AssignmentFailed'>;

const WHAT_HAPPENED = [
  {text: 'You accepted the order in time', ok: true},
  {text: 'Your device confirmed acceptance', ok: true},
  {text: 'Server timed out during confirmation', ok: false},
  {text: 'Order assignment did not complete', ok: false},
];

const NEXT_STEPS = [
  {title: 'Retry accepting the order', subtitle: 'Tap "Retry Assignment" below'},
  {title: 'Go back and wait', subtitle: 'New orders will appear automatically'},
  {title: 'Contact support', subtitle: 'If the issue persists'},
];

export function AssignmentFailedScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId)
      .then((o) => {
        if (!cancelled) setOrderNumber(o.orderNumber);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [orderId, getOrder]);

  return (
    <Screen backgroundColor="#D92D20" statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="alert-circle" size={24} color={colors.white} />
        </View>
        <View>
          <Text style={styles.headerLabel}>SYSTEM ERROR</Text>
          <Text style={styles.headerTitle}>Assignment Failed</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.errorCard}>
          <View style={styles.errorRow}>
            <View style={styles.errorIcon}>
              <Icon name="alert-triangle" size={20} color={colors.danger} />
            </View>
            <View style={styles.errorText}>
              <Text style={styles.errorTitle}>Order could not be assigned</Text>
              <Text style={styles.errorDescription}>
                We were unable to complete the delivery assignment for order{' '}
                <Text style={styles.errorDescriptionStrong}>#{orderNumber ?? orderId}</Text>. This is a system-level issue.
              </Text>
            </View>
          </View>
          <View style={styles.errorCodeBox}>
            <Text style={styles.errorCode}>Error Code: ERR_ASSIGN_503</Text>
            <Text style={styles.errorCodeSubtitle}>Server unable to confirm assignment — not your fault</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What happened?</Text>
          {WHAT_HAPPENED.map(item => (
            <View key={item.text} style={styles.happenedRow}>
              <View style={[styles.happenedIcon, {backgroundColor: item.ok ? colors.primarySurface : colors.dangerSurface}]}>
                <Icon name={item.ok ? 'check' : 'x'} size={12} color={item.ok ? colors.primary : colors.danger} />
              </View>
              <Text style={[styles.happenedText, !item.ok && styles.happenedTextMuted]}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.safeBanner}>
          <Text style={styles.safeBannerTitle}>Nothing to worry about</Text>
          <Text style={styles.safeBannerText}>This error is on our side. It will NOT affect your account, earnings, or standing.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What you can do</Text>
          {NEXT_STEPS.map((step, index) => (
            <View key={step.title} style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{index + 1}</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Retry Assignment" style={styles.retryButton} onPress={() => navigation.replace('AcceptingOrder', {orderId})} />
        <View style={styles.footerRow}>
          <Button
            label="Back to Home"
            variant="secondary"
            style={styles.footerButton}
            onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}
          />
          <Button
            label="Contact Support"
            variant="secondary"
            style={styles.footerButton}
            onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: '#D92D20', flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.lg},
  headerIcon: {width: 48, height: 48, borderRadius: radius.lg, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  headerLabel: {...typography.overline, fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5},
  headerTitle: {...typography.title, fontSize: 18, color: colors.white, marginTop: 2},
  body: {backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md},
  errorCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.dangerBorder, borderRadius: radius.xxl, padding: spacing.lg, gap: spacing.md},
  errorRow: {flexDirection: 'row', gap: spacing.md},
  errorIcon: {width: 42, height: 42, borderRadius: radius.lg, backgroundColor: colors.dangerSurface, alignItems: 'center', justifyContent: 'center'},
  errorText: {flex: 1},
  errorTitle: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  errorDescription: {...typography.label, color: colors.textSecondary, marginTop: 4, lineHeight: 19},
  errorDescriptionStrong: {fontWeight: '700', color: colors.textPrimary},
  errorCodeBox: {backgroundColor: colors.dangerSurface, borderRadius: radius.md, padding: spacing.md},
  errorCode: {...typography.captionSemibold, color: colors.danger},
  errorCodeSubtitle: {...typography.caption, color: colors.textMuted, marginTop: 2},
  card: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textLabel, marginBottom: spacing.sm},
  happenedRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xs},
  happenedIcon: {width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center'},
  happenedText: {...typography.label, color: colors.textLabel},
  happenedTextMuted: {color: colors.textSecondary},
  safeBanner: {backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.lg, padding: spacing.md},
  safeBannerTitle: {...typography.labelSemibold, color: '#13845A'},
  safeBannerText: {...typography.caption, color: '#13845A', marginTop: 2, lineHeight: 16},
  stepRow: {flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.sm},
  stepBadge: {width: 26, height: 26, borderRadius: 13, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  stepBadgeText: {...typography.captionSemibold, color: colors.textLabel},
  stepText: {flex: 1},
  stepTitle: {...typography.labelSemibold, color: colors.textPrimary},
  stepSubtitle: {...typography.caption, color: colors.textMuted, marginTop: 1},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm},
  retryButton: {backgroundColor: colors.danger},
  footerRow: {flexDirection: 'row', gap: spacing.sm},
  footerButton: {flex: 1, height: 48},
});
