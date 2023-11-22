import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../../../base/services/product.service';
import { FccTaskService } from '../../../../common/services/fcc-task.service';
import { ProductMappingService } from '../../../../common/services/productMapping.service';
import { TabPanelService } from '../../../../common/services/tab-panel.service';
import { TransactionDetailService } from '../../../../common/services/transactionDetail.service';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../common/services/common.service';
import { EventEmitterService } from '../../../../common/services/event-emitter-service';
import { ProductValidator } from '../../../common/validator/productValidator';
import { ProductStateService } from '../../lc/common/services/product-state.service';
import { PreviewService } from '../../lc/initiation/services/preview.service';
import { FCCFormGroup } from './../../../../base/model/fcc-control.model';


@Injectable({
  providedIn: 'root'
})
export class ElProductService implements ProductValidator{

  modeTnxType = 'mode';
  tnxType: any;
  option: any;
  mode: any;
  refId: any;
  eventId: string;
  referenceId: string;
  tnxId: any;
  moduleName: string;
  subTnxType: any;
  productCode: any;
  subProductCode: any;

  constructor(protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService,
              protected commonService: CommonService,
              protected translateService: TranslateService, protected transactionDetailService: TransactionDetailService,
              protected productMappingService: ProductMappingService, protected taskService: FccTaskService,
              protected tabservice: TabPanelService, protected previewService: PreviewService, protected productService: ProductService
              ) { }

 // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeSaveValidation(form?: any): boolean {
    return true;
  }

  beforeSubmitValidation(): boolean {
    const isValid = this.validate();
    this.eventEmitterService.subFlag.next(isValid);
    return true;
  }

  validate() {
    let isValid = false;
    const subtnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    let sectionForm: FCCFormGroup;
    if (subtnxTypeCode === FccGlobalConstant.N003_REMITTANCE_LETTER_GENERATION) {
      sectionForm = this.productStateService.getSectionData('elRlGeneralDetails', FccGlobalConstant.PRODUCT_EL);
    } else if (tnxTypeCode === '01' ) {
      sectionForm = this.productStateService.getSectionData('elGeneralDetails', FccGlobalConstant.PRODUCT_EL);
    } else {
      sectionForm = this.productStateService.getSectionData('elgeneralDetails', FccGlobalConstant.PRODUCT_EL);
    }
    // Do Business Validation
    if (sectionForm) {
      isValid = true;
    }
    return isValid;
  }

  updatePayloadbeforeSave(form){
    if (form.get(FccGlobalConstant.ORG_AMOUNT_FIELD) && form.get(FccGlobalConstant.ORG_AMOUNT_FIELD).value) {
      const orgAMt = parseFloat(this.commonService.replaceCurrency(form.get(FccGlobalConstant.ORG_AMOUNT_FIELD).value));
      form.get(FccGlobalConstant.AMT_DIFF).setValue(orgAMt);
      }
  }
  updatePayloadbeforeSubmit(form){
    if (form.get(FccGlobalConstant.ORG_AMOUNT_FIELD) && form.get(FccGlobalConstant.ORG_AMOUNT_FIELD).value) {
      const docAmt = parseFloat(this.commonService.replaceCurrency(form.get(FccGlobalConstant.TNX_AMT).value));
      const orgAMt = parseFloat(this.commonService.replaceCurrency(form.get(FccGlobalConstant.ORG_AMOUNT_FIELD).value));
      form.get(FccGlobalConstant.AMT_DIFF).setValue(orgAMt - docAmt);
    }
  }
  private buildTnxRequestObject(model): any {
    const forAPIRequestObj = true;
    const tnxObj = {};
    const productCode = 'product_code';
    const subProductCode = 'sub_product_code';
    tnxObj[productCode] = this.productCode;
    tnxObj[subProductCode] = this.subProductCode;
    // this.getParentTnxId(tnxObj);
    this.productStateService.getSectionNames().forEach(section => {
      const sectionFormValue = this.productStateService.getSectionData(section);
      this.tabservice.initializeMaps(section, this.productStateService.getSectionData(section, undefined, false));
      const tabSectionControlMap = this.tabservice.getTabSectionControlMap();
      // this.productMappingService.getApiModel(this.productCode, this.subProductCode).subscribe(model => {
      if (tabSectionControlMap.has(section) && model !== null) {
        for (const [fieldName, control] of tabSectionControlMap.get(section)) {
          if (control.params[this.modeTnxType] === undefined || control.params[this.modeTnxType] === this.tnxType) {
            // 1st condition undefined check is for other controls where the mode parameter is not mentioned
            // second condition to compare the mode mentioned in the narrative field of narrative details section
            // with the tnx type code
            // so that the api mapping should happen for the respective controls
            const apiFieldName = this.productMappingService.getRequestFieldNameFromMappingModel(fieldName, model);
            if (apiFieldName) {
              tnxObj[apiFieldName] = this.previewService.getPersistenceValue(control, false, forAPIRequestObj);
            }
          }
        }
      }
      if (model !== null) {
        this.handleTnxObjFromMappingModel(sectionFormValue, model, tnxObj, forAPIRequestObj);
      }
      // });
    });
    return tnxObj;
  }
  private handleTnxObjFromMappingModel(sectionFormValue: FCCFormGroup, mappingModel: any, tnxObj: any, forAPIRequestObj: boolean) {
    Object.keys(sectionFormValue.controls).forEach(fieldName => {
      const apiFieldName = this.productMappingService.getRequestFieldNameFromMappingModel(fieldName, mappingModel);
      const isFieldTypeComplex = this.productMappingService.checkComplexityTypeForRequestField(fieldName, mappingModel);
      if (isFieldTypeComplex) {
        const control = sectionFormValue.controls[fieldName];
        if (this.productService.isParamValid(control.value)) {
          const value = JSON.parse(control.value);
          tnxObj[apiFieldName] = value;
        }
      } else if (apiFieldName) {
        tnxObj[apiFieldName] = this.previewService.getPersistenceValue(sectionFormValue.controls[fieldName], false, forAPIRequestObj);
      }
    });
  }
  buildRequestObject(mappingModel, actionType: string): any {
    const requestObj = {};
    const common = 'common';
    const transaction = 'transaction';
    const tnxDetailsReqObject = this.buildTnxRequestObject(mappingModel);
      // removing template_description it if its not template save/submit scenario.
    const templateDescription = 'template_description';
    delete tnxDetailsReqObject[templateDescription];
    const commonRequestObj = this.buildCommonRequestObject(actionType);
    requestObj[common] = commonRequestObj;
    requestObj[transaction] = tnxDetailsReqObject;
    return requestObj;
  }

  protected buildCommonRequestObject(actionType: string): any {
    this.handleSaveSubmitPayload();
    const commonParameters = {};
    commonParameters[FccGlobalConstant.SCREEN] = this.productStateService.getScreenName();
    commonParameters[FccGlobalConstant.OPERATION] = actionType;
    commonParameters[FccGlobalConstant.OPTION] = (this.option !== undefined && this.option !== null) ? this.option : undefined;
    commonParameters[FccGlobalConstant.MODE] = (this.mode !== undefined && this.mode !== null) ? this.mode : undefined;
    commonParameters[FccGlobalConstant.REFERENCE_ID] = this.refId !== undefined ? this.refId : this.referenceId;
    commonParameters[FccGlobalConstant.TNXID] = this.eventId !== undefined ? this.eventId : this.tnxId;
    commonParameters[FccGlobalConstant.TNXTYPE] = this.tnxType;
    commonParameters[FccGlobalConstant.MODULE_NAME] = this.moduleName;
    return commonParameters;
  }

  handleSaveSubmitPayload() {
        if (this.tnxType === FccGlobalConstant.N002_INQUIRE) {
          if (this.mode !== FccGlobalConstant.VIEW_MODE) {
            this.mode = FccGlobalConstant.DRAFT_OPTION;
          }
          const actionRequiredOption = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
          const actionRequiredMode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
          if (actionRequiredOption === FccGlobalConstant.ACTION_REQUIRED || actionRequiredMode === FccGlobalConstant.DISCREPANT) {
            if (!this.eventId) {
              this.tnxId = '';
            } else {
              this.tnxId = this.eventId;
            }
          }
          if (this.option !== FccGlobalConstant.OPTION_ASSIGNEE && this.subTnxType !== FccGlobalConstant.N003_REMITTANCE_LETTER_GENERATION
            && this.option !== FccGlobalConstant.OPTION_TRANSFER) {
            this.option = undefined;
          }
        }
}

  public async updateTransaction(): Promise<string>{
    this.subTnxType = this.commonService.getQueryParametersFromKey(FccGlobalConstant.SUB_TRANSACTION_TYPE_CODE);
    this.tnxType = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    this.mode = FccGlobalConstant.DRAFT_OPTION;
    this.productCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.PRODUCT);
    this.tnxId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.tnxId);
    this.refId = this.commonService.referenceId;
    if (this.commonService.isEmptyValue(this.refId)) {
      this.refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REF_ID);
    }
    let returnResponse: any;
    await this.productMappingService.getApiModel(this.productCode, this.subProductCode).toPromise().then(async model => {
    const requestObj = this.buildRequestObject(model, FccGlobalConstant.SAVE);
      await this.commonService.persistFormDetails(requestObj).toPromise().then(res => {
        if (res.status === FccGlobalConstant.LENGTH_200) {
          this.commonService.addedResponse(res);
          const responseObj = res.body;
          this.commonService.etagVersionChange.next(responseObj.version);
          this.taskService.setTnxResponseObj(res.body);
          returnResponse = 'true';
          }
        }, (error: HttpErrorResponse) => {
          if (error.status === FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST){
            returnResponse = error.error.causes[0].userLanguageTitle;
            if (this.commonService.isEmptyValue(returnResponse)){
              returnResponse = error.error.userLanguageTitle;
            }
          }
          this.commonService.showError(true);
        });
    });
    return returnResponse;
  }


}
