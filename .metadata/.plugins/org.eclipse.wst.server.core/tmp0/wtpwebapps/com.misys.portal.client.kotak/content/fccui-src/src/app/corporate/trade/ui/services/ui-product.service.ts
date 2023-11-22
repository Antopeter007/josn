import { FccBusinessConstantsService } from './../../../../common/core/fcc-business-constants.service';
import { AmendCommonService } from './../../../common/services/amend-common.service';
import { Injectable } from '@angular/core';
import { ProductValidator } from '../../../common/validator/productValidator';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../../common/services/common.service';
import { FCCFormGroup } from '../../../../base/model/fcc-control.model';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { EventEmitterService } from '../../../../common/services/event-emitter-service';
import { ProductStateService } from '../../lc/common/services/product-state.service';
import { TransactionDetailService } from '../../../../common/services/transactionDetail.service';
import { FormAccordionPanelService } from '../../../../common/services/form-accordion-panel.service';

@Injectable({
  providedIn: 'root'
})
export class UiProductService implements ProductValidator{
  tnxTypeCode: any;
  isMasterRequired: boolean;
  enableCounterSection: boolean;
  provisionalBankList: Set<string> = new Set<string>();
  disableProvsnlgty: boolean;
  provisionalTagValue: any;
  disableProvsnlbnk: any;
  anyData1Data2Y: boolean;
  anyData2Y: boolean;

  constructor(protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService,
              protected commonService: CommonService,
              protected translateService: TranslateService,
              protected amendCommonService: AmendCommonService,
              protected transactionDetailService: TransactionDetailService,
              protected formAccordionPanelService: FormAccordionPanelService) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeSaveValidation(form?: any): boolean {
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    return true;
  }
  beforeSubmitValidation(): boolean {
    this.isMasterRequired = this.commonService.isMasterRequired;
    this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const isValid = this.validate();
    this.eventEmitterService.subFlag.next(isValid);
    return true;
  }

  validate() {
    let isValid = false;
    let sectionForm: FCCFormGroup;
    if (this.tnxTypeCode == null) {
      this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    }
    if (this.tnxTypeCode !== FccGlobalConstant.N002_INQUIRE) {
      sectionForm = this.productStateService.getSectionData('uiGeneralDetails', FccGlobalConstant.PRODUCT_BG, this.isMasterRequired);
      // Do Business Validation
    } else {
      sectionForm = this.productStateService.getSectionData('uiTransactionBrief', FccGlobalConstant.PRODUCT_BG, this.isMasterRequired);
    }
    if (sectionForm) {
      isValid = true;
    }
    return isValid;
  }

  toggleFormFields(showField, form, fieldsToToggle) {
    if (showField) {
      fieldsToToggle.forEach(ele => {
        form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      });
    } else {
      fieldsToToggle.forEach(ele => {
        form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = false;
      });
    }
  }

  toggleRequired(setRequired, form, fieldsToToggle) {
    if (setRequired) {
      fieldsToToggle.forEach(ele => {
        form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = true;
      });
    } else {
      fieldsToToggle.forEach(ele => {
        form.get(ele)[FccGlobalConstant.PARAMS][FccGlobalConstant.REQUIRED] = false;
      });
    }
  }

  uiUndertakingDetailsAfterViewInit(form: FCCFormGroup) {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const formAccordionPanels = form.get('uiUndertakingDetails')[FccGlobalConstant.PARAMS][`formAccordionPanels`];
    // Show shipment and payment details sections, only for STBY.
    if (tnxTypeCode === FccGlobalConstant.N002_NEW || tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      const generalDetailsForm: FCCFormGroup =
      this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired);
      const toggleSections = [FccGlobalConstant.UI_SHIPMENT_DETAILS, FccGlobalConstant.UI_PAYMENT_DETAILS];

      if (generalDetailsForm.get('bgSubProductCode') &&
      (generalDetailsForm.get('bgSubProductCode').value === FccGlobalConstant.STBY
      || generalDetailsForm.get('bgSubProductCode').value[0].value === FccGlobalConstant.STBY)) {
        this.toggelFormAccordionPanel(form, formAccordionPanels, toggleSections, true);
      } else {
        this.toggelFormAccordionPanel(form, formAccordionPanels, toggleSections, false);
      }
    }
    // Hide Terms Panel for Amend
    if (tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.toggelFormAccordionPanel(form, formAccordionPanels, [FccGlobalConstant.UI_TERMS], false);
    }

