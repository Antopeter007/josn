import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { URLConstants } from './../urlConstants';

@Injectable({ providedIn: 'root' })
export class TnxIdGeneratorService {

  constructor(public http: HttpClient, public commonService: CommonService) { }

  contextPath = this.commonService.getContextPath();
  url = this.contextPath + URLConstants.GENERATE_TNXID;

  getTransactionId(): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(this.url, {headers});
  }
}
