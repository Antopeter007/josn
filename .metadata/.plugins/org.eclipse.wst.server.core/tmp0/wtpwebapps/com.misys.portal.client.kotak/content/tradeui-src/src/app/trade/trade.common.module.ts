import { ReductionIncreaseComponent } from './iu/initiation/components/reduction-increase/reduction-increase.component';
import { CommonBankDetailsComponent } from './iu/initiation/components/common-bank-details/common-bank-details.component';
import { RenewalDetailsComponent } from './iu/initiation/components/renewal-details/renewal-details.component';
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
import { PrimeNgModule } from '../primeng.module';
import { CommonModule } from './../common/common.module';
import { TradeEventDetailsComponent } from './common/components/event-details/event-details.component';
import { IUCommonAmountDetailsComponent } from './iu/common/components/amount-details/amount-details.component';
import { IUCommonApplicantDetailsComponent } from './iu/common/components/applicant-details-form/applicant-details-form.component';
import { CommonAmountDetailsComponent } from './iu/common/components/common-amount-details/common-amount-details.component';
import { PartyDetailsComponent } from './common/components/party-details/party-details.component';
import { IUCommonLicenseComponent } from './iu/common/components/license/license.component';
import { IUCommonResponseMessageComponent } from './iu/common/components/response-message/response-message.component';
import { IUCommonReturnCommentsComponent } from './iu/common/components/return-comments/return-comments.component';
import { IUService } from './iu/common/service/iu.service';
import { IUCommonDataService } from './iu/common/service/iuCommonData.service';
import { CuRenewalDetailsComponent } from './iu/initiation/components/cu-renewal-details/cu-renewal-details.component';
import { CommonRenewalDetailsComponent } from './iu/initiation/components/common-renewal-details/common-renewal-details.component';
import { IUGeneralDetailsComponent } from './iu/initiation/components/iu-general-details/iu-general-details.component';
import { CommonGeneralDetailsComponent } from './iu/initiation/components/common-general-details/common-general-details.component';
import { ContractDetailsComponent } from './iu/initiation/components/contract-details/contract-details.component';
import { AmendCuPreviewDetailsComponent } from './iu/amend/components/amend-cu-preview-details/amend-cu-preview-details.component';
import { CuAmountDetailsComponent } from './iu/initiation/components/cu-amount-details/cu-amount-details.component';
import { CuGeneralDetailsComponent } from './iu/initiation/components/cu-general-details/cu-general-details.component';
import { CuBeneficiaryDetailsComponent } from './iu/initiation/components/cu-beneficiary-details/cu-beneficiary-details.component';
import { CuBankDetailsComponent } from './iu/initiation/components/cu-bank-details/cu-bank-details.component';
import { CuUndertakingDetailsComponent } from './iu/initiation/components/cu-undertaking-details/cu-undertaking-details.component';
import { CuReductionIncreaseComponent } from './iu/initiation/components/cu-reduction-increase/cu-reduction-increase.component';
import { CommonReductionIncreaseComponent } from './iu/initiation/components/common-reduction-increase/common-reduction-increase.component';
import { CommonUndertakingDetailsComponent } from './iu/initiation/components/common-undertaking-details/common-undertaking-details.component';
import { IuPaymentDetailsComponent } from './iu/initiation/components/iu-payment-details/iu-payment-details.component';
import { CuPaymentDetailsComponent } from './iu/initiation/components/cu-payment-details/cu-payment-details.component';
import { CommonPaymentDetailsComponent } from './iu/initiation/components/common-payment-details/common-payment-details.component';
import { ShipmentDetailsComponent } from './iu/initiation/components/shipment-details/shipment-details.component';
import { AmendBankDetailsComponent } from './iu/amend/components/amend-bank-details/amend-bank-details.component';
import { IUFacilityDetailsComponent } from './iu/initiation/components/facility-details/iu-facility-details.component';
import { IUCommonBeneficiaryDetailsComponent } from './iu/common/components/beneficiary-details-form/beneficiary-details-form.component';
import { IUCommonAltApplicantDetailsComponent } from './iu/common/components/alt-applicant-details-form/alt-applicant-details-form.component';

@NgModule({
    declarations: [TradeEventDetailsComponent, IUCommonApplicantDetailsComponent,
        IUCommonLicenseComponent, IUCommonReturnCommentsComponent,
        IUCommonAmountDetailsComponent, PartyDetailsComponent,
        IUCommonResponseMessageComponent, CommonAmountDetailsComponent,
        RenewalDetailsComponent, CuRenewalDetailsComponent, CommonRenewalDetailsComponent,
        CommonGeneralDetailsComponent, IUGeneralDetailsComponent, ContractDetailsComponent,
        CommonBankDetailsComponent, AmendCuPreviewDetailsComponent,
        CuAmountDetailsComponent, CuGeneralDetailsComponent, CuBeneficiaryDetailsComponent,
        CuBankDetailsComponent, CuUndertakingDetailsComponent, CuReductionIncreaseComponent,
        CommonReductionIncreaseComponent, CommonUndertakingDetailsComponent,
        IuPaymentDetailsComponent, CuPaymentDetailsComponent, CommonPaymentDetailsComponent,
        ShipmentDetailsComponent, ReductionIncreaseComponent, AmendBankDetailsComponent,
        IUCommonBeneficiaryDetailsComponent, IUCommonAltApplicantDetailsComponent, IUFacilityDetailsComponent
    ],
    imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule,
        ReactiveFormsModule, FormsModule, TranslateModule, PrimeNgModule,
        TabViewModule, CommonModule],
    exports: [TradeEventDetailsComponent, IUCommonApplicantDetailsComponent,
        IUCommonLicenseComponent, IUCommonReturnCommentsComponent,
        IUCommonAmountDetailsComponent, PartyDetailsComponent,
        IUCommonResponseMessageComponent, CommonAmountDetailsComponent,
        RenewalDetailsComponent, CuRenewalDetailsComponent, CommonRenewalDetailsComponent,
        CommonGeneralDetailsComponent, IUGeneralDetailsComponent, ContractDetailsComponent,
        CommonBankDetailsComponent, CuAmountDetailsComponent,
        CuGeneralDetailsComponent, CuBeneficiaryDetailsComponent,
        CuBankDetailsComponent, CuUndertakingDetailsComponent, CuReductionIncreaseComponent,
        CommonReductionIncreaseComponent, CommonUndertakingDetailsComponent,
        IuPaymentDetailsComponent, CuPaymentDetailsComponent, CommonPaymentDetailsComponent,
        ShipmentDetailsComponent, ReductionIncreaseComponent, AmendBankDetailsComponent,
        IUCommonBeneficiaryDetailsComponent, IUCommonAltApplicantDetailsComponent, IUFacilityDetailsComponent
    ],
    providers: [
        DialogService, DynamicDialogRef, DatePipe, IUCommonDataService, IUService, DecimalPipe
    ]
})

export class TradeCommonModule { }
