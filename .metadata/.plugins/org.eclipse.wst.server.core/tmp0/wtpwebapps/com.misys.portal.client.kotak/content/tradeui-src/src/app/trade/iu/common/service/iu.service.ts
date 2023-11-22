import { Constants } from './../../../../common/constants';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IssuedUndertakingRequest } from '../model/IssuedUndertakingRequest';
import { TemplateIssuedUndertakingRequest } from '../model/TemplateIssuedUndertakingRequest';
import { CommonDataService } from './../../../../common/services/common-data.service';
import { CommonService } from './../../../../common/services/common.service';
import { IUCommonDataService } from './iuCommonData.service';
import { URLConstants } from './../../../../common//urlConstants';
import { BanktemplateDownloadRequest } from '../model/BanktemplateDownloadRequest';

@Injectable({ providedIn: 'root' })
export class IUService {



  constructor(public http: HttpClient, public commonService: CommonService,
              public commonDataService: IUCommonDataService, public commonData: CommonDataService) { }
  contextPath = this.commonService.getContextPath();

  path = this.contextPath + URLConstants.UNDERTAKING_CUSTOMER;

  productCode: string = this.commonDataService.getProductCode();

  headers = new HttpHeaders({'Content-Type': 'application/json'});

  saveOrSubmitIU(path: string, request: IssuedUndertakingRequest): Observable<any> {
    const requestPayload = {requestData: JSON.parse(JSON.stringify(request))};
    return this.http.post<any>(path, requestPayload, {headers: this.headers});
  }

  public getDefaultValuesJsonService(actionCode: string): Observable<any> {
    const requestPayload = {requestData: {product_code: this.productCode, actionCode}};
    const completePath = this.contextPath + URLConstants.DEFAULT_VALUES;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
  }

  public getAmendmentNumber(refId: string): Observable<any> {
    const requestPayload = {requestData: {ref_id: refId}};
    const completePath = this.contextPath + URLConstants.GENERATE_AMD_NO;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
  }

