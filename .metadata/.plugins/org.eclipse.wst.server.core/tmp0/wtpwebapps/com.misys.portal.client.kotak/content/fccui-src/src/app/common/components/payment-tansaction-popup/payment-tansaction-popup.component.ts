import { Component, Injector, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng';
import { FCCBase } from '../../../base/model/fcc-base';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-payment-tansaction-popup',
  templateUrl: './payment-tansaction-popup.component.html',
  styleUrls: ['./payment-tansaction-popup.component.scss']
})
export class PaymentTansactionPopupComponent extends FCCBase implements OnInit {

  textAreaValue = "";
  maxChars = "255";
  rows = 0;
  cols = 0;
  public dialogData: any;
  langDir: string = localStorage.getItem('langDir');
  autoResize = false;
  discardForm: UntypedFormGroup;
  paymentDashboardWidget: boolean;
  beneApproveRejectWidget: boolean;
  isConfirmClicked= false;
  isDisableConfirmButton = false;
  constructor(protected fb: UntypedFormBuilder, protected injector: Injector, protected commonService: CommonService,
    public translate: TranslateService, public dialogRef: DynamicDialogRef,
    protected dynamicDialogConfig: DynamicDialogConfig, public messageService: MessageService) {
      super();
   }

  ngOnInit(): void {

    this.discardForm = this.fb.group({
      remarks: ['', Validators.required]
  });
  if (this.commonService.paymentWidget) {
    this.paymentDashboardWidget = true;
  }
  this.commonService.paymentWidget = false;

  if(this.commonService.beneApproveRejectWidget) {
    this.beneApproveRejectWidget = true;
    this.commonService.beneApproveRejectWidget = false;
  } else {
    this.beneApproveRejectWidget = false;
  }

  }

