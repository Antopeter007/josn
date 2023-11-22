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

export class AccountStatementDownloadService {
    private downloadOption: any;
    private pdfMode: any;
    private listDataDownloadLimit: any;
    private completeTableData;
    private tableName: any;
    private fileName: any;
    private tableHeaders: any[] = [];
    private tableHeadersCSV: any[] = [];
    private tableData: any;
    private excludeColumns = [FccGlobalConstant.ACTION];
    private columnHeader: any;
    private columnData: any;
    public corporateDetails: CorporateDetails;
    private selectedColHeader = [];
    currencySymbolDisplayEnabled = false;
    isAccSummaryDashoabrd = false;
    isListLevelAccSummaryDownload = false;
    isAccountStatementDownload = false;
    aggregateAmt = [];

    constructor(protected translate: TranslateService, protected commonService: CommonService,
                protected pdfGeneratorService: PdfGeneratorService, protected listService: ListDefService,
                public datePipe: DatePipe, protected titleCasePipe:TitleCasePipe,
                protected utilityService: UtilityService) {
                  this.commonService.getBankContextParameterConfiguredValues(FccGlobalConstant.PARAMETER_P809).subscribe(
                    (response) => {
                      if (this.commonService.isNonEmptyValue(response) &&
                      this.commonService.isNonEmptyValue(response.paramDataList) && FccGlobalConstant.DATA_1 !== undefined ) {
                        this.currencySymbolDisplayEnabled = response.paramDataList[0][FccGlobalConstant.DATA_1] === 'y';
                      }
                    }
                  );
                }
  checkListDataDownloadOption(downloadOption: any, colHeader: any, colData: any, widgetDetails: any,
                              maxColForPDFMode?: any, excelDateFormat?: any, maxDataDownload?: any, fileConfigData?: any) {

    this.tableName = (widgetDetails && widgetDetails.widgetName
      && widgetDetails.widgetName !== FccGlobalConstant.CHEQUE_TITLE) ?
      (widgetDetails.widgetName) :
      (widgetDetails.activeTab && widgetDetails.activeTab.localizationKeyPdf) ?
        `${this.translate.instant(widgetDetails.activeTab.localizationKeyPdf)} `
        + `${this.translate.instant(widgetDetails.productCode)} List` +
        `${widgetDetails.activeTab.extraPdfTitle ? this.translate.instant(widgetDetails.activeTab.extraPdfTitle) : ''}` :
        widgetDetails.activeTab?.localizationKey ? `${this.translate.instant(widgetDetails.activeTab.localizationKey)} `
          + `${this.translate.instant(widgetDetails.productCode)} List` +
          `${widgetDetails.activeTab.extraPdfTitle ? this.translate.instant(widgetDetails.activeTab.extraPdfTitle) : ''}` :
          FccGlobalConstant.LIST_DATA_TITLE;

    if (widgetDetails && widgetDetails.appendTabNameDownloadHeader)
    {
      this.tableName = this.tableName + '_' + widgetDetails.tabName;
    }

    if (widgetDetails && widgetDetails.productCode === FccGlobalConstant.ACCOUNT_STATEMENT_PRODUCT_CODE)
    {
      this.isAccountStatementDownload = true;
    }

    this.fileName = this.getConfiguredFileName(fileConfigData);

    this.downloadOption = downloadOption;
    /* deep copy */
    this.columnHeader = JSON.parse(JSON.stringify(colHeader));
    this.columnData = JSON.parse(JSON.stringify(colData));
    this.listDataDownloadLimit = maxDataDownload;
    if (maxColForPDFMode && maxColForPDFMode < this.columnHeader.length) {
      this.pdfMode = FccGlobalConstant.PDF_MODE_LANDSCAPE;
    } else {
      this.pdfMode = FccGlobalConstant.PDF_MODE_PORTRAIT;
    }
    switch (this.downloadOption.toUpperCase()) {
      case FccGlobalConstant.CSV:
        this.fetchCompleteTableData(widgetDetails);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const downloadOption = this.downloadOption.toLowerCase();
    const sum = 'controlSum';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const amt = ['amt', 'tnx_amt', sum, 'maturity_amount', 'principal_amount', 'RunningStatement@AvailableBalance@amt',
      'convertedPrincipal_amount', 'RunningStatement@AvailableBalance@convertedAmt', 'convertedMaturity_amount'];
    if (this.commonService.isnonEMptyString(colHeader) && colHeader.length > FccGlobalConstant.ZERO) {
      this.createDataForMergeFileds(this.columnHeader ? this.columnHeader : colHeader, this.columnData ? this.columnData : colData);
      const tableHeaderList: any[] = [];
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
      if (this.downloadOption !== FccGlobalConstant.PDF_CURRENT_DOWNLOAD) {
        this.setListTableData(colData, tableHeaderList);
      }
    }
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
    }
    const filterParams = JSON.stringify(widgetDetails['filterParams']);
    const paginatorParams = { first: 0, rows: this.listDataDownloadLimit, sortOrder: undefined, filters: {}, globalFilter: null };
    this.listService.getTableData(listDefName, filterParams , JSON.stringify(paginatorParams))
      .subscribe(result => {
      this.setTableData(result);
    });
  }

