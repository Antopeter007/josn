import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExchangeRateRequest } from '../model/xch-rate-request';
import { FccGlobalConstant } from '../core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  constructor(protected http: HttpClient) { }

  public getExchangeRate(path: string, request: ExchangeRateRequest): Observable<any> {
    const contentType = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders({ 'Content-Type': contentType });
    return this.http.post<any>(path, request, { headers });
  }
}
