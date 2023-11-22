import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService, DynamicDialogRef } from 'primeng';
import { TabViewModule } from 'primeng/tabview';
import { PrimeNgModule } from '../../primeng.module';
import { CommonModule } from '../../common/common.module';
import { IUAmendModule } from './amend/iu-amend.module';
import { IUInitiationModule } from './initiation/iu-initiation.module';
import { MaintenanceModule } from '../common/maintenance/maintenance.module';
import { TradeIURouters } from './trade.iu.routes';


@NgModule({
    declarations: [],
    imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, ReactiveFormsModule, CommonModule, FormsModule, TranslateModule,
        PrimeNgModule, TabViewModule, IUInitiationModule, MaintenanceModule,
        IUAmendModule, TradeIURouters],
    exports: [],
    providers: [
        DialogService, DynamicDialogRef, DatePipe, DecimalPipe
    ]
})
export class TradeIUModule { }
