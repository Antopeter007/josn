import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from './../../../common/services/common.service';
import { ReceivedUndertakingRequest } from '../common/model/ReceivedUndertakingRequest';
import { Observable } from 'rxjs';
import { CommonDataService } from './../../../common/services/common-data.service';

@Injectable({ providedIn: 'root' })
export class RUService {

  constructor(
    public http: HttpClient,
    public commonService: CommonService,
    public commonDataService: CommonDataService
    ) { }

contextPath = this.commonService.getContextPath();

productCode: string = this.commonDataService.getProductCode();

  public saveOrSubmitRU(path: string, request: ReceivedUndertakingRequest): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const requestPayload = {requestData: JSON.parse(JSON.stringify(request))};
    return this.http.post<any>(path, requestPayload, {headers});
  }

  public submitFromRetrieveUnsigned(path: string, request: ReceivedUndertakingRequest): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const requestPayload = {requestData: JSON.parse(JSON.stringify(request))};
    return this.http.post<any>(path, requestPayload, {headers});
  }

  public submitFromReleaseReject(path: string, request: ReceivedUndertakingRequest): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const requestPayload = {requestData: JSON.parse(JSON.stringify(request))};
    return this.http.post<any>(path, requestPayload, {headers});
  }

  public returnIssuedUndertaking(path: string, request: ReceivedUndertakingRequest): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const requestPayload = {requestData: JSON.parse(JSON.stringify(request))};
    return this.http.post<any>(path, requestPayload, {headers});
  }

  public getRuDefaultValues(path: string, actionCode: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const requestPayload = {requestData: {product_code: this.productCode, actionCode}};
    return this.http.post<any>(path, requestPayload, {headers});
  }
}
