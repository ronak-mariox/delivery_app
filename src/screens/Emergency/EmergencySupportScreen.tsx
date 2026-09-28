import React, {useState} from 'react';
import {ActivityIndicator, Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage} from '../../services/api';
import {contactEmergencySupport} from '../../services/driverApi';
import {SUPPORT_EMAIL, SUPPORT_PHONE} from '../Support/supportContacts';

type Props = NativeStackScreenProps<RootStackParamList, 'EmergencySupport'>;

const QUICK_MESSAGES = ['I feel unsafe', 'I had an accident', 'Customer is threatening me', 'I am injured'];

export function EmergencySupportScreen({navigation}: Props) {
  const {activeOrders} = useOrders();
  const activeOrder = activeOrders[0];
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const openLink = (url: string, failure: string) => {
    Linking.openURL(url).catch(() => Alert.alert('Unable to open', failure));
  };

  const canSend = message.trim().length > 0 && !sending;

  const send = async () => {
    if (!canSend) {
      return;
    }
    setSending(true);
    try {
      await contactEmergencySupport(message.trim(), activeOrder?.id);
      setMessage('');
      Alert.alert('Message sent', 'The safety team has received your message and will contact you shortly.');
    } catch (err) {
      Alert.alert('Could not send message', getApiErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={20} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerIcon}>
          <Icon name="headphones" size={26} color={colors.white} />
        </View>
        <View>
          <Text style={styles.headerTitle}>Emergency Support</Text>
          <Text style={styles.headerSubtitle}>Priority line for safety issues</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.actionRow} activeOpacity={0.85} onPress={() => openLink(`tel:${SUPPORT_PHONE}`, `Please dial ${SUPPORT_PHONE} manually.`)}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIconDanger}>
              <Icon name="phone" size={20} color={colors.danger} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Call Safety Team</Text>
              <Text style={styles.actionSub}>{SUPPORT_PHONE}</Text>
            </View>
          </View>
          <View style={styles.callButton}>
            <Text style={styles.callButtonText}>Call</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} activeOpacity={0.85} onPress={() => openLink(`mailto:${SUPPORT_EMAIL}`, `Please email ${SUPPORT_EMAIL}.`)}>
          <View style={styles.actionLeft}>
            <View style={styles.actionIconPrimary}>
              <Icon name="mail" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.actionTitle}>Email Safety Team</Text>
              <Text style={styles.actionSub}>{SUPPORT_EMAIL}</Text>
            </View>
          </View>
          <View style={styles.chatButton}>
            <Text style={styles.chatButtonText}>Email</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionRow} activeOpacity={0.85} onPress={() => navigation.navigate('EmergencyShareLocation', undefined)}>
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

        {activeOrder ? (
          <View style={styles.noteBanner}>
            <Icon name="check-circle" size={15} color={colors.primary} />
            <Text style={styles.noteText}>Order #{activeOrder.orderNumber} will be attached to your message</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Message the Safety Team</Text>
          <View style={styles.chipsWrap}>
            {QUICK_MESSAGES.map(quick => {
              const active = quick === message;
              return (
                <TouchableOpacity key={quick} style={[styles.chip, active && styles.chipActive]} activeOpacity={0.8} onPress={() => setMessage(quick)}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{quick}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TextInput
            style={styles.textArea}
            value={message}
            onChangeText={setMessage}
            placeholder="Describe your situation and where you are"
            placeholderTextColor={colors.textMuted}
            multiline
          />
          <TouchableOpacity style={[styles.sendButton, !canSend && styles.buttonDisabled]} activeOpacity={0.85} onPress={send} disabled={!canSend}>
            {sending ? <ActivityIndicator color={colors.white} /> : <Text style={styles.sendButtonText}>Send Message</Text>}
          </TouchableOpacity>
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
    paddingHorizontal: spacing.lg,
  },
  backButton: {width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  headerIcon: {width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  headerTitle: {...typography.h4, fontSize: 20, color: colors.white},
  headerSubtitle: {...typography.label, fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  actionRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  actionLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1},
  actionIconDanger: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.dangerSurface, alignItems: 'center', justifyContent: 'center'},
  actionIconPrimary: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  actionIconNeutral: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  actionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  actionSub: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 1},
  callButton: {backgroundColor: colors.danger, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  callButtonText: {...typography.bodySemibold, fontSize: 13, color: colors.white},
  chatButton: {backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  chatButtonText: {...typography.bodySemibold, fontSize: 13, color: colors.white},
  shareButton: {borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  shareButtonText: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  noteBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primarySurface, borderRadius: radius.md, padding: spacing.md},
  noteText: {...typography.label, fontSize: 12, color: colors.primaryDark, flex: 1},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  chipsWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  chip: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  chipActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  chipText: {...typography.label, fontSize: 13, color: colors.textPrimary},
  chipTextActive: {color: colors.primary, fontWeight: '600'},
  textArea: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    height: 100,
    textAlignVertical: 'top',
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
  },
  sendButton: {backgroundColor: colors.primary, borderRadius: radius.md, height: 48, alignItems: 'center', justifyContent: 'center'},
  sendButtonText: {...typography.bodyBold, fontSize: 15, color: colors.white},
  buttonDisabled: {opacity: 0.6},
});