  onClickConfirm() {
    this.isConfirmClicked= true;
    const actionName = this.dynamicDialogConfig.data && this.dynamicDialogConfig.data.actionName ?
                     this.dynamicDialogConfig.data.actionName : '';
    if(!this.dynamicDialogConfig.data && this.dynamicDialogConfig.data.rowData &&
      this.dynamicDialogConfig.data.rowData.isBatchPayment.toLowerCase() == 'true'){
    if(this.textAreaValue.length > 0)
    {
      this.isDisableConfirmButton = true;
     this.commonService.scrapbatchPaymentAction(this.dynamicDialogConfig.data.rowData.paymentReferenceNumber,
      FccGlobalConstant.ACTION_DISCARD, this.textAreaValue).subscribe(() => {
     const tosterObj = {
       life : 5000,
       key: 'tc',
       severity: 'success',
       summary:  `${this.translate.instant('success')}`,
       detail: `${this.translate.instant('BatchscrapToasterMEssage',
       { refNo: this.dynamicDialogConfig.data.rowData.paymentReferenceNumber })}`
     };
     this.messageService.add(tosterObj);
     this.commonService.refreshPaymentList.next(true);
     this.dialogRef.close();
   }, (_err) => {
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
     this.dialogRef.close();
   });}
    }else {
      if(this.textAreaValue.length > 0)
    {
      this.isDisableConfirmButton = true;
    const toasterMsg = actionName === FccGlobalConstant.SCRAP ? 'scrapToasterMEssage' : 'verifyRejectToasterMessage';
    if (actionName === FccGlobalConstant.SCRAP) {
      this.commonService.performPaymentsApproveRejectFCM(this.dynamicDialogConfig.data.rowData.paymentReferenceNumber,
        FccGlobalConstant.ACTION_DISCARD, this.textAreaValue).subscribe(() => {
       const tosterObj = {
         life : 5000,
         key: 'tc',
         severity: 'success',
         summary:  `${this.translate.instant('success')}`,
         detail: `${this.translate.instant(toasterMsg, { refNo: this.dynamicDialogConfig.data.rowData.paymentReferenceNumber })}`
       };
       this.messageService.add(tosterObj);
       this.commonService.refreshPaymentList.next(true);
       this.dialogRef.close();
     }, (_err) => {
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
       this.dialogRef.close();
     });
    } else if (actionName === FccGlobalConstant.ACTION_REJECT) {
      this.commonService.paymentSingleInstrumentRejectFCM(this.dynamicDialogConfig.data.rowData.paymentReferenceNumber,
        FccGlobalConstant.VERIFIERREJECT, this.textAreaValue).subscribe(() => {
       const tosterObj = {
         life : 5000,
         key: 'tc',
         severity: 'success',
         summary:  `${this.translate.instant('success')}`,
         detail: `${this.translate.instant('verifyRejectToasterMessage',
         { refNo: this.dynamicDialogConfig.data.rowData.paymentReferenceNumber })}`
       };
       this.messageService.add(tosterObj);
       this.commonService.refreshPaymentList.next(true);
       this.dialogRef.close();
     }, (_err) => {
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
       this.dialogRef.close();
     });
    } else if (actionName === 'BATCH_INSTRUMENT_REJECT') {
      this.commonService.paymentInstrumentRejectFCM(this.commonService.batchRefNumber, 'REJECT',
        this.dynamicDialogConfig.data.rowData.instrumentPaymentReference,
        this.textAreaValue).subscribe(()=>
        {
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'success',
          summary:  `${this.translate.instant('success')}`,
          detail: this.translate.instant('PAYMENTS_BATCH_REJECT_SUCCESS_MSG')
        });
        this.commonService.refreshTable.next(true);
        this.commonService.updateBatchStatus(this.commonService.batchRefNumber);
        this.dialogRef.close();
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _err=>{
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
      });
    } else if (actionName === 'BATCH_INSTRUMENT_SCRAP') {
      this.commonService.scrapBatchInstrumentPaymentAction(this.commonService.batchRefNumber, FccGlobalConstant.ACTION_DISCARD,
        this.dynamicDialogConfig.data.rowData.instrumentPaymentReference,
        this.textAreaValue).subscribe(()=>
        {
        this.commonService.showToasterMessage({
          life : 5000,
          key: 'tc',
          severity: 'success',
          summary:  `${this.translate.instant('success')}`,
          detail: this.translate.instant('PAYMENTS_BATCH_SCRAP_SUCCESS_MSG')
        });
        this.commonService.refreshTable.next(true);
        this.commonService.updateBatchStatus(this.commonService.batchRefNumber);
        this.dialogRef.close();
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _err=>{
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
      });
    } else if (actionName === FccGlobalConstant.ACTION_VERIFY_REJECT) {
      this.commonService.paymentInstrumentVerifierRejectFCM(this.commonService.batchRefNumber,
        FccGlobalConstant.VERIFIERREJECT,this.dynamicDialogConfig.data.rowData.instrumentPaymentReference,
         this.textAreaValue).subscribe(() => {
       const tosterObj = {
         life : 5000,
         key: 'tc',
         severity: 'success',
         summary:  `${this.translate.instant('success')}`,
         detail: `${this.translate.instant('verifyRejectInstrumentToasterMessage')}`
       };
       this.messageService.add(tosterObj);
        this.commonService.refreshTable.next(true);
        this.commonService.updateBatchStatus(this.commonService.batchRefNumber);
       this.dialogRef.close();
     }, (_err) => {
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
       this.dialogRef.close();
     });
    } else if (actionName === FccGlobalConstant.CHECKER_REJECT) {
      this.commonService.paymentCheckerRejectFCM(this.dynamicDialogConfig.data.rowData.paymentReferenceNumber,
        FccGlobalConstant.ACTION_REJECT, this.textAreaValue).subscribe(() => {
       const tosterObj = {
         life : 5000,
         key: 'tc',
         severity: 'success',
         summary:  `${this.translate.instant('success')}`,
         detail: `${this.translate.instant('checkerRejectToasterMessage')}`
       };
       this.messageService.add(tosterObj);
       this.commonService.refreshPaymentList.next(true);
       this.dialogRef.close();
     }, (_err) => {
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
      this.dialogRef.close();
     });
    } else if (actionName === FccGlobalConstant.BENE_REJECT) {

      const associationId = this.dynamicDialogConfig.data.rowData['bankAccount@associationId'];
      const beneficiaryId: string = this.dynamicDialogConfig.data.rowData[FccGlobalConstant.BENEFICIARY_ID];
      const beneficiaryName: string = this.dynamicDialogConfig.data.rowData[FccGlobalConstant.BENEFICIARY_NAME];
      this.commonService.approveReject(associationId, FccGlobalConstant.ACTION_REJECT, this.textAreaValue, beneficiaryId)
        .subscribe(() => {
          const tosterObj = {
            life: 5000,
            key: 'tc',
            severity: 'success',
            summary:  `${this.translate.instant('success')}`,
            detail: this.translate.instant('beneSingleRejectSuccessMsg', { beneficiaryName: beneficiaryName })
          };
          this.messageService.add(tosterObj);
          this.commonService.refreshPaymentList.next(true);
          this.dialogRef.close();
        }, (_err) => {
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
          this.dialogRef.close();
        });
    } else {
      return;
    }



  }}
  }

