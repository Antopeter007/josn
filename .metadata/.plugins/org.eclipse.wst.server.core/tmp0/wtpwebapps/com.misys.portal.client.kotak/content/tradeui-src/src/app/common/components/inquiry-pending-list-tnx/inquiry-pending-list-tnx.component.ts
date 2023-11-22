import { IUCommonDataService } from './../../../trade/iu/common/service/iuCommonData.service';
import { TradeCommonDataService } from './../../../trade/common/services/trade-common-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Constants } from '../../constants';
import { saveAs } from 'file-saver';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

interface PendingTransactions {
  ref_id: string;
  full_type: string;
  tnx_id: string;
  tnx_type_code: string;
  tnx_amt: string;
  sub_tnx_type_code: string;
  _group_id: string;
  message_type: string;
  inp_dttm: string;
  product_code: string;
  prod_stat_code: string;
  tnx_stat_code: string;
  bo_tnx_id: string;
  sub_tnx_stat_code: string;
  tnx_cur_code: string;
  sub_product_code: string;
  amd_no: string;
  entity: string;
  _row_type: string;
  status: string;
}

@Component({
  selector: 'fcc-common-inquiry-pending-list-tnx',
  templateUrl: './inquiry-pending-list-tnx.component.html',
  styleUrls: ['./inquiry-pending-list-tnx.component.scss']
})
export class InquiryPendingListTnxComponent implements OnInit {

  @Input() public bgRecord;
  pendingTransactions: PendingTransactions[] = [];
  tempTableData: any;
  tabledata: any[] = [];
  contextPath: string;
  cols: any[] = [];
  finalData: any[] = [];
  refId: string;
  imagePath: string;
  productCode: string;
  url: string;
  filterParameters: any;
  WINDOW_SIZE = 'width=800,height=500,resizable=yes,scrollbars=yes';

