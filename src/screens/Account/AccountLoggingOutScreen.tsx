import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AccountLoggingOut'>;

export function AccountLoggingOutScreen({navigation}: Props) {
  const {logout} = useDriverAuth();

  useEffect(() => {
    let cancelled = false;
    const minDelay = new Promise(resolve => setTimeout(resolve, 2200));

    (async () => {
      try {
        await Promise.all([logout(), minDelay]);
      } finally {
        if (!cancelled) {
          navigation.reset({index: 0, routes: [{name: 'Welcome'}]});
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name="log-out" size={36} color={colors.textSecondary} />
      </View>
      <Text style={styles.title}>Logging Out…</Text>
      <Text style={styles.name}>Ravi Kumar</Text>
      <Text style={styles.phone}>+91 98765 43210</Text>
      <Text style={styles.message}>Please wait while we secure your account.</Text>
      <Text style={styles.subMessage}>Your data and earnings are safe. Log in anytime to continue.</Text>
      <Text style={styles.redirectHint}>Auto-redirecting to Welcome screen…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl},
  iconCircle: {width: 80, height: 80, borderRadius: 40, backgroundColor: '#F3F4F6', borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  title: {...typography.h3, fontSize: 22, color: colors.textPrimary, marginBottom: spacing.xs},
  name: {...typography.bodyMedium, fontSize: 15, color: '#374151'},
  phone: {...typography.label, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xxl},
  message: {...typography.body, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xxl},
  subMessage: {...typography.caption, fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, maxWidth: 280},
  redirectHint: {...typography.caption, fontSize: 12, color: '#D1D5DB', textAlign: 'center', position: 'absolute', bottom: spacing.xxl},
});
