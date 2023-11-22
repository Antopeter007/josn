/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpInterceptor, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, finalize, retry, shareReplay, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommonService } from './common/services/common.service';
import { FccGlobalConstant } from './common/core/fcc-global-constants';
import { FccGlobalConfiguration } from './common/core/fcc-global-configuration';
import { FccGlobalConstantService } from './common/core/fcc-global-constant.service';
import { SessionValidateService } from './common/services/session-validate-service';
import { EncryptionService } from './common/services/encrypt.service';

@Injectable()
export class Interceptor implements HttpInterceptor {

   constructor(protected router: Router, protected commonService: CommonService,
               protected fccGlobalConfiguration: FccGlobalConfiguration, protected fccGlobalConstantService: FccGlobalConstantService,
               protected sessionValidation: SessionValidateService, protected encryptionService: EncryptionService) {
   }
   isNested = false;

   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (req && req.body && Object.prototype.hasOwnProperty.call(req.body, 'captcha')) {
      this.commonService.interceptorRetry = 0;
      }
      if (req.method === 'GET' && this.commonService.getClientSideSensitiveParamsEncryption())
      {
         req = this.handleEncryption(req);
      }
      let encodedUrl = req.url;
      // The URL Parameters are in general encoded by angular.
      //  However in some cases the same is byepassed as the entire URL including request parameters
      //   are handled as a single URL. Here such URLs will be catched and the request parameters are encoded
      if (encodedUrl.indexOf('?') > -1) {
            encodedUrl = req.url.substr(0, req.url.indexOf('?') + 1) +
               req.url.substr(req.url.indexOf('?') + 1).split('&').map(s => encodeURI(s)).join('&');
      }

      let cachedRequest = false;

      // Hard coded URL for model as there are other places which are failing.
      if (encodedUrl.indexOf(this.fccGlobalConstantService.productModelUrl) > -1) {
         encodedUrl = req.urlWithParams;
      }

      // To return the cached response if any for the get requests
      //  which are marked for caching by the header cache-request as true
      if (req.method === 'GET' && req.headers.get('cache-request') === 'true') {
         // console.log('this is a cached request' + encodedUrl);
         cachedRequest = true;
      }

      let authReq = null;
      // This is to handle the request with httpparams. Currently only model is having the httpparams and hence hard coded.
      if (encodedUrl.indexOf(this.fccGlobalConstantService.productModelUrl) > -1) {
         authReq = req.clone({
            setHeaders: {
               'Cache-Control': 'no-cache',
               Pragma: 'no-cache'
            }
         });
      } else {
         authReq = req.clone({
            setHeaders: {
               'Cache-Control': 'no-cache',
               Pragma: 'no-cache'
            },
            url: encodedUrl
         });
      }

