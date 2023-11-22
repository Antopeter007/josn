import { FccConstants } from './../core/fcc-constants';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { FCCFormControl, FCCFormGroup } from '../../../app/base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../app/common/core/fcc-global-constants';
import { ProductStateService } from '../../../app/corporate/trade/lc/common/services/product-state.service';
import { FilelistService } from '../../../app/corporate/trade/lc/initiation/services/filelist.service';
import { FormControlService } from '../../../app/corporate/trade/lc/initiation/services/form-control.service';
import { NarrativeService } from '../../../app/corporate/trade/lc/initiation/services/narrative.service';
import { FacilityDetailsService } from './../../corporate/lending/ln/initiation/services/facility-details.service';
import { TradeCommonDataService } from './../../corporate/trade/common/service/trade-common-data.service';
import { CommonService } from './common.service';
import { DocumentsHandlingService } from './documents-handling.service';
import { FileHandlingService } from './file-handling.service';
import { FormAccordionPanelService } from './form-accordion-panel.service';
import { FormModelService } from './form-model.service';
import { LicenseHandlingService } from './license-handling.service';
import { TabPanelService } from './tab-panel.service';
import { DropDownAPIService } from '../../../app/common/services/dropdownAPI.service';
import { BeneConstants } from './../../corporate/system-features/beneficiary-maintenance/beneficiary-general-detail/beneficiary-general-details.constants';
import { PreviewService } from '../../corporate/trade/lc/initiation/services/preview.service';
import { BeneAccountsHandlingService } from './beneAccounts-handling.service';
import { PaymentEnrichmentHandlingService } from './paymentEnrichment-handling.service';
import { FCMPaymentsConstants } from './../../corporate/cash/payments/single/model/fcm-payments-constant';


@Injectable({
  providedIn: 'root'
})

export class ProductMappingService {

  type = 'type';
  section = 'section';
  field = 'field';
  params: any;
  maxNbrContracts: any;
  extraFieldControls = {}; 
  extraFieldMappingVal = {};
  extraFields = [];
  constructor(protected stateService: ProductStateService, protected formModelService: FormModelService,
              protected formControlService: FormControlService, protected commonService: CommonService,
              protected tabPanelService: TabPanelService, protected translateService: TranslateService,
              protected documentHandlingService: DocumentsHandlingService, protected licenseHandlingService: LicenseHandlingService,
              protected formAccordionPanelService: FormAccordionPanelService, protected narrativeService: NarrativeService,
              protected uploadFile: FilelistService, protected fileHandlingService: FileHandlingService,
              protected tradeCommonDataService: TradeCommonDataService, protected facilityDetailsService: FacilityDetailsService,
              protected dropdownAPIService: DropDownAPIService, protected previewService: PreviewService,
              protected paymentEnrichmentHandlingService: PaymentEnrichmentHandlingService,
              protected beneAccountsHandlingService: BeneAccountsHandlingService) { }

  // Retrieve the Mapping Model file between UIFields and API Fields
  public getApiModel(productCode: any, subProductCode?: any, tnxType?: any, mode?: any, subTnxTypeCode?: any,
                     option?: any, category?: any): Observable<any> {
    if (productCode === FccConstants.PRODUCT_TYPE_BENEFECIARY) {
      this.params = {
        productCode: FccGlobalConstant.PRODUCT_DEFAULT,
        type: FccGlobalConstant.MODEL_API_MAPPING,
        subProductCode: FccGlobalConstant.SUBPRODUCT_DEFAULT,
        option: FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC,
        category : category
      };
    } else {
      this.params = {
        productCode,
        type: FccGlobalConstant.MODEL_API_MAPPING,
        tnxTypeCode: tnxType,
        subTnxTypeCode,
        subProductCode,
        mode,
        option,
        category
      };
    }
    // Fetch exchange rate configuration
    const params = {
			productCode : productCode,
			subProductCode : subProductCode
		};
    this.commonService.getExchangeRateConfig(params).subscribe(res => {
      if (res && res.fxBankProperties[0] && res.fxBankProperties[0].fxNbrContract &&
          res.fxBankProperties[0].fxNbrContract.maxNbrContracts) {
        this.maxNbrContracts = res.fxBankProperties[0].fxNbrContract.maxNbrContracts;
      }
    });

    return this.commonService.getProductModel(this.params);
  }

