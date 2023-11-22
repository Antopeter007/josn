import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ForgotPasswordComponent } from '../common/components/forgot-password/forgot-password.component';
import { GlobalDashboardComponent } from '../common/components/global-dashboard/global-dashboard.component';
import { LandingpageComponent } from '../common/components/landingpage/landingpage.component';
import { LoginComponent } from '../common/components/login/login.component';
import { ProductListingComponent } from '../common/components/product-listing/product-listing.component';
import { SupportComponent } from '../common/components/support/support.component';
import { UxLogoutComponent } from '../common/components/ux-logout/ux-logout.component';
import { AuthGuard } from '../common/guards/auth.guard';
import { FccMoreNewsComponent } from '../common/widgets/components/fcc-more-news/fcc-more-news.component';
import { FccNewsSubComponent } from '../common/widgets/components/fcc-news-sub/fcc-news-sub.component';
import { FccNewsComponent } from '../common/widgets/components/fcc-news/fcc-news.component';
import { ViewAllAccountsComponent } from '../common/widgets/components/view-all-accounts/view-all-accounts.component';
import {
  ViewAllTransactionsComponent,
} from '../common/widgets/components/view-all-transactions/view-all-transactions.component';
import { BillDetailsComponent } from '../corporate/lending/bl/bill-details/bill-details.component';
import { LCTabSectionComponent } from '../corporate/trade/lc/common/components/tab-section/tab-section.component';
import {
  AmountChargeDetailsComponent,
} from '../corporate/trade/lc/initiation/component/amount-charge-details/amount-charge-details.component';
import { ErrorPageComponent } from '../corporate/trade/lc/initiation/component/error-page/error-page.component';
import {
  FileUploadDetailsComponent,
} from '../corporate/trade/lc/initiation/component/file-upload-details/file-upload-details.component';
import {
  GeneralDetailsComponent,
} from '../corporate/trade/lc/initiation/component/general-details/general-details.component';
import {
  InstructionsToBankComponent,
} from '../corporate/trade/lc/initiation/component/instructions-to-bank/instructions-to-bank.component';
import {
  LcReturnSectionComponent,
} from '../corporate/trade/lc/initiation/component/lc-return/lc-return-section/lc-return-section.component';
import {
  LicenseDetailsComponent,
} from '../corporate/trade/lc/initiation/component/license-details/license-details.component';
import {
  NarrativeDetailsComponent,
} from '../corporate/trade/lc/initiation/component/narrative-details/narrative-details.component';
import {
  PaymentDetailsComponent,
} from '../corporate/trade/lc/initiation/component/payment-details/payment-details.component';
import {
  ShipmentdetailsComponent,
} from '../corporate/trade/lc/initiation/component/shipment-details/shipmentdetails.component';
import {
  SummaryDetailsComponent,
} from '../corporate/trade/lc/initiation/component/summary-details/summary-details.component';
import {
  ApplicantBeneficiaryComponent,
} from './../corporate/trade/lc/initiation/component/applicant-beneficiary/applicant-beneficiary.component';
import {
  FccBankDetailsComponent,
} from './../corporate/trade/lc/initiation/component/fcc-bank-details/fcc-bank-details.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DownloadCenterComponent } from './components/download-center/download-center.component';
import { DummyComponent } from './components/dummy/dummy.component';
import { ErrorsPageComponent } from './components/errors-page/errors-page.component';
import { IframeDeeplinkUrlComponent } from './components/iframe-deeplink-url/iframe-deeplink-url.component';
import { LoginMfaComponent } from './components/login-mfa/login-mfa.component';
import { PowerBIComponent } from './components/power-bi/power-bi.component';
import { ReviewFormSubmitComponent } from './components/review-form-submit/review-form-submit.component';
import { ReviewScreenComponent } from './components/review-screen/review-screen.component';
import { SsoDeeplinkUrlComponent } from './components/sso-deeplink-url/sso-deeplink-url.component';
import { TermsAndConditionComponent } from './components/terms-and-condition/terms-and-condition.component';
import { TransactionsListdefComponent } from './components/transactions-listdef/transactions-listdef.component';
import { ViewChequeStatusListingComponent } from './components/view-cheque-status-listing/view-cheque-status-listing.component';
import { ViewComponent } from './components/view/view.component';
import {
  ResponseMessageMasterComponent,
} from './retrievecredential/components/response-message-master/response-message-master.component';
import {
  RetrieveCredentialsMasterComponent,
} from './retrievecredential/components/retrieve-credentials-master/retrieve-credentials-master.component';
import { FccNewsParentComponent } from './widgets/components/fcc-news-parent/fcc-news-parent.component';
import { MiniStatementComponent } from './widgets/components/mini-statement/mini-statement.component';
import { TabPanelListingComponent } from './widgets/components/tab-panel-listing/tab-panel-listing.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/global',
    pathMatch: 'full',
    data: { title: 'listdataTitle' }
  },
  {
    path: 'listdata',
    component: TransactionsListdefComponent,
    canActivate: [AuthGuard],
    data: { title: 'listdataTitle' }
  },
  {
    path: 'terms-and-condition',
    component: TermsAndConditionComponent,
    data: { title: 'termsAndConditionTitle' }
  },
  {
    path: 'logout',
    component: UxLogoutComponent,
    data: { title: 'logoutTitle' }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: 'forgotPasswordTitle' }
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    data: { title: 'changePasswordTitle' }
  },
  {
    path: 'login-mfa',
    component: LoginMfaComponent,
    data: { title: 'loginMFATitle' }
  },
  {
    path: 'error',
    component: ErrorsPageComponent,
    data: { title: 'errorTitle' }
  },
  {
    path: 'support',
    component: SupportComponent,
    canActivate: [AuthGuard],
    data: { title: 'supportTitle' }
  },
  {
    path: 'landing',
    component: LandingpageComponent,
    canActivate: [AuthGuard],
    data: { title: 'landingTitle' }
  },
  {
    path: 'news',
    component: FccNewsComponent,
    canActivate: [AuthGuard],
    data: { title: 'newsTitle' }
  },
  {
    path: 'fullNews',
    component: FccNewsSubComponent,
    canActivate: [AuthGuard],
    data: { title: 'fullNewsTitle' }
  },
  {
    path: 'moreNews',
    component: FccMoreNewsComponent,
    canActivate: [AuthGuard],
    data: { title: 'moreNewsTitle' }
  },
  {
    path: 'productListing',
    component: ProductListingComponent,
    canActivate: [AuthGuard],
    data: { title: 'productListTitle' }
  },
  {
    path: 'tabPanelListing',
    component: TabPanelListingComponent,
    canActivate: [AuthGuard],
    data: { title: 'tabPanelListTitle' }
  },
  {
    path: 'statusListing',
    component: ViewChequeStatusListingComponent,
    canActivate: [AuthGuard],
    data: { title: 'statusListing' }
  },
  {
    path: 'all-accounts',
    component: ViewAllAccountsComponent,
    canActivate: [AuthGuard],
    data: { title: 'allAccountsTitle' }
  },
  {
    path: 'dashboard/:name',
    component: GlobalDashboardComponent,
    canActivate: [AuthGuard],
    data: { title: 'dashboardTitle' }
    // children: [
    //   {
    //     path: '**',
    //     redirectTo: '/dashboard/global'
    //   }
    // ]
  },
  {
    path: 'all-transactions',
    component: ViewAllTransactionsComponent,
    canActivate: [AuthGuard],
    data: { title: 'allTransactionsTitle' }
  },
  {
    path: 'data-visualization/:productKey',
    component: PowerBIComponent,
    canActivate: [AuthGuard],
    data: { title: 'dataVisualizationTitle' }
  },
  {
    path: 'createTemplate', component: LCTabSectionComponent, children: [
      { path: 'generalDetails', component: GeneralDetailsComponent, data: { title: 'generalDetailsTitle' } },
      { path: 'applicationBeneficiaryDetails', component: ApplicantBeneficiaryComponent,
      data: { title: 'ApplicantBeneficiaryComponentTitle' } },
      { path: 'bankDetails', component: FccBankDetailsComponent, data: { title: 'FccBankDetailsComponentTitle' } },
      { path: 'amountChargeDetails', component: AmountChargeDetailsComponent, data: { title: 'AmountChargeDetailsComponentTitle' } },
      { path: 'narrativeDetails', component: NarrativeDetailsComponent, data: { title: 'NarrativeDetailsComponentTitle' } },
      { path: 'licenseDetails', component: LicenseDetailsComponent, data : { title: 'LicenseDetailsComponentTitle' } },
      { path: 'instructionsToBank', component: InstructionsToBankComponent, data: { title: 'InstructionsToBankComponentTitle' } },
      { path: 'shipmentDetails', component: ShipmentdetailsComponent, data: { title: 'ShipmentdetailsComponentTitle' } },
      { path: 'paymentDetails', component : PaymentDetailsComponent, data: { title: 'PaymentDetailsComponentTitle' } },
      { path: 'summaryDetails', component: SummaryDetailsComponent, data: { title: 'SummaryDetailsComponentTitle' } },
      { path: 'fileUploadDetails', component : FileUploadDetailsComponent, data: { title: 'FileUploadDetailsComponentTitle' } }
    ],
    canActivate: [AuthGuard]
  },
  {
    path: 'newnews', component: FccNewsParentComponent,
    canActivate: [AuthGuard],
    data: { title: 'newNewsTitle' }
  },
  {
    path: 'lcreturn/:id/:systemId',
    component: LcReturnSectionComponent,
    canActivate: [AuthGuard],
    data: { title: 'lcReturnTitle' }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'loginTitle' }
  },
  {
    path: 'iframe',
    component: IframeDeeplinkUrlComponent,
    data: { title: 'iframe' }
  },
  {
    path: 'sso-deeplink-url',
    component: SsoDeeplinkUrlComponent,
    data: { title: 'sso-deeplink-url' }
  },
  {
    path: 'retrieve',
    component: RetrieveCredentialsMasterComponent,
    data: { title: 'retrieve' }
  },
  {
    path: 'submitResponse',
    component: ResponseMessageMasterComponent,
    data: { title: 'submitresponse' }
  },
  { path: 'submit',
  component: ReviewFormSubmitComponent,
  canActivate: [AuthGuard]
  },
  { path: 'errorPage',
  component: ErrorPageComponent,
  canActivate: [AuthGuard],
  data: { title: 'errorPageTitle' }
  },
  { path: 'miniStatement',
  component: MiniStatementComponent,
  canActivate: [AuthGuard],
  data: { title: 'miniStatementTitle' }
  },
  { path: 'reviewScreen',
  component: ReviewScreenComponent,
  canActivate: [AuthGuard],
  data: { title: 'reviewScreen' }
  },
  { path: 'view',
  component: ViewComponent,
  data: { title: 'view' }
  },
  {
    path: 'billView',
    component: BillDetailsComponent,
    data: { title: 'billView' }
  },
  { path: 'dummy',
  component: DummyComponent,
  canActivate: [AuthGuard],
  },
  {
    path: 'accountDetails',
    component: AccountDetailsComponent,
    canActivate: [AuthGuard],
    data: { title: 'accountDetails' }
  },
  {
    path: 'downloadCenter',
    component: DownloadCenterComponent,
    canActivate: [AuthGuard],
    data: { title: 'accountDetails' }
  },
  // this path alway be in bottom level otherwise routing not happen
  {
    path: '**',
    redirectTo: '/dashboard/global',
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommonFeaturesRoutes { }
