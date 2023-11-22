import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  constructor(protected http: HttpClient, protected fccGlobalConstantService: FccGlobalConstantService) { }

  public getSummaryLayout(model: string) {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqUrl = this.fccGlobalConstantService.getProductModelURL(model);
    return this.http
      .get<any>(
        reqUrl, { headers })
          .toPromise()
          .then(res => res)
          .catch(res => res)
          .then(data => data);
  }

}
