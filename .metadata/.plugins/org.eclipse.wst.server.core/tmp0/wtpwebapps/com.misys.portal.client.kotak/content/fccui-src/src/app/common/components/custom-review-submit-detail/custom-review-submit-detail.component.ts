import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FccConstants } from '../../core/fcc-constants';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CommonService } from '../../services/common.service';
import { ProductMappingService } from '../../services/productMapping.service';
import { CurrencyConverterPipe } from '../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
@Component({
  selector: 'app-custom-review-submit-detail',
  templateUrl: './custom-review-submit-detail.component.html',
  styleUrls: ['./custom-review-submit-detail.component.scss']
})
export class CustomReviewSubmitDetailComponent implements OnInit {

  beneCurrency: any;
  currency: any;
  reviewDetail = [];
  widgetDetails: any;
  componentDetails: any;
  widgets;
  success = `${this.translate.instant('success')}`;
  submitError = `${this.translate.instant('errorTitle')}`;
  warning = `${this.translate.instant('warning')}`;
  submitMessage: string;
  translateSuccessMessage = null;
  productCode: string;
  response: any;
  coloumNo;
  subProductCode: string;
  isViewIconRequired: boolean;
  circlebgclass: string;
  successmessage: string;
  isSuccess: boolean;
  templateName: string;
  contextPath: string;
  isWarning: boolean;
  nudges: any;
  tnxId: string;
  tnxTypeCode: string;
  tnxStatCode: string;
  isNudgesRequired: boolean;
  isInformationBannerRequired: boolean;
  isFeedbackRequired: boolean;
  titleKey: any;
  userLanguageTitle: any;
  valueMap: Map<any, any>;
  subTnxTypeCode: string;
  displayApplicant: boolean;
  displayparamCombo1: string;
  displayparamCombo2: string;
  displayparamCombo3: string;
  displayparamCombo4: string;
  displayparamCombo5: string;
  displayparamCombo6: string;
  ignoreDisplayparamCombo1: string;
  ignoreDisplayparamCombo2: string;
  action: string;

  constructor(protected translate: TranslateService,
    protected commonService: CommonService,
    protected router: Router,
    protected productMappingService: ProductMappingService,
    protected currencyConverterPipe: CurrencyConverterPipe) { }

  ngOnInit(): void {
    this.contextPath = this.commonService.getContextPath();
    const circlebgclass = 'circlebgclass';
    const successConst = 'successmessage';
    this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    this.componentDetails = this.widgets.widgetData;
    this.response = this.setResponse(this.widgets.response);
    this.productCode = this.response.product_code;
    this.isNudgesRequired = this.componentDetails.isNudgesRequired;
    this.isInformationBannerRequired = this.componentDetails.isInformationBannerRequired;
    this.isFeedbackRequired = this.componentDetails.isFeedbackRequired;
    this.tnxTypeCode = this.response.tnx_type_code;
    this.circlebgclass = this.componentDetails[circlebgclass];
    this.successmessage = this.componentDetails[successConst];
    this.subProductCode = this.response.sub_product_code;
    this.subTnxTypeCode = this.response.sub_tnx_type_code;
    this.action = this.response.reauthDataAction;
    this.tnxStatCode = this.response.tnx_stat_code ? this.response.tnx_stat_code :
      (this.response.transactionStatus ? this.response.transactionStatus.slice(-FccGlobalConstant.NUMERIC_TWO) : undefined);

    if (this.isNudgesRequired) {
      const nudgesData = { "widgetName": this.componentDetails.widgetName };
      this.commonService.getNudges(JSON.stringify(nudgesData), this.productCode, this.subProductCode).then(data => {
        this.nudges = data;
      });
    }

    if (this.isSuccess) {
      this.translateSuccessMessage = `${this.translate.instant('successMessage',
        { productName: this.translate.instant(this.productCode) })}`;
      this.getReviewDataAll();
    }
  }

