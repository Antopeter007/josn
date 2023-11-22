import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FccConstants } from '../../core/fcc-constants';
import { CommonService } from '../../services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { ResolverService } from '../../services/resolver.service';
import { ReauthService } from '../../services/reauth.service';
import { CurrencyConverterPipe } from '../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { FormModelService } from '../../services/form-model.service';
import { FCCFormGroup } from '../../../base/model/fcc-control.model';
import { FormControlService } from '../../../corporate/trade/lc/initiation/services/form-control.service';
import { FccTaskService } from '../../../common/services/fcc-task.service';
import { ProductMappingService } from '../../../common/services/productMapping.service';
import { ProductStateService } from '../../../corporate/trade/lc/common/services/product-state.service';
import { FCMPaymentsConstants } from '../../../corporate/cash/payments/single/model/fcm-payments-constant';
import { LegalTextService } from '../../../common/services/legal-text.service';
import { Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationDialogComponent } from '../../../../app/corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { PaymentBatchService } from '../../services/payment.service';
import { FccGlobalConstantService } from '../../core/fcc-global-constant.service';

@Component({
  selector: 'app-view-cheque-status-listing',
  templateUrl: './view-cheque-status-listing.component.html',
  styleUrls: ['./view-cheque-status-listing.component.scss']
})
export class ViewChequeStatusListingComponent implements OnInit {

  generalDetails: any;
  inputParams: any = {};
  componentTitle: any;
  contextPath: any;
  buttonItemList: { localizationKey: any; buttonClass: string; filterDialogEnable: boolean; isActive: boolean; routerLink?: any }[];
  allowPreferenceSave: any;
  tabListingHeader = this.translateService.instant('viewChequeStatus');
  operation : string;
  buttonList = [];
  commentsRequired = true;
  commentsMandatory = false;
  selectedRowsdata = [];
  successAccArr = [];
  failedAccounts = {};
  disableReturn = false;
  confirmationMsg : string;
  failureMsg : string;
  batchRefNumber : string;
  componentType = '';
  isSubmitEnabled = false;
  option : string;
  productCode = 'BT';
  dir: string = localStorage.getItem('langDir');
  paymentReferenceNumber: any;
  subscriptions: Subscription[] = [];
  category: any;
  reviewComments: any;
  parent: any;
  showForm = false;
  form: FCCFormGroup;
  type = 'type';
  section = 'section';
  field = 'field';
  Submit = this.translateService.instant('submit');
  reviewCommentsHeader : string;
  showButtons = false;
  batchStatus: any;
  isSubmitButtonDisable: boolean;
  isSubmitButtonDisableOnBalance: boolean;
  currentBatchStatus: any;

  constructor(
    protected router: Router,
    protected commonService: CommonService,
    protected paymentService: PaymentBatchService,
    protected dialogService: DialogService,
    protected activatedRoute: ActivatedRoute,
    protected translateService: TranslateService,
    protected resolverService: ResolverService,
    protected translate: TranslateService,
    protected reauthService: ReauthService,
    protected currencyConverterPipe: CurrencyConverterPipe,
    protected formModelService: FormModelService,
    protected formControlService: FormControlService,protected productMappingService: ProductMappingService,
    protected stateService: ProductStateService, protected taskService: FccTaskService,
    protected legalTextService: LegalTextService,
    protected fccGlobalConstantService: FccGlobalConstantService) {}

