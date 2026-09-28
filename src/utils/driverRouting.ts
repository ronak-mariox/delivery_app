import {RootStackParamList} from '../navigation/types';
import {Driver} from '../context/DriverAuthContext';

export type RegistrationNextStep =
  | 'personal-info'
  | 'address'
  | 'emergency-contact'
  | 'vehicle-type'
  | 'vehicle-details'
  | 'documents'
  | 'insurance-details'
  | 'bank-details'
  | 'submit';

export interface RegistrationStatus {
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  kycStatus?: 'pending' | 'verified' | 'rejected';
  registrationStep?: string | null;
  nextStep?: RegistrationNextStep | null;
  referenceId?: string | null;
  rejectionReason?: string | null;
}

export type DriverRoute = {name: keyof RootStackParamList; params?: never} | {name: 'PersonalInformation'; params: {mobile: string}};

const STEP_TO_SCREEN: Record<RegistrationNextStep, keyof RootStackParamList> = {
  'personal-info': 'PersonalInformation',
  address: 'HomeAddress',
  'emergency-contact': 'EmergencyContact',
  'vehicle-type': 'VehicleType',
  'vehicle-details': 'VehicleDetails',
  documents: 'DrivingLicence',
  'insurance-details': 'InsuranceDocument',
  'bank-details': 'PaymentDetails',
  submit: 'ReviewApplication',
};

// Order the wizard saves steps in; used to infer nextStep when the backend omits it.
const STEP_ORDER: RegistrationNextStep[] = [
  'personal-info',
  'address',
  'emergency-contact',
  'vehicle-type',
  'vehicle-details',
  'documents',
  'insurance-details',
  'bank-details',
  'submit',
];

function inferNextStep(registrationStep?: string | null): RegistrationNextStep | null {
  if (!registrationStep || registrationStep === 'mobile') {
    return 'personal-info';
  }
  if (registrationStep === 'submitted') {
    return null;
  }
  const idx = STEP_ORDER.indexOf(registrationStep as RegistrationNextStep);
  if (idx === -1) {
    return 'personal-info';
  }
  return STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)];
}

/** Where a signed-in driver should land, given their account/registration state. */
export function routeForDriverStatus(state: RegistrationStatus, mobile?: string): {name: keyof RootStackParamList; params?: object} {
  switch (state.status) {
    case 'active':
      return {name: 'Home'};
    case 'rejected':
      return {name: 'VerificationRejected'};
    case 'suspended':
      return {name: 'AccountRestricted'};
    default:
      break;
  }

  const nextStep = state.nextStep !== undefined ? state.nextStep : inferNextStep(state.registrationStep);
  if (nextStep) {
    const name = STEP_TO_SCREEN[nextStep] ?? 'PersonalInformation';
    if (name === 'PersonalInformation') {
      return {name, params: {mobile: mobile ?? ''}};
    }
    if (name === 'VehicleDetails') {
      return {name: 'VehicleType'};
    }
    return {name};
  }
  return {name: 'VerificationInProgress'};
}

export function routeForDriver(driver: Driver | null | undefined): {name: keyof RootStackParamList; params?: object} {
  if (!driver) {
    return {name: 'Welcome'};
  }
  return routeForDriverStatus(
    {
      status: driver.status ?? 'pending',
      kycStatus: driver.kycStatus,
      registrationStep: driver.registrationStep,
      rejectionReason: driver.rejectionReason,
    },
    driver.phone,
  );
}
