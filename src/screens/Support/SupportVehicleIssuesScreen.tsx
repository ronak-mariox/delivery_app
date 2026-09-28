import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {SupportFaqItem, SupportTopicScreen} from './SupportTopicScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportVehicleIssues'>;

const FAQS: SupportFaqItem[] = [
  {
    question: 'Vehicle verification failed',
    answer:
      'Check the reason shown under Vehicle. Verification fails most often when the registration number on the RC does not match what was entered, or when the RC or insurance image is unreadable.',
  },
  {
    question: 'I entered the wrong vehicle details',
    answer: 'You can edit the registration number, brand, model and colour from Vehicle. Saving changes puts the vehicle back into verification.',
  },
  {
    question: 'My insurance has expired or was rejected',
    answer: 'Upload the current insurance certificate from Vehicle. The policy number, validity dates and vehicle number must be clearly visible.',
  },
  {
    question: 'RC verification problem',
    answer: 'Upload both sides of the RC if your RC is a card. The owner name does not need to match your profile, but the registration number must match the vehicle you entered.',
  },
  {
    question: 'I want to change my vehicle type',
    answer: 'Use "Change vehicle type" under Vehicle. The new vehicle needs its own RC and insurance documents before you can go online with it.',
  },
];

export function SupportVehicleIssuesScreen({navigation}: Props) {
  return <SupportTopicScreen title="Vehicle Issues" intro="Help with vehicle details, RC, insurance and vehicle changes." faqs={FAQS} banner={{tone: 'info', icon: 'info', text: 'Changing vehicle details triggers re-verification, which usually takes 1–2 business days.'}} onBack={() => navigation.goBack()} />;
}
