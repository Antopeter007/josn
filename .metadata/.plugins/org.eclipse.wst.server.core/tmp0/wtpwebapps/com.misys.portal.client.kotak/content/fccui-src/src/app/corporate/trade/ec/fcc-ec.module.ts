import { CommonModule } from '@angular/common';
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
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TabViewModule } from 'primeng/tabview';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StepsModule } from 'primeng/steps';
import { TableModule } from 'primeng/table';
import { UtilityService } from '../lc/initiation/services/utility.service';
import { MatTabsModule } from '@angular/material/tabs';
import { CustomCommasInCurrenciesPipe } from '../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { EcProductComponent } from './initiation/ec-product/ec-product.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FccLcModule } from '../lc/fcc-lc.module';
import { EcGeneralDetailsComponent } from './initiation/ec-general-details/ec-general-details.component';
import { DrawerDraweeComponent } from './initiation/drawer-drawee/drawer-drawee.component';
import { EcBankDetailsComponent } from './initiation/ec-bank-details/ec-bank-details.component';
import { EcPaymentDetailsComponent } from './initiation/ec-payment-details/ec-payment-details.component';
import { EcDocumentDetailsComponent } from './initiation/ec-document-details/ec-document-details.component';
import { EcShipmentDetailsComponent } from './initiation/ec-shipment-details/ec-shipment-details.component';
import { EcCollectionInstructionsComponent } from './initiation/ec-collection-instructions/ec-collection-instructions.component';
import { EcRemittingBankComponent } from './initiation/ec-remitting-bank/ec-remitting-bank.component';
import { EcPresentingBankComponent } from './initiation/ec-presenting-bank/ec-presenting-bank.component';
import { EcCollectingBankComponent } from './initiation/ec-collecting-bank/ec-collecting-bank.component';
import { EcMessageToBankGeneralDetailsComponent } from './messagetobank/component/ec-message-to-bank-general-details/ec-message-to-bank-general-details.component';
import { EcFileUploadDetailsComponent } from './messagetobank/component/ec-file-upload-details/ec-file-upload-details.component';
import { EcFileUploadDialogComponent } from './messagetobank/component/ec-file-upload-dialog/ec-file-upload-dialog.component';
import { ECDynamicComponent } from './model/ec-dynamic.component';
import { EcLicenseDetailsComponent } from './initiation/ec-license-details/ec-license-details.component';
import { EcDocumentDialogComponent } from './initiation/ec-document-dialog/ec-document-dialog.component';
import { AccordionModule } from 'primeng/accordion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormResolverModule } from './../../../shared/FCCform/form/form-resolver/form-resolver.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    declarations: [
        EcGeneralDetailsComponent,
        EcProductComponent,
        DrawerDraweeComponent,
        EcBankDetailsComponent,
        EcPaymentDetailsComponent,
        EcDocumentDetailsComponent,
        EcShipmentDetailsComponent,
        EcCollectionInstructionsComponent,
        EcRemittingBankComponent,
        EcPresentingBankComponent,
        EcCollectingBankComponent,
        EcMessageToBankGeneralDetailsComponent,
        EcFileUploadDetailsComponent,
        EcFileUploadDialogComponent,
        ECDynamicComponent,
        EcLicenseDetailsComponent,
        EcDocumentDialogComponent
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
export class FccECModule { }
