import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FccGlobalConstant } from './../../core/fcc-global-constants';
@Component({
  selector: 'app-additional-info-tab',
  templateUrl: './additional-info-tab.component.html',
  styleUrls: ['./additional-info-tab.component.scss']
})
export class AdditionalInfoTabComponent implements OnInit {
  cols: any[];
  col1 = ['fdsfd', 'fdsfds', 'fdsfsd'];
  dir: string = localStorage.getItem('langDir');
  widgetDetails: any;
  items;
  referenceId;
  productCode;
  subProductCode;

  constructor( protected activatedRoute: ActivatedRoute, protected fccGlobalConstant: FccGlobalConstant) { }

  ngOnInit(): void {
    this.items = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    const productCode = 'productCode';
    const referenceid = 'referenceid';
    const subProductCode = 'subProductCode';
    this.activatedRoute.queryParams.subscribe(params => {
      this.referenceId = params[referenceid];
      this.productCode = this.referenceId.substring(FccGlobalConstant.LENGTH_0, FccGlobalConstant.LENGTH_2);
      this.subProductCode = params[subProductCode];
    });

    if (this.items.recordDetails[productCode] === 'LN' || this.items.recordDetails[productCode] === 'BK' ||
      (this.items.recordDetails[productCode] === FccGlobalConstant.PRODUCT_SE &&
        this.subProductCode === FccGlobalConstant.SUB_PRODUCT_LNCDS)) {
      this.cols = [
        { field: 'additionalInfoTableComponent', header: 'Attachment' }
      ];
    }else if (this.productCode === FccGlobalConstant.PRODUCT_EC || this.productCode === FccGlobalConstant.PRODUCT_IC ||
      this.productCode === FccGlobalConstant.PRODUCT_EL){
      this.cols = [
        { field: 'additionalInfoTableComponent', header: FccGlobalConstant.BANK_ATTACHMENT },
        { field: 'additionalInfoTableComponent', header: FccGlobalConstant.ATTACHMENT },
        { field: 'additionalInfoTableComponent', header: FccGlobalConstant.DOCUMENT_DETAILS },
        { field: 'additionalInfoTableComponent', header: FccGlobalConstant.FEES_AND_CHARGES }
      ];
    }else if(this.productCode === FccGlobalConstant.PRODUCT_FT && this.subProductCode !== FccGlobalConstant.FT_TTPT
      && this.subProductCode !== FccGlobalConstant.FT_TINT) {
      this.cols = [
        { field: 'additionalInfoTableComponent', header: FccGlobalConstant.BANK_ATTACHMENT },
        { field: 'additionalInfoTableComponent', header: FccGlobalConstant.FEES_AND_CHARGES }
      ];
    }else {
      this.cols = [
        { field: 'additionalInfoTableComponent', header: FccGlobalConstant.BANK_ATTACHMENT },
        { field: 'additionalInfoTableComponent', header: FccGlobalConstant.ATTACHMENT },
        { field: 'additionalInfoTableComponent', header: FccGlobalConstant.FEES_AND_CHARGES }
      ];
    }
  }

}
