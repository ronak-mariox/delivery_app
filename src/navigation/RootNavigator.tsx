import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {SplashScreen} from '../screens/Splash/SplashScreen';
import {WelcomeScreen} from '../screens/Onboarding/WelcomeScreen';
import {LoginScreen} from '../screens/Auth/LoginScreen';
import {RegistrationLandingScreen} from '../screens/Auth/RegistrationLandingScreen';
import {EnterMobileNumberScreen} from '../screens/Auth/EnterMobileNumberScreen';
import {VerifyRegistrationOtpScreen} from '../screens/Auth/VerifyRegistrationOtpScreen';
import {IncorrectOtpScreen} from '../screens/Auth/IncorrectOtpScreen';
import {ResendOtpMethodScreen} from '../screens/Auth/ResendOtpMethodScreen';
import {AccountNotFoundScreen} from '../screens/Auth/AccountNotFoundScreen';
import {PersonalInformationScreen} from '../screens/Registration/PersonalInformationScreen';
import {ProfilePhotoScreen} from '../screens/Registration/ProfilePhotoScreen';
import {HomeAddressScreen} from '../screens/Registration/HomeAddressScreen';
import {EmergencyContactScreen} from '../screens/Registration/EmergencyContactScreen';
import {VehicleTypeScreen} from '../screens/Registration/VehicleTypeScreen';
import {VehicleDetailsScreen} from '../screens/Registration/VehicleDetailsScreen';
import {DrivingLicenceScreen} from '../screens/Registration/DrivingLicenceScreen';
import {RcDocumentScreen} from '../screens/Registration/RcDocumentScreen';
import {InsuranceDocumentScreen} from '../screens/Registration/InsuranceDocumentScreen';
import {PaymentDetailsScreen} from '../screens/Registration/PaymentDetailsScreen';
import {ReviewApplicationScreen} from '../screens/Registration/ReviewApplicationScreen';
import {SubmittingApplicationScreen} from '../screens/Registration/SubmittingApplicationScreen';
import {ApplicationSubmittedScreen} from '../screens/Registration/ApplicationSubmittedScreen';
import {VerificationInProgressScreen} from '../screens/Registration/VerificationInProgressScreen';
import {RiderApprovedScreen} from '../screens/Registration/RiderApprovedScreen';
import {VerificationRejectedScreen} from '../screens/Registration/VerificationRejectedScreen';
import {LocationPermissionScreen} from '../screens/System/LocationPermissionScreen';
import {EnableNotificationsScreen} from '../screens/System/EnableNotificationsScreen';
import {FirstTimeSetupScreen} from '../screens/System/FirstTimeSetupScreen';
import {AccountRestrictedScreen} from '../screens/System/AccountRestrictedScreen';
import {HomeScreen} from '../screens/Home/HomeScreen';
import {HomeActiveDeliveryScreen} from '../screens/Home/HomeActiveDeliveryScreen';
import {NewOrderRequestScreen} from '../screens/Delivery/NewOrderRequestScreen';
import {OrderRequestDetailsScreen} from '../screens/Delivery/OrderRequestDetailsScreen';
import {RejectConfirmSheetScreen} from '../screens/Delivery/RejectConfirmSheetScreen';
import {RejectReasonScreen} from '../screens/Delivery/RejectReasonScreen';
import {OrderRejectedScreen} from '../screens/Delivery/OrderRejectedScreen';
import {RequestTimedOutScreen} from '../screens/Delivery/RequestTimedOutScreen';
import {MultipleOrdersScreen} from '../screens/Delivery/MultipleOrdersScreen';
import {NoOrdersInZoneScreen} from '../screens/Home/NoOrdersInZoneScreen';
import {AssignmentFailedScreen} from '../screens/Delivery/AssignmentFailedScreen';
import {AcceptingOrderScreen} from '../screens/Delivery/AcceptingOrderScreen';
import {OrderAcceptedScreen} from '../screens/Delivery/OrderAcceptedScreen';
import {PickupDetailsScreen} from '../screens/Delivery/PickupDetailsScreen';
import {NavigateToStoreScreen} from '../screens/Delivery/NavigateToStoreScreen';
import {NavigationActiveScreen} from '../screens/Delivery/NavigationActiveScreen';
import {ArrivingAtStoreScreen} from '../screens/Delivery/ArrivingAtStoreScreen';
import {ConfirmingArrivalScreen} from '../screens/Delivery/ConfirmingArrivalScreen';
import {ArrivedAtStoreScreen} from '../screens/Delivery/ArrivedAtStoreScreen';
import {OrderReadyScreen} from '../screens/Delivery/OrderReadyScreen';
import {OrderNotReadyScreen} from '../screens/Delivery/OrderNotReadyScreen';
import {WaitingForOrderScreen} from '../screens/Delivery/WaitingForOrderScreen';
import {ReportStoreIssueScreen} from '../screens/Delivery/ReportStoreIssueScreen';
import {ContactStoreScreen} from '../screens/Delivery/ContactStoreScreen';
import {VerifyPickupScreen} from '../screens/Delivery/VerifyPickupScreen';
import {OrderIdVerificationScreen} from '../screens/Delivery/OrderIdVerificationScreen';
import {PackageDetailsScreen} from '../screens/Delivery/PackageDetailsScreen';
import {CollectOrderScreen} from '../screens/Delivery/CollectOrderScreen';
import {PickupConfirmationScreen} from '../screens/Delivery/PickupConfirmationScreen';
import {OrderPickedUpScreen} from '../screens/Delivery/OrderPickedUpScreen';
import {PickupFailedScreen} from '../screens/Delivery/PickupFailedScreen';
import {PickupRetryScreen} from '../screens/Delivery/PickupRetryScreen';
import {PickupSupportScreen} from '../screens/Delivery/PickupSupportScreen';
import {CustomerDeliveryDetailsScreen} from '../screens/Delivery/CustomerDeliveryDetailsScreen';
import {CustomerStartNavigationScreen} from '../screens/Delivery/CustomerStartNavigationScreen';
import {CustomerNavigationActiveScreen} from '../screens/Delivery/CustomerNavigationActiveScreen';
import {NearCustomerScreen} from '../screens/Delivery/NearCustomerScreen';
import {ArrivedAtCustomerScreen} from '../screens/Delivery/ArrivedAtCustomerScreen';
import {CallCustomerScreen} from '../screens/Delivery/CallCustomerScreen';
import {MessageCustomerScreen} from '../screens/Delivery/MessageCustomerScreen';
import {DeliveryVerificationScreen} from '../screens/Delivery/DeliveryVerificationScreen';
import {OtpEntryScreen} from '../screens/Delivery/OtpEntryScreen';
import {DeliveryOtpIncorrectScreen} from '../screens/Delivery/DeliveryOtpIncorrectScreen';
import {HandOverOrderScreen} from '../screens/Delivery/HandOverOrderScreen';
import {DeliverySuccessScreen} from '../screens/Delivery/DeliverySuccessScreen';
import {EarningsUpdatedScreen} from '../screens/Delivery/EarningsUpdatedScreen';
import {CustomerUnavailableScreen} from '../screens/Delivery/CustomerUnavailableScreen';
import {CallingExceptionScreen} from '../screens/Delivery/CallingExceptionScreen';
import {NoResponseScreen} from '../screens/Delivery/NoResponseScreen';
import {WaitingForCustomerScreen} from '../screens/Delivery/WaitingForCustomerScreen';
import {CustomerContactedScreen} from '../screens/Delivery/CustomerContactedScreen';
import {WrongAddressScreen} from '../screens/Delivery/WrongAddressScreen';
import {UpdateAddressScreen} from '../screens/Delivery/UpdateAddressScreen';
import {CannotLocateCustomerScreen} from '../screens/Delivery/CannotLocateCustomerScreen';
import {OrderCancelledByCustomerScreen} from '../screens/Delivery/OrderCancelledByCustomerScreen';
import {StoreIssueDeliveryScreen} from '../screens/Delivery/StoreIssueDeliveryScreen';
import {WrongItemInOrderScreen} from '../screens/Delivery/WrongItemInOrderScreen';
import {PackageDamageDetectedScreen} from '../screens/Delivery/PackageDamageDetectedScreen';
import {PackageIssueScreen} from '../screens/Delivery/PackageIssueScreen';
import {VehicleProblemScreen} from '../screens/Delivery/VehicleProblemScreen';
import {RoadBlockageScreen} from '../screens/Delivery/RoadBlockageScreen';
import {SafetyConcernScreen} from '../screens/Delivery/SafetyConcernScreen';
import {CannotCompleteScreen} from '../screens/Delivery/CannotCompleteScreen';
import {ReportIssueScreen} from '../screens/Delivery/ReportIssueScreen';
import {SelectIssueReasonScreen} from '../screens/Delivery/SelectIssueReasonScreen';
import {UploadEvidenceScreen} from '../screens/Delivery/UploadEvidenceScreen';
import {IssueSupportContactScreen} from '../screens/Delivery/IssueSupportContactScreen';
import {IssueResolutionScreen} from '../screens/Delivery/IssueResolutionScreen';
import {RetryDeliveryScreen} from '../screens/Delivery/RetryDeliveryScreen';
import {ReturnOrderScreen} from '../screens/Delivery/ReturnOrderScreen';
import {DeliveryFailedScreen} from '../screens/Delivery/DeliveryFailedScreen';
import {DeliveryHistoryScreen} from '../screens/Delivery/DeliveryHistoryScreen';
import {DeliveryHistoryDetailScreen} from '../screens/Delivery/DeliveryHistoryDetailScreen';
import {DeliveryHistoryEarningsScreen} from '../screens/Delivery/DeliveryHistoryEarningsScreen';
import {OrderTimelineScreen} from '../screens/Delivery/OrderTimelineScreen';
import {FailedDeliveriesScreen} from '../screens/Delivery/FailedDeliveriesScreen';
import {EarningsDashboardScreen} from '../screens/Earnings/EarningsDashboardScreen';
import {TodaysEarningsScreen} from '../screens/Earnings/TodaysEarningsScreen';
import {DeliveryEarningsScreen} from '../screens/Earnings/DeliveryEarningsScreen';
import {EarningsBreakdownScreen} from '../screens/Earnings/EarningsBreakdownScreen';
import {WeeklyEarningsScreen} from '../screens/Earnings/WeeklyEarningsScreen';
import {MonthlyEarningsScreen} from '../screens/Earnings/MonthlyEarningsScreen';
import {PaymentHistoryScreen} from '../screens/Earnings/PaymentHistoryScreen';
import {IncentivesScreen} from '../screens/Earnings/IncentivesScreen';
import {IncentiveDetailScreen} from '../screens/Earnings/IncentiveDetailScreen';
import {IncentiveProgressScreen} from '../screens/Earnings/IncentiveProgressScreen';
import {IncentiveBonusEarnedScreen} from '../screens/Earnings/IncentiveBonusEarnedScreen';
import {BonusHistoryScreen} from '../screens/Earnings/BonusHistoryScreen';
import {IncentiveExpiredScreen} from '../screens/Earnings/IncentiveExpiredScreen';
import {PerformanceScreen} from '../screens/Performance/PerformanceScreen';
import {DeliveriesCompletedScreen} from '../screens/Performance/DeliveriesCompletedScreen';
import {AcceptanceRateScreen} from '../screens/Performance/AcceptanceRateScreen';
import {CompletionRateScreen} from '../screens/Performance/CompletionRateScreen';
import {CustomerRatingScreen} from '../screens/Performance/CustomerRatingScreen';
import {NotificationsScreen} from '../screens/Notifications/NotificationsScreen';
import {NotificationDetailScreen} from '../screens/Notifications/NotificationDetailScreen';
import {ProfileScreen} from '../screens/Profile/ProfileScreen';
import {ProfilePersonalInfoScreen} from '../screens/Profile/ProfilePersonalInfoScreen';
import {ProfilePhotoEditScreen} from '../screens/Profile/ProfilePhotoEditScreen';
import {ProfileAddressScreen} from '../screens/Profile/ProfileAddressScreen';
import {ProfileEmergencyContactScreen} from '../screens/Profile/ProfileEmergencyContactScreen';
import {VehicleHubScreen} from '../screens/Vehicle/VehicleHubScreen';
import {VehicleRegistrationScreen} from '../screens/Vehicle/VehicleRegistrationScreen';
import {VehicleRcDocumentScreen} from '../screens/Vehicle/VehicleRcDocumentScreen';
import {VehicleInsuranceScreen} from '../screens/Vehicle/VehicleInsuranceScreen';
import {DocumentsHubScreen} from '../screens/Documents/DocumentsHubScreen';
import {DocumentDetailScreen} from '../screens/Documents/DocumentDetailScreen';
import {DocumentPreviewScreen} from '../screens/Documents/DocumentPreviewScreen';
import {PaymentHubScreen} from '../screens/Payments/PaymentHubScreen';
import {PaymentBankAccountScreen} from '../screens/Payments/PaymentBankAccountScreen';
import {PaymentUpiDetailsScreen} from '../screens/Payments/PaymentUpiDetailsScreen';
import {SupportHubScreen} from '../screens/Support/SupportHubScreen';
import {SupportFaqScreen} from '../screens/Support/SupportFaqScreen';
import {SupportDeliveryIssuesScreen} from '../screens/Support/SupportDeliveryIssuesScreen';
import {SupportPaymentIssuesScreen} from '../screens/Support/SupportPaymentIssuesScreen';
import {SupportAccountIssuesScreen} from '../screens/Support/SupportAccountIssuesScreen';
import {SupportDocumentIssuesScreen} from '../screens/Support/SupportDocumentIssuesScreen';
import {SupportVehicleIssuesScreen} from '../screens/Support/SupportVehicleIssuesScreen';
import {SupportStoreIssuesScreen} from '../screens/Support/SupportStoreIssuesScreen';
import {SupportCustomerIssuesScreen} from '../screens/Support/SupportCustomerIssuesScreen';
import {SupportTechnicalIssuesScreen} from '../screens/Support/SupportTechnicalIssuesScreen';
import {SupportOtherIssuesScreen} from '../screens/Support/SupportOtherIssuesScreen';
import {AccountLogoutScreen} from '../screens/Account/AccountLogoutScreen';
import {AccountPrivacyScreen} from '../screens/Account/AccountPrivacyScreen';
import {AccountTermsScreen} from '../screens/Account/AccountTermsScreen';
import {AccountPrivacyPolicyScreen} from '../screens/Account/AccountPrivacyPolicyScreen';
import {AccountAboutScreen} from '../screens/Account/AccountAboutScreen';
import {EmergencySafetyHubScreen} from '../screens/Emergency/EmergencySafetyHubScreen';
import {EmergencyModeActiveScreen} from '../screens/Emergency/EmergencyModeActiveScreen';
import {EmergencyShareLocationScreen} from '../screens/Emergency/EmergencyShareLocationScreen';
import {EmergencySupportScreen} from '../screens/Emergency/EmergencySupportScreen';
import {EmergencyIncidentReportScreen} from '../screens/Emergency/EmergencyIncidentReportScreen';
import {EmergencyIncidentReportedScreen} from '../screens/Emergency/EmergencyIncidentReportedScreen';
import {EmergencyResolvedScreen} from '../screens/Emergency/EmergencyResolvedScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegistrationLanding" component={RegistrationLandingScreen} />
      <Stack.Screen name="EnterMobileNumber" component={EnterMobileNumberScreen} />
      <Stack.Screen name="VerifyRegistrationOtp" component={VerifyRegistrationOtpScreen} />
      <Stack.Screen name="IncorrectOtp" component={IncorrectOtpScreen} />
      <Stack.Screen name="ResendOtpMethod" component={ResendOtpMethodScreen} />
      <Stack.Screen name="AccountNotFound" component={AccountNotFoundScreen} />
      <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
      <Stack.Screen name="ProfilePhoto" component={ProfilePhotoScreen} />
      <Stack.Screen name="HomeAddress" component={HomeAddressScreen} />
      <Stack.Screen name="EmergencyContact" component={EmergencyContactScreen} />
      <Stack.Screen name="VehicleType" component={VehicleTypeScreen} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
      <Stack.Screen name="DrivingLicence" component={DrivingLicenceScreen} />
      <Stack.Screen name="RcDocument" component={RcDocumentScreen} />
      <Stack.Screen name="InsuranceDocument" component={InsuranceDocumentScreen} />
      <Stack.Screen name="PaymentDetails" component={PaymentDetailsScreen} />
      <Stack.Screen name="ReviewApplication" component={ReviewApplicationScreen} />
      <Stack.Screen name="SubmittingApplication" component={SubmittingApplicationScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="ApplicationSubmitted" component={ApplicationSubmittedScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="VerificationInProgress" component={VerificationInProgressScreen} />
      <Stack.Screen name="RiderApproved" component={RiderApprovedScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="VerificationRejected" component={VerificationRejectedScreen} />
      <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="EnableNotifications" component={EnableNotificationsScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="FirstTimeSetup" component={FirstTimeSetupScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="AccountRestricted" component={AccountRestrictedScreen} />
      <Stack.Screen name="Home" component={HomeScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="HomeActiveDelivery" component={HomeActiveDeliveryScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="NewOrderRequest" component={NewOrderRequestScreen} options={{gestureEnabled: false, animation: 'slide_from_bottom'}} />
      <Stack.Screen name="OrderRequestDetails" component={OrderRequestDetailsScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="RejectConfirmSheet" component={RejectConfirmSheetScreen} options={{presentation: 'transparentModal', animation: 'fade', headerShown: false}} />
      <Stack.Screen name="RejectReason" component={RejectReasonScreen} />
      <Stack.Screen name="OrderRejected" component={OrderRejectedScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="RequestTimedOut" component={RequestTimedOutScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="MultipleOrders" component={MultipleOrdersScreen} options={{gestureEnabled: false, animation: 'slide_from_bottom'}} />
      <Stack.Screen name="NoOrdersInZone" component={NoOrdersInZoneScreen} />
      <Stack.Screen name="AssignmentFailed" component={AssignmentFailedScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="AcceptingOrder" component={AcceptingOrderScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="OrderAccepted" component={OrderAcceptedScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="PickupDetails" component={PickupDetailsScreen} />
      <Stack.Screen name="NavigateToStore" component={NavigateToStoreScreen} />
      <Stack.Screen name="NavigationActive" component={NavigationActiveScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="ArrivingAtStore" component={ArrivingAtStoreScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="ConfirmingArrival" component={ConfirmingArrivalScreen} />
      <Stack.Screen name="ArrivedAtStore" component={ArrivedAtStoreScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="OrderReady" component={OrderReadyScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="OrderNotReady" component={OrderNotReadyScreen} />
      <Stack.Screen name="WaitingForOrder" component={WaitingForOrderScreen} />
      <Stack.Screen name="ReportStoreIssue" component={ReportStoreIssueScreen} />
      <Stack.Screen name="ContactStore" component={ContactStoreScreen} />
      <Stack.Screen name="VerifyPickup" component={VerifyPickupScreen} />
      <Stack.Screen name="OrderIdVerification" component={OrderIdVerificationScreen} />
      <Stack.Screen name="PackageDetails" component={PackageDetailsScreen} />
      <Stack.Screen name="CollectOrder" component={CollectOrderScreen} />
      <Stack.Screen name="PickupConfirmation" component={PickupConfirmationScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="OrderPickedUp" component={OrderPickedUpScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="PickupFailed" component={PickupFailedScreen} />
      <Stack.Screen name="PickupRetry" component={PickupRetryScreen} />
      <Stack.Screen name="PickupSupport" component={PickupSupportScreen} />
      <Stack.Screen name="CustomerDeliveryDetails" component={CustomerDeliveryDetailsScreen} />
      <Stack.Screen name="CustomerStartNavigation" component={CustomerStartNavigationScreen} />
      <Stack.Screen name="CustomerNavigationActive" component={CustomerNavigationActiveScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="NearCustomer" component={NearCustomerScreen} />
      <Stack.Screen name="ArrivedAtCustomer" component={ArrivedAtCustomerScreen} />
      <Stack.Screen name="CallCustomer" component={CallCustomerScreen} />
      <Stack.Screen name="MessageCustomer" component={MessageCustomerScreen} />
      <Stack.Screen name="DeliveryVerification" component={DeliveryVerificationScreen} />
      <Stack.Screen name="OtpEntry" component={OtpEntryScreen} />
      <Stack.Screen name="DeliveryOtpIncorrect" component={DeliveryOtpIncorrectScreen} />
      <Stack.Screen name="HandOverOrder" component={HandOverOrderScreen} />
      <Stack.Screen name="DeliverySuccess" component={DeliverySuccessScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="EarningsUpdated" component={EarningsUpdatedScreen} />
      <Stack.Screen name="CustomerUnavailable" component={CustomerUnavailableScreen} />
      <Stack.Screen name="CallingException" component={CallingExceptionScreen} />
      <Stack.Screen name="NoResponse" component={NoResponseScreen} />
      <Stack.Screen name="WaitingForCustomer" component={WaitingForCustomerScreen} />
      <Stack.Screen name="CustomerContacted" component={CustomerContactedScreen} />
      <Stack.Screen name="WrongAddress" component={WrongAddressScreen} />
      <Stack.Screen name="UpdateAddress" component={UpdateAddressScreen} />
      <Stack.Screen name="CannotLocateCustomer" component={CannotLocateCustomerScreen} />
      <Stack.Screen name="OrderCancelledByCustomer" component={OrderCancelledByCustomerScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="StoreIssueDelivery" component={StoreIssueDeliveryScreen} />
      <Stack.Screen name="WrongItemInOrder" component={WrongItemInOrderScreen} />
      <Stack.Screen name="PackageDamageDetected" component={PackageDamageDetectedScreen} />
      <Stack.Screen name="PackageIssue" component={PackageIssueScreen} />
      <Stack.Screen name="VehicleProblem" component={VehicleProblemScreen} />
      <Stack.Screen name="RoadBlockage" component={RoadBlockageScreen} />
      <Stack.Screen name="SafetyConcern" component={SafetyConcernScreen} />
      <Stack.Screen name="CannotComplete" component={CannotCompleteScreen} />
      <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
      <Stack.Screen name="SelectIssueReason" component={SelectIssueReasonScreen} />
      <Stack.Screen name="UploadEvidence" component={UploadEvidenceScreen} />
      <Stack.Screen name="IssueSupportContact" component={IssueSupportContactScreen} />
      <Stack.Screen name="IssueResolution" component={IssueResolutionScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="RetryDelivery" component={RetryDeliveryScreen} />
      <Stack.Screen name="ReturnOrder" component={ReturnOrderScreen} />
      <Stack.Screen name="DeliveryFailed" component={DeliveryFailedScreen} />
      <Stack.Screen name="DeliveryHistory" component={DeliveryHistoryScreen} />
      <Stack.Screen name="DeliveryHistoryDetail" component={DeliveryHistoryDetailScreen} />
      <Stack.Screen name="DeliveryHistoryEarnings" component={DeliveryHistoryEarningsScreen} />
      <Stack.Screen name="OrderTimeline" component={OrderTimelineScreen} />
      <Stack.Screen name="FailedDeliveries" component={FailedDeliveriesScreen} />
      <Stack.Screen name="EarningsDashboard" component={EarningsDashboardScreen} />
      <Stack.Screen name="TodaysEarnings" component={TodaysEarningsScreen} />
      <Stack.Screen name="DeliveryEarnings" component={DeliveryEarningsScreen} />
      <Stack.Screen name="EarningsBreakdown" component={EarningsBreakdownScreen} />
      <Stack.Screen name="WeeklyEarnings" component={WeeklyEarningsScreen} />
      <Stack.Screen name="MonthlyEarnings" component={MonthlyEarningsScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="Incentives" component={IncentivesScreen} />
      <Stack.Screen name="IncentiveDetail" component={IncentiveDetailScreen} />
      <Stack.Screen name="IncentiveProgress" component={IncentiveProgressScreen} />
      <Stack.Screen name="IncentiveBonusEarned" component={IncentiveBonusEarnedScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="BonusHistory" component={BonusHistoryScreen} />
      <Stack.Screen name="IncentiveExpired" component={IncentiveExpiredScreen} />
      <Stack.Screen name="Performance" component={PerformanceScreen} />
      <Stack.Screen name="DeliveriesCompleted" component={DeliveriesCompletedScreen} />
      <Stack.Screen name="AcceptanceRate" component={AcceptanceRateScreen} />
      <Stack.Screen name="CompletionRate" component={CompletionRateScreen} />
      <Stack.Screen name="CustomerRating" component={CustomerRatingScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ProfilePersonalInfo" component={ProfilePersonalInfoScreen} />
      <Stack.Screen name="ProfilePhotoEdit" component={ProfilePhotoEditScreen} />
      <Stack.Screen name="ProfileAddress" component={ProfileAddressScreen} />
      <Stack.Screen name="ProfileEmergencyContact" component={ProfileEmergencyContactScreen} />
      <Stack.Screen name="VehicleHub" component={VehicleHubScreen} />
      <Stack.Screen name="VehicleRegistration" component={VehicleRegistrationScreen} />
      <Stack.Screen name="VehicleRcDocument" component={VehicleRcDocumentScreen} />
      <Stack.Screen name="VehicleInsurance" component={VehicleInsuranceScreen} />
      <Stack.Screen name="DocumentsHub" component={DocumentsHubScreen} />
      <Stack.Screen name="DocumentDetail" component={DocumentDetailScreen} />
      <Stack.Screen name="DocumentPreview" component={DocumentPreviewScreen} />
      <Stack.Screen name="PaymentHub" component={PaymentHubScreen} />
      <Stack.Screen name="PaymentBankAccount" component={PaymentBankAccountScreen} />
      <Stack.Screen name="PaymentUpiDetails" component={PaymentUpiDetailsScreen} />
      <Stack.Screen name="SupportHub" component={SupportHubScreen} />
      <Stack.Screen name="SupportFaq" component={SupportFaqScreen} />
      <Stack.Screen name="SupportDeliveryIssues" component={SupportDeliveryIssuesScreen} />
      <Stack.Screen name="SupportPaymentIssues" component={SupportPaymentIssuesScreen} />
      <Stack.Screen name="SupportAccountIssues" component={SupportAccountIssuesScreen} />
      <Stack.Screen name="SupportDocumentIssues" component={SupportDocumentIssuesScreen} />
      <Stack.Screen name="SupportVehicleIssues" component={SupportVehicleIssuesScreen} />
      <Stack.Screen name="SupportStoreIssues" component={SupportStoreIssuesScreen} />
      <Stack.Screen name="SupportCustomerIssues" component={SupportCustomerIssuesScreen} />
      <Stack.Screen name="SupportTechnicalIssues" component={SupportTechnicalIssuesScreen} />
      <Stack.Screen name="SupportOtherIssues" component={SupportOtherIssuesScreen} />
      <Stack.Screen name="AccountLogout" component={AccountLogoutScreen} />
      <Stack.Screen name="AccountPrivacy" component={AccountPrivacyScreen} />
      <Stack.Screen name="AccountTerms" component={AccountTermsScreen} />
      <Stack.Screen name="AccountPrivacyPolicy" component={AccountPrivacyPolicyScreen} />
      <Stack.Screen name="AccountAbout" component={AccountAboutScreen} />
      <Stack.Screen name="EmergencySafetyHub" component={EmergencySafetyHubScreen} />
      <Stack.Screen name="EmergencyModeActive" component={EmergencyModeActiveScreen} options={{gestureEnabled: false}} />
      <Stack.Screen name="EmergencyShareLocation" component={EmergencyShareLocationScreen} />
      <Stack.Screen name="EmergencySupport" component={EmergencySupportScreen} />
      <Stack.Screen name="EmergencyIncidentReport" component={EmergencyIncidentReportScreen} />
      <Stack.Screen name="EmergencyIncidentReported" component={EmergencyIncidentReportedScreen} />
      <Stack.Screen name="EmergencyResolved" component={EmergencyResolvedScreen} />
    </Stack.Navigator>
  );
}
