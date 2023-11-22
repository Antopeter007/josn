import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { ProductValidator } from '../../../../common/validator/productValidator';
import { ProductStateService } from '../../../../trade/lc/common/services/product-state.service';
import { FCMPaymentsConstants } from '../model/fcm-payments-constant';
@Injectable({
  providedIn: 'root'
})
export class PaymentInstrumentProductService implements ProductValidator{
  tnxTypeCode: any;
  setSinglePaymentData: BehaviorSubject<any> = new BehaviorSubject('');
  isPaymentMultiset = new BehaviorSubject(true);
  enrichmentGridEditIndex: BehaviorSubject<any> = new BehaviorSubject(0);
  enrichmentConfig = FCMPaymentsConstants.enrichmentConfig;
  enrichmentFlags = FCMPaymentsConstants.enrichmentFlags;
  enrichmentIndex: number | '';
  isNextFlag = false;
  loadCount = 0;
  autoSaveDataLoaded = false;
  
  constructor(protected eventEmitterService: EventEmitterService,
              protected productStateService: ProductStateService,
              protected translateService: TranslateService) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeSaveValidation(form?: any): boolean {
    return true;
  }

  /**
   * Invoked before submit
   */
  beforeSubmitValidation(): boolean {
    const isValid = this.validate();
    this.eventEmitterService.subFlag.next(isValid);
    return true;
  }

  validate() {
    const isValid = true;
    return isValid;
  }

  setDataForSinglePayment(data) {
    this.setSinglePaymentData.next(data);
  }

  setPaymentMultiset(flag: boolean){
    this.isPaymentMultiset.next(flag);
  }
  getPaymentMultisetFlag(){
    return this.isPaymentMultiset;

  }
  setEnrichmentGridEditIndex(index: number){
    this.enrichmentGridEditIndex.next(index);
  }
  getEnrichmentGridEditIndex(){
    return this.enrichmentGridEditIndex;
  }

  setEnrichmentIndex(index) {
    this.enrichmentIndex = index;
  }

  getEnrichmentIndex(){
    return this.enrichmentIndex;
  }
  resetEnrichmentConfig(){
    this.enrichmentConfig = {
      enrichmentFields: {},
      enrichmentFieldsName : [],
      columnOrder : [],
      editRecordIndex : 0,
      tempRowData : {}
    };
    this.enrichmentFlags = {
      hasEnrichmentFields : false,
      isEnrichTypeMultiple : true,
      isEnrichmentBtnClicked : false,
      isFieldLoadedOnScreen : false,
      isModeNew: true,
      isPackageChanged: false,
      loadEnrichDataAutoSaveFlag : false,
      isSaveValid : false,
      preloadData : false,
      isEditMode : this.enrichmentFlags.isEditMode,
      hasRequiredField : false
    };
  }
}
