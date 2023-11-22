import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { IUCommonDataService } from '../../trade/iu/common/service/iuCommonData.service';
import { CommonDataService } from './common-data.service';
import { URLConstants } from './../../common//urlConstants';


@Injectable({ providedIn: 'root' })
export class StaticDataService {

  constructor(public http: HttpClient, public commonService: CommonService,
              public iuCommonDataService: IUCommonDataService, public commonDataService: CommonDataService) { }

  contextPath = this.commonService.getContextPath();
  headers = new HttpHeaders({'Content-Type': 'application/json'});

  productCode: string = this.iuCommonDataService.getProductCode();
  prodCode: string = this.commonDataService.getProductCode();

  public getCurrencies(): Observable<any> {
    const requestPayload = {requestData: {}};
    const completePath = this.contextPath + URLConstants.CURRENCY_LIST;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers} );
  }
  public getCountries(codeValue: string, subProductCode?: string,
                      orderCol?: string, orderType?: string, fields?: string): Observable<any> {
    const requestPayload = {option: 'codevalue', codeValue,
        productCode: this.productCode, subProductCode, orderCol,
        orderType, fields};
    const completePath = this.contextPath + URLConstants.CODEFIELDVALUE_LIST;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers} );
  }

  public getStaticAccounts(option: string, entity: string,
                           accountNo: string, curCode: string, description: string): Observable<any> {
    const requestPayload = {requestData: {option,
                                            entity,
                                            productCode: this.productCode,
                                            accountNo,
                                            curCode,
                                            description
                                          }};
    const completePath = this.contextPath + URLConstants.ACCOUNTS;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers} );
  }

  public saveOrSubmitBank(request: any): Observable<any> {
    const requestPayload =  JSON.stringify(request);
    const completePath = this.contextPath + URLConstants.BANK_SAVE;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
  }

  public saveOrSubmitCounterParty(request: any): Observable<any> {
    const requestPayload =  JSON.stringify(request);
    const completePath = this.contextPath + URLConstants.BENEFICIARY_SAVE;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
  }

  public getLanguage(): Observable<any> {
    const requestPayload = {};
    const completePath = this.contextPath + URLConstants.LANGUAGE_LIST;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers} );
  }

  public getAssociatedBank(entity: string): Observable<any> {
    const requestPayload = {requestData: {entity}};
    const completePath = this.contextPath + URLConstants.CUST_BANKS_LIST;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers} );
  }

  public getCustomerReference(bankAbbvName: string, entity: string): Observable<any> {
    const requestPayload = {requestData: {bankAbbvName, entity}};
    const completePath = this.contextPath + URLConstants.CUST_REFERENCES_LIST;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers} );
  }

  public getLimitDetails(requestPayload: any): Observable<any> {
    const completePath = this.contextPath + URLConstants.LIMIT_DETAILS_LIST;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers} );
  }

  public getBeneficiary(abbvName?: string, name?: string): Observable<any> {
    const requestPayload = {requestData: {abbv_name: abbvName,
                                            name  }};
    const completePath = this.contextPath + URLConstants.USER_BENEFICIARIES;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
   }

   public getBanks(): Observable<any> {
    const requestPayload = {entity: this.commonDataService.getEntity(),
                            productCode: this.productCode,
                            option: 'bank'};
    const completePath = this.contextPath + URLConstants.BANK_LIST;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers} );
  }
  public getCodeData(codeId: string): Observable<any> {
    const requestPayload = {codeId, productCode: this.productCode};
    const completePath = this.contextPath + URLConstants.CODE_DATE_VALUES;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers} );
  }

    // get business code
  public fetchBusinessCodes(codeId: string): Observable<any> {
    const completePath = `${this.contextPath}${URLConstants.FETCH_BUSINESS_CODES}${codeId}`;
    return this.http.get<any>(completePath, {headers: this.headers});
}

  public fetchIncoTermDetails(): Observable<any> {
    const completePath = `${this.contextPath}${URLConstants.FETCH_INCO_DETAILS}`;
    return this.http.get<any>(completePath, {headers: this.headers});
  }

  public fetchLargeParamData(parmId: string): Observable<any> {
    const requestPayload = {parmId, productCode: this.prodCode};
    const completePath = this.contextPath + URLConstants.FETCH_LARGE_PARAM_DETAILS + parmId;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
  }
}
