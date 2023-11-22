import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CounterpartyRequest } from '../../../../../../common/model/counterpartyRequest';
import { CurrencyConverterPipe } from './../../../../lc/initiation/pipes/currency-converter.pipe';
import { FccBusinessConstantsService } from '../../../../../../common/core/fcc-business-constants.service';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CorporateDetails } from '../../../../../../common/model/corporateDetails';
import { CounterpartyDetailsList } from '../../../../../../common/model/counterpartyDetailsList';
import { CountryList } from '../../../../../../common/model/countryList';
import { Entities } from '../../../../../../common/model/entities';
import { CommonService } from '../../../../../../common/services/common.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { LcTemplateService } from '../../../../../../common/services/lc-template.service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { SessionValidateService } from '../../../../../../common/services/session-validate-service';
import { CustomCommasInCurrenciesPipe } from '../../../../lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../lc/initiation/services/filelist.service';
import { SiProductComponent } from '../si-product/si-product.component';
import { FCCFormGroup } from './../../../../../../base/model/fcc-control.model';
import { AmendCommonService } from './../../../../../../corporate/common/services/amend-common.service';
import { CorporateCommonService } from './../../../../../../corporate/common/services/common.service';
import { LeftSectionService } from './../../../../../../corporate/common/services/leftSection.service';
import { LcConstant } from './../../../../../../corporate/trade/lc/common/model/constant';
import { ProductStateService } from './../../../../../../corporate/trade/lc/common/services/product-state.service';
import { ImportLetterOfCreditResponse } from './../../../../../../corporate/trade/lc/initiation/model/models';
import { FormControlService } from './../../../../../../corporate/trade/lc/initiation/services/form-control.service';
import { LcReturnService } from './../../../../../../corporate/trade/lc/initiation/services/lc-return.service';
import { UtilityService } from './../../../../../../corporate/trade/lc/initiation/services/utility.service';
import { SiProductService } from '../../../services/si-product.service';
import { HOST_COMPONENT } from './../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';


