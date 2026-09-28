import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {DeliveryOrder, useOrders} from '../../context/OrdersContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PackageIssue'>;

const ISSUE_TYPES = ['Seal broken', 'Package wet / leaking', 'Package crushed', 'Item visible / exposed', 'Wrong package given', 'Other'];

export function PackageIssueScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const {getOrder} = useOrders();
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [selected, setSelected] = useState(ISSUE_TYPES[0]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    let cancelled = false;
    getOrder(orderId)
      .then(o => { if (!cancelled) {setOrder(o);} })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [orderId, getOrder]);

  const handleSubmit = () => {
    if (selected === 'Wrong package given') {
      navigation.replace('WrongItemInOrder', {orderId});
    } else if (selected === 'Other') {
      navigation.replace('StoreIssueDelivery', {orderId});
    } else {
      navigation.replace('PackageDamageDetected', {orderId});
    }
  };

  const subtitle = order
    ? [`Order #${order.orderNumber}`, order.address.contactName, order.address.city].filter(Boolean).join(' · ')
    : `Order #${orderId}`;

  return (
    <Screen edges={['top', 'bottom']} keyboardAvoiding>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Package Issue</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Issue Type</Text>
        <View style={styles.typeGrid}>
          {ISSUE_TYPES.map(type => {
            const isSelected = type === selected;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.typeOption, isSelected && styles.typeOptionSelected]}
                activeOpacity={0.8}
                onPress={() => setSelected(type)}>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>{isSelected && <View style={styles.radioDot} />}</View>

                <Text style={[styles.typeText, isSelected && styles.typeTextSelected]}>{type}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Description</Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe what's wrong with the package…"
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={300}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{description.length} / 300</Text>

        <Text style={styles.sectionLabel}>Photo Evidence</Text>
        <View style={styles.photoRow}>
          <TouchableOpacity style={styles.addPhotoTile} activeOpacity={0.85}>
            <Icon name="plus" size={20} color={colors.textMuted} />
            <Text style={styles.addPhotoText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noteBanner}>
          <Text style={styles.noteText}>Support will review your report and advise on completing or returning this delivery.</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Submit Issue Report" onPress={handleSubmit} />
        <Button label="Contact Support" variant="secondary" icon="phone" onPress={() => navigation.navigate('SupportHub')} />
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
  headerTitle: {...typography.title, fontSize: 16, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.sm},
  sectionLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary, marginTop: spacing.sm},
  typeGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm},
  typeOption: {
    flexBasis: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  typeOptionSelected: {borderColor: colors.danger, borderWidth: 2},
  radio: {width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.danger},
  radioDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger},
  typeText: {...typography.label, fontSize: 13, color: colors.textLabel, flexShrink: 1},
  typeTextSelected: {...typography.labelSemibold, fontSize: 13, color: colors.danger},
  textArea: {
    height: 100,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
  },
  charCount: {...typography.caption, fontSize: 11, color: colors.textMuted, alignSelf: 'flex-end'},
  photoRow: {flexDirection: 'row', gap: spacing.sm},
  addPhotoTile: {width: 80, height: 80, borderRadius: radius.sm, borderWidth: 1.5, borderColor: colors.borderStrong, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4},
  addPhotoText: {...typography.captionMedium, fontSize: 10, color: colors.textMuted},
  noteBanner: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm},
  noteText: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  footer: {padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
