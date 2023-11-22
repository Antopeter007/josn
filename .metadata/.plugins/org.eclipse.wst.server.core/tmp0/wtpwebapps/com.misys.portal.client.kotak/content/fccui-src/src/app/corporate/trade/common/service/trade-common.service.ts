import { FccBusinessConstantsService } from './../../../../common/core/fcc-business-constants.service';
import { CommonService } from '../../../../common/services/common.service';
import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class TradeCommonService {

  constructor(protected commonService: CommonService) {

    }

  /**
   * Returns true if the transmission mode is SWIFT.
   * @param transmissionMode - is the mode of transmission
   */
  isSwiftTransmissionMode(transmissionMode: string): boolean{
    return this.commonService.isNonEmptyValue(transmissionMode) && transmissionMode === FccBusinessConstantsService.SWIFT;
  }
}
