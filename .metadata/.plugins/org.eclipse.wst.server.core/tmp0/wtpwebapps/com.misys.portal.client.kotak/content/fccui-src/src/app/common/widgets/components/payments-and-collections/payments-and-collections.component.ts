import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../../common/services/common.service';
import { ListDataDownloadService } from '../../../../common/services/list-data-download.service';
import { FccConstants } from '../../../core/fcc-constants';
import { FccGlobalConstant } from '../../../core/fcc-global-constants';
import { CurrencyAbbreviationPipe } from '../../../pipes/currency-abbreviation.pipe';
import { ListDefService } from '../../../services/listdef.service';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-payments-and-collections',
  templateUrl: './payments-and-collections.component.html',
  styleUrls: ['./payments-and-collections.component.scss']
})
export class PaymentsAndCollectionsComponent implements OnInit {

  @Input () widgetDetails: any;
  params: any = {};
  dir = localStorage.getItem('langDir');
  groupDetails: any;
  invokeList = false;
  isDisplayAmtBalance = false;
  tnxStatementType: any;
  tnxStatementsFromPastNDays: any;
  maxColumnForPDFModePortrait: any;
  dateFormatForExcelDownload: any;
  listDataDownloadLimit: any;
  allGroupAccountsData: any[] = [];
  noGroupsAdded = false;
  noAccountsAdded = false;
  payment: any = {};
  selectedGroup: any;
  selectedGroupInfo: any;
  filterParams: any;
  groupDownloadEnabled: any;
  groupsTabledata: any;
  allowedDownloadOptions: any;
  allGroupsData: any;
  header: string;
  multipleTabEnable = false;
  tabName: string;
  viewInCurrency = '';
  displayBalance: any;
  currencyList = [];
  accountCCY: any;
  amountBalanceFilterValues: any;
  configuredData: any;
  groupAccountsData: any[] = [];
  editMsg: string;
  displayInactiveAccounts: any;

  constructor(protected listService: ListDefService, protected commonService: CommonService,
              protected changedetector: ChangeDetectorRef, protected translateService: TranslateService,
              protected listDataDownloadService: ListDataDownloadService, public dialog: MatDialog,
              protected currencyAbbreviation: CurrencyAbbreviationPipe,
              protected listDefService: ListDefService) { }

