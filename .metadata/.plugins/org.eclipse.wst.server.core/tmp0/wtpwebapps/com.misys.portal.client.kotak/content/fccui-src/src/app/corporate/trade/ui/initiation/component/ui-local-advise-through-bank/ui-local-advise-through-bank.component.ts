import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CurrencyConverterPipe } from '../../../../lc/initiation/pipes/currency-converter.pipe';

import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { CommonService } from '../../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { CorporateCommonService } from '../../../../../common/services/common.service';
import { LcConstant } from '../../../../lc/common/model/constant';
import { ProductStateService } from '../../../../lc/common/services/product-state.service';
import {
  ConfirmationDialogComponent,
} from '../../../../lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { FormControlService } from '../../../../lc/initiation/services/form-control.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from '../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';


@Component({
  selector: 'app-ui-local-advise-through-bank',
  templateUrl: './ui-local-advise-through-bank.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UiLocalAdviseThroughBankComponent }]
})
export class UiLocalAdviseThroughBankComponent extends UiProductComponent implements OnInit, OnDestroy {

  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  module = '';
  mode;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  swifCodeRegex: any;
  appBenAddressRegex: any;
  appBenNameLength: any;
  fullAddressLength1024 = this.lcConstant.fullAddressLength1024;
  confirmingBank;
  localAdviseThroughBankResponse: any;
  confirmationPartyValue;
  subProductValue;
  localadvBankConf;
  localAdviseThroughName = 'localAdviseThroughName';
  localAdviseThroughSwiftCode = 'localAdviseThroughSwiftCode';
  localAdvThruConfChkBox = 'localAdviseThroughBankConfReq';
  swiftXcharRegex: any;
  maxlength = this.lcConstant.maximumlength;
  advBankConf: any;
  advThruBankConf: any;

  constructor(protected translateService: TranslateService, protected stateService: ProductStateService,
              protected emitterService: EventEmitterService,
              protected formControlService: FormControlService,
              protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected utilityService: UtilityService, protected dialogService: DialogService,
              protected commonService: CommonService, protected multiBankService: MultiBankService,
              protected resolverService: ResolverService, protected dropDownAPIservice: DropDownAPIService,
              protected searchLayoutService: SearchLayoutService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected fileArray: FilelistService,
              protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService
  ) {
              super(emitterService, stateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
    }

  ngOnInit(): void {

    this.mode =
    this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.subProductValue = this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined,
      this.isMasterRequired).get('bgSubProductCode').value;
    this.confirmationPartyValue = this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL,
        undefined, this.isMasterRequired).get('bgConfInstructions').value;
    const obj = this.parentForm.controls[this.controlName];
    if (obj !== null) {
      this.form = obj as FCCFormGroup;
    }
    const localAdviseBankFields = ['localAdviseThroughSwiftCode', 'localAdviseThroughName', 'localAdviseThroughFirstAddress',
     'localAdviseThroughSecondAddress', 'localAdviseThroughThirdAddress', 
     'localAdviseThroughFourthAddress', 'localAdviseThroughFullAddress'];
     this.renderDependentFields(localAdviseBankFields);
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swifCodeRegex = response.bigSwiftCode;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.appBenNameLength = response.BeneficiaryNameLength;
        this.swiftXcharRegex = response.swiftXCharacterSet;
        //this.clearingFormValidators(['localAdviseThroughSwiftCode', 'localAdviseThroughName', 'localAdviseThroughFirstAddress',
          //'localAdviseThroughSecondAddress', 'localAdviseThroughThirdAddress', 'localAdviseThroughFullAddress']);
        if (this.mode === FccBusinessConstantsService.SWIFT && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
          this.form.addFCCValidators('localAdviseThroughSwiftCode', Validators.pattern(this.swifCodeRegex), 0);
          this.form.addFCCValidators('localAdviseThroughName', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.addFCCValidators('localAdviseThroughFirstAddress', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.addFCCValidators('localAdviseThroughSecondAddress', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.addFCCValidators('localAdviseThroughThirdAddress', Validators.pattern(this.swiftXcharRegex), 0);
          //this.form.addFCCValidators('localAdviseThroughFourthAddress', Validators.pattern(this.swiftXcharRegex), 0);
          this.form.addFCCValidators('localAdviseThroughFullAddress', Validators.pattern(this.swiftXcharRegex), 0);
        }
        this.form.get('localAdviseThroughName')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('localAdviseThroughFirstAddress')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('localAdviseThroughSecondAddress')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('localAdviseThroughThirdAddress')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('localAdviseThroughFourthAddress')[this.params][this.maxlength] = this.appBenNameLength;
        this.form.get('localAdviseThroughFullAddress')[this.params][this.maxlength] = FccGlobalConstant.LENGTH_1024;
      }
    });
    this.handleSwiftFields();
    this.form.get('localAdviseThroughFullAddress')[this.params][this.rendered] = false;
    this.form.get('localAdviseThroughFirstAddress')[this.params][this.rendered] = true;
    this.form.get('localAdviseThroughSecondAddress')[this.params][this.rendered] = true;
    this.form.get('localAdviseThroughThirdAddress')[this.params][this.rendered] = true;
  