  getValidationText() {
    const actionName = this.dynamicDialogConfig.data.actionName?
    this.dynamicDialogConfig.data.actionName : this.dynamicDialogConfig.data.action;
    if (actionName === FccGlobalConstant.ACTION_REJECT || actionName === FccGlobalConstant.BENE_REJECT ||
        actionName === FccGlobalConstant.CHECKER_REJECT) {
      return this.translate.instant('commentsRequiredViewPopup');
    } else {
      return this.translate.instant('remarkRequired');
    }
  }


  onClickConfirmPaymentsWidget() {
    this.isConfirmClicked= true;
    if(this.textAreaValue.length > 0){
      this.isDisableConfirmButton = true;
      const data = this.dynamicDialogConfig.data;
      let paymentReferenceList = data.rowData.paymentReferenceList.split(',');
      paymentReferenceList = paymentReferenceList.filter(item => item !==null && item !== '');
      const clientCode = data.rowData.clientCode?data.rowData.clientCode:null;
      const packageName = data.rowData.packageName?data.rowData.packageName:null;
      let action='';
      if(data.action === 'SCRAP'){
        action = 'DISCARD';
      }else{
        action = data.action;
      }
      const request = {
        event: action,
        checkerRemarks:this.textAreaValue?this.textAreaValue:null,
        paymentReferenceNumber: paymentReferenceList
      };
    this.commonService.paymentDashboardAction(request,packageName,clientCode).subscribe(
      () => {
        let successMsg='';
        if('SCRAP' === data.action){
          successMsg = `${this.translate.instant('scrappedToasterMEssage',
        { name: packageName?packageName: clientCode })}`;
        }else{
          successMsg = `${this.translate.instant('rejectToasterMEssage',
        { name: packageName?packageName: clientCode })}`;
        }
        const tosterObj = {
          life : 5000,
          key: 'tc',
          severity: 'success',
          summary: `${this.translate.instant('success')}`,
          detail: successMsg
        };
        this.messageService.add(tosterObj);
        this.commonService.refreshPaymentWidgetList.next({
          inputParam: data.inputParam,
          selectedRowsData: data.rowData
        });
        this.dialogRef.close();
      }, (_err) => {
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
        this.dialogRef.close();
      });
    }
  }

  onClickCancel() {
    this.dialogRef.close();
  }

  onClickConfirmBeneRejectWidget() {
    this.isConfirmClicked= true;
    this.dynamicDialogConfig.data.actionName = FccGlobalConstant.ACTION_REJECT;
    if(this.textAreaValue.length > 0){
      this.isDisableConfirmButton = true;
      this.commonService.beneApproveRejectWidget = true;
      this.commonService.beneApproveRejectWidgetRejectReason = this.textAreaValue;
      this.dialogRef.close();
    }
  }

}
