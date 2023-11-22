import { FccGlobalConstant } from './../../../../common/core/fcc-global-constants';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class TradeCommonDataService {
  byCollection = 'BY_COLLECTION';
  byCourier = 'BY_COURIER';
  other = 'BY_OTHER';
  byMessengerHandDeliver = 'BY_MESSENGER';
  byRegisteredMailOrAirmail = 'BY_REGISTERED_MAIL';
  byMail = 'BY_MAIL';
  emptyString = 'KEY_EMPTYSTRING';
  constructor(protected translateService: TranslateService) { }

  public getIncDecOperation(key): string {
    const operationMap = new Map();
    operationMap.set('01', 'bgOperationType_01');
    operationMap.set('02', 'bgOperationType_02');
    return this.translateService.instant(operationMap.get(key));
  }

  public getPeriodOptions(key: string): any {
    const period = [
      { value: 'D',
     label: this.translateService.instant('Days') , code : 'D' },
      { value: 'W' ,
     label: this.translateService.instant('weeks'), code : 'W' },
      { value: 'M',
     label: this.translateService.instant('Months'), code : 'M' },
      { value: 'Y',
     label: this.translateService.instant('years'), code : 'Y' },
      ];
    const arrayToObject = (array, keyField) =>
          array.reduce((obj, item) => {
          obj[item[keyField]] = item;
          return obj;
   }, {});
    if (key !== '' && key !== null ) {
      const obj = arrayToObject(period, 'value');
      return obj[key].label;
    } else {
      return period;
    }
  }

  public getBgDelvOrgUndertaking(key: string): any {

    const period = [
      { value: '',
     label: this.translateService.instant(this.emptyString) , code : '00' },
      { value: '01',
     label: this.translateService.instant(this.byCollection) , code : '01' },
      { value: '02' ,
     label: this.translateService.instant(this.byCourier), code : '02' },
      { value: '99',
     label: this.translateService.instant(this.other), code : '99' },
      { value: '04',
     label: this.translateService.instant(this.byMessengerHandDeliver), code : '04' },
     { value: '05',
     label: this.translateService.instant(this.byRegisteredMailOrAirmail), code : '05' },
     { value: '03',
     label: this.translateService.instant(this.byMail), code : '03' },
      ];
    const arrayToObject = (array, keyField) =>
          array.reduce((obj, item) => {
          obj[item[keyField]] = item;
          return obj;
   }, {});
    if (key !== '' && key !== null ) {
      const obj = arrayToObject(period, 'value');
      return obj[key].label;
    } else {
      return period;
    }
  }

  public getContractTypeOptions(key: string): any {
    const contractTypeOptions = [
    { value: '',
    label: this.translateService.instant(this.emptyString) , code : 'EMPT' },
    { value: 'TEND',
    label: this.translateService.instant('KEY_TENDER') , code : 'TEND' },
    { value: 'ORDR',
    label: this.translateService.instant('KEY_ORDER') , code : 'ORDR' },
    { value: 'CONT',
    label: this.translateService.instant('KEY_CONTRACT') , code : 'CONT' },
    { value: 'OFFR',
    label: this.translateService.instant('KEY_OFFER') , code : 'OFFR' },
    { value: 'DELV',
    label: this.translateService.instant('KEY_DELIVERY') , code : 'DELV' },
    { value: 'PINV',
    label: this.translateService.instant('KEY_PROFORMA_INVOICE') , code : 'PINV' },
    { value: 'PROJ',
    label: this.translateService.instant('KEY_PROJECT') , code : 'PROJ' }
  ];
    const arrayToObject = (array, keyField) =>
    array.reduce((obj, item) => {
    obj[item[keyField]] = item;
    return obj;
  }, {});
    if (key !== '' && key !== null ) {
      const obj = arrayToObject(contractTypeOptions, 'value');
      return obj[key].label;
    } else {
      return contractTypeOptions;
  }
  }

  public getDeliveryToParamData(response: any, bankName: string, language: string, elementId: any, product: string) {
    let deliveryList = [];
    const paramDetails = response.largeParamDetails;
    for (let i = 0; i < paramDetails.length; i++) {
      const keyDetails = paramDetails[i].largeParamKeyDetails;
      if (keyDetails.key_1 !== null) {
        if (keyDetails.key_1 !== '*' && keyDetails.key_2 === product && keyDetails.key_1 === bankName &&
          keyDetails.key_4 === language) {
          for (let j = 0; j < paramDetails[i].largeParamDataList.length; j++) {
            if (paramDetails[i].largeParamDataList[j].data_2 === FccGlobalConstant.CODE_Y) {
              if (deliveryList.length === FccGlobalConstant.ZERO) {
                deliveryList = [{ label: paramDetails[i].largeParamDataList[j].data_1,
                value: paramDetails[i].largeParamDataList[j].data_3 }];
              } else if (deliveryList.length > 0 && deliveryList[0].value !== '' || deliveryList[0].value !== null) {
                deliveryList.push({ label: paramDetails[i].largeParamDataList[j].data_1,
                value: paramDetails[i].largeParamDataList[j].data_3,
                id: elementId.concat('_').concat(paramDetails[i].largeParamDataList[j].data_3) });
              }
            }

          }
        } else if (keyDetails.key_1 === '*' && keyDetails.key_2 === product && keyDetails.key_4 === language) {
            for (let j = 0; j < paramDetails[i].largeParamDataList.length; j++) {
              if (paramDetails[i].largeParamDataList[j].data_2 === FccGlobalConstant.CODE_Y) {
                if (deliveryList.length === FccGlobalConstant.ZERO) {
                  deliveryList = [{ label: paramDetails[i].largeParamDataList[j].data_1,
                  value: paramDetails[i].largeParamDataList[j].data_3 }];
                } else if (deliveryList.length > 0 && deliveryList[0].value !== '' || deliveryList[0].value !== null) {
                  deliveryList.push({ label: paramDetails[i].largeParamDataList[j].data_1,
                  value: paramDetails[i].largeParamDataList[j].data_3,
                  id: elementId.concat('_').concat(paramDetails[i].largeParamDataList[j].data_3) });
                }
              }

            }
          }
      }
    }
    return deliveryList;
  }
}
