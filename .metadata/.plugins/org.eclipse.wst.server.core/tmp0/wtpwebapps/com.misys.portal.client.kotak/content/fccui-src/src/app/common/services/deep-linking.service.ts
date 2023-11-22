import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';

@Injectable({
  providedIn: 'root'
})
export class DeepLinkingService {


  constructor(protected http: HttpClient, protected fccGlobalConstantService: FccGlobalConstantService) { }

  public getDeepLinking(productProcessor: string, urlKey: string) {
    const headers = this.getCacheEnabledHeaders();
    const reqURl =
    `${this.fccGlobalConstantService.getDeepLinking}?productProcessor=${productProcessor}&urlKey=${urlKey}`;
    return this.http.get<any>(reqURl, { headers } ).toPromise();
  }

  getCacheEnabledHeaders() {
    return new HttpHeaders({ 'cache-request':  'true', 'Content-Type': 'application/json' });
  }



}
