import { Product } from './../../../../common/model/product.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from './../../../../common/services/common.service';
import { TradeCustReference } from '../model/trade.custReference.model';
import { URLConstants } from './../../../../common/urlConstants';

@Injectable({
  providedIn: 'root'
})
export class TradeMaintenanceService {

  constructor(public http: HttpClient, public commonService: CommonService) { }

  updateEntity(request: Product): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestPayload = { requestData : JSON.parse(JSON.stringify(request)) };
    const completePath = this.commonService.getContextPath() + URLConstants.UPDATE_ENTITY;
    return this.http.post<any>(completePath, requestPayload, {headers});
  }

  public submitCustRef(request: TradeCustReference): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestPayload =  JSON.parse(JSON.stringify(request));
    const completePath = this.commonService.getContextPath() + URLConstants.UPDATE_CUSTREF;
    return this.http.post<any>(completePath, requestPayload, {headers});
  }
}