  setTableData(tableresponse: any) {
    const tempTableData = tableresponse.rowDetails;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filteredData = this.commonService.getAccountSummaryFilter();
    this.completeTableData = [];
    if (tempTableData) {
      tempTableData.forEach(element => {
        const obj = {};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const amt = 'amt';
        const curCode = 'cur_code';
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        let amountField;
        let amount;
        let currencyCode;
        let valueToCheck;
        element.index.forEach(ele => {
          valueToCheck = (this.commonService.isNonEmptyValue(ele.displayValue) &&
          this.commonService.isNonEmptyValue(ele.showdisplayValue)) ? ele.displayValue : ele.value;
          valueToCheck = (this.commonService.isNonEmptyValue(ele.groupedValues))
                          ? this.commonService.formatGroupedColumns(FccGlobalConstant.EXPORT_LIST, ele.groupedValues) :
                            valueToCheck;
          obj[ele.name] = valueToCheck ? this.commonService.decodeHtml(valueToCheck) : FccGlobalConstant.SAMPLE_COMMENT;
        });
        if (this.downloadOption.toLowerCase().indexOf('pdf') > -1) {
          obj[amountField] = this.commonService.getCurrencyFormatedAmountForListdef(
            currencyCode, amount, this.currencySymbolDisplayEnabled);
        } else {
        }
        obj[sum] = this.commonService.getCurrencyFormatedAmount(obj[ccy], obj[sum], this.currencySymbolDisplayEnabled);
        obj[prinAmount] = this.commonService.getCurrencyFormatedAmount(
          obj[curCode], obj[prinAmount], this.currencySymbolDisplayEnabled);
        obj[matAmount] = this.commonService.getCurrencyFormatedAmount(obj[curCode], obj[matAmount], this.currencySymbolDisplayEnabled);
        obj[balAmt] = this.commonService.getCurrencyFormatedAmount(obj[curCode], obj[balAmt], this.currencySymbolDisplayEnabled);
        obj[convertedPrincipalAmount] = this.commonService.getCurrencyFormatedAmount(
          baseCurrency, obj[convertedPrincipalAmount], this.currencySymbolDisplayEnabled);
        obj[convertedAmount] = this.commonService.getCurrencyFormatedAmount(
          baseCurrency, obj[convertedAmount], this.currencySymbolDisplayEnabled);
        obj[convertedMaturityAmount] = this.commonService.getCurrencyFormatedAmount(
          baseCurrency, obj[convertedMaturityAmount], this.currencySymbolDisplayEnabled);
        this.completeTableData.push(obj);
      });
    }

    if (this.completeTableData && this.completeTableData.length > FccGlobalConstant.ZERO) {
      this.columnData = this.completeTableData;
    }
    this.formatListData(this.columnHeader, this.columnData);
    this.downloadFile();
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
      worksheet.addRow([this.translate.instant('noTransactionFound')]);
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
    workbook.csv.writeBuffer().then((data) => {
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + data], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `${fileName}.csv`);
    });
  }

  downloadFile() {
    if (this.downloadOption.toUpperCase() === FccGlobalConstant.CSV) {
      this.createCSVAccountStatement();
    }
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
    if(this.isAccountStatementDownload) {
      const aggregateAmt = [];
      if(colData?.length>1) {
        const filterData = this.commonService.getAccountSummaryFilter();
        aggregateAmt.push(this.commonService.getCurrencyFormatedAmountForListdef(
          this.commonService.getBaseCurrency(),
          this.getTableDataValue(FccGlobalConstant.AGGREGATE1, colData[colData?.length - 1]),
          this.currencySymbolDisplayEnabled));
        aggregateAmt.push(this.commonService.getCurrencyFormatedAmountForListdef(
          (filterData != null && filterData.length != 0) ? filterData[FccGlobalConstant.ACCOUNT_CURRENCY] :
          this.commonService.getBaseCurrency(),
          this.getTableDataValue(FccGlobalConstant.AGGREGATE2, colData[colData?.length - 1]),
          this.currencySymbolDisplayEnabled));
        aggregateAmt.push(this.commonService.getCurrencyFormatedAmountForListdef(
          (filterData != null && filterData.length != 0) ? filterData[FccGlobalConstant.ACCOUNT_CURRENCY] :
          this.commonService.getBaseCurrency(),
          this.getTableDataValue(FccGlobalConstant.AGGREGATE3, colData[colData?.length - 1]),
          this.currencySymbolDisplayEnabled));
      }
      this.aggregateAmt.push(aggregateAmt);
    }
  }

  getTableDataValue(header, listData) {
    const dataValue = listData[header];
    return dataValue;
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
        fileName = companyName + ' ' + fileName;
      }
    }
    return(fileName);
  }

}