  // set the state by considering the Mapping model
  setStateFromMapModel(mappingModel: any, sectionName: any, sectionForm: FCCFormGroup, jsonObj: any, productCode: any, subProductCode: any,
                       master = false, subTnxTypeCode?: any, applicableFieldsToSet?: any[], stateType?: any,
                       isamendComaprisonEnabled?: any) {
    // Fetch API Model details

    // this.tabPanelService.iterateFormForEditDraft(sectionName, sectionForm, false, mappingModel);

    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const option = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPTION);
    const tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
    const accordionSubSectionsListMap = this.formAccordionPanelService.getAccordionSubSectionListMap();
    if (tabSectionControlMap?.has(sectionName) && !accordionSubSectionsListMap?.has(sectionName)) {
      this.handleSetValueControl(tabSectionControlMap, sectionName, mappingModel, sectionForm, jsonObj, master, mode, productCode,
         isamendComaprisonEnabled );
    } else if (accordionSubSectionsListMap?.has(sectionName)) {
      const accordionSubSectionsList = accordionSubSectionsListMap.get(sectionName);
      accordionSubSectionsList.forEach(subSection => {
        const subSectionForm = sectionForm.controls[subSection] as FCCFormGroup;
        Object.keys(subSectionForm.controls).forEach(fieldName => {
          const mappingFieldKey = mappingModel[fieldName];
          const fieldControl = this.stateService.getSubControl(sectionName, subSection, fieldName, master, stateType);
          if (fieldControl !== undefined && (applicableFieldsToSet === undefined || applicableFieldsToSet === null)) {
            this.setValueToControl(mappingFieldKey, sectionForm, fieldName, jsonObj, fieldControl, master, mode);
          } else if (fieldControl !== undefined && (this.isMappingRequiredForField(applicableFieldsToSet, fieldName))) {
            this.setValueToControl(mappingFieldKey, sectionForm, fieldName, jsonObj, fieldControl, master, mode);
          }
        });
      });
    }else {
      let posEndField;
      Object.keys(sectionForm.controls).forEach(fieldName => {

        const mappingFieldKey = mappingModel[fieldName];
        const fieldControl = this.stateService.getControl(sectionName, fieldName, master, stateType);

        if (sectionForm.controls[fieldName][FccGlobalConstant.PARAMS] &&
          sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][`positionEnd`] &&
          sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][`positionEnd`] === true){
            posEndField=fieldName;
        }
        if (sectionForm.controls[fieldName][FccGlobalConstant.PARAMS] &&
          sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][`dynamicField`] &&
          sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][`dynamicField`] === true) {
            this.handleMappingForDynamicFields(sectionForm, fieldName, fieldControl.type,
              mappingModel, jsonObj, fieldControl, master, mode);
        }

        // Handling edit-table grid
        if (fieldControl !== undefined && fieldControl.type === 'edit-table' && (mode === 'view' || this.commonService.isViewPopup
        || option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC || option === FccGlobalConstant.PAYMENTS)) {
          productCode = option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC ? FccGlobalConstant.PRODUCT_BENE : productCode;
          this.handleMappingForEditTableGrid(fieldControl, sectionForm, fieldName, productCode, sectionName, jsonObj, master);
        }
        if (fieldControl !== undefined && fieldControl.type === FccGlobalConstant.expansionPanelTable &&
           (mode === 'view' || this.commonService.isViewPopup) && !master) {
          this.handleMappingForExpansionPanelTable(fieldControl, sectionForm, fieldName, productCode, sectionName);
        }
        if (fieldControl !== undefined && fieldControl.params && fieldControl.params.retrieveOldData &&
          (mode === 'view' || this.commonService.isViewPopup)) {
            this.facilityDetailsService.retrivingOldData(sectionForm, fieldName, sectionName);
        }
        // If no applicable fields simply set the value else check which fields need to be mapped
        if (fieldControl !== undefined && (applicableFieldsToSet === undefined || applicableFieldsToSet === null)) {
          this.setValueToControl(mappingFieldKey, sectionForm, fieldName, jsonObj, fieldControl, master, mode);
        } else if (fieldControl !== undefined && (this.isMappingRequiredForField(applicableFieldsToSet, fieldName))) {
          this.setValueToControl(mappingFieldKey, sectionForm, fieldName, jsonObj, fieldControl, master, mode);
        }
        // For EL, narrative amend fields handling

      });
      this.addDynamicControl(sectionForm);
      this.moveElement(sectionForm,posEndField);
      if (productCode === FccGlobalConstant.PRODUCT_EL || productCode === FccGlobalConstant.PRODUCT_SR) {
        Object.keys(sectionForm.controls).forEach(fieldName => {
          const fieldControl = this.stateService.getControl(sectionName, fieldName, master, stateType);
          if (fieldControl !== undefined && fieldControl.type === FccGlobalConstant.inputText &&
            (fieldControl.key === 'masterDescOfGoods' || fieldControl.key === 'masterDocReqd' || fieldControl.key === 'masterSplBene'
             || fieldControl.key === 'masterAddInstr' || fieldControl.key === 'descOfGoodsAmendEditTextAreaRead'
            || fieldControl.key === 'docReqAmendEditTextAreaRead' || fieldControl.key === 'addInstAmendEditTextAreaRead' ||
            fieldControl.key === 'splPaymentBeneAmendEditTextAreaRead') && (mode === FccGlobalConstant.VIEW_MODE
              || this.commonService.isViewPopup) && fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.AMEND_TABBED_PANEL]) {
              this.handleMappingForAmendNarrativeField(fieldControl, sectionForm, fieldName, productCode, sectionName , master);
            }
        });
      }
    }
    return sectionForm;
  }

  setBeneficiaryStateFromMapModel(mappingModel: any, sectionName: any, sectionForm: FCCFormGroup, responseObj: any, productType: any) {
    const beneDetailsObj = responseObj[FccConstants.BENEFICIARY_DETAILS_TAG];
    const accountDetailsArray = beneDetailsObj[FccConstants.ACCOUNT_DETAILS_TAG];
    const beneOtherDetailsObj = beneDetailsObj[FccConstants.BENE_OTHER_DETAILS_TAG];
    delete beneDetailsObj[FccConstants.BENE_OTHER_DETAILS_TAG];
    delete beneDetailsObj[FccConstants.ACCOUNT_DETAILS_TAG];
    beneDetailsObj[FccGlobalConstant.ENTITY] = responseObj[FccGlobalConstant.ENTITY];
    beneDetailsObj[FccConstants.PRODUCT_TYPE] = responseObj[FccConstants.PRODUCT_TYPE];
    Object.keys(sectionForm.controls).forEach(fieldName => {
      const mappingFieldKey = mappingModel[fieldName];
      const fieldControl = this.stateService.getControl(sectionName, fieldName);
      if (fieldControl !== undefined && fieldControl.type === FccGlobalConstant.EDIT_TABLE) {
        this.beneficiaryHandleMappingForTableGrid(mappingModel, fieldControl, sectionForm, accountDetailsArray, productType);
      } else if (fieldControl !== undefined && beneDetailsObj && !BeneConstants.ACCOUNT_DETAILS.includes(fieldName)) {
        if (beneOtherDetailsObj && BeneConstants.OTHER_DETAILS.includes(fieldName)) {
          this.setValueToControl(mappingFieldKey, sectionForm, fieldName, beneOtherDetailsObj, fieldControl, false, null);
        } else {
          this.setValueToControl(mappingFieldKey, sectionForm, fieldName, beneDetailsObj, fieldControl, false, null);
        }
      }
      if (sectionForm.controls[fieldName][FccGlobalConstant.PARAMS][FccConstants.MAP_BOOLEAN_VALUE]) {
        const booleanValue = (fieldControl.value === 'true' || fieldControl.value === true)
        ? FccGlobalConstant.CODE_Y : FccGlobalConstant.CODE_N;
        fieldControl.setValue(booleanValue);
      }
    });
    return sectionForm;
  }

  beneficiaryHandleMappingForTableGrid(mappingModel, fieldControl, sectionForm, accountDetailsArray, productType) {
    let accountDetailsObj = {};
    const tableData = [];
    if (fieldControl) {
      fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.COLUMNS] = this.getBeneficiaetTableBasedOnProductType(productType);
      const columns = fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.COLUMNS];
      if (columns && columns.length > FccGlobalConstant.LENGTH_0 && accountDetailsArray &&
        accountDetailsArray.length > FccGlobalConstant.LENGTH_0) {
        accountDetailsArray.forEach(account => {
          accountDetailsObj = {};
          columns.forEach(col => {
            let value = account[mappingModel[col]];
            if (sectionForm.controls[col][FccGlobalConstant.PARAMS][FccConstants.MAP_BOOLEAN_VALUE]) {
              value = (value === 'true' || value === true) ? FccGlobalConstant.CODE_Y : FccGlobalConstant.CODE_N;
            } else if (col === FccConstants.BENEFICIARY_ACCOUNT_CUR_CODE || col === FccConstants.BENEFICIARY_BANK_COUNTRY) {
              value = this.setDropdownFilterValue(sectionForm, col, value);
            }
            accountDetailsObj[col] = value ? value : null;
          });
          if (mappingModel[FccConstants.INTERMEDIARY_BANK_IFSC_ADDRESS]) {
            const val = account[mappingModel[FccConstants.INTERMEDIARY_BANK_IFSC_ADDRESS]];
            if (val && val.includes('|')) {
              const addressValue = val.value.split('|');
              accountDetailsObj[FccConstants.INTERMEDIARY_BANK_IFSC_ADDRESS_1] = addressValue[0];
              accountDetailsObj[FccConstants.INTERMEDIARY_BANK_IFSC_ADDRESS_2] = addressValue[1];
            } else if (val) {
              accountDetailsObj[FccConstants.INTERMEDIARY_BANK_IFSC_ADDRESS_1] = val;
            }
          }
          tableData.push(accountDetailsObj);
        });
      }
      fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.TABLE_DATA] = tableData;
    }
    fieldControl.updateValueAndValidity();
  }

  setDropdownFilterValue(sectionForm, col, value) {
    const valueList = 'value';
    const shortName = 'shortName';
    let valObj = {};
    if (value && sectionForm.controls[col] && sectionForm.controls[col].options &&
      sectionForm.controls[col].options.length > FccGlobalConstant.LENGTH_0) {
        const list = sectionForm.controls[col].options;
        valObj = this.dropdownAPIService.getValueObj(value, list);
        return valObj[valueList] ? valObj[valueList] : valObj;
    } else if (value) {
      valObj[shortName] = value;
      return valObj;
    }
  }

  getBeneficiaetTableBasedOnProductType(productType: any) {
    if (this.commonService.isnonEMptyString(productType)) {
      if (BeneConstants.GROUP2_COMMON_PRODUCTS.includes(productType)) {
        return BeneConstants.PRODUCT_GROUP2_TABLE_COLUMNS;
      } else {
        switch (productType) {
          case BeneConstants.PROD_MUPS:
            return BeneConstants.PRODUCT_MUPS_TABLE_COLUMNS;
          case BeneConstants.PROD_DOM:
            return BeneConstants.PRODUCT_DOM_TABLE_COLUMNS;
          case BeneConstants.PROD_HVPS:
            return BeneConstants.PRODUCT_CNAPS_TABLE_COLUMNS;
          case BeneConstants.PROD_HVXB:
            return BeneConstants.PRODUCT_CNAPS_TABLE_COLUMNS;
          case BeneConstants.PROD_TPT:
            return BeneConstants.PRODUCT_TPT_TABLE_COLUMNS;
          case BeneConstants.PROD_TTPT:
            return BeneConstants.PRODUCT_TTPT_TABLE_COLUMNS;
        }
      }
    }
  }

  protected createFieldsForEachCrossRefs(control: any, jsonObj: any, getResData: any, crossReference: any) {
    const refId = this.commonService.getQueryParametersFromKey(FccGlobalConstant.REFERENCE_ID);
    const bulkRefId = jsonObj[FccGlobalConstant.BULK_REF_ID];
    if (control.key === FccGlobalConstant.ROLLED_OVER_FROM && crossReference.ref_id === bulkRefId &&
        refId !== crossReference.child_ref_id) {
      const resultObj = {};
      resultObj[FccGlobalConstant.ROLLED_OVER_FROM] = bulkRefId;
      getResData.push(resultObj);
    } else if (control.key === FccGlobalConstant.ROLLED_OVER_TO && crossReference.child_ref_id === refId) {
      const resultObj = {};
      resultObj[FccGlobalConstant.ROLLED_OVER_TO] = crossReference.ref_id;
      getResData.push(resultObj);
    }
  }

  protected handleSetValueControl(tabSectionControlMap: Map<string, Map<string, FCCFormControl>>, sectionName: any, mappingModel: any,
                                sectionForm: FCCFormGroup, jsonObj: any, master: boolean, mode: any, productCode: any,
                                isamendComaprisonEnabled?: any) {
    for (const [fieldName, control] of tabSectionControlMap.get(sectionName)) {
      const mappingFieldKey = mappingModel[fieldName];
      this.setValueToControl(mappingFieldKey, sectionForm, fieldName, jsonObj, control, master, mode);
      if ((!master || isamendComaprisonEnabled === true) && control !== undefined && control.type === 'input-text'
        && (control.key === 'descOfGoodsAmendEditTextAreaRead' ||
        control.key === 'docReqAmendEditTextAreaRead' || control.key === 'addInstAmendEditTextAreaRead' ||
        control.key === 'splPaymentBeneAmendEditTextAreaRead') && mode === 'view') {
        this.handleMappingForAmendNarrativeField(control, sectionForm, fieldName, productCode, sectionName);
      }
    }
  }

  /**
   *
   * @param applicableFieldsToSet Identify which fields should nnot be mapped in case of Copy from: scenario
   * @param fieldName fieldname to check with
   */
   isMappingRequiredForField(applicableFieldsToSet: any[], fieldName: any) {
    if (applicableFieldsToSet && applicableFieldsToSet.length > 0 && applicableFieldsToSet.indexOf(fieldName) !== -1) {
      return false;
    } else {
      return true;
    }
  }


  setValueToControl(mappingFieldKey: any, sectionForm: FCCFormGroup, fieldName: string, jsonObj: any,
                            fieldControl: FCCFormControl, master: boolean, mode: any) {
    const readApiField = 'read_api_field';
    const operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    const controlParams = fieldControl[FccGlobalConstant.PARAMS];
    if (mappingFieldKey === undefined || mappingFieldKey === null) {
      mappingFieldKey = fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.NAME];
    }
    if (mappingFieldKey !== null && mappingFieldKey !== undefined) {
      let fieldValue = this.getFieldValueFromMappingObject(fieldName, jsonObj, mappingFieldKey, fieldControl);
      if(fieldName === FCMPaymentsConstants.CUSTOMER_REFERENCE_NUMBER ){
        fieldValue = this.updateCustomerRefNo(fieldValue, operation);
      }
      fieldValue = (fieldValue !== undefined && fieldValue !== null) ? fieldValue : '';
      if (fieldControl.type !== FccGlobalConstant.MAT_CARD && fieldControl.type !== FccGlobalConstant.FORM_TABLE &&
        fieldName !== FccGlobalConstant.FEECHARGES &&
        fieldName !== FccGlobalConstant.DOCUMENTS && fieldName !== FccGlobalConstant.FILE_UPLOAD_TABLE &&
        fieldName !== FccGlobalConstant.EL_MT700_FILE_UPLOAD_TABLE && 
        fieldName !== FccGlobalConstant.PREVIOUS_BANK_ATTACHMENT_TABLE &&
        fieldName !== FccGlobalConstant.BANK_ATTACHMENT_TABLE && fieldName !== FccGlobalConstant.CHILD_REFERENCE
        && !controlParams[FccGlobalConstant.RETRIEVE_INDIVIDUAL_CROSS_REFS] && (!(mappingFieldKey[readApiField]
        && mappingFieldKey[readApiField][FccGlobalConstant.DECODE_HTML_NOT_REQUIRED] === 'disableDecode'))) {
        fieldValue = (fieldValue !== undefined && fieldValue !== null && fieldValue !== FccGlobalConstant.EMPTY_STRING) ?
                      this.commonService.decodeHtml(fieldValue) : FccGlobalConstant.EMPTY_STRING;
      }
      if (fieldControl[FccGlobalConstant.PARAMS] && fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.NO_VALUE_ON_EVENT_LOAD] &&
        fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.NO_VALUE_ON_EVENT_LOAD] === true
        && (mode === undefined || (mode && mode !== FccGlobalConstant.DRAFT_OPTION && mode !== FccGlobalConstant.VIEW_MODE))) {
        fieldValue = FccGlobalConstant.EMPTY_STRING;
      }
      if (fieldName === FccGlobalConstant.FILE_UPLOAD_TABLE && fieldControl.type === FccGlobalConstant.INPUT_TABLE
          && mode === FccGlobalConstant.VIEW_SCREEN && (operation === FccGlobalConstant.PREVIEW
          || operation === FccGlobalConstant.LIST_INQUIRY)) {
        fieldValue = this.fileHandlingService.getFileData(fieldValue);
      }
      if ((fieldName === FccGlobalConstant.BANK_ATTACHMENT_TABLE || fieldName === FccGlobalConstant.PREVIOUS_BANK_ATTACHMENT_TABLE) && 
        fieldControl.type === FccGlobalConstant.INPUT_TABLE) {
        fieldValue = this.fileHandlingService.getBankFileData(fieldValue, fieldName);
      }
      if (fieldName === FccGlobalConstant.EL_MT700_FILE_UPLOAD_TABLE && fieldControl.type === FccGlobalConstant.INPUT_TABLE) {
        fieldValue = this.fileHandlingService.getELMT700FileData(fieldValue);
      }
      this.formControlService.setValueByType(fieldControl, fieldValue, master);
      fieldControl.updateValueAndValidity();
      if (master) {
        this.commonService.putMasterData(fieldName, fieldValue);
      }
    }
  }
  // Method to retrieve the API field Key by passing Field Key and Mapping Model
  // If Mapping field key is not found, UI field key is returned as API field Key
  // If Read and Write mapping field is same, follow Eg: expiryDate: 'exp_date'
  // If Read and Write mapping field is different, follow
                // issuingBankAbbvName: {
                //   write_api_field: 'issuing_bank_abbv_name',
                //   read_api_field: {
                // 	  type: 'complex',
                // 	  section: 'issuingBank',
                // 	  field: 'abbv_name'
                //   }
                //  }
  getRequestFieldNameFromMappingModel(uiFieldKey: any, mappingModelJson: any): string {
    const writeApiField = 'write_api_field';
    const field = 'field';
    let requestFieldName = mappingModelJson[uiFieldKey];
    if (typeof requestFieldName === 'object') {
      if (typeof requestFieldName[writeApiField] === 'object') {
        requestFieldName = requestFieldName[writeApiField][field];
      } else {
        requestFieldName = requestFieldName[writeApiField];
      }
    }
    return requestFieldName;
  }
  // Method to check if write_api_field is of complex type to pass complex JSON request obj
  checkComplexityTypeForRequestField(uiFieldKey: any, mappingModelJson: any): boolean {
    const writeApiField = 'write_api_field';
    const type = 'type';
    let complexTypeField = false;
    const requestFieldName = mappingModelJson[uiFieldKey];
    if (typeof requestFieldName === 'object') {
      if (typeof requestFieldName[writeApiField] === 'object' && requestFieldName[writeApiField][type] &&
        requestFieldName[writeApiField][type] === 'complex') {
        complexTypeField = true;
      } else {
        complexTypeField = false;
      }
    }
    return complexTypeField;
  }


  // Method to retrieve the API field's Value from APIReponseJSON by passing the UiField
  getFieldValueFromMappingObject(uiField: any, apiResponseJson: any, mappingFieldValue: any, fieldControl?: FCCFormControl): any {
    let fieldValue = apiResponseJson[mappingFieldValue];
    const readApiField = 'read_api_field';
    if (typeof mappingFieldValue === 'object' && typeof mappingFieldValue[readApiField] !== 'object') {
      fieldValue = apiResponseJson[mappingFieldValue[readApiField]];
    } else if (typeof mappingFieldValue === 'object' && typeof mappingFieldValue[readApiField] === 'object') {
      if (mappingFieldValue[readApiField][this.type] === 'json') {
        fieldValue = JSON.stringify(apiResponseJson[mappingFieldValue[readApiField][this.field]]);
        if (mappingFieldValue[readApiField][FccGlobalConstant.DECODE_HTML_NOT_REQUIRED] !== 'disableDecode') {
        fieldValue = (fieldValue !== null && fieldValue !== undefined) ? this.commonService.decodeHtml(fieldValue) : '';
        }
      } else {
        fieldValue = this.getFieldValueFromMappingObjectComplex(uiField, apiResponseJson, mappingFieldValue[readApiField], fieldControl);
      }
    }
    return fieldValue;
  }

  // Method to retrieve the API's field value based on complex JSON structure of the API Response JSON
  getFieldValueFromMappingObjectComplex(uiField: any, apiResponseJson: any, mappingFieldValue: any, fieldControl?: FCCFormControl): any {
    let fieldValue;
    if (apiResponseJson) {
      fieldValue = apiResponseJson[mappingFieldValue];
      if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
        return this.commonService.decodeHtml(fieldValue);
      } else if (typeof mappingFieldValue === 'object' && mappingFieldValue[this.type] === 'complex') {
        const sectionName = mappingFieldValue[this.section];
        const sectionFieldName = mappingFieldValue[this.field];
        if (apiResponseJson[sectionName] !== undefined && apiResponseJson[sectionName] !== null && typeof sectionFieldName !== 'object') {
          fieldValue = apiResponseJson[sectionName][sectionFieldName] ? apiResponseJson[sectionName][sectionFieldName] :
          typeof(apiResponseJson[sectionName]) === 'string' ? apiResponseJson[sectionName] : undefined;
          if (mappingFieldValue[FccGlobalConstant.DECODE_HTML_NOT_REQUIRED] !== 'disableDecode') {
            fieldValue = (fieldValue !== null && fieldValue !== undefined) ? this.commonService.decodeHtml(fieldValue) : '';
          }
        } else if (typeof sectionFieldName === 'object' && mappingFieldValue[this.type] === 'complex' && fieldValue === undefined) {
          fieldValue = this.getFieldValueFromMappingObjectComplex(uiField, apiResponseJson[sectionName], sectionFieldName, fieldControl);
          fieldValue = (fieldValue !== null && fieldValue !== undefined) ? fieldValue : '';
        } else {
          fieldValue = '';
        }
      } else if (typeof mappingFieldValue === 'object' && mappingFieldValue[this.type] === 'array') {
        const sectionName = mappingFieldValue[this.section];
        fieldValue = this.getDetailsOfArrayObject(apiResponseJson , sectionName, fieldControl,uiField, mappingFieldValue);
      } else if (typeof mappingFieldValue === 'object' && mappingFieldValue[this.type] === 'additionalFields') {
        const sectionName = mappingFieldValue[this.section];
        const sectionFieldName = mappingFieldValue[this.field];
        fieldValue = this.getAdditionalFields(apiResponseJson[sectionName], sectionFieldName);
      } else if (typeof mappingFieldValue === 'object' && mappingFieldValue[this.type] === 'json') {
        const sectionFieldName = mappingFieldValue[this.field];
        fieldValue = JSON.stringify(apiResponseJson[sectionFieldName]);
        if (mappingFieldValue[FccGlobalConstant.DECODE_HTML_NOT_REQUIRED] !== 'disableDecode') {
        fieldValue = (fieldValue !== null && fieldValue !== undefined) ? this.commonService.decodeHtml(fieldValue) : '';
        }
      } else if (typeof mappingFieldValue === 'object' && mappingFieldValue[this.type] === FccGlobalConstant.CARD_DATA) {
        const sectionName = mappingFieldValue[this.section];
        fieldValue = this.getDetailsOfCardData(apiResponseJson[sectionName] , fieldControl);
      } else if (typeof mappingFieldValue === FccGlobalConstant.OBJECT && mappingFieldValue[this.type] === FccConstants.COMPLEX_SUCCESS) {
        if (mappingFieldValue[this.type] === FccConstants.COMPLEX_SUCCESS && fieldValue === undefined) {
          fieldValue = apiResponseJson[uiField];
          fieldValue = (fieldValue !== null && fieldValue !== undefined) ? fieldValue : '';
        } else {
          fieldValue = '';
        }
      }
    }
    return fieldValue;
  }
  getClubbedFields(apiResponseJson, fieldControl: FCCFormControl, fieldName,apiMappingModel) {
    const clubbedListArray = fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.CLUBBED_LIST];
    const clubbedTrueFields: string[] = [];
    const clubbedFieldsMap = new Map();
    if (clubbedListArray) {
      const value: string[] = [];
      Object.keys(clubbedListArray).forEach(clubbedfieldName => {
        const clubbedName = clubbedListArray[clubbedfieldName].toString();
        if (clubbedListArray[clubbedfieldName] !== fieldName && clubbedTrueFields.indexOf(clubbedName) === -1) {
          clubbedTrueFields.push(clubbedName);
        }
        value.push(clubbedListArray[clubbedfieldName].toString());
      });
      clubbedFieldsMap.set(fieldName, value);
    }
    if (apiResponseJson && typeof apiResponseJson === 'object') {
      const spaceVal = ' ';
      clubbedListArray.forEach(fieldName => {
        if (clubbedFieldsMap.has(fieldName)){
          const fieldsList = clubbedFieldsMap.get(fieldName);
          let value = '';
          fieldsList.forEach(childField => {
            const mappingFieldKey = apiMappingModel[childField];
            if (apiResponseJson[mappingFieldKey]) {
              value += apiResponseJson[mappingFieldKey];
              
              if(clubbedListArray.length > 1 && clubbedFieldsMap.has(clubbedListArray[1])) {
               value += spaceVal;
             }
            }

          });
          if ((fieldName.indexOf('Amount') > -1)) {
            const val = value.trim().indexOf('  ') > -1 ? value.trim().split('  ') : value.trim().split(' ');
            if (val.length === 2) {
              value = this.commonService.getCurrencySymbolForPDF(val[0], val[1]);
            }
          }
          if (this.commonService.isnonEMptyString(value)){
            this.formControlService.setValueByType(fieldControl, value, false);
            fieldControl.updateValueAndValidity();
          }
        }
      });
    }
  }
  getDetailsOfCardData(apiResponseJson, fieldControl: FCCFormControl) {
    const options = [];
    let cardDetailsFields = [];
    cardDetailsFields = fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.MAT_FIELDS] as [];
    const clubbedList = fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.MAT_CLUBBED_LIST];
    const currencyCodeList = fieldControl[FccGlobalConstant.PARAMS][FccGlobalConstant.MAT_CURRENCY_CODE_LIST] as string[];
    const clubbedFieldsMap = new Map();
    const clubbedFieldsList = [];
    if (clubbedList !== undefined) {
      clubbedList.forEach(clubbedField => {
        const clubbedFields = clubbedField[FccGlobalConstant.MAT_CLUBBED_FIELDS];
        clubbedFieldsMap.set(clubbedField[FccGlobalConstant.CLUBBED_HEADER_TEXT], clubbedFields);
        clubbedFields.forEach(field => {
          clubbedFieldsList.push(field);
        });
      });
    }
    if (apiResponseJson && typeof apiResponseJson === 'object') {
      const spaceVal = ' ';
      cardDetailsFields.forEach(fieldName => {
        if (clubbedFieldsMap.has(fieldName)){
          const fieldsList = clubbedFieldsMap.get(fieldName);
          let value = '';
          fieldsList.forEach(childField => {
            if (apiResponseJson[childField]) {
              if(currencyCodeList && currencyCodeList.indexOf(childField) > -1) {
                value +=this.commonService.getCurrencySymbolWide(apiResponseJson[childField]) + spaceVal;
              } else {
                value += apiResponseJson[childField] + spaceVal;
              }

            }
          });
          if (value && value !== '') {
            const option = { header: fieldName, value };
            options.push(option);
          }
        }
        else if (clubbedFieldsList.indexOf(fieldName) === -1 && apiResponseJson[fieldName]) {
          let value = apiResponseJson[fieldName] ? apiResponseJson[fieldName] : FccGlobalConstant.EMPTY_VALUE;
          if(currencyCodeList && currencyCodeList.indexOf(fieldName) > -1) {
            value = this.commonService.getCurrencySymbolWide(apiResponseJson[fieldName]);
          }
          if (value) {
            const option = { header: fieldName, value };
            options.push(option);
          }
       }
      });
      return options;
    }

    return FccGlobalConstant.EMPTY_STRING;
  }

  getAdditionalFields(apiResponseJson, sectionFieldName) {
    if (apiResponseJson && Array.isArray(apiResponseJson)) {
      for (const field of apiResponseJson) {
        if (field.name) {
        if (field.name === sectionFieldName) {
          return field.value;
        }
      }
      }
    } else if (apiResponseJson && typeof apiResponseJson === 'object') {
       if (apiResponseJson.name && apiResponseJson.name === sectionFieldName) {
          return apiResponseJson.value;
      }
    }

    return FccGlobalConstant.EMPTY_STRING;
  }

  getDetailsOfArrayObject(apiResponseJson , sectionName, fieldControl,uiField?, mappingFieldValue?) {
    const arrObj = apiResponseJson[sectionName];
    const getResData = [];
    for (const keyOF in arrObj) {
      if (Object.prototype.hasOwnProperty.call(arrObj,keyOF)) {
        const element = arrObj[keyOF];
        if (Array.isArray(element)) {
          for (let index = 0; index < element.length; index++) {
            const arrElement = element[index];
            if (sectionName === FccGlobalConstant.CHARGES) {
              const attachmentResultObj: {'ChargeType': string, 'Description': any, 'tnx_cur_code': any,
              'amount': any, 'tnx_stat_code': any, 'SettlementDate': any} = {
              ChargeType: this.convertChargesToLocalize(arrElement.chrg_code, 'ChargeType'), Description: arrElement.additional_comment,
              tnx_cur_code: this.setCCYForCharges(arrElement.cur_code, arrElement.eqv_cur_code),
              amount: this.setAmtForCharges(arrElement.amt, arrElement.eqv_amt),
              tnx_stat_code: this.convertChargesToLocalize(arrElement.status, 'tnx_stat_code'),
              SettlementDate: arrElement.settlement_date };
              getResData.push(attachmentResultObj);
            } else if ((sectionName === FccGlobalConstant.BG_VARIATIONS || sectionName === FccGlobalConstant.CU_VARIATIONS)
                && arrElement.type === '02') {  // Irregular Variation
              // const variationResultObj = {
              //   variationFirstDate: arrElement.first_date,
              //   operation: arrElement.operation,
              //   variationPct: arrElement.percentage,
              //   variationAmtAndCurCode: arrElement.cur_code.concat(' ').concat(arrElement.amount)
              // };
              getResData.push(this.createIrregularVariationObj(arrElement));
            } else if (sectionName === FccGlobalConstant.CROSS_REFERENCES) {
              if (this.params.productCode !== arrElement.child_product_code){
              const attachmentResultObj: {'ChildRefId': string} = {
                ChildRefId: (arrElement.child_ref_id) };
              getResData.push(attachmentResultObj);
              } else {
                this.createFieldsForEachCrossRefs(fieldControl, apiResponseJson, getResData, arrElement);
              }
            }
             else {
              const attachmentResultObj: {'type': string, 'DocCode': string, 'DocNo': string, 'DocDate': any,
              'firstMail': string, 'secondMail': string, 'total': any, 'mapAttach': any} = {
                type: this.convertChargesToLocalize(arrElement.code, 'document'),
                DocCode: arrElement.name ? arrElement.name : '',
                DocNo: arrElement.doc_no, DocDate: arrElement.doc_date, firstMail : arrElement.first_mail ,
                secondMail: arrElement.second_mail,
                total: arrElement.total, mapAttach: arrElement.mapped_attachment_name
              };
              getResData.push(attachmentResultObj);
            }
          }
        } else if (sectionName === FccGlobalConstant.PAYMENT_DETAIL) {
          return this.getFieldValueFromMappingObjectComplex(uiField, element, mappingFieldValue[this.field], fieldControl);
        } else {
          if (sectionName === FccGlobalConstant.CHARGES) {
          const attachmentResultObj: {'ChargeType': string, 'Description': any, 'tnx_cur_code': any,
           'amount': any, 'tnx_stat_code': any, 'SettlementDate': any} = {
          ChargeType: this.convertChargesToLocalize(element.chrg_code, 'ChargeType'),
          Description: element.additional_comment, tnx_cur_code: this.setCCYForCharges(element.cur_code, element.eqv_cur_code),
          amount: this.setAmtForCharges(element.amt, element.eqv_amt),
          tnx_stat_code: this.convertChargesToLocalize(element.status, 'tnx_stat_code'),
          SettlementDate: element.settlement_date };
          getResData.push(attachmentResultObj);
           } else if ((sectionName === FccGlobalConstant.BG_VARIATIONS || sectionName === 'irregularVariations' ||
              sectionName === FccGlobalConstant.CU_VARIATIONS || sectionName === 'cuIrregularVariations')
              && element.type === '02') { // Irregular Variation
            const variationResultObj = this.createIrregularVariationObj(element);
            getResData.push(variationResultObj);
           } else if (sectionName === FccGlobalConstant.CROSS_REFERENCES) {
            if (this.params.productCode !== element.child_product_code){
            const attachmentResultObj: {'ChildRefId': string} = {
              ChildRefId: (element.child_ref_id) };
            getResData.push(attachmentResultObj);
            } else {
              this.createFieldsForEachCrossRefs(fieldControl, apiResponseJson, getResData, element);
            }
          } else {
            const attachmentResultObj: {'type': string, 'DocCode': string, 'DocNo': string, 'DocDate': any,
            'firstMail': string, 'secondMail': string, 'total': any, 'mapAttach': any} = {
              type: this.convertChargesToLocalize(element.code, 'document'),
              DocCode: element.name ? element.name : '',
              DocNo: element.doc_no, DocDate: element.doc_date, firstMail : element.first_mail ,
              secondMail: element.second_mail,
              total: element.total, mapAttach: element.mapped_attachment_name
            };
            getResData.push(attachmentResultObj);
          }
        }
        }
      }
    return getResData;
    }

    convertChargesToLocalize(status, type) {
      let localizeValue = '';
      if (type === FccGlobalConstant.TNX_STAT_CODE) {
          localizeValue = FccGlobalConstant.ROLE_CODE;
      }
      if (type === FccGlobalConstant.CHARGE_TYPE) {
          localizeValue = FccGlobalConstant.CHARGE_TYPE_CODE;
      }
      if (type === 'document') {
        localizeValue = 'N023';
    }
      const value = status;
      const conCatValue = localizeValue.concat('_', value);
      return this.translateService.instant(conCatValue);
    }

    setAmtForCharges(amount: any, eqvAmount: any) {
      if(this.commonService.isnonEMptyString(eqvAmount)){
        amount = eqvAmount;
      }
      return amount;
    }

    setCCYForCharges(ccy: any, eqvCcy: any) {
      if(this.commonService.isnonEMptyString(eqvCcy)){
        ccy = eqvCcy;
      }
      return ccy;
    }

    handleMappingForEditTableGrid(control: any, sectionForm: any, fieldName: any, productCode: any, sectionName: any,
       jsonObj: any, master = false) {
      switch (productCode) {
        case FccGlobalConstant.PRODUCT_EC:
          switch (fieldName) {
              case FccGlobalConstant.documentTableDetails:
                this.documentHandlingService.handleDocumentTable(control, sectionForm);
                break;
              case FccGlobalConstant.LICENSE:
                this.licenseHandlingService.handleLicenseTable(control, sectionForm, productCode, sectionName);
                break;
              default:
                break;
          }
          break;
        case FccGlobalConstant.PRODUCT_EL:
        case FccGlobalConstant.PRODUCT_TF:
        case FccGlobalConstant.PRODUCT_FT:
        case FccGlobalConstant.PRODUCT_BR:
        case FccGlobalConstant.PRODUCT_LC:
        case FccGlobalConstant.PRODUCT_IC:
        case FccGlobalConstant.PRODUCT_BG:
          if (fieldName === FccGlobalConstant.LICENSE) {
            this.licenseHandlingService.handleLicenseTable(control, sectionForm, productCode, sectionName, master);
          }
          break;
        case FccGlobalConstant.PRODUCT_BENE:
          if (fieldName === FccConstants.ACCOUNTS_LIST_TABLE) {
            this.beneAccountsHandlingService.handleBeneAccountsTable(control, sectionForm, productCode, sectionName, master);
          }
          break;
        case FccGlobalConstant.PRODUCT_IN:
          if (fieldName === FccConstants.ENRICHMENT_LIST_TABLE) {
            this.paymentEnrichmentHandlingService.handleEnrichmentGrid(sectionForm, jsonObj);
          }
          break;
        default:
          break;
      }
    }

    handleMappingForExpansionPanelTable(control: any, sectionForm: any, fieldName: any, productCode: any, sectionName: any) {
      switch (productCode) {
        case FccGlobalConstant.PRODUCT_BK:
        case FccGlobalConstant.PRODUCT_LN:
          if (control.type === FccGlobalConstant.expansionPanelTable) {
            this.facilityDetailsService.handleRemInstTable(control, sectionForm, productCode, sectionName);
          }
          break;
        default:
          break;
      }
    }

    handleMappingForAmendNarrativeField(control: any, sectionForm: any, fieldName: any,
                                        productCode: any, sectionName: any, master = false) {
        this.narrativeService.handleAmendViewNarrative(control, sectionForm, productCode, sectionName, master);
    }

    public createIrregularVariationObj(element: any): any {
      const variationResultObj = {
        variationFirstDate: element.first_date,
        operation: this.tradeCommonDataService.getIncDecOperation(element.operation),
        operationType: element.operation,
        variationPct: element.percentage,
        variationAmtAndCurCode: element.cur_code.concat(' ').concat(element.amount),
        variationAmt: element.amount,
        variationSequence: element.sequence,
        variationCurCode: element.cur_code
      };
      return variationResultObj;
    }

    buildFormDataJson(sectionFormValue: FCCFormGroup, sectionName: string) {
      const reqObj = {};
      const amountList = [FccConstants.FCM_PAYMENT_AMOUNT, FccConstants.FCM_PAYMENT_BULK_TRANSACTION_AMT];
      const exemptedControlList = [FccGlobalConstant.SPACER, FccGlobalConstant.ROUNDED_BUTTON, FccGlobalConstant.ACCORDION];
      this.stateService.getSectionNames().forEach(section => {
        if (section !== sectionName) {
          sectionFormValue = this.stateService.getSectionData(section);
        }
        let fieldControl;
        Object.keys(sectionFormValue.controls).forEach(fieldName => {
          if (sectionName === FccConstants.INSTRUMENT_GENERAL_DETAILS) {
            fieldControl = sectionFormValue.controls[fieldName] as FCCFormControl;
          } else {
            fieldControl = this.stateService.getControl(section, fieldName);
          }
          if (fieldControl && !exemptedControlList.includes(fieldControl.type)) {
            reqObj[fieldName] = this.previewService.getPersistenceValue(fieldControl, false, true, true);
            if(amountList.includes(fieldName)){
              reqObj[fieldName] = this.commonService.removeAmountFormatting(reqObj[fieldName]);
            }
          }
        });
      });
      return reqObj;
    }

    public setFormValues(form, responseObj: any, apiMappingModel: any) {
      if (responseObj) {
        const sectionForm = form;
        const fieldList = Object.keys(sectionForm.controls);
        form = this.setFormValuesFromMapModel(apiMappingModel, fieldList,sectionForm, responseObj);

      }
    }

    public setFormValuesFromMapModel( mappingModel: any, fieldControlList,sectionForm, jsonObj: any) {
      const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
      fieldControlList.forEach(fieldName => {
        const mappingFieldKey = mappingModel[fieldName];
        const fieldControl = sectionForm[FccGlobalConstant.CONTROLS][fieldName];
           this.setValueToControl(mappingFieldKey, sectionForm, fieldName, jsonObj, fieldControl, false, mode);
          sectionForm.get(fieldName).setValue(fieldControl.value);
      });
      return sectionForm;
    }

    updateCustomerRefNo(fieldValue, operation){
      const paymentReferenceNumber = this.commonService.getQueryParametersFromKey(FCMPaymentsConstants.PAYMENT_REFERENCE_NUMBER_FIELD);
      if(operation === FccGlobalConstant.ADD_FEATURES && this.commonService.isnonEMptyString(paymentReferenceNumber)){
        fieldValue = '';
      }
      return fieldValue;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleMappingForDynamicFields(sectionForm, fieldName, type, mappingModel, jsonObj, fieldControl, master, mode) {
      //exchange rate dynamic fields
      if (this.maxNbrContracts > 1) {
        for (let i=1 ; i <= this.maxNbrContracts ; i++) {
          const currentFieldName = fieldName.substring(0, fieldName.length - 1);
          const dynamicField = this.formControlService.jsonObjectWithKey(currentFieldName+i, currentFieldName+i, type, undefined, undefined,
            false, fieldControl[FccGlobalConstant.PARAMS]);
          const mappingFieldKey = JSON.parse(JSON.stringify(mappingModel[fieldName]));
          let mappingFieldName = mappingFieldKey['read_api_field']['field'];
          mappingFieldName = mappingFieldName.replace(mappingFieldName.substring(mappingFieldName.length - 1), i);
          mappingFieldKey['read_api_field']['field'] = mappingFieldName;
          this.extraFieldControls[currentFieldName + i] = dynamicField;
          const fieldValue = this.getFieldValueFromMappingObject(currentFieldName + i, jsonObj, mappingFieldKey);
          this.extraFieldMappingVal[currentFieldName + i] = fieldValue;
          this.extraFields.push(currentFieldName + i);
          // commenting since the variable is not used. Lint issue FIX
          // const groupHead= sectionForm.get(fieldName)[FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_HEAD];
      }
    }
  }

  moveElement(sectionForm,fieldName){
    if(this.commonService.isnonEMptyString(fieldName)){
      const groupHead= sectionForm.get(fieldName)[FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_HEAD];
    const index = sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN].indexOf(fieldName);
    sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN].splice(index,1);
    sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN].push(fieldName);
    }
    
  }

  addDynamicControl(sectionForm){
    if(this.extraFields.length){
      for(let i = 1; i <= this.maxNbrContracts; i++){
        const tempArr = this.extraFields?.filter(val=>val.indexOf(i)>0);
        if(tempArr.length){
          const fieldName = tempArr[0];
          const groupHead= sectionForm.get(fieldName)?
          sectionForm.get(fieldName)[FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_HEAD] : null;
          if(this.commonService.isnonEMptyString(groupHead)
              && !tempArr.every(elem => sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN]
                .includes(elem))){
            sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN] =
            sectionForm.controls[groupHead][FccGlobalConstant.PARAMS][FccGlobalConstant.GROUP_CHILDREN].concat(tempArr);
          }
          tempArr.forEach(ele =>{
            sectionForm.addControl(ele, this.formControlService.getControl(this.extraFieldControls[ele]));
            sectionForm.updateValueAndValidity();
            sectionForm.controls[ele].value = this.extraFieldMappingVal[ele];
          });
        }
      }
    }
  }
}
