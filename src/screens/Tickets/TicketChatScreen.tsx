import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TicketChat'>;

type Message = {id: string; from: 'agent' | 'me'; text: string; time: string};

const INITIAL_MESSAGES: Message[] = [
  {id: '1', from: 'agent', text: "Hi Ravi, I'm Vikram from Verdant Support. I can see your delivery issue with order #VR-84821. I'm reviewing the case now.", time: '3:22 PM'},
  {id: '2', from: 'agent', text: "Can you confirm the exact time you arrived at the customer's location?", time: '3:22 PM'},
  {id: '3', from: 'me', text: 'I arrived at 3:08 PM and waited until 3:18 PM.', time: '3:23 PM'},
  {id: '4', from: 'agent', text: "Thank you. I'm contacting the customer now to confirm. I'll update you in 5 minutes.", time: '3:24 PM'},
];

const QUICK_REPLIES = ['Yes', 'No', 'Please call me', 'Send details'];

export function TicketChatScreen({navigation}: Props) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');

  const sendMessage = (text: string) => {
    if (!text.trim()) {
      return;
    }
    setMessages(prev => [...prev, {id: String(prev.length + 1), from: 'me', text: text.trim(), time: 'Now'}]);
    setDraft('');
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
    if (reply === 'Yes') {
      navigation.navigate('TicketResolved');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.flex}>
          <View style={styles.headerNameRow}>
            <Text style={styles.headerTitle}>Vikram S. — Support</Text>
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.headerSubtitle}>#ISS-30012</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.systemBadge}>
          <Text style={styles.systemBadgeText}>Issue #ISS-30012 opened · Sep 6, 3:20 PM</Text>
        </View>

        {messages.map(msg => (
          <View key={msg.id} style={[styles.messageRow, msg.from === 'me' && styles.messageRowMe]}>
            {msg.from === 'agent' && (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>V</Text>
              </View>
            )}
            <View style={styles.messageCol}>
              <View style={[styles.bubble, msg.from === 'me' ? styles.bubbleMe : styles.bubbleAgent]}>
                <Text style={[styles.bubbleText, msg.from === 'me' && styles.bubbleTextMe]}>{msg.text}</Text>
              </View>
              <Text style={[styles.timeText, msg.from === 'me' && styles.timeTextMe]}>{msg.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.quickRepliesRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRepliesContent}>
          {QUICK_REPLIES.map(reply => (
            <TouchableOpacity key={reply} style={styles.quickChip} activeOpacity={0.8} onPress={() => handleQuickReply(reply)}>
              <Text style={styles.quickChipText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message…"
          placeholderTextColor="rgba(31,41,55,0.5)"
          value={draft}
          onChangeText={setDraft}
        />
        <TouchableOpacity style={styles.sendButton} activeOpacity={0.85} onPress={() => sendMessage(draft)}>
          <Icon name="send" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerNameRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  headerTitle: {...typography.bodyLgMedium, fontSize: 16, color: colors.textPrimary},
  onlineDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  headerSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl},
  systemBadge: {alignSelf: 'center', backgroundColor: '#F3F4F6', borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginBottom: spacing.sm},
  systemBadgeText: {...typography.caption, fontSize: 11, color: colors.textMuted},
  messageRow: {flexDirection: 'row', alignItems: 'flex-end'},
  messageRowMe: {justifyContent: 'flex-end'},
  avatar: {width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm},
  avatarText: {...typography.bodyBold, fontSize: 12, color: colors.white},
  messageCol: {maxWidth: '75%'},
  bubble: {borderRadius: radius.xxl, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  bubbleAgent: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4},
  bubbleMe: {backgroundColor: colors.primary, borderBottomRightRadius: 4},
  bubbleText: {...typography.body, fontSize: 14, color: colors.textPrimary},
  bubbleTextMe: {color: colors.white},
  timeText: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: spacing.xs},
  timeTextMe: {textAlign: 'right'},
  quickRepliesRow: {backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingVertical: spacing.sm},
  quickRepliesContent: {paddingHorizontal: spacing.md, gap: spacing.sm},
  quickChip: {borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xxl, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  quickChipText: {...typography.label, fontSize: 13, color: '#374151'},
  inputRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, paddingBottom: spacing.md},
  input: {flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xxl, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, ...typography.body, fontSize: 14, color: colors.textPrimary},
  sendButton: {width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
});
