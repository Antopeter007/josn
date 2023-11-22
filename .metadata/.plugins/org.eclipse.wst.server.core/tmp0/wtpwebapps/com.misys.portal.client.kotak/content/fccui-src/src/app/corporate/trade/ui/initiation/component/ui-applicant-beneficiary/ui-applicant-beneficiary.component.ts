import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DynamicDialogRef } from 'primeng';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { CorporateDetails } from '../../../../../../common/model/corporateDetails';
import { CounterpartyDetailsList } from '../../../../../../common/model/counterpartyDetailsList';
import { CommonService } from '../../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { ProductStateService } from '../../../../../../corporate/trade/lc/common/services/product-state.service';
import { CorporateCommonService } from '../../../../../common/services/common.service';
import { LcConstant } from '../../../../lc/common/model/constant';
import { ImportLetterOfCreditResponse } from '../../../../lc/initiation/model/models';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../lc/initiation/services/utility.service';
import { UiProductComponent } from '../ui-product/ui-product.component';
import { CounterpartyRequest } from '../../../../../../common/model/counterpartyRequest';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { CountryList } from './../../../../../../common/model/countryList';
import { AmendCommonService } from './../../../../../../corporate/common/services/amend-common.service';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { Validators } from '@angular/forms';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { UiProductService } from '../../../services/ui-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-ui-applicant-beneficiary',
  templateUrl: './ui-applicant-beneficiary.component.html',
  styleUrls: ['./ui-applicant-beneficiary.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: UiApplicantBeneficiaryComponent }]
})

export class UiApplicantBeneficiaryComponent extends UiProductComponent implements OnInit {

  form: FCCFormGroup;
  lcConstant = new LcConstant();
  params = this.lcConstant.params;
  rendered = this.lcConstant.rendered;
  entities = [];
  beneficiaries = [];
  updatedBeneficiaries = [];
  responseStatusCode = 200;
  mode;
  counterpartyDetailsList: CounterpartyDetailsList;
  lcResponseForm = new ImportLetterOfCreditResponse();
  corporateDetails: CorporateDetails;
  readonly = this.lcConstant.readonly;
  country = [];
  beneficiaryCountry = [];
  countryList: CountryList;
  beneEditToggleVisible = false;
  benePreviousValue: any;
  operation;
  screenMode;
  appBenAddressRegex;
  address = 'Address';
  countryLabel = 'country';
  addressLine1 = 'line1';
  addressLine2 = 'line2';
  addressLine3 = 'line3';
  addressLine4 = 'line4';
  swiftXChar;
  beneAbbvNameRegex;
  applicantFullAddressValue: any;
  appBenNameLength;
  beneLengthWithoutEntity = FccGlobalConstant.LENGTH_200;
  appBenFullAddrLength: any;
  address1TradeLength;
  address2TradeLength;
  domTradeLength;
  address4TradeLength;
  syBeneAdd: any;
  option: any;
  isMasterRequired: any;
  productCode: any;
  entityAddressType: any;
  module = `${this.translateService.instant(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS)}`;
  abbvNameList = [];
  entityNameList = [];
  saveTogglePreviousValue: any;
  beneAbbvPreviousValue: any;
  fieldNames = [];
  regexType: string;
  swiftZchar;
  maxlength = this.lcConstant.maximumlength;
  swifCodeRegex;
  appNameLength;
  updateCountryFilter = new BehaviorSubject(null);

  constructor(protected translateService: TranslateService, protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService, protected commonService: CommonService,
              protected corporateCommonService: CorporateCommonService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected multiBankService: MultiBankService, protected dropdownAPIService: DropDownAPIService,
              protected amendCommonService: AmendCommonService, protected confirmationService: ConfirmationService,
              protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe, protected searchLayoutService: SearchLayoutService,
              protected utilityService: UtilityService, protected resolverService: ResolverService,
              protected fileArray: FilelistService, protected dialogRef: DynamicDialogRef, protected taskService: FccTaskService,
              protected currencyConverterPipe: CurrencyConverterPipe, protected uiProductService: UiProductService,
              protected route:ActivatedRoute) {
    super(eventEmitterService, productStateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, uiProductService);
  }

