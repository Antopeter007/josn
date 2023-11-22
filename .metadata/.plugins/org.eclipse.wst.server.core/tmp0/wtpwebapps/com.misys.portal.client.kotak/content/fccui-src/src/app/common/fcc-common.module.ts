import { FccTptModule } from '../corporate/cash/fund transfer/ft/tpt/fcc-tpt.module';
import { MatListModule } from '@angular/material/list';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PaymentsFileUploadDialogComponent } from './../corporate/cash/payments/bulk/payments-file-upload-dialog/payments-file-upload-dialog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BnNgIdleService } from 'bn-ng-idle';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { CookieModule } from 'ngx-cookie';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CaptchaModule } from 'primeng/captcha';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InplaceModule } from 'primeng/inplace';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SidebarModule } from 'primeng/sidebar';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { CarouselComponent } from '../base/components/carousel/carousel.component';
import { DivTableComponent } from '../common/widgets/components/div-table/div-table.component';
import { FccECModule } from '../corporate/trade/ec/fcc-ec.module';
import { FccElModule } from '../corporate/trade/el/fcc-el.module';
import { FccIcModule } from '../corporate/trade/ic/fcc-ic.module';
import { FccIrModule } from '../corporate/trade/ir/fcc-ir.module';
import {
  SummaryDetailsComponent,
} from '../corporate/trade/lc/initiation/component/summary-details/summary-details.component';
import { FccTfModule } from '../corporate/trade/tf/fcc-tf.module';
import { DropDownComponent } from './../base/components/drop-down/drop-down.component';
import { TableComponent } from './../base/components/table/table.component';
import { FccLnModule } from './../corporate/lending/ln/fcc-ln.module';
import { FccLcModule } from './../corporate/trade/lc/fcc-lc.module';
import { FccLiModule } from './../corporate/trade/li/fcc-li.module';
import { FccSgModule } from './../corporate/trade/sg/fcc-sg.module';
import { FccSiModule } from './../corporate/trade/si/fcc-si.module';
import { FccUiModule } from './../corporate/trade/ui/fcc-ui.module';
import { CommonFeaturesRoutes } from './common-features.routes';
import { AdditionalInfoTabComponent } from './components/additional-info-tab/additional-info-tab.component';
import { AdditionalInfoTableComponent } from './components/additional-info-table/additional-info-table.component';
import { AmendComparisonDialogComponent } from './components/amend-comparison-dialog/amend-comparison-dialog.component';
import { BackgroundImageComponent } from './components/background-image/background-image.component';
import { ChangePasswordDetailsComponent } from './components/change-password-details/change-password-details.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { DummyComponent } from './components/dummy/dummy.component';
import { DynamicButtonComponent } from './components/dynamic-button/dynamic-button.component';
import { ErrorsPageComponent } from './components/errors-page/errors-page.component';
import { FiltersectionComponent } from './components/filtersection/filtersection.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { GlobalDashboardComponent } from './components/global-dashboard/global-dashboard.component';
import { GlobalSearchComponent } from './components/global-search/global-search.component';
import { LandingpageComponent } from './components/landingpage/landingpage.component';
import { LcTemplateConfirmationComponent } from './components/lc-template-confirmation/lc-template-confirmation.component';
import { LoginAuthComponent } from './components/login-auth/login-auth.component';
import { LoginMfaComponent } from './components/login-mfa/login-mfa.component';
import { LoginComponent } from './components/login/login.component';
import { MasterViewDetailComponent } from './components/master-view-detail/master-view-detail.component';
import { PowerBIComponent } from './components/power-bi/power-bi.component';
import { ProductComponent } from './components/product-component/product.component';
import { ProductListingComponent } from './components/product-listing/product-listing.component';
import { ReAuthComponent } from './components/re-auth/re-auth.component';
import { ReauthComponent } from './components/reauth/reauth.component';
import { ReviewDetailTableComponent } from './components/review-detail-table/review-detail-table.component';
import { ReviewDetailComponent } from './components/review-detail/review-detail.component';
import { ReviewFormSubmitComponent } from './components/review-form-submit/review-form-submit.component';
import { ReviewHeaderComponent } from './components/review-header/review-header.component';
import { ReviewHistoryComponent } from './components/review-history/review-history.component';
import { ReviewInterestComponent } from './components/review-interest/review-interest.component';
import { ReviewRepaymentComponent } from './components/review-repay/review-repay.component';
import { ReviewScreenComponent } from './components/review-screen/review-screen.component';
import { ReviewSubmitButtonComponent } from './components/review-submit-button/review-submit-button.component';
import { ReviewSubmitDetailComponent } from './components/review-submit-detail/review-submit-detail.component';
import { ReviewSubmitTableComponent } from './components/review-submit-table/review-submit-table.component';
import { ReviewTabComponent } from './components/review-tab/review-tab.component';
import {
  ReviewTransactionDetailsComponent,
} from './components/review-transaction-details/review-transaction-details.component';
import { SearchLayoutComponent } from './components/search-layout/search-layout.component';
import { SessionWarningDialogComponent } from './components/session-warning-dialog/session-warning-dialog.component';
import { SetEntitySidenavComponent } from './components/set-entity-sidenav/set-entity-sidenav.component';
import { SetEntityComponent } from './components/set-entity/set-entity.component';
import { SetReferenceSidenavComponent } from './components/set-reference-sidenav/set-reference-sidenav.component';
import { SetReferenceComponent } from './components/set-reference/set-reference.component';
import { FccStepperComponent } from './components/stepper/fcc-stepper/fcc-stepper.component';
import { StepperWrapperComponent } from './components/stepper/stepper-wrapper/stepper-wrapper.component';
import { SupportComponent } from './components/support/support.component';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';
import { TaskListingComponent } from './components/task-listing/task-listing.component';
import {
  TermsAndConditionDetailsComponent,
} from './components/terms-and-condition-details/terms-and-condition-details.component';
import { TermsAndConditionComponent } from './components/terms-and-condition/terms-and-condition.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { TransactionsListdefComponent } from './components/transactions-listdef/transactions-listdef.component';
import { UxLogoutComponent } from './components/ux-logout/ux-logout.component';
import { ViewTaskDialogComponent } from './components/view-task-dialog/view-task-dialog.component';
import { ViewComponent } from './components/view/view.component';
import { FccGlobalConstant } from './core/fcc-global-constants';
import { OnFocusInputDirective } from './directives/on-focus-input.directive';
import { BlockPasteDirective } from './directives/block-paste.directive';
import { FccCommonRoutes } from './fcc-common.routes';
import { LendingProductsRoutes } from './lending-products.routes';
import { GlobalDynamicComponent } from './model/global-dynamic.component';
import { CustomSlicePipe } from './pipes/custom-slice.pipe';
import { CurrencyAbbreviationPipe } from './pipes/currency-abbreviation.pipe';
import { EscapeHtmlPipe } from './pipes/keep-html.pipe';
import { MaxlengthCurrenciesPipe } from './pipes/maxlength-currencies.pipe';
import { EncryptionService } from './services/encrypt.service';
import { EventEmitterService } from './services/event-emitter-service';
import { GlobalSearchService } from './services/globalsearch.service';
import { PhrasesService } from './services/phrases.service';
import { SpeechRecognitionService } from './services/speech-recognition.service';
import { VideoChatService } from './services/video-chat.services';
import { TradeProductsRoutes } from './trade-products.routes';
import { AccountBalanceComponent } from './widgets/components/account-balance/account-balance.component';
import { ActionRequiredComponent } from './widgets/components/action-required/action-required.component';
import {
  ApprovedTransactionsByBankComponent,
} from './widgets/components/approved-transactions-by-bank/approved-transactions-by-bank.component';
import {
  AvailableAmountExportComponent,
} from './widgets/components/available-amount-export/available-amount-export.component';
import {
  AvailableAmountImportComponent,
} from './widgets/components/available-amount-import/available-amount-import.component';
import { AwbTrackingComponent } from './widgets/components/awb-tracking/awb-tracking.component';
import { CalendarEventsComponent } from './widgets/components/calendar-events/calendar-events.component';
import { CurrencyConverterComponent } from './widgets/components/currency-converter/currency-converter.component';
import { DailyAuthLimitComponent } from './widgets/components/daily-auth-limit/daily-auth-limit.component';
import { ExchangeRateComponent } from './widgets/components/exchange-rate/exchange-rate.component';
import { FccMoreNewsComponent } from './widgets/components/fcc-more-news/fcc-more-news.component';
import { FccNewsLeftComponent } from './widgets/components/fcc-news-left/fcc-news-left.component';
import { FccNewsParentComponent } from './widgets/components/fcc-news-parent/fcc-news-parent.component';
import { FccNewsRightComponent } from './widgets/components/fcc-news-right/fcc-news-right.component';
import { FccNewsSubComponent } from './widgets/components/fcc-news-sub/fcc-news-sub.component';
import { FccNewsComponent } from './widgets/components/fcc-news/fcc-news.component';
import { GenericHtmlComponent } from './widgets/components/generic-html/generic-html-component';
import { IframeWidgetComponent } from './widgets/components/iframe-widget/iframe-widget.component';
import {
  IndividualAccountBalanceComponent,
} from './widgets/components/individual-account-balance/individual-account-balance.component';
import {
  ListdefChartCommonWidgetComponent,
} from './widgets/components/listdef-chart-common-widget/listdef-chart-common-widget.component';
import { ListdefCommonWidgetComponent } from './widgets/components/listdef-common-widget/listdef-common-widget.component';
import { LoanDealSummaryComponent } from './widgets/components/loan-deal-summary/loan-deal-summary.component';
import { LoansOutstandingComponent } from './widgets/components/loans-outstanding/loans-outstanding.component';
import { MiniStatementChildComponent } from './widgets/components/mini-statement-child/mini-statement-child.component';
import { MiniStatementComponent } from './widgets/components/mini-statement/mini-statement.component';
import { MiniStatmentTableComponent } from './widgets/components/mini-statment-table/mini-statment-table.component';
import { OtherBankAccountsComponent } from './widgets/components/other-bank-accounts/other-bank-accounts.component';
import { OutstandingBalanceComponent } from './widgets/components/outstanding-balance/outstanding-balance.component';
import { PendingApprovalComponent } from './widgets/components/pending-approval/pending-approval.component';
import {
  RejectedTransactionsByBankComponent,
} from './widgets/components/rejected-transactions-by-bank/rejected-transactions-by-bank.component';
import { ScriptWidgetComponent } from './widgets/components/script-widget/script-widget.component';
import { TabMenuComponent } from './widgets/components/tab-menu/tab-menu.component';
import {
  TransactionInProgressComponent,
} from './widgets/components/transaction-in-progress/transaction-in-progress.component';
import { ViewAllAccountsComponent } from './widgets/components/view-all-accounts/view-all-accounts.component';
import { ViewAllTransactionsComponent } from './widgets/components/view-all-transactions/view-all-transactions.component';
import { DivBannerComponent } from './components/div-banner/div-banner.component';
import { FccOngoingTaskComponent } from './widgets/components/fcc-ongoing-task/fcc-ongoing-task.component';
import { NudgesComponent } from './widgets/components/nudges/nudges.component';
import { LegalTextComponent } from './components/legal-text/legal-text.component';
import { InstructionInquiryComponent } from './components/instruction-inquiry/instruction-inquiry.component';
import { InstructionInquirySidenavComponent } from './components/instruction-inquiry-sidenav/instruction-inquiry-sidenav.component';
import { FormResolverModule } from '../shared/FCCform/form/form-resolver/form-resolver.module';
import { AccountBalanceSummaryComponent } from './widgets/components/account-balance-summary/account-balance-summary.component';
import { MatTabsModule } from '@angular/material/tabs';
import { InfoIconDetailsComponent } from './components/info-icon-details/info-icon-details.component';
import { TabPanelListingComponent } from './widgets/components/tab-panel-listing/tab-panel-listing.component';
import { MatMenuModule } from '@angular/material/menu';
import { WidgetStaticTextComponent } from './components/widget-static-text/widget-static-text.component';
import { PreferenceConfirmationComponent } from './components/preference-confirmation/preference-confirmation.component';
import { NewPhraseComponent } from './components/new-phrase/new-phrase.component';
import { IframeDeeplinkUrlComponent } from './components/iframe-deeplink-url/iframe-deeplink-url.component';
import { FilterChipPipe } from './pipes/filter-chip.pipe';
import { ListdefPopupComponent } from './components/listdef-popup/listdef-popup.component';
import { ShowDialogDirective } from './components/listdef-popup/show-dialog.directive';
import { PaymentsAndCollectionsComponent } from './widgets/components/payments-and-collections/payments-and-collections.component';
import { UserAuditComponent } from './components/user-audit/user-audit.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AccountSummaryGraphComponent } from './widgets/components/account-bal-summary-graph/account-summary-graph.component';
import { ChartsModule } from 'ng2-charts';
import { AmountMaskPipe } from './pipes/amount-mask.pipe';
import { GroupAccountsComponent } from './widgets/components/group-accounts/group-accounts.component';
import { EditDialogComponent } from './widgets/components/edit-dialog/edit-dialog.component';
import { SummaryComponent } from './widgets/components/summary/summary.component';

