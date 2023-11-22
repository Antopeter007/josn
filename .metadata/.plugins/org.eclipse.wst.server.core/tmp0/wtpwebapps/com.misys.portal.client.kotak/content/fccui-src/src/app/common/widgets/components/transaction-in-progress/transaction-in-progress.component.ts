import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { ScreenMapping } from '../../../../base/model/screen-mapping';
import { ListDefService } from '../../../../common/services/listdef.service';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../core/fcc-global-constants';
import { CommonService } from './../../../services/common.service';
import { DashboardService } from './../../../services/dashboard.service';
import { SessionValidateService } from './../../../services/session-validate-service';
import { HideShowDeleteWidgetsService } from './../../../services/hide-show-delete-widgets.service';

@Component({
  selector: 'fcc-common-transaction-in-progress',
  templateUrl: './transaction-in-progress.component.html',
  styleUrls: ['./transaction-in-progress.component.scss']
})
export class TransactionInProgressComponent implements OnInit {
  contextPath: any;
  listdefName = 'core/listdef/customer/MC/openTransactionInProgressList';
  showFilterSection = false;
  dojoUrl;
  numRows: number;
  transactionInProgressList: any[] = [];
  moreDataDisplayed = false;
  count: number;
  start = 0;
  dataList: any[] = [];
  flagArray: boolean[] = [];
  showSpinner = true;
  two = 2;
  metadata;
  defaultSortOrder: number;
  defaultSortField: string;
  defaultRow: number;
  dashboardType: any;
  returnedTransaction: any;
  viewAllTnxPermission = false;
  checkCustomise: any;

  @Input () dashboardName;
  currencySymbolDisplayEnabled = false;

  constructor(
    protected dashboardService: DashboardService,
    protected router: Router,
    protected commonService: CommonService,
    protected sessionValidation: SessionValidateService,
    protected hideShowDeleteWidgetsService: HideShowDeleteWidgetsService,
    protected listService: ListDefService,
    protected translateService: TranslateService,
    protected fccGlobalConstantService: FccGlobalConstantService
  ) {}

  ngOnInit() {
    let dashBoardURI = '';
    if (this.dashboardName === undefined) {
      this.dashboardType = 'global';
    } else {
      dashBoardURI = this.dashboardName.split('/');
      this.dashboardType = dashBoardURI[dashBoardURI.length - 1].toUpperCase() ;
    }
    this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P809).subscribe(
      (response) => {
      if (this.commonService.isNonEmptyValue(response) &&
      this.commonService.isNonEmptyValue(response.paramDataList) && response.paramDataList[0]) {
        this.currencySymbolDisplayEnabled = response.paramDataList[0][FccGlobalConstant.DATA_1] === 'y';
      }
    });
    this.count = FccGlobalConstant.defaultTransactionDisplay;
    this.returnedTransaction = FccGlobalConstant.N015_RETURNED;
    this.contextPath = this.commonService.getContextPath();
    this.getTnxInProgressList();

