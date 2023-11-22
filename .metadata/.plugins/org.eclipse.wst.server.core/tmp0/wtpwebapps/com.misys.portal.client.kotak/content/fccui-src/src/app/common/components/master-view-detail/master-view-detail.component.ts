import {
  Component,
  OnInit,
  Input,
  HostListener,
  OnDestroy
} from '@angular/core';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';
import { MasterViewDetailParams } from '../../model/params-model';

/**
 * component takes in input @see MasterViewDetailParams
 * calls productcomponent and initializes master state with input.
 */
@Component({
  selector: 'fcc-master-view-detail',
  templateUrl: './master-view-detail.component.html',
  styleUrls: ['./master-view-detail.component.scss']
})
export class MasterViewDetailComponent implements OnInit, OnDestroy {
  @Input() masterViewParams: MasterViewDetailParams;
  productParams: any; // input for product component
  header: string;
  enableHeader: boolean; // if should header be displayed

  constructor(protected dynamicDialogConfig: DynamicDialogConfig,
              protected ref: DynamicDialogRef,
              protected translateService: TranslateService,
              protected commonService: CommonService) {}

  ngOnInit(): void {
    // if component used for dialog, set input from dialog config
    if (this.dynamicDialogConfig) {
      this.masterViewParams = {
        productCode: this.dynamicDialogConfig.data.productCode,
        refId: this.dynamicDialogConfig.data.refId,
        tnxId: this.dynamicDialogConfig.data.tnxId,
        enableHeader: this.dynamicDialogConfig.data.enableHeader,
        accordionViewRequired: this.dynamicDialogConfig.data.accordionViewRequired,
        parent: this.dynamicDialogConfig.data.parent,
        viewMaster: this.dynamicDialogConfig.data.viewMaster,
        subTnxTypeCode: this.dynamicDialogConfig.data.subTnxType
      };
    }

    this.productParams = {
      productCode: this.masterViewParams.productCode,
      mode: FccGlobalConstant.VIEW_MODE,
      refId: this.masterViewParams.refId,
      tnxId: this.masterViewParams.tnxId,
      componentType: FccGlobalConstant.SUMMARY_DETAILS,
      accordionViewRequired: this.masterViewParams.accordionViewRequired,
      parent: this.masterViewParams.parent,
      reInit: false,
      viewMaster: this.masterViewParams.viewMaster,
      subTnxTypeCode: this.masterViewParams.subTnxTypeCode,
      isMasterView: true,
      isLoadMasterPopup: this.masterViewParams.productCode === FccGlobalConstant.PRODUCT_BG ? true : false
    };

    this.enableHeader = this.masterViewParams.enableHeader;
    const productHeader = this.translateService.instant(
      this.masterViewParams.productCode
    );
    this.header = productHeader.concat(' ', this.translateService.instant('Details'));
    this.commonService.isViewPopup = true;
    this.commonService.viewPopupFlag = true;
    this.commonService.parent = this.masterViewParams.parent;
  }

  @HostListener('document:keydown.escape') onKeydownHandler() {
    this.onDialogClose();
  }

  onDialogClose() {
    this.ref.close();
  }

  ngOnDestroy() {
    const parent = document.getElementsByTagName('body')[0];
    const dialog = document.getElementsByTagName('p-dynamicdialog')[0];
    if(dialog) {
      parent.removeChild(dialog);
    }
    this.commonService.isViewPopup = false;
    this.commonService.parent = false;
    this.commonService.viewPopupFlag = false;
  }
}
