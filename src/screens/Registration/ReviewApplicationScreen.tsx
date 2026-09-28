import React, {useCallback, useEffect, useState} from 'react';
import {Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, ErrorState, Icon, IconBackButton, InfoBanner, Loader, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';
import {api, getApiErrorMessage, resolveAssetUrl} from '../../services/api';
import {useDriverAuth} from '../../context/DriverAuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ReviewApplication'>;

interface DocumentEntry {
  type: string;
  url: string;
}

interface RegistrationData {
  registrationStep?: string;
  referenceId?: string;
  personalInfo?: {fullName?: string; email?: string; dob?: string; gender?: string};
  avatarUrl?: string | null;
  address?: {line1?: string; area?: string; city?: string; state?: string; pincode?: string; addressType?: string};
  emergencyContact?: {name?: string; relationship?: string; mobile?: string; altMobile?: string};
  vehicleType?: string;
  vehicleDetails?: {registrationNumber?: string; brand?: string; model?: string; year?: number | string; fuelType?: string; color?: string; capacity?: string};
  documents?: DocumentEntry[] | Record<string, string>;
  insuranceDetails?: {insuranceType?: string; policyNumber?: string; validFrom?: string; validUntil?: string};
  bankDetails?: {accountHolderName?: string; accountNumber?: string; ifsc?: string; upiId?: string};
}

type EditRoute = keyof Pick<
  RootStackParamList,
  'PersonalInformation' | 'HomeAddress' | 'EmergencyContact' | 'VehicleType' | 'DrivingLicence' | 'PaymentDetails'
>;

interface Section {
  title: string;
  editRoute: EditRoute;
  rows: {label: string; value: string}[];
}

function hasDocType(documents: RegistrationData['documents'], type: string): boolean {
  if (!documents) {
    return false;
  }
  if (Array.isArray(documents)) {
    return documents.some(d => d.type === type && !!d.url);
  }
  return !!documents[type];
}

export function ReviewApplicationScreen({route, navigation}: Props) {
  const {driver} = useDriverAuth();
  const mobile = (driver?.phone as string | undefined) ?? '';
  const submitError = route.params?.submitError;
  const [confirmed, setConfirmed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RegistrationData | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<RegistrationData>('/driver/registration');
      setData(response.data);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not load your application details.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = () => {
    if (!confirmed) {
      return;
    }
    navigation.navigate('SubmittingApplication');
  };

  if (loading) {
    return (
      <Screen backgroundColor={colors.background} edges={['top', 'bottom']}>
        <Loader fullscreen label="Loading your application…" />
      </Screen>
    );
  }

  if (error || !data) {
    return (
      <Screen backgroundColor={colors.background} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <IconBackButton onPress={() => navigation.goBack()} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Review Application</Text>
          </View>
        </View>
        <ErrorState title="Could not load application" description={error ?? undefined} onRetry={load} />
      </Screen>
    );
  }

  const personalInfo = data.personalInfo ?? {};
  const address = data.address ?? {};
  const emergencyContact = data.emergencyContact ?? {};
  const vehicleDetails = data.vehicleDetails ?? {};
  const insuranceDetails = data.insuranceDetails ?? {};
  const bankDetails = data.bankDetails ?? {};

  const sections: Section[] = [
    {
      title: 'Personal Information',
      editRoute: 'PersonalInformation',
      rows: [
        {label: 'Full Name', value: personalInfo.fullName || 'Not provided'},
        {label: 'Email', value: personalInfo.email || 'Not provided'},
        {label: 'Date of Birth', value: personalInfo.dob || 'Not provided'},
        {label: 'Gender', value: personalInfo.gender || 'Not provided'},
      ],
    },
    {
      title: 'Address',
      editRoute: 'HomeAddress',
      rows: [
        {label: 'Address', value: address.line1 ? `${address.line1}${address.area ? ', ' + address.area : ''}` : 'Not provided'},
        {label: 'City / State', value: address.city ? `${address.city}, ${address.state ?? ''}` : 'Not provided'},
        {label: 'Pincode', value: address.pincode || 'Not provided'},
      ],
    },
    {
      title: 'Emergency Contact',
      editRoute: 'EmergencyContact',
      rows: [
        {label: 'Name', value: emergencyContact.name || 'Not provided'},
        {label: 'Relationship', value: emergencyContact.relationship || 'Not provided'},
        {label: 'Mobile', value: emergencyContact.mobile || 'Not provided'},
      ],
    },
    {
      title: 'Vehicle',
      editRoute: 'VehicleType',
      rows: [
        {label: 'Type', value: data.vehicleType || 'Not provided'},
        {label: 'Reg. Number', value: vehicleDetails.registrationNumber || 'Not provided'},
        {label: 'Model', value: vehicleDetails.brand ? `${vehicleDetails.brand} ${vehicleDetails.model ?? ''}`.trim() : 'Not provided'},
      ],
    },
    {
      title: 'Documents',
      editRoute: 'DrivingLicence',
      rows: [
        {label: 'Driving Licence (Front)', value: hasDocType(data.documents, 'license_front') ? '✓ Uploaded' : 'Not uploaded'},
        {label: 'Driving Licence (Back)', value: hasDocType(data.documents, 'license_back') ? '✓ Uploaded' : 'Not uploaded'},
        {label: 'RC Document', value: hasDocType(data.documents, 'rc') ? '✓ Uploaded' : 'Not uploaded'},
        {label: 'Insurance', value: hasDocType(data.documents, 'insurance') ? '✓ Uploaded' : 'Not uploaded'},
        {label: 'Insurance Policy No.', value: insuranceDetails.policyNumber || 'Not provided'},
      ],
    },
    {
      title: 'Bank / Payment',
      editRoute: 'PaymentDetails',
      rows: [
        {label: 'Account Holder', value: bankDetails.accountHolderName || 'Not provided'},
        {label: 'Account Number', value: bankDetails.accountNumber ? `••••${bankDetails.accountNumber.slice(-4)}` : 'Not provided'},
        {label: 'IFSC', value: bankDetails.ifsc || 'Not provided'},
      ],
    },
  ];

  const completedCount = sections.filter(s => s.rows.every(r => r.value !== 'Not provided' && r.value !== 'Not uploaded')).length;
  const avatarUri = resolveAssetUrl(data.avatarUrl);

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Review Application</Text>
          <Text style={styles.headerSubtitle}>Verify all details before submitting</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!!submitError && <InfoBanner tone="warning" title="Could not submit application" description={submitError} />}

        <View style={styles.summaryCard}>
          <View style={styles.summaryAvatar}>
            {avatarUri ? <Image source={{uri: avatarUri}} style={styles.summaryAvatarImage} /> : <Icon name="user" size={32} color={colors.white} />}
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryName}>{personalInfo.fullName || 'Your name'}</Text>
            <Text style={styles.summaryMeta}>
              {mobile ? `+91 ${mobile}` : ''}
              {personalInfo.email ? ` · ${personalInfo.email}` : ''}
            </Text>
          </View>
          <View style={styles.summaryBadge}>
            <Text style={styles.summaryBadgeText}>
              {completedCount}/{sections.length} ✓
            </Text>
          </View>
        </View>

        {sections.map(section => (
          <ReviewSection key={section.title} title={section.title} rows={section.rows} onEdit={() => (section.editRoute === 'PersonalInformation' ? navigation.navigate('PersonalInformation', {mobile}) : navigation.navigate(section.editRoute))} />
        ))}

        <TouchableOpacity style={styles.consentRow} activeOpacity={0.85} onPress={() => setConfirmed(c => !c)}>
          <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
            {confirmed && <Icon name="check" size={12} color={colors.white} />}
          </View>
          <Text style={styles.consentText}>
            I confirm that all information provided is accurate and truthful. I understand that providing false
            information may result in permanent account suspension.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Back" variant="secondary" style={styles.backButton} onPress={() => navigation.goBack()} />
        <Button label="Submit Application" style={styles.submitButton} disabled={!confirmed} onPress={handleSubmit} />
      </View>
    </Screen>
  );
}

