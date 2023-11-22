import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyConversionRequest } from '../model/currency-conversion-request';
import { FccGlobalConstant } from '../core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConversionService {
  constructor(protected http: HttpClient) {}

  public getConversion(
    path: string,
    request: CurrencyConversionRequest
  ): Observable<any> {
    const contentType = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders({ 'Content-Type': contentType });
    return this.http.post<any>(path, request, { headers });
  }
}
