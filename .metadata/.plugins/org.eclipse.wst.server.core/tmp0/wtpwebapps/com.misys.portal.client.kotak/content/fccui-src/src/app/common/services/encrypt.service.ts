import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

declare let RSAKey: any;

@Injectable({ providedIn: 'root' })
export class EncryptionService {

  constructor(protected http: HttpClient, public fccGlobalConstantService: FccGlobalConstantService, 
    protected commonService: CommonService) {}

  encryptText(passPhrase: any, htmlUsedModulus: any, crSeq: any) {
      const jsencrypt = new RSAKey();
      jsencrypt.setPublic(htmlUsedModulus, '10001');
      return jsencrypt.encrypt(passPhrase) + crSeq;
  }

  public generateKeys(isForAPIParamEncryption = 'FALSE'): Observable<any> {
  const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON, 'API-Param-Encryption' : isForAPIParamEncryption });
  const reqUrl = `${this.fccGlobalConstantService.getGenerateKeysUrl()}`;
  const requestPayload = {};
  return this.http.post<any>(reqUrl, requestPayload, { headers });
  }

  getAPIParamEncryptionKeys() {
    this.generateKeys('TRUE').subscribe(keyDataResponse => {
      if (keyDataResponse.response === 'success') {
        const keys = keyDataResponse.keys;
        this.commonService.paramsEncryptionData.crSeq = keys.cr_seq;
        this.commonService.paramsEncryptionData.htmlUsedModulus = keys.htmlUsedModulus;
        setTimeout(()=>{
                  this.getAPIParamEncryptionKeys();
               }, this.commonService.getEncryptionKeysTimeoUt());
      }
    });
  }
}
