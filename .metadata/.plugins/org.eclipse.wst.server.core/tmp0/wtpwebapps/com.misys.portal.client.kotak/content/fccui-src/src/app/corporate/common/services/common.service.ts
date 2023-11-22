

import { FccGlobalConstantService } from './../../../common/core/fcc-global-constant.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImportLetterOfCredit } from '../../trade/lc/initiation/model/models';
import { FccGlobalConstant } from '../../../common/core/fcc-global-constants';
import { SubmissionRequest } from '../../../common/model/submissionRequest';

import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../common/services/common.service';
import { FccConstants } from '../../../common/core/fcc-constants';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class CorporateCommonService {
  contentType = 'Content-Type';
  contextPath = window[FccGlobalConstant.CONTEXT_PATH];
  protected basePath = this .contextPath + this.fccGlobalConstantService.restServletName + '/';
  mode: string;
  eTagVersion: string;
  constructor(
    protected commonService: CommonService,
    protected http: HttpClient,
    public fccGlobalConstantService: FccGlobalConstantService, protected route: ActivatedRoute
  ) {this.commonService.etagVersionChange.subscribe(etag => {this.eTagVersion = etag;});}

getCacheEnabledHeaders() {
  return new HttpHeaders({ 'cache-request':  'true', 'Content-Type': FccGlobalConstant.APP_JSON });
}

getFormValues(limit: number, url: string): Observable<any> {
  const headers = this.getCacheEnabledHeaders();
  const reqURl = `${url}?limit=${limit}`;
  return this.http.get<any>(reqURl, { headers, observe: 'response' });
}

getCounterparties(limit: number, url: string): Observable<any> {
  const headers = new HttpHeaders().set('content-type', 'application/json');
  //const headers = this.getCacheEnabledHeaders();
  const reqURl = `${url}?limit=${limit}`;
  return this.http.get<any>(reqURl, { headers, observe: 'response' });
}

getBeneficiaries(limit: number, subProductCode: any): Observable<any> {
  const headers = new HttpHeaders().set('content-type', 'application/json');
  //const headers = this.getCacheEnabledHeaders();
  const url = this.fccGlobalConstantService.getBeneficiaries;
  const reqURl = `${url}?limit=${limit}&subProductCode=${subProductCode}`;
  return this.http.get<any>(reqURl, { headers, observe: 'response' });
}

retrieveBeneficiaries(limit: number, subProductCode: any): Observable<any> {
  const headers = this.getCacheEnabledHeaders();
  const url = this.fccGlobalConstantService.getBeneficiaries;
  const reqURl = `${url}?limit=${limit}&subProductCode=${subProductCode}`;
  return this.http.get<any>(reqURl, { headers, observe: 'response' });
}

getStaticAccounts(limit: number, productCode: any): Observable<any> {
  const headers = this.getCacheEnabledHeaders();
  const url = this.fccGlobalConstantService.staticAccounts;
  const reqURl = `${url}?limit=${limit}&productCode=${productCode}`;
  return this.http.get<any>(reqURl, { headers, observe: 'response' });
}

getValues(url: string): Observable<any> {
  const headers = this.getCacheEnabledHeaders().set('REQUEST-FROM', 'INTERNAL');
  const reqURl = `${url}`;
  return this.http.get<any>(reqURl, { headers, observe: 'response' });
}

  createImportLetterofCredit(lcRequest: ImportLetterOfCredit) {
    const iKey = this.fccGlobalConstantService.generateUIUD();
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj[FccGlobalConstant.idempotencyKey] = iKey;
    const headers = new HttpHeaders(obj);
    const completePath = this .basePath + 'import-letter-of-credit/issuances';
    return this .http.post<any>(completePath, lcRequest, { headers });
  }

  approveImportLetterofCredit(reauthData, eTag?: string) {
    let headers = new HttpHeaders().set('content-type', 'application/json').set('REQUEST-FROM', 'INTERNAL');
    if (eTag)
    {
     headers = headers.set('If-Match', eTag);
    }
    const completePath = this.fccGlobalConstantService.baseUrl + 'transaction/' + reauthData.tnxNumber + '/approve';
    const requestPayload = reauthData.requestPayload;
    return this .http.post<any>(completePath, requestPayload, { headers });
  }

  rejectTransactionProduct(reauthData, eTag?: string) {
    let headers = new HttpHeaders().set('content-type', 'application/json').set('REQUEST-FROM', 'INTERNAL');
    if (eTag)
    {
     headers = headers.set('If-Match', eTag);
    }
    const completePath = this.fccGlobalConstantService.baseUrl + 'transaction/' + reauthData.tnxNumber + '/reject';
    const requestPayload = reauthData.requestPayload;
    return this .http.post<any>(completePath, requestPayload, { headers });
  }

  /**
   * calls multisubmission api for approve or reject of transactions
   * pending for client approval
   */
  public severalTransactionApproval(request: SubmissionRequest): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json').set('REQUEST-FROM', 'INTERNAL');
    const completePath = this.fccGlobalConstantService.putTransactionApprovalUrl();
    const requestPayload = request;
    return this.http.put<any>(completePath, requestPayload, { headers, observe: 'response' });
  }

  public severalTransactionReject(request: SubmissionRequest): Observable<any> {
    const headers = new HttpHeaders().set('content-type', 'application/json').set('REQUEST-FROM', 'INTERNAL');
    const completePath = this.fccGlobalConstantService.putTransactionRejectUrl();
    const requestPayload = request;
    return this.http.put<any>(completePath, requestPayload, { headers, observe: 'response' });
  }

  submitForm(request: any) {
    let iKey = sessionStorage.getItem(FccGlobalConstant.idempotencyKey);
    this.mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const tnxid = request.common ? request.common.tnxid : '';
    if (!this.commonService.isnonEMptyString(tnxid)) {
      if (iKey === null) {
        iKey = this.fccGlobalConstantService.generateUIUD();
        sessionStorage.setItem(FccGlobalConstant.idempotencyKey, iKey);
      }
    } else {
        iKey = null;
    }
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    if (iKey !== null) {
      obj[FccGlobalConstant.idempotencyKey] = iKey;
    }
    if (this.eTagVersion) {
      obj['If-Match'] = this.eTagVersion;
    }
    const headers = new HttpHeaders(obj);
    const completePath = this.fccGlobalConstantService.baseUrl + 'genericsave';
    return this .http.post<any>(completePath, request, { headers });
  }

  getReauthenticationType(request: any) {
    const obj = {};
    const headers = new HttpHeaders(obj);
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const completePath = this.fccGlobalConstantService.baseUrl + 'reauthentication-type';
    return this.http.post<any>(completePath, request, { headers });
  }

  getReauthenticationTypeSetRefSetEtity(request: any, action: any) {
    const obj = {};
    const internal = FccGlobalConstant.INTERNAL_UPPER_CASE;
    const reqAction = (FccGlobalConstant.ACTION).toUpperCase();
    obj[reqAction] = action;
    obj[FccGlobalConstant.REQUEST_FORM] = internal;
    const headers = new HttpHeaders(obj);
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const completePath = `${this.fccGlobalConstantService.baseUrl}reauthentication-type`;
    return this.http.post<any>(completePath, request, { headers });
  }

  getReauthenticationCode(request: any) {
    const obj = {};
    const headers = new HttpHeaders(obj);
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const completePath = this.fccGlobalConstantService.baseUrl + 'generate-reauthentication-code';
    return this.http.post<any>(completePath, request, { headers });
  }

  getMultiTransactionReauthenticationType(request: any) {
    const obj = {};
    const headers = new HttpHeaders(obj);
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const completePath = this.fccGlobalConstantService.baseUrl + 'reauthentication-type/multi-transaction';
    return this.http.post<any>(completePath, request, { headers });
  }

  deleteMultipleTransaction(requestData: any )
  {
   const completePath = this.fccGlobalConstantService.genericDelete;
   const TransactionsRequest = requestData.multiTransactionSubmissionPayload;
   const prodCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
   for ( let i = 0; i < TransactionsRequest.length; i++)
   {
     if ( TransactionsRequest[i].eventId === '*')
     {
      TransactionsRequest[i].eventId = '';
     }
     if (TransactionsRequest[i].subProductCode === '*')
     {
      TransactionsRequest[i].subProductCode = '';
     }
     if (this.commonService.isNonEmptyValue(prodCode) && prodCode !== '') {
       TransactionsRequest[i].productCode = prodCode;
     }
   }
   const options = {
      headers: new HttpHeaders({
        'Content-Type': FccGlobalConstant.APP_JSON
      }),
      body: {
        transactions: TransactionsRequest
      },
    };
   return this.http.request<any>(FccGlobalConstant.HTTP_DELETE, completePath, options);
  }

  maintenanceMultipleRejectedTransaction(requestData: any )
  {
   const completePath = this.fccGlobalConstantService.rejectedDelete;
   const TransactionsRequest = requestData.multiTransactionSubmissionPayload;
   const prodCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);

   for ( let i = 0; i < TransactionsRequest.length; i++)
   {
     if ( TransactionsRequest[i].eventId === '*')
     {
      TransactionsRequest[i].eventId = '';
     }
     if (TransactionsRequest[i].subProductCode === '*')
     {
      TransactionsRequest[i].subProductCode = '';
     }
     if (this.commonService.isNonEmptyValue(prodCode) && prodCode !== '' &&
     !this.commonService.isnonEMptyString(TransactionsRequest[i].productCode))
     {
       TransactionsRequest[i].productCode = prodCode;
     }
   }
   const options = {
      headers: new HttpHeaders({
        'Content-Type': FccGlobalConstant.APP_JSON
      }),
      body: {
        transactions: TransactionsRequest
      },
    };
   return this.http.request<any>(FccGlobalConstant.HTTP_DELETE, completePath, options);
  }

  cancelMultipleTransaction(requestData: any )
  {
   const completePath = this.fccGlobalConstantService.batchCancel;
   const TransactionsRequest = requestData.multiTransactionSubmissionPayload;
   const prodCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
   for ( let i = 0; i < TransactionsRequest.length; i++)
   {
     if ( TransactionsRequest[i].eventId === '*')
     {
      TransactionsRequest[i].eventId = '';
     }
     if (TransactionsRequest[i].subProductCode === '*')
     {
      TransactionsRequest[i].subProductCode = '';
     }
     if (this.commonService.isNonEmptyValue(prodCode) && prodCode !== '') {
       TransactionsRequest[i].productCode = prodCode;
     }
   }
   const options = {
      headers: new HttpHeaders({
        'Content-Type': FccGlobalConstant.APP_JSON
      }),
      body: {
        transactions: TransactionsRequest
      },
    };
   return this.http.request<any>(FccConstants.HTTP_PUT, completePath, options);
  }

  getBankServerDate() {
    const completePath = this.fccGlobalConstantService.bankDetailsForPdf;
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj[FccGlobalConstant.REQUEST_FORM] = FccGlobalConstant.REQUEST_INTERNAL;
    const headers = new HttpHeaders(obj);
    return this.http.get<any>(completePath, { headers }).pipe(
      map(
        (bankRes) => {
          if (bankRes.date !== '' && bankRes.date !== undefined && bankRes.date !== null) {
            const bankServerDate = bankRes.date.split(' ')[0];
            const dateParts = bankServerDate.toString().split('/');
            const bankServerDateObj = new Date(dateParts[FccGlobalConstant.LENGTH_2],
              dateParts[FccGlobalConstant.LENGTH_1] - FccGlobalConstant.LENGTH_1, dateParts[FccGlobalConstant.LENGTH_0]);
            return bankServerDateObj;
          }
          else {
            return new Date();
          }
        }
      )
    );
  }

}
