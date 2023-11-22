import { CustomCommasInCurrenciesPipe } from './../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiProductComponent } from './initiation/component/ui-product/ui-product.component';
import { UiGeneralDetailsComponent } from './initiation/component/ui-general-details/ui-general-details.component';
import { UiMTBGeneralDetailsComponent } from './messageotobank/component/ui-general-details/ui-mtb-general-details.component';
import { UiApplicantBeneficiaryComponent } from './initiation/component/ui-applicant-beneficiary/ui-applicant-beneficiary.component';
import { UiAdviseThroughBankComponent } from './initiation/component/ui-advise-through-bank/ui-advise-through-bank.component';
import { UiLocalAdviseThroughBankComponent } from './initiation/component/ui-local-advise-through-bank/ui-local-advise-through-bank.component';
import { UiAdvisingBankComponent } from './initiation/component/ui-advising-bank/ui-advising-bank.component';
import { UiIssuingBankComponent } from './initiation/component/ui-issuing-bank/ui-issuing-bank.component';
import { UiConfirmingBankComponent } from './initiation/component/ui-confirming-bank/ui-confirming-bank.component';
import { UiBankDetailsComponent } from './initiation/component/ui-bank-details/ui-bank-details.component';
import { UiTypeExpiryDetailsComponent } from './initiation/component/ui-type-expiry-details/ui-type-expiry-details.component';
import { UiAmountChargeDetailsComponent } from './initiation/component/ui-amount-charge-details/ui-amount-charge-details.component';
import { UiExtensionDetailsComponent } from './initiation/component/ui-extension-details/ui-extension-details.component';
import { UiIncreaseDecreaseComponent } from './initiation/component/ui-increase-decrease/ui-increase-decrease.component';
import { UiContractDetailsComponent } from './initiation/component/ui-contract-details/ui-contract-details.component';
import { UiTermsComponent } from './initiation/component/ui-terms/ui-terms.component';
import { UiInstructionsForBankComponent } from './initiation/component/ui-instructions-for-bank/ui-instructions-for-bank.component';
import { UiFileUploadDetailsComponent } from './initiation/component/ui-file-upload-details/ui-file-upload-details.component';
import { UiLicenseDetailsComponent } from './initiation/component/ui-license-details/ui-license-details.component';
import { UiShipmentDetailsComponent } from './initiation/component/ui-shipment-details/ui-shipment-details.component';
import { UiPaymentDetailsComponent } from './initiation/component/ui-payment-details/ui-payment-details.component';
import { UiNarrativeComponent } from './initiation/component/ui-narrative/ui-narrative.component';
import { FccUiRoutes } from './fcc-ui.routes';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { StepsModule } from 'primeng/steps';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { KeyFilterModule } from 'primeng/keyfilter';
import { TabViewModule } from 'primeng/tabview';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { FccLcModule } from '../lc/fcc-lc.module';
import { FccLcRoutes } from '../lc/fcc-lc.routes';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UtilityService } from '../lc/initiation/services/utility.service';
import { LcReturnService } from '../lc/initiation/services/lc-return.service';
import { UiIrregularIncreaseDecreaseDialogComponent } from './initiation/component/ui-irregular-increase-decrease-dialog/ui-irregular-increase-decrease-dialog';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FileUploadDialogComponent } from '../lc/initiation/component/file-upload-dialog/file-upload-dialog.component';
import { UiCuAmountChargeDetailsComponent } from './initiation/component/ui-cu-amount-charge-details/ui-cu-amount-charge-details.component';
import { UiCuBeneficiaryDetailsComponent } from './initiation/component/ui-cu-beneficiary-details/ui-cu-beneficiary-details.component';
import { UiCuExtensionDetailsComponent } from './initiation/component/ui-cu-extension-details/ui-cu-extension-details.component';
import { UiCuGeneralDetailsComponent } from './initiation/component/ui-cu-general-details/ui-cu-general-details.component';
import { UiCuIncreaseDecreaseComponent } from './initiation/component/ui-cu-increase-decrease/ui-cu-increase-decrease.component';
import { UiCuUndertakingDetailsComponent } from './initiation/component/ui-cu-undertaking-details/ui-cu-undertaking-details.component';
import { UiCuIrregularIncreaseDecreaseComponent } from './initiation/component/ui-cu-irregular-increase-decrease-dialog/ui-cu-irregular-increase-decrease-dialog';
import { UiCuPaymentDetailsComponent } from './initiation/component/ui-cu-payment-details/ui-cu-payment-details.component';
import { UiUndertakingDetailsComponent } from './initiation/component/ui-undertaking-details/ui-undertaking-details.component';
import { AccordionModule } from 'primeng/accordion';
import { UiCounterSectionDetailsComponent } from './initiation/component/ui-counter-section-details/ui-counter-section-details.component';
import { UiCuNarrativeComponent } from './initiation/component/ui-cu-narrative/ui-cu-narrative.components';
import { CurrencyConverterPipe } from './../lc/initiation/pipes/currency-converter.pipe';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormResolverModule } from './../../../shared/FCCform/form/form-resolver/form-resolver.module';
import { UiDynamicModule } from './model/ui-dynamic/ui-dynamic.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    declarations: [UiProductComponent,
        UiGeneralDetailsComponent,
        UiMTBGeneralDetailsComponent,
        UiApplicantBeneficiaryComponent,
        UiAdviseThroughBankComponent,
        UiAdvisingBankComponent,
        UiIssuingBankComponent,
        UiConfirmingBankComponent,
        UiBankDetailsComponent,
        UiUndertakingDetailsComponent,
        UiTypeExpiryDetailsComponent,
        UiAmountChargeDetailsComponent,
        UiExtensionDetailsComponent,
        UiIncreaseDecreaseComponent,
        UiContractDetailsComponent,
        UiTermsComponent,
        UiInstructionsForBankComponent,
        UiFileUploadDetailsComponent,
        UiLicenseDetailsComponent,
        UiShipmentDetailsComponent,
        UiPaymentDetailsComponent,
        UiIrregularIncreaseDecreaseDialogComponent,
        UiNarrativeComponent,
        UiCounterSectionDetailsComponent,
        UiCuGeneralDetailsComponent,
        UiCuBeneficiaryDetailsComponent,
        UiCuAmountChargeDetailsComponent,
        UiCuIncreaseDecreaseComponent,
        UiCuIrregularIncreaseDecreaseComponent,
        UiCuExtensionDetailsComponent,
        UiCuUndertakingDetailsComponent,
        UiCuPaymentDetailsComponent,
        UiCuNarrativeComponent,
        UiLocalAdviseThroughBankComponent,
    ],
    imports: [
        CommonModule,
        FccUiRoutes,
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
        MatCardModule,
        FileUploadModule,
        TableModule,
        // MatStepperModule,
        OverlayPanelModule,
        TranslateModule,
        DialogModule,
        ProgressSpinnerModule,
        // MatProgressBarModule
        MatExpansionModule,
        MatTooltipModule,
        MatTabsModule,
        MatDialogModule,
        FccLcModule,
        FccLcRoutes,
        MatProgressBarModule,
        AccordionModule,
        MatAutocompleteModule,
        FormResolverModule,
        UiDynamicModule,
        AngularEditorModule
    ],
    providers: [UtilityService, CustomCommasInCurrenciesPipe, LcReturnService, ConfirmationService, CurrencyConverterPipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FccUiModule { }
