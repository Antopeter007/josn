import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { AmendCommonService } from '../../../../../common/services/amend-common.service';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { SiProductComponent } from '../si-product/si-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FormModelService } from './../../../../../../common/services/form-model.service';
import { LcTemplateService } from './../../../../../../common/services/lc-template.service';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { LcConstant } from './../../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { ImportLetterOfCreditResponse } from './../../../../../../corporate/trade/lc/initiation/model/models';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { LcReturnService } from './../../../../../../corporate/trade/lc/initiation/services/lc-return.service';
import { PrevNextService } from './../../../../../../corporate/trade/lc/initiation/services/prev-next.service';
import { UtilityService } from './../../../../../../corporate/trade/lc/initiation/services/utility.service';
import {
  compareLastShipmentDate,
  compareNewExpiryDateToOld,
  earlierDateGreaterThanExpiryDate,
  earlierDateGreaterThanLastDate,
  lastDateLesserThanEarlierDate
} from './../../../../../../corporate/trade/lc/initiation/validator/ValidateLastShipDate';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-si-shipment-details',
  templateUrl: './si-shipment-details.component.html',
  styleUrls: ['./si-shipment-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiShipmentDetailsComponent }]
})
export class SiShipmentDetailsComponent extends SiProductComponent implements OnInit, OnDestroy {
  form: FCCFormGroup;
  shipmentFormLength;
  module: string;
  subheader = '';
  shipmentForm = 'shipmentForm';
  shipmentTo = 'shipmentTo';
  placeOfLoading = 'shipmentPlaceOfLoading';
  placeOfDischarge = 'shipmentPlaceOfDischarge';
  lastShipmentDate = 'shipmentLastDate';
  shipmentPeriod = 'shipmentPeriod';
  partialshipment = 'partialshipment';
  transhipment = 'transhipment';
  purchaseTerms = 'purchaseTerms';
  namedPlace = 'namedPlace';
  exwork = 'exwork';
  freecarrier = 'freecarrier';
  freealong = 'freealong';
  freeboard = 'freeboard';
  costandfreight = 'costandfreight';
  costinfreight = 'costinfreight';
  deleverdterminal = 'deleverdterminal';
  deleverdplace = 'deleverdplace';
  carriagepaid = 'carriagepaid';
  carriageinsurance = 'carriageinsurance';
  deleverdpaid = 'deleverdpaid';
  allowed = 'allowed';
  conditional = 'conditional';
  notallowed = 'notallowed';
  params = 'params';
  enteredCharCount = 'enteredCharCount';
  warning = 'warning';
  warningmessage = 'warningmessage';
  label = 'label';
  readonly = 'readonly';
  year2020 = '2020';
  year2010 = '2010';
  yearOther = 'OTHER';
  summaryDetails: any;
  expiryDate: any;
  lcResponseForm = new ImportLetterOfCreditResponse();
  lcConstant = new LcConstant();
  rendered = this.lcConstant.rendered;
  allowedCharCount = this.lcConstant.allowedCharCount;
  tnxTypeCode: any;
  purchasetermsvalue: SelectItem[] = [];
  termValues = [];
  incoTermsRules = [];
  expiryDateBackToBack: any;
  shipmentNamedPlaceLength;
  option;
  incotermsDetails: any;
  sectionName = FccGlobalConstant.SI_SHIPMENT_DETAILS;
  mutualExclusiveMessage = 'mutualExclusiveMessage';
  shipmentDate = 'shipmentLastDate';
  shipmentPeriodTxt = 'shipmentPeriodText';
  mode: any;
  expiryType: any;
  isMasterRequired: any;
  enquiryRegex;
  fieldNames = [];
  regexType: string;
  swiftZchar;
  productCode: any;
  shipmentStandardConfig;
  hideFields : any;
  swiftXCharRegex: string;
  modeValue: any;
  maxlength: any;
  currentSwiftVersion : any;
  applicableVal: any;
  constructor(protected router: Router, protected translationService: TranslateService, protected lcReturnService: LcReturnService,
              protected leftSectionService: LeftSectionService,
              protected utilityService: UtilityService, protected prevNextService: PrevNextService,
              protected lcTemplateService: LcTemplateService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected commonService: CommonService, protected stateService: ProductStateService,
              protected emitterService: EventEmitterService, protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected amendCommonService: AmendCommonService,
              protected confirmationService: ConfirmationService, protected resolverService: ResolverService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected siProductService: SiProductService
  ) {
    super(emitterService, stateService, commonService, translationService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, siProductService);
    this.module = `${this.translationService.instant(FccGlobalConstant.SI_SHIPMENT_DETAILS)}`;
  }

