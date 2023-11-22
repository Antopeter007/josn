
import { FormLayoutService } from './../../corporate/trade/lc/initiation/services/form-layout.service';

/**
 * Service to retrieve the product form model.
 */
import { FccGlobalConstant } from '../core/fcc-global-constants';
import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { CommonService } from './common.service';
import { Router } from '@angular/router';
import { ProductParams } from '../model/params-model';
import { FccGlobalConstantService } from '../core/fcc-global-constant.service';



@Injectable({
  providedIn: 'root'
})

export class FormModelService {
  option: any;
  tnxTypeCode: any;
  mode: any;
  subTnxTypeCode: any;
  operation: any;
  subProductCode: any;
  params: ProductParams;
  subSectionJson: any;
  category: any;
  constructor(protected formLayout: FormLayoutService, protected commonService: CommonService,
              protected router: Router, protected fccGlobalConstantService: FccGlobalConstantService) {}
  /**
   * This method is used to retrun the product form model
   * Here LCFomrModel is specified this model will be retrieved from server.
   * TODO: Retrieve the model from http request using productCode as parameter.
   */
  public getFormModel(productCode: string , tnxTypeCodeParam?: any, subTnxTypeCode?: any, option?: any): Observable<any> {

    if (this.commonService.isnonEMptyString(option)) {
      this.option = option;
    }else {
      this.option = this.commonService.getQueryParametersFromKey('option');
    }
    this.operation = this.commonService.getQueryParametersFromKey('operation');
    this.subProductCode = this.commonService.getQueryParametersFromKey('subProductCode');
    this.category = this.commonService.getQueryParametersFromKey('category');

    if (subTnxTypeCode !== undefined && subTnxTypeCode !== '' && subTnxTypeCode !== null) {
      this.subTnxTypeCode = subTnxTypeCode;
    } else {
      this.subTnxTypeCode = this.commonService.getQueryParametersFromKey('subTnxTypeCode');
    }

    if (tnxTypeCodeParam !== undefined && tnxTypeCodeParam !== '' && tnxTypeCodeParam !== null) {
      this.tnxTypeCode = tnxTypeCodeParam;
    } else {
      this.tnxTypeCode = this.commonService.getQueryParametersFromKey('tnxTypeCode');
    }
    this.mode = this.commonService.isViewPopup ? FccGlobalConstant.VIEW_MODE : this.commonService.getQueryParametersFromKey('mode');


    this.params = {
      productCode,
      type: FccGlobalConstant.MODEL_FORM,
      tnxTypeCode: this.tnxTypeCode,
      subTnxTypeCode: this.subTnxTypeCode,
      subProductCode: this.subProductCode,
      operation: this.operation,
      mode: this.mode,
      option: this.option,
      category: this.category
    };

    // return this.getProductFormModel(productCode);
    return this.commonService.getProductModel(this.params);
  }

  /**
   * event details form model
   */
  public getFormModelForEvent() {

    const productCode = this.commonService.getQueryParametersFromKey('productCode');
    this.subProductCode = this.commonService.getQueryParametersFromKey('subProductCode');
    const params: ProductParams = {
      productCode,
      type: FccGlobalConstant.MODEL_EVENT,
      subProductCode: this.subProductCode
    };
    return this.commonService.getProductModel(params);
  }

/**
 * get subsection model from API if not already initialized
 */
public getSubSectionModelAPI(): Observable<any> {
  const params: ProductParams = {
    type: FccGlobalConstant.MODEL_SUBSECTION
  };
  return this.subSectionJson ? of(this.subSectionJson) : this.commonService.getProductModel(params);
}

public getSubSectionModel() {
  return this.subSectionJson;
}

public setSubSectionModel(model) {
  this.subSectionJson = model;
}

/**
 * fetches and returns both form and subsection model.
 */
public getFormAndSubSectionModel(productCode: string , tnxTypeCodeParam?: any, subTnxTypeCode?: any): Observable<any> {
  const subsectionModel = this.getSubSectionModelAPI();
  const formModelJson = this.getFormModel(productCode, tnxTypeCodeParam, subTnxTypeCode);

  return forkJoin([formModelJson, subsectionModel]);
}

/**
 * returns both form and event details models.
 * does parallel requests,
 * Usage: if both event and form models are required.
 * for only form model, use @getFormModel()
 */
public getFormAndEventModel(productCode: string , tnxTypeCodeParam?: any, subTnxTypeCode?: any): Observable<any> {
  const eventModel = this.getFormModelForEvent();
  const formModelJson = this.getFormModel(productCode, tnxTypeCodeParam, subTnxTypeCode);
  return forkJoin([formModelJson, eventModel]);
}

/**
 * does parallel requests to fetch form, subsection and event models together.
 */
public getFormSubsectionAndEventModel(productCode: string , tnxTypeCodeParam?: any, subTnxTypeCode?: any, option?: any): Observable<any> {
  const prodCode = productCode === FccGlobalConstant.PRODUCT_BENE ? '' : productCode;
  const subsectionModel = this.getSubSectionModelAPI();
  const formModelJson = this.getFormModel(prodCode, tnxTypeCodeParam, subTnxTypeCode, option);
  const eventModelJson = this.getFormModelForEvent();
  const paramKeysForAutoSaveConfig = { paramId : FccGlobalConstant.PARAMETER_P753, KEY_3: productCode, KEY_4: this.subProductCode };
  const autoSaveConfig = this.commonService.getAutosaveParameterConfiguredValues(paramKeysForAutoSaveConfig);
  const referenceId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REFERENCE_ID);
  const autoSavedFormJson = this.commonService.getAutoSavedForm(productCode, this.subProductCode, referenceId
    , tnxTypeCodeParam, this.option);
  return forkJoin([formModelJson, subsectionModel, eventModelJson, autoSaveConfig, autoSavedFormJson]);

}

public getWidgetFormModel(widgetName: string ): Observable<any> {
  const formModelJson = this.getWidgetModel(widgetName);
  return forkJoin([formModelJson]);

}

public getWidgetModel(widgetName: string ): Observable<any> {
  this.params = {
    type: widgetName,
  };
  return this.commonService.getProductModel(this.params);
}

 /**
   * batch details form model
   */
 public getFormModelForBatchDetails() {

  const productCode = this.commonService.getQueryParametersFromKey('productCode');
  this.subProductCode = this.commonService.getQueryParametersFromKey('subProductCode');
  const params: ProductParams = {
    productCode,
    type: FccGlobalConstant.BATCH_DETAILS,
    subProductCode: this.subProductCode
  };
  return this.commonService.getProductModel(params);
}



}
