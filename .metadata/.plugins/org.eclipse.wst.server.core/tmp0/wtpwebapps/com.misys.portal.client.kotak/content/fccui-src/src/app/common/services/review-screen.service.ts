import { ImportLetterOfCredit } from './../../corporate/trade/lc/initiation/model/importLetterOfCredit';
import { FccGlobalConstant } from './../core/fcc-global-constants';
import { Observable } from 'rxjs';
import { FccGlobalConstantService } from './../core/fcc-global-constant.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChargesDetailsRequest } from '../model/review.model';

@Injectable({
providedIn: 'root'
})

export class ReviewScreenService {
    contentType = 'Content-Type';
    contextPath = window[FccGlobalConstant.CONTEXT_PATH];
    constructor(protected http: HttpClient,
                protected fccGlobalConstantService: FccGlobalConstantService,
                protected fccGlobalConstant: FccGlobalConstant
                ) {}

    getImportLetterOFCredit(eventID): Observable<any> {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        const completePath = `${this.fccGlobalConstantService.getImportLetterOFCredit}${eventID}`;
        return this.http.get<ImportLetterOfCredit>(completePath, { headers });
    }

    getExportLetterOFCredit(eventID): Observable<any> {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        const completePath = `${this.fccGlobalConstantService.getExportLetterOFCredit}${eventID}`;
        return this.http.get<any>(completePath, { headers });
    }

    getExportCollection(eventID): Observable<any> {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        const completePath = `${this.fccGlobalConstantService.getExportCollection}${eventID}`;
        return this.http.get<any>(completePath, { headers });
    }

    getImportCollection(eventID): Observable<any> {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        const completePath = `${this.fccGlobalConstantService.getImportCollection}${eventID}`;
        return this.http.get<any>(completePath, { headers });
    }

    getFileAttachments(refId, productCode): Observable<any> {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        obj[FccGlobalConstant.REQUEST_FORM] = FccGlobalConstant.REQUEST_INTERNAL;
        const headers = new HttpHeaders(obj);
        const request = { refId, productCode };
        const completePath = `${this.fccGlobalConstantService.getAttachDocument}`;
        return this.http.post<any>(completePath, request, { headers });
    }

    getFeeAndChargesData(request: ChargesDetailsRequest): Observable<any> {
      const obj = {};
      obj[this.contentType] = FccGlobalConstant.APP_JSON;
      const headers = new HttpHeaders(obj);
      const completePath = `${this.fccGlobalConstantService.getConsolidatedChargeDetails}`;
      return this.http.post<any>(completePath, request, { headers } );
    }

    getDocumentDetails(refId, productCode): Observable<any> {
        const obj = {};
        obj[this.contentType] = FccGlobalConstant.APP_JSON;
        const headers = new HttpHeaders(obj);
        const completePath = `${this.fccGlobalConstantService.getDocumentDetails}?refId=${refId}&productCode=${productCode}`;
        return this.http.get<any>(completePath, { headers });
    }


}