    if (this.subProductValue === FccGlobalConstant.STBY && this.confirmationPartyValue !== FccBusinessConstantsService.WITHOUT_03) {
   //   this.form.get('localAdviseThroughBankConfReq')[this.rendered] = true;
      this.updateAdvThruConfirmationChkBox();
     } else {
      this.form.get('localAdviseThroughBankConfReq')[this.rendered] = false;
    }

  }

  clearingFormValidators(fields: any){
    for (let i = 0; i < fields.length; i++) {
      this.form.get(fields[i]).clearValidators();
    }
  }

  ngAfterViewInit() {
    this.confirmationPartyValue =
    this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('bgConfInstructions').value;

    if (this.subProductValue === FccGlobalConstant.STBY && this.confirmationPartyValue !== FccBusinessConstantsService.WITHOUT_03) {
     // this.form.get('localAdviseThroughBankConfReq')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.updateAdvThruConfirmationChkBox();
     } else {
      this.form.get('localAdviseThroughBankConfReq')[FccGlobalConstant.RENDERED] = false;
    }
  }

  private renderDependentFields(displayFields?: any,
    hideFields?: any) {
if (displayFields) {
this.toggleControls(this.form, displayFields, true);

}
if (hideFields) {
this.toggleControls(this.form, hideFields, false);

}

}

  onKeyupLocalAdvThroughName() {
    this.updateAdvThruConfirmationChkBox();
  }

  onKeyupLocalAdvThroughswiftCode() {
    this.updateAdvThruConfirmationChkBox();
  }

  onChangeLocalAdviseThroughName() {
    this.updateAdvThruConfirmationChkBox();
  }

  onChangeLocalAdvThroughswiftCode() {
    this.updateAdvThruConfirmationChkBox();
  }

  updateAdvThruConfirmationChkBox() {
    if (this.checkIfLocalAdvThruConfirmChkBoxNeeded(this.localAdviseThroughName) ||
    this.checkIfLocalAdvThruConfirmChkBoxNeeded(this.localAdviseThroughSwiftCode)) {
      this.form.get('localAdviseThroughBankConfReq')[this.rendered] = true;
      this.form.get('localAdviseThroughBankConfReq')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      
    }
    else {
      this.form.get(this.localAdvThruConfChkBox)[FccGlobalConstant.RENDERED] = false;
      this.form.get(this.localAdvThruConfChkBox).patchValue('N');
    }
  }

  checkIfLocalAdvThruConfirmChkBoxNeeded(key): boolean {
    let isChkBoxNeeded = false;
    if ((this.commonService.isNonEmptyField(key, this.form) &&
      this.commonService.isNonEmptyValue(this.form.get(key).value) &&
      this.form.get(key).value !== '') && (this.subProductValue === FccGlobalConstant.STBY &&
        this.confirmationPartyValue !== FccBusinessConstantsService.WITHOUT_03)) {
      isChkBoxNeeded = true;
    }
    return isChkBoxNeeded;
  }

  onClickLocalAdviseThroughBankConfReq() {
   

    this.advBankConf = this.stateService
    .getSectionData(
      FccGlobalConstant.UI_BANK_DETAILS,
      undefined,
      this.isMasterRequired
    )
    .get("uiAdvisingBank");
    
    this.advThruBankConf = this.stateService
    .getSectionData(
      FccGlobalConstant.UI_BANK_DETAILS,
      undefined,
      this.isMasterRequired
    )
    .get("uiAdviceThrough");

    if ((this.advBankConf.get('advBankConfReq') 
    && this.advBankConf.get('advBankConfReq').value === 'Y')) {
      const dir = localStorage.getItem('langDir');
      const headerField = `${this.translateService.instant('confirmation')}`;
      const obj = {};
      const locaKey = 'locaKey';
      obj[locaKey] = FccGlobalConstant.ADVISINGCHKD;
      const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        data: obj,
        header: headerField,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir }
      });
      dialogRef.onClose.subscribe((result: any) => {
        if (result.toLowerCase() === 'yes') {
          this.onFocusYesButton();
        } else {
          this.form.get('localAdviseThroughBankConfReq').patchValue('N');
        }
      });
    } else if ((this.advThruBankConf.get('adviseThruBankConfReq') 
    && this.advThruBankConf.get('adviseThruBankConfReq').value === 'Y')) {
      const dir = localStorage.getItem('langDir');
      const headerField = `${this.translateService.instant('confirmation')}`;
      const obj = {};
      const locaKey = 'locaKey';
      obj[locaKey] = FccGlobalConstant.ADVTHRUCHKD;
      const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        data: obj,
        header: headerField,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir }
      });
      dialogRef.onClose.subscribe((result: any) => {
        if (result.toLowerCase() === 'yes') {
          this.onFocusYesButton();
        } else {
          this.form.get('localAdviseThroughBankConfReq').patchValue('N');
        }
      });
    } else if ((this.advBankConf.get('advBankConfReq') 
    && this.advBankConf.get('advBankConfReq').value === 'N') &&
    (this.advThruBankConf.get('adviseThruBankConfReq') 
    && this.advThruBankConf.get('adviseThruBankConfReq').value === 'N')) {
      this.clearConfirmingBank();
    }
  }
