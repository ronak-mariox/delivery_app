import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencySupport'>;

const QUICK_MESSAGES = ['I feel unsafe', 'I had an accident', 'Customer is threatening', 'I am injured'];

export function EmergencySupportScreen({navigation}: Props) {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="headphones" size={26} color={colors.white} />
        </View>
        <View>
          <Text style={styles.headerTitle}>Emergency Support</Text>
          <Text style={styles.headerSubtitle}>Priority line — always available</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.teamCard}>
          <View style={styles.teamTopRow}>
            <View>
              <Text style={styles.teamTitle}>Safety Response Team</Text>
              <Text style={styles.teamSubtitle}>Available 24/7</Text>
              <Text style={styles.teamResponse}>
                Response time: <Text style={styles.teamResponseBold}>Under 2 minutes</Text>
              </Text>
            </View>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.actionRow} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyResolved')}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIconDanger}>
              <Icon name="phone" size={20} color={colors.danger} />
            </View>
            <Text style={styles.actionTitle}>Call Safety Team</Text>
          </View>
          <View style={styles.callButton}>
            <Text style={styles.callButtonText}>Call</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} activeOpacity={0.85}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIconPrimary}>
              <Icon name="message-circle" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Live Chat</Text>
              <Text style={styles.actionSub}>Priority queue</Text>
            </View>
          </View>
          <View style={styles.chatButton}>
            <Text style={styles.chatButtonText}>Chat</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyShareLocation')}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIconNeutral}>
              <Icon name="map-pin" size={20} color={colors.textPrimary} />
            </View>
            <Text style={styles.actionTitle}>Share Location</Text>
          </View>
          <View style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.noteBanner}>
          <Icon name="check-circle" size={15} color={colors.primary} />
          <Text style={styles.noteText}>Order #VR-84821 auto-shared with safety team</Text>
        </View>

        <Text style={styles.quickTitle}>Quick Message</Text>
        <View style={styles.chipsWrap}>
          {QUICK_MESSAGES.map(message => {
            const active = message === selectedMessage;
            return (
              <TouchableOpacity
                key={message}
                style={[styles.chip, active && styles.chipActive]}
                activeOpacity={0.8}
                onPress={() => setSelectedMessage(message)}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{message}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#D92D20',
    paddingTop: 52,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  headerIcon: {width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  headerTitle: {...typography.h4, fontSize: 20, color: colors.white},
  headerSubtitle: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  teamCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  teamTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  teamTitle: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary},
  teamSubtitle: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 2},
  teamResponse: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: spacing.xs},
  teamResponseBold: {...typography.bodyBold, fontSize: 12, color: colors.textPrimary},
  onlineRow: {flexDirection: 'row', alignItems: 'center', gap: 5},
  onlineDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  onlineText: {...typography.bodySemibold, fontSize: 12, color: colors.primary},
  actionRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  actionLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  actionIconDanger: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.dangerSurface, alignItems: 'center', justifyContent: 'center'},
  actionIconPrimary: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  actionIconNeutral: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  actionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  actionSub: {...typography.caption, fontSize: 11, color: colors.primary, marginTop: 1},
  callButton: {backgroundColor: colors.danger, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  callButtonText: {...typography.bodySemibold, fontSize: 13, color: colors.white},
  chatButton: {backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  chatButtonText: {...typography.bodySemibold, fontSize: 13, color: colors.white},
  shareButton: {borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  shareButtonText: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  noteBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primarySurface, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.label, fontSize: 12, color: '#13845A'},
  quickTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textSecondary},
  chipsWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  chip: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  chipActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  chipText: {...typography.label, fontSize: 13, color: colors.textPrimary},
  chipTextActive: {color: colors.primary, fontWeight: '600'},
});
