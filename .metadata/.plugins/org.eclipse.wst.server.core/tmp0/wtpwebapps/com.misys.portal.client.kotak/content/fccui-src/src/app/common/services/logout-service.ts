import { LogoutRequest } from '../model/logout-request';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FccGlobalConstant } from '../core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  constructor(protected http: HttpClient) {}

  public logoutUser(path: string, request: LogoutRequest): Observable<any> {
    const contentType = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders({ 'Content-Type': contentType });
    return this.http.post<any>(path, request, { headers });
  }
}
