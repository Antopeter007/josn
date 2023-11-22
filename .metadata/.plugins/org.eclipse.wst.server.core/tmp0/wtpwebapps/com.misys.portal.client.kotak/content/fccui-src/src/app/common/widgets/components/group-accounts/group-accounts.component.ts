import { Component, OnInit, Input, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FccGlobalConstant } from '../../../core/fcc-global-constants';
import { SelectItem } from 'primeng/api';
import { CommonService } from '../../../../common/services/common.service';
import { ListDefService } from '../../../../common/services/listdef.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { MessageService } from 'primeng';
import { DashboardService } from './../../../services/dashboard.service';
import { ConfirmationDialogComponent } from './../../../../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { FccConstants } from '../../../core/fcc-constants';
import { CurrencyAbbreviationPipe } from '../../../../common/pipes/currency-abbreviation.pipe';
import { ListDataDownloadService } from '../../../../common/services/list-data-download.service';
@Component({
  selector: 'app-group-accounts',
  templateUrl: './group-accounts.component.html',
  styleUrls: ['./group-accounts.component.scss']
})
export class GroupAccountsComponent implements OnInit, AfterContentChecked {
  @Input () widgetDetails: any;
  accountCCY = '';
  enablecarousel: boolean;
  currentGroup: any;
  currentGroupName: any;
  viewCurrency: any;
  numVisible;
  enableGroupLimit: number;
  createbtnenable;
  viewInCurrency = '';
  activetab: boolean;
  dir = localStorage.getItem('langDir');
  currenciesList ;
  countries;
  createNewGroup ;
  invokeList = false;
  selectedCurrency;
  currencies = [];
  selectedValue = '';
  currency: SelectItem[] = [];
  tnxStatementType: any;
  groupDownloadEnabled: any;
  groupsTabledata: any;
  allowedDownloadOptions = ['PDF', 'Excel', 'CSV'];
  allGroupsData: any;
  groupDetails;
  noGroupMessage;
  noOfGroups: number;
  noOfAccounts;
  category;
  accountType;
  entityName;
  configuredData: any;
  filterParams;
  groupAccountsData: any[] = [];
  allGroupAccountsData: any[] = [];
  selectedGroupInfo: any;
  payment: any;
  noGroupsAdded = false;
  params: any = {};
  multipleTabEnable = false;
  tabName: string;
  currencyList = [];
  maxColumnForPDFModePortrait: any;
  dateFormatForExcelDownload: any;
  listDataDownloadLimit: any;
  minGroupAccounts: any;
  minUserAccounts: any;
  groupAccountCount: any;
  maxNumberOfGroups: number;
  groupStatus: any;
  activeGroup: any;
  displayInactiveAccounts: any;
  noGroupNoAccountMessage: any;
  editMsg: string;
  deleteMsg: string;

  constructor(
    protected commonService: CommonService,
    protected listDefService: ListDefService,
    protected changedetector: ChangeDetectorRef,
    protected translateService: TranslateService,
    public dialog: MatDialog,
    protected messageService: MessageService,
    public dashboardService: DashboardService,
    public dialogService: DialogService,
    protected currencyAbbreviation: CurrencyAbbreviationPipe,
    protected listDataDownloadService: ListDataDownloadService
  ) { }