  ngOnInit(): void {
    this.commonService.putQueryParameters(FccGlobalConstant.ACTION, 'ChqStatusInquirySearchAction');
    this.resolverService.instrumentLevelConfigFlag = localStorage.instrumentLevelConfigFlag;
    this.activatedRoute.queryParams.subscribe(params => {
      this.commonService.putQueryParameters(FccGlobalConstant.OPTION,params[FccGlobalConstant.OPTION]);
      this.commonService.putQueryParameters(FccGlobalConstant.CATEGORY,params[FccGlobalConstant.CATEGORY]);
      this.commonService.putQueryParameters(FccGlobalConstant.OPERATION,params[FccGlobalConstant.OPERATION]);
      this.commonService.putQueryParameters('paymentReferenceNumber',params['paymentReferenceNumber']);
      this.option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
      this.category = this.commonService.getQueryParametersFromKey(FccGlobalConstant.CATEGORY);
      this.operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
      this.paymentReferenceNumber = this.commonService.getQueryParametersFromKey('paymentReferenceNumber');
    });
    if(this.operation !== FCMPaymentsConstants.MODIFY_BATCH) {
      if(localStorage.batchDetailsData){
        this.tabListingHeader = this.translateService.instant('batchDetails');
        this.generalDetails = JSON.parse(localStorage.batchDetailsData).viewDetails;
        this.generalDetails.forEach((item) => {
          if (item.key === "batchStatus") {
            this.batchStatus = item.value;
            this.commonService.batchStatus = this.batchStatus;
          }
        });

        if (!this.resolverService.approvalByTransaction) {
          this.generalDetails.forEach((item) => {
            if (item.key === "controlTotal") {
              this.selectedRowsdata.length = item.value;
            }
            if(item.key === 'paymentReferenceNumber'){
              this.batchRefNumber = item.value;
              this.commonService.batchRefNumber = this.batchRefNumber;
            }
            if(item.key === 'batchStatus'){
              this.batchStatus = item.value;
              this.commonService.batchStatus = this.batchStatus;
            }
          });
        } else {
          this.generalDetails.forEach((item) => {
            if(item.key === FccGlobalConstant.PAYMENT_REFERENCE_NUMBER){
              this.batchRefNumber = item.value;
              this.commonService.batchRefNumber = this.batchRefNumber;
            }
            if(item.key === 'batchStatus'){
              this.batchStatus = item.value;
              this.commonService.batchStatus = this.batchStatus;
            }
          });
          this.selectedRowsdata = [];
          this.resolverService.selectedRowsdata = [];
        }
        this.commonService.updateBatchStatus(this.batchRefNumber);
        this.paymentService.paymentRefNoSubscription$.next(this.batchRefNumber);
        this.commonService.getListPopupActions(this.inputParams.listdefName,this.batchStatus,
          FccGlobalConstant.PAYMENTS,
          FccConstants.FCM, "batchDetails").subscribe(buttonsList => {
            buttonsList = this.updateApproveSendBtns(buttonsList);
            this.buttonList = buttonsList.actionList;
            this.commonService.buttonList = buttonsList.actionList;
        });

        this.prepareBatchDetailsInputParams(JSON.parse(localStorage.batchDetailsData));
      }
      else if (this.commonService.isEmptyValue(this.commonService.chequeViewDetails.value)
          && this.commonService.isNonEmptyValue(localStorage?.viewStatusData)) {
        this.generalDetails = JSON.parse(localStorage.viewStatusData).viewDetails;
        this.prepareInputParams(JSON.parse(localStorage.viewStatusData));
        this.getButtons();
      } else {
        this.commonService.chequeViewDetails.subscribe(obj => {
          this.generalDetails = obj.viewDetails;
          this.prepareInputParams(obj);
        });
        this.getButtons();
      }
    } else if(this.operation === FCMPaymentsConstants.MODIFY_BATCH){
      if (localStorage.getItem(FccGlobalConstant.MODIFY_BATCH) === FccGlobalConstant.STRING_TRUE) {
        this.translate.get('corporatechannels').subscribe(() => {
          window.location.reload();
          localStorage.removeItem(FccGlobalConstant.MODIFY_BATCH);
        });
      }
      this.commonService.isStepperDisabled = true;
      this.form = new FCCFormGroup({});
      this.formModelService.getFormModel('BT').subscribe(res => {
        this.form = this.formControlService.getFormControls(res['batchGeneralDetails']);
        this.showForm = true;
        this.isSubmitEnabled = this.form.valid;
      });
      this.componentType = 'batchGeneralDetails';
      this.tabListingHeader = this.translateService.instant('batchModification');
      this.reviewCommentsHeader = `${this.translateService.instant('rejectReasons')}`;
        this.subscriptions.push(this.commonService.displayRemarks.subscribe(response => {
            this.reviewComments = response;
        }));
    }

    this.commonService.batchEditSubmitFlag.subscribe((value) => {
      if(this.commonService.isNonEmptyValue(value)) {
        this.isSubmitButtonDisable = true;
      }
    });

    this.commonService.batchAddSubmitFlag.subscribe((value) => {
      if(this.commonService.isNonEmptyValue(value)) {
        this.isSubmitButtonDisable = true;
      }
    });

    this.commonService.submitButtonEnable.subscribe( res => {
      this.isSubmitButtonDisable = !res;
    });

    this.commonService.batchInstrumntCancelFlag.subscribe((value) => {
      if(this.commonService.isNonEmptyValue(value)) {
        this.isSubmitButtonDisable = false;
      }
    });

    this.commonService.batchTransactionBalance.subscribe((value) => {
      this.batchStatus = this.commonService.batchStatus;
      if(this.commonService.isNonEmptyValue(value)) {
        if(this.batchStatus === FccGlobalConstant.PENDING_REPAIR ||
          this.batchStatus === FccGlobalConstant.PARTIALLY_REJECTED ||
          this.batchStatus === FccGlobalConstant.REJECTED ||
          this.batchStatus === FccGlobalConstant.VERIFIER_REJECTED ) {
            this.isSubmitButtonDisableOnBalance = true;
          } else {
            if((value.balanceTransaction < 1 || Number.isNaN(value.balanceTransaction))
            && (value.balanceAmount < 1 || Number.isNaN(value.balanceAmount))){
              this.isSubmitButtonDisableOnBalance = false;
            }else{
              this.isSubmitButtonDisableOnBalance = true;
            }
          }}
      });
    this.commonService.onBatchTxnUpdateClick.subscribe((value) => {
      if(this.commonService.isNonEmptyValue(value)) {
        this.isSubmitButtonDisable = false;
      }
    });

    this.commonService.onBatchTxnSaveClick.subscribe((value) => {
      if(this.commonService.isNonEmptyValue(value)) {
        this.isSubmitButtonDisable = false;
      }
    });

    this.commonService.batchData.subscribe((value) => {
      if(this.commonService.isNonEmptyValue(value)) {
        this.batchStatus = value.paymentHeader.batchStatus;
        this.commonService.batchStatus = this.batchStatus;
        this.submitButtonEnableDisable();
      }
    });

    this.commonService.refreshBatchDetails.subscribe((value) => {
      if (value) {
        this.generalDetails = JSON.parse(localStorage.batchDetailsData).viewDetails;
        this.generalDetails?.forEach((item) => {
          if (item.key === "batchStatus") {
            this.batchStatus = item.value;
            this.commonService.batchStatus = this.batchStatus;
            this.submitButtonEnableDisable();
            this.enableBatchSubmit(this.batchStatus === FccGlobalConstant.PARTIALLYVERIFIED ||
            this.batchStatus === FccGlobalConstant.VERIFIED);
          }
        });
        this.commonService.refreshBatchDetails.next(false);
      }
    });
    this.enableBatchSubmit(this.batchStatus === FccGlobalConstant.PARTIALLYVERIFIED ||
      this.batchStatus === FccGlobalConstant.VERIFIED);
    this.currentBatchStatus = this.batchStatus;
  }



  ngAfterViewChecked() {
    setTimeout(() => {
      if (!this.resolverService.approvalByTransaction) {
        this.showButtons = true;
        this.generalDetails?.forEach((item) => {
          if (item.key === "controlTotal" && !(
            this.batchStatus === FccGlobalConstant.PENDINGMYVERIFICATION ||
            this.batchStatus === FccGlobalConstant.PARTIALLYVERIFIED ||
            this.batchStatus === FccGlobalConstant.VERIFIER_REJECTED ||
            this.batchStatus === FccGlobalConstant.VERIFIED
          )) {
            this.selectedRowsdata.length = item.value;
          }
          if (item.key === "batchStatus") {
            this.batchStatus = item.value;
            this.commonService.batchStatus = this.batchStatus;
          }
        });
      } else {
        this.selectedRowsdata = this.resolverService.selectedRowsdata;
        let buttonRequired = true;
        this.showButtons = false;
        this.selectedRowsdata.forEach((item) => {
        if (item.instrumentstatus !== FccGlobalConstant.PENDINGMYAPPROVAL &&
            item.instrumentstatus !== FccGlobalConstant.PENDINGMYVERIFICATION &&
            item.instrumentstatus !== FccGlobalConstant.VERIFIER_REJECTED &&
            item.instrumentstatus !== FccGlobalConstant.VERIFIED &&
            item.instrumentstatus !== FccGlobalConstant.PENDINGSEND) {
            buttonRequired = false;
          }
        });
        if(buttonRequired){
          this.showButtons = true;
        } else {
          this.showButtons = false;
        }
      }
    });
    if(this.currentBatchStatus !== this.batchStatus){
      this.currentBatchStatus = this.batchStatus;
      this.commonService.getListPopupActions(FccGlobalConstant.EMPTY_STRING,this.batchStatus,
        FccGlobalConstant.PAYMENTS,
        FccConstants.FCM, "batchDetails").subscribe(buttonsList => {
          buttonsList = this.updateApproveSendBtns(buttonsList);
          this.buttonList = buttonsList.actionList;
          this.commonService.buttonList = buttonsList.actionList;

      });
    }
  }

