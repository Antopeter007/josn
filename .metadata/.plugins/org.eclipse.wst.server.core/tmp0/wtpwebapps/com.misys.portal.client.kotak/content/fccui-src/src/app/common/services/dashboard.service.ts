import { FccGlobalConstantService } from './../core/fcc-global-constant.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { IAccountData } from '../model/accountGroup';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  contentType: 'Content-Type';
  requestForm = 'REQUEST-FROM';

  constructor(protected http: HttpClient, public fccGlobalConstantService: FccGlobalConstantService,
              protected commonService: CommonService) { }

  public getInternalNews( start: string, count: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const requestPayload = { userData: { start, count } };
    return this.http.post<any>(this.fccGlobalConstantService.getNewsInternal, requestPayload, { headers });
  }

  public getExternalNews( start: string, count: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const requestPayload = {
      userData: { start, count },
      providerName: ''
    };
    return this.http.post<any>(this.fccGlobalConstantService.getSyndicatedNews, requestPayload, { headers });
  }


  public getAccountBalance(start: string, count: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const requestPayload = { userData: { start, count } };
    return this.http.post<any>(this.fccGlobalConstantService.getAccountBalance, requestPayload, { headers });
  }

  public getUserAccount(): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const offset = FccGlobalConstant.LENGTH_0;
    const limit = this.fccGlobalConstantService.getStaticDataLimit();
    return this.http.get<any>( this.fccGlobalConstantService.getUserAccount + `?limit=${limit}&offset=${offset}`, { headers });
  }

  public getUserSpecificAccount(accountParameters?: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON, Accept:  FccGlobalConstant.APP_JSON });
    const offset = FccGlobalConstant.LENGTH_0;
    const limit = this.fccGlobalConstantService.getStaticDataLimit();
    let req = this.fccGlobalConstantService.getUserSpecificAccount + `?limit=${limit}&offset=${offset}`;
    if (this.commonService.isnonEMptyString(accountParameters)) {
      req = this.fccGlobalConstantService.getUserSpecificAccount +
      `?limit=${limit}&offset=${offset}&accountParameters=${accountParameters}`;
    }
    return this.http.get<any>( req, { headers });
  }

  public getUserTimeZone(): Observable<any> {
    const headers = new HttpHeaders({ 'cache-request':  'true', 'Content-Type': FccGlobalConstant.APP_JSON });
    return this.http.get<any>( this.fccGlobalConstantService.getUserTimeZone, { headers });
  }

  public getUserAccountBalance(accountId: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const completePath = this.fccGlobalConstantService.getDashboardAccountBalance + accountId + '/balances' ;
    return this.http.get<any>( completePath, { headers });
  }

  public getAccountStatment(count: string, fromdate: string, todate: string, accno: string,
                            transactionType: string, entityId?: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const url = this.fccGlobalConstantService.getAccountStatment;
    const reqURl = `${url}?accountNumber=${accno}&startDate=${fromdate}`+
                    `&endDate=${todate}&count=${count}&type=${transactionType}&entityId=${entityId}`;
    return this.http.get<any>(reqURl, { headers });
  }

  public getAccountDetails(accountId: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON }).set('REQUEST-FROM', 'INTERNAL');
    const url = this.fccGlobalConstantService.getAccountDetails + accountId ;
    return this.http.get<any>( url, { headers });
  }

  public getUserDetails(): Observable<any> {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    obj[this.requestForm] = FccGlobalConstant.REQUEST_INTERNAL;
    obj['cache-request'] = 'true';
    const headers = new HttpHeaders(obj);
    return this.http.get<any>(this.fccGlobalConstantService.getUserDetails, { headers });
  }

  public getOutstandingAmount( toCurrency: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const requestPayload = {
      currency: toCurrency
    };
    return this.http.post<any>(this.fccGlobalConstantService.getOutstandingAmount, requestPayload, { headers });
  }

  public getReceivableAmount( toCurrency: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const requestPayload = {
      currency: toCurrency
    };
    return this.http.post<any>(this.fccGlobalConstantService.getReceivableAmount, requestPayload, { headers });
  }

  public getAvailableAmount( toCurrency: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const requestPayload = {
      currency: toCurrency
    };
    return this.http.post<any>(this.fccGlobalConstantService.getAvailableAmount, requestPayload, { headers });
  }

  public getCalendarEvents(start: string, count: string, date: string, mode: string,
                           dashboardType: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const requestPayload = {
      userData: { start, count }, date, mode, dashboardType
    };
    return this.http.post<any>(this.fccGlobalConstantService.getCalendarEvents, requestPayload, { headers });
  }

  public getTransactionInProgress(count: number, start: number) {
    const reqUrl = `${this.fccGlobalConstantService.getTransactionInProgress}?count=${count}&start=${start}`;
    return this.http.get<any>(reqUrl)
      .toPromise()
      .then(res => res as any[])
      .catch(res => res)
      .then(data => data);
  }


  public getBankApprovals(tnxStatCode: string, prodStatCode: string, isApproval: boolean, dashboardType: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    const url = this.fccGlobalConstantService.bankApprovals ;
    const reqURl = `${url}?tnxStatCode=${tnxStatCode}&prodStatCode=${prodStatCode}&isApproval=${isApproval}&dashboardType=${dashboardType}`;
    return this.http.get<any>( reqURl, { headers, observe: 'response' });
  }

  public getPendingTransaction(username: string, company: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const requestPayload = { userData: { username, company } };
    return this.http.post<any>(this.fccGlobalConstantService.getPendingTransactionUrl(), requestPayload, { headers });
  }

  public getActionRequiredTransactions(username: string, company: string): Observable<any> {
    const headers = new HttpHeaders({ contentType: FccGlobalConstant.APP_JSON });
    const requestPayload = { userData: { username, company } };
    return this.http.post<any>(this.fccGlobalConstantService.getActionRequiredUrl(), requestPayload, { headers });
  }

  public getChartBotLink() {
    return this.http
      .get<any>(
        this.fccGlobalConstantService.chatBotLink)
      .toPromise()
      .then(res => res.chatBotSessionDetailsList as any[])
      .catch(res => res)
      .then(data => data);
  }

  public getUserAccountsByEntityId(entityId: string, accountParameters?: any) {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON, Accept:  FccGlobalConstant.APP_JSON });
    const offset = FccGlobalConstant.LENGTH_0;
    const limit = this.fccGlobalConstantService.getStaticDataLimit();
    let req = this.fccGlobalConstantService.getAccountsByEntityId(entityId) + `?limit=${limit}&offset=${offset}`;
    if (this.commonService.isnonEMptyString(accountParameters)) {
      req = this.fccGlobalConstantService.getAccountsByEntityId(entityId) +
      `?limit=${limit}&offset=${offset}&accountParameters=${accountParameters}`;
    }
    return this.http.get<any>(req, { headers });
  }

  public setAccountGroup(accountData: IAccountData, groupId: string): Observable<any> {
   const headers = new HttpHeaders().set('content-type', 'application/json').set('REQUEST-FROM', 'INTERNAL');
   const completePath = this.fccGlobalConstantService.setAccountData(groupId);
   const requestPayload = accountData;
   return this.http.put<any>(completePath, requestPayload, { headers, observe: 'response' });
  }
  public deleteGroup(groupId: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON, Accept:  FccGlobalConstant.APP_JSON });
    const completePath = this.fccGlobalConstantService.deleteGroup(groupId);
    return this.http.delete<any>(completePath, { headers , observe: 'response' });
  }

   public createAccountGroup(accountData: IAccountData): Observable<any> {
    const iKey = this.fccGlobalConstantService.generateUIUD();
    const obj = {};
    obj[FccGlobalConstant.idempotencyKey] = iKey;
    obj[FccGlobalConstant.REQUEST_FORM] = FccGlobalConstant.REQUEST_INTERNAL;
    const headers = new HttpHeaders(obj);
    const completePath = this.fccGlobalConstantService.createGroup();
    const requestPayload = accountData;
    return this.http.post<any>(completePath, requestPayload, { headers, observe: 'response' });
   }

}



