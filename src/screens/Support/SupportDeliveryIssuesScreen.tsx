import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {SupportFaqItem, SupportTopicScreen} from './SupportTopicScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportDeliveryIssues'>;

const FAQS: SupportFaqItem[] = [
  {
    question: 'The customer is unreachable',
    answer:
      'Call the customer from the delivery screen and wait at the drop location. If there is still no response after a few minutes, use the "Customer unavailable" option in the delivery flow so the order is handled correctly. Do not leave the package unattended.',
  },
  {
    question: 'The delivery address is wrong',
    answer:
      'Confirm the address with the customer over the phone. If it differs from what the app shows, use the "Wrong address" option in the delivery flow. Only the customer or support can update the address on the order.',
  },
  {
    question: 'The package was damaged during pickup',
    answer:
      'Do not accept a visibly damaged package. Report it from the pickup screen with a photo before leaving the store so the order can be reassigned or cancelled without affecting your rating.',
  },
  {
    question: 'The store is closed or unavailable',
    answer:
      'Use "Report store issue" on the pickup screen. Wait for the order to be cancelled or reassigned before moving on; you will not be penalised for a store-side problem that has been reported.',
  },
  {
    question: 'Navigation or GPS is not working',
    answer:
      'Check that location services are on and set to high accuracy in your phone settings. Restarting the app usually restores the GPS signal. You can also open the destination in your preferred maps app from the navigation screen.',
  },
  {
    question: 'A delivery was cancelled after I picked it up',
    answer:
      'Follow the in-app instructions to return the order to the store. Completed pickups that are cancelled by the customer are compensated as per the cancellation policy shown in Earnings.',
  },
];

export function SupportDeliveryIssuesScreen({navigation}: Props) {
  return <SupportTopicScreen title="Delivery Issues" intro="Common problems during pickup and drop-off, and what to do about them." faqs={FAQS} onBack={() => navigation.goBack()} />;
}
