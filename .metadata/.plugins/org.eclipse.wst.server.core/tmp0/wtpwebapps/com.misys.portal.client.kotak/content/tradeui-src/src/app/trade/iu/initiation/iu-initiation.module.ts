import { BankCommonModule } from './../../../bank/common/bank.common.module';
import { CollaborationUsersDialogComponent } from './../../../common/components/collaboration-users.dialog/collaboration-users.dialog.component';
import { PhraseDialogComponent } from './../../../common/components/phrase-dialog/phrase-dialog.component';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng';
import { TabViewModule } from 'primeng/tabview';
import { CommonModule } from '../../../common/common.module';
import { AccountDialogComponent } from '../../../common/components/account-dialog/account-dialog.component';
import { BankDialogComponent } from '../../../common/components/bank-dialog/bank-dialog.component';
import { BeneficiaryDialogComponent } from '../../../common/components/beneficiary-dialog/beneficiary-dialog.component';
import { CountryDialogComponent } from '../../../common/components/country-dialog/country-dialog.component';
import { CurrencyDialogComponent } from '../../../common/components/currency-dialog/currency-dialog.component';
import { EntityDialogComponent } from '../../../common/components/entity-dialog/entity-dialog.component';
import { FileUploadComponent } from '../../../common/components/fileupload-component/fileupload.component';
import { LicenseDialogComponent } from '../../../common/components/license-dialog/license-dialog.component';
import { UploadDialogComponent } from '../../../common/components/upload-dialog/upload-dialog.component';
import { UsersDialogComponent } from '../../../common/components/users-dialog/users-dialog.component';
import { PrimeNgModule } from '../../../primeng.module';
import { CommonBankInstructionsComponent } from './components/common-bank-instructions/common-bank-instructions.component';
import { IUAmendReleaseComponent } from '../amend-release/iu-amend-release.component';
import { IUHomeComponent } from '../home/iu-home.component';
import { IuInquiryComponent } from '../inquiry/iu-inquiry.component';
import { IUMessageToBankComponent } from '../message-to-bank/iu-message-to-bank.component';
import { ModifyTemplateComponent } from '../template/modify-template/modify-template.component';
import { BankDetailsComponent } from './components/bank-details/bank-details.component';
import { BankInstructionsComponent } from './components/bank-instructions/bank-instructions.component';
import { IUInquiryPreviewComponent } from './components/iu-inquiry-preview/iu-inquiry-preview.component';
import { UndertakingDetailsComponent } from './components/undertaking-details/undertaking-details.component';
import { IUInitiationComponent } from './iu-initiation.component';
import { LocalUndertakingComponent } from './components/local-undertaking/local-undertaking.component';
import { TradeCommonModule } from '../../trade.common.module';
import { UndertakingGeneralDetailsComponent } from './components/iu-undertaking-general-details/iu-undertaking-general-details.component';

@NgModule({
    declarations: [
        BankInstructionsComponent, BankDetailsComponent,
        IUInitiationComponent, UndertakingDetailsComponent,
        CommonBankInstructionsComponent,
        IUHomeComponent, IuInquiryComponent, IUMessageToBankComponent,
        IUAmendReleaseComponent, ModifyTemplateComponent, IUInquiryPreviewComponent,
        LocalUndertakingComponent, UndertakingGeneralDetailsComponent
    ],
    imports: [
        BrowserModule, BrowserAnimationsModule, HttpClientModule, ReactiveFormsModule,
        CommonModule, FormsModule, TranslateModule, PrimeNgModule, TabViewModule, TradeCommonModule, BankCommonModule
    ],
    exports: [
        BankInstructionsComponent, BankDetailsComponent,
        IUInitiationComponent, UndertakingDetailsComponent,
        CommonBankInstructionsComponent,
        IUHomeComponent, IuInquiryComponent, IUMessageToBankComponent,
        IUAmendReleaseComponent, IUInquiryPreviewComponent, LocalUndertakingComponent, UndertakingGeneralDetailsComponent
    ],
    providers: [
        DialogService, DynamicDialogRef, DatePipe
    ]
})
export class IUInitiationModule { }
