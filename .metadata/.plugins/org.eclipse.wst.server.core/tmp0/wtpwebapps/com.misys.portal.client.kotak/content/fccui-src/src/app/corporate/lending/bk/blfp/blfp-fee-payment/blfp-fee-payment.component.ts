import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { FCCFormGroup } from '../../../../../base/model/fcc-control.model';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { MultiBankService } from '../../../../../common/services/multi-bank.service';
import { ResolverService } from '../../../../../common/services/resolver.service';
import { SearchLayoutService } from '../../../../../common/services/search-layout.service';
import { LeftSectionService } from '../../../../../corporate/common/services/leftSection.service';
import { ProductStateService } from '../../../../trade/lc/common/services/product-state.service';
import { CurrencyConverterPipe } from '../../../../trade/lc/initiation/pipes/currency-converter.pipe';
import { CustomCommasInCurrenciesPipe } from '../../../../trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../../../trade/lc/initiation/services/filelist.service';
import { UtilityService } from '../../../../trade/lc/initiation/services/utility.service';
import { FacilityDetailsService } from '../../../ln/initiation/services/facility-details.service';
import { BlfpProductComponent } from '../blfp-product/blfp-product.component';
import { ListDefService } from './../../../../../common/services/listdef.service';
import { HOST_COMPONENT } from './../../../../../shared/FCCform/form/form-resolver/form-resolver.directive';

@Component({
  selector: 'app-blfp-fee-payment',
  templateUrl: './blfp-fee-payment.component.html',
  styleUrls: ['./blfp-fee-payment.component.scss'],
  providers: [{ provide: HOST_COMPONENT, useExisting: BlfpFeePaymentComponent }]
})
export class BlfpFeePaymentComponent extends BlfpProductComponent implements OnInit, OnDestroy {
  contextPath: string;
  tnxTypeCode: any;
  option: any;
  form: FCCFormGroup;
  mode: any;
  module = `${this.translateService.instant('blfpFeeComponent')}`;
  facilityID: any;
  ongoingFeeList: any = [];
  ongoingFeeListSubscription: Subscription[] = [];
  curCode: any;
  feeRIDList: any = [];
  feeCycleTableOptions = [];
  itemArray = [];
  updatedProviders: any;
  feeSummary = [];
  totalFeeAmt: any;
  totalAmtDue: any;
  totalAmtToPay: any;
  totalPaidToDate: any;
  selectedRecords: any[] = [];
  borrowerRef: any;
  generalDetailsSection: FCCFormGroup;
  entity: any;
  rowRecords: any[] = [];
  facilityMaturityDate: any;
  facilityExpiryDate: any;
  facilityEffectiveDate: any;
  showSpinner: boolean;
  canEnableEdit: boolean;
  amountErrors: any;
  bankServerDate: any;
  bankServerDateObj: Date;

