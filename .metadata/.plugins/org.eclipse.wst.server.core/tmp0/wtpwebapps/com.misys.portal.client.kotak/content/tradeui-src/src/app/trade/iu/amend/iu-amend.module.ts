import { PhraseDialogComponent } from './../../../common/components/phrase-dialog/phrase-dialog.component';
import { BankCommonModule } from './../../../bank/common/bank.common.module';
import { TradeCommonModule } from '../../trade.common.module';
import { CommonModule } from '../../../common/common.module';
import { IUAmendComponent } from './iu-amend.component';
import { AmendAmountDetailsComponent } from './components/amend-amount-details/amend-amount-details.component';
import { AmendBankInstructionsComponent } from './components/amend-bank-instructions/amend-bank-instructions.component';
import { AmendContractDetailsComponent } from './components/amend-contract-details/amend-contract-details.component';
import { AmendGeneralDetailsComponent } from './components/amend-general-details/amend-general-details.component';
import { AmendNarrativeDetailsComponent } from './components/amend-narrative-details/amend-narrative-details.component';
import { NgModule } from '@angular/core';
import { AmendTwoColumnViewComponent } from '../../../trade/iu/amend/components/amend-two-column-view/amend-two-column-view.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrimeNgModule } from '../../../primeng.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    IUAmendComponent, AmendGeneralDetailsComponent, AmendAmountDetailsComponent,
    AmendNarrativeDetailsComponent, AmendContractDetailsComponent, AmendBankInstructionsComponent,
    AmendTwoColumnViewComponent
  ],

  imports: [

    BrowserModule, BrowserAnimationsModule, HttpClientModule, ReactiveFormsModule,
    FormsModule, TranslateModule, PrimeNgModule, CommonModule, TradeCommonModule,
    BankCommonModule
  ],

  exports : [
    IUAmendComponent, AmendGeneralDetailsComponent, AmendAmountDetailsComponent, AmendNarrativeDetailsComponent,
    AmendContractDetailsComponent, AmendBankInstructionsComponent, AmendTwoColumnViewComponent, PhraseDialogComponent
  ]

})

export class IUAmendModule { }
