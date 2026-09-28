import React, {ReactNode} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Badge, EmptyState, Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {LedgerEntry} from '../../services/driverApi';
import {formatDateTime, formatMoney, LEDGER_STATUS_LABELS, LEDGER_STATUS_TONE, ledgerTypeLabel} from './earningsShared';

interface LedgerListProps {
  title?: string;
  entries: LedgerEntry[];
  onPressOrder?: (orderId: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  footer?: ReactNode;
}

export function LedgerList({title, entries, onPressOrder, emptyTitle = 'No earnings yet', emptyDescription, footer}: LedgerListProps) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {entries.length === 0 ? (
        <EmptyState icon="wallet" title={emptyTitle} description={emptyDescription} />
      ) : (
        entries.map((entry, index) => {
          const pressable = Boolean(entry.orderId && onPressOrder);
          const content = (
            <>
              <View style={styles.info}>
                <Text style={styles.type}>{ledgerTypeLabel(entry.type)}</Text>
                {entry.reason ? (
                  <Text style={styles.reason} numberOfLines={1}>
                    {entry.reason}
                  </Text>
                ) : null}
                <Text style={styles.date}>{formatDateTime(entry.createdAt)}</Text>
              </View>
              <View style={styles.meta}>
                <Text style={[styles.amount, entry.amount < 0 && styles.amountNegative]}>{formatMoney(entry.amount)}</Text>
                <Badge label={LEDGER_STATUS_LABELS[entry.status] ?? String(entry.status).toUpperCase()} tone={LEDGER_STATUS_TONE[entry.status] ?? 'neutral'} />
              </View>
              {pressable && <Icon name="chevron-right" size={16} color={colors.textMuted} />}
            </>
          );
          const rowStyle = [styles.row, index < entries.length - 1 && styles.rowBorder];
          return pressable ? (
            <TouchableOpacity key={entry.id} style={rowStyle} activeOpacity={0.7} onPress={() => onPressOrder?.(entry.orderId as string)}>
              {content}
            </TouchableOpacity>
          ) : (
            <View key={entry.id} style={rowStyle}>
              {content}
            </View>
          );
        })
      )}
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', ...shadows.sm},
  title: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, borderBottomWidth: 1, borderBottomColor: colors.border, padding: spacing.lg, paddingBottom: spacing.sm},
  row: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  info: {flex: 1, gap: 2},
  type: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  reason: {...typography.caption, color: colors.textSecondary},
  date: {...typography.caption, fontSize: 11, color: colors.textMuted},
  meta: {alignItems: 'flex-end', gap: 4},
  amount: {...typography.bodyBold, fontSize: 14, color: colors.primary},
  amountNegative: {color: colors.textSecondary},
});
