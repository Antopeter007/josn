import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import {
  ConfirmationDialogComponent,
} from '../../../app/corporate/trade/lc/initiation/component/confirmation-dialog/confirmation-dialog.component';
import { ScreenMapping } from '../model/screen-mapping';
import { FccGlobalConstantService } from './../../common/core/fcc-global-constant.service';
import { FccGlobalConstant } from './../../common/core/fcc-global-constants';
import { CommonService } from './../../common/services/common.service';
import { ReauthService } from './../../common/services/reauth.service';
import { TransactionDetailService } from './../../common/services/transactionDetail.service';
import { ListDefService } from './../../common/services/listdef.service';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(protected router: Router, protected translate: TranslateService,
              protected dialogService: DialogService , protected commonService: CommonService,
              protected listService: ListDefService,
              protected messageService: MessageService, protected fccGlobalConstantService: FccGlobalConstantService,
              protected reauthService: ReauthService, protected transactionDetailService: TransactionDetailService,
              protected http: HttpClient) {
  }
  deleterowstatus =  false;
  contextPath: any;
  option;
  deleterowObject;
  refreshList: EventEmitter<any> = new EventEmitter<any>();
  tableRendered = new BehaviorSubject(false);

  onClickCorrespondence(event, rowData) {
    const tnxType = FccGlobalConstant.N002_INQUIRE;
    const optionValue = FccGlobalConstant.EXISTING_OPTION;
    const subTnxTypeCodeValue = FccGlobalConstant.N003_CORRESPONDENCE;
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: { refId: rowData.ref_id,
    productCode: rowData.product_code, subProductCode: rowData.sub_product_code,
    tnxTypeCode: tnxType, option: optionValue, subTnxTypeCode: subTnxTypeCodeValue} });
  }

  onClickAssignment(event, rowData, option) {
    if (option === FccGlobalConstant.GENERAL) {
      this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: { refId: rowData.ref_id,
        productCode: rowData.product_code,
        tnxTypeCode: FccGlobalConstant.N002_INQUIRE, option: FccGlobalConstant.OPTION_ASSIGNEE } });
    }
  }

  onClickTDUpdate(event, rowData, option) {
    let entity = rowData[FccGlobalConstant.ACCOUNT_ENTITY]
    if(this.commonService.isNonEmptyValue(rowData[FccGlobalConstant.ORIG_GROUPED_VAL])){
      entity = rowData[FccGlobalConstant.ORIG_GROUPED_VAL].split(',')[0];
    }
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: {
      productCode: FccGlobalConstant.PRODUCT_TD, subProductCode: FccGlobalConstant.SUB_PRODUCT_CODE_CSTD,
      tnxTypeCode: FccGlobalConstant.EC_AMEND_TERMS, accountId: rowData.account_id,
      entity_abbv_name: entity, option: FccGlobalConstant.EXISTING } });
  }

  onClickTDWithDraw(event, rowData, option) {
    let entity = rowData[FccGlobalConstant.ACCOUNT_ENTITY]
    if(this.commonService.isNonEmptyValue(rowData[FccGlobalConstant.ORIG_GROUPED_VAL])){
      entity = rowData[FccGlobalConstant.ORIG_GROUPED_VAL].split(',')[0];
    }
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: {
      productCode: FccGlobalConstant.PRODUCT_TD, subProductCode: FccGlobalConstant.SUB_PRODUCT_CODE_CSTD,
      tnxTypeCode: FccGlobalConstant.N002_INQUIRE, accountId: rowData.account_id,
      entity_abbv_name: entity, option: FccGlobalConstant.EXISTING } });
  }

  onClickRemittanceLetter(event, rowData, option) {
    if (option === FccGlobalConstant.GENERAL) {
      const subTnxTypeCodeValue = FccGlobalConstant.N003_REMITTANCE_LETTER_GENERATION;
      this.router.navigate(['productScreen'], { queryParams: { refId: rowData.ref_id,
        productCode: rowData.product_code,
        tnxTypeCode: FccGlobalConstant.N002_INQUIRE, subTnxTypeCode: subTnxTypeCodeValue } });
    }
  }

  onClickTransfer(event, rowData, option) {
    if (option === FccGlobalConstant.GENERAL) {
      this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: { refId: rowData.ref_id,
        productCode: rowData.product_code,
        tnxTypeCode: FccGlobalConstant.N002_INQUIRE, option: FccGlobalConstant.OPTION_TRANSFER } });
    }
  }

  onClickRequestSettlement(event, rowData) {
    const tnxType = FccGlobalConstant.N002_INQUIRE;
    const optionValue = FccGlobalConstant.EXISTING_OPTION;
    const subTnxTypeCodeValue = FccGlobalConstant.N003_SETTLEMENT_REQUEST;
    if ((rowData.product_code === FccGlobalConstant.PRODUCT_BG || rowData.product_code === FccGlobalConstant.PRODUCT_BR
      || rowData.product_code === FccGlobalConstant.PRODUCT_LC)
      && rowData.action_req_code && rowData.action_req_code === FccGlobalConstant.N042_CLEAN_RESPONSE) {
        this.onClickRespond(event, rowData);
    } else {
      this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: { refId: rowData.ref_id,
      productCode: rowData.product_code, subProductCode: rowData.sub_product_code,
      tnxTypeCode: tnxType, option: optionValue, subTnxTypeCode: subTnxTypeCodeValue}});
    }
  }

  onClickRespond($event, rowData) {
    const tnxType = FccGlobalConstant.N002_INQUIRE;
    const optionValue = FccGlobalConstant.ACTION_REQUIRED;
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: { refId: rowData.ref_id,
    productCode: rowData.product_code, subProductCode: rowData.sub_product_code,
    tnxTypeCode: tnxType, option: optionValue, tnxId: rowData.tnx_id} });
  }

  onClickDiscrepant($event, rowData) {
    if (rowData.product_code === FccGlobalConstant.PRODUCT_LC || rowData.product_code === FccGlobalConstant.PRODUCT_SI) {
    const tnxType = FccGlobalConstant.N002_INQUIRE;
    const optionValue = FccGlobalConstant.EXISTING_OPTION;
    const modeValue = FccGlobalConstant.DISCREPANT;
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: { refId: rowData.ref_id,
    productCode: rowData.product_code, subProductCode: rowData.sub_product_code,
    tnxTypeCode: tnxType, option: optionValue, tnxId: rowData.tnx_id, mode: modeValue} });
    } else {
      const tnxType = FccGlobalConstant.N002_INQUIRE;
      const optionValue = FccGlobalConstant.ACTION_REQUIRED;
      this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: { refId: rowData.ref_id,
      productCode: rowData.product_code, subProductCode: rowData.sub_product_code,
      tnxTypeCode: tnxType, option: optionValue, tnxId: rowData.tnx_id} });
    }
  }

  onClickCancel(event, rowData) {
    const tnxType = FccGlobalConstant.N002_INQUIRE;
    const optionValue = FccGlobalConstant.CANCEL_OPTION;
    const subTnxTypeCodeValue = FccGlobalConstant.N003_CANCELLATION_REQUEST;
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], { queryParams: { refId: rowData.ref_id,
    productCode: rowData.product_code, subProductCode: rowData.sub_product_code,
    tnxTypeCode: tnxType, option: optionValue, subTnxTypeCode: subTnxTypeCodeValue} });
  }

  onClickDelete(event, rowData) {
    const beneGroupId = rowData[FccGlobalConstant.BENEFICIARY_GRP_ID];
    let headerField;
    let message;
    headerField = `${this.translate.instant('deleteBeneficiary')}`;
    message = `${this.translate.instant('delteConfirmationMsgForBeneficiary')}`;
    const direction = 'direction';
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: {direction: dir},
      data: {locaKey: message}
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.continueDelete(beneGroupId);
      }
    });
  }

  onClickDiscard(event, rowData, optionVal, fromCanDeactive?: boolean) {
    this.deleterowObject = [];
    this.deleterowObject.push(event, rowData);
    const productCode = rowData.product_code;
    const refId = rowData.ref_id;
    const tnxId = rowData.tnx_id;
    const subProductCode = rowData.sub_product_code;
    let headerField;
    let message;
    this.commonService.isDisacrdSelectionYes = false;
    if (optionVal !== undefined && this.commonService.isNonEmptyValue(optionVal) && optionVal === FccGlobalConstant.TEMPLATE) {
      this.option = FccGlobalConstant.TEMPLATE;
      headerField = `${this.translate.instant('discardTemplate')}`;
      message = `${this.translate.instant('discardTemplateConfirmation')}`;
    } else {
      this.option = FccGlobalConstant.GENERAL;
      headerField = `${this.translate.instant('discardTransaction')}`;
      message = `${this.translate.instant('discardConfirmationMsg')}`;
    }
    const direction = 'direction';
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
        const tnxID = this.commonService.eventId ? this.commonService.eventId : tnxId;
        this.continueDeleteService(productCode, refId, tnxID, subProductCode);
        if(fromCanDeactive)
        {
          this.commonService.isDisacrdSelectionYes = true;
        }
      }
      if(fromCanDeactive)
      {
        this.commonService.oncloseDeleteRedirect = true;
        this.commonService.onCloseDeleteSubject.next(true);
      }
    });
  }

  selectedDeleteService(productCode, refId, tnxId, subProductCode, optMode){
    if (optMode === FccGlobalConstant.TEMPLATE) {
      if (productCode === FccGlobalConstant.PRODUCT_LC) {
        this.commonService.deleteLCTemplate(this.deleterowObject[1].template_id).subscribe(data => {
          if (data.status === FccGlobalConstant.LENGTH_200) {
            this.deleterowstatus = true;
            const tosterObj = {
              life: 5000,
              key: 'tc',
              severity: 'success',
              summary: `${this.deleterowObject[1].template_id}`,
              detail: `${this.translate.instant('singleDiscardToasterMessage')}`
            };
            this.messageService.add(tosterObj);
            this.commonService.refreshListBehaviourSubject.next(true);
             setTimeout(() => {
              this.deleterowstatus = false;
            }, FccGlobalConstant.LENGTH_2000);
          }
        });
      } else {
        this.commonService.deleteTemplate(this.deleterowObject[1].template_id, productCode, subProductCode).subscribe(response => {
          if (response.status === FccGlobalConstant.LENGTH_200) {
            this.deleterowstatus = true;
            const tosterObj = {
              life: 5000,
              key: 'tc',
              severity: 'success',
              summary: `${this.deleterowObject[1].template_id}`,
              detail: `${this.translate.instant('singleDiscardToasterMessage')}`
            };
            this.messageService.add(tosterObj);
            this.commonService.refreshListBehaviourSubject.next(true);
            setTimeout(() => {
              this.deleterowstatus = false;
            }, FccGlobalConstant.LENGTH_2000);
          }
        });
      }
    } else if (optMode === FccGlobalConstant.GENERAL || optMode === FccGlobalConstant.TRANSACTION_IN_PROGRESS) {
      let result: Observable<any>;
      const transactionId = this.deleterowObject && this.deleterowObject[1]?.tnx_id ? this.deleterowObject[1]?.tnx_id : tnxId
      if (productCode === FccGlobalConstant.PRODUCT_LC) {
        result = this.commonService.deleteLC(transactionId);
      } else if (productCode === FccGlobalConstant.PRODUCT_EL) {
        result = this.commonService.deleteEL(transactionId);
      }
      else if (productCode !== '') {
        result = this.commonService.genericDelete(productCode, refId ,tnxId, subProductCode);
      }
      result.subscribe(data => {
        if (data.status === FccGlobalConstant.LENGTH_200 || data.messageKey === FccGlobalConstant.DELETE_SUCCESS) {
          this.deleterowstatus = true;
          const tosterObj = {
            life: 5000,
            key: 'tc',
            severity: 'success',
            summary: `${refId}`,
            detail: `${this.translate.instant('singleDiscardToasterMessage')}`
          };
          this.messageService.add(tosterObj);
          this.commonService.refreshListBehaviourSubject.next(true);
          setTimeout(() => {
            this.deleterowstatus = false;
          }, FccGlobalConstant.LENGTH_2000);

        }
      });
    }
  }
  continueDeleteService(productCode, refId, tnxId, subProductCode) {
    if (this.option === FccGlobalConstant.TEMPLATE) {
      if (productCode === FccGlobalConstant.PRODUCT_LC) {
        this.commonService.deleteLCTemplate(encodeURIComponent(this.deleterowObject[1].template_id), subProductCode).subscribe(data => {
          if (data.status === FccGlobalConstant.LENGTH_200) {
            this.deleterowstatus = true;
            const tosterObj = {
              life: 5000,
              key: 'tc',
              severity: 'success',
              summary: `${this.deleterowObject[1].template_id}`,
              detail: `${this.translate.instant('singleDiscardToasterMessage')}`
            };
            this.messageService.add(tosterObj);
            this.commonService.refreshListBehaviourSubject.next(true);
             setTimeout(() => {
              this.deleterowstatus = false;
            }, FccGlobalConstant.LENGTH_2000);
          }
        });
      } else {
        this.commonService.deleteTemplate(encodeURIComponent(this.deleterowObject[1].template_id), productCode, subProductCode).subscribe(response => {
          if (response.status === FccGlobalConstant.LENGTH_200) {
            this.deleterowstatus = true;
            const tosterObj = {
              life: 5000,
              key: 'tc',
              severity: 'success',
              summary: `${this.deleterowObject[1].template_id}`,
              detail: `${this.translate.instant('singleDiscardToasterMessage')}`
            };
            this.messageService.add(tosterObj);
            this.commonService.refreshListBehaviourSubject.next(true);
            setTimeout(() => {
              this.deleterowstatus = false;
            }, FccGlobalConstant.LENGTH_2000);
          }
        });
      }
    } else if (this.option === FccGlobalConstant.GENERAL || this.option === FccGlobalConstant.TRANSACTION_IN_PROGRESS
      || this.option === FccGlobalConstant.GENERIC_FILE_UPLOAD) {
      let result: Observable<any>;
      if (productCode === FccGlobalConstant.PRODUCT_LC) {
        result = this.commonService.deleteLC((undefined !== this.deleterowObject && this.deleterowObject[1]?.tnx_id)? this.deleterowObject[1]?.tnx_id : tnxId);
      } else if (productCode === FccGlobalConstant.PRODUCT_EL) {
        result = this.commonService.deleteEL((undefined !== this.deleterowObject && this.deleterowObject[1]?.tnx_id)? this.deleterowObject[1]?.tnx_id : tnxId);
      }
      else if (productCode !== '') {
        result = this.commonService.genericDelete(productCode, refId, tnxId, subProductCode);
      }
      result.subscribe(data => {
        if (data.status === FccGlobalConstant.LENGTH_200 || data.messageKey === FccGlobalConstant.DELETE_SUCCESS) {
          this.deleterowstatus = true;
          const tosterObj = {
            life: 5000,
            key: 'tc',
            severity: 'success',
            summary: `${refId}`,
            detail: `${this.translate.instant('singleDiscardToasterMessage')}`
          };
          this.messageService.add(tosterObj);
          this.commonService.refreshListBehaviourSubject.next(true);
          setTimeout(() => {
            this.deleterowstatus = false;
          }, FccGlobalConstant.LENGTH_2000);

        }
      });
    }
  }

  onClickUpdate(event, rowData) {
  const option = FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC;
  const operation = FccGlobalConstant.ADD_FEATURES;
  this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
    queryParams: {
      option: option, operation: operation, action: FccGlobalConstant.UPDATE,
      beneGroupId: rowData[FccGlobalConstant.BENEFICIARY_GRP_ID]
    }
  });
  }

  continueDelete(beneGroupId){
    let result: Observable<any>;
    result = this.commonService.delete(beneGroupId);
    result.subscribe(data => {
      if (data.status === FccGlobalConstant.HTTP_RESPONSE_SUCCESS) {
        const tosterObj = {
          life : 5000,
          key: 'tc',
          severity: 'success',
          detail: `${this.translate.instant('singleBeneDeleteToasterMessage')}`
        };
        this.messageService.add(tosterObj);
        this.commonService.isResponse.next(true);
        setTimeout(() => {
        }, FccGlobalConstant.LENGTH_2000);
      }
    });
  }

  onClickAmend(event, rowData, option) {
    const tnxType = FccGlobalConstant.N002_AMEND;
    const optionValue = FccGlobalConstant.EXISTING_OPTION;
    if (option === FccGlobalConstant.GENERAL) {
      this.router.navigate(['productScreen'], { queryParams: { refId: rowData.ref_id,
        productCode: rowData.product_code, subProductCode: rowData.sub_product_code,
        tnxTypeCode: tnxType, mode: optionValue} });
    }
  }

  onClickAmendRelease(event, rowData, option) {
    const tnxType = FccGlobalConstant.N002_AMEND;
    const subTnxType = FccGlobalConstant.N003_AMEND_RELEASE;
    const optionValue = FccGlobalConstant.EXISTING_OPTION;
    if (option === FccGlobalConstant.GENERAL) {
      this.router.navigate(['productScreen'], { queryParams: { refId: rowData.ref_id,
        productCode: rowData.product_code, subProductCode: rowData.sub_product_code,
        tnxTypeCode: tnxType, subTnxTypeCode: subTnxType, mode: optionValue} });
    }
  }

  onClickView(event, rowData) {
    const productCodeValue = rowData.product_code;
    const subProductCodeValue = rowData.sub_product_code;
    const referenceId = rowData.ref_id;
    const transactionId = rowData.tnx_id;
    const tnxTypeCodeValue = rowData.tnx_type_code;
    const tnxStatCode = rowData.tnx_stat_code;
    const subTnxTypeCodeValue = rowData.sub_tnx_type_code;
    const customerReference = rowData['cust_ref_id'];
    this.commonService.getSwiftVersionValue();

    let isAngularProductURL = this.commonService.isAngularProductUrl(productCodeValue, subProductCodeValue);

    if(productCodeValue === FccGlobalConstant.PRODUCT_SE
      && this.commonService.isnonBlankString(subProductCodeValue)
      && subProductCodeValue === 'OTHER') {
        isAngularProductURL = false;
    }

    if (isAngularProductURL &&
    (!(this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
      (productCodeValue === FccGlobalConstant.PRODUCT_BG || productCodeValue === FccGlobalConstant.PRODUCT_BR)))) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['view'], { queryParams: { tnxid: transactionId,  referenceid: referenceId,
          productCode: productCodeValue, subProductCode: subProductCodeValue, tnxTypeCode: tnxTypeCodeValue,
          eventTnxStatCode: tnxStatCode, mode: FccGlobalConstant.VIEW_MODE,
          subTnxTypeCode: subTnxTypeCodeValue, operation: FccGlobalConstant.PREVIEW,custRef:customerReference} })
      );
      const popup = window.open('#' + url, '_blank', 'top=100,left=200,height=400,width=900,toolbar=no,resizable=no');
      const productId = this.commonService.displayLabelByCode(rowData.product_code, rowData.sub_product_code);
      const mainTitle = `${this.translate.instant('MAIN_TITLE')}`;
      popup.onload = () => {
        popup.document.title = mainTitle + ' - ' + productId;
      };
    } else {
      const prodCodeParam = [];
      const refIdParam = [];
      const tnxIdParam = [];
      const screenParam = 'ReportingPopup';
      const viewUrl = [];
      const tnxTypeCodeParam = [];
      const subTnxTypeCodeParam = [];
      const tnxStatusParam = [];
      if (this.commonService.isnonEMptyString(productCodeValue)) {
        prodCodeParam.push('&productcode=', productCodeValue);
      }
      if (this.commonService.isnonEMptyString(referenceId)) {
        refIdParam.push('&referenceid=', referenceId);
      }

      if (this.commonService.isnonEMptyString(transactionId)) {
        tnxIdParam.push('&tnxid=', transactionId);
      }

      if (this.commonService.isnonEMptyString(tnxTypeCodeValue)) {
        tnxTypeCodeParam.push('&tnxtype=', tnxTypeCodeValue);
      }

      if (this.commonService.isnonEMptyString(subTnxTypeCodeValue)) {
        subTnxTypeCodeParam.push('&subtnxtype=', subTnxTypeCodeValue);
      }
      if (this.commonService.isnonEMptyString(tnxStatCode)) {
        tnxStatusParam.push('&tnxstatus=', tnxStatCode);
      }
      viewUrl.push('/screen/', screenParam);
      viewUrl.push('?option=', 'FULL');
      viewUrl.push(refIdParam.join(''), tnxIdParam.join(''), prodCodeParam.join(''),
        tnxTypeCodeParam.join(''), subTnxTypeCodeParam.join(''), tnxStatusParam.join(''));
      let viewDetailsUrl = '';
      if (this.commonService.isnonEMptyString(this.commonService.getContextPath())) {
          viewDetailsUrl = this.commonService.getContextPath();
      }
      viewDetailsUrl += this.fccGlobalConstantService.servletName + viewUrl.join('');
      this.router.navigate([]).then(result => {
        window.open
        (viewDetailsUrl, '', 'width=800,height=600,resizable=yes,scrollbars=yes');
      });
    }
  }

  setFocusOnThreeDots(index) {
    Array.from(document.getElementsByClassName('iconwrapper')).forEach((element, arrayIndex) => {
      if (index === arrayIndex) {
        document.getElementsByClassName('iconwrapper')[index].classList.add('overdraw');
      } else if (document.getElementsByClassName('iconwrapper')[arrayIndex].classList.contains('overdraw')) {
        document.getElementsByClassName('iconwrapper')[arrayIndex].classList.remove('overdraw');
      }
    });
  }


  showActionPopup(actionName, data): boolean {
    return ((actionName === FccGlobalConstant.VIEW_ADDITIONAL_INFO) || (actionName === FccGlobalConstant.VIEW_BENEFICIARY)) &&
      !(actionName === FccGlobalConstant.multiTransactionEventType.REJECT) && !(actionName === FccGlobalConstant.multiTransactionEventType.APPROVE);
  }


  onClickSend(rowData) {
    if(rowData.isBatchPayment.toLowerCase() == 'true'){
      this.commonService.sendbatchPaymentAction(rowData.paymentReferenceNumber, FccGlobalConstant.SEND, '').subscribe((res) => {
        const tosterObj = {
          life: 5000,
          key: 'tc',
          severity: 'success',
          detail: `${this.translate.instant('sendToBankBatchToasterMessage', { refNo: rowData.paymentReferenceNumber })}`
        };
        this.messageService.add(tosterObj);
        this.refreshList.emit();
      }, (err) => {
        const tosterObj = {
          life: 5000,
          key: 'tc',
          severity: 'error',
          summary: `${this.translate.instant('error')}`,
          detail: `${this.translate.instant('failedApiErrorMsg')}`
        };
        this.messageService.add(tosterObj);
      })
    }
    else{
    this.commonService.performPaymentsApproveRejectFCM(rowData.paymentReferenceNumber, FccGlobalConstant.SEND, '').subscribe((res) => {
      const tosterObj = {
        life: 5000,
        key: 'tc',
        severity: 'success',
        detail: `${this.translate.instant('sendToBankToasterMessage', { refNo: rowData.paymentReferenceNumber })}`
      };
      this.messageService.add(tosterObj);
      this.refreshList.emit();
    }, (err) => {
      const tosterObj = {
        life: 5000,
        key: 'tc',
        severity: 'error',
        detail: `${this.translate.instant('failedApiErrorMsg')}`
      };
      this.messageService.add(tosterObj);
    })
  }
  }

  approvePayment(rowData, actionName){
    this.commonService.paymentCheckerApproveFCM(rowData.paymentReferenceNumber,
      FccGlobalConstant.multiTransactionEventType.APPROVE, '').subscribe(_res=>
      {
      this.commonService.showToasterMessage({
        life : 5000,
        key: 'tc',
        severity: 'success',
        detail: this.translate.instant('PAYMENTS_BATCH_APPROVAL_SUCCESS_MSG')
      });
      this.refreshList.emit();
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _err=>{
      let errorMessage = '';
      if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
        errorMessage = 'failedApiErrorMsg';
      } else {
        errorMessage = 'PAYMENTS_BATCH_APPROVAL_FAILURE_MSG';
      }
      this.commonService.showToasterMessage({
        life : 5000,
        key: 'tc',
        severity: 'error',
        summary:this.translate.instant('error'),
        detail:this.translate.instant(errorMessage)
      });
    });
  }


  beneReminderPopup(rowData) {
    let headerField;
    let message;
    headerField = `${this.translate.instant('sendRemainderBeneHeader')}`;
    message = `${this.translate.instant('sendReminderBeneBody')}`;
    const direction = 'direction';
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: message ,
        showNoButton: false,
        showYesButton: false,
        showCancelButtonTertiary: true,
        showSendReminderButtonPrimary: true
      }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.sendBeneReminder(rowData);
      }
    });
  }

  sendBeneReminder(rowData) {

    let associationId = rowData['bankAccount@associationId'];
      this.commonService.performBeneficiarySendReminderFCM(associationId).subscribe( data => {
        this.commonService.showToasterMessage({
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary: `${associationId}`,
          detail: this.translate.instant(FccGlobalConstant.BENE_REMINDER_SUCESS)


        });
        }, _err => {
          let errMsg = '';
          if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
            errMsg = 'failedApiErrorMsg';
          } else {
            try {
              errMsg = _err.error.errors[0].code;
            } catch (err) {
              errMsg = _err.error.errors[0].code;
            }
          }
          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'error',
            summary: 'Error',
            detail: this.translate.instant(errMsg)
          });
        });
        setTimeout(() => {
          this.deleterowstatus = false;
        }, FccGlobalConstant.LENGTH_2000);
  }

  paymentSendReminder(rowData) {
    const headerField = `${this.translate.instant('SEND_REMINDER')}`;
    const message =  `${this.translate.instant('sendReminderPaymentTransaction')}`;
    const dir = localStorage.getItem('langDir');
    const dialogRef = this.dialogService.open(ConfirmationDialogComponent, {
      header: headerField,
      width: '35em',
      styleClass: 'fileUploadClass',
      style: { direction: dir },
      data: { locaKey: message,
        showNoButton: false,
        showYesButton: false,
        showCancelButtonTertiary: true,
        showSendReminderButtonPrimary: true
       }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.continueSendReminderForPayments(rowData.paymentReferenceNumber, rowData.batchStatus);
      }
    });

  }

  continueSendReminderForPayments(paymentReferenceNumber, batchStatus) {
    let alertCode = '';
    if(batchStatus === FccGlobalConstant.PENDINGAPPROVAL){
      alertCode = 'CW_TXN_PENDING_AUTH';
    } else if(batchStatus === FccGlobalConstant.PENDING_VERIFICATION){
      alertCode = 'CW_TXN_PENDING_VERIF';
    }
    this.commonService.paymentSendReminder(paymentReferenceNumber, alertCode)
      .subscribe(_res => {
        this.commonService.showToasterMessage({
          life: 5000,
          key: 'tc',
          severity: 'success',
          summary: `${paymentReferenceNumber}`,
          detail: `${this.translate.instant('sendReminderSuccessMessage')}`
        });
        this.refreshList.emit();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }, _err => {
        let errMsg = '';
        if (_err.status !== FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
          errMsg = 'failedApiErrorMsg';
        } else {
          try {
            errMsg = _err.error.errors[0].code;
          } catch (err) {
            errMsg = _err.error.errors[0].code;
          }
        }
        this.commonService.showToasterMessage({
          life: 5000,
          key: 'tc',
          severity: 'error',
          summary: 'Error',
          detail: this.translate.instant(errMsg)
        });
      });
      setTimeout(() => {
        this.deleterowstatus = false;
      }, FccGlobalConstant.LENGTH_2000);
  }

  paymentDiscard(rowData, action) {
    this.deleterowObject = [];
    this.deleterowObject.push(event, rowData);
    let headerField;
    let message;
    if(rowData.isBatchPayment.toLowerCase() == 'true'){
      headerField = `${this.translate.instant('discardBatch')}`;
    }else{
      headerField = `${this.translate.instant('discardTransaction')}`;
    }
    message = `${this.translate.instant('discardPaymentTransaction')}`;
    const direction = 'direction';
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
        showYesButtonPrimary: true
       }
    });
    dialogRef.onClose.subscribe((result: any) => {
      if (result.toLowerCase() === 'yes') {
        this.continueDeleteForPayments(rowData.paymentReferenceNumber, action, rowData.isBatchPayment);
      }
    });

  }

  continueDeleteForPayments(paymentReferenceNumber, action, isBatchPayment) {
    let errMsg: string;
    const comment = '';
    if(isBatchPayment.toLowerCase() == 'true'){
      this.fcmBatchPaymentAction(paymentReferenceNumber, action, comment);
    }else{
      this.commonService.paymentDiscard(paymentReferenceNumber, action, comment)
        .subscribe(_res => {

          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'success',
            summary: `${paymentReferenceNumber}`,
            detail: `${this.translate.instant('singleDiscardToasterMessage')}`
          });
          this.refreshList.emit();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }, _err => {
          let errMsg = '';
          try {
            errMsg = _err.error.detail;
          } catch (err) {
            errMsg = _err.error.detail;
          }
          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'error',
            summary: 'Error',
            detail: this.translate.instant(errMsg)
          });
        });
    }
    setTimeout(() => {
      this.deleterowstatus = false;
    }, FccGlobalConstant.LENGTH_2000);

  }

  fcmBatchPaymentAction(paymentReferenceNumber, action, comment){
    this.commonService.batchPaymentAction(paymentReferenceNumber, action, comment)
        .subscribe(_res => {

          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'success',
            summary: `${paymentReferenceNumber}`,
            detail: `${this.translate.instant('batchDiscardToasterMessage')}`
          });
          this.refreshList.emit();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }, _err => {
          let errMsg = '';
          errMsg = _err.error?.detail?_err.error.detail:'failedApiErrorMsg';
          this.commonService.showToasterMessage({
            life: 5000,
            key: 'tc',
            severity: 'error',
            summary: 'Error',
            detail: this.translate.instant(errMsg)
          });
        });
  }

  beneDiscard(rowData) {
    let headerField;
    let message;
    headerField = `${this.translate.instant('deleteBeneficiary')}`;
    message = `${this.translate.instant('discardbeneTransaction')}`;
    const direction = 'direction';
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
        this.continueDeleteForBene(rowData);
      }
    });
  }

  continueDeleteForBene(rowData) {
    this.commonService.beneDiscard(rowData['bankAccount@associationId']).subscribe(_res => {

      this.commonService.showToasterMessage({
        life: 5000,
        key: 'tc',
        severity: 'success',
        summary: rowData['bankAccount@associationId'],
        detail: `${this.translate.instant('singleBeneDiscardToasterMessage')}`
      });
      this.refreshList.emit();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    },(response) =>{
      this.showErrorToaster(response?.error?.errors[0].code, rowData);
    });
  }

  showErrorToaster(error, rowdata){
    const tosterObj = {
      life : 5000,
      key: 'tc',
      severity: 'error',
      summary: 'Error',
      detail: error ? rowdata[FccGlobalConstant.associationIdKey] + ` ${this.translate.instant(error)}` : `${this.translate.instant('failedApiErrorMsg')}`
    };
    this.messageService.add(tosterObj);
    setTimeout(() => {
      //eslint : no-empty-function
    }, FccGlobalConstant.LENGTH_2000);
  }



  onClickIncrease($event, rowData) {
    const tnxType = FccGlobalConstant.N002_AMEND;
    const mode = FccGlobalConstant.EXISTING_OPTION;
    const subTnxType = FccGlobalConstant.N003_INCREASE;
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
      queryParams:
      {
        productCode: rowData.product_code, subProductCode: rowData.sub_product_code, refId: rowData.ref_id,
        tnxTypeCode: tnxType, mode, subTnxTypeCode: subTnxType
      }
    });
  }

  onClickLoanPayment($event, rowData) {
    const tnxType = FccGlobalConstant.N002_INQUIRE;
    const subTnxTypeCode = FccGlobalConstant.N003_PAYMENT;
    const mode = FccGlobalConstant.EXISTING_OPTION;
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
      queryParams: {
        productCode: rowData.product_code, subProductCode: rowData.sub_product_code, refId: rowData.ref_id,
        tnxTypeCode: tnxType, mode, subTnxTypeCode
      }
    });
  }


  onClickDrawdown($event, rowData) {
    const tnxType = FccGlobalConstant.N002_NEW;
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
      queryParams: {
        productCode: FccGlobalConstant.PRODUCT_LN,
        tnxTypeCode: tnxType, mode: FccGlobalConstant.INITIATE, facilityid: rowData.id,
        swinglineAllowed: rowData.swinglineAllowed, drawdownAllowed: rowData.drawdownAllowed
      }
    });
  }

  onClickSetEntity($event, rowData) {
    this.commonService.isSetEntityClicked(rowData);
  }

  onClickSetReference($event, rowData) {
    this.commonService.isSetReferenceClicked(rowData);
  }


  onClickFacilityDetail($event, rowData) {
    const optionValue = FccGlobalConstant.FACILITYOVERVIEW_OPTION;
    this.router.navigate(['facilityOverView'], {
      queryParams: {
        productCode: FccGlobalConstant.PRODUCT_LN,
        facilityid: rowData.id, facilityName: rowData.name, dealName: rowData.dealName,
        status: rowData.status, option: optionValue, swinglineAllowed: rowData.swinglineAllowed,
        drawdownAllowed: rowData.drawdownAllowed
      }
    });
  }

  onClickRepay(event, rowData) {
    const tnxType = FccGlobalConstant.N002_INQUIRE;
    const optionValue = FccGlobalConstant.EXISTING_OPTION;
    const subTnxTypeCodeValue = FccGlobalConstant.REPAY_OPTION;
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
      queryParams: {
        refId: rowData.ref_id,
        productCode: rowData.product_code, subProductCode: rowData.sub_product_code,
        tnxTypeCode: tnxType, option: optionValue, subTnxTypeCode: subTnxTypeCodeValue
      }
    });
  }

  onClickCopy(event, rowData) {
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
      queryParams: {
        productCode: rowData.product_code,
        subProductCode: rowData.sub_product_code,
        tnxTypeCode: FccGlobalConstant.N002_NEW,
        refId: rowData.ref_id,
        option: 'EXISTING'
      },
    });
  }

  getWaybillDetails(url: string, trackingNumber: string, trackingParam:any, trackingHeader : any, trackingParamName: any)
  {

    url = this.fccGlobalConstantService.getCourierTracking;
    if(url)
    {
      return this.http.get<any>(url, { headers : trackingHeader  , params : trackingParam});
    }
  }

  getCourierTrackerDetails(trackingNumber: string, courierPartnerAbbvName: string)
  {
    //eslint-disable-next-line no-console
    console.log('Inside getCourierTrackerDetails()');
    let url = this.fccGlobalConstantService.getCourierTracking;
    let queryParams = new HttpParams();
    queryParams = queryParams.append('courierPartnerAbbvName', courierPartnerAbbvName);
    queryParams = queryParams.append('courierTrackingNumber', trackingNumber);
    return this.http.get<any>(url, {params:queryParams});
  }

  onClickEdit(event, rowData) {
    const productCode = rowData.product_code;
    const subProductCode = rowData.sub_product_code;
    const referenceId = rowData.ref_id;
    const transactionId = rowData.tnx_id;
    const tnxTypeCode = rowData.tnx_type_code;
    // const tnxStatCode = rowData.tnx_stat_code;
    const subTnxTypeCode = rowData.sub_tnx_type_code;
    const mode = 'DRAFT';
    this.commonService.getSwiftVersionValue();
    if (this.commonService.isAngularProductUrl(productCode, subProductCode) &&
      (!(this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
        (productCode === FccGlobalConstant.PRODUCT_BG || productCode === FccGlobalConstant.PRODUCT_BR)))) {
      if (rowData.action_req_code) {
        this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
          queryParams: {
            productCode: productCode,
            subProductCode: subProductCode,
            tnxTypeCode: tnxTypeCode,
            refId: referenceId,
            tnxId: transactionId,
            mode: mode,
            subTnxTypeCode: subTnxTypeCode,
            actionReqCode: rowData.action_req_code
          },
        });
      } else {
        this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
          queryParams: {
            productCode: productCode,
            subProductCode: subProductCode,
            tnxTypeCode: (rowData.template_id) ? FccGlobalConstant.N002_NEW : tnxTypeCode,
            refId: referenceId,
            tnxId: transactionId,
            mode: mode,
            subTnxTypeCode: subTnxTypeCode,
            templateId: rowData.template_id,
            option: (rowData.template_id) ? FccGlobalConstant.TEMPLATE : undefined
          },
        });
      }
    } else {
      const screenName = ScreenMapping.screenmappings[productCode];
      const tnxTypeCode = rowData.tnx_type_code;
      const subTnxTypeCode = rowData.sub_tnx_type_code === undefined || rowData.sub_tnx_type_code === ''
          ? 'null' : rowData.sub_tnx_type_code;
      const referenceId = rowData.ref_id;
      const tnxId = rowData.tnx_id;
      let url = '';
      this.contextPath = this.commonService.getContextPath();
      if (this.commonService.isnonEMptyString(this.contextPath)) {
        url = this.contextPath;
      }
      url = `${url}${this.fccGlobalConstantService.servletName}`;
      url = `${url}/screen/${screenName}?mode=${mode}&tnxtype=${tnxTypeCode}&subtnxtype=${subTnxTypeCode}`;

      if (productCode === FccGlobalConstant.PRODUCT_FT && (subProductCode === FccGlobalConstant.SUB_PRODUCT_CODE_BILLP
        || subProductCode === FccGlobalConstant.SUB_PRODUCT_CODE_BILLS)) {
        url = `${url}&referenceid=${referenceId}&tnxid=${tnxId}&option=${subProductCode}`;
      } else {
        url = `${url}&referenceid=${referenceId}&tnxid=${tnxId}&option=null`;
      }
      this.router.navigate([]).then(result => {
        window.open(url, '_self');
      });
    }
  }

  onClickLendingEdit(event, rowData) {
    if (rowData.product_code === FccGlobalConstant.PRODUCT_BK) {
      let optionValue;
      switch (rowData.sub_product_code) {
        case FccGlobalConstant.SUB_PRODUCT_LNRPN:
          optionValue = FccGlobalConstant.BK_LOAN_REPRICING;
          break;
        case FccGlobalConstant.SUB_PRODUCT_BLFP:
          optionValue = FccGlobalConstant.BK_LOAN_FEE_PAYMENT;
          break;
        default:
          optionValue = '';
      }
      this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
        queryParams: {
          productCode: rowData.product_code,
          subProductCode: rowData.sub_product_code,
          refId: rowData.ref_id,
          tnxId: rowData.tnx_id,
          mode: 'DRAFT',
          option: optionValue,
          tnxTypeCode: rowData.tnx_type_code
        },
      });
    } else if (rowData.transaction_type === 'Increase') {
      this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
        queryParams: {
          productCode: rowData.product_code,
          subProductCode: rowData.sub_product_code,
          tnxTypeCode: rowData.tnx_type_code,
          refId: rowData.ref_id,
          tnxId: rowData.tnx_id,
          mode: 'DRAFT',
          subTnxTypeCode: FccGlobalConstant.N003_INCREASE,
          facilityid: rowData.bo_facility_id,
          borrowerIds: rowData.borrower_reference
        },
      });
    } else {
      this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
        queryParams: {
          productCode: rowData.product_code,
          subProductCode: rowData.sub_product_code,
          tnxTypeCode: rowData.tnx_type_code,
          refId: rowData.ref_id,
          tnxId: rowData.tnx_id,
          mode: 'DRAFT',
          subTnxTypeCode: rowData.sub_tnx_type_code,
          facilityid: rowData.bo_facility_id,
          borrowerIds: rowData.borrower_reference
        },
      });
    }
  }

  onClickApprove(event: any, rowData: any, option: any, widgetCode?: any) {
    if (option === FccGlobalConstant.GENERAL || option === FccGlobalConstant.GENERIC_FILE_UPLOAD ||
       this.commonService.isnonEMptyString(widgetCode) ||
    option === FccGlobalConstant.PENDING_APPROVAL || option === FccGlobalConstant.TRANSACTION_IN_PROGRESS ||
    option === FccGlobalConstant.TRANSACTION_SEARCH || option === FccGlobalConstant.TRANSACTION_NOTIFICATION) {
      this.router.navigate(['reviewScreen'], { queryParams: { tnxid: rowData.tnx_id,  referenceid: rowData.ref_id,
      action: FccGlobalConstant.APPROVE, mode: FccGlobalConstant.VIEW_MODE, subTnxStatCode: rowData.sub_tnx_stat_code,
      subTnxTypeCode: rowData.sub_tnx_type_code,
      tnxTypeCode: rowData.tnx_type_code,
      productCode: rowData.ref_id.substring(FccGlobalConstant.LENGTH_0, FccGlobalConstant.LENGTH_2),
      subProductCode: rowData.sub_product_code, operation: FccGlobalConstant.LIST_INQUIRY} });
    }
  }

  onClickReturn(event, rowData) {
    this.router.navigate(['reviewScreen'], { queryParams: { tnxid: rowData.tnx_id,  referenceid: rowData.ref_id,
      action: FccGlobalConstant.RETURN, mode: FccGlobalConstant.VIEW_MODE, tnxTypeCode: rowData.tnx_type_code,
      productCode: rowData.ref_id.substring(FccGlobalConstant.LENGTH_0, FccGlobalConstant.LENGTH_2),
      subProductCode: rowData.sub_product_code, operation: FccGlobalConstant.LIST_INQUIRY} });
  }

  onClickDetail(event, rowData) {
    const productCode = rowData.product_code;
    const subProductCode = rowData.sub_product_code;
    const referenceId = rowData.ref_id;
    const transactionId = rowData.tnx_id;
    const subTnxTypeCodeValue = rowData.sub_tnx_type_code;
    const subTnxStatCodeValue = rowData.sub_tnx_stat_code;
    const customerReference = rowData['cust_ref_id'];
    this.commonService.getSwiftVersionValue();

    let isAngularProductURL = this.commonService.isAngularProductUrl(productCode, subProductCode);

    if(productCode === FccGlobalConstant.PRODUCT_SE
      && this.commonService.isnonBlankString(subProductCode)
      && subProductCode === 'OTHER') {
        isAngularProductURL = false;
    }

    if (isAngularProductURL &&
      (!(this.commonService.swiftVersion < FccGlobalConstant.SWIFT_2021 &&
        (productCode === FccGlobalConstant.PRODUCT_BG || productCode === FccGlobalConstant.PRODUCT_BR)))) {
      this.router.navigate(['reviewScreen'], { queryParams: { tnxid: transactionId,  referenceid: referenceId,
        productCode: referenceId.substring(FccGlobalConstant.LENGTH_0, FccGlobalConstant.LENGTH_2),
        subProductCode: rowData.sub_product_code, mode: FccGlobalConstant.VIEW_MODE, operation: 'LIST_INQUIRY',
        subTnxTypeCode: subTnxTypeCodeValue, subTnxStatCode: subTnxStatCodeValue, tnxTypeCode: rowData.tnx_type_code,custRef:customerReference} });
    } else {
      const consolidateViewUrlInitial = 'screen/!?productcode=';
      const consolidateViewUrlMiddle = '&operation=LIST_INQUIRY&referenceid=';
      const consolidateViewUrlEnd = '&option=HISTORY';
      const consolidateViewUrlSubProdCode = '&subproductcode=';
      const screenName = ScreenMapping.screenmappings[productCode];
      let consolidateViewUrl = '';
      this.contextPath = this.commonService.getContextPath();
      if (this.commonService.isnonEMptyString(this.contextPath)) {
          consolidateViewUrl = this.contextPath;
      }
      consolidateViewUrl += this.fccGlobalConstantService.servletName + '/'
      .concat(consolidateViewUrlInitial.replace('!', screenName))
      .concat(productCode).concat(consolidateViewUrlMiddle).concat(referenceId).concat(consolidateViewUrlEnd);
      if (this.commonService.isnonEMptyString(subProductCode)) {
        consolidateViewUrl += consolidateViewUrlSubProdCode.concat(subProductCode);
      }
      this.router.navigate([]).then(result => { window.open(consolidateViewUrl, '_self'); });
    }
  }

  onClickMessage(event, rowData, option) {
    if (option === FccGlobalConstant.GENERAL) {
      this.router.navigate(['importLetterOfCredit'], { queryParams: { refId: rowData.ref_id,
        productCode: rowData.productCode, subProductCode: rowData.subProductCode,
        tnxTypeCode: rowData.tnxTypeCode, option: 'MESSAGE' } });
    }
  }

  checkIsRequestSettlementAllowed(rowData): boolean {
    return true;
  }

  onClickAcceptCN(event, rowData) {
    const productCode = rowData.product_code;
    const referenceId = rowData.ref_id;
    const tnxTypeCode = FccGlobalConstant.N002_ACCEPT;
    const option = FccGlobalConstant.OPTION_ACCEPT;
    const mode = FccGlobalConstant.MODE_ACCEPT;
    const screenName = ScreenMapping.screenmappings[productCode];
    const tnxId = rowData.tnx_id;
    let url = '';
    this.contextPath = this.commonService.getContextPath();
    if (this.commonService.isnonEMptyString(this.contextPath)) {
      url = this.contextPath;
    }
    url = `${url}${this.fccGlobalConstantService.servletName}`;
    url = `${url}/screen/${screenName}?mode=${mode}&tnxtype=${tnxTypeCode}&productcode=${productCode}`;
    url = `${url}&referenceid=${referenceId}&tnxid=${tnxId}&option=${option}`;
    this.router.navigate([]).then(result => {
      window.open(url, '_self');
    });

  }

  onClickAcceptPOA(event, rowData) {
    const productCode = rowData.product_code;
    const option = FccGlobalConstant.OPTION_PENDING;
    const referenceId = rowData.ref_id;
    const tnxTypeCode = FccGlobalConstant.N002_RESUBMIT;
    const screenName = ScreenMapping.screenmappings[productCode];
    const tnxId = rowData.tnx_id;
    let url = '';
    this.contextPath = this.commonService.getContextPath();
    if (this.commonService.isnonEMptyString(this.contextPath)) {
      url = this.contextPath;
    }
    url = `${url}${this.fccGlobalConstantService.servletName}`;
    url = `${url}/screen/${screenName}?tnxtype=${tnxTypeCode}`;
    url = `${url}&referenceid=${referenceId}&tnxid=${tnxId}&option=${option}`;

    this.router.navigate([]).then(result => {
      window.open(url, '_self');
    });

  }

  onClickAcceptIP(event, rowData) {
    const option = FccGlobalConstant.EXISTING_OPTION;
    const referenceId = rowData.ref_id;
    const productCode = rowData.product_code;
    const tnxTypeCode = FccGlobalConstant.N002_INQUIRE;
    const mode = FccGlobalConstant.MODE_ACCEPT;
    const screenName = ScreenMapping.screenmappings[productCode];
    const tnxId = rowData.tnx_id;
    let url = '';
    this.contextPath = this.commonService.getContextPath();
    if (this.commonService.isnonEMptyString(this.contextPath)) {
      url = this.contextPath;
    }
    url = `${url}${this.fccGlobalConstantService.servletName}`;
    url = `${url}/screen/${screenName}?mode=${mode}&tnxtype=${tnxTypeCode}`;
    url = `${url}&referenceid=${referenceId}&tnxid=${tnxId}&option=${option}`;
    this.router.navigate([]).then(result => {
      window.open(url, '_self');
    });
  }

  onClickViewMultiSubmit(event, valObj) {
    const result = this.reauthService.multiSubmitRequestPayload.multiTransactionSubmissionPayload
    .filter(payloadObj => (payloadObj.id === valObj.refId && payloadObj.eventId === valObj.eventId));
    if (this.commonService.isNonEmptyValue(result) && result.length > 0) {
    this.transactionDetailService.fetchTransactionDetails(result[0].eventId, result[0].productCode, false,
      result[0].subProductCode).subscribe(response => {
        if (this.commonService.isNonEmptyValue(response) && this.commonService.isNonEmptyValue(response.body)) {
          this.onClickView(event, response.body);
        }
      });
    }
  }

}
