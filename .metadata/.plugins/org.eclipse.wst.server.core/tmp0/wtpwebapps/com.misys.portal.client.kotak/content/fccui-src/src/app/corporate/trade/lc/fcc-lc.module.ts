import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';
import { DialogModule } from 'primeng/dialog'; //
import { CardModule } from 'primeng/card';  //
import { FileUploadModule } from 'primeng/fileupload'; //
import { MessageModule } from 'primeng/message';  //
import { MessagesModule } from 'primeng/messages'; //
import { MultiSelectModule } from 'primeng/multiselect'; //
import { TabViewModule } from 'primeng/tabview';  //
import { ProgressSpinnerModule } from 'primeng/progressspinner';  //
import { SelectButtonModule } from 'primeng/selectbutton';  //
import { TableModule } from 'primeng/table';  //
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StepperWrapperComponent } from '../../../common/components/stepper/stepper-wrapper/stepper-wrapper.component';
import { StepViewDirective } from '../../../common/directives/step-view.directive';
import { NarrativeCharacterCountComponent } from '../../common/components/narrative-character-count/narrative-character-count.component';
import { FccCommonTextAreaDirective } from '../../common/directives/fcc-common-text-area.directive';
import { LCTabSectionComponent } from './common/components/tab-section/tab-section.component';
import { FccLcRoutes } from './fcc-lc.routes';
import { AmountChargeDetailsComponent } from './initiation/component/amount-charge-details/amount-charge-details.component';
import { ApplicantBeneficiaryComponent } from './initiation/component/applicant-beneficiary/applicant-beneficiary.component';
import { ConfirmationDialogComponent } from './initiation/component/confirmation-dialog/confirmation-dialog.component';
import { ErrorPageComponent } from './initiation/component/error-page/error-page.component';
import { FccBankDetailsComponent } from './initiation/component/fcc-bank-details/fcc-bank-details.component';
import { FileUploadDetailsComponent } from './initiation/component/file-upload-details/file-upload-details.component';
import { FileUploadDialogComponent } from './initiation/component/file-upload-dialog/file-upload-dialog.component';
import { FormSubmitComponent } from './initiation/component/form-submit/form-submit.component';
import { GeneralDetailsComponent } from './initiation/component/general-details/general-details.component';
import { InstructionsToBankComponent } from './initiation/component/instructions-to-bank/instructions-to-bank.component';
import { LcProductComponent } from './initiation/component/lc-product/lc-product.component';
import { LcListingComponent } from './initiation/component/lc-return/lc-listing/lc-listing.component';
import { LcReturnSectionComponent } from './initiation/component/lc-return/lc-return-section/lc-return-section.component';
import { LcSummaryComponent } from './initiation/component/lc-return/lc-summary/lc-summary.component';
import { NarrativeDetailsComponent } from './initiation/component/narrative-details/narrative-details.component';
import { LicenseDetailsComponent } from './initiation/component/license-details/license-details.component';
import { PaymentDetailsComponent } from './initiation/component/payment-details/payment-details.component';
import { ShipmentdetailsComponent } from './initiation/component/shipment-details/shipmentdetails.component';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SummaryDetailsComponent } from './initiation/component/summary-details/summary-details.component';
import { SummaryComponent } from './initiation/component/summary/summary.component';
import { LCGlobalDynamicComponent } from './initiation/model/global-dynamic.component';
import { CustomCommasInCurrenciesPipe } from './initiation/pipes/custom-commas-in-currencies.pipe';
import { LcReturnService } from './initiation/services/lc-return.service';
import { UtilityService } from './initiation/services/utility.service';
import { AdviseThroughBankComponent } from './initiation/component/advise-through-bank/advise-through-bank.component';
import { AdvisingBankComponent } from './initiation/component/advising-bank/advising-bank.component';
import { IssuingBankComponent } from './initiation/component/issuing-bank/issuing-bank.component';
import { ConfirmationPartyComponent } from './initiation/component/confirmation-party/confirmation-party.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AdditionalInstructionsComponent } from './initiation/component/narrative-sub-sections/additional-instructions/additional-instructions.component';
import { DescriptionOfGoodsComponent } from './initiation/component/narrative-sub-sections/description-of-goods/description-of-goods.component';
import { DocumentsRequiredComponent } from './initiation/component/narrative-sub-sections/documents-required/documents-required.component';
import { GoodsAndDocumentsComponent } from './initiation/component/narrative-sub-sections/goods-and-documents/goods-and-documents.component';
import { OtherDetailsComponent } from './initiation/component/narrative-sub-sections/other-details/other-details.component';
import { PeriodForPresentationComponent } from './initiation/component/narrative-sub-sections/period-for-presentation/period-for-presentation.component';
import { SpecialPaymentForBeneficiaryComponent } from './initiation/component/narrative-sub-sections/special-payment-for-beneficiary/special-payment-for-beneficiary.component';
import { LcGeneralDetailsComponent } from './messagetobank/component/lc-general-details/lc-general-details.component';
import { CurrencyConverterPipe } from './initiation/pipes/currency-converter.pipe';
import { TimerModule } from './../../../common/widgets/components/timer/timer.module';
import { FormResolverModule } from './../../../shared/FCCform/form/form-resolver/form-resolver.module';
import { ConfirmationService } from 'primeng/api/';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatDialogModule } from '@angular/material/dialog';
import { AccordionModule } from 'primeng';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
    declarations: [
        ApplicantBeneficiaryComponent,
        NarrativeDetailsComponent,
        LCTabSectionComponent,
        GeneralDetailsComponent,
        AmountChargeDetailsComponent,
        InstructionsToBankComponent,
        SummaryComponent,
        LCGlobalDynamicComponent,
        InstructionsToBankComponent,
        NarrativeCharacterCountComponent,
        FccBankDetailsComponent,
        PaymentDetailsComponent,
        ShipmentdetailsComponent,
        CustomCommasInCurrenciesPipe,
        FormSubmitComponent,
        FileUploadDetailsComponent,
        FileUploadDialogComponent,
        LcListingComponent,
        LcSummaryComponent,
        LcReturnSectionComponent,
        ErrorPageComponent,
        FccCommonTextAreaDirective,
        ConfirmationDialogComponent,
        // StepperComponent,
        // StepperWrapperComponent,
        StepViewDirective,
        // FccStepperComponent,
        LcProductComponent,
        AdviseThroughBankComponent,
        AdvisingBankComponent,
        IssuingBankComponent,
        ConfirmationPartyComponent,
        AdditionalInstructionsComponent,
        DescriptionOfGoodsComponent,
        DocumentsRequiredComponent,
        GoodsAndDocumentsComponent,
        OtherDetailsComponent,
        PeriodForPresentationComponent,
        SpecialPaymentForBeneficiaryComponent,
        LcGeneralDetailsComponent,
        LicenseDetailsComponent,
        CurrencyConverterPipe
        
    ],
    imports: [
        CommonModule,
        FccLcRoutes,
        ReactiveFormsModule,
        FormsModule,
        MessagesModule,
        MessageModule,
        RecaptchaModule,
        MultiSelectModule,
        FileUploadModule,
        TableModule,
        TranslateModule,
        DialogModule,
        CardModule,
        TabViewModule,
        ProgressSpinnerModule,
        SelectButtonModule,
        MatTabsModule,
        TimerModule,
        FormResolverModule,
        MatDialogModule,
        AccordionModule,
        MatAutocompleteModule,
        AngularEditorModule,
        InputTextareaModule
    ],
    providers: [UtilityService, CustomCommasInCurrenciesPipe, LcReturnService, ConfirmationService, CurrencyConverterPipe],
    exports: [FccCommonTextAreaDirective, NarrativeCharacterCountComponent]
})
export class FccLcModule { }