      if (req.method === 'POST' || req.method === 'PUT') {
         return next.handle(authReq)
         .pipe(tap(),
            catchError((error: HttpErrorResponse) => this.handleError(error))
         );
      } else if (cachedRequest) {
         if (!this.commonService.availableInCache(authReq)) {
            const response = next.handle(authReq)
               .pipe(tap(),
                  shareReplay({ refCount: true, bufferSize: FccGlobalConstant.CACHE_BUFFER_SIZE }),
                  retry(this.commonService.interceptorRetry),
                  catchError((error: HttpErrorResponse) => this.handleError(error, authReq))
               );
               this.commonService.setToCache(authReq, response);
         }
         return this.commonService.getFromCache(authReq);
      } else {
         return next.handle(authReq)
         .pipe(tap(event => {
            if (cachedRequest) {
               if (event instanceof HttpResponse) {
                  this.commonService.getCachedResponses().set(encodedUrl, event.clone());
                  // console.log('adding the entry: ' + encodedUrl + ',  at length' + this.commonService.getCachedResponses().size);
               }
            }
         }),
            retry(this.commonService.interceptorRetry),
            catchError((error: HttpErrorResponse) => this.handleError(error))
         );
      }
   }

   private handleError(error: HttpErrorResponse, cacheRequest?: HttpRequest<any>): Observable<never> | undefined {
      if(this.commonService.isnonEMptyString(cacheRequest)){
         this.commonService.deleteFromCache(cacheRequest);
      }
      if ((error.status === FccGlobalConstant.LENGTH_0 || error.status === FccGlobalConstant.STATUS_404)
               && !(error.url.indexOf(FccGlobalConstant.NULL_JSON) > -1)) {
             if (this.commonService.commonErrPage === 'true') {
               this.commonService.errorStatus = error.status;
               const dontShowRouter = 'dontShowRouter';
               const servletName = window[FccGlobalConstant.SERVLET_NAME];
               const contextPath = this.commonService.getContextPath();
               const isUrlAcceptable = servletName && window.location.pathname + '#' === (contextPath + servletName) + '#';
               if (window[dontShowRouter] && window[dontShowRouter] === true && !isUrlAcceptable) {
                  const replaceurl = window.location.pathname;
                  window.open(replaceurl, '_self');
               } else {
                  this.router.navigate(['/error']);
               }
         } else {
            // For localization file urls error removing the error page re-direct
            if (error.url.indexOf('/assets/i18n') > -1) {
               return throwError(error);
            }
            this.router.navigate(['/error']);
         }
         return throwError(error);
      } else if (this.commonService.commonErrPage === 'true') {
         if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            // eslint-disable-next-line no-console
            console.log('An error occurred:', error.error.message);
         } else {
            // The backend returned an unsuccessful response code.
            this.commonService.errorStatus = error.status;
            if (this.commonService.errorList.indexOf(error.status.toFixed()) > -1 &&
               !(this.router.url === '/login' && error.status === FccGlobalConstant.STATUS_401)) {
               // 401: Unauthorized Access
               this.router.navigate(['/error']);
            }
            // return an observable with a user-facing error message
            return throwError(error);
         }
      } else if (!(this.commonService.invalidSessionLandingPages &&
         (this.commonService.invalidSessionLandingPages.indexOf(this.router.url) > -1)) && 
         (error.error && error.error.message && error.error.message === FccGlobalConstant.SESSION_INVALID)) {
         this.sessionValidation.IsSessionValid();
      } else {
         return throwError(error);
      }
   }
   private handleEncryption(encriptReq){
      if(encriptReq.params.map === null){
        const paramData = encriptReq.url.substr(encriptReq.url.indexOf('?') + 1).split('&');
        if(paramData.length > 0){
         const paramMap = this.extractParametersFromUrl(encriptReq.url);
         for (let index = 0; index < this.commonService.getListClientSideParamsEncryption().length; index++) {
            const element = this.commonService.getListClientSideParamsEncryption()[index];
            if(paramMap.has(element)){
               this.isNested = false;
               encriptReq = this.returnConvertedRequest(encriptReq,encriptReq.url,element);
            }
         } 
        }
      }else if(encriptReq.params.map.size != 0){
         const paramData = encriptReq.urlWithParams.substr(encriptReq.urlWithParams.indexOf('?') + 1).split('&');
        if(paramData.length > 0){
         const paramMap = this.extractParametersFromUrl(encriptReq.urlWithParams);
         for (let index = 0; index < this.commonService.getListClientSideParamsEncryption().length; index++) {
            const element = this.commonService.getListClientSideParamsEncryption()[index];
            if(element.indexOf('$$') >= 0){
               const eleSplitValue = element.split('$$');
               if(paramMap.has(eleSplitValue[0])){
                   encriptReq = this.returenNestedConvertedRequest(encriptReq,eleSplitValue[0],eleSplitValue[1]);
               }
            }else if(paramMap.has(element)){
               this.isNested = true;
               encriptReq = this.returnConvertedRequest(encriptReq,encriptReq.urlWithParams,element); 
            }
         }
        }
      }
      return encriptReq;
   }
   private extractParametersFromUrl(url: string): Map<string, string> {
      const paramMap = new Map<string, string>();
  
      // Extract the query string from the URL
      const queryString = url.split('?')[1];
  
      if (queryString) {
        // Split the query string into individual parameters
        const queryParams = queryString.split('&');
  
        // Loop through each parameter and extract the key and value
        for (const param of queryParams) {
          const [key, value] = param.split('=');
          // Decode the URI-encoded value before storing it in the map
          paramMap.set(key, decodeURIComponent(value));
        }
      }
  
      return paramMap;
    }
   
    private returnConvertedRequest(encriptReq,encryptedUrl,param){
      const paramMap = this.extractParametersFromUrl(encriptReq.urlWithParams);
         const encryptedValue = this.encryptionService.encryptText(paramMap.get(param),
         this.commonService.paramsEncryptionData.htmlUsedModulus,this.commonService.paramsEncryptionData.crSeq);
         encryptedUrl = encriptReq.urlWithParams.replace(
            new RegExp(`${param}=[^&]*`),
            `${param}=${encryptedValue}`
         );
         if(!this.isNested){
            encriptReq = encriptReq.clone({
               url: encryptedUrl
            });
         }else{
            if(encriptReq.params.map != null && encriptReq.params.map.size != 0){
               encriptReq.params.map.set(param,[encodeURIComponent(encryptedValue)]);
            }
            encriptReq = encriptReq.clone({
               urlWithParams: encryptedUrl
            });
         }
         return encriptReq;
   }
   private returenNestedConvertedRequest(encriptReq,mainParam,subParam){
      if(this.commonService.isnonEMptyString(mainParam) &&
      this.commonService.isnonEMptyString(subParam)){
          const decodeUrl = decodeURIComponent(encriptReq.urlWithParams).split('?');
          let decodeUrlParamValue = [];
          decodeUrlParamValue = decodeUrl[1].split('&');
          decodeUrlParamValue = decodeUrlParamValue.reduce(function(a,b){
             if (a.indexOf(b) < 0 ) {
               a.push(b);
             }
             return a;
           },[]);
          for (let index = 0; index < decodeUrlParamValue.length; index++) {
             const paramElement = decodeUrlParamValue[index];
             if(paramElement.split('=')[0] == mainParam){
               if (!this.isJSON(paramElement.split('=')[1]))
               {
                  return encriptReq;
               }
                  const subParamValue = JSON.parse(paramElement.split('=')[1]);
                  if (this.commonService.isnonEMptyString(subParamValue[subParam]))
                  {
                     subParamValue[subParam] = this.encryptionService.encryptText(subParamValue[subParam],
                        this.commonService.paramsEncryptionData.htmlUsedModulus,this.commonService.paramsEncryptionData.crSeq);
                     if(encriptReq.params.map != null && encriptReq.params.map.size != 0){
                        encriptReq.params.map.set(mainParam,[JSON.stringify(subParamValue)]);
                     }
                     for (let i=0; i < decodeUrlParamValue.length; i++) {
                      const element = decodeUrlParamValue[i];
                      if(element === paramElement){
                         decodeUrlParamValue[i] = mainParam + "=" + JSON.stringify(subParamValue);
                      }
                     }
                     const subParamData = decodeUrlParamValue.join('&');
                     const finalUrl = decodeUrl[0]+'?'+ encodeURIComponent(subParamData);
                     encriptReq = encriptReq.clone({
                      urlWithParams: finalUrl
                   });
                  }
                return encriptReq;
             }           
          }
      }
    }
    private isJSON(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    }
}
