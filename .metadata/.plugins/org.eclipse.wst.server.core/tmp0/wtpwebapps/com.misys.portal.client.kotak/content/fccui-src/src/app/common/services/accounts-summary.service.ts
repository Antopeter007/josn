import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { CommonService } from './common.service';

@Injectable({
    providedIn: 'root'
})
export class AccountsSummaryService {
    contentType: 'Content-Type';

    constructor(protected http: HttpClient, public fccGlobalConstantService: FccGlobalConstantService,
                protected commonService: CommonService) { }

    public getAccountDetailsSummary(listdefName: string, categoryData?: string, filterParams?: string): Promise<any> {
        const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
        const params = new HttpParams({
            fromObject: {
                listdefXml: listdefName,
                category: categoryData,
                filterValues: filterParams
            }
          });
        return this.http.get<any>(this.fccGlobalConstantService.accountsSummaryDetails, { headers, params }).toPromise();
    }

}