  private prepareInputParams(obj: any) {
    const listdefName = 'listdefName';
    const showFilterSection = 'showFilterSection';
    const paginator = 'paginator';
    const downloadIconEnabled = 'downloadIconEnabled';
    const colFilterIconEnabled = 'colFilterIconEnabled';
    const passBackEnabled = 'passBackEnabled';
    const columnSort = 'columnSort';
    this.contextPath = this.commonService.getContextPath();
    const productCode = 'productCode';
    const filterParam = 'filterParams';
    const filterParamsRequired = 'filterParamsRequired';
    const filterChipsRequired = 'filterChipsRequired';
    const widgetName = 'widgetName';
    this.inputParams[listdefName] = FccConstants.VIEW_CHEQUE_STATUS_LISTDEF;
    this.inputParams[showFilterSection] = false;
    this.inputParams[paginator] = true;
    this.inputParams[downloadIconEnabled] = true;
    this.inputParams[colFilterIconEnabled] = true;
    this.inputParams[passBackEnabled] = false;
    this.inputParams[columnSort] = true;
    this.inputParams[productCode] = FccGlobalConstant.PRODUCT_SE;
    this.inputParams[filterParamsRequired] = true;
    this.inputParams[filterParam] = obj.filterParamValues;
    this.inputParams[filterChipsRequired] = false;
    this.inputParams[FccGlobalConstant.ENABLE_LIST_DATA_DOWNLOAD] = true;
    this.inputParams[widgetName] = this.translateService.instant('viewCheque');
    this.inputParams[FccGlobalConstant.WILDSEARCH] = true;
    this.componentTitle = 'viewCheque';
  }

  handlefilterPopup() {
    this.resolverService.handleViewStatuspopup();
  }

  ngOnDestroy() {
    localStorage.removeItem('viewStatusData');
    localStorage.removeItem('batchDetailsData');
    localStorage.removeItem(FccGlobalConstant.MODIFY_BATCH);
    localStorage.removeItem('identifyPage');
    localStorage.removeItem("activeTab");
    localStorage.removeItem('activeTabDrill');
    this.subscriptions.forEach(subs => subs.unsubscribe());
    this.reviewComments = null;
    this.commonService.isStepperDisabled = false;
  }

  navigateButtonUrl(eventUrl: any) {
    this.router.navigateByUrl(eventUrl);
    this.commonService.channelRefNo.next(null);
  }

  private prepareBatchDetailsInputParams(obj) {
    const listdefName = 'listdefName';
    const showFilterSection = 'showFilterSection';
    const paginator = 'paginator';
    const downloadIconEnabled = 'downloadIconEnabled';
    const colFilterIconEnabled = 'colFilterIconEnabled';
    const passBackEnabled = 'passBackEnabled';
    const columnSort = 'columnSort';
    this.contextPath = this.commonService.getContextPath();
    const productCode = 'productCode';
    const filterParam = 'filterParams';
    const filterParamsRequired = 'filterParamsRequired';
    const filterChipsRequired = 'filterChipsRequired';
    const widgetName = 'widgetName';
    const allowColumnCustomization = 'allowColumnCustomization';
    this.inputParams[listdefName] = FccConstants.BATCH_DETAILS_LISTDEF;
    this.inputParams[showFilterSection] = false;
    this.inputParams[paginator] = true;
    this.inputParams[downloadIconEnabled] = true;
    this.inputParams[colFilterIconEnabled] = true;
    this.inputParams[passBackEnabled] = false;
    this.inputParams[columnSort] = true;
    this.inputParams[productCode] = FccGlobalConstant.PRODUCT_BT;
    this.inputParams[filterParamsRequired] = true;
    this.inputParams[filterParam] = obj.filterParamValues;
    this.inputParams[filterChipsRequired] = false;
    this.inputParams[FccGlobalConstant.ENABLE_LIST_DATA_DOWNLOAD] = false;
    this.inputParams[widgetName] = this.translateService.instant('batchDetails');
    this.inputParams[FccGlobalConstant.WILDSEARCH] = true;
    this.inputParams[allowColumnCustomization] = true;
  }

  getButtons(){
    this.buttonItemList = [
      {
        localizationKey: 'chequeStatus',
        buttonClass: 'secondaryButton',
        filterDialogEnable: true,
        isActive: true
      },
      {
        localizationKey: 'chequesLanding',
        buttonClass: 'primaryButton',
        filterDialogEnable: false,
        isActive: true,
        routerLink: 'tabPanelListing?productCode=SE&widgetCode=CHEQUE_SERVICES'
      }
    ];
  }

  handleAction(actionParam) {
    const fnName = `onClick${actionParam.action.substr(0, 1).toUpperCase()}${actionParam.action.substr(1)}`;
    this[fnName](actionParam);
  }

  onClickSend(actionParams) {
    this.resetAccMessageContent();
    if(!this.resolverService.approvalByTransaction){
      this.performBatchPaymentSend(actionParams, FccGlobalConstant.SEND);
    }else{
      this.performBatchPaymentInstrumentsSendFCM(actionParams, FccGlobalConstant.SEND,
        'PAYMENTS_MULTI_SEND_SUCCESS_MSG');
    }
    this.confirmationMsg = 'paymentSendConfirmationMsg';
    this.failureMsg = 'paymentSendFailureMsg';
  }