onFocusYesButton() {
  this.stateService
  .getSectionData(
    FccGlobalConstant.UI_BANK_DETAILS,
    undefined,
    this.isMasterRequired
  )
  .get("uiAdvisingBank")
  .get("advBankConfReq")
  .patchValue("N");

  this.stateService
  .getSectionData(
    FccGlobalConstant.UI_BANK_DETAILS,
    undefined,
    this.isMasterRequired
  )
  .get("uiAdviceThrough")
  .get("adviseThruBankConfReq")
  .patchValue("N");


  this.confirmingBank = this.stateService
  .getSectionData(
    FccGlobalConstant.UI_BANK_DETAILS,
    undefined,
    this.isMasterRequired
  )
  .get("uiConfirmingBank");
  this.confirmingBank.get('confirmingSwiftCode').patchValue(this.form.get('localAdviseThroughSwiftCode'));
  this.confirmingBank.get('confirmingBankName').patchValue(this.form.get('localAdviseThroughName'));
  this.confirmingBank.get('confirmingBankFirstAddress').patchValue(this.form.get('localAdviseThroughFirstAddress'));
  this.confirmingBank.get('confirmingBankSecondAddress').patchValue(this.form.get('localAdviseThroughSecondAddress'));
  this.confirmingBank.get('confirmingBankThirdAddress').patchValue(this.form.get('localAdviseThroughThirdAddress'));
  if (this.mode !== FccBusinessConstantsService.SWIFT) {
    this.confirmingBank.get('confirmingBankFourthAddress').patchValue(this.form.get('localAdviseThroughFourthAddress'));
  }
}

