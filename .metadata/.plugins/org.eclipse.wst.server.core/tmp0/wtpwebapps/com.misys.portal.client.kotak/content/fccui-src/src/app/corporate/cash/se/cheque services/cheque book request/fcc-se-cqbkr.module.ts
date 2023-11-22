import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';
import { ButtonModule, CalendarModule, CardModule, CheckboxModule, DialogModule, DropdownModule, FileUploadModule, InputSwitchModule, InputTextareaModule, InputTextModule, KeyFilterModule, MessageModule, MessagesModule, MultiSelectModule, OrganizationChartModule, OverlayPanelModule, ProgressBarModule, ProgressSpinnerModule, RadioButtonModule, SelectButtonModule, StepsModule, TableModule, TabViewModule } from 'primeng';
import { AccordionModule } from 'primeng/accordion';
import { FormResolverModule } from '../../../../../shared/FCCform/form/form-resolver/form-resolver.module';
import { FccLcModule } from '../../../../trade/lc/fcc-lc.module';
import { FccLcRoutes } from '../../../../trade/lc/fcc-lc.routes';
import { SeCqbkrDynamicComponent } from '../model/se-cqbkr-dynamic.component';
import { ChequeBookRequestGeneralDetailsComponent } from './cheque-book-request-general-details/cheque-book-request-general-details/cheque-book-request-general-details.component';
import { ChequeBookRequestProductComponent } from './cheque-book-request-product/cheque-book-request-product/cheque-book-request-product.component';
import { FccSeCqbkrRoutes } from './fcc-se-cqbkr.routes';


@NgModule({
    declarations: [
        ChequeBookRequestGeneralDetailsComponent,
        ChequeBookRequestProductComponent,
        SeCqbkrDynamicComponent
    ],
    imports: [
        CommonModule,
        FccSeCqbkrRoutes,
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
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        FccLcModule,
        FccLcRoutes,
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
        MatCardModule,
        MatTabsModule,
        TranslateModule,
        DialogModule,
        ProgressSpinnerModule,
        MatDialogModule,
        MatAutocompleteModule,
        FormResolverModule,
        AccordionModule
    ]
})
export class FccSeCqbkrModule { }