  constructor(
    protected commonService: CommonService,
    protected translateService: TranslateService,
    protected router: Router,
    protected fileListSvc: FilelistService,
    protected eventEmitterService: EventEmitterService,
    protected stateService: ProductStateService,
    protected confirmationService: ConfirmationService,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected searchLayoutService: SearchLayoutService,
    protected utilityService: UtilityService,
    protected resolverService: ResolverService,
    protected dialogRef: DynamicDialogRef,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected listService: ListDefService,
    protected multiBankService: MultiBankService,
    protected facilityDetailsService: FacilityDetailsService,
    protected leftSectionService: LeftSectionService
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
      currencyConverterPipe
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.showSpinner = true;
    this.contextPath = this.fccGlobalConstantService.contextPath;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const sectionName = FccGlobalConstant.BLFP_FEE_PAYMENT_COMPONENT;
    this.form = this.stateService.getSectionData(sectionName);
    this.generalDetailsSection = this.stateService.getSectionData(
      FccGlobalConstant.BLFP_GENERAL_DETAILS);
    if (this.mode === FccGlobalConstant.DRAFT_OPTION) {
      this.multiBankService
        .getCustomerBankDetailsAPI(
          FccGlobalConstant.PRODUCT_LN,
          '',
          FccGlobalConstant.REQUEST_INTERNAL
      )
      .subscribe((res) => {
        this.multiBankService.initializeLendingProcess(res);
        this.multiBankService.getBorrowerReferenceInternalList().forEach(internalRef => {
          if (this.generalDetailsSection.get('feeDetailsReference').value === internalRef.value) {
            this.patchFieldValueAndParameters(this.generalDetailsSection.get('lendingRefID'), internalRef.id, {});
            this.facilityDetailsService.setCurrentBorrower(internalRef.id);
            this.getValidationFields();
          }
        });
      });
    } else {
      this.getValidationFields();
    }
  }
  setBankServerDate() {
    if (this.form.get('amdDate') === null || (this.commonService.isEmptyValue(this.form.get('amdDate').value))) {
      this.commonService.globalBankDate$.subscribe(
        date => {
          this.bankServerDateObj = date;
          this.bankServerDate = date.toLocaleDateString('en-In');
          this.form.get('loanEffectiveDate')[this.params][FccGlobalConstant.MIN_DATE] = this.bankServerDateObj;
        }
      );
    } else {
      const dateParts = this.form.get('loanEffectiveDate').value ?? this.form.get('amdDate').value;
      this.bankServerDateObj = new Date(dateParts[FccGlobalConstant.LENGTH_2],
        dateParts[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1, dateParts[FccGlobalConstant.LENGTH_0]);
    }
  }
  getValidationFields(){
    if (this.generalDetailsSection){
      this.canEnableEdit = (this.generalDetailsSection.get('canEditFeeAmt').value === 'true') ? true : false;
      this.facilityID = this.generalDetailsSection.get('facilityID').value;
      this.borrowerRef = this.generalDetailsSection.get('lendingRefID').value;
      this.entity = this.generalDetailsSection.get('feeDetailsEntity').value;
      const faciltiyOptions = this.generalDetailsSection.controls.facilityDetails[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      if (faciltiyOptions && faciltiyOptions.length > 0){
        this.facilityEffectiveDate = faciltiyOptions.filter((data) => data.key === 'effectiveDate')[0]
          ? faciltiyOptions.filter((data) => data.key === 'effectiveDate')[0].value : null;
        this.facilityMaturityDate = faciltiyOptions.filter((data) => data.key === 'maturityDate')[0] ?
          faciltiyOptions.filter((data) => data.key === 'maturityDate')[0].value : null;
        this.facilityExpiryDate = faciltiyOptions.filter((data) => data.key === 'expiryDate')[0] ?
          faciltiyOptions.filter((data) => data.key === 'expiryDate')[0].value : null;
      }
    }
    this.initializeFormGroup();
  }

  initializeFormGroup() {
    if (this.mode !== FccGlobalConstant.VIEW) {
      this.disableFormIfNoBorrowerSelected();
      this.getOngoingFeeList();
      this.setBankServerDate();
    }
    this.form.updateValueAndValidity();
  }
  disableFormIfNoBorrowerSelected() {
    if (this.borrowerRef === null) {
      this.form.get('warningMsgFP')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('feeCycleTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('loanEffectiveDate').disable();
      this.form.get('loanEffectiveDate').updateValueAndValidity();
      this.form.updateValueAndValidity();
    } else {
      this.form.get('warningMsgFP')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      this.form.get('feeCycleTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      this.form.get('loanEffectiveDate').enable();
      this.form.get('loanEffectiveDate').updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }

  onClickLoanEffectiveDate(event) {
    if (event.value) {
      this.patchFieldValueAndParameters(this.form.get('bulkEffectiveDate'), event.value, {});
      this.patchFieldValueAndParameters(this.form.get('loanEffectiveDate'), event.value, {});
      this.validateLoanEffectiveDate();
      this.updateCommonData();
    }
  }

  setMessages() {
    const interpolateParams = 'interpolateParams';
    const facilityName = this.generalDetailsSection.controls.facilityDetails[FccGlobalConstant.PARAMS][FccGlobalConstant.SECTION_HEADER];
    this.form.get('warningMsgNoFee')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
    this.form.get('warningMsgNoFee')[FccGlobalConstant.PARAMS][FccGlobalConstant.FIELDICONSTYLE] = 'nobtnMsg';
    this.form.get('warningMsgNoFee')[interpolateParams] = {
      key: facilityName
    };
    this.form.get('feeCycleTable')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
    this.patchFieldParameters(this.form.get('feeCycleTable'), { options: [] });
    this.patchFieldParameters(this.form.get('feeCycleTable'), { contextPath: this.contextPath });
    this.patchFieldParameters(this.form.get('feeCycleTable'), { dataKey: 'dataKey' });
    this.patchFieldParameters(this.form.get('feeCycleTable'), { selectedRow:  [] });
    this.patchFieldParameters(this.form.get('feeCycleTable'), { footerMsg: null });
    this.form.updateValueAndValidity();
  }

  getOngoingFeeList() {
    const paginatorParams = {};
    const filterValues = {};
    filterValues[FccGlobalConstant.BORROWER_ID] = this.generalDetailsSection.get('lendingRefID').value;
    filterValues[FccGlobalConstant.FACILITY_ID] = this.facilityID;
    const filterParams = JSON.stringify(filterValues);
    if (
      this.borrowerRef !== null &&
      (this.form.get('loanEffectiveDate').value === '' ||
        this.form.get('loanEffectiveDate').value === null)
    ) {
      this.patchFieldValueAndParameters(
        this.form.get('loanEffectiveDate'),
        this.bankServerDateObj,
        {}
      );
      const event = {
        value: this.bankServerDateObj,
      };
      this.onClickLoanEffectiveDate(event);
    }
    this.ongoingFeeListSubscription.push(
      this.listService.getTableData(
        'loan/listdef/customer/LN/inquiryLNFacilityFeeList', filterParams, JSON.stringify(paginatorParams))
        .subscribe(result => {
        this.ongoingFeeList = result.rowDetails;
        this.showSpinner = false;
        if (this.ongoingFeeList && this.ongoingFeeList.length === 0 && this.borrowerRef !== null) {
          this.setMessages();
        } else {
          this.form.get('warningMsgNoFee')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
        }
        this.feeRIDList = [];
        if (Array.isArray(this.ongoingFeeList)) {
          if (this.ongoingFeeList.length > 0) {
            this.ongoingFeeList.forEach((record) => {
              const selectedData = ['type', 'description', 'feeRID', 'effectiveDate', 'actualDueDate', 'currency'];
              const obj1 = {
                type: 'type',
                description: 'feeType', feeRID: 'fee_rid', effectiveDate: 'effectiveDate', actualDueDate: 'dueDate', currency: 'fac_ccy'
              };
              const obj = {};
              obj[FccGlobalConstant.FACILITY_ID] = this.facilityID;
              Object.keys(record.index).forEach((element) => {
                selectedData.forEach((key) => {
                  if (record.index[element].name === key) {
                    obj[obj1[key]] = this.commonService.decodeHtml(record.index[element].value);
                  }
                  if (record.index[element].name === 'currency') {
                    this.curCode = record.index[element].value;
                  }
                });
              });
              this.feeRIDList.push(obj);
            });
          }
        }
        this.getFeeCyleData();
      })
    );
  }

  getFeeCyleData() {
    const paginatorParams = {};
    forkJoin(
      this.feeRIDList.map(feeData =>
        this.listService.getTableData(
          'loan/listdef/customer/LN/inquiryLNFacilityFeeCycle', JSON.stringify(feeData), JSON.stringify(paginatorParams)).pipe(
          map(result => {
            const bulkArray = [];
            bulkArray.push(result.rowDetails);
            return bulkArray;
          })
        )
      )
    ).subscribe((p) => {
      this.updatedProviders = [].concat(...p);
      this.setFeeDataObject();
      if (this.amountErrors) {
        this.form.get('feeCycleTable').setErrors(this.amountErrors);
        this.form.get('feeCycleTable').markAsTouched();
        this.form.get('feeCycleTable').markAsDirty();
      }
    });
  }

  setFeeDataObject() {
    const obj = [];
    this.showSpinner = false;
    this.updatedProviders.forEach(updatedProvider => {
      const selectedData = [
        "feeType",
        "period",
        "start_date",
        "end_date",
        "due_date",
        "amount_due",
        "paid_to_date_amount",
        "feeRID",
        "feeDesc",
      ];
      updatedProvider.forEach((feeDetails) => {
        const obj1 = {};
        feeDetails.index.forEach((element) => {
          selectedData.forEach((key) => {
            if (element.name === key) {
              obj1[element.name] = this.commonService.decodeHtml(element.value);
            }
          });
        });
        if (obj1 && obj1[`amount_due`] && parseFloat(this.commonService.replaceCurrency(obj1[`amount_due`])) > 0){
          obj.push(obj1);
        }
      });
    });
    if (obj && obj.length === 0){
      this.setMessages();
    } else {
      obj.sort((a, b) => {
        const x = this.utilityService.transformddMMyyyytoDate(a.start_date);
        const y = this.utilityService.transformddMMyyyytoDate(b.start_date);
        if (x > y) {
          return 1;
        }
        if (x < y) {
          return -1;
        }
        return 0;
      });
      this.setFeeDataOptions(obj);
    }
  }

  setFeeDataOptions(obj) {
    this.feeCycleTableOptions = [];
    this.feeSummary = [];
    this.feeRIDList.forEach(element => {
      const obj1 = {};
      this.itemArray = [];
      obj1[`headerLabel`] = element.feeType;
      obj1[`isErrorPresent`] = false;
      obj.forEach(ele => {
        if (element.fee_rid === ele.feeRID) {
          const feeAmt = parseFloat(
            this.commonService.replaceCurrency(ele.paid_to_date_amount)
            ) + parseFloat(this.commonService.replaceCurrency(ele.amount_due));
          const feeAmtUpdated = this.setFormattedAmt(feeAmt);
          ele[`amount_due`] = this.setFormattedAmt(ele[`amount_due`]);
          ele[`fee_amt`] = feeAmtUpdated;
          ele[`dataKey`] = ele.feeDesc + ele.period;
          ele[`selected`] = 'false';
          ele[`amt_to_pay`] = this.setFormattedAmt(0);
          ele[`ft_cur_code`] = this.curCode;
          this.itemArray.push(ele);
        }
      });
      if (this.itemArray && this.itemArray.length > 0) {
        this.feeSummary = [
          {
            field: 'ccy',
            value: this.curCode,
            align: 'center'
          },
          {
            field: 'fee_amt',
            value: this.setFormattedAmt(this.itemArray.map(fee => parseFloat(
              this.commonService.replaceCurrency(fee.fee_amt)
              )).reduce(
                (acc, fee) => fee + acc)),
            align: this.dir === 'rtl' ? 'left' : 'right'
          },
          {
            field: 'paid_to_date_amount',
            value: this.setFormattedAmt(this.itemArray.map(fee => parseFloat(
              this.commonService.replaceCurrency(fee.paid_to_date_amount)
              )).reduce((acc, fee) => fee + acc)),
            align: this.dir === 'rtl' ? 'left' : 'right'
          },
          {
            field: 'amount_due',
            value: this.setFormattedAmt(this.itemArray.map(fee => parseFloat(
              this.commonService.replaceCurrency(fee.amount_due)
              )).reduce((acc, fee) => fee + acc)),
              align: this.dir === 'rtl' ? 'left' : 'right'
          },
          {
            field: 'amt_to_pay',
            value: this.setFormattedAmt(0),
            align: this.dir === 'rtl' ? 'left' : 'right'
          },
        ];
      } else {
          this.feeSummary = [
            {
              field: 'ccy',
              value: this.curCode,
              align: 'center'
            },
            {
              field: 'fee_amt',
              value: this.setFormattedAmt(0),
              align: this.dir === 'rtl' ? 'left' : 'right'
            },
            {
              field: 'paid_to_date_amount',
              value: this.setFormattedAmt(0),
                align: this.dir === 'rtl' ? 'left' : 'right'
            },
            {
              field: 'amount_due',
              value: this.setFormattedAmt(0),
              align: this.dir === 'rtl' ? 'left' : 'right'
            },
            {
              field: 'amt_to_pay',
              value: this.setFormattedAmt(0),
              align: this.dir === 'rtl' ? 'left' : 'right'
            }
          ];
      }
      obj1[`data`] = this.itemArray;
      obj1[`columns`] = this.getTableColumns();
      obj1[`feeSummary`] = this.feeSummary;
      this.feeCycleTableOptions.push(obj1);
    });
    const createdRec = JSON.parse(this.generalDetailsSection.get('feeListReq').value);
    const ftTnxRecord = 'ft_tnx_record';
    if (createdRec === undefined || createdRec === '' || createdRec === null){
      this.amountErrors = { feeCycleTableError: true };
    }
    if (createdRec && createdRec[ftTnxRecord] !== undefined && createdRec[ftTnxRecord].length === undefined){
      createdRec[ftTnxRecord] = [createdRec[ftTnxRecord]];
    }
    if (createdRec && createdRec[ftTnxRecord] && createdRec[ftTnxRecord].length > 0){
      createdRec[ftTnxRecord].forEach((rec) => {
        const event = {
            data : rec
          };
        event.data.period = rec.fee_cycle_id ? rec.fee_cycle_id : rec.cycle_id;
        event.data.feeDesc = rec.fee_description;
        event.data.dataKey = rec.fee_description + (rec.fee_cycle_id ? rec.fee_cycle_id : rec.cycle_id);
        event.data.amt_to_pay = rec.ft_amt;
        this.sumAllValues(event, true, '', null);
      });
    }
    this.patchFieldValueAndParameters(this.form.get('loanEffectiveDate'),
        this.form.get('bulkEffectiveDate').value, {});
    this.validateLoanEffectiveDate();
    this.patchFieldParameters(this.form.get('feeCycleTable'), { options: this.feeCycleTableOptions });
    this.patchFieldParameters(this.form.get('feeCycleTable'), { contextPath: this.contextPath });
    this.patchFieldParameters(this.form.get('feeCycleTable'), { dataKey: 'dataKey' });
    this.patchFieldParameters(this.form.get('feeCycleTable'), { selectedRow:  this.rowRecords });
    this.patchFieldParameters(this.form.get('feeCycleTable'), { footerMsg: `${this.translateService.instant('totalAmt')}` });
    this.form.updateValueAndValidity();
  }

  getTableColumns() {
    return [
      {
        field: 'start_date',
        header: `${this.translateService.instant('start_date')}`,
        width: '12%'
      },
      {
        field: 'end_date',
        header: `${this.translateService.instant('end_date')}`,
        width: '12%'
      },
      {
        field: 'due_date',
        header: `${this.translateService.instant('LN_FACILITY_DUE_DATE')}`,
        width: '13%'
      },
      {
        field: 'ft_cur_code',
        header: `${this.translateService.instant('ccy')}`,
        width: '5%',
        align: 'center'
      },
      {
        field: 'fee_amt',
        header: `${this.translateService.instant('ln_fee_amt')}`,
        width: '12%',
        align: this.dir === 'rtl' ? 'left' : 'right'
      },
      {
        field: 'paid_to_date_amount',
        header: `${this.translateService.instant('paid_toDate_amt')}`,
        width: '13%',
        align: this.dir === 'rtl' ? 'left' : 'right'
      },
      {
        field: 'amount_due',
        header: `${this.translateService.instant('LN_AMOUNT_DUE')}`,
        width: '13%',
        align: this.dir === 'rtl' ? 'left' : 'right'
      },
      {
        field: 'amt_to_pay',
        header: `${this.translateService.instant('amt_to_pay')}`,
        width: '13%',
        align: this.dir === 'rtl' ? 'left' : 'right',
        editable: this.canEnableEdit ? true : false,
        class : '',
        formattedNullValue: this.setFormattedAmt(0)
      },
      {
        field: 'dataKey',
        header: `${this.translateService.instant('dataKey')}`,
        width: '0%',
        hidden: 'true'
      },
      {
        field: 'selected',
        header: `${this.translateService.instant('dataKey')}`,
        width: '0%',
        hidden: 'true'
      },
      {
        field: 'feeType',
        header: `${this.translateService.instant('feeType')}`,
        width: '0%',
        hidden: 'true'
      },
      {
        field: 'period',
        header: `${this.translateService.instant('FACILITY_FEE_CYCLE')}`,
        width: '0%',
        hidden: true
      },
      {
        field: 'ft_cur_code',
        header: `${this.translateService.instant('CURCODE')}`,
        width: '0%',
        hidden: true
      },
    ];
  }

  onFormTableHeaderCheckboxToggle(event: any, key: any) {
    if (event.checked &&
         this.rowRecords && this.rowRecords.length > 0) {
      this.rowRecords = this.rowRecords.filter(rec => rec.feeDesc !== key);
    } else if (!event.checked &&
      this.rowRecords && this.rowRecords.length > 0) {
        this.rowRecords = this.rowRecords.filter(rec => rec.feeDesc !== key);
    }
    this.sumAllValues(event, null, key, event.checked);
  }

  setFormattedAmt(amtToBeFormatted) {
    let amt = this.commonService.replaceCurrency(amtToBeFormatted.toString());
    amt = this.currencyConverterPipe.transform(
      amt.toString(), this.curCode);
    return amt;
  }

  sumAllValues(event: any, isfromSelect?: any, feeType?: string, isAllChecked?: boolean) {
    // let edit = isEdit;
    this.feeCycleTableOptions.forEach((feeCycle) => {
      let tableSummation = 0;
      if ((event && event.data && event.data.feeDesc === feeCycle.headerLabel)
       || (feeType && feeType === feeCycle.headerLabel)) {
        feeCycle.data.forEach((feeData) => {
          if (feeType && feeType !== '' && isAllChecked) {
            feeData.selected = 'true';
            feeData.amt_to_pay = (feeData.amt_to_pay !== this.setFormattedAmt(0)) ? feeData.amt_to_pay : feeData.amount_due;
            this.rowRecords.push(feeData);
          } else if (feeType && feeType !== '' && !isAllChecked) {
            feeData.amt_to_pay = this.setFormattedAmt(0);
            feeData.selected = 'false';
          }
          // else if (parseFloat(feeData.period) < parseFloat(event.data.period) && !isEdit && isfromSelect) {
          //   const rowIndex = this.rowRecords.findIndex(fee =>
          //     (fee.dataKey === event.data.dataKey));
          //   if (rowIndex > -1){
          //     this.rowRecords.splice(rowIndex, 1);
          //   }
          //   feeData.amt_to_pay = (feeData.amt_to_pay !== this.setFormattedAmt(0)) ? feeData.amt_to_pay : feeData.amount_due;
          //   feeData.selected = 'true';
          //   this.rowRecords.push(feeData);

          // }
          // else if (parseFloat(feeData.period) > parseFloat(event.data.period) && !isEdit && !isfromSelect) {
          //   feeData.selected = 'false';
          //   feeData.amt_to_pay = this.setFormattedAmt(0);
          //   const rowIndex = this.rowRecords.findIndex(fee =>
          //     (fee.dataKey === event.data.dataKey));
          //   if (rowIndex > -1){
          //     this.rowRecords.splice(rowIndex, 1);
          //   }
          // }
          else if (feeData.dataKey === event.data.dataKey) {
            if (isfromSelect) {
              const rowIndex = this.rowRecords.findIndex(fee =>
                (fee.dataKey === event.data.dataKey));
              if (rowIndex > -1){
                this.rowRecords.splice(rowIndex, 1);
              }
              feeData.selected = 'true';
              feeData.amt_to_pay = event.data.amt_to_pay;
              feeData.ref_id = event.data.ref_id;
              feeData.tnx_id = event.data.tnx_id;
              this.rowRecords.push(feeData);
            }
            else {
              feeData.selected = 'false';
              const rowIndex = this.rowRecords.findIndex(fee =>
                (fee.dataKey === event.data.dataKey));
              if (rowIndex > -1){
                this.rowRecords.splice(rowIndex, 1);
              }
            }
          }
          if (feeData.selected === 'true') {
            let tempData = feeData.amt_to_pay;
            tempData = parseFloat(this.commonService.replaceCurrency(tempData));
            if (tempData === 0) {
              feeCycle.isErrorPresent = true;
              this.form.get('feeCycleTable').setValidators([Validators.required]);
              this.form.get('feeCycleTable').setErrors({ feeCycleTableError: true });
              this.amountErrors = { amountCanNotBeZero: true };
              this.form.get('feeCycleTable').markAsDirty();
              this.form.get('feeCycleTable').markAsTouched();
            }
            tableSummation = tableSummation + tempData;
          }
        });
        feeCycle.feeSummary.forEach((fee) => {
          if (fee.field === 'amt_to_pay') {
            fee.value = this.setFormattedAmt(tableSummation);
          }
        });
      }
    });
    this.rowRecords.forEach(data=>{
      data.amt_to_pay = this.setFormattedAmt(data.amt_to_pay);
    });
    this.patchFieldParameters(this.form.get('feeCycleTable'), { options: this.feeCycleTableOptions });
    this.updateCommonData();
    this.patchFieldParameters(this.form.get('feeCycleTable'), { selectedRow:  this.rowRecords });
    this.setHiddenFields();
  }

  onPanelTableRowUnSelect(event: any) {
    let clickFromKeyboard = false;
    if (event && event.data && !event.originalEvent && event.currentTarget.classList.contains('mat-checkbox')) {
      clickFromKeyboard = true;
    }
    if (event && event.data && (clickFromKeyboard ||
      (event.originalEvent && event.originalEvent.target.classList.contains('mat-checkbox-inner-container')))) {
      if (!clickFromKeyboard){
        event.originalEvent.preventDefault();
        event.originalEvent.stopPropagation();
      } else {
        event.preventDefault();
        event.stopPropagation();
      }
      event.data.selected = 'false';
      const updatedRec = [];
      this.rowRecords.forEach((data) => {
        if (data.feeDesc === event.data.feeDesc && (parseFloat(data.period) !== parseFloat(event.data.period))){
          updatedRec.push(data);
        }
        if (data.feeDesc !== event.data.feeDesc){
          updatedRec.push(data);
        }
      });
      event.data.amt_to_pay = this.setFormattedAmt(0);
      this.rowRecords = updatedRec;
      this.sumAllValues(event, false);
    }
  }

  onPanelTableRowSelect(event: any) {
    let clickFromKeyboard = false;
    if (event && event.data && !event.originalEvent && event.currentTarget.classList.contains('mat-checkbox')) {
      clickFromKeyboard = true;
    }
    if (event && event.data && (clickFromKeyboard ||
      (event.originalEvent && event.originalEvent.target.classList.contains('mat-checkbox-inner-container')))) {
      if (event.data.selected === 'true') {
        this.onPanelTableRowUnSelect(event);
      } else{
        event.data.amt_to_pay = (event.data.amt_to_pay !== this.setFormattedAmt(0)) ? event.data.amt_to_pay : event.data.amount_due;
        event.data.selected = 'true';
        if (!clickFromKeyboard){
          event.originalEvent.preventDefault();
          event.originalEvent.stopPropagation();
        } else {
          event.preventDefault();
          event.stopPropagation();
        }
        // this.rowRecords = this.rowRecords.filter((data) => data.feeDesc !== event.data.feeDesc);
        this.sumAllValues(event, true);
      }
    }
  }

  updateCommonData() {
    const effectiveDate = this.utilityService.transformDateFormat(this.form.get('loanEffectiveDate').value);
    this.selectedRecords = [];
    this.rowRecords.forEach(rec => {
      this.selectedRecords.push(this.patchFeePaymentData(rec));
    });
    this.selectedRecords.forEach((selectedFee) => {
      selectedFee.fee_effective_date = effectiveDate;
      selectedFee.fee_borrower_reference = this.borrowerRef;
      selectedFee.fee_entity = this.entity ? this.entity.shortName : null;
    });
    const obj1 = {};
    const ftTnxRecord = 'ft_tnx_record';
    obj1[ftTnxRecord] = this.selectedRecords;
    this.patchFieldValueAndParameters(this.generalDetailsSection.get('feeTnxList'), JSON.stringify(obj1), {});
    this.patchFieldValueAndParameters(this.generalDetailsSection.get('feeListReq'), JSON.stringify(obj1), {});
    this.holdErrors();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onkeyUpTextField(event, key, rowData) {
    if (event && event.target && event.target.value && rowData) {
      rowData.class = '';
      let tempAmtToPay = event.target.value;
      tempAmtToPay = parseFloat(this.commonService.replaceCurrency(tempAmtToPay));
      let tempAmtDue = rowData.amount_due;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      tempAmtDue = parseFloat(this.commonService.replaceCurrency(tempAmtDue));
      if (tempAmtToPay > 0){
        rowData.amt_to_pay = this.setFormattedAmt(event.target.value);
      } else {
        rowData.amt_to_pay = this.setFormattedAmt(0);
      }
      const newEvent = {
        data : rowData
      };
      if (rowData.selected === 'true'){
        this.sumAllValues(newEvent, true, '', null);
      }
    }
  }

  patchFeePaymentData(rowData) {
    const newFeePayment = {
        fee_ref_id: rowData.ref_id ? rowData.ref_id : '',
        fee_tnx_id: rowData.tnx_id ? rowData.tnx_id : '',
        sub_product_code: FccGlobalConstant.SUB_PRODUCT_LNFP,
        fee_entity: '',
        fee_borrower_reference: '',
        fee_effective_date: '',
        fee_type: rowData.feeType,
        fee_description: rowData.feeDesc,
        fee_rid: rowData.feeRID,
        fee_cycle_id: rowData.period,
        fee_cycle_start_date: rowData.start_date,
        fee_cycle_end_date: rowData.end_date,
        fee_cycle_due_date: rowData.due_date,
        fee_amt: this.commonService.replaceCurrency(rowData.fee_amt),
        fee_cur_code: this.curCode,
        cycle_due_amt: this.commonService.replaceCurrency(rowData.amount_due),
        ft_amt: this.commonService.replaceCurrency(rowData.amt_to_pay),
        ft_cur_code: this.curCode,
        tnx_amt: this.commonService.replaceCurrency(rowData.amt_to_pay),
        tnx_cur_code: this.curCode,
        cycle_paid_amt: this.commonService.replaceCurrency(rowData.paid_to_date_amount)
    };
    return newFeePayment;
  }

  validateLoanEffectiveDate() {
      if (!this.form.get('loanEffectiveDate').value) {
        return true;
      }
      // Test that the loan effective date is greater than or equal to the
      // current date
      const currentDate = new Date();
      // set the hours to 0 to compare the date values
    currentDate.setHours(0, 0, 0, 0);
    this.bankServerDateObj.setHours(0, 0, 0, 0);
      // compare the values of the current date and transfer date
      const isValid = this.utilityService.compare(this.form.get('loanEffectiveDate').value, this.bankServerDateObj) < 0 ? false : true;
      if (!isValid) {
        this.form.get('loanEffectiveDate').setErrors(
          {
            effectiveDateGreaterThanSystemDate: {
              date: this.utilityService.transformDateFormat(
                this.form.get('loanEffectiveDate').value)
            }
          }
        );
      }

      // Test that the loan effective date is greater than or equal to the
      // facility effective date
      if (this.facilityEffectiveDate) {
        const facilityEffectiveDate = this.utilityService.transformddMMyyyytoDate(this.facilityEffectiveDate);
        if (!this.utilityService.compareDateFields(this.form.get('loanEffectiveDate').value, facilityEffectiveDate)) {
          this.form.get('loanEffectiveDate').setErrors(
            {
              loanEffDateGreaterThanFacEffDateError: {
                date: this.utilityService.transformDateFormat(
                  this.form.get('loanEffectiveDate').value),
                faclityDate: this.facilityEffectiveDate
              }
            }
          );
        }
    }

      // Test that the loan effective date is less than or equal to the
      // facility expiry date
      if (this.facilityExpiryDate) {
        const facExpDate = this.utilityService.transformddMMyyyytoDate(this.facilityExpiryDate);
        if (!this.utilityService.compareDateFields(facExpDate, this.form.get('loanEffectiveDate').value)) {
          this.form.get('loanEffectiveDate').setErrors(
            {
              loanEffDateLessThanFacExpDateError: {
                date: this.utilityService.transformDateFormat(
                  this.form.get('loanEffectiveDate').value),
                expiryDate: this.facilityExpiryDate
              }
            }
          );
        }
      }

      // Test that the loan effective date is less than or equal to the
      // facility maturity date
      if (this.facilityMaturityDate) {
        const facMaturityDate = this.utilityService.transformddMMyyyytoDate(this.facilityMaturityDate);
        if (!this.utilityService.compareDateFields(facMaturityDate, this.form.get('loanEffectiveDate').value)) {
          this.form.get('loanEffectiveDate').setErrors(
            {
              loanEffDateLessThanFacMatDateError: {
                date: this.utilityService.transformDateFormat(
                  this.form.get('loanEffectiveDate').value),
                maturityDate: this.facilityMaturityDate
              }
            }
          );
        }
      }
      if (this.form.get('loanEffectiveDate') && this.form.get('loanEffectiveDate').errors) {
        this.form.get('loanEffectiveDate').markAsDirty();
        this.form.get('loanEffectiveDate').markAsTouched();
        // this.loanEffectiveDateErrors = this.form.get('loanEffectiveDate').errors;
      }
    }

  setHiddenFields() {
    const set = new Set();
    let totalAmt = 0;
    let highestAmt = 0;
    this.feeCycleTableOptions.forEach((feeType) => {
      feeType.data.forEach((rec) => {
        if (rec.selected === 'true') {
          set.add(rec.feeDesc);
          let tempData = rec.amt_to_pay;
          tempData = parseFloat(this.commonService.replaceCurrency(tempData));
          totalAmt = totalAmt + tempData;
          if(tempData >= highestAmt) {
            highestAmt = tempData;
          }
        }
      });
    });
    let finalStr = '';
    set.forEach((feeDesc) => {
      finalStr = feeDesc + ', ' + finalStr;
    });
    finalStr = finalStr.replace(/,\s*$/, '');
    this.patchFieldValueAndParameters(this.form.get('bulkFeeTypesDesc'), finalStr, {});
    this.patchFieldValueAndParameters(this.form.get('tnxAmt'),
      this.customCommasInCurrenciesPipe.transform(totalAmt.toString(), this.curCode), {});
    this.patchFieldValueAndParameters(this.form.get('bkTotalAmt'),
      this.customCommasInCurrenciesPipe.transform(totalAmt.toString(), this.curCode), {});
    this.patchFieldValueAndParameters(this.form.get('bkHighestAmt'),
      this.customCommasInCurrenciesPipe.transform(highestAmt.toString(), this.curCode), {});
    this.patchFieldValueAndParameters(this.form.get('bkCurCode'), this.curCode, {});
    this.patchFieldValueAndParameters(this.form.get('tnxCurCode'), this.curCode, {});
    this.form.updateValueAndValidity();
  }

  holdErrors() {
    if (this.generalDetailsSection && this.form) {
      this.amountErrors = null;
      const createdRec = JSON.parse(this.generalDetailsSection.get('feeListReq').value);
      const ftTnxRecord = 'ft_tnx_record';
      if (createdRec && createdRec[ftTnxRecord] !== undefined && createdRec[ftTnxRecord].length === undefined){
        createdRec[ftTnxRecord] = [createdRec[ftTnxRecord]];
      }
      if (createdRec === undefined || createdRec === '' || createdRec === null || (createdRec.ft_tnx_record &&
        createdRec.ft_tnx_record.length === 0)){
        this.amountErrors = { feeCycleTableError: true };
        this.form.get('feeCycleTable').setValue(null);
      }
      if (createdRec && createdRec[ftTnxRecord] && createdRec[ftTnxRecord].length > 0) {
        createdRec[ftTnxRecord].forEach((rec) => {
          if (rec.ft_amt === this.setFormattedAmt(0)) {
            this.amountErrors = { amountCanNotBeZero: true };
          }
        });
      }
      if (!this.amountErrors){
        this.form.get('feeCycleTable').setValue(this.generalDetailsSection.get('feeListReq').value);
      }
      if (this.amountErrors){
        this.form.get('feeCycleTable')[this.params][FccGlobalConstant.REQUIRED] = true;
        // this.form.get('feeCycleTable').setValidators([Validators.required]);
        this.form.get('feeCycleTable').setErrors(this.amountErrors);
        this.form.get('feeCycleTable').markAsTouched();
        this.form.get('feeCycleTable').markAsDirty();
      } else {
        this.form.get('feeCycleTable').setErrors(null);
        this.form.get('feeCycleTable').markAsTouched();
        this.form.get('feeCycleTable').markAsDirty();
        this.form.get('feeCycleTable').updateValueAndValidity();
      }
    }
  }

  ngOnDestroy() {
    this.holdErrors();
    this.stateService.setStateSection(FccGlobalConstant.BLFP_FEE_PAYMENT_COMPONENT, this.form);
  }
}