  public getListOfUsers(refId: string, tnxId: string): Observable<any> {
    const requestPayload = {requestData: {refId, tnxId,
                                            productCode: this.productCode
                                          }};
    const completePath = this.contextPath + URLConstants.TRANSACTION_AUDIT_TRIAL;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers} );
  }

  public getIUPurposes(): Observable<any> {
    const completePath = this.contextPath + URLConstants.PURPOSES;
    return this.http.get<any>(completePath, {headers: this.headers} );
  }

  public getMsgToBankSubTnxType(): Observable<any> {
    const requestPayload = { };
    const completePath = this.contextPath + URLConstants.SUB_TNX_TYPE;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers} );
  }

   public getLicenses(searchLsRefId?: string, searchLsNumber?: string): Observable<any> {
    let requestPayload;
    if (this.commonData.productCode !== 'BR') {
     requestPayload =  {searchLsRefId, searchLsNumber,
                              curCode: this.commonDataService.getCurCode(''),
                              entity: this.commonData.getEntity(),
                              beneficiary: this.commonDataService.getBeneficiary(),
                              subProductCode: '*',
                              expDate: this.commonDataService.getExpDate(),
                              lastShipDate: this.commonDataService.getShipmentDate() ,
                              productTypeCode: '*',
                              productCode: this.productCode};
    } else {
        requestPayload =  {searchLsRefId, searchLsNumber,
        curCode: this.commonDataService.getCurCode(''),
        entity: this.commonData.getEntity(),
        beneficiary: this.commonData.getApplicant(),
        subProductCode: '*',
        expDate: this.commonDataService.getExpDate(),
        lastShipDate: this.commonDataService.getShipmentDate() ,
        productTypeCode: '*',
        productCode: this.commonData.productCode};
    }
    const completePath = this.contextPath + URLConstants.USER_LICENSES;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
   }

   public uploadAttachments(file: File, title: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, title);
    formData.append('fileName', file.name);
    if (this.commonData.getProductCode() === 'BR') {
      if (this.commonData.getRefId() !== '') {
        formData.append('refId', this.commonData.getRefId());
      } else if (this.commonDataService.getRefId() !== '') {
        formData.append('refId', this.commonDataService.getRefId());
      }
      if (this.commonData.getTnxId() !== '') {
        formData.append('tnxId', this.commonData.getTnxId());
      } else if (this.commonDataService.getTnxId() !== '') {
        formData.append('tnxId', this.commonDataService.getTnxId());
      } else {
        formData.append('tnxId', '');
      }
    } else {
      formData.append('refId', this.commonDataService.getRefId());
      if (this.commonDataService.getTnxId() !== '') {
      formData.append('tnxId', this.commonDataService.getTnxId());
      } else {
        formData.append('tnxId', '');
      }
    }

    const completePath = this.contextPath + URLConstants.UPLOAD;
    return this.http.post<any>(completePath, formData);
  }

  public getIUSubProducts(): Observable<any> {
    const completePath = `${this.contextPath}${URLConstants.GET_IU_SUB_PRODUCT}${this.commonData.getProductCode()}`;
    return this.http.get<any>(completePath, {headers: this.headers} );
  }

  public submitFromRetrieveUnsigned(request: IssuedUndertakingRequest): Observable<any> {
    const requestPayload = {requestData: JSON.parse(JSON.stringify(request))};
    const completePath = this.contextPath + URLConstants.IU_SUBMIT_UNSIGNED;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
  }

  public submitFromReleaseReject(request: IssuedUndertakingRequest): Observable<any> {
    const requestPayload = {requestData: JSON.parse(JSON.stringify(request))};
    const completePath = this.contextPath + URLConstants.IU_SUBMIT_RELEASE_REJECT;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
  }

  public returnIssuedUndertaking(request: IssuedUndertakingRequest): Observable<any> {
    const requestPayload = {requestData: JSON.parse(JSON.stringify(request))};
    const completePath = this.contextPath + URLConstants.UNDERTAKING_RETURN;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
  }

  public downloadAttachment(attachmentId: string): Observable<HttpResponse<Blob>> {
    const completePath = `${this.contextPath}${URLConstants.DOWNLOAD}${attachmentId}`;
    return this.http.get(completePath, { responseType: 'blob', observe: 'response' });
  }

  public saveOrSubmitIUTemplate(path: string, request: IssuedUndertakingRequest): Observable<any> {
    const requestPayload = {requestData: JSON.parse(JSON.stringify(request))};
    return this.http.post<any>(path, requestPayload, {headers: this.headers});
  }

  public saveOrSubmitModifiedIUTemplate(path: string, request: TemplateIssuedUndertakingRequest): Observable<any> {
    const requestPayload = {requestData: JSON.parse(JSON.stringify(request))};
    return this.http.post<any>(path, requestPayload, {headers: this.headers});
  }

  public getIuTemplateDetails(templateId: string, productCode: string, subProductCode: string,
                              option: string): Observable<any> {
    const requestPayload = {requestData: {templateId, productCode, subProductCode, option}};
    const completePath = this.contextPath + URLConstants.GET_TEMPLATE_DETAILS;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
  }

  public getIuModifyTemplateDetails(templateId: string, productCode: string, subProductCode: string,
                                    option: string): Observable<any> {
    const requestPayload = {requestData: {templateId,  productCode, subProductCode,  option}};
    const completePath = this.contextPath + URLConstants.GET_MODIFY_TEMPLATE;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
  }

  public deleteTemplate(templateId: string, productCode: string, subProductCode: string,
                        option: string): Observable<any> {
    const requestPayload = {requestData: {templateId, productCode, subProductCode, option}};
    const completePath = this.contextPath + URLConstants.DELETE_TEMPLATE;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
  }

  public isTemplateUnique(templateId: string, productCode: string, subProductCode: string): Observable<any> {
    const requestPayload = {requestData: {templateId, productCode,
                                  subProductCode, option: ''}};
    const completePath = this.contextPath + URLConstants.IS_TEMPLATE_UNIQUE;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
  }

  public getIuBankTemplateDetails(templateId: string, guaranteeTypeName: string,
                                  productCode: string, companyId: string, option: string): Observable<any> {
const requestPayload = {requestData: {templateId, guaranteeTypeName, productCode, companyId, option}};
const completePath = this.contextPath + URLConstants.GET_BANK_TEMPLATE_DETAILS;
return this.http.post<any>(completePath, requestPayload, {headers: this.headers});
}

public downloadTemplateDocument(request: BanktemplateDownloadRequest): Observable<HttpResponse<Blob>> {
  const completePath = this.contextPath + URLConstants.DOWNLOAD_BANK_TEMPLATE;
  return this.http.post(completePath, request, { responseType: 'blob', observe: 'response' });
}

  public getProvisionalStatus(subProductCode: string, undertakingType: string) {
    const requestPayload = {requestData: {productCode: this.productCode, subProductCode, undertakingType}};
    const completePath = this.contextPath + URLConstants.PROVISIONAL_STATUS;
    return this.http.post<any>(completePath, requestPayload, {headers: this.headers} );
  }
}
