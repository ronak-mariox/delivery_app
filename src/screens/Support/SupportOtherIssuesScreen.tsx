import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {SupportFaqItem, SupportTopicScreen} from './SupportTopicScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportOtherIssues'>;

const FAQS: SupportFaqItem[] = [
  {
    question: 'How do I report something not listed here?',
    answer: 'Email support with a short description of the problem, the order ID if it relates to a delivery, and screenshots if you have them. Use the buttons below to call or email us directly.',
  },
  {
    question: 'How do I give feedback about the app?',
    answer: 'We read every message. Email support with "Feedback" in the subject line and tell us what is working and what is not.',
  },
  {
    question: 'How do I report a safety concern?',
    answer: 'During a delivery, use the emergency button on the delivery screen. For anything else, call support; safety concerns are handled as a priority.',
  },
  {
    question: 'What are the support hours?',
    answer: 'Phone support is available daily during delivery hours. Emails are answered within one business day.',
  },
];

export function SupportOtherIssuesScreen({navigation}: Props) {
  return <SupportTopicScreen title="Other Issues" intro="Cannot find your issue in the categories? Here is how to reach us." faqs={FAQS} onBack={() => navigation.goBack()} />;
}
