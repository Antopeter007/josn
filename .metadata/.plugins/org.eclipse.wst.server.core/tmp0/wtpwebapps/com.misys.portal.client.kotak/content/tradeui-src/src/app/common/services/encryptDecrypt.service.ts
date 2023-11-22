import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from './common.service';
import { Injectable } from '@angular/core';
import { URLConstants } from '../urlConstants';
declare let RSAKey: any;

@Injectable({ providedIn: 'root' })
export class EncryptDecryptService {

  jsencrypt = new RSAKey();

  constructor(public commonService: CommonService, public http: HttpClient) {}

  contextPath = this.commonService.getContextPath();
  encryptText(passPhrase, htmlUsedModulus, crSeq) {
      this.jsencrypt.setPublic(htmlUsedModulus, '10001');
      return this.jsencrypt.encrypt(passPhrase) + crSeq;
  }

      generateKeys(): Observable<any> {
          const headers = new HttpHeaders({'Content-Type': 'application/json'});
          const requestPayload = {};
          const completePath = this.contextPath + URLConstants.GENERATE_KEYS;
          return this.http.post<any>(completePath, requestPayload, {headers});
         }



}
