import { FilelistService } from './../../../corporate/trade/lc/initiation/services/filelist.service';
import { UtilityService } from './../../../corporate/trade/lc/initiation/services/utility.service';
import { Router } from '@angular/router';
import { FormSubmitService } from './../../services/form-submit.service';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from './../../services/common.service';
import { FccConstants } from '../../core/fcc-constants';
import { FcmErrorHandlingService } from '../../services/fcm-error-handling.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-review-submit-button',
  templateUrl: './review-submit-button.component.html',
  styleUrls: ['./review-submit-button.component.scss']
})
export class ReviewSubmitButtonComponent implements OnInit, OnDestroy {

  currency;
  widgetDetails: any;
  componentDetails: any;
  widgets;
  masterData;
  success = `${this.translate.instant('success')}`;
  dir: string = localStorage.getItem('langDir');
  successMessage = null;
  reviewDetail = [];
  productCode: string;
  response: any;
  coloumNo;
  refId: string;
  tnxId: string;
  subProductCode: string;
  buttonItemList = [];
  tnxTypeCode: string;
  action: string;
  buttons: string;
  templateName: string;
  subTnxTypeCode: string;
  option: string;
  category: string;
  nudges = [];
  tabName ='single';
  readonly titleKey = 'titleKey';
  selectedTab$: Subscription;


  constructor(protected translate: TranslateService,
              protected formSubmitService: FormSubmitService,
              protected router: Router,
              protected utilityService: UtilityService,
              protected fileList: FilelistService,
              protected commonService: CommonService,
              protected fcmErrorHandlingService: FcmErrorHandlingService ) { }

  ngOnInit(): void {

    const noOfColoums = 'noOfColoums';
    this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    this.componentDetails = this.widgets.widgetData;
    this.response = this.setResponse(this.widgets.response);
    this.coloumNo = this.componentDetails[noOfColoums];
    this.productCode = this.response.product_code? this.response.product_code
      : this.response.transactionMeta ? JSON.parse(this.response.transactionMeta).product_code
      : undefined;
    this.action = this.response.reauthDataAction? this.response.reauthDataAction
      : this.response.transactionMeta ? JSON.parse(this.response.transactionMeta).reauthDataAction
      : undefined;
    this.templateName = this.response.template_id;
    this.tnxTypeCode = this.response.tnx_type_code;
    this.subProductCode = this.response.sub_product_code;
    this.subTnxTypeCode = this.response.sub_tnx_type_code;
    this.option = this.response?.option;
    this.category = this.response?.category? this.response.category
      : this.response.transactionMeta ? JSON.parse(this.response.transactionMeta).category
      : undefined;
    if (this.response.groupId && this.commonService.isnonEMptyString(this.response.groupId)) {
      this.productCode = FccConstants.PRODUCT_TYPE_BENEFECIARY;
    } else if (this.commonService.isEmptyValue(this.productCode) && this.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC
    && this.category === FccConstants.FCM) {
      this.productCode = FccConstants.PRODUCT_CODE_BENE_MAINTENANCE;
    }

    this.selectedTab$ = this.commonService.selectedTab.subscribe((item) => {
      if(item && item.productTypeName){
        this.tabName = item.productTypeName;
      }
    });

    const nudgesData = { "widgetName": this.componentDetails.widgetName };
    const option = this.commonService.getOptionQueryParameterFCM();
    const productCode = this.commonService.getFCMProductCode(option, this.tabName);
    if(productCode) {
      this.commonService.getNudges(JSON.stringify(nudgesData), productCode, '').then(data => {
        this.nudges = data;
      });
    }

    if ( typeof this.templateName !== 'undefined' &&
        (typeof this.tnxTypeCode === 'undefined' || this.tnxTypeCode === '' || this.tnxTypeCode === null)
        && this.productCode !== FccConstants.PRODUCT_TYPE_BENEFECIARY) {
      this.action = FccGlobalConstant.TEMPLATE;
    }

    this.renderButton();

  }


