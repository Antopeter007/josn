import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, SelectItem } from 'primeng';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { tap } from 'rxjs/operators';
import { FccBusinessConstantsService } from '../../../../common/core/fcc-business-constants.service';
import { CodeData } from '../../../../common/model/codeData';
import { CountryList } from '../../../../common/model/countryList';
import { CurrencyRequest } from '../../../../common/model/currency-request';
import { CodeDataService } from '../../../../common/services/code-data.service';
import { DashboardService } from '../../../../common/services/dashboard.service';
import { DropDownAPIService } from '../../../../common/services/dropdownAPI.service';
import { FccTaskService } from '../../../../common/services/fcc-task.service';
import { MultiBankService } from '../../../../common/services/multi-bank.service';
import { ConfirmationDialogComponent } from '../../../trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { SystemFeatureCommonDataService } from '../../services/system-feature-common-data.service';
import { BeneficiaryProductService } from '../services/beneficiary-product.service';
import { FCCFormGroup } from './../../../../../app/base/model/fcc-control.model';
import { FccGlobalConstantService } from './../../../../../app/common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../../../app/common/core/fcc-global-constants';
import { CommonService } from './../../../../../app/common/services/common.service';
import { FileHandlingService } from './../../../../../app/common/services/file-handling.service';
import { HideShowDeleteWidgetsService } from './../../../../../app/common/services/hide-show-delete-widgets.service';
import { SessionValidateService } from './../../../../../app/common/services/session-validate-service';
import { FccConstants } from './../../../../common/core/fcc-constants';
import { EventEmitterService } from './../../../../common/services/event-emitter-service';
import { FormModelService } from './../../../../common/services/form-model.service';
import { ResolverService } from './../../../../common/services/resolver.service';
import { SearchLayoutService } from './../../../../common/services/search-layout.service';
import { HOST_COMPONENT } from './../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LeftSectionService } from './../../../common/services/leftSection.service';
import { ProductStateService } from './../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from './../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from './../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from './../../../trade/lc/initiation/services/filelist.service';
import { FormControlService } from './../../../trade/lc/initiation/services/form-control.service';
import { UtilityService } from './../../../trade/lc/initiation/services/utility.service';
import { BeneficiaryProductComponent } from './../beneficiary-product/beneficiary-product.component';
import { BeneConstants } from './beneficiary-general-details.constants';

