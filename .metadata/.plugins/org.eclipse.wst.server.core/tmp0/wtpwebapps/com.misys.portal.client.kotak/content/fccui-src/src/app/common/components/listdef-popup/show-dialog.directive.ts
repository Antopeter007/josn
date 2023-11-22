import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CommonService } from '../../services/common.service';
import { FormModelService } from '../../services/form-model.service';
import { ListdefPopupComponent } from './listdef-popup.component';
import { ListdefModalComponent } from "../listdef-modal/listdef-modal.component";
import { ActivatedRoute, Router } from '@angular/router';
import { FccConstants } from '../../core/fcc-constants';
import { ResolverService } from '../../services/resolver.service';
import { Overlay } from '@angular/cdk/overlay';
import { FCMPaymentsConstants } from '../../../corporate/cash/payments/single/model/fcm-payments-constant';

@Directive({
  selector: '[appShowDialog]'
})
export class ShowDialogDirective {

  @Input() dialogData: any;
  @Input() rowIndex: any;
  @Input() noOfRows: any;
  @Input() showPopup: any;
  @Input() actionPopup: any;
  @Input() inputParams: any;
  left = 0;
  numberOfColumsDisplay: any;
  widgetRowData: any;
  panelType: any;
  rowData: any;
  widgetName: any;
  resp: any;
  heading: any;
  popupData: any;
  rowInd: any;
  calHeigth: any;
  calWidht: any;
  rowSize: any;
  rowWidth: any;
  overlayWidth: any;
  requestId: string;
  routeOptions: string;
  routeCategory: string;
  jsonPopupModel: any;
  actionResponse: any;
  accountResponse: any;
  constructor(protected elementRef: ElementRef, public dialog: MatDialog, protected commonService: CommonService,
    public router: Router,
    public translate: TranslateService, protected formModelService: FormModelService, protected overlay: Overlay,
    public activatedRoute: ActivatedRoute, protected corporateCommonService: CommonService, protected resolverService: ResolverService) { }
  @HostListener('click', ['$event'])
  onClick(btn) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routeOptions = params && params.option ? params.option : '';
    });
    if (this.showPopup) {
      this.openPopup();
    }
    else {
      this.rowData = this.dialogData;
      this.left = btn.clientX;
      this.rowInd = this.rowIndex;
      this.requestId = this.dialogData && this.dialogData[FccGlobalConstant.ASSOCIATION_ID] ?
        this.dialogData[FccGlobalConstant.ASSOCIATION_ID] : '';

      const paramDataKeyName = this.commonService.rowSellistdefName[FccGlobalConstant.PARAM_DATA_KEY];

      if (this.showPopup) {

        this.commonService.getBeneficiaryAccounts(this.requestId).subscribe((response) => {
          if (response.data.bankAccountBeneStatus) {
            this.dialog.closeAll();
            const dialogRef: MatDialogRef<ListdefModalComponent> = this.dialog.open(
              ListdefModalComponent, {
              backdropClass: 'cdk-overlay-coloured-backdrop',
              hasBackdrop: true,
              data: {
                data: response.data,
                rowData: this.rowData,
                heading: this.routeOptions + FccGlobalConstant.VIEW_POPUP,
                actionResponse: this.actionResponse
              }
            });
            return dialogRef;
          }
        });
      } else {
        this.formModelService.getWidgetFormModel(paramDataKeyName)
          .subscribe(modelJson => {
            this.resp = JSON.parse(JSON.stringify(modelJson));
            this.getDataToDisplay(modelJson);
            if (this.panelType === FccGlobalConstant.Dialog) {
              if (this.numberOfColumsDisplay === FccGlobalConstant.NO_OF_COL) {
                this.calHeigth = (Number(this.rowWidth) + (this.rowSize * (this.rowSize - 1)) + this.rowSize + 1) + 'em';
                this.calWidht = (Number(this.overlayWidth) + Number(this.numberOfColumsDisplay) + 2) + 'em';
              } else {
                this.calHeigth = (Number(this.rowWidth) + (this.rowSize * (this.rowSize - 1)) + (this.rowSize + 1)) + 'em';
                this.calWidht = (Number(this.overlayWidth) - Number(this.numberOfColumsDisplay) + 2) + 'em';
              }
              this.openDialog(this.elementRef, this.calHeigth, this.calWidht);
            } else if (this.panelType === FccGlobalConstant.Overlay) {
              this.openOverlayPanel(this.elementRef, '14em', '25em');
            }
          });
      }
    }
  }
  openDialog(
    positionRelativeToElement: ElementRef,
    height?: string,
    width?: string): MatDialogRef<ListdefPopupComponent> {
    const dialogRef: MatDialogRef<ListdefPopupComponent> = this.dialog.open(
      ListdefPopupComponent,
      {
        backdropClass: 'cdk-overlay-transparent-backdrop',
        hasBackdrop: true,
        height,
        width,
        data: {
          positionRelativeToElement,
          left: this.left,
          dataValue: this.popupData,
          noOfColumns: this.numberOfColumsDisplay,
          heading: this.heading,
          isFirstRow: this.rowInd === 0 ? true : false
        }
      }
    );
    return dialogRef;
  }

  openOverlayPanel(
    positionRelativeToElement: ElementRef,
    height?: string,
    width?: string): MatDialogRef<ListdefPopupComponent> {
    const dialogRef: MatDialogRef<ListdefPopupComponent> = this.dialog.open(
      ListdefPopupComponent,
      {
        backdropClass: 'cdk-overlay-transparent-backdrop',
        hasBackdrop: true,
        height,
        width,
        data: {
          positionRelativeToElement,
          left: this.left,
          dataValue: this.popupData
        }
      }
    );
    return dialogRef;
  }

  getDataToDisplay(resp: any) {
    resp.forEach(widgresp => {
      const panel = widgresp[FccGlobalConstant.Pannel];
      this.panelType = widgresp[FccGlobalConstant.TYPE];
      this.heading = widgresp[FccGlobalConstant.HEADING];
      const col = widgresp[FccGlobalConstant.COLUMNS];
      const dataToDisplay = {};
      col.forEach(cols => {
        Object.keys(this.rowData).forEach(ele => {
          if (cols === ele) {
            if (this.rowData[ele] && this.rowData[ele] !== '') {
              dataToDisplay[`${this.translate.instant(cols)}`] = this.rowData[ele];
            } else {
              dataToDisplay[`${this.translate.instant(cols)}`] = FccGlobalConstant.SAMPLE_COMMENT;
            }
          }
        });
      });
      this.popupData = dataToDisplay;
      panel.forEach(paneldata => {
        if (paneldata.type === this.panelType) {
          this.numberOfColumsDisplay = paneldata.layoutType;
          this.rowWidth = paneldata.oneRowHeight;
          this.overlayWidth = paneldata.dialogWidht;
        }
      });
      const length = col.length;
      this.rowSize = Math.ceil(length / Number(this.numberOfColumsDisplay));
    });
  }
  getWidgetName(name: any) {
    switch (name) {
      case FccGlobalConstant.DEPOSIT_ACCOUNTS_LIST:
        this.widgetName = FccGlobalConstant.DEPOSIT_WIDGET;
        break;
    }
  }

  /**
   *
   * @param data
   * @param currentActionIndex
   * @param rows
   * @param showActionPopup
   * @param productCode
   */
  openDialogFromAction(data: any, currentActionIndex: any, rows: any, showActionPopup: boolean, actionPopup: boolean, inputParams: any) {
    this.dialogData = data;
    this.rowIndex = currentActionIndex;
    this.noOfRows = rows;
    this.showPopup = showActionPopup;
    this.actionPopup = actionPopup;
    this.inputParams = inputParams;
    this.openPopup();
  }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  openBulkPaymentDialogFromAction(rowData: any, currentActionIndex: any, rows: any, showActionPopup: boolean, inputParams: any) {
    let totalCount = 0;
    let failureCount = 0;
    let passedCount = 0;
    let repairReject = false;
    const repairRejectFooter = true;
    const uploadReferenceNumber = rowData.uploadReferenceNumber;

    this.corporateCommonService.getPaymentBulkUploadDetailsOfRefNo(rowData.uploadReferenceNumber).subscribe(result => {

      if (result) {
        totalCount = result.data.files[0].totalCount;
        failureCount = result.data.files[0].rejectedCount;
        passedCount = totalCount - failureCount;
      }

      let jsonData = {};
      jsonData = { totalCount:totalCount, successCount: passedCount, failureCount: failureCount };
      this.dialog.closeAll();
      this.corporateCommonService.getExternalStaticDataList("repairRejectQuery").subscribe(result => {
        if(result) {
          result.forEach(res => {
            if(res.filerejrepprceflag === '3'|| res.filerejrepprceflag === '0') {
              repairReject = true;
          }
          });
        }
      });

    const dialogRef: MatDialogRef<ListdefModalComponent> = this.dialog.open(
      ListdefModalComponent, {
      backdropClass: 'cdk-overlay-coloured-backdrop',
      hasBackdrop: true,
      data: {
        data: jsonData,
        rowData: rowData,
        heading: FccGlobalConstant.PAYMENT_BACTH_FILR,
        paymentUpload: true,
        repairReject: repairReject,
        repairRejectFooter : repairRejectFooter,
        uploadReferenceNumber : uploadReferenceNumber
      }
    });
    return dialogRef;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openBulkBeneDialogFromAction(rowData: any, currentActionIndex: any, rows: any, showActionPopup: boolean, inputParams: any) {

    const repairReject = false;
    const repairRejectFooter = true;
    const fileReferenceNumber = rowData.fileReferenceNumber;

    this.corporateCommonService.getBeneBulkUploadDetailsOfRefNo(rowData.fileReferenceNumber).subscribe(result => {
      let totalCount = 0;
      let failureCount = 0;
      let passedCount = 0;
      if (result && result.data.files.length > 0) {
        totalCount = result.data.files[0].totalCount;
        failureCount = result.data.files[0].rejectedCount;
        passedCount = totalCount - failureCount;
      }
        let jsonData = {};
        jsonData = { totalCount:totalCount, successCount: passedCount, failureCount: failureCount };
        this.dialog.closeAll();
        const dialogRef: MatDialogRef<ListdefModalComponent> = this.dialog.open(
          ListdefModalComponent, {
            backdropClass: 'cdk-overlay-coloured-backdrop',
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.noop(),
            data: {
              data: jsonData,
              rowData: rowData,
              heading: FccGlobalConstant.PAYMENT_BACTH_FILR,
              repairReject: repairReject,
              beneUpload: true,
              failureCount: failureCount,
              repairRejectFooter : repairRejectFooter,
              uploadReferenceNumber : fileReferenceNumber
            }
          });
          return dialogRef;
    });
  }

  displayDialog(accountResponse, actionResponse, title?: string) {
    this.dialog.closeAll();
    const heading = title ? title : this.routeOptions + FccGlobalConstant.VIEW_POPUP;
    const dialogRef: MatDialogRef<ListdefModalComponent> = this.dialog.open(
      ListdefModalComponent, {
      backdropClass: 'cdk-overlay-coloured-backdrop',
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      data: {
        data: accountResponse,
        rowData: this.rowData,
        heading,
        actionResponse: actionResponse
      }
    });
    return dialogRef;
  }

  openInstrumentDetailsPopup() {
    let routeOperation = '';
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.option )
      {
        routeOperation = params.operation;
      }
    });
    const instrumentRefNum = this.dialogData && this.dialogData.instrumentPaymentReference ?
                              this.dialogData.instrumentPaymentReference : '';
    const paymentRefNum = this.inputParams && this.inputParams.filterParams && this.inputParams.filterParams.paymentReferenceNumber;
    if(paymentRefNum) {
      const additionalInfo = this.commonService.viewAdditionalInfoInstrumentPopup(paymentRefNum, instrumentRefNum);
      additionalInfo.then(
        (response: any) => {
          const approveInstrumentPermission = this.commonService.getUserPermissionFlag(
            FccGlobalConstant.FCM_APPROVE_INSTRUMENT_PAYMENTS_PERMISSION);
          const rejectInstrumentPermission = this.commonService.getUserPermissionFlag(
            FccGlobalConstant.FCM_REJECT_INSTRUMENT_PAYMENTS_PERMISSION);
          const approveBatchInstrumentPermission = this.commonService.getUserPermissionFlag(
            FccGlobalConstant.FCM_APPROVE_BATCH_INSTRUMENT_PERMISSION);
          response = this.commonService.removeResponseField(response,
            FccGlobalConstant.INSTRUMENT_REQUIRED_EXTRA_FIELDON_STATUS_MAP, this.rowData.batchStatus);
          if (this.resolverService.approvalByTransaction && (approveInstrumentPermission || rejectInstrumentPermission)
            && response.INSTRUMENTSTATUS === FccGlobalConstant.PENDINGMYAPPROVAL
            && this.router.url !== '/statusListing' && localStorage.isBatchPayment !== FccGlobalConstant.STRING_TRUE) {
            this.commonService.getListPopupActions(this.inputParams.listdefName, FccGlobalConstant.PENDINGMYAPPROVAL,
              FccGlobalConstant.PAYMENTS, FccGlobalConstant.FCM).toPromise().then(actionData => {
                this.displayDialog(response, actionData, `${this.translate.instant(FccConstants.INSTUMENT_DETAILS)}`);
              });
          } else if (this.resolverService.approvalByTransaction && approveBatchInstrumentPermission
            && response.INSTRUMENTSTATUS === FccGlobalConstant.PENDINGMYAPPROVAL
            && (this.router.url === '/statusListing' || routeOperation === FCMPaymentsConstants.MODIFY_BATCH)
            && localStorage.isBatchPayment === FccGlobalConstant.STRING_TRUE) {
            this.commonService.getListPopupActions(this.inputParams.listdefName, FccGlobalConstant.PENDINGMYAPPROVAL,
              FccGlobalConstant.PAYMENTS, FccGlobalConstant.FCM).toPromise().then(actionData => {
                this.displayDialog(response, actionData, `${this.translate.instant(FccConstants.INSTUMENT_DETAILS)}`);
              });
          } else if(response.INSTRUMENTSTATUS === FccGlobalConstant.PENDINGMYVERIFICATION ||
            response.INSTRUMENTSTATUS === FccGlobalConstant.VERIFIED ||
            response.INSTRUMENTSTATUS === FccGlobalConstant.VERIFIER_REJECTED){
              this.commonService.getListPopupActions(this.inputParams.listdefName, response.INSTRUMENTSTATUS,
                FccGlobalConstant.PAYMENTS, FccGlobalConstant.FCM).toPromise().then(actionData => {
                  this.displayDialog(response, actionData, `${this.translate.instant(FccConstants.INSTUMENT_DETAILS)}`);
                });
          } else if(this.router.url === '/statusListing' && localStorage.isBatchPayment === FccGlobalConstant.STRING_TRUE
          && response.INSTRUMENTSTATUS === FccGlobalConstant.PENDINGSEND && this.resolverService.instrumentLevelConfigFlag
          && !this.resolverService.viewAllInfoFlag ){
            this.commonService.getListPopupActions(this.inputParams.listdefName, FccGlobalConstant.PENDINGSEND,
              FccGlobalConstant.PAYMENTS, FccGlobalConstant.FCM).toPromise().then(actionData => {
                this.displayDialog(response, actionData, `${this.translate.instant(FccConstants.INSTUMENT_DETAILS)}`);
              });
          } else if(response.INSTRUMENTSTATUS === FccGlobalConstant.PENDINGSEND && this.rowData.paymentReferenceNumber){
              this.commonService.getListPopupActions(this.inputParams.listdefName, FccGlobalConstant.PENDINGSEND,
                FccGlobalConstant.PAYMENTS, FccGlobalConstant.FCM).toPromise().then(actionData => {
                  this.displayDialog(response, actionData, `${this.translate.instant(FccConstants.INSTUMENT_DETAILS)}`);
                });
          } else {
            this.displayDialog(response, [], `${this.translate.instant(FccConstants.INSTUMENT_DETAILS)}`);
          }
        }
      );
    }
  }

  openPopup() {
    this.rowData = this.dialogData;
    this.rowInd = this.rowIndex;
    if (this.router.url.indexOf('/statusListing') > -1) {
      this.openInstrumentDetailsPopup();
      return;
    }
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.option )
      {
        this.routeOptions = params.option;
      }
      else if(params && params.widgetCode === 'PAYMENTS_OVERVIEW' )
      {
        this.routeOptions = 'PAYMENTS_OVERVIEW';
      }
      this.routeCategory = params && params.category ? params.category : '';
    });
    if (this.inputParams?.isDashboardWidget
      && FccConstants.VIEW_INFO_POPUP_PAYMENT_WIDGET_LIST.indexOf(this.inputParams?.listdefName) > -1) {
      if (this.dialogData?.isBatchPayment === FccConstants.STRING_TRUE) {
        this.resolverService.handleFcmBatchDetailsScreen('statusListing', this.dialogData);
      } else {
        this.routeOptions = FccGlobalConstant.PAYMENTS;
        this.routeCategory = FccConstants.FCM;
      }
    }

    if (this.inputParams?.isDashboardWidget
      && FccConstants.VIEW_INFO_POPUP_BENE_APPROVED_WIDGET_LIST.indexOf(this.inputParams?.listdefName) > -1) {
      this.requestId = this.dialogData && this.dialogData[FccGlobalConstant.ASSOCIATION_ID] ?
        this.dialogData[FccGlobalConstant.ASSOCIATION_ID] : '';
      const beneId = this.dialogData && this.dialogData["beneficiaryId"] ?
        this.dialogData["beneficiaryId"] : '';
      if (this.requestId) {
        const accountPrm = this.commonService.viewDetailsPopup(this.requestId);
        accountPrm.then(
          (accountData: any) => {
            this.displayDialog(accountData, [], FccGlobalConstant.BENEFICIARY_DETAILS);
          });
      } else if (this.dialogData[FccGlobalConstant.ACCOUNT_ASSOCIATION_ID].includes(',')) {
        this.commonService.getBeneficiaryAccountDetails(beneId).subscribe(response => {
          if (response?.body.data) {
            const responseData = response?.body.data.beneficiaries[0];
            const accountDetails = {};
            accountDetails[FccGlobalConstant.CLIENT_CODE] = responseData.client.clientId;
            accountDetails[FccConstants.FCM_CLIENT_NAME] = responseData.client.name;
            accountDetails[FccGlobalConstant.BENEFICIARY_ID] = responseData.beneficiaryId;
            accountDetails[FccGlobalConstant.BENEFICIARY_NAME] = responseData.beneficiaryName;
            accountDetails[FccGlobalConstant.BENE_ACCOUNT_DATA] = responseData.bankAccounts;
            this.displayDialog(accountDetails, [], FccGlobalConstant.BENEFICIARY_DETAILS);
          }
        });
      }
    }

    switch (this.routeOptions){
      case FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC :
      this.requestId = this.dialogData && this.dialogData[FccGlobalConstant.ASSOCIATION_ID] ?
      this.dialogData[FccGlobalConstant.ASSOCIATION_ID] : '';
      if (this.requestId) {
        const accountPrm = this.commonService.viewDetailsPopup(this.requestId);
        accountPrm.then(
          (accountData: any) => {
            this.commonService.getListPopupActions(this.inputParams.listdefName, accountData.bankAccountBeneStatus,
              this.routeOptions, this.routeCategory).toPromise().then(actionData => {
                let isApproveOrReject = false;
                if(actionData.actionList && actionData.actionList.length) {
                  actionData.actionList.forEach((item)=>{
                    if(item.actionName == FccGlobalConstant.ACTION_APPROVE ||
                      item.actionName == FccGlobalConstant.COMMENT_SECTION ||
                      item.actionName == FccGlobalConstant.ACTION_REJECT) {
                      isApproveOrReject = true;
                    }
                  });
                }
                if(accountData.makerName === this.commonService.loginUser && isApproveOrReject) {
                  delete accountData.makerName;
                  this.displayDialog(accountData, []);
                } else {
                  this.displayDialog(accountData, actionData);
                }
              });
          }
        );
      }
      break;
      case FccGlobalConstant.PAYMENTS :
      if(this.rowData.paymentReferenceNumber) {
        const additionalInfo = this.commonService.viewAdditionalInfoPopup(this.rowData.paymentReferenceNumber);
        additionalInfo.then(
          (response: any) => {
            this.commonService.getListPopupActions(this.inputParams.listdefName, this.rowData.batchStatus,
              this.routeOptions, this.routeCategory).toPromise().then(actionData => {
                response = this.commonService.removeResponseField(response,
                  FccGlobalConstant.INSTRUMENT_REQUIRED_EXTRA_FIELDON_STATUS_MAP, this.rowData.batchStatus);
                this.displayDialog(response, !(this.inputParams?.showAction) ? undefined : actionData);
              });
          }
        );
      }
      break;
      case 'PAYMENTS_OVERVIEW' :
      this.requestId = this.dialogData && this.dialogData[FccGlobalConstant.ASSOCIATION_ID] ?
      this.dialogData[FccGlobalConstant.ASSOCIATION_ID] : '';
      if (this.requestId) {
        const accountPrm = this.commonService.viewDetailsPopup(this.requestId);
        accountPrm.then(
          (accountData: any) => {
            this.commonService.getListPopupActions(this.inputParams.listdefName, accountData.bankAccountBeneStatus,
              this.routeOptions, this.routeCategory).toPromise().then(actionData => {
                this.displayDialog(accountData, actionData);
              });
          }
        );
      }
      break;

      case FccGlobalConstant.ACCOUNTS:
        this.commonService.getAccountAdditionalPostingDetails(this.rowData["line@line_id"], this.rowData["line@statement_id"]
        ).toPromise().then(details => {
          const postingDetails = Object.entries(details).sort().reduce( (o,[k,v]) => (o[k]=v,o), {} );
          this.displayDialog(postingDetails, [], FccGlobalConstant.ADDITIONAL_POSTING_DETAILS);
        });
        break;
    }
  }
}
