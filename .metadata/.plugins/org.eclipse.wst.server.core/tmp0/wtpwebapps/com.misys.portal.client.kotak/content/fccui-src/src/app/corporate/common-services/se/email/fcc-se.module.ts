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
import { UtilityService } from '../../../trade/lc/initiation/services/utility.service';
import { TableModule } from 'primeng/table';
import { LcReturnService } from '../../../trade/lc/initiation/services/lc-return.service';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { RecaptchaModule } from 'ng-recaptcha';
import { FccLcRoutes } from '../../../trade/lc/fcc-lc.routes';

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
import { SeProductComponent } from './initiation/se-product/se-product.component';
import { FccLcModule } from '../../../trade/lc/fcc-lc.module';
import { SeGeneralDetailsComponent } from './initiation/se-general-details/se-general-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccordionModule } from 'primeng/accordion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { FormResolverModule } from '../../../../shared/FCCform/form/form-resolver/form-resolver.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SeFileUploadDialogComponent } from './initiation/se-file-upload-dialog/se-file-upload-dialog.component';
import { SeFileUploadDetailsComponent } from './initiation/se-file-upload-details/se-file-upload-details.component';
import { SeHelpdeskProductComponent } from '../helpdesk/initiation/se-helpdesk-product/se-helpdesk-product.component';
import { SeHelpdeskGeneralDetailsComponent } from '../helpdesk/initiation/se-helpdesk-general-details/se-helpdesk-general-details.component';
import { SeHelpdeskFileUploadDialogComponent } from '../helpdesk/initiation/se-helpdesk-file-upload-dialog/se-helpdesk-file-upload-dialog.component';
import { SeHelpdeskFileUploadDetailsComponent } from '../helpdesk/initiation/se-helpdesk-file-upload-details/se-helpdesk-file-upload-details.component';
@NgModule({
    declarations: [
        SeProductComponent,
        SeGeneralDetailsComponent,
        SeFileUploadDetailsComponent,
        SeFileUploadDialogComponent,
        SeHelpdeskProductComponent,
        SeHelpdeskGeneralDetailsComponent,
        SeHelpdeskFileUploadDetailsComponent,
        SeHelpdeskFileUploadDialogComponent
        
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
        MatCardModule,
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
    providers: [UtilityService, LcReturnService, ConfirmationService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FccSeModule { }
