import { BankCommonModule } from './../../bank/common/bank.common.module';
import { RUInitiationComponent } from './../../trade/ru/initiation/ru-initiation.component';
import { RUService } from './service/ru.service';
import { DatePipe } from '@angular/common';
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
import { RUHomeComponent } from './home/ru-home.component';
import { RuInquiryComponent } from './inquiry/ru-inquiry.component';
import { TradeRURouters } from './trade.ru.routes';
import { TradeCommonModule } from '../trade.common.module';
import { RuMessageToBankComponent } from './message-to-bank/ru-message-to-bank.component';
import { RUUndertakingDetailsComponent } from './common/components/undertaking-details/ru-undertaking-details.component';
import { RUPartyDetailsComponent } from './initiation/components/ru-party-details/ru-party-details.component';
import { MaintenanceModule } from '../common/maintenance/maintenance.module';
import { RuReductionIncreaseComponent } from './initiation/ru-reduction-increase/ru-reduction-increase.component';


@NgModule({
    declarations: [RUHomeComponent, RuInquiryComponent, RuMessageToBankComponent, RUUndertakingDetailsComponent, RUInitiationComponent,
        RUPartyDetailsComponent, RuReductionIncreaseComponent],
    imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule,
        ReactiveFormsModule, CommonModule, FormsModule, TranslateModule, PrimeNgModule, BankCommonModule,
        TabViewModule, TradeRURouters, TradeCommonModule, MaintenanceModule],
    exports: [RUHomeComponent, RuInquiryComponent, RuMessageToBankComponent, RUUndertakingDetailsComponent, RUInitiationComponent,
        RUPartyDetailsComponent],
    providers: [
        DialogService, DynamicDialogRef, DatePipe, RUService
    ]
})
export class TradeRUModule { }
