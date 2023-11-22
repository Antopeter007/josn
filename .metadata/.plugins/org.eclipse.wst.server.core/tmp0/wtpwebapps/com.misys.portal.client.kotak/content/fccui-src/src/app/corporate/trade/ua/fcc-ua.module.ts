import { UaTermsComponent } from './components/ua-terms/ua-terms.component';
import { UaExtensionDetailsComponent } from './components/ua-extension-details/ua-extension-details.component';
import { UaAmountChargeDetailsComponent } from './components/ua-amount-charge-details/ua-amount-charge-details.component';
import { CustomCommasInCurrenciesPipe } from './../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import {
  CalendarModule,
  CardModule,
  CheckboxModule,
  ConfirmationService,
  FileUploadModule,
  InputSwitchModule,
  KeyFilterModule,
  MessageModule,
  MessagesModule,
  MultiSelectModule,
  OrganizationChartModule,
  RadioButtonModule,
  TabViewModule
} from 'primeng';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UtilityService } from '../lc/initiation/services/utility.service';
import { LcReturnService } from '../lc/initiation/services/lc-return.service';


import { FccLcModule } from '../lc/fcc-lc.module';
import { FccLcRoutes } from '../lc/fcc-lc.routes';
import { UaFileUploadDailogComponent } from './components/ua-file-upload-dailog/ua-file-upload-dailog.component';
import { UaFileUploadDetailsComponent } from './components/ua-file-upload-details/ua-file-upload-details.component';
import { UaGeneralDetailsComponent } from './components/ua-general-details/ua-general-details.component';
import { UaProductComponent } from './components/ua-product/ua-product.component';
import { UaContractDetailsComponent } from './components/ua-contract-details/ua-contract-details.component';
import { UaShipmentDetailsComponent } from './components/ua-shipment-details/ua-shipment-details.component';
import { UaUndertakingDetailsComponent } from './components/ua-undertaking-details/ua-undertaking-details.component';
import { AccordionModule } from 'primeng/accordion';
import { UaLicenseDetailsComponent } from './components/ua-license-details/ua-license-details.component';
import { UaApplicantBeneficiaryComponent } from './components/ua-applicant-beneficiary/ua-applicant-beneficiary.component';
import { UaBankDetailsComponent } from './components/ua-bank-details/ua-bank-details.component';
import { UaIncreaseDecreaseComponent } from './components/ua-increase-decrease/ua-increase-decrease.component';
import { UaNarrativeComponent } from './components/ua-narrative/ua-narrative.component';
import { UaPaymentDetailsComponent } from './components/ua-payment-details/ua-payment-details.component';
import { UaTypeExpiryDetailsComponent } from './components/ua-type-expiry-details/ua-type-expiry-details.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormResolverModule } from './../../../shared/FCCform/form/form-resolver/form-resolver.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    declarations: [
        UaGeneralDetailsComponent,
        UaProductComponent,
        UaFileUploadDetailsComponent,
        UaFileUploadDailogComponent,
        UaContractDetailsComponent,
        UaShipmentDetailsComponent,
        UaAmountChargeDetailsComponent,
        UaUndertakingDetailsComponent,
        UaExtensionDetailsComponent,
        UaLicenseDetailsComponent,
        UaApplicantBeneficiaryComponent,
        UaIncreaseDecreaseComponent,
        UaBankDetailsComponent,
        UaTypeExpiryDetailsComponent,
        UaPaymentDetailsComponent,
        UaNarrativeComponent,
        UaTermsComponent
    ],
    imports: [
        CommonModule,
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
        AngularEditorModule
    ],
    providers: [UtilityService, CustomCommasInCurrenciesPipe, LcReturnService, ConfirmationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FccUaModule { }
