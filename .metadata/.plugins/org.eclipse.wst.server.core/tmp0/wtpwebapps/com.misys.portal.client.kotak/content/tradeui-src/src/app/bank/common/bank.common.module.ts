import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng';
import { TabViewModule } from 'primeng/tabview';
import { PrimeNgModule } from '../../primeng.module';
import { CommonModule } from './../../common/common.module';
import { AddChargesDialogComponent } from './components/add-charges-dialog/add-charges-dialog.component';
import { ReportingMessageDetailsComponent } from './components/reporting-message-details/reporting-message-details.component';
import { MessageDetailsComponent } from './components/message-details/message-details.component';
import { TransactionDetailsComponent } from './components/transaction-details/transaction-details.component';



@NgModule({
    declarations: [
        AddChargesDialogComponent,
        ReportingMessageDetailsComponent,
        MessageDetailsComponent,
        TransactionDetailsComponent
    ],
    imports: [
        BrowserModule, BrowserAnimationsModule, HttpClientModule, CommonModule,
        ReactiveFormsModule, FormsModule, TranslateModule, PrimeNgModule, TabViewModule
    ],
    exports: [AddChargesDialogComponent, ReportingMessageDetailsComponent, MessageDetailsComponent, TransactionDetailsComponent],
    providers: [DialogService, DynamicDialogRef]
})
export class BankCommonModule { }
