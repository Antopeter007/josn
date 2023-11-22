
import { CommonService } from './common.service';
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { Injectable } from '@angular/core';
import { ProductParams } from '../model/params-model';
import { FccConstants } from '../core/fcc-constants';

@Injectable({
  providedIn: 'root'
})
export class FormSubmitService {

  constructor(protected commonService: CommonService) { }

  modelobject: any;



  loadModel(productCodeValue ?: any, categoryValue?, subproductcode?) {
    const params: ProductParams = {
      type: FccGlobalConstant.MODEL_SUBMIT,
      productCode: productCodeValue,
      category: categoryValue,
      subProductCode: subproductcode
    };
    return this.commonService.getProductModel(params);
  }


  async getButtonPermission(allButtons, productcode, subproductcode, tnxtypecode, action, subTnxTypeCode) {

    const buttonItemList = allButtons;

    const buttonPermission = new Map();

    const permission = 'permission';
    const render = 'render';
    const applicablescreen = 'applicablescreen';
    const displayparams = 'diplayparams';
    const actionmodel = 'action';
    const productcodeconst = productcode;
    const subproductcodeconst = subproductcode;
    const tnxtypecodeconst = tnxtypecode;
    const actionconst = action;
    const subTnxTypeCodeConst = subTnxTypeCode;

    const displayparamCombo1 = productcodeconst + '_' + tnxtypecodeconst;
    const displayparamCombo2 = productcodeconst + '_' + tnxtypecodeconst + '_' + subproductcodeconst;
    let displayparamCombo3 = '';
    const displayparamCombo4 = productcodeconst + '_' + tnxtypecodeconst + '_' + subTnxTypeCodeConst;
    let displayparamCombo5;
    if (productcodeconst === FccConstants.PRODUCT_TYPE_BENEFECIARY ||
      productcodeconst === FccConstants.PRODUCT_CODE_BENE_MAINTENANCE ||
      productcodeconst === FccConstants.PRODUCT_IN || productcodeconst === FccConstants.PRODUCT_BT) {
      displayparamCombo5 = productcodeconst;
    }

    if (action === FccGlobalConstant.TEMPLATE) {
      displayparamCombo3 = productcodeconst + '_' + FccGlobalConstant.TEMPLATE;
    }

    for (let i = 0; i < allButtons.length; i++) {
         buttonPermission.set(allButtons[i][permission], false);
    }

    this.commonService.getButtonPermission(buttonPermission).subscribe(buttonPermissionsReturned => {
      buttonItemList.forEach( buttonObj => {
      if (action === FccGlobalConstant.TEMPLATE) {
          if ((buttonPermissionsReturned.get(buttonObj[permission]) === true || buttonObj[permission] === 'no_permission') &&
                (((buttonObj[applicablescreen][displayparams].indexOf(displayparamCombo1) > -1) ||
                (buttonObj[applicablescreen][displayparams].indexOf(displayparamCombo2) > -1 ) ||
                (buttonObj[applicablescreen][displayparams].indexOf(displayparamCombo4) > -1 ) ||
                buttonObj[applicablescreen][displayparams].indexOf(displayparamCombo3) > -1) &&
                buttonObj[applicablescreen][actionmodel].indexOf(actionconst) > -1)) {
                  buttonObj[render] = true;
              }
          } else if (productcodeconst === FccConstants.PRODUCT_TYPE_BENEFECIARY ||
            productcodeconst === FccConstants.PRODUCT_CODE_BENE_MAINTENANCE ||
            productcodeconst === FccConstants.PRODUCT_IN || productcodeconst === FccConstants.PRODUCT_BT) {
              if ((buttonPermissionsReturned.get(buttonObj[permission]) === true || buttonObj[permission] === 'no_permission') &&
              (buttonObj[applicablescreen][displayparams].indexOf(displayparamCombo5) > -1 )) {
                buttonObj[render] = true;
              }
            } else {
                if ((buttonPermissionsReturned.get(buttonObj[permission]) === true || buttonObj[permission] === 'no_permission') &&
                (((buttonObj[applicablescreen][displayparams].indexOf(displayparamCombo1) > -1) ||
                (buttonObj[applicablescreen][displayparams].indexOf(displayparamCombo4) > -1) ||
                (buttonObj[applicablescreen][displayparams].indexOf(displayparamCombo2) > -1)) &&
                buttonObj[applicablescreen][actionmodel].indexOf(actionconst) > -1)) {
                  buttonObj[render] = true;
              }
          }

      });
    });

    return buttonItemList;
  }

}