  ngOnInit(): void {
    this.numVisible = 4;
    this.enableGroupLimit = 4;
    this.groupStatus = true;
    this.enablecarousel = false;
    this.activetab = false;
    this.widgetDetails = JSON.parse(this.widgetDetails);
    this.multipleTabEnable = (this.widgetDetails && this.widgetDetails.multipleTabEnable) ? this.widgetDetails.multipleTabEnable : false;
    this.tabName = (this.widgetDetails && this.widgetDetails.tabName && this.commonService.isnonEMptyString(this.widgetDetails.tabName)) ?
                    this.widgetDetails.tabName : FccGlobalConstant.EMPTY_STRING;
    this.setInputParams();
    this.getCurrencyDetail();
    this.selectedCurrency = 'USD';
    this.getUserGroupDetails();
    this.setCurrencyAndAmount();
    this.viewInCurrency = this.commonService.getBaseCurrency();
    this.commonService.loadDefaultConfiguration().subscribe(response => {
      if (response) {
         this.configuredData = response;
         this.currencyList = response.equivalentCurrencyList;
         this.maxColumnForPDFModePortrait = response.listDataPDFMaxColForPortraitMode;
         this.dateFormatForExcelDownload = response.listDataExcelDateFormat;
         this.listDataDownloadLimit = response.listDataMaxRecordsDownload;
         this.minGroupAccounts = response.minGroupAccounts;
         this.minUserAccounts = Number(response.minUserAccounts);
         this.maxNumberOfGroups = Number(response.maxNumberOfGroups);
         this.displayInactiveAccounts = response.displayInactiveAccounts;
      }
    });
    this.getUserAccounts();
    this.noGroupMessage = `${this.translateService.instant('noGroupMessage')}`;
    this.noGroupNoAccountMessage = `${this.translateService.instant('noGroupNoAccountMessage')}`;
    this.createNewGroup = `${this.translateService.instant('createNewGroup')}`;
    this.editMsg = `${this.translateService.instant('EDIT')}`;
    this.deleteMsg = `${this.translateService.instant('delete')}`;
  }

