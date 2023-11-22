import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { LcConstant } from '../../../../../../corporate/trade/lc/common/model/constant';
import { Dialog } from 'primeng/dialog';
import { BankDetails } from '../../../../../../common/model/bankDetails';
import { Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { CommonService } from '../../../../../../common/services/common.service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { UtilityService } from '../../../../../../corporate/trade/lc/initiation/services/utility.service';
import { CorporateCommonService } from '../../../../../../corporate/common/services/common.service';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FormControlService } from '../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationDialogComponent } from '../../../../../../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { ConfirmationService } from 'primeng';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
@Component({
  selector: 'app-ui-advising-bank',
  templateUrl: './ui-advising-bank.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UiAdvisingBankComponent }]
})
export class UiAdvisingBankComponent extends UiProductComponent implements OnInit, OnDestroy {

  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  @ViewChild(Dialog) dialog;
  form: FCCFormGroup;
  module = '';
  mode;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  swifCodeRegex: any;
  appBenAddressRegex: any;
  appBenNameLength: any;
  fullAddressLength1024 = this.lcConstant.fullAddressLength1024;
  advisingBankResponse;
  bankDetails: BankDetails;
  corporateBanks = [];
  confirmationPartyValue;
  subProductValue;
  confirmingBank;
  advThruBankConf;
  advisingBankName = 'advisingBankName';
  advisingswiftCode = 'advisingswiftCode';
  advBankConfChkBox = 'advBankConfReq';
  maxlength = this.lcConstant.maximumlength;
  swiftXcharRegex: any;
  localadvBankConf: any;