  performBatchPaymentSend(actionParams:any, eventType:any){
    const category = FccConstants.FCM;
    this.reauthService.category = category;
    this.reauthService.productCode = FccConstants.PRODUCT_BT;
    this.reauthService.submitPayload = {
      action: FccConstants.SUBMIT_BATCH_PAYMENT
    };
    this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_TRUE);
    this.commonService.sendbatchPaymentAction(this.batchRefNumber,
      eventType, '').subscribe(_res=>
      {
        this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        if (_res) {
          const request = {
            'paymentReferenceNumber': this.batchRefNumber, pageSize: 10, first: 0
          };
          this.commonService.getPaymentDetails(request).subscribe(resp => {
            if (resp) {
              const submitResponse = resp.data;
              const paramId = FccGlobalConstant.CONFIDENTIAL_PARAMETER;
              let confidentialString = FccGlobalConstant.EMPTY_STRING;
              this.commonService.getParameterConfiguredValues(null, paramId).subscribe(resp => {
                if (resp && resp.paramDataList) {
                  resp.paramDataList.forEach(element => {
                    confidentialString = element.data_1;
                  });
                }
              });
              if (this.commonService.isnonEMptyString(confidentialString) &&
              this.commonService.isnonEMptyString(submitResponse.paymentHeader.controlSum) &&
              submitResponse.paymentHeader.controlSum === FccGlobalConstant.FCM_CONFIDENTIAL_VAL) {
                submitResponse.paymentHeader.controlSum = confidentialString;
              } else {
                const currency = submitResponse.paymentDetail[0].instructedAmountCurrencyOfTransfer2.currencyOfTransfer;
                const amount = submitResponse.paymentHeader.controlSum;
                const formattedAmount = this.currencyConverterPipe.transform(amount, currency);
                submitResponse.paymentHeader.controlSum = this.commonService.getCurrencyFormatedAmountForPreview(currency, formattedAmount);
              }
              submitResponse[FccConstants.REAUTH_DATA_ACTION] = FccConstants.SUBMIT_BATCH_PAYMENT;
              submitResponse[FccGlobalConstant.OPTION] = FccConstants.OPTION_PAYMENTS;
              submitResponse[FccGlobalConstant.CATEGORY] = category;
              submitResponse[FccGlobalConstant.PRODUCTCODE] = FccConstants.PRODUCT_BT;
              submitResponse.userLangaugeMessage = `${this.translate.instant('batchPaymentSendSuccess')}`;
              this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(submitResponse) } });
            }
          });

        }
    },
    _err => {
      this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
      this.reauthService.handleTransactionSubmitErrors(_err);
    });
  }

  onClickScrap(actionParams) {
    this.resetAccMessageContent();
    if(this.commonService.isnonEMptyString(actionParams.comment)){
    if(!this.resolverService.approvalByTransaction){
      this.performBatchPymentScrap(actionParams, FccGlobalConstant.ACTION_DISCARD);
    }else{
      this.performBatchPaymentInstrumentsScrapFCM(actionParams, FccGlobalConstant.ACTION_DISCARD,
        'PAYMENTS_MULTI_SCRAP_SUCCESS_MSG');
    }
    this.confirmationMsg = 'paymentScrapConfirmationMsg';
    this.failureMsg = 'paymentScrapFailureMsg';
  }else{
    this.commonService.scrapCommentRequired=true;
  }
  }

  performBatchPymentScrap(actionParams:any, eventType:any){
    const category = FccConstants.FCM;
    this.reauthService.category = category;
    this.reauthService.productCode = FccConstants.PRODUCT_BT;
    this.reauthService.submitPayload = {
      action: FccConstants.SUBMIT_BATCH_PAYMENT
    };
    this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_TRUE);
    this.commonService.scrapbatchPaymentAction(this.batchRefNumber,
      eventType,
      actionParams.comment).subscribe(_res=>
      {
        this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        if (_res) {
          const request = {
            'paymentReferenceNumber': this.batchRefNumber, pageSize: 10, first: 0
          };
          this.commonService.getPaymentDetails(request).subscribe(resp => {
            if (resp) {
              const submitResponse = resp.data;
              const paramId = FccGlobalConstant.CONFIDENTIAL_PARAMETER;
              let confidentialString = FccGlobalConstant.EMPTY_STRING;
              this.commonService.getParameterConfiguredValues(null, paramId).subscribe(resp => {
                if (resp && resp.paramDataList) {
                  resp.paramDataList.forEach(element => {
                    confidentialString = element.data_1;
                  });
                }
              });
              if (this.commonService.isnonEMptyString(confidentialString) &&
              this.commonService.isnonEMptyString(submitResponse.paymentHeader.controlSum) &&
              submitResponse.paymentHeader.controlSum === FccGlobalConstant.FCM_CONFIDENTIAL_VAL) {
                submitResponse.paymentHeader.controlSum = confidentialString;
              } else {
                const currency = submitResponse.paymentDetail[0].instructedAmountCurrencyOfTransfer2.currencyOfTransfer;
                const amount = submitResponse.paymentHeader.controlSum;
                const formattedAmount = this.currencyConverterPipe.transform(amount, currency);
                submitResponse.paymentHeader.controlSum = this.commonService.getCurrencyFormatedAmountForPreview(currency, formattedAmount);
              }
              submitResponse[FccConstants.REAUTH_DATA_ACTION] = FccConstants.SUBMIT_BATCH_PAYMENT;
              submitResponse[FccGlobalConstant.OPTION] = FccConstants.OPTION_PAYMENTS;
              submitResponse[FccGlobalConstant.CATEGORY] = category;
              submitResponse[FccGlobalConstant.PRODUCTCODE] = FccConstants.PRODUCT_BT;
              submitResponse.userLangaugeMessage = `${this.translate.instant('batchPaymentScrapSuccess')}`;
              this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(submitResponse) } });
            }
          });

        }
    },
    _err => {
      this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
      this.reauthService.handleTransactionSubmitErrors(_err);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClickVerify(actionParams, verifyAllFlag?: boolean) {
    this.resetAccMessageContent();
    if(!this.commonService.isnonEMptyString(actionParams.comment)){
      actionParams.comment='';
    }
    let headerField;
        let message;
        if(verifyAllFlag){
          headerField = `${this.translate.instant('verifyTransaction')}`;
          message = `${this.translate.instant('verifyAllTransactionMsg')}`;
        }else{
          headerField = `${this.translate.instant('verifyTransaction')}`;
          message = `${this.translate.instant('verifyTransactionMsg')}`;
        }
        const dir = localStorage.getItem('langDir');
        const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
          header: headerField,
          width: '35em',
          styleClass: 'fileUploadClass',
          style: { direction: dir },
          data: { locaKey: message,
            showNoButton: false,
            showYesButton: false,
            showNoButtonTertiary: true,
            showYesButtonPrimary: true }
        });
        dialogRef.onClose.subscribe((result: any) => {
          if (result.toLowerCase() === 'yes') {
            this.performBatchPaymentInstrumentsVerifyFCM(actionParams, 'VERIFY',
            'PAYMENTS_MULTI_VERIFY_SUCCESS_MSG', 'PAYMENTS_MULTI_VERIFY_FAILURE_MSG',actionParams.comment, verifyAllFlag);
          }
        });

    this.confirmationMsg = 'paymentApproveConfirmationMsg';
    this.failureMsg = 'paymentApproveFailureMsg';
  }

  onClickApprove(actionParams) {
    this.resetAccMessageContent();
    if(!this.resolverService.approvalByTransaction){
      this.performBatchPaymentApprove(actionParams, FccGlobalConstant.multiTransactionEventType.APPROVE);
    }else{
      this.performBatchPaymentInstrumentsApproveFCM(actionParams, FccGlobalConstant.multiTransactionEventType.APPROVE,
        'PAYMENTS_MULTI_APPROVAL_SUCCESS_MSG', 'PAYMENTS_MULTI_APPROVAL_FAILURE_MSG');
    }
    this.confirmationMsg = 'paymentApproveConfirmationMsg';
    this.failureMsg = 'paymentApproveFailureMsg';

  }

  onClickReject(actionParams, rejectAllFlag?:boolean) {
    this.resetAccMessageContent();
    if(this.commonService.isnonEMptyString(actionParams.comment)){
      this.commentsMandatory=false;
      if(this.batchStatus===FccGlobalConstant.PENDINGMYVERIFICATION ||
        this.batchStatus===FccGlobalConstant.PARTIALLYVERIFIED ||
        this.batchStatus === FccGlobalConstant.VERIFIER_REJECTED ||
        this.batchStatus === FccGlobalConstant.VERIFIED){
        let headerField;
        let message;
        if(rejectAllFlag){
          headerField = `${this.translate.instant('rejectTransaction')}`;
          message = `${this.translate.instant('rejectAllTransactionMsg')}`;
        }else{
          headerField = `${this.translate.instant('rejectTransaction')}`;
          message = `${this.translate.instant('rejectTransactionMsg')}`;
        }
        const dir = localStorage.getItem('langDir');
        const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
          header: headerField,
          width: '35em',
          styleClass: 'fileUploadClass',
          style: { direction: dir },
          data: { locaKey: message }
        });
        dialogRef.onClose.subscribe((result: any) => {
          if (result.toLowerCase() === 'yes') {
            this.performBatchPaymentInstrumentsVerifyFCM(actionParams, 'VERIFIERREJECT',
            'PAYMENTS_MULTI_VERIFIERREJECT_SUCCESS_MSG', 'PAYMENTS_MULTI_VERIFIERREJECT_FAILURE_MSG',actionParams.comment, rejectAllFlag);
          }
        });
      }else{
        if(!this.resolverService.approvalByTransaction){
          this.performBatchPaymentReject(actionParams, FccGlobalConstant.multiTransactionEventType.REJECT);
        } else {
          this.performBatchPaymentInstrumentsRejectFCM(actionParams, FccGlobalConstant.multiTransactionEventType.REJECT,
            'PAYMENTS_MULTI_REJECT_SUCCESS_MSG', 'PAYMENTS_MULTI_REJECT_FAILURE_MSG');
        }
        this.confirmationMsg = 'paymentRejectConfirmationMsg';
        this.failureMsg = 'paymentRejectFailureMsg';
      }
    }else{
      this.commentsMandatory=true;
    }
  }

  performBatchPaymentReject(actionParams:any, eventType:any){
    const category = FccConstants.FCM;
    this.reauthService.category = category;
    this.reauthService.productCode = FccConstants.PRODUCT_BT;
    this.reauthService.submitPayload = {
      action: FccConstants.SUBMIT_BATCH_PAYMENT
    };
    this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_TRUE);
    this.commonService.batchPaymentActionReject(this.batchRefNumber,
      eventType,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      actionParams.comment).subscribe(_res=>
      {
        this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        if (_res) {
          const request = {
            'paymentReferenceNumber': this.batchRefNumber, pageSize: 10, first: 0
          };
          this.commonService.getPaymentDetails(request).subscribe(resp => {
            if (resp) {
              const submitResponse = resp.data;
              const paramId = FccGlobalConstant.CONFIDENTIAL_PARAMETER;
              let confidentialString = FccGlobalConstant.EMPTY_STRING;
              this.commonService.getParameterConfiguredValues(null, paramId).subscribe(resp => {
                if (resp && resp.paramDataList) {
                  resp.paramDataList.forEach(element => {
                    confidentialString = element.data_1;
                  });
                }
              });
              if (this.commonService.isnonEMptyString(confidentialString) &&
              this.commonService.isnonEMptyString(submitResponse.paymentHeader.controlSum) &&
              submitResponse.paymentHeader.controlSum === FccGlobalConstant.FCM_CONFIDENTIAL_VAL) {
                submitResponse.paymentHeader.controlSum = confidentialString;
              } else {
                const currency = submitResponse.paymentDetail[0].instructedAmountCurrencyOfTransfer2.currencyOfTransfer;
                const amount = submitResponse.paymentHeader.controlSum;
                const formattedAmount = this.currencyConverterPipe.transform(amount, currency);
                submitResponse.paymentHeader.controlSum = this.commonService.getCurrencyFormatedAmountForPreview(currency, formattedAmount);
              }
              submitResponse[FccConstants.REAUTH_DATA_ACTION] = FccConstants.SUBMIT_BATCH_PAYMENT;
              submitResponse[FccGlobalConstant.OPTION] = FccConstants.OPTION_PAYMENTS;
              submitResponse[FccGlobalConstant.CATEGORY] = category;
              submitResponse[FccGlobalConstant.PRODUCTCODE] = FccConstants.PRODUCT_BT;
              submitResponse.userLangaugeMessage = `${this.translate.instant('batchPaymentRejectSuccess')}`;
              this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(submitResponse) } });
            }
          });

        }
    },
    _err => {
      this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
      this.reauthService.handleTransactionSubmitErrors(_err);
    });
  }

  performBatchPaymentApprove(actionParams:any, eventType:any){
    const category = FccConstants.FCM;
    this.reauthService.category = category;
    this.reauthService.productCode = FccConstants.PRODUCT_BT;
    this.reauthService.submitPayload = {
      action: FccConstants.SUBMIT_BATCH_PAYMENT
    };
    this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_TRUE);
    this.commonService.batchPaymentActionApprove(this.batchRefNumber,
      eventType,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      actionParams.comment).subscribe(_res=>
      {
        this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        if (_res) {
          const request = {
            'paymentReferenceNumber': this.batchRefNumber, pageSize: 10, first: 0
          };
          this.commonService.getPaymentDetails(request).subscribe(resp => {
            if (resp) {
              const submitResponse = resp.data;
              const paramId = FccGlobalConstant.CONFIDENTIAL_PARAMETER;
              let confidentialString = FccGlobalConstant.EMPTY_STRING;
              this.commonService.getParameterConfiguredValues(null, paramId).subscribe(resp => {
                if (resp && resp.paramDataList) {
                  resp.paramDataList.forEach(element => {
                    confidentialString = element.data_1;
                  });
                }
              });
              if (this.commonService.isnonEMptyString(confidentialString) &&
              this.commonService.isnonEMptyString(submitResponse.paymentHeader.controlSum) &&
              submitResponse.paymentHeader.controlSum === FccGlobalConstant.FCM_CONFIDENTIAL_VAL) {
                submitResponse.paymentHeader.controlSum = confidentialString;
              } else {
                const currency = submitResponse.paymentDetail[0].instructedAmountCurrencyOfTransfer2.currencyOfTransfer;
                const amount = submitResponse.paymentHeader.controlSum;
                const formattedAmount = this.currencyConverterPipe.transform(amount, currency);
                submitResponse.paymentHeader.controlSum = this.commonService.getCurrencyFormatedAmountForPreview(currency, formattedAmount);
              }
              submitResponse[FccConstants.REAUTH_DATA_ACTION] = FccConstants.SUBMIT_BATCH_PAYMENT;
              submitResponse[FccGlobalConstant.OPTION] = FccConstants.OPTION_PAYMENTS;
              submitResponse[FccGlobalConstant.CATEGORY] = category;
              submitResponse[FccGlobalConstant.PRODUCTCODE] = FccConstants.PRODUCT_BT;
              submitResponse.userLangaugeMessage = `${this.translate.instant('batchPaymentApprovalSuccess')}`;
              this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(submitResponse) } });
            }
          });

        }
    },
    _err => {
      this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
      this.reauthService.handleTransactionSubmitErrors(_err);
    });
  }
  performTransactionPaymentsApproveRejectFCM(actionParams:any, eventType:any, successMsg, errMsg){
    const paymentReferenceNumbers = [];
    if(this.selectedRowsdata.length>0){
      this.selectedRowsdata.forEach(rowData=>{
        if(rowData!=undefined && null!=rowData && FccGlobalConstant.PAYMENT_REFERENCE_NUMBER === rowData[FccGlobalConstant.KEY]){
          paymentReferenceNumbers.push(rowData[FccGlobalConstant.VALUE]);
          this.selectedRowsdata=[];
        }
      });
      this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_TRUE);
      this.commonService.performTransactionPaymentsApproveRejectFCM(paymentReferenceNumbers,
        eventType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        actionParams.comment).subscribe(_res=>
        {
          this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        this.selectedRowsdata=[];
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.translate.instant('success')}`,
          detail: this.translate.instant(successMsg)
        });
        paymentReferenceNumbers.forEach(number=>{
          this.successAccArr.push(number);
        });
        this.hideConfirmationMessage(8000);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _err=>{
        this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        this.failedAccounts=_err.error;
        //remove failed from success
        if(Object.keys(this.failedAccounts).length!==0){
          for(const key in this.failedAccounts){
              paymentReferenceNumbers.splice(paymentReferenceNumbers.indexOf(key),1);
          }
        }

        //populate succeeded bene
        paymentReferenceNumbers.forEach(number => {
          this.successAccArr.push(number);
        });

      this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'error',
          summary:this.translate.instant('error'),
          detail:this.translate.instant(errMsg)
        });
        this.hideConfirmationMessage(8000);
      });

    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  performBatchPaymentInstrumentsApproveFCM(actionParams:any, eventType:any, successMsg, errMsg){
    let instrumentPaymentReference = '';
    const instrumentRefArray = [];
    this.resolverService.selectedRowsdata = [];
    let index = 1;
    if(this.selectedRowsdata.length>0){
      this.selectedRowsdata.forEach((item) => {
        if (this.commonService.isNonEmptyValue(item.instrumentPaymentReference)) {
          if(this.selectedRowsdata.length === index){
            instrumentPaymentReference = instrumentPaymentReference + item.instrumentPaymentReference ;
          } else {
            instrumentPaymentReference = instrumentPaymentReference + item.instrumentPaymentReference + ',';
          }
          index++;
          instrumentRefArray.push(item.instrumentPaymentReference);
        }
      });
      this.selectedRowsdata=[];
      this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_TRUE);
      this.commonService.isLoading.next(true);
      this.commonService.paymentInstrumentApproveFCM(this.batchRefNumber, eventType, instrumentPaymentReference).subscribe(()=>
        {
          this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        this.selectedRowsdata=[];
        this.resolverService.selectedRowsdata = [];
        this.showButtons = false;
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.translate.instant('success')}`,
          detail: this.translate.instant(successMsg)
        });
        instrumentRefArray.forEach(number=>{
          this.successAccArr.push(number);
        });
        this.hideConfirmationMessage(8000);
        this.commonService.refreshTable.next(true);
        this.resolverService.updateBatchStatus(this.batchRefNumber);
        this.selectedRowsdata=[];
        this.resolverService.selectedRowsdata = [];
        this.commonService.isLoading.next(false);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _err=>{
        this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        let errorMessage = '';
        if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
          errorMessage = 'failedApiErrorMsg';
        } else {
          errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
        }
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'error',
          summary:this.translate.instant('error'),
          detail:this.translate.instant(errorMessage)
        });
        this.hideConfirmationMessage(8000);
        this.commonService.isLoading.next(false);
      });

    }
  }



  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  performBatchPaymentInstrumentsRejectFCM(actionParams:any, eventType:any, successMsg, errMsg){
    let instrumentPaymentReference = '';
    this.resolverService.selectedRowsdata = [];
    const instrumentRefArray = [];
    let index = 1;
    if(this.selectedRowsdata.length>0){
      this.selectedRowsdata.forEach((item) => {
        if (this.commonService.isNonEmptyValue(item.instrumentPaymentReference)) {
          if(this.selectedRowsdata.length === index){
            instrumentPaymentReference = instrumentPaymentReference + item.instrumentPaymentReference ;
          } else {
            instrumentPaymentReference = instrumentPaymentReference + item.instrumentPaymentReference + ',';
          }
          index++;
          instrumentRefArray.push(item.instrumentPaymentReference);
        }
      });
      this.selectedRowsdata=[];
      this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_TRUE);
      this.commonService.isLoading.next(true);
      this.commonService.paymentInstrumentRejectFCM(this.batchRefNumber, eventType, instrumentPaymentReference,
        actionParams.comment).subscribe(()=>
        {
          this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        this.selectedRowsdata=[];
        this.resolverService.selectedRowsdata = [];
        this.showButtons = false;
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.translate.instant('success')}`,
          detail: this.translate.instant(successMsg)
        });
        instrumentRefArray.forEach(number=>{
          this.successAccArr.push(number);
        });
        this.hideConfirmationMessage(8000);
        this.commonService.refreshTable.next(true);
        this.resolverService.updateBatchStatus(this.batchRefNumber);
        this.commonService.isLoading.next(false);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _err=>{
        this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        let errorMessage = '';
        if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
          errorMessage = 'failedApiErrorMsg';
        } else {
          errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
        }
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'error',
          summary:this.translate.instant('error'),
          detail:this.translate.instant(errorMessage)
        });
        this.hideConfirmationMessage(8000);
        this.commonService.isLoading.next(false);
      });

    }
  }

  performBatchPaymentInstrumentsVerifyFCM(actionParams:any, eventType:any, successMsg, errMsg, comment, actionAllFlag: boolean){
    let instrumentPaymentReference = '';
    this.resolverService.selectedRowsdata = [];
    const instrumentRefArray = [];
    let index = 1;
    this.selectedRowsdata.forEach((item) => {
        if (this.commonService.isNonEmptyValue(item.instrumentPaymentReference)) {
          if(this.selectedRowsdata.length === index){
            instrumentPaymentReference = instrumentPaymentReference + item.instrumentPaymentReference ;
          } else {
            instrumentPaymentReference = instrumentPaymentReference + item.instrumentPaymentReference + ',';
          }
          index++;
          instrumentRefArray.push(item.instrumentPaymentReference);
        }
      });
      if(actionAllFlag){
        instrumentPaymentReference = '';
      }
      this.selectedRowsdata=[];
      switch(eventType){
        case 'VERIFY':
          this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_TRUE);
          this.commonService.isLoading.next(true);
          this.commonService.paymentInstrumentVerifyFCM(this.batchRefNumber, eventType,
            instrumentPaymentReference, comment).subscribe(()=>
            {
              this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
            this.selectedRowsdata=[];
            this.resolverService.selectedRowsdata = [];
            this.showButtons = false;
            this.commonService.showToasterMessage({
              life : 5000,
              key: 'tc',
              severity: 'success',
              summary: `${this.translate.instant('success')}`,
              detail: this.translate.instant(successMsg)
            });
            instrumentRefArray.forEach(number=>{
              this.successAccArr.push(number);
            });
            this.hideConfirmationMessage(8000);
            this.commonService.refreshTable.next(true);
            this.resolverService.updateBatchStatus(this.batchRefNumber);
            this.getRowUnSelectEvent(true);
            this.enableBatchSubmit(true);
            this.commonService.isLoading.next(false);
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _err=>{
            this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
            let errorMessage = '';
            if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
              errorMessage = 'failedApiErrorMsg';
            } else {
              errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
            }
            this.commonService.showToasterMessage({
              life : 5000,
              key: 'tc',
              severity: 'error',
              summary:this.translate.instant('error'),
              detail:this.translate.instant(errorMessage)
            });
            this.hideConfirmationMessage(8000);
            this.commonService.isLoading.next(false);
          });
          break;
        case 'VERIFIERREJECT':
          this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_TRUE);
          this.commonService.isLoading.next(true);
          this.commonService.paymentInstrumentVerifierRejectFCM(this.batchRefNumber, eventType,
            instrumentPaymentReference, comment).subscribe(()=>
            {
              this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
            this.selectedRowsdata=[];
            this.resolverService.selectedRowsdata = [];
            this.showButtons = false;
            this.commonService.showToasterMessage({
              life : 5000,
              key: 'tc',
              severity: 'success',
              summary: `${this.translate.instant('success')}`,
              detail: this.translate.instant(successMsg)
            });
            instrumentRefArray.forEach(number=>{
              this.successAccArr.push(number);
            });
            this.hideConfirmationMessage(8000);
            this.commonService.refreshTable.next(true);
            this.resolverService.updateBatchStatus(this.batchRefNumber);
            this.getRowUnSelectEvent(true);
            this.commonService.isLoading.next(false);
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _err=>{
            this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
            let errorMessage = '';
            if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
              errorMessage = 'failedApiErrorMsg';
            } else {
              errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
            }
            this.commonService.showToasterMessage({
              life : 5000,
              key: 'tc',
              severity: 'error',
              summary:this.translate.instant('error'),
              detail:this.translate.instant(errorMessage)
            });
            this.hideConfirmationMessage(8000);
            this.commonService.isLoading.next(false);
          });
          break;
      }
  }

  hideConfirmationMessage(timeout:number){
    window.setTimeout(()=>{
      this.resetAccMessageContent();
    },timeout);
  }

  resetAccMessageContent(){
    this.successAccArr=[];
    this.failedAccounts={};
  }

  checkEmptyObject(failedAccounts):boolean{
    return Object.keys(failedAccounts).length!==0;
  }

  setSubmitStatus(event) {
    this.isSubmitEnabled = event;
  }

  submit(){
    this.reauthService.category = this.category;
    this.reauthService.productCode = FccConstants.PRODUCT_BT;
    let iKey = sessionStorage.getItem(FccGlobalConstant.idempotencyKey);
    if (this.commonService.isEmptyValue(iKey)) {
      iKey = this.fccGlobalConstantService.generateUUIDUsingTime();
      sessionStorage.setItem(FccGlobalConstant.idempotencyKey, iKey);
    }
    this.reauthService.submitPayload = {
      action: FccConstants.SUBMIT_BATCH_PAYMENT,
      idempotencyKey: iKey
    };
    sessionStorage.removeItem(FccGlobalConstant.idempotencyKey);
    this.legalTextService.openLegalTextDiaglog(this.reauthService.submitPayload);
  }

  submitButtonEnableDisable() {
    if(this.batchStatus === FccGlobalConstant.PENDING_REPAIR ||
      this.batchStatus === FccGlobalConstant.PARTIALLY_REJECTED ||
      this.batchStatus === FccGlobalConstant.REJECTED ||
      this.batchStatus === FccGlobalConstant.VERIFIER_REJECTED ){
        return this.isSubmitButtonDisable = true;
    }
    return this.isSubmitButtonDisable = false;
  }

  onClickSubmit(){
    if(this.batchStatus===FccGlobalConstant.VERIFIED ||
      this.batchStatus===FccGlobalConstant.PARTIALLYVERIFIED ||
      this.batchStatus===FccGlobalConstant.PENDINGMYVERIFICATION){
        this.category = FccGlobalConstant.FCM;
        this.submit();
      }
  }

  onClickVerifyAll(actionParam){
    this.onClickVerify(actionParam, true);
  }

  onClickRejectAll(actionParam){
    this.onClickReject(actionParam, true);
  }

  getRowSelectEvent(event) {
    this.selectedRowsdata = this.resolverService.selectedRowsdata;
    if (event.selectedRowsData.length > 0) {
      if(this.batchStatus === FccGlobalConstant.PARTIALLYVERIFIED ||
        this.batchStatus === FccGlobalConstant.VERIFIED){
          this.enableBatchSubmit(false);
      }
      const lastSelectedRowStatus = event?.selectedRowsData?
      event.selectedRowsData[event.selectedRowsData.length-1]['instrumentstatus']:'';
      this.commonService.selectedBatchInstrumentStatus = lastSelectedRowStatus;
      this.buttonList.forEach((item) => {
        if (item.hide !== undefined && (item.name === FccGlobalConstant.REJECT || item.name === FccGlobalConstant.VERIFY_STATUS)) {
          item.hide = "false";
        }
        if (item.hide !== undefined && (item.name === FccGlobalConstant.REJECT_ALL || item.name === FccGlobalConstant.VERIFY_ALL)) {
          item.hide = "true";
        }
        if(item.hide !== undefined && (item.name === FccGlobalConstant.REJECT || item.name === FccGlobalConstant.APPROVE)){
          if(lastSelectedRowStatus === FccGlobalConstant.PENDINGMYAPPROVAL){
            item.hide = "false";
          }
          if(lastSelectedRowStatus === FccGlobalConstant.PENDINGSEND){
            item.hide = "true";
          }
        }
        if(item.hide !== undefined && (item.actionName === FccGlobalConstant.SEND || item.actionName === FccGlobalConstant.SCRAP)){
          if(lastSelectedRowStatus === FccGlobalConstant.PENDINGMYAPPROVAL){
            item.hide = "true";
          }
          if(lastSelectedRowStatus === FccGlobalConstant.PENDINGSEND){
            item.hide = "false";
          }
        }
      });
    } else {
      this.commonService.selectedBatchInstrumentStatus = null;
    }
  }

  getRowUnSelectEvent(callSuccess,event?) {
    this.selectedRowsdata = this.resolverService.selectedRowsdata;
    if (callSuccess || event.selectedRowsData.length == 0) {
      if(this.batchStatus === FccGlobalConstant.PARTIALLYVERIFIED ||
        this.batchStatus === FccGlobalConstant.VERIFIED){
          this.enableBatchSubmit(true);
        }
      this.buttonList.forEach((item) => {
        if (item.hide !== undefined && (item.name === FccGlobalConstant.REJECT || item.name === FccGlobalConstant.VERIFY_STATUS)) {
          item.hide = "true";
        }
        if (item.hide !== undefined && (item.name === FccGlobalConstant.REJECT_ALL || item.name === FccGlobalConstant.VERIFY_ALL)) {
          item.hide = "false";
        }
      });
    }
  }

  showCommentSection() {
    if (this.selectedRowsdata.length > 0 ||
      this.batchStatus === FccGlobalConstant.PENDINGMYVERIFICATION ||
      this.batchStatus === FccGlobalConstant.PARTIALLYVERIFIED ||
      this.batchStatus === FccGlobalConstant.VERIFIER_REJECTED ||
      this.batchStatus === FccGlobalConstant.VERIFIED) {
        if([FccGlobalConstant.PENDING_MY_APPROVAL_STATUS,
          ...FccGlobalConstant.PENDING_SEND_STATUS].includes(this.batchStatus)){
            const operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
            if(operation === FccConstants.VIEW_AUTH || operation === FccConstants.VIEW_SEND){
              return true;
            } else {
              return false;
            }
        }
      return true;
    }
    return false;
  }

  enableBatchSubmit(isEnable) {
    this.buttonList.forEach((item) => {
      if (item.name === "submit") {
        if (isEnable) {
          item.disable = "false";
        } else {
          item.disable = "true";
        }
      }
    });
  }
  onClickBackToPaymentList() {
    const activeTab = localStorage.getItem('activeTabDrill') ? parseInt(localStorage.getItem('activeTabDrill')) :
    parseInt(localStorage.getItem('activeTab'));
    this.router.navigateByUrl('productListing?option=PAYMENTS&category=FCM&activeTab='+activeTab);
  }

  onClickBackToDashboard() {
    this.router.navigateByUrl('dashboard/cash');
  }

  identifyRedirection() {
    if (localStorage.getItem('identifyPage') === 'cash-dashboard') {
      return false;
    }
    return true;
  }

  performBatchPaymentInstrumentsSendFCM(actionParams:any, eventType:any, successMsg){
    let instrumentPaymentReference = '';
    const instrumentRefArray = [];
    this.resolverService.selectedRowsdata = [];
    let index = 1;
    if(this.selectedRowsdata.length>0){
      this.selectedRowsdata.forEach((item) => {
        if (this.commonService.isNonEmptyValue(item.instrumentPaymentReference)) {
          if(this.selectedRowsdata.length === index){
            instrumentPaymentReference = instrumentPaymentReference + item.instrumentPaymentReference ;
          } else {
            instrumentPaymentReference = instrumentPaymentReference + item.instrumentPaymentReference + ',';
          }
          index++;
          instrumentRefArray.push(item.instrumentPaymentReference);
        }
      });
      this.selectedRowsdata=[];
      const comment = actionParams.comment? actionParams.comment:"";
      this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_TRUE);
      this.commonService.isLoading.next(true);
      this.commonService.sendBatchInstrumentPaymentAction(this.batchRefNumber, eventType,
        instrumentPaymentReference,comment).subscribe(()=>
        {
          this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        this.selectedRowsdata=[];
        this.resolverService.selectedRowsdata = [];
        this.showButtons = false;
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.translate.instant('success')}`,
          detail: this.translate.instant(successMsg)
        });
        instrumentRefArray.forEach(number=>{
          this.successAccArr.push(number);
        });
        this.hideConfirmationMessage(8000);
        this.commonService.refreshTable.next(true);
        this.resolverService.updateBatchStatus(this.batchRefNumber);
        this.selectedRowsdata=[];
        this.resolverService.selectedRowsdata = [];
        this.commonService.isLoading.next(false);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _err=>{
        this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        let errorMessage = '';
        if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
          errorMessage = 'failedApiErrorMsg';
        } else {
          errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
        }
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'error',
          summary:this.translate.instant('error'),
          detail:this.translate.instant(errorMessage)
        });
        this.hideConfirmationMessage(8000);
        this.commonService.isLoading.next(false);
      });
    } else {
      this.performBatchPaymentSend(actionParams, FccGlobalConstant.SEND);
    }
  }

  performBatchPaymentInstrumentsScrapFCM(actionParams:any, eventType:any, successMsg){
    let instrumentPaymentReference = '';
    const instrumentRefArray = [];
    this.resolverService.selectedRowsdata = [];
    let index = 1;
    if(this.selectedRowsdata.length>0){
      this.selectedRowsdata.forEach((item) => {
        if (this.commonService.isNonEmptyValue(item.instrumentPaymentReference)) {
          if(this.selectedRowsdata.length === index){
            instrumentPaymentReference = instrumentPaymentReference + item.instrumentPaymentReference ;
          } else {
            instrumentPaymentReference = instrumentPaymentReference + item.instrumentPaymentReference + ',';
          }
          index++;
          instrumentRefArray.push(item.instrumentPaymentReference);
        }
      });
      this.selectedRowsdata=[];
      this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_TRUE);
      this.commonService.isLoading.next(true);
      this.commonService.scrapBatchInstrumentPaymentAction(this.batchRefNumber, eventType,
        instrumentPaymentReference,actionParams.comment).subscribe(()=>
        {
          this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        this.selectedRowsdata=[];
        this.resolverService.selectedRowsdata = [];
        this.showButtons = false;
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.translate.instant('success')}`,
          detail: this.translate.instant(successMsg)
        });
        instrumentRefArray.forEach(number=>{
          this.successAccArr.push(number);
        });
        this.hideConfirmationMessage(8000);
        this.commonService.refreshTable.next(true);
        this.resolverService.updateBatchStatus(this.batchRefNumber);
        this.selectedRowsdata=[];
        this.resolverService.selectedRowsdata = [];
        this.commonService.isLoading.next(false);
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _err=>{
        this.resolverService.isDisableCommentSectionBtn.next(FccGlobalConstant.STRING_FALSE);
        let errorMessage = '';
        if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
          errorMessage = 'failedApiErrorMsg';
        } else {
          errorMessage = _err.error.errors.length > 0 ? _err.error.errors[0].description : 'failedApiErrorMsg';
        }
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'error',
          summary:this.translate.instant('error'),
          detail:this.translate.instant(errorMessage)
        });
        this.hideConfirmationMessage(8000);
        this.commonService.isLoading.next(false);
      });
    } else {
      this.performBatchPymentScrap(actionParams, FccGlobalConstant.ACTION_DISCARD);
    }
  }

  updateApproveSendBtns(buttonsList){
    buttonsList?.actionList.forEach(item => {
      if(this.operation === FccConstants.VIEW_AUTH){
        if(item.name === FccGlobalConstant.REJECT || item.name === FccGlobalConstant.APPROVE){
          item.hide = "false";
        }else{
          item.hide = "true";
        }
      }else if(this.operation === FccConstants.VIEW_SEND){
        if(item.actionName === FccGlobalConstant.SEND || item.actionName === FccGlobalConstant.SCRAP){
          item.hide = "false";
        }else{
          item.hide = "true";
        }
      }
    });
    return buttonsList;
  }

}
