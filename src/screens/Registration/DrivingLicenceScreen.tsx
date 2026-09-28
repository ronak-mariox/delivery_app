import React, {useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {DocumentPreviewCard, Icon, UploadDropzone, WizardFooter, WizardScreen} from '../../components';
import {colors, spacing, typography} from '../../theme';
import {getApiErrorMessage, PickedAsset, uploadDriverDocument} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'DrivingLicence'>;

const TIPS = ['Ensure all text is clearly readable', 'Avoid glare, shadows, or cropped edges', 'Upload the original, unaltered document'];

export function DrivingLicenceScreen({navigation}: Props) {
  const [frontUrl, setFrontUrl] = useState<string | null>(null);
  const [backUrl, setBackUrl] = useState<string | null>(null);
  const [frontUploading, setFrontUploading] = useState(false);
  const [backUploading, setBackUploading] = useState(false);

  const pickAndUpload = (
    side: 'license_front' | 'license_back',
    source: 'camera' | 'gallery',
    setUploading: (v: boolean) => void,
    setUrl: (v: string) => void,
  ) => {
    const onPicked = async (asset: PickedAsset) => {
      setUploading(true);
      try {
        const result = await uploadDriverDocument(side, asset);
        setUrl(result.url);
      } catch (err) {
        Alert.alert('Upload failed', getApiErrorMessage(err));
      } finally {
        setUploading(false);
      }
    };

    const handleResponse = (response: {didCancel?: boolean; errorMessage?: string; assets?: PickedAsset[]}) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        return;
      }
      const asset = response.assets?.[0];
      if (asset) {
        onPicked(asset);
      }
    };

    if (source === 'camera') {
      launchCamera({mediaType: 'photo', quality: 0.8}, handleResponse);
    } else {
      launchImageLibrary({mediaType: 'photo', quality: 0.8}, handleResponse);
    }
  };

  const canContinue = !!frontUrl && !!backUrl && !frontUploading && !backUploading;

  return (
    <WizardScreen
      title="Driving Licence"
      subtitle="Upload front and back of your DL"
      step={7}
      totalSteps={10}
      stepLabel="Driving Licence"
      onBack={() => navigation.goBack()}
      footer={<WizardFooter onBack={() => navigation.goBack()} onContinue={() => navigation.navigate('RcDocument')} continueDisabled={!canContinue} />}>
      <View style={styles.docBlock}>
        <Text style={styles.docLabel}>Front Side</Text>
        {frontUrl ? (
          <DocumentPreviewCard
            tone="dark"
            badgeLabel="✓ UPLOADED"
            icon="user"
            thumbnailLabel="DRIVING LICENCE - FRONT"
            overline="DRIVING LICENCE - FRONT"
            title="Driving Licence"
            lines={['Front side uploaded']}
            onReplace={() => setFrontUrl(null)}
            onRemove={() => setFrontUrl(null)}
          />
        ) : (
          <UploadDropzone
            icon="user"
            title={frontUploading ? 'Uploading…' : 'Upload Front Side'}
            subtitle="JPG, PNG or PDF · Max 5 MB"
            onCamera={() => pickAndUpload('license_front', 'camera', setFrontUploading, setFrontUrl)}
            onGallery={() => pickAndUpload('license_front', 'gallery', setFrontUploading, setFrontUrl)}
          />
        )}
      </View>

      <View style={styles.docBlock}>
        <Text style={styles.docLabel}>Back Side</Text>
        {backUrl ? (
          <DocumentPreviewCard
            tone="dark"
            badgeLabel="✓ UPLOADED"
            icon="image"
            thumbnailLabel="DRIVING LICENCE - BACK"
            overline="DRIVING LICENCE - BACK"
            title="Driving Licence"
            lines={['Back side uploaded']}
            onReplace={() => setBackUrl(null)}
            onRemove={() => setBackUrl(null)}
          />
        ) : (
          <UploadDropzone
            icon="image"
            title={backUploading ? 'Uploading…' : 'Upload Back Side'}
            subtitle="JPG, PNG or PDF · Max 5 MB"
            onCamera={() => pickAndUpload('license_back', 'camera', setBackUploading, setBackUrl)}
            onGallery={() => pickAndUpload('license_back', 'gallery', setBackUploading, setBackUrl)}
          />
        )}
      </View>

      <View style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Upload Tips</Text>
        {TIPS.map(tip => (
          <View key={tip} style={styles.tipRow}>
            <Icon name="check" size={12} color="#B54708" />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}
      </View>
    </WizardScreen>
  );
}

const styles = StyleSheet.create({
  docBlock: {gap: spacing.sm},
  docLabel: {...typography.label, color: colors.textLabel},
  tipsCard: {backgroundColor: '#FFFAEB', borderWidth: 1, borderColor: '#FEC84B', borderRadius: 10, padding: spacing.md, gap: spacing.xs},
  tipsTitle: {...typography.captionSemibold, color: '#B54708'},
  tipRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  tipText: {...typography.caption, color: colors.warningText, flex: 1},
});
