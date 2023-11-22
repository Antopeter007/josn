import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';

import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiAmountChargeDetailsComponent } from '../ui-amount-charge-details/ui-amount-charge-details.component';
import { UiContractDetailsComponent } from '../ui-contract-details/ui-contract-details.component';
import { UiExtensionDetailsComponent } from '../ui-extension-details/ui-extension-details.component';
import { UiIncreaseDecreaseComponent } from '../ui-increase-decrease/ui-increase-decrease.component';
import { UiNarrativeComponent } from '../ui-narrative/ui-narrative.component';
import { UiPaymentDetailsComponent } from '../ui-payment-details/ui-payment-details.component';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { UiShipmentDetailsComponent } from '../ui-shipment-details/ui-shipment-details.component';
import { UiTermsComponent } from '../ui-terms/ui-terms.component';
import { UiTypeExpiryDetailsComponent } from '../ui-type-expiry-details/ui-type-expiry-details.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';


@Component({
  selector: 'app-ui-undertaking-details',
  templateUrl: './ui-undertaking-details.component.html',
  styleUrls: ['./ui-undertaking-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiUndertakingDetailsComponent }]
})

export class UiUndertakingDetailsComponent extends UiProductComponent implements OnInit, AfterViewInit, OnDestroy {

  form: FCCFormGroup;
  isMasterRequired: any;
  module = `${this.translateService.instant(FccGlobalConstant.UI_UNDERTAKING_DETAILS)}`;
  @ViewChild(MatAccordion) public accordion: MatAccordion;
  @ViewChild(UiTypeExpiryDetailsComponent, { read: UiTypeExpiryDetailsComponent }) public uiTypeExpiryDetails:
  UiTypeExpiryDetailsComponent;
  @ViewChild(UiAmountChargeDetailsComponent, { read: UiAmountChargeDetailsComponent }) public uiAmountChargeDetails:
  UiAmountChargeDetailsComponent;
  @ViewChild(UiExtensionDetailsComponent, { read: UiExtensionDetailsComponent }) public uiExtensionDetails: UiExtensionDetailsComponent;
  @ViewChild(UiIncreaseDecreaseComponent, { read: UiIncreaseDecreaseComponent }) public uiIncreaseDecreaseDetails:
  UiIncreaseDecreaseComponent;
  @ViewChild(UiContractDetailsComponent, { read: UiContractDetailsComponent }) public uiContractDetails: UiContractDetailsComponent;
  @ViewChild(UiTermsComponent, { read: UiTermsComponent }) public uiTerms: UiTermsComponent;
  @ViewChild(UiShipmentDetailsComponent, { read: UiShipmentDetailsComponent }) public uiShipmentDetails: UiShipmentDetailsComponent;
  @ViewChild(UiPaymentDetailsComponent, { read: UiPaymentDetailsComponent }) public uiPaymentDetails: UiPaymentDetailsComponent;
  @ViewChild(UiNarrativeComponent, { read: UiNarrativeComponent }) public uiNarrativeDetails: UiNarrativeComponent;

  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected amendCommonService: AmendCommonService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {
    this.isMasterRequired = this.isMasterRequired;
    this.initializeFormGroup();
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.UI_UNDERTAKING_DETAILS;
    this.form = this.productStateService.getSectionData(sectionName, undefined, this.isMasterRequired);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
  }

  ngOnDestroy() {
    this.productStateService.setStateSection(FccGlobalConstant.UI_UNDERTAKING_DETAILS, this.form, this.isMasterRequired);
  }

  ngAfterViewInit() {
    this.uiProductService.uiUndertakingDetailsAfterViewInit(this.form);
    // TODO :: Retain the below code once component extension works fine.
    // const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    // const formAccordionPanels = this.form.get('uiUndertakingDetails')[FccGlobalConstant.PARAMS][`formAccordionPanels`];
    // // Show shipment and payment details sections, only for STBY.
    // if (tnxTypeCode === FccGlobalConstant.N002_NEW || tnxTypeCode === FccGlobalConstant.N002_AMEND) {
    //   const generalDetailsForm: FCCFormGroup  =
    //   this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired);
    //   const toggleSections = [FccGlobalConstant.UI_SHIPMENT_DETAILS, FccGlobalConstant.UI_PAYMENT_DETAILS];

    //   if (generalDetailsForm.get('bgSubProductCode') &&
    //   (generalDetailsForm.get('bgSubProductCode').value === FccGlobalConstant.STBY
    //   || generalDetailsForm.get('bgSubProductCode').value[0].value === FccGlobalConstant.STBY)) {
    //     this.toggelFormAccordionPanel(this.form, formAccordionPanels, toggleSections, true);
    //   } else {
    //     this.toggelFormAccordionPanel(this.form, formAccordionPanels, toggleSections, false);
    //   }
    // }
    // // Hide Terms Panel for Amend
    // if (tnxTypeCode === FccGlobalConstant.N002_AMEND) {
    //   this.toggelFormAccordionPanel(this.form, formAccordionPanels, [FccGlobalConstant.UI_TERMS], false);
    // }

    // // Show extension section only in case of Fixed Expiry type(02).
    // const typeExpiryForm  = this.form.get('uiTypeAndExpiry');
    // if (typeExpiryForm.get('bgExpDateTypeCode') && (typeExpiryForm.get('bgExpDateTypeCode').value === '01'
    // || typeExpiryForm.get('bgExpDateTypeCode').value === '03')) {
    //   this.toggelFormAccordionPanel(this.form, formAccordionPanels, [FccGlobalConstant.UI_EXTENSION_DETAILS], false);
    // } else {
    //   this.toggelFormAccordionPanel(this.form, formAccordionPanels, [FccGlobalConstant.UI_EXTENSION_DETAILS], true);
    // }
    // if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
    //   this.amendFormFields();
    // }
  }
  amendFormFields() {
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    if ((mode !== FccGlobalConstant.VIEW_MODE && operation !== FccGlobalConstant.PREVIEW) ||
    (mode === FccGlobalConstant.VIEW_MODE && operation === FccGlobalConstant.LIST_INQUIRY)) {
    this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.UI_UNDERTAKING_DETAILS);
    }
   }
}
