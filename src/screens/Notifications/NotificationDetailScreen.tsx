import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, ProgressBar} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationDetail'>;
type Nav = Props['navigation'];

const ORDER_ID = 'VR-84828';
const DELIVERED_ORDER_ID = 'VR-84821';

function Banner({bg, iconBg, icon, iconColor, title, titleColor, time, timeColor, dark}: any) {
  return (
    <View style={[styles.banner, {backgroundColor: bg}, dark && styles.bannerDark]}>
      <View style={[styles.bannerIconWrap, iconBg && {backgroundColor: iconBg}]}>
        <Icon name={icon} size={22} color={iconColor} />
      </View>
      <View>
        <Text style={[styles.bannerTitle, {color: titleColor}]}>{title}</Text>
        <Text style={[styles.bannerTime, {color: timeColor}]}>{time}</Text>
      </View>
    </View>
  );
}

function BodyCard({children}: React.PropsWithChildren<{}>) {
  return <View style={styles.card}>{children}</View>;
}

function InfoRow({label, value, valueColor}: {label: string; value: string; valueColor?: string}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor && {color: valueColor}]}>{value}</Text>
    </View>
  );
}

function renderContent(id: string, navigation: Nav) {
  switch (id) {
    case 'new-delivery':
      return (
        <>
          <Banner bg={colors.primarySurface} icon="bell" iconColor={colors.primary} title="New Delivery Request" titleColor={colors.primaryDark} time="2 min ago" timeColor={colors.primary} />
          <BodyCard>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.orderId}>#{ORDER_ID}</Text>
                <Text style={styles.orderRoute}>Swiggy Instamart → Indiranagar</Text>
              </View>
              <Text style={styles.orderAmount}>₹78</Text>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>3.8 km</Text>
              </View>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>ETA</Text>
                <Text style={styles.statValue}>22 min</Text>
              </View>
              <View style={styles.statCol}>
                <Text style={styles.statLabel}>Items</Text>
                <Text style={styles.statValue}>3</Text>
              </View>
            </View>
            <View style={styles.countdownRow}>
              <View style={styles.countdownRing}>
                <Text style={styles.countdownText}>18s</Text>
              </View>
              <Text style={styles.countdownLabel}>Order expires in 18 seconds</Text>
            </View>
          </BodyCard>
          <Button label="View and Accept Order" onPress={() => navigation.navigate('OrderRequestDetails', {orderId: ORDER_ID, secondsLeft: 18})} />
          <Button label="Dismiss" variant="secondary" onPress={() => navigation.goBack()} />
        </>
      );
    case 'order-status':
      return (
        <>
          <Banner bg={colors.warningSurface} icon="package" iconColor={colors.warning} title="Order Status Update" titleColor={colors.warningText} time="Just now" timeColor={colors.warning} />
          <BodyCard>
            <Text style={styles.bodyText}>#{DELIVERED_ORDER_ID} has been updated: Customer requested contactless delivery. Please leave at door.</Text>
          </BodyCard>
          <BodyCard>
            <Text style={styles.cardLabel}>ORDER CONTEXT</Text>
            <Text style={styles.contextOrderId}>#{DELIVERED_ORDER_ID}</Text>
            <Text style={styles.contextLine}>Swiggy Instamart → HSR Layout</Text>
            <Text style={styles.contextLineMuted}>Customer: Priya Mehta</Text>
          </BodyCard>
          <Button label="View Order" onPress={() => navigation.navigate('DeliveryHistoryDetail', {orderId: DELIVERED_ORDER_ID})} />
          <Button label="Message Customer" variant="outline" icon="message-circle" onPress={() => navigation.navigate('MessageCustomer', {orderId: DELIVERED_ORDER_ID})} />
          <Button label="Dismiss" variant="secondary" onPress={() => navigation.goBack()} />
        </>
      );
    case 'pickup-ready':
      return (
        <>
          <Banner bg={colors.primarySurface} icon="store" iconColor={colors.primary} title="Pickup Ready" titleColor={colors.primaryDark} time="5 min ago" timeColor={colors.primary} />
          <BodyCard>
            <Text style={styles.bodyText}>Your order at Swiggy Instamart is ready for collection. Staff is waiting at counter.</Text>
          </BodyCard>
          <BodyCard>
            <Text style={styles.cardLabel}>STORE DETAILS</Text>
            <Text style={styles.contextOrderId}>Swiggy Instamart</Text>
            <Text style={styles.contextLine}>Koramangala 6th Block, Bengaluru</Text>
            <Text style={styles.contextLineMuted}>Order #{ORDER_ID} · 3 items</Text>
            <View style={styles.statsRow}>
              <View style={styles.statTile}>
                <Text style={styles.statTileValue}>1.2 km</Text>
                <Text style={styles.statTileLabel}>Distance</Text>
              </View>
              <View style={styles.statTile}>
                <Text style={styles.statTileValue}>5 min</Text>
                <Text style={styles.statTileLabel}>ETA</Text>
              </View>
              <View style={[styles.statTile, styles.statTileGreen]}>
                <Text style={[styles.statTileValue, styles.statTileValueGreen]}>Open</Text>
                <Text style={[styles.statTileLabel, styles.statTileLabelGreen]}>Store</Text>
              </View>
            </View>
          </BodyCard>
          <Button label="Navigate to Store" icon="navigation" onPress={() => navigation.navigate('NavigateToStore', {orderId: ORDER_ID})} />
          <Button label="View Pickup Details" variant="outline" onPress={() => navigation.navigate('PickupDetails', {orderId: ORDER_ID})} />
        </>
      );
    case 'customer-update':
      return (
        <>
          <Banner bg={colors.infoSurface} icon="user" iconColor={colors.info} title="Customer Update" titleColor="#1D4ED8" time="15 min ago" timeColor={colors.info} />
          <BodyCard>
            <Text style={styles.bodyText}>Priya Mehta has updated delivery instructions: Gate code changed to #5506. Please use side entrance.</Text>
          </BodyCard>
          <BodyCard>
            <Text style={styles.cardLabel}>ADDRESS INFO</Text>
            <Text style={styles.contextLine}>HSR Layout Sector 2, Bengaluru</Text>
            <View style={styles.dotRow}>
              <View style={styles.greenDot} />
              <Text style={styles.dotRowText}>Address unchanged — instructions updated only</Text>
            </View>
          </BodyCard>
          <Button label="View Delivery Details" onPress={() => navigation.navigate('CustomerDeliveryDetails', {orderId: DELIVERED_ORDER_ID})} />
          <Button label="Call Customer" variant="outline" icon="phone" onPress={() => navigation.navigate('CallCustomer', {orderId: DELIVERED_ORDER_ID})} />
          <Button label="Dismiss" variant="secondary" onPress={() => navigation.goBack()} />
        </>
      );
    case 'earnings-credited':
      return (
        <>
          <Banner bg={colors.primarySurface} icon="wallet" iconColor={colors.primary} title="Earnings Credited" titleColor={colors.primaryDark} time="10 min ago" timeColor={colors.primary} />
          <BodyCard>
            <Text style={styles.bodyText}>₹1,284 has been successfully credited to your HDFC UPI (ravi.kumar@hdfc). Transaction ID: TXN-8840291.</Text>
          </BodyCard>
          <BodyCard>
            <Text style={styles.cardTitle}>Breakdown</Text>
            <InfoRow label="Base earnings" value="₹756" />
            <InfoRow label="Bonuses" value="₹154" />
            <InfoRow label="Distance" value="₹374" />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹1,284</Text>
            </View>
          </BodyCard>
          <Button label="View Payment Details" onPress={() => navigation.navigate('DeliveryHistoryEarnings', {orderId: DELIVERED_ORDER_ID})} />
          <Button label="View Earnings Dashboard" variant="outline" onPress={() => navigation.navigate('EarningsDashboard')} />
        </>
      );
    case 'incentive-alert':
      return (
        <>
          <Banner bg={colors.warningSurface} icon="star" iconColor={colors.warning} title="Incentive Alert" titleColor={colors.warningText} time="1 hr ago" timeColor={colors.warning} />
          <BodyCard>
            <Text style={styles.bodyText}>Peak Hour Bonus: Complete 5 more deliveries by 5:00 PM today to earn ₹150 bonus!</Text>
          </BodyCard>
          <BodyCard>
            <View style={styles.rowBetween}>
              <Text style={styles.contextOrderId}>10/15 deliveries</Text>
              <Text style={styles.rewardText}>₹150 reward</Text>
            </View>
            <ProgressBar progress={10 / 15} height={10} style={styles.progressSpacing} />
            <View style={styles.rowBetween}>
              <Text style={styles.contextLineMuted}>67% complete</Text>
              <Text style={styles.contextLineMuted}>5 more needed</Text>
            </View>
            <View style={styles.deadlineBanner}>
              <Text style={styles.deadlineText}>Deadline: 5:00 PM today · 2 hrs 18 min remaining</Text>
            </View>
          </BodyCard>
          <Button label="Go Online to Deliver" onPress={() => navigation.navigate('Home')} />
          <Button label="View Incentive Details" variant="outline" onPress={() => navigation.navigate('IncentiveDetail')} />
        </>
      );
    case 'document-verification':
      return (
        <>
          <Banner bg={colors.infoSurface} icon="shield" iconColor={colors.info} title="Document Verification Update" titleColor="#1D4ED8" time="Today, 9:15 AM" timeColor={colors.info} />
          <BodyCard>
            <Text style={styles.bodyText}>Your Driving Licence has been successfully verified. Your account is fully active.</Text>
          </BodyCard>
          <BodyCard>
            <Text style={styles.cardTitle}>Verification Status</Text>
            <View style={styles.docRow}>
              {['DL', 'RC', 'INS', 'BANK'].map(doc => (
                <View key={doc} style={styles.docTile}>
                  <View style={styles.docCheck}>
                    <Icon name="check" size={14} color={colors.white} />
                  </View>
                  <Text style={styles.docLabel}>{doc}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.docFooter}>All documents verified — account fully active</Text>
          </BodyCard>
          <Button label="View Documents" variant="outline" onPress={() => navigation.navigate('DrivingLicence')} />
          <Button label="Dismiss" variant="secondary" onPress={() => navigation.goBack()} />
        </>
      );
    case 'account-alert':
      return (
        <>
          <Banner bg={colors.warningSurface} icon="alert-triangle" iconColor={colors.warning} title="Account Alert — Action Required" titleColor={colors.warningText} time="3 hrs ago" timeColor={colors.warning} />
          <BodyCard>
            <Text style={styles.bodyText}>Your vehicle insurance expires in 7 days (Sep 13, 2026). Upload updated insurance to avoid delivery suspension.</Text>
          </BodyCard>
          <View style={styles.impactBanner}>
            <Text style={styles.impactTitle}>Impact</Text>
            <Text style={styles.impactText}>Orders may be paused after Sep 13 if document is not updated.</Text>
          </View>
          <BodyCard>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.infoLabel}>Document</Text>
                <Text style={styles.contextLine}>Vehicle Insurance</Text>
              </View>
              <View style={styles.alignEnd}>
                <Text style={styles.infoLabel}>Expires</Text>
                <Text style={styles.expiresValue}>Sep 13, 2026</Text>
              </View>
            </View>
            <View style={styles.deadlineBanner}>
              <Text style={styles.deadlineText}>7 days remaining to upload renewal</Text>
            </View>
          </BodyCard>
          <Button label="Upload Insurance Now" icon="upload" onPress={() => navigation.navigate('InsuranceDocument')} />
          <Button label="View Documents" variant="outline" onPress={() => navigation.navigate('InsuranceDocument')} />
          <Button label="Remind me later" variant="ghost" textColor={colors.textSecondary} onPress={() => navigation.goBack()} />
        </>
      );
    case 'support-update':
      return (
        <>
          <Banner bg="#F9FAFB" icon="headphones" iconColor={colors.textSecondary} title="Support Update" titleColor={colors.textPrimary} time="Today, 11:42 AM" timeColor={colors.textMuted} />
          <BodyCard>
            <Text style={styles.bodyText}>Your issue #ISS-29847 (Customer Unreachable — Order #{DELIVERED_ORDER_ID}) has been resolved. ₹40 partial earnings credited.</Text>
          </BodyCard>
          <BodyCard>
            <Text style={styles.cardTitle}>Resolution Details</Text>
            <InfoRow label="Issue type" value="Customer Unreachable" />
            <InfoRow label="Resolved at" value="Sep 6, 11:40 AM" />
            <InfoRow label="Earnings protected" value="₹40 (partial)" />
            <View style={styles.dotRow}>
              <View style={styles.greenDot} />
              <Text style={styles.dotRowText}>Rating not affected</Text>
            </View>
          </BodyCard>
          <View style={styles.actionsRow}>
            <Button label="View Issue" variant="outline" style={styles.flexOne} onPress={() => navigation.navigate('IssueResolution', {orderId: DELIVERED_ORDER_ID})} />
            <Button label="View Earnings" variant="secondary" style={styles.flexOne} onPress={() => navigation.navigate('EarningsDashboard')} />
          </View>
        </>
      );
    case 'system-announcement':
    default:
      return (
        <>
          <Banner bg={colors.dark900} iconBg="rgba(255,255,255,0.12)" icon="megaphone" iconColor={colors.white} title="System Announcement" titleColor={colors.white} time="Sep 6, 9:00 AM" timeColor={colors.textMuted} dark />
          <BodyCard>
            <Text style={styles.systemTitle}>Verdant Rider App Update — Version 3.2.1</Text>
            <Text style={styles.systemBody}>
              Version 3.2.1 is now available. New features include improved navigation, faster OTP delivery, and performance dashboard enhancements.
            </Text>
          </BodyCard>
          <BodyCard>
            <Text style={styles.cardTitle}>{"What's New"}</Text>
            {['Improved GPS accuracy in dense urban areas', 'Peak hours now shown on home screen map', 'Payout history extended to 6 months'].map(line => (
              <View key={line} style={styles.bulletRow}>
                <Text style={styles.bulletDash}>-</Text>
                <Text style={styles.bulletText}>{line}</Text>
              </View>
            ))}
          </BodyCard>
          <Button label="Update Now" />
          <Button label="Update Later" variant="ghost" textColor={colors.textSecondary} onPress={() => navigation.goBack()} />
        </>
      );
  }
}

