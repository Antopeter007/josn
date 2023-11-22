import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedbackRequest } from '../model/feedback-request';
import { FccGlobalConstant } from '../core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class UserFeedbackService {
  constructor(protected http: HttpClient) {}

  public submitFeedback(
    path: string,
    request: FeedbackRequest
  ): Observable<any> {
    const contentType = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders({ 'Content-Type': contentType });
    return this.http.post<any>(path, request, { headers });
  }

  public isFeedbackEnabled(path: string, productCode: string, subProductCode?: string, tnxTypeCode?: string) {
    const contentType = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders({ 'Content-Type': contentType });
    const reqURl = `${path}?KEY_3=${productCode}&KEY_4=${subProductCode}&KEY_5=${tnxTypeCode}`;
    return this.http.get<any>(reqURl, { headers } );
  }
}
