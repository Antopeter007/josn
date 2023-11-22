import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProductStateService } from '../../../../app/corporate/trade/lc/common/services/product-state.service';
import { CommonService } from '../../services/common.service';
import { FcmErrorHandlingService } from '../../services/fcm-error-handling.service';
import { FccConstants } from './../../core/fcc-constants';
import { FormSubmitService } from './../../services/form-submit.service';
import { UserFeedbackService } from '../../services/feedback-service';
import { FccGlobalConstantService } from './../../core/fcc-global-constant.service';
import { Subscription } from 'rxjs';
import { FccGlobalConstant } from './../../core/fcc-global-constants';

@Component({
  selector: 'app-review-form-submit',
  templateUrl: './review-form-submit.component.html',
  styleUrls: ['./review-form-submit.component.scss']
})

export class ReviewFormSubmitComponent implements OnInit {

  productCode: string;
  reviewScreenWidgets = [];
  apiresponse: any = {};
  subproductcode: string;
  tnxtypecode: string;
  action: string;
  templateName: string;
  category: string;
  globalDashboardUrl: any;
  isFeedbackRequired: boolean;
  displayparamCombo1: string;
  displayparamCombo2: string;
  subscriptions: Subscription[] = [];
  inputParams = {};

  constructor(
    protected translate: TranslateService,
    protected formSubmitService: FormSubmitService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected commonService: CommonService,
    protected stateService: ProductStateService,
    protected fcmErrorHandlingService: FcmErrorHandlingService,
    protected userFeedbackService: UserFeedbackService,
    protected fccGlobalConstantService: FccGlobalConstantService
  ) {
    if ( this.router.getCurrentNavigation().extras
        && this.router.getCurrentNavigation().extras.state
        && this.router.getCurrentNavigation().extras.state.response) {
        this.apiresponse = JSON.parse(
          this.router.getCurrentNavigation().extras.state.response
        );
    }

  }



  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    event.preventDefault();
    if (event.state !== null) {
      this.commonService.getDashboardUrl();
      this.router.navigate([this.commonService.globalDashboardUrl]);
    }
  }

    ngOnInit() {
      if (!(Object.keys(this.apiresponse) && Object.keys(this.apiresponse).length)) {
        this.commonService.getDashboardUrl();
        this.router.navigate([this.commonService.globalDashboardUrl]);
      }
      this.productCode = this.apiresponse.product_code? this.apiresponse.product_code
        : this.apiresponse.transactionMeta ? JSON.parse(this.apiresponse.transactionMeta).product_code
        : undefined;
      this.category = this.apiresponse?.category? this.apiresponse.category
        : this.apiresponse.transactionMeta ? JSON.parse(this.apiresponse.transactionMeta).category
        : undefined;
      if (this.apiresponse.groupId && this.commonService.isnonEMptyString(this.apiresponse.groupId)) {
        this.productCode = FccConstants.PRODUCT_TYPE_BENEFECIARY;
      }
      this.subproductcode = this.apiresponse.sub_product_code;
      this.tnxtypecode = this.apiresponse.tnx_type_code;
      this.action = this.apiresponse.reauthDataAction?this.apiresponse.reauthDataAction
        : this.apiresponse.transactionMeta ? JSON.parse(this.apiresponse.transactionMeta).reauthDataAction
        : undefined;
      const components = 'components';

      if(this.commonService.isEmptyValue(this.category)){
        this.category = this.commonService.getQueryParametersFromKey('category');
      }

      if(this.commonService.isEmptyValue(this.productCode)){
        const option = this.commonService.getQueryParametersFromKey('option');
        if (this.category === FccConstants.FCM){
          this.productCode = this.fcmErrorHandlingService.getFcmProductCode(option);
        }
      }

      this.subscriptions.push(
        this.formSubmitService.loadModel(this.productCode, this.category, this.subproductcode).subscribe(data => {
          const section = data[components];
          for (const sectionData of section) {
            if (FccConstants.IS_FEEDBACK_REQUIRED in sectionData) {
              this.checkFeedbackEnabled(sectionData);
            } else {
              const widgetKeyArray = Object.keys(sectionData);
              widgetKeyArray.forEach( element => {
              const largeCards: {'widgetSelector': string , 'response': any , 'widgetData': any} = {
              widgetSelector: element , response:  this.apiresponse , widgetData: sectionData[element] };
              this.reviewScreenWidgets.push(largeCards);
              });
            }
          }
        })
      );
  }

  checkFeedbackEnabled(sectionData) {
    this.subproductcode = this.subproductcode ? this.subproductcode : FccGlobalConstant.EMPTY_STRING;
    this.tnxtypecode = this.tnxtypecode ? this.tnxtypecode : FccGlobalConstant.EMPTY_STRING;
    switch (this.productCode) {
      case FccConstants.PRODUCT_TYPE_BENEFECIARY:
      case FccConstants.PRODUCT_CODE_BENE_MAINTENANCE:
      case FccConstants.PRODUCT_IN:
      case FccConstants.PRODUCT_BT:
      case FccConstants.PRODUCT_PB:
      case FccConstants.PRODUCT_BB:
        this.displayparamCombo1 = `${this.productCode}`;
        break;
      default:
        this.displayparamCombo1 = `${this.productCode}_${this.tnxtypecode}`;
    }
    this.displayparamCombo2 = `${this.productCode}_${this.tnxtypecode}_${this.subproductcode}`;
    if (this.productCode && ((sectionData[FccConstants.IS_FEEDBACK_REQUIRED][this.displayparamCombo1] === true) ||
    (sectionData[FccConstants.IS_FEEDBACK_REQUIRED][this.displayparamCombo2] === true))) {
      this.subscriptions.push(
        this.userFeedbackService.isFeedbackEnabled(this.fccGlobalConstantService.isFeedbackEnabledUrl(),
      this.productCode, this.subproductcode, this.tnxtypecode).subscribe(data => {
          if (data && data.FEEDBACK_OPTION_ENABLED) {
            this.inputParams[FccGlobalConstant.PRODUCT] = this.productCode;
            this.inputParams[FccGlobalConstant.SUB_PRODUCT_CODE] = this.subproductcode;
            this.inputParams[FccGlobalConstant.TNX_TYPE_CODE] = this.tnxtypecode;
            this.isFeedbackRequired = true;
          }
        })
      );
    }
  }

}
