import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitterService } from '../../../../../common/services/event-emitter-service';
import { ProductValidator } from '../../../../common/validator/productValidator';
import { ProductStateService } from '../../../../trade/lc/common/services/product-state.service';

@Injectable({
  providedIn: 'root'
})
export class ChequeBookRequestProductService implements ProductValidator{
  tnxTypeCode: any;

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
}