@Component({
  selector: 'app-beneficiary-general-detail',
  templateUrl: './beneficiary-general-detail.component.html',
  styleUrls: ['./beneficiary-general-detail.component.scss'],
  providers: [
    DialogService,
    { provide: HOST_COMPONENT, useExisting: BeneficiaryGeneralDetailComponent },
  ],
})
export class BeneficiaryGeneralDetailComponent
  extends BeneficiaryProductComponent
  implements OnInit
{
  contextPath: string;
  tnxTypeCode: any;
  operation: any;
  option: any;
  mode: any;
  action: any;
  entities = [];
  entityId: string;
  flag = false;
  entityDataArray = [];
  dependentFields: any;
  iBANAccoutNumberRegex: any;
  dependentFieldForProduct: any;
  duplicateBeneNameValidation: boolean;
  duplicateBeneAccValidation: boolean;
  isIBANAccountNumberValidationEnabled: boolean;
  beneValidationAccNoRegex: any;
  beneIdValidationRegex: any;
  beneIBANIncludedProducts = [];
  beneAddValidationRegex: any;
  currentProductypeValue = [];
  currency = [];
  fetching = true;
  form: FCCFormGroup;
  module = `${this.translateService.instant('beneficiaryGeneralDetail')}`;
  showSpinner: boolean;
  isIntermediaryBank: boolean;
  appBenNameRegex;
  appBenAddressRegex;
  swiftXChar;
  appBenNameLength;
  appBenFullAddrLength: any;
  curRequest: CurrencyRequest = new CurrencyRequest();
  productCode: any;
  subProductCode: any;
  codeData = new CodeData();
  eventDataArray = [];
  codeID: any;
  language: any;
  defaultAccount: SelectItem[] = [];
  activeAccountsList: SelectItem[] = [];
  accountsList: SelectItem[] = [];
  cur = [];
  list: any;
  finalList: any;
  accountColumnList: any;
  accountTableList: any;
  beneficiaryCountry = [];
  countryList: CountryList;
  country = [];
  bankResponse: any;
  swifCodeRegex: any;
  currentProductype: any;
  filterParams: any;
  controlName: any;
  arr = [];
  interMediaryBankFields = [];
  isInterMediaryBankDetailsRequired: any;
  productObj: { label: string; value: any };
  dir = localStorage.getItem('langDir');
  editRecordIndex;
  addressLine = [];
  beneAccNoBeforeUpdate: any;
  fieldValueChanged = false;
  entityVal: any;
  productType: any;

  constructor(
    protected commonService: CommonService,
    protected sessionValidation: SessionValidateService,
    protected translateService: TranslateService,
    protected router: Router,
    protected leftSectionService: LeftSectionService,
    public dialogService: DialogService,
    public uploadFile: FilelistService,
    public deleteFile: CommonService,
    public downloadFile: CommonService,
    protected dialog: MatDialog,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    public autoUploadFile: CommonService,
    protected fileListSvc: FilelistService,
    protected formModelService: FormModelService,
    protected multiBankService: MultiBankService,
    protected formControlService: FormControlService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected eventEmitterService: EventEmitterService,
    protected stateService: ProductStateService,
    protected fileHandlingService: FileHandlingService,
    protected confirmationService: ConfirmationService,
    protected dropdownAPIService: DropDownAPIService,
    protected taskService: FccTaskService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService,
    protected utilityService: UtilityService,
    protected resolverService: ResolverService,
    protected dashboardService: DashboardService,
    protected dialogRef: DynamicDialogRef,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected codeDataService: CodeDataService,
    protected beneficiaryProductService: BeneficiaryProductService,
    protected systemFeatureCommonDataService: SystemFeatureCommonDataService
  ) {
    super(
      eventEmitterService,
      stateService,
      commonService,
      translateService,
      confirmationService,
      customCommasInCurrenciesPipe,
      searchLayoutService,
      utilityService,
      resolverService,
      fileListSvc,
      dialogRef,
      currencyConverterPipe,
      beneficiaryProductService
    );
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.showSpinner = true;
    this.finalList = [];
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.TNX_TYPE_CODE
    );
    this.option = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.OPTION
    );
    this.mode = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.MODE
    );
    this.operation = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.OPERATION
    );
    this.action = this.commonService.getQueryParametersFromKey(FccGlobalConstant.ACTION);
    this.initializeFormGroup();
    this.commonService.loadDefaultConfiguration().subscribe((response) => {
      if (response) {
        this.appBenNameRegex = response.BeneficiaryNameRegex;
        this.appBenAddressRegex = response.BeneficiaryAddressRegex;
        this.appBenNameLength = response.BeneficiaryNameLength;
        this.duplicateBeneNameValidation = response.duplicateBeneNameValidation;
        this.duplicateBeneAccValidation = response.duplicateBeneAccValidation;
        this.beneValidationAccNoRegex = response.beneValidationAccNoRegex;
        this.beneIdValidationRegex = response.beneNameValidationRegex;
        this.beneAddValidationRegex = response.beneAddValidationRegex;
        this.beneIBANIncludedProducts = response.beneIBANIncludedProducts;
        this.swifCodeRegex = response.bigSwiftCode;
        this.isIBANAccountNumberValidationEnabled =
          response.isIBANAccountNumberValidationEnabled;
      }
    });
    this.form.addFCCValidators(
      'beneficiaryCounterpartyName',
      Validators.pattern(this.appBenNameRegex),
      0
    );
    this.form.addFCCValidators(
      'beneficiaryCounterpartyName',
      Validators.maxLength(this.appBenNameLength),
      0
    );
    this.form.addFCCValidators(
      'beneficiaryAddressLine1',
      Validators.pattern(this.appBenAddressRegex),
      0
    );
    this.form.addFCCValidators(
      'beneficiaryAddressLine2',
      Validators.pattern(this.appBenAddressRegex),
      0
    );
    this.form.addFCCValidators(
      'beneficiaryAccountNo',
      Validators.pattern(this.beneValidationAccNoRegex),
      0
    );
    this.form.addFCCValidators(
      'beneficiaryAccountNo',
      Validators.pattern(this.beneValidationAccNoRegex),
      0
    );
    this.form.get('beneficiaryId')[FccGlobalConstant.PARAMS][FccGlobalConstant.MAXLENGTH] = FccGlobalConstant.beneIdMaxlength;
    this.form.addFCCValidators(
      'beneficiaryPhone',
      Validators.pattern('^[0-9]+$'),
      0
    );
    this.form.addFCCValidators(
      'beneficiaryPostalCode',
      Validators.pattern('^[0-9]+$'),
      0
    );
    this.form.addFCCValidators(
      'benePostalCode',
      Validators.pattern('^[0-9]+$'),
      0
    );
    this.form.addFCCValidators(
      'beneficiaryEmail1',
      Validators.compose([
        Validators.pattern(FccGlobalConstant.EMAIL_VALIDATION),
      ]),
      0
    );
    this.form.addFCCValidators(
      'beneficiaryEmail2',
      Validators.compose([
        Validators.pattern(FccGlobalConstant.EMAIL_VALIDATION),
      ]),
      0
    );
    this.form.addFCCValidators(
      'beneficiaryFax',
      Validators.pattern('^[\\d() +-]+$'),
      0
    );
    this.form.get('beneficiaryThresholdAmt').setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
    this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.hasActions
    ] = true;
    if (this.action && this.action === FccGlobalConstant.UPDATE) {
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][
        FccGlobalConstant.DISABLED
      ] = true;
      this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE)[this.params][
        FccGlobalConstant.DISABLED
      ] = true;
    }
  }

  onBlurBeneficiaryCounterpartyName() {
    const beneName = this.form.get('beneficiaryCounterpartyName').value;
    if (
      this.commonService.isnonEMptyString(beneName) &&
      this.duplicateBeneNameValidation
    ) {
      this.commonService
        .getDuplicateBeneDetails(beneName.toString(), '')
        .subscribe((response) => {
          if (response && response.isBeneNameExists) {
            this.form
              .get('beneficiaryCounterpartyName')
              .setErrors({ BeneficiaryNameExists: true });
          }
        });
    }
  }

  onKeyupBeneficiaryBankSwiftCodeIcons(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === FccGlobalConstant.LENGTH_13) {
    this.onClickBeneficiaryBankSwiftCodeIcons();
    }
  }

  onKeyupInterMediaryBankIfscCodeIcons(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === FccGlobalConstant.LENGTH_13) {
    this.onClickInterMediaryBankIfscCodeIcons();
    }
  }

  onBlurBeneficiaryAccountNo() {
    const accountNo = this.form.get('beneficiaryAccountNo').value;
    if (
      this.commonService.isnonEMptyString(accountNo) &&
      this.duplicateBeneAccValidation
    ) {
      this.commonService
        .getDuplicateBeneDetails('', accountNo.toString())
        .subscribe((resp) => {
          if (resp && resp.isBeneAccountNoExists) {
            this.form
              .get('beneficiaryAccountNo')
              .setErrors({ DuplicateAccountNumber: true });
          } else if (
            this.accountsList &&
            this.accountsList.length > 0 &&
            this.beneAccNoBeforeUpdate !== accountNo
          ) {
            this.accountsList.forEach((account) => {
              if (account.label === accountNo) {
                this.form
                  .get('beneficiaryAccountNo')
                  .setErrors({ DuplicateAccountNumber: true });
              }
            });
          }
        });
    }
  }

  onBlurBeneficiaryThresholdAmt() {
    const val = this.form.get('beneficiaryThresholdAmt').value;
    let valueupdated;
    if (this.form.get('beneficiaryThresholdCurCode').value && val) {
      const iso = this.form.get('beneficiaryThresholdCurCode').value.currencyCode;
      valueupdated = this.commonService.replaceCurrency(val);
      valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), iso);
      this.form.get('beneficiaryThresholdAmt').setValue(valueupdated);
    }
    if (val && val.length > FccGlobalConstant.LENGTH_15) {
      this.form.get('beneficiaryThresholdAmt').setErrors({ amountLengthGreaterThanMaxLength : true });
    } else {
      this.form.get('beneficiaryThresholdAmt').setErrors(null);
    }
  }

  onAdditionOfAccount(accountNo, isActive) {
    const account: { label: string; value: any } = {
      label: accountNo,
      value: {
        label: accountNo,
      },
    };
    if (this.accountsList && !this.accountsList.some((acct) => acct.label === account.label)) {
      this.accountsList.push(account);
  }
    if (isActive === FccGlobalConstant.CODE_Y) {
      if (this.activeAccountsList &&
        !this.activeAccountsList.some((activeAcct) => activeAcct.label === account.label)) {
        this.activeAccountsList.push(account);
    }
      this.disableDefaultAccount();
    }
  }

  updateActiveAccounts() {
    const accountNo = this.form.get('beneficiaryAccountNo').value;
    const isActive = this.form.get('accountActiveFlag').value;
    const account: { label: string; value: any } = {
      label: accountNo,
      value: {
        label: accountNo,
      },
    };
    if (
      isActive === FccGlobalConstant.CODE_Y &&
      this.activeAccountsList.filter((item) => item.label === account.label)
        .length === FccGlobalConstant.LENGTH_0
    ) {
      this.activeAccountsList.push(account);
    } else if (
      isActive === FccGlobalConstant.CODE_N &&
      this.activeAccountsList.filter((item) => item.label === account.label)
        .length === FccGlobalConstant.LENGTH_1
    ) {
      this.activeAccountsList = this.activeAccountsList.filter(
        (item) => item.label !== account.label
      );
    }
    this.disableDefaultAccount();
  }

  disableDefaultAccount() {
    this.patchFieldParameters(this.form.get('defaultAccount'), {
      options: this.activeAccountsList,
    });
    if (this.activeAccountsList && this.activeAccountsList.length > 0) {
      this.patchFieldValueAndParameters(
        this.form.get('defaultAccount'),
        this.activeAccountsList[0].value,
        {}
      );
    }
    if (this.activeAccountsList.length > 1) {
      this.form.get('defaultAccount')[FccGlobalConstant.PARAMS][
        FccGlobalConstant.DISABLED
      ] = false;
    }
    if (this.activeAccountsList.length === 1) {
      this.form.get('defaultAccount')[FccGlobalConstant.PARAMS][
        FccGlobalConstant.DISABLED
      ] = true;
    }
    if (this.activeAccountsList.length === 0) {
      this.form.get('defaultAccount')[FccGlobalConstant.PARAMS][
        FccGlobalConstant.DISABLED
      ] = false;
      this.resetValue(this.form, 'defaultAccount', null);
    }
  }

  onClickBeneficiaryThresholdCurCode() {
    this.patchFieldParameters(this.form.get('beneficiaryThresholdCurCode'), {
      options: this.currency,
    });
  }

  toTitleCase(value) {
    return value.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  updateCurrencyDetails() {
    this.currency = [];
    this.commonService.userCurrencies(this.curRequest).subscribe((response) => {
      if (
        response.errorMessage &&
        response.errorMessage === 'SESSION_INVALID'
      ) {
        this.sessionValidation.IsSessionValid();
      } else {
        response.items.forEach((value) => {
          const ccy: { label: string; value: any } = {
            label: value.isoCode,
            value: {
              label: value.isoCode,
              iso: `${value.isoCode} - ${this.toTitleCase(value.name)}`,
              country: value.principalCountryCode,
              currencyCode: value.isoCode,
              shortName: value.isoCode,
              name: value.name,
            },
          };
          this.currency.push(ccy);
        });
      }
      if (this.commonService.isnonEMptyString(this.form.get('beneficiaryAccountCurCode').value)) {
        const valObj = this.dropdownAPIService.getDropDownFilterValueObj(this.currency, 'beneficiaryAccountCurCode', this.form);
        if (valObj) {
          this.form.get('beneficiaryAccountCurCode').patchValue(valObj[`value`]);
        }
      }
      if (this.commonService.isnonEMptyString(this.form.get('beneficiaryThresholdCurCode').value) && this.currency) {
        const val = this.form.get('beneficiaryThresholdCurCode').value;
        const currencyValue = this.currency.filter(task => task.value.shortName === val.shortName);
        if (currencyValue !== undefined && currencyValue.length > FccGlobalConstant.LENGTH_0) {
          this.patchFieldValueAndParameters(this.form.get('beneficiaryThresholdCurCode'),
          currencyValue[0].value, { options: this.currency });
        }
      }
    });
    if (this.commonService.isEmptyValue(this.form.get('beneficiaryAccountCurCode').value)) {
      this.patchFieldValueAndParameters(
        this.form.get('beneficiaryAccountCurCode'),
        '',
        { options: this.currency }
      );
    }
  }

  onClickBeneficiaryAccountCurCode() {
    this.patchFieldParameters(this.form.get('beneficiaryAccountCurCode'), {
      options: this.currency,
    });
  }

  onClickBeneficiaryCountry() {
    this.patchFieldParameters(this.form.get('beneficiaryCountry'), {
      options: this.beneficiaryCountry,
    });
  }

  onClickBeneCountry() {
    this.patchFieldParameters(this.form.get('beneCountry'), {
      options: this.beneficiaryCountry,
    });
  }

  getUserEntities() {
    this.updateUserEntities();
  }

  async updateUserEntities() {
    this.productCode = FccGlobalConstant.PRODUCT_DEFAULT;
    this.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    if (!this.multiBankService.getEntityList().length) {
      await this.multiBankService.multiBankAPI(
        this.productCode,
        this.subProductCode
      );
    }

    this.multiBankService.getEntityList().forEach((entity) => {
      this.entities.push(entity);
    });
    if (this.entities.length === 0) {
      this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE)[this.params][
        FccGlobalConstant.DISABLED
      ] = false;
    }
    const valObj = this.dropdownAPIService.getDropDownFilterValueObj(
      this.entities,
      FccGlobalConstant.ENTITY_TEXT,
      this.form
    );
    if (valObj && !this.taskService.getTaskEntity()) {
      this.form
        .get(FccGlobalConstant.ENTITY_TEXT)
        .patchValue(valObj[FccGlobalConstant.VALUE]);
      this.multiBankService.setCurrentEntity(
        valObj[FccGlobalConstant.VALUE].name
      );
    } else if (this.taskService.getTaskEntity()) {
      this.form
        .get(FccGlobalConstant.ENTITY_TEXT)
        .patchValue(this.taskService.getTaskEntity());
    }
    if (this.entities.length === 0) {
      if (this.form.get(FccGlobalConstant.ENTITY_TEXT)) {
        this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][
          FccGlobalConstant.RENDERED
        ] = false;
        this.setMandatoryField(this.form, FccGlobalConstant.ENTITY_TEXT, false);
        this.form.get(FccGlobalConstant.ENTITY_TEXT).clearValidators();
        this.form.get(FccGlobalConstant.ENTITY_TEXT).updateValueAndValidity();
      }
    } else if (this.entities.length === 1) {
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][
        FccGlobalConstant.RENDERED
      ] = true;
      this.form.get(FccGlobalConstant.ENTITY_TEXT).setValue({
        label: this.entities[0].value.label,
        name: this.entities[0].value.name,
        shortName: this.entities[0].value.shortName,
      });
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][
        FccGlobalConstant.REQUIRED
      ] = true;
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][
        FccGlobalConstant.READONLY
      ] = true;
      this.multiBankService.setCurrentEntity(this.entities[0].value.name);
      this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE)[this.params][
        FccGlobalConstant.DISABLED
      ] = false;
    } else if (this.entities.length > 1) {
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][
        FccGlobalConstant.REQUIRED
      ] = true;
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][
        FccGlobalConstant.RENDERED
      ] = true;
    }
    if (this.commonService.isNonEmptyField(FccGlobalConstant.ENTITY_TEXT, this.form) &&
      this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.ENTITY_TEXT).value) && this.entities) {
        this.form.get(FccGlobalConstant.ENTITY_TEXT).setValue(this.entities.filter(
          task => task.value.shortName === this.form.get(FccGlobalConstant.ENTITY_TEXT).value.shortName)[0].value);
        this.form.get(FccGlobalConstant.ENTITY_TEXT).updateValueAndValidity();
    }
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ENTITY_TEXT), {
      options: this.entities,
    });
  }

  onClickBeneficiaryBankSwiftCodeIcons() {
    const obj = {};
    this.preapreLookUpObectData(obj);
    const header = `${this.translateService.instant('listOfBanks')}`;
    this.isIntermediaryBank = false;
    this.updateFilterValues(obj, this.isIntermediaryBank);
    this.resolverService.getSearchData(header, obj);
    this.bankResponse =
      this.searchLayoutService.searchLayoutDataSubject.subscribe(
        (swiftBICCodeResponse) => {
          if (swiftBICCodeResponse !== null) {
            this.updateSwiftBiCCodeBankDetails(swiftBICCodeResponse);
          }
        }
      );
  }
  preapreLookUpObectData(obj) {
    const productCode = 'productCode';
    const subProductCode = 'subProductCode';
    const headerDisplay = 'headerDisplay';
    const buttons = 'buttons';
    const savedList = 'savedList';
    const option = 'option';
    const downloadIconEnabled = 'downloadIconEnabled';
    if (this.commonService.isEmptyValue(this.currentProductype) &&
    this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE).value &&
    this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE).value.shortName) {
      this.currentProductype = this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE).value.shortName;
    }
    obj[productCode] = '';
    obj[FccGlobalConstant.DEFAULT_CRITERIA] = true;
    obj[option] = this.getCodeForProduct(this.currentProductype);
    obj[subProductCode] = '';
    obj[buttons] = false;
    obj[savedList] = false;
    obj[headerDisplay] = false;
    obj[downloadIconEnabled] = false;
  }

  updateSwiftBiCCodeBankDetails(swiftBICCodeResponse) {
    let beneCountry = [];
    const commmonProducts = [BeneConstants.PROD_MEPS, BeneConstants.PROD_MT101, BeneConstants.PROD_MT103, BeneConstants.PROD_FT103,
      BeneConstants.PROD_FI103];
    if (this.commonService.isEmptyValue(this.currentProductype)) {
      this.currentProductype = this.form.get(FccConstants.BENEFICIARY_PRODUCT_TYPE).value.shortName;
    }
    if (this.currentProductype === BeneConstants.PROD_RTGS) {
      this.isInterMediaryBankDetailsRequired = swiftBICCodeResponse.responseData.DATA_8;
      this.form.get('beneficiaryBankSwiftCode').patchValue(swiftBICCodeResponse.responseData.KEY_1);
      this.form.get('beneficiaryBankName').patchValue(swiftBICCodeResponse.responseData.DATA_1);
      this.form.get('beneficiaryBankIfscAddressLine1').patchValue(swiftBICCodeResponse.responseData.DATA_3);
      this.form.get('beneficiaryBankIfscAddressLine2').patchValue(swiftBICCodeResponse.responseData.DATA_4);
      this.form.get('beneficiaryBankIfscAddressLine3').patchValue(swiftBICCodeResponse.responseData.DATA_5);
      this.form.get('beneficiaryBankName')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('beneficiaryBankIfscAddressLine1')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('beneficiaryBankIfscAddressLine2')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('beneficiaryBankIfscAddressLine3')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('beneficiaryBankIfscAddressLine1')[this.params][FccGlobalConstant.READONLY] = true;
      this.form.get('beneficiaryBankIfscAddressLine2')[this.params][FccGlobalConstant.READONLY] = true;
      this.form.get('beneficiaryBankIfscAddressLine3')[this.params][FccGlobalConstant.READONLY] = true;
      this.form.get('beneficiaryBankName')[this.params][FccGlobalConstant.READONLY] = true;
      beneCountry = this.beneficiaryCountry.filter(task => task.value.shortName === swiftBICCodeResponse.responseData.DATA_7);
      if (this.commonService.isnonEMptyString(beneCountry) && beneCountry.length > FccGlobalConstant.LENGTH_0) {
        this.patchFieldValueAndParameters(this.form.get('beneficiaryBankCountry'),
          beneCountry[0].value, { disabled: true, options: this.beneficiaryCountry });
      }
    } else if (commmonProducts.includes(this.currentProductype)) {
      this.form.get('beneficiaryBankSwiftCode').patchValue(swiftBICCodeResponse.responseData.BIC);
      this.form.get('beneficiaryBankName').patchValue(swiftBICCodeResponse.responseData.BANK_NAME);
      this.form.get('beneficiaryBankIfscAddressLine1').patchValue(swiftBICCodeResponse.responseData.ADDRESS);
      this.form.get('beneficiaryBankIfscAddressLine2').patchValue(swiftBICCodeResponse.responseData.POSTCODE);
      this.form.get('beneficiaryBankIfscAddressLine3').patchValue(swiftBICCodeResponse.responseData.CITY);
      this.form.get('beneficiaryBankName')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('beneficiaryBankIfscAddressLine1')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('beneficiaryBankIfscAddressLine2')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('beneficiaryBankIfscAddressLine3')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('beneficiaryBankIfscAddressLine1')[this.params][FccGlobalConstant.READONLY] = true;
      this.form.get('beneficiaryBankIfscAddressLine2')[this.params][FccGlobalConstant.READONLY] = true;
      this.form.get('beneficiaryBankIfscAddressLine3')[this.params][FccGlobalConstant.READONLY] = true;
      this.form.get('beneficiaryBankName')[this.params][FccGlobalConstant.READONLY] = true;
      const accountLabel = this.beneficiaryCountry.filter(task => task.value.shortName === swiftBICCodeResponse.responseData.COUNTRY);
      if (accountLabel !== undefined) {
        this.patchFieldValueAndParameters(this.form.get('beneficiaryBankCountry'),
          accountLabel[0].value, { disabled: true, options: this.beneficiaryCountry });
      }
    }
    this.fieldValueChanged = true;
    this.form.updateValueAndValidity();
  }

  onClickBeneficiaryBankSwiftCode() {
    const beneSwiftCode = this.form.get('beneficiaryBankSwiftCode').value;
    if (this.commonService.isnonEMptyString(beneSwiftCode)) {
      this.form.addFCCValidators(
        'beneficiaryBankSwiftCode',
        Validators.pattern(this.swifCodeRegex),
        0
      );
      this.form
        .get('beneficiaryBankSwiftCode')
        .setErrors({ invalidBICError: true });
      this.form.updateValueAndValidity();
    }
  }

  onClickInterMediaryBankIfscCode() {
    const beneSwiftCode = this.form.get('interMediaryBankIfscCode').value;
    if (this.commonService.isnonEMptyString(beneSwiftCode)) {
      this.form.addFCCValidators('interMediaryBankIfscCode', Validators.pattern(this.swifCodeRegex), 0);
      this.form.get('interMediaryBankIfscCode').setErrors({ invalidBICError: true });
      this.form.updateValueAndValidity();
    }
  }

  onClickInterMediaryBankIfscCodeIcons() {
    const header = `${this.translateService.instant('listOfBanks')}`;
    const obj = {};
    this.preapreLookUpObectData(obj);
    this.isIntermediaryBank = true;
    this.updateFilterValues(obj, this.isIntermediaryBank);
    this.resolverService.getSearchData(header, obj);
    this.bankResponse =
      this.searchLayoutService.searchLayoutDataSubject.subscribe(
        (interMediaryBankResponse) => {
          if (interMediaryBankResponse !== null) {
            this.form.get(FccConstants.INTERMEDIARY_BANK_IFSC_ADDRESS).setValue('');
            this.updateinterMediaryBankDetails(interMediaryBankResponse);
          }
        }
      );
  }

  initializeFormGroup() {
    const sectionName = FccGlobalConstant.BENEFICIARY_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.form.updateValueAndValidity();
    this.getEntityId();
    this.getCountryDetail();
    this.updateCurrencyDetails();
    this.showSpinner = false;
    this.getBeneficiaryLargeParamData();
    this.setMandatoryFieldForProducts();
    this.setAccountColumns();
    this.form.get('beneficiaryActiveFlag')[this.params][
      FccGlobalConstant.DEFAULT_VALUE
    ] = 'Y';
    this.language =
      localStorage.getItem('language') !== null
        ? localStorage.getItem('language')
        : '';
    if (this.commonService.isNonEmptyField(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE, this.form) &&
      this.commonService.isnonEMptyString(this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE).value)) {
        this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE)[this.params][
          FccGlobalConstant.DISABLED
        ] = false;
        this.currentProductype = this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE).value.shortName;
        this.fetchFields(this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE).value.shortName);
        this.checkAccountTableListExists();
    }
  }

  setMandatoryFieldForProducts() {
    if (this.commonService.isnonEMptyString(this.currentProductype)) {
      if (
        this.currentProductype === BeneConstants.PROD_HVXB &&
        this.currentProductype === BeneConstants.PROD_HVPS
      ) {
        this.form.get('beneficiaryBankName')[FccGlobalConstant.PARAMS][
          FccGlobalConstant.REQUIRED
        ] = false;
      }
    }
  }

  setRequired(form, ids: string[], flag) {
    ids.forEach((id) => this.setRequiredOnly(form, id, flag));
  }

  setRequiredOnly(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { required: flag });
  }
  getCountryDetail() {
    this.commonService.getCountries().subscribe((data) => {
      this.updateCountries(data);
    });
  }

  updateCountries(body: any) {
    this.countryList = body;
    this.countryList.countries.forEach((value) => {
      const country: { label: string; value: any } = {
        label: value.alpha2code + '-' + value.name,
        value: {
          label: value.alpha2code,
          shortName: value.alpha2code,
          name: value.name,
        },
      };
      this.country.push(country);
      const beneCountry: { label: string; value: any } = {
        label: value.alpha2code + '-' + value.name,
        value: {
          label: value.alpha2code,
          shortName: value.alpha2code,
          name: value.name,
        },
      };
      this.beneficiaryCountry.push(beneCountry);
    });
  }

  getBeneficiaryLargeParamData() {
    const elementId = FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE;
    this.codeData.productCode = FccGlobalConstant.PRODUCT_DEFAULT;
    this.codeData.subProductCode = FccGlobalConstant.SUBPRODUCT_DEFAULT;
    this.codeData.language =
      localStorage.getItem('language') !== null
        ? localStorage.getItem('language')
        : '';
    const elementValue = this.form.get(
      FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE
    )[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
    if (
      this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE)[
        FccGlobalConstant.PARAMS
      ][FccGlobalConstant.CODE_ID] !== null &&
      this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE)[
        FccGlobalConstant.PARAMS
      ][FccGlobalConstant.CODE_ID] !== '' &&
      this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE)[
        FccGlobalConstant.PARAMS
      ][FccGlobalConstant.CODE_ID] !== undefined
    ) {
      this.codeData.codeId = this.form.get(
        FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE
      )[FccGlobalConstant.PARAMS][FccGlobalConstant.CODE_ID];
    }
    if (elementValue !== undefined && elementValue.length === 0) {
      this.commonService
        .getCodeDataDetails(this.codeData)
        .subscribe((response) => {
          if (
            !this.commonService.isEmptyValue(response) &&
            !this.commonService.isEmptyValue(response.body.items)
          ) {
            response.body.items.forEach((val) => {
              this.productObj = {
                label: val.longDesc,
                value: {
                  label: val.longDesc,
                  shortName: val.shortDesc,
                },
              };
              this.eventDataArray.push(this.productObj);
            });
          }
        });
      this.patchFieldParameters(this.form.get(elementId), {
        options: this.eventDataArray,
      });
    } else {
      this.eventDataArray = elementValue;
    }
    if (elementValue !== undefined && elementValue.length !== 0) {
      elementValue.forEach((value, index) => {
        if (value.value === '*') {
          elementValue.splice(index, 1);
        }
      });
      this.patchFieldParameters(this.form.get(elementId), {
        options: elementValue,
      });
      if (this.commonService.isNonEmptyField(elementId, this.form) &&
      this.commonService.isnonEMptyString(this.form.get(elementId).value)) {
        this.form.get(elementId).setValue(this.eventDataArray.filter(
          task => task.value.shortName === this.form.get(elementId).value.shortName)[0].value);
        this.form.get(elementId).updateValueAndValidity();
      }
      this.form.updateValueAndValidity();
    }
  }

  onBlurBeneficiaryBankSwiftCode() {
    const country = this.form.get('beneCountry').value.shortName;
    const currency = this.form.get('beneficiaryAccountCurCode').value.shortName;
    const accountNo = this.form.get('beneficiaryAccountNo').value;
    if (
      this.beneIBANIncludedProducts[0]
        .split(',')
        .includes(this.currentProductype) &&
      this.commonService.isnonEMptyString(country) &&
      this.commonService.isnonEMptyString(currency) &&
      this.commonService.isnonEMptyString(accountNo)
    ) {
      this.commonService
        .isIBANValid(
          country.toString(),
          currency.toString(),
          accountNo.toString()
        )
        .subscribe((response) => {
          if (response && !response.isIBANValid) {
            this.form
              .get('beneficiaryAccountNo')
              .setErrors({ invalidIBANAccNoError: true });
          }
        });
    }
    this.form.get('beneficiaryBankSwiftCode').valueChanges.subscribe((val) => {
      if (val !== null && this.currentProductype === BeneConstants.PROD_MEPS) {
        this.form
          .get('interMediaryBank')
          .setValue(FccBusinessConstantsService.YES);
        this.interMediaryBankFields = [
          'interMediaryBankIfscCode',
          'interMediaryBankIfscName',
          'interMediaryBankIfscCodeIcons',
          'interMediaryBankIfscAddressLine1',
          'interMediaryBankIfscAddressLine2',
          'interMediaryBankIfscAddressLine3',
          'interMediaryBankIfscCity',
        ];
        this.setRenderOnlyFields(this.form, this.interMediaryBankFields, true);
        this.setRequired(this.form, this.interMediaryBankFields, true);
      }
      if (
        val !== null &&
        this.currentProductype === BeneConstants.PROD_RTGS &&
        this.isInterMediaryBankDetailsRequired === 'Y'
      ) {
        this.form
          .get('interMediaryBank')
          .setValue(FccBusinessConstantsService.YES);
        this.interMediaryBankFields = [
          'interMediaryBankIfscCode',
          'interMediaryBankIfscName',
          'interMediaryBankIfscCodeIcons',
          'interMediaryBankIfscAddressLine1',
          'interMediaryBankIfscAddressLine2',
          'interMediaryBankIfscAddressLine3',
          'interMediaryBankIfscCity',
        ];
        this.setRenderOnlyFields(this.form, this.interMediaryBankFields, true);
        this.setRequired(this.form, this.interMediaryBankFields, true);
      }
    });
  }
  updateinterMediaryBankDetails(interMediaryBankResponse) {
    let beneCountry = [];
    const commmonProducts = [BeneConstants.PROD_MT101, BeneConstants.PROD_MT103, BeneConstants.PROD_FT103, BeneConstants.PROD_FI103];
    if (this.commonService.isEmptyValue(this.currentProductype)) {
      this.currentProductype = this.form.get(FccConstants.BENEFICIARY_PRODUCT_TYPE).value.shortName;
    }
    if (this.currentProductype === BeneConstants.PROD_RTGS || this.currentProductype === BeneConstants.PROD_MEPS) {
      this.form.get('interMediaryBankIfscCode').patchValue(interMediaryBankResponse.responseData.KEY_1);
      this.form.get('interMediaryBankIfscName').patchValue(interMediaryBankResponse.responseData.DATA_3);
      this.form.get('interMediaryBankIfscAddressLine1').patchValue(interMediaryBankResponse.responseData.DATA_3);
      this.form.get('interMediaryBankIfscAddressLine2').patchValue(interMediaryBankResponse.responseData.DATA_4);
      this.form.get('interMediaryBankIfscAddressLine3').patchValue(interMediaryBankResponse.responseData.DATA_5);
      this.form.get('interMediaryBankIfscName')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('interMediaryBankIfscAddressLine1')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('interMediaryBankIfscAddressLine2')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('interMediaryBankIfscAddressLine3')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('interMediaryBankIfscName')[this.params][FccGlobalConstant.READONLY] = true;
      this.form.get('interMediaryBankIfscAddressLine1')[this.params][FccGlobalConstant.READONLY] = true;
      this.form.get('interMediaryBankIfscAddressLine2')[this.params][FccGlobalConstant.READONLY] = true;
      this.form.get('interMediaryBankIfscAddressLine3')[this.params][FccGlobalConstant.READONLY] = true;
      beneCountry = this.beneficiaryCountry.filter(task => task.value.shortName === interMediaryBankResponse.responseData.DATA_7);
      if (beneCountry !== undefined && beneCountry.length > FccGlobalConstant.LENGTH_0) {
        this.patchFieldValueAndParameters(this.form.get('interMediaryBankIfscCity'),
          beneCountry[0].value, { disabled: true, options: this.beneficiaryCountry });
      }
    } else if (commmonProducts.includes(this.currentProductype)) {
      this.form.get('interMediaryBankIfscCode').patchValue(interMediaryBankResponse.responseData.BIC);
      this.form.get('interMediaryBankIfscName').patchValue(interMediaryBankResponse.responseData.BANK_NAME);
      this.form.get('interMediaryBankIfscAddressLine1').patchValue(interMediaryBankResponse.responseData.ADDRESS);
      this.form.get('interMediaryBankIfscAddressLine2').patchValue(interMediaryBankResponse.responseData.POSTCODE);
      this.form.get('interMediaryBankIfscAddressLine3').patchValue(interMediaryBankResponse.responseData.CITY);
      this.form.get('interMediaryBankIfscName')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('interMediaryBankIfscAddressLine1')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('interMediaryBankIfscAddressLine2')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('interMediaryBankIfscAddressLine3')[this.params][FccGlobalConstant.DISABLED] = true;
      this.form.get('interMediaryBankIfscName')[this.params][FccGlobalConstant.READONLY] = true;
      this.form.get('interMediaryBankIfscAddressLine1')[this.params][FccGlobalConstant.READONLY] = true;
      this.form.get('interMediaryBankIfscAddressLine2')[this.params][FccGlobalConstant.READONLY] = true;
      this.form.get('interMediaryBankIfscAddressLine3')[this.params][FccGlobalConstant.READONLY] = true;
      beneCountry = this.beneficiaryCountry.filter(task => task.value.shortName === interMediaryBankResponse.responseData.COUNTRY);
      if (beneCountry !== undefined && beneCountry.length > FccGlobalConstant.LENGTH_0) {
        this.patchFieldValueAndParameters(this.form.get('interMediaryBankIfscCity'),
          beneCountry[0].value, { disabled: true, options: this.beneficiaryCountry });
      }
    }
    this.form.get(FccConstants.INTERMEDIARY_BANK_IFSC_ADDRESS).setValue(this.form.get('interMediaryBankIfscAddressLine1').value +
    '|' + this.form.get('interMediaryBankIfscAddressLine2').value);
    this.form.updateValueAndValidity();
  }

  onClickInterMediaryBankIfscCity() {
    this.patchFieldParameters(this.form.get('interMediaryBankIfscCity'), {
      options: this.beneficiaryCountry,
    });
  }

  updateFilterValues(obj, isIntermediaryBank) {
    const parmid = 'parmid';
    const option = 'option';
    const intermediateBankFlag = 'intermediateBankFlag';
    if (this.currentProductype === BeneConstants.PROD_MEPS && isIntermediaryBank) {
      obj[parmid] = 'P703';
      obj[option] = BeneConstants.PROD_RTGS_CODE;
    }
    if (this.currentProductype === BeneConstants.PROD_RTGS) {
      obj[parmid] = 'P704';
      if (isIntermediaryBank) {
        obj[intermediateBankFlag] = 'N';
      }
    }
  }

  getCodeForProduct(currentProductype) {
    switch (currentProductype) {
      case BeneConstants.PROD_MT101:
        return BeneConstants.PROD_BIC_CODE;
      case BeneConstants.PROD_MT103:
        return BeneConstants.PROD_BIC_CODE;
      case BeneConstants.PROD_FT103:
        return BeneConstants.PROD_BIC_CODE;
      case BeneConstants.PROD_FI103:
        return BeneConstants.PROD_BIC_CODE;
      case BeneConstants.PROD_RTGS:
        return BeneConstants.PROD_RTGS_CODE;
      case BeneConstants.PROD_MEPS:
        return BeneConstants.PROD_BIC_CODE;
      case BeneConstants.PROD_MUPS:
        return BeneConstants.PROD_IFSC_MUPS_CODE;
      case BeneConstants.PROD_DOM:
        return BeneConstants.PROD_BANK_BRANCH_CODE;
      case BeneConstants.PROD_HVPS:
        return BeneConstants.PROD_CNAPS_HVPS_CODE;
      case BeneConstants.PROD_HVXB:
        return BeneConstants.PROD_CNAPS_HVXB_CODE;
      default:
        return BeneConstants.PROD_BIC_CODE;
    }
  }

  onClickBeneficiaryBranchCodeIcons() {
    const header = `${this.translateService.instant('listOfBanks')}`;
    const obj = {};
    this.preapreLookUpObectData(obj);
    this.isIntermediaryBank = true;
    this.updateFilterValues(obj, this.isIntermediaryBank);
    this.resolverService.getSearchData(header, obj);
    this.bankResponse =
      this.searchLayoutService.searchLayoutDataSubject.subscribe((resp) => {
        if (resp !== null) {
          this.form
            .get('beneficiaryBankCode')
            .patchValue(resp.responseData.BANK_CODE);
          this.form
            .get('beneficiaryBranchCode')
            .patchValue(resp.responseData.BRANCH);
          this.form
            .get('beneficiaryBankName')
            .patchValue(resp.responseData.BANK_NAME);
          this.form
            .get('beneficiaryBranchName')
            .patchValue(resp.responseData.NAME);
          this.fieldValueChanged = true;
          this.form.updateValueAndValidity();
        }
      });
  }

  onClickCnapsCodeIcons() {
    const header = `${this.translateService.instant('listOfBanks')}`;
    const obj = {};
    this.preapreLookUpObectData(obj);
    this.isIntermediaryBank = true;
    this.updateFilterValues(obj, this.isIntermediaryBank);
    this.resolverService.getSearchData(header, obj);
    this.bankResponse =
      this.searchLayoutService.searchLayoutDataSubject.subscribe((resp) => {
        if (resp !== null) {
          this.form.get('cnapsCode').patchValue(resp.responseData.BANK_CODE);
          this.form
            .get('beneficiaryBankName')
            .patchValue(resp.responseData.BANK_NAME);
          this.fieldValueChanged = true;
          this.form.updateValueAndValidity();
        }
      });
  }

  onClickBeneficiaryBankIfscCodeIcons() {
    const header = `${this.translateService.instant('listOfBanks')}`;
    const obj = {};
    this.preapreLookUpObectData(obj);
    this.isIntermediaryBank = true;
    this.updateFilterValues(obj, this.isIntermediaryBank);
    this.resolverService.getSearchData(header, obj);
    this.bankResponse =
      this.searchLayoutService.searchLayoutDataSubject.subscribe((resp) => {
        if (resp !== null) {
          if (this.commonService.isnonEMptyString(resp.responseData.DATA_2)) {
            this.addressLine = resp.responseData.DATA_2.match(/.{0,34}(\s|$)/g);
          }
          this.addressLine = this.addressLine ? this.addressLine : [];
          this.form
            .get('beneficiaryBankIfscCode')
            .patchValue(resp.responseData.KEY_1);
          this.form
            .get('beneficiaryBankName')
            .patchValue(resp.responseData.DATA_1);
          this.form
            .get('beneficiaryBankIfscAddressLine1')
            .patchValue(this.addressLine[0]);
          this.form
            .get('beneficiaryBankIfscAddressLine2')
            .patchValue(this.addressLine[1]);
          this.form
            .get('beneficiaryBankIfscCity')
            .patchValue(resp.responseData.DATA_3);
          this.fieldValueChanged = true;
          this.form.updateValueAndValidity();
        }
      });
  }

  onKeyupBeneficiaryBranchCodeIcons() {
    this.onClickBeneficiaryBranchCodeIcons();
  }

  onKeyupCnapsCodeIcons() {
    this.onClickCnapsCodeIcons();
  }

  onKeyupBeneficiaryBankIfscCodeIcons() {
    this.onClickBeneficiaryBankIfscCodeIcons();
  }

  onClickBeneficiaryBranchAddressRequired() {
    if (this.commonService.isEmptyValue(this.currentProductype)) {
      this.currentProductype = this.form.get(FccConstants.BENEFICIARY_PRODUCT_TYPE).value.shortName;
    }
    if (
      this.commonService.isNonEmptyField(
        'beneficiaryBranchAddressRequired',
        this.form
      ) &&
      this.commonService.isnonEMptyString(
        this.form.get('beneficiaryBranchAddressRequired').value
      ) &&
      this.form.get('beneficiaryBranchAddressRequired').value ===
        FccBusinessConstantsService.YES
    ) {
      this.beneIBANIncludedProducts.toString().includes(this.currentProductype);
      this.form.get('beneficiaryBranchAddress')[this.params][
        FccGlobalConstant.REQUIRED
      ] = true;
    } else {
      this.form.get('beneficiaryBranchAddress')[this.params][
        FccGlobalConstant.REQUIRED
      ] = false;
      this.form.get('beneficiaryBranchAddress').setErrors(null);
      this.form.get('beneficiaryBranchAddress').updateValueAndValidity();
    }
  }

  onKeyupBeneficiaryProductType(event) {
    const productCode = this.form.get('beneficiaryProductType').value;
    event.value = productCode;
    if (
      this.commonService.isEmptyValue(productCode) ||
      productCode.shortName === ''
    ) {
      this.fetchFields(productCode.shortName);
    } else if (
      event.key === 'Enter' &&
      this.currentProductype !== productCode.shortName
    ) {
      event.value = productCode;
      this.onClickBeneficiaryProductType(event);
    }
  }

  onKeyupEntity(event) {
    const entityValue = this.form.get('Entity').value;
    event.value = entityValue;
    if (event.key === 'Enter') {
      this.onClickEntity(event);
    }
  }

  getEntityId() {
    this.commonService
      .getFormValues(
        FccGlobalConstant.STATIC_DATA_LIMIT,
        this.fccGlobalConstantService.userEntities
      )
      .pipe(tap(() => (this.fetching = true)))
      .subscribe((res) => {
        this.fetching = false;
        res.body.items.forEach((value) => {
          const entity: { label: string; value: any } = {
            label: value.shortName,
            value: value.id,
          };
          this.entityDataArray.push(entity);
        });
        this.getUserEntities();
      });
  }

  onClickBeneficiaryProductType(event) {
    if (event.value) {
      this.onClickBeneficiaryBranchAddressRequired();
      if (this.commonService.isNonEmptyValue(this.finalList)) {
        this.setRenderOnlyFields(this.form, this.finalList, false);
      }
      if (this.form.get('beneficiaryActiveFlag').value === 'N') {
        this.fieldValueChanged = true;
      }
      if (this.form.get('beneficiaryPreApproved').value === 'Y') {
        this.fieldValueChanged = true;
      }
      if (this.finalList && this.finalList.length > 0) {
        this.arr = [];
        this.finalList.forEach((vals) => {
           this.controlName = vals;
           this.arr.push(this.form.get(this.controlName).dirty);
         });
        if (this.arr.includes(true) || this.fieldValueChanged) {
          const message = `${this.translateService.instant('productChange')}`;
          this.dialogRef = this.dialogService.open(
            ConfirmationDialogComponent,
            {
              header: `${this.translateService.instant('confirmation')}`,
              width: '35em',
              styleClass: 'fileUploadClass',
              data: { locaKey: message },
            }
          );
          this.dialogRef.onClose.subscribe((result) => {
            if (result.toLowerCase() === 'yes') {
              this.resetAccountFields();
              this.accountsList = [];
              this.activeAccountsList = [];
              this.fieldValueChanged = false;
              this.setRenderOnlyFields(this.form, this.finalList, false);
              this.form.get('beneficiaryThresholdCurCode')[this.params][
                FccGlobalConstant.RENDERED
              ] = false;
              this.form.get('beneficiaryThresholdAmt')[this.params][
                FccGlobalConstant.RENDERED
              ] = false;
              this.form.get('beneficiaryBankName')[this.params][
                FccGlobalConstant.DISABLED
              ] = false;
              this.form.get('beneficiaryBankIfscAddressLine1')[this.params][
                FccGlobalConstant.DISABLED
              ] = false;
              this.form.get('beneficiaryBankIfscAddressLine2')[this.params][
                FccGlobalConstant.DISABLED
              ] = false;
              this.form.get('beneficiaryBankIfscAddressLine3')[this.params][
                FccGlobalConstant.DISABLED
              ] = false;
              if (this.interMediaryBankFields.length > 0) {
                this.setRequired(this.form, this.interMediaryBankFields, false);
                this.setRenderOnlyFields(
                  this.form,
                  this.interMediaryBankFields,
                  false
                );
                this.interMediaryBankFields.map((value: string) => {
                  this.form.get(value).setValue(null);
                  this.form.get(value).markAsUntouched();
                });
              }
              this.finalList.map((value: string) => {
                this.form.get(value).setValue(null);
                this.form.get(value).markAsUntouched();
                this.form.get(value).markAsPristine();
                this.form.get(value).clearValidators();
              });
              this.form.get('beneficiaryActiveFlag').setValue('Y');
              this.form.get('beneficiaryPreApproved')[this.params][
                FccGlobalConstant.DEFAULT_VALUE
              ] = 'N';
              this.form.get('beneficiaryThresholdCurCode').setValue(null);
              this.form.get('beneficiaryThresholdAmt').setValue(null);
              this.fetchFields(event.value.shortName, event.value);
              this.patchFieldValueAndParameters(
                this.form.get('beneficiaryProductType'),
                this.currentProductypeValue,
                { options: this.eventDataArray }
              );
              this.form.updateValueAndValidity();
            } else {
              this.patchFieldValueAndParameters(
                this.form.get('beneficiaryProductType'),
                this.currentProductypeValue,
                { options: this.eventDataArray }
              );
              this.fetchFields(this.currentProductype);
            }
          });
          this.patchFieldValueAndParameters(
            this.form.get('beneficiaryProductType'),
            this.currentProductypeValue,
            { options: this.eventDataArray }
          );
          this.fetchFields(this.currentProductype);
        } else {
          this.finalList.map((value: string) => {
            this.form.get(value).setValue(null);
            this.form.get(value).markAsUntouched();
            this.form.get(value).markAsPristine();
          });
          this.form.get('beneficiaryActiveFlag').setValue('Y');
          this.form.get('beneficiaryPreApproved').setValue('N');
          this.form.get('beneficiaryThresholdCurCode')[this.params][
            FccGlobalConstant.RENDERED
          ] = false;
          this.form.get('beneficiaryThresholdAmt')[this.params][
            FccGlobalConstant.RENDERED
          ] = false;
          this.patchFieldValueAndParameters(
            this.form.get('beneficiaryThresholdCurCode'),
            [],
            { disabled: false }
          );
          this.form.get('beneficiaryThresholdAmt').setValue(null);
          this.form.updateValueAndValidity();
          this.fetchFields(event.value.shortName);
        }
      } else {
        this.fetchFields(event.value.shortName);
      }
    }
  }
  resetAccountFields() {
    this.setRenderOnlyFields(
      this.form,
      BeneConstants.PRODUCT_GROUP2_TABLE,
      false
    );
    this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.DATA
    ] = [];
    this.form.get('defaultAccount')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.DISABLED
    ] = false;
    this.form.get('addAccountButton')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = false;
    this.form.get('updateAccountButton')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = false;
    this.form.get('saveAccountButton')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = false;
  }

  onClickEntity(event) {
    if (event.value) {
      this.form.get(FccGlobalConstant.BEBEFICIARY_PRODUCT_TYPE)[this.params][
        FccGlobalConstant.DISABLED
      ] = false;
      this.multiBankService.setCurrentEntity(event.value.name);
      this.taskService.setTaskEntity(event.value);
      this.entityDataArray.forEach((value) => {
        if (event.value.shortName === value.label) {
          this.entityId = value.value;
          this.flag = true;
        }
      });
    }
  }

  fetchFields(value, valueObj = {}) {
    let rquiredFieldsList;
    let excludePreviewFields = null;
    this.setAccountColumns();
    this.resetPreviewScreenFlag();
    if (this.commonService.isnonEMptyString(value)) {
      this.currentProductype = value;
      this.currentProductypeValue = Object.keys(valueObj).length
        ? valueObj
        : this.form.get('beneficiaryProductType').value;
      if (BeneConstants.GROUP2_COMMON_PRODUCTS.includes(value)) {
        this.finalList = [...BeneConstants.PRODUCT_GROUP2];
        rquiredFieldsList = [...BeneConstants.GROUP2_REQUIRED_FIELDS];
        excludePreviewFields = [...BeneConstants.PRODUCT_GROUP2_TABLE];
        if (value === BeneConstants.PROD_RTGS || value === BeneConstants.PROD_MEPS) {
          this.form.get('beneficiaryBankIfscAddressLine1')[this.params][FccGlobalConstant.REQUIRED] = true;
          this.form.get('beneficiaryAddressLine2')[this.params][FccGlobalConstant.REQUIRED] = true;
          this.form.get('beneficiaryAddressLine3')[this.params][FccGlobalConstant.REQUIRED] = true;
        } else {
          this.form.get('beneficiaryBankIfscAddressLine1')[this.params][FccGlobalConstant.REQUIRED] = false;
          this.form.get('beneficiaryAddressLine2')[this.params][FccGlobalConstant.REQUIRED] = false;
          this.form.get('beneficiaryAddressLine3')[this.params][FccGlobalConstant.REQUIRED] = false;
        }
      }
      if (value === BeneConstants.PROD_TPT) {
        this.form.addFCCValidators(
          'beneficiaryId',
          Validators.pattern(this.beneIdValidationRegex),
              0
          );
        this.finalList = [...BeneConstants.PRODUCT_TPT];
        rquiredFieldsList = [...BeneConstants.TPT_TTPT_REQUIRED_FIELDS];
        excludePreviewFields = [...BeneConstants.PRODUCT_TPT_TABLE];
      }
      if (value === BeneConstants.PROD_MUPS) {
        this.form.get('beneficiaryBankIfscAddressLine1')[this.params][
          FccGlobalConstant.REQUIRED
        ] = false;
        this.form.addFCCValidators(
          'beneficiaryId',
          Validators.pattern('[A-Za-z0-9 ]+$'),
          0
        );
        this.finalList = [...BeneConstants.PRODUCT_MUPS];
        rquiredFieldsList = [...BeneConstants.MUPS_REQUIRED_FIELDS];
        excludePreviewFields = [...BeneConstants.PRODUCT_MUPS_TABLE];
      }
      if (value === BeneConstants.PROD_DOM) {
        this.form.addFCCValidators(
          'beneficiaryId',
          Validators.pattern(this.beneIdValidationRegex),
              0
          );
        this.finalList = [...BeneConstants.PRODUCT_DOM];
        rquiredFieldsList = [...BeneConstants.DOM_REQUIRED_FIELDS];
        excludePreviewFields = [...BeneConstants.PRODUCT_DOM_TABLE];
      }
      if (value === BeneConstants.PROD_DD) {
        this.form.addFCCValidators(
          'beneficiaryId',
          Validators.pattern(this.beneIdValidationRegex),
              0
          );
        this.finalList = [...BeneConstants.PRODUCT_DD];
        rquiredFieldsList = [...BeneConstants.DD_REQUIRED_FIELDS];
        excludePreviewFields = null;
      }
      if (value === BeneConstants.PROD_TTPT) {
        this.form.get('beneficiaryAddressLine1')[this.params][
          FccGlobalConstant.REQUIRED
        ] = false;
        this.finalList = [...BeneConstants.PRODUCT_TTPT];
        rquiredFieldsList = [...BeneConstants.TPT_TTPT_REQUIRED_FIELDS];
        excludePreviewFields = [...BeneConstants.PRODUCT_TTPT_TABLE];
      }
      if (value === BeneConstants.PROD_HVPS) {
        this.finalList = [...BeneConstants.PRODUCT_HVPS];
        rquiredFieldsList = [...BeneConstants.CNAPS_REQUIRED_FIELDS];
        excludePreviewFields = [...BeneConstants.PRODUCT_CNAPS_TABLE];
      }
      if (value === BeneConstants.PROD_HVXB) {
        this.form.addFCCValidators(
          'beneficiaryId',
          Validators.pattern(this.beneIdValidationRegex),
              0
          );
        this.finalList = [...BeneConstants.PRODUCT_HVXB];
        rquiredFieldsList = [...BeneConstants.CNAPS_REQUIRED_FIELDS];
        excludePreviewFields = [...BeneConstants.PRODUCT_CNAPS_TABLE];
      }
      this.setRequired(this.form, rquiredFieldsList, true);
      this.setPreviewScreenFields(this.form, this.finalList, excludePreviewFields, true);
    }
    this.setRenderOnlyFields(this.form, this.finalList, true);
    this.setMandatoryFieldForProducts();
    this.updateCurrencyForBeneProducts(value);
  }

  updateCurrencyForBeneProducts(value: any) {
    if (value === BeneConstants.PROD_MEPS) {
      const accountLabel = this.currency.filter(
        (task) => task.value.label === BeneConstants.SGD
      );
      if (accountLabel !== undefined && accountLabel.length > FccGlobalConstant.LENGTH_0) {
        this.patchFieldValueAndParameters(
          this.form.get('beneficiaryAccountCurCode'),
          accountLabel[0].value,
          { disabled: true }
        );
        this.patchFieldValueAndParameters(
          this.form.get('beneficiaryThresholdCurCode'),
          accountLabel[0].value,
          { disabled: true }
        );
      }
    } else if (value === BeneConstants.PROD_MUPS) {
      const accountLabel = this.currency.filter(
        (task) => task.value.label === BeneConstants.INR
      );
      if (accountLabel !== undefined && accountLabel.length > FccGlobalConstant.LENGTH_0) {
        this.patchFieldValueAndParameters(
          this.form.get('beneficiaryAccountCurCode'),
          accountLabel[0].value,
          { disabled: true }
        );
        this.patchFieldValueAndParameters(
          this.form.get('beneficiaryThresholdCurCode'),
          accountLabel[0].value,
          { disabled: true }
        );
      }
    } else if (
      value === BeneConstants.PROD_HVXB ||
      value === BeneConstants.PROD_HVPS
    ) {
      const accountLabel = this.currency.filter(
        (task) => task.value.label === BeneConstants.CNY
      );
      if (accountLabel !== undefined && accountLabel.length > FccGlobalConstant.LENGTH_0) {
        this.patchFieldValueAndParameters(
          this.form.get('beneficiaryAccountCurCode'),
          accountLabel[0].value,
          { disabled: true }
        );
        this.patchFieldValueAndParameters(
          this.form.get('beneficiaryThresholdCurCode'),
          accountLabel[0].value,
          { disabled: true }
        );
      }
    } else {
      this.form.get('beneficiaryAccountCurCode')[FccGlobalConstant.PARAMS][
        FccGlobalConstant.DISABLED
      ] = false;
    }
    this.form.updateValueAndValidity();
  }

  onClickBeneficiaryPreApproved(event) {
    if (this.commonService.isEmptyValue(this.currentProductype)) {
      this.currentProductype = this.form.get(FccConstants.BENEFICIARY_PRODUCT_TYPE).value.shortName;
    }
    if (event.checked) {
      this.form.get('beneficiaryThresholdCurCode')[this.params][
        FccGlobalConstant.RENDERED
      ] = true;
      this.form.get('beneficiaryThresholdAmt')[this.params][
        FccGlobalConstant.RENDERED
      ] = true;
      this.patchFieldParameters(this.form.get('beneficiaryThresholdCurCode'), { previewScreen: true });
      this.patchFieldParameters(this.form.get('beneficiaryThresholdAmt'), { previewScreen: true });
      this.patchFieldParameters(this.form.get('beneficiaryThresholdCurCode'), {
        options: this.currency,
      });
      this.updateCurrencyForBeneProducts(this.currentProductype);
    } else {
      this.form.get('beneficiaryThresholdCurCode')[this.params][
        FccGlobalConstant.RENDERED
      ] = false;
      this.form.get('beneficiaryThresholdAmt')[this.params][
        FccGlobalConstant.RENDERED
      ] = false;
      this.patchFieldParameters(this.form.get('beneficiaryThresholdCurCode'), { previewScreen: false });
      this.patchFieldParameters(this.form.get('beneficiaryThresholdAmt'), { previewScreen: false });
    }
  }

  onClickInterMediaryBank() {
    const togglevalue = this.form.get('interMediaryBank').value;
    this.interMediaryBankFields = [
      'interMediaryBankIfscCode',
      'interMediaryBankIfscName',
      'interMediaryBankIfscCodeIcons',
      'interMediaryBankIfscAddressLine1',
      'interMediaryBankIfscAddressLine2',
      'interMediaryBankIfscAddressLine3',
      'interMediaryBankIfscCity',
    ];
    if (togglevalue === FccBusinessConstantsService.YES) {
      this.setRenderOnlyFields(this.form, this.interMediaryBankFields, true);
    } else {
      this.setRenderOnlyFields(this.form, this.interMediaryBankFields, false);
    }
  }

  setRenderOnly(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { rendered: flag });
    if (!flag) {
      this.setRequiredOnly(form, id, false);
    }
  }

  setRenderOnlyFields(form, ids: string[], flag) {
    ids.forEach((id) => this.setRenderOnly(form, id, flag));
  }

  setPreviewScreenFlag(form, id, flag) {
    this.patchFieldParameters(form.controls[id], { previewScreen: flag });
  }

  setPreviewScreenFields(form, ids: string[], exclude: string[], flag) {
    if (this.commonService.isEmptyValue(exclude) || exclude.length <= FccGlobalConstant.LENGTH_0) {
      ids.forEach((id) => this.setPreviewScreenFlag(form, id, flag));
    } else {
      ids.forEach(id => {
        if (exclude.includes(id)) {
          this.setPreviewScreenFlag(form, id, false);
        } else {
          this.setPreviewScreenFlag(form, id, flag);
        }
      });
    }
  }

  resetPreviewScreenFlag() {
    BeneConstants.PRODUCT_GROUP1_LIST.forEach(product => {
      const grp1Fields = [...BeneConstants[product]];
      this.setPreviewScreenFields(this.form, grp1Fields, null, false);
    });
    const grp2Fields = [...BeneConstants.PRODUCT_GROUP2];
    this.setPreviewScreenFields(this.form, grp2Fields, null, false);
  }

  resetRenderOnly(form, id) {
    this.resetValue(form, id, null);
    form.get(id).markAsUntouched();
  }

  resetValidation(form, id) {
    form.get(id).setErrors(null);
    form.get(id).markAsUntouched();
    form.get(id).clearValidators();
  }

  resetRenderOnlyFields(form, ids: string[]) {
    ids.forEach((id) => this.resetRenderOnly(form, id));
  }

  clearValidationRenderFields(form, ids: string[]) {
    ids.forEach((id) => this.resetValidation(form, id));
    this.form.updateValueAndValidity();
  }

  retainRenderedOnlyField(form, ids: string[], rowdata) {
    for (const [key, value] of Object.entries(rowdata)) {
      this.patchFieldValueAndParameters(form.controls[key], value, {});
    }
  }

  onClickTrashIcon(event, rowData, index) {
    const headerField = `${this.translateService.instant('deleteAccount')}`;
    const message = `${this.translateService.instant(
      'deleteAccountConfirmationMsg'
    )}`;
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: message },
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === FccGlobalConstant.CONFIRMATION_YES) {
        const beneficiaryAccountNo = rowData.beneficiaryAccountNo;
        this.accountsList = this.accountsList.filter(
          (item) => item.label !== beneficiaryAccountNo
        );
        this.activeAccountsList = this.activeAccountsList.filter(
          (item) => item.label !== beneficiaryAccountNo
        );
        this.disableDefaultAccount();
        if (
          this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
            FccGlobalConstant.DATA
          ].length === 1
        ) {
          this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
            FccGlobalConstant.DATA
          ] = [];
          this.form.get('addAccountButton')[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] = false;
          this.form.get('updateAccountButton')[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] = false;
          this.form.get('saveAccountButton')[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] = true;
          this.resetRenderOnlyFields(this.form, this.accountTableList);
          this.fetchFields(this.currentProductype);
          return;
        }
        const retainedItem = this.form
          .get('accountListTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].filter(
            (item, i) => i !== index
          );
        this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
          FccGlobalConstant.DATA
        ] = [];
        this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
          FccGlobalConstant.DATA
        ] = [...retainedItem];
      }
    });
  }

  onClickPencilIcon(event, key, index, rowData) {
    this.editRecordIndex = index;
    this.beneAccNoBeforeUpdate = rowData.beneficiaryAccountNo;
    this.setAccountColumns();
    if (rowData.beneficiaryBankCountry && this.beneficiaryCountry) {
      const val = rowData.beneficiaryBankCountry;
      const countryValue = this.beneficiaryCountry.filter(task => task.value.shortName === val.shortName);
      if (countryValue !== undefined && countryValue.length > FccGlobalConstant.LENGTH_0) {
        this.patchFieldValueAndParameters(this.form.get('beneficiaryBankCountry'),
        countryValue[0].value, { options: this.beneficiaryCountry });
      }
    }
    if (rowData.beneficiaryAccountCurCode && this.currency) {
      const val = rowData.beneficiaryAccountCurCode;
      const currencyValue = this.currency.filter(task => task.value.shortName === val.shortName);
      if (currencyValue !== undefined && currencyValue.length > FccGlobalConstant.LENGTH_0) {
        this.patchFieldValueAndParameters(this.form.get('beneficiaryAccountCurCode'),
        currencyValue[0].value, { options: this.currency });
      }
    }
    if (BeneConstants.GROUP2_COMMON_PRODUCTS.includes(this.productType)) {
      this.onClickBeneficiaryBranchAddressRequired();
      this.onClickInterMediaryBank();
      this.form.get('beneficiaryBankSwiftCodeIcons')[FccGlobalConstant.PARAMS][
        FccGlobalConstant.RENDERED
      ] = true;
      this.form.get('interMediaryBankIfscCodeIcons')[FccGlobalConstant.PARAMS][
        FccGlobalConstant.RENDERED
      ] = true;
    }
    if (
      this.form.get('saveAccountButton')[FccGlobalConstant.PARAMS][
        FccGlobalConstant.RENDERED
      ]
    ) {
      this.setRenderOnlyFields(
        this.form,
        this.accountTableList,
        false
      );
      this.form.get('saveAccountButton')[FccGlobalConstant.PARAMS][
        FccGlobalConstant.RENDERED
      ] = false;
    }
    this.form.get('addAccountButton')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = false;
    this.form.get('updateAccountButton')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = true;
    this.setRenderOnlyFields(
      this.form,
      this.accountTableList,
      true
    );
    this.setRequired(this.form, BeneConstants.GROUP2_REQUIRED_FIELDS, true);
    this.onClickInterMediaryBank();
    this.retainRenderedOnlyField(
      this.form,
      this.accountTableList,
      rowData
    );
  }

  onClickSaveAccountButton() {
    this.onBlurBeneficiaryAccountNo();
    if (
      this.form.get('accountListTable')[FccGlobalConstant.STATUS] ===
        'INVALID' ||
      this.form.get('beneficiaryAccountCurCode')[FccGlobalConstant.STATUS] ===
        'INVALID' ||
      this.form.get('beneficiaryAccountNo')[FccGlobalConstant.STATUS] ===
        'INVALID'
    ) {
      return;
    }
    if (this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.COLUMNS] && this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.COLUMNS].length > FccGlobalConstant.LENGTH_0 && this.form.get('accountListTable')[
        FccGlobalConstant.PARAMS][FccGlobalConstant.TABLE_DATA] && this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
        FccGlobalConstant.TABLE_DATA].length > FccGlobalConstant.LENGTH_0){
          this.addExistingAccountToList();
        }
    const accountNo = this.form.get('beneficiaryAccountNo').value;
    const isActive = this.form.get('accountActiveFlag').value;
    this.onAdditionOfAccount(accountNo, isActive);
    this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.LIST_DATA
    ] = true;
    this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.COLUMNS
    ] = this.accountColumnList;
    const gridObj = {};
    for (const item in this.form.value) {
      if (this.accountTableList.includes(item)) {
        gridObj[item] = this.form.value[item];
      }
    }
    this.form
      .get('accountListTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].push(gridObj);
    this.form.get('beneficiaryBankSwiftCodeIcons')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = false;
    this.form.get('interMediaryBankIfscCodeIcons')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = false;
    this.form.get('saveAccountButton')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = false;
    this.form.get('addAccountButton')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = true;
    this.setRenderOnlyFields(
      this.form,
      this.accountTableList,
      false
    );
    this.clearValidationRenderFields(
      this.form,
      this.accountTableList
    );
  }

  onClickAddAccountButton() {
    if (
      this.form.get('accountListTable')[FccGlobalConstant.STATUS] ===
        'INVALID' ||
      this.form.get('beneficiaryAccountCurCode')[FccGlobalConstant.STATUS] ===
        'INVALID'
    ) {
      return;
    }
    this.setAccountColumns();
    this.setRenderOnlyFields(
      this.form,
      this.accountTableList,
      true
    );
    this.resetRenderOnlyFields(this.form, this.accountTableList);
    this.setRequired(this.form, BeneConstants.GROUP2_REQUIRED_FIELDS, true);
    this.resetRenderOnlyFields(this.form, BeneConstants.PRODUCT_GROUP2_TABLE);
    this.form.get('saveAccountButton')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = true;
    this.form.get('addAccountButton')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = false;
    if (BeneConstants.GROUP2_COMMON_PRODUCTS.includes(this.productType)) {
      this.form.get('beneficiaryBankSwiftCodeIcons')[FccGlobalConstant.PARAMS][
        FccGlobalConstant.RENDERED
      ] = true;
      this.form.get('interMediaryBankIfscCodeIcons')[FccGlobalConstant.PARAMS][
        FccGlobalConstant.RENDERED
      ] = true;
      this.onClickBeneficiaryBranchAddressRequired();
      this.onClickInterMediaryBank();
    } else {
      this.updateCurrencyForBeneProducts(this.productType);
    }
  }

  onClickUpdateAccountButton() {
    this.onBlurBeneficiaryAccountNo();
    if (
      this.form.get('accountListTable')[FccGlobalConstant.STATUS] ===
        'INVALID' ||
      this.form.get('beneficiaryAccountCurCode')[FccGlobalConstant.STATUS] ===
        'INVALID' ||
      this.form.get('beneficiaryAccountNo')[FccGlobalConstant.STATUS] ===
        'INVALID'
    ) {
      return;
    }
    const retainedRecord = this.form
      .get('accountListTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA].filter(
        (item, i) => i !== this.editRecordIndex
      );
    const gridObj = {};
    for (const item in this.form.value) {
      if (this.accountTableList.includes(item)) {
        gridObj[item] = this.form.value[item];
      }
    }
    retainedRecord.splice(this.editRecordIndex, 0, gridObj);
    this.updateActiveAccounts();
    this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.DATA
    ] = [...retainedRecord];
    this.form.get('beneficiaryBankSwiftCodeIcons')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = false;
    this.form.get('interMediaryBankIfscCodeIcons')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = false;
    this.form.get('saveAccountButton')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = false;
    this.form.get('updateAccountButton')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = false;
    this.form.get('addAccountButton')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.RENDERED
    ] = true;
    this.setRenderOnlyFields(
      this.form,
      this.accountTableList,
      false
    );
  }

  addExistingAccountToList(){
    const tableData = this.form.get('accountListTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.TABLE_DATA];
    tableData.forEach(data => {
        this.onAdditionOfAccount(data.beneficiaryAccountNo, data.accountActiveFlag);
    });
  }

  checkAccountTableListExists() {
    if (this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.COLUMNS] && this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
      FccGlobalConstant.COLUMNS].length > FccGlobalConstant.LENGTH_0 && this.form.get('accountListTable')[
        FccGlobalConstant.PARAMS][FccGlobalConstant.TABLE_DATA] && this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
        FccGlobalConstant.TABLE_DATA].length > FccGlobalConstant.LENGTH_0 && this.accountTableList) {
          this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
            FccGlobalConstant.LIST_DATA
          ] = true;
          this.addExistingAccountToList();
          this.form.get('saveAccountButton')[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] = false;
          this.form.get('addAccountButton')[FccGlobalConstant.PARAMS][
            FccGlobalConstant.RENDERED
          ] = true;
          this.setRenderOnlyFields(
            this.form,
            this.accountTableList,
            false
          );
          this.clearValidationRenderFields(
            this.form,
            this.accountTableList
          );
    }
    if (this.form.get('beneCountry').value && this.beneficiaryCountry) {
      const val = this.form.get('beneCountry').value;
      const countryValue = this.beneficiaryCountry.filter(task => task.value.shortName === val.shortName);
      if (countryValue !== undefined && countryValue.length > FccGlobalConstant.LENGTH_0) {
        this.patchFieldValueAndParameters(this.form.get('beneCountry'),
        countryValue[0].value, { options: this.beneficiaryCountry });
      }
    }
    if (this.form.get('beneficiaryPreApproved').value === FccGlobalConstant.CODE_Y) {
      this.form.get('beneficiaryThresholdCurCode')[this.params][
        FccGlobalConstant.RENDERED
      ] = true;
      this.form.get('beneficiaryThresholdAmt')[this.params][
        FccGlobalConstant.RENDERED
      ] = true;
    }
  }

  setAccountColumns() {
    this.productType = this.form.get('beneficiaryProductType').value.shortName;
    this.form.get('accountListTable')[FccGlobalConstant.PARAMS][
      FccConstants.PRODUCT_TYPE
    ] = this.productType;
    if (BeneConstants.GROUP2_COMMON_PRODUCTS.includes(this.productType)) {
      this.accountColumnList = BeneConstants.PRODUCT_GROUP2_TABLE_COLUMNS;
      this.accountTableList = BeneConstants.PRODUCT_GROUP2_TABLE;
    }
    if (BeneConstants.CNAPS_COMMON_PRODUCTS.includes(this.productType)) {
      this.accountColumnList = BeneConstants.PRODUCT_CNAPS_TABLE_COLUMNS;
      this.accountTableList = BeneConstants.PRODUCT_CNAPS_TABLE;
    }
    switch (this.productType) {
      case BeneConstants.PROD_TPT:
        this.accountColumnList = BeneConstants.PRODUCT_TPT_TABLE_COLUMNS;
        this.accountTableList = BeneConstants.PRODUCT_TPT_TABLE;
        break;
      case BeneConstants.PROD_MUPS:
        this.accountColumnList = BeneConstants.PRODUCT_MUPS_TABLE_COLUMNS;
        this.accountTableList = BeneConstants.PRODUCT_MUPS_TABLE;
        break;
      case BeneConstants.PROD_DOM:
        this.accountColumnList = BeneConstants.PRODUCT_DOM_TABLE_COLUMNS;
        this.accountTableList = BeneConstants.PRODUCT_DOM_TABLE;
        break;
      case BeneConstants.PROD_TTPT:
        this.accountColumnList = BeneConstants.PRODUCT_TTPT_TABLE_COLUMNS;
        this.accountTableList = BeneConstants.PRODUCT_TTPT_TABLE;
        break;
    }
  }

  ngOnDestroy() {
    this.stateService.setStateSection(
      FccGlobalConstant.BENEFICIARY_GENERAL_DETAILS,
      this.form
    );
    if (this.bankResponse !== undefined) {
      this.searchLayoutService.searchLayoutDataSubject.unsubscribe();
      this.bankResponse = null;
      this.searchLayoutService.searchLayoutDataSubject = new BehaviorSubject(
        null
      );
    }
  }
}
