import React, {useState} from 'react';
import {Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Icon, IconBackButton, IconName} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {driverName, useDriverAuth} from '../../context/DriverAuthContext';
import {api, getApiErrorMessage, resolveAssetUrl} from '../../services/api';
import {initialsOf} from './driverDisplay';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfilePhotoEdit'>;

const GUIDELINES = ['Face clearly visible', 'Well-lit, no filters', 'White or plain background', 'No sunglasses'];

export function ProfilePhotoEditScreen({navigation}: Props) {
  const {driver, refreshDriver} = useDriverAuth();
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const previewUri = localUri ?? resolveAssetUrl(driver?.avatarUrl);

  const uploadAvatar = async (asset: {uri?: string; type?: string; fileName?: string}) => {
    if (!asset.uri) {
      return;
    }
    setLocalUri(asset.uri);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'avatar.jpg',
      } as unknown as Blob);
      await api.post<{avatarUrl: string}>('/driver/me/avatar', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      await refreshDriver();
      setLocalUri(null);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Upload failed', getApiErrorMessage(err));
      setLocalUri(null);
    } finally {
      setUploading(false);
    }
  };

  const handleTakePhoto = () => {
    launchCamera({mediaType: 'photo', quality: 0.8}, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorMessage) {
        Alert.alert('Camera error', response.errorMessage);
        return;
      }
      const asset = response.assets?.[0];
      if (asset) {
        uploadAvatar(asset);
      }
    });
  };

  const handleChooseGallery = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.8}, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorMessage) {
        Alert.alert('Gallery error', response.errorMessage);
        return;
      }
      const asset = response.assets?.[0];
      if (asset) {
        uploadAvatar(asset);
      }
    });
  };

  const options: {icon: IconName; title: string; subtitle: string; onPress: () => void}[] = [
    {icon: 'camera', title: 'Take New Photo', subtitle: 'Use your camera', onPress: handleTakePhoto},
    {icon: 'image', title: 'Choose from Gallery', subtitle: 'Upload from your device', onPress: handleChooseGallery},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Profile Photo</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarWrap}>
          {previewUri ? (
            <Image source={{uri: previewUri}} style={styles.avatarImage} />
          ) : (
            <Avatar initials={initialsOf(driverName(driver))} size={120} />
          )}
          <View style={styles.cameraBadge}>
            <Icon name="camera" size={16} color={colors.white} />
          </View>
        </View>
        <Text style={styles.caption}>{uploading ? 'Uploading photo…' : 'Your photo is shown to stores and customers during deliveries.'}</Text>

        <View style={styles.card}>
          {options.map((opt, index) => (
            <TouchableOpacity
              key={opt.title}
              style={[styles.optionRow, index < options.length - 1 && styles.optionRowBorder, uploading && styles.optionRowDisabled]}
              activeOpacity={0.7}
              disabled={uploading}
              onPress={opt.onPress}>
              <View style={styles.optionIcon}>
                <Icon name={opt.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.optionTitle}>{opt.title}</Text>
                <Text style={styles.optionSubtitle}>{opt.subtitle}</Text>
              </View>
              <Icon name="chevron-right" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>Photo Guidelines</Text>
          {GUIDELINES.map(item => (
            <View key={item} style={styles.guidelineRow}>
              <Icon name="check" size={14} color={colors.primary} />
              <Text style={styles.guidelineText}>{item}</Text>
            </View>
          ))}
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
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary, flex: 1},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl, alignItems: 'stretch'},
  avatarWrap: {width: 120, height: 120, alignSelf: 'center', marginTop: spacing.md},
  avatarImage: {width: 120, height: 120, borderRadius: 60, backgroundColor: colors.primarySurfaceAlt},
  cameraBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {...typography.label, color: colors.textSecondary, textAlign: 'center'},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden'},
  optionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  optionRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  optionRowDisabled: {opacity: 0.5},
  optionIcon: {width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  optionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  optionSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  guidelinesCard: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm},
  guidelinesTitle: {...typography.labelSemibold, color: colors.textLabel},
  guidelineRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  guidelineText: {...typography.caption, color: colors.textSecondary, flex: 1},
});
