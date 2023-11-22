import { CommonService } from './../../../services/common.service';
import { Router } from '@angular/router';
import { DashboardService } from './../../../services/dashboard.service';
import { Component, OnInit, Input } from '@angular/core';
import { ScreenMapping } from '../../../../base/model/screen-mapping';
import { SessionValidateService } from './../../../services/session-validate-service';
import { ListDefService } from '../../../../common/services/listdef.service';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from './../../../core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../../core/fcc-global-constants';

@Component({
  selector: 'fcc-div-table',
  templateUrl: './div-table.component.html',
  styleUrls: ['./div-table.component.scss']
})

// This component is not fully developed and is no where used.
// Purpose:
      // To build generic div table and render records fetched by listdef.
// ToDo:
      // Width of each divcell should be adjustable based on content of the cell.
      // Rowexpansion feature is supported which is resulting the branding issues.
      // Request parameters used to navigate to Dojo screen has to be made dynamic.
      // RowExpansion content has to be decided based on widget configuration.
export class DivTableComponent implements OnInit {
  @Input()
  listdefName;
  contextPath: any;
  showFilterSection = false;
  dojoUrl;
  numRows: number;
  transactionList: any[] = [];
  tabledata: any = {};
  defaultColumns;
  additionColumns;
  moreDataDisplayed = false;
  count: number;
  start = 0;
  dataList: any[] = [];
  flagArray: boolean[] = [];
  showSpinner = true;
  two = 2;

  constructor(
    protected dashboardService: DashboardService,
    protected router: Router,
    protected commonService: CommonService,
    protected sessionValidation: SessionValidateService,
    protected listService: ListDefService,
    protected translateService: TranslateService,
    protected fccGlobalConstantService: FccGlobalConstantService
  ) {}

  ngOnInit() {
    this.contextPath = this.commonService.getContextPath();
    const paginatorParams = { first: 0, rows: 10, sortOrder: -1 };
    this.listService.getMetaData(this.listdefName, FccGlobalConstant.EMPTY_STRING, FccGlobalConstant.EMPTY_STRING)
      .subscribe(columnResult => {
        this.getColumns(columnResult);
      });
    this.listService.getTableData(this.listdefName, '' , JSON.stringify(paginatorParams))
      .subscribe(result => {
        this.numRows = result.count;
        this.transactionList = this.formatResult(result);
        for (let k = 0; k < this.transactionList.length; k++) {
          this.flagArray.push(false);
        }
        this.showSpinner = false;
        this.getData(this.count);
      });
  }

  getTnxInProgressList() {
    this.dashboardService
      .getTransactionInProgress(this.count * this.two, this.start)
      .then(
        response => {
          if (
            response.error !== undefined &&
            response.error.message === 'SESSION_INVALID'
          ) {
            this.sessionValidation.IsSessionValid();
          } else {
            this.numRows = response.numRows;
            this.transactionList = response.transactionList;
            for (let k = 0; k < this.transactionList.length; k++) {
              this.flagArray.push(false);
            }
            this.showSpinner = false;
            this.getData(this.count);
          }
        },
        () => {
          //eslint : no-empty-function
        }
      );
  }

  getData(count: number) {
    this.dataList = this.transactionList.slice(0, count);
  }

  getCounterPartyHeading(productCode: string) {
    let counterPartyHeading: string;
    counterPartyHeading = 'beneficiary';
    const counterPartyArray: string[] = ['PO', 'SO', 'IN', 'IP', 'CN', 'CR'];
    if (counterPartyArray.indexOf(productCode) > -1) {
      counterPartyHeading = 'counterParty';
    }
    return counterPartyHeading;
  }

  onRowClick(data: any) {
    const productCode = data.productCode;
    const screenName = ScreenMapping.screenmappings[productCode];
    const tnxTypeCode = data.tnxTypeCode;
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
    url = `${url}${this.fccGlobalConstantService.servletName}/screen/${screenName}`;
    url = `${url}?mode=${mode}&tnxtype=${tnxTypeCode}&subtnxtype=${subTnxTypeCode}`;
    url = `${url}&referenceid=${referenceId}&tnxid=${tnxId}&option=null`;
    this.router.navigate([]).then(() => {
      window.open(url, '_self');
    });
  }

  onClick() {
    this.dojoUrl = '';
    if (this.contextPath !== null && this.contextPath !== '') {
      this.dojoUrl = this.contextPath;
    }
    this.dojoUrl = `${this.dojoUrl}${this.fccGlobalConstantService.servletName}`;
    this.dojoUrl = `${this.dojoUrl}/screen/MessageCenterScreen?operation=LIST_PENDING`;
    this.router.navigate([]).then(() => {
      window.open(this.dojoUrl, '_self');
    });
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
          obj[ele.name] = ele.value;
            });
        data.push(obj);
      });
    }
    return data;
  }

  getColumns(data: any) {
    if (data.Column) {
      const tempCols = [];
      const expandTempCols = [];
      data.Column.forEach(element => {
        if (!element.hidden) {
          tempCols.push({
          field: element.name,
          header: element.localizationkey ? this.translateService.instant(element.localizationkey) : '',
          hidden: element.hidden
        });
      } else {
        expandTempCols.push({
        field: element.name,
        header: this.translateService.instant(element.name).toUpperCase()
        });
      }
    });
      this.defaultColumns = tempCols;
      this.additionColumns = expandTempCols;
    }
  }

  toCamelCase(str: string) {
    str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }
}
