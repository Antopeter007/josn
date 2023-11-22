import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { CodeData } from '../model/codeData';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class CodeDataService {

  codeData = new CodeData();
  options = 'options';

  constructor(protected http: HttpClient, protected fccGlobalConstantService: FccGlobalConstantService,
              protected commonService: CommonService, protected translate: TranslateService) { }

  getCodeData(codeID: any, productCode: any, subProductCode: any, form: any, elementId: any) {
    this.codeData.codeId = codeID;
    this.codeData.productCode = productCode;
    this.codeData.subProductCode = subProductCode;
    this.codeData.language = localStorage.getItem('language') !== null ? localStorage.getItem('language') : '';
    const eventDataArray = [];
    if (form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS].length === 0 ) {
      this.commonService.getCodeDataDetails(this.codeData).subscribe(response => {
      response.body.items.sort((a, b) => (a.order > b.order) ? 1 : -1);
      response.body.items.forEach(responseValue => {
          const eventData: { label: string; value: any; id: any } = {
            label: responseValue.longDesc,
            value: responseValue.value,
            id: elementId.concat('_').concat(responseValue.value)
          };
          eventDataArray.push(eventData);
        });
      });
    } else {
      const formOptions = form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      formOptions.forEach(formOption => {
        const eventData: { label: string; value: any; id: any } = {
          label: formOption.label,
          value: formOption.value,
          id: formOption.id
        };
        eventDataArray.push(eventData);
      });
    }
    return eventDataArray;
  }

  getCodeDataWithEmptyVal(codeID: any, productCode: any, subProductCode: any, form: any, elementId: any) {
    this.codeData.codeId = codeID;
    this.codeData.productCode = productCode;
    this.codeData.subProductCode = subProductCode;
    this.codeData.language = localStorage.getItem('language') !== null ? localStorage.getItem('language') : '';
    const eventDataArray = [];
    const emptyEventData: { label: string; value: any; id: any } = {
      label: '',
      value: '',
      id: ''
    };
    if (form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS].length === 0 ) {
      eventDataArray.push(emptyEventData);
      this.commonService.getCodeDataDetails(this.codeData).subscribe(response => {
      response.body.items.sort((a, b) => (a.order > b.order) ? 1 : -1);
      response.body.items.forEach(responseValue => {
          const eventData: { label: string; value: any; id: any } = {
            label: responseValue.longDesc,
            value: responseValue.value,
            id: elementId.concat('_').concat(responseValue.value)
          };
          eventDataArray.push(eventData);
        });
      });
    } else {
      const formOptions = form.get(elementId)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      formOptions.forEach(formOption => {
        const eventData: { label: string; value: any; id: any } = {
          label: formOption.label,
          value: formOption.value,
          id: formOption.id
        };
        eventDataArray.push(eventData);
      });
    }
    return eventDataArray;
  }

  getPackages(isPackageRequired: boolean) {
    const eventDataArrayValue = [];
    this.commonService.getPackagesValues(isPackageRequired).subscribe(response => {
      if (response) {
        response.body.forEach(responseValue => {
          const eventDataValue: { label: string; value: any; id: any } = {
            label: responseValue.mypdescription,
            id: responseValue.mypproduct,
            value: {
              label: responseValue.mypdescription,
              shortName: responseValue.mypdescription,
            },
          };
          eventDataArrayValue.push(eventDataValue);
        });
      }
    });
    return eventDataArrayValue;
  }
}