    // Show extension section only in case of Fixed Expiry type(02).
    const typeExpiryForm = form.get('uiTypeAndExpiry');
    if (typeExpiryForm.get('bgExpDateTypeCode') && (typeExpiryForm.get('bgExpDateTypeCode').value === '01'
    || typeExpiryForm.get('bgExpDateTypeCode').value === '03')) {
      this.toggelFormAccordionPanel(form, formAccordionPanels, [FccGlobalConstant.UI_EXTENSION_DETAILS], false);
    } else {
      this.toggelFormAccordionPanel(form, formAccordionPanels, [FccGlobalConstant.UI_EXTENSION_DETAILS], true);
    }
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.undertakingAmendFormFields();
    }
  }

  undertakingAmendFormFields() {
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    const operation = this.commonService.getQueryParametersFromKey(FccGlobalConstant.OPERATION);
    if (mode !== FccGlobalConstant.VIEW_MODE && operation !== FccGlobalConstant.PREVIEW) {
    this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.UI_UNDERTAKING_DETAILS);
    }
   }

   toggelFormAccordionPanel(form: FCCFormGroup, formAccordionPanels: any[], controls: string[], rendered: boolean) {
    for (let i = 0; i < formAccordionPanels.length ; i++) {
      const accordion = formAccordionPanels[i];
      const controlName = accordion.controlName;
      if (controls.indexOf(controlName) > -1) {
        accordion.rendered = rendered;
        const subsectionForm = form.controls[controlName] as FCCFormGroup;
        subsectionForm[FccGlobalConstant.RENDERED] = rendered;
        form.controls[controlName] = subsectionForm;
        form.updateValueAndValidity();
      }
    }
  }


  uiBankDetailsAfterViewInit(subProductValue: string, confirmationPartyValue: string, form: FCCFormGroup, event: any) {
    const confirmingBankFields = ['confirmingBankIcons', 'confirmingSwiftCode', 'confirmingBankName',
  'confirmingBankFirstAddress', 'confirmingBankSecondAddress', 'confirmingBankThirdAddress'];
    if (subProductValue === FccGlobalConstant.STBY && confirmationPartyValue !== FccBusinessConstantsService.WITHOUT_03) {
      if (form.get('uiConfirmingBank')) {
        confirmingBankFields.forEach(id => this.toggleControl(form.get('uiConfirmingBank'), id, true));
        form.get('uiConfirmingBank')[FccGlobalConstant.RENDERED] = true;
      }

    } else {
      // elementRef.nativeElement.querySelectorAll('.mat-tab-label.mat-focus-indicator.mat-ripple')
      event.get("bankDetailsTab").get("querySelectorAllValue")[
        FccGlobalConstant.LENGTH_4
      ].style.display = "none";

      if (form.get('uiConfirmingBank')) {
      form.get('uiConfirmingBank').reset();
      confirmingBankFields.forEach(id => this.toggleControl(form.get('uiConfirmingBank'), id, false));
      form.get('uiConfirmingBank')[FccGlobalConstant.RENDERED] = false;
      }
          form.updateValueAndValidity();
    }
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    const localAdviseThroughFields = ['localAdviseThroughSwiftCode', 'localAdviseThroughName', 'localAdviseThroughFirstAddress',
  'localAdviseThroughFirstAddress', 'localAdviseThroughSecondAddress', 'localAdviseThroughThirdAddress'];
 const purpose = this.productStateService.getSectionData(FccGlobalConstant.UI_GENERAL_DETAIL, undefined, this.isMasterRequired)
  .get('purposeUI').value;
  this.commonService.loadDefaultConfiguration().subscribe(response => {
    if (response) {
      this.enableCounterSection = response.enableCounterSection;
      if (this.enableCounterSection === true && ((tnxTypeCode === FccGlobalConstant.N002_AMEND && purpose[0] !== "" 
      && purpose[0].value !== "" && purpose[0].value !== '01')
      || (purpose !== '01' && tnxTypeCode === FccGlobalConstant.N002_NEW ))) {
        if (form.get('uilocalAdviseThrough')) {
          localAdviseThroughFields.forEach(id => this.toggleControl(form.get('uilocalAdviseThrough'), id, true));
          form.get('uilocalAdviseThrough')[FccGlobalConstant.RENDERED] = true;
        }
      } else {
         // elementRef.nativeElement.querySelectorAll('.mat-tab-label.mat-focus-indicator.mat-ripple')
         event.get("bankDetailsTab").get("querySelectorAllValue")[
          FccGlobalConstant.LENGTH_3
        ].style.display = "none";
        if (form.get('uilocalAdviseThrough')) {
          form.get('uilocalAdviseThrough').reset();
          localAdviseThroughFields.forEach(id => this.toggleControl(form.get('uilocalAdviseThrough'), id, false));
          form.get('uilocalAdviseThrough')[FccGlobalConstant.RENDERED] = false;
          }

        }
    }
  });

        this.tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TNX_TYPE_CODE);
    if (this.tnxTypeCode === FccGlobalConstant.N002_AMEND) {
      this.amendCommonService.setValueFromMasterToPrevious(FccGlobalConstant.UI_BANK_DETAILS);
    }

  }

  viewSpecimenHyperLink() {
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    // SPECIFICCUSTOMER && UISTATIC
    const obj = {
      eventId: '', masterId: '', productCode: FccGlobalConstant.PRODUCT_BG, guaranteeName: '', guaranteeCompanyId: '',
      guaranteeTextId: '', docId: '', mode: '', styleSheet: '', formDataXml: ''
    };
    if (this.commonService.uiBankDetailResponseObj.bg_text_details_code === '01' &&
        !isNaN(this.commonService.uiBankDetailResponseObj.document_id)) {
      obj.docId = `${this.commonService.uiBankDetailResponseObj.document_id}`;
      obj.guaranteeCompanyId = `${this.commonService.uiBankDetailResponseObj.guarantee_type_company_id}`;
      this.downloadFileWithContent(obj);
    }
    // UI BANK TEMPLATE EDITOR
    if (this.commonService.uiBankDetailResponseObj.bg_text_details_code === '02'
    && isNaN(this.commonService.uiBankDetailResponseObj.document_id)) {
      if (mode === FccGlobalConstant.INITIATE) {
        obj.masterId = `${this.commonService.referenceId}`;
        obj.eventId = `${this.commonService.eventId}`;
        obj.guaranteeName = `${this.commonService.uiBankDetailResponseObj.guarantee_type_name}`;
        obj.guaranteeCompanyId = `${this.commonService.uiBankDetailResponseObj.guarantee_type_company_id}`;
        obj.productCode = FccGlobalConstant.PRODUCT_BG;
        this.downloadFileWithContent(obj);
      }
      if (mode === FccGlobalConstant.DRAFT_OPTION) {
        const refId = this.commonService.referenceId !== undefined ? this.commonService.referenceId :
        this.commonService.getQueryParametersFromKey(FccGlobalConstant.refId);
        const eventId = this.commonService.eventId !== undefined ? this.commonService.eventId :
        this.commonService.getQueryParametersFromKey(FccGlobalConstant.tnxId);
        obj.masterId = `${refId}`;
        obj.eventId = `${eventId}`;
        obj.guaranteeName = `${this.commonService.uiBankDetailResponseObj.guarantee_type_name}`;
        obj.guaranteeCompanyId = `${this.commonService.uiBankDetailResponseObj.guarantee_type_company_id}`;
        this.downloadFileWithContent(obj);
      }
    }
    // xsla
    if (this.commonService.uiBankDetailResponseObj.stylesheetname !== '**') {
      const formDataObj = 'formData';
      obj.styleSheet = `${this.commonService.uiBankDetailResponseObj.stylessheetname}`;
      obj[formDataObj] = JSON.stringify(this.commonService.currentStateTnxResponse);
      this.downloadFileWithContent(obj);
    }
  }

  async downloadFileWithContent(obj) {
    await this.transactionDetailService.downloadUndertakingSpecimenEditor(obj).toPromise().then(response => {
      let fileType;
      if (response.body.type) {
        fileType = response.type;
      } else {
        fileType = 'application/octet-stream';
      }
      const newBlob = new Blob([response.body], { type: fileType });
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newBlob);
        return;
      }
      const data = window.URL.createObjectURL(newBlob);
      const link = document.createElement('a');
      link.href = data;
      // eslint-disable-next-line no-useless-escape
      const filename = response.headers.get('content-disposition').split(';')[1].split('=')[1].replace(/\"/g, '');
      link.download = filename;
      // link.download = fileName;
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      window.URL.revokeObjectURL(data);
      link.remove();
    });
  }

  toggleControl(form, id, flag) {
    form.controls[id].params.rendered = flag;
  }

  swift2023Changes(){
    if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023) {
      const formaccordion = this.formAccordionPanelService.getAccordionSectionControlMap();
      if(formaccordion.get('uiUndertakingDetails') &&
      formaccordion.get('uiUndertakingDetails').get('bgNarrativeAdditionalAmount')) {
        formaccordion.get('uiUndertakingDetails').get('bgNarrativeAdditionalAmount')['params'][FccGlobalConstant.LABEL]
        = this.translateService.instant('supplementAmountInfo');
      }
      if(formaccordion.get('uiCuCounterDetails') &&
      formaccordion.get('uiCuCounterDetails').get('cuNarrativeAdditionalAmount')) {
        formaccordion.get('uiCuCounterDetails').get('cuNarrativeAdditionalAmount')['params'][FccGlobalConstant.LABEL]
        = this.translateService.instant('supplementAmountInfo');
      }
      if(formaccordion && formaccordion.get('uiUndertakingDetails') &&
      formaccordion.get('uiUndertakingDetails').get('bgGovernCountrySubdiv')) {
      formaccordion.get('uiUndertakingDetails').get('bgGovernCountrySubdiv')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }
      if(formaccordion && formaccordion.get('uiCuCounterDetails') &&
      formaccordion.get('uiCuCounterDetails').get('cuGovernCountrySubdiv')) {
      formaccordion.get('uiCuCounterDetails').get('cuGovernCountrySubdiv')[FccGlobalConstant.PARAMS][FccGlobalConstant.RENDERED] = true;
      }

      if(this.productStateService.getSectionData('uiBankInstructions', undefined, false, FccGlobalConstant.EVENT_STATE))
      {
        this.productStateService.getSectionData('uiBankInstructions', undefined, false, FccGlobalConstant.EVENT_STATE)
        .get('bgDeliveryToOther')['params'][FccGlobalConstant.LABEL] = this.translateService.instant('narrative');
      }
      if(this.productStateService.
        getSectionData('uiBankInstructions') && this.productStateService.
        getSectionData('uiBankInstructions').get('bgDeliveryToOther')) {
        this.productStateService.
        getSectionData('uiBankInstructions').get('bgDeliveryToOther')['params'][FccGlobalConstant.LABEL]
        = this.translateService.instant('narrative');
      }
    }
  }

  keyDataResponseBank(value, disableProvisionalbnk){
    this.commonService.getParamData(FccGlobalConstant.PRODUCT_BG, 'P306').subscribe(response => {
      this.provisionalBankList = this.commonService.getQueryParametersFromKey('provisionalBankList');
      let index = 0;
      for (const currentNumber of this.provisionalBankList) {
        if(currentNumber === value){
          for (let i = 0; i < response.largeParamDetails.length; i++) {
            if (response.largeParamDetails[i].largeParamKeyDetails !== null) {
              if(response.largeParamDetails[i].largeParamKeyDetails.key_1 === currentNumber){
                index =i;
              }
            }
          }
          if (response.largeParamDetails[index].largeParamDataList[0].data_2 === 'Y') {
            disableProvisionalbnk = false;
          }
        }
        else if(!this.provisionalBankList.has(value)){
          for (let i = 0; i < response.largeParamDetails.length; i++) {
            if (response.largeParamDetails[i].largeParamKeyDetails !== null
              && response.largeParamDetails[i].largeParamKeyDetails.key_1 === '*') {
              if (response.largeParamDetails[i].largeParamDataList !== null) {
                if (response.largeParamDetails[i].largeParamDataList[0].data_2 === 'Y') {
                  disableProvisionalbnk = false;
                }
              }
            }
          }
        }
      }
    });
    this.disableProvsnlbnk = disableProvisionalbnk;
    return disableProvisionalbnk;
  }

  keyDataResponseGurtType(value, disableProvisionalgurt){
    this.commonService.getParamData(FccGlobalConstant.PRODUCT_BG, 'P306').subscribe(response => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.provisionalBankList = this.commonService.getQueryParametersFromKey('provisionalBankList');
      this.anyData1Data2Y = false;
      this.anyData2Y = false;
      if(value){
        for (let i = 0; i < response.largeParamDetails.length; i++) {
          if(response.largeParamDetails[i].largeParamDataList !== null 
            && (response.largeParamDetails[i].largeParamDataList[0].data_1 === value 
              || response.largeParamDetails[i].largeParamDataList[0].data_1 ==='*')
            && response.largeParamDetails[i].largeParamDataList[0].data_2 === 'Y' 
            && response.largeParamDetails[i].largeParamKeyDetails.key_1 != '*'){
              disableProvisionalgurt = false;
              this.anyData1Data2Y = true;
            }
          if(response.largeParamDetails[i].largeParamDataList !== null
            && response.largeParamDetails[i].largeParamDataList[0].data_2 === 'Y' 
            && response.largeParamDetails[i].largeParamKeyDetails.key_1 != '*'){
              this.anyData2Y = true;
            }
        }
      }
      if(value && !this.anyData1Data2Y && !this.anyData2Y){
        for (let i = 0; i < response.largeParamDetails.length; i++) {
          if (response.largeParamDetails[i].largeParamDataList !== null) {
            if((response.largeParamDetails[i].largeParamDataList[0].data_1 === value 
              || response.largeParamDetails[i].largeParamDataList[0].data_1 ==='*')
              && response.largeParamDetails[i].largeParamDataList[0].data_2 === 'Y' 
              && response.largeParamDetails[i].largeParamKeyDetails.key_1 === '*'){
                disableProvisionalgurt = false;
              }
          }
        }
      }
    });
    this.disableProvsnlgty = disableProvisionalgurt;
    return disableProvisionalgurt;
  }

  enableDisableProvGurtType(){
    return this.disableProvsnlgty;
  }

  enableDisableProvBank(){
    return this.disableProvsnlbnk;
  }
}
