import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';

import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { CommonService } from '../../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { CorporateCommonService } from '../../../../../../corporate/common/services/common.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { FormControlService } from '../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { UtilityService } from '../../../../../../corporate/trade/lc/initiation/services/utility.service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { Validators } from '@angular/forms';
import { LcConstant } from '../../../../../../corporate/trade/lc/common/model/constant';

@Component({
  selector: 'app-ui-issuing-bank',
  templateUrl: './ui-issuing-bank.component.html',
  providers: [{ provide: HOST_COMPONENT, useExisting: UiIssuingBankComponent }]
})
export class UiIssuingBankComponent extends UiProductComponent implements OnInit, OnDestroy {

  form: FCCFormGroup;
  @Input() parentForm: FCCFormGroup;
  @Input() data;
  @Input() controlName;
  module = '';
  issuingBankResponse;
  mode;
  lcConstant = new LcConstant();
  swifCodeRegex: any;
  appBenAddressRegex: any;
  appBenNameLength: any;
  fullAddressLength1024 = this.lcConstant.fullAddressLength1024;
  swiftXChar;
  swiftZchar;
  fieldNames = [];
  regexType: string;
  productCode;
  swiftXCharRegex: string;
  swiftZCharRegex: string;
  constructor(protected translateService: TranslateService,
              protected stateService: ProductStateService,
              protected emitterService: EventEmitterService,
              protected formControlService: FormControlService,
              protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService,
              protected commonService: CommonService,
              protected multiBankService: MultiBankService,
              protected dropDownAPIservice: DropDownAPIService,
              protected searchLayoutService: SearchLayoutService,
              protected resolverService: ResolverService,
              protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
              protected utilityService: UtilityService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService) {
              super(emitterService, stateService, commonService,
                translateService, confirmationService,
                customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
                dialogRef, currencyConverterPipe, uiProductService);
}

  ngOnInit(): void {

    const obj = this.parentForm.controls[this.controlName];
    if (obj !== null) {
      this.form = obj as FCCFormGroup;
    }
    this.mode =
    this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired).get('advSendMode').value;

    const sectionForm = this.productStateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired);
    const bankName = sectionForm.get('uiBankNameList').value;
    this.setIssuingBankAddressDetails(bankName);
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.form.get('issuingBankFullAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.handleSwiftFields();
    this.fieldNames = ['issuingBankName', 'issuingBankFirstAddress', 'issuingBankSecondAddress', 'issuingBankThirdAddress'];
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swifCodeRegex = response.bigSwiftCode;
        this.swiftXChar = response.swiftXCharacterSet;
        this.swiftZchar = response.swiftZChar;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.appBenNameLength = response.BeneficiaryNameLength;
        if (this.mode === FccBusinessConstantsService.SWIFT) {
          this.form.addFCCValidators('issuingBankswiftCode', Validators.pattern(this.swifCodeRegex), 0);
          this.fieldNames.forEach(ele => {
            this.form.get(ele).clearValidators();
            const decodedVal = this.commonService.decodeHtml(this.form.get(ele).value);
            this.form.get(ele).setValue(decodedVal);
             this.regexType = this.form.get(ele)[FccGlobalConstant.PARAMS]['applicableValidation'][0]['characterValidation'];
            if (this.regexType === FccGlobalConstant.SWIFT_X) {
              this.regexType = this.swiftXChar;
            } else if (this.regexType === FccGlobalConstant.SWIFT_Z) {
              this.regexType = this.swiftZchar;
            }
            if (this.commonService.validateProduct(this.form, ele, this.productCode)) {
              this.form.addFCCValidators(ele, Validators.pattern(this.regexType), 0);
              }
          });
        }
      }
    });
  }


