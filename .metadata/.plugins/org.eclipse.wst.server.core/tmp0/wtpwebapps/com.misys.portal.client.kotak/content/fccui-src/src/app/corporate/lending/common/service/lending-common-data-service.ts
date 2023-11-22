import { LocationStrategy } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';

import { FccGlobalConstantService } from '../../../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { ListDefService } from '../../../../common/services/listdef.service';
import { CommonService } from './../../../../common/services/common.service';


@Injectable({
  providedIn: 'root'
})
export class LendingCommonDataService {

  contentType = 'Content-Type';
  increaseAmtrrorsCheck: boolean;
  paymentAmtrrorsCheck: boolean;
  isChangeIncreaseDate: boolean;
  isChangePaymentDate: boolean;

  constructor(protected http: HttpClient,
              public fccGlobalConstantService: FccGlobalConstantService,
              public translate: TranslateService,
              public locationStrategy: LocationStrategy,
              protected router: Router,
              protected listService: ListDefService,
              protected commonService: CommonService) { }

  public getBorrowerDeals() {
    const obj = {};
    const headers = new HttpHeaders(obj);
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const completePath = this.fccGlobalConstantService.getAllDeals;
    return this.http
      .get<any>(
        completePath, { headers });
  }

  getAllDeals(custReferences) {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
          fromObject: {
            custReferences
          } });
    return this.http.get<any>(this.fccGlobalConstantService.getAllDeals, { headers , params, observe: 'response' });
  }

  getAllFacilities(dealIds, custReferences) {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
          fromObject: {
            dealIds,
            custReferences,
            source: ''
          } });
    return this.http.get<any>(this.fccGlobalConstantService.getAllFacilities, { headers , params, observe: 'response' });
  }

  getFacilityDetails(facilityId, custReferences) {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
      fromObject: {
        custReferences
      } });
    return this.http.get<any>(this.fccGlobalConstantService.getFacilityDetails(facilityId), { headers , params, observe: 'response' });
  }

  getDealDetails(dealId): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    return this.http.get<any>(this.fccGlobalConstantService.getDealDetails(dealId), { headers, observe: 'response' });
  }

  getLegalTextData(tnxId, productCode, facilityType, transactionType) {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
      fromObject: {
        tnxId,
        productCode,
        facilityType,
        transactionType,
      }
    });
    return this.http.get<any>(this.fccGlobalConstantService.getLegalTextDetails, { headers , params, observe: 'response' });
  }
  convertAccordionDataToTable(fileUploadControl) {
    switch (fileUploadControl[`key`]) {
      case 'feeCycleTable':
      return this.convertLoanAccordionDataToTable(fileUploadControl);
      default:
      return this.convertBKOldLoanAccordionDataToTable(fileUploadControl);
    }

  }

  convertLoanAccordionDataToTable(fileUploadControl) {
    let controledData = fileUploadControl.params.selectedRow;
    let returnData = [];
    const columnData = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE) === 'view' ?
      this.getColumnfeeCycleTableView() : this.getColumnfeeCycleTable();
    if (controledData && (Object.keys(controledData).length > 0 || controledData.length > 0)) {
      controledData = controledData.map(e => {
        if (e[`prod_stat_code`]) {
          e[`prod_stat_code`] =
            e[`prod_stat_code`].length > 2
              ? e[`prod_stat_code`]
              : this.translate.instant(`N005_${e[`prod_stat_code`]}`);
        }
        return e;
      });
      returnData = [...returnData, ...controledData];
    }
    return { column: columnData, data: returnData };

  }

  convertBKOldLoanAccordionDataToTable( fileUploadControl) {
    const controledData = fileUploadControl.params.options;
    let tmpData = {};
    let returnData = [];
    const columnData = this.getColumns();
    if (Object.keys(controledData).length > 0 || controledData.length > 0) {
      controledData.forEach(element => {
      tmpData = { ...tmpData, facility: element.header.split('|')[1].trimStart() };
      element.data.forEach(opt => {
        opt.options.forEach(el => {
          tmpData = { ...tmpData,
            pricingOption: el.header.split('|')[0].trim(),
            alias : el.header.split('|')[1].trim(),
            ccy: el.description.split(' ')[0].trim(),
            currentOutStandingAmount : el.description.split(' ')[1].trim()
          };
          el.data.forEach(e => {
            columnData.forEach(col => {
              if (col.header === e.label){
                tmpData = { ...tmpData, [col.field]: e.value };
              }
            });
          });
        });
        returnData = [...returnData, tmpData];
      });
    });
  }
    return { column: columnData, data: returnData };
  }
  getColumnfeeCycleTableView() {
    return [
      {
        field: 'ref_id',
        header: `${this.translate.instant('ref_id')}`,
        width: '16%',
      },
      {
        field: 'fee_description',
        header: `${this.translate.instant('FEE')}`,
        width: '16%',
      },
      {
        field: 'cycle_start_date',
        header: `${this.translate.instant('startDate')}`,
        width: '10%',
      },
      {
        field: 'cycle_end_date',
        header: `${this.translate.instant('endDate')}`,
        width: '10%',
      },
      {
        field: 'cycle_due_date',
        header: `${this.translate.instant('DUE_DATE')}`,
        width: '10%',
      },
      {
        field: 'ft_cur_code',
        header: `${this.translate.instant('CURCODE')}`,
        width: '8%'
      },
      {
        field: 'fee_amt',
        header: `${this.translate.instant('FEE_AMOUNT')}`,
        width: '16%',
        align: 'right'
      },
      {
        field: 'cycle_paid_amt',
        header: `${this.translate.instant('FEE__PAID_TO_DATE_AMOUNT')}`,
        width: '12%',
        align: 'right'
      },
      {
        field: 'cycle_due_amt',
        header: `${this.translate.instant('FEE_AMOUNT_DUE')}`,
        width: '12%',
        align: 'right'
      },
      {
        field: 'ft_amt',
        header: `${this.translate.instant('FEE_AMOUNT_TO_PAY')}`,
        width: '12%',
        align: 'right'
      },
      {
        field: 'prod_stat_code',
        header: `${this.translate.instant('STATUS')}`,
        width: '14%',
      }
    ];
  }
  getColumnfeeCycleTable() {
    return [
      {
        field: 'feeDesc',
        header: `${this.translate.instant('FEE')}`,
        width: '16%',
      },
      {
        field: 'start_date',
        header: `${this.translate.instant('startDate')}`,
        width: '12%',
      },
      {
        field: 'end_date',
        header: `${this.translate.instant('endDate')}`,
        width: '12%',
      },
      {
        field: 'due_date',
        header: `${this.translate.instant('DUE_DATE')}`,
        width: '12%',
      },
      {
        field: 'ft_cur_code',
        header: `${this.translate.instant('CURCODE')}`,
        width: '10%'
      },
      {
        field: 'fee_amt',
        header: `${this.translate.instant('FEE_AMOUNT')}`,
        width: '16%',
        align: 'right'
      },
      {
        field: 'paid_to_date_amount',
        header: `${this.translate.instant('FEE__PAID_TO_DATE_AMOUNT')}`,
        width: '16%',
        align: 'right'
      },
      {
        field: 'amount_due',
        header: `${this.translate.instant('FEE_AMOUNT_DUE')}`,
        width: '16%',
        align: 'right'
      },
      {
        field: 'amt_to_pay',
        header: `${this.translate.instant('FEE_AMOUNT_TO_PAY')}`,
        width: '16%',
        align: 'right'
      }
    ];
  }
  getColumns() {
    return [
      {
        field: 'alias',
        header: `${this.translate.instant('alias')}`,
        width: '16%',
      },
      {
        field: 'channelReference',
        header: `${this.translate.instant('channelReference')}`,
        width: '20%',
      },
      {
        field: 'facility',
        header: `${this.translate.instant('facility')}`,
        width: '10%',
        direction: 'right',
      },
      {
        field: 'effectiveDate',
        header: `${this.translate.instant('effectiveDate')}`,
        width: '15%',
      },
      {
        field: 'rolloverDate',
        header: `${this.translate.instant('repricing_date')}`,
        width: '15%',
      },
      {
        field: 'pricingOption',
        header: `${this.translate.instant('pricingOption')}`,
        width: '14%',
      },
      {
        field: 'ccy',
        header: `${this.translate.instant('ccy')}`,
        width: '10%',
      },
      {
        field: 'currentOutStandingAmount',
        header: `${this.translate.instant('currentOutStandingAmount')}`,
        width: '23%',
        align: 'right'
      }
    ];
  }

  setPDFTableData(fieldName, sectionForm) {
    let shallowParams = {};
    if ((fieldName === 'bulkLoansList')) {
      shallowParams = this.convertBKOldLoanAccordionDataToTable(sectionForm[FccGlobalConstant.CONTROLS][fieldName]);
    }
    if (fieldName === 'feeCycleTable') {
      shallowParams = this.convertLoanAccordionDataToTable(sectionForm[FccGlobalConstant.CONTROLS][fieldName]);
    }
    return { column: shallowParams[`column`], data: shallowParams[`data`] };
  }

  getInterestDetails(boRefID: string, ccy: string): Observable<any> {
    const filterValues = {};
    const boRefIdKey = 'borefid';
    filterValues[boRefIdKey] = boRefID;
    const loanCCYKey = 'loan_ccy';
    filterValues[loanCCYKey] = ccy;
    const listdefXml = 'loan/listdef/customer/LN/inquiryLNRolloverFormInterestDetails';
    const subject = new Subject<string>();
    this.listService.getTableData(listdefXml, JSON.stringify(filterValues), JSON.stringify({}))
      .subscribe(result => {
        if (result && result.rowDetails) {
          subject.next(result.rowDetails);
        }
      });
    return subject.asObservable();
  }
}