    this.hideShowDeleteWidgetsService.customiseSubject.subscribe(data => {
      this.checkCustomise = data;
    });
    this.commonService.getUserPermission(FccGlobalConstant.MESSAGE_CENTER_ACCESS).subscribe(permission => {
      if (permission) {
        this.viewAllTnxPermission = true;
      }
    });
  }

  getTnxInProgressList() {
    this.listService.getMetaData(this.listdefName, FccGlobalConstant.EMPTY_STRING, FccGlobalConstant.EMPTY_STRING)
      .subscribe(response => {
        this.metadata = response;
        this.setDefaultProperties();
        this.getRecords();
      });
  }

  getData(count: number) {
    this.dataList = this.transactionInProgressList.slice(0, count);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCounterPartyHeading(productCode: string) {
    return 'counterParty';
  }

  onRowClick(data: any) {
    const productCode = data.productCode;
    const subProductCode = data.subProductCode;
    const screenName = ScreenMapping.screenmappings[productCode];
    const tnxTypeCode = data.tnxTypeCode;
    const action = data.action;
    const productCodeLN = 'LN';
    const productCodeTD = 'TD';
    const productCodeBK = FccGlobalConstant.PRODUCT_BK;
    const lendingEditPermission = 'LN_EDIT';

    const subTnxTypeCode =
      data.subTnxTypeCode === undefined || data.subTnxTypeCode === ''
        ? 'null'
        : data.subTnxTypeCode;
    const referenceId = data.refId;
    const tnxId = data.tnxId;
    const mode = data.tnxStatCode === FccGlobalConstant.N004_UNCONTROLLED ? 'UNSIGNED' : 'DRAFT';
    let url = '';
    if (
      this.contextPath !== undefined &&
      this.contextPath !== null &&
      this.contextPath !== ''
    ) {
      url = this.contextPath;
    }
    url = `${url}${this.fccGlobalConstantService.servletName}`;
    url = `${url}/screen/${screenName}?mode=${mode}&tnxtype=${tnxTypeCode}&subtnxtype=${subTnxTypeCode}`;

    if (productCode === FccGlobalConstant.PRODUCT_FT && (subProductCode === FccGlobalConstant.SUB_PRODUCT_CODE_BILLP
      || subProductCode === FccGlobalConstant.SUB_PRODUCT_CODE_BILLS)) {
      url = `${url}&referenceid=${referenceId}&tnxid=${tnxId}&option=${subProductCode}`;
    } else {
      url = `${url}&referenceid=${referenceId}&tnxid=${tnxId}&option=null`;
    }

    this.commonService.getSwiftVersionValue();
    if (this.commonService.isAngularProductUrl(data.productCode, data.subProductCode) &&
      (!(this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
        (productCode === FccGlobalConstant.PRODUCT_BG || productCode === FccGlobalConstant.PRODUCT_BR)))) {
      if (data.tnxStatCode === FccGlobalConstant.N004_INCOMPLETE) {

        if ( productCodeLN === productCode && !(action.indexOf(lendingEditPermission) > -1)){
          return;
         }
        this.handleTransactionInProgressRecords(data);
      } else if (data.tnxStatCode === FccGlobalConstant.N004_UNCONTROLLED) {
        if (productCodeTD === productCode) {
          this.router.navigate([FccGlobalConstant.REVIEW_SCREEN], { queryParams: { referenceid: data.refId,
            tnxid: data.tnxId, productCode: data.productCode, subProductCode: data.subProductCode, tnxTypeCode: data.tnxTypeCode,
            mode: FccGlobalConstant.VIEW_MODE, action: FccGlobalConstant.APPROVE, operation : FccGlobalConstant.LIST_INQUIRY } });
        } else if (productCodeBK === productCode
             || data.productCode === FccGlobalConstant.PRODUCT_SE) {
          this.router.navigate([FccGlobalConstant.REVIEW_SCREEN], { queryParams: { referenceid: data.refId,
            tnxid: data.tnxId, productCode: data.productCode, subProductCode: data.subProductCode,
            mode: FccGlobalConstant.VIEW_MODE, action: FccGlobalConstant.APPROVE, operation : FccGlobalConstant.LIST_INQUIRY } });
            
        } else {
          this.router.navigate([FccGlobalConstant.REVIEW_SCREEN], { queryParams: { referenceid: data.refId,
            tnxid: data.tnxId, productCode: data.productCode, tnxTypeCode: data.tnxTypeCode, 
            mode: FccGlobalConstant.VIEW_MODE, action: FccGlobalConstant.APPROVE, operation : FccGlobalConstant.LIST_INQUIRY } });
        }
      }
    } else {
      this.router.navigate([]).then(() => {
        window.open(url, '_self');
      });
    }
  }

  onClick() {
    const dashBoardURI = this.dashboardName.split('/');
    const dashboardNameVal = dashBoardURI[dashBoardURI.length - 1].toUpperCase();
    this.commonService.setWidgetClicked(dashboardNameVal);
    this.router.navigate(['productListing'], { queryParams: { dashboardType: dashboardNameVal,
    subProductCode: null, option: 'transactionInProgress' } });
  }

  expandAndCollapseRow(i: number, event) {
    event.stopPropagation();
    this.flagArray[i] = !this.flagArray[i];
  }

  formatResult(result: any) {
    const data = [];
    const tempTableData = result.rowDetails;
    if (tempTableData) {
      tempTableData.forEach(element => {
        const obj = {};
        element.index.forEach(ele => {
          obj[this.toCamelCase(ele.name)] = this.commonService.decodeHtml(ele.value);
            });
        data.push(obj);
      });
    }
    return data;
  }
  toCamelCase(str: string) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }

  setDefaultProperties() {
    this.defaultSortOrder = this.metadata.ListDefDefaultProperties[0].default_order_type === 'd' ? -1 : 1;
    this.defaultSortField = this.metadata.ListDefDefaultProperties[0].default_order;
    this.defaultRow = this.metadata.ListDefDefaultProperties[0].page;
  }

  getRecords() {
    const filterparams = { dashboardType: this.dashboardType };
    const paginatorParams = { first: 0, rows: this.defaultRow, sortOrder: this.defaultSortOrder };
    this.listService.getTableData(this.listdefName, JSON.stringify(filterparams) , JSON.stringify(paginatorParams))
      .subscribe(result => {
        this.numRows = result.count;
        this.transactionInProgressList = this.formatResult(result);
        for (let k = 0; k < this.transactionInProgressList.length; k++) {
          if (this.currencySymbolDisplayEnabled) {
            const curCode = this.transactionInProgressList[k]['tnxCurCode'];
            const amt = this.transactionInProgressList[k]['tnxAmt'];
            let val = this.commonService.getCurrencySymbol(curCode, amt);
            if (val.indexOf(curCode) > -1) {
              val = val.replace(curCode, '').trim();
            }
            this.transactionInProgressList[k]['tnxAmt'] = val;
          }
          this.flagArray.push(false);
        }
        this.showSpinner = false;
        this.getData(this.count);
      });
  }

  get dataDisplayTitle(): string {
    return this.moreDataDisplayed === false
    ? this.translateService.instant('viewMore')
    : this.translateService.instant('viewLess');
  }

  handleTransactionInProgressRecords(data) {
    const prodCode = this.commonService.isnonEMptyString(data.productCode) ?
                      data.productCode : '';
    const subProdCode = this.commonService.isnonEMptyString(data.subProductCode) ?
                          data.subProductCode : '';
    const entity = this.commonService.isnonEMptyString(data.entity) ?
                    data.entity : '';
    const hasPermission = this.commonService.isUserHavingSavePermission(prodCode, subProdCode, entity);
    if(hasPermission) {
      this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: { refId: data.refId,
        tnxId: data.tnxId, productCode: data.productCode, subProductCode: data.subProductCode,
        tnxTypeCode: data.tnxTypeCode, subTnxTypeCode: data.subTnxTypeCode,
        mode: FccGlobalConstant.DRAFT_OPTION } });
    } else {
      this.router.navigate(['reviewScreen'], { queryParams: { tnxid: data.tnxId, referenceid: data.refId,
        productCode: data.productCode,
        subProductCode: data.subProductCode, mode: FccGlobalConstant.VIEW_MODE, operation: 'LIST_INQUIRY',
        subTnxTypeCode: data.subTnxTypeCode, tnxTypeCode: data.tnxTypeCode } });
    }
  }
}