  constructor(protected activatedRoute: ActivatedRoute,
              public commonService: CommonService,
              protected translate: TranslateService,
              public tradeCommonDataService: TradeCommonDataService,
              protected commonDataService: IUCommonDataService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.refId = paramsId.refId;
      this.productCode = paramsId.productcode;
    });
    this.fetchRecords('');
    this.imagePath = this.commonService.getImagePath();
  }

  fetchRecords(exportType) {
    const CONTEXT_PATH = 'CONTEXT_PATH';
    this.contextPath = window[CONTEXT_PATH];
    this.url = '/restportal/listdata?Name=trade/listdef/customer/IU/pending';
    this.filterParameters = {productcode:  this.bgRecord.productCode, referenceid: this.bgRecord.refId};
    const baseUrl = this.contextPath + this.url;
    const paginatorParams = {start: 0, first: 0, rows: 50, count: 50};
    this.commonService.getTableData(baseUrl, JSON.stringify(this.filterParameters) , JSON.stringify(paginatorParams))
    .subscribe(result => {
      this.tempTableData = result.rowDetails;
      if (this.tempTableData) {
        this.tabledata = [];
        this.tempTableData.forEach(element => {
          const obj = {};
          element.index.forEach(ele => {
              obj[ele.name] = ele.value;
          });
          this.tabledata.push(obj);
        });
        this.pendingTransactions = this.tabledata;
        this.finalData = this.tabledata;
        if (exportType !== '') {
          this.exportDataBasedOnType(this.finalData, this.cols, exportType);
        }
    }});
  }

  navigateToPreview(tnxId: string, tnxTypeCode: string, subTnxTypeCode: string) {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;

    const isAmend = (tnxTypeCode === '03' &&
      (subTnxTypeCode === '01' || subTnxTypeCode === '02' || subTnxTypeCode === '03'));
    const isPendingAmendRelease = tnxTypeCode === '03' && subTnxTypeCode === '05';
    const isPendingMsgToBank = tnxTypeCode === '13';
    // For Amend , Amend release , Amend awaiting bene approval, Message to Bank, events before approval.
    if (isAmend || isPendingAmendRelease || isPendingMsgToBank) {
      url = `${url}/?option=FULLORSUMMARY&referenceid=${this.refId}&tnxid=${tnxId}&productcode=${this.productCode}`;
      url += `&tnxtype=${tnxTypeCode}&subtnxtype=${subTnxTypeCode}`;
    } else {
      url = `${url}/?option=FULLORSUMMARY&referenceid=${this.refId}&tnxid=${tnxId}&productcode=${this.productCode}`;
    }
    const myWindow = window.open(url, Constants.TRANSACTION_POPUP, this.WINDOW_SIZE);
    myWindow.focus();
  }

  navigateToEditScreen(tnxId: string, tnxTypeCode: string) {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.TRADE_ADMIN_LANDING_SCREEN;
    if (tnxTypeCode === 'Reporting') {
      url = `${url}/?mode=DRAFT&tnxtype=15&productcode=${this.productCode}`;
      url += `&operation=CREATE_REPORTING&referenceid=${this.refId}&tnxid=${tnxId}`;
    } else {
      url = `${url}/?mode=DRAFT&productcode=${this.productCode}&operation=CREATE_REPORTING&referenceid=${this.refId}&tnxid=${tnxId}`;
    }
    const myWindow = window.open(url, Constants.TARGET_SELF, this.WINDOW_SIZE);
    myWindow.focus();
  }

  navigateToUnsignedScreen(tnxId: string, tnxTypeCode: string) {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.TRADE_ADMIN_LANDING_SCREEN;
    if (tnxTypeCode === 'Reporting') {
      url = `${url}/?mode=UNSIGNED&tnxtype=15&productcode=${this.productCode}`;
      url += `&operation=CREATE_REPORTING&referenceid=${this.refId}&tnxid=${tnxId}`;
    } else {
      url = `${url}/?mode=UNSIGNED&productcode=${this.productCode}&operation=CREATE_REPORTING&referenceid=${this.refId}&tnxid=${tnxId}`;
      this.commonDataService.setMode(Constants.MODE_UNSIGNED);
      this.commonDataService.setmasterorTnx('tnx');
    }
    this.commonDataService.setRefId(this.refId);
    this.commonDataService.setTnxId(tnxId);
    const myWindow = window.open(url, Constants.TARGET_SELF, this.WINDOW_SIZE);
    myWindow.focus();
  }

  exportCSV() {
    this.fetchRecords('csv');
  }

  exportDataBasedOnType(tableData: any, columns: any, exportType: string) {
    let data = '';
    if (exportType === 'csv') {
      data = this.convertToCSV(tableData, columns);
      }
    const blob = new Blob([data], { type: `text/${exportType};charset=utf-8` });
    saveAs(blob, `LCListFile.${exportType}`);
    }

    convertToCSV(objArray, headerList): string {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
    const excludeCols = ['action'];
    let cellValue: string;

    for (const index of headerList) {
      if (!excludeCols.includes(index.field)) {
        row += `${index.header},`;
      }
    }
    row = row.slice(0, -1);
    str += `${row}\r\n`;
    // for (let i = 0; i < array.length; i++)
    for (const arr of array) {
      let line = '';
      for (const index of headerList) {
      if (!excludeCols.includes(index.field)) {
        const head = index.field;
        if (head === 'tnx_type_code') {
          cellValue = this.translate.instant(`N002_${arr[head]}`);
        } else if (head === 'prod_stat_code') {
          cellValue = this.translate.instant(`N005_${arr[head]}`);
        } else {
          cellValue = arr[head];
        }
        if (cellValue.indexOf(',') > -1) {
          line += `"${this.commonService.decodeHtml(cellValue)}",`;
        } else {
          line += `${this.commonService.decodeHtml(cellValue)},`;
        }
      }
      }
      str += `${line}\r\n`;
    }
    return str;
    }
}