export function NotificationDetailScreen({route, navigation}: Props) {
  const {id} = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
      </View>
      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {renderContent(id, navigation)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  banner: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderRadius: radius.xxl, padding: spacing.lg},
  bannerDark: {},
  bannerIconWrap: {width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  bannerTitle: {...typography.bodyBold, fontSize: 15},
  bannerTime: {...typography.caption, fontSize: 12, marginTop: 2},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg, ...shadows.sm},
  bodyText: {...typography.body, fontSize: 14, color: colors.textPrimary, lineHeight: 22},
  cardLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.4, textTransform: 'uppercase'},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  contextOrderId: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, marginTop: spacing.sm},
  contextLine: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  contextLineMuted: {...typography.caption, fontSize: 12, color: colors.textMuted, marginTop: 2},
  rowBetween: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  orderId: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  orderRoute: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  orderAmount: {...typography.h4, fontSize: 20, color: colors.primary},
  statsRow: {flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: spacing.md},
  statCol: {},
  statLabel: {...typography.caption, fontSize: 11, color: colors.textMuted},
  statValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary, marginTop: 2},
  statTile: {flex: 1, backgroundColor: colors.background, borderRadius: radius.sm, paddingVertical: spacing.sm, alignItems: 'center'},
  statTileGreen: {backgroundColor: colors.primarySurface},
  statTileValue: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  statTileValueGreen: {color: colors.primary},
  statTileLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 1},
  statTileLabelGreen: {color: colors.primary},
  countdownRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.md},
  countdownRing: {width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: colors.warning, alignItems: 'center', justifyContent: 'center'},
  countdownText: {...typography.bodyBold, fontSize: 12, color: colors.warning},
  countdownLabel: {...typography.label, fontSize: 13, color: colors.warning},
  dotRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm},
  greenDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  dotRowText: {...typography.caption, fontSize: 12, color: colors.primary},
  infoRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs, marginTop: spacing.xs, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  infoLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  infoValue: {...typography.captionMedium, fontSize: 12, color: colors.textPrimary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.sm, marginTop: spacing.xs},
  totalLabel: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  totalValue: {...typography.bodyBold, fontSize: 14, color: colors.primary},
  rewardText: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  progressSpacing: {marginTop: spacing.sm},
  deadlineBanner: {backgroundColor: colors.warningSurface, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginTop: spacing.md},
  deadlineText: {...typography.caption, fontSize: 12, color: colors.warningText},
  docRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md},
  docTile: {flex: 1, backgroundColor: colors.primarySurface, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center', gap: 4},
  docCheck: {width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  docLabel: {...typography.captionSemibold, fontSize: 10, color: colors.primaryDark},
  docFooter: {...typography.captionMedium, fontSize: 12, color: colors.primary, textAlign: 'center', marginTop: spacing.md},
  impactBanner: {backgroundColor: '#FEF3F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: radius.lg, padding: spacing.md},
  impactTitle: {...typography.bodySemibold, fontSize: 13, color: '#D92D20'},
  impactText: {...typography.label, fontSize: 13, color: '#991B1B', marginTop: 2},
  expiresValue: {...typography.labelSemibold, fontSize: 13, color: '#D92D20'},
  actionsRow: {flexDirection: 'row', gap: spacing.sm},
  flexOne: {flex: 1},
  alignEnd: {alignItems: 'flex-end'},
  systemTitle: {...typography.bodySemibold, fontSize: 15, color: colors.textPrimary},
  systemBody: {...typography.body, fontSize: 14, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 22},
  bulletRow: {flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm},
  bulletDash: {...typography.body, fontSize: 14, color: colors.primary},
  bulletText: {...typography.label, fontSize: 13, color: colors.textSecondary, flex: 1},
});
