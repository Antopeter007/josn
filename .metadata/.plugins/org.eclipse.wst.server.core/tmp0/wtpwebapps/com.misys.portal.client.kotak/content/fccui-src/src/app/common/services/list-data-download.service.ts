import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './common.service';
import { PdfGeneratorService } from './pdf-generator.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { ListDefService } from './listdef.service';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';
import { UtilityService } from '../../corporate/trade/lc/initiation/services/utility.service';
import { CorporateDetails } from '../model/corporateDetails';
import { TitleCasePipe } from '@angular/common';
@Injectable({
    providedIn: 'root'
})

export class ListDataDownloadService {
    private language = this.translate.currentLang;
    private downloadOption: any;
    private pdfMode: any;
    private listDataDownloadLimit: any;
    private completeTableData;
    private tableName: any;
    private fileName: any;
    private tableHeaders: any[] = [];
    private tableHeadersCSV: any[] = [];
    private tableData: any;
    private dateFormatForExcelDownload: any;
    private excludeColumns = [FccGlobalConstant.ACTION];
    private columnHeader: any;
    private columnData: any;
    private isGroupsDownload: boolean;
    private groupTableData: any;
    private groupDetails: any;
    private setPaymentsRemarks = false;
    private displayNote: any;
    private setPaymentsRepairRejectRemarksHeaders: any;
    private setPaymentsRepairRejectRemarksData: any;
    private bankDetails: string[] = [];
    public corporateDetails: CorporateDetails;
    private paymentsBulk = false;
    private selectedColHeader = [];
    currencySymbolDisplayEnabled = false;
    isAccSummaryDashoabrd = false;
    private loggedInUserDetails;
    isListLevelAccSummaryDownload = false;
    isAccountStatementDownload = false;
    statementFilters = {};
    aggregateAmt = [];
    accStatementRecordLimit: any;
  widgetDetails: any;


