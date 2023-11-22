import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { URLConstants } from './../urlConstants';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  constructor(public http: HttpClient, public commonService: CommonService) { }

  contextPath = this.commonService.getContextPath();
  path = this.contextPath + URLConstants.AUDIT;

  audit(): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const requestPayload = {};
    return this.http.post<any>(this.path, requestPayload, {headers});
  }
}
