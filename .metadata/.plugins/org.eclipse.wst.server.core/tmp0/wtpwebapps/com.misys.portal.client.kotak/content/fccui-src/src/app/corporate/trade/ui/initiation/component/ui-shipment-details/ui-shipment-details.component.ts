import { UiService } from './../../../common/services/ui-service';
import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogRef } from 'primeng';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
@Component({
  selector: 'app-ui-shipment-details',
  templateUrl: './ui-shipment-details.component.html',
  styleUrls: ['./ui-shipment-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiShipmentDetailsComponent }]
})
export class UiShipmentDetailsComponent extends UiProductComponent implements OnInit {

  module = ``;
  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  swiftXChar: any;
  swiftZchar: any;
  readonly = 'readonly';
  params = 'params';
  warning = 'warning';
  warnmessage= 'warnmessage';
  purchasetermsvalue: SelectItem[] = [];
  termValues = [];
  incoTermsRules = [];
  incotermsDetails: any;
  option;
  shipmentStandardConfig;
  transmissionMode: any;
  applicableVal: any;
  currentSwiftVersion : any;
  fieldNames = [];
  regexType: string;
  maxlength: any;
  allowedCharCount = FccGlobalConstant.ALLOWED_CHAR_COUNT;
  productCode: any;
  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected corporateCommonService: CorporateCommonService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected confirmationService: ConfirmationService, protected uiService: UiService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {
              super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {
    this.getIncotermsDetails();
    this.initializeFormGroup();
    this.transmissionMode =
    this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
    this.form.get('purchaseTermsValue')[this.params][this.readonly] = this.form.get('incoTermsRules').value ? false : true;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.productCode = this.commonService.getQueryParametersFromKey (FccGlobalConstant.PRODUCT);
    this.fieldNames = ['shipmentForm', 'shipmentTo',
    'shipmentPlaceOfLoading', 'shipmentPlaceOfDischarge', 'namedPlace'];
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftXChar = response.swiftXCharacterSet;
        this.swiftZchar = response.swiftZChar;
        this.shipmentStandardConfig = response.ShipmentPeriodConfig;
        this.clearingFormValidators(['shipmentForm', 'shipmentTo',
        'shipmentPlaceOfLoading', 'shipmentPlaceOfDischarge', 'namedPlace']);
        this.fieldNames.forEach(ele => {
          this.form.get(ele).clearValidators();
          this.commonService.getSwiftVersionValue();
          if (this.form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.APPLICABLE_VALIDATION]
          && this.form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.APPLICABLE_VALIDATION].length){
          for(let i=0; i<this.form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.APPLICABLE_VALIDATION].length; i++){
            this.applicableVal = this.form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.APPLICABLE_VALIDATION];
            this.currentSwiftVersion = this.applicableVal[i][FccGlobalConstant.SWIFTVERSION];
            if(this.currentSwiftVersion === this.commonService.swiftVersion) {
              if((ele === FccGlobalConstant.SHIPMENT_FORM) || (ele === FccGlobalConstant.SHIPMENT_TO)
              || (ele === FccGlobalConstant.PLACE_OF_LOAD) || (ele == FccGlobalConstant.PLACE_OF_DISCHARGE)){
              this.regexType = this.applicableVal[i][FccGlobalConstant.CHARACTER_VALIDATION];
              this.maxlength = this.applicableVal[i][FccGlobalConstant.MAXLENGTH];
              if(this.commonService.swiftVersion !== FccGlobalConstant.SWIFT_2023){
              this.form.get(ele)[this.params][this.allowedCharCount] = '65';
              this.form.get(ele)[this.params]['maxlength'] = '65';
              }
              this.form.addFCCValidators(ele, Validators.maxLength(this.maxlength), 0);
              }
            }
            if(ele === FccGlobalConstant.NAMED_PLACE){
              this.regexType =this.applicableVal[0][FccGlobalConstant.CHARACTER_VALIDATION];
            }
            if(this.regexType !== null){
              if((this.transmissionMode === FccBusinessConstantsService.SWIFT) ||
              (this.transmissionMode[0] && this.transmissionMode[0].value === FccBusinessConstantsService.SWIFT)){
                if (this.regexType === FccGlobalConstant.SWIFT_Z) {
                  this.regexType = this.swiftZchar;
                }
                else if (this.regexType === FccGlobalConstant.SWIFT_X){
                this.regexType = this.swiftXChar;
                }
                if (this.commonService.validateProduct(this.form, ele, this.productCode)){
                  this.form.addFCCValidators(ele, Validators.pattern(this.regexType), 0);
                }
              }
            }
          }
        }
        });
        this.form.updateValueAndValidity();
      }
    });
    if (this.form.get('incoTermsRules') && this.form.get('incoTermsRules').value && this.context !== 'view') {
      this.setPurchaseTermField();
   }
  if (this.shipmentStandardConfig === 'true'){
    this.form.get('shipmentName')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('shipmentEarliestDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('shipmentPeriodText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('shipmentPeriodvalue')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('shipmentPeriodvalue').setValue(null);
    this.form.get('shipmentPeriod')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
  }
  if (this.shipmentStandardConfig === 'false'){
    this.onClickShipmentPeriodvalue(this.form.get('shipmentPeriodvalue'));
    this.onClickShipmentEarliestDate();
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND){
      this.form.get('shipmentPeriod')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    }
  }
  this.onClickShipmentLastDate();
  }

  initializeFormGroup() {
    const form = this.parentForm.controls[this.controlName];
    if (form !== null) {
      this.form = form as FCCFormGroup;
    }
    this.patchFieldParameters(this.form.get('incoTermsRules'), { options: this.incoTermsRules });
    this.patchFieldParameters(this.form.get('purchaseTermsValue'), { amendinfo: true });
  }

  clearingFormValidators(fields: any){
    for (let i = 0; i < fields.length; i++) {
      this.form.get(fields[i]).clearValidators();
    }
  }

  ngOnDestroy() {
    this.onClickShipmentPeriodvalue(this.form.get('shipmentPeriodvalue'));
    this.parentForm.controls[this.controlName] = this.form;
  }

  onClickShipmentLastDate() {
    const lastShipmentDate = this.form.get('shipmentLastDate').value;
    const shipmentEarliestDate = this.form.get('shipmentEarliestDate').value;
    const expDate = this.uiService.getBgExpDate();
    this.uiService.calculateShipmentDate(lastShipmentDate, expDate, this.form.get('shipmentLastDate'), shipmentEarliestDate);

  }

  onClickShipmentEarliestDate() {
    const shipmentEarliestDate = this.form.get('shipmentEarliestDate').value;
    const lastShipmentDate = this.form.get('shipmentLastDate').value;
    const expDate = this.uiService.getBgExpDate();
    this.uiService.calculateShipmentEarliestDate(shipmentEarliestDate, lastShipmentDate, this.form.get('shipmentEarliestDate'), expDate);
  }

  getIncotermsDetails() {
    this.corporateCommonService.getValues(this.fccGlobalConstantService.incotermDetails).subscribe(
      response => {
        if (response.status === FccGlobalConstant.LENGTH_200) {
         // let sectionForm2: FCCFormGroup;
          const sectionForm: FCCFormGroup = this.productStateService.getSectionData(
            FccGlobalConstant.UI_BANK_DETAILS,
            undefined,
            this.isMasterRequired
          );
        //  sectionForm2 = sectionForm.get('uiIssuingBank') as FCCFormGroup;
          /* if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
            bankName = sectionForm.get('uiBankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] ?
              sectionForm.get('uiBankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS][0].value :
              sectionForm.get('uiBankNameList').value;
          } else { */
         const bankName = sectionForm.get('uiBankNameList').value;
         // }
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
    this.setPurchaseTermField();
  }

  setPurchaseTermField() {
    if (this.form && this.form.get('incoTermsRules') && this.form.get('incoTermsRules').value ) {
      this.form.get('purchaseTermsValue')[this.params][this.readonly] = false;
      this.setMandatoryField(this.form, 'purchaseTermsValue', true);
      this.setPurchaseTerms();
    }
  }

  setPurchaseTerms() {
    const incotermValue = this.form.get('incoTermsRules').value;
  //  let sectionForm2: FCCFormGroup;
    const sectionForm = this.productStateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired);
   // sectionForm2 = sectionForm.get('uiIssuingBank') as FCCFormGroup;
    /* if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      bankName = sectionForm2.get('bankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] ?
                sectionForm2.get('bankNameList')[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS][0].value :
                sectionForm2.get('bankNameList').value;
    } else { */
    const bankName = sectionForm.get('uiBankNameList').value;
   // }
    if (bankName !== undefined || bankName !== '') {
      if (this.incotermsDetails !== undefined && this.incotermsDetails.length > 0) {
      for (let i = 0; i < this.incotermsDetails.length; i++) {
        const respBank = this.incotermsDetails[i].bankName;
        if (bankName === respBank || respBank === '*') {
          const largeParamKeyListarr = this.incotermsDetails[i].largeParamKeyList;
          for (let j = 0; j < largeParamKeyListarr.length; j++) {
            const incoRules = largeParamKeyListarr[j].incotermsRules;
            if (incotermValue === incoRules) {
              this.termValues = [];
              const incoparams = largeParamKeyListarr[j].incotermValues;
              for (let k = 0; k < incoparams.length; k++) {
                this.termValues.push({ label: `${this.translateService.instant(incoparams[k])}`, value: incoparams[k] });
              }

            }
          }
        }

      }
    }
    }
    this.patchFieldParameters(this.form.get('purchaseTermsValue'), { options: this.termValues });
  }

  onClickShipmentPeriodvalue(data: any) {
    if (this.shipmentStandardConfig === 'false') {
      if (data.value === '01') {
        this.form.get('shipmentPeriodvalue').clearValidators();
        this.form.get('shipmentPeriodText').clearValidators();
        this.form.get('shipmentLastDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('shipmentEarliestDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        if (this.option !== FccGlobalConstant.TEMPLATE) {
          this.form.get('shipmentPeriodText')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        }
        this.form.get('shipmentPeriodText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('shipmentEarliestDate').setValue('');
        this.form.get('shipmentLastDate').setValue('');

      } else if (data.value === '02') {
        this.form.get('shipmentPeriodvalue').clearValidators();
        this.form.get('shipmentEarliestDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('shipmentLastDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('shipmentPeriodText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('shipmentEarliestDate').setValue('');
        this.form.get('shipmentPeriodText').setValue('');

      } else if (data.value === '03') {
        this.form.get('shipmentPeriodvalue').clearValidators();
        this.form.get('shipmentEarliestDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        this.form.get('shipmentLastDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
        if (this.option !== FccGlobalConstant.TEMPLATE) {
          this.form.get('shipmentEarliestDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
          this.form.get('shipmentLastDate')[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
        }
        this.form.get('shipmentPeriodText')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        this.form.get('shipmentPeriodText').setValue('');
      }
      this.form.get('shipmentPeriodvalue').updateValueAndValidity();
      this.form.get('shipmentPeriodText').updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }


  onClickIncoTermsRules() {
    if (this.form.get('incoTermsRules').value) {
      this.form.get('purchaseTermsValue')[this.params][this.readonly] = false;
      this.setMandatoryField(this.form, 'purchaseTermsValue', true);
      this.setPurchaseTerms();
    }
    this.removeMandatory(['purchaseTermsValue']);
  }

  removeMandatory(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }

  onChangeincoTermsRules() {
    this.form.get('purchaseTermsValue').setValue('');
    this.form.get('namedPlace').setValue('');
    this.setMandatoryField(this.form, 'namedPlace', false);
    this.form.get('namedPlace').updateValueAndValidity();

  }

  onClickPurchaseTermsValue(event) {
    const termsValue = event.value;
    if (termsValue !== undefined) {
      if (termsValue !== '') {
        this.setMandatoryField(this.form, 'namedPlace', true);
      } else if (termsValue === '') {
        this.form.get('namedPlace').reset();
        this.setMandatoryField(this.form, 'namedPlace', false);
        this.form.get('namedPlace').setValidators([Validators.maxLength(FccGlobalConstant.LENGTH_60)]);
      }
      this.form.get('namedPlace').updateValueAndValidity();
    }
    this.removeMandatory(['namedPlace']);
  }

  onClickPartialshipmentvalue() {
    this.toggleValue(this.form.get('partialshipmentvalue').value, 'partialshipmentvalue');
  }

  onClickTranshipmentvalue() {
    this.toggleValue(this.form.get('transhipmentvalue').value, 'transhipmentvalue');
  }

  toggleValue(value, feildValue) {
    if (value === 'CONDITIONAL') {
      this.form.get(feildValue)[this.params][this.warning] = `${this.translateService.instant(this.warnmessage)}`;
    } else {
      this.form.get(feildValue)[this.params][this.warning] = '';
    }
  }

  onBlurShipmentName() {
    if(this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        const shipmentName = this.form.get('shipmentName').value;
        if(shipmentName !== null && shipmentName !== '') {
          this.form.get('shipmentName').setValidators([Validators.pattern(this.swiftZchar)]);
        }
      }
    this.form.get('shipmentName').updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  onBlurShipmentPeriodText() {
    if(this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        const shipmentPeriodText = this.form.get('shipmentPeriodText').value;
        if(shipmentPeriodText !== null && shipmentPeriodText !== '') {
          this.form.get('shipmentPeriodText').setValidators([Validators.pattern(this.swiftXChar)]);
        }
    }
    this.form.get('shipmentPeriodText').updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  onBlurNamedPlace() {
    if(this.transmissionMode === FccBusinessConstantsService.SWIFT) {
        const namedPlace = this.form.get('namedPlace').value;
        if(namedPlace !== null && namedPlace !== '') {
          this.form.get('namedPlace').setValidators([Validators.pattern(this.swiftZchar)]);
        }
    }
    this.form.get('namedPlace').updateValueAndValidity();
    this.form.updateValueAndValidity();
  }
}
