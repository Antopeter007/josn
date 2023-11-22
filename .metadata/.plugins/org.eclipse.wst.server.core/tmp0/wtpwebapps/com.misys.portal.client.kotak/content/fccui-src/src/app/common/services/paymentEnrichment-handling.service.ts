import { Injectable } from '@angular/core';
import { FccGlobalConstant } from '../core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})

export class PaymentEnrichmentHandlingService {
  handleEnrichmentGrid(sectionForm: any,jsonObj: any) {
    sectionForm.get("enrichmentListTable")[FccGlobalConstant.PARAMS][
      FccGlobalConstant.LIST_DATA
    ] = true;
    let data = [];
    if(jsonObj.paymentDetail[0].enrichmentDetails?.multiSet.length > 0)
    {
      data = jsonObj.paymentDetail[0].enrichmentDetails?.multiSet;
    } else if(jsonObj.paymentDetail[0].enrichmentDetails?.singleSet) {
      data.push(jsonObj.paymentDetail[0].enrichmentDetails?.singleSet);
    }
    sectionForm.get("enrichmentListTable")[FccGlobalConstant.PARAMS][FccGlobalConstant.DATA] = data;
    sectionForm.updateValueAndValidity();
  }
}