  constructor(protected translateService: TranslateService, protected stateService: ProductStateService,
              protected emitterService: EventEmitterService,
              protected formControlService: FormControlService,
              protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected utilityService: UtilityService,
              protected commonService: CommonService,
              protected multiBankService: MultiBankService,
              protected resolverService: ResolverService,
              protected dropDownAPIservice: DropDownAPIService,
              protected searchLayoutService: SearchLayoutService,
              protected dialogService: DialogService,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected fileArray: FilelistService,
              protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {
              super(emitterService, stateService, commonService, translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
}

ngOnInit(): void {
  this.mode =
  this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;
  this.confirmationPartyValue = this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL,
    undefined, this.isMasterRequired).get('bgConfInstructions').value;
  this.subProductValue = this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined,
    this.isMasterRequired).get('bgSubProductCode').value;
  this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
  const obj = this.parentForm.controls[this.controlName];
  if (obj !== null) {
    this.form = obj as FCCFormGroup;
  }
  if (this.subProductValue === FccGlobalConstant.STBY && this.confirmationPartyValue !== FccBusinessConstantsService.WITHOUT_03) {
    this.form.get('advBankConfReq')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
   } else {
    this.form.get('advBankConfReq')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
  }
  this.form.get('advBankConfReq').updateValueAndValidity();

  this.commonService.loadDefaultConfiguration().subscribe(response => {
    if (response) {
      this.swifCodeRegex = response.bigSwiftCode;
      this.appBenAddressRegex = response.BeneficiaryAddressRegex;
      this.appBenNameLength = response.BeneficiaryNameLength;
      this.swiftXcharRegex = response.swiftXCharacterSet;
      this.clearingFormValidators(['advisingswiftCode', 'advisingBankName', 'advisingBankFirstAddress',
          'advisingBankSecondAddress', 'advisingBankThirdAddress', 'advisingBankFourthAddress', 'advisingBankFullAddress']);
      if (this.mode === FccBusinessConstantsService.SWIFT && this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
        this.form.addFCCValidators('advisingswiftCode', Validators.pattern(this.swifCodeRegex), 0);
        this.form.addFCCValidators('advisingBankName', Validators.pattern(this.swiftXcharRegex), 0);
        this.form.addFCCValidators('advisingBankFirstAddress', Validators.pattern(this.swiftXcharRegex), 0);
        this.form.addFCCValidators('advisingBankSecondAddress', Validators.pattern(this.swiftXcharRegex), 0);
        this.form.addFCCValidators('advisingBankThirdAddress', Validators.pattern(this.swiftXcharRegex), 0);
        this.form.addFCCValidators('advisingBankFourthAddress', Validators.pattern(this.swiftXcharRegex), 0);
        this.form.addFCCValidators('advisingBankFullAddress', Validators.pattern(this.swiftXcharRegex), 0);
      }
      this.form.get('advisingBankName')[this.params][this.maxlength] = this.appBenNameLength;
      this.form.get('advisingBankFirstAddress')[this.params][this.maxlength] = this.appBenNameLength;
      this.form.get('advisingBankSecondAddress')[this.params][this.maxlength] = this.appBenNameLength;
      this.form.get('advisingBankThirdAddress')[this.params][this.maxlength] = this.appBenNameLength;
      this.form.get('advisingBankFourthAddress')[this.params][this.maxlength] = this.appBenNameLength;
      this.form.get('advisingBankFullAddress')[this.params][this.maxlength] = FccGlobalConstant.LENGTH_1024;
    }
  });

  this.form.get('advisingBankFullAddress')[this.params][this.rendered] = false;
  this.form.get('advisingBankFirstAddress')[this.params][this.rendered] = true;
  this.form.get('advisingBankSecondAddress')[this.params][this.rendered] = true;
  this.form.get('advisingBankThirdAddress')[this.params][this.rendered] = true;
  this.updateAdvBankConfirmationChkBox();
  this.handleSwiftFields();

}

clearingFormValidators(fields: any){
  for (let i = 0; i < fields.length; i++) {
    this.form.get(fields[i]).clearValidators();
  }
}

onClickAdvisingBankIcons() {
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
  this.advisingBankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((advResponse) => {

    if (advResponse && advResponse !== null && advResponse.responseData && advResponse.responseData !== null) {
      advResponse.responseData.ISO_CODE ? this.form.get('advisingswiftCode').patchValue(advResponse.responseData.ISO_CODE) :
      this.form.get('advisingswiftCode').patchValue(advResponse.responseData[4]);
      advResponse.responseData.NAME ? this.form.get('advisingBankName').patchValue(advResponse.responseData.NAME) :
      this.form.get('advisingBankName').patchValue(advResponse.responseData[0]);
      advResponse.responseData.ADDRESS_LINE_1 ? this.form.get('advisingBankFirstAddress')
      .patchValue(advResponse.responseData.ADDRESS_LINE_1) :
      this.form.get('advisingBankFirstAddress').patchValue(advResponse.responseData[1]);
      advResponse.responseData.ADDRESS_LINE_2 ? this.form.get('advisingBankSecondAddress')
      .patchValue(advResponse.responseData.ADDRESS_LINE_2) :
      this.form.get('advisingBankSecondAddress').patchValue(advResponse.responseData[2]);
      advResponse.responseData.DOM ? this.form.get('advisingBankThirdAddress').patchValue(advResponse.responseData.DOM) :
      this.form.get('advisingBankThirdAddress').patchValue(advResponse.responseData[3]);
      if (this.mode !== FccBusinessConstantsService.SWIFT) {
        this.form.get('advisingBankFourthAddress').patchValue(advResponse.responseData.ADDRESS_LINE_4);
      }
      const val: string = this.form.get('advisingswiftCode').value;
      const regex = new RegExp(this.swifCodeRegex);
      if(!regex.test(val)) {
        this.form.get('advisingswiftCode').setErrors({ invalidBICError: true });
        this.form.get('advisingswiftCode').markAsDirty();
        this.form.get('advisingswiftCode').markAsTouched();
      }
      this.form.updateValueAndValidity();
      this.updateAdvBankConfirmationChkBox();
    }
  });
}

  onKeyupAdvisingBankName() {
    this.updateAdvBankConfirmationChkBox();
  }

  onKeyupAdvisingswiftCode() {
    this.updateAdvBankConfirmationChkBox();
  }

  onChangeAdvisingBankName() {
    this.updateAdvBankConfirmationChkBox();
  }

  onChangeAdvisingswiftCode() {
    this.updateAdvBankConfirmationChkBox();
  }

  updateAdvBankConfirmationChkBox() {
    if (this.checkIfAdvBankConfirmChkBoxNeeded(this.advisingBankName) || this.checkIfAdvBankConfirmChkBoxNeeded(this.advisingswiftCode)) {
      this.form.get(this.advBankConfChkBox)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    }
    else {
      this.form.get(this.advBankConfChkBox)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get(this.advBankConfChkBox).patchValue('N');
    }
  }

  checkIfAdvBankConfirmChkBoxNeeded(key): boolean {
    let isChkBoxNeeded = false;
    if ((this.commonService.isNonEmptyField(key, this.form) &&
      this.commonService.isNonEmptyValue(this.form.get(key).value) &&
      this.form.get(key).value !== '') && (this.subProductValue === FccGlobalConstant.STBY &&
        this.confirmationPartyValue !== FccBusinessConstantsService.WITHOUT_03)) {
      isChkBoxNeeded = true;
    }
    return isChkBoxNeeded;
  }