clearConfirmingBank() {
  this.confirmingBank = this.stateService
  .getSectionData(
    FccGlobalConstant.UI_BANK_DETAILS,
    undefined,
    this.isMasterRequired
  )
  .get("uiConfirmingBank");

  this.confirmingBank.get('counterPartyList').patchValue(null);
  this.confirmingBank.get('confirmingSwiftCode').patchValue(null);
  this.confirmingBank.get('confirmingBankName').patchValue(null);
  this.confirmingBank.get('confirmingBankFirstAddress').patchValue(null);
  this.confirmingBank.get('confirmingBankSecondAddress').patchValue(null);
  this.confirmingBank.get('confirmingBankThirdAddress').patchValue(null);
  if (this.mode !== FccBusinessConstantsService.SWIFT) {
    this.confirmingBank.get('confirmingBankFourthdAddress').patchValue(null);
  }
}

    onKeyupLocalAdviseThroughIcons(event) {
      const keycodeIs = event.which || event.keyCode;
      if (keycodeIs === this.lcConstant.thirteen) {
        this.onClickLocalAdviseThroughIcons();
      }
    }

  onClickLocalAdviseThroughIcons() {
    const header = `${this.translateService.instant('listOfBanks')}`;
    const productCode = 'productCode';
    const subProductCode = 'subProductCode';
    const headerDisplay = 'headerDisplay';
    const buttons = 'buttons';
    const savedList = 'savedList';
    const option = 'option';
    const downloadIconEnabled = 'downloadIconEnabled';
    const obj = {};
    obj[productCode] = '';
    obj[option] = 'staticBank';
    obj[subProductCode] = '';
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
    const urlOption = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    if (urlOption === FccGlobalConstant.TEMPLATE) {
      const templateCreation = 'templateCreation';
      obj[templateCreation] = true;
    }
    this.resolverService.getSearchData(header, obj);
    this.localAdviseThroughBankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((advResponse) => {

      if (advResponse && advResponse !== null && advResponse.responseData && advResponse.responseData !== null) {
        advResponse.responseData.ISO_CODE ? this.form.get('localAdviseThroughSwiftCode').patchValue(advResponse.responseData.ISO_CODE) :
        this.form.get('localAdviseThroughSwiftCode').patchValue(advResponse.responseData[4]);
        advResponse.responseData.NAME ? this.form.get('localAdviseThroughName').patchValue(advResponse.responseData.NAME) :
        this.form.get('localAdviseThroughName').patchValue(advResponse.responseData[0]);
        advResponse.responseData.ADDRESS_LINE_1 ? this.form.get('localAdviseThroughFirstAddress')
        .patchValue(advResponse.responseData.ADDRESS_LINE_1) :
        this.form.get('localAdviseThroughFirstAddress').patchValue(advResponse.responseData[1]);
        advResponse.responseData.ADDRESS_LINE_2 ? this.form.get('localAdviseThroughSecondAddress')
        .patchValue(advResponse.responseData.ADDRESS_LINE_2) :
        this.form.get('localAdviseThroughSecondAddress').patchValue(advResponse.responseData[2]);
        advResponse.responseData.DOM ? this.form.get('localAdviseThroughThirdAddress').patchValue(advResponse.responseData.DOM) :
        this.form.get('localAdviseThroughThirdAddress').patchValue(advResponse.responseData[3]);
        if (this.mode !== FccBusinessConstantsService.SWIFT) {
          this.form.get('localAdviseThroughFourthAddress').patchValue(advResponse.responseData.ADDRESS_LINE_4);
        }
        this.updateAdvThruConfirmationChkBox();
      }
    });
  }

   handleSwiftFields() {
    this.mode = this.productStateService
    .getSectionData(
      FccGlobalConstant.UI_GENERAL_DETAIL,
      undefined,
      this.isMasterRequired
    )
    .get("advSendMode").value;
    if (this.mode === FccBusinessConstantsService.SWIFT || (this.mode instanceof Array && this.mode.length > 0 &&
      this.mode[0].value === FccBusinessConstantsService.SWIFT)) {
      this.form.get('localAdviseThroughFourthAddress')[this.params][FccGlobalConstant.RENDERED] = false;
    } else if (this.form.get('localAdviseThroughFourthAddress')) {
      this.form.get('localAdviseThroughFourthAddress')[this.params][FccGlobalConstant.RENDERED] = true;
    }
    this.form.updateValueAndValidity();
  } 

  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
    if (this.localAdviseThroughBankResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.localAdviseThroughBankResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }
  }
}