  ngOnInit() {
    this.getIncotermsDetails();
    super.ngOnInit();
    this.isMasterRequired = this.isMasterRequired;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.productCode = this.commonService.getQueryParametersFromKey (FccGlobalConstant.PRODUCT);
    this.modeValue = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.mode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    window.scroll(0, 0);
    this.initializeFormGroup();
    this.expiryDate = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('expiryDate').value;
    this.form.get('purchaseTermsValue')[this.params][this.readonly] = this.form.get('incoTermsRules').value ? false : true;
    this.patchLayoutForReadOnlyMode();


    this.fieldNames = ['shipmentForm', 'shipmentTo',
    'shipmentPlaceOfLoading', 'shipmentPlaceOfDischarge', 'shipmentPeriodText'];
    
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.enquiryRegex = response.swiftXCharacterSet;
        this.swiftZchar = response.swiftZChar;
        this.shipmentNamedPlaceLength = response.shipmentNamedPlaceLength;
        this.shipmentStandardConfig = response.ShipmentPeriodConfig;
        const clearFieldData = ['shipmentForm', 'shipmentTo',
        'shipmentPlaceOfLoading', 'shipmentPlaceOfDischarge', 'shipmentPeriodText'];
        if(this.shipmentStandardConfig === 'false'){
          clearFieldData.push('shipmentName');
          this.fieldNames.push('shipmentName');
        }
        this.clearingFormValidators(clearFieldData);
        this.fieldNames.forEach(ele => {
          this.form.get(ele).clearValidators();
          this.commonService.getSwiftVersionValue();
          for(let i=0; i<this.form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.APPLICABLE_VALIDATION].length; i++){
          
          this.applicableVal = this.form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.APPLICABLE_VALIDATION];
          this.currentSwiftVersion = this.applicableVal[i][FccGlobalConstant.SWIFTVERSION];
          if(this.currentSwiftVersion === this.commonService.swiftVersion) {
            if((ele === FccGlobalConstant.SHIPMENT_FORM) || (ele === FccGlobalConstant.SHIPMENT_TO) 
            || (ele === FccGlobalConstant.PLACE_OF_LOAD) || (ele == FccGlobalConstant.PLACE_OF_DISCHARGE)){
            this.regexType = this.applicableVal[i][FccGlobalConstant.CHARACTER_VALIDATION];
            this.maxlength = this.applicableVal[i][FccGlobalConstant.MAXLENGTH];
            if(this.commonService.swiftVersion !== FccGlobalConstant.SWIFT_2023){
            this.form.get(ele)[this.params][this.allowedCharCount] = this.maxlength;
            this.form.get(ele)[this.params]['maxlength'] = this.maxlength;
            }
            this.form.addFCCValidators(ele, Validators.maxLength(this.maxlength), 0);
            }
            if(ele === 'shipmentName'){
                this.regexType =this.applicableVal[i][FccGlobalConstant.CHARACTER_VALIDATION];
            }
          }
          
          if(ele === FccGlobalConstant.SHIPMENT_PERIOD_TEXT){
            this.regexType =this.applicableVal[0][FccGlobalConstant.CHARACTER_VALIDATION];
            }
          if(this.regexType !== null){
            if((this.mode === FccBusinessConstantsService.SWIFT) ||
            (this.mode[0] && this.mode[0].value === FccBusinessConstantsService.SWIFT)){
              if (this.regexType === FccGlobalConstant.SWIFT_Z) {
                this.regexType = this.swiftZchar;
              }
         else if (this.regexType === FccGlobalConstant.SWIFT_X) {
            this.regexType = this.enquiryRegex;
          }
          if (this.commonService.validateProduct(this.form, ele, this.productCode)) {
            this.form.addFCCValidators(ele, Validators.pattern(this.regexType), 0);

        }
      }
    }
  
          }
          if(this.shipmentStandardConfig === 'false' && this.mode === FccBusinessConstantsService.SWIFT
            && ele === 'shipmentName'){
            this.form.get(ele).clearValidators();
            this.form.addFCCValidators(ele, Validators.pattern(this.regexType), 0);
          }else if(ele === 'shipmentName'){
            this.form.get(ele).clearValidators();
          }
        });
        this.form.updateValueAndValidity();
      }
  });

    if (this.commonService.getShipmentExpiryDateForBackToBack()) {
      const dateParts = this.commonService.getShipmentExpiryDateForBackToBack().toString().split('/');
      this.expiryDateBackToBack = new Date(dateParts[FccGlobalConstant.LENGTH_2],
        dateParts[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1, dateParts[FccGlobalConstant.LENGTH_0]);
      this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).patchValue(this.expiryDateBackToBack);
    }
    if (this.commonService.getClearBackToBackLCfields() === 'yes') {
      const fields = ['shipmentForm', 'shipmentTo', 'shipmentPlaceOfLoading', 'shipmentPlaceOfDischarge', 'shipmentPeriodText',
        'incoTermsRules', 'purchaseTermsValue', 'namedPlace'];
      fields.forEach(ele => {
        this.form.get(ele).setValue('');
        this.form.get(ele).updateValueAndValidity();
      });
    }
    if (this.form.get('incoTermsRules') && this.form.get('incoTermsRules').value && this.context !== 'view') {
       this.setPurchaseTermField();
    }
    this.form.get('namedPlace')[this.params][FccGlobalConstant.MAXLENGTH] = this.shipmentNamedPlaceLength;
    if (this.mode === FccBusinessConstantsService.SWIFT) {
      this.form.get('namedPlace').setValidators([Validators.pattern(this.swiftZchar)]);
      this.form.get('namedPlace').updateValueAndValidity();
    }
    this.commonService.checkForBankName(this.stateService, this.form, FccGlobalConstant.SI_BANK_DETAILS,
      FccGlobalConstant.SI_ISSUING_BANK, FccGlobalConstant.INCO_TERMS_RULES, FccGlobalConstant.INCO_TERM_RULES_MESSAGE);
    this.updateValues();
    this.updateNarrativeCount();
    if (this.shipmentStandardConfig === 'true') {
      this.form.get('shipmentPeriod')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('shipmentPeriodvalue').setValue(null);
      this.form.get('shipmentName')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('shipmentEarliestDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('shipmentPeriodvalue')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    if (this.modeValue === FccGlobalConstant.DRAFT_OPTION ) {
      this.form.markAllAsTouched();
    }
  }
}
  updateNarrativeCount() {
    if (this.form.get('shipmentPeriodText').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('shipmentPeriodText').value);
      this.form.get('shipmentPeriodText')[this.params][this.enteredCharCount] = count;
    }
  }

  updateValues() {
    this.onClickPartialshipmentvalue();
    this.onClickTranshipmentvalue();
    this.onClickShipmentPeriodvalue();
    this.onClickShipmentEarliestDate();
    this.onClickShipmentLastDate();
    this.onBlurShipmentPeriodText();
  }

  onClickShipmentEarliestDate() {
    this.calculateShipmentEarliestDate();
  }

  calculateShipmentEarliestDate(){
    const shipmentDate = this.form.get('shipmentEarliestDate');
    const shipmentEarliestDate = this.form.get('shipmentEarliestDate').value;
    const shipmentLastDate = this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).value;
    const expDate = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('expiryDate').value;
    if (((shipmentLastDate && this.commonService.isnonEMptyString(shipmentEarliestDate))
      && (shipmentEarliestDate && this.commonService.isnonEMptyString(shipmentEarliestDate.value)))
      && (shipmentEarliestDate > shipmentLastDate)) {
      shipmentDate.setValidators([earlierDateGreaterThanLastDate]);
      shipmentDate.updateValueAndValidity();
    }
    else if (((expDate && this.commonService.isnonEMptyString(expDate))
      && this.commonService.isnonEMptyString(shipmentEarliestDate)) && (shipmentEarliestDate > expDate)){
      shipmentDate.setValidators([earlierDateGreaterThanExpiryDate]);
      shipmentDate.updateValueAndValidity();
    }
    else {
      if ((shipmentLastDate && shipmentLastDate != '' && shipmentLastDate != null) &&
        (this.form.controls['shipmentLastDate'].errors != null)) {
        this.calculateShipmentLastDate();
      } else {
        shipmentDate.clearValidators();
        shipmentDate.updateValueAndValidity();
      }
   }
 }

 calculateShipmentLastDate(){
    const shipmentEarliestDate = this.form.get('shipmentEarliestDate').value;
    const lastshipmentdate = this.form.get('shipmentLastDate').value;
    const shipPeriodValue = this.form.get('shipmentPeriodvalue').value;
    if (((shipmentEarliestDate && this.commonService.isnonEMptyString(shipmentEarliestDate)) ||
       (shipPeriodValue === FccGlobalConstant.SHIPMENT_PERIOD_NO))
      && (this.commonService.isnonEMptyString(lastshipmentdate) && this.expiryDate !== '' && lastshipmentdate > this.expiryDate)) {
      this.form.get('shipmentLastDate').setValidators([compareLastShipmentDate]);
      this.form.get('shipmentLastDate').updateValueAndValidity();
    } else if (shipmentEarliestDate && (this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).value < shipmentEarliestDate) ) {
      this.form.get('shipmentLastDate').setValidators([lastDateLesserThanEarlierDate]);
      this.form.get('shipmentLastDate').updateValueAndValidity();
    } else {
      if ((shipmentEarliestDate && shipmentEarliestDate != '' && shipmentEarliestDate != null)&&
       (this.form.controls['shipmentEarliestDate'].errors != null)) {
        this.calculateShipmentEarliestDate();
      } else {
        this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).clearValidators();
        this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).updateValueAndValidity();
      }
    }
 }

 onClickShipmentPeriodvalue() {
  if(this.shipmentStandardConfig === 'false') {
  const shipPeriodValue = this.form.get('shipmentPeriodvalue').value;
    if (shipPeriodValue === FccGlobalConstant.SHIPMENT_PERIOD_NO) {
      this.hideFields = ['shipmentEarliestDate', 'shipmentPeriodText'];
      this.form.get('shipmentPeriodvalue').clearValidators();
      this.form.get('shipmentPeriodText').clearValidators();
      this.form.get('shipmentEarliestDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('shipmentLastDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('shipmentPeriodText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      if (this.option !== FccGlobalConstant.TEMPLATE) {
        this.form.get('shipmentLastDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      }
    } else if (shipPeriodValue === FccGlobalConstant.SHIPMENT_PERIOD_YES) {
      this.hideFields = ['shipmentEarliestDate', 'shipmentLastDate'];
      this.form.get('shipmentPeriodvalue').clearValidators();
      this.form.get('shipmentPeriodText').clearValidators();
      this.form.get('shipmentEarliestDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('shipmentLastDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('shipmentPeriodText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      if (this.option !== FccGlobalConstant.TEMPLATE) {
        this.form.get('shipmentPeriodText')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      }
    } else if (shipPeriodValue === FccGlobalConstant.SHIPMENT_PERIOD_BETWEEN) {
      this.hideFields = ['shipmentPeriodText'];
      this.form.get('shipmentPeriodvalue').clearValidators();
      this.form.get('shipmentPeriodText').clearValidators();
      this.form.get('shipmentEarliestDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('shipmentPeriodText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('shipmentLastDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      if (this.option !== FccGlobalConstant.TEMPLATE) {
        this.form.get('shipmentEarliestDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        this.form.get('shipmentLastDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      }
    }
    this.setValueToNull(this.hideFields);
    this.form.get('shipmentPeriodvalue').updateValueAndValidity();
    this.form.get('shipmentPeriodText').updateValueAndValidity();
    this.form.updateValueAndValidity();
}
 }

setValueToNull(fieldName: any[]) {
  let index: any;
  for (index = 0; index < fieldName.length; index++) {
    this.form.controls[fieldName[index]].setValue('');
  }
}

  patchLayoutForReadOnlyMode() {
    if (this.form.getFormMode() === 'view') {

      const controls = Object.keys(this.form.controls);
      let index: any;
      for (index = 0; index < controls.length; index++) {
        this.viewModeChange(this.form, controls[index]);
      }
    }
  }

  clearingFormValidators(fields: any){
    for (let i = 0; i < fields.length; i++) {
      this.form.get(fields[i]).clearValidators();
    }
  }

  ngOnDestroy() {
    this.stateService.setStateSection(FccGlobalConstant.SI_SHIPMENT_DETAILS, this.form, this.isMasterRequired);
  }

  setDateValidation() {
    const shipPeriodValue = this.form.get('shipmentPeriodvalue').value;
    const shipmentEarliestDate = this.form.get('shipmentEarliestDate').value;
    const shipmentLastDate = this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).value;
    if((this.shipmentStandardConfig === 'false') && (shipPeriodValue === FccGlobalConstant.SHIPMENT_PERIOD_BETWEEN)){
      if (this.commonService.isnonEMptyString(shipmentEarliestDate)) {
        if (this.option !== FccGlobalConstant.TEMPLATE) {
          this.form.get('shipmentEarliestDate')[this.params][FccGlobalConstant.REQUIRED] = true;
          this.form.get('shipmentEarliestDate').setValidators([Validators.required]);
          this.form.get('shipmentEarliestDate').setErrors({ required: true });
        }
    }
    if (this.commonService.isnonEMptyString(shipmentLastDate)) {
      if (this.option !== FccGlobalConstant.TEMPLATE) {
        this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD)[this.params][FccGlobalConstant.REQUIRED] = true;
        this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).setValidators([Validators.required]);
        this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).setErrors({ required: true });
      }
  }
  }
}

  onClickPartialshipmentvalue() {
    this.toggleValue(this.form.get('partialshipmentvalue').value, 'partialshipmentvalue');
  }

  onClickTranshipmentvalue() {
    this.toggleValue(this.form.get('transhipmentvalue').value, 'transhipmentvalue');
  }
  onClickIncoTermsRules() {
    if (this.form.get('incoTermsRules').value) {
      this.form.get('purchaseTermsValue')[this.params][this.readonly] = false;
      this.setMandatoryField(this.form, 'purchaseTermsValue', true);
      this.setPurchaseTerms();
    }
    this.removeMandatory(['purchaseTermsValue']);
  }

  setPurchaseTermField() {
    if (this.form.get('incoTermsRules').value) {
      this.form.get('purchaseTermsValue')[this.params][this.readonly] = false;
      this.setMandatoryField(this.form, 'purchaseTermsValue', true);
      this.setPurchaseTerms();
    }
  }


  onClickPurchaseTermsValue(event) {
    this.mode = this.mode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    const termsValue = event.value;
    if (termsValue !== undefined) {
      if (termsValue !== '') {
        this.setMandatoryField(this.form, 'namedPlace', true);
      } else if (termsValue === '') {
        this.form.get('namedPlace').reset();
        this.setMandatoryField(this.form, 'namedPlace', false);
        this.form.get('namedPlace').clearValidators();
        if (this.mode === FccBusinessConstantsService.SWIFT) {
          this.form.get('namedPlace').setValidators(Validators.pattern(this.fccGlobalConstantService.getSwiftRegexPattern()));
        }
      }
      this.form.get('namedPlace').updateValueAndValidity();
    }
    this.removeMandatory(['namedPlace']);
  }

  toggleValue(value, feildValue) {
    if (value === 'CONDITIONAL') {
      this.form.get(feildValue)[this.params][this.warning] = `${this.translationService.instant(this.warningmessage)}`;
    } else {
      this.form.get(feildValue)[this.params][this.warning] = '';
    }
  }

  onClickShipmentLastDate() {
    if (this.shipmentStandardConfig === 'true') {
      if (this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).value && this.expiryDateBackToBack &&
        this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).value > this.expiryDateBackToBack) {
        this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).setValidators([compareNewExpiryDateToOld]);
        this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).updateValueAndValidity();
      } else {
        this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).clearValidators();
        this.form.get(FccGlobalConstant.SHIPMENT_DATE_FIELD).updateValueAndValidity();
      }
      let flag = false;

      const expTypeSecData = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get(FccGlobalConstant.EXPIRY_TYPE_SI);
      if (expTypeSecData && this.commonService.isnonEMptyString(expTypeSecData.value)) {
          this.expiryType = expTypeSecData.value;
          if (this.expiryType === FccGlobalConstant.EXP_TYPE_VALUE_SPECIFIC) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            flag = true;
        }
      }
      const lastshipmentdate = this.form.get('shipmentLastDate').value;
      const previewScreenToggleControls = ['shipmentPeriodText'];
      if (lastshipmentdate !== null && lastshipmentdate !== '') {
        this.form.get('shipmentPeriodText')[this.params][this.readonly] = true;
        this.form.controls[this.shipmentPeriodTxt].disable();
        this.togglePreviewScreen(this.form, previewScreenToggleControls, false);
        this.form.get('shipmentLastDate')[this.params][this.warning] = `${this.translationService.instant(this.mutualExclusiveMessage)}`;
      } else if (lastshipmentdate === null || lastshipmentdate === '') {
        this.patchFieldParameters(this.form.get('shipmentPeriodText'), { readonly: false });
        this.form.controls[this.shipmentPeriodTxt].enable();
        this.form.get('shipmentPeriodText')[this.params][this.rendered] = true;
        this.form.get('shipmentLastDate')[this.params][this.warning] = FccGlobalConstant.EMPTY_STRING;
        this.togglePreviewScreen(this.form, previewScreenToggleControls, true);
      }
      if (lastshipmentdate !== null && lastshipmentdate !== '' && this.expiryDate && lastshipmentdate > this.expiryDate) {
        this.form.get('shipmentLastDate').setValidators([compareLastShipmentDate]);
        this.form.get('shipmentLastDate').updateValueAndValidity();
      } else {
        this.form.get('shipmentLastDate').clearValidators();
        this.form.get('shipmentLastDate').updateValueAndValidity();
      }
      this.form.get('shipmentPeriodText').updateValueAndValidity();
      this.form.updateValueAndValidity();
    } else {
      this.calculateShipmentLastDate();
    }
  }

  
  onBlurShipmentLastDate() {
    const lastshipmentdate = this.form.get('shipmentLastDate').value;
    if (lastshipmentdate !== null && lastshipmentdate !== '' && this.shipmentStandardConfig === 'true') {
      this.form.get('shipmentPeriodText')[this.params][this.readonly] = true;
      this.form.controls[this.shipmentPeriodTxt].disable();
      this.form.get('shipmentLastDate')[this.params][this.warning] = `${this.translationService.instant(this.mutualExclusiveMessage)}`;
    } else if ((lastshipmentdate === null || lastshipmentdate === '') && this.shipmentStandardConfig === 'true') {
      this.patchFieldParameters(this.form.get('shipmentPeriodText'), { readonly: false });
      this.form.controls[this.shipmentPeriodTxt].enable();
      this.form.get('shipmentPeriodText')[this.params][this.rendered] = true;
      this.form.get('shipmentLastDate')[this.params][this.warning] = FccGlobalConstant.EMPTY_STRING;
    }
    if (lastshipmentdate !== null && lastshipmentdate !== '' && lastshipmentdate > this.expiryDate && this.expiryDate !== '') {
      this.form.get('shipmentLastDate').setValidators([compareLastShipmentDate]);
      this.form.get('shipmentLastDate').updateValueAndValidity();
    } else {
      this.form.get('shipmentLastDate').clearValidators();
      this.form.get('shipmentLastDate').updateValueAndValidity();
    }
    this.form.get('shipmentPeriodText').updateValueAndValidity();
  }
  onBlurShipmentPeriodText() {
    if (this.shipmentStandardConfig === 'true') {
      const previewScreenToggleControls = ['shipmentLastDate'];
      if (this.form.get('shipmentPeriodText')['type'] === 'highlight-texteditor' &&
      this.form.get('shipmentPeriodText').value === '\n') {
        this.form.get('shipmentPeriodText').setValue('');
        this.form.get('shipmentPeriodText').updateValueAndValidity();
      }
      const shipmentPeriod = this.form.get('shipmentPeriodText').value;
      if (shipmentPeriod !== null && shipmentPeriod !== '') {
        this.form.get('shipmentLastDate').setValue('');
        this.patchFieldParameters(this.form.get('shipmentLastDate'), { readonly: true });
        this.form.controls[this.shipmentDate].disable();
        this.togglePreviewScreen(this.form, previewScreenToggleControls, false);
        if (this.mode === FccBusinessConstantsService.SWIFT) {
          this.form.get('shipmentPeriodText').setValidators([Validators.pattern(this.enquiryRegex)]);
            this.form.get('shipmentPeriodText').updateValueAndValidity();
        }
        this.form.get('shipmentLastDate')[this.params][this.warning] = `${this.translationService.instant(this.mutualExclusiveMessage)}`;
      } else if (shipmentPeriod === '') {
        this.form.get('shipmentPeriodText').setErrors({ required: false });
        this.patchFieldParameters(this.form.get('shipmentLastDate'), { readonly: false });
        this.form.controls[this.shipmentDate].enable();
        this.togglePreviewScreen(this.form, previewScreenToggleControls, true);
        this.form.get('shipmentLastDate')[this.params][this.warning] = FccGlobalConstant.EMPTY_STRING;
      }
      this.form.get('shipmentLastDate').updateValueAndValidity();
      this.form.get(FccGlobalConstant.SHIPMENT_PERIOD_TEXT).updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }

  initializeFormGroup() {
    this.form = this.stateService.getSectionData(this.sectionName, FccGlobalConstant.PRODUCT_SI, this.isMasterRequired);
    this.patchFieldParameters(this.form.get('incoTermsRules'), { options: this.incoTermsRules });
    this.patchFieldParameters(this.form.get('purchaseTermsValue'), { amendinfo: true });
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
  }

  amendFormFields() {
    const purchaseTermsValue = this.stateService.getValue(FccGlobalConstant.SI_SHIPMENT_DETAILS, 'purchaseTermsValue', false);
    const incoTermsRules = this.stateService.getValue(FccGlobalConstant.SI_SHIPMENT_DETAILS, 'incoTermsRules', false);
    if (purchaseTermsValue !== undefined && purchaseTermsValue !== '') {
      this.setPurchaseTerms();
      const exist = this.termValues.filter(task => task.label === purchaseTermsValue);
      if (exist.length > 0) {
        this.form.get('purchaseTermsValue').setValue(this.termValues.filter(
          task => task.label === purchaseTermsValue)[0].value);
      }
    }
    if ((incoTermsRules !== undefined && incoTermsRules !== '')) {
      this.getIncotermsDetails();
      const exist = this.incoTermsRules.filter(task => task.label === incoTermsRules);
      if (exist.length > 0) {
      this.form.get('incoTermsRules').setValue(this.incoTermsRules.filter(
        task => task.label === incoTermsRules)[0].value);
      }
    }
    this.amendCommonService.setValueFromMasterToPrevious(this.sectionName);
  }

  onChangeincoTermsRules() {
    this.form.get('purchaseTermsValue').setValue('');
    this.form.get('namedPlace').setValue('');
    this.setMandatoryField(this.form, 'namedPlace', false);
    this.form.get('namedPlace').updateValueAndValidity();

  }

  removeMandatory(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }

  getIncotermsDetails() {
    this.corporateCommonService.getValues(this.fccGlobalConstantService.incotermDetails).subscribe(
      response => {
        if (response.status === FccGlobalConstant.LENGTH_200) {
          const sectionForm : FCCFormGroup = this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS);
          const sectionForm2 : FCCFormGroup = sectionForm.get(FccGlobalConstant.SI_ISSUING_BANK) as FCCFormGroup;
          let bankName;
          if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
            bankName = sectionForm2.get('bankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] ?
                sectionForm2.get('bankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS][0].value :
                sectionForm2.get('bankNameList').value;
          } else {
            bankName = sectionForm2.get('bankNameList').value;
          }
          if (bankName !== undefined || bankName !== '') {
            this.handleIncoTerms(response, bankName);
          }
        }
      });
  }

  protected handleIncoTerms(response: any, bankName: any) {
    this.incotermsDetails = response.body.incotermDetailsList;
    if (this.incotermsDetails !== undefined && this.incotermsDetails.length > 0) {
      for (const i of this.incotermsDetails) {
        const respBank = i.bankName;
        if (bankName === respBank || respBank === '*') {
          const largeParamKeyListarr = i.largeParamKeyList;
          for (const j of largeParamKeyListarr) {
            const incoRules = j.incotermsRules;
            this.incoTermsRules.push({ label: incoRules, value: incoRules });
          }
        }
      }
    }
  }

  setPurchaseTerms() {
    const incotermValue = this.form.get('incoTermsRules').value;
    const sectionForm : FCCFormGroup = this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS);
    const sectionForm2: FCCFormGroup = sectionForm.get(FccGlobalConstant.SI_ISSUING_BANK) as FCCFormGroup;
    let bankName;
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      bankName = sectionForm2.get('bankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] ?
                sectionForm2.get('bankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS][0].value :
                sectionForm2.get('bankNameList').value;
    } else {
      bankName = sectionForm2.get('bankNameList').value;
    }
    if (bankName !== undefined && bankName !== '' && this.incotermsDetails !== undefined && this.incotermsDetails.length > 0) {
      for (let i = 0; i < this.incotermsDetails.length; i++) {
        const respBank = this.incotermsDetails[i].bankName;
        this.checkBankName(bankName, respBank, i, incotermValue);
      }
    }
    this.patchFieldParameters(this.form.get('purchaseTermsValue'), { options: this.termValues });
  }


  protected checkBankName(bankName: any, respBank: any, i: number, incotermValue: any) {
    if (bankName === respBank || respBank === '*') {
      const largeParamKeyListarr = this.incotermsDetails[i].largeParamKeyList;
      for (let j = 0; j < largeParamKeyListarr.length; j++) {
        const incoRules = largeParamKeyListarr[j].incotermsRules;
        if (incotermValue === incoRules) {
          this.termValues = [];
          const incoparams = largeParamKeyListarr[j].incotermValues;
          for (let k = 0; k < incoparams.length; k++) {
            this.termValues.push({ label: `${this.translationService.instant(incoparams[k])}`, value: incoparams[k] });
          }

        }
      }
    }
  }

  onBlurShipmentName() {
    if(this.mode === FccBusinessConstantsService.SWIFT) {
        const shipmentName = this.form.get('shipmentName').value;
        if(shipmentName !== null && shipmentName !== '') {
          this.form.get('shipmentName').setValidators([Validators.pattern(this.swiftZchar)]);
      }
    }
    this.form.get('shipmentName').updateValueAndValidity();
    this.form.updateValueAndValidity();
  }
}
