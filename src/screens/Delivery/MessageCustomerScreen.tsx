import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'MessageCustomer'>;

const QUICK_REPLIES = ['I\'m at your door', 'Package left at door', 'Please come down', 'Couldn\'t reach you'];

interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
}

export function MessageCustomerScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [chatStartedAt] = useState(() => new Date());

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId)
      .then((o) => {
        if (!cancelled) {setOrder(o);}
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [orderId, getOrder]);

  const customerName = order?.address.contactName ?? 'Customer';

  const send = (text: string) => {
    if (!text.trim()) {return;}
    setMessages(prev => [...prev, {id: String(prev.length + 1), text, fromMe: true}]);
    setDraft('');
  };

  return (
    <Screen edges={['top', 'bottom']} keyboardAvoiding>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerName}>{customerName}</Text>
          <Text style={styles.headerOrder}>Order #{order?.orderNumber ?? orderId}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('CallCustomer', {orderId})} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="phone" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.chatStarted}>
          Chat started · {chatStartedAt.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}
        </Text>
        {messages.map(message => (
          <View key={message.id} style={[styles.bubbleRow, message.fromMe && styles.bubbleRowRight]}>
            <View style={[styles.bubble, message.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
              <Text style={[styles.bubbleText, message.fromMe && styles.bubbleTextMe]}>{message.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.quickRepliesWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickReplies}>
          {QUICK_REPLIES.map(reply => (
            <TouchableOpacity key={reply} style={styles.quickReplyChip} activeOpacity={0.8} onPress={() => send(reply)}>
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Type a message…"
            placeholderTextColor={colors.textMuted}
            value={draft}
            onChangeText={setDraft}
          />
        </View>
        <TouchableOpacity style={styles.sendButton} activeOpacity={0.85} onPress={() => send(draft)}>
          <Icon name="send" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerText: {flex: 1},
  headerName: {...typography.title, fontSize: 16, color: colors.textPrimary},
  headerOrder: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  chatStarted: {...typography.caption, fontSize: 11, color: colors.textSecondary, textAlign: 'center', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4},
  bubbleRow: {flexDirection: 'row'},
  bubbleRowRight: {justifyContent: 'flex-end'},
  bubble: {maxWidth: '78%', borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  bubbleThem: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4},
  bubbleMe: {backgroundColor: colors.primary, borderBottomRightRadius: 4},
  bubbleText: {...typography.body, color: colors.textPrimary},
  bubbleTextMe: {color: colors.white},
  quickRepliesWrap: {borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface, paddingVertical: spacing.sm},
  quickReplies: {flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg},
  quickReplyChip: {backgroundColor: colors.background, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  quickReplyText: {...typography.captionMedium, color: colors.textPrimary},
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputWrap: {flex: 1, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  input: {...typography.body, color: colors.textPrimary, padding: 0},
  sendButton: {width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
});
