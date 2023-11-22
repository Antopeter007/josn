import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { StepsModule } from 'primeng/steps';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
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
import { UtilityService } from './../../trade/lc/initiation/services/utility.service';
import { CustomCommasInCurrenciesPipe } from './../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { RecaptchaModule } from 'ng-recaptcha';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LcReturnService } from '../lc/initiation/services/lc-return.service';
import { FccLcModule } from '../lc/fcc-lc.module';
import { FccLcRoutes } from '../lc/fcc-lc.routes';
import { TfGeneralDetailsComponent } from './initiation/tf-general-details/tf-general-details.component';
import { TfProductComponent } from './initiation/tf-product/tf-product/tf-product.component';
import { TfApplicantFinancingBankComponent } from './initiation/tf-applicant-financing-bank/tf-applicant-financing-bank.component';
import { TfAmountDetailsComponent } from './initiation/tf-amount-details/tf-amount-details.component';
import { TfInstructionsToBankComponent } from './initiation/tf-instructions-to-bank/tf-instructions-to-bank.component';
import { TfAttachmentDetailsComponent } from './initiation/tf-attachment-details/tf-attachment-details.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { TfMessageToBankGeneralDetailsComponent } from './messageToBank/tf-message-to-bank-general-details.component/tf-message-to-bank-general-details.component';
import { TfFileUploadDetailsComponent } from './messageToBank/tf-file-upload-details/tf-file-upload-details.component';
import { TfFileUploadDialogComponent } from './messageToBank/tf-file-upload-dialog/tf-file-upload-dialog.component';
import { TfRepaymentGeneralDetailsComponent } from './messageToBank/tf-repayment-general-details/tf-repayment-general-details.component';
import { TfLicenseDetailsComponent } from './tf-license-details/tf-license-details.component';
import { TfRepaymentAttachmentDetailsComponent } from './messageToBank/tf-repayment-attachment-details/tf-repayment-attachment-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TfWarningComponent } from './initiation/tf-warning/tf-warning.component';
import { FormResolverModule } from './../../../shared/FCCform/form/form-resolver/form-resolver.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    declarations: [
        TfGeneralDetailsComponent,
        TfProductComponent,
        TfApplicantFinancingBankComponent,
        TfAmountDetailsComponent,
        TfInstructionsToBankComponent,
        TfAttachmentDetailsComponent,
        TfMessageToBankGeneralDetailsComponent,
        TfFileUploadDetailsComponent,
        TfFileUploadDialogComponent,
        TfRepaymentGeneralDetailsComponent,
        TfLicenseDetailsComponent,
        TfRepaymentAttachmentDetailsComponent,
        TfWarningComponent
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
        MatCardModule,
        FileUploadModule,
        TableModule,
        OverlayPanelModule,
        FccLcModule,
        FccLcRoutes,
        TranslateModule,
        DialogModule,
        ProgressSpinnerModule,
        MatProgressBarModule,
        MatTabsModule,
        MatDialogModule,
        AccordionModule,
        MatAutocompleteModule,
        FormResolverModule,
        AngularEditorModule
    ],
    providers: [UtilityService, CustomCommasInCurrenciesPipe, LcReturnService, ConfirmationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FccTfModule { }
