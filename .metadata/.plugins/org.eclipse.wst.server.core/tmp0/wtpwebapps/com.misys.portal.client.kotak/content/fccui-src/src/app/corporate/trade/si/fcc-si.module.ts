import { CommonModule } from '@angular/common';
import { CustomCommasInCurrenciesPipe } from './../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabViewModule } from 'primeng/tabview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UtilityService } from '../lc/initiation/services/utility.service';
import { SiProductComponent } from './initiation/component/si-product/si-product.component';
import { SiMessageToBankGeneralDetailsComponent } from './messagetobank/component/si-message-to-bank-general-details/si-message-to-bank-general-details.component';
import { FccLcModule } from '../lc/fcc-lc.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SiFileUploadDetailsComponent } from './initiation/component/si-file-upload-details/si-file-upload-details.component';
import { SiFileUploadDialogComponent } from './initiation/component/si-file-upload-dialog/si-file-upload-dialog.component';
import { SiGeneralDetailsComponent } from './initiation/component/si-general-details/si-general-details.component';
import { SiApplicantBeneficiaryDetailsComponent } from './initiation/component/si-applicant-beneficiary-details/si-applicant-beneficiary-details.component';
import { SiAmountChargeDetailsComponent } from './initiation/component/si-amount-charge-details/si-amount-charge-details.component';
import { SiPaymentDetailsComponent } from './initiation/component/si-payment-details/si-payment-details.component';
import { SiShipmentDetailsComponent } from './initiation/component/si-shipment-details/si-shipment-details.component';
import { SiRenewalDetailsComponent } from './initiation/component/si-renewal-details/si-renewal-details.component';
import { SiInstructionsToBankDetailsComponent } from './initiation/component/si-instructions-to-bank-details/si-instructions-to-bank-details.component';
import { SiBankDetailsComponent } from './initiation/component/si-bank-details/si-bank-details.component';
import { SiIssuingBankComponent } from './initiation/component/si-issuing-bank/si-issuing-bank.component';
import { SiAdviseThroughBankComponent } from './initiation/component/si-advise-through-bank/si-advise-through-bank.component';
import { SiAdvisingBankComponent } from './initiation/component/si-advising-bank/si-advising-bank.component';
import { SiConfirmationPartyComponent } from './initiation/component/si-confirmation-party/si-confirmation-party.component';
import { SIDynamicComponent } from './model/si-dynamic.component';
import { SiGoodsAndDocumentsComponent } from './initiation/component/si-goods-and-documents/si-goods-and-documents.component';
import { SiOtherDetailsComponent } from './initiation/component/si-other-details/si-other-details.component';
import { SiDescriptionOfGoodsComponent } from './initiation/component/si-description-of-goods/si-description-of-goods.component';
import { SiDocumentsRequiredComponent } from './initiation/component/si-documents-required/si-documents-required.component';
import { SiAdditionalInstructionsComponent } from './initiation/component/si-additional-instructions/si-additional-instructions.component';
import { SiNarrativeDetailsComponent } from './initiation/component/si-narrative-details/si-narrative-details.component';
import { SiSpecialPaymentForBeneficiaryComponent } from './initiation/component/si-special-payment-for-beneficiary/si-special-payment-for-beneficiary.component';
import { SiPeriodOfPresentationComponent } from './initiation/component/si-period-of-presentation/si-period-of-presentation.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { SiAmendReleaseGeneralDetailsComponent } from './amendrelease/component/si-amend-release-general-details/si-amend-release-general-details.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormResolverModule } from './../../../shared/FCCform/form/form-resolver/form-resolver.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    declarations: [
        SiProductComponent,
        SiMessageToBankGeneralDetailsComponent,
        SiFileUploadDetailsComponent,
        SiFileUploadDialogComponent,
        SiGeneralDetailsComponent,
        SiApplicantBeneficiaryDetailsComponent,
        SiAmountChargeDetailsComponent,
        SiPaymentDetailsComponent,
        SiShipmentDetailsComponent,
        SiRenewalDetailsComponent,
        SiInstructionsToBankDetailsComponent,
        SiBankDetailsComponent,
        SiIssuingBankComponent,
        SiAdviseThroughBankComponent,
        SiAdvisingBankComponent,
        SiConfirmationPartyComponent,
        SIDynamicComponent,
        SiGoodsAndDocumentsComponent,
        SiOtherDetailsComponent,
        SiDescriptionOfGoodsComponent,
        SiDocumentsRequiredComponent,
        SiAdditionalInstructionsComponent,
        SiNarrativeDetailsComponent,
        SiSpecialPaymentForBeneficiaryComponent,
        SiPeriodOfPresentationComponent,
        SiAmendReleaseGeneralDetailsComponent
    ],
    imports: [
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatCheckboxModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        CommonModule,
        MatExpansionModule,
        MatTooltipModule,
        ReactiveFormsModule,
        FormsModule,
        MessagesModule,
        MessageModule,
        CalendarModule,
        RecaptchaModule,
        RadioButtonModule,
        ButtonModule,
        CheckboxModule,
        DropdownModule,
        MultiSelectModule,
        KeyFilterModule,
        InputTextModule,
        TabViewModule,
        InputTextareaModule,
        SelectButtonModule,
        ProgressBarModule,
        OrganizationChartModule,
        StepsModule,
        InputSwitchModule,
        CardModule,
        FileUploadModule,
        TableModule,
        OverlayPanelModule,
        FccLcModule,
        MatCardModule,
        MatTabsModule,
        TranslateModule,
        DialogModule,
        ProgressSpinnerModule,
        MatProgressBarModule,
        AccordionModule,
        MatAutocompleteModule,
        FormResolverModule,
        AngularEditorModule
    ],
    providers: [UtilityService, CustomCommasInCurrenciesPipe, ConfirmationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FccSiModule { }
