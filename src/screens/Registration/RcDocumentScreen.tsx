import React, {useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {DocumentPreviewCard, FormField, InfoBanner, UploadDropzone, WizardFooter, WizardScreen} from '../../components';
import {colors, spacing, typography} from '../../theme';
import {getApiErrorMessage, PickedAsset, uploadDriverDocument} from '../../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'RcDocument'>;

export function RcDocumentScreen({navigation}: Props) {
  const [rcNumber, setRcNumber] = useState('');
  const [rcUrl, setRcUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onPicked = async (asset: PickedAsset) => {
    setUploading(true);
    try {
      const result = await uploadDriverDocument('rc', asset);
      setRcUrl(result.url);
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

  const handleCamera = () => launchCamera({mediaType: 'photo', quality: 0.8}, handleResponse);
  const handleGallery = () => launchImageLibrary({mediaType: 'photo', quality: 0.8}, handleResponse);

  return (
    <WizardScreen
      title="RC Document"
      subtitle="Registration Certificate for your vehicle"
      step={8}
      totalSteps={10}
      stepLabel="RC Document"
      onBack={() => navigation.goBack()}
      footer={
        <WizardFooter
          onBack={() => navigation.goBack()}
          onContinue={() => navigation.navigate('InsuranceDocument')}
          continueDisabled={!rcUrl || uploading}
        />
      }>
      <FormField label="RC Number" value={rcNumber} onChangeText={setRcNumber} autoCapitalize="characters" placeholder="e.g. KA 05 MG 7734" helperText="Must match the vehicle number entered earlier" />

      <View style={styles.docBlock}>
        <Text style={styles.docLabel}>RC Book / Certificate</Text>
        {rcUrl ? (
          <DocumentPreviewCard
            tone="primary"
            badgeLabel="✓ UPLOADED"
            icon="package"
            thumbnailLabel="RC BOOK"
            overline="REGISTRATION CERTIFICATE"
            title={rcNumber || 'RC Document'}
            lines={['Document uploaded']}
            onReplace={() => setRcUrl(null)}
            onRemove={() => setRcUrl(null)}
          />
        ) : (
          <UploadDropzone
            icon="package"
            title={uploading ? 'Uploading…' : 'Upload RC Document'}
            subtitle="JPG, PNG or PDF · Max 5 MB"
            onCamera={handleCamera}
            onGallery={handleGallery}
          />
        )}
      </View>

      <InfoBanner description="Make sure the registration number on the document matches the one you entered for your vehicle." />
    </WizardScreen>
  );
}

const styles = StyleSheet.create({
  docBlock: {gap: spacing.sm},
  docLabel: {...typography.label, color: colors.textLabel},
});
