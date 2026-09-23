import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, ProgressBar, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import LogoMark from '../../assets/brand/logo-mark.svg';

type Props = NativeStackScreenProps<RootStackParamList, 'FirstTimeSetup'>;

const DONE_ITEMS = [
  {title: 'Profile Verified', subtitle: 'Identity confirmed'},
  {title: 'Documents Approved', subtitle: 'DL, RC, Insurance'},
  {title: 'Vehicle Registered', subtitle: 'KA 05 MG 7734'},
  {title: 'Bank Details Added', subtitle: 'HDFC •••8273'},
  {title: 'Location Permission', subtitle: 'Granted'},
  {title: 'GPS Enabled', subtitle: 'Enabled'},
  {title: 'Notifications', subtitle: 'Allowed'},
];

export function FirstTimeSetupScreen({navigation}: Props) {
  const [trainingDone, setTrainingDone] = useState(false);
  const totalSteps = 8;
  const completedSteps = DONE_ITEMS.length + (trainingDone ? 1 : 0);

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <LogoMark width={32} height={32} />
          <View style={styles.headerText}>
            <Text style={styles.welcome}>Welcome, Rahul!</Text>
            <Text style={styles.headline}>Almost ready to go live</Text>
          </View>
        </View>
        <View style={styles.progressBlock}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Setup progress</Text>
            <Text style={styles.progressValue}>
              {completedSteps} / {totalSteps} complete
            </Text>
          </View>
          <ProgressBar progress={completedSteps / totalSteps} height={8} trackColor="rgba(255,255,255,0.2)" fillColor={colors.white} style={styles.progressBar} />
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {DONE_ITEMS.map(item => (
          <View key={item.title} style={styles.itemRow}>
            <View style={styles.itemIcon}>
              <Icon name="check" size={18} color={colors.primary} />
            </View>
            <View style={styles.itemText}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.itemDone}>Done</Text>
          </View>
        ))}

        <View style={[styles.itemRow, styles.trainingRow, trainingDone && styles.trainingRowDone]}>
          <View style={[styles.itemIcon, trainingDone ? styles.itemIconDone : styles.itemIconPending]}>
            <Icon name={trainingDone ? 'check' : 'alert-circle'} size={18} color={trainingDone ? colors.primary : colors.warning} />
          </View>
          <View style={styles.itemText}>
            <Text style={styles.itemTitle}>Safety Training</Text>
            <Text style={styles.itemSubtitle}>Mandatory · ~15 min</Text>
          </View>
          {trainingDone ? (
            <Text style={styles.itemDone}>Done</Text>
          ) : (
            <View style={styles.requiredTag}>
              <Text style={styles.requiredTagText}>Required</Text>
            </View>
          )}
        </View>

        {!trainingDone && (
          <View style={styles.trainingCard}>
            <View style={styles.trainingCardRow}>
              <Icon name="alert-triangle" size={22} color={colors.warning} />
              <View style={styles.trainingCardText}>
                <Text style={styles.trainingCardTitle}>Complete Safety Training</Text>
                <Text style={styles.trainingCardDescription}>
                  A quick 15-minute module covering road safety, customer handling, and delivery etiquette. Mandatory before going live.
                </Text>
              </View>
            </View>
            <Button label="Start Safety Training" style={styles.trainingButton} onPress={() => setTrainingDone(true)} />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={trainingDone ? 'Go Live' : 'Go Live — Complete Training First'}
          disabled={!trainingDone}
          onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.xl},
  headerTop: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  headerText: {flex: 1},
  welcome: {...typography.caption, color: 'rgba(255,255,255,0.6)'},
  headline: {...typography.bodyBold, color: colors.white},
  progressBlock: {marginTop: spacing.lg},
  progressLabelRow: {flexDirection: 'row', justifyContent: 'space-between'},
  progressLabel: {...typography.caption, color: 'rgba(255,255,255,0.8)'},
  progressValue: {...typography.captionSemibold, color: colors.white},
  progressBar: {marginTop: spacing.xs},
  body: {backgroundColor: colors.background, padding: spacing.lg, gap: spacing.sm},
  itemRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  itemIcon: {width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  itemIconDone: {backgroundColor: colors.primarySurface},
  itemIconPending: {backgroundColor: '#FFFAEB'},
  itemText: {flex: 1},
  itemTitle: {...typography.labelSemibold, color: colors.textPrimary},
  itemSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  itemDone: {...typography.captionSemibold, color: colors.primary},
  trainingRow: {borderColor: colors.primary},
  trainingRowDone: {borderColor: colors.border},
  requiredTag: {backgroundColor: colors.warning, borderRadius: 6, paddingHorizontal: spacing.sm, paddingVertical: 2},
  requiredTagText: {...typography.overline, fontSize: 11, color: colors.white},
  trainingCard: {backgroundColor: '#FFFAEB', borderWidth: 1.5, borderColor: '#FEC84B', borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md},
  trainingCardRow: {flexDirection: 'row', gap: spacing.md},
  trainingCardText: {flex: 1},
  trainingCardTitle: {...typography.bodyBold, fontSize: 14, color: '#B54708'},
  trainingCardDescription: {...typography.label, color: colors.warningText, marginTop: 4, lineHeight: 19},
  trainingButton: {backgroundColor: colors.warning},
  footer: {padding: spacing.xl, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
