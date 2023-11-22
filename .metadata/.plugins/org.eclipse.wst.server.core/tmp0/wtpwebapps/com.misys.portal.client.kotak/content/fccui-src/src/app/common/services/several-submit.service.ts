import { Injectable } from '@angular/core';

import { CorporateCommonService } from '../../corporate/common/services/common.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { SubmissionRequest } from '../model/submissionRequest';
import { CommonService } from './common.service';
import { ReauthService } from './reauth.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng';


@Injectable({
  providedIn: 'root'
})
export class SeveralSubmitService {
  constructor(
    protected reauthService: ReauthService,
    protected corporateCommonService: CorporateCommonService,
    protected commonService: CommonService,
    protected translateService: TranslateService,
    protected messageService: MessageService,

  ) {}

  private readonly ID = 'id';
  private readonly EVENT_ID = 'eventId';
  private readonly PRODUCT_CODE = 'productCode';
  private readonly SUBPRODUCT_CODE = 'subProductCode';
  private readonly TNX_AMOUNT = 'tnxAmount';
  private readonly version = 'version';
  private readonly MULTI_TRANSACTION_SUBMISSION_PAYLOAD = 'multiTransactionSubmissionPayload';
  private readonly COMMENTS = 'comments';
  private readonly REJECT_COMMENTS = 'rejectComments';




  /**
   * performs several submit action
   *
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  performSeveralSubmit(subRequest: SubmissionRequest, submitAction: string, context?) {
    const reauthData: any = {
      action: FccGlobalConstant.SEVERAL_SUBMIT,
      subAction: submitAction,
      request: this.getRequestObject(subRequest, submitAction)
    };
    this.reauthService.reauthenticate(reauthData, FccGlobalConstant.reAuthComponentKey);
  }

 async performSeveralDelete(subRequest: SubmissionRequest, submitAction: string)
  {
    const requestData: any = this.getRequestObject(subRequest, submitAction);
    await this.corporateCommonService.deleteMultipleTransaction(requestData).toPromise().then(
      () => {
        const tosterObj = {
          life : 5000,
          key: 'tc',
          severity: 'success',
          detail: `${this.translateService.instant('multiDeleteToasterMessage')}`
        };
        this.messageService.add(tosterObj);
    }
    );
  }

  async performSeveralRejectedMaintenance(subRequest: SubmissionRequest, submitAction: string, successMsg: string)
  {
    const requestData: any = this.getRequestObject(subRequest, submitAction);
    const msg = successMsg;
    await this.corporateCommonService.maintenanceMultipleRejectedTransaction(requestData).toPromise().then(
      () => {
        const tosterObj = {
          life : 5000,
          key: 'tc',
          severity: 'success',
          detail: `${this.translateService.instant(msg)}`
        };
        this.messageService.add(tosterObj);
    }
    );
  }

  async performSeveralCancel(subRequest: SubmissionRequest, submitAction: string)
  {
    const requestData: any = this.getRequestObject(subRequest, submitAction);
    await this.corporateCommonService.cancelMultipleTransaction(requestData).toPromise().then(
      () => {
        const tosterObj = {
          life : 5000,
          key: 'tc',
          severity: 'success',
          detail: `${this.translateService.instant('multiCancelToasterMessage')}`
        };
        this.messageService.add(tosterObj);
    }
    );
  }

  getRequestObject(subRequest, action) {
    const requestObj = {};
    const items = [];
    Object.keys(subRequest.listKeys).forEach(key => {
      const obj = {};
      const item = subRequest.listKeys[key].toString().split('_');
      obj[this.ID] = item[FccGlobalConstant.LENGTH_0];
      obj[this.EVENT_ID] = item[FccGlobalConstant.LENGTH_1];
      obj[this.PRODUCT_CODE] = item[FccGlobalConstant.LENGTH_2];
      obj[this.SUBPRODUCT_CODE] = item[FccGlobalConstant.LENGTH_3];
      obj[this.TNX_AMOUNT] = item[FccGlobalConstant.LENGTH_6];
      if ((action === FccGlobalConstant.APPROVE) || (action === FccGlobalConstant.RETURN))
      {
        obj[this.version] = item[FccGlobalConstant.LENGTH_5];
      }
      items.push(obj);
    });
    requestObj[this.MULTI_TRANSACTION_SUBMISSION_PAYLOAD] = items;
    if (action === FccGlobalConstant.REJECT || action === FccGlobalConstant.RETURN) {
      requestObj[this.COMMENTS] = {};
      requestObj[this.COMMENTS][this.REJECT_COMMENTS] = subRequest.comments;
    }
    return requestObj;
  }

  getMultiSubmitResponse() {
    return this.commonService.responseMap;
  }
}
