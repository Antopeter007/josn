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
import { UtilityService } from './../../trade/lc/initiation/services/utility.service';
import { CustomCommasInCurrenciesPipe } from './../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { TableModule } from 'primeng/table';
import { LcReturnService } from './../../trade/lc/initiation/services/lc-return.service';
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
import { ElProductComponent } from './el-product/el-product.component';
import { AssignmentConditionsComponent } from './assign/assignment-conditions/assignment-conditions.component';
import { FccLcModule } from '../lc/fcc-lc.module';
import { ElFileUploadDetailsComponent } from './assign/el-file-upload-details/el-file-upload-details.component';
import { ElFileUploadDailogComponent } from './assign/el-file-upload-dailog/el-file-upload-dailog.component';
import { TransferConditionsComponent } from './transfer/transfer-conditions/transfer-conditions.component';
import { ElGeneralDetailsComponent } from './el-general-details/el-general-details.component';
import { ShipmentNarrativeComponent } from './transfer/shipment-narrative/shipment-narrative.component';
import { ElLicenseDetailsComponent } from './el-license-details/el-license-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormResolverModule } from './../../../shared/FCCform/form/form-resolver/form-resolver.module';
import { ElRlGeneralDetailsComponent } from './remittance/el-rl-general-details/el-rl-general-details.component';
import { ElRlInstructionsComponent } from './remittance/el-rl-instructions/el-rl-instructions.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ElMT700GeneralDetailsComponent } from './InitiateMT700Upload/el-mt700-general-details/el-mt700-general-details.component';
import { ElMT700UploadDetailsComponent } from './InitiateMT700Upload/el-mt700-upload-details/el-mt700-upload-details.component';

@NgModule({
    declarations: [
        AssignmentConditionsComponent,
        ElProductComponent,
        ElFileUploadDetailsComponent,
        ElFileUploadDailogComponent,
        TransferConditionsComponent,
        ElGeneralDetailsComponent,
        ShipmentNarrativeComponent,
        ElLicenseDetailsComponent,
        ElRlGeneralDetailsComponent,
        ElRlInstructionsComponent,
        ElMT700GeneralDetailsComponent,
        ElMT700UploadDetailsComponent
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
export class FccElModule { }
