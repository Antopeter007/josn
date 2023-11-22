import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../../../common/services/common.service';
import { FccGlobalConstant } from '../../../../common/core/fcc-global-constants';
import { EventEmitterService } from '../../../../common/services/event-emitter-service';
import { ProductStateService } from '../../lc/common/services/product-state.service';
import { ProductValidator } from '../../../common/validator/productValidator';
import { PhrasesService } from '../../../../common/services/phrases.service';
import { TransactionDetailService } from '../../../../common/services/transactionDetail.service';

@Injectable({
  providedIn: 'root'
})
export class SiProductService implements ProductValidator {

  editModeDownloadData: any;

  constructor(protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService,
              protected commonService: CommonService,
              protected translateService: TranslateService,
              protected transactionDetailService: TransactionDetailService,
              protected phrasesService: PhrasesService) { }

  disableRequestOptionsOnSave(form) {
    if (form !== undefined && form.get(FccGlobalConstant.REQUEST_OPTION_LC) !== undefined &&
        form.get(FccGlobalConstant.REQUEST_OPTION_LC) !== null) {
      const requestOptions = form.get(FccGlobalConstant.REQUEST_OPTION_LC)[FccGlobalConstant.PARAMS][FccGlobalConstant.OPTIONS];
      requestOptions.forEach( (element) => {
        element[FccGlobalConstant.DISABLED] = true;
      });
      form.get(FccGlobalConstant.REQUEST_OPTION_LC)[FccGlobalConstant.PARAMS][FccGlobalConstant.DISABLED] = true;
      form.get(FccGlobalConstant.REQUEST_OPTION_LC).updateValueAndValidity();
    }
  }

  beforeSaveValidation(form?): boolean {
    this.disableRequestOptionsOnSave(form);
    // eslint-disable-next-line no-console
    console.log('beforeSaveValidation invoked');
    return true;
  }

  swift2023Changes(form){
    this.commonService.getSwiftVersionValue();
        if(this.commonService.swiftVersion >= FccGlobalConstant.SWIFT_2023){
           if(form.get('addamtlabel') && form.get('addAmtTextArea')){
            form.get('addamtlabel')[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] 
         = this.translateService.instant('supplementAmountInfo');
         form.get('addAmtTextArea')[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL]
          = this.translateService.instant('supplementAmountInfo');
       }
        if(form.get(FccGlobalConstant.DELV_TO_OTHER_INST)){
        form.get(FccGlobalConstant.DELV_TO_OTHER_INST)[FccGlobalConstant.PARAMS][FccGlobalConstant.LABEL] 
        = this.translateService.instant('narrative');

        this.productStateService.getSectionData(FccGlobalConstant.SI_INSTRUCTIONS_TO_BANK)
          .get('deliveryToOtherInst')['params'][FccGlobalConstant.LABEL]
          = this.translateService.instant('narrative');

          if(this.productStateService.
            getSectionData(FccGlobalConstant.SI_INSTRUCTIONS_TO_BANK, undefined, false, FccGlobalConstant.EVENT_STATE))
          {
            this.productStateService.
            getSectionData(FccGlobalConstant.SI_INSTRUCTIONS_TO_BANK, undefined, false, FccGlobalConstant.EVENT_STATE)
            .get('deliveryToOtherInst')['params'][FccGlobalConstant.LABEL] = this.translateService.instant('narrative');
          }
        }
      }
      }
  

  beforeSubmitValidation(): boolean {
    const isValid = this.validate();
    this.eventEmitterService.subFlag.next(isValid);
    // eslint-disable-next-line no-console
    console.log('beforeSubmitValidation invoked');
    return true;
  }

  viewSpecimenHyperLink() {
    const mode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.MODE);
    // SPECIFICCUSTOMER && UISTATIC
    // SPECIFICCUSTOMER && STANDBYSTATIC
    const obj = {
      eventId: '', masterId: '', productCode: '', featureId: '', companyId: '',
      docId: '', mode: '', styleSheet: ''
    };
    if (this.commonService.siBankDetailResponseObj.standby_text_type_code === '01' &&
    !isNaN(this.commonService.siBankDetailResponseObj.document_id)) {
      obj.docId = `${this.commonService.siBankDetailResponseObj.document_id}`;
      obj.companyId = `${this.commonService.siBankDetailResponseObj.standby_template_bank_id}`;
      obj.productCode = FccGlobalConstant.PRODUCT_SI;
    }
    // STANDBYEDITER
    if (this.commonService.siBankDetailResponseObj.standby_text_type_code === '02' &&
    isNaN(this.commonService.siBankDetailResponseObj.document_id)) {
      if (mode === FccGlobalConstant.INITIATE) {
        obj.masterId = `${this.commonService.referenceId}`;
        obj.eventId = `${this.commonService.eventId}`;
        obj.featureId = `${this.commonService.siBankDetailResponseObj.stand_by_lc_code}`;
        obj.companyId = `${this.commonService.siBankDetailResponseObj.standby_template_bank_id}`;
        obj.productCode = FccGlobalConstant.PRODUCT_SI;
      }
      if (mode === FccGlobalConstant.DRAFT_OPTION) {
        obj.masterId = `${this.commonService.referenceId}`;
        obj.eventId = `${this.commonService.eventId}`;
        obj.featureId = `${this.commonService.siBankDetailResponseObj.stand_by_lc_code}`;
        obj.companyId = `${this.editModeDownloadData.standby_template_bank_id}`;
        obj.productCode = FccGlobalConstant.PRODUCT_SI;
      }
    }
    // xsl
    if (this.commonService.siBankDetailResponseObj.stylesheetname !== '**') {
      const formDataObj = 'formData';
      obj.styleSheet = `${this.commonService.siBankDetailResponseObj.stylesheetname}`;
      obj.productCode = FccGlobalConstant.PRODUCT_SI;
      obj[formDataObj] = JSON.stringify(this.phrasesService.payloadObject.transaction);
    }
    this.downloadFileWithContent(obj);
  }

  async downloadFileWithContent(obj) {
    await this.transactionDetailService.downloadEditor(obj).toPromise().then(response => {
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
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      window.URL.revokeObjectURL(data);
      link.remove();
    });
  }

  validate() {
    return true;
  }
}