  async renderButton() {
    if(this.commonService.isEmptyValue(this.productCode)){
      this.category = this.commonService.getQueryParametersFromKey('category');
      const option = this.commonService.getQueryParametersFromKey('option');
      if (this.category === FccConstants.FCM){
        this.productCode = this.fcmErrorHandlingService.getFcmProductCode(option);
      }
    }
    if (this.action === FccGlobalConstant.TEMPLATE) {
     this.buttons = 'buttons' + '_' + FccGlobalConstant.TEMPLATE + '_' + this.productCode;
    } else if (this.productCode === FccGlobalConstant.PRODUCT_BK ||
      (this.productCode === FccGlobalConstant.PRODUCT_SE &&
        this.subProductCode === FccGlobalConstant.SUB_PRODUCT_LNCDS) ) {
      this.buttons = 'buttons' + '_' + this.productCode + '_' + this.subProductCode;
    } else if (this.productCode === FccGlobalConstant.PRODUCT_SE &&
        (this.subProductCode === FccGlobalConstant.SUB_PRODUCT_ULOAD
          || this.subProductCode === FccGlobalConstant.SUB_PRODUCT_SEEML
          || this.subProductCode === FccGlobalConstant.SUB_PRODUCT_CTCHP)) {
      this.buttons = 'buttons' + '_' + this.productCode + '_' + this.subProductCode;
    } else {
     this.buttons = 'buttons' + '_' + this.productCode;
    }
    this.buttonItemList = await this.formSubmitService.getButtonPermission(this.componentDetails[this.buttons],
      this.productCode, this.subProductCode, this.tnxTypeCode, this.action, this.subTnxTypeCode );

    for (let i = 0; i < this.buttonItemList.length; i++ ) {
      if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
        this.buttonItemList[i].styleClass = this.buttonItemList[i].styleClass + ' buttonShiftLeft';
      } else if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_OTHERLANG && i === 0) {
        this.buttonItemList[i].styleClass = this.buttonItemList[i].styleClass + ' buttonShiftRight';
        break;
      }
    }

  }

  navigateButtonUrl(url, params: JSON) {
    this.commonService.channelRefNo.next(null);
    this.utilityService.resetForm();
    this.fileList.resetList();
    this.fileList.resetDocumentList();

    if (params[FccGlobalConstant.IS_REF_ID_REQ]) {
      delete params[FccGlobalConstant.IS_REF_ID_REQ];
      params[FccGlobalConstant.REFERENCE_ID] = this.commonService.referenceId;
    }

    if (params[FccGlobalConstant.IS_TNX_ID_REQ]) {
      delete params[FccGlobalConstant.IS_TNX_ID_REQ];
      params[FccGlobalConstant.TNXID] = this.commonService.eventId;
    }

    this.router.navigate([url], {
      queryParams: params,
    });
  }

  setDivStyle() {
    if (this.dir === FccGlobalConstant.LANUGUAGE_DIR_ARABIC) {
      return 'buttonArabic';
    } else {
      return 'buttonOtherLang';
    }
  }

  setResponse(response) {
    this.category = this.commonService.getQueryParametersFromKey('category')?
    this.commonService.getQueryParametersFromKey('category'): response.transactionMeta?
    JSON.parse(response.transactionMeta).category : undefined;
    if ((response.status === FccGlobalConstant.API_ERROR_CODE_500 || response.status === FccGlobalConstant.API_ERROR_CODE_401
      || response.status === FccGlobalConstant.API_ERROR_CODE_501)&& this.category === FccConstants.FCM){
      return JSON.parse(response.transactionMeta);
    }
    if (response.error && JSON.parse(response.error)[this.titleKey] === 'TECHNICAL_ERROR') {
      return JSON.parse(response.transactionMeta);
    }
    return response;
  }

  ngOnDestroy(): void {
    this.selectedTab$.unsubscribe();
  }
}
