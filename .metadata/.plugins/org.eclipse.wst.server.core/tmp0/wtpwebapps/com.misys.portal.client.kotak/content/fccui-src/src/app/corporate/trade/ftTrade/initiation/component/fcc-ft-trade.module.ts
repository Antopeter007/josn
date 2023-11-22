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
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FtTradeGeneralDetailsComponent } from './ft-trade-general-details/ft-trade-general-details.component';
import { FtTradeProductComponent } from './ft-trade-product/ft-trade-product.component';
import { FtTradeFileUploadDetailsComponent } from './ft-trade-file-upload-details/ft-trade-file-upload-details.component';
import { FtTradeUploadDialogComponent } from './ft-trade-upload-dialog/ft-trade-upload-dialog.component';
import { FccLcModule } from '../../../lc/fcc-lc.module';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FtTradeLicenseDetailsComponent } from './ft-trade-license-details/ft-trade-license-details.component';
import { AccordionModule } from 'primeng/accordion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormResolverModule } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
    declarations: [
        FtTradeGeneralDetailsComponent,
        FtTradeProductComponent,
        FtTradeFileUploadDetailsComponent,
        FtTradeUploadDialogComponent,
        FtTradeLicenseDetailsComponent
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
        MatAutocompleteModule,
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
        FormResolverModule,
        AngularEditorModule
    ],
    providers: [UtilityService, CustomCommasInCurrenciesPipe, ConfirmationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FccFTTradeModule { }