  ngOnInit(): void {
    this.editMsg = `${this.translateService.instant('EDIT')}`;
    this.viewInCurrency = this.commonService.getBaseCurrency();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
        this.configuredData = response;
        this.currencyList = response.equivalentCurrencyList;
        this.allowedDownloadOptions = response.listDataDownloadOptions;
        this.tnxStatementsFromPastNDays = response.statementsFromPastNDays;
        this.maxColumnForPDFModePortrait = response.listDataPDFMaxColForPortraitMode;
        this.dateFormatForExcelDownload = response.listDataExcelDateFormat;
        this.listDataDownloadLimit = response.listDataMaxRecordsDownload;
        this.params[FccGlobalConstant.POSTDATE] = this.tnxStatementsFromPastNDays + FccGlobalConstant.TIME_FRAME_DAYS;
        this.displayInactiveAccounts = response.displayInactiveAccounts;
      }
    });
    this.setHeader();
    this.setGroupData();
    this.getUserAccounts();
  }

  getUserAccounts() {
    const filterValues = {};
    if (this.configuredData && this.commonService.isNonEmptyValue(this.configuredData.groupAccountTypes) &&
      this.configuredData.groupAccountTypes !== FccGlobalConstant.EMPTY_STRING && this.configuredData.groupAccountTypes instanceof Array) {
      let stringValue = '';
      this.configuredData.groupAccountTypes.forEach(element => {
        const trimmedValue: string = element;
        stringValue = stringValue + trimmedValue.trim() + '|';
      });
      stringValue = stringValue.substring(0, stringValue.length - 1);
      filterValues[FccGlobalConstant.ACCOUNT_TYPE] = stringValue;
    }
    if (!this.displayInactiveAccounts) {
      filterValues[FccGlobalConstant.ACTIVE_FLAG] = FccGlobalConstant.CODE_Y;
    }
    this.filterParams = filterValues;
    this.listDefService.getTableData(FccConstants.ACCOUNTS_FOR_GROUPS , JSON.stringify(this.filterParams), '')
      .subscribe(result => {
        if (result) {
          this.groupAccountsData = result.rowDetails;
        }
      });
  }

  setHeader() {
    this.widgetDetails = JSON.parse(this.widgetDetails);
    this.multipleTabEnable = (this.widgetDetails && this.widgetDetails.multipleTabEnable) ? this.widgetDetails.multipleTabEnable : false;
    this.tabName = (this.widgetDetails && this.widgetDetails.tabName && this.commonService.isnonEMptyString(this.widgetDetails.tabName)) ?
                    this.widgetDetails.tabName : FccGlobalConstant.EMPTY_STRING;
  }

  setGroupData(group?: any) {
    this.listService.getUserGroupsDetails(FccGlobalConstant.GROUP_TYPE_SYSTEM).subscribe((resp) => {
      if (resp && resp.groupCount > FccGlobalConstant.ZERO) {
        if (!group) {
          this.invokeList = false;
          this.isDisplayAmtBalance = false;
          this.groupDetails = resp.groupDetails;
          this.setInputParams();
          this.setGroupsListData();
        } else {
          this.groupDetails = resp.groupDetails;
          this.setGroupsListData(false, FccGlobalConstant.EMPTY_STRING, group);
        }
      } else {
        this.noGroupsAdded = true;
      }
      this.noAccountsAdded = this.isNoAccountsAdded();
    });
  }

  isNoAccountsAdded() {
    let noAccountsAdded = true;
    if (this.commonService.isNonEmptyValue(this.groupDetails)) {
    this.groupDetails.forEach(group => {
      if (group.groupAccountCount > FccGlobalConstant.ZERO) {
        noAccountsAdded = false;
        return noAccountsAdded;
      }
    });
    return noAccountsAdded;
  }
  }

  setInputParams() {
    if (this.widgetDetails && this.widgetDetails.TabConfig && this.widgetDetails.TabConfig.length > 0) {
      for (const tabconfig of this.widgetDetails.TabConfig) {
        Object.keys(tabconfig).forEach(element => {
          this.params[element] = this.checkForBooleanValue(tabconfig[element]);
        });
      }
      this.params[FccGlobalConstant.WIDGET_NAME] = this.widgetDetails.tabName;
      this.params[FccGlobalConstant.ACTIONCONFIG] = true;
      this.params[FccGlobalConstant.WILDSEARCH] = true;
      this.params[FccConstants.ACCOUNTCCY] = this.viewInCurrency;
      if (!this.displayInactiveAccounts) {
        this.params.activeFlag = FccGlobalConstant.CODE_Y;
      }
      this.params[FccGlobalConstant.ENABLE_LIST_DATA_DOWNLOAD] = this.params[FccGlobalConstant.DOWNLOAD_ICON_ENABLED];
      this.groupDownloadEnabled = this.params[FccGlobalConstant.GROUPS_DOWNLOAD_ICON_ENABLED];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  retrieveFilterParams(event) {
    //eslint : no-empty-function
  }

  checkForBooleanValue(value: string) {
    switch (value) {
      case 'true':
        return true;
      case 'false':
        return false;
      default:
        return value;
    }
  }

  onSelectionGroup(group: any) {
    this.invokeList = false;
    this.selectedGroup = group;
    this.changedetector.detectChanges();
    if (group && this.commonService.isnonEMptyString(group.groupId)) {
      if (this.noAccountsAdded) {
        this.invokeList = false;
      } else {
        this.invokeList = true;
      }
      this.params[FccGlobalConstant.GROUPID] = group.groupId;
      const amountColValue = this.getAmountColumnValue(group.groupName);
      this.params[FccGlobalConstant.AMOUNT_COL_VALUE] = amountColValue;
      this.tnxStatementType = this.translateService.instant(amountColValue);
      this.checkSelectedGroup(group);
      this.selectedGroupInfo = group;
      if (this.commonService.isnonEMptyString(this.selectedGroupInfo)) {
        const filterParams = this.getFilterParams(this.selectedGroupInfo);
        this.amountBalanceFilterValues = JSON.stringify(filterParams);
      }
      const filterValues = {};
      filterValues[FccGlobalConstant.GROUP_ID] = group.groupId;
      if (!this.displayInactiveAccounts) {
        filterValues[FccGlobalConstant.ACTIVE_FLAG] = FccGlobalConstant.CODE_Y;
      }
      this.commonService.getAllAccountsMappedToGroup(filterValues).subscribe(result => {
        if (result) {
          this.allGroupAccountsData = result.rowDetails;
        }
      });
    }
  }

  getAmountColumnValue(groupName: any) {
    if (groupName && (groupName === FccGlobalConstant.PAYMENT)) {
      return FccGlobalConstant.DEBIT;
    } else {
      return FccGlobalConstant.CREDIT;
    }
  }

  setGroupsListData(isDownloadClicked = false, downloadOption?: any, selectedGroup?: any) {
    const filterValuesList = [];
    this.groupDetails[FccGlobalConstant.GROUP_TITLE] = FccGlobalConstant.PAYMENTS_AND_COLLECTIONS;
    this.groupDetails.forEach(group => {
      const filterValues = this.getFilterParams(group);
      filterValuesList.push(filterValues);
    });
    this.filterParams = JSON.stringify(filterValuesList);
    const paginatorParams = { first: 0, rows: this.listDataDownloadLimit, sortOrder: undefined, filters: {}, globalFilter: null };
    this.listService.getAllGroupsListData(this.params[FccGlobalConstant.LISTDEF_NAME],
      this.filterParams, JSON.stringify(paginatorParams)).subscribe((resp) => {
      if (resp && resp.groupsData && resp.groupsData.length > FccGlobalConstant.ZERO) {
        this.setAmountBalance(resp.groupsData);
        this.setTableData(resp.groupsData);
        if (isDownloadClicked === true) {
          if (this.commonService.tableColumnHeaders) {
            const isGroupDataDownload = true;
            const tableHeaders = this.commonService.tableColumnHeaders;
            this.listDataDownloadService.checkGroupsDownload(downloadOption, isGroupDataDownload, this.groupDetails, tableHeaders,
                                                             this.allGroupsData, this.maxColumnForPDFModePortrait,
                                                             this.dateFormatForExcelDownload);
          }
        } else {
          if (selectedGroup) {
            this.onSelectionGroup(selectedGroup);
          } else {
            this.onSelectionGroup(this.groupDetails[0]);
          }
        }
      }
    });
  }

  getFilterParams(group: any) {
    const filterValues = {};
    if (this.commonService.isnonEMptyString(group.groupId)) {
      filterValues[FccGlobalConstant.GROUP_ID] = group.groupId;
    }
    if (this.commonService.isnonEMptyString(group.groupName)) {
      filterValues[FccGlobalConstant.AMOUNT_COLUMN_VALUE] = this.getAmountColumnValue(group.groupName);
    }
    if (this.commonService.isnonEMptyString(this.params[FccGlobalConstant.BASE_CURRENCY])) {
      filterValues[FccGlobalConstant.BASE_CURRENCY_APPLICABILITY] = this.params[FccGlobalConstant.BASE_CURRENCY];
    }
    if (this.commonService.isnonEMptyString(this.params[FccConstants.ACCOUNTCCY])) {
      filterValues[FccGlobalConstant.ACCOUNT_CURRENCY] = this.params[FccConstants.ACCOUNTCCY];
    }
    if (!this.displayInactiveAccounts) {
      filterValues[FccGlobalConstant.ACTIVE_FLAG] = FccGlobalConstant.CODE_Y;
    }
    filterValues[FccGlobalConstant.POST_DATE] = this.params[FccGlobalConstant.POSTDATE] ? this.params[FccGlobalConstant.POSTDATE] : null;
    return filterValues;
  }

  onClickDownloadOption(downloadOption: any) {
    this.setGroupsListData(true, downloadOption, FccGlobalConstant.EMPTY_STRING);
  }

  setTableData(tableresponse) {
    this.allGroupsData = [];
    if (tableresponse && tableresponse.length > FccGlobalConstant.ZERO) {
      tableresponse.forEach(group => {
        const tempTableData = group.rowDetails;
        if (tempTableData) {
          const tabledata = [];
          tempTableData.forEach(element => {
            const obj = {};
            element.index.forEach(ele => {
                obj[ele.name] = this.commonService.decodeHtml(ele.value);
            });
            tabledata.push(obj);
          });
          this.allGroupsData.push(tabledata);
        }
      });
    }
  }

  setAmountBalance(tableresponse) {
    if (tableresponse && tableresponse.length > FccGlobalConstant.ZERO) {
      for (let i = 0; i < tableresponse.length; i++) {
        if (tableresponse[i] && this.commonService.isnonEMptyString(tableresponse[i].totalAmountBalance)) {
          this.groupDetails[i].totalAmountBalance = tableresponse[i].totalAmountBalance;
          const totalAmt = this.currencyAbbreviation.transform(tableresponse[i].totalAmountBalance);
          this.groupDetails[i].displayTotalAmtBalance = this.viewInCurrency + FccGlobalConstant.BLANK_SPACE_STRING + totalAmt;
        }
      }
    }
    this.isDisplayAmtBalance = true;
  }

  getSelectedAccounts($event) {
      this.payment = $event;
  }

  edit() {
    this.selectedGroupInfo.classification = FccGlobalConstant.GROUP_TYPE_SYSTEM;
    const dialogRef = this.dialog.open(EditDialogComponent, {
        data: {
          payment: this.allGroupAccountsData,
          selectedGroupInfo: this.selectedGroupInfo,
          header: FccGlobalConstant.EDIT_GROUP,
          accounts: this.groupAccountsData,
        }
    });
    dialogRef.afterClosed().subscribe(group => {
      if (group) {
        this.payment = {};
        this.setGroupData(group);
      }
    });
  }

  onCurrencyChange($event) {
    if ($event.value) {
      this.invokeList = false;
      this.isDisplayAmtBalance = false;
      this.viewInCurrency = $event.value;
      this.params[FccConstants.ACCOUNTCCY] = this.viewInCurrency;
      this.setGroupsListData();
      this.changedetector.detectChanges();
    }
  }

  checkSelectedGroup(selectedGroup: any) {
    this.groupDetails.forEach(group => {
      if (selectedGroup.groupId === group.groupId) {
        group.checked = true;
      } else {
        group.checked = false;
      }
    });
  }

}