import { ProductFormHeaderComponent } from './components/product-form-header/product-form-header.component';
import { AmendComparisonViewComponent } from './components/amend-comparison-view/amend-comparison-view.component';
import { CommentSectionComponent } from './components/comment-section/comment-section.component';
import { FccSeCocqsModule } from '../corporate/cash/se/cheque services/stop cheque request/fcc-se-cocqs.module';
import { CashProductsRoutes } from './cash-products.routes';
import { FccTdCstdModule } from '../corporate/cash/td/initiation/fcc-td-cstd.module';
import { FccSeCqbkrModule } from '../corporate/cash/se/cheque services/cheque book request/fcc-se-cqbkr.module';
import { ValueAbbreviationCountPipe } from './pipes/value-abbreviation-count.pipe';
import { ViewChequestatusComponent } from './components/view-chequestatus/view-chequestatus.component';
import { DealOverviewComponent } from './widgets/components/deal-overview/deal-overview.component';
import { ViewChequeStatusListingComponent } from './components/view-cheque-status-listing/view-cheque-status-listing.component';
import { FccFtCashModule } from '../corporate/cash/ft/cash-fund-transfer/fcc-ft-cash.module';
import { FccLncdsModule } from '../corporate/lending/se/compliance-document/fcc-lncds.module';
import { SsoDeeplinkUrlComponent } from './components/sso-deeplink-url/sso-deeplink-url.component';
import { CommonProductComponent } from './components/common-product/common-product.component';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BeneFileUploadDialogComponent } from '../corporate/system-features/beneficiary-maintenance/bene-file-upload-dialog/bene-file-upload-dialog.component';
import { NewBankComponent } from './components/new-bank/new-bank.component';
import { ListdefModalComponent } from './components/listdef-modal/listdef-modal.component';
import { CustomReviewSubmitDetailComponent } from './components/custom-review-submit-detail/custom-review-submit-detail.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { MatFiltersectionComponent } from './components/filtersection/matfiltersection.component';
import { UpcomingPaymentsComponent } from './widgets/components/upcoming-payments/upcoming-payments.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CustomSortComponent } from './widgets/components/custom-sort/custom-sort.component';
import { CustomPaginatorComponent } from '../base/components/custom-paginator/custom-paginator.component';
import { ColumnCustomizationComponent } from './components/column-customization/column-customization.component';
import { FccFileViewerModule } from '../shared/FCCform/form-controls/modules/fcc-file-viewer/fcc-file-viewer.module';
import { TabsComponentComponent } from './components/tabs-component/tabs-component.component';
import { PaymentOverviewSummaryComponent } from './widgets/components/payment-overview-summary/payment-overview-summary.component';
import { PaymentTansactionPopupComponent } from './components/payment-tansaction-popup/payment-tansaction-popup.component';
import { FccGlobalConstantService } from './core/fcc-global-constant.service';
import { CommonService } from './services/common.service';
import { FccOverlayComponent } from './../base/components/fcc-overlay/fcc-overlay.component';
import { ReviewSubmitErrorTableComponent } from './components/review-submit-error-table/review-submit-error-table.component';
import { ListDefFormTableComponent } from './components/list-def-form-table/list-def-form-table.component';
import { NextButtonComponent } from './components/next-button/next-button.component';
import { FccNavigationComponent } from '../base/components/fcc-navigation/fcc-navigation.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { DownloadCenterComponent } from './components/download-center/download-center.component';
import { CourierTrackerComponent } from './components/courier-tracker/courier-tracker.component';
import { ExchangeRateDetailsComponent } from './components/exchange-rate-details/exchange-rate-details.component';
import { FccListBoxModule } from '../shared/FCCform/form-controls/modules/fcc-list-box/fcc-list-box.module';
import { EventsFilterPopupComponent } from './components/events-filter-popup/events-filter-popup.component';
import { SliderModule } from 'primeng/slider';
import { WidgetCardViewComponent } from './components/widget-card-view/widget-card-view.component';
import { RecentTradeTransactionsByBankComponent } from './widgets/components/recent-trade-transactions-by-bank/recent-trade-transactions-by-bank.component';
import { FccSeModule } from '../corporate/common-services/se/email/fcc-se.module';
import { FixTableHeaderDirective } from './directives/fixed-table-header.directive';
const contextPath = window[FccGlobalConstant.CONTEXT_PATH];
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, contextPath + '/content/FCCUI/assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        LoginComponent,
        ColumnCustomizationComponent,
        ForgotPasswordComponent,
        TransactionsListdefComponent,
        SupportComponent,
        LandingpageComponent,
        FccNewsComponent,
        FccMoreNewsComponent,
        FccNewsSubComponent,
        UxLogoutComponent,
        CurrencyConverterComponent,
        ExchangeRateComponent,
        ProductListingComponent,
        TabPanelListingComponent,
        AccountBalanceComponent,
        OnFocusInputDirective,
        BlockPasteDirective,
        ViewAllAccountsComponent,
        GlobalSearchComponent,
        OutstandingBalanceComponent,
        LoansOutstandingComponent,
        GlobalDynamicComponent,
        AvailableAmountImportComponent,
        AvailableAmountExportComponent,
        CalendarEventsComponent,
        IndividualAccountBalanceComponent,
        OtherBankAccountsComponent,
        PendingApprovalComponent,
        ViewAllTransactionsComponent,
        GlobalDashboardComponent,
        TopMenuComponent,
        TabMenuComponent,
        TransactionInProgressComponent,
        ActionRequiredComponent,
        AwbTrackingComponent,
        EscapeHtmlPipe,
        DropDownComponent,
        ChatbotComponent,
        CustomSlicePipe,
        AmountMaskPipe,
        CurrencyAbbreviationPipe,
        TransactionsListdefComponent,
        TermsAndConditionComponent,
        TermsAndConditionDetailsComponent,
        ReAuthComponent,
        FiltersectionComponent,
        MatFiltersectionComponent,
        ViewChequestatusComponent,
        PreferenceConfirmationComponent,
        TableComponent,
        SearchLayoutComponent,
        ChangePasswordComponent,
        GenericHtmlComponent,
        ChangePasswordDetailsComponent,
        BackgroundImageComponent,
        MaxlengthCurrenciesPipe,
        FccNewsParentComponent,
        FccNewsLeftComponent,
        FccNewsRightComponent,
        DailyAuthLimitComponent,
        MiniStatementComponent,
        MiniStatementChildComponent,
        LoginAuthComponent,
        LoginMfaComponent,
        RecentTradeTransactionsByBankComponent,
        ApprovedTransactionsByBankComponent,
        RejectedTransactionsByBankComponent,
        RecentTradeTransactionsByBankComponent,
        SessionWarningDialogComponent,
        MiniStatmentTableComponent,
        DivTableComponent,
        PowerBIComponent,
        ListdefCommonWidgetComponent,
        ErrorsPageComponent,
        DummyComponent,
        ReviewScreenComponent,
        ReviewHeaderComponent,
        ReviewTabComponent,
        ReviewDetailComponent,
        MasterViewDetailComponent,
        LcTemplateConfirmationComponent,
        DynamicButtonComponent,
        ReviewHistoryComponent,
        AdditionalInfoTabComponent,
        AdditionalInfoTableComponent,
        SummaryDetailsComponent,
        ProductComponent,
        CommonProductComponent,
        FccStepperComponent,
        ReviewTransactionDetailsComponent,
        StepperWrapperComponent,
        ReauthComponent,
        ViewComponent,
        ReviewSubmitDetailComponent,
        ReviewFormSubmitComponent,
        ReviewSubmitButtonComponent,
        ReviewSubmitTableComponent,
        AmendComparisonDialogComponent,
        ScriptWidgetComponent,
        IframeWidgetComponent,
        TaskDialogComponent,
        SetEntitySidenavComponent,
        SetReferenceSidenavComponent,
        TaskListingComponent,
        CarouselComponent,
        LoanDealSummaryComponent,
        ViewTaskDialogComponent,
        SetEntityComponent,
        SetReferenceComponent,
        ListdefChartCommonWidgetComponent,
        ReviewDetailTableComponent,
        ReviewRepaymentComponent,
        ReviewInterestComponent,
        DivBannerComponent,
        FccOngoingTaskComponent,
        NudgesComponent,
        LegalTextComponent,
        InstructionInquiryComponent,
        InstructionInquirySidenavComponent,
        AccountBalanceSummaryComponent,
        InfoIconDetailsComponent,
        TabPanelListingComponent,
        WidgetStaticTextComponent,
        NewPhraseComponent,
        NewBankComponent,
        IframeDeeplinkUrlComponent,
        FilterChipPipe,
        ListdefPopupComponent,
        ShowDialogDirective,
        PaymentsAndCollectionsComponent,
        UserAuditComponent,
        GroupAccountsComponent,
        EditDialogComponent,
        AccountSummaryGraphComponent,
        SummaryComponent,
        ProductFormHeaderComponent,
        AmendComparisonViewComponent,
        CommentSectionComponent,
        ValueAbbreviationCountPipe,
        DealOverviewComponent,
        ViewChequeStatusListingComponent,
        SsoDeeplinkUrlComponent,
        NewBankComponent,
        ListdefModalComponent,
        CustomReviewSubmitDetailComponent,
        FeedbackComponent,
        UpcomingPaymentsComponent,
        CustomSortComponent,
        CustomPaginatorComponent,
        TabsComponentComponent,
        PaymentOverviewSummaryComponent,
        PaymentTansactionPopupComponent,
        FccOverlayComponent,
        ReviewSubmitErrorTableComponent,
        ListDefFormTableComponent,
        NextButtonComponent,
        FccNavigationComponent,
        AccountDetailsComponent,
        DownloadCenterComponent,
        CourierTrackerComponent,
        ExchangeRateDetailsComponent,
        EventsFilterPopupComponent,
        WidgetCardViewComponent,
        RecentTradeTransactionsByBankComponent,
        FixTableHeaderDirective
    ],
    imports: [
        MatSlideToggleModule,
        MatRadioModule,
        MatIconModule,
        MatStepperModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCardModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatAutocompleteModule,
        MatSliderModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        MatExpansionModule,
        RecaptchaFormsModule,
        MatInputModule,
        MessageModule,
        SliderModule, // Prime ng slider to be replaced once upgraded to angular 15
        FccLcModule,
        FccElModule,
        FccIcModule,
        FccSgModule,
        FccSeModule,
        FccECModule,
        FccTfModule,
        FccIrModule,
        FccUiModule,
        FccSiModule,
        FccSeCocqsModule,
        FccSeCqbkrModule,
        FccFtCashModule,
        FccTdCstdModule,
        FccTptModule,
        ListboxModule,
        AutoCompleteModule,
        CommonModule,
        FormsModule,
        MenuModule,
        ReactiveFormsModule,
        SplitButtonModule,
        OverlayPanelModule,
        DropdownModule,
        DynamicDialogModule,
        MegaMenuModule,
        InputSwitchModule,
        MenubarModule,
        CalendarModule,
        CheckboxModule,
        InputTextModule,
        ButtonModule,
        MatDialogModule,
        FccCommonRoutes,
        CommonFeaturesRoutes,
        TradeProductsRoutes,
        LendingProductsRoutes,
        CashProductsRoutes,
        HttpClientModule,
        CardModule,
        ToastModule,
        ProgressSpinnerModule,
        CarouselModule,
        ToolbarModule,
        TooltipModule,
        TableModule,
        SlideMenuModule,
        SidebarModule,
        TabMenuModule,
        RatingModule,
        BreadcrumbModule,
        CaptchaModule,
        ChartModule,
        DragDropModule,
        MultiSelectModule,
        DialogModule,
        TabViewModule,
        InplaceModule,
        AccordionModule,
        FccLnModule,
        RecaptchaModule,
        SelectButtonModule,
        TranslateModule,
        CookieModule.forRoot(),
        FileUploadModule,
        MatSidenavModule,
        MatTreeModule,
        MatProgressBarModule,
        FccLiModule,
        FormResolverModule,
        MatTabsModule,
        MatMenuModule,
        AngularEditorModule,
        ChartsModule,
        FccLncdsModule,
        MatToolbarModule,
        MatListModule,
        MatDividerModule,
        FccFileViewerModule,
        FccListBoxModule
    ],
    providers: [
        BnNgIdleService,
        DatePipe,
        DecimalPipe,
        DialogService,
        GlobalSearchService,
        SpeechRecognitionService,
        MessageService,
        EscapeHtmlPipe,
        CustomSlicePipe,
        AmountMaskPipe,
        CurrencyAbbreviationPipe,
        MaxlengthCurrenciesPipe,
        EncryptionService,
        PhrasesService,
        EventEmitterService,
        VideoChatService,
        ValueAbbreviationCountPipe,
        FccGlobalConstantService,
        CommonService,
    ],
    exports: [
        BackgroundImageComponent,
        TranslateModule,
        ProductListingComponent,
        TabPanelListingComponent,
        InstructionInquirySidenavComponent,
        DivBannerComponent,
        TransactionsListdefComponent,
        CustomPaginatorComponent,
        ListDefFormTableComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FccCommonModule {}