  getUserAccounts(){
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
          this.noOfAccounts = Number(result.count);
        }
      });
  }

  onClickDownloadOption(downloadOption: any) {
    this.setGroupsListData(true, downloadOption);
  }

  ngAfterContentChecked() {
    try {
      if (this.activetab === false) {
        document.querySelector('.tabOrder_1' ).classList.add('activeGroup');
      }
    } catch (e) {
    }
  }
  updateCurrency(event){
    this.selectedCurrency = event.target.value;
  }

  onCurrencyChange($event) {
    if ($event.value) {
      this.viewInCurrency = $event.value;
      this.selectedCurrency = $event.value;
      this.params[FccConstants.ACCOUNTCCY] = this.viewInCurrency;
      this.changedetector.detectChanges();
      this.onSelectionGroup(this.currentGroup);
    }
  }

  getCurrencyDetail() {
    this.commonService.loadDefaultConfiguration().subscribe(
      response => {
        if (response) {
          response.equivalentCurrencyList.forEach(element => {
            this.currency.push(element);
          });
        }
      });
    }


    toTitleCase(value) {
      return value.replace(
        /\w\S*/g,
        (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      );
    }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  retrieveFilterParams(event) {
    //eslint : no-empty-function
  }

  setCurrencyAndAmount() {
    this.viewCurrency = this.commonService.getBaseCurrency();
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

  setGroupsListData(isDownloadClicked?: boolean, downloadOption?: any) {
    const filterValuesList = [];
    this.groupDetails[FccGlobalConstant.GROUP_TITLE] = FccConstants.GROUP_ACCOUNTS_HEADER;
    this.groupDetails.forEach(group => {
      const filterValues = this.getFilterParams(group);
      filterValuesList.push(filterValues);
    });
    this.filterParams = JSON.stringify(filterValuesList);
    const paginatorParams = { first: 0, rows: this.listDataDownloadLimit, sortOrder: undefined, filters: {}, globalFilter: null };
    this.listDefService.getAllGroupsListData(this.params[FccGlobalConstant.LISTDEF_NAME],
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
          this.onSelectionGroup(this.groupDetails[0]);
        }
      }
    });
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

  getFilterParams(group: any) {
    const filterValues = {};
    if (this.commonService.isnonEMptyString(group.groupId)) {
      filterValues[FccGlobalConstant.GROUP_ID] = group.groupId;
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
    return filterValues;
  }

  getUserGroupDetails(){
    this.listDefService.getUserGroupsDetails(FccConstants.GROUP_TYPE_USER).subscribe( res => {
    if (res){
      if (res.groupDetails.length === 0){
        this.groupStatus = false;
      }
      this.noOfGroups = Number(res.groupCount);
      this.groupDetails = res.groupDetails;
      this.activeGroup = Number(res.groupCount);
      this.setGroupsListData(false);
      if (res.groupDetails.length > 0) {
        this.enablecarousel = true;
      }
      this.onSelectionGroup(this.groupDetails[0]);
    }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSelectionGroup(group: any, event?: any) {
    let groupData;
    this.listDefService.getUserGroupsDetails(FccConstants.GROUP_TYPE_USER).subscribe(res => {
      if (res) {
        groupData = res.groupDetails;
        groupData.forEach(element => {
          if (element.groupId === group.groupId) {
            this.groupAccountCount = element.groupAccountCount;
          }
        });
      }
    });
    this.currentGroup = group;
    this.currentGroupName = this.currentGroup[FccConstants.GROUP_NAME];
    const groupArr = [];
    this.groupDetails.forEach(element => {
      groupArr.push(element.groupId);
    });
    if (groupArr) {
      try {
        groupArr.forEach(element => {
          if (element !== group.groupId) {
            document.querySelector('.tabOrder_' + element).classList.remove('activeGroup');
          }
        });
      } catch (e) {
      }
    }
    try {
      document.querySelector('.tabOrder_' + group.groupId).classList.add('activeGroup');
      this.activetab = true;
    } catch (e) {
    }
    this.invokeList = false;
    this.changedetector.detectChanges();
    if (group && this.commonService.isnonEMptyString(group.groupId)) {
      this.invokeList = true;
      this.params[FccGlobalConstant.GROUPID] = group.groupId;
      this.params[FccConstants.ACCOUNTCCY] = this.viewInCurrency;
      this.params[FccGlobalConstant.BASE_CURRENCY] = this.viewInCurrency;
      this.params[FccGlobalConstant.ACTIONCONFIG] = true;
      this.selectedGroupInfo = group;
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
  setGroupData(group?) {
    this.listDefService.getUserGroupsDetails(FccConstants.GROUP_TYPE_USER).subscribe((resp) => {
      if (resp && resp.groupCount > FccGlobalConstant.ZERO) {
        if (!group) {
          this.invokeList = false;
          resp.groupDetails[0].checked = true;
          this.groupDetails = resp.groupDetails;
          this.setInputParams();
          this.setCurrencyAndAmount();
          this.onSelectionGroup(this.groupDetails[0]);
        } else {
          this.groupDetails = resp.groupDetails;
          this.setGroupsListData(false);
          this.onSelectionGroup(group);
        }
      } else {
        this.noGroupsAdded = true;
        this.groupStatus = false;
      }
    });
  }

  getSelectedAccounts($event){
    this.payment = $event;
  }

  edit() {
    this.selectedGroupInfo.classification = FccConstants.GROUP_TYPE_USER;
    const dialogRef = this.dialog.open(EditDialogComponent, {
        data: {
          payment: this.allGroupAccountsData,
          selectedGroupInfo: this.selectedGroupInfo,
          displayGroupName: true,
          accounts: this.groupAccountsData,
          header: FccConstants.MODIFY_GROUP,
          minGroupAccounts: this.minGroupAccounts

        }
    });
    dialogRef.afterClosed().subscribe(group => {
      if (group) {
        this.setGroupData(group);
      }
    });
  }

  createGroup(){
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        accounts: this.groupAccountsData,
        isCreateGroup: true,
        displayGroupName : true,
        header: FccConstants.CREATE_GROUP,
        minGroupAccounts: this.minGroupAccounts
      }
    });
    dialogRef.afterClosed().subscribe(group => {
      if (group) {
        this.setGroupData(group);
        this.getUserGroupDetails();
        this.getUserAccounts();
        this.groupStatus = true;
        this.enablecarousel = false;
      }
    });
  }

  deleteGroup(item: any){
    const headerField = `${this.translateService.instant(FccConstants.DELETE_GROUP)}`;
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      data: { locaKey: FccConstants.DELETE_GROUP_CONFIRMATION_MSG },
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir }
    });

    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.dashboardService
        .deleteGroup(item.groupId)
        .subscribe(() => {
          this.onConfirmationDelete(item.groupName);
          this.setGroupData(item);
          this.getUserGroupDetails();
          this.getUserAccounts();
        });
      }
    });
}

onConfirmationDelete(groupName: any) {
  const tosterObj = {
    maxOpened: 1,
    autoDismiss: true,
    life: 2000,
    key: 'tc',
    severity: 'success',
    detail: `${this.translateService.instant(groupName)}` + ' ' + `${this.translateService.instant('groupDeleteToasterMessage')}`
  };
  this.messageService.add(tosterObj);
}

}
