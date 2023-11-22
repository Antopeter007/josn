import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DialogService, DynamicDialogRef } from 'primeng';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';

import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { PhrasesService } from '../../../../../../common/services/phrases.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { SiProductComponent } from '../si-product/si-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccBusinessConstantsService } from './../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from './../../../../../../common/core/fcc-global-constant.service';
import { LcConstant } from './../../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { NarrativeService } from './../../../../../../corporate/trade/lc/initiation/services/narrative.service';
import { UtilityService } from './../../../../../../corporate/trade/lc/initiation/services/utility.service';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { DatePipe } from '@angular/common';
import { PurchaseOrder } from './../../../../../../corporate/trade/lc/initiation/services/purchaseOrder';
import { PurchaseOrderLineItemMap } from './../../../../../../corporate/trade/lc/initiation/services/purchaseOrderLineItem';
import { ConfirmationDialogComponent } from './../../../../../../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { CodeData } from './../../../../../../common/model/codeData';
import { POColumnsHelper } from './../../../../../../corporate/trade/lc/initiation/model/poColumnsHelper';

@Component({
  selector: 'app-si-description-of-goods',
  templateUrl: './si-description-of-goods.component.html',
  styleUrls: ['./si-description-of-goods.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiDescriptionOfGoodsComponent }]
})
export class SiDescriptionOfGoodsComponent extends SiProductComponent implements OnInit, OnDestroy {
  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  lcConstant = new LcConstant();
  module = '';
  element = FccGlobalConstant.NAR_TAB_NESTED_CONTROL_DESC_OF_GOODS_TEXT;
  swiftZCharRegex: string;
  swiftExtendedNarrativeEnable: boolean;
  paramDataList: any[] = [];
  modeOfTransmission;
  mode: any;
  descOfGoodsRowCount: number;
  totalNarrativeCount;
  maxLength = this.lcConstant.maximumlength;
  maxRowCount = this.lcConstant.maxRowCount;
  enteredCharCount = this.lcConstant.enteredCharCounts;
  allowedCharCount = this.lcConstant.allowedCharCount;
  params = this.lcConstant.params;
  swift = 'swift';
  descOfGoodsMandatory: boolean;
  descOfGoodscounter = this.lcConstant.zero;
  openAllSvg = 'openAllSvg';
  closeAllSvg = 'closeAllSvg';
  openAllSvgPath: any;
  closeAllSvgPath: any;
  contextPath: any;
  tnxTypeCode: any;
  mandatoryFields: any[];
  readonly = this.lcConstant.readonly;
  rows = this.lcConstant.rows;
  phrasesResponseForDescOfGoods: any;
  displayValue: string;
  finalTextValue = '';
  entityName: any;
  responseData: string;
  @ViewChild('fccCommonTextArea') public dirs;
  option;
  amendEditSection = 'siGoodsandDoc';
  amendEditsubSection = 'siDescOfGoods';
  amendEditTextAreaKey = 'descOfGoodsAmendEditTextArea';
  repAllTextAreaKey = 'descOfGoodsAmendEditTextArea0';
  textAreaCount;
  textAreaCreated = false;
  descOfGoodsLen;
  selectedLineItems: any[] = [];
  purchaseOrders: any[] = [];
  mutualExclusiveMessage = 'purchaseOrderCurrencyError';
  responseArray = [];
  poFormControlArray = [];
  poResponseArray = [];
  name = 'name';
  type = 'type';
  required = 'required';
  maxlength = 'maxlength';
  disabled = 'disabled';
  purchaseOrderDetails: any;
  map = new Map();
  lineItemModel: PurchaseOrderLineItemMap;
  public lineItemModelMap: PurchaseOrderLineItemMap[] = [];
  remittanceInst = 'purchaseOrderremittanceInst';
  ele: any;
  quantities: any[] = [];
  tableColumns = [];
  amountFieldArray = ['PurchaseOrderPriceUnitPos', 'PurchaseOrderQuantityToleranceNeg',
  'PurchaseOrderQuantityPriceUnitNeg', 'PurchaseOrderQuantityTolerancePos','PurchaseOrderQuantityValue','PurchaseOrderQuantityPriceUnit'];
  codeData = new CodeData();
  productCodeValue = FccGlobalConstant.PRODUCT_SI;
  totalGrossAmount:number=0;
  poReferences:string='';

  currentVerbCode: any;

  constructor(protected emitterService: EventEmitterService, protected stateService: ProductStateService,
              protected formControlService: FormControlService, protected commonService: CommonService,
              protected fccBusinessConstantsService: FccBusinessConstantsService,
              protected narrativeService: NarrativeService, protected translateService: TranslateService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected elementRef: ElementRef, protected searchLayoutService: SearchLayoutService,
              protected phrasesService: PhrasesService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected siProductService: SiProductService,
              protected datePipe: DatePipe,public dialogService: DialogService
    ) {
    super(emitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, siProductService);
   }

  ngOnInit(): void {
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.getQuantityCodes();
    this.openAllSvgPath = this.contextPath + '/content/FCCUI/assets/icons/expandAll.svg';
    this.closeAllSvgPath = this.contextPath + '/content/FCCUI/assets/icons/collapseAll.svg';
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    const obj = this.parentForm.controls[this.controlName];
    this.commonService.getSwiftNarrativeFilterValues();
    if (obj !== null) {
        this.form = obj as FCCFormGroup;
    }
    this.modeOfTransmission = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    this.constuctLineItemObj();
    this.updateNarrativeCount(this.form, this.element);
    this.configAndValidations();
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.get(this.element)[this.params][FccGlobalConstant.PHRASE_ENABLED] = true;
    } else {
      this.form.get(this.element)[this.params][FccGlobalConstant.PHRASE_ENABLED] = false;
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
      if(this.operation === 'PREVIEW'){
        this.form.get('descOfGoodsAmendEditTextAreaRead')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('descOfGoodsAmendEditTextAreaRead')[this.params]['hidden'] = false;
        this.form.get('descOfGoodsAmendEditTextAreaRead')[this.params]['previewScreen'] = true;
      }
      this.configAndValidationsAmend();
      if (!this.textAreaCreated){
        if (this.mode === FccGlobalConstant.DRAFT_OPTION)
        {
          this.textAreaCount = this.descOfGoodscounter;
        }
        else {
          this.textAreaCount = 0;
        }
        this.textAreaCreated = true;
      }
      if (this.commonService.isnonEMptyString(this.form.get('descOfGoodsAmendEditTextAreaRead').value)){
        if ((this.mode === FccGlobalConstant.DRAFT_OPTION && this.form.get('descOfGoodsRepAll').value === 'Y')
        && this.form.get('descOfGoodsAmendEditTextAreaRead').value.includes('REPALL')) {
          this.textAreaCount = 0;
          this.descOfGoodscounter = 0;
          const fieldObj1 = this.amendHistoryHeaderJsonObject(this.form.get('descOfGoodsAmendHistoryHeader'));
          this.form.removeControl( 'descOfGoodsAmendHistoryHeader');
          const fieldObj2 = this.narrativeService.narrativeExpansionPanelJsonObject(
            this.form.get('descOfGoodsAmendmentPanel'));
          this.form.removeControl('descOfGoodsAmendmentPanel');
          this.form.get('descOfGoodsAmendOptions')[this.params][FccGlobalConstant.RENDERED] = false;
          this.form.get(this.amendEditTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = false;
          this.form.get(this.amendEditTextAreaKey).setValue(null);
          const fieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(
            this.form.get(this.amendEditTextAreaKey));
          this.form.addControl(this.repAllTextAreaKey, this.formControlService.getControl(fieldObj));
          this.form.get(this.repAllTextAreaKey)[FccGlobalConstant.KEY] = this.repAllTextAreaKey;
          this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = true;
          this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
          this.form.addControl('descOfGoodsAmendHistoryHeader', this.formControlService.getControl(fieldObj1));
          this.form.addControl('descOfGoodsAmendmentPanel', this.formControlService.getControl(fieldObj2));
          this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.START] = 'Repall';
          if (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT) {
          this.form.addFCCValidators(this.repAllTextAreaKey, Validators.pattern(this.swiftZCharRegex), 0);
          }
          this.descOfGoodscounter++;
        }
        else if (this.mode === FccGlobalConstant.DRAFT_OPTION && (this.form.get('descOfGoodsAmendEditTextAreaRead').value.includes('ADD') ||
        this.form.get('descOfGoodsAmendEditTextAreaRead').value.includes('DELETE'))) {
          this.form.get('descOfGoodsRepAll').setValue('N');
          this.form.get('descOfGoodsAmendOptions')[this.params][FccGlobalConstant.RENDERED] = true;
        }
      }
    }
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryField(this.form, 'descOfGoodsText', false);
      this.form.get('descOfGoodsText').setErrors(null);
      this.form.get('descOfGoodsText').clearValidators();
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response.response && response.response === 'REST_API_SUCCESS' && response.purchaseOrderAssistanceEnable &&
      this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
        this.form.get('purchaseOrderToggle')[this.params][FccGlobalConstant.RENDERED] = true;
      }
      else {
        this.form.get('purchaseOrderToggle')[this.params][FccGlobalConstant.RENDERED] = false;

      }
    });
    if (this.stateService.getSectionData('siAmountChargeDetails').get('currency').value !== null &&
      this.stateService.getSectionData('siAmountChargeDetails').get('currency').value !== '' &&
      this.stateService.getSectionData('siAmountChargeDetails').get('currency').value !== undefined) {
      this.form.get('purchaseOrderToggle')[this.params]['warning'] = '';
      const currency = this.stateService.getSectionData('siAmountChargeDetails').get('currency').value.currencyCode;
      if (currency && this.commonService.isNonEmptyValue(currency)) {
        this.form.get('poCurrency').setValue(currency);
      }
      if (this.form.get(FccGlobalConstant.LINEITEM1) && this.form.get(FccGlobalConstant.LINEITEM1).value) {
        this.generateDataFromResponse(this.form.get(FccGlobalConstant.LINEITEM1).value);
        this.checkPurchaseOrderExist();
        let TotalGrossAmount = 0;
        this.purchaseOrders.forEach(val => {
          this.onSaveMandatoryCheck(val);
          val.grossAmount = this.getGrossAmount(val, currency);
          const grossAmount = this.caleculateTotalGrossAmount(val);
          this.errorHandlingRowWise(val, false);
          TotalGrossAmount = TotalGrossAmount + grossAmount;
          this.handleLineItemsGrid(val);
        });
        if(this.form.get('purchaseOrderToggle').value === 'Y' && TotalGrossAmount!=0 ){
          this.form.get('totalGrossAmount')[this.params][FccGlobalConstant.RENDERED] = true;
          this.form.get('totalGrossAmount')[this.params]['labelStyleClass']='grossAmountLabelClass';
        }
        if(this.form.get('deductions').value){
          TotalGrossAmount=TotalGrossAmount-this.form.get('deductions').value;
        }
        this.totalGrossAmount = this.currencyConverterPipe.transform(TotalGrossAmount.toString(), currency);
        this.setTotalGrossAmount(this.totalGrossAmount, 'ngOnInit');
        this.caleculateLCAmount(TotalGrossAmount);
        if(this.purchaseOrders && this.purchaseOrders.length>0){
          this.form.get('deductions')[this.params][FccGlobalConstant.RENDERED] = true;
          this.form.get('poSeparator')[this.params][FccGlobalConstant.RENDERED] = true;
          this.form.get('poOverrideError')[this.params][FccGlobalConstant.RENDERED] = true;
          this.form.get('totalGrossAmount')[this.params][FccGlobalConstant.RENDERED] = true;
        }
        else{
          this.form.get('deductions')[this.params][FccGlobalConstant.RENDERED] = false;
          this.form.get('poSeparator')[this.params][FccGlobalConstant.RENDERED] = false;
          this.form.get('poOverrideError')[this.params][FccGlobalConstant.RENDERED] = false;
          this.form.get('totalGrossAmount')[this.params][FccGlobalConstant.RENDERED] = false;
          this.form.get('grossAmountError')[this.params][FccGlobalConstant.RENDERED] = false;
        }

      this.form.get('totalGrossAmount').setValue(currency + " " + this.totalGrossAmount);
        if (this.form.get('purchaseOrderToggle').value === 'Y') {
          this.handlePurchaseOrders();
        }

      }

    }


    this.commonService.purchaseOrderLineItemGridSelectedData.subscribe(
      (response) => {
        this.handleSelecteLineItemGrid(response);
      }
    );
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryField(this.form, 'descOfGoodsText', false);
      this.form.get('descOfGoodsText').setErrors(null);
      this.form.get('descOfGoodsText').clearValidators();
    }
  }

  onKeyupDescOfGoodsText() {
    this.commonService.getSwiftNarrativeFilterValues();
    const data = this.form.get(this.element).value;
    const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace(/[\r\n]+/gm, '' ) : '';

    if (checkForValue === '') {
      this.form.get(this.element).setValue('');
      this.form.get(this.element).setErrors({ invalid: true });
      this.form.get(this.element).updateValueAndValidity();
    } else {
     const exp = new RegExp(this.commonService.swiftNarrativeFilterValue,"g");
        let x = "";
        this.form.get(this.element).value.split(exp).forEach(function(arrayItem: string){
          if(arrayItem.trim() !== ""){
             x = x.concat(" ", arrayItem.trim());}

        });
        this.form.get(this.element).setValue(x);
        this.form.get(this.element).setErrors({ invalid: false });
        this.form.get(this.element).updateValueAndValidity();
    }
    const currentCount = this.form.get(this.element)[this.params][this.enteredCharCount];
    this.narrativeService.descriptionOfGoodsSubject.next(currentCount);
    this.configAndValidations();
    this.totalCountValidation();
  }

  onKeyupDescOfGoodsAmendEditTextArea(event, key) {
    const data = this.form.get(key).value;
    const maxLength = this.form.get(key)[this.params][this.maxLength];
    const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace(/[\r\n]+/gm, '') : '' ;
    if (checkForValue === '') {
      this.form.get(key).setValue(null);
      this.form.get(key).setErrors({ invalid: true });
      this.form.get(key).updateValueAndValidity();
    } else {
        const exp = new RegExp(this.commonService.swiftNarrativeFilterValue,"g");
        this.form.get(this.element).setValue(this.form.get(this.element).value.replaceAll(exp,' '));

      this.form.get(key).setErrors({ invalid: false });
      this.form.get(key).updateValueAndValidity();
      this.narrativeService.limitCharacterCountPerLine(key, this.form);
    }

    this.totalNarrativeCount = this.narrativeService.getTotalAmendNarrativeCount(
      this.amendEditSection,
      this.amendEditsubSection,
      this.form,
      this.amendEditTextAreaKey,
      this.descOfGoodscounter
    );

    this.narrativeService.descriptionOfGoodsSubjectAmend.next(this.totalNarrativeCount);
    this.narrativeService.totalCountValidationAmendSI(key, this.form, this.totalNarrativeCount, this.stateService, this.descOfGoodsLen);
    if (data.length > maxLength) {
      this.form.get(key).setErrors( { maxSizeExceedsIndividual: { maxSize: maxLength } } );
    }
  }

  onFocusDescOfGoodsText() {
    this.totalCountValidation();
  }

  totalCountValidation() {
    const totalCount = (this.narrativeService.goodAndDocsCount === undefined ? 0 : this.narrativeService.goodAndDocsCount) +
                        (this.narrativeService.documentReqCount === undefined ? 0 : this.narrativeService.documentReqCount) +
                        (this.narrativeService.additionalInfoCount === undefined ? 0 : this.narrativeService.additionalInfoCount) +
                        (this.narrativeService.specialBeneCount === undefined ? 0 : this.narrativeService.specialBeneCount);
    if (totalCount > this.narrativeService.getNarrativeTotalSwiftCharLength()) {
      this.form.get(this.element).setErrors({ maxSizeExceeds: { maxSize: this.narrativeService.getNarrativeTotalSwiftCharLength() } });
    }
  }

  onFocusDescOfGoodsAmendEditTextArea(event, key) {
    this.narrativeService.totalCountValidationAmendSI(key, this.form, this.totalNarrativeCount, this.stateService, this.descOfGoodsLen);
  }

  configAndValidations() {
    this.form.get(this.element).clearValidators();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZCharRegex = response.swiftZChar;
        this.swiftExtendedNarrativeEnable = response.swiftExtendedNarrativeEnable;
        this.descOfGoodsMandatory = response.descOfGoodsMandatory;
        this.descriptionGoodsMandatory();
        if (this.modeOfTransmission === FccBusinessConstantsService.SWIFT
          || (this.modeOfTransmission[0] && this.modeOfTransmission[0] === FccBusinessConstantsService.SWIFT)){
          this.form.addFCCValidators(this.element, Validators.pattern(this.swiftZCharRegex), 0);
          this.swiftModeTransmission();
          this.form.get(this.element).updateValueAndValidity();
          if (!this.swiftExtendedNarrativeEnable) {
            this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_SI,
              FccGlobalConstant.PARAMETER_P940).subscribe(responseData => {
                if (responseData) {
                  this.paramDataList = responseData.paramDataList;
                  this.parameterList();
                  this.descOfGoodsLen = this.descOfGoodsRowCount * FccGlobalConstant.LENGTH_65;
                  this.form.get(this.element)[this.params][this.maxLength] = this.descOfGoodsLen;
                  this.form.get(this.element)[this.params][this.allowedCharCount] = this.descOfGoodsLen;
                  this.form.get(this.element)[this.params][this.maxRowCount] = this.descOfGoodsRowCount;
                  this.validateCharCount();
                }
              });
          }else{
            this.descOfGoodsLen = this.form.get(this.element)[this.params][this.maxRowCount] * FccGlobalConstant.LENGTH_65;
            this.validateCharCount();
          }
        } else {
          this.texelCourierModeTransmission();
        }
      }
    });
    this.validateCharCount();
  }

  validateCharCount() {
    const count = this.form.get(this.element)[this.params][this.enteredCharCount];
    const validationError = {
      maxlength: { actualLength: count, requiredLength: this.descOfGoodsLen } };
    if (count > this.descOfGoodsLen) {
      this.form.addFCCValidators(this.element, Validators.compose([() =>validationError]), 0);
      this.form.get(this.element).markAsDirty();
      this.form.get(this.element).markAsTouched();
      this.form.get(this.element).setErrors({ maxlength: true });
    }
    this.form.get(this.element).updateValueAndValidity();
    this.form.updateValueAndValidity();
  }

  configAndValidationsAmend() {
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftZCharRegex = response.swiftZChar;
        this.swiftExtendedNarrativeEnable = response.swiftExtendedNarrativeEnable;
        this.descOfGoodsMandatory = response.descOfGoodsMandatory;
        this.descriptionGoodsMandatory();
        if (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT) {
          this.totalNarrativeCount = this.narrativeService.getTotalAmendNarrativeCount(
            this.amendEditSection,
            this.amendEditsubSection,
            this.form,
            this.amendEditTextAreaKey,
            this.descOfGoodscounter
          );

          this.narrativeService.descriptionOfGoodsSubjectAmend.next(this.totalNarrativeCount);
          for ( let i = 0; i < this.descOfGoodscounter ; i++ ){
            const tempAmendEditTextArea = this.amendEditTextAreaKey.concat(i.toString());
            this.form.addFCCValidators( tempAmendEditTextArea, Validators.pattern(this.swiftZCharRegex), 0);
            this.form.get(tempAmendEditTextArea).updateValueAndValidity();
            this.form.get(tempAmendEditTextArea)[this.params][this.swift] = true;
            this.form.get(tempAmendEditTextArea)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_800;
            this.narrativeService.swiftModeTransmissionAmend(
              this.form,
              tempAmendEditTextArea,
              this.totalNarrativeCount,
              this.stateService,
              this.descOfGoodsLen
            );

          }
          if (!this.swiftExtendedNarrativeEnable) {
            this.commonService.getParameterConfiguredValues(FccGlobalConstant.PRODUCT_LC,
              FccGlobalConstant.PARAMETER_P940).subscribe(responseData => {
                if (responseData) {
                  this.paramDataList = responseData.paramDataList;
                  this.parameterList();
                  this.descOfGoodsLen = this.descOfGoodsRowCount * FccGlobalConstant.LENGTH_65;
                //  this.narrativeService.validateMaxLengthAmend(maxLength, this.totalNarrativeCount, this.form, this.element);
                }
              });
          }

        } else {
          this.texelCourierModeTransmission();
        }
      }
    });
    setTimeout(() => {
      this.totalNarrativeCount = this.narrativeService.getTotalAmendNarrativeCount(this.amendEditSection,
        this.amendEditsubSection, this.form, this.amendEditTextAreaKey, this.descOfGoodscounter );
      this.narrativeService.descriptionOfGoodsSubjectAmend.next(this.totalNarrativeCount);
    }, 200);
  }


  descriptionGoodsMandatory() {
    if (this.descOfGoodsMandatory && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.setMandatoryField(this.form, this.element, true);
      this.form.addFCCValidators(this.element, Validators.required, 1);
      this.form.get(this.element).updateValueAndValidity();
    }
    this.removeMandatory([this.element]);
  }

  parameterList() {
    if (this.paramDataList !== null) {
      this.paramDataList.forEach(element => {
        if (element.data_2 === this.lcConstant.descGoods) {
          this.descOfGoodsRowCount = Number(element.data_1);
        }
      });
      if (this.descOfGoodsRowCount === undefined || this.descOfGoodsRowCount === null) {
        this.descOfGoodsRowCount = FccGlobalConstant.LENGTH_100;
      }
    }
  }

  texelCourierModeTransmission() {
    if (!this.descOfGoodsMandatory) {
      this.form.get(this.element).setValidators([]);
      this.form.get(this.element).updateValueAndValidity();
    }
    this.form.get(this.element)[this.params][this.swift] = false;
    if(this.swiftExtendedNarrativeEnable) {
      this.form.get(this.element)[this.params][this.swift] = true;
    }
    this.form.get(this.element)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_800;
    this.form.get(this.element)[this.params][this.allowedCharCount] = this.narrativeService.getNarrativeSwiftCharLength();
    this.form.get(this.element)[this.params][this.maxLength] = this.narrativeService.getNarrativeSwiftCharLength();
  }

  swiftModeTransmission() {
    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
    this.form.get(this.element).updateValueAndValidity();
    this.form.get(this.element)[this.params][this.swift] = false;
    if(this.swiftExtendedNarrativeEnable) {
      this.form.get(this.element)[this.params][this.swift] = true;
    }
    this.form.get(this.element)[this.params][this.maxRowCount] = FccGlobalConstant.LENGTH_800;
    this.form.get(this.element)[this.params][this.allowedCharCount] = this.narrativeService.getNarrativeSwiftCharLength();
    this.form.get(this.element)[this.params][this.maxLength] = this.narrativeService.getNarrativeSwiftCharLength();
    }
  }

  amendHistoryHeaderJsonObject(field): any {
    const obj = {};
    const nameStr = 'name';
    const typeStr = 'type';
    const renderedStr = 'rendered';
    const layoutClassStr = 'layoutClass';
    const styleClassStr = 'styleClass';
    const previewScreenStr = 'previewScreen';
    obj[nameStr] = field.key ;
    obj[typeStr] = field.type;
    obj[renderedStr] = field.params.rendered;
    obj[layoutClassStr] = field.params.layoutClass;
    obj[styleClassStr] = field.params.styleClass;
    obj[previewScreenStr] = field.params.previewScreen;
    return obj;
  }

  onClickDescOfGoodsAmendOptions(obj: any) {
    const fieldObj1 = this.amendHistoryHeaderJsonObject(this.form.get('descOfGoodsAmendHistoryHeader'));
    this.form.removeControl('descOfGoodsAmendHistoryHeader');
    const fieldObj2 = this.narrativeService.narrativeExpansionPanelJsonObject(
      this.form.get('descOfGoodsAmendmentPanel'));
    this.form.removeControl('descOfGoodsAmendmentPanel');
    const fieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(
      this.form.get(this.amendEditTextAreaKey));
    let newKeyName = this.amendEditTextAreaKey + this.descOfGoodscounter;
    this.form.addControl(newKeyName, this.formControlService.getControl(fieldObj));
    this.form.get(newKeyName)[FccGlobalConstant.KEY] = newKeyName;
    this.form.get(newKeyName)[this.params][FccGlobalConstant.RENDERED] = true;
    this.form.get(newKeyName)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
    this.descOfGoodscounter++;
    const count = this.descOfGoodscounter;
    let newCount;
    for (let i = this.descOfGoodscounter - 1; i >= 0 ; i--) {
      let newName = this.amendEditTextAreaKey + i;
      if (i > 0) {
        const newKeyFinal = this.narrativeService.getFinalNewKeyName(this.form, this.amendEditTextAreaKey, i, fieldObj, newName);
        if (this.commonService.isNonEmptyValue(newKeyFinal)) {
          newName = newKeyFinal;
          this.descOfGoodscounter--;
          newCount = this.descOfGoodscounter;
        }
      }
      const narrativefieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(this.form.get(newName));
      const newControlVal = this.form.get(newName).value;
      this.form.removeControl(newName);
      this.form.addControl(newName, this.formControlService.getControl(narrativefieldObj));
      if (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT) {
        this.form.addFCCValidators(newName, Validators.pattern(this.swiftZCharRegex), 0);
      }
      this.form.get(newName)[FccGlobalConstant.KEY] = newName;
      this.form.get(newName)[FccGlobalConstant.VALUE] = newControlVal;
    }
    if (count !== this.descOfGoodscounter) {
      newKeyName = this.amendEditTextAreaKey + (newCount - 1);
      this.form.addControl(newKeyName, this.formControlService.getControl(fieldObj));
      this.form.get(newKeyName)[FccGlobalConstant.KEY] = newKeyName;
      this.form.get(newKeyName)[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(newKeyName)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
    }
    this.form.addControl('descOfGoodsAmendHistoryHeader', this.formControlService.getControl(fieldObj1));
    this.form.addControl('descOfGoodsAmendmentPanel', this.formControlService.getControl(fieldObj2));
    this.form.get('descOfGoodsAmendmentPanel').patchValue(fieldObj2[FccGlobalConstant.VALUE]);

    if (obj.value === 'amendAdd') {
      this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Add';
    } else {
      this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Delete';
    }
    this.textAreaCount++;
    this.narrativeService.totalCountValidationAmendSI(newKeyName, this.form, this.totalNarrativeCount, this.stateService,
      this.descOfGoodsLen);
  }

  onClickDescOfGoodsText(){
    this.onBlurDescOfGoodsText(event);
  }

  updateNarrativeCount(form: any, key: string) {
    if (form.get(key).value) {
      let text = this.form.get(key).value;
      if(text.endsWith('\n')) {
        text = text.slice(0,-1);
      }
      const count = this.commonService.counterOfPopulatedData(text);
      this.narrativeService.descriptionOfGoodsSubject.next(count);
      this.form.get(this.element)[this.params][this.enteredCharCount] = count;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onBlurDescOfGoodsText($event){
    const data = this.form.get(this.element).value;
    const checkForValue = this.commonService.isNonEmptyValue(data) ? data.replace( /[\r\n]+/gm, '' ) : '';
    if (checkForValue === '') {
      this.form.get(this.element).setValue('');
      this.form.get(this.element).setErrors({ invalid: true });
      this.form.controls.descOfGoodsText.markAsDirty();
      this.form.controls.descOfGoodsText.markAsTouched();
      this.form.get(this.element).updateValueAndValidity();
    } else {
    const exp = new RegExp(this.commonService.swiftNarrativeFilterValue,"g");
    this.form.get(this.element).setValue(this.form.get(this.element).value.replaceAll(exp,' '));
    this.form.get(this.element).setErrors({ invalid: false });
    this.form.get(this.element).updateValueAndValidity();
  }
  const currentCount = this.form.get(this.element)[this.params][this.enteredCharCount];
  this.narrativeService.descriptionOfGoodsSubject.next(currentCount);
  this.configAndValidations();
  this.totalCountValidation();
  }

  onBlurDescOfGoodsAmendEditTextArea(event, key) {
    const strResult = event.srcElement.value ? event.srcElement.value : event.srcElement.innerText;
    if ((this.form.get('descOfGoodsRepAll').value === 'N') && (key !== null || key !== undefined)) {
      this.form.get(key).setValue(strResult);
    } else {
      this.form.get(this.repAllTextAreaKey).setValue(strResult);
    }
    this.narrativeService.totalCountValidationAmendSI(key, this.form, this.totalNarrativeCount, this.stateService);
    this.ngOnDestroy();
  }

  onClickDescOfGoodsAmendEditTextArea(event, key) {
    this.form.removeControl(key);
    this.totalNarrativeCount = this.narrativeService.getTotalAmendNarrativeCount(
      this.amendEditSection,
      this.amendEditsubSection,
      this.form,
      this.amendEditTextAreaKey,
      this.descOfGoodscounter
    );

    this.narrativeService.descriptionOfGoodsSubjectAmend.next(this.totalNarrativeCount);
    this.form.get(FccGlobalConstant.NAR_TAB_CONTROL_DESC_OF_GOODS_AMD_OPT).setValue(null);
    this.narrativeService.totalCountValidationAmendSI(key, this.form, this.totalNarrativeCount, this.stateService, this.descOfGoodsLen);
  }



  onClickDescOfGoodsRepAll(isDraftDataPopulated: boolean = false) {
    if (this.form.get('descOfGoodsRepAll').value === 'Y') {
     for (let i = 0 ; i < this.descOfGoodscounter ; i++) {
          if (this.form.get(this.amendEditTextAreaKey + i)) {
        this.onClickDescOfGoodsAmendEditTextArea(null, this.amendEditTextAreaKey + i);
        this.descOfGoodscounter++;
          }
      }
     this.textAreaCount = 0;
     this.descOfGoodscounter = 0;
     const fieldObj1 = this.amendHistoryHeaderJsonObject(this.form.get('descOfGoodsAmendHistoryHeader'));
     this.form.removeControl('descOfGoodsAmendHistoryHeader');
     const fieldObj2 = this.narrativeService.narrativeExpansionPanelJsonObject(
        this.form.get('descOfGoodsAmendmentPanel'));
     this.form.removeControl('descOfGoodsAmendmentPanel');
     this.form.get('descOfGoodsAmendOptions')[this.params][FccGlobalConstant.RENDERED] = false;
     this.form.get(this.amendEditTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = false;
     this.form.get(this.amendEditTextAreaKey).setValue(null);
     const fieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(
        this.form.get(this.amendEditTextAreaKey));
     this.form.addControl(this.repAllTextAreaKey, this.formControlService.getControl(fieldObj));
     this.form.get(this.repAllTextAreaKey)[FccGlobalConstant.KEY] = this.repAllTextAreaKey;
     this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = true;
     this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
     this.form.addControl('descOfGoodsAmendHistoryHeader', this.formControlService.getControl(fieldObj1));
     this.form.addControl('descOfGoodsAmendmentPanel', this.formControlService.getControl(fieldObj2));
     this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.START] = 'Repall';
     if (this.modeOfTransmission[0] && this.modeOfTransmission[0].value === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators(this.repAllTextAreaKey, Validators.pattern(this.swiftZCharRegex), 0);
      }
     this.descOfGoodscounter++;
     if (this.mode === FccGlobalConstant.DRAFT_OPTION && isDraftDataPopulated) {
      this.form.get(this.repAllTextAreaKey).setValue(JSON.parse(this.form.get('descOfGoodsAmendEditTextAreaRead').value).text);
    }
    } else {
      this.setValuesForRepallNo();
    }
  }

  amendFormFields() {
    this.updateMasterData();
    this.form.get(this.element)[this.params][this.swift] = true;
    this.form.get(this.element)[this.params][this.readonly] = true;
    this.form.get(this.element)[FccGlobalConstant.PARAMS][FccGlobalConstant.ROWS] = FccGlobalConstant.LENGTH_4;
    this.form.get('descOfGoodsAmendmentPanel')[this.params][this.openAllSvg] = this.openAllSvgPath;
    this.form.get('descOfGoodsAmendmentPanel')[this.params][this.closeAllSvg] = this.closeAllSvgPath;
    this.mandatoryFields = [this.element];
    this.setMandatoryFields(this.form, this.mandatoryFields, false);
    this.form.get(this.element).updateValueAndValidity();
    if (this.form.get(this.amendEditTextAreaKey).value && this.form.get(this.amendEditTextAreaKey).value.items) {
      this.descOfGoodscounter = this.form.get(this.amendEditTextAreaKey).value.items.length;
    }
  }
  updateMasterData() {
    this.narrativeService.updateMasterData(this.form, this.element, 'masterDescOfGoodsView');
   }
  ngOnDestroy() {
    if (this.commonService.isnonEMptyString(this.form.get('descOfGoodsAmendEditTextAreaRead').value)) {
      if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.mode === FccGlobalConstant.DRAFT_OPTION &&
        ((this.descOfGoodscounter === this.lcConstant.zero && this.form.get('descOfGoodsAmendEditTextAreaRead').value.includes('REPALL'))
        || this.descOfGoodscounter === this.lcConstant.zero)
        ){
          const descOfGoodsAmendEditTextAreaRead = this.form.get('descOfGoodsAmendEditTextAreaRead').value.includes('\n') ?
           JSON.parse((this.form.get('descOfGoodsAmendEditTextAreaRead').value).replace(/\n/g, '\\n')) :
           JSON.parse(this.form.get('descOfGoodsAmendEditTextAreaRead').value);
          let descOfGoodsAmendEditTextAreaReadCount = descOfGoodsAmendEditTextAreaRead.length;
          if (descOfGoodsAmendEditTextAreaRead.verb === 'REPALL' || descOfGoodsAmendEditTextAreaRead.verb === 'ADD' ||
          descOfGoodsAmendEditTextAreaRead.verb === 'DELETE') {
            descOfGoodsAmendEditTextAreaReadCount = 1;
          }
          for (let i = 0; i < descOfGoodsAmendEditTextAreaReadCount; i++){
          const newKeyName = this.amendEditTextAreaKey + i ;
          const fieldObj = this.narrativeService.amendNarrativeTextAreaJsonObject(
            this.form.get(this.amendEditTextAreaKey));
          this.form.addControl(newKeyName, this.formControlService.getControl(fieldObj));
          this.form.get(newKeyName)[FccGlobalConstant.KEY] = newKeyName;
          this.form.get(newKeyName)[this.params][FccGlobalConstant.RENDERED] = true;
          this.form.get(newKeyName)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
          if (descOfGoodsAmendEditTextAreaReadCount === 1) {
            this.form.get(newKeyName).setValue(descOfGoodsAmendEditTextAreaRead.text);
            if (descOfGoodsAmendEditTextAreaRead.verb === 'ADD') {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Add';
            }
            else if (descOfGoodsAmendEditTextAreaRead.verb === 'DELETE') {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Delete';
            } else {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Repall';
              this.form.get('descOfGoodsRepAll').setValue('Y');
            }
          } else {
            this.form.get(newKeyName).setValue(descOfGoodsAmendEditTextAreaRead[i].text);
            if (descOfGoodsAmendEditTextAreaRead[i].verb === 'ADD') {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Add';
            }
            if (descOfGoodsAmendEditTextAreaRead[i].verb === 'DELETE') {
              this.form.get(newKeyName)[this.params][FccGlobalConstant.START] = 'Delete';
            }
          }
          }
          const arraySet: {items: any} = {
            items: []
          };
          this.form.get(this.amendEditTextAreaKey).setValue(arraySet);
          let tempCounter = 0;
          for (let i = 0; i < descOfGoodsAmendEditTextAreaReadCount; i++) {
            const narrativeTextValue = this.form.get(this.amendEditTextAreaKey + i).value;
            this.currentVerbCode = descOfGoodsAmendEditTextAreaReadCount === 1 ? descOfGoodsAmendEditTextAreaRead.verb
               : descOfGoodsAmendEditTextAreaRead[i].verb;
            if (narrativeTextValue === '') {
              if (this.currentVerbCode === 'Repall') {
                this.form.get('descOfGoodsRepAll').setValue('N');
                this.setValuesForRepallNo();
              } else {
                this.form.removeControl(this.amendEditTextAreaKey + i);
              }
            } else {
              const jsonVal = { verb: String, text: String };
              jsonVal.verb = this.currentVerbCode.toLowerCase();
              jsonVal.text = narrativeTextValue;
              this.form.get(this.amendEditTextAreaKey).value[FccGlobalConstant.ITEMS].push(jsonVal);
              tempCounter++;
            }
        }
          this.descOfGoodscounter = tempCounter;
      }
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.descOfGoodscounter > this.lcConstant.zero) {
      const arraySet: {items: any} = {
        items: []
      };
      this.form.get(this.amendEditTextAreaKey).setValue(arraySet);
      let tempCounter = 0;
      for (let i = 0; i < this.descOfGoodscounter; i++) {
        if (this.commonService.isNonEmptyField(this.amendEditTextAreaKey + i, this.form)) {
        const narrativeTextValue = this.form.get(this.amendEditTextAreaKey + i).value;
        const verbCode = this.form.get(this.amendEditTextAreaKey + i)[this.params][FccGlobalConstant.START];
        if (narrativeTextValue === '') {
          if (verbCode === 'Repall') {
            this.form.get('descOfGoodsRepAll').setValue('N');
            this.setValuesForRepallNo();
          } else {
            this.form.removeControl(this.amendEditTextAreaKey + i);
          }
        } else {
          if (verbCode === 'Repall') {
            this.form.get('descOfGoodsRepAll').setValue('Y');
          }
          const jsonVal = { verb: String, text: String };
          jsonVal.verb = verbCode.toLowerCase();
          jsonVal.text = narrativeTextValue;
          this.form.get(this.amendEditTextAreaKey).value[FccGlobalConstant.ITEMS].push(jsonVal);
          tempCounter++;
        }
      }
    }
      this.descOfGoodscounter = tempCounter;
      if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.descOfGoodscounter === 0) {
        this.form.get('descOfGoodsAmendEditTextAreaRead').setValue(null);
      }
    }
    this.parentForm.controls[this.controlName] = this.form;

    if(this.purchaseOrders && this.purchaseOrders !== undefined && this.purchaseOrders.length > 0){
      this.purchaseOrders.forEach(purchaseOrder => {
        this.errorHandlingRowWise(purchaseOrder, true);
      });
    }
  }

  onClickPhraseIcon(event, key) {
    this.entityName = this.stateService.getSectionData(FccGlobalConstant.SI_APPLICANT_BENEFICIARY).get('applicantEntity').value.shortName;
    if (this.entityName !== '' && this.entityName !== undefined) {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key, '01', false, this.entityName);
    } else {
      this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_SI, key, '01', false);
    }
  }

  removeMandatory(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
      this.form.get(fields[0]).setErrors(null);
      this.form.get(fields[0]).clearValidators();
    }
  }

  checkPurchaseOrderExist(){
    if(this.purchaseOrders && this.purchaseOrders != undefined && this.purchaseOrders.length !== 0){
      this.purchaseOrders.forEach(purchaseOrder => {
        purchaseOrder['PurchaseOrderDate'] = new Date(purchaseOrder.PurchaseOrderDate);
      });
    }
  }

  generateDataFromResponse(Po) {
    const PoArray = Po['line_items'];
    if (Array.isArray(PoArray)) {
      for (let i = 0; i < PoArray.length; i++) {
        let poAvailable = false;
        for (let j = 0; j < this.purchaseOrders.length; j++) {
          if (PoArray[i].po_ref_id && PoArray[i].po_ref_id === this.purchaseOrders[j].PurchaseOrderID) {
            poAvailable = true;
            const objLineItem = new Object();
            objLineItem[FccGlobalConstant.PURCHASE_ORDER_DESCRIPTION] = PoArray[i].description;
            objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_CODE] = PoArray[i].qty_unit_measr_code;
            objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE] = PoArray[i].qty_val;
            objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_POS] = PoArray[i].qty_tol_pstv_pct;
            objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG] = PoArray[i].qty_tol_neg_pct;
            objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT] = PoArray[i].price_amt;
            objLineItem[FccGlobalConstant.PURCHASE_ORDER_PRICE_UNIT_POS] = PoArray[i].price_tol_pstv_pct;
            objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg] = PoArray[i].price_tol_neg_pct;
            objLineItem['PurchaseOrderLineItemSortOrder'] = PoArray[i].line_item_sort_order;
            if(typeof(PoArray[i].line_item_creation_date)==='string'){
              objLineItem['PurchaseOrderLineItemCreatedDate'] =
              new Date(this.commonService.convertToDateFormat(PoArray[i].line_item_creation_date));
            }
            else{
              objLineItem['PurchaseOrderLineItemCreatedDate'] = new Date(PoArray[i].line_item_creation_date);
            }

            objLineItem['PurchaseOrderLineItemNumber'] = PoArray[i].line_item_number;
            this.purchaseOrders[j].PurchaseOrderLineItems.push(objLineItem);
          }
        }
        if (PoArray[i].po_ref_id && !poAvailable) {
          const obj = new Object();
          obj['PurchaseOrderID'] = PoArray[i].po_ref_id;
          if(typeof(PoArray[i].po_date)==='string'){
            obj['PurchaseOrderDate'] = new Date(this.commonService.convertToDateFormat(PoArray[i].po_date));
          }
          else{
            obj['PurchaseOrderDate'] = new Date(PoArray[i].po_date);
          }
          obj['PurchaseOrderTaxes'] = PoArray[i].taxes;
          obj['PurchaseOrderCreatedDate'] = new Date(PoArray[i].po_creation_date);
          obj['POSortOrder'] = PoArray[i].po_sort_order;
          const objLineItem = new Object();
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_DESCRIPTION] = PoArray[i].description;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_CODE] = PoArray[i].qty_unit_measr_code;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE] = PoArray[i].qty_val;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_POS] = PoArray[i].qty_tol_pstv_pct;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG] = PoArray[i].qty_tol_neg_pct;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT] = PoArray[i].price_amt;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_PRICE_UNIT_POS] = PoArray[i].price_tol_pstv_pct;
          objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg] = PoArray[i].price_tol_neg_pct;
          objLineItem['PurchaseOrderLineItemSortOrder'] = PoArray[i].line_item_sort_order;
          if(typeof(PoArray[i].line_item_creation_date)==='string'){
            objLineItem['PurchaseOrderLineItemCreatedDate'] =
            new Date(this.commonService.convertToDateFormat(PoArray[i].line_item_creation_date));
          }
          else{
            objLineItem['PurchaseOrderLineItemCreatedDate'] = new Date(PoArray[i].line_item_creation_date);
          }
          objLineItem['PurchaseOrderLineItemNumber'] = PoArray[i].line_item_number;
          obj['PurchaseOrderLineItems'] = [objLineItem];
          this.purchaseOrders.push(obj);
        }
      }
    }
    else if (PoArray.po_ref_id) {
      const obj = new Object();
      obj['PurchaseOrderID'] = PoArray.po_ref_id;
      if(typeof(PoArray.po_date)==='string'){
        obj['PurchaseOrderDate'] = new Date(this.commonService.convertToDateFormat(PoArray.po_date));
      }
      else{
        obj['PurchaseOrderDate'] = new Date(this.datePipe.transform(PoArray.po_date,'dd/MM/yyyy'));
      }
      obj['PurchaseOrderTaxes'] = PoArray.taxes;
      obj['PurchaseOrderCreatedDate'] = new Date(PoArray.po_creation_date);
      obj['POSortOrder'] = PoArray.po_sort_order;
      const objLineItem = new Object();
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_DESCRIPTION] = PoArray.description;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_CODE] = PoArray.qty_unit_measr_code;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE] = PoArray.qty_val;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_POS] = PoArray.qty_tol_pstv_pct;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG] = PoArray.qty_tol_neg_pct;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT] = PoArray.price_amt;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_PRICE_UNIT_POS] = PoArray.price_tol_pstv_pct;
      objLineItem[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg] = PoArray.price_tol_neg_pct;
      objLineItem['PurchaseOrderLineItemNumber'] = PoArray.line_item_number;
      objLineItem['PurchaseOrderLineItemSortOrder'] = PoArray.line_item_sort_order;
      if(typeof(PoArray.line_item_creation_date)==='string'){
        objLineItem['PurchaseOrderLineItemCreatedDate'] = new Date(this.commonService.convertToDateFormat(PoArray.line_item_creation_date));
      }
      else{
        objLineItem['PurchaseOrderLineItemCreatedDate'] = new Date(PoArray.line_item_creation_date);
      }
      obj['PurchaseOrderLineItems'] = [objLineItem];
      this.purchaseOrders.push(obj);
    }
  }

  onClickPurchaseOrderToggle() {
    const togglevalue = this.form.get('purchaseOrderToggle').value;
    if (togglevalue === FccBusinessConstantsService.NO) {
      this.onClickDeleteSelectedRecord();
    }
    else {
      if (this.stateService.getSectionData('siAmountChargeDetails').get('currency').value !== null &&
        this.stateService.getSectionData('siAmountChargeDetails').get('currency').value !== '' &&
        this.stateService.getSectionData('siAmountChargeDetails').get('currency').value !== undefined) {
        this.onClickNewPurchaseButton();
        this.setTotalGrossAmount(this.totalGrossAmount, 'onClickPurchaseOrderToggle');
        this.form.get('purchaseOrderTaxes')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('NewPurchaseButton')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('poOverrideError')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('poSeparator')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('line_items')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('purchaseOrderToggle')[this.params]['warning'] = '';
        const currency = this.stateService.getSectionData('siAmountChargeDetails').get('currency').value.currencyCode;
        const TotalGrossAmount = this.currencyConverterPipe.transform(this.totalGrossAmount.toString(), currency);
        this.form.get('totalGrossAmount').setValue(currency + " " + TotalGrossAmount);
        if (this.totalGrossAmount != 0) {
          this.setTotalGrossAmount(TotalGrossAmount, 'onClickPurchaseOrderToggle');
        }
        this.caleculateLCAmount(this.totalGrossAmount);
        this.form.get('deductions')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.addFCCValidators('deductions', Validators.pattern(FccGlobalConstant.numberPattern), 0);
    }
  }
}

  getColumns() {
    const tableColumns = [
      {
        field: 'Select',
        header: `${this.translateService.instant('Select')}`,
        width: '5%'
      },
      {
        field: 'PurchaseOrderDescription',
        header: `${this.translateService.instant('PurchaseOrderDescription')}`,
        width: '30%'
      },
      {
        field: 'PurchaseOrderQuantityCode',
        header: `${this.translateService.instant('PurchaseOrderQuantityCode')}`,
        width: '10%'
      },
      {
        field: 'PurchaseOrderQuantityWithValAndTolerance',
        header: `${this.translateService.instant('PurchaseOrderQuantityWithValAndTolerance')}`,
        width: '15%'
      },
      {
        field: 'PurchaseOrderPriceUnitWithValAndTolerance',
        header: `${this.translateService.instant('PurchaseOrderPriceUnitWithValAndTolerance')}`,
        width: '15%'
      },
      {
        field: 'PurchaseOrderAmount',
        header: `${this.translateService.instant('PurchaseOrderAmount')}`,
        width: '13%'
      },
      {
        field: 'Actions',
        header: `${this.translateService.instant('actionsHeader')}`,
        width: '12%'
      },
    ];
    return tableColumns;
  }

  onClickSavePurchaseOrderButton(event: any, purchaseOrder: any) {
    this.savePurchaseButton(purchaseOrder);
  }
  onClickSaveAddNewPurchaseOrderButton(event: any, purchaseOrder: any) {
    this.savePurchaseButton(purchaseOrder);
    this.onClickNewPurchaseButton();
  }

  onClickCancelPurchaseOrderButton(event: any, purchaseOrder: any) {
    purchaseOrder.newlyPurchaseOrder = false;
    this.errorHandlingRowWise(purchaseOrder, false);
  }

  savePurchaseButton(purchaseOrder: any) {
    purchaseOrder.newlyPurchaseOrder = false;
    const narrative = this.buildTable();
    this.form.get('descOfGoodsText').patchValue(narrative);
    this.updateNarrativeCount(this.form, 'descOfGoodsText');
    this.form.get('descOfGoodsText').updateValueAndValidity();
    this.errorHandlingRowWise(purchaseOrder, false);
    this.commonService.purchaseOrderUpdated.next(purchaseOrder);
    let TotalGrossAmount = 0;
    this.purchaseOrders.forEach(val => {
      const grossAmount = this.caleculateTotalGrossAmount(val);
      TotalGrossAmount = TotalGrossAmount + grossAmount;
    });
    if(this.form.get('deductions').value){
      TotalGrossAmount=TotalGrossAmount-this.form.get('deductions').value;
    }
    this.caleculateLCAmount(TotalGrossAmount);
    const currency = this.stateService.getSectionData('siAmountChargeDetails').get('currency').value.currencyCode;
    TotalGrossAmount = this.currencyConverterPipe.transform(TotalGrossAmount.toString(), currency);
    this.form.get('totalGrossAmount').setValue(currency + " " + TotalGrossAmount);
   this.setTotalGrossAmount(TotalGrossAmount, 'savePurchaseButton');
   this.caleculateLCAmount(TotalGrossAmount);
    this.updateDataArray();
  }

  onKeyupDeductions(){
    let TotalGrossAmount = 0;
    this.purchaseOrders.forEach(val => {
      const grossAmount = this.caleculateTotalGrossAmount(val);
      TotalGrossAmount = TotalGrossAmount + grossAmount;
    });
    if(this.form.get('deductions').value && !isNaN(this.form.get('deductions').value)){
      if(Number(this.form.get('deductions').value) > Number(TotalGrossAmount)){
        const narrativeDetailsForm = this.stateService.getSectionData('siNarrativeDetails');
        if(narrativeDetailsForm !== undefined){
          const goodsandDocForm = narrativeDetailsForm.get('siGoodsandDoc');
          if(goodsandDocForm !== undefined){
            const descOfGoodsForm = goodsandDocForm.get('siDescOfGoods');
            if(descOfGoodsForm && descOfGoodsForm.get('deductions') !== undefined){
              descOfGoodsForm.get('deductions').setErrors({ deductionsRangeReached: true });
              descOfGoodsForm.get(this.element).setErrors({ invalid: true });
            }
          }
        }
        return;
      }
    }
    if(this.form.get('deductions').value){
      TotalGrossAmount=TotalGrossAmount - this.form.get('deductions').value;
    }
    const currency = this.stateService.getSectionData('siAmountChargeDetails').get('currency').value.currencyCode;
   TotalGrossAmount = this.currencyConverterPipe.transform(TotalGrossAmount.toString(), currency);
   this.form.get('totalGrossAmount').setValue(currency + " " + TotalGrossAmount);
   this.setTotalGrossAmount(TotalGrossAmount, 'onKeyupDeductions');
   this.caleculateLCAmount(TotalGrossAmount);
   const narrative=this.buildTable();
   this.form.get('descOfGoodsText').patchValue(narrative);
   this.updateNarrativeCount(this.form, 'descOfGoodsText');
   this.form.get('descOfGoodsText').updateValueAndValidity();
  }

  onKeyupGoodsPercentageValue(){
    let TotalGrossAmount = 0;
    this.purchaseOrders.forEach(val => {
      const grossAmount = this.caleculateTotalGrossAmount(val);
      TotalGrossAmount = TotalGrossAmount + grossAmount;
    });
    if(this.form.get('deductions').value){
      TotalGrossAmount=TotalGrossAmount-this.form.get('deductions').value;
    }
     this.caleculateLCAmount(TotalGrossAmount);

  }


  private caleculateLCAmount(TotalGrossAmount: number) {
    let lcAmount=0;
    const currency = this.stateService.getSectionData('siAmountChargeDetails').get('currency').value.currencyCode;
    if (this.form.get('goodsPercentageValue') && this.form.get('goodsPercentageValue').value) {
      lcAmount = TotalGrossAmount * (this.form.get('goodsPercentageValue').value / 100);
      }
    else {
      lcAmount = TotalGrossAmount;
    }
    lcAmount = this.currencyConverterPipe.transform(lcAmount.toString(), currency);
    this.form.get('poLcAmount').setValue(currency + " " +lcAmount);
  }
  onClickNewPurchaseButton() {
    const purchaseOrder = new PurchaseOrder(null, null, [], null, [], [], [], true, 0, new Date(), 2);
    this.addLineItem(1, purchaseOrder);
    this.initializeFormGroup(purchaseOrder);
    if (this.purchaseOrders.length !== 0) {
      this.purchaseOrders.unshift(purchaseOrder);
    } else {
      this.purchaseOrders.push(purchaseOrder);
    }
    // commenting since not used anywhere
    // const currency = this.stateService.getSectionData('siAmountChargeDetails').get('currency').value.currencyCode;
    this.form.get('deductions')[this.params][FccGlobalConstant.RENDERED] = true;
    this.form.get('poSeparator')[this.params][FccGlobalConstant.RENDERED] = true;
    this.form.get('poOverrideError')[this.params][FccGlobalConstant.RENDERED] = true;
    this.form.get('totalGrossAmount')[this.params][FccGlobalConstant.RENDERED] = true;
    this.commonService.purchaseOrderAdded.next(purchaseOrder);
    this.handlePurchaseOrders();
  }



  handlePurchaseOrders() {
    setTimeout(() => {
      this.poResponseArray = this.purchaseOrders;
      this.poFormControlArray = this.form.get('line_items')[FccGlobalConstant.PARAMS]['controlDetails'];
      this.patchFieldParameters(this.form.get('line_items'), { PurchaseOrderLineItems: this.form.get(this.remittanceInst) });
      this.form.get('line_items')[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = this.poResponseArray;
      this.form.updateValueAndValidity();
      this.commonService.purchaseOrders.next(this.poResponseArray);
    }, FccGlobalConstant.LENGTH_100);

  }

  onClickUploadPurchaseButton() {
    //eslint : no-empty-function
  }
  constuctLineItemObj() {
    if (this.form
      .get(FccGlobalConstant.LINEITEM1)) {
      const lineItem = this.form
        .get(FccGlobalConstant.LINEITEM1).value;
        if (typeof lineItem === 'string' && this.commonService.isnonEMptyString(lineItem)) {
        const objLineiTem = JSON.parse(lineItem)['lineItem'];
        this.form
          .get(FccGlobalConstant.LINEITEM1).setValue({ 'line_items': objLineiTem });
      }
    }
  }

  initializeFormGroup(purchaseOrder) {
    if (this.purchaseOrderDetails) {
      const purchaseOrderLineItemJSON = this.purchaseOrderDetails;
      if (purchaseOrderLineItemJSON.length > 0) {
        this.form.get('purchaseOrderID').setValue(purchaseOrderLineItemJSON[0].po_ref_id);
        this.form.get('purchaseOrderTaxes').setValue(purchaseOrderLineItemJSON[0].taxes);
        purchaseOrderLineItemJSON.forEach(element => {
          const selectedJson: {
            PurchaseOrderDescription: any,
            PurchaseOrderQuantityCode: any,
            PurchaseOrderQuantityValue: any,
            PurchaseOrderQuantityTolerancePos: any,
            PurchaseOrderQuantityToleranceNeg: any,
            PurchaseOrderQuantityPriceUnit: any,
            PurchaseOrderPriceUnitPos: any,
            PurchaseOrderQuantityPriceUnitNeg: any,
            PurchaseOrderLineItemNumber: any,
            PurchaseOrderLineItemCreatedDate: any,
            PurchaseOrderLineItemSortOrder: any

          } = {
            PurchaseOrderDescription: element.description,
            PurchaseOrderQuantityCode: element.qty_unit_measr_code,
            PurchaseOrderQuantityValue: element.qty_val,
            PurchaseOrderQuantityTolerancePos: element.qty_tol_pstv_pct,
            PurchaseOrderQuantityToleranceNeg: element.qty_tol_neg_pct,
            PurchaseOrderQuantityPriceUnit: element.price_amt,
            PurchaseOrderPriceUnitPos: element.price_tol_pstv_pct,
            PurchaseOrderQuantityPriceUnitNeg: element.price_tol_neg_pct,
            PurchaseOrderLineItemNumber: element.line_item_number,
            PurchaseOrderLineItemCreatedDate: element.line_item_creation_date,
            PurchaseOrderLineItemSortOrder: element.line_item_sort_order
          };
          const model = new PurchaseOrderLineItemMap(selectedJson[FccGlobalConstant.PURCHASE_ORDER_DESCRIPTION],
            selectedJson[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_CODE],
            selectedJson[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE],
            selectedJson[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_POS],
            selectedJson[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG],
            selectedJson[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT],
            selectedJson[FccGlobalConstant.PURCHASE_ORDER_PRICE_UNIT_POS],
            selectedJson[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg],
            selectedJson['PurchaseOrderLineItemNumber'],
            selectedJson['line_item_creation_date'],
            selectedJson['line_item_sort_order']
          );
          this.lineItemModelMap.push(model);
        });
        this.handleLineItemsGrid(purchaseOrder);
        this.form.updateValueAndValidity();
      } else if (Object.keys(purchaseOrderLineItemJSON).length > 0 && purchaseOrderLineItemJSON.constructor === Object) {

        const selectedJson: {
          PurchaseOrderDescription: any,
          PurchaseOrderQuantityCode: any,
          PurchaseOrderQuantityValue: any,
          PurchaseOrderQuantityTolerancePos: any,
          PurchaseOrderQuantityToleranceNeg: any,
          PurchaseOrderQuantityPriceUnit: any,
          PurchaseOrderPriceUnitPos: any,
          PurchaseOrderQuantityPriceUnitNeg: any,
          PurchaseOrderLineItemNumber: any,
          PurchaseOrderLineItemCreatedDate: any,
          PurchaseOrderLineItemSortOrder: any
        } = {
          PurchaseOrderDescription: purchaseOrderLineItemJSON[FccGlobalConstant.OBJ_PURCHASE_ORDER_DESCRIPTION],
          PurchaseOrderQuantityCode: purchaseOrderLineItemJSON[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_CODE],
          PurchaseOrderQuantityValue: purchaseOrderLineItemJSON[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_VALUE],
          PurchaseOrderQuantityTolerancePos: purchaseOrderLineItemJSON[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_TOLERANCE_POS],
          PurchaseOrderQuantityToleranceNeg: purchaseOrderLineItemJSON[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG],
          PurchaseOrderQuantityPriceUnit: purchaseOrderLineItemJSON[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_PRICE_UNIT],
          PurchaseOrderPriceUnitPos: purchaseOrderLineItemJSON[FccGlobalConstant.OBJ_PURCHASE_ORDER_PRICE_UNIT_POS],
          PurchaseOrderQuantityPriceUnitNeg: purchaseOrderLineItemJSON[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg],
          PurchaseOrderLineItemNumber: purchaseOrderLineItemJSON['line_item_number'],
          PurchaseOrderLineItemCreatedDate: purchaseOrderLineItemJSON['line_item_creation_date'],
          PurchaseOrderLineItemSortOrder: purchaseOrderLineItemJSON['line_item_sort_order']
        };
        const LineModel = new PurchaseOrderLineItemMap(
          selectedJson[FccGlobalConstant.OBJ_PURCHASE_ORDER_DESCRIPTION],
          selectedJson[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_CODE],
          selectedJson[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_VALUE],
          selectedJson[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_TOLERANCE_POS],
          selectedJson[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG],
          selectedJson[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_PRICE_UNIT],
          selectedJson[FccGlobalConstant.OBJ_PURCHASE_ORDER_PRICE_UNIT_POS],
          selectedJson[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg],
          selectedJson['line_item_number'],
          selectedJson['line_item_creation_date'],
          selectedJson['line_item_sort_order']);
        this.lineItemModelMap.push(LineModel);
      }
      this.handleLineItemsGrid(purchaseOrder);
      this.form.updateValueAndValidity();
    }
  }

  onkeyUpTextField(event: any, key: any, product: any) {
    let regex;
    if (event.target.id === 'PurchaseOrderDescription') {
      regex = new RegExp(FccGlobalConstant.Z_CHARACTER_NOT_ALLOWED, "gm");
      if (event.target.value && regex.test(event.target.value)) {
        product[event.target.id + 'ErrorMessage'] = "Error: " + `${this.translateService.instant('invalidSwiftRegex',
          { validSwiftRegex: FccGlobalConstant.Z_CHARACTER_NOT_ALLOWED })}`;
        this.form.updateValueAndValidity();
      }
      else if (!product['PurchaseOrderDescription']) {
        product['PurchaseOrderDescription' + 'ErrorMessage'] = "Error: " + `${this.translateService.instant('required',
          { field: this.translateService.instant('PurchaseOrderDescription') })}`;
      } else {
        product[event.target.id + 'ErrorMessage'] = '';
      }
    }
    else if ((event.target.id == 'PurchaseOrderQuantityCode')){
      if(!event.target.value){
        product[event.target.id + 'ErrorMessage'] = "Error: " + `${this.translateService.instant('required',
           { field: this.translateService.instant(event.target.id) })}`;
      }else{
        const selection: any = event.target.value;
        if (typeof selection === 'string') {
          const val = this.quantities.find(x => x.label === selection);
          if(val){
            product['isValidRow'] = true;
            product[event.target.id + 'ErrorMessage'] = '';
            return;
          }
          product['isValidRow'] = false;
          product[event.target.id + 'ErrorMessage'] = "Error: " + `${this.translateService.instant('invalidPurchaseOrderQuantityCode',
           { field: this.translateService.instant(event.target.id) })}`;
        }
        this.form.updateValueAndValidity();
      }
    }
    else if ((event.target.id == 'PurchaseOrderQuantityValue' ||
      event.target.id == 'PurchaseOrderQuantityPriceUnit') && !event.target.value) {
      product[event.target.id + 'ErrorMessage'] = "Error: " + `${this.translateService.instant('required',
        { field: this.translateService.instant(event.target.id) })}`;

    }
    else {
      if (event.target.value && this.amountFieldArray.includes(event.target.id)) {
        regex = new RegExp(FccGlobalConstant.AMOUNT_VALIDATION, "gm");
        if (!regex.test(event.target.value)) {
          const fieldName = this.translateService.instant(event.target.id);
          product[event.target.id + 'ErrorMessage'] = "Error: " + `${this.translateService.instant('pattern', { field: fieldName })}`;
          this.form.updateValueAndValidity();
        }
        else {
          product[event.target.id + 'ErrorMessage'] = '';
          event.target.value=event.target.value.replace(/\b(0(?!\b))+/g, '');
        }

      }
      else {
        product[event.target.id + 'ErrorMessage'] = '';
      }

    }
    this.formatTableHeaderValues(event, key, product);
  }

  onSaveMandatoryCheck(product) {
    if (!product['PurchaseOrderDescription']) {
      product['PurchaseOrderDescription' + 'ErrorMessage'] = "Error: " + `${this.translateService.instant('required',
        { field: this.translateService.instant('PurchaseOrderDescription') })}`;
    }
    if (!product['PurchaseOrderQuantityCode']) {
      product['PurchaseOrderQuantityCode' + 'ErrorMessage'] = "Error: " + `${this.translateService.instant('requiredDropDown',
        { field: this.translateService.instant('PurchaseOrderQuantityCode') })}`;
    } if (!product['PurchaseOrderQuantityValue']) {
      product['PurchaseOrderQuantityValue' + 'ErrorMessage'] = "Error: " + `${this.translateService.instant('required',
        { field: this.translateService.instant('PurchaseOrderQuantityValue') })}`;
    }
    if (!product['PurchaseOrderQuantityPriceUnit']) {
      product['PurchaseOrderQuantityPriceUnit' + 'ErrorMessage'] = "Error: " + `${this.translateService.instant('required',
        { field: this.translateService.instant('PurchaseOrderQuantityPriceUnit') })}`;
    }

  }

  onClickDeleteSelectedLineItem(event: any, purchaseOrder: any){
    this.selectedLineItems.forEach(val => {
      const index = purchaseOrder.PurchaseOrderLineItems.findIndex(x => x === val);
      this.removeLineItem(purchaseOrder,index);

  }
);
this.commonService.purchaseOrderLineItemGridSelectedData.next(null);

}

  formatTableHeaderValues(event: any, key: any, product: any) {
    const currency = this.stateService.getSectionData('siAmountChargeDetails').get('currency').value.shortName;
    if (product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE] > 0 && product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT]) {
      const amt = this.commonService.getCurrencyFormatedAmount(currency,
        product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE] * product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT], false);
      product.PurchaseOrderAmount = currency + " " + this.commonService.getCurrencyFormatedAmount(currency,
        product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE] * product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT], false);
      product['footerLabel'] = this.translateService.instant('lineItemAmount');
      const convertedAmt=this.currencyConverterPipe.transform(amt.toString(), currency);
      product['footerValue'] = currency + " " + convertedAmt;
      if (amt.toString().length > 15) {
        product['LineItemError'] =this.translateService.instant('lineAmountCharLength');
      } else {
        product['LineItemError'] = '';
      }
    }

    if (product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE] > 0) {
      product.PurchaseOrderQuantityWithValAndTolerance = product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_VALUE]
        + " (+" + product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_POS] + ") (-"
        + product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG] + ") %";
    }

    if (product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT] > 0) {
      product.PurchaseOrderPriceUnitWithValAndTolerance = currency + " " + product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT]
        + " (+" + product[FccGlobalConstant.PURCHASE_ORDER_PRICE_UNIT_POS] + ") (-" +
        product[FccGlobalConstant.PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg] + ") %";
    }
  }

  onClickAddMore(event: any, purchaseOrder: any) {
    this.addLineItem(5, purchaseOrder);
  }

  onClickAdd(event: any, purchaseOrder: any) {
    this.addLineItem(1, purchaseOrder);
  }

  onClickDeleteSelectedRecord() {
    const dir = localStorage.getItem('langDir');
    const locaKeyValue = this.translateService.instant('deletePurchaseOrderLineItemsConfirmationMsg');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: `${this.translateService.instant('deletePurchaseOrderLineItem')}`,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: locaKeyValue }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.form.get('purchaseOrderToggle')[this.params]['warning'] = '';
        this.form.get('purchaseOrderremittanceInst')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('NewPurchaseButton')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('purchaseOrderToggle')[this.params]['warning'] = '';
        this.form.get('line_items')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('totalGrossAmount')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('grossAmountError')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('goodsPercentageValue')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('deductions')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('line_items')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('poSeparator')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('poOverrideError')[this.params][FccGlobalConstant.RENDERED] = false;
        this.purchaseOrders=[];
        this.form.get(FccGlobalConstant.LINEITEM1).setValue(null);
        this.deleteAllPurchaseOrders();
        this.form.get('descOfGoodsText').patchValue(" ");
        this.updateNarrativeCount(this.form, 'descOfGoodsText');
        this.form.get('descOfGoodsText').updateValueAndValidity();
        this.totalGrossAmount=0;
        this.form.get('totalGrossAmount').setValue('');
        this.form.updateValueAndValidity();
        this.updateDataArray();
      }
      else{
        this.form.get('purchaseOrderToggle').setValue('Y');
      }

    });
  }

  deleteAllPurchaseOrders() {
    this.purchaseOrders = [];
    this.commonService.purchaseOrderLineItemGridUpdateSelectedData.next(true);
    this.handlePurchaseOrders();
  }

  onUntogglingUrchaseOrder() {
    const dir = localStorage.getItem('langDir');
    const locaKeyValue = this.translateService.instant('clearingPurchaseOrderConfirmationMsg');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: `${this.translateService.instant('clearPurchaseOrder')}`,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: locaKeyValue }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
      }

    });
  }

  addLineItem(noOfItemToadd: number, purchaseOrder: any) {
    if (noOfItemToadd > 0) {
      for (let i = 0; i < noOfItemToadd; i++) {
        const lineItemModel = new PurchaseOrderLineItemMap(null, null, null, null, null, null, null, null, 0, new Date(), 2);
        if (purchaseOrder.PurchaseOrderLineItems.length !== 0) {
          purchaseOrder.PurchaseOrderLineItems.unshift(lineItemModel);
        } else {
          purchaseOrder.PurchaseOrderLineItems.push(lineItemModel);
        }
        this.commonService.purchaseOrderLineItemGridExpandedElementData.next([lineItemModel, purchaseOrder]);
      }
    }
    this.handleLineItemsGrid(purchaseOrder);
    setTimeout(() => {
      //eslint : no-empty-function
    }, 1000);
  }


  onClickDeletePurchaseOrder(event: any, purchaseOrder: any) {
    const dir = localStorage.getItem('langDir');
    const locaKeyValue = this.translateService.instant('deletePurchaseOrderConfirmationMsg');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: `${this.translateService.instant('deletePurchaseOrder')}`,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: locaKeyValue }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        const index = this.purchaseOrders.findIndex(x => x === purchaseOrder);
        if (index !== null) {
          this.removePurchaseOrder(index);
        }
        this.commonService.purchaseOrderLineItemGridUpdateSelectedData.next(true);
      }
    });
  }
  setTotalGrossAmount(totalGrossAmount, from){
    if((totalGrossAmount !== 0 && totalGrossAmount !== '0' && totalGrossAmount!== '0.00' &&
    this.form.get('purchaseOrderToggle').value === 'Y') || (this.purchaseOrders && this.purchaseOrders.length>0)){
      this.form.get('totalGrossAmount')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get('deductions')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get('totalGrossAmount')[this.params]['labelStyleClass']='grossAmountLabelClass';
      this.form.get('totalGrossAmount')[this.params]['valueStyleClass']='grossAmountValueClass';
    }else{
      this.form.get('deductions')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('totalGrossAmount')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('totalGrossAmount')[this.params]['labelStyleClass']='grossAmountLabelClass';
      this.form.get('totalGrossAmount')[this.params]['valueStyleClass']='grossAmountValueClass';
    }
    if (this.stateService.getSectionData('siAmountChargeDetails').get('amount') &&
    (totalGrossAmount !== 0 && totalGrossAmount !== '0' && totalGrossAmount!== '0.00' )
     && Number(this.stateService.getSectionData('siAmountChargeDetails').get('amount').value) !== Number(totalGrossAmount)
      && this.form.get('purchaseOrderToggle').value === 'Y') {
        this.form.get('grossAmountError')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('overrideLCAmount')[this.params][FccGlobalConstant.RENDERED] = true;
        this.handleGrossAmountError(from);
      }
      else {
          this.form.get('grossAmountError')[this.params][FccGlobalConstant.RENDERED] = false;
          this.form.get('overrideLCAmount')[this.params][FccGlobalConstant.RENDERED] = false;
      }
  }

  onClickOverrideLCAmount(obj: any) {
    if (obj.value === 'overrideLCAmountYes') {
      let totalGrossAmountVal = 0;
      this.purchaseOrders.forEach(val => {
        const grossAmount = this.caleculateTotalGrossAmount(val);
        totalGrossAmountVal = totalGrossAmountVal + grossAmount;
      });

      if(this.form.get('deductions').value){
        totalGrossAmountVal = totalGrossAmountVal-this.form.get('deductions').value;
      }

      this.stateService.setValue('siAmountChargeDetails', 'amount', totalGrossAmountVal.toString(), false);
      this.form.get('grossAmountError')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('overrideLCAmount')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('overrideLCAmountMessage')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('overrideLCAmountMessage').setValue('YES');
      this.form.get('overrideLCAmountMessage').updateValueAndValidity();
    }
    else if(obj.value === 'overrideLCAmountNo'){
      this.form.get('grossAmountError')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get('overrideLCAmount')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('overrideLCAmountMessage')[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get('overrideLCAmountMessage').setValue('NO');
      this.form.get('overrideLCAmountMessage').updateValueAndValidity();
    }
    const amountChargeDetailsForm = this.stateService.getSectionData('siAmountChargeDetails');
    amountChargeDetailsForm.get('amount').updateValueAndValidity();
  }

  handleGrossAmountError(from : string){
    if(from === 'ngOnInit'){
      const overrideLCAmountVal = this.form.get('overrideLCAmountMessage').value;
      if(overrideLCAmountVal === 'YES'){
        this.form.get('grossAmountError')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('overrideLCAmount')[this.params][FccGlobalConstant.RENDERED] = true;
      }
      else
      if(overrideLCAmountVal === 'NO'){
        this.form.get('grossAmountError')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('overrideLCAmount')[this.params][FccGlobalConstant.RENDERED] = false;
      }
    }
  }

  removePurchaseOrder(index) {
    if (index !== null) {
      this.purchaseOrders.splice(index, 1);
      this.commonService.purchaseOrders.next(this.purchaseOrders);
      this.form.updateValueAndValidity();
      const narrative = this.buildTable();
      this.form.get('descOfGoodsText').patchValue(narrative);
      this.updateNarrativeCount(this.form, 'descOfGoodsText');
      this.form.get('descOfGoodsText').updateValueAndValidity();
      let TotalGrossAmount = 0;
      this.purchaseOrders.forEach(val => {
        const grossAmount = this.caleculateTotalGrossAmount(val);
        TotalGrossAmount = TotalGrossAmount + grossAmount;
      });
      if(this.form.get('deductions').value){
        TotalGrossAmount=TotalGrossAmount-this.form.get('deductions').value;

      }
      const currency = this.stateService.getSectionData('siAmountChargeDetails').get('currency').value.currencyCode;
      TotalGrossAmount = this.currencyConverterPipe.transform(TotalGrossAmount.toString(), currency);
      this.form.get('totalGrossAmount').setValue(currency + " " + TotalGrossAmount);
      this.setTotalGrossAmount(TotalGrossAmount, 'removePurchaseOrder');
      this.caleculateLCAmount(TotalGrossAmount);
      this.updateDataArray();
      if(this.purchaseOrders && this.purchaseOrders.length>0){
        this.form.get('deductions')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('poSeparator')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('poOverrideError')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('totalGrossAmount')[this.params][FccGlobalConstant.RENDERED] = true;
        this.form.get('grossAmountError')[this.params][FccGlobalConstant.RENDERED] = true;
      }
      else{
        this.form.get('deductions')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('poSeparator')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('poOverrideError')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('totalGrossAmount')[this.params][FccGlobalConstant.RENDERED] = false;
        this.form.get('grossAmountError')[this.params][FccGlobalConstant.RENDERED] = false;
      }
      if(this.purchaseOrders && this.purchaseOrders?.length == 0){
        this.onClickNewPurchaseButton();
      }
    }
  }

  onClickDelete(event: any, key: any, index: any, purchaseOrder: any) {
    const dir = localStorage.getItem('langDir');
    const locaKeyValue = this.translateService.instant('deletePurchaseOrderLineItemConfirmationMsg');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: `${this.translateService.instant('deletePurchaseOrderLineItem')}`,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: locaKeyValue }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        if (index !== null) {
          this.removeLineItem(purchaseOrder, index);
        }
      }
    });
  }

  removeLineItem(purchaseOrder, index: any) {
    if (index !== null) {
      purchaseOrder.PurchaseOrderLineItems.splice(index, 1);
      this.commonService.purchaseOrderUpdated.next(purchaseOrder);
      this.lineItemModel = null;
      this.handleLineItemsGrid(purchaseOrder);
      this.form.updateValueAndValidity();
      this.updateDataArray();
    }
  }
   // commenting since event, key, product nver used - lint issue
  // onClickCancelRow(event: any, key: any, product: any) {
  //   //eslint : no-empty-function
  // }

  onClickSaveRow(event: any, key: any, product: any, purchaseOrder: any) {
    this.onSaveMandatoryCheck(product);
    this.errorHandlingRowWise(purchaseOrder, false);
    this.commonService.purchaseOrderUpdated.next(purchaseOrder);
    this.updateDataArray();
    const currency = this.stateService.getSectionData('siAmountChargeDetails').get('currency').value.currencyCode;
    this.purchaseOrders.forEach(obj => {
      obj.grossAmount = this.getGrossAmount(obj, currency);
    });
  }

  lineItems() {
    return this.lineItemModelMap;
  }

  getQuantityCodes() {
    this.codeData.codeId = FccGlobalConstant.CODEDATA_QUANTITY_CODE_N202;
    this.codeData.productCode = this.productCodeValue;
    this.codeData.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    this.codeData.language = localStorage.getItem(FccGlobalConstant.LANGUAGE) !== null ?
      localStorage.getItem(FccGlobalConstant.LANGUAGE) : '';
    this.commonService.getCodeDataDetails(this.codeData).subscribe(response => {
      response.body.items.forEach(responseValue => {
        const eventData: { label: string; value: any } = {
          label: responseValue.longDesc,
          value: responseValue.value
        };
        this.quantities.push(eventData);
      });
    });
  }

  handleSelecteLineItemGrid(response) {
    this.selectedLineItems = response;
  }

  handleLineItemsGrid(purchaseOrder: PurchaseOrder) {

    setTimeout(() => {
      this.form.get(this.remittanceInst)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS] = this.quantities;
      const responseArray = purchaseOrder.PurchaseOrderLineItems;
      this.formModelArray = this.form.get('line_items')[FccGlobalConstant.PARAMS]['subControlsDetails'];
      const columnsHelper = this.formatePOResult(responseArray);
      this.patchFieldParameters(this.form.get(this.remittanceInst), { columns: this.getColumns() });
      this.patchFieldParameters(this.form.get(this.remittanceInst), { columnsHeaders: this.getColumnsHeaders(this.getColumns()) });
      this.patchFieldParameters(this.form.get(this.remittanceInst), { columnsHeaderData: columnsHelper.columnsHeaderData });
      this.updatePOTableData(responseArray);
      this.form.get(this.remittanceInst)[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = responseArray;
      purchaseOrder.columns = this.getColumns();
      purchaseOrder.columnsHeaders = this.getColumnsHeaders(this.getColumns());
      purchaseOrder.columnsHeaderData = columnsHelper.columnsHeaderData;
      this.form.updateValueAndValidity();
      this.commonService.purchaseOrderUpdated.next(purchaseOrder);
      // this.updateDataArray();
    }, FccGlobalConstant.LENGTH_100);

  }

  updatePOTableData(responseArray) {
    responseArray.forEach(data => {
      this.formatTableHeaderValues(null, null, data);
    });
  }

  getColumnsHeaders(tableColumns) {
    const columnsHeaders = [];
    tableColumns.forEach(col => {
      columnsHeaders.push(col.field);
    });
    return columnsHeaders;
  }

  formatePOResult(responseArray) {
    const columnsHelper = new POColumnsHelper();
    const columnsHeader = [];
    const columnsHeaderData = [];
    if (this.formModelArray !== null) {
      for (let i = 0; i < this.formModelArray.length; i++) {
        let key: any;
        key = Object.keys(this.formModelArray[i]);
        key = key[0];
        columnsHeader.push(key);
        columnsHeaderData.push(key);
      }

      for (let i = 0; i < responseArray.length; i++) {
        for (let j = 0; j < columnsHeader.length; j++) {
          Object.defineProperty(responseArray[i], columnsHeader[j],
            { value: this.getValue(responseArray[i][columnsHeader[j]]), writable: true });
          Object.defineProperty(responseArray[i], columnsHeader[j] + 'Type',
            { value: this.getType(columnsHeader[j]), writable: true });
          Object.defineProperty(responseArray[i], columnsHeader[j] + 'Options',
            { value: this.getOptions(), writable: true });
          Object.defineProperty(responseArray[i], columnsHeader[j] + 'Status',
            { value: this.getEditStatus(columnsHeader[j]), writable: true });
          Object.defineProperty(responseArray[i], columnsHeader[j] + 'Required',
            { value: this.getRequiredType(columnsHeader[j]), writable: true });
          Object.defineProperty(responseArray[i], columnsHeader[j] + 'Maxlength',
            { value: this.getMaxlength(columnsHeader[j]), writable: true });
          Object.defineProperty(responseArray[i], columnsHeader[j] + 'Disabled',
            { value: this.getDisabledStatus(columnsHeader[j]), writable: true });
          Object.defineProperty(responseArray[i], columnsHeader[j] + 'styleClass',
            { value: this.getStyle(columnsHeader[j]), writable: false });
          Object.defineProperty(responseArray[i], columnsHeader[j] + 'layoutClass',
            { value: this.getLayoutClass(columnsHeader[j]), writable: false });
          if (columnsHeader[j].toString() === 'PurchaseOrderQuantityValue' ||
            columnsHeader[j].toString() === 'PurchaseOrderQuantityPriceUnit') {
            Object.defineProperty(responseArray[i], columnsHeader[j] + 'ErrorArray',
              { value: this.getErrorArray(columnsHeader[j]), writable: true });
          }
        }
      }
    }
    columnsHelper.columnsHeader = columnsHeader;
    columnsHelper.columnsHeaderData = columnsHeaderData;

    return columnsHelper;
  }

  getRequiredType(key: any) {
    let returnRequiredType;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
          returnRequiredType = this.formModelArray[i][key][this.required];
        }
      } catch (e) {
      }
    }
    return returnRequiredType;
  }

  getMaxlength(key: any) {
    let returnMaxlength;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
          returnMaxlength = this.formModelArray[i][key][this.maxlength];
        }
      } catch (e) {
      }
    }
    return returnMaxlength;
  }

  getDisabledStatus(key: any) {
    let returnDisabled;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
          returnDisabled = this.formModelArray[i][key][this.disabled];
        }
      } catch (e) {
      }
    }
    return returnDisabled;
  }

  getEditStatus(key) {
    const editStatus = 'editStatus';
    let returntype;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
          returntype = this.formModelArray[i][key][editStatus];
        }
      } catch (e) {
      }
    }
    return returntype;
  }

  getErrorArray(key) {
    let array = [];
    if (key === 'PurchaseOrderQuantityValue') {
      array = ['PurchaseOrderQuantityValue', 'PurchaseOrderQuantityTolerancePos', 'PurchaseOrderQuantityToleranceNeg'];
    }
    else if (key === 'PurchaseOrderQuantityPriceUnit') {
      array = ['PurchaseOrderQuantityPriceUnit', 'PurchaseOrderPriceUnitPos', 'PurchaseOrderQuantityPriceUnitNeg'];
    }
    return array;
  }

  getValue(val: any) {
    if (val) {
      return val;
    } else {
      return '';
    }
  }
  // removing since key is never used
  getOptions() {
    let options = [];
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        options = this.form.get(this.remittanceInst)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      } catch (e) {
      }
    }
    return options;
  }

  getType(key: any) {
    let returntype;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
          returntype = this.formModelArray[i][key][this.type];
        }
      } catch (e) {
      }
    }
    return returntype;
  }
  getStyle(key: any) {
    let returntype;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
          returntype = this.formModelArray[i][key]['styleClass'];
        }
      } catch (e) {
      }
    }
    return returntype;
  }
  getLayoutClass(key: any) {
    let returntype;
    for (let i = 0; i < this.formModelArray.length; i++) {
      try {
        if (key.toString() === this.formModelArray[i][key][this.name].toString()) {
          returntype = this.formModelArray[i][key]['layoutClass'];
        }
      } catch (e) {
      }
    }
    return returntype;
  }

  updateDataArray() {
    const finalArr = [];
    let poReferences='';
    const PoArray = this.purchaseOrders;
    for (let i = 0; i < PoArray.length; i++) {
      if(PoArray[i].PurchaseOrderID !==null){
        if(i==0){
          poReferences = PoArray[i].PurchaseOrderID+poReferences;
        }
        else{
          poReferences = PoArray[i].PurchaseOrderID+","+poReferences;
        }
      }
      const poLineItemArr = PoArray[i].PurchaseOrderLineItems;
      for (let j = 0; j < poLineItemArr.length; j++) {

        const obj = {};
        obj['po_ref_id'] = PoArray[i].PurchaseOrderID;
        obj['po_date'] = PoArray[i].PurchaseOrderDate;
        obj['po_creation_date'] = PoArray[i].PurchaseOrderCreatedDate;
        obj['po_sort_order'] = PoArray[i].POSortOrder;
        if (PoArray[i].PurchaseOrderTaxes != null) {
          obj['taxes'] = PoArray[i].PurchaseOrderTaxes;
        }
        obj[FccGlobalConstant.OBJ_PURCHASE_ORDER_DESCRIPTION] = (poLineItemArr[j].PurchaseOrderDescription !== null)
          ? poLineItemArr[j].PurchaseOrderDescription : '';
        obj[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_CODE] = (poLineItemArr[j].PurchaseOrderQuantityCode !== null)
          ? poLineItemArr[j].PurchaseOrderQuantityCode : '';
        obj[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_VALUE] = poLineItemArr[j].PurchaseOrderQuantityValue;
        obj[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_TOLERANCE_POS] = poLineItemArr[j].PurchaseOrderQuantityTolerancePos;
        obj[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_TOLERANCE_NEG] = poLineItemArr[j].PurchaseOrderQuantityToleranceNeg;
        obj[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_PRICE_UNIT] = poLineItemArr[j].PurchaseOrderQuantityPriceUnit;
        obj[FccGlobalConstant.OBJ_PURCHASE_ORDER_PRICE_UNIT_POS] = poLineItemArr[j].PurchaseOrderPriceUnitPos;
        obj[FccGlobalConstant.OBJ_PURCHASE_ORDER_QUANTITY_PRICE_UNIT_Neg] = poLineItemArr[j].PurchaseOrderQuantityPriceUnitNeg;
        obj['line_item_sort_order'] = poLineItemArr[j].PurchaseOrderLineItemSortOrder;
        if (poLineItemArr[j].PurchaseOrderLineItemNumber != 0) {
          obj['line_item_number'] = poLineItemArr[j].PurchaseOrderLineItemNumber;
        }

        if(poLineItemArr[j].PurchaseOrderLineItemCreatedDate && poLineItemArr[j].PurchaseOrderLineItemCreatedDate !== null){
          obj['line_item_creation_date'] = poLineItemArr[j].PurchaseOrderLineItemCreatedDate;
        }
        finalArr.push(obj);
      }
    }
    const obj2 = {};
    obj2[FccGlobalConstant.LINEITEM1] = finalArr;
    this.form.get(FccGlobalConstant.LINEITEM1).setValue(obj2);
    this.stateService.getSectionData('siGeneralDetails').get('purchaseOrderReference').setValue(poReferences);
    this.form.updateValueAndValidity();
  }

  setErrorForPurchaseOrder(){
    const narrativeDetailsForm = this.stateService.getSectionData('siNarrativeDetails');
    if(narrativeDetailsForm !== undefined){
      const goodsandDocForm = narrativeDetailsForm.get('siGoodsandDoc');
      if(goodsandDocForm !== undefined){
        const descOfGoodsForm = goodsandDocForm.get('siDescOfGoods');
        if(descOfGoodsForm && descOfGoodsForm.get('line_items') !== undefined){
          descOfGoodsForm.get('line_items').setErrors({ invalid: true });
          descOfGoodsForm.get(this.element).setErrors({ invalid: true });
        }
      }
    }
  }

  removeErrorForpurchaseOrder(){
    const narrativeDetailsForm = this.stateService.getSectionData('siNarrativeDetails');
    if(narrativeDetailsForm !== undefined){
      const goodsandDocForm = narrativeDetailsForm.get('siGoodsandDoc');
      if(goodsandDocForm !== undefined){
        const descOfGoodsForm = goodsandDocForm.get('siDescOfGoods');
        if(descOfGoodsForm && descOfGoodsForm.get('line_items') !== undefined){
          descOfGoodsForm.get('line_items').setErrors({ invalid: false });
          descOfGoodsForm.get(this.element).setErrors({ invalid: false });
          descOfGoodsForm.get('line_items').updateValueAndValidity();
          descOfGoodsForm.get(this.element).updateValueAndValidity();
        }
      }
    }
  }

  errorHandlingRowWise(purchaseOrder, setErrorInForm) {
    for(const element of purchaseOrder.PurchaseOrderLineItems){
      if(element.PurchaseOrderQuantityCode && element.PurchaseOrderQuantityCode !== ''){
        const val = this.quantities.find(x => x.value === element.PurchaseOrderQuantityCode);
          if(!val){
            element['isValidRow'] = false;
            purchaseOrder['isValidRow'] = false;
            if(setErrorInForm){
              this.setErrorForPurchaseOrder();
            }
            break;
          }else{
            element['isValidRow'] = true;
            purchaseOrder['isValidRow'] = true;
            if(setErrorInForm){
              this.removeErrorForpurchaseOrder();
            }
          }
      }
      else{
        element['isValidRow'] = false;
        purchaseOrder['isValidRow'] = false;
        if(setErrorInForm){
          this.setErrorForPurchaseOrder();
        }
        break;
      }
      if (element.PurchaseOrderDescription && element.PurchaseOrderDescription !== ''){
        const regex = new RegExp(FccGlobalConstant.Z_CHARACTER_NOT_ALLOWED, "gm");
        if (regex.test(element.PurchaseOrderDescription)) {

          element['isValidRow'] = false;
          purchaseOrder['isValidRow'] = false;
          if(setErrorInForm){
            this.setErrorForPurchaseOrder();
          }
          break;
        }else{
          element['isValidRow'] = true;
          purchaseOrder['isValidRow'] = true;
          if(setErrorInForm){
            this.removeErrorForpurchaseOrder();
          }
        }
      }
      else{
        element['isValidRow'] = false;
        purchaseOrder['isValidRow'] = false;
        if(setErrorInForm){
          this.setErrorForPurchaseOrder();
        }
        break;
      }
      if ((element.PurchaseOrderQuantityPriceUnit && element.PurchaseOrderQuantityPriceUnit !== '')
        && (element.PurchaseOrderQuantityValue && element.PurchaseOrderQuantityValue !== '')) {
        element['isValidRow'] = true;
        purchaseOrder['isValidRow'] = true;
        if(setErrorInForm){
          this.removeErrorForpurchaseOrder();
        }
      }
      else {
        element['isValidRow'] = false;
        purchaseOrder['isValidRow'] = false;
        if(setErrorInForm){
          this.setErrorForPurchaseOrder();
        }
        break;
      }
    }
    if(purchaseOrder.PurchaseOrderDate > new Date()){
      purchaseOrder['isValidRow'] = false;
      if(setErrorInForm){
        this.setErrorForPurchaseOrder();
      }
    }
    else{
      this.removeErrorForpurchaseOrder();
    }
  }

  buildTable() {
    let narrative = '';
    let TotalGrossAmount:number=0;
    this.purchaseOrders.forEach(product => {
      let lineItemNarrative = '';
      if (product.PurchaseOrderID) {
        const nbDec = this.stateService.getSectionData('siAmountChargeDetails').get('currency').value.currencyCode;
        const purchaseOrderId = product.PurchaseOrderID;
        const purchaseOrderTaxes = product.PurchaseOrderTaxes;
        const purchaseOrderLineItemArray = product.PurchaseOrderLineItems;

        let date;
        if (product.PurchaseOrderDate && product.PurchaseOrderDate != 'Invalid Date' && product.PurchaseOrderDate
          && product.PurchaseOrderDate != undefined) {
          date = this.datePipe.transform(product.PurchaseOrderDate, 'dd/MM/yyyy');
        }
        if (lineItemNarrative != '') {
          lineItemNarrative = lineItemNarrative + "++Purchase Order Number " + purchaseOrderId + " Date " + date;
        } else {
          lineItemNarrative = lineItemNarrative + "\n\n" + "++Purchase Order Number " + purchaseOrderId + " Date " + date;
        }
        const grossAmount = this.caleculateTotalGrossAmount(product);
        TotalGrossAmount = TotalGrossAmount + grossAmount;
        purchaseOrderLineItemArray.forEach(element => {

          const quantity = element.PurchaseOrderQuantityValue;
          const measureUnit = element.PurchaseOrderQuantityCode;
          const priceVal = element.PurchaseOrderQuantityPriceUnit;
          const desc = element.PurchaseOrderDescription;
          let posTol = '';
          let negTol = '';
          let posTolValue = '';
          let negTolValue = '';
          if (element.PurchaseOrderQuantityTolerancePos && element.PurchaseOrderQuantityToleranceNeg) {
            posTol = " Tolerance: +";
            if (element.PurchaseOrderQuantityTolerancePos && element.PurchaseOrderQuantityTolerancePos != null &&
              !isNaN(element.PurchaseOrderQuantityTolerancePos)) {
              posTol = posTol + "" + element.PurchaseOrderQuantityTolerancePos;
            }
            posTol = posTol + "%/";
            negTol = "-";
            if (element.PurchaseOrderQuantityToleranceNeg && element.PurchaseOrderQuantityToleranceNeg != null &&
              !isNaN(element.PurchaseOrderQuantityToleranceNeg)) {
              negTol = negTol + "" + element.PurchaseOrderQuantityToleranceNeg;
            }
            negTol = negTol + "%";
          }
          if (element.PurchaseOrderPriceUnitPos && element.PurchaseOrderQuantityPriceUnitNeg) {
            posTolValue = " Tolerance: +";
            if (element.PurchaseOrderPriceUnitPos && element.PurchaseOrderPriceUnitPos != null &&
              !isNaN(element.PurchaseOrderPriceUnitPos)) {
              posTolValue = posTolValue + element.PurchaseOrderPriceUnitPos;
            }
            posTolValue = posTolValue + "%/";
            negTolValue = "-";
            if (element.PurchaseOrderQuantityPriceUnitNeg && element.PurchaseOrderQuantityPriceUnitNeg != null &&
              !isNaN(element.PurchaseOrderQuantityPriceUnitNeg)) {
              negTolValue = negTolValue + element.PurchaseOrderQuantityPriceUnitNeg;
            }
            negTolValue = negTolValue + "%";
          }
          if (quantity && measureUnit && priceVal && desc) {
            const amt = quantity * priceVal;
            lineItemNarrative = lineItemNarrative + "\n" + "+ " +desc + " " + quantity + " " + measureUnit +
             " " + posTol + "" + negTol + " " + nbDec + " " + priceVal + "" + posTolValue + "" + negTolValue + " Amount " +
              this.currencyConverterPipe.transform(amt.toString(), nbDec);
          }
        });
        if (purchaseOrderTaxes) {
          lineItemNarrative = lineItemNarrative + "\n" + "+Taxes: " + purchaseOrderTaxes;
        }
        lineItemNarrative = lineItemNarrative + "\n" + "+Gross Amount: " + this.getGrossAmount(product, nbDec);
        narrative = lineItemNarrative + narrative;
      }
    });
    if (narrative == '') {
      return '  ';
    }
    else{
      const currency=this.stateService.getSectionData('siAmountChargeDetails').get('currency').value.currencyCode;
      if(this.form.get("deductions").value){
        const deductaions=this.form.get("deductions").value;
        narrative= narrative+ "\n \n" + "+Other Deductions: " + currency + " " + this.currencyConverterPipe.
        transform(deductaions.toString(), currency);
      }
    }

    return narrative;

  }

  getGrossAmount(purchaseOrderObj, currency) {
    let netAmount = 0;
    purchaseOrderObj.PurchaseOrderLineItems.forEach(val => {
      if (val) {
        netAmount = netAmount + val.PurchaseOrderQuantityValue * val.PurchaseOrderQuantityPriceUnit;
      }
    });
    let grossAmount = netAmount;
    if (purchaseOrderObj.PurchaseOrderTaxes) {
      grossAmount = grossAmount + Number(purchaseOrderObj.PurchaseOrderTaxes);
    }
    return currency + ' ' + this.currencyConverterPipe.transform(grossAmount.toString(), currency);
  }

  caleculateTotalGrossAmount(purchaseOrder) {
    let netAmount = 0;
    purchaseOrder.PurchaseOrderLineItems.forEach(val => {
      if (val) {
        netAmount = netAmount + val.PurchaseOrderQuantityValue * val.PurchaseOrderQuantityPriceUnit;
      }
    });
    let grossAmount = netAmount;
    if (purchaseOrder.PurchaseOrderTaxes) {
      grossAmount = grossAmount + Number(purchaseOrder.PurchaseOrderTaxes);
    }
    return grossAmount;
  }
  getValidStatus(product) {
    if (product) {
      this.onSaveMandatoryCheck(product);
      if (product['PurchaseOrderDescription'] !== '' || product['PurchaseOrderQuantityCode'] !== '' ||
        product['PurchaseOrderQuantityValue'] !== ''
        && product['PurchaseOrderQuantityPriceUnit'] !== '') {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }

  }

  onkeyUpInnerTextFields(event: any, product: any) {
    let regex;
    if (event.target.id === 'taxes') {
      regex = new RegExp(FccGlobalConstant.percentagePattern, "gm");
      if (event.target.value && !regex.test(event.target.value)) {
        const fieldName = this.translateService.instant(event.target.id);
        product[event.target.id + 'ErrorMessage'] = "ERROR: " + `${this.translateService.instant('pattern', { field: fieldName })}`;
        this.form.updateValueAndValidity();
      }
      else {
        product[event.target.id + 'ErrorMessage'] = '';
      }
    }
  }
  setValuesForRepallNo() {
      this.form.get('descOfGoodsAmendOptions')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(this.amendEditTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(this.amendEditTextAreaKey).setValue(null);
      this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.RENDERED] = false;
      this.form.get(this.repAllTextAreaKey)[this.params][FccGlobalConstant.PREVIEW_SCREEN] = false;
      this.form.get(this.repAllTextAreaKey).setValue(null);
      if (this.form.get(this.repAllTextAreaKey)) {
        this.onClickDescOfGoodsAmendEditTextArea(null, this.repAllTextAreaKey);
      }
  }
}

