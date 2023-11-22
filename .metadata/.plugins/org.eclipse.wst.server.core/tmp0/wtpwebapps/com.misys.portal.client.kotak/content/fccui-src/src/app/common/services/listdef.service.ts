import { FccGlobalConstant } from '../../common/core/fcc-global-constants';
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import { FccGlobalConstantService } from '../../common/core/fcc-global-constant.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListDefService {
  contentType = 'Content-Type';
  dir: string = localStorage.getItem('langDir');
  preferenceData: any;
  public retreiveListDefFromCache = new BehaviorSubject<boolean>(true);
  constructor(protected http: HttpClient, public fccGlobalConstantService: FccGlobalConstantService) { }

  public getTabDetails(productCode: any, subProductCode: any, option: any, listDef?: any, filterParams?: string , category?: any) {
    let headers: any;
    let retreiveFromCache = true;
    this.getRetreiveListDefFromCacheAsObservable().subscribe(
      (isRetreiveFromCache: boolean) => {
        retreiveFromCache = isRetreiveFromCache ? true : false;
      }
    );
    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC || option === FccGlobalConstant.TEMPLATE || !retreiveFromCache) {
      headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    } else {
      headers = new HttpHeaders({ 'cache-request':  'true', 'Content-Type': FccGlobalConstant.APP_JSON });
    }
    const reqUrl = `${this.fccGlobalConstantService.productListScreen}?ProductCode=${productCode}&Option=${option}` +
    `&SubProductCode=${subProductCode}&listDef=${listDef}&FilterValues=${filterParams}&category=${category}`;
    return this.http.get<any>(reqUrl, { headers });
   }

   setRetreiveListDefFromCache(retreiveFromCache: boolean) {
    this.retreiveListDefFromCache.next(retreiveFromCache);
  }

  getRetreiveListDefFromCacheAsObservable() {
    return this.retreiveListDefFromCache;
  }

   public getSectionTabDetails(productCode: any, widgetCode: any) {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqUrl = `${this.fccGlobalConstantService.productListScreen}?ProductCode=${productCode}&widgetCode=${widgetCode}`;
    return this.http.get<any>(reqUrl, { headers });
   }
  public getMetaData(listdefName: string, productCode: string, filterParams?: string) {
    const headers = new HttpHeaders({ 'cache-request':  'true', 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqUrl = `${this.fccGlobalConstantService.metaDataListdef}?Name=${listdefName}&ProductCode=${productCode}
    &FilterValues=${filterParams}`;
    return this.http.get<any>(reqUrl, { headers });
  }

  public getSavedFilterPreference(listdefName: string, productCode: string, PreferenceName: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    let reqUrl = `${this.fccGlobalConstantService.savePreferenceListdef}?ListName=${listdefName}`;
    reqUrl = reqUrl.concat(`&ProductCode=${productCode}&PreferenceName=${PreferenceName}`);
    return this.http.get<any>(reqUrl, { headers, observe: 'response' });
  }

  public saveFilterDataPreference(listdefName: string, PreferenceName: string, filterParams: string, productCode?: string,
                                  subProductCode?: string, defaultPreference?: string): Observable<any> {
    const headers = new HttpHeaders({ 'cache-request': 'true', 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqUrl = `${this.fccGlobalConstantService.savePreferenceListdef}?ListName=${listdefName}
    &ProductCode=${productCode}&PreferenceName=${PreferenceName}&subProductCode=${subProductCode}}&defaultPreference=${defaultPreference}`;
    const requestPayload = {
      preferenceData: filterParams
    };
    return this.http.post<any>(reqUrl, requestPayload, { headers, observe: 'response' });
  }

  public modifyFilterDataPreference(listdefName: string, productCode: string, PreferenceName: string, filterParams: string,
                                    subProductCode?: string): Observable<any> {
    const headers = new HttpHeaders({ 'cache-request': 'true', 'Content-Type': FccGlobalConstant.APP_JSON });
    let reqUrl = `${this.fccGlobalConstantService.savePreferenceListdef}?ListName=${listdefName}&ProductCode=${productCode}`;
    reqUrl = reqUrl.concat(`&PreferenceName=${PreferenceName}&subProductCode=${subProductCode}`);
    const requestPayload = {
      preferenceData: filterParams
    };
    this.preferenceData = filterParams;
    return this.http.put<any>(reqUrl, requestPayload, { headers, observe: 'response' });
  }

  public deleteSavedPreference(listdefName: string, productCode: string, PreferenceName: string, filterParams: string,
    subProductCode?: string): Observable<any> {
      const headers = new HttpHeaders({ 'cache-request': 'true', 'Content-Type': FccGlobalConstant.APP_JSON });
      let reqUrl = `${this.fccGlobalConstantService.deletePreferenceListdef}?ListName=${listdefName}&ProductCode=${productCode}`;
      reqUrl = reqUrl.concat(`&PreferenceName=${PreferenceName}&subProductCode=${subProductCode}`);
      const requestPayload = {
      preferenceData: filterParams
      };
      this.preferenceData = filterParams;
    return this.http.post<any>(reqUrl, requestPayload, { headers, observe: 'response' });
  }

  public modifyDefaultFilterDataPreference(listdefName: string, productCode: string, PreferenceName: string, filterParams: string,
    subProductCode?: string, defaultPreference?: string): Observable<any> {
const headers = new HttpHeaders({ 'cache-request': 'true', 'Content-Type': FccGlobalConstant.APP_JSON });
let reqUrl = `${this.fccGlobalConstantService.updatePreferenceListdef}?ListName=${listdefName}&ProductCode=${productCode}`;
reqUrl = reqUrl.concat(`&PreferenceName=${PreferenceName}&subProductCode=${subProductCode}}&defaultPreference=${defaultPreference}`);
const requestPayload = {
preferenceData: filterParams
};
this.preferenceData = filterParams;
return this.http.put<any>(reqUrl, requestPayload, { headers, observe: 'response' });
}

  public saveAndUpdateColumnCustomization(listdefName: string, productCode: string, columnData: string,
                                          subProductCode?: string, widgetCode?: string, optionName?: string,
                                          tabName?: string, updateColumnCustomization?: boolean): Observable<any> {
    const headers = new HttpHeaders({ 'cache-request': 'true', 'Content-Type': FccGlobalConstant.APP_JSON });
    let reqUrl = `${this.fccGlobalConstantService.saveCustomizeColumnListdef}?ListName=${listdefName}&ProductCode=${productCode}`;
    reqUrl = reqUrl.concat(`&WidgetCode=${widgetCode}&OptionName=${optionName}`);
    reqUrl = reqUrl.concat(`&SubProductCode=${subProductCode}&TabName=${tabName}`);
    const requestPayload = {
      columnData
    };
    if (updateColumnCustomization){
      return this.http.put<any>(reqUrl, requestPayload, { headers, observe: 'response' });
    }else{
      return this.http.post<any>(reqUrl, requestPayload, { headers, observe: 'response' });
    }

  }

  public getColumnCustomizationData(listdefName: string, productCode: string,
                                    subProductCode?: string, widgetCode?: string, optionName?: string, tabName?: string): Observable<any> {

    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    let reqUrl = `${this.fccGlobalConstantService.getCustomizeColumnListdef}?ListName=${listdefName}`;
    reqUrl = reqUrl.concat(`&ProductCode=${productCode}&WidgetCode=${widgetCode}&OptionName=${optionName}`);
    reqUrl = reqUrl.concat(`&SubProductCode=${subProductCode}&TabName=${tabName}`);
    return this.http.get<any>(reqUrl, { headers, observe: 'response' });

    }

  public getTableData(listdefName: string, filterParams: string, paginatorParams: string, enableMasking?: boolean) {
    const obj = {};
    let maskingBooleanAsString = '';
    if (enableMasking) {
      maskingBooleanAsString = 'true';
    } else {
      maskingBooleanAsString = 'false';
    }
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
      fromObject: {
        Name: listdefName,
        FilterValues: filterParams,
        Start: paginatorParams,
        Masking: maskingBooleanAsString
      },
      encoder: new CustomUrlEncoder()
    });
    return this.http.get<any>(this.fccGlobalConstantService.tableDataListdef, { headers, params });
  }
  public getCount(listdefName: string) {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const reqUrl = `${this.fccGlobalConstantService.numOfRecords}?Name=${listdefName}`;
    return this.http.get<any>(reqUrl, { headers });
   }

   public getUserGroupsDetails(classification: any) {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    const reqUrl = `${this.fccGlobalConstantService.getUserGroupsData}${classification}`;
    return this.http.get<any>(reqUrl, { headers });
   }

  public checkPendingTransaction(listdefName: string, refId: string): Observable<any> {
    const filterParams = JSON.stringify({ ref_id: refId });
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
      fromObject: {
        Name: listdefName,
        FilterValues: filterParams
      }
    });
    return this.http.get<any>(this.fccGlobalConstantService.tableDataListdef, { headers, params });
  }

  public getActiveFacilityData(listdefName: string): Observable<any> {
    const filterParams = JSON.stringify({});
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
      fromObject: {
        Name: listdefName,
        FilterValues: filterParams
      }
    });
    return this.http.get<any>(this.fccGlobalConstantService.tableDataListdef, { headers, params });
  }

  public getFacilityDetail(listdefName: string, borrowerId: string, dealId: string): Observable<any> {
    const filterParams = JSON.stringify({ borrower_reference: borrowerId, deal_id: dealId });
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
      fromObject: {
        Name: listdefName,
        FilterValues: filterParams
      }
    });
    return this.http.get<any>(this.fccGlobalConstantService.tableDataListdef, { headers, params });
  }

  public getCourierTnxColumns(listdefName: string, refId?: string
     ): Observable<any> {
    const filterParams = JSON.stringify({ 
      ref_id : refId
    });
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
      fromObject: {
        Name: listdefName,
        FilterValues: filterParams
      }
    });
    return this.http.get<any>(this.fccGlobalConstantService.tableDataListdef, { headers, params });
  }

   public getAllGroupsListData(listdefName: string, filterParams?: string, paginatorParams?: string) {
    const obj = {};
    obj[this.contentType] = FccGlobalConstant.APP_JSON;
    const headers = new HttpHeaders(obj);
    const params = new HttpParams({
      fromObject: {
        Name: listdefName,
        FilterValues: filterParams,
        Start: paginatorParams
      }
    });
    return this.http.get<any>(this.fccGlobalConstantService.groupsListDataListdef, { headers, params });
  }
}


class CustomUrlEncoder implements HttpUrlEncodingCodec { // eslint-disable-line max-classes-per-file
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }
  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }
  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }
  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