    constructor(protected translate: TranslateService, protected commonService: CommonService,
                protected pdfGeneratorService: PdfGeneratorService, protected listService: ListDefService,
                public datePipe: DatePipe, protected titleCasePipe:TitleCasePipe,
                protected utilityService: UtilityService) {
                  this.commonService.getBankDetails().subscribe(data => {
                    this.bankDetails = data as string[];
                  });
                  this.commonService.getCorporateDetailsAPI(FccGlobalConstant.REQUEST_INTERNAL).subscribe(response => {
                    this.corporateDetails = response.body;
                  });
                  this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P809).subscribe(
                    (response) => {
                      if (this.commonService.isNonEmptyValue(response) &&
                      this.commonService.isNonEmptyValue(response.paramDataList) && response.paramDataList[0]) {
                        this.currencySymbolDisplayEnabled = response.paramDataList[0][FccGlobalConstant.DATA_1] === 'y';
                      }
                    }
                  );
                }

  formatTableData() {
    if (this.columnData) {
      const rowData = [];
      this.columnData.forEach(element => {
        const tab = element;
        const changeString = (s) => s.split(/\.?(?=[A-Z])/).join('_').toLowerCase();
        rowData.push(Object.keys(tab).reduce((acc, k) => ({ ...acc, [changeString(k)]: tab[k] }), {}));
      });
      this.columnData = rowData;
    }
  }
  checkListDataDownloadOption(downloadOption: any, colHeader: any, colData: any, widgetDetails: any,
                              maxColForPDFMode?: any, excelDateFormat?: any, maxDataDownload?: any,
                              fileConfigData?: any, accStatementRecordLimit?: any) {

    if (widgetDetails && widgetDetails.dashboardType !== FccGlobalConstant.TREASURY && widgetDetails.option !== FccGlobalConstant.GENERAL &&
       this.commonService.isnonEMptyString(widgetDetails.exportFileName)) {
        this.tableName = widgetDetails.exportFileName;
    } else if(widgetDetails && widgetDetails.dashboardType === FccGlobalConstant.TREASURY &&
       widgetDetails.option !== FccGlobalConstant.GENERAL){
        this.tableName = `${widgetDetails.option}TreasuryList`;
    } else if(widgetDetails && widgetDetails.dashboardType && !this.commonService.isnonEMptyString(widgetDetails.exportFileName)
      && (widgetDetails.activeTab.index === '0' || widgetDetails.activeTab.localizationKey === this.translate.instant('all'))){
        this.tableName = `${widgetDetails.option}AllList`;
    } else {
      if (this.language === FccGlobalConstant.LANGUAGE_AR) {
        if (widgetDetails.option === 'BL') {
          this.tableName = (widgetDetails && widgetDetails.widgetName) ? widgetDetails.widgetName :
            widgetDetails.activeTab.localizationKey ? `${widgetDetails.activeTab.localizationKey}` + `${widgetDetails.option}List` +
              `${widgetDetails.activeTab.extraPdfTitle ? widgetDetails.activeTab.extraPdfTitle : ''}` :
              FccGlobalConstant.LIST_DATA_TITLE;
        }else if(widgetDetails.option === 'GENERIC_FILE_UPLOAD' ){
          this.tableName = (widgetDetails && widgetDetails.widgetName) ? (widgetDetails.widgetName) :
          widgetDetails.activeTab?.localizationKey ? `${this.translate.instant(widgetDetails.activeTab?.localizationKey)}`
          + `${(widgetDetails.option !== '') ? this.translate.instant(widgetDetails.option)
          :'' +" "+ this.translate.instant('List')}` +
            `${widgetDetails.activeTab?.extraPdfTitle ? this.translate.instant(widgetDetails.activeTab?.extraPdfTitle) : ''}` :
            FccGlobalConstant.LIST_DATA_TITLE;
        }
        this.tableName = (widgetDetails && widgetDetails.widgetName) ? (widgetDetails.widgetName) :
          widgetDetails.activeTab?.localizationKey ? `${this.translate.instant(widgetDetails.activeTab?.localizationKey)}`
          + `${(widgetDetails.productCode !== '') ? this.translate.instant(widgetDetails.productCode)
          :'' +" "+ this.translate.instant('List')}` +
            `${widgetDetails.activeTab?.extraPdfTitle ? this.translate.instant(widgetDetails.activeTab?.extraPdfTitle) : ''}` :
            FccGlobalConstant.LIST_DATA_TITLE;
      } else {
        if (widgetDetails.option === 'BL' ) {
          this.tableName = (widgetDetails && widgetDetails.widgetName && widgetDetails.widgetName !== FccGlobalConstant.CHEQUE_TITLE) ?
            widgetDetails.widgetName :
            (widgetDetails.activeTab && widgetDetails.activeTab.localizationKeyPdf) ?
              `${widgetDetails.activeTab.localizationKeyPdf}` + `${widgetDetails.option}List` +
              `${widgetDetails.activeTab.extraPdfTitle ? widgetDetails.activeTab.extraPdfTitle : ''}` :
              widgetDetails.activeTab.localizationKey ? `${widgetDetails.activeTab.localizationKey}`
              + `${widgetDetails.productCode}List` +
                `${widgetDetails.activeTab.extraPdfTitle ? widgetDetails.activeTab.extraPdfTitle : ''}` :
                FccGlobalConstant.LIST_DATA_TITLE;
        } else if(widgetDetails.option === 'GENERIC_FILE_UPLOAD' ){
          this.tableName = (widgetDetails && widgetDetails.widgetName
            && widgetDetails.widgetName !== FccGlobalConstant.CHEQUE_TITLE) ?
            (widgetDetails.widgetName) :
            (widgetDetails.activeTab && widgetDetails.activeTab.localizationKeyPdf) ?
            `${this.translate.instant(widgetDetails.activeTab.localizationKeyPdf)} `
            + `${widgetDetails.option ? this.translate.instant(widgetDetails.option) : ''} List` +
            `${widgetDetails.activeTab.extraPdfTitle ? this.translate.instant(widgetDetails.activeTab.extraPdfTitle) : ''}` :
            widgetDetails.activeTab?.localizationKey ? `${this.translate.instant(widgetDetails.activeTab.localizationKey)} `
            + `${widgetDetails.option ? this.translate.instant(widgetDetails.option) : ''} List` +
              `${widgetDetails.activeTab.extraPdfTitle ? this.translate.instant(widgetDetails.activeTab.extraPdfTitle) : ''}` :
              FccGlobalConstant.LIST_DATA_TITLE;
        }
        else if (widgetDetails.subProductCode === 'LNFP' ) {
          this.tableName = (widgetDetails && widgetDetails.widgetName && widgetDetails.widgetName !== FccGlobalConstant.CHEQUE_TITLE) ?
            widgetDetails.widgetName :
            (widgetDetails.activeTab && widgetDetails.activeTab.localizationKeyPdf) ?
              `${widgetDetails.activeTab.localizationKeyPdf}` + `${widgetDetails.subProductCode}List` +
              `${widgetDetails.activeTab.extraPdfTitle ? widgetDetails.activeTab.extraPdfTitle : ''}` :
              widgetDetails.activeTab.localizationKey ? `${widgetDetails.activeTab.localizationKey}`
              + `${widgetDetails.subProductCode}List` +
                `${widgetDetails.activeTab.extraPdfTitle ? widgetDetails.activeTab.extraPdfTitle : ''}` :
                FccGlobalConstant.LIST_DATA_TITLE;
        }
        else {
          this.tableName = (widgetDetails && widgetDetails.widgetName
            && widgetDetails.widgetName !== FccGlobalConstant.CHEQUE_TITLE) ?
            (widgetDetails.widgetName) :
            (widgetDetails.activeTab && widgetDetails.activeTab.localizationKeyPdf) ?
              `${this.translate.instant(widgetDetails.activeTab.localizationKeyPdf)} `
              + `${widgetDetails.productCode ? this.translate.instant(widgetDetails.productCode) : ''} List` +
              `${widgetDetails.activeTab.extraPdfTitle ? this.translate.instant(widgetDetails.activeTab.extraPdfTitle) : ''}` :
              widgetDetails.activeTab?.localizationKey ? `${this.translate.instant(widgetDetails.activeTab.localizationKey)} `
              + `${widgetDetails.productCode ? this.translate.instant(widgetDetails.productCode) : ''} List` +
                `${widgetDetails.activeTab.extraPdfTitle ? this.translate.instant(widgetDetails.activeTab.extraPdfTitle) : ''}` :
                FccGlobalConstant.LIST_DATA_TITLE;
        }
      }
    }

    if (widgetDetails && widgetDetails.appendTabNameDownloadHeader)
    {
      this.tableName = this.tableName + '_' + widgetDetails.tabName;
    }

    if (widgetDetails && widgetDetails.dashboardTypeValue
      && widgetDetails.dashboardTypeValue.indexOf(FccGlobalConstant.ACCOUNT_SUMMARY_DASHBOARD_TYPE) > -1)
    {
      this.isListLevelAccSummaryDownload = true;
      this.isAccSummaryDashoabrd = true;
    } else {
      this.isListLevelAccSummaryDownload = false;
      this.isAccSummaryDashoabrd = false;
    }

    if (widgetDetails && widgetDetails.productCode === FccGlobalConstant.ACCOUNT_STATEMENT_PRODUCT_CODE)
    {
      this.isAccountStatementDownload = true;
      this.statementFilters = widgetDetails.filterParams;
      this.tableName = '';
      this.accStatementRecordLimit = accStatementRecordLimit;
    } else{
      this.isAccountStatementDownload = false;
    }

    this.fileName = this.getConfiguredFileName(fileConfigData);

    this.downloadOption = downloadOption;
    this.dateFormatForExcelDownload = excelDateFormat;
    /* deep copy */
    this.columnHeader = JSON.parse(JSON.stringify(colHeader));
    this.columnData = JSON.parse(JSON.stringify(colData));

    if (widgetDetails && widgetDetails.dashboardTypeValue === 'TRADE' && widgetDetails.widgetName === 'pendingTrade') {
      this.widgetDetails = widgetDetails;
      this.columnHeader.map(data=> {
        data.field = data.field.split(/\.?(?=[A-Z])/).join('_').toLowerCase();
      });
      if (this.downloadOption !== (FccGlobalConstant.PDF_FULL_DOWNLOAD ||
        FccGlobalConstant.EXCEL_FULL_DOWNLOAD ||
        FccGlobalConstant.CSV_FULL_DOWNLOAD)) {
        this.formatTableData();
      }
    }
    this.listDataDownloadLimit = maxDataDownload;
    if (maxColForPDFMode && maxColForPDFMode <= this.columnHeader.length) {
      this.pdfMode = FccGlobalConstant.PDF_MODE_LANDSCAPE;
    } else {
      this.pdfMode = FccGlobalConstant.PDF_MODE_PORTRAIT;
    }
    this.isGroupsDownload = false;
    this.commonService.isDownloadInProgress = true;
    switch (this.downloadOption) {
      case FccGlobalConstant.PDF_FULL_DOWNLOAD:
      case FccGlobalConstant.EXCEL_FULL_DOWNLOAD:
      case FccGlobalConstant.CSV_FULL_DOWNLOAD:
        this.fetchCompleteTableData(widgetDetails);
        break;
      case FccGlobalConstant.MT940_FULL_DOWNLOAD:
        this.commonService.getMT940Details().subscribe(response =>{
          let fileType;
          const fileName = response.fileName;
        if (response.type) {
          fileType = response.type;
        } else {
          fileType = 'application/octet-stream';
        }
        const newBlob = new Blob([response.MT940], { type: fileType });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob, fileName);
            return;
        }

        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = fileName;
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        window.URL.revokeObjectURL(data);
        link.remove();
        });
        break;
      case FccGlobalConstant.PDF_CURRENT_DOWNLOAD:
        this.formatListData(this.columnHeader, this.columnData);
        this.pdfGeneratorService.createListDataPDF(this.pdfMode, this.tableHeaders, this.tableData,
          this.selectedColHeader, this.columnData, this.tableName, null, null, widgetDetails.productCode,
          this.isListLevelAccSummaryDownload,null,this.fileName,this.isAccountStatementDownload,
          this.statementFilters);
          this.commonService.isDownloadInProgress = false;
        break;
      case FccGlobalConstant.EXCEL_CURRENT_DOWNLOAD:
        this.formatListData(this.columnHeader, this.columnData);
        if (this.isListLevelAccSummaryDownload) {
          this.createListDataExcelAccountSummary();
        } else {
          this.createListDataExcel();
          this.commonService.isDownloadInProgress = false;
        }
        break;
      case FccGlobalConstant.CSV_CURRENT_DOWNLOAD:
        this.formatListData(this.columnHeader, this.columnData);
        if (this.isListLevelAccSummaryDownload) {
          this.createListDataCSVAccountSummary();
        } else {
          this.createListDataCSV();
          this.commonService.isDownloadInProgress = false;
        }
        break;
    }
  }

  createDataForMergeFileds(header: any, data: any) {
   header.forEach(col => {
    if (this.commonService.isnonEMptyString(col.separator)) {
        data.forEach(ele => {
        const clubbedList = col.clubbedFieldsList.split(',');
          if (col.separator === FccGlobalConstant.CLUBBED_DATA) {
            col.separator = FccGlobalConstant.SEPARATOR_ENTER;
          }
          let separatorText = '';
          if (col.field === FccGlobalConstant.CONTORL_SUM) {
            separatorText = this.translate.instant('batchCount') + ': ';
          }
        const delimiter = col.separator === FccGlobalConstant.SEPARATOR_ENTER ?
        FccGlobalConstant.NEXT_LINE : col.separator;
        let clubbedString = '';
          let flag = false;
        if (delimiter === FccGlobalConstant.NEXT_LINE) {
        clubbedList.forEach((field, index) => {
           if (index < 1) {
            const str = ele[field];
            if (!str.includes(FccGlobalConstant.NEXT_LINE)) {
              clubbedString = ele[field] === '' ? FccGlobalConstant.SAMPLE_COMMENT : ele[col.field];
            } else {
              flag = true;
            }
           } else {
            if (!ele[field].includes(FccGlobalConstant.NEXT_LINE)) {
              const str = ele[field] === '' ? FccGlobalConstant.SAMPLE_COMMENT : ele[field];
               clubbedString = clubbedString +FccGlobalConstant.NEXT_LINE + separatorText +str;
               } else {
                 flag = true;
            }
           }
         });
         if (!flag) {
         ele[clubbedList[0]] = clubbedString;
         }
        } else {
          ele[col.field] = '';
          clubbedList.forEach((field, index) => {
           if (index < 1){
               ele[col.field] = ele[field];
             } else {
               ele[col.field] = (ele[col.field] === '' ? FccGlobalConstant.SAMPLE_COMMENT : ele[col.field])
               + delimiter +separatorText+ ele[field] ;
             }
           });
        }
       });

       col.separator = FccGlobalConstant.CLUBBED_DATA;
      }
    });
 }

  formatListData(colHeader, colData) {
    const downloadOption = this.downloadOption.toLowerCase();
    const sum = 'controlSum';
    const amt = ['amt', 'tnx_amt', sum, 'maturity_amount', 'principal_amount', 'RunningStatement@AvailableBalance@amt',
    'convertedPrincipal_amount', 'RunningStatement@AvailableBalance@convertedAmt', 'convertedMaturity_amount'];
    let value;
    if (this.tableName !== 'ALL_ACCOUNTS' && this.currencySymbolDisplayEnabled && downloadOption.indexOf('current') > -1) {
      const applicableAmtKeys = amt.splice(2);
      colData.forEach(element => {
        value = element;
        Object.keys(element).forEach(ele => {
          if (applicableAmtKeys.indexOf(ele) > -1) {
            const val = value[ele]?.split(' ');
            if (val.length > 1) {
              element[ele] = `${val[0]} ${val[1]}`;
            }
          }
        });
      });
    }
    if (this.commonService.isnonEMptyString(colHeader) && colHeader.length > FccGlobalConstant.ZERO) {
      this.createDataForMergeFileds(this.columnHeader?this.columnHeader:colHeader, this.columnData?this.columnData:colData);
      let tableHeaderList: any[] = [];
      this.tableHeaders = [];
      this.tableHeadersCSV = [];
      this.selectedColHeader = [];
      for (const columnName of colHeader) {
        if (this.excludeColumns.indexOf(columnName.field) === -1 && columnName.showAsDefault) {
          const col = {};
          tableHeaderList.push(columnName.field);
          const translatedValue = columnName.header;
          col[FccGlobalConstant.TABLE_HEADER] = columnName.header;
          this.tableHeadersCSV.push(col);
          this.tableHeaders.push(translatedValue);
          this.selectedColHeader.push(columnName);
        }
      }
      if (this.isGroupsDownload && colHeader.length > FccGlobalConstant.ZERO && this.isAccSummaryDashoabrd) {
        for (const columnsList of colHeader) {
          const headerList = [];
          const tableHeaders = [];
          const tableHeaderCSV = [];
          for (const columnName of columnsList) {
            if (this.excludeColumns.indexOf(columnName.field) === -1 && columnName.showAsDefault) {
              const col = {};
              headerList.push(columnName.field);
              const translatedValue = columnName.header;
              col[FccGlobalConstant.TABLE_HEADER] = columnName.header;
              tableHeaders.push(translatedValue);
              tableHeaderCSV.push(col);
            }
          }
          tableHeaderList.push(headerList);
          this.tableHeaders.push(tableHeaders);
          this.tableHeadersCSV.push(tableHeaderCSV);
        }
        if (this.isAccSummaryDashoabrd && this.language === FccGlobalConstant.LANGUAGE_AR
          && !this.downloadOption.includes(FccGlobalConstant.EXCEL) && !this.downloadOption.includes(FccGlobalConstant.CSV)) {
          const updatedTableHeaders = [];
          const updatedTableHeadersList = [];
          const updatedTableColHeadersList = [];

          this.tableHeaders.forEach(headers => {
            updatedTableHeaders.push(this.reverseTableContent(headers));
          });
          this.columnHeader.forEach(headers => {
            updatedTableColHeadersList.push(this.reverseTableContent(headers));
          });
          tableHeaderList.forEach(headers => {
            updatedTableHeadersList.push(this.reverseTableContent(headers));
          });
          this.tableHeaders = updatedTableHeaders;
          this.columnHeader = updatedTableColHeadersList;
          tableHeaderList = updatedTableHeadersList;
        }
      }
      if (!this.isAccSummaryDashoabrd && this.language === FccGlobalConstant.LANGUAGE_AR &&
        !this.downloadOption.includes(FccGlobalConstant.EXCEL)) {
        this.tableHeaders = this.reverseTableContent(this.tableHeaders);
        tableHeaderList = this.reverseTableContent(tableHeaderList);
        this.tableHeadersCSV = this.reverseTableContent(this.tableHeadersCSV);
        this.columnHeader = this.reverseTableContent(this.columnHeader?this.columnHeader:colHeader);
      }
      if (this.isGroupsDownload && colData.length > FccGlobalConstant.ZERO) {
        this.groupTableData = [];
        colData.forEach((group,index) => {
          if (this.isAccSummaryDashoabrd) {
            this.setListTableData(group, tableHeaderList[index]);
          } else {
            this.setListTableData(group, tableHeaderList);
          }
          this.groupTableData.push(this.tableData);
        });
      } else {
        if(this.downloadOption !== FccGlobalConstant.PDF_CURRENT_DOWNLOAD) {
          this.setListTableData(colData, tableHeaderList);
        }
      }
    }
  }

  reverseTableContent(DataArray: string[]) {
    const DataArrayLength = DataArray.length;
    const DataArrayArabic: string[] = [];
    for (let i = 0; i < DataArrayLength; i++) {
      DataArrayArabic.push(DataArray.pop());
    }
    return DataArrayArabic;
  }

  fetchCompleteTableData(widgetDetails: any) {
    const dashboardType = {};
    const listDefName = widgetDetails ? widgetDetails.listdefName : FccGlobalConstant.EMPTY_STRING;
    if (this.commonService.isnonEMptyString(widgetDetails)) {
      if (this.commonService.isnonEMptyString(widgetDetails.dashboardType)) {
        dashboardType[FccGlobalConstant.DASHBOARD_TYPE] = widgetDetails.dashboardType;
      } else {
        dashboardType[FccGlobalConstant.DASHBOARD_TYPE] = widgetDetails.dashboardTypeValue;
      }
      if (this.commonService.isnonEMptyString(widgetDetails.accountType)) {
        dashboardType[FccGlobalConstant.ACCOUNT_TYPE] = widgetDetails.accountType;
      }
      if (this.commonService.isnonEMptyString(widgetDetails.baseCurrency)) {
        dashboardType[FccGlobalConstant.BASE_CURRENCY_APPLICABILITY] = widgetDetails.baseCurrency;
      }
      if (this.commonService.isnonEMptyString(widgetDetails.favourite) &&
        widgetDetails.favourite === FccGlobalConstant.CODE_Y) {
        dashboardType[FccGlobalConstant.FAVOURITE] = widgetDetails.favourite;
      }
    }
    let filterParams;
    if(this.isListLevelAccSummaryDownload){
      const filteredData = this.commonService.getAccountSummaryFilter();
      dashboardType[FccGlobalConstant.ACCOUNT_CURRENCY] = filteredData[FccGlobalConstant.ACCOUNT_CURRENCY];
      dashboardType[FccGlobalConstant.ENTITY] = filteredData[FccGlobalConstant.ENTITY];
      filterParams = JSON.stringify(dashboardType);
    } else if(this.isAccountStatementDownload){
      filterParams = JSON.stringify(widgetDetails['filterParams']);
    } else{
      filterParams = this.commonService.isnonEMptyString(this.commonService.listDataFilterParams) ?
      this.commonService.listDataFilterParams : JSON.stringify(dashboardType);
    }

    const defaultFilterValues = JSON.stringify(dashboardType);
    filterParams = this.commonService.isnonEMptyString(this.commonService.listDataFilterParams) ?
    this.commonService.listDataFilterParams : defaultFilterValues;
    if(widgetDetails.listdefName === FccGlobalConstant.FCM_PAYMENT_DETAILS_LISTDEF){
      if(widgetDetails.filterParams && !this.commonService.isObjectEmpty(widgetDetails.filterParams)){
        filterParams = JSON.stringify(widgetDetails.filterParams);
      }
    }
    const paginatorParams = { first: 0, rows: this.listDataDownloadLimit, sortOrder: undefined, filters: {}, globalFilter: null };
    if (widgetDetails && widgetDetails.dashboardTypeValue === 'TRADE' && widgetDetails.widgetName === 'pendingTrade') {
      this.completeTableData = widgetDetails.totalRecords;
      if (this.completeTableData && this.completeTableData.length > FccGlobalConstant.ZERO) {
        this.columnData = this.completeTableData;
      }
      this.formatTableData();
      this.formatListData(this.columnHeader, this.columnData);
      this.checkFullDownloadExcelOrPDFOrCSV();
    } else {
      this.listService.getTableData(listDefName, filterParams , JSON.stringify(paginatorParams))
        .subscribe(result => {
        this.setTableData(result);
      });
    }
  }

  setTableData(tableresponse: any) {
    const tempTableData = tableresponse.rowDetails;
    const filteredData = this.commonService.getAccountSummaryFilter();
    this.completeTableData = [];
    if (tempTableData) {
      tempTableData.forEach(element => {
        const obj = {};
        const amt = 'amt';
        const curCode = 'cur_code';
        const tnxAmt = 'tnx_amt';
        const sum = 'controlSum';
        const ccy = 'debtorAccount@currency';
        const matAmount = 'maturity_amount';
        const prinAmount = 'principal_amount';
        const balAmt = 'RunningStatement@AvailableBalance@amt';
        const baseCurrency = this.commonService.getBaseCurrency();
        const convertedPrincipalAmount = 'convertedPrincipal_amount';
        const convertedAmount = 'RunningStatement@AvailableBalance@convertedAmt';
        const convertedMaturityAmount = 'convertedMaturity_amount';
        const instrumentAmt = 'instructedAmountCurrencyOfTransfer2@amount';
        let amountField;
        let amount;
        let currencyCode;
        let valueToCheck;
        element.index.forEach(ele => {
          if (amt === ele.name || tnxAmt === ele.name || ele.name === 'ft_amt') {
            amountField = ele.name;
            amount = ele.value;
          }
          if (curCode === ele.name || ele.name === 'ft_cur_code') {
            currencyCode = ele.value;
          }
          valueToCheck = (this.commonService.isNonEmptyValue(ele.displayValue) &&
          this.commonService.isNonEmptyValue(ele.showdisplayValue)) ? ele.displayValue : ele.value;
          obj[ele.name] = valueToCheck ? this.commonService.decodeHtml(valueToCheck): FccGlobalConstant.SAMPLE_COMMENT;
        });
        if (this.downloadOption.toLowerCase().indexOf('pdf') > -1) {
          obj[amountField] = this.commonService.getCurrencyFormatedAmountForListdef(
            currencyCode, amount, this.currencySymbolDisplayEnabled);
        } else {
          obj[amountField] = this.commonService.getCurrencyFormatedAmount(currencyCode, amount, this.currencySymbolDisplayEnabled);
        }
        obj[sum] = this.commonService.getCurrencyFormatedAmount(obj[ccy], obj[sum], this.currencySymbolDisplayEnabled);
        obj[prinAmount] = this.commonService.getCurrencyFormatedAmount(
          obj[curCode], obj[prinAmount], this.currencySymbolDisplayEnabled);
        obj[matAmount] = this.commonService.getCurrencyFormatedAmount(obj[curCode], obj[matAmount], this.currencySymbolDisplayEnabled);
        obj[balAmt] = this.commonService.getCurrencyFormatedAmount(obj[curCode], obj[balAmt], this.currencySymbolDisplayEnabled);
        obj[convertedPrincipalAmount] = this.commonService.getCurrencyFormatedAmount(
          baseCurrency, obj[convertedPrincipalAmount], this.currencySymbolDisplayEnabled);
        if(this.isAccSummaryDashoabrd && filteredData && filteredData[FccGlobalConstant.ACCOUNT_CURRENCY]){
          obj[convertedAmount] = this.commonService.getCurrencyFormatedAmount(
            filteredData[FccGlobalConstant.ACCOUNT_CURRENCY], obj[convertedAmount], this.currencySymbolDisplayEnabled);
        } else {
          obj[convertedAmount] = this.commonService.getCurrencyFormatedAmount(
            baseCurrency, obj[convertedAmount], this.currencySymbolDisplayEnabled);
        }
        obj[convertedMaturityAmount] = this.commonService.getCurrencyFormatedAmount(
          baseCurrency, obj[convertedMaturityAmount], this.currencySymbolDisplayEnabled);
        obj[instrumentAmt] = this.commonService.getCurrencyFormatedAmount(
          obj[ccy], obj[instrumentAmt], this.currencySymbolDisplayEnabled);
        this.completeTableData.push(obj);
      });
    }

    if (this.isAccSummaryDashoabrd && !this.isListLevelAccSummaryDownload) {
      return this.completeTableData;
    } else {
      if (this.completeTableData && this.completeTableData.length > FccGlobalConstant.ZERO) {
        this.columnData = this.completeTableData;
      }
      this.formatListData(this.columnHeader, this.columnData);
      this.checkFullDownloadExcelOrPDFOrCSV();
    }
  }

  createBulkPaymentExcel(tableHeader, headers, data, remarksHeader, remarksData, setRemarks, fileName?) {
    this.tableName = tableHeader;
    this.fileName = fileName.replace(/\.[^/.]+$/, "");
    this.tableHeaders = headers;
    this.tableData = data;
    this.setPaymentsRemarks = setRemarks;
    this.setPaymentsRepairRejectRemarksHeaders = remarksHeader;
    this.setPaymentsRepairRejectRemarksData = remarksData;
    this.paymentsBulk = true;
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.dateFormatForExcelDownload = response.listDataExcelDateFormat;
     }
    });
    this.createListDataExcel();
  }

  createListDataExcel() {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(this.translate.instant(this.tableName));
      const titleRow = worksheet.addRow([this.translate.instant(this.tableName)]);
      worksheet.mergeCells('A1:R1');
      titleRow.font = {
        size: 16,
        bold: true
      };
      titleRow.alignment = {
        vertical: 'middle', horizontal: 'center'
      };
      worksheet.addRow([]);
      const imageBase64Logo = this.pdfGeneratorService.getHeaderLogoForExcel();
      const imageLogoId = workbook.addImage({
        base64: imageBase64Logo,
        extension: 'png',
      });
      worksheet.addImage(imageLogoId, 'A2:C6');
      worksheet.mergeCells('A2:C6');
      worksheet.addRow([]);
      const name = 'name';
      const swiftAddress = 'SWIFTAddress';
      const isoCode = 'isoCode';
      if (this.bankDetails[name] && this.bankDetails[name] !== '' && this.bankDetails[name] != null) {
        worksheet.addRow([this.bankDetails[name]]);
      }
      if (this.bankDetails[swiftAddress].line1 && this.bankDetails[swiftAddress].line1 !== ''
        && this.bankDetails[swiftAddress].line1 != null) {
        worksheet.addRow([this.bankDetails[swiftAddress].line1]);
        }
      if (this.bankDetails[swiftAddress].line2 && this.bankDetails[swiftAddress].line2 !== ''
        && this.bankDetails[swiftAddress].line2 != null) {
        worksheet.addRow([this.bankDetails[swiftAddress].line2]);
        }
      if (this.bankDetails[swiftAddress].line3 && this.bankDetails[swiftAddress].line3 !== ''
        && this.bankDetails[swiftAddress].line3 != null) {
        worksheet.addRow([this.bankDetails[swiftAddress].line3]);
        }
      if (this.bankDetails[isoCode] && this.bankDetails[isoCode] !== null) {
        const swiftBold = worksheet.addRow([this.translate.instant('SWIFT')]);
        swiftBold.font={
          bold:true
        };
        worksheet.addRow([this.bankDetails[isoCode]]);
      }
      const downloadDate = new Date();
      const dateValue = this.datePipe.transform(downloadDate, this.dateFormatForExcelDownload);
      const timeValue = this.datePipe.transform(downloadDate, 'mediumTime');
      const dateFormatMessage = this.translate.instant('dateFollows') + ' ' + this.utilityService.getDisplayDateFormat();
      const dateFormatMessageAr = this.utilityService.getDisplayDateFormat() + ' ' + this.translate.instant('dateFollows');
      if(this.language === FccGlobalConstant.LANGUAGE_AR){
        worksheet.addRow(['','','','','','','',dateValue + ' ' + this.translate.instant(FccGlobalConstant.DOWNLOAD_DATE)]);
        worksheet.addRow(['','','','','','','',timeValue + ' ' + this.translate.instant(FccGlobalConstant.DOWNLOAD_TIME)]);
        worksheet.addRow(['','','','','','','',dateFormatMessageAr]).font={
          italic : true
        };
      } else {
        worksheet.addRow(['','','','','','','',this.translate.instant(FccGlobalConstant.DOWNLOAD_DATE) + ' ' + dateValue]);
        worksheet.addRow(['','','','','','','',this.translate.instant(FccGlobalConstant.DOWNLOAD_TIME) + ' ' + timeValue]);
        worksheet.addRow(['','','','','','','',dateFormatMessage]).font={
          italic : true
        };
      }
      worksheet.addRow([]);
      worksheet.addRow(this.tableHeaders);
          if (!this.paymentsBulk) {
        const dataRows = worksheet.addRows(this.tableData);
        dataRows.forEach(function(dataRow) {
          dataRow.alignment = { vertical: 'middle', wrapText: true };
        });
      } else {
        worksheet.addRow(this.tableData);
        this.paymentsBulk = false;
      }

      if (this.setPaymentsRemarks) {
        worksheet.addRow([]);
        worksheet.addRow(this.setPaymentsRepairRejectRemarksHeaders);
        const dataRows = worksheet.addRows(this.setPaymentsRepairRejectRemarksData);
        dataRows.forEach(function(dataRow) {
          dataRow.alignment = { vertical: 'middle', wrapText: true };
        });
      }



      if (this.language === FccGlobalConstant.LANGUAGE_AR) {
        worksheet.views = [
          { rightToLeft: true }
        ];
      }
      this.santizeForXssInjection(workbook);
      workbook.xlsx.writeBuffer().then((data: any) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `${this.translate.instant(this.fileName)}.xlsx`);
      });

  }

  createListDataExcelAccountSummary() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(this.translate.instant(this.tableName));
    this.getCorporateDetails();
    this.accountSummaryExcelHeader(workbook, worksheet);
    worksheet.addRow([]);
    const tableHeaderRow = worksheet.addRow(this.tableHeaders);
    tableHeaderRow.font = {
      bold: true
     };

    if(this.tableData.length == FccGlobalConstant.LENGTH_0){
      worksheet.addRow([this.translate.instant('noRecordsFound')]);
    }
    if (!this.paymentsBulk) {
      const dataRows = worksheet.addRows(this.tableData);
      dataRows.forEach(function(dataRow) {
        dataRow.alignment = { vertical: 'middle', wrapText: true };
      });
    } else {
      worksheet.addRow(this.tableData);
      this.paymentsBulk = false;
    }

    if (this.setPaymentsRemarks) {
      worksheet.addRow([]);
      worksheet.addRow(this.setPaymentsRepairRejectRemarksHeaders);
      const dataRows = worksheet.addRows(this.setPaymentsRepairRejectRemarksData);
      dataRows.forEach(function(dataRow) {
        dataRow.alignment = { vertical: 'middle', wrapText: true };
      });
    }

    if (this.language === FccGlobalConstant.LANGUAGE_AR) {
      worksheet.views = [
        { rightToLeft: true }
      ];
    }
    this.santizeForXssInjection(workbook);
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${this.translate.instant(this.fileName)}.xlsx`);
    });
  }

  createGroupListDataExcel() {
    const workbook = new Workbook();
    const worksheet = [];
    if (this.groupDetails.length === this.groupTableData.length) {
      for (let i = 0; i < this.groupDetails.length; i++) {
        worksheet[i] = workbook.addWorksheet(this.translate.instant(this.groupDetails[i].groupName));
        const titleRow = worksheet[i].addRow([this.translate.instant(this.groupDetails[FccGlobalConstant.GROUP_TITLE])]);
        worksheet[i].mergeCells('A1:R1');
        titleRow.font = {
          size: 16,
          bold: true
        };
        titleRow.alignment = {
          vertical: 'middle', horizontal: 'center'
        };
        worksheet[i].addRow([this.translate.instant('total'), `${this.translate.instant('numberOfAccounts',
        { noOfAccounts: this.groupDetails[i].groupAccountCount })}`]);
        worksheet[i].addRow([this.translate.instant(this.groupDetails[i].groupName), this.groupDetails[i].displayTotalAmtBalance]);
        worksheet[i].addRow([]);
        const downloadDate = new Date();
        const dateValue = this.datePipe.transform(downloadDate, this.dateFormatForExcelDownload);
        const timeValue = this.datePipe.transform(downloadDate, 'mediumTime');
        worksheet[i].addRow([this.translate.instant(FccGlobalConstant.DOWNLOAD_DATE), dateValue]);
        worksheet[i].addRow([this.translate.instant(FccGlobalConstant.DOWNLOAD_TIME), timeValue]);
        worksheet[i].addRow([]);
        worksheet[i].addRow(this.tableHeaders);
        worksheet[i].addRows(this.groupTableData[i]);
        if (this.language === FccGlobalConstant.LANGUAGE_AR) {
          worksheet[i].views = [
            { rightToLeft: true }
          ];
        }
      }
    }
    this.santizeForXssInjection(workbook);
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${this.translate.instant(this.groupDetails[FccGlobalConstant.GROUP_TITLE])}.xlsx`);
    });
  }

  createGroupListDataExcelAccountSummary() {
    const workbook = new Workbook();
     const worksheet = [];
     worksheet[0] = workbook.addWorksheet(this.translate.instant('ALLACCOUNTS'));
     this.getCorporateDetails();
     this.accountSummaryExcelHeader(workbook, worksheet[0]);

     if (this.groupDetails.length === this.groupTableData.length) {
       for (let i = 0; i < this.groupDetails.length; i++) {
         worksheet[0].addRow([]);
         const titleRow = worksheet[0].addRow([this.translate.instant(this.groupDetails[i])]);
         worksheet[0].addRow([]);
         titleRow.font = {
           bold: true
         };

         const tableHeaderRow = worksheet[0].addRow(this.tableHeaders[i]);
         tableHeaderRow.font = {
          bold: true
         };

         if(this.groupTableData[i].length == FccGlobalConstant.LENGTH_0){
          worksheet[0].addRow([this.translate.instant('noRecordsFound')]);
         }else {
         const footerRow = [];
         let index = 0;
         if (this.aggregateAmt.length-1 >= i) {
           for (let j = 0; j < this.tableHeaders[i].length; j++) {
             if (j == 0 && footerRow[0] === undefined) {
               footerRow[j] = this.translate.instant('totalAmt');
             } else if (this.tableHeaders[i][j].indexOf(this.translate.instant('EQUIVALENT_OPENING_BALANCE'))>-1 ||
             this.tableHeaders[i][j].indexOf(this.translate.instant('EQUIVALENT_PRINCIPAL_AMOUNT'))>-1 ||
             this.tableHeaders[i][j].indexOf(this.translate.instant('OPENING_AMOUNT'))>-1 ||
             this.tableHeaders[i][j].indexOf(this.translate.instant('CURRENT_AMOUNT'))>-1 ||
             this.tableHeaders[i][j].indexOf(this.translate.instant('BALANCE_AT_MATURITY'))>-1 ||
             this.tableHeaders[i][j].indexOf(this.translate.instant('EQUIVALENT_CURRENT_AMOUNT'))>-1){
               footerRow[j] = this.aggregateAmt[i][index];
               index++;
             } else {
               footerRow[j] = '';
             }
           }
           this.groupTableData[i].push(footerRow);
         }
          const tableDataRow = worksheet[0].addRows(this.groupTableData[i]);
          tableDataRow[this.groupTableData[i].length-1].font = {
            bold: true
          };
        }
         if (this.language === FccGlobalConstant.LANGUAGE_AR) {
           worksheet[0].views = [
             { rightToLeft: true }
           ];
         }
       }
     }
     worksheet[0].addRow([]);
     const endSummaryRow = worksheet[0].addRow([this.translate.instant('endOfSummary')]);

     endSummaryRow.font = {
       bold: true
     };
     endSummaryRow.alignment = {
       vertical: 'middle', horizontal: 'center'
     };
     this.santizeForXssInjection(workbook);
     workbook.xlsx.writeBuffer().then((data: any) => {
       const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
       saveAs(blob, `${this.translate.instant(this.groupDetails[FccGlobalConstant.GROUP_TITLE])}.xlsx`);
     });
   }

  createGroupListDataCSVAccountSummary() {
    this.getCorporateDetails();
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(this.translate.instant(this.groupDetails[0]));
    const filteredData = this.commonService.getAccountSummaryFilter();
    const collumn = [];

    const maxColLength = Math.max(0,...this.tableHeaders.map(tableHeader=>tableHeader.length));

    for (let i = 0; i <= maxColLength; i++) {
      collumn.push('');
    }

    collumn[0] = this.translate.instant('filteredBy') + ': ';

    worksheet.addRow(collumn);

    let filteredText = '';
    Object.keys(filteredData).forEach(filter => {
      if (FccGlobalConstant.ACC_SUMMARY_FILTER_PDF.indexOf(filter) > -1) {
        filteredText = filteredText + `${this.translate.instant(filter)}: ${filteredData[filter]}` +"\r\n";
      }
    });
    collumn[0] = filteredText.replace('|',', ');

    worksheet.addRow(collumn).alignment = {
      wrapText: true
    };

    worksheet.addRow([]);

    const downloadDate = new Date();
    const dateValue = this.datePipe.transform(downloadDate, this.dateFormatForExcelDownload);
    collumn[0] = this.translate.instant('accountSummaryPDFTitle') + dateValue;
    worksheet.addRow(collumn);

    worksheet.addRow([]);

    if (this.groupDetails.length === this.groupTableData.length) {
      for (let i = 0; i < this.groupDetails.length; i++) {

        collumn[0] = this.translate.instant(this.groupDetails[i]);
        worksheet.addRow(collumn);
        worksheet.addRow(this.tableHeaders[i]);
        if (this.groupTableData[i].length == FccGlobalConstant.LENGTH_0) {
          worksheet.addRow([this.translate.instant('noRecordsFound')]);
        } else {
          const footerRow = [];
          let index = 0;
          if (this.aggregateAmt.length - 1 >= i) {
            for (let j = 0; j < this.tableHeaders[i].length; j++) {
              if (j == 0 && footerRow[0] === undefined) {
                footerRow[j] = this.translate.instant('totalAmt');
              } else if (this.tableHeaders[i][j].indexOf(this.translate.instant('EQUIVALENT_OPENING_BALANCE'))>-1 ||
             this.tableHeaders[i][j].indexOf(this.translate.instant('EQUIVALENT_PRINCIPAL_AMOUNT'))>-1 ||
             this.tableHeaders[i][j].indexOf(this.translate.instant('OPENING_AMOUNT'))>-1 ||
             this.tableHeaders[i][j].indexOf(this.translate.instant('CURRENT_AMOUNT'))>-1 ||
             this.tableHeaders[i][j].indexOf(this.translate.instant('BALANCE_AT_MATURITY'))>-1){
                footerRow[j] = this.aggregateAmt[i][index];
                index++;
              } else {
                footerRow[j] = '';
              }
            }
            this.groupTableData[i].push(footerRow);
          }
          worksheet.addRows(this.groupTableData[i]);
        }
        worksheet.addRow([]);
      }

      if (this.language === FccGlobalConstant.LANGUAGE_AR) {
        worksheet.views = [
          { rightToLeft: true }
        ];
      }

      worksheet.addRow([this.translate.instant('endOfSummary')]);
    }
    this.santizeForXssInjection(workbook);
    workbook.csv.writeBuffer().then((data) => {
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + data], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `${this.translate.instant(this.groupDetails[FccGlobalConstant.GROUP_TITLE])}.csv`);
    });

  }

   accountSummaryExcelHeader(workbook, worksheet){
    const titleRow = worksheet.addRow([this.translate.instant('ALLACCOUNTS')]);
    worksheet.mergeCells('A1:R1');
    titleRow.font = {
      size: 16,
      bold: true
    };
    titleRow.alignment = {
      vertical: 'middle', horizontal: 'center'
    };
    worksheet.addRow([]);
    const imageBase64Logo = this.pdfGeneratorService.getHeaderLogoForExcel();
    const imageLogoId = workbook.addImage({
      base64: imageBase64Logo,
      extension: 'png',
    });
    worksheet.addImage(imageLogoId, 'A2:C6');
    worksheet.mergeCells('A2:C6');

    const name = 'name';
    const swiftAddress = 'SWIFTAddress';
    const isoCode = 'isoCode';

    if (this.bankDetails[name] && this.bankDetails[name] !== '' && this.bankDetails[name] != null) {
      const firstRow = worksheet.addRow([]);
      firstRow.getCell(1).value = this.bankDetails[name];
      firstRow.getCell(10).value = this.loggedInUserDetails.firstName + ' ' + this.loggedInUserDetails.lastName;
      firstRow.getCell(10).alignment = {
        vertical: 'middle', horizontal: 'right'
      };
      firstRow.getCell(10).font = {
        bold: true
      };
    }
    if (this.bankDetails[swiftAddress].line1 && this.bankDetails[swiftAddress].line1 !== ''
      && this.bankDetails[swiftAddress].line1 != null) {
      const secondRow = worksheet.addRow([]);
      secondRow.getCell(1).value = this.bankDetails[swiftAddress].line1;
      secondRow.getCell(10).value = this.corporateDetails[swiftAddress].line1;
      secondRow.getCell(10).alignment = {
        vertical: 'middle', horizontal: 'right'
      };
    }
    if (this.bankDetails[swiftAddress].line2 && this.bankDetails[swiftAddress].line2 !== ''
      && this.bankDetails[swiftAddress].line2 != null) {
      const thirdRow = worksheet.addRow([]);
      thirdRow.getCell(1).value = this.bankDetails[swiftAddress].line2;
      thirdRow.getCell(10).value = this.corporateDetails[swiftAddress].line2;
      thirdRow.getCell(10).alignment = {
        vertical: 'middle', horizontal: 'right'
      };
    }

    if (this.bankDetails[swiftAddress].line3 && this.bankDetails[swiftAddress].line3 !== ''
      && this.bankDetails[swiftAddress].line3 != null) {
      const fourthRow = worksheet.addRow([]);
      fourthRow.getCell(1).value = this.bankDetails[swiftAddress].line3;
      fourthRow.getCell(10).value = this.corporateDetails[swiftAddress].line3;
      fourthRow.getCell(10).alignment = {
        vertical: 'middle', horizontal: 'right'
      };
    }

    if (this.bankDetails[isoCode] && this.bankDetails[isoCode] !== null) {
      const swiftBold = worksheet.addRow([this.translate.instant('SWIFT')]);
      swiftBold.getCell(1).value = this.bankDetails[isoCode];
    }

    worksheet.addRow([]);
    const dateRow = worksheet.addRow([]);
    const timeRow = worksheet.addRow([]);
    const dateFormatMessageRow = worksheet.addRow([]);

    const downloadDate = new Date();
    const dateValue = this.datePipe.transform(downloadDate, this.dateFormatForExcelDownload);
    const timeValue = this.datePipe.transform(downloadDate, 'mediumTime');
    const dateFormatMessage = this.translate.instant('dateFollows') + ' ' + this.utilityService.getDisplayDateFormat();
    const dateFormatMessageAr = this.utilityService.getDisplayDateFormat() + ' ' + this.translate.instant('dateFollows');

    if (this.language === FccGlobalConstant.LANGUAGE_AR) {
      let filteredText = '';
      const filteredData = this.commonService.getAccountSummaryFilter();
      Object.keys(filteredData).forEach(filter => {
        filteredText = filteredText + `${this.translate.instant(filter)}: ${filteredData[filter]}` +"\r\n";
      });
      worksheet.addRow([this.translate.instant('filteredBy') + ': ', '', '', '', '', '', '',
      dateValue + ' ' + this.translate.instant(FccGlobalConstant.DOWNLOAD_DATE)]);
      worksheet.addRow([filteredText.replace('|',', '), '', '', '', '', '', '',
      timeValue + ' ' + this.translate.instant(FccGlobalConstant.DOWNLOAD_TIME)]);
      worksheet.addRow(['', '', '', '', '', '', '', dateFormatMessageAr]).font = {
        italic: true
      };
    } else {
      dateRow.getCell(10).value = this.translate.instant(FccGlobalConstant.DOWNLOAD_DATE) + ' ' + dateValue;
      timeRow.getCell(10).value = this.translate.instant(FccGlobalConstant.DOWNLOAD_TIME) + ' ' + timeValue;
      dateFormatMessageRow.getCell(10).value = dateFormatMessage;

      const filteredData = this.commonService.getAccountSummaryFilter();

      dateRow.getCell(1).value = this.translate.instant('filteredBy') + ': ';

      let filteredText = '';
      Object.keys(filteredData).forEach(filter => {
        if (FccGlobalConstant.ACC_SUMMARY_FILTER_PDF.indexOf(filter) > -1) {
          filteredText = filteredText + `${this.translate.instant(filter)}: ${filteredData[filter]}` +"\r\n";
        }
      });
      timeRow.getCell(1).value = filteredText.replace('|',', ');
      timeRow.getCell(1).alignment = {
        wrapText: true
      };

      dateRow.getCell(10).alignment = {
        vertical: 'middle', horizontal: 'right'
      };

      timeRow.getCell(10).alignment = {
        vertical: 'middle', horizontal: 'right'
      };

      dateFormatMessageRow.getCell(10).alignment = {
        vertical: 'middle', horizontal: 'right'
      };

      worksheet.addRow([]);
      const accountSummaryDateRow = worksheet.addRow([]);
      accountSummaryDateRow.getCell(1).value = this.translate.instant('accountSummaryPDFTitle') + dateValue;
      accountSummaryDateRow.font = {
          bold: true,
          size: 16
      };
    }
  }

  createListDataCSVAccountSummary() {
    this.getCorporateDetails();
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(this.translate.instant(this.tableName));
    const filteredData = this.commonService.getAccountSummaryFilter();
    const collumn = [];

    for (let i = 0; i <= this.tableHeaders.length; i++) {
      collumn.push('');
    }

    collumn[0] = this.translate.instant('filteredBy') + ': ';

    worksheet.addRow(collumn);

    let filteredText = '';
    Object.keys(filteredData).forEach(filter => {
      filteredText = filteredText + `${this.translate.instant(filter)}: ${filteredData[filter]}` +"\r\n";
    });
    collumn[0] = filteredText.replace('|',', ');

    worksheet.addRow(collumn).alignment = {
      wrapText: true
    };

    worksheet.addRow([]);

    const downloadDate = new Date();
    const dateValue = this.datePipe.transform(downloadDate, this.dateFormatForExcelDownload);
    collumn[0] = this.translate.instant('accountSummaryPDFTitle') + dateValue;
    worksheet.addRow(collumn);

    worksheet.addRow([]);

    worksheet.addRow([this.translate.instant(this.tableName)]);
    worksheet.addRow(this.tableHeaders);
    worksheet.addRows(this.tableData);

    if (this.language === FccGlobalConstant.LANGUAGE_AR) {
      worksheet.views = [
        { rightToLeft: true }
      ];
    }
    this.santizeForXssInjection(workbook);
    workbook.csv.writeBuffer().then((data) => {
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + data], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `${this.translate.instant(this.fileName)}.csv`);
    });
  }

  createCSVAccountStatement() {
    let accountStatementData;
    let userAccountBalance;
    let startPeriodDate;
    let endPeriodDate;
    let entityName = '';
    this.commonService.listdefInputParams.subscribe((val) =>{
      if(!this.commonService.isEmptyValue(val)){
        accountStatementData = val.formData;
        userAccountBalance = val.userAccountBalance;
        startPeriodDate = val.startPeriodDate;
        endPeriodDate = val.endPeriodDate;
      }
    });

    if(accountStatementData['entity']){
      for(let i=0; i<accountStatementData['entity'].length; i++){
        entityName = entityName + accountStatementData.entity[i]['entityName'] + (i != 0 ? ', ' : '');
      }
    }

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(this.translate.instant(this.tableName));

    worksheet.addRow([this.translate.instant('Accounttype'), this.translate.instant('ACCOUNT_NO'), this.translate.instant('entity'),
                      this.translate.instant('accountName'), this.translate.instant('Status'),
                      this.translate.instant('accountCurrency'), this.translate.instant('ledgerBalance'),
                      this.translate.instant('availableBalance'), this.translate.instant('bankNameHeader'),
                      this.translate.instant('startDate'), this.translate.instant('endDate')]);

    worksheet.addRow([accountStatementData['description'], accountStatementData['number'], entityName,
                      accountStatementData['acctName'], this.titleCasePipe.transform(accountStatementData['status']),
                      accountStatementData['currency'], userAccountBalance['ledgerBalance'],
                      userAccountBalance['availableBalance'], accountStatementData['bankShortName'],
                      startPeriodDate, endPeriodDate]);

    worksheet.addRow([]);
    worksheet.addRow(this.tableHeaders);
    if (this.tableData.length == FccGlobalConstant.LENGTH_0) {
      worksheet.addRow([this.translate.instant('noRecordsFound')]);
    } else {
      const footerRow = [];
      let index = 0;
        for (let i = 0; i < this.tableHeaders.length; i++) {
          if (i == 0 && footerRow[0] === undefined) {
            footerRow[i] = this.translate.instant('totalAmt');
          } else if (this.tableHeaders[i].includes(this.translate.instant('DEPOSIT')) ||
            this.tableHeaders[i].includes(this.translate.instant('Amount')) ||
            this.tableHeaders[i].includes(this.translate.instant('WITHDRAWAL'))) {
            footerRow[i] = this.aggregateAmt[0][index];
            index++;
          } else {
            footerRow[i] = '';
          }
        }
        this.tableData.push(footerRow);

      worksheet.addRows(this.tableData);
    }
    const accountNumberLength = accountStatementData['number'].length;
    const fileName = this.translate.instant(this.fileName).trim() + '_' + accountStatementData['number']
                    .replace(accountStatementData['number'].substring(2,(accountNumberLength-2)), 'XXXXXX')
                    + `_${this.translate.instant('accountStatment')}`;
    this.santizeForXssInjection(workbook);
    workbook.csv.writeBuffer().then((data) => {
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + data], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `${fileName}.csv`);
    });
  }

  createListDataCSV() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(this.translate.instant(this.tableName));
    worksheet.addRow([this.translate.instant(this.tableName)]);
    worksheet.columns = this.tableHeadersCSV;
    worksheet.addRows(this.tableData);
    this.santizeForXssInjection(workbook);
    workbook.csv.writeBuffer().then((data) => {
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + data], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `${this.translate.instant(this.fileName)}.csv`);
    });
  }

  santizeForXssInjection(workbook : Workbook){
    if(workbook){
      workbook.eachSheet(worksheet => {
        worksheet.eachRow(row => {
          row.eachCell(cell =>{
            if(cell.value && cell.value.toString().length>=1){
              const leadingChar = cell.value.toString().trim().charAt(0);
              if('+' == leadingChar || '-' == leadingChar || '=' == leadingChar || '@' == leadingChar || '|' == leadingChar){
                cell.value = "'"+cell.value.toString();
              }
            }
          });
        });
      });
    }
  }

  createGroupListDataCSV() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(this.translate.instant(this.groupDetails[0].groupName));
    worksheet.columns = this.tableHeadersCSV;
    this.groupTableData.forEach(data => {
      worksheet.addRow([]);
      worksheet.addRows(data);
      worksheet.addRow([]);
    });
    this.santizeForXssInjection(workbook);
    workbook.csv.writeBuffer().then((data) => {
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + data], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `${this.translate.instant(this.groupDetails[FccGlobalConstant.GROUP_TITLE])}.csv`);
    });
  }

  checkFullDownloadExcelOrPDFOrCSV() {
    if (this.downloadOption === FccGlobalConstant.PDF_FULL_DOWNLOAD) {
      this.pdfGeneratorService.createListDataPDF(this.pdfMode, this.tableHeaders, this.tableData, this.columnHeader,
        this.columnData, this.tableName,false,null,null,this.isListLevelAccSummaryDownload,null,this.fileName,
        this.isAccountStatementDownload,this.statementFilters,this.accStatementRecordLimit);
    } else if (this.downloadOption === FccGlobalConstant.EXCEL_FULL_DOWNLOAD) {
      if (this.isListLevelAccSummaryDownload) {
        this.createListDataExcelAccountSummary();
      } else {
        this.createListDataExcel();
      }
    } else if (this.downloadOption === FccGlobalConstant.CSV_FULL_DOWNLOAD) {
      if (this.isListLevelAccSummaryDownload) {
        this.createListDataCSVAccountSummary();
      } else if(this.isAccountStatementDownload){
        this.createCSVAccountStatement();
      } else {
        this.createListDataCSV();
      }
    }
    this.commonService.isDownloadInProgress = false;
  }

  setListTableData(colData: any, tableHeaderList: any) {
    this.tableData = [];
    for (const listData of colData) {
      const row = [];
      let dataValue: any;
      tableHeaderList.forEach(header => {
        dataValue = this.getTableDataValue(header, listData);
        row.push(dataValue);
      });
      this.tableData.push(row);
    }
    if((this.isAccSummaryDashoabrd || this.isAccountStatementDownload) && !this.isListLevelAccSummaryDownload) {
      const aggregateAmt = [];
      const filterData = this.commonService.getAccountSummaryFilter();
      if(colData?.length>1 && filterData) {
        aggregateAmt.push(this.commonService.getCurrencyFormatedAmountForListdef(
          this.commonService.getBaseCurrency(),
          this.getTableDataValue(FccGlobalConstant.AGGREGATE1, colData[colData?.length - 1]), this.currencySymbolDisplayEnabled));
        aggregateAmt.push(this.getTableDataValue(FccGlobalConstant.AGGREGATE2, colData[colData?.length - 1]) == ' ' ?
          '-' : this.commonService.getCurrencyFormatedAmountForListdef(
            filterData.length != 0 ? filterData[FccGlobalConstant.ACCOUNT_CURRENCY] : this.commonService.getBaseCurrency(),
            this.getTableDataValue(FccGlobalConstant.AGGREGATE2, colData[colData?.length - 1]), this.currencySymbolDisplayEnabled));
        aggregateAmt.push(this.commonService.getCurrencyFormatedAmountForListdef(
          filterData.length != 0 ? filterData[FccGlobalConstant.ACCOUNT_CURRENCY] : this.commonService.getBaseCurrency(),
          this.getTableDataValue(FccGlobalConstant.AGGREGATE3, colData[colData?.length - 1]), this.currencySymbolDisplayEnabled));
        aggregateAmt.push(this.commonService.getCurrencyFormatedAmountForListdef(
          filterData.length != 0 ? filterData[FccGlobalConstant.ACCOUNT_CURRENCY] : this.commonService.getBaseCurrency(),
          this.getTableDataValue(FccGlobalConstant.AGGREGATE5, colData[colData?.length - 1]), this.currencySymbolDisplayEnabled));
      }
      this.aggregateAmt.push(aggregateAmt);
    }
  }

  getTableDataValue(header, listData) {
    let dataValue: any;
    switch (header) {
      case FccGlobalConstant.ACCOUNT_TYPE:
      case FccGlobalConstant.ACCOUNTTYPECODE:
        dataValue = this.translate.instant('N068_' + listData[header]);
        break;
      case FccGlobalConstant.PRODUCTCODE:
        dataValue = this.translate.instant('N001_' + listData[header]);
        break;
      case FccGlobalConstant.NEXT_AUTHORISER:
        dataValue = this.translate.instant(listData[header]);
        break;
      case FccGlobalConstant.TNXTYPECODE:
        dataValue = this.translate.instant('N002_' + listData[header]);
        break;
      case FccGlobalConstant.TOPIC:
          dataValue = this.translate.instant('P321_' + listData[header]);
        break;
      case FccGlobalConstant.SUB_TOPIC:
          dataValue = this.translate.instant('P812_' + listData[header]);
        break;
      case FccGlobalConstant.SUB_TNX_STAT_CODE:
        dataValue = this.translate.instant('N015_' + listData[header]);
        break;
      case FccGlobalConstant.PROD_STAT_CODE:
        dataValue = this.translate.instant('N005_' + listData[header]);
        break;
      case FccGlobalConstant.TENOR_TYPE:
        dataValue = this.translate.instant('DraftAgainst_' + listData[header]);
        break;
      case FccGlobalConstant.ENTITY:
        if ((listData[header].includes('displayedFieldValue') || listData[header].includes('fieldValuePassbackParameters'))
          && ((listData[header] !== 'displayedFieldValue') || listData[header] !== 'fieldValuePassbackParameters')) {
          dataValue = listData[header].split("displayedFieldValue\":\"").pop().split("\"}")[0];
        } else {
          dataValue = listData[header];
        }
        break;
      case FccGlobalConstant.ACCOUNT_ENTITY_ABBV_NAME:
        if(!this.commonService.isEmptyValue(listData['originalGroupedVal'])){
          dataValue = listData['originalGroupedVal'];
        } else {
          dataValue = listData[header];
        }
        break;
      case FccGlobalConstant.LC_EXP_DATE_TYPE_CODE:
        dataValue = this.translate.instant('expiryType_' + listData[header]);
        break;
      case FccGlobalConstant.FT_TYPE:
        dataValue = this.translate.instant('ftType_' + listData[header]);
        break;
      case FccGlobalConstant.TRANSACTION_TYPE:
        dataValue = this.translate.instant('C818_' + listData[header]);
        break;
      case FccGlobalConstant.SUB_TNX_STAT_CODE:
        if (listData[header] === '01'){
          dataValue = this.translate.instant('SECQBK_' + listData[header]);
        } else {
          dataValue = listData[header];
        }
        break;
      case FccGlobalConstant.subProductCode:
        if (listData[header] !== FccGlobalConstant.SAMPLE_COMMENT){
          dataValue = this.translate.instant('N047_' + listData[header]);
        } else {
          dataValue = listData[header];
        }
        break;
      case FccGlobalConstant.ACTION_REQ_CODE:
        dataValue = this.translate.instant('N042_' + listData[header]);
        break;
      case FccGlobalConstant.ENTITYCOL:
      case FccGlobalConstant.BENE_ACCOUNT_MASTER:
      case FccGlobalConstant.BENE_ACCOUNT_TNX:
        if (this.commonService.isnonEMptyString(listData[FccGlobalConstant.ORIG_GROUPED_VAL]))
        {
          dataValue = listData[FccGlobalConstant.ORIG_GROUPED_VAL];
        }else{
          dataValue = listData[header];
        }
        break;
      case FccGlobalConstant.BENE_DEFAULT_ACCOUNT:
        if( listData[header] === 'true'){
          dataValue = this.translate.instant('yes');
        } else{
          dataValue = this.translate.instant('no');
        }
        break;
      default:
        dataValue = listData[header];
    }
    return dataValue;
  }

  checkGroupsDownload(downloadOption: any, isGroupsDownloadEnabled: any, groupDetails: any, columnHeaders: any,
                      groupsColData: any, maxColForPDFMode?: any, excelDateFormat?: any,isAccSummaryDashoabrd?:any) {
    this.downloadOption = downloadOption;
    if (isAccSummaryDashoabrd) {
      const allGroupData = [];
      this.isAccSummaryDashoabrd = isAccSummaryDashoabrd;
      this.isListLevelAccSummaryDownload = false;
      groupsColData.forEach(listData => {
        allGroupData.push(this.setTableData(listData));
      });
      groupsColData = allGroupData;
      this.columnHeader = JSON.parse(JSON.stringify(columnHeaders));
      this.columnData = JSON.parse(JSON.stringify(groupsColData));
    } else {
      this.isAccSummaryDashoabrd = false;
    }

    this.isGroupsDownload = isGroupsDownloadEnabled;
    this.groupDetails = groupDetails;
    this.dateFormatForExcelDownload = excelDateFormat;
    if (isAccSummaryDashoabrd || (maxColForPDFMode && maxColForPDFMode < columnHeaders.length)) {
      this.pdfMode = FccGlobalConstant.PDF_MODE_LANDSCAPE;
    } else {
      this.pdfMode = FccGlobalConstant.PDF_MODE_PORTRAIT;
    }
    this.formatListData(columnHeaders, groupsColData);

    switch (this.downloadOption) {
      case FccGlobalConstant.PDF:
        this.pdfGeneratorService.createListDataPDF(this.pdfMode, this.tableHeaders, this.groupTableData, this.columnHeader, this.columnData,
          FccGlobalConstant.EMPTY_STRING, this.isGroupsDownload, this.groupDetails,null,this.isAccSummaryDashoabrd,this.aggregateAmt,
          this.fileName);
        break;
      case FccGlobalConstant.EXCEL:
        if (this.isAccSummaryDashoabrd) {
          this.createGroupListDataExcelAccountSummary();
        } else {
          this.createGroupListDataExcel();
        }
        break;
      case FccGlobalConstant.CSV:
        if (this.isAccSummaryDashoabrd) {
          this.createGroupListDataCSVAccountSummary();
        } else {
          this.createGroupListDataCSV();
        }
        break;
    }
  }

  checkPaymentSummaryDataDownloadOption(downloadOption: any, data: any,headers: any,subHeaders: any
    ,excelDateFormat?: any,duration?: any) {
      this.downloadOption = downloadOption;
      this.dateFormatForExcelDownload = excelDateFormat;
      switch (this.downloadOption) {
        case FccGlobalConstant.PDF:
          this.pdfGeneratorService.createPaymentSummaryPDF(FccGlobalConstant.PDF_MODE_PORTRAIT,FccGlobalConstant.PAYMENT_SUMMARY,data
            ,headers,subHeaders,duration);
          break;
        case FccGlobalConstant.EXCEL:
          this.createPaymentSummaryListDataExcel(data,duration,FccGlobalConstant.PAYMENT_SUMMARY,
            headers,subHeaders);
          break;
      }
  }

  createPaymentSummaryListDataExcel(data, duration, tableName, tableHeaders, subTableHeaders) {
    this.fileName = tableName;
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(this.translate.instant(tableName));
    const titleRow = worksheet.addRow([this.translate.instant(tableName)]);
    worksheet.mergeCells('A1:I1');
    titleRow.font = {
      size: 16,
      bold: true
    };
    titleRow.alignment = {
      vertical: 'middle', horizontal: 'center'
    };
    worksheet.addRow([]);
    const imageBase64Logo = this.pdfGeneratorService.getHeaderLogoForExcel();
    const imageLogoId = workbook.addImage({
      base64: imageBase64Logo,
      extension: 'png',
    });
    worksheet.addImage(imageLogoId, 'A2:B6');
    worksheet.mergeCells('A2:B6');
    worksheet.addRow([]);

    const downloadDate = new Date();
    const dateValue = this.datePipe.transform(downloadDate, this.dateFormatForExcelDownload);
    const timeValue = this.datePipe.transform(downloadDate, 'mediumTime');
    const detailsRow1 = worksheet.addRow([]);
    detailsRow1.getCell(1).value = this.translate.instant(FccGlobalConstant.COMPANY_NAME);
    detailsRow1.getCell(2).value = data.companyName;
    detailsRow1.getCell(5).value = this.translate.instant(FccGlobalConstant.DOWNLOAD_DATE_PAYMENT);
    detailsRow1.getCell(6).value = dateValue;

    const detailsRow2 = worksheet.addRow([]);
    detailsRow2.getCell(1).value = this.translate.instant(FccGlobalConstant.TOTAL_PAYMENT);
    detailsRow2.getCell(2).value = this.commonService.getCurrencyFormatedAmount(
      'INR',
      data.totalConsolidatedPackageAmount,
      this.currencySymbolDisplayEnabled);
    detailsRow2.getCell(5).value = this.translate.instant(FccGlobalConstant.DOWNLOAD_TIME_PAYMENT);
    detailsRow2.getCell(6).value = timeValue;

    worksheet.addRow([]);
    worksheet.addRow([]);
    const durationRow = worksheet.addRow([]);
    duration = this.translate.instant(duration);
    if (data.paymentsOverview.length > 0) {
      durationRow.getCell(1).value = this.translate.instant('DURATION_OF_TRANSACTION', { duration });
    } else {
      durationRow.getCell(1).value = this.translate.instant('noRecordsFound');
    }
    worksheet.mergeCells('A12:B12');
    worksheet.addRow([]);
    this.tableData = [];

    for (const listData of data.paymentsOverview) {
      const row = [];
      const subrows = [];
      let subrow;
      let dataValue: any;
      const headers = [];
      let subHeaders = [];
      tableHeaders.forEach(header => {
        if (header === FccGlobalConstant.CLIENT_DETAILS) {
          dataValue = listData[header];
          for (const subListData of dataValue) {
            subrow = [];
            let subDataValue: any;
            subHeaders = [];
            subTableHeaders.forEach(subHeader => {
              subHeaders.push(this.translate.instant(subHeader));
              subDataValue = subListData[subHeader];
              if (subHeader === FccGlobalConstant.CLIENT_AMT) {
                subDataValue = this.commonService.getCurrencyFormatedAmount(
                  'INR',
                  subDataValue,
                  this.currencySymbolDisplayEnabled);
              }
              subrow.push(subDataValue);
            });
            subrows.push(subrow);
          }

        } else {
          headers.push(this.translate.instant(header));
          dataValue = listData[header];
          if (header === FccGlobalConstant.PACKAGE_AMT) {
            dataValue = this.commonService.getCurrencyFormatedAmount(
              'INR',
              dataValue,
              this.currencySymbolDisplayEnabled);
          }
          row.push(dataValue);
        }
      });

      const headerRow = worksheet.addRow(headers);
      headerRow.font = {
        size: 11,
        bold: true
      };
      headerRow.alignment = {
        vertical: 'middle', horizontal: 'left'
      };
      // Cell Style : Fill and Border
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: FccGlobalConstant.PAYMENT_SUMMARY_HEADER_COLOR },
          bgColor: { argb: FccGlobalConstant.PAYMENT_SUMMARY_HEADER_COLOR }
        };
      });
      worksheet.addRow(row);
      const subHeaderRow = worksheet.addRow(subHeaders);

      subHeaderRow.alignment = {
        vertical: 'middle', horizontal: 'left'
      };
      // Cell Style : Fill and Border
      subHeaderRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: FccGlobalConstant.PAYMENT_SUMMARY_HEADER_COLOR },
          bgColor: { argb: FccGlobalConstant.PAYMENT_SUMMARY_HEADER_COLOR }
        };
      });
      worksheet.addRows(subrows);
      worksheet.addRow([]);
    }
    if (this.language === FccGlobalConstant.LANGUAGE_AR) {
      worksheet.views = [
        { rightToLeft: true }
      ];
    }
    this.santizeForXssInjection(workbook);
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${this.translate.instant(this.fileName)}.xlsx`);
    });
  }


  getCorporateDetails() {
    this.commonService.getCorporateDetailsAPI(FccGlobalConstant.REQUEST_INTERNAL).subscribe(response => {
      this.corporateDetails = response.body;
    });

    this.loggedInUserDetails = this.commonService.getLoggedInUserData();
  }

  getConfiguredFileName(response){
    let fileName = this.tableName;
    if(response && response.paramDataList.length > 0){
      if(response.paramDataList[0].key_3 === FccGlobalConstant.ACCOUNT_STATEMENT_PRODUCT_CODE){
        fileName = '';
      }else {
        if(this.commonService.isnonEMptyString(fileName)){
          fileName = this.translate.instant(fileName);
        }
      }
      const configName = response.paramDataList[0].data_1;
      if(configName && configName !== '**'){
        fileName = this.translate.instant(configName) + ' ' + fileName;
      }
      const companyNameFlag = response.paramDataList[0].data_2 == 'Y' ? true : false;
      if(companyNameFlag){
        const companyName = localStorage.getItem('companyName');
        fileName = fileName ? companyName + ' ' + fileName : companyName;
      }
    }
    return(fileName);
  }

}
