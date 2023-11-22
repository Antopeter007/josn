import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';

@Injectable({
  providedIn: 'root'
})
export class NudgesService {

  constructor(protected http: HttpClient, protected fccGlobalConstantService: FccGlobalConstantService) { }

  public getNudges(widgetName: string, productCode?, subProductCode?) {
    let params;
    if(productCode){
       params = new HttpParams()
      .set('widgetName', widgetName)
      .set('productCode', productCode)
      .set('subProductCode', subProductCode);
    }else{
      params = new HttpParams()
      .set('widgetName', widgetName);
    }
      
    return this.http
      .get<any>(
        this.fccGlobalConstantService.getNudges , { params })
          .toPromise()
          .then(res => res)
          .catch(res => res)
          .then(data => data);
  }

}
