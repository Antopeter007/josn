import { Injectable } from '@angular/core';
import { FccGlobalConstant } from '../core/fcc-global-constants';

@Injectable({
  providedIn: 'root'
})
export class FormatAmdNoService {

  constructor() {
    //eslint : no-empty-function
  }

    public formatAmdNo(amdNo: string): string | undefined {
      let formattedAmdNo = '';
      if (amdNo !== null && amdNo !== '' && amdNo !== undefined) {
        formattedAmdNo = amdNo.padStart(FccGlobalConstant.LENGTH_3, '0');
        return formattedAmdNo;
      }
    }
}
