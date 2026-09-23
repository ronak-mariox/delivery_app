import React, {useState} from 'react';
import {Alert, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconName, WizardFooter, WizardScreen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {api, getApiErrorMessage, resolveAssetUrl} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfilePhoto'>;

const GUIDELINES = [
  'Clear, front-facing photo with good lighting',
  'Plain or simple background preferred',
  'No sunglasses or head coverings (except religious)',
  'File size: Max 5 MB (JPG, PNG)',
];

export function ProfilePhotoScreen({navigation}: Props) {
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const previewUri = localUri ?? resolveAssetUrl(avatarUrl);

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
      const response = await api.post<{avatarUrl: string}>('/driver/me/avatar', formData, {
        headers: {'Content-Type': 'multipart/form-data'},
      });
      setAvatarUrl(response.data.avatarUrl);
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

  const handleRemove = () => {
    setLocalUri(null);
    setAvatarUrl(null);
  };

  return (
    <WizardScreen
      title="Profile Photo"
      subtitle="Upload a clear front-facing photo"
      step={2}
      totalSteps={10}
      stepLabel="Profile Photo"
      onBack={() => navigation.goBack()}
      footer={<WizardFooter onBack={() => navigation.goBack()} onContinue={() => navigation.navigate('HomeAddress')} />}>
      <View style={styles.photoBlock}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            {previewUri ? (
              <Image source={{uri: previewUri}} style={styles.avatarImage} />
            ) : (
              <Icon name="user" size={64} color={colors.primary} />
            )}
          </View>
          <View style={styles.cameraBadge}>
            <Icon name="camera" size={16} color={colors.white} />
          </View>
        </View>
        <Text style={styles.caption}>
          {uploading ? 'Uploading photo…' : previewUri ? 'Photo looks good! You can retake or remove it.' : 'Add a profile photo to continue.'}
        </Text>
      </View>

      <View style={styles.actionRows}>
        <ActionRow icon="camera" title="Take a Photo" subtitle="Use your camera for a live photo" onPress={handleTakePhoto} disabled={uploading} />
        <ActionRow icon="image" title="Choose from Gallery" subtitle="Select from your photo library" onPress={handleChooseGallery} disabled={uploading} />
      </View>

      <View style={styles.retakeRow}>
        <TouchableOpacity style={styles.retakeButton} activeOpacity={0.8} disabled={!previewUri || uploading} onPress={handleChooseGallery}>
          <Icon name="refresh" size={15} color={colors.textSecondary} />
          <Text style={styles.retakeText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} activeOpacity={0.8} disabled={!previewUri || uploading} onPress={handleRemove}>
          <Icon name="x" size={15} color={colors.dangerText} />
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
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
    </WizardScreen>
  );
}

function ActionRow({
  icon,
  title,
  subtitle,
  onPress,
  disabled,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity style={[styles.actionRow, disabled && styles.actionRowDisabled]} activeOpacity={0.8} onPress={onPress} disabled={disabled}>
      <View style={styles.actionIcon}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.actionText}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.chevronRight}>
        <Icon name="chevron-left" size={16} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  photoBlock: {alignItems: 'center', gap: spacing.md},
  avatarWrap: {width: 140, height: 140},
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primarySurfaceAlt,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {width: '100%', height: '100%'},
  cameraBadge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {...typography.label, color: colors.textSecondary, textAlign: 'center'},
  actionRows: {gap: spacing.sm},
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  actionRowDisabled: {opacity: 0.5},
  actionIcon: {width: 44, height: 44, borderRadius: radius.lg, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  actionText: {flex: 1},
  actionTitle: {...typography.bodySemibold, color: colors.textPrimary},
  actionSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  chevronRight: {transform: [{rotate: '180deg'}]},
  retakeRow: {flexDirection: 'row', gap: spacing.sm},
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 44,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  retakeText: {...typography.labelSemibold, color: colors.textSecondary},
  removeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    height: 44,
    borderWidth: 1.5,
    borderColor: colors.dangerBorder,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSurface,
  },
  removeText: {...typography.labelSemibold, color: colors.dangerText},
  guidelinesCard: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm},
  guidelinesTitle: {...typography.labelSemibold, color: colors.textLabel},
  guidelineRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  guidelineText: {...typography.caption, color: colors.textSecondary, flex: 1},
});