  keyPressDownload(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === FccGlobalConstant.LENGTH_13) {
      this.onClickView();
    }
  }

  getReviewDataAll() {
    const values = [];
    const Displaykeys = 'Displaykeys';
    const rendered = 'rendered';
    const diplayparams = 'diplayparams';
    const ignoreDisplayParams = 'ignoreDisplayParams';
    const action = 'action';
    const isViewIconRequired = 'isViewIconRequired';
    this.productMappingService.getApiModel(this.productCode, this.subProductCode).subscribe(apiMappingModel => {
      const displayKeys = this.componentDetails[Displaykeys];
      if (this.productCode === FccConstants.PRODUCT_TYPE_BENEFECIARY) {
        this.displayparamCombo1 = `${this.productCode}`;
      } else {
        this.displayparamCombo1 = `${this.productCode}_${this.tnxTypeCode}`;
      }
      this.displayparamCombo2 = `${this.productCode}_${this.tnxTypeCode}_${this.subProductCode}`;
      this.displayparamCombo4 = `${this.productCode}_${this.tnxTypeCode}_${this.subTnxTypeCode}`;
      this.displayparamCombo5 = `${this.productCode}_${this.tnxTypeCode}_${this.action}`;
      this.displayparamCombo6 = `${this.productCode}_${this.tnxTypeCode}_${this.subTnxTypeCode}_${this.action}`;
      this.ignoreDisplayparamCombo1 = `${this.productCode}_${this.tnxTypeCode}_${this.subTnxTypeCode}`;
      this.ignoreDisplayparamCombo2 = `${this.productCode}_${this.tnxTypeCode}_${this.subProductCode}`;
      this.templateName = this.response.template_id;
      this.valueMap = new Map();
      this.displayApplicant = false;

      if ((this.componentDetails[isViewIconRequired][this.displayparamCombo1] === true) ||
        (this.componentDetails[isViewIconRequired][this.displayparamCombo2] === true)) {
        this.isViewIconRequired = true;
      }

      if (typeof this.templateName !== 'undefined' &&
        (typeof this.tnxTypeCode === 'undefined' || this.tnxTypeCode === '' || this.tnxTypeCode === null)) {
        this.action = FccGlobalConstant.TEMPLATE;
        this.displayparamCombo3 = this.productCode + '_' + FccGlobalConstant.TEMPLATE;
      }
      let fieldValue;
      let ignoreDisplayValue;
      for (const sectionData of displayKeys) {
        const feilds = Object.keys(sectionData);
        feilds.forEach((element) => {
          if (element === 'apiMapping') {
            const mappingFieldKey = apiMappingModel[sectionData[element]];
            if (mappingFieldKey !== null && mappingFieldKey !== undefined && typeof mappingFieldKey === FccGlobalConstant.OBJECT &&
              typeof mappingFieldKey[FccConstants.READ_API_FIELD] === FccGlobalConstant.OBJECT) {
              fieldValue = this.productMappingService.
                getFieldValueFromMappingObjectComplex(sectionData[element], this.response, mappingFieldKey[FccConstants.READ_API_FIELD]);
            } else if (mappingFieldKey !== null && mappingFieldKey !== undefined) {
              fieldValue = this.productMappingService.
                getFieldValueFromMappingObjectComplex(sectionData[element], this.response, mappingFieldKey);
            }
            if (this.commonService.isnonEMptyString(fieldValue)) {
              values.push(fieldValue);
              this.valueMap.set(sectionData, fieldValue);
            }
            ignoreDisplayValue = fieldValue;
          } else if (element === 'applicablescreen') {

            if (this.action === FccGlobalConstant.TEMPLATE) {

              if ((sectionData[element][diplayparams].indexOf(this.displayparamCombo1) > -1 ||
                sectionData[element][diplayparams].indexOf(this.displayparamCombo2) > -1 ||
                sectionData[element][diplayparams].indexOf(this.displayparamCombo3) > -1 ||
                sectionData[element][diplayparams].indexOf(this.displayparamCombo4) > -1) &&
                sectionData[element][action].indexOf(this.action) > -1) {

                sectionData[rendered] = true;

              }

            } else if ((sectionData[element][diplayparams].indexOf(this.displayparamCombo6) > -1) &&
              (sectionData[element][action].indexOf(this.action) > -1)) {

              sectionData[rendered] = true;
            } else if ((sectionData[element][ignoreDisplayParams] &&
              (sectionData[element][ignoreDisplayParams].indexOf(this.ignoreDisplayparamCombo1) > -1 ||
                sectionData[element][ignoreDisplayParams].indexOf(this.ignoreDisplayparamCombo2) > -1))) {
              sectionData[rendered] = false;
            } else if ((sectionData[element].ignoreDisplayValue !== undefined
              && sectionData[element].ignoreDisplayValue.indexOf(ignoreDisplayValue) > -1)) {
              sectionData[rendered] = false;
            } else {

              if ((sectionData[element][diplayparams].indexOf(this.displayparamCombo1) > -1 ||
                sectionData[element][diplayparams].indexOf(this.displayparamCombo2) > -1 ||
                sectionData[element][diplayparams].indexOf(this.displayparamCombo4) > -1 ||
                sectionData[element][diplayparams].indexOf(this.displayparamCombo5) > -1) &&
                sectionData[element][action].indexOf(this.action) > -1) {

                sectionData[rendered] = true;

              }
            }

          }
        });
      }

      this.createValuesMap();
    });

  }

  createValuesMap() {
    let reviewdata: { 'key': any, 'value': any, 'layoutClass': any, 'feildType': any, 'rendered': any, 'id': any };
    if (this.commonService.isEmptyValue(this.currency)) {
      this.valueMap.forEach((val, key) => {
        if (this.commonService.isnonEMptyString(key.feildType) && key.feildType === FccGlobalConstant.CURRENCY) {
          this.currency = val ? val : FccConstants.FCM_ISO_CODE;
        }
      });
    }
    this.valueMap.forEach((val, key) => {

      if (this.commonService.isnonEMptyString(val) && val !== 'undefined' && this.commonService.isnonEMptyString(key.feildType)
        && key.feildType !== 'currency' && key.feildType !== 'beneCurrency') {

        if (key.istranslationrequired === true) {
          const two = 2;
          if (key.feildType === 'transmissionMode') {
            if (val.length === two) {
              const transmissionMode = FccGlobalConstant.TRANS_MODE.concat('_').concat(val);
              val = `${this.translate.instant(transmissionMode)}`;
            } else {
              val = `${this.translate.instant(val)}`;
            }
          } else if (key.feildType === 'event') {
            if (val.length === two) {
              if (key.translateValue) {
                const value = `N002_${key.translateValue}${val}`;
                val = `${this.translate.instant(value)}`;
              }
              else if (!this.commonService.isEmptyValue(this.subTnxTypeCode) && (this.subTnxTypeCode !== 'undefined')) {
                val = `${this.translate.instant('N002_' + val)}` + ` ` + `${this.translate.instant('LIST_N003_' + this.subTnxTypeCode)}`;
              } else {
                val = `${this.translate.instant('N002_' + val)}`;
              }
            } else {
              val = `${this.translate.instant(val)}`;
            }
          } else if (key.feildType === 'translateCodeField') {
            if (val.length === two) {
              const apiFieldMappingValue = key.apiMapping;
              val = this.translate.instant(apiFieldMappingValue.concat('_').concat(val));
            } else {
              val = `${this.translate.instant(val)}`;
            }
          } else if (key.apiMapping === 'beneficiaryProductType') {
            const value = `${key.translateValue}${val}`;
            val = `${this.translate.instant(value)}`;
          } else if (key.feildType === 'fcmAmount') {
            val = this.formatAmount(val);
          } else {
            val = `${this.translate.instant(val)}`;
          }

        }

        if (key.apiMapping === 'companyName') {
          key.rendered = this.displayApplicant;
        }
        if (key.apiMapping === 'beneficiaryPreApproved') {
          val = (val === true || val === 'true') ? `${this.translate.instant(FccGlobalConstant.YES)}` :
            `${this.translate.instant(FccGlobalConstant.NO)}`;
        }
        reviewdata = {
          key: key.label, value: val, layoutClass: key.layoutClass, feildType: key.feildType,
          rendered: key.rendered, id: key.apiMapping
        };
        this.reviewDetail.push(reviewdata);
      } else if (val !== undefined && key.feildType !== undefined && key.feildType === 'currency'
        && key.feildType !== 'beneCurrency') {
        this.currency = val;
      } else if (val !== undefined && key.feildType !== undefined && key.feildType !== 'currency'
        && key.feildType === 'beneCurrency') {
        this.beneCurrency = val;
      } else if (key.apiMapping === 'applicantEntity' && (val === undefined || val === 'undefined')) {
        this.displayApplicant = true;
      }

    });
  }

  formatAmount(amount) {
    if (this.commonService.isEmptyValue(this.currency)) {
      this.valueMap.forEach((val, key) => {
        if (this.commonService.isnonEMptyString(key.feildType) && key.feildType === FccGlobalConstant.CURRENCY) {
          this.currency = val ? val : FccConstants.FCM_ISO_CODE;
        }
      });
    }
    let fcmAmountVal = this.commonService.replaceCurrency(amount);
    fcmAmountVal = this.currencyConverterPipe.transform(fcmAmountVal.toString(), this.currency);
    return fcmAmountVal;
  }

  classObject() {
    const value = this.coloumNo;
    const totalValue = 12;
    const columnValue = totalValue / value;
    return 'p-col-' + columnValue;
  }

  onClickView() {
    this.subProductCode = this.response.sub_product_code;
    const refId = this.response.ref_id;
    this.tnxId = this.response.tnx_id;
    const eventSubTnxTypeCode = this.response.sub_tnx_type_code;
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['view'], {
        queryParams: {
          tnxid: this.tnxId, referenceid: refId,
          productCode: this.productCode, subProductCode: this.subProductCode, tnxTypeCode: this.tnxTypeCode,
          eventTnxStatCode: this.tnxStatCode, subTnxTypeCode: eventSubTnxTypeCode,
          mode: FccGlobalConstant.VIEW_MODE,
          operation: 'PREVIEW'
        }
      })
    );
    const popup = window.open('#' + url, '_blank', 'top=100,left=200,height=400,width=900,toolbar=no,resizable=no');
    const productId = `${this.translate.instant(this.productCode)}`;
    popup.onload = () => {
      popup.document.title = productId.concat('-').concat(refId);
    };
  }

  // todo - improve by standardizing
  setResponse(response) {
    if (response.error && (JSON.parse(response.error)[this.titleKey] === 'TECHNICAL_ERROR' ||
      JSON.parse(response.error)[this.titleKey] === FccGlobalConstant.VERSION_MIS_MATCH)) {
      this.isSuccess = false;
      if (JSON.parse(response.error)[this.titleKey] === FccGlobalConstant.VERSION_MIS_MATCH) {
        this.submitMessage = this.translate.instant('eTagVersionMismatch');
      }
      else {
        this.submitMessage = JSON.parse(response.error)[this.userLanguageTitle];
      }
      return JSON.parse(response.transactionMeta);
    }
    this.isSuccess = true;
    if (response.messageKey === 'DAILY_LIMIT_EXCEEDED_MESSAGE' ||
      response.messageKey === 'AUTHORISATION_LIMIT_AMOUNT_MESSAGE' ||
      response.messageKey === 'NOT_PART_OF_AUTH_MATRIX_MESSAGE' ||
      response.messageKey === 'CANNOT_AUTHORISE_OWN_TNX_MESSAGE' ||
      response.messageKey === 'PENDING_VERIFY_MESSAGE' ||
      response.messageKey === 'AUTH_LIMIT_EXCEEDED_MESSAGE' ||
      response.messageKey === 'PENDING_SEND_MESSAGE') {
      this.isWarning = true;
    }
    return response;
  }
}

