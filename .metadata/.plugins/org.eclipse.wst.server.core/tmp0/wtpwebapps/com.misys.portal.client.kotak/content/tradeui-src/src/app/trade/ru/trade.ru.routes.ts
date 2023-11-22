import { RuMessageToBankComponent } from './message-to-bank/ru-message-to-bank.component';
import { RUInitiationComponent } from './../../trade/ru/initiation/ru-initiation.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RUHomeComponent } from './home/ru-home.component';
import { RuInquiryComponent } from './inquiry/ru-inquiry.component';
import { SetEntityComponent } from './../../trade/common/maintenance/set-entity/set-entity.component';
import { SetReferenceComponent } from './../../trade/common/maintenance/set-reference/set-reference.component';
import { ResponseMessageComponent } from './../../common/components/response-message/response-message.component';
import { BankRuInitiationComponent } from './../../bank/trade/ru/initiation/components/bank-ru-initiation/bank-ru-initiation.component';

const routes: Routes = [
  {path: 'ru', pathMatch: 'full', component: RUHomeComponent},
  {path: 'ru/historyConsolidatedSummary', pathMatch: 'full', component: RuInquiryComponent},
  {path: 'ru/fromExistingMsgToBank', pathMatch: 'full', component: RuMessageToBankComponent},
  {path: 'ru/previewTnx', pathMatch: 'full', component: RUInitiationComponent},
  {path: 'ru/previewExisting', pathMatch: 'full', component: BankRuInitiationComponent},
  {path: 'ru/retriveUnsigned', pathMatch: 'full', component: BankRuInitiationComponent},
  {path: 'ru/actionRequired', pathMatch: 'full', component: RuMessageToBankComponent},
  {path: 'ru/editMsgToBank', pathMatch: 'full', component: RuMessageToBankComponent},
  {path: 'ru/previewMsgToBank', pathMatch: 'full', component: RuMessageToBankComponent},
  {path: 'ru/updateEntity', component: SetEntityComponent},
  {path: 'ru/updateCustRef', component: SetReferenceComponent},
  {path: 'response', component: ResponseMessageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class TradeRURouters {}
