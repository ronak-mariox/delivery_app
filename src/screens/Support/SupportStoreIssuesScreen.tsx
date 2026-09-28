import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {SupportFaqItem, SupportTopicScreen} from './SupportTopicScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportStoreIssues'>;

const FAQS: SupportFaqItem[] = [
  {
    question: 'The store did not have my order',
    answer: 'Show the order ID to the store staff. If the order is still not found, use "Report store issue" on the pickup screen so the order can be checked with the store and reassigned or cancelled.',
  },
  {
    question: 'The store gave me the wrong items',
    answer: 'Check the package details against the order before leaving. If items are missing or wrong, report it from the pickup screen with a photo so the customer can be informed.',
  },
  {
    question: 'The store was closed',
    answer: 'Report the closed store from the pickup screen. Wait for confirmation that the order has been cancelled or reassigned before moving on; you will not be penalised.',
  },
  {
    question: 'Store staff were rude or uncooperative',
    answer: 'Stay calm and do not argue. Complete the pickup if you can and email support afterwards with the order ID and what happened so it can be raised with the store.',
  },
  {
    question: 'The order is taking too long to prepare',
    answer: 'Use "Order not ready" on the pickup screen. The wait is recorded and long waits are accounted for in your delivery time.',
  },
];

export function SupportStoreIssuesScreen({navigation}: Props) {
  return <SupportTopicScreen title="Store Issues" intro="What to do when something goes wrong at the pickup store." faqs={FAQS} onBack={() => navigation.goBack()} />;
}
