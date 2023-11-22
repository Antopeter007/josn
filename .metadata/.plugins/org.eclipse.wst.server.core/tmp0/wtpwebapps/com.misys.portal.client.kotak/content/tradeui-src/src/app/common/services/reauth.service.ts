import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { URLConstants } from '../urlConstants';

@Injectable({ providedIn: 'root' })
export class ReauthService {

  constructor(protected readonly http: HttpClient, protected readonly commonService: CommonService) { }

  contextPath = this.commonService.getContextPath();

  public getReauthType(reauthParams: Map<string, string>): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const requestPayload = {productCode: reauthParams.get('productCode'),
                            subProductCode: reauthParams.get('subProductCode'),
                            tnxTypeCode: reauthParams.get('tnxTypeCode'),
                            entity: reauthParams.get('entity'),
                            currency: reauthParams.get('currency'),
                            amount: reauthParams.get('amount'),
                            bankAbbvName: reauthParams.get('bankAbbvName'),
                            tnxData: reauthParams.get('tnxData'),
                            mode: reauthParams.get('mode'),
                            operation: reauthParams.get('operation'),
                            es_field1: reauthParams.get('es_field1'),
                            es_field2: reauthParams.get('es_field2')
                          };
    const completePath = this.contextPath + URLConstants.REAUTH;
    return this.http.post<any>(completePath, requestPayload, {headers} );
  }
}
