import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Badge, Button, IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {ContactSupport} from '../Profile/ContactSupport';
import {DOCUMENT_META, documentUrl, kycBadge} from '../Profile/driverDisplay';
import {DocumentImageCard} from './DocumentImageCard';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentDetail'>;

export function DocumentDetailScreen({navigation, route}: Props) {
  const {docKey} = route.params;
  const {driver} = useDriverAuth();
  const meta = DOCUMENT_META[docKey];
  const url = documentUrl(driver, docKey);
  const kyc = kycBadge(driver?.kycStatus);

  const rows = [
    {label: 'Document', value: meta.title},
    {label: 'Status', value: url ? 'Uploaded' : 'Not uploaded'},
    {label: 'Verification', value: kyc.label},
  ];

  const openPreview = () => navigation.navigate('DocumentPreview', {docKey});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle} numberOfLines={1}>
          {meta.title}
        </Text>
        <Badge label={kyc.label} tone={kyc.tone} />
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <DocumentImageCard docKey={docKey} url={url} onPress={url ? openPreview : undefined} />

        <View style={styles.card}>
          {rows.map((row, index) => (
            <View key={row.label} style={[styles.row, index < rows.length - 1 && styles.rowBorder]}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {url ? <Button label="View Full Document" icon="eye" fullWidth onPress={openPreview} /> : null}

        <ContactSupport description="To replace this document, contact support." />
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary, flex: 1},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden', ...shadows.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary, flexShrink: 1, textAlign: 'right'},
});