onClickIssuingBankTypeCode() {
  if (this.form.get('issuingBankTypeCode') && (this.form.get('issuingBankTypeCode').value === '02' ||
  this.form.get('issuingBankTypeCode').value[0].shortName === '02')) {
    this.form.get('issuingBankswiftCode').setValue('');
    this.form.get('issuingBankFirstAddress').setValue('');
    this.form.get('issuingBankSecondAddress').setValue('');
    this.form.get('issuingBankThirdAddress').setValue('');
    this.form.get('issuingBankName').setValue('');
  }
  const sectionForm = this.productStateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS, undefined, this.isMasterRequired);
  const bankName = sectionForm.get('uiBankNameList').value;
  this.setIssuingBankAddressDetails(bankName);
}
  setIssuingBankDetails() {
  if (this.form.get('issuingBankTypeCode') && (this.form.get('issuingBankTypeCode').value === '01' ||
  this.form.get('issuingBankTypeCode').value[0].shortName === '01')) {
  this.corporateCommonService.getValues(this.fccGlobalConstantService.corporateBanks).subscribe(response => {
  if (response.status === 200) {

        if (response.body.bankName && response.body.bankName !== null) {
          this.form.get('issuingBankName').setValue(response.body.bankName);
        } else {
          response.body.shortName && response.body.shortName !== null ? this.form.get('issuingBankName').setValue(response.body.shortName) :
          this.form.get('issuingBankName').setValue(response.body.name);
        }
        if (response.body.SWIFTAddress) {
          this.form.get('issuingBankFirstAddress').setValue(response.body.SWIFTAddress.line1);
          this.form.get('issuingBankSecondAddress').setValue(response.body.SWIFTAddress.line2);
          this.form.get('issuingBankThirdAddress').setValue(response.body.SWIFTAddress.line3);
        }
        if (response.body.isoCode) {
          this.form.get('issuingBankswiftCode').setValue(response.body.isoCode);
        } else {
          this.form.get('issuingBankswiftCode').setValue('');
        }
      }
  });
  this.form.get('issuingBankIcons')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
  this.form.get('issuingBankName')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
  this.form.get('issuingBankFirstAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
  this.form.get('issuingBankSecondAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
  this.form.get('issuingBankThirdAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
  this.form.get('issuingBankFourthAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
  this.form.get('issuingBankswiftCode')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
  this.form.get('issuingBankIcons')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
  this.form.get('issuingBankName').updateValueAndValidity();
  } else {
    this.form.get('issuingBankName')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
    this.form.get('issuingBankFirstAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
    this.form.get('issuingBankSecondAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
    this.form.get('issuingBankThirdAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
    this.form.get('issuingBankFourthAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
    this.form.get('issuingBankIcons')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('issuingBankswiftCode')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
    this.form.get('issuingBankName').updateValueAndValidity();

  }

  }
  setIssuingBankAddressDetails(bankName) {
    const reqURl = `${this.fccGlobalConstantService.corporateBanks}/${bankName}`;
    if (this.form.get('issuingBankTypeCode') && (this.form.get('issuingBankTypeCode').value === '01' ||
    this.form.get('issuingBankTypeCode').value[0].shortName === '01')) {
    this.corporateCommonService.getValues(reqURl).subscribe(response => {
    if (response.status === 200) {

          this.form.get('issuingBankName').setValue(response.body.name);
          if (response.body.SWIFTAddress) {
            this.form.get('issuingBankFirstAddress').setValue(this.commonService.decodeHtml(response.body.SWIFTAddress.line1));
            this.form.get('issuingBankSecondAddress').setValue(this.commonService.decodeHtml(response.body.SWIFTAddress.line2));
            this.form.get('issuingBankThirdAddress').setValue(this.commonService.decodeHtml(response.body.SWIFTAddress.line3));
          }
          if (response.body.isoCode) {
            this.form.get('issuingBankswiftCode').setValue(response.body.isoCode);
          } else {
            this.form.get('issuingBankswiftCode').setValue('');
          }
        }
    });
    this.form.get('issuingBankIcons')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('issuingBankName')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
    this.form.get('issuingBankFirstAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
    this.form.get('issuingBankSecondAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
    this.form.get('issuingBankThirdAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
    this.form.get('issuingBankFourthAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
    this.form.get('issuingBankswiftCode')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = true;
    this.form.get('issuingBankIcons')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.form.get('issuingBankName').updateValueAndValidity();
    } else {
      this.form.get('issuingBankName')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      this.form.get('issuingBankFirstAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      this.form.get('issuingBankSecondAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      this.form.get('issuingBankThirdAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      this.form.get('issuingBankFourthAddress')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      this.form.get('issuingBankIcons')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('issuingBankswiftCode')[FccGlobalConstant.PARAMS][FccGlobalConstant.READONLY] = false;
      this.form.get('issuingBankName').updateValueAndValidity();
    }
    }
  ngOnDestroy() {
    this.parentForm.controls[this.controlName] = this.form;
    if (this.issuingBankResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.issuingBankResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(null);
    }

  }


  onClickIssuingBankIcons() {
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
    this.issuingBankResponse = this.searchLayoutService.searchLayoutDataSubject.subscribe((response) => {

      if (response && response !== null && response.responseData && response.responseData !== null) {
        response.responseData.ISO_CODE ? this.form.get('issuingBankswiftCode').patchValue(response.responseData.ISO_CODE) :
        this.form.get('issuingBankswiftCode').patchValue(response.responseData[4]);
        response.responseData.NAME ? this.form.get('issuingBankName').patchValue(response.responseData.NAME) :
        this.form.get('issuingBankName').patchValue(response.responseData[0]);
        response.responseData.ADDRESS_LINE_1 ? this.form.get('issuingBankFirstAddress').patchValue(response.responseData.ADDRESS_LINE_1) :
        this.form.get('issuingBankFirstAddress').patchValue(response.responseData[1]);
        response.responseData.ADDRESS_LINE_2 ? this.form.get('issuingBankSecondAddress').patchValue(response.responseData.ADDRESS_LINE_2) :
        this.form.get('issuingBankSecondAddress').patchValue(response.responseData[2]);
        response.responseData.DOM ? this.form.get('issuingBankThirdAddress').patchValue(response.responseData.DOM) :
        this.form.get('issuingBankThirdAddress').patchValue(response.responseData[3]);
        if (this.mode !== FccBusinessConstantsService.SWIFT) {
          this.form.get('issuingBankFourthAddress').patchValue(response.responseData.ADDRESS_LINE_4);
        }
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
      this.form.get('issuingBankFourthAddress')[this.params][FccGlobalConstant.RENDERED] = false;
    } else if (this.form.get('issuingBankFourthAddress')) {
      this.form.get('issuingBankFourthAddress')[this.params][FccGlobalConstant.RENDERED] = true;
    }
    this.form.updateValueAndValidity();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftXCharRegex = response.swiftXCharacterSet;
        this.swiftZCharRegex = response.swiftZChar;
        this.swifCodeRegex = response.bigSwiftCode;
        this.form.get('issuingBankName').clearValidators();
        this.form.get('issuingBankFirstAddress').clearValidators();
        this.form.get('issuingBankSecondAddress').clearValidators();
        this.form.get('issuingBankThirdAddress').clearValidators();
        this.form.addFCCValidators('issuingBankswiftCode', Validators.pattern(this.swifCodeRegex), 0);
        this.form.get('issuingBankswiftCode').updateValueAndValidity();
        if (this.mode === FccBusinessConstantsService.SWIFT) {
          this.form.addFCCValidators('issuingBankName', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('issuingBankFirstAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('issuingBankSecondAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.addFCCValidators('issuingBankThirdAddress', Validators.pattern(this.swiftXCharRegex), 0);
          this.form.get('issuingBankName').updateValueAndValidity();
          this.form.get('issuingBankFirstAddress').updateValueAndValidity();
          this.form.get('issuingBankSecondAddress').updateValueAndValidity();
          this.form.get('issuingBankThirdAddress').updateValueAndValidity();
        }
      }
    });
  }

}
