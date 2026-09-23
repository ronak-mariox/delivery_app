import {IconName} from '../../components';

export type NotificationCategory = 'Orders' | 'Earnings' | 'Account' | 'System';
export type NotificationAccent = 'green' | 'amber' | 'blue' | 'gray' | 'dark';
export type NotificationSection = 'Today' | 'Yesterday';

export interface NotificationListItem {
  id: string;
  category: NotificationCategory;
  section: NotificationSection;
  title: string;
  subtitle: string;
  time: string;
  icon: IconName;
  accent: NotificationAccent;
  defaultUnread: boolean;
  legacy?: boolean;
}

export const NOTIFICATIONS: NotificationListItem[] = [
  {
    id: 'new-delivery',
    category: 'Orders',
    section: 'Today',
    title: 'New delivery request',
    subtitle: 'Order #VR-84828 ready for pickup',
    time: '2 min ago',
    icon: 'bell',
    accent: 'green',
    defaultUnread: true,
  },
  {
    id: 'earnings-credited',
    category: 'Earnings',
    section: 'Today',
    title: 'Earnings credited',
    subtitle: '₹1,284 paid to HDFC UPI',
    time: '10 min ago',
    icon: 'wallet',
    accent: 'green',
    defaultUnread: true,
  },
  {
    id: 'incentive-alert',
    category: 'Earnings',
    section: 'Today',
    title: 'Incentive alert',
    subtitle: '5 more deliveries for ₹150 bonus',
    time: '1 hr ago',
    icon: 'star',
    accent: 'amber',
    defaultUnread: true,
  },
  {
    id: 'account-alert',
    category: 'Account',
    section: 'Today',
    title: 'Account alert',
    subtitle: 'Insurance expiring in 7 days',
    time: '3 hrs ago',
    icon: 'alert-triangle',
    accent: 'amber',
    defaultUnread: true,
  },
  {
    id: 'order-status',
    category: 'Orders',
    section: 'Today',
    title: 'Order status update',
    subtitle: '#VR-84821: contactless delivery requested',
    time: 'Just now',
    icon: 'package',
    accent: 'gray',
    defaultUnread: false,
  },
  {
    id: 'pickup-ready',
    category: 'Orders',
    section: 'Today',
    title: 'Pickup ready',
    subtitle: 'Swiggy Instamart order ready for collection',
    time: '5 min ago',
    icon: 'store',
    accent: 'gray',
    defaultUnread: false,
  },
  {
    id: 'customer-update',
    category: 'Orders',
    section: 'Today',
    title: 'Customer update',
    subtitle: 'Gate code changed to #5506',
    time: '15 min ago',
    icon: 'user',
    accent: 'gray',
    defaultUnread: false,
  },
  {
    id: 'document-verification',
    category: 'Account',
    section: 'Today',
    title: 'Document verification update',
    subtitle: 'Driving Licence successfully verified',
    time: 'Today, 9:15 AM',
    icon: 'shield',
    accent: 'gray',
    defaultUnread: false,
  },
  {
    id: 'support-update',
    category: 'Account',
    section: 'Today',
    title: 'Support update',
    subtitle: 'Issue #ISS-29847 resolved',
    time: 'Today, 11:42 AM',
    icon: 'headphones',
    accent: 'gray',
    defaultUnread: false,
  },
  {
    id: 'system-announcement',
    category: 'System',
    section: 'Today',
    title: 'System announcement',
    subtitle: 'App update — Version 3.2.1 available',
    time: 'Sep 6, 9:00 AM',
    icon: 'megaphone',
    accent: 'gray',
    defaultUnread: false,
  },
  {
    id: 'legacy-delivery-completed',
    category: 'Orders',
    section: 'Yesterday',
    title: 'Delivery completed',
    subtitle: '#VR-84821 delivered',
    time: 'Sep 5, 3:04 PM',
    icon: 'package',
    accent: 'gray',
    defaultUnread: false,
    legacy: true,
  },
  {
    id: 'legacy-payout-processed',
    category: 'Earnings',
    section: 'Yesterday',
    title: 'Payout processed',
    subtitle: '₹1,146 paid',
    time: 'Sep 5, 10:00 AM',
    icon: 'wallet',
    accent: 'gray',
    defaultUnread: false,
    legacy: true,
  },
  {
    id: 'sync-failed',
    category: 'System',
    section: 'Yesterday',
    title: 'Sync failed',
    subtitle: 'We had trouble syncing your data. Tap to see details.',
    time: 'Sep 5, 6:20 PM',
    icon: 'alert-triangle',
    accent: 'gray',
    defaultUnread: false,
    legacy: true,
  },
];
