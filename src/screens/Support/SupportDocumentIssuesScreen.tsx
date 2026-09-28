import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {SupportFaqItem, SupportTopicScreen} from './SupportTopicScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'SupportDocumentIssues'>;

const FAQS: SupportFaqItem[] = [
  {
    question: 'My document was rejected',
    answer:
      'The rejection reason is shown on the document in Documents. Common causes are blurry photos, cut-off edges, mismatched names or an expired document. Upload a clear photo of the full document to re-submit.',
  },
  {
    question: 'The upload keeps failing',
    answer: 'Use a photo under 10 MB in JPG or PNG format and make sure you have a stable connection. Switching from mobile data to Wi-Fi often helps with larger images.',
  },
  {
    question: 'My document is expiring soon',
    answer:
      'Upload the renewed document from Documents before the current one expires so you can keep delivering without interruption. The old document stays valid until the new one is verified.',
  },
  {
    question: 'Verification is taking too long',
    answer: 'Most documents are reviewed within one to two business days. If a document has been under review for longer, contact support with your registered mobile number.',
  },
  {
    question: 'The details on my document are wrong',
    answer: 'If the document shows outdated details (for example a previous address), upload the corrected document. Details cannot be edited manually once a document is submitted.',
  },
];

export function SupportDocumentIssuesScreen({navigation}: Props) {
  return <SupportTopicScreen title="Document Issues" intro="Help with document uploads, verification and expiry." faqs={FAQS} onBack={() => navigation.goBack()} />;
}
