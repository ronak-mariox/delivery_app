import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderRejected'>;

export function OrderRejectedScreen({route, navigation}: Props) {
  const {orderId, reason} = route.params;

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="x" size={32} color={colors.danger} />
      </View>
      <Text style={styles.title}>Order Rejected</Text>
      <Text style={styles.subtitle}>
        You rejected order <Text style={styles.subtitleStrong}>#{orderId}</Text>. Reason: {reason}.
      </Text>

      <View style={styles.infoBanner}>
        <Text style={styles.infoText}>
          This order has been returned to the available pool for other delivery partners nearby. You'll keep seeing new orders as they
          become available.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label="Back to Dashboard" onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, paddingVertical: spacing.huge},
  iconWrap: {width: 100, height: 100, borderRadius: 50, backgroundColor: colors.dangerSurface, borderWidth: 2, borderColor: colors.dangerBorder, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  title: {...typography.h3, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl},
  subtitleStrong: {...typography.bodySemibold, color: colors.textPrimary},
  infoBanner: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg, marginBottom: spacing.xxl},
  infoText: {...typography.body, color: colors.textSecondary, lineHeight: 20, textAlign: 'center'},
  actions: {width: '100%', gap: spacing.sm},
});
