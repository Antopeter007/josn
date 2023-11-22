import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { AmendCommonService } from './../../../../common/services/amend-common.service';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { FormModelService } from '../../../../../common/services/form-model.service';
import { PhrasesService } from '../../../../../common/services/phrases.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { TransactionDetailService } from '../../../../../common/services/transactionDetail.service';
import { CorporateCommonService } from '../../../../../corporate/common/services/common.service';
import { FormControlService } from '../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { ProductStateService } from '../../../lc/common/services/product-state.service';
import { SaveDraftService } from '../../../lc/common/services/save-draft.service';
import { CustomCommasInCurrenciesPipe } from '../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../lc/initiation/services/filelist.service';
import { PrevNextService } from '../../../lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../lc/initiation/services/utility.service';
import { FCCFormGroup } from './../../../../../base/model/fcc-control.model';
import { CommonService } from './../../../../../common/services/common.service';
import { EventEmitterService } from './../../../../../common/services/event-emitter-service';
import { LeftSectionService } from './../../../../common/services/leftSection.service';
import { EcProductComponent } from './../ec-product/ec-product.component';
import { CurrencyConverterPipe } from '../../../lc/initiation/pipes/currency-converter.pipe';
import { EcProductService } from '../../services/ec-product.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-ec-shipment-details',
  templateUrl: './ec-shipment-details.component.html',
  styleUrls: ['./ec-shipment-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: EcShipmentDetailsComponent }]
})
export class EcShipmentDetailsComponent extends EcProductComponent implements OnInit {

  @Output() messageToEmit = new EventEmitter<string>();

