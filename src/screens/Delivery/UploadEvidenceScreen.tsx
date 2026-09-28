import React, {useEffect, useState} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryIssueType, DeliveryOrder, useOrders} from '../../context/OrdersContext';
import {getApiErrorMessage, resolveAssetUrl, uploadEvidence} from '../../services/api';

const MAX_EVIDENCE = 4;

type Props = NativeStackScreenProps<RootStackParamList, 'UploadEvidence'>;

const UNASSIGN_TYPES: DeliveryIssueType[] = ['vehicle_problem', 'road_blockage', 'safety_concern'];
const CANCEL_TYPES: DeliveryIssueType[] = ['delivery_failed'];

const ISSUE_LABEL: Record<DeliveryIssueType, string> = {
  wrong_address: 'Wrong address',
  package_damage: 'Package damaged',
  vehicle_problem: 'Vehicle problem',
  road_blockage: 'Road blockage',
  safety_concern: 'Safety concern',
  delivery_failed: 'Cannot complete delivery',
};

export function UploadEvidenceScreen({route, navigation}: Props) {
  const {orderId, issueType} = route.params;
  const {getOrder, reportIssue} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [description, setDescription] = useState('');
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const pickEvidence = (source: 'camera' | 'gallery') => {
    const options = {mediaType: 'photo' as const, quality: 0.7 as const};
    const handle = async (response: {didCancel?: boolean; errorMessage?: string; assets?: {uri?: string; type?: string; fileName?: string}[]}) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorMessage) {
        Alert.alert('Could not open picker', response.errorMessage);
        return;
      }
      const asset = response.assets?.[0];
      if (!asset?.uri) {
        return;
      }
      setUploading(true);
      try {
        const url = await uploadEvidence(asset);
        setEvidenceUrls((prev) => [...prev, url].slice(0, MAX_EVIDENCE));
      } catch (err) {
        Alert.alert('Upload failed', getApiErrorMessage(err));
      } finally {
        setUploading(false);
      }
    };
    if (source === 'camera') {
      launchCamera(options, handle);
    } else {
      launchImageLibrary(options, handle);
    }
  };

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId).then((o) => { if (!cancelled) {setOrder(o);} }).catch(() => {});
    return () => { cancelled = true; };
  }, [orderId, getOrder]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await reportIssue(orderId, {
        type: issueType,
        description: description.trim() || undefined,
        evidenceUrls: evidenceUrls.length ? evidenceUrls : undefined,
      });
      if (UNASSIGN_TYPES.includes(issueType)) {
        Alert.alert(
          'Reported',
          'This order has been unassigned from you and will be reassigned to another delivery partner.',
          [{text: 'OK', onPress: () => navigation.reset({index: 0, routes: [{name: 'Home'}]})}],
        );
      } else if (CANCEL_TYPES.includes(issueType)) {
        navigation.navigate('DeliveryFailed', {orderId, order: result.order});
      } else {
        navigation.navigate('IssueSupportContact', {orderId, order: result.order});
      }
    } catch (err) {
      Alert.alert('Could Not Report', getApiErrorMessage(err, 'Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']} keyboardAvoiding>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Report Issue</Text>
          <Text style={styles.headerSubtitle}>{`Order #${order?.orderNumber ?? orderId}`}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.issueCard}>
          <View style={styles.issueIcon}>
            <Icon name="alert-circle" size={20} color={colors.danger} />
          </View>
          <Text style={styles.issueLabel}>{ISSUE_LABEL[issueType]}</Text>
        </View>

        {!!order?.address.contactName && (
          <View style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Icon name="user" size={14} color={colors.textSecondary} />
              <Text style={styles.orderText}>{order.address.contactName}</Text>
            </View>
            {!!order.address.line1 && (
              <View style={styles.orderRow}>
                <Icon name="map-pin" size={14} color={colors.textSecondary} />
                <Text style={styles.orderText}>{order.address.line1}</Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.sectionLabel}>Describe what happened</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
          placeholder="Add any details that will help support resolve this (optional)"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.sectionLabel}>Photo evidence (optional)</Text>
        <View style={styles.evidenceRow}>
          {evidenceUrls.map((url) => (
            <View key={url} style={styles.evidenceThumbWrap}>
              <Image source={{uri: resolveAssetUrl(url)}} style={styles.evidenceThumb} />
              <TouchableOpacity
                style={styles.evidenceRemove}
                hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}
                onPress={() => setEvidenceUrls((prev) => prev.filter((u) => u !== url))}>
                <Icon name="x" size={12} color={colors.white} />
              </TouchableOpacity>
            </View>
          ))}
          {evidenceUrls.length < MAX_EVIDENCE && (
            <>
              <TouchableOpacity style={styles.evidenceAdd} activeOpacity={0.8} disabled={uploading} onPress={() => pickEvidence('camera')}>
                <Icon name="camera" size={18} color={colors.primary} />
                <Text style={styles.evidenceAddText}>{uploading ? 'Uploading…' : 'Camera'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.evidenceAdd} activeOpacity={0.8} disabled={uploading} onPress={() => pickEvidence('gallery')}>
                <Icon name="image" size={18} color={colors.primary} />
                <Text style={styles.evidenceAddText}>Gallery</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label={submitting ? 'Submitting…' : 'Submit Report'} disabled={submitting || uploading} onPress={handleSubmit} />
        <Button label="Cancel" variant="secondary" disabled={submitting} onPress={() => navigation.goBack()} />
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
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  issueCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.dangerBorder, borderRadius: radius.lg, padding: spacing.md},
  issueIcon: {width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  issueLabel: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary},
  orderCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, gap: spacing.xs},
  orderRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  orderText: {...typography.label, color: colors.textSecondary},
  sectionLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  textArea: {
    height: 120,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    marginTop: -spacing.sm,
  },
  evidenceRow: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  evidenceThumbWrap: {width: 72, height: 72},
  evidenceThumb: {width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.border},
  evidenceRemove: {position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center'},
  evidenceAdd: {width: 72, height: 72, borderRadius: radius.md, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primaryBorder, alignItems: 'center', justifyContent: 'center', gap: 4},
  evidenceAddText: {...typography.caption, fontSize: 11, color: colors.primary},
  footer: {padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
