import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from '../../common/core/fcc-global-constant.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionValidateService } from '../../common/services/session-validate-service';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { CommonService } from './common.service';

@Injectable()
export class GlobalSearchService {
  menufilter: any[] = [];

  constructor(
    protected http: HttpClient,
    protected fccGlobalConstantService: FccGlobalConstantService,
    protected translateService: TranslateService,
    protected sessionValidation: SessionValidateService,
    protected commonService: CommonService
  ) {}

  getsearchresult(searchCriteria: string, searchWith) {
    return this.http
      .get<any>(
        `${this.fccGlobalConstantService.search}?searchcriteria=${searchCriteria}&searchFilter=${searchWith}`)
      .toPromise()
      .then(res => res.transactionSearchList as any[])
      .catch(res => res)
      .then(data => data);
  }

  getsearchDetailresult(referenceId: string) {
    return this.http
      .get<any>(
        `${this.fccGlobalConstantService.searchDetails}?referenceId=${referenceId}`)
      .toPromise()
      .then(res => res.transactionSearchDetailsList as any[])
      .catch(res => res)
      .then(data => data);
  }

  getBoRefIdsearchDetailresult(referenceId: string, filter: string) {
    const path = filter == 'tnx' ? this.fccGlobalConstantService.searchDetails : this.fccGlobalConstantService.searchDetailsBoRefId;
    return this.http
      .get<any>(
        `${path}?referenceId=${referenceId}`)
      .toPromise()
      .then(res => res.transactionSearchDetailsList as any[])
      .catch(res => res)
      .then(data => data);
  }

  getsearchActionresult(referenceId: string, transactionId: string, subProductCode?: string) {
    let url = `${this.fccGlobalConstantService.actionDetails}?referenceId=${referenceId}&transactionId=${transactionId}`;
    
    if(this.commonService.isNonEmptyValue) {
      url += `&subProductCode=${subProductCode}`;
    }

    return this.http
      .get<any>(
        url)
      .toPromise()
      .then(res => res.actionDetailsList as any[])
      .catch(res => res)
      .then(data => data);
  }

  getMenuSearch() {
    const headers = new HttpHeaders({ 'cache-request':  'true', 'Content-Type': FccGlobalConstant.APP_JSON });
    return this.http
      .get<any>(this.fccGlobalConstantService.menuSearch, {
        headers
      })
      .toPromise()
      .then(res => res.menus as any[])
      .catch(res => res)
      .then(data => {
        if (data.errorMessage && data.errorMessage === 'SESSION_INVALID') {
          this.sessionValidation.IsSessionValid();
        } else {
          this.menufilter = this.filterMenu(data);
        }
      });
  }

  filterMenu(dataMenu: any[]): any[] {
    const filtered: any[] = [];
    let menuLabel2;
    let menuLabel3;
    let menuLabel4;
    for (let i = 0; i < dataMenu.length; i++) {
      this.translateService
        .get(dataMenu[i].menuLabel)
        .subscribe((res: string) => {
          filtered.push({ referenceId: res, url: '' });
        });
        //please fix below eslint-warning for no-empty-pattern.
        // below syntax is not used for assigning empty array if menu[k].subMenus is undefined.
      const menu2 = ([] = dataMenu[i].subMenus);
      for (let j = 0; j < menu2.length; j++) {
        this.translateService
          .get(menu2[j].subMenuLabel)
          .subscribe((res: string) => {
            menuLabel2 = res;
            filtered.push({ referenceId: res, url: menu2[j].subMenuUrl });
          });
          //please fix below eslint-warning for no-empty-pattern.
          // below syntax is not used for assigning empty array if menu[k].subMenus is undefined.
        const menu3 = ([] = menu2[j].subMenus);
        for (let k = 0; k < menu3.length; k++) {
          this.translateService
            .get(menu3[k].subMenuLabel)
            .subscribe((res: string) => {
              menuLabel3 = res;
              filtered.push({
                referenceId: `${menuLabel2} -> ${menuLabel3}`,
                url: menu3[k].subMenuUrl
              });
            });
            //please fix below eslint-warning for no-empty-pattern.
            // below syntax is not used for assigning empty array if menu[k].subMenus is undefined.
          const menu4 = ([] = menu3[k].subMenus);
          for (let l = 0; l < menu4.length; l++) {
            this.translateService
              .get(menu4[l].subMenuLabel)
              .subscribe((res: string) => {
                menuLabel4 = res;
                filtered.push({
                  referenceId:
                    `${menuLabel2} -> ${menuLabel3} -> ${menuLabel4}`,
                  url: menu4[l].subMenuUrl
                });
              });
          }
        }
      }
    }
    return filtered;
  }

  getAllTransactions(searchCriteria: string, searchFilter: string, pageCount: string, rows: string) {
    searchFilter = searchFilter.trim();
    return this.http
      .get<any>(
        // eslint-disable-next-line max-len
        `${this.fccGlobalConstantService.getAllTransaction}?searchCriteria=${searchCriteria}&searchFilter=${searchFilter}&pageCount=${pageCount}&rows=${rows}`)
      .toPromise()
      .then(res => res as any[])
      .catch(res => res)
      .then(data => data);
  }

  getActionOfSearch(refId, tnxId) {
    return this.http
      .get<any>(
        `${this.fccGlobalConstantService.getSearchAction}?referenceId=${refId}&transactionId=${tnxId}`)
      .toPromise()
      .then(res => res.actionDetailsList as any[])
      .catch(res => res)
      .then(data => data);
  }

  getBenSearchDetails(benName, beneType) {
    return this.http
      .get<any>(
        `${this.fccGlobalConstantService.getBeneficiaryDetail}?beneficiaryName=${benName}&beneficiaryType=${beneType}`)
      .toPromise()
      .then(res => res as any[])
      .catch(res => res)
      .then(data => data);
  }

}
