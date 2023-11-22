import { FccGlobalConstant } from '../../../common/core/fcc-global-constants';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class SystemFeatureCommonDataService {

  emptyString = 'KEY_EMPTYSTRING';
  constructor(protected translateService: TranslateService) { }

  public getBeneficiaryLargeParamDataResponse(response: any, bankName: string,
                                              language: string, elementId: any, product: string) {
    let productTypeList = [];
    const paramDetails = response.largeParamDetails;
    for (let i = 0; i < paramDetails.length; i++) {
      const keyDetails = paramDetails[i].largeParamKeyDetails;
      if (keyDetails.key_1 !== null) {
        if (keyDetails.key_1 !== '*' && keyDetails.key_2 === product && keyDetails.key_1 === bankName &&
          keyDetails.key_4 === language) {
          for (let j = 0; j < paramDetails[i].largeParamDataList.length; j++) {
            if (paramDetails[i].largeParamDataList[j].data_2 === FccGlobalConstant.CODE_Y) {
              if (productTypeList.length === FccGlobalConstant.ZERO) {
                productTypeList = [{ label: paramDetails[i].largeParamDataList[j].data_1,
                value: paramDetails[i].largeParamDataList[j].data_2 }];
              } else if (productTypeList.length > 0 && productTypeList[0].value !== '' ||
                          productTypeList[0].value !== null) {
                productTypeList.push({ label: paramDetails[i].largeParamDataList[j].data_1,
                value: paramDetails[i].largeParamDataList[j].data_2,
                id: elementId.concat('_').concat(paramDetails[i].largeParamDataList[j].data_2) });
              }
            }

          }
        } else if (keyDetails.key_1 === '*' && keyDetails.key_2 === product && keyDetails.key_4 === language) {
            for (let j = 0; j < paramDetails[i].largeParamDataList.length; j++) {
                if (productTypeList.length === FccGlobalConstant.ZERO) {
                  productTypeList = [{ label: paramDetails[i].largeParamDataList[j].data_2,
                  value: paramDetails[i].largeParamDataList[j].data_1 }];
                } else if (productTypeList.length > 0 && productTypeList[0].value !== '' ||
                            productTypeList[0].value !== null) {
                  productTypeList.push({ label: paramDetails[i].largeParamDataList[j].data_2,
                  value: paramDetails[i].largeParamDataList[j].data_1,
                  id: elementId.concat('_').concat(paramDetails[i].largeParamDataList[j].data_1) });
                }
            }
          }
      }
    }
    return productTypeList;
  }
}