  onClickAdvBankConfReq() {

    this.localadvBankConf = this.stateService
    .getSectionData(
      FccGlobalConstant.UI_BANK_DETAILS,
      undefined,
      this.isMasterRequired
    )
    .get("uiLocalAdviseThrough");
    this.advThruBankConf = this.stateService
    .getSectionData(
      FccGlobalConstant.UI_BANK_DETAILS,
      undefined,
      this.isMasterRequired
    )
    .get("uiAdviceThrough");

    if (this.advThruBankConf.get('adviseThruBankConfReq').value === 'Y') {
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
          this.form.get('advBankConfReq').patchValue('N');
        }
      });
    } else if ((this.localadvBankConf.get('localAdviseThroughBankConfReq') 
    && this.localadvBankConf.get('localAdviseThroughBankConfReq').value === 'Y')) {
      const dir = localStorage.getItem('langDir');
      const headerField = `${this.translateService.instant('confirmation')}`;
      const obj = {};
      const locaKey = 'locaKey';
      obj[locaKey] = FccGlobalConstant.LOCALADVTHRUCHKD;
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
          this.form.get('advBankConfReq').patchValue('N');
        }
      });
    }  
    else if (this.advThruBankConf.get('adviseThruBankConfReq').value === 'N') {
      this.clearConfirmingBank();
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

  onFocusYesButton() {
    this.stateService
  .getSectionData(
    FccGlobalConstant.UI_BANK_DETAILS,
    undefined,
    this.isMasterRequired
  )
  .get("uiAdviceThrough")
  .get("adviseThruBankConfReq")
  .patchValue("N");



  this.stateService
  .getSectionData(
    FccGlobalConstant.UI_BANK_DETAILS,
    undefined,
    this.isMasterRequired
  )
  .get("uiLocalAdviseThrough")
  .get("localAdviseThroughBankConfReq")
  .patchValue("N");

    this.confirmingBank = this.stateService
    .getSectionData(
      FccGlobalConstant.UI_BANK_DETAILS,
      undefined,
      this.isMasterRequired
    )
    .get("uiConfirmingBank");

    this.confirmingBank.get('confirmingSwiftCode').patchValue( this.form.get('advisingswiftCode'));
    this.confirmingBank.get('confirmingBankName').patchValue(this.form.get('advisingBankName'));
    this.confirmingBank.get('confirmingBankFirstAddress').patchValue(this.form.get('advisingBankFirstAddress'));
    this.confirmingBank.get('confirmingBankSecondAddress').patchValue(this.form.get('advisingBankSecondAddress'));
    this.confirmingBank.get('confirmingBankThirdAddress').patchValue(this.form.get('advisingBankThirdAddress'));
    if (this.mode !== FccBusinessConstantsService.SWIFT) {
      this.confirmingBank.get('confirmingBankFourthdAddress').patchValue(this.form.get('advisingBankFourthAddress'));
    }

}

ngAfterViewInit() {
  this.confirmationPartyValue = this.stateService
  .getSectionData(
    FccGlobalConstant.UI_GENERAL_DETAIL,
    undefined,
    this.isMasterRequired
  )
  .get("bgConfInstructions").value;


  if (this.subProductValue === FccGlobalConstant.STBY && this.confirmationPartyValue !== FccBusinessConstantsService.WITHOUT_03) {
    this.form.get('advBankConfReq')[this.rendered] = true;
    this.updateAdvBankConfirmationChkBox();
   } else {
    this.form.get('advBankConfReq')[this.rendered] = false;
  }
}
ngOnDestroy() {

  this.parentForm.controls[this.controlName] = this.form;
  if (this.advisingBankResponse !== undefined) {
    this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
    this.advisingBankResponse = null;
    this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
  }
}


onKeyupAdvisingBankIcons(event) {
  const keycodeIs = event.which || event.keyCode;
  if (keycodeIs === this.lcConstant.thirteen) {
    this.onClickAdvisingBankIcons();
  }
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
    this.form.get('advisingBankFourthAddress')[this.params][FccGlobalConstant.RENDERED] = false;
  } else if (this.form.get('advisingBankFourthAddress')) {
    this.form.get('advisingBankFourthAddress')[this.params][FccGlobalConstant.RENDERED] = true;
  }
  this.form.updateValueAndValidity();
}


}
