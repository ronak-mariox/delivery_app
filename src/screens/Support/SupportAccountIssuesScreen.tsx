import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {SupportFaqItem, SupportTopicScreen} from './SupportTopicScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportAccountIssues'>;

const FAQS: SupportFaqItem[] = [
  {
    question: 'I cannot log in',
    answer:
      'Login uses the mobile number you registered with and a one-time password. Make sure you enter the number without the country code prefix and that your phone has network coverage to receive SMS.',
  },
  {
    question: 'I did not receive the OTP',
    answer:
      'Wait for the resend timer and request a new code. Check that SMS is not blocked for unknown senders and that your phone has signal. If OTPs still do not arrive, call support so we can verify the number on your account.',
  },
  {
    question: 'My account is suspended or restricted',
    answer:
      'The app shows the reason on the restriction screen when you sign in. Suspensions relating to documents are lifted once the document is re-verified. For other restrictions, contact support with your registered mobile number.',
  },
  {
    question: 'My profile update failed',
    answer:
      'Some fields, such as your mobile number, cannot be changed from the app. Other profile details save from Profile once you have a working connection. If a save keeps failing, note the error shown and contact support.',
  },
  {
    question: 'I want to change my registered mobile number',
    answer: 'Mobile number changes are handled by the support team so the account can be verified. Call or email support from your current number to start the change.',
  },
  {
    question: 'I want to close my account',
    answer:
      'Email support from your registered email or mobile number asking for account closure. Pending payouts are settled before the account is closed.',
  },
];

export function SupportAccountIssuesScreen({navigation}: Props) {
  return <SupportTopicScreen title="Account Issues" intro="Help with signing in, OTPs, suspensions and profile updates." faqs={FAQS} onBack={() => navigation.goBack()} />;
}
