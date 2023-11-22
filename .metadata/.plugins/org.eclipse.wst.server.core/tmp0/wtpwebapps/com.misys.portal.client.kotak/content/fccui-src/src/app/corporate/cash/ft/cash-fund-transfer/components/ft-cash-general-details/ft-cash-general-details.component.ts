import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, DialogService, DynamicDialogRef } from 'primeng';
import { tap } from 'rxjs/operators';
import { FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { FccConstants } from '../../../../../../common/core/fcc-constants';
import { FccGlobalConstantService } from '../../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { CodeDataService } from '../../../../../../common/services/code-data.service';
import { CommonService } from '../../../../../../common/services/common.service';
import { DashboardService } from '../../../../../../common/services/dashboard.service';
import { DropDownAPIService } from '../../../../../../common/services/dropdownAPI.service';
import { EventEmitterService } from '../../../../../../common/services/event-emitter-service';
import { FccTaskService } from '../../../../../../common/services/fcc-task.service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { MultiBankService } from '../../../../../../common/services/multi-bank.service';
import { ProductMappingService } from '../../../../../../common/services/productMapping.service';
import { ResolverService } from '../../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../../common/services/search-layout.service';
import { SessionValidateService } from '../../../../../../common/services/session-validate-service';
import { TransactionDetailService } from '../../../../../../common/services/transactionDetail.service';
import { HOST_COMPONENT } from '../../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { ProductStateService } from '../../../../../trade/lc/common/services/product-state.service';
import { SaveDraftService } from '../../../../../trade/lc/common/services/save-draft.service';
import { CurrencyConverterPipe } from '../../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../../trade/lc/initiation/services/filelist.service';
import { FormControlService } from '../../../../../trade/lc/initiation/services/form-control.service';
import { PrevNextService } from '../../../../../trade/lc/initiation/services/prev-next.service';
import { UtilityService } from '../../../../../trade/lc/initiation/services/utility.service';
import { emptyCurrency } from '../../../../../trade/lc/initiation/validator/ValidateAmt';
import { compareNewAmountToOld } from '../../../../../trade/lc/initiation/validator/ValidateLastShipDate';
import { CashCommonDataService } from '../../../../services/cash-common-data.service';
import { FtCashProductService } from '../../services/ft-cash-product.service';
import { FtCashProductComponent } from '../ft-cash-product/ft-cash-product.component';

//convert below statement to import
import moment from 'moment';
//const moment = require('moment');

interface IEntityModel {
  label: string;
  value: any;
}
interface IRadioModel {
  label: string;
  value: string;
  id: string;
}

interface IRecurOnModel {
  exactDay: boolean;
  lastDayOfMonth: boolean;
}

@Component({
  selector: 'app-ft-cash-general-details',
  templateUrl: './ft-cash-general-details.component.html',
  styleUrls: ['./ft-cash-general-details.component.scss'],
  providers: [
    { provide: HOST_COMPONENT, useExisting: FtCashGeneralDetailsComponent },
  ],
})
export class FtCashGeneralDetailsComponent
  extends FtCashProductComponent
  implements OnInit
{
  form: FCCFormGroup;
  mode: any;
  module = `${this.translateService.instant(
    FccConstants.FT_CASH_GENERAL_DETAILS
  )}`;
  fetching: boolean;
  entities = [];
  entityDataArray: IEntityModel[] = [];
  productCode: string;
  subProductCode: string;
  bankName: string;
  minOffset: number;
  maxOffset: number;
  isRecurring: string;
  frequencyOptions: IRadioModel[];
  recurOnValidationMap = new Map<string, IRecurOnModel>();
  largeParamDataMap = new Map<string, any[]>();
  subProductCodeMap = new Map<string, string>();
  selectedEntity = '';
  isEntitiesAvailable = false;
  selectedFundTransferType = '';
  val: any;
  enteredCurMethod = false;
  iso: any;
  flagDecimalPlaces: number;
  isoamt: any;
  nonNumericCurrencyValidator: any;
  currencyDecimalplacesThree: any;
  currencyDecimalplacesZero: any;
  
  constructor(
    protected commonService: CommonService,
    protected leftSectionService: LeftSectionService,
    protected router: Router,
    protected translateService: TranslateService,
    protected prevNextService: PrevNextService,
    protected utilityService: UtilityService,
    protected saveDraftService: SaveDraftService,
    protected searchLayoutService: SearchLayoutService,
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,
    protected stateService: ProductStateService,
    protected route: ActivatedRoute,
    protected eventEmitterService: EventEmitterService,
    protected transactionDetailService: TransactionDetailService,
    protected dialogService: DialogService,
    public fccGlobalConstantService: FccGlobalConstantService,
    protected productMappingService: ProductMappingService,
    protected fileList: FilelistService,
    protected dialogRef: DynamicDialogRef,
    protected confirmationService: ConfirmationService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected resolverService: ResolverService,
    protected fileListSvc: FilelistService,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected multiBankService: MultiBankService,
    protected dropdownAPIService: DropDownAPIService,
    protected taskService: FccTaskService,
    protected dashboardService: DashboardService,
    protected codeDataService: CodeDataService,
    protected cashCommonDataService: CashCommonDataService,
    protected sessionValidation: SessionValidateService,
    protected ftCashProductService: FtCashProductService
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
      fileList,
      dialogRef,
      currencyConverterPipe,
      ftCashProductService
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.productCode = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.PRODUCT
    );
    this.mode = this.commonService.getQueryParametersFromKey(
      FccGlobalConstant.MODE
    );
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
      }
    });
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.nonNumericCurrencyValidator = response.nonNumericCurrencyValidator;
        this.currencyDecimalplacesThree = response.currencyDecimalplacesThree;
        this.currencyDecimalplacesZero = response.currencyDecimalplacesZero;
      }
    });
    this.initializeFormGroup();
    this.form
      .get(FccGlobalConstant.FUND_TRANSFER_TYPE)
      .valueChanges.subscribe(() => {
        if (
          this.subProductCodeMap.size &&
          this.form.get(FccGlobalConstant.ENTITY_TEXT).value
        ) {
          this.patchFieldParameters(
            this.form.get(FccGlobalConstant.FUND_TRANSFER_TYPE),
            {
              disabled: false,
            }
          );
        } else {
          this.patchFieldParameters(
            this.form.get(FccGlobalConstant.FUND_TRANSFER_TYPE),
            {
              disabled: true,
            }
          );
        }
      });
    this.form
      .get(FccGlobalConstant.RECURRING_TRANSFER)
      .valueChanges.subscribe((value) => {
        this.onChangeRecurringTransfer(
          value === 'Y' ? true : false,
          this.subProductCode ? false : true
        );
      });
  }

  initializeFormGroup() {
    const sectionName = FccConstants.FT_CASH_GENERAL_DETAILS;
    this.form = this.stateService.getSectionData(sectionName);
    this.getEntityId();
    this.toggleControlFieldsVisibility(false);
    this.getstartDateForRecurring();
    this.getNoOfTransfersForRecurring();
    this.getFundTransferTypeOptions();
    this.patchFieldParameters(this.form.get('oneSpace01'), {
      rendered: false,
    });
    this.patchFieldParameters(this.form.get('twoSpace01'), {
      rendered: false,
    });
    this.form.updateValueAndValidity();
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
        // this.updateUserAccounts();
      });
  }

  getUserEntities() {
    this.updateUserEntities();
  }

  async updateUserEntities() {
    if (
      !(
        this.multiBankService.getEntityList() &&
        this.multiBankService.getEntityList().length
      )
    ) {
      await this.multiBankService.multiBankAPI(this.productCode, '');
    }
    this.multiBankService.getEntityList().forEach((entity) => {
      this.entities.push(entity);
    });
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
        this.isEntitiesAvailable = false;
      }
    } else if (this.entities.length === 1) {
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][
        FccGlobalConstant.REQUIRED
      ] = true;
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
      this.selectedEntity = this.entities[0].value.name;
      this.isEntitiesAvailable = true;
      this.getFundTransferTypeOptions();
    } else if (this.entities.length > 1) {
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][
        FccGlobalConstant.REQUIRED
      ] = true;
      this.form.get(FccGlobalConstant.ENTITY_TEXT)[this.params][
        FccGlobalConstant.RENDERED
      ] = true;
      this.isEntitiesAvailable = true;
    }
    this.patchFieldParameters(this.form.get(FccGlobalConstant.ENTITY_TEXT), {
      options: this.entities,
    });
  }

  onClickEntity() {
    if (this.form.get('Entity').value && this.form.get('Entity').value.label) {
      if (this.form.get('Entity').value.label !== this.selectedEntity) {
        this.selectedEntity = this.form.get('Entity').value.label;
        if (this.largeParamDataMap.size) {
          this.createLargeParamDataList();
        } else {
          this.getFundTransferTypeOptions();
        }
      }
    }
  }

  toggleControlFieldsVisibility(isVisible: boolean, hideAll = false) {
    const dependentFields = [
      'createFrom',
      'createFromOptions',
      'transferDetails',
      'accountFrom',
      'accountTo',
      'chargeCurrency',
      'chargeAmount',
      'date',
      'recurringTransfer',
      'customerReferenceView',
      'beneficiaryReferenceView',
      'transactionRemarks',
      'currency',
      'amount',
      'twoSpace01',
      'threeSpace01',
    ];
    this.setRenderOnlyFields(this.form, dependentFields, isVisible);
    this.form.get(FccGlobalConstant.RECURRING_TRANSFER).setValue('N');
    if (hideAll) {
      this.patchFieldParameters(this.form.get(FccConstants.DATE), {
        rendered: false,
      });
      this.patchFieldParameters(this.form.get('twoSpace01'), {
        rendered: false,
      });
    }
    this.form.updateValueAndValidity();
  }

  setRenderOnlyFields(form: FCCFormGroup, ids: string[], flag: boolean) {
    ids.forEach((id) => this.setRenderOnly(form, id, flag));
  }

  setRenderOnly(form: FCCFormGroup, id: string, flag: boolean) {
    this.patchFieldParameters(form.controls[id], { rendered: flag });
  }

  getstartDateForRecurring() {
    this.commonService.getBankDetails().subscribe((bankRes) => {
      this.bankName = bankRes.shortName;
      this.commonService
        .getParameterConfiguredValues(
          this.bankName,
          FccGlobalConstant.PARAMETER_P658,
          FccGlobalConstant.PRODUCT_FT,
          this.subProductCode
        )
        .subscribe((responseData) => {
          if (
            this.commonService.isNonEmptyValue(responseData) &&
            this.commonService.isNonEmptyValue(responseData.paramDataList)
          ) {
            const currentDate = new Date();
            this.minOffset = parseInt(
              responseData.paramDataList[0][FccGlobalConstant.DATA_1],
              10
            );
            this.maxOffset = parseInt(
              responseData.paramDataList[0][FccGlobalConstant.DATA_2],
              10
            );
            this.form.get(FccGlobalConstant.START_DATE)[this.params][
              FccGlobalConstant.MIN_DATE
            ] = moment(currentDate).add(this.minOffset, 'd').format();
            this.form.get(FccGlobalConstant.START_DATE)[this.params][
              FccGlobalConstant.MAX_DATE
            ] = moment(currentDate).add(this.maxOffset, 'd').format();
          }
        });
    });
  }

  checkIsRecurringPayment(subProductCode: string) {
    let isRecurring = false;
    this.commonService.getBankDetails().subscribe((bankRes) => {
      this.bankName = bankRes.shortName;
      this.commonService
        .getParameterConfiguredValues(
          this.bankName,
          FccGlobalConstant.PARAMETER_P659,
          FccGlobalConstant.PRODUCT_FT,
          subProductCode
        )
        .subscribe((responseData) => {
          if (
            responseData &&
            responseData.paramDataList &&
            responseData.paramDataList.length
          ) {
            isRecurring = this.convertYandNtoBoolean(
              responseData.paramDataList[0][FccGlobalConstant.DATA_1]
            );

          }
          this.patchFieldParameters(
            this.form.get(FccGlobalConstant.RECURRING_TRANSFER),
            {
              rendered: isRecurring,
            }
          );
          this.onChangeRecurringTransfer(
            this.form.get(FccGlobalConstant.RECURRING_TRANSFER).value
          );
          this.form.updateValueAndValidity();
        });
    });
  }

  getNoOfTransfersForRecurring() {
    this.commonService.getBankDetails().subscribe((bankRes) => {
      this.bankName = bankRes.shortName;
      this.commonService
        .getParameterConfiguredValues(
          this.bankName,
          FccGlobalConstant.PARAMETER_P660
        )
        .subscribe((responseData) => {
          if (
            this.commonService.isNonEmptyValue(responseData) &&
            this.commonService.isNonEmptyValue(responseData.paramDataList)
          ) {
            if (
              responseData.paramDataList &&
              responseData.paramDataList.length
            ) {
              this.frequencyOptions = [];
              responseData.paramDataList.forEach((element) => {
                this.frequencyOptions.push({
                  label: this.translateService.instant(
                    element[FccGlobalConstant.KEY_2]
                  ),
                  value: element[FccGlobalConstant.KEY_2],
                  id: element[FccGlobalConstant.KEY_2].toString().toLowerCase(),
                });
                this.recurOnValidationMap.set(
                  element[FccGlobalConstant.KEY_2],
                  {
                    exactDay: this.convertYandNtoBoolean(
                      element[FccGlobalConstant.DATA_1]
                    ),
                    lastDayOfMonth: this.convertYandNtoBoolean(
                      element[FccGlobalConstant.DATA_2]
                    ),
                  }
                );
              });

              this.patchFieldParameters(
                this.form.get(FccGlobalConstant.FREQUENCY_OPTIONS),
                { options: this.frequencyOptions }
              );
              if (
                this.commonService.isEmptyValue(
                  this.form.get(FccGlobalConstant.FREQUENCY_OPTIONS).value
                )
              ) {
                this.form
                  .get(FccGlobalConstant.FREQUENCY_OPTIONS)
                  .setValue(this.frequencyOptions[0].value);
              }
              this.onClickFrequencyOptions();
            }
          }
        });
    });
  }

  convertYandNtoBoolean(key: string): boolean {
    if (key === 'Y') {
      return true;
    }
    return false;
  }

  getFundTransferTypeOptions() {
    if (this.selectedEntity || !this.isEntitiesAvailable) {
      this.productCode = this.commonService.getQueryParametersFromKey(
        FccGlobalConstant.PRODUCT
      );
      this.commonService.getBankDetails().subscribe((bankRes) => {
        this.bankName = bankRes.shortName;

        // Get all sub_product_code with respective permissions for FT product code from GTP_LARGE_PARAM_KEY AND GTP_LARGE_PARAM_DATA
        this.commonService
          .getParamData(
            FccGlobalConstant.PRODUCT_FT,
            FccConstants.PARAMETER_P706
          )
          .subscribe((responseData) => {
            if (
              responseData &&
              responseData.largeParamDetails &&
              responseData.largeParamDetails.length
            ) {
              this.largeParamDataMap = new Map<string, any[]>();

              // create map of all data of largeParamDataList whose product_code is FT in largeParamKeyDetails
              responseData.largeParamDetails.forEach((element) => {
                const key =
                  element.largeParamKeyDetails[FccGlobalConstant.KEY_2];
                if (key === FccGlobalConstant.PRODUCT_FT) {
                  let value = element.largeParamDataList;
                  if (this.largeParamDataMap.has(key)) {
                    const existingValue = this.largeParamDataMap.get(key);
                    value = [...value, ...existingValue];
                  }
                  this.largeParamDataMap.set(key, value);
                }
              });
              this.createLargeParamDataList();
            }
          });
      });
    } else {
      this.patchFieldParameters(
        this.form.get(FccGlobalConstant.FUND_TRANSFER_TYPE),
        { disabled: true }
      );
    }
  }

  // create set of all data_3 from largeParamDataList whose data_5 is FT
  createLargeParamDataList() {
    this.subProductCodeMap.clear();
    for (const value of this.largeParamDataMap.get(
      FccGlobalConstant.PRODUCT_FT
    )) {
      // check permission for productCode_subProductCode_access
      const permissionName = `${FccGlobalConstant.PRODUCT_FT}_${
        value[FccGlobalConstant.DATA_1]
      }_access`.toLowerCase();
      if (this.isEntitiesAvailable) {
        if (
          this.commonService.getUserPermissionFlag(
            value[FccGlobalConstant.DATA_3]
          ) &&
          this.commonService.checkUserPermissionByEntity(
            this.selectedEntity,
            permissionName
          )
        ) {
          this.subProductCodeMap.set(
            value[FccGlobalConstant.DATA_1],
            value[FccGlobalConstant.DATA_2]
          );
        }
      } else {
        if (
          this.commonService.getUserPermissionFlag(
            value[FccGlobalConstant.DATA_3]
          )
        ) {
          this.subProductCodeMap.set(
            value[FccGlobalConstant.DATA_1],
            value[FccGlobalConstant.DATA_2]
          );
        }
      }
    }
    this.setFundTransferTypeOptions();
  }

  // create options from all the Set values
  setFundTransferTypeOptions() {
    const options = [];
    if (this.subProductCodeMap.size) {
      for (const [key, value] of this.subProductCodeMap) {
        options.push({
          label: this.translateService.instant(value),
          value: key,
        });
      }
    }
    if (this.subProductCodeMap.size >= 1) {
      this.patchFieldParameters(
        this.form.get(FccGlobalConstant.FUND_TRANSFER_TYPE),
        {
          options,
        }
      );
      if (this.subProductCodeMap.size === 1) {
        this.form
          .get(FccGlobalConstant.FUND_TRANSFER_TYPE)
          .setValue(options[0].value);
        this.subProductCode = options[0].value;
        this.toggleControlFieldsVisibility(true);
      } else {
        this.form.get(FccGlobalConstant.FUND_TRANSFER_TYPE).setValue('');
        this.subProductCode = '';
        this.toggleControlFieldsVisibility(false, true);
      }
      if (this.selectedEntity.length === 0) {
        this.patchFieldParameters(
          this.form.get(FccGlobalConstant.FUND_TRANSFER_TYPE),
          {
            disabled: true,
          }
        );
      } else {
        this.patchFieldParameters(
          this.form.get(FccGlobalConstant.FUND_TRANSFER_TYPE),
          {
            disabled: false,
          }
        );
      }
    } else {
      this.patchFieldParameters(
        this.form.get(FccGlobalConstant.FUND_TRANSFER_TYPE),
        {
          options,
          disabled: true,
        }
      );
      this.subProductCode = '';
      this.toggleControlFieldsVisibility(false, true);
    }

    this.form.updateValueAndValidity();
  }

  onClickFundTransferType() {
    if (this.form.get(FccGlobalConstant.FUND_TRANSFER_TYPE).value) {
      if (
        this.subProductCode === undefined ||
        this.subProductCode !==
          this.form.get(FccGlobalConstant.FUND_TRANSFER_TYPE).value
      ) {
        this.toggleControlFieldsVisibility(true);
        this.subProductCode = this.form.get(
          FccGlobalConstant.FUND_TRANSFER_TYPE
        ).value;
        this.checkIsRecurringPayment(
          this.form.get(FccGlobalConstant.FUND_TRANSFER_TYPE).value
        );
      }
    }
  }

  onChangeRecurringTransfer(isVisible: boolean, hideAll = false) {
    const dependentFields = [
      'startDate',
      'endDate',
      'frequency',
      'frequencyOptions',
      'frequencyHeader',
      'oneSpace01',
      'noOfTransfers',
    ];
    this.setRenderOnlyFields(this.form, dependentFields, isVisible);
    if (hideAll) {
      this.patchFieldParameters(this.form.get(FccConstants.DATE), {
        rendered: !isVisible,
      });
      this.patchFieldParameters(this.form.get('twoSpace01'), {
        rendered: !isVisible,
      });
    }
    this.form.updateValueAndValidity();
  }

  onClickFrequencyOptions() {
    const options: IRadioModel[] = [];
    let rendered = false;
    const recurOnOptions = this.recurOnValidationMap.get(
      this.form.get(FccGlobalConstant.FREQUENCY_OPTIONS).value
    );
    for (const key of Object.keys(recurOnOptions)) {
      options.push({
        label: this.translateService.instant(key),
        value: recurOnOptions[`${key}`],
        id: recurOnOptions[`${key}`],
      });
      if (recurOnOptions[`${key}`] && !rendered) {
        rendered = true;
      }
    }
    this.patchFieldParameters(
      this.form.get(FccGlobalConstant.RECUR_ON_OPTIONS),
      { options, rendered }
    );
    if (!this.form.get(FccGlobalConstant.RECUR_ON_OPTIONS).value) {
      this.form
        .get(FccGlobalConstant.RECUR_ON_OPTIONS)
        .setValue(options[0].value);
    }

    this.patchFieldParameters(this.form.get(FccGlobalConstant.RECUR_ON), {
      rendered,
    });
  }

  onClickCurrency(event) {
    if (event.value !== undefined) {
      this.enteredCurMethod = true;
      this.iso = event.value.currencyCode;
      this.isoamt = this.iso;
      const amt = this.form.get('amount');
      this.val = amt.value;
      amt.setValidators([
        Validators.pattern(this.commonService.getRegexBasedOnlanguage()),
      ]);
      this.setMandatoryField(this.form, 'amount', true);
      this.flagDecimalPlaces = 0;
      if (this.val !== '' && this.val !== null) {
        if (this.val <= 0) {
          this.form.get('amount').setErrors({ amountCanNotBeZero: true });
          return;
        } else {
          let valueupdated = this.commonService.replaceCurrency(this.val);
          valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
          this.form.get('amount').setValue(valueupdated);
        }
      } else {
        this.form.get('amount').setErrors({ required: true });
      }
      this.form.get('amount').updateValueAndValidity();
    }
    this.setAmountLengthValidator(FccGlobalConstant.AMOUNT_FIELD);
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
  }

  onClickAmount() {
    this.OnClickAmountFieldHandler('amount');
  }
  OnClickAmountFieldHandler(controlName: string) {
    if (this.getAmountOriginalValue(controlName)) {
      this.form
        .get(controlName)
        .setValue(this.getAmountOriginalValue(controlName));
      this.form.get(controlName).updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }

  onKeyupAmount() {
    const amt = this.form.get('amount');
    this.iso =
      this.commonService.isNonEmptyValue(
        this.form.get(FccGlobalConstant.CURRENCY).value
      ) &&
      this.commonService.isNonEmptyValue(
        this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode
      )
        ? this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode
        : null;
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso, 
        this.currencyDecimalplacesZero, this.currencyDecimalplacesThree)){
        return;
      }
    }
  }

  onBlurAmount() {
    if (!this.form.get(FccGlobalConstant.AMOUNT_FIELD).value) {
      this.form
        .get(FccGlobalConstant.AMOUNT_FIELD)
        .setErrors({ required: true });
    }
    if (
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).value &&
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).value <=
        FccGlobalConstant.ZERO
    ) {
      this.form
        .get(FccGlobalConstant.AMOUNT_FIELD)
        .setErrors({ amountCanNotBeZero: true });
    }
    const amt = this.form.get('amount');
    this.iso =
      this.commonService.isNonEmptyValue(
        this.form.get(FccGlobalConstant.CURRENCY).value
      ) &&
      this.commonService.isNonEmptyValue(
        this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode
      )
        ? this.form.get(FccGlobalConstant.CURRENCY).value.currencyCode
        : null;
    if(this.nonNumericCurrencyValidator){
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).setValidators([Validators.pattern(this.commonService.getRegexBasedOnlanguage())]);
      if(!this.commonService.isValidAmountValue(this.form, FccGlobalConstant.AMOUNT_FIELD, amt.value, this.iso, 
        this.currencyDecimalplacesZero, 
        this.currencyDecimalplacesThree)){
        return;
      }
    }
    if (
      this.commonService.getAmountForBackToBack() &&
      parseInt(this.commonService.replaceCurrency(amt.value), 10) >
        parseInt(
          this.commonService.replaceCurrency(
            this.commonService.getAmountForBackToBack()
          ),
          10
        )
    ) {
      this.form
        .get(FccGlobalConstant.AMOUNT_FIELD)
        .setValidators([compareNewAmountToOld]);
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
    } else if (this.commonService.getAmountForBackToBack()) {
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).clearValidators();
      this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
    }
    this.val = amt.value;
    if (this.val === null || this.val === undefined || this.val === '') {
      this.form.get('amount').setErrors({ amountNotNull: true });
      return;
    }
    if (this.val <= 0) {
      this.form.get('amount').setErrors({ amountCanNotBeZero: true });
      return;
    }
    if (this.val !== '') {
      if (this.flagDecimalPlaces === -1 && this.enteredCurMethod) {
        this.form.get('amount').setValidators(emptyCurrency);
      }
      if (this.iso !== '' && this.commonService.isNonEmptyValue(this.iso)) {
        let valueupdated = this.commonService.replaceCurrency(this.val);
        valueupdated = this.currencyConverterPipe.transform(valueupdated.toString(), this.iso);
        this.form.get('amount').setValue(valueupdated); 
      }
    }
    this.setAmountLengthValidator(FccGlobalConstant.AMOUNT_FIELD);
    this.form.get(FccGlobalConstant.AMOUNT_FIELD).updateValueAndValidity();
  }

  initiationofdata() {
    this.flagDecimalPlaces = -1;
    this.iso = '';
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.iso = this.commonService.masterDataMap.get('currency');
    }
  }
}
