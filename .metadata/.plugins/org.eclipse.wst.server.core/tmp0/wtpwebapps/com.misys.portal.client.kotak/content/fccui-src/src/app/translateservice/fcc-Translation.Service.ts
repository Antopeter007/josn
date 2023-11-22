import { TranslateLoader } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FccGlobalConstant } from '../common/core/fcc-global-constants';

const contextPath = window[FccGlobalConstant.CONTEXT_PATH];
const restServletName = window[FccGlobalConstant.RESTSERVLET_NAME];
@Injectable({ providedIn: 'root' })
export class FccTranslationService implements TranslateLoader {

    baseUrl = `${contextPath}${restServletName}/`;
    constructor(protected http: HttpClient) { }

    getTranslation(lang: string): Observable<any> {
      let loadLocalization = true;
      const displayLocalizationKeys = localStorage.getItem('displayLocalizationKeys');
      if(displayLocalizationKeys === undefined || displayLocalizationKeys === null 
        || displayLocalizationKeys === '' || displayLocalizationKeys === "false"){
       loadLocalization = true;
      }
      else if(displayLocalizationKeys === "true"){
       loadLocalization = false;
       }
       if(loadLocalization) {
         return forkJoin([
           this.http.get(`${this.baseUrl}getlocalizationdetails?language=${lang}`).pipe(),
           this.http.get(`${contextPath}/content/FCCUI/assets/i18n/${lang}/cash_${lang}.json`).pipe(),
           this.http.get(`${contextPath}/content/FCCUI/assets/i18n/${lang}/core_${lang}.json`).pipe(),
           this.http.get(`${contextPath}/content/FCCUI/assets/i18n/${lang}/loan_${lang}.json`).pipe(),
           this.http.get(`${contextPath}/content/FCCUI/assets/i18n/${lang}/trade_${lang}.json`).pipe(),
           this.getClientTranslationChanges(lang)
         ]).pipe(map(([res1, res2,res3,res4,res5,res6]) => Object.assign(res2,res3,res4,res5,res6,res1)));
        }
      return of({});
      
    }

    getClientTranslationChanges(lang:string){
      const isClientTranslation = sessionStorage.getItem('clientLocalization');
      if((isClientTranslation != null && typeof isClientTranslation != 'undefined') && isClientTranslation.toLowerCase()==='true'){
        return this.http.get(`${contextPath}/content/FCCUI/assets/i18n/client_${lang}.json`).pipe(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
           catchError(err => of({})));
      }else{
        return of({});
      } 
    }
 }
