import { FccGlobalConstantService } from './../../../../../common/core/fcc-global-constant.service';
import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { shareReplay } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class LcReturnService {
  allLcRecords;
  tnxLcRecords;
  contentType = 'Content-Type';
  cacheRequest = 'cache-request';
  public amountConfigMap = new BehaviorSubject([]);
  constructor(protected translateService: TranslateService, protected http: HttpClient,
    protected fccGlobalConstantService: FccGlobalConstantService
  ) {
  }
  details = this.translateService.instant('Details');
  amendementDetails = this.translateService.instant('Amendement_details');
  messageToBank = this.translateService.instant('Message_to_bank');
  items = [
    { label: 'Details', id: 'Details' },
    { label: 'AmendementDetails', id: 'AmendementDetails' },
    { label: 'MessageToBank', id: 'MessageToBank' }
  ];
  getTanMenuList() {
    return this.items;
  }
  public getMasterTransaction(lcnumber): Observable<any> {
    const contentType = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders({ 'Content-Type': contentType });
    const reqURl = `${this.fccGlobalConstantService.getMasterTransaction}/${lcnumber}`;
    this.allLcRecords = this.http.get<any>(reqURl, { headers });
    return this.allLcRecords;
  }

  public getLCTransactionData(lcnumber): Observable<any> {
    const contentType = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders({ 'Content-Type': contentType });
    const reqURl = `${this.fccGlobalConstantService.getLCTransactionData}/${lcnumber}`;
    this.tnxLcRecords = this.http.get<any>(reqURl, { headers });
    return this.tnxLcRecords;
  }

  getCacheEnabledHeaders() {
    return new HttpHeaders({ 'cache-request': 'true', 'Content-Type': 'application/json' });
  }

  getAmountConfigurationValue(currency?: string): Observable<any> {
    const headers = this.getCacheEnabledHeaders();
    let baseUrl = `${this.fccGlobalConstantService.getAmountConfig}`;

    if (currency !== null && currency !== undefined && currency !== '') {
      baseUrl = baseUrl + `&CURRENCY=${currency}`;
    }
    const reqURL = baseUrl;
    return this.http.get<any>(reqURL, { headers });
  }
  isNonEmptyValue(fieldValue: any) {
    return (fieldValue !== undefined && fieldValue !== null);
  }
  public getamountConfig() {
    this.getAmountConfigurationValue().subscribe((response) => {
      if (this.isNonEmptyValue(response) && this.isNonEmptyValue(response.amountConfigMap)) {
        const amountConfigMap = response.amountConfigMap;
        this.amountConfigMap.next(amountConfigMap);
      }
    });
  }
  public loadDefaultConfiguration(): Observable<any> {
    const headers = this.getCacheEnabledHeaders();
    const completePath = this.fccGlobalConstantService.getConfgurations();
    return this.http.get<any>(completePath, { headers }).pipe(
      shareReplay()
    );
  }

}

