import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';

import {
  ConfirmationDialogComponent,
} from '../../corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { ReAuthComponent } from '../components/re-auth/re-auth.component';
import { SearchLayoutComponent } from '../components/search-layout/search-layout.component';
import { SessionWarningDialogComponent } from '../components/session-warning-dialog/session-warning-dialog.component';
import { ViewChequestatusComponent } from '../components/view-chequestatus/view-chequestatus.component';
import { FccConstants } from '../core/fcc-constants';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { LegalTextComponent } from './../components/legal-text/legal-text.component';
import { CommonService } from './common.service';
import { FormService } from './listdef-form-service';
import { ListDefService } from './listdef.service';
import { PaymentTansactionPopupComponent } from '../../../app/common/components/payment-tansaction-popup/payment-tansaction-popup.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResolverService {
  displayableJsonValue: any;
  metadata: any;
  inputParams: any = {};
  selectedRowsdata: any[] = [];
  dir: any;
  approvalByTransaction: any = false;
  instrumentLevelConfigFlag: any = false;
  viewAllInfoFlag: any = false;
  isDisableCommentSectionBtn = new BehaviorSubject(null);
  clickedCommentSectionBtn = null;

  constructor(protected dialogService: DialogService, protected commonService: CommonService,
              protected translateService: TranslateService,
              protected formService: FormService, protected listDefService: ListDefService,
              protected router: Router) {
    this.commonService.openReauthDialog$.subscribe(flag => {
      this.openReauthDialog(flag);
    });
    this.commonService.openSessionWarningDialog$.subscribe(flag => {
      this.openSessionDialog(flag);
    });
    this.commonService.openChipConfirmationDialog$.subscribe(data => {
      if (data) {
        this.openChipConfirmationDialog(data);
      }
    });
    this.commonService.openConfirmationDialog$.subscribe(data => {
      if (data) {
        this.openConfirmationDialog(data);
      }
    });
    this.commonService.openLegelTextDialog$.subscribe(flag => {
      this.openLegalTextDialog(flag);
    });
  }

  CONFIRMATION = 'confirmation';

  getSearchData(Header: string, obj: any) {
    const dir = localStorage.getItem('langDir');
    this.dialogService.open(SearchLayoutComponent, {
      data: obj,
      header: Header,
      width: '70vw',
      contentStyle: {
        height: '70vh',
        overflow: 'auto',
        backgroundColor: '#fff'
      },
      styleClass: 'searchLayoutClass',
      showHeader: true,
      baseZIndex: 9000,
      autoZIndex: true,
      dismissableMask: false,
      closeOnEscape: true,
      style: { direction: dir },
    });
  }

  openReauthDialog(flag) {
    const dir = localStorage.getItem('langDir');
    if (flag) {
      this.dialogService.open(ReAuthComponent, {
        header: `${this.translateService.instant(this.CONFIRMATION)}`,
        contentStyle: {
          overflow: 'auto',
          backgroundColor: '#fff',
          width: '37em'
        },
        styleClass: 'reauthClass',
        style: { direction: dir },
        showHeader: true,
        baseZIndex: 9999,
        autoZIndex: true,
        dismissableMask: false,
        closeOnEscape: true
      });
    }
  }

  openSessionDialog(flag) {
    if (flag) {
      this.dialogService.open(SessionWarningDialogComponent, {
        header: `${this.translateService.instant('warning')}`,
        contentStyle: {
          overflow: 'auto',
          backgroundColor: '#fff'
        },
        styleClass: 'sessionClass',
        showHeader: true,
        baseZIndex: 9999,
        autoZIndex: true,
        dismissableMask: true,
        closeOnEscape: true
      });
    }
  }

  openChipConfirmationDialog(data) {
    if (this.isDataObjValid(data)) {
      const action = data.presentValue === data.previousValue ? 'deselect' : 'toggle';

      let localKey;
      if (data.locaKey)
      {
        localKey = data.locaKey;
      }
      else {
      localKey = data.presentValue === data.previousValue ? 'deSelectConfirmationMsg' : 'toggleConfirmationMsg';
      }
      const dir = localStorage.getItem('langDir');
      const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        header: `${this.translateService.instant(this.CONFIRMATION)}`,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir },
        data: { locaKey: localKey }
      });
      const response = {
        controlName: data.controlName,
        presentValue: data.presentValue,
        previousValue: data.previousValue, // in case of toggle, it will be previously selected value
        action, // toggle or deselect
      };

      let userInput;

      dialogRef.onClose.subscribe(result => {
        if (result.toLowerCase() !== 'yes') {
          response[FccGlobalConstant.ACTION] = 'cancelled';
        }
        userInput = result.toLowerCase();
        this.commonService.responseChipConfirmationDialog$.next(response);
      });

      dialogRef.onDestroy.subscribe((result: any) => {
        if (!userInput) {
          if (!result) {
            response[FccGlobalConstant.ACTION] = 'cancelled';
          }
          this.commonService.responseChipConfirmationDialog$.next(response);
        }
      });
    }
  }

  openConfirmationDialog(data) {
    if (this.isDataObjValid(data)) {
      const localKey = data.locaKey;
      const dir = localStorage.getItem('langDir');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
        header: `${this.translateService.instant(this.CONFIRMATION)}`,
        width: '35em',
        styleClass: 'fileUploadClass',
        style: { direction: dir },
        data: { locaKey: localKey,
          showOkButton: true,
          showNoButton: false,
          showYesButton: false }
      });
    }
  }

  isDataObjValid(data): boolean {
    return data.event && data.controlName && data.presentValue && data.previousValue;
  }

  openLegalTextDialog(flag) {
    if (flag){
    const dir = localStorage.getItem('langDir');
    this.dialogService.open(LegalTextComponent, {
      header: `${this.translateService.instant('FOOTER_TERMS_CONDITIONS')}`,
      contentStyle: {
        overflow: 'auto',
        backgroundColor: '#fff',
        width: '37em'
      },
      styleClass: 'reauthClass',
      style: { direction: dir },
      showHeader: true,
      autoZIndex: true,
      dismissableMask: false,
      closeOnEscape: true
    });
  }
  }

  handleViewStatuspopup() {
    const headerField = `${this.translateService.instant(FccConstants.VIEW_CHECK_STATUS)}`;
    const filterParams = '';
    this.listDefService.getMetaData(FccConstants.VIEW_CHEQUE_STATUS_LISTDEF, FccGlobalConstant.PRODUCT_SE, filterParams)
      .subscribe(response => {
        this.displayableJsonValue = undefined;
        this.metadata = response;
        this.displayableJsonValue = this.formService.getFields(this.metadata, FccGlobalConstant.PRODUCT_SE);
        const dialogRef = this.dialogService.open(ViewChequestatusComponent, {
          data: this.displayableJsonValue,
          header: headerField,
          width: '65em',
          contentStyle: {
            height: '29em',
            overflow: 'auto'
          },
          styleClass: 'filterButton searchLayoutClass',
          style: { direction: this.dir },
          showHeader: true,
          baseZIndex: 9999,
          autoZIndex: true,
          dismissableMask: false,
          closeOnEscape: true
        });
        dialogRef.onClose.subscribe((result: any) => {
          const controls = Object(result.controls);
          const map = Object.keys(controls).map(key => ({ type: key, value: controls[key] }));
          let index: any;
          const viewDetails: any[] = [];
          const viewEntries: any = {};
          this.inputParams = {};
          for (index = 0; index < map.length; index++) {
            if (this.commonService.isnonEMptyString(map[index].value.value) || this.chequeSpacer(map[index])) {
              if (map[index].value.value instanceof Object) {
                this.inputParams[map[index].type] = map[index].value.value.accountNo;
                viewEntries[FccGlobalConstant.KEY] = map[index].type;
                viewEntries[FccGlobalConstant.VALUE] = map[index].value.value.accountNo;
              } else {
                if (map[index].type === 'chequeno') {
                  viewEntries[FccGlobalConstant.KEY] = map[index].type;
                  switch (map[index].value.value) {
                    case '01':
                      viewEntries[FccGlobalConstant.VALUE] = 'Single';
                      break;
                      case '02':
                        viewEntries[FccGlobalConstant.VALUE] = 'Range';
                        break;
                        case '03':
                        viewEntries[FccGlobalConstant.VALUE] = 'Multiple';
                        break;
                    default:
                      viewEntries[FccGlobalConstant.VALUE] = map[index].value.value;
                      break;
                  }
                 } else {
                this.inputParams[map[index].type] = map[index].value.value;
                viewEntries[FccGlobalConstant.KEY] = map[index].type;
                viewEntries[FccGlobalConstant.VALUE] = map[index].value.value;
                  }
              }
              viewDetails.push({ ...viewEntries });
            }
          }
          this.commonService.isSpacerRequired = false;
          const filterParamValues = this.prepareFilterParams();
          const formValues = {};
          formValues[FccConstants.VIEW_DETAILS] = viewDetails;
          formValues[FccConstants.FILTER_PARAM_VALUES] = filterParamValues;
          this.commonService.chequeViewDetailsLoad(formValues);
          localStorage.setItem('viewStatusData', JSON.stringify(formValues));
          this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/statusListing']);
          });
        });
      });
  }

  updateBatchStatus(paymentReferenceNumber){
    const formValues = {};
    const filterParams = {};
    const batchDetailsNew = [];
    const request = {
      'paymentReferenceNumber': paymentReferenceNumber, 'pageSize': 10, first: 0
    };
    this.commonService.getPaymentDetails(request).subscribe(resp => {
      if (resp) {
        const submitResponse = resp.data;
        this.commonService.batchStatus = submitResponse.paymentHeader.batchStatus;
        const val = this.commonService.balanceDetail;
        this.commonService.batchTransactionBalance.next(val);
        const detailsList = JSON.parse(localStorage.batchDetailsData).viewDetails;
        detailsList.forEach(detail => {
          const details = {};
          details[FccGlobalConstant.KEY] = detail[FccGlobalConstant.KEY];
          if (detail[FccGlobalConstant.KEY] === 'batchStatus'){
            details[FccGlobalConstant.VALUE] = submitResponse.paymentHeader.batchStatus;
          } else {
            details[FccGlobalConstant.VALUE] = detail[FccGlobalConstant.VALUE];
          }
          batchDetailsNew.push(details);
        });
        filterParams['paymentReferenceNumber'] = paymentReferenceNumber;
        formValues[FccConstants.VIEW_DETAILS] = batchDetailsNew;
        formValues[FccConstants.FILTER_PARAM_VALUES] = filterParams;
        localStorage.setItem('batchDetailsData', JSON.stringify(formValues));
        this.commonService.refreshBatchDetails.next(true);
      }});
  }

  handleFcmBatchDetailsScreen(urlLink, rowData) {
    const formValues = {};
    const batchDetails = [];
    const filterParams = {};
    let filterParam: any = {};
    filterParam.packageId = rowData.methodOfPayment;
    filterParam= JSON.stringify(filterParam);
    this.commonService.getExternalStaticDataList(FccGlobalConstant.APPROVAL_LEVEL, filterParam)
            .subscribe((response) => {
              if (null !== response &&
                ((response[0]?.approval_levels === '0')
                || rowData['batchStatus'] === FccGlobalConstant.PENDINGMYVERIFICATION
                || rowData['batchStatus'] === FccGlobalConstant.PARTIALLYVERIFIED
                || rowData['batchStatus'] === FccGlobalConstant.VERIFIER_REJECTED
                || rowData['batchStatus'] === FccGlobalConstant.VERIFIED)) {
                this.approvalByTransaction = true;
              }
              FccConstants.BATCH_DEATILS_LIST_DATA.forEach(data=>{
                const details = {};
                details[FccGlobalConstant.KEY] = data;
                details[FccGlobalConstant.VALUE] = rowData[data];
                batchDetails.push(details);
              });
              this.removeIfNoData(batchDetails,FccConstants.BATCH_DEATILS_LIST_DATA_REMOVE_IF_EMPTY);
              filterParams['paymentReferenceNumber'] = rowData['paymentReferenceNumber'];
              // batchDetails['noOfTnx'] = rowData['controlTotal'];
              // batchDetails['amtOfTnx'] = rowData['controlSum'];
              // batchDetails['batchRef'] = rowData['paymentReferenceNumber'];
              formValues[FccConstants.VIEW_DETAILS] = batchDetails;
              formValues[FccConstants.FILTER_PARAM_VALUES] = filterParams;
              if (this.commonService.isnonEMptyString(rowData['pageUrl'])) {
                localStorage.setItem('identifyPage', rowData['pageUrl']);
              }
              localStorage.setItem('batchDetailsData', JSON.stringify(formValues));
              localStorage.setItem('isBatchPayment', rowData['isBatchPayment']);
              if(urlLink.includes(FccConstants.VIEW_AUTH) || urlLink.includes(FccConstants.VIEW_SEND)){
                this.viewAllInfoFlag = false;
                this.router.navigateByUrl(urlLink);
              }else{
                this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
                  window.scrollTo(0, 0);
                  this.router.navigate([urlLink]).then(()=>{
                    window.location.reload();
                  });
                });
              }
            });
            this.commonService.getExternalStaticDataList('instrumentLevelConfig')
            .subscribe((response) => {
              if(null !== response && response[0].applicable_flag === 'Y' &&
              this.commonService.getUserPermissionFlag(FccGlobalConstant.FCM_SEND_BATCH_INSTRUMENT_PERMISSION)){
                this.instrumentLevelConfigFlag = true;
              } else {
                this.instrumentLevelConfigFlag = false;
              }

              if(localStorage.getItem('viewallinfo')!= null) {
                this.viewAllInfoFlag = localStorage.getItem('viewallinfo') === 'true' ? true : false;
              }
              localStorage.setItem('instrumentLevelConfigFlag', this.instrumentLevelConfigFlag);
            });
  }

  removeIfNoData(Obj: any[], toBeRemoved: string[]) {
    toBeRemoved.forEach(element => {
      Obj.forEach((object, i) => {
        if (object.key == element) {
          if (this.commonService.isEmptyValue(object.value) || object.value === '-') {
            Obj.splice(i, 1);
          }
        }
      });
    });
  }

  chequeSpacer(map: any) {
    let isSpacer = false;
    if (map.type === 'spacer' && this.commonService.isSpacerRequired) {
      isSpacer = true;
    }
    return isSpacer;
  }

  private prepareFilterParams() {
    const filterParams = {};
    if (this.commonService.isnonEMptyString(this.inputParams.account_no)) {
      filterParams[FccConstants.ACCOUNT_NO] = this.inputParams.account_no;
    }
    if (this.commonService.isnonEMptyString(this.inputParams.chequeno_from)) {
      filterParams[FccConstants.CHEQUE_NOFROM] = this.inputParams.chequeno_from;
    }
    if (this.commonService.isnonEMptyString(this.inputParams.chequeno_to)) {
      filterParams[FccConstants.CHEQUE_NOTO] = this.inputParams.chequeno_to;
    }
    if (this.commonService.isnonEMptyString(this.inputParams.cheque_no)) {
      filterParams[FccConstants.CHEQUE_NO] = this.inputParams.cheque_no;
    }
    if (this.commonService.isnonEMptyString(this.inputParams.cheque_numbers)) {
      const inputString = this.inputParams.cheque_numbers;
      const usingSplit = inputString.split(',');
      let stringValue = '';
      usingSplit.forEach(element => {
        const trimmedValue: string = element;
        stringValue = stringValue + trimmedValue.trim() + '|';
      });
      stringValue = stringValue.substring(0, stringValue.length - 1);
      filterParams[FccConstants.CHEQUE_NOMULTIPLE] = stringValue;
    }
    if (this.commonService.isnonEMptyString(this.inputParams.entity)) {
      filterParams[FccGlobalConstant.ENTITY] = this.inputParams.entity;
    }
    return filterParams;
  }

  paymentWidgetAction(event: Event, rowData: any, button: any, inputParams: any){
    let paymentReferenceList = rowData.paymentReferenceList.split(',');
    paymentReferenceList = paymentReferenceList.filter(item => item !== null && item !== '');
    const clientCode = rowData.clientCode ? rowData.clientCode : null;
    const packageName = rowData.packageName ? rowData.packageName : null;
    const request = {
      event: button.buttonName,
      checkerRemarks: '',
      paymentReferenceNumber: paymentReferenceList
    };
    switch (button.buttonName) {
      case 'APPROVE':
      case 'SEND':
        this.commonService.paymentDashboardAction(request, packageName, clientCode).subscribe(
          () => {
            this.commonService.refreshPaymentWidgetList.next({
              inputParam: inputParams,
              selectedRowsData: rowData
            });
            let successMsg = '';
            if ('APPROVE' === button.buttonName) {
              successMsg = `${this.translateService.instant('approveToasterMEssage',
                { name: packageName ? packageName : clientCode })}`;
            } else {
              successMsg = `${this.translateService.instant('sendToasterMEssage',
                { name: packageName ? packageName : clientCode })}`;
            }
            const tosterObj = {
              life: 5000,
              key: 'tc',
              severity: 'success',
              detail: successMsg
            };
            this.commonService.showToasterMessage(tosterObj);
          }, (_err) => {
            let errorMessage = '';
            if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
              errorMessage = 'failedApiErrorMsg';
            } else {
              errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
            }
            const tosterObj = {
              life: 5000,
              key: 'tc',
              severity: 'error',
              detail: `${this.translateService.instant(errorMessage)}`
            };
            this.commonService.showToasterMessage(tosterObj);
          }
        );
        break;
      case 'REJECT':
        this.commonService.paymentWidget = true;
        this.dialogService.open(PaymentTansactionPopupComponent, {
          header: this.translateService.instant('rejectTransactionHeader'),
          width: '35em',
          styleClass: 'fileUploadClass',
          style: { direction: localStorage.getItem('langDir') },
          data: {
            rowData: rowData,
            action: button.buttonName,
            inputParam: inputParams
          },
        });

        break;
      case 'SCRAP':
        this.commonService.paymentWidget = true;
        this.dialogService.open(PaymentTansactionPopupComponent, {
          header: this.translateService.instant('scrapTransactionHeader'),
          width: '35em',
          styleClass: 'fileUploadClass',
          style: { direction: localStorage.getItem('langDir') },
          data: {
            rowData: rowData,
            action: button.buttonName,
            inputParam: inputParams
          },
        });

        break;
    }
  }

  handleAccountDetailsScreen(urlLink, rowData) {
    this.commonService.setAccountDetailsData(rowData);
    if (this.commonService.isnonEMptyString(urlLink)){
      this.router.navigateByUrl(urlLink);
    }

  }

}
