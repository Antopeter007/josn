import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { URLConstants } from '../urlConstants';

@Injectable({ providedIn: 'root' })
export class RefIdGeneratorService {

  constructor(public http: HttpClient, public commonService: CommonService) { }

  contextPath = this.commonService.getContextPath();
  url = this.contextPath + URLConstants.GENERATE_REFID;

  generateRefId(productCode: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const requestPayload = {requestData: { productCode }};
    return this.http.post<any>(this.url, requestPayload, {headers});

  }
}
