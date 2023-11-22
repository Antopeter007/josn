import { CollaborationUsersDialogComponent } from './components/collaboration-users.dialog/collaboration-users.dialog.component';
import { ChartComponent } from './components/chart/chart.component';
import { InquiryCompletedTnxComponent } from './components/inquiry-completed-tnx/inquiry-completed-tnx.component';
import { FileUploadComponent } from './components/fileupload-component/fileupload.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { TabViewModule } from 'primeng/tabview';
import { PrimeNgModule } from '../primeng.module';
import { AccountDialogComponent } from './components/account-dialog/account-dialog.component';
import { AddCounterpartyBankDialogComponent } from './components/add-counterparty-bank-dialog/add-counterparty-bank-dialog.component';
import { BankDialogComponent } from './components/bank-dialog/bank-dialog.component';
import { BeneficiaryDialogComponent } from './components/beneficiary-dialog/beneficiary-dialog.component';
import { ErrorMessageComponent } from './components/error-message/app-error-message.component';
import { CountryDialogComponent } from './components/country-dialog/country-dialog.component';
import { CurrencyDialogComponent } from './components/currency-dialog/currency-dialog.component';
import { EntityDialogComponent } from './components/entity-dialog/entity-dialog.component';

import {OverlayPanelModule} from 'primeng/overlaypanel';
import { HomeComponent } from './components/home/home.component';
import { InquiryPendingTnxComponent } from './components/inquiry-pending-tnx/inquiry-pending-tnx.component';
import { LicenseDialogComponent } from './components/license-dialog/license-dialog.component';
import { LoaderComponent } from './components/loader/loader.component';
import { UploadDialogComponent } from './components/upload-dialog/upload-dialog.component';
import { UsersDialogComponent } from './components/users-dialog/users-dialog.component';
import { LoaderInterceptorService } from './services/loader.interceptor.service';
import { ReauthDialogComponent } from './components/reauth-dialog/reauth-dialog.component';
import { NarrativeCharacterCountComponent } from './components/narrative-character-count/narrative-character-count.component';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng';
import { MaximizedChartComponent } from './components/maximized-chart/maximized-chart.component';
import { InquiryConsolidatedChargesComponent } from './components/inquiry-consolidated-charges/inquiry-consolidated-charges.component';
import { CourierDetailsComponent } from './components/courier-details/courier-details.component';
import { InquiryAttachmentsListComponent } from './components/inquiry-attachments-list/inquiry-attachments-list.component';
import { FreeFormatMessageComponent } from './components/free-format-message/free-format-message.component';
import { ResponseMessageComponent } from './components/response-message/response-message.component';
import { ActionsComponent } from './components/actions/actions.component';
import { FccCommonTextAreaDirective } from './directives/fcc-common-text-area.directive';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { CustomerEntityListDialogComponent } from './components/customer-entity-list-dialog/customer-entity-list-dialog.component';
import { ReturnCommentsComponent } from './components/return-comments/return-comments.component';
import { IrregularReductionIncreaseDialogComponent } from './components/irregular-reduction-increase-dialog/irregular-reduction-increase-dialog.component';
import { InquiryPendingListTnxComponent } from './components/inquiry-pending-list-tnx/inquiry-pending-list-tnx.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { TaskCommentDialogComponent } from './components/task-comment-dialog/task-comment-dialog.component';
import { PhraseDialogComponent } from './components/phrase-dialog/phrase-dialog.component';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';

@NgModule({
    declarations: [
        ErrorMessageComponent, UploadDialogComponent, CurrencyDialogComponent, FileUploadComponent, EntityDialogComponent,
        LicenseDialogComponent, UsersDialogComponent, BankDialogComponent, BeneficiaryDialogComponent,
        CountryDialogComponent, AccountDialogComponent, AddCounterpartyBankDialogComponent, LoaderComponent,
        ReauthDialogComponent, NarrativeCharacterCountComponent, MaximizedChartComponent,
        InquiryPendingTnxComponent, InquiryCompletedTnxComponent, HomeComponent, FreeFormatMessageComponent,
        InquiryConsolidatedChargesComponent, InquiryAttachmentsListComponent, ResponseMessageComponent, ActionsComponent,
        FccCommonTextAreaDirective, ChartComponent, ProgressBarComponent, CustomerEntityListDialogComponent, ReturnCommentsComponent,
        IrregularReductionIncreaseDialogComponent, InquiryPendingListTnxComponent, TaskDetailsComponent,
        TaskDialogComponent, TaskCommentDialogComponent, CollaborationUsersDialogComponent, PhraseDialogComponent, CourierDetailsComponent
    ],
    imports: [
        BrowserModule, BrowserAnimationsModule, HttpClientModule,
        ReactiveFormsModule, FormsModule, TranslateModule, PrimeNgModule, TabViewModule,
        OverlayPanelModule
    ],
    exports: [
        ErrorMessageComponent, UploadDialogComponent, CurrencyDialogComponent, FileUploadComponent, EntityDialogComponent,
        LicenseDialogComponent, UsersDialogComponent, BankDialogComponent, BeneficiaryDialogComponent,
        CountryDialogComponent, AccountDialogComponent, AddCounterpartyBankDialogComponent, LoaderComponent,
        ReauthDialogComponent, NarrativeCharacterCountComponent, MaximizedChartComponent,
        InquiryPendingTnxComponent, InquiryCompletedTnxComponent, HomeComponent, FreeFormatMessageComponent,
        InquiryConsolidatedChargesComponent, InquiryAttachmentsListComponent, ResponseMessageComponent, ActionsComponent,
        FccCommonTextAreaDirective, ChartComponent, ProgressBarComponent, ReturnCommentsComponent, IrregularReductionIncreaseDialogComponent,
        InquiryPendingListTnxComponent, TaskDialogComponent, TaskCommentDialogComponent, PhraseDialogComponent,
        CollaborationUsersDialogComponent, CourierDetailsComponent
    ],
    providers: [
        DialogService, DynamicDialogRef, DynamicDialogConfig,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptorService,
            multi: true
        }
    ]
})
export class CommonModule { }
