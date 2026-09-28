import React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {Button, InfoBanner} from '../../components';
import {spacing} from '../../theme';
import {SUPPORT_EMAIL, SUPPORT_PHONE} from './driverDisplay';

interface ContactSupportProps {
  description?: string;
}

export function ContactSupport({description = 'To change these details, contact support.'}: ContactSupportProps) {
  return (
    <View style={styles.container}>
      <InfoBanner tone="neutral" icon="info" title="Details are locked" description={description} />
      <View style={styles.actions}>
        <Button
          label="Email support"
          variant="secondary"
          icon="mail"
          style={styles.flex}
          onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {})}
        />
        <Button
          label="Call support"
          variant="secondary"
          icon="phone"
          style={styles.flex}
          onPress={() => Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() => {})}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {gap: spacing.sm},
  actions: {flexDirection: 'row', gap: spacing.sm},
  flex: {flex: 1},
});