  ngOnInit(): void {
    this.isMasterRequired = this.isMasterRequired;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    this.screenMode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.initializeFormGroup();
    this.handleSwiftFields();
    // this.checkBeneSaveAllowed();
    this.handleSwiftFields();
    this.fieldNames = ['beneficiaryContactName', 'beneficiaryContactFirstAddress', 'beneficiaryContactSecondAddress',
                       'beneficiaryContactThirdAddress'];
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.swiftXChar = response.swiftXCharacterSet;
        this.swiftZchar = response.swiftZChar;
        this.beneAbbvNameRegex = response.BeneficiaryAbbvNameRegex;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.appBenNameLength = response.nameTradeLength;
        this.appBenFullAddrLength = response.nonSwiftAddrLength;
        this.address1TradeLength = response.address1TradeLength;
        this.address2TradeLength = response.address2TradeLength;
        this.domTradeLength = response.domTradeLength;
        this.address4TradeLength = response.address4TradeLength;
        this.clearingFormValidators([ 'altApplicantName', 'applicantName', 'applicantFirstAddress', 'applicantSecondAddress',
        'applicantThirdAddress', 'altApplicantFirstAddress',
        'altApplicantSecondAddress', 'altApplicantThirdAddress', FccGlobalConstant.BENEFICIARY_ADDRESS_1,
        FccGlobalConstant.BENEFICIARY_ADDRESS_2, FccGlobalConstant.BENEFICIARY_ADDRESS_3]);
        if (this.mode === FccBusinessConstantsService.SWIFT){

          this.appNameLength = FccGlobalConstant.LENGTH_35;
          this.appBenFullAddrLength = FccGlobalConstant.LENGTH_140;
          this.address1TradeLength = FccGlobalConstant.LENGTH_35;
          this.address2TradeLength = FccGlobalConstant.LENGTH_35;
          this.domTradeLength = FccGlobalConstant.LENGTH_35;
          this.form.addFCCValidators('applicantName', Validators.pattern(this.swiftXChar), 0 );
          this.form.addFCCValidators('applicantFirstAddress', Validators.pattern(this.swiftXChar), 0 );
          this.form.addFCCValidators( 'applicantSecondAddress', Validators.pattern(this.swiftXChar),
          0
          );
          this.form.addFCCValidators(
            'applicantThirdAddress',
            Validators.pattern(this.swiftXChar),
            0
          );
          this.form.addFCCValidators(
            'altApplicantFirstAddress',
            Validators.pattern(this.swiftXChar),
            0
          );
          this.form.addFCCValidators(
            'altApplicantSecondAddress',
            Validators.pattern(this.swiftXChar),
            0
          );
          this.form.addFCCValidators(
            'altApplicantThirdAddress',
            Validators.pattern(this.swiftXChar),
            0
          );
          this.form.addFCCValidators(
            FccGlobalConstant.BENEFICIARY_ADDRESS_1,
            Validators.pattern(this.swiftXChar),
            0
          );
          this.form.addFCCValidators(
            FccGlobalConstant.BENEFICIARY_ADDRESS_2,
            Validators.pattern(this.swiftXChar),
            0
          );
          this.form.addFCCValidators(
            FccGlobalConstant.BENEFICIARY_ADDRESS_3,
            Validators.pattern(this.swiftXChar),
            0
          );
          this.form.updateValueAndValidity();
        }
        this.form.addFCCValidators( 'applicantName', Validators.maxLength(this.appNameLength), 0 );
        this.form.addFCCValidators( 'applicantFirstAddress', Validators.maxLength(this.address1TradeLength), 0 );
        this.form.addFCCValidators( 'applicantSecondAddress', Validators.maxLength(this.address2TradeLength), 0 );
        this.form.addFCCValidators( 'applicantThirdAddress', Validators.maxLength(this.domTradeLength), 0 );

        this.form.get('applicantName')[this.params][this.maxlength] = this.multiBankService.getIsEntity()
        ? this.appNameLength : this.beneLengthWithoutEntity;
        this.form.get('applicantFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
        this.form.get('applicantSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
        this.form.get('applicantThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
        this.form.get('beneficiaryFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
        this.form.get('beneficiarySecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
        this.form.get('beneficiaryThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
        this.form.get('applicantFullAddress')[this.params][this.maxlength] = this.appBenFullAddrLength;
        this.form.get('altApplicantFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
        this.form.get('altApplicantSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
        this.form.get('altApplicantThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
        this.form.get('altApplicantFullAddress')[this.params][this.maxlength] = this.appBenFullAddrLength;

        if (this.mode !== FccBusinessConstantsService.SWIFT) {
          this.form.addFCCValidators( 'beneficiaryFullAddress', Validators.maxLength(this.address4TradeLength), 0 );
          this.form.get('applicantName')[this.params][this.maxlength] = this.appBenNameLength;
          this.form.addFCCValidators( 'applicantName', Validators.maxLength(this.appBenNameLength), 0 );
          this.form.get('applicantName').updateValueAndValidity();
          this.form.get('applicantName').clearValidators();
          this.form.get('applicantFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
          this.form.get('applicantSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
          this.form.get('applicantThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
          this.form.get('applicantFourthAddress')[this.params][this.maxlength] = this.address4TradeLength;
          this.form.get('beneficiaryFourthAddress')[this.params][this.maxlength] = this.address4TradeLength;
          this.form.get('applicantFirstAddress').clearValidators();
          this.form.get('applicantSecondAddress').clearValidators();
          this.form.get('applicantThirdAddress').clearValidators();
          this.form.get('applicantFourthAddress').clearValidators();
        }
      }
      this.form.markAllAsTouched();
        this.beneficiaryInputValValidation();
      this.beneficiaryDropdownValValidation();

    });

    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.onClickApplicantToggle();
      this.setContactBeneToggle();
      this.onClickBeneficiaryContactToggle();
    } else if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.form.get('applicantToggle')[this.params][this.rendered] = false;
      this.form.get('beneficiaryContactToggle')[this.params][this.rendered] = false;
      this.amendFormFields();
      this.commonService.formatForm(this.form);
    }
    if (this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value !== undefined &&
    this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value !== FccGlobalConstant.EMPTY_STRING) {
      this.benePreviousValue = this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value;
    }
    if (this.form.get(FccGlobalConstant.SAVE_BENEFICIARY) && this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value){
      this.saveTogglePreviousValue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
    }
    if (this.form.get(FccGlobalConstant.BENE_ABBV_NAME) &&
    this.commonService.isNonEmptyValue(this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value) &&
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value !== FccGlobalConstant.EMPTY_STRING) {
     this.beneAbbvPreviousValue = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
    }
    if (this.mode === FccGlobalConstant.DRAFT_OPTION){
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }

  clearingFormValidators(fields: any){
    for (let i = 0; i < fields.length; i++) {
      this.form.get(fields[i]).clearValidators();
      this.form.get(fields[i]).updateValueAndValidity();
    }
  }

  // method to check if adhoc beneficiary save can be performed for amend
  checkBeneSaveAllowedForAmend(beneAmendValue: any) {
    this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
    this.clearBeneAbbvValidator();
    if (this.syBeneAdd && this.entityNameList !== undefined && this.entityNameList.length > 0
      && (this.entityNameList.indexOf(beneAmendValue) === -1)){
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = false;
      this.onClickBeneficiarySaveToggle();
    }
    else {
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = false;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
        this.clearBeneAbbvValidator();
    }
  }
  // method to check if adhoc beneficiary save can be performed
  checkBeneSaveAllowed(toggleValue) {
    setTimeout(()=>{
    this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
    this.beneEditToggleVisible = toggleValue;
    if (this.syBeneAdd && this.beneEditToggleVisible) {
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = false;
      this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).setValue(FccBusinessConstantsService.NO);
      this.onClickBeneficiarySaveToggle();
      this.beneficiaryInputValValidation();
    }
    else {
      if (!this.syBeneAdd || !this.beneEditToggleVisible){
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = false;
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).setValue(FccBusinessConstantsService.NO);
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
        this.clearBeneAbbvValidator();
        this.clearBeneEntityValidator();
        this.beneficiaryDropdownValueValidation();
      }
    } },300);
  }

    beneficiaryDropdownValueValidation(){
      const beneEntity = this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY)[FccGlobalConstant.VALUE];
      if (beneEntity === FccGlobalConstant.EMPTY_STRING || beneEntity === undefined || beneEntity === null){
        this.form.addFCCValidators(FccGlobalConstant.BENEFICIARY_ENTITY, Validators.compose([Validators.required]), 0);
        this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).updateValueAndValidity();
      }
    }

  clearBeneEntityValidator()
  {
    this.form.get('beneficiaryEntity').clearValidators();
    this.form.get('beneficiaryEntity').updateValueAndValidity();
  }

  // clear bene abbv validator
  clearBeneAbbvValidator() {
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).clearValidators();
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
  }

  // Display bene abbv name after turning on bene save toggle
  onClickBeneficiarySaveToggle() {
    const togglevalue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
    if (togglevalue === FccBusinessConstantsService.YES) {
      this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME, Validators.required, 1);
      //For abbv name validation swiftChar validation is not applicable in case transmission mode is swift
      this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
      Validators.compose([Validators.required, Validators.pattern(this.beneAbbvNameRegex)]), 0);
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = true;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = false;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
    }else {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setValue(FccGlobalConstant.EMPTY_STRING);
      this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
      this.clearBeneAbbvValidator();
    }
    if (this.mode === FccBusinessConstantsService.SWIFT) {
      this.beneficiaryInputValValidation();
    }
  }



  initializeFormGroup() {
    const sectionName = FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS;
    this.form = this.productStateService.getSectionData(sectionName, undefined, this.isMasterRequired);
    this.getCountryDetail();
    this.getBeneficiaries();
    this.getUserEntities();

    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.patchFieldParameters(this.form.get(FccGlobalConstant.APPLICANT_ENTITY), { options: this.entities });
      //this.patchFieldParameters(this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY), { options: this.beneficiaries });
    }
    this.patchFieldParameters(this.form.get('beneficiarycountry'), { options: this.beneficiaryCountry });

    this.patchFieldParameters(this.form.get('altApplicantcountry'), { options: this.country });
    this.patchFieldParameters(this.form.get('applicantcountry'), { options: this.country });
    this.patchFieldParameters(this.form.get('beneficiaryContactcountry'), { options: this.country });
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      this.swiftXChar = response.swiftXCharacterSet;
      this.swifCodeRegex = response.bigSwiftCode;
      this.form.addFCCValidators('beiCode', Validators.pattern(this.swifCodeRegex), 0);
    });
    this.form.get('altApplicantFourthAddress')[this.params][this.rendered] = false;
  }

  getBeneficiaries() {
    this.corporateCommonService.getCounterparties(
      this.fccGlobalConstantService.getStaticDataLimit(), this.fccGlobalConstantService.counterparties)
      .subscribe(response => {
        if (response.status === this.responseStatusCode) {
           this.getBeneficiariesAsList(response.body);
        }
        this.UpdateEntityBeni();
        if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
            this.handleBeneficiaryData();
        }
        this.updateBeneSaveToggleDisplay();
      });
  }

  getBeneficiariesAsList(body: any) {
    this.counterpartyDetailsList = body;
    if (this.commonService.addressType && this.commonService.addressType === FccGlobalConstant.POSTAL_ADDRESS_PA) {
      this.entityAddressType = FccGlobalConstant.POSTAL_ADDRESS;
    } else {
      this.entityAddressType = FccGlobalConstant.SWIFT_ADDRESS_LOWERCASE;
    }
    this.counterpartyDetailsList.items.forEach(value => {
      const beneficiary: { label: string; value: any } = {
        label: this.commonService.decodeHtml(value.name),
        value: {
          label: this.commonService.decodeHtml(value.shortName),
          swiftAddressLine1: this.commonService.decodeHtml(value[this.entityAddressType].line1),
          swiftAddressLine2: this.commonService.decodeHtml(value[this.entityAddressType].line2),
          swiftAddressLine3: this.commonService.decodeHtml(value[this.entityAddressType].line3),
          entity: decodeURI(value.entityShortName),
          shortName: this.commonService.decodeHtml(value.shortName),
          name: this.commonService.decodeHtml(value.name),
          country: this.commonService.decodeHtml(value.country)
        }
      };
      this.abbvNameList.push(this.commonService.decodeHtml(value.shortName));
      this.entityNameList.push(this.commonService.decodeHtml(value.name));
      this.beneficiaries.push(beneficiary);
      this.updatedBeneficiaries.push(beneficiary);
    });
    if (this.operation === FccGlobalConstant.PREVIEW && this.screenMode === FccGlobalConstant.VIEW_MODE) {
      if (this.form.get('beneficiaryEntity').value !== FccGlobalConstant.EMPTY_STRING &&
      typeof(this.form.get('beneficiaryEntity').value) === 'object') {
        const adhocBene: { label: string; value: any } = {
          label: this.form.get('beneficiaryEntity').value.label,
          value: {
            label: this.form.get('beneficiaryEntity').value.label,
            swiftAddressLine1: '',
            swiftAddressLine2: '',
            swiftAddressLine3: '',
            entity: '&#x2a;',
            shortName: '',
            name: ''
          }
        };
        this.beneficiaries.push(adhocBene);
        this.updatedBeneficiaries.push(adhocBene);
      }
     }
     if (this.form.get('beneficiaryEntity') && !this.commonService.isEmptyValue(this.form.get('beneficiaryEntity').value)) {
      const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.updatedBeneficiaries, 'beneficiaryEntity', this.form);
      if (valObj && valObj[`value`]) {
        this.form.get('beneficiaryEntity').patchValue(valObj[`value`]);
        this.form.get('beneficiaryEntity').clearValidators();
        this.form.get('beneficiaryEntity').setErrors(null);
        this.form.get('beneficiaryEntity').updateValueAndValidity();
      } else {
        this.form.get('beneficiaryEntity').patchValue(this.form.get('beneficiaryEntity').value);
        this.form.get('beneficiaryEntity').clearValidators();
        this.form.get('beneficiaryEntity').setErrors(null);
        this.form.get('beneficiaryEntity').updateValueAndValidity();
      }
    }
  }

  getUserEntities() {
    this.updateUserEntities();
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.handleBeneficiaryData();
    }
  }

  updateUserEntities() {
    this.multiBankService.getEntityList().forEach(entity => {
      this.entities.push(entity);
    });
    const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, FccGlobalConstant.APPLICANT_ENTITY, this.form);
    if (valObj && valObj[FccGlobalConstant.VALUE] !== undefined && !this.taskService.getTaskEntity()) {
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY).patchValue(valObj[FccGlobalConstant.VALUE]);
      this.multiBankService.setCurrentEntity(valObj[FccGlobalConstant.VALUE].shortName);
    }else if (this.taskService.getTaskEntity()){
      this.form.get('applicantEntity').patchValue(this.taskService.getTaskEntity());
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
      this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)){
        this.form.get('applicantName').setValue(this.taskService.getTaskEntity().name);
      }
    }
    if (this.entities.length === 0) {
      this.form.get(FccGlobalConstant.APPLICANT_NAME)[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1)[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3)[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      if (this.form.get(FccGlobalConstant.APPLICANT_ENTITY)) {
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.APPLICANT_ENTITY, false);
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY).clearValidators();
        this.form.get(FccGlobalConstant.APPLICANT_ENTITY).updateValueAndValidity();
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
       (this.form.get(FccGlobalConstant.APPLICANT_NAME).value === undefined ||
        this.form.get(FccGlobalConstant.APPLICANT_NAME).value === null ||
        this.form.get(FccGlobalConstant.APPLICANT_NAME).value === FccGlobalConstant.EMPTY_STRING)) {
          this.corporateCommonService.getValues(this.fccGlobalConstantService.corporateDetails).subscribe(response => {
            if (response.status === this.responseStatusCode) {
              this.corporateDetails = response.body;
              if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
              this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)){
                this.form.get(FccGlobalConstant.APPLICANT_NAME).setValue(this.corporateDetails.name);
              }

              this.updateCountryFilter.subscribe((val) => {
                if (val) {
                  this.form.get(FccGlobalConstant.APPLICANT_COUNTRY).setValue(this.country.filter(
                  task => task.value.label === this.corporateDetails.country)[0].value);
                  this.updateCountryFilter.next(false);
                }
              });
              if (this.commonService.addressType && this.commonService.addressType === FccGlobalConstant.POSTAL_ADDRESS_PA) {
                this.entityAddressType = FccGlobalConstant.POSTAL_ADDRESS;
              } else {
                this.entityAddressType = FccGlobalConstant.SWIFT_ADDRESS;
              }
              if (response.body[this.entityAddressType]) {
                if (!this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).value) {
                  if(this.commonService.decodeHtml(response.body[this.entityAddressType].line1) !== "undefined"){
                  this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1)
                  .setValue(this.commonService.decodeHtml(response.body[this.entityAddressType].line1));
                  }
                  else{
                    this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).setValue(response.body[this.entityAddressType].line1);
                  }
                }

                if (!this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2).value) {
                  if(this.commonService.decodeHtml(response.body[this.entityAddressType].line1) !== "undefined") {
                  this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)
                  .setValue(this.commonService.decodeHtml(response.body[this.entityAddressType].line2));
                  }
                  else{
                    this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).setValue(response.body[this.entityAddressType].line2);
                  }
                }
                if (!this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3).value) {
                  if(this.commonService.decodeHtml(response.body[this.entityAddressType].line1) !== "undefined") {
                  this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3)
                  .setValue(this.commonService.decodeHtml(response.body[this.entityAddressType].line3));
                  }
                  else{
                    this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).setValue(response.body[this.entityAddressType].line2);
                  }

                }
              }
            }
          });
        }
      this.patchFieldParameters(this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY), { options: this.updateBeneficiaries() });
      this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).updateValueAndValidity();
    } else if (this.entities.length === 1) {
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY).setValue({
        label: this.entities[0].value.label, name: this.entities[0].value.name,
        shortName: this.entities[0].value.shortName
      });
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][this.readonly] = true;
      this.multiBankService.setCurrentEntity(this.entities[0].value.shortName);
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
      this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)){
        this.form.get(FccGlobalConstant.APPLICANT_NAME).setValue(this.entities[0].value.name);
      }
      this.form.get(FccGlobalConstant.APPLICANT_NAME)[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1)[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3)[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.patchFieldParameters(this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY), { options: this.updateBeneficiaries() });
      this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).updateValueAndValidity();
      const address = this.multiBankService.getAddress(this.entities[0].value.shortName);
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_ADDRESS_1, this.form) &&
      this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).value)){
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1),
      address[this.address][this.addressLine1], '');
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_ADDRESS_2, this.form) &&
      this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2).value)){
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2),
      address[this.address][this.addressLine2], '');
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_ADDRESS_3, this.form) &&
      this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3).value)){
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3),
      address[this.address][this.addressLine3], '');
      }
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_ADDRESS_4, this.form) &&
      this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_4).value)){
      this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_4),
      address[this.address][this.addressLine4], '');
      }
      if (this.form.get('applicantcountry') && this.form.get('applicantcountry').value !== null &&
      this.form.get('applicantcountry').value !== undefined) {
        const exists = this.country.filter(
          task => task.value.label === this.form.get('applicantcountry').value);
        if (exists.length > 0) {
        this.form.get('applicantcountry').setValue(this.country.filter(
            task => task.value.label === address[this.address][this.countryLabel])[0].value);
        }
      }
      if (this.updatedBeneficiaries.length === 1 && !this.benePreviousValue && !this.form.get('beneficiaryEntity').value){
        this.patchFieldParameters(this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY), { autoDisplayFirst: true });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY), { readonly: true });
        // this.onClickBeneficiaryEntity(this.updatedBeneficiaries[0]);
      } else {
        this.patchFieldParameters(this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY), { readonly: false });
        this.patchFieldParameters(this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY), { autoDisplayFirst: false });
        this.form.get('beneficiaryEntity').updateValueAndValidity();
      }
    } else if (this.entities.length > 1) {
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][FccGlobalConstant.RENDERED] = true;
      this.patchFieldParameters(this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY), { options: [] });
      this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).updateValueAndValidity();
      this.form.get(FccGlobalConstant.APPLICANT_NAME)[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1)[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3)[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
    }
    this.patchFieldParameters(this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY), { options: this.updateBeneficiaries() });
    this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).updateValueAndValidity();
    this.removeMandatory([FccGlobalConstant.APPLICANT_ENTITY]);
  }

  updateBeneSaveToggleDisplay(){
    const beneAbbvNameValue = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
    if (this.benePreviousValue !== undefined &&
      (this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.screenMode === FccGlobalConstant.DRAFT_OPTION)){
      this.checkBeneSaveAllowedForAmend(this.benePreviousValue.name);
      if (this.saveTogglePreviousValue === FccBusinessConstantsService.YES && this.beneAbbvPreviousValue){
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = true;
      }
    }
    if (beneAbbvNameValue !== null && beneAbbvNameValue !== FccGlobalConstant.EMPTY_STRING){
      if (this.benePreviousValue && (this.entityNameList.indexOf(this.benePreviousValue.name ?
        this.benePreviousValue.name : this.benePreviousValue) === -1)){
        this.onBlurBeneAbbvName();
      }else{
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = true;
        this.clearBeneAbbvValidator();
        this.commonService.beneAbbvNameDisabled('beneAbbvName');
      }
    }
  }

  updateBeneficiaries(): any[] {
    this.updatedBeneficiaries = [];
    if (!this.form.get(FccGlobalConstant.APPLICANT_ENTITY)[this.params][this.rendered]) {
      this.beneficiaries.forEach(value => {
        if (value.value.entity === '&#x2a;') {
          const beneficiary: { label: string; value: any } = {
            label: value.label,
            value: value.value
          };
          this.updatedBeneficiaries.push(beneficiary);
        }
      });
    }
    if (this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value.shortName !== undefined &&
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value.shortName !== '') {
      this.beneficiaries.forEach(value => {
        if (this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value.shortName === value.value.entity || value.value.entity === '&#x2a;') {
          const beneficiary: { label: string; value: any } = {
            label: value.label,
            value: value.value
          };
          this.updatedBeneficiaries.push(beneficiary);
        }
      });
    }
    return this.updatedBeneficiaries;
  }

  onClickBeneficiaryEntity(event) {
    if (event.value) {
      this.form.get('beneficiaryEntity').setValue(event.value);
      this.form.get('beneficiaryFirstAddress').setValue(event.value.swiftAddressLine1);
      this.form.get('beneficiarySecondAddress').setValue(event.value.swiftAddressLine2);
      this.form.get('beneficiaryThirdAddress').setValue(event.value.swiftAddressLine3);
      this.form.get('beneficiaryFourthAddress').setValue(event.value.swiftAddressLine4);
      this.form.get('beneficiarycountry').setValue('');
      this.form.get('beneficiarycountry').setValue( this.country.filter(
          task => task.value.label === event.value.country)[0]?.value);
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND){
      this.addAmendLabel();
    }
    if (this.mode === FccBusinessConstantsService.SWIFT) {
      this.beneficiaryDropdownValValidation();
    }
  }

  beneficiaryDropdownValValidation(){
    let beneEntity;
    if (typeof(this.form.get('beneficiaryEntity').value) === 'object'){
       beneEntity = this.form.get('beneficiaryEntity')[FccGlobalConstant.VALUE][FccGlobalConstant.NAME];
    }
    else {
     beneEntity = this.form.get('beneficiaryEntity')[FccGlobalConstant.VALUE];
    }
    this.form.get('beneficiaryEntity').setErrors(null);
    this.form.get('beneficiaryEntity').updateValueAndValidity();
    const beneNameReg = new RegExp(this.appBenAddressRegex);
    if (this.mode === FccBusinessConstantsService.SWIFT)
    {
      if ((!beneNameReg.test(beneEntity)) && this.commonService.isnonEMptyString(beneEntity))
      {
        this.form.get('beneficiaryEntity')
        .setErrors({ pattern: { field: this.form.get('beneficiaryEntity')[this.params][FccGlobalConstant.LABEL] } });
      }
      if (typeof(this.form.get('beneficiaryEntity').value) !== 'object' && FccGlobalConstant.TEMPLATE !== this.option){
      this.form.addFCCValidators('beneficiaryEntity',
         Validators.compose([Validators.required , Validators.pattern(this.appBenAddressRegex)]), 0);
      }
    } else if (this.mode !== FccBusinessConstantsService.SWIFT && this.option !== FccGlobalConstant.TEMPLATE)
   {
    this.form.addFCCValidators('beneficiaryEntity', Validators.compose([Validators.required]), 0);
    this.form.get('beneficiaryEntity').updateValueAndValidity();
  }
  }


  addAmendLabel() {
    this.addAmendLabelOnBeneficiary(this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_1));
    this.addAmendLabelOnBeneficiary(this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_2));
    this.addAmendLabelOnBeneficiary(this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_3));
    this.addAmendLabelOnBeneficiary(this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_4));
  }

  addAmendLabelOnBeneficiary(control: any) {
    const header = this.form.get(FccGlobalConstant.BENEFICIARY_HEADER);
    this.groupAmendLabel(control, control.value, this.form, header);
    if (this.commonService.isNonEmptyValue(control.params.previousCompareValue)
        && control.params.previousCompareValue === FccGlobalConstant.EMPTY_STRING &&
        control.value !== control.params.previousCompareValue)
     {
       this.patchFieldParameters(control, { infoIcon: true, groupLabel: true });
       this.patchFieldParameters(header, { infoIcon: true, infolabel: FccGlobalConstant.AMENDED });
     }
  }

  onClickApplicantEntity() {
    const entity = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value;
    if(this.screenMode === FccGlobalConstant.INITIATE){
      this.stateService.getSectionData(FccGlobalConstant.UI_BANK_DETAILS).get('issuerReferenceList').setValue('');
      }
    if (entity) {
      this.multiBankService.setCurrentEntity(entity.shortName);
      this.multiBankService.clearIssueRef();
      this.taskService.setTaskEntity(entity);
      this.patchFieldValueAndParameters(this.form.get('applicantName'), entity.name, '');
      this.entities.forEach(value => {
        if (entity.shortName === value.value.shortName) {
          const address = this.multiBankService.getAddress(value.value.shortName);
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1),
            address[this.address][this.addressLine1], '');
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2),
            address[this.address][this.addressLine2], '');
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3),
            address[this.address][this.addressLine3], '');
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_4),
            address[this.address][this.addressLine4], '');
          this.form.get('applicantcountry').setValue( this.country.filter(
          task => task.value.label === address[this.address][this.countryLabel])[0]?.value);
        }
      });
      this.setBeneficiaryNull();
      this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: this.updateBeneficiaries() });
      this.form.get('beneficiaryEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
        FccGlobalConstant.APPLICANT_BENE_STYLE_CLASS;
      this.form.updateValueAndValidity();

      if (this.updatedBeneficiaries.length === 1) {
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { readonly: true });
        //this.onClickBeneficiaryEntity(this.updatedBeneficiaries[0]);
        this.form.get('beneficiaryEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
          FccGlobalConstant.SINGLE_BENE_STYLE_CLASS;
        this.form.get('beneficiaryEntity').updateValueAndValidity();
        this.form.updateValueAndValidity();
      } else {
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { readonly: false });
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { autoDisplayFirst: false });
        this.form.get('beneficiaryEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
          FccGlobalConstant.APPLICANT_BENE_STYLE_CLASS;

      }
      this.multiBankService.updateRefonEntityChangeSub.next(true);
    }

  }
  setBeneficiaryNull() {
    let setEntityToNull = true;
    if (this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY) && this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value &&
      this.form.get(FccGlobalConstant.APPLICANT_NAME) && this.form.get(FccGlobalConstant.APPLICANT_NAME).value
      && this.beneficiaries && this.beneficiaries.length > 0) {
      const selectedbeneEntity = this.beneficiaries
        .filter(rec => rec.value.label === this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value.label)[0]?.value.entity;
      if (selectedbeneEntity && (selectedbeneEntity === '&#x2a;'
        || selectedbeneEntity === this.form.get(FccGlobalConstant.APPLICANT_NAME).value)) {
        setEntityToNull = false;
      }
    }
    if (setEntityToNull) {
      this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_1).setValue('');
      this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_2).setValue('');
      this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_3).setValue('');
      this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_4).setValue('');
      this.form.get(FccGlobalConstant.BENEFICIARY_COUNTRY).setValue('');
      this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).setValue('');
    }
  }

  UpdateEntityBeni() {
    if (this.lcResponseForm.applicant && this.lcResponseForm.applicant.entityShortName !== undefined && this.context === 'readonly') {
      this.form.get(FccGlobalConstant.APPLICANT_ENTITY).setValue(this.entities.filter(
        task => task.label === this.lcResponseForm.applicant.entityShortName)[0].value);
      this.patchFieldParameters(this.form.get(FccGlobalConstant.APPLICANT_ENTITY), { readonly: true });
      this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).setValue(this.updatedBeneficiaries.filter(
        task => task.value.label === this.lcResponseForm.beneficiary.name)[0].value);
      this.patchFieldParameters(this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY), { readonly: true });
    }

    if (this.form.get(FccGlobalConstant.APPLICANT_ENTITY) && this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value) {
      const applicantEntity = this.productStateService.getValue(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS,
        FccGlobalConstant.APPLICANT_ENTITY, this.isMasterRequired);
      if (applicantEntity) {
        const exist = this.entities.filter(task => task.value.label === applicantEntity);
        if (exist.length > 0) {
          this.form.get(FccGlobalConstant.APPLICANT_ENTITY).setValue(this.entities.filter(
            task => task.value.label === applicantEntity)[0].value);
        }
      }
    }
    if (this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY) && this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value) {
      const beneficiaryEntity = this.productStateService.getValue(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS,
        'beneficiaryEntity', this.isMasterRequired);
      if (beneficiaryEntity) {
        const beneficiaryNameLabel = this.updatedBeneficiaries.filter(task => task.value.label === beneficiaryEntity);
        const beneficiaryName = this.updatedBeneficiaries.filter(task => task.value.name === beneficiaryEntity);
        if (beneficiaryNameLabel !== undefined && beneficiaryNameLabel !== null && beneficiaryNameLabel.length > 0) {
          this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).setValue(beneficiaryNameLabel[0].value);
        } else if (beneficiaryName !== undefined && beneficiaryName !== null && beneficiaryName.length > 0) {
          this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).setValue(beneficiaryName[0].value);
        }
        this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).updateValueAndValidity();
      }
    }
    else if (this.benePreviousValue !== undefined && this.benePreviousValue !== null) {
      this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).setValue(this.benePreviousValue);
    }
    // validate beneficaryEntity once value is set
    this.beneficiaryInputValValidation();
  }

  onClickApplicantToggle() {
    const togglevalue = this.form.get('applicantToggle').value;
    if (togglevalue === FccBusinessConstantsService.NO) {
      this.form.get('altApplicantName')[this.params][this.rendered] = false;
      this.form.get('altApplicantFirstAddress')[this.params][this.rendered] = false;
      this.form.get('altApplicantSecondAddress')[this.params][this.rendered] = false;
      this.form.get('altApplicantThirdAddress')[this.params][this.rendered] = false;
      if (this.mode !== FccBusinessConstantsService.SWIFT) {
        this.form.get('altApplicantFourthAddress')[this.params][this.rendered] = false;
        this.form.get('altApplicantFourthAddress').clearValidators();
        this.form.get('altApplicantFourthAddress').updateValueAndValidity();
      }
      this.form.get('altApplicantcountry')[this.params][this.rendered] = false;

      if(this.option !== FccGlobalConstant.TEMPLATE) {
        this.setMandatoryFields(this.form, ['altApplicantName', 'altApplicantFirstAddress', 'altApplicantcountry'], true);
        this.setMandatoryFields(this.form, ['altApplicantSecondAddress', 'altApplicantThirdAddress',
        'altApplicantFourthAddress'], false);
      }
      
      this.form.get('altApplicantName').clearValidators();
      this.form.get('altApplicantFirstAddress').clearValidators();
      this.form.get('altApplicantSecondAddress').clearValidators();
      this.form.get('altApplicantThirdAddress').clearValidators();
      this.form.get('altApplicantcountry').clearValidators();
      this.form.get('altApplicantName').updateValueAndValidity();
      this.form.get('altApplicantFirstAddress').updateValueAndValidity();
      this.form.get('altApplicantSecondAddress').updateValueAndValidity();
      this.form.get('altApplicantThirdAddress').updateValueAndValidity();
      this.form.get('altApplicantcountry').updateValueAndValidity();
    } else {
      this.form.get('altApplicantName')[this.params][this.rendered] = true;
      this.form.get('altApplicantFirstAddress')[this.params][this.rendered] = true;
      this.form.get('altApplicantSecondAddress')[this.params][this.rendered] = true;
      this.form.get('altApplicantThirdAddress')[this.params][this.rendered] = true;
       this.form.addFCCValidators(
          'altApplicantName',
          Validators.pattern(this.swiftXChar),
          0
        );
        this.form.addFCCValidators(
          'altApplicantFirstAddress',
          Validators.pattern(this.swiftXChar),
          0
        );
        this.form.addFCCValidators(
          'altApplicantSecondAddress',
          Validators.pattern(this.swiftXChar),
          0
        );
        this.form.addFCCValidators(
          'altApplicantThirdAddress',
          Validators.pattern(this.swiftXChar),
          0
        );

      if (this.mode !== FccBusinessConstantsService.SWIFT) {
        this.form.get('altApplicantFourthAddress')[this.params][this.rendered] = true;
      }
      this.form.get('altApplicantcountry')[this.params][this.rendered] = true;
      this.removeMandatory(['altApplicantName', 'altApplicantFirstAddress', 'altApplicantcountry']);
    }
  }

  onClickBeneficiaryContactToggle() {
    const togglevalue = this.form.get('beneficiaryContactToggle').value;
    if (togglevalue === FccBusinessConstantsService.NO) {
      this.form.get('beneficiaryContactName')[this.params][this.rendered] = false;
      this.form.get('beneficiaryContactFirstAddress')[this.params][this.rendered] = false;
      this.form.get('beneficiaryContactSecondAddress')[this.params][this.rendered] = false;
      this.form.get('beneficiaryContactThirdAddress')[this.params][this.rendered] = false;
      if (this.mode !== FccBusinessConstantsService.SWIFT) {
        this.form.get('beneficiaryContactFourthAddress')[this.params][this.rendered] = false;
        this.form.get('beneficiaryContactFourthAddress').clearValidators();
        this.form.get('beneficiaryContactFourthAddress').updateValueAndValidity();
      }
      this.form.get('beneficiaryContactcountry')[this.params][this.rendered] = false;
      this.setMandatoryFields(this.form, ['beneficiaryContactName', 'beneficiaryContactFirstAddress', 'beneficiaryContactSecondAddress',
      'beneficiaryContactThirdAddress', 'beneficiaryContactFourthAddress', 'beneficiaryContactcountry'], false);
      this.form.get('beneficiaryContactName').clearValidators();
      this.form.get('beneficiaryContactFirstAddress').clearValidators();
      this.form.get('beneficiaryContactSecondAddress').clearValidators();
      this.form.get('beneficiaryContactThirdAddress').clearValidators();
      this.form.get('beneficiaryContactcountry').clearValidators();
      this.form.get('beneficiaryContactName').updateValueAndValidity();
      this.form.get('beneficiaryContactFirstAddress').updateValueAndValidity();
      this.form.get('beneficiaryContactSecondAddress').updateValueAndValidity();
      this.form.get('beneficiaryContactThirdAddress').updateValueAndValidity();
      this.form.get('beneficiaryContactcountry').updateValueAndValidity();
    } else {
      this.form.get('beneficiaryContactName')[this.params][this.rendered] = true;
      this.form.get('beneficiaryContactFirstAddress')[this.params][this.rendered] = true;
      this.form.get('beneficiaryContactSecondAddress')[this.params][this.rendered] = true;
      this.form.get('beneficiaryContactThirdAddress')[this.params][this.rendered] = true;
      if (this.mode !== FccBusinessConstantsService.SWIFT) {
        this.form.get('beneficiaryContactFourthAddress')[this.params][this.rendered] = true;
      } else if (this.mode === FccBusinessConstantsService.SWIFT) {
        this.fieldNames.forEach(ele => {
          this.form.get(ele).clearValidators();
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
      this.form.get('beneficiaryContactcountry')[this.params][this.rendered] = true;
    }
  }

  getCountryDetail() {
    this.commonService.getCountries().subscribe(data => {
      this.updateCountries(data);
    });
  }

  beneficiaryInputValValidation() {
    const entityField = this.form.get('beneficiaryEntity');
    let beneEntity;
    if (entityField) {
      if (entityField.value && typeof(entityField.value) === 'object'){
        beneEntity = entityField[FccGlobalConstant.VALUE][FccGlobalConstant.NAME];
      }
      else {
        beneEntity = entityField[FccGlobalConstant.VALUE];
      }
      entityField.updateValueAndValidity();
      const beneNameReg = new RegExp(this.swiftXChar);
      if (this.mode === FccBusinessConstantsService.SWIFT)
      {
        if ((!beneNameReg.test(beneEntity)) && this.commonService.isnonEMptyString(beneEntity))
        {
          entityField
          .setErrors({ pattern: { field: entityField[this.params][FccGlobalConstant.LABEL] } });
          this.form.addFCCValidators('beneficiaryEntity',
          Validators.compose([Validators.required , Validators.pattern(this.swiftXChar)]), 0);
          entityField.updateValueAndValidity();
        }
      }
      else if (this.mode !== FccBusinessConstantsService.SWIFT && this.option !== FccGlobalConstant.TEMPLATE)
      {
       this.form.addFCCValidators('beneficiaryEntity', Validators.compose([Validators.required]), 0);
       this.form.get('beneficiaryEntity').updateValueAndValidity();
      }
    }

  }

  updateCountries(body: any) {
    this.countryList = body;
    this.countryList.countries.forEach(value => {
      const country: { label: string; value: any } = {
        label: value.alpha2code + '-' + value.name,
        value: {
          label: value.alpha2code,
          shortName: value.alpha2code,
          name: value.name
        }
      };
      this.country.push(country);
      const beneCountry: { label: string; value: any } = {
        label: value.alpha2code + '-' + value.name,
        value: {
          label: value.alpha2code,
          shortName: value.alpha2code,
          name: value.name
        }
      };
      this.beneficiaryCountry.push(beneCountry);
    });
    if(this.country.length > 0){
      this.updateCountryFilter.next(true);
    }
    this.updateCountry();
    this.updateCountryValue();
  }

  updateCountry() {
    if (this.lcResponseForm.alternateApplicant !== undefined) {
      this.form.get('altApplicantcountry').setValue( this.country.filter(
      task => task.value.label === this.lcResponseForm.alternateApplicant.country)[0].value);
      this.patchFieldParameters(this.form.get('altApplicantcountry') , { readonly: true });
      this.form.get('beneficiarycountry').setValue( this.beneficiaryCountry.filter(
        task => task.value.label === this.lcResponseForm.beneficiary.country)[0].value);
      this.patchFieldParameters(this.form.get('beneficiarycountry') , { readonly: true });
    }
    if (this.form.get('applicantcountry') && this.form.get('applicantcountry').value) {
      const applicantcountry = this.productStateService.
      getValue(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS, 'applicantcountry', this.isMasterRequired);
      const applicantcountryLabel = this.country.filter( task => task.value.label === applicantcountry);
      const applicantcountryName = this.country.filter( task => task.value.name === applicantcountry);
      if (applicantcountryLabel !== undefined && applicantcountryLabel !== null && applicantcountryLabel.length > 0) {
        this.form.get('applicantcountry').setValue(applicantcountryLabel[0].value);
      } else if (applicantcountryName !== undefined && applicantcountryName !== null && applicantcountryName.length > 0) {
        this.form.get('applicantcountry').setValue(applicantcountryName[0].value);
      }
    }
    if (this.form.get('altApplicantcountry') && this.form.get('altApplicantcountry').value) {
        const altApplicantCountry = this.productStateService.
        getValue(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS, 'altApplicantcountry', this.isMasterRequired);
        const altApplicantCountryLabel = this.country.filter( task => task.value.label === altApplicantCountry);
        const altApplicantCountryName = this.country.filter( task => task.value.name === altApplicantCountry);
        if (altApplicantCountryLabel !== undefined && altApplicantCountryLabel !== null && altApplicantCountryLabel.length > 0) {
          this.form.get('altApplicantcountry').setValue(altApplicantCountryLabel[0].value);
        } else if (altApplicantCountryName !== undefined && altApplicantCountryName !== null && altApplicantCountryName.length > 0) {
          this.form.get('altApplicantcountry').setValue(altApplicantCountryName[0].value);
        }
    }
    if (this.form.get('beneficiarycountry') && this.form.get('beneficiarycountry').value) {
        const beneficiarycountry = this.productStateService.
        getValue(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS, 'beneficiarycountry', this.isMasterRequired);
        const beneficiarycountryLabel = this.country.filter( task => task.value.label === beneficiarycountry);
        const beneficiarycountryName = this.country.filter( task => task.value.name === beneficiarycountry);
        if (beneficiarycountryLabel !== undefined && beneficiarycountryLabel !== null
        && beneficiarycountryLabel.length > 0) {
          this.form.get('beneficiarycountry').setValue(beneficiarycountryLabel[0].value);
        } else if (beneficiarycountryName !== undefined && beneficiarycountryName !== null
          && beneficiarycountryName.length > 0) {
          this.form.get('beneficiarycountry').setValue(beneficiarycountryName[0].value);
        }
    }

    if (this.form.get('beneficiaryContactcountry') && this.form.get('beneficiaryContactcountry').value) {
      const beneficiaryContactcountry = this.productStateService.
      getValue(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS, 'beneficiaryContactcountry', this.isMasterRequired);
      const beneficiaryContactcountryLabel = this.country.filter( task => task.value.label === beneficiaryContactcountry);
      const beneficiaryContactcountryName = this.country.filter( task => task.value.name === beneficiaryContactcountry);
      if (beneficiaryContactcountryLabel !== undefined && beneficiaryContactcountryLabel !== null
        && beneficiaryContactcountryLabel.length > 0) {
        this.form.get('beneficiaryContactcountry').setValue(beneficiaryContactcountryLabel[0].value);
      } else if (beneficiaryContactcountryName !== undefined && beneficiaryContactcountryName !== null
        && beneficiaryContactcountryName.length > 0) {
        this.form.get('beneficiaryContactcountry').setValue(beneficiaryContactcountryName[0].value);
      }
    }
  }

  updateCountryValue() {
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.country.length > 0) {
      let altApplicantcountry;
      if (this.commonService.checkPendingClientBankViewForAmendTnx()) {
        altApplicantcountry = this.productStateService.getValueObject('uiApplicantBeneficiaryDetails', 'altApplicantcountry', false);
      } else {
        altApplicantcountry =
        this.productStateService.getValueObject('uiApplicantBeneficiaryDetails', 'altApplicantcountry', this.isMasterRequired);
      }
      const exists = this.country.filter(
        task => task.value.label === altApplicantcountry.value);
      if (exists.length > 0) {
      this.form.get('altApplicantcountry').setValue(this.country.filter(
          task => task.value.label === altApplicantcountry.value)[0].value);
      }
      this.patchFieldParameters(this.form.get('altApplicantcountry'), { readonly: false });
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

    if (this.mode !== null && this.mode !== undefined && this.mode !== '' && (typeof this.mode === 'object')) {
      this.mode = this.stateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL).get('advSendMode').value[0].value;
    }
    if (this.mode === FccBusinessConstantsService.SWIFT) {
      this.form.get('applicantFourthAddress')[this.params][this.rendered] = false;
      this.form.get('beneficiaryFourthAddress')[this.params][this.rendered] = false;
    } else if (this.form.get('applicantFourthAddress') && this.form.get('beneficiaryFourthAddress')) {
      this.form.get('applicantFourthAddress')[this.params][this.rendered] = true;
      this.form.get('beneficiaryFourthAddress')[this.params][this.rendered] = true;
    }
    this.form.updateValueAndValidity();
  }

  amendFormFields() {
    if (this.commonService.checkPendingClientBankViewForAmendTnx()) {
      const addressDelimiter = ', ';
      this.handleAmendApplicant(addressDelimiter);
    }
    this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS);
    this.patchFieldParameters(this.form.get('applicantFullAddress'), { previousValue: this.applicantFullAddressValue });
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND && this.screenMode === FccGlobalConstant.DRAFT_OPTION){
      const entity = this.form.get('beneficiaryEntity');
      const entityValue = entity.value ?? entity.setValue('');
      const benefirstaddr = this.form.get('beneficiaryFirstAddress');
      const benefirstaddrValue = benefirstaddr.value ?? benefirstaddr.setValue('');
      const benecode = this.form.get('beiCode');
      const benecodeValue = benecode.value ?? benecode.setValue('') ;
      const benesecondaddr = this.form.get('beneficiarySecondAddress');
      const benesecondaddrValue = benesecondaddr.value ?? benesecondaddr.setValue('');
      const benethirdaddr = this.form.get('beneficiaryThirdAddress');
      const benethirdaddrValue = benethirdaddr.value ?? benethirdaddr.setValue('');
      const benecountry = this.form.get('beneficiarycountry');
      const benecountryValue = benecountry.value ?? benecountry.setValue('');
      if (entityValue.name === entity[`params`].previousCompareValue &&
      benefirstaddrValue === benefirstaddr[`params`].previousCompareValue &&
      benesecondaddrValue === benesecondaddr[`params`].previousCompareValue &&
      benethirdaddrValue === benethirdaddr[`params`].previousCompareValue &&
      benecountryValue.label === benecountry[`params`].previousCompareValue &&
      benecodeValue === benecode[`params`].previousCompareValue) {
          this.patchFieldParameters(this.form.get('beneficiaryHeader'), { infoIcon: false, isAmendedLabel: false, });
         }
         const paramMode = this.route?.snapshot?.queryParams['mode'];
         if(this.commonService.isnonBlankString(paramMode) && paramMode === 'DRAFT'){
          this.form.get('beneficiaryEntity').setErrors(null);
          this.form.get('beneficiaryEntity').clearValidators();
          this.form.get('beneficiaryEntity').updateValueAndValidity();
         }
    }
  }

  protected handleAmendApplicant(addressDelimiter: string) {
    this.handleBeneficiaryData();
    let applicantFourthAddressValue = '';
    if (this.form.get('applicantEntity')) {
      this.form.get('applicantEntity')[this.params][this.rendered] = true;
    }
    this.form.get('applicantName')[this.params][this.rendered] = true;
    this.form.get('applicantName').clearValidators();
    this.form.get('applicantcountry')[this.params][this.rendered] = false;
    this.form.get('beneficiaryFourthAddress')[this.params][this.rendered] = false;
    this.form.get('beneficiaryFullAddress')[this.params][this.rendered] = false;
    if (this.commonService.isNonEmptyField('applicantFirstAddress', this.form)) {
      this.form.get('applicantFirstAddress')[this.params][this.rendered] = false;
      this.form.get('applicantFirstAddress').clearValidators();
    }
    if (this.commonService.isNonEmptyField('applicantSecondAddress', this.form)) {
      this.form.get('applicantSecondAddress')[this.params][this.rendered] = false;
      this.form.get('applicantSecondAddress').clearValidators();
    }
    if (this.commonService.isNonEmptyField('applicantThirdAddress', this.form)) {
      this.form.get('applicantThirdAddress')[this.params][this.rendered] = false;
      this.form.get('applicantThirdAddress').clearValidators();
    }
    if (this.form.get('applicantFourthAddress') !== undefined && this.form.get('applicantFourthAddress') !== null) {
      this.form.get('applicantFourthAddress')[this.params][this.rendered] = false;
      this.form.get('applicantFourthAddress').clearValidators();
      this.setMandatoryFields(this.form, ['applicantFourthAddress'], false);
    }
    this.form.get('applicantFullAddress')[this.params][this.rendered] = true;
    const applicantFirstAddressValue = this.productStateService.getValue(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS,
      'applicantFirstAddress', false);

    const applicantSecondAddressValue = this.commonService.isNonEmptyField('applicantThirdAddress', this.form) ?
      this.productStateService.getValue(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS, 'applicantSecondAddress', false) : '' ;

    const applicantThirdAddresssValue = this.commonService.isNonEmptyField('applicantThirdAddress', this.form) ?
      this.productStateService.getValue(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS, 'applicantThirdAddress', false) : '';

    this.applicantFullAddressValue = applicantFirstAddressValue;
    if (applicantSecondAddressValue !== undefined && applicantSecondAddressValue !== null && applicantSecondAddressValue !== '') {
      this.applicantFullAddressValue = this.applicantFullAddressValue.concat(addressDelimiter).concat(applicantSecondAddressValue);
    }
    if (applicantThirdAddresssValue !== undefined && applicantThirdAddresssValue !== null && applicantThirdAddresssValue !== '') {
      this.applicantFullAddressValue = this.applicantFullAddressValue.concat(addressDelimiter).concat(applicantThirdAddresssValue);
    }
    if (this.mode !== FccBusinessConstantsService.SWIFT) {
      applicantFourthAddressValue = this.commonService.isNonEmptyField('applicantFourthAddress', this.form) ?
             this.productStateService.getValue(FccGlobalConstant.UI_APPLICANT_BENEFICIARY_DETAILS, 'applicantFourthAddress', false) : '';
      if (applicantFourthAddressValue !== undefined && applicantFourthAddressValue !== null && applicantFourthAddressValue !== '') {
        this.applicantFullAddressValue = this.applicantFullAddressValue.concat(addressDelimiter).concat(applicantFourthAddressValue);
      }
    }
    this.patchFieldValueAndParameters(this.form.get('applicantFullAddress'), this.applicantFullAddressValue, { readonly: true });
    this.patchFieldParameters(this.form.get('applicantFullAddress'), { previousValue: this.applicantFullAddressValue });
    this.form.updateValueAndValidity();
  }

  handleBeneficiaryData() {
    let applicantEntity = this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_ENTITY, this.form) ?
    this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value : this.form.get(FccGlobalConstant.APPLICANT_ENTITY);
    if (typeof applicantEntity === FccGlobalConstant.OBJECT) {
      applicantEntity = applicantEntity.label;
    }
    const applicantEntityLabel = this.entities.filter( task => task.value.label === applicantEntity);
    if (applicantEntityLabel !== undefined && applicantEntityLabel !== null && applicantEntityLabel.length > 0) {
         this.form.get(FccGlobalConstant.APPLICANT_ENTITY).setValue(applicantEntityLabel[0].value.shortName);
    }
    let applicantcountry = this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_COUNTRY, this.form) ?
    this.form.get(FccGlobalConstant.APPLICANT_COUNTRY).value : this.form.get(FccGlobalConstant.APPLICANT_COUNTRY);
    if (typeof applicantcountry === FccGlobalConstant.OBJECT) {
        applicantcountry = applicantcountry.label ? applicantcountry.label : FccGlobalConstant.EMPTY_STRING;
        this.form.get(FccGlobalConstant.APPLICANT_COUNTRY).setValue(applicantcountry);
    }
  }

  ngOnDestroy() {
    if (this.form.get(FccGlobalConstant.SAVE_BENEFICIARY) !== null) {
      const togglevalue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
      if (togglevalue !== undefined && togglevalue === FccBusinessConstantsService.YES &&
        !this.form.get(FccGlobalConstant.BENE_ABBV_NAME).hasError('duplicateCounterpartyAbbvName')){
          if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND || this.screenMode === FccGlobalConstant.DRAFT_OPTION){
            this.commonService.saveBeneficiary(this.getCounterPartyObjectForAmend(this.form)).subscribe();
          }else{
            this.commonService.saveBeneficiary(this.getCounterPartyObject(this.form)).subscribe();
          }
      }
    }
  }

  // to create adhoc beneficiary object
  getCounterPartyObject(form: FCCFormGroup): CounterpartyRequest {
    const counterpartyRequest: CounterpartyRequest = {
      name: this.commonService.validateValue(form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value),
      shortName: this.commonService.validateValue(form.get(FccGlobalConstant.BENE_ABBV_NAME).value),
      swiftAddress: {
        line1: this.commonService.validateValue(form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_1).value),
        line2: this.commonService.validateValue(form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_2).value),
        line3: this.commonService.validateValue(form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_3).value),
      },
      country: this.commonService.validateValue(form.get(FccGlobalConstant.BENEFICIARY_COUNTRY).value.shortName),
      entityShortName: FccGlobalConstant.ENTITY_DEFAULT,
    };
    return counterpartyRequest;
  }

    // to create adhoc beneficiary object for Amend
    getCounterPartyObjectForAmend(form: FCCFormGroup): CounterpartyRequest {
      let beneName: string;
      if (form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value.name !== undefined){
      beneName = form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value.name;
    } else {
      beneName = form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value;
    }
      const counterpartyRequest: CounterpartyRequest = {
        name: this.commonService.validateValue(beneName),
        shortName: this.commonService.validateValue(form.get(FccGlobalConstant.BENE_ABBV_NAME).value),
        swiftAddress: {
          line1: this.commonService.validateValue(form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_1).value),
          line2: this.commonService.validateValue(form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_2).value),
          line3: this.commonService.validateValue(form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_3).value),
        },
        country: this.commonService.validateValue(form.get(FccGlobalConstant.BENEFICIARY_COUNTRY).value.shortName),
        entityShortName: FccGlobalConstant.ENTITY_DEFAULT,
      };
      return counterpartyRequest;
    }

  removeMandatory(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }

  setContactBeneToggle(){
    if ((this.form.get('beneficiaryContactName').value !== '' && this.form.get('beneficiaryContactName').value !== null) ||
    (this.form.get('beneficiaryContactSecondAddress').value !== '' && this.form.get('beneficiaryContactSecondAddress').value !== null) ||
    (this.form.get('beneficiaryContactThirdAddress').value !== '' && this.form.get('beneficiaryContactThirdAddress').value !== null) ||
    (this.form.get('beneficiaryContactFirstAddress').value !== '' && this.form.get('beneficiaryContactFirstAddress').value !== null) ||
    (this.form.get('beneficiaryContactcountry').value !== '' && this.form.get('beneficiaryContactcountry').value !== null)) {
      this.form.get('beneficiaryContactToggle').setValue('Y');
      this.form.get('beneficiaryContactToggle').updateValueAndValidity();
    }
  }
  // validation on change of beneAbbvName field
  onBlurBeneAbbvName() {
    const abbvName = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors(null);
    if (this.abbvNameList.indexOf(abbvName) > -1 && !this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly]) {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors({ duplicateCounterpartyAbbvName: { abbvName } });
    }
    this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
    Validators.compose([Validators.pattern(this.beneAbbvNameRegex)]), 0);
    if(this.option !== FccGlobalConstant.TEMPLATE){
      this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
        Validators.compose([Validators.required]),0);
    }
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();

    if ((abbvName.split(' ').length-1) !== 0) {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors({ whiteSpaceNotAllowed: { abbvName } });
    }
  }
}

