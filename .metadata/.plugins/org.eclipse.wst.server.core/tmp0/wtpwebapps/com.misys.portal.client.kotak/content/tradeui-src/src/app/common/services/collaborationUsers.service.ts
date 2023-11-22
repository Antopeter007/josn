import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { URLConstants } from '../urlConstants';
import { CommonDataService } from './common-data.service';
import { CommonService } from './common.service';

@Injectable({ providedIn: 'root' })
 export class CollaborationUsersService {

  constructor(public http: HttpClient, public commonService: CommonService,
              public commonData: CommonDataService) { }

  public getUsers(option: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const requestPayload = {requestData: {productCode: this.commonData.getProductCode(),
                                            option,
                                            entityName: this.commonData.getEntity()}};
    const completePath = this.commonService.getContextPath() + URLConstants.USERS_LIST;
    return this.http.post<any>(completePath, requestPayload, {headers} );
  }

 }
