import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {SupportFaqItem, SupportTopicScreen} from './SupportTopicScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportPaymentIssues'>;

const FAQS: SupportFaqItem[] = [
  {
    question: 'My earnings for a delivery are not showing',
    answer:
      'Earnings are added once the delivery is confirmed as completed. Pull down to refresh the Earnings screen. If a completed delivery is still missing after a few hours, contact support with the order ID.',
  },
  {
    question: 'The earnings amount looks incorrect',
    answer:
      'Open the delivery in Earnings to see the breakdown of base pay, distance and incentives. If a component looks wrong, email support with the order ID and the amount you expected.',
  },
  {
    question: 'My payout failed',
    answer:
      'Payouts fail most often because the bank account or UPI ID could not be verified, or the account is inactive. Check Payment settings to make sure your details are verified, then the payout is retried in the next cycle.',
  },
  {
    question: 'Bank verification is pending or failed',
    answer:
      'Make sure the account holder name exactly matches the name on your profile and the IFSC is correct. You can update your bank details from Payment settings; verification usually completes within a business day.',
  },
  {
    question: 'I did not receive an incentive bonus',
    answer:
      'Incentives are credited after the incentive period ends and all qualifying deliveries are confirmed. Check the Incentives screen for progress and the credit date before contacting support.',
  },
  {
    question: 'When are payouts processed?',
    answer: 'Payouts are processed weekly to your verified bank account or UPI ID. The schedule and history are shown under Payment History.',
  },
];

export function SupportPaymentIssuesScreen({navigation}: Props) {
  return <SupportTopicScreen title="Payment Issues" intro="Answers about earnings, payouts and bank verification." faqs={FAQS} banner={{tone: 'info', icon: 'info', text: 'Earnings for a delivery appear in Earnings as soon as the delivery is marked complete.'}} onBack={() => navigation.goBack()} />;
}
