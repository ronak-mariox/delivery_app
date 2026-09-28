import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {SupportFaqItem, SupportTopicScreen} from './SupportTopicScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportCustomerIssues'>;

const FAQS: SupportFaqItem[] = [
  {
    question: 'The customer is unreachable',
    answer: 'Call the customer from the delivery screen and wait at the drop location for a few minutes. If there is still no response, use the "Customer unavailable" option so the order is handled correctly.',
  },
  {
    question: 'The customer refused the delivery',
    answer: 'Do not leave the package. Use "Cannot complete" on the delivery screen and follow the return instructions. Refused deliveries are compensated as per the cancellation policy.',
  },
  {
    question: 'The customer was rude or threatening',
    answer: 'Leave the situation if you feel unsafe and use the emergency button. Afterwards, email support with the order ID so the incident is recorded on the customer account.',
  },
  {
    question: 'The customer gave a wrong address',
    answer: 'Confirm the correct address over the phone and use the "Wrong address" option in the delivery flow. Only the customer or support can change the address on the order.',
  },
  {
    question: 'The customer does not have the delivery OTP',
    answer: 'Ask the customer to check the SMS or app notification for the order. If the OTP still cannot be found, call support from the delivery screen to verify the handover another way.',
  },
];

export function SupportCustomerIssuesScreen({navigation}: Props) {
  return <SupportTopicScreen title="Customer Issues" intro="Handling difficult situations with customers during delivery." faqs={FAQS} banner={{tone: 'danger', icon: 'alert-triangle', text: 'If you feel unsafe, use the emergency button immediately. Safety reports are treated as a priority.'}} onBack={() => navigation.goBack()} />;
}
