import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {SupportFaqItem, SupportTopicScreen} from './SupportTopicScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportTechnicalIssues'>;

const FAQS: SupportFaqItem[] = [
  {
    question: 'The app is crashing or not loading',
    answer: 'Close the app fully and reopen it. If it keeps crashing, clear the app cache from your phone settings or reinstall the app from the store. Your account and earnings are stored on our servers and are not affected.',
  },
  {
    question: 'GPS is not working',
    answer: 'Make sure location is on, set to high accuracy and allowed for this app at all times. Restarting the phone resolves most GPS issues.',
  },
  {
    question: 'Navigation is not updating',
    answer: 'Check your mobile data connection. Navigation needs an active connection to download the route; once loaded, the map continues to work briefly offline.',
  },
  {
    question: 'I am not receiving in-app alerts',
    answer: 'Open Account > Notification Settings and make sure the alerts you want are turned on. Also check that battery saver is not restricting the app in the background.',
  },
  {
    question: 'I keep getting signed out',
    answer: 'Sessions expire after a long period of inactivity or when the same account signs in on another device. Sign in again with your mobile number and OTP.',
  },
  {
    question: 'The app shows "No internet" even though I am online',
    answer: 'Switch between Wi-Fi and mobile data, or toggle airplane mode. If only this app cannot connect, our servers may be briefly unavailable; wait a minute and retry.',
  },
];

export function SupportTechnicalIssuesScreen({navigation}: Props) {
  return <SupportTopicScreen title="Technical Issues" intro="Fixes for common app, GPS and login problems." faqs={FAQS} onBack={() => navigation.goBack()} />;
}