@Component({
  selector: 'app-si-applicant-beneficiary-details',
  templateUrl: './si-applicant-beneficiary-details.component.html',
  styleUrls: ['./si-applicant-beneficiary-details.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: SiApplicantBeneficiaryDetailsComponent }]
})
export class SiApplicantBeneficiaryDetailsComponent extends SiProductComponent implements OnInit, OnDestroy {

  marginallSide = 'margin-all-side';
  lcConstant = new LcConstant();
  form: FCCFormGroup;
  appBenNameRegex;
  swiftXChar;
  module = `${this.translateService.instant(FccGlobalConstant.SI_APPLICANT_BENEFICIARY)}`;
  contextPath: any;
  appBenAddressRegex;
  appBenNameLength;
  appBenFullAddrLength: any;
  beneLengthWithoutEntity = FccGlobalConstant.LENGTH_200;
  address1TradeLength;
  address2TradeLength;
  domTradeLength;
  address4TradeLength;
  mode;
  params = this.lcConstant.params;
  maxlength = this.lcConstant.maximumlength;
  rendered = this.lcConstant.rendered;
  disableDropDown = false;
  length35 = FccGlobalConstant.LENGTH_35;
  entities = [];
  beneficiaries = [];
  updatedBeneficiaries = [];
  country = [];
  beneficiaryCountry = [];
  entity: Entities;
  countryList: CountryList;
  counterpartyDetailsList: CounterpartyDetailsList;
  corporateDetails: CorporateDetails;
  readonly = this.lcConstant.readonly;
  lcMode: string;
  autoDisplayFirst = this.lcConstant.autoDisplayFirst;
  lcResponseForm = new ImportLetterOfCreditResponse();
  responseStatusCode = 200;
  tnxTypeCode: any;
  option;
  applicantFullAddressValue: any;
  licenseData: any;
  sessionCols: any;
  licenseValue: any;
  private readonly VALUE = 'value';
  address = 'Address';
  addressLine1 = 'line1';
  addressLine2 = 'line2';
  addressLine3 = 'line3';
  addressLine4 = 'line4';
  modeIS;
  isMasterRequired: any;
  syBeneAdd: any;
  beneAbbvName: any;
  beneAbbvNameRegex;
  beneEditToggleVisible = false;
  benePreviousValue: any;
  abbvNameList = [];
  entityAddressType: any;
  entityNameList = [];
  subTnxTypeCode: any;
  saveTogglePreviousValue: any;
  beneAbbvPreviousValue: any;
  appNamelength;

  constructor(
    protected commonService: CommonService,
    protected translateService: TranslateService,
    protected router: Router,
    protected leftSectionService: LeftSectionService,
    protected lcReturnService: LcReturnService,
    protected corporateCommonService: CorporateCommonService,
    protected sessionValidation: SessionValidateService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected lcTemplateService: LcTemplateService,
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected stateService: ProductStateService,
    protected emitterService: EventEmitterService,
    protected multiBankService: MultiBankService,
    protected dropdownAPIService: DropDownAPIService,
    protected dialogService: DialogService,
    protected amendCommonService: AmendCommonService,
    protected confirmationService: ConfirmationService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService,
    protected utilityService: UtilityService,
    protected resolverService: ResolverService,
    protected fileArray: FilelistService,
    protected dialogRef: DynamicDialogRef,
    protected taskService: FccTaskService,
    protected currencyConverterPipe: CurrencyConverterPipe, protected siProductService: SiProductService
  ) {
    super(emitterService, stateService, commonService, translateService, confirmationService,
      customCommasInCurrenciesPipe, searchLayoutService, utilityService, resolverService, fileArray,
      dialogRef, currencyConverterPipe, siProductService);
  }

  ngOnInit() {
    this.isMasterRequired = this.isMasterRequired;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.subTnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    window.scroll(0, 0);
    this.initializeFormGroup();
    this.lcMode = localStorage.getItem('lcmode');
    this.modeIS = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    this.mode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value;
    this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    // this.checkBeneSaveAllowed();
    if (this.mode !== null && this.mode !== undefined && this.mode !== '' && (typeof this.mode === 'object')) {
      this.mode = this.stateService.getSectionData(FccGlobalConstant.SI_GENERAL_DETAILS).get('transmissionMode').value[0].value;
    }
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.appBenNameRegex = response.BeneficiaryNameRegex;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.beneAbbvNameRegex = response.BeneficiaryAbbvNameRegex;
        this.swiftXChar = response.swiftXCharacterSet;
        this.appBenNameLength = response.nameTradeLength;
        this.appBenFullAddrLength = response.nonSwiftAddrLength;
        this.address1TradeLength = response.address1TradeLength;
        this.address2TradeLength = response.address2TradeLength;
        this.domTradeLength = response.domTradeLength;
        this.address4TradeLength = response.address4TradeLength;
        this.clearingFormValidators([ 'applicantFirstAddress', 'applicantSecondAddress',
        'applicantThirdAddress', FccGlobalConstant.BENEFICIARY_ADDRESS_1,
        FccGlobalConstant.BENEFICIARY_ADDRESS_2, FccGlobalConstant.BENEFICIARY_ADDRESS_3]);
        if (this.mode === FccBusinessConstantsService.SWIFT) {

          this.appBenFullAddrLength = FccGlobalConstant.LENGTH_140;
          this.address1TradeLength = FccGlobalConstant.LENGTH_35;
          this.address2TradeLength = FccGlobalConstant.LENGTH_35;
          this.domTradeLength = FccGlobalConstant.LENGTH_35;
          this.appNamelength = FccGlobalConstant.LENGTH_35;
          this.form.addFCCValidators('applicantName', Validators.pattern(this.appBenAddressRegex), 0 );
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
          'applicantFullAddress',
          Validators.pattern(this.swiftXChar),
          0
          );
          this.form.addFCCValidators(
          'beneficiaryFirstAddress',
          Validators.pattern(this.swiftXChar),
          0
          );
          this.form.addFCCValidators(
          'beneficiarySecondAddress',
          Validators.pattern(this.swiftXChar),
          0
          );
          this.form.addFCCValidators(
          'beneficiaryThirdAddress',
          Validators.pattern(this.swiftXChar),
          0
          );
          this.form.addFCCValidators(
          'beneficiaryFullAddress',
          Validators.pattern(this.appBenAddressRegex),
          0
          );
          this.form.get('beneficiaryFullAddress').updateValueAndValidity();
          this.form.get('beneficiaryThirdAddress').updateValueAndValidity();
          this.form.get('beneficiarySecondAddress').updateValueAndValidity();
          this.form.get('beneficiaryFirstAddress').updateValueAndValidity();
          this.form.get('applicantFullAddress').updateValueAndValidity();
          this.form.get('applicantSecondAddress').updateValueAndValidity();
          this.form.get('applicantFirstAddress').updateValueAndValidity();
          this.form.get('applicantName').updateValueAndValidity();
        }
        this.form.addFCCValidators( 'applicantName', Validators.maxLength(this.appNamelength), 0 );
        this.form.addFCCValidators( 'applicantFirstAddress', Validators.maxLength(this.address1TradeLength), 0 );
        this.form.addFCCValidators( 'applicantSecondAddress', Validators.maxLength(this.address1TradeLength), 0 );
        this.form.addFCCValidators( 'applicantThirdAddress', Validators.maxLength(this.domTradeLength), 0 );
        this.form.addFCCValidators(
          'applicantFullAddress',
          Validators.maxLength(this.appBenFullAddrLength),
          0
        );

        this.form.addFCCValidators(
          'beneficiaryFirstAddress',
          Validators.maxLength(this.address1TradeLength),
          0
        );
        this.form.addFCCValidators(
          'beneficiarySecondAddress',
          Validators.maxLength(this.address1TradeLength),
          0
        );
        this.form.addFCCValidators(
          'beneficiaryThirdAddress',
          Validators.maxLength(this.domTradeLength),
          0
        );

        this.form.get('applicantName')[this.params][this.maxlength] = this.multiBankService.getIsEntity()
        ? this.appNamelength : this.beneLengthWithoutEntity;
        this.form.get('applicantFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
        this.form.get('applicantSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
        this.form.get('applicantThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
        this.form.get('applicantFullAddress')[this.params][this.maxlength] = this.appBenFullAddrLength;

        if (this.form.get('altApplicantFirstAddress')) {
          this.form.get('altApplicantFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
        }
        if (this.form.get('altApplicantSecondAddress')) {
          this.form.get('altApplicantSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
        }
        if (this.form.get('altApplicantThirdAddress')) {
          this.form.get('altApplicantThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
        }
        if (this.form.get('altApplicantFullAddress')) {
          this.form.get('altApplicantFullAddress')[this.params][this.maxlength] = this.appBenFullAddrLength;
        }
        this.form.get('beneficiaryFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
        this.form.get('beneficiarySecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
        this.form.get('beneficiaryThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
        this.form.addFCCValidators( 'beneficiaryFullAddress', Validators.maxLength(this.appBenFullAddrLength), 0 );

        if (this.mode !== FccBusinessConstantsService.SWIFT) {
          this.form.get('applicantFourthAddress')[this.params][this.maxlength] = this.address4TradeLength;
          this.form.get('beneficiaryFourthAddress')[this.params][this.maxlength] = this.address4TradeLength;
          this.form.get('applicantFourthAddress').updateValueAndValidity();
          this.form.get('beneficiaryFourthAddress').updateValueAndValidity();
          this.form.addFCCValidators(
            'applicantFourthAddress',
            Validators.maxLength(this.appBenNameLength),
            0
          );
          this.form.addFCCValidators( 'applicantName', Validators.maxLength(this.appBenNameLength), 0 );
          this.form.get('applicantName')[this.params][this.maxlength] = this.appBenNameLength;
          this.form.get('applicantName').clearValidators();
        }
        this.form.get('applicantFourthAddress').updateValueAndValidity();
        this.form.get('beneficiaryFullAddress').updateValueAndValidity();
        this.form.get('beneficiaryThirdAddress').updateValueAndValidity();
        this.form.get('beneficiarySecondAddress').updateValueAndValidity();
        this.form.get('beneficiaryFirstAddress').updateValueAndValidity();
        this.form.get('applicantFullAddress').updateValueAndValidity();
        this.form.get('applicantSecondAddress').updateValueAndValidity();
        this.form.get('applicantFirstAddress').updateValueAndValidity();
        this.form.get('applicantName').updateValueAndValidity();
      }
    });

    if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
      this.handleAddressFields();
    }

    if (this.context === 'readonly') {
      this.readOnlyMode();
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendFormFields();
      this.commonService.formatForm(this.form);
    }
    this.patchLayoutForReadOnlyMode();
    if (this.commonService.getClearBackToBackLCfields() === 'yes') {
      const fields = ['applicantFirstAddress', 'applicantSecondAddress', 'applicantThirdAddress'];
      fields.forEach(ele => {
        this.form.get(ele).setValue('');
        this.form.get(ele).updateValueAndValidity();
      });
    }
    // added back to back check as initiate form is failing. Expecting a conditional check
    if (this.commonService.getClearBackToBackLCfields() === 'yes') {
      const fields = ['beneficiaryFirstAddress', 'beneficiarySecondAddress', 'beneficiaryThirdAddress'];
      fields.forEach(ele => {
        this.form.get(ele).setValue('');
        this.form.get(ele).updateValueAndValidity();
      });
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
    if (this.modeIS === FccGlobalConstant.DRAFT_OPTION) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
    }
  }

  clearingFormValidators(fields: any) {
    for (let i = 0; i < fields.length; i++) {
      this.form.get(fields[i]).clearValidators();
      this.form.get(fields[i]).updateValueAndValidity();
    }
  }


  readOnlyMode() {
    this.lcReturnService.allLcRecords.subscribe(data => {
      this.lcResponseForm = data;
      this.patchFieldValueAndParameters(this.form.get('applicantName'), this.lcResponseForm.applicant.entityName,
      { readonly: true });
      this.patchFieldValueAndParameters(this.form.get('applicantFirstAddress'), this.lcResponseForm.applicant.address.line1,
      { readonly: true });
      this.patchFieldValueAndParameters(this.form.get('applicantSecondAddress'), this.lcResponseForm.applicant.address.line2,
      { readonly: true });
      this.patchFieldValueAndParameters(this.form.get('applicantThirdAddress'), this.lcResponseForm.applicant.address.line3,
      { readonly: true });
      this.patchFieldValueAndParameters(this.form.get('applicantFullAddress'), this.lcResponseForm.applicant.address.line1,
      { readonly: true });

      this.patchFieldValueAndParameters(this.form.get('beneficiaryFirstAddress'), this.lcResponseForm.beneficiary.address.line1,
      { readonly: true });
      this.patchFieldValueAndParameters(this.form.get('beneficiarySecondAddress'), this.lcResponseForm.beneficiary.address.line2,
      { readonly: true });
      this.patchFieldValueAndParameters(this.form.get('beneficiaryThirdAddress'), this.lcResponseForm.beneficiary.address.line3,
      { readonly: true });
      this.patchFieldValueAndParameters(this.form.get('beneficiaryFullAddress'), this.lcResponseForm.beneficiary.address.line1,
      { readonly: true });
      if (this.mode !== FccBusinessConstantsService.SWIFT) {
        this.patchFieldValueAndParameters(this.form.get('applicantFourthAddress'), this.lcResponseForm.applicant.address.line4,
        { readonly: true });
        this.patchFieldValueAndParameters(this.form.get('beneficiaryFourthAddress'), this.lcResponseForm.beneficiary.address.line4,
        { readonly: true });
      }
      this.UpdateEntityBeni();
      this.updateCountry();
    });
    this.form.get('previous')[this.params][this.rendered] = false;
    this.form.get('next')[this.params][this.rendered] = false;
    this.form.setFormMode('view');
  }

  patchLayoutForReadOnlyMode() {
    if ( this.form.getFormMode() === 'view') {

      const controls = Object.keys(this.form.controls);
      let index: any;
      for (index = 0; index < controls.length; index++) {
        this.viewModeChange(this.form, controls[index]);
      }
    }
  }

  ngOnDestroy() {
    this.stateService.setStateSection(FccGlobalConstant.SI_APPLICANT_BENEFICIARY, this.form, this.isMasterRequired);
    if (this.form.get(FccGlobalConstant.SAVE_BENEFICIARY) !== null) {
      const togglevalue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
      if (togglevalue !== undefined && togglevalue === FccBusinessConstantsService.YES &&
        !this.form.get(FccGlobalConstant.BENE_ABBV_NAME).hasError('duplicateCounterpartyAbbvName')) {
          if (this.modeIS === FccGlobalConstant.DRAFT_OPTION && this.subTnxTypeCode === undefined){
            this.commonService.saveBeneficiary(this.getCounterPartyObjectForAmend(this.form)).subscribe();
          }else{
            this.commonService.saveBeneficiary(this.getCounterPartyObject(this.form)).subscribe();
          }
      }
      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.form.get('beneficiaryEntity').setErrors(null);
        this.form.get('beneficiaryEntity').clearValidators();
      }
    }
  }

  onFocusApplicantSecondAddress() {
    const checknull = this.form.get('applicantFirstAddress').value;
    if (checknull === null || (checknull !== null && checknull.length === 0 ) ) {
      this.form.get('applicantFirstAddress').setValue('');
      this.form.controls.applicantFirstAddress.markAsDirty();
    }
  }

  onFocusApplicantThirdAddress() {
    this.setMandatoryField(this.form, 'applicantSecondAddress', true);
    const checkFirstnull = this.form.get('applicantFirstAddress').value;
    const checkSecondnull = this.form.get('applicantSecondAddress').value;
    if (checkFirstnull === null || (checkFirstnull !== null && checkFirstnull.length === 0 )) {
      this.form.get('applicantFirstAddress').setValue('');
      this.form.controls.applicantFirstAddress.markAsDirty();
    }
    if (checkSecondnull === null || (checkSecondnull !== null && checkSecondnull.length === 0 )) {
      this.form.get('applicantSecondAddress').setValue('');
      this.form.controls.applicantSecondAddress.markAsDirty();
    }
    this.removeMandatory(['applicantSecondAddress']);
  }

  onBlurApplicantThirdAddress() {
    this.handleThirdAddressField('applicantSecondAddress', 'applicantThirdAddress');
  }

  onBlurBeneficiaryThirdAddress() {
    this.handleThirdAddressField('beneficiarySecondAddress', 'beneficiaryThirdAddress');
  }

  handleThirdAddressField(secondAddr: any, thirdAddr: any) {
    const checknull = this.form.get(thirdAddr).value;
    if (checknull === null || (checknull !== null && checknull.length === 0 )) {
      this.setMandatoryField(this.form, secondAddr, false);
    }
  }

  onFocusBeneficiarySecondAddress() {
    const checknull = this.form.get('beneficiaryFirstAddress').value;
    if (checknull === null || (checknull !== null && checknull.length === 0 )) {
      this.form.get('beneficiaryFirstAddress').setValue('');
      this.form.controls.beneficiaryFirstAddress.markAsDirty();
    }
  }

  onFocusBeneficiaryThirdAddress() {
    this.setMandatoryField(this.form, 'beneficiarySecondAddress', true);
    const checkFirstnull = this.form.get('beneficiaryFirstAddress').value;
    const checkSecondnull = this.form.get('beneficiarySecondAddress').value;
    if (checkFirstnull === null || (checkFirstnull !== null && checkFirstnull.length === 0 )) {
      this.form.get('beneficiaryFirstAddress').setValue('');
      this.form.controls.beneficiaryFirstAddress.markAsDirty();
    }
    if (checkSecondnull === null || (checkSecondnull !== null && checkSecondnull.length === 0 )) {
      this.form.get('beneficiarySecondAddress').setValue('');
      this.form.controls.beneficiarySecondAddress.markAsDirty();
    }
    this.removeMandatory(['beneficiarySecondAddress']);
  }

  getUserEntities() {
    this.updateUserEntities();
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.handleBeneficiaryData();
    }
  }

  getBeneficiaries() {
    this.corporateCommonService.getCounterparties(
      this.fccGlobalConstantService.getStaticDataLimit(), this.fccGlobalConstantService.counterparties)
    .subscribe(response => {
      if (response.status === this.responseStatusCode) {
        this.getBeneficiariesAsList(response.body);
      }
      this.getUserEntities();
      this.UpdateEntityBeni();
      if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
        this.handleBeneficiaryData();
      }
      this.updateBeneSaveToggleDisplay();
    });
  }

  getCountryDetail() {
      this.commonService.getCountries().subscribe(data => {
        this.updateCountries(data);
      });
   }

   onClickBeneficiaryEntity(event) {
    if (event.value) {
      this.form
      .get('beneficiaryEntity')
      .setValue(event.value);
      this.form
        .get('beneficiaryFirstAddress')
        .setValue(event.value.swiftAddressLine1);
      this.form
        .get('beneficiarySecondAddress')
        .setValue(event.value.swiftAddressLine2);
      this.form
        .get('beneficiaryThirdAddress')
        .setValue(event.value.swiftAddressLine3);
      this.form
        .get('beneficiaryFourthAddress')
        .setValue(event.value.swiftAddressLine4);
      if (!event.value.country){
        this.form.get(FccGlobalConstant.BENEFICIARY_COUNTRY).setValue(null);
      } else {
        const exist = this.beneficiaryCountry.filter(task => task.value.shortName === event.value.country);
        if (exist !== null && exist.length > 0) {
          this.form.get(FccGlobalConstant.BENEFICIARY_COUNTRY).setValue(this.beneficiaryCountry.filter(
            task => task.value.shortName === event.value.country)[0].value);
        } else if (!this.form.get(FccGlobalConstant.BENEFICIARY_COUNTRY).value) {
          this.patchFieldValueAndParameters(
            this.form.get(FccGlobalConstant.BENEFICIARY_COUNTRY), { label: event.value.country, shortName: event.value.country }, {});
        }
      }
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
      if (typeof(this.form.get('beneficiaryEntity').value) === 'object') {
        beneEntity = this.form.get('beneficiaryEntity')[FccGlobalConstant.VALUE][FccGlobalConstant.NAME];
      } else {
        beneEntity = this.form.get('beneficiaryEntity')[FccGlobalConstant.VALUE];
      }

      if (this.option === FccGlobalConstant.TEMPLATE) {
        this.form.setErrors(null);
        this.form.clearValidators();
        this.form.updateValueAndValidity();
      }

        if (beneEntity && beneEntity !== null && beneEntity !== '') {
          const beneNameReg = new RegExp(this.swiftXChar);
          if (beneNameReg.test(beneEntity) === false) {
            this.form.addFCCValidators('beneficiaryEntity', Validators.compose([Validators.pattern(this.swiftXChar)]), 0);
            this.form.get('beneficiaryEntity').updateValueAndValidity();
          } else {
            this.form.get('beneficiaryEntity').updateValueAndValidity();
          }
        }
    }


  addAmendLabel() {
    this.addAmendLabelOnBeneficiary(this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_1));
    this.addAmendLabelOnBeneficiary(this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_2));
    this.addAmendLabelOnBeneficiary(this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_3));
    this.addAmendLabelOnBeneficiary(this.form.get(FccGlobalConstant.BENEFICIARY_ADDRESS_4));
    this.addAmendLabelOnBeneficiary(this.form.get(FccGlobalConstant.BENEFICIARY_COUNTRY));
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

   onKeyupBeneficiaryEntity(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty) {
      this.onClickBeneficiaryEntityForAccessibility(this.form.get('beneficiaryEntity').value);
    }
  }

  onClickBeneficiaryEntityForAccessibility(value) {
    if (value) {
      this.form
        .get('beneficiaryFirstAddress')
        .setValue(value.swiftAddressLine1);
      this.form
        .get('beneficiarySecondAddress')
        .setValue(value.swiftAddressLine2);
      this.form
        .get('beneficiaryThirdAddress')
        .setValue(value.swiftAddressLine3);
      this.form
        .get('beneficiaryFourthAddress')
        .setValue(value.swiftAddressLine4);
      this.patchFieldValueAndParameters(
        this.form.get('beneficiarycountry'), { label: value.country, shortName: value.country }, {});
    }
     }

  onClickApplicantEntity() {
    const entity = this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value;
    if(this.modeIS === FccGlobalConstant.INITIATE){
      this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS).controls['siIssuingBank']
      .get('issuerReferenceList').setValue('');
      }
    if (entity) {
      this.multiBankService.setCurrentEntity(entity.shortName);
      this.multiBankService.clearIssueRef();
      this.taskService.setTaskEntity(entity);
      this.patchFieldValueAndParameters(this.form.get('applicantName'), entity.name, {});
      this.entities.forEach(value => {
        if (entity.shortName === value.value.shortName) {
          const address = this.multiBankService.getAddress(value.value.shortName);
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1),
            address[this.address][this.addressLine1], {});
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2),
            address[this.address][this.addressLine2], {});
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3),
            address[this.address][this.addressLine3], {});
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_4),
            address[this.address][this.addressLine4], {});
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
  onClickApplicantEntityForAccessibility(values) {
    if(this.modeIS === FccGlobalConstant.INITIATE){
      this.stateService.getSectionData(FccGlobalConstant.SI_BANK_DETAILS).controls['siIssuingBank'].get('issuerReferenceList').setValue('');
      }
    if (values) {
      this.multiBankService.setCurrentEntity(values.shortName);
      this.patchFieldValueAndParameters(this.form.get('applicantName'), values.name, {});
      this.entities.forEach(value => {
        if (value.value.shortName === values.shortName) {
          const address = this.multiBankService.getAddress(value.value.shortName);
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1),
            address[this.address][this.addressLine1], {});
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2),
            address[this.address][this.addressLine2], {});
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3),
            address[this.address][this.addressLine3], {});
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_4),
            address[this.address][this.addressLine4], {});
        }
      });
      this.setBeneficiaryNull();
      this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: this.updateBeneficiaries() });
      this.form.get('beneficiaryEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
      FccGlobalConstant.APPLICANT_BENE_STYLE_CLASS;

      if (this.updatedBeneficiaries.length === 1) {
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { readonly: true });
        this.form.get('beneficiaryEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
        FccGlobalConstant.SINGLE_BENE_STYLE_CLASS;
        this.onClickBeneficiaryEntity(this.updatedBeneficiaries[0]);
      } else {
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { readonly: false });
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { autoDisplayFirst: false });
        this.form.get('beneficiaryEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
        FccGlobalConstant.APPLICANT_BENE_STYLE_CLASS;

      }
    }
  }

  onKeyupApplicantEntity(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === this.lcConstant.thirtyEight || keycodeIs === this.lcConstant.forty) {
      this.onClickApplicantEntityForAccessibility(this.form.get('applicantEntity').value);
    }
  }

  onClickBeneficiaryName(event) {
    if (this.lcMode === FccBusinessConstantsService.SWIFT) {
    this.form
      .get('beneficiaryFirstAddress')
      .setValue(event.value.swiftAddressLine1);
    this.form
      .get('beneficiarySecondAddress')
      .setValue(event.value.swiftAddressLine2);
    this.form
      .get('beneficiaryThirdAddress')
      .setValue(event.value.swiftAddressLine3);
    this.form.get('beneficiarycountry').setValue({ label: event.value.country, shortName: event.value.country });
    } else if (this.lcMode === FccBusinessConstantsService.COURIER || this.lcMode === FccBusinessConstantsService.TELEX) {
      this.form.get('beneficiarycountry').setValue({ label: event.value.country, shortName: event.value.country });
      this.form.get('beneficiaryFullAddress').setValue(event.value.swiftAddressLine1 + ' ' + event.value.swiftAddressLine2 + ' '
      + event.value.swiftAddressLine3);
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

    this.updateCountry();

  }
  beneficiaryInputValValidation() {
    let beneEntity;
    if (typeof(this.form.get('beneficiaryEntity').value) === 'object') {
      beneEntity = this.form.get('beneficiaryEntity')[FccGlobalConstant.VALUE][FccGlobalConstant.NAME];
    }
    else {
      beneEntity = this.form.get('beneficiaryEntity')[FccGlobalConstant.VALUE];
    }
    this.form.get('beneficiaryEntity').setErrors(null);
    this.form.get('beneficiaryEntity').updateValueAndValidity();
    const beneNameReg = new RegExp(this.swiftXChar);
    if (this.mode === FccBusinessConstantsService.SWIFT) {
      if ((!beneNameReg.test(beneEntity)) && this.commonService.isnonEMptyString(beneEntity)) {
        this.form.get('beneficiaryEntity')
          .setErrors({ pattern: { field: this.form.get('beneficiaryEntity')[this.params][FccGlobalConstant.LABEL] } });
        this.form.addFCCValidators('beneficiaryEntity',
          Validators.compose([Validators.required, Validators.pattern(this.swiftXChar)]), 0);
        this.form.get('beneficiaryEntity').updateValueAndValidity();
      }
    }
   else if (this.mode !== FccBusinessConstantsService.SWIFT && this.option !== FccGlobalConstant.TEMPLATE)
   {
    this.form.addFCCValidators('beneficiaryEntity', Validators.compose([Validators.required]), 0);
    this.form.get('beneficiaryEntity').updateValueAndValidity();
   }
  }


  updateCountry() {
    if (this.lcResponseForm.alternateApplicant !== undefined && this.context === 'readonly') {
      this.form.get('beneficiarycountry').setValue( this.beneficiaryCountry.filter(
        task => task.value.label === this.lcResponseForm.beneficiary.country)[0].value);
      this.patchFieldParameters(this.form.get('beneficiarycountry') , { readonly: true });
    }
    if (this.form.get('beneficiarycountry') && this.form.get('beneficiarycountry').value
        && this.context !== 'readonly') {
        const beneficiarycountry = this.stateService.
        getValue(FccGlobalConstant.SI_APPLICANT_BENEFICIARY, 'beneficiarycountry', this.isMasterRequired);
        const beneficiarycountryLabel = this.country.filter( task => task.value.label === beneficiarycountry);
        const beneficiarycountryName = this.country.filter( task => task.value.name === beneficiarycountry);
        if (beneficiarycountryLabel !== undefined && beneficiarycountryLabel !== null && beneficiarycountryLabel.length > 0) {
          this.form.get('beneficiarycountry').setValue(beneficiarycountryLabel[0].value);
        } else if (beneficiarycountryName !== undefined && beneficiarycountryName !== null && beneficiarycountryName.length > 0) {
          this.form.get('beneficiarycountry').setValue(beneficiarycountryName[0].value);
        }
    }
  }

  updateUserEntities() {
    this.multiBankService.getEntityList().forEach(entity => {
      this.entities.push(entity);
    });
    this.form.get('beneficiaryEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
    FccGlobalConstant.APPLICANT_BENE_STYLE_CLASS;
    const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.entities, 'applicantEntity', this.form);
    if (valObj && valObj[this.VALUE] !== undefined && !this.taskService.getTaskEntity()) {
      this.form.get('applicantEntity').patchValue(valObj[this.VALUE]);
      this.multiBankService.setCurrentEntity(valObj[this.VALUE].shortName);
    } else if (this.taskService.getTaskEntity()){
      this.form.get('applicantEntity').patchValue(this.taskService.getTaskEntity());
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
        this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)){
        this.form.get('applicantName').setValue(this.taskService.getTaskEntity().name);
      }
    }

    if (this.entities.length === 0) {
      this.form.get('applicantName')[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      this.form.get('applicantFirstAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      if (this.form.get('applicantSecondAddress')) {
          this.form.get('applicantSecondAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      }
      if (this.form.get('applicantThirdAddress')) {
          this.form.get('applicantThirdAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      }
      if (this.form.get('applicantEntity')) {
        this.form.get('applicantEntity')[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, 'applicantEntity', false);
        this.form.get('applicantEntity').clearValidators();
        this.form.get('applicantEntity').updateValueAndValidity();
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
                  if(this.commonService.decodeHtml(response.body[this.entityAddressType].line1) !== "undefined"){
                  this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2)
                  .setValue(this.commonService.decodeHtml(response.body[this.entityAddressType].line2));
                  }
                  else{
                    this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).setValue(response.body[this.entityAddressType].line2);
                  }
                }
                if (!this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3).value) {
                  if(this.commonService.decodeHtml(response.body[this.entityAddressType].line1) !== "undefined"){
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
      this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: this.updateBeneficiaries() });

    } else if (this.entities.length === 1) {
      this.form.get('applicantEntity')[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get('applicantEntity')[this.params][FccGlobalConstant.RENDERED] = true;
      this.form.get('applicantEntity').setValue({ label: this.entities[0].value.label, name: this.entities[0].value.name,
         shortName: this.entities[0].value.shortName });
      this.form.get('applicantEntity')[this.params][this.readonly] = true;
      this.multiBankService.setCurrentEntity(this.entities[0].value.shortName);
      if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_NAME, this.form) &&
        this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_NAME).value)){
        this.form.get('applicantName').setValue(this.entities[0].value.name);
      }
      this.form.get('applicantName')[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('applicantFirstAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      if (this.form.get('applicantSecondAddress')) {
          this.form.get('applicantSecondAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      }
      if (this.form.get('applicantThirdAddress')) {
          this.form.get('applicantThirdAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      }
      this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: this.updateBeneficiaries() });

      if (this.updatedBeneficiaries.length === 1 && !this.benePreviousValue && !this.form.get('beneficiaryEntity').value) {
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { autoDisplayFirst : true });
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { readonly: true });
        this.form.get('beneficiaryEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
        FccGlobalConstant.SINGLE_BENE_STYLE_CLASS;
        // this.onClickBeneficiaryEntity(this.updatedBeneficiaries[0]);
        this.form.get('beneficiaryEntity').updateValueAndValidity();
      } else {
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { readonly: false });
        this.patchFieldParameters(this.form.get('beneficiaryEntity'), { autoDisplayFirst : false });
        this.form.get('beneficiaryEntity')[FccGlobalConstant.PARAMS][FccGlobalConstant.STYLECLASS] =
        FccGlobalConstant.APPLICANT_BENE_STYLE_CLASS;
        this.form.get('beneficiaryEntity').updateValueAndValidity();
      }
      const address = this.multiBankService.getAddress(this.entities[0].value.shortName);
      if (address && address[this.address] && address[this.address][this.addressLine1] &&
        address[this.address][this.addressLine1] !== null) {
        if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_ADDRESS_1, this.form) &&
          this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1).value)){
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_1),
          address[this.address][this.addressLine1], {});
        }
      }
      if (address && address[this.address] && address[this.address][this.addressLine2] &&
        address[this.address][this.addressLine2] !== null) {
        if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_ADDRESS_2, this.form) &&
          this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2).value)){
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_2),
          address[this.address][this.addressLine2], {});
        }
      }
      if (address && address[this.address] && address[this.address][this.addressLine3] &&
        address[this.address][this.addressLine3] !== null) {
        if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_ADDRESS_3, this.form) &&
          this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3).value)){
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_3),
          address[this.address][this.addressLine3], {});
        }
      }
      if (address && address[this.address] && address[this.address][this.addressLine4] &&
        address[this.address][this.addressLine4] !== null) {
        if (this.commonService.isNonEmptyField(FccGlobalConstant.APPLICANT_ADDRESS_4, this.form) &&
          this.commonService.isEmptyValue(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_4).value)){
          this.patchFieldValueAndParameters(this.form.get(FccGlobalConstant.APPLICANT_ADDRESS_4),
          address[this.address][this.addressLine4], {});
        }
      }
    } else if (this.entities.length > 1) {
      this.form.get('applicantEntity')[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get('applicantEntity')[this.params][FccGlobalConstant.RENDERED] = true;
      this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: [] });
      this.form.get('applicantName')[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      this.form.get('applicantFirstAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      if (this.form.get('applicantSecondAddress')) {
          this.form.get('applicantSecondAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_RIGHTWRAPPER;
      }
      if (this.form.get('applicantThirdAddress')) {
          this.form.get('applicantThirdAddress')[this.params].layoutClass = FccGlobalConstant.LAYOUT_LEFTWRAPPER;
      }
    }
    this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: this.updateBeneficiaries() });
    this.UpdateEntityBeni();
    this.removeMandatory(['applicantEntity']);
    this.updateBeneSaveToggleDisplay();
  }

  updateBeneSaveToggleDisplay(){
    if (this.benePreviousValue !== undefined &&
      (this.modeIS === FccGlobalConstant.DRAFT_OPTION && this.subTnxTypeCode === undefined)){
      this.checkBeneSaveAllowedForAmend(this.benePreviousValue.name);
      if (this.saveTogglePreviousValue === FccBusinessConstantsService.YES && this.beneAbbvPreviousValue){
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = true;
      }
    }
    const beneAbbvNameValue = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
    if (beneAbbvNameValue !== null && beneAbbvNameValue !== FccGlobalConstant.EMPTY_STRING){
      if (!(this.entityNameList.includes(this.benePreviousValue.name ? this.benePreviousValue.name : this.benePreviousValue))){
        this.onBlurBeneAbbvName();
      } else {
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = true;
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = true;
        this.clearBeneAbbvValidator();
        this.commonService.beneAbbvNameDisabled('beneAbbvName');
      }
    }
  }

  UpdateEntityBeni() {
    if (this.lcResponseForm.applicant && this.lcResponseForm.applicant.entityShortName !== undefined && this.context === 'readonly') {
      this.form.get('applicantEntity').setValue( this.entities.filter(
      task => task.label === this.lcResponseForm.applicant.entityShortName)[0].value);
      this.patchFieldParameters(this.form.get('applicantEntity'), { readonly: true });
      this.form.get('beneficiaryEntity').setValue( this.updatedBeneficiaries.filter(
        task => task.value.label === this.lcResponseForm.beneficiary.name)[0].value);
      this.patchFieldParameters(this.form.get('beneficiaryEntity'), { readonly: true });
    }
    // if (this.form.get(FccGlobalConstant.APPLICANT_ENTITY) && this.form.get(FccGlobalConstant.APPLICANT_ENTITY).value
    // && this.context !== 'readonly') {
    //   const applicantEntity = this.stateService.getValue(FccGlobalConstant.SI_APPLICANT_BENEFICIARY,
    //       FccGlobalConstant.APPLICANT_ENTITY, false);
    //   if (applicantEntity ) {
    //     const exist = this.entities.filter( task => task.value.label === applicantEntity);
    //     if (exist.length > 0) {
    //     this.form.get(FccGlobalConstant.APPLICANT_ENTITY).setValue( this.entities.filter(
    //       task => task.value.label === applicantEntity)[0].value);
    //     }
    //   }
    // }
    if (this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY) && this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value
        && this.context !== 'readonly') {
      const beneficiaryEntity = this.stateService.getValue(FccGlobalConstant.SI_APPLICANT_BENEFICIARY, 'beneficiaryEntity', false);
      if (beneficiaryEntity ) {
        const beneficiaryNameLabel = this.updatedBeneficiaries.filter( task => task.value.label === beneficiaryEntity);
        const beneficiaryName = this.updatedBeneficiaries.filter( task => task.value.name === beneficiaryEntity);
        if (beneficiaryNameLabel !== undefined && beneficiaryNameLabel !== null && beneficiaryNameLabel.length > 0) {
          this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).setValue(beneficiaryNameLabel[0].value);
        } else if (beneficiaryName !== undefined && beneficiaryName !== null && beneficiaryName.length > 0) {
          this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).setValue(beneficiaryName[0].value);
        }
      }
    }

    else if (this.benePreviousValue !== undefined && this.benePreviousValue !== null) {
      this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).setValue(this.benePreviousValue);
    }
    // validate beneficaryEntity once value is set
    this.beneficiaryInputValValidation();
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
          country: value.country,
          entity: decodeURI(value.entityShortName),
          shortName: this.commonService.decodeHtml(value.shortName),
          name: this.commonService.decodeHtml(value.name)
        }
      };
      this.abbvNameList.push(this.commonService.decodeHtml(value.shortName));
      this.entityNameList.push(this.commonService.decodeHtml(value.name));
      this.beneficiaries.push(beneficiary);
      this.updatedBeneficiaries.push(beneficiary);
    });
    if (this.operation === FccGlobalConstant.PREVIEW && this.modeIS === FccGlobalConstant.VIEW_MODE) {
      if (this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value !== FccGlobalConstant.EMPTY_STRING &&
      typeof(this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value) === 'object') {
        const adhocBene: { label: string; value: any } = {
          label: this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value.label,
          value: {
            label: this.form.get(FccGlobalConstant.BENEFICIARY_ENTITY).value.label,
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
      } else {
        this.form.get('beneficiaryEntity').patchValue(this.form.get('beneficiaryEntity').value);
        this.form.get('beneficiaryEntity').clearValidators();
        this.form.get('beneficiaryEntity').setErrors(null);
        this.form.get('beneficiaryEntity').updateValueAndValidity();
      }
    }
  }

  updateBeneficiaries(): any[] {
    this.updatedBeneficiaries = [];
    if (!this.form.get('applicantEntity')[this.params][this.rendered]) {
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
    if (this.form.get('applicantEntity').value.shortName !== undefined && this.form.get('applicantEntity').value.shortName !== '') {
      this.beneficiaries.forEach(value => {
        if (this.form.get('applicantEntity').value.shortName === value.value.entity || value.value.entity === '&#x2a;') {
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

  handleAddressFields() {
    this.form.get('applicantFirstAddress')[this.params][this.rendered] = true;
    this.setMandatoryField(this.form, 'applicantFirstAddress', true);
    if (this.mode === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators('applicantFirstAddress', Validators.pattern(this.swiftXChar), 0);
      this.form.addFCCValidators('applicantSecondAddress', Validators.pattern(this.swiftXChar), 0);
      this.form.addFCCValidators('applicantThirdAddress', Validators.pattern(this.swiftXChar), 0);
    }
    this.form.addFCCValidators('applicantFirstAddress', Validators.compose([Validators.maxLength(this.address1TradeLength)]), 0);

    this.form.get('applicantSecondAddress')[this.params][this.rendered ] = true;
    this.form.addFCCValidators('applicantSecondAddress', Validators.compose([Validators.maxLength(this.address2TradeLength)]), 0);

    this.form.get('applicantThirdAddress')[this.params][this.rendered] = true;
    this.form.addFCCValidators('applicantThirdAddress', Validators.compose([Validators.maxLength(this.domTradeLength)]), 0);
    this.form.get('applicantFourthAddress')[this.params][this.rendered] = false;
    this.form.get('applicantFullAddress').clearValidators();
    this.form.get('applicantFullAddress').updateValueAndValidity();

    this.form.get('applicantFullAddress')[this.params][this.rendered] = false;
    this.setMandatoryField(this.form, 'applicantFullAddress', false);
    this.form.get('applicantFullAddress').clearValidators();
    this.form.get('applicantFullAddress').updateValueAndValidity();

    this.form.get('beneficiaryFirstAddress')[this.params][this.rendered] = true;
    this.form.get('beneficiaryFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
    this.form.addFCCValidators('beneficiaryFirstAddress', Validators.compose([Validators.maxLength(this.address1TradeLength)]), 0);
    this.setMandatoryField(this.form, 'beneficiaryFirstAddress', true);

    this.form.get('beneficiarySecondAddress')[this.params][this.rendered] = true;
    this.form.get('beneficiarySecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
    this.form.addFCCValidators('beneficiarySecondAddress', Validators.compose([Validators.maxLength(this.address2TradeLength)]), 0);

    this.form.get('beneficiaryThirdAddress')[this.params][this.rendered] = true;
    this.form.get('beneficiaryThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
    this.form.addFCCValidators('beneficiaryThirdAddress', Validators.compose([Validators.maxLength(this.domTradeLength)]), 0);
    if (this.mode === FccBusinessConstantsService.SWIFT) {
      this.form.addFCCValidators('beneficiaryFirstAddress', Validators.pattern(this.swiftXChar), 0);
      this.form.addFCCValidators('beneficiarySecondAddress', Validators.pattern(this.swiftXChar), 0);
      this.form.addFCCValidators('beneficiaryThirdAddress', Validators.pattern(this.swiftXChar), 0);
    }

    this.form.get('beneficiaryFourthAddress')[this.params][this.rendered] = false;
    this.form.get('beneficiaryFourthAddress').clearValidators();
    this.form.get('beneficiaryFourthAddress').updateValueAndValidity();

    this.form.get('beneficiaryFullAddress')[this.params][this.rendered] = false;
    this.setMandatoryField(this.form, 'beneficiaryFullAddress', false);
    this.form.get('beneficiaryFullAddress').clearValidators();
    this.form.get('beneficiaryFullAddress').updateValueAndValidity();
    this.removeMandatory(['applicantFirstAddress', 'beneficiaryFirstAddress']);

    if (this.mode !== FccBusinessConstantsService.SWIFT) {
      this.form.get('applicantFourthAddress')[this.params][this.rendered] = true;
      this.form.get('beneficiaryFourthAddress')[this.params][this.rendered] = true;
      this.form.get('applicantFourthAddress')[this.params][this.maxlength] = this.address4TradeLength;
      this.form.get('beneficiaryFourthAddress')[this.params][this.maxlength] = this.address4TradeLength;
      this.form.get('applicantFirstAddress')[this.params][this.maxlength] = this.address1TradeLength;
      this.form.get('applicantSecondAddress')[this.params][this.maxlength] = this.address2TradeLength;
      this.form.get('applicantThirdAddress')[this.params][this.maxlength] = this.domTradeLength;
      this.form.get('applicantFirstAddress').clearValidators();
      this.form.get('applicantSecondAddress').clearValidators();
      this.form.get('applicantThirdAddress').clearValidators();
      this.form.get('applicantFourthAddress').clearValidators();
    }
    this.form.updateValueAndValidity();
  }

  amendFormFields() {
    if (this.commonService.checkPendingClientBankViewForAmendTnx()) {
    const addressDelimiter = ', ';
    this.handleAmendApplicant(addressDelimiter);

    // const beneficiaryFullAddress = this.handleBeneficiaryForAmendment(addressDelimiter);
    this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.SI_APPLICANT_BENEFICIARY);
    this.patchFieldParameters(this.form.get('applicantFullAddress'), { previousValue: this.applicantFullAddressValue });
    // this.patchFieldParameters(this.form.get('beneficiaryFullAddress'), {previousValue: beneficiaryFullAddress});
  }
  }

  protected handleBeneficiaryForAmendment(addressDelimiter: string) {
    if (this.form.get('beneficiaryEntity')) {
      this.form.get('beneficiaryEntity')[this.params][this.rendered] = true;
    }
    let beneficiaryFourthAddressValue = '';
    if (this.commonService.isNonEmptyField('beneficiaryFirstAddress', this.form) && this.form.get('beneficiaryFirstAddress')) {
      this.form.get('beneficiaryFirstAddress')[this.params][this.rendered] = false;
      this.form.get('beneficiaryFirstAddress').clearValidators();
    }
    if (this.commonService.isNonEmptyField('beneficiarySecondAddress', this.form)) {
      this.form.get('beneficiarySecondAddress')[this.params][this.rendered] = false;
      this.form.get('beneficiarySecondAddress').clearValidators();
    }
    if (this.form.get('beneficiaryThirdAddress') !== undefined && this.form.get('beneficiaryThirdAddress') !== null) {
      this.form.get('beneficiaryThirdAddress')[this.params][this.rendered] = false;
      this.form.get('beneficiaryThirdAddress').clearValidators();
      this.setMandatoryFields(this.form, ['beneficiaryThirdAddress'], false);
    }
    if (this.form.get('beneficiaryFourthAddress') !== undefined && this.form.get('beneficiaryFourthAddress') !== null) {
      this.form.get('beneficiaryFourthAddress')[this.params][this.rendered] = false;
      this.form.get('beneficiaryFourthAddress').clearValidators();
      this.setMandatoryFields(this.form, ['beneficiaryFourthAddress'], false);
    }
    this.form.get('beneficiarycountry')[this.params][this.rendered] = false;
    this.form.get('beneficiaryFirstAddress').clearValidators();
    this.form.get('beneficiarycountry').clearValidators();
    this.setMandatoryFields(this.form, ['beneficiaryFirstAddress', 'beneficiarySecondAddress', 'beneficiarycountry'], false);
    this.form.get('beneficiaryFullAddress')[this.params][this.rendered] = true;
    const beneficiaryFirstAddressValue = this.stateService.getValue(FccGlobalConstant.SI_APPLICANT_BENEFICIARY,
      'beneficiaryFirstAddress', false);
    const beneficiarySecondAddressValue = this.stateService.getValue(FccGlobalConstant.SI_APPLICANT_BENEFICIARY,
      'beneficiarySecondAddress', false);
    let beneficiaryThirdAddressValue = '';
    if (this.form.get('beneficiaryThirdAddress') !== undefined && this.form.get('beneficiaryThirdAddress') !== null) {
      beneficiaryThirdAddressValue = this.stateService.getValue(FccGlobalConstant.SI_APPLICANT_BENEFICIARY,
        'beneficiaryThirdAddress', false);
    }
    const beneficiaryCountryValue = this.stateService.getValue(FccGlobalConstant.SI_APPLICANT_BENEFICIARY,
      'beneficiarycountry', false);
    let beneficiaryFullAddress = beneficiaryFirstAddressValue;
    if (beneficiarySecondAddressValue !== undefined && beneficiarySecondAddressValue !== null && beneficiarySecondAddressValue !== ' ') {
      beneficiaryFullAddress = beneficiaryFullAddress.concat(addressDelimiter).concat(beneficiarySecondAddressValue);
    }
    if (beneficiaryThirdAddressValue !== undefined && beneficiaryThirdAddressValue !== null &&
      beneficiaryThirdAddressValue !== ' ' && beneficiaryThirdAddressValue !== '') {
      beneficiaryFullAddress = beneficiaryFullAddress.concat(addressDelimiter).concat(beneficiaryThirdAddressValue);
    }
    if (this.mode !== FccBusinessConstantsService.SWIFT && this.form.get('beneficiaryFourthAddress') !== undefined &&
      this.form.get('beneficiaryFourthAddress') !== null) {
      beneficiaryFourthAddressValue = this.stateService.getValue(FccGlobalConstant.SI_APPLICANT_BENEFICIARY,
        'beneficiaryFourthAddress', false);
      if (beneficiaryFourthAddressValue !== undefined && beneficiaryFourthAddressValue !== null && beneficiaryFourthAddressValue !== ' ') {
        beneficiaryFullAddress = beneficiaryFullAddress.concat(addressDelimiter).concat(beneficiaryFourthAddressValue);
      }
    }
    if (beneficiaryCountryValue !== undefined && beneficiaryCountryValue !== null && beneficiaryCountryValue !== ' ') {
      beneficiaryFullAddress = beneficiaryFullAddress.concat(addressDelimiter).concat(beneficiaryCountryValue);
    }
    this.patchFieldValueAndParameters(this.form.get('beneficiaryFullAddress'), beneficiaryFullAddress,
      { readonly: true });
    this.patchFieldParameters(this.form.get('beneficiaryFullAddress'), { previousValue: beneficiaryFullAddress });
    this.updateValuesAndValidities();
    return beneficiaryFullAddress;
  }

  updateValuesAndValidities() {
    if (this.form.get('beneficiaryEntity')) {
      this.form.get('beneficiaryEntity').updateValueAndValidity();
    }
    if (this.form.get('beneficiaryFirstAddress')) {
      this.form.get('beneficiaryFirstAddress').updateValueAndValidity();
    }
    if (this.form.get('beneficiarySecondAddress')) {
      this.form.get('beneficiarySecondAddress').updateValueAndValidity();
    }
    if (this.form.get('beneficiaryThirdAddress')) {
      this.form.get('beneficiaryThirdAddress').updateValueAndValidity();
    }
    if (this.form.get('beneficiaryFourthAddress')) {
      this.form.get('beneficiaryFourthAddress').updateValueAndValidity();
    }
    if (this.form.get('beneficiaryFullAddress')) {
      this.form.get('beneficiaryFullAddress').updateValueAndValidity();
    }
  }

  protected handleAmendApplicant(addressDelimiter: string) {
    this.handleBeneficiaryData();
    let applicantFourthAddressValue = '';
    if (this.form.get('applicantEntity')) {
      this.form.get('applicantEntity')[this.params][this.rendered] = true;
    }
    this.form.get('applicantName')[this.params][this.rendered] = true;
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
    const applicantFirstAddressValue = this.stateService.getValue(FccGlobalConstant.SI_APPLICANT_BENEFICIARY,
      'applicantFirstAddress', false);
    const applicantSecondAddressValue = this.stateService.getValue(FccGlobalConstant.SI_APPLICANT_BENEFICIARY,
      'applicantSecondAddress', false);
    const applicantThirdAddresssValue = this.stateService.getValue(FccGlobalConstant.SI_APPLICANT_BENEFICIARY,
      'applicantThirdAddress', false);
    this.applicantFullAddressValue = applicantFirstAddressValue;
    if (applicantSecondAddressValue !== undefined && applicantSecondAddressValue !== null && applicantSecondAddressValue !== ' ') {
      this.applicantFullAddressValue = this.applicantFullAddressValue.concat(addressDelimiter).concat(applicantSecondAddressValue);
    }
    if (applicantThirdAddresssValue !== undefined && applicantThirdAddresssValue !== null && applicantThirdAddresssValue !== ' ') {
      this.applicantFullAddressValue = this.applicantFullAddressValue.concat(addressDelimiter).concat(applicantThirdAddresssValue);
    }
    if (this.mode !== FccBusinessConstantsService.SWIFT) {
      applicantFourthAddressValue = this.stateService.getValue(FccGlobalConstant.SI_APPLICANT_BENEFICIARY, 'applicantFourthAddress', false);
      if (applicantFourthAddressValue !== undefined && applicantFourthAddressValue !== null && applicantFourthAddressValue !== ' ') {
        this.applicantFullAddressValue = this.applicantFullAddressValue.concat(addressDelimiter).concat(applicantFourthAddressValue);
      }
    }
    this.patchFieldValueAndParameters(this.form.get('applicantFullAddress'), this.applicantFullAddressValue,
      { readonly: true });
    this.patchFieldParameters(this.form.get('applicantFullAddress'), { previousValue: this.applicantFullAddressValue });
    this.form.get('applicantName').updateValueAndValidity();
    this.form.get('applicantFirstAddress').updateValueAndValidity();
    this.form.get('applicantSecondAddress').updateValueAndValidity();
    this.form.get('applicantThirdAddress').updateValueAndValidity();
    if (this.form.get('applicantThirdAddress') !== undefined && this.form.get('applicantThirdAddress') !== null) {
      this.form.get('applicantThirdAddress').updateValueAndValidity();
    }
    if (this.form.get('applicantFourthAddress') !== undefined && this.form.get('applicantFourthAddress') !== null) {
      this.form.get('applicantFourthAddress').updateValueAndValidity();
    }
    this.form.get('applicantFullAddress').updateValueAndValidity();
  }

  handleBeneficiaryData() {
    let applicantEntity = this.commonService.isNonEmptyField('applicantEntity', this.form) ?
    this.form.get('applicantEntity').value : this.form.get('applicantEntity');
    if (typeof applicantEntity === 'object') {
      applicantEntity = applicantEntity.label;
    }
    const applicantEntityLabel = this.entities.filter( task => task.value.label === applicantEntity);
    if (applicantEntityLabel !== undefined && applicantEntityLabel !== null && applicantEntityLabel.length > 0) {
         this.form.get('applicantEntity').setValue(applicantEntityLabel[0].value.shortName);
    }
    // let beneficiaryEntity = this.commonService.isNonEmptyField('beneficiaryEntity', this.form) ?
    // this.form.get('beneficiaryEntity').value : this.form.get('beneficiaryEntity');
    // if (typeof beneficiaryEntity === 'object') {
    //   beneficiaryEntity = beneficiaryEntity.label ? beneficiaryEntity.label : FccGlobalConstant.EMPTY_STRING;
    // }
    // const beneficiaryEntityLabel = this.beneficiaries.filter( task => task.value.label === beneficiaryEntity);
    // if (beneficiaryEntityLabel !== undefined && beneficiaryEntityLabel !== null && beneficiaryEntityLabel.length > 0) {
    //      this.form.get('beneficiaryEntity').setValue(beneficiaryEntityLabel[0].value.name);
    // }
    // let beneficiaryCountry = this.commonService.isNonEmptyField('beneficiarycountry', this.form) ?
    // this.form.get('beneficiarycountry').value : this.form.get('beneficiarycountry');
    // if (typeof beneficiaryCountry === 'object') {
    //   beneficiaryCountry = beneficiaryCountry.label ? beneficiaryCountry.label : FccGlobalConstant.EMPTY_STRING;
    //   this.form.get('beneficiarycountry').setValue(beneficiaryCountry);
    // }
    if (this.form.get('beneficiaryFourthAddress') !== undefined && this.form.get('beneficiaryFourthAddress') !== null) {
      this.form.get('beneficiaryFourthAddress')[this.params][this.rendered] = false;
      this.form.get('beneficiaryFourthAddress').clearValidators();
      this.setMandatoryFields(this.form, ['beneficiaryFourthAddress'], false);
      this.form.get('beneficiaryFourthAddress').updateValueAndValidity();
    }
    this.form.get('beneficiaryFullAddress')[this.params][this.rendered] = false;
  }

  initializeFormGroup() {
      const sectionName = FccGlobalConstant.SI_APPLICANT_BENEFICIARY;
      this.form = this.stateService.getSectionData(sectionName, undefined, this.isMasterRequired);
      this.getBeneficiaries();
      this.getCountryDetail();
      if (this.tnxTypeCode !== FccGlobalConstant.N002_AMEND) {
        this.patchFieldParameters(this.form.get('applicantEntity'), { options: this.entities });
      }
      //this.patchFieldParameters(this.form.get('beneficiaryEntity'), { options: this.beneficiaries });
      this.patchFieldParameters(this.form.get('beneficiarycountry'), { options: this.beneficiaryCountry });
  }

  removeMandatory(fields: any) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      this.setMandatoryFields(this.form, fields, false);
    }
  }

  // method to check if adhoc beneficiary save can be performed for amend
  checkBeneSaveAllowedForAmend(beneAmendValue: any) {
    this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
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
    this.syBeneAdd = this.commonService.getUserPermissionFlag(FccGlobalConstant.SY_POPUP_BENE_ADD);
    this.beneEditToggleVisible = toggleValue;
    if (this.syBeneAdd && this.beneEditToggleVisible){
    this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = true;
    this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][FccGlobalConstant.DISABLED] = false;
    this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).setValue(FccBusinessConstantsService.NO);
    this.onClickBeneficiarySaveToggle();
    this.beneficiaryInputValValidation();
    } else {
      if (!this.syBeneAdd || !this.beneEditToggleVisible){
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY)[this.params][this.rendered] = false;
        this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).setValue(FccBusinessConstantsService.NO);
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
        this.clearBeneAbbvValidator();
        if (this.modeIS !== FccGlobalConstant.INITIATE
          && this.modeIS !== FccGlobalConstant.DRAFT_OPTION) {
          this.clearBeneEntityValidator();
        }
      }
    }
  }

  clearBeneEntityValidator()
  {
    this.form.get('beneficiaryEntity').clearValidators();
    this.form.get('beneficiaryEntity').updateValueAndValidity();
  }

  // clear bene abbv validator
  clearBeneAbbvValidator()
  {
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).clearValidators();
    this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
  }

  // Display bene abbv name after turning on bene save toggle
  onClickBeneficiarySaveToggle() {
    this.beneAbbvName = FccGlobalConstant.BENE_ABBV_NAME;
    const togglevalue = this.form.get(FccGlobalConstant.SAVE_BENEFICIARY).value;
    if (togglevalue === FccBusinessConstantsService.NO) {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = false;
      this.setMandatoryField(this.form, FccGlobalConstant.BENE_ABBV_NAME, false);
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setValue(FccGlobalConstant.EMPTY_STRING);
      this.clearBeneAbbvValidator();
    }
    else {
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.rendered] = true;
      this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME, Validators.required, 1);
      //For abbv name validation swiftChar validation is not applicable in case transmission mode is swift
      this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
      Validators.compose([Validators.required, Validators.pattern(this.beneAbbvNameRegex)]), 0);
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][FccGlobalConstant.REQUIRED] = true;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly] = false;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();
    }
    if (this.mode === FccBusinessConstantsService.SWIFT) {
      this.beneficiaryInputValValidation();
    }
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

    // validation on change of beneAbbvName field
    onBlurBeneAbbvName() {
      const abbvName = this.form.get(FccGlobalConstant.BENE_ABBV_NAME).value;
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors(null);
      if (this.abbvNameList.indexOf(abbvName) > -1 && !this.form.get(FccGlobalConstant.BENE_ABBV_NAME)[this.params][this.readonly]) {
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors({ duplicateCounterpartyAbbvName: { abbvName } });
      }
      this.form.addFCCValidators(FccGlobalConstant.BENE_ABBV_NAME,
      Validators.compose([Validators.required, Validators.pattern(this.beneAbbvNameRegex)]), 0);
      this.form.get(FccGlobalConstant.BENE_ABBV_NAME).updateValueAndValidity();

      if ((abbvName.split(' ').length-1) !== 0) {
        this.form.get(FccGlobalConstant.BENE_ABBV_NAME).setErrors({ whiteSpaceNotAllowed: { abbvName } });
      }
    }
}