function ReviewSection({title, rows, onEdit}: {title: string; rows: {label: string; value: string}[]; onEdit: () => void}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <View style={styles.sectionCheck}>
            <Icon name="check" size={11} color={colors.primary} />
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} activeOpacity={0.8} onPress={onEdit}>
          <Icon name="edit" size={13} color={colors.primary} />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionBody}>
        {rows.map((row, index) => (
          <View key={row.label} style={[styles.sectionRow, index > 0 && styles.sectionRowBorder]}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue} numberOfLines={2}>
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerText: {flex: 1},
  headerTitle: {...typography.subtitle, fontSize: 16, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  body: {padding: spacing.xl, gap: spacing.md},
  summaryCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primary, borderRadius: radius.xl, padding: spacing.lg},
  summaryAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  summaryAvatarImage: {width: '100%', height: '100%'},
  summaryText: {flex: 1},
  summaryName: {...typography.bodyBold, color: colors.white},
  summaryMeta: {...typography.caption, color: 'rgba(255,255,255,0.75)', marginTop: 2},
  summaryBadge: {backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4},
  summaryBadgeText: {...typography.captionSemibold, color: colors.white},
  section: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xl, overflow: 'hidden'},
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionHeaderLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  sectionCheck: {width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  sectionTitle: {...typography.labelSemibold, color: colors.textPrimary},
  editButton: {flexDirection: 'row', alignItems: 'center', gap: 4},
  editText: {...typography.captionMedium, color: colors.primary},
  sectionBody: {paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  sectionRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, gap: spacing.md},
  sectionRowBorder: {borderTopWidth: 1, borderTopColor: '#F9FAFB'},
  rowLabel: {...typography.caption, color: colors.textSecondary},
  rowValue: {...typography.captionMedium, color: colors.textPrimary, flex: 1, textAlign: 'right'},
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  checkbox: {width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 1},
  checkboxChecked: {backgroundColor: colors.primary},
  consentText: {flex: 1, ...typography.caption, color: colors.textSecondary, lineHeight: 16},
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  backButton: {flex: 1},
  submitButton: {flex: 2},
});
