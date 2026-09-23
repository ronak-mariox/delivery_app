import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateEmpty'>;

export function StateEmptyScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <Icon name="help-circle" size={36} color={colors.textMuted} />
        </View>
        <Text style={styles.title}>Nothing here yet</Text>
        <Text style={styles.subtitle}>This section is empty. Check back later or explore your dashboard.</Text>
      </View>

      <View style={styles.actions}>
        <Button label="Explore Dashboard" onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})} />
        <Button label="Go Back" variant="secondary" onPress={() => navigation.goBack()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.xxl},
  body: {alignItems: 'center'},
  iconCircle: {width: 96, height: 96, borderRadius: radius.xxl, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl},
  title: {...typography.h4, color: colors.textPrimary, textAlign: 'center'},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xxl},
  actions: {gap: spacing.sm},
});
