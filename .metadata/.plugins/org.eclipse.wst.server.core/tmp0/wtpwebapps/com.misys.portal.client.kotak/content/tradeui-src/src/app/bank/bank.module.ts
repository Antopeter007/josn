import { BankRuBankDetailsComponent } from './trade/ru/initiation/components/bank-ru-bank-details/bank-ru-bank-details.component';
import { BankRuInitiationComponent } from './trade/ru/initiation/components/bank-ru-initiation/bank-ru-initiation.component';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng';
import { TabViewModule } from 'primeng/tabview';
import { PrimeNgModule } from '../primeng.module';
import { BankCommonModule } from './common/bank.common.module';
import { ReportingFromExistingComponent } from './reporting-from-existing/reporting-from-existing.component';
import { IUInitiationModule } from '../trade/iu/initiation/iu-initiation.module';
import { MaintenanceModule } from '../trade/common/maintenance/maintenance.module';
import { TradeIUModule } from '../trade/iu/trade.iu.module';
import { TradeCommonModule } from '../trade/trade.common.module';
import { DatePipe, DecimalPipe } from '@angular/common';
import { IUAmendModule } from '../trade/iu/amend/iu-amend.module';
import { RouterModule } from '@angular/router';
import { UploadDialogComponent } from '../common/components/upload-dialog/upload-dialog.component';
import { BankDialogComponent } from '../common/components/bank-dialog/bank-dialog.component';
import { FileUploadComponent } from '../common/components/fileupload-component/fileupload.component';
import { CurrencyDialogComponent } from '../common/components/currency-dialog/currency-dialog.component';
import { EntityDialogComponent } from '../common/components/entity-dialog/entity-dialog.component';
import { LicenseDialogComponent } from '../common/components/license-dialog/license-dialog.component';
import { UsersDialogComponent } from '../common/components/users-dialog/users-dialog.component';
import { BeneficiaryDialogComponent } from '../common/components/beneficiary-dialog/beneficiary-dialog.component';
import { CountryDialogComponent } from '../common/components/country-dialog/country-dialog.component';
import { AccountDialogComponent } from '../common/components/account-dialog/account-dialog.component';
import { CommonModule } from '../common/common.module';
import { ReportingFromPendingComponent } from './reporting-from-pending/reporting-from-pending.component';
import { BankRuGeneralDetailsComponent } from './trade/ru/initiation/components/bank-ru-general-details/bank-ru-general-details.component';
import { BankApplicantBeneDetailsComponent } from './trade/ru/initiation/components/bank-applicant-bene-details/bank-applicant-bene-details.component';
import { BankCommonApplicantBeneDetailsComponent } from './trade/ru/initiation/components/bank-common-applicant-bene-details/bank-common-applicant-bene-details.component';


@NgModule({
    declarations: [
        ReportingFromExistingComponent,
        ReportingFromPendingComponent,
        BankRuInitiationComponent,
        BankRuGeneralDetailsComponent,
        BankRuBankDetailsComponent,
        BankApplicantBeneDetailsComponent,
        BankCommonApplicantBeneDetailsComponent
    ],
    imports: [
        BrowserModule, BrowserAnimationsModule, HttpClientModule, ReactiveFormsModule, FormsModule, TranslateModule,
        PrimeNgModule, TabViewModule, IUInitiationModule, MaintenanceModule, TradeIUModule, TradeCommonModule, CommonModule,
        IUAmendModule, RouterModule, BankCommonModule, CommonModule
    ],
    exports: [
        ReportingFromExistingComponent,
        ReportingFromPendingComponent,
        BankRuInitiationComponent,
        BankRuGeneralDetailsComponent,
        BankRuBankDetailsComponent,
        BankApplicantBeneDetailsComponent,
        BankCommonApplicantBeneDetailsComponent,
        UploadDialogComponent,
        BankDialogComponent,
        FileUploadComponent,
        CurrencyDialogComponent,
        EntityDialogComponent,
        LicenseDialogComponent,
        UsersDialogComponent,
        BeneficiaryDialogComponent,
        CountryDialogComponent,
        AccountDialogComponent
    ],
    providers: [
        DialogService, DynamicDialogRef, DatePipe, DecimalPipe
    ]
})
export class BankModule { }
