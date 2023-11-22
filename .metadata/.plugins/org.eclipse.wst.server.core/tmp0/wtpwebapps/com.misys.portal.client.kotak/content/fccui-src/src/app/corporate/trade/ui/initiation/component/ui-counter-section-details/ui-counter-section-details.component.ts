import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiCuAmountChargeDetailsComponent } from '../ui-cu-amount-charge-details/ui-cu-amount-charge-details.component';
import { UiCuBeneficiaryDetailsComponent } from '../ui-cu-beneficiary-details/ui-cu-beneficiary-details.component';
import { UiCuExtensionDetailsComponent } from '../ui-cu-extension-details/ui-cu-extension-details.component';
import { UiCuGeneralDetailsComponent } from '../ui-cu-general-details/ui-cu-general-details.component';
import { UiCuIncreaseDecreaseComponent } from '../ui-cu-increase-decrease/ui-cu-increase-decrease.component';
import { UiCuNarrativeComponent } from '../ui-cu-narrative/ui-cu-narrative.components';
import { UiCuPaymentDetailsComponent } from '../ui-cu-payment-details/ui-cu-payment-details.component';
import { UiCuUndertakingDetailsComponent } from '../ui-cu-undertaking-details/ui-cu-undertaking-details.component';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ui-counter-section-details',
  templateUrl: './ui-counter-section-details.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UiCounterSectionDetailsComponent }]
})

export class UiCounterSectionDetailsComponent extends UiProductComponent implements OnInit, OnDestroy {
  form: FCCFormGroup;
  module = `${this.translateService.instant(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS)}`;
  isMasterRequired: any;
  @ViewChild(MatAccordion) public accordion: MatAccordion;
  @ViewChild(UiCuGeneralDetailsComponent, { read: UiCuGeneralDetailsComponent })
  public uiCuGeneralDetails: UiCuGeneralDetailsComponent;
  @ViewChild(UiCuBeneficiaryDetailsComponent, { read: UiCuBeneficiaryDetailsComponent })
  public uiCuBeneficiaryDetails: UiCuBeneficiaryDetailsComponent;
  @ViewChild(UiCuAmountChargeDetailsComponent, { read: UiCuAmountChargeDetailsComponent })
  public uiCuAmountChargeDetails: UiCuAmountChargeDetailsComponent;
  @ViewChild(UiCuExtensionDetailsComponent, { read: UiCuExtensionDetailsComponent })
  public uiCuExtensionDetails: UiCuExtensionDetailsComponent;
  @ViewChild(UiCuIncreaseDecreaseComponent, { read: UiCuIncreaseDecreaseComponent })
  public uiCuIncreaseDecreaseDetails: UiCuIncreaseDecreaseComponent;
  @ViewChild(UiCuPaymentDetailsComponent, { read: UiCuPaymentDetailsComponent })
  public uiCuPaymentDetails: UiCuPaymentDetailsComponent;
  @ViewChild(UiCuUndertakingDetailsComponent, { read: UiCuUndertakingDetailsComponent })
  public uiCuUndertakingDetails: UiCuUndertakingDetailsComponent;
  @ViewChild(UiCuNarrativeComponent, { read: UiCuNarrativeComponent }) public uiCuNarrativeDetails: UiCuNarrativeComponent;



  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected confirmationService: ConfirmationService, protected amendCommonService: AmendCommonService,
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
    const sectionName = FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS;
    this.form = this.productStateService.getSectionData(sectionName, undefined, this.isMasterRequired);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
  }

  ngOnDestroy() {
    this.productStateService.setStateSection(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS, this.form, this.isMasterRequired);
  }

  ngAfterViewInit() {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const formAccordionPanels = this.form.get('uiCuCounterDetails')[FccGlobalConstant.PARAMS][`formAccordionPanels`];
    if (tnxTypeCode === FccGlobalConstant.N002_NEW || tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const generalDetailsForm: FCCFormGroup =
      this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired);
      const toggleSections = [FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS];
      this.toggelFormAccordionPanel(this.form, formAccordionPanels, [FccGlobalConstant.UI_COUNTER_EXTENSION_DETAILS], false);
      this.toggelFormAccordionPanel(this.form, formAccordionPanels, [FccGlobalConstant.UI_COUNTER_PAYMENT_DETAILS], false);
      if (generalDetailsForm.get('purposeUI') && (generalDetailsForm.get('purposeUI').value === '02' ||
      generalDetailsForm.get('purposeUI').value === '03')) {
        this.toggelFormAccordionPanel(this.form, formAccordionPanels, toggleSections, true);
      } else {
        this.toggelFormAccordionPanel(this.form, formAccordionPanels, toggleSections, false);
      }
    }
    // Show extension section only in case of Fixed Expiry type(02).
    const typeExpiryForm = this.form.get('uiCuGeneralDetails');
    if (typeExpiryForm.get('cuExpDateTypeCode') && (typeExpiryForm.get('cuExpDateTypeCode').value === '01'
    || typeExpiryForm.get('cuExpDateTypeCode').value === '03') || (this.tnxTypeCode === FccGlobalConstant.N002_AMEND
      && (typeExpiryForm.get('cuExpDateTypeCode') && (typeExpiryForm.get('cuExpDateTypeCode').value[0].value === '01' ||
      typeExpiryForm.get('cuExpDateTypeCode').value[0].value === '03')) ||
      typeExpiryForm.get('cuExpDateTypeCode') && typeExpiryForm.get('cuExpDateTypeCode').value === null)) {
      this.toggelFormAccordionPanel(this.form, formAccordionPanels, [FccGlobalConstant.UI_COUNTER_EXTENSION_DETAILS], false);
    } else if (typeExpiryForm.get('cuExpDateTypeCode') && (typeExpiryForm.get('cuExpDateTypeCode').value === '02' ||
    (typeExpiryForm.get('cuExpDateTypeCode').value[0].value === '02'))) {
      this.toggelFormAccordionPanel(this.form, formAccordionPanels, [FccGlobalConstant.UI_COUNTER_EXTENSION_DETAILS], true);
    }

    // Stand By
    if (typeExpiryForm.get('cuSubProductCode') && (typeExpiryForm.get('cuSubProductCode').value === FccGlobalConstant.STBY ||
    (this.tnxTypeCode === FccGlobalConstant.N002_AMEND
      && typeExpiryForm.get('cuSubProductCode').value[0].value === FccGlobalConstant.STBY))){
      this.toggelFormAccordionPanel(this.form, formAccordionPanels, [FccGlobalConstant.UI_COUNTER_PAYMENT_DETAILS], true);
    } else {
      this.toggelFormAccordionPanel(this.form, formAccordionPanels, [FccGlobalConstant.UI_COUNTER_PAYMENT_DETAILS], false);
    }
  }
  amendFormFields() {
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    if ((mode !== FccGlobalConstant.VIEW_MODE && operation !== FccGlobalConstant.PREVIEW) ||
    (mode === FccGlobalConstant.VIEW_MODE && operation === FccGlobalConstant.LIST_INQUIRY)) {
    this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.UI_CU_COUNTER_UNDERTAKING_DETAILS);
    }
  }
}
