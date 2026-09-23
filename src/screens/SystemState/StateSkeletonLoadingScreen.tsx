import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Screen} from '../../components';
import {colors, radius, spacing} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StateSkeletonLoading'>;

const LIST_ROWS = [0, 1, 2, 3];

export function StateSkeletonLoadingScreen({navigation}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.goBack(), 1000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={[styles.block, styles.headerTitleBlock]} />
        <View style={[styles.block, styles.headerSubtitleBlock]} />
      </View>

      <View style={styles.body}>
        <View style={styles.statRow}>
          {[0, 1, 2].map(index => (
            <View key={index} style={styles.statTile}>
              <View style={[styles.block, styles.statLabelBlock]} />
              <View style={[styles.block, styles.statValueBlock]} />
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={[styles.block, styles.cardTitleBlock]} />
          <View style={[styles.block, styles.chartBlock]} />
          <View style={[styles.block, styles.lineBlockWide]} />
          <View style={[styles.block, styles.lineBlockNarrow]} />
        </View>

        <View style={styles.card}>
          <View style={[styles.block, styles.cardTitleBlock]} />
          {LIST_ROWS.map(index => (
            <View key={index} style={styles.listRow}>
              <View style={[styles.block, styles.avatarBlock]} />
              <View style={styles.listRowLines}>
                <View style={[styles.block, styles.listLinePrimary]} />
                <View style={[styles.block, styles.listLineSecondary]} />
              </View>
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1},
  block: {backgroundColor: colors.border, borderRadius: radius.sm},
  header: {backgroundColor: '#EEF0F2', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.xxl, justifyContent: 'flex-end'},
  headerTitleBlock: {width: 200, height: 22},
  headerSubtitleBlock: {width: 130, height: 14},
  body: {padding: spacing.lg, gap: spacing.md},
  statRow: {flexDirection: 'row', gap: spacing.sm},
  statTile: {flex: 1, height: 72, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm},
  statLabelBlock: {width: '60%', height: 12},
  statValueBlock: {width: '45%', height: 20},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md},
  cardTitleBlock: {width: 140, height: 14},
  chartBlock: {width: '100%', height: 90, borderRadius: radius.md},
  lineBlockWide: {width: '70%', height: 12},
  lineBlockNarrow: {width: '50%', height: 12},
  listRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md},
  avatarBlock: {width: 36, height: 36, borderRadius: 18},
  listRowLines: {flex: 1, gap: spacing.xs},
  listLinePrimary: {width: '90%', height: 13},
  listLineSecondary: {width: '60%', height: 11},
});
