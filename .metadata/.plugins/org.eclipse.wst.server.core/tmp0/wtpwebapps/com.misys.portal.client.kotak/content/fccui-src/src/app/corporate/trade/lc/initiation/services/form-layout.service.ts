import { FccGlobalConstant } from './../../../../../common/core/fcc-global-constants';
import { CommonService } from '../../../../../common/services/common.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/**
 * Layout service class to return layout type values based on form modes
 * Use this service to delegate various styles used in formmodel so different modes can be handled
 */
export class FormLayoutService {

  LAYOUT_VALUE = 'p-col-12 p-md-12 p-lg-12 p-sm-12 padding_zero';
  constructor(protected commonService: CommonService) { }
  /**
   * Returns layout class based on the form mode
   */
  getlayoutClass(): string {
    const tnxTypeCode = this.commonService.getQueryParametersFromKey(FccGlobalConstant.TRANSACTION_TYPE_CODE);
    switch (tnxTypeCode) {
      case FccGlobalConstant.N002_AMEND: {
        return FccGlobalConstant.LAYOUT_COL_12_LEFT;
      }
      default: {
        return this.LAYOUT_VALUE;
      }
    }
  }



}
