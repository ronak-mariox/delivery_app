import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {EmptyState, IconBackButton} from '../../components';
import {colors, spacing, typography} from '../../theme';
import {useDriverAuth} from '../../context/DriverAuthContext';
import {resolveAssetUrl} from '../../services/api';
import {DOCUMENT_META, documentUrl, kycBadge} from '../Profile/driverDisplay';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentPreview'>;

export function DocumentPreviewScreen({navigation, route}: Props) {
  const {docKey} = route.params;
  const {driver} = useDriverAuth();
  const meta = DOCUMENT_META[docKey];
  const uri = resolveAssetUrl(documentUrl(driver, docKey));
  const kyc = kycBadge(driver?.kycStatus);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton tone="dark" onPress={() => navigation.goBack()} />
        <View style={styles.flex}>
          <Text style={styles.headerEyebrow}>Preview</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {meta.title}
          </Text>
        </View>
      </View>

      <View style={styles.previewArea}>
        {uri ? (
          <Image source={{uri}} style={styles.image} resizeMode="contain" accessibilityLabel={meta.title} />
        ) : (
          <EmptyState icon="file-text" title="Document not uploaded" description="This document was not uploaded during registration." />
        )}
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.statusLabel}>Verification</Text>
        <Text style={styles.statusValue}>{kyc.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#111827'},
  flex: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: 52, paddingBottom: spacing.md},
  headerEyebrow: {...typography.caption, color: '#9CA3AF'},
  headerTitle: {...typography.title, fontSize: 17, color: colors.white},
  previewArea: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  image: {width: '100%', height: '100%'},
  bottomSheet: {backgroundColor: '#1F2937', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.huge},
  statusLabel: {...typography.label, fontSize: 13, color: '#9CA3AF'},
  statusValue: {...typography.bodySemibold, fontSize: 15, color: colors.primary, marginTop: 2},
});
