import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradeIURouters } from './trade/iu/trade.iu.routes';
import { TradeRURouters } from './trade/ru/trade.ru.routes';
import { BankRouters } from './bank/bank.routes';
import { HomeComponent } from './common/components/home/home.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: '**', component: HomeComponent},

];

@NgModule({
  imports: [TradeIURouters, TradeRURouters, BankRouters, RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})

export class CoreRouters {}