  form: FCCFormGroup;
  module = `${this.translateService.instant('ecShipmentDetails')}`;
  contextPath: any;
  tnxTypeCode: any;
  params = 'params';
  rendered = 'rendered';
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
  readonly = 'readonly';
  year2020 = '2020';
  year2010 = '2010';
  yearOther = 'OTHER';
  incoTermValues = [];
  incoTermsRules = [];
  ecdescOfGoodsText = 'ecdescOfGoodsText';
  option: any;
  enteredCharCount = 'enteredCharCount';
  incotermsDetails: any;
  termValues = [];
  mode: any;
  fieldNames = [];
  maxlength: any;
  applicableVal: any;
  currentSwiftVersion : any;
  constructor(protected commonService: CommonService, protected leftSectionService: LeftSectionService,
              protected router: Router, protected translateService: TranslateService,
              protected prevNextService: PrevNextService, protected corporateCommonService: CorporateCommonService,
              protected utilityService: UtilityService, protected saveDraftService: SaveDraftService,
              protected searchLayoutService: SearchLayoutService,
              protected formModelService: FormModelService, protected formControlService: FormControlService,
              protected stateService: ProductStateService, protected route: ActivatedRoute,
              protected eventEmitterService: EventEmitterService, protected transactionDetailService: TransactionDetailService,
              protected phrasesService: PhrasesService, protected elementRef: ElementRef,
              public fccGlobalConstantService: FccGlobalConstantService, protected resolverService: ResolverService,
              protected fileList: FilelistService, protected dialogRef: DynamicDialogRef,
              protected confirmationService: ConfirmationService, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected currencyConverterPipe: CurrencyConverterPipe, protected amendCommonService: AmendCommonService,
              protected ecProductService: EcProductService) {
    super(eventEmitterService, stateService, commonService, translateService, confirmationService, customCommasInCurrenciesPipe,
      searchLayoutService, utilityService, resolverService, fileList, dialogRef, currencyConverterPipe, ecProductService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.getIncotermsDetails();
    this.initializeFormGroup();
    this.fieldNames = ['ecShipmentForm', 'ecShipmentTo'];
    this.form.get('ecShipmentForm')[FccGlobalConstant.PARAMS]['swift'] = true;
    this.form.get('ecShipmentTo')[FccGlobalConstant.PARAMS]['swift'] = true;
    this.fieldNames.forEach(ele => {
      this.commonService.getSwiftVersionValue();
      for(let i=0; i<this.form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.APPLICABLE_VALIDATION].length; i++){
        this.applicableVal = this.form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.APPLICABLE_VALIDATION];
        this.currentSwiftVersion = this.applicableVal[i][FccGlobalConstant.SWIFTVERSION];
        if(this.currentSwiftVersion === this.commonService.swiftVersion) {
          if((ele === FccGlobalConstant.EC_SHIPMENT_FORM) || (ele === FccGlobalConstant.EC_SHIPMENT_TO)){
            this.maxlength = this.applicableVal[i][FccGlobalConstant.MAXLENGTH];
              this.form.get(ele)[this.params]['maxlength'] = this.maxlength;
          }
        }
      }
    });
    this.form.updateValueAndValidity();
    this.setIncoTerms();
    this.form.get(FccGlobalConstant.INCO_TERMS)[this.params][this.readonly] =
     this.form.get(FccGlobalConstant.INCO_TERMS_RULES).value ? false : true;
    this.commonService.checkForBankName(this.stateService, this.form, FccGlobalConstant.EC_BANK_DETAILS,
      FccGlobalConstant.REMITTING_BANK, FccGlobalConstant.INCO_TERMS_RULES,
      FccGlobalConstant.INCO_TERM_RULES_MESSAGE_FOR_REMITTING_BANK);
    this.updateNarrativeCount();
    if (this.mode === FccGlobalConstant.DRAFT_OPTION && this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
      this.amendCommonService.compareTransactionAndMasterForAmend(productCode);
    }
  }

  updateNarrativeCount() {
    if (this.form.get('ecdescOfGoodsText').value) {
      const count = this.commonService.counterOfPopulatedData(this.form.get('ecdescOfGoodsText').value);
      this.form.get('ecdescOfGoodsText')[this.params][this.enteredCharCount] = count;
    }
  }

  /**
   * Initialise the form from state servic
   */
  initializeFormGroup() {
    const sectionName = FccGlobalConstant.EC_SHIPMENT_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.patchFieldParameters(this.form.get(FccGlobalConstant.INCO_TERMS_RULES), { options : this.incoTermsRules });
    if (this.tnxTypeCode === FccGlobalConstant.N002_NEW) {
      this.form.get(this.ecdescOfGoodsText)[FccGlobalConstant.PARAMS][FccGlobalConstant.PHRASE_ENABLED] = true;
    } else {
      this.form.get(this.ecdescOfGoodsText)[FccGlobalConstant.PARAMS][FccGlobalConstant.PHRASE_ENABLED] = false;
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
    }
  }

    amendFormFields() {
    this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.EC_SHIPMENT_DETAILS);
  }

  onClickIncoTermsRules() {
    if (this.form.get(FccGlobalConstant.INCO_TERMS_RULES).value) {
      this.form.get(FccGlobalConstant.INCO_TERMS)[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      this.setMandatoryField(this.form, FccGlobalConstant.INCO_TERMS, true);
      this.setIncoTerms();
    }
    this.removeMandatoryForTemplate([FccGlobalConstant.INCO_TERMS]);
  }

  onClickIncoTerms(event) {
    const termsValue = event.value;
    if (termsValue !== undefined) {
      if (termsValue !== '') {
        this.setMandatoryField(this.form, FccGlobalConstant.NAMED_PLACE, true);
      } else if (termsValue === '') {
        this.form.get(FccGlobalConstant.NAMED_PLACE).reset();
        this.setMandatoryField(this.form, FccGlobalConstant.NAMED_PLACE, false);
        this.form.get(FccGlobalConstant.NAMED_PLACE).setValidators([Validators.maxLength(FccGlobalConstant.LENGTH_60)]);
      }
      this.form.get(FccGlobalConstant.NAMED_PLACE).updateValueAndValidity();
    }
    this.removeMandatoryForTemplate([FccGlobalConstant.NAMED_PLACE]);
  }

  onClickPhraseIcon(event: any, key: any) {
    this.phrasesService.getPhrasesDetails(this.form, FccGlobalConstant.PRODUCT_EC, key);
  }

  removeMandatoryForTemplate(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }
  ngOnDestroy() {
    this.stateService.setStateSection(FccGlobalConstant.EC_SHIPMENT_DETAILS, this.form);
  }

  getIncotermsDetails() {
    this.corporateCommonService.getValues(this.fccGlobalConstantService.incotermDetails).subscribe(
      response => {
        if (response.status === FccGlobalConstant.LENGTH_200) {
          let bankName;
          const sectionForm = this.stateService.getSectionData(FccGlobalConstant.EC_BANK_DETAILS);
          const sectionForm2 = sectionForm.get(FccGlobalConstant.REMITTING_BANK) as FCCFormGroup;
          const bankNameValue = sectionForm2.get(FccGlobalConstant.BANK_NAME_AMMEND).value;
          if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND
          && bankNameValue !== null && bankNameValue !== '' && bankNameValue !== undefined){
          bankName = bankNameValue;
          }
          else{
          bankName = sectionForm2.get(FccGlobalConstant.BANK_NAME_LIST).value;
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

  setIncoTerms() {
    const incotermValue = this.form.get(FccGlobalConstant.INCO_TERMS_RULES).value;
    let bankName;
    const sectionForm : FCCFormGroup = this.stateService.getSectionData(FccGlobalConstant.EC_BANK_DETAILS);
    const sectionForm2 : FCCFormGroup = sectionForm.get(FccGlobalConstant.REMITTING_BANK) as FCCFormGroup;
    const bankNameValue = sectionForm2.get(FccGlobalConstant.BANK_NAME_AMMEND).value;
    if (this.tnxTypeCode && this.tnxTypeCode === FccGlobalConstant.N002_AMEND
    && bankNameValue !== null && bankNameValue !== '' && bankNameValue !== undefined){
    bankName = bankNameValue;
    }
    else{
    bankName = sectionForm2.get(FccGlobalConstant.BANK_NAME_LIST).value;
    }
    if (bankName !== undefined || bankName !== '') {
      this.addIncoTermValues(incotermValue, bankName);
    }
    this.patchFieldParameters(this.form.get(FccGlobalConstant.INCO_TERMS), { options: this.termValues });
  }

  addIncoTermValues(incotermValue: any, bankName: any) {
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

  onChangeIncoTermsRules() {
    this.form.get(FccGlobalConstant.INCO_TERMS).setValue('');
    this.form.get(FccGlobalConstant.NAMED_PLACE).setValue('');
    this.setMandatoryField(this.form, FccGlobalConstant.NAMED_PLACE, false);
    this.form.get(FccGlobalConstant.NAMED_PLACE).updateValueAndValidity();

  }
}
