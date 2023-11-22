import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class ParamInitializerService {

  private currencySymbolDisplayEnabled;

  constructor(protected fccGlobalConstantService : FccGlobalConstantService ,protected http: HttpClient) { }

  getBankContextEnabledHeaders = () => new HttpHeaders({ 'bank-context':  'true', 'cache-request': 'true',
     'Content-Type': 'application/json' });

  getCurrencySymbolParameterConfiguredValues(paramId: string, key2?: string, key3?: string): Observable<any> {
    const headers = this.getBankContextEnabledHeaders();
    let baseUrl = `${this.fccGlobalConstantService.getParamConfig}?paramId=${paramId}`;
    if (key2 !== null && key2 !== undefined && key2 !== '') {
      baseUrl = baseUrl + `&KEY_2=${key2}`;
    }
    if (key3 !== null && key3 !== undefined && key3 !== '') {
      baseUrl = baseUrl + `&KEY_3=${key3}`;
    }
    return this.http.get<any>(baseUrl, { headers } );
  }

  isNonEmptyValue(fieldValue: any) {
    return (fieldValue !== undefined && fieldValue !== null);
  }

  public fetchParamData() {
    this.getCurrencySymbolParameterConfiguredValues(FccGlobalConstant.PARAMETER_P809).subscribe((response) => {
      if (this.isNonEmptyValue(response) &&
					this.isNonEmptyValue(response.paramDataList) && response.paramDataList[0]) {
					this.currencySymbolDisplayEnabled = response.paramDataList[0][FccGlobalConstant.DATA_1];
          sessionStorage.setItem('currencySymbolDisplayEnabled', this.currencySymbolDisplayEnabled);
      }
    });
  }

  public getCurrencySymbolDisplayEnabled() : boolean{
    return sessionStorage.getItem('currencySymbolDisplayEnabled') === 'y';
  }

}
