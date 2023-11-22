import { TradeCommonModule } from '../../trade.common.module';
import { CommonModule } from '../../../common/common.module';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { SetEntityComponent } from './set-entity/set-entity.component';
import { SetReferenceComponent } from './set-reference/set-reference.component';
import { GeneralDetailsComponent } from './components/general-details/general-details.component';
import { ApplicantDetailsComponent } from './components/applicant-details/applicant-details.component';
import { PrimeNgModule } from '../../../primeng.module';
import { BeneficiaryDetailsComponent } from './components/beneficiary-details/beneficiary-details.component';



@NgModule({
  declarations: [
    SetEntityComponent, SetReferenceComponent, GeneralDetailsComponent, ApplicantDetailsComponent, BeneficiaryDetailsComponent
  ],

   imports: [
    BrowserModule, BrowserAnimationsModule, HttpClientModule,
    ReactiveFormsModule, FormsModule, TranslateModule, CommonModule, PrimeNgModule, TradeCommonModule
  ],

  exports: [
    SetEntityComponent, SetReferenceComponent, GeneralDetailsComponent, ApplicantDetailsComponent
  ]
})
export class MaintenanceModule { }
