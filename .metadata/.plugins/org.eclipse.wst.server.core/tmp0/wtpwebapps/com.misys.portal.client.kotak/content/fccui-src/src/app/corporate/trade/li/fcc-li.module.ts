import { LiMtbFileUploadDialogComponent } from './MessageToBank/li-mtb-file-upload-dialog/li-mtb-file-upload-dialog.component';
import { LiMtbFileUploadDetailsComponent } from './MessageToBank/li-mtb-file-upload-details/li-mtb-file-upload-details.component';
import { LiMessageToBankGeneralDetailsComponent } from './MessageToBank/li-message-to-bank-general-details/li-message-to-bank-general-details.component';

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
import { CalendarModule } from 'primeng/calendar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
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
import { UtilityService } from '../lc/initiation/services/utility.service';
import { CustomCommasInCurrenciesPipe } from '../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { TableModule } from 'primeng/table';
import { LcReturnService } from '../lc/initiation/services/lc-return.service';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { RecaptchaModule } from 'ng-recaptcha';
import { FccLcRoutes } from '../lc/fcc-lc.routes';
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
import { FccLcModule } from '../lc/fcc-lc.module';
import { LiApplicantBeneficiaryComponent } from './initiation/li-applicant-beneficiary/li-applicant-beneficiary.component';
import { LiFileUploadDetailsComponent } from './initiation/li-file-upload-details/li-file-upload-details.component';
import { LiInstructionsToBankComponent } from './initiation/li-instructions-to-bank/li-instructions-to-bank.component';
import { LiIssuingBankAndAmountComponent } from './initiation/li-issuing-bank-and-amount/li-issuing-bank-and-amount.component';
import { LiFileUploadDialogComponent } from './initiation/li-file-upload-dialog/li-file-upload-dialog.component';
import { LiGeneralDetailsComponent } from './initiation/li-general-details/li-general-details.component';
import { LiProductComponent } from './li-product/li-product.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { FormResolverModule } from './../../../shared/FCCform/form/form-resolver/form-resolver.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    declarations: [
        LiProductComponent,
        LiGeneralDetailsComponent,
        LiApplicantBeneficiaryComponent,
        LiInstructionsToBankComponent,
        LiIssuingBankAndAmountComponent,
        LiFileUploadDetailsComponent,
        LiFileUploadDialogComponent,
        LiMtbFileUploadDialogComponent,
        LiMtbFileUploadDetailsComponent,
        LiMessageToBankGeneralDetailsComponent
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
        FccLcModule,
        FccLcRoutes,
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
        TranslateModule,
        DialogModule,
        ProgressSpinnerModule,
        MatProgressBarModule,
        AccordionModule,
        MatAutocompleteModule,
        FormResolverModule,
        AngularEditorModule
    ],
    providers: [UtilityService, CustomCommasInCurrenciesPipe, LcReturnService, ConfirmationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class FccLiModule { }

