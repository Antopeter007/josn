import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';

import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { AmendCommonService } from '../../../../common/services/amend-common.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { UaAmountChargeDetailsComponent } from '../ua-amount-charge-details/ua-amount-charge-details.component';
import { UaContractDetailsComponent } from '../ua-contract-details/ua-contract-details.component';
import { UaProductComponent } from '../ua-product/ua-product.component';
import { UaShipmentDetailsComponent } from '../ua-shipment-details/ua-shipment-details.component';
import { UaExtensionDetailsComponent } from './../ua-extension-details/ua-extension-details.component';
import { UaIncreaseDecreaseComponent } from '../ua-increase-decrease/ua-increase-decrease.component';
import { UaNarrativeComponent } from '../ua-narrative/ua-narrative.component';
import { UaPaymentDetailsComponent } from '../ua-payment-details/ua-payment-details.component';
import { UaTermsComponent } from '../ua-terms/ua-terms.component';
import { UaTypeExpiryDetailsComponent } from '../ua-type-expiry-details/ua-type-expiry-details.component';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { UaProductService } from '../../services/ua-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { FormAccordionPanelService } from '../../../../../common/services/form-accordion-panel.service';


@Component({
  selector: 'app-ua-undertaking-details',
  templateUrl: './ua-undertaking-details.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UaUndertakingDetailsComponent }]
})

export class UaUndertakingDetailsComponent extends UaProductComponent implements OnInit {

  form: FCCFormGroup;
  isMasterRequired: any;
  module = `${this.translateService.instant(FccGlobalConstant.UA_UNDERTAKING_DETAILS)}`;
  @ViewChild(MatAccordion) public accordion: MatAccordion;
  @ViewChild(UaAmountChargeDetailsComponent, { read: UaAmountChargeDetailsComponent })
  public uaAmountChargeDetails: UaAmountChargeDetailsComponent;

  @ViewChild(UaContractDetailsComponent, { read: UaContractDetailsComponent })
  public UaContractDetails: UaContractDetailsComponent;

  @ViewChild(UaShipmentDetailsComponent, { read: UaShipmentDetailsComponent })
  public UaShipmentDetails: UaShipmentDetailsComponent;

  @ViewChild(UaExtensionDetailsComponent, { read: UaExtensionDetailsComponent })
  public uaExtensionDetails: UaExtensionDetailsComponent;

  @ViewChild(UaIncreaseDecreaseComponent, { read: UaIncreaseDecreaseComponent })
  public uaIncreaseDecreaseDetails: UaIncreaseDecreaseComponent;

  @ViewChild(UaTypeExpiryDetailsComponent, { read: UaTypeExpiryDetailsComponent })
  public uaTypeAndExpiry: UaTypeExpiryDetailsComponent;
  @ViewChild(UaPaymentDetailsComponent, { read: UaPaymentDetailsComponent })
  public uaPaymentDetails: UaPaymentDetailsComponent;
  @ViewChild(UaTermsComponent, { read: UaTermsComponent })
  public uaTerms: UaTermsComponent;
  @ViewChild(UaNarrativeComponent, { read: UaNarrativeComponent })
  public uaNarrativeDetails: UaNarrativeComponent;



  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected amendCommonService: AmendCommonService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uaProductService: UaProductService,
              protected formAccordionPanelService: FormAccordionPanelService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uaProductService);
}

  ngOnInit(): void {
    this.commonService.getSwiftVersionValue();
    this.initializeFormGroup();
    this.isMasterRequired = this.isMasterRequired;

  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.UA_UNDERTAKING_DETAILS;
    this.form = this.productStateService.getSectionData(sectionName, undefined, this.isMasterRequired);
    this.populateTenderExpiry();
    this.populateExpiryEvent();
    this.uaProductService.swift2023Changes();
  }
 
  populateTenderExpiry() {
    if (this.form.controls.uaContractDetails.get('contractReference') &&
      (this.form.controls.uaContractDetails.get('contractReference').value !== ''
        && this.form.controls.uaContractDetails.get('contractReference').value !== null &&
        this.form.controls.uaContractDetails.get('contractReference').value === 'TEND')) {
      this.toggleControls(this.form.controls.uaContractDetails, ['tenderExpiryDate'], true);
    } else {
      if (this.form.controls.uaContractDetails.get('tenderExpiryDate')) {
        this.toggleControls(this.form.controls.uaContractDetails, ['tenderExpiryDate'], false);
      }
    }
  }

  populateExpiryEvent() {
    if ((this.form.controls.uaTypeAndExpiry.get('bgExpDateTypeCode').value[0].value !== ''
      && this.form.controls.uaTypeAndExpiry.get('bgExpDateTypeCode').value[0].value !== null &&
      (this.form.controls.uaTypeAndExpiry.get('bgExpDateTypeCode').value[0].value === '01' ||
        this.form.controls.uaTypeAndExpiry.get('bgExpDateTypeCode').value[0].value === '03'))) {
      this.toggleControls(this.form.controls.uaTypeAndExpiry, ['expiryEvent'], true);
    } else {
      if (this.form.controls.uaTypeAndExpiry.get('expiryEvent')) {
        this.toggleControls(this.form.controls.uaTypeAndExpiry, ['expiryEvent'], false);
      }
    }
  }

  ngOnDestroy() {
    this.productStateService.setStateSection(FccGlobalConstant.UA_UNDERTAKING_DETAILS, this.form, this.isMasterRequired);
  }

  onFormAccordionSectionChange() {
    //eslint : no-empty-function
  }

  amendFormFields() {
    this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.UA_UNDERTAKING_DETAILS);
  }

  ngAfterViewInit() {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const formAccordionPanels = this.form.get(FccGlobalConstant.UA_UNDERTAKING_DETAILS)[FccGlobalConstant.PARAMS][`formAccordionPanels`];
    // Show shipment and payment details sections, only for STBY.
    if (tnxTypeCode !== '' && tnxTypeCode !== undefined && tnxTypeCode === FccGlobalConstant.N002_NEW ||
      tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const generalDetailsForm: FCCFormGroup = this.productStateService.getSectionData(FccGlobalConstant.UA_GENERAL_DETAIL);
      const toggleSections = [FccGlobalConstant.UA_SHIPMENT_DETAILS, FccGlobalConstant.UA_PAYMENT_DETAILS];

      if (generalDetailsForm.get('bgSubProductCode') &&
        (generalDetailsForm.get('bgSubProductCode').value === FccGlobalConstant.STBY
          || generalDetailsForm.get('bgSubProductCode').value[0].value === FccGlobalConstant.STBY)) {
        this.toggelFormAccordionPanel(this.form, formAccordionPanels, toggleSections, true);
      } else {
        this.toggelFormAccordionPanel(this.form, formAccordionPanels, toggleSections, false);
      }
    }
    // Hide Terms Panel for Amend
    if (tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.toggelFormAccordionPanel(this.form, formAccordionPanels, [FccGlobalConstant.UA_TERMS], false);
    }

    // Show extension section only in case of Fixed Expiry type(02).
    const typeExpiryForm = this.form.get('uaTypeAndExpiry');
    if (typeExpiryForm.get('bgExpDateTypeCode') && (typeExpiryForm.get('bgExpDateTypeCode').value === '01'
      || typeExpiryForm.get('bgExpDateTypeCode').value === '03')) {
      this.toggelFormAccordionPanel(this.form, formAccordionPanels, [FccGlobalConstant.UA_EXTENSION_DETAILS], false);
    } else {
      this.toggelFormAccordionPanel(this.form, formAccordionPanels, [FccGlobalConstant.UA_EXTENSION_DETAILS], true);
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
  }
}

