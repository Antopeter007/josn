
import { CommonService } from './common.service';
import { Entity } from '../model/entity.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IUCommonDataService } from '../../trade/iu/common/service/iuCommonData.service';
import { CommonDataService } from '../../common/services/common-data.service';
import { URLConstants } from '../urlConstants';

@Injectable({ providedIn: 'root' })
 export class EntityService {

    constructor(public http: HttpClient, public commonService: CommonService,
                public commonDataService: IUCommonDataService,
                public commonData: CommonDataService) { }

     userEntities: Entity[] = [];

    public getUserEntities(option: string, abbvName?: string, name?: string): Observable<any> {
      const headers = new HttpHeaders({'Content-Type': 'application/json'});
      const requestPayload = {requestData: {productCode: this.commonData.getProductCode(),
                                              subProductCode: this.commonDataService.getSubProdCode(),
                                              abbvName,
                                              option}};
      const completePath = this.commonService.getContextPath() + URLConstants.ENTITY_LIST;
      return this.http.post<any>(completePath, requestPayload, {headers} );
    }
  }
