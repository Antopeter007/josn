import { FccConstants } from './../core/fcc-constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class FccHelpService {
key;
widgetCodeKey;
helpsectionId = new BehaviorSubject<string>('GD');

  sectionId: string;
  constructor(protected http: HttpClient, protected fccGlobalConstantService: FccGlobalConstantService) { }

  /**
   * API call for getting help contents of a section
   * access key configured to be used based on convention from component and db
   *
   * @param params - access key
   */
  public getHelpSection(params: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': FccGlobalConstant.APP_JSON });
    const completePath = this.fccGlobalConstantService.getHelpSectionUrl(params);

    return this.http.get<any>(completePath, { headers, observe: 'body' });

  }

helpKeyProductListing(productCode, subProductCode) {
    if (subProductCode && subProductCode !== 'null' && subProductCode !== undefined &&
    subProductCode !== null && subProductCode !== FccGlobalConstant.EMPTY_STRING) {
      this.key = productCode.concat('_').concat(subProductCode).concat('_LP_UX');
    } else {
     this.key = productCode.concat('_LP_UX');
    }
    return this.key;
}

helpKeyTabPanelListing(widgetCode) {
  this.widgetCodeHelpKeys(widgetCode);
  this.key = this.widgetCodeKey.concat(FccConstants.LP_UX);
  return this.key;
}

helpKeyProductListingTemplate(productCode, subProductCode) {
  if (subProductCode && subProductCode !== 'null' && subProductCode !== undefined &&
   subProductCode !== null && subProductCode !== FccGlobalConstant.EMPTY_STRING) {
    this.key = productCode.concat('_').concat(subProductCode).concat('_TM_UX');
  } else {
   this.key = productCode.concat('_TM_UX');
  }
  return this.key;
}

helpKeyProductScreen(productCode, subProductCode) {
  this.helpsectionId.subscribe(value => {
    if (value) {
      this.sectionId = value;
    }}
  );
  if (subProductCode && subProductCode !== 'null' && subProductCode !== undefined &&
   subProductCode !== null && subProductCode !== FccGlobalConstant.EMPTY_STRING) {
    if (this.sectionId !== FccGlobalConstant.PREVIEW_DETAILS) {
      this.key = productCode.concat('_').concat(subProductCode).concat('_').concat(this.sectionId).concat('_UX');
    } else {
      this.key = productCode.concat('_').concat(subProductCode).concat('_').concat('PV').concat('_UX');
    }
  } else {
    if (this.sectionId !== FccGlobalConstant.PREVIEW_DETAILS) {
      this.key = productCode.concat('_').concat(this.sectionId).concat('_UX');
    } else {
      this.key = productCode.concat('_').concat('PV').concat('_UX');
    }
  }
  return this.key;
}

helpKeyReviewScreen(productCode, subProductCode) {
  if (subProductCode && subProductCode !== 'null' && subProductCode !== undefined &&
   subProductCode !== null && subProductCode !== FccGlobalConstant.EMPTY_STRING) {
    this.key = productCode.concat('_').concat(subProductCode).concat('_DETAIL_UX');
  } else {
   this.key = productCode.concat('_DETAIL_UX');
  }
  return this.key;
  }

  widgetCodeHelpKeys(widgetCode) {
    switch (widgetCode) {
      case FccConstants.ALL_ACCOUNTS:
      case FccConstants.DEPOSITACCOUNTS:
      case FccConstants.LOANACCOUNTS:
        this.widgetCodeKey = FccConstants.ACOUNT_SUMMARY;
        break;
      case FccConstants.CHEQUE_SERVICES:
        this.widgetCodeKey = FccConstants.CHEQUE_SERVICES_CODE;
        break;
      default:
        this.widgetCodeKey = FccGlobalConstant.EMPTY_STRING;
        break;
    }
    return this.widgetCodeKey;

  }

}
