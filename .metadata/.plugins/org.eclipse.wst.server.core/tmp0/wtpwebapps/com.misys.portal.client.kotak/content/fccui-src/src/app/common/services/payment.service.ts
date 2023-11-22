import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FccGlobalConstant } from '../../common/core/fcc-global-constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
@Injectable({
  providedIn: 'root'
})
export class PaymentBatchService {
    contentType = 'Content-Type';
    paymentRefNoSubscription$ = new BehaviorSubject('');
    paymentRefNo;
  constructor(protected http: HttpClient, protected fccGlobalConstantService: FccGlobalConstantService) {
    this.paymentRefNoSubscription$.subscribe((val) => {
      this.paymentRefNo = val;
    });
   }

   public fcmAdhocBeneficiaryCreation(requestPayload: any) {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj['X-Request-ID'] = this.fccGlobalConstantService.generateUIUD();
    const headers = new HttpHeaders(obj);
    const completePath = this.fccGlobalConstantService.fcmBeneficiaryCreation;
    return this.http.post<any>(completePath, requestPayload, { headers, observe: 'response' });
  }

  public createBatch(requestObj): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const completePath = this.fccGlobalConstantService.createBatchURL;
    const requestPayload = requestObj;
    return this.http.post<any>(completePath, requestPayload, { headers });
  }
  
  public updateBatchHeader(requestObj, refrenceNo): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const completePath = `${this.fccGlobalConstantService.createBatchURL}/${refrenceNo}`;
    const requestPayload = requestObj;
    return this.http.put<any>(completePath, requestPayload, { headers });
  }

  public addInstrumnet(requestObj, refrenceNo): Observable<any> {
    let iKey = sessionStorage.getItem(FccGlobalConstant.idempotencyKey);
    if (iKey === null || iKey ==="") {
      iKey = this.fccGlobalConstantService.generateUUIDUsingTime();
      sessionStorage.setItem(FccGlobalConstant.idempotencyKey, iKey);
    }
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON ,'Idempotency-Key': iKey });
    const completePath = `${this.fccGlobalConstantService.addInstrumentURL}${refrenceNo}`;
    const requestPayload = requestObj;
    return this.http.post<any>(completePath, requestPayload, { headers });
  }

  public updateInstrumnet(requestObj, paymentRefNo, instrumentRefNumber): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const completePath = `${this.fccGlobalConstantService.updateInstrumentURL}${paymentRefNo}/${instrumentRefNumber}`;
    const requestPayload = requestObj;
    return this.http.put<any>(completePath, requestPayload, { headers });
  }

  public submitBatch(submitpayload: any): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON ,'Idempotency-Key': submitpayload.idempotencyKey });
    const completePath = `${this.fccGlobalConstantService.createBatchURL}/${this.paymentRefNo}/submit`;
    return this.http.post(completePath, null, { headers });
  }

  submitBatchMultiple(paymentReferenceNumbers: any, eventType: string, paymentReferenceNumber?: string) {
      const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    if (paymentReferenceNumber == undefined || paymentReferenceNumber == null) {
      paymentReferenceNumber = paymentReferenceNumbers[0];
    }
    const completePath = `${this.fccGlobalConstantService.createBatchURL}/${paymentReferenceNumber}/multiplesubmit?paymentReferenceNumbers=`
    +paymentReferenceNumbers;
    return this.http.post(completePath, null, { headers });
  }

  public submitBatchPayment(paymentReferenceNumber: string,iKey :any): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON,'Idempotency-Key':iKey });
    const completePath = `${this.fccGlobalConstantService.createBatchURL}/${paymentReferenceNumber}/submit`;
    return this.http.post(completePath, null, { headers });
  }
}

