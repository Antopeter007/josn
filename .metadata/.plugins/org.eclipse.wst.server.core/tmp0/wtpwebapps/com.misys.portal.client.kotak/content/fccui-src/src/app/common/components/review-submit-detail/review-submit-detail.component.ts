import { UtilityService } from './../../../corporate/trade/lc/initiation/services/utility.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';

import { FCCFormControl, FCCFormGroup } from '../../../base/model/fcc-control.model';
import { ProductStateService } from '../../../corporate/trade/lc/common/services/product-state.service';
import { CustomCommasInCurrenciesPipe } from '../../../corporate/trade/lc/initiation/pipes/custom-commas-in-currencies.pipe';
import { FccConstants } from '../../core/fcc-constants';
import { FccGlobalConstant } from '../../core/fcc-global-constants';
import { CommonService } from '../../services/common.service';
import { FormModelService } from '../../services/form-model.service';
import { TabPanelService } from '../../services/tab-panel.service';
import { TransactionDetailService } from '../../services/transactionDetail.service';
import { PdfGeneratorService } from './../../services/pdf-generator.service';
import { ProductMappingService } from './../../services/productMapping.service';
import { CurrencyConverterPipe } from '../../../corporate/trade/lc/initiation/pipes/currency-converter.pipe';
import { FcmErrorHandlingService } from '../../services/fcm-error-handling.service';
import { NudgesService } from '../../services/nudges.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-review-submit-detail',
  templateUrl: './review-submit-detail.component.html',
  styleUrls: ['./review-submit-detail.component.scss']
})
export class ReviewSubmitDetailComponent implements OnInit, OnDestroy {

  currency;
  beneCurrency;
  widgetDetails: any;
  componentDetails: any;
  widgets;
  masterData;
  success = `${this.translate.instant('success')}`;
  submitError = `${this.translate.instant('errorTitle')}`;
  warning = `${this.translate.instant('warning')}`;
  failed = `${this.translate.instant('failed')}`;
  submitted = `${this.translate.instant('SUBMITTED')}`;
  submitMessage: string;
  submitFcmMessage = [];
  translateSuccessMessage = null;
  reviewDetail = [];
  productCode: string;
  response: any;
  coloumNo;
  refId: string;
  tnxId: string;
  subProductCode: string;
  isViewIconRequired: boolean;
  circlebgclass: string;
  successmessage: string;
  tnxTypeCode: string;
  action: string;
  subTnxTypeCode: string;
  tnxStatCode: string;
  isSuccess: boolean;
  displayparamCombo1: string;
  displayparamCombo2: string;
  displayparamCombo3: string;
  displayparamCombo4: string;
  displayparamCombo5: string;
  displayparamCombo6: string;
  ignoreDisplayparamCombo1: string;
  ignoreDisplayparamCombo2: string;
  templateName: string;
  valueMap: Map<any, any>;
  pdfData: Map<string, FCCFormGroup>;
  tabSectionControlMap: Map<string, Map<string, FCCFormControl>>;
  readonly params = 'params';
  readonly previewScreen = 'previewScreen';
  readonly grouphead = 'grouphead';
  displayApplicant: boolean;
  contextPath: string;
  translateLabel = 'translate';
  translateValue = 'translateValue';
  readonly titleKey = 'titleKey';
  readonly userLanguageTitle = 'userLanguageTitle';
  isWarning: boolean;
  option: string;
  category: string;
  readonly reauthDataAction = 'reauthDataAction';
  readonly userLangaugeMessage = 'userLangaugeMessage';
  showFailedMessage = false;
  multipleMessages = false;
  partiallySubmitted = false;
  errorReviewDetail = [];
  beneProductCode;
  showErrorTable = false;
  tableStyle;
  isNudgesRequired = false;
  nudges = [];
  currencySymbolDisplayEnabled = false;
  tabName ='single';
  selectedTab$: Subscription;

  constructor(protected translate: TranslateService,
    protected productMappingService: ProductMappingService,
    protected pdfGeneratorService: PdfGeneratorService,
    protected stateService: ProductStateService,
    protected transactionDetailService: TransactionDetailService,
    protected tabPanelService: TabPanelService,
    protected commonService: CommonService,
    protected formModelService: FormModelService,
    protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected router: Router,
    protected dialogService: DialogService,
    protected utilityService: UtilityService,
    protected fcmErrorHandlingService: FcmErrorHandlingService,
    protected nudgesService: NudgesService,
    protected currencyConverterPipe: CurrencyConverterPipe) { }

  pdfDownloadIcon = this.translate.instant('pdfDownload');

  ngOnInit(): void {
    const noOfColoums = 'noOfColoums';
    this.contextPath = this.commonService.getContextPath();
    const circlebgclass = 'circlebgclass';
    const successConst = 'successmessage';
    this.widgets = this.widgetDetails ? JSON.parse(this.widgetDetails) : '';
    this.componentDetails = this.widgets.widgetData;
    this.response = this.setResponse(this.widgets.response);
    this.coloumNo = this.componentDetails[noOfColoums];
    this.productCode = this.response.product_code;
    this.currencySymbolDisplayEnabled = localStorage.getItem(FccGlobalConstant.CUR_SYMBOL_ENABLED) === 'y';

    if (this.response.groupId && this.commonService.isnonEMptyString(this.response.groupId)) {
      this.productCode = FccConstants.PRODUCT_TYPE_BENEFECIARY;
    }
    this.circlebgclass = this.componentDetails[circlebgclass];
    this.successmessage = this.componentDetails[successConst];
    this.tnxTypeCode = this.response.tnx_type_code;
    this.isNudgesRequired = this.componentDetails.isNudgesRequired;
    this.action = this.response.reauthDataAction;
    this.subProductCode = this.response.sub_product_code;
    this.subTnxTypeCode = this.response.sub_tnx_type_code;
    this.tnxStatCode = this.response.tnx_stat_code ? this.response.tnx_stat_code :
      (this.response.transactionStatus ? this.response.transactionStatus.slice(-FccGlobalConstant.NUMERIC_TWO) : undefined);
    this.option = this.response?.option;
    this.category = this.response?.category;

    this.selectedTab$ = this.commonService.selectedTab.subscribe((item) => {
      if(item && item.productTypeName){
        this.tabName = item.productTypeName;
      }
    });

    const nudgesData = { "widgetName": this.componentDetails.widgetName };
    const option = this.commonService.getOptionQueryParameterFCM();
    const productCode = this.commonService.getFCMProductCode(option, this.tabName);
    if (productCode) {
      this.commonService.getNudges(JSON.stringify(nudgesData), productCode, '').then(data => {
        this.nudges = data;
      });
    }

    if (this.isSuccess) {
      this.getSuccessMessage();
      this.getReviewDataAll();
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
    this.productMappingService.getApiModel(this.productCode, this.subProductCode, undefined, undefined,
      undefined, this.option, this.category).subscribe(apiMappingModel => {
        const displayKeys = this.componentDetails[Displaykeys];
        if (this.commonService.isEmptyValue(this.productCode) && this.option === FccGlobalConstant.BENEFICIARY_MASTER_MAINTENANCE_MC
          && this.category === FccConstants.FCM) {
          this.productCode = FccConstants.PRODUCT_CODE_BENE_MAINTENANCE;
        }
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
        this.displayApplicant = true;

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
              if (mappingFieldKey !== null && mappingFieldKey !== undefined && this.commonService.isnonEMptyString(fieldValue)) {
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
          } else if (key.apiMapping === 'paymentTransactionAmt') {
            if (!isNaN(val)) {
                const paymentTransactionAmtVal = this.commonService.replaceCurrency(val);
                val = this.currencyConverterPipe.transform(paymentTransactionAmtVal.toString(),
                  this.currency);
                val = this.commonService.getCurrencySymbol(FccConstants.FCM_ISO_CODE, val);
              }
          } else if (key.apiMapping === 'beneficiaryProductType') {
            const value = `${key.translateValue}${val}`;
            val = `${this.translate.instant(value)}`;
          } else if (key.apiMapping === 'topic') {
            val = `${this.translate.instant('P321_' + val)}`;
          } else if (key.apiMapping === 'subTopic') {
            val = `${this.translate.instant('P812_' + val)}`;
          } else if (key.feildType === 'fcmAmount') {
            val = this.formatAmount(val);
          } else {
            val = `${this.translate.instant(val)}`;
          }

        }
        else if (key.apiMapping === 'applicantEntity' && this.commonService.isnonEMptyString(val)) {
          this.displayApplicant = false;
        }

        if (key.feildType === 'amount') {
          val = this.formatAmount(val);
        }

        if (key.apiMapping === 'companyName') {
          key.rendered = this.displayApplicant;
        }
        if (key.apiMapping === 'beneficiaryPreApproved') {
          val = (val === true || val === 'true') ? `${this.translate.instant(FccGlobalConstant.YES)}` :
            `${this.translate.instant(FccGlobalConstant.NO)}`;
        }
        else if (key.apiMapping === 'effectiveDate' && this.category === FccConstants.FCM) {
          const value = this.utilityService.transformDateToSpecificFormat(val, 'DD/MM/YYYY');
          val = value;
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
      } else if (key.apiMapping === 'applicantEntity' && this.commonService.isnonEMptyString(val)) {
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

  downloadPDF() {
    this.subProductCode = this.response.sub_product_code;
    this.refId = this.response.ref_id;
    this.tnxId = this.response.tnx_id;
    this.downloadPDFWithEventDetails();
  }

  keyPressDownload(event) {
    const keycodeIs = event.which || event.keyCode;
    if (keycodeIs === FccGlobalConstant.LENGTH_13) {
      this.onClickView();
    }
  }

  getSuccessMessage() {
    if (this.successmessage === 'successmessage') {
      this.translateSuccessMessage = `${this.translate.instant('successMessage',
        { productName: this.translate.instant(this.productCode) })}`;
    } else if (this.successmessage === 'template') {
      this.translateSuccessMessage = `${this.translate.instant('template')}` + '  ' +
        this.response.templateName + '  ' + `${this.translate.instant('savedSuccessfully')}`;
    } else if (this.successmessage === 'messageId' && this.commonService.isnonEMptyString(this.response.userLangaugeMessage)) {
      this.translateSuccessMessage = `${this.translate.instant(this.response.userLangaugeMessage)}`;
    }
  }

  downloadPDFWithEventDetails() {
    const operation = 'PDF';
    const attachments = 'attachments';
    const attachment = 'attachment';
    this.commonService.putQueryParameters(FccGlobalConstant.OPERATION, operation);
    this.stateService.clearState();
    this.formModelService.getFormAndSubSectionModel(this.productCode).subscribe(modelJson => {
      if (modelJson) {
        this.formModelService.subSectionJson = modelJson[1];
        this.stateService.initializeState(this.productCode);
        this.stateService.populateAllEmptySectionsInState(this.productCode);
        this.tabPanelService.initializeTabPanelService(this.stateService.getProductModel());
        this.transactionDetailService.fetchTransactionDetails(this.tnxId, this.productCode).subscribe(response => {
          const tnxApiResponse = response.body;
          if (tnxApiResponse) {
            this.pdfData = new Map();
            this.productMappingService.getApiModel(this.productCode, this.subProductCode).subscribe(ApiModel => {
              this.stateService.getSectionNames().forEach(sectionName => {
                const isAttachment = this.pdfGeneratorService.checkFileUploadSections(sectionName);
                this.tabPanelService.initializeMaps(sectionName, this.stateService.getSectionData(sectionName, undefined, false));
                let value: FCCFormGroup = this.stateService.getSectionData(sectionName, this.productCode);
                value = this.productMappingService.setStateFromMapModel(ApiModel, sectionName, value, tnxApiResponse,
                  this.productCode, this.subProductCode, false);
                if (isAttachment && tnxApiResponse[attachments] && tnxApiResponse[attachments][attachment]
                  && tnxApiResponse[attachments][attachment].length !== 0) {
                  this.setAttachmentDetailsForPDF(sectionName, value, tnxApiResponse[attachments][attachment]);
                } else {
                  this.tabSectionControlMap = this.tabPanelService.getTabSectionControlMap();
                  this.setPDFData(sectionName, value);
                }
              });
              this.pdfGeneratorService.createPDF(this.pdfData, modelJson[0], this.refId, this.productCode,
                FccGlobalConstant.SUBMIT, this.tnxId, this.subProductCode);
            });
          }
        });
      }
    });
  }

  setPDFData(sectionName, value) {
    if (this.tabSectionControlMap.has(sectionName)) {
      const tabForm = new FCCFormGroup({});
      for (const [fieldName, control] of this.tabSectionControlMap.get(sectionName)) {
        let previewScreen = control[this.params][this.previewScreen];
        previewScreen = previewScreen === false ? false : true;
        if (fieldName && previewScreen) {
          tabForm.addControl(fieldName, control);
        }
      }
      this.pdfData.set(sectionName, tabForm);
    } else {
      this.addCalculatedValuesInFormControl(sectionName, value);
      if (sectionName === FccGlobalConstant.eventDetails) {
        Object.keys(value.controls).forEach(key => {
          if (value.get(key).value && value.get(key)[FccGlobalConstant.PARAMS][this.translateLabel] === true) {
            const val = this.translate.instant(value.get(key)[FccGlobalConstant.PARAMS][this.translateValue] + value.get(key).value);
            value.get(key).setValue(val);
          }
        });
      }
      this.pdfData.set(sectionName, value);
    }
  }

  addCalculatedValuesInFormControl(sectionName, value) {
    if ((this.productCode === FccGlobalConstant.PRODUCT_EL || this.productCode === FccGlobalConstant.PRODUCT_SR) &&
      (sectionName === FccGlobalConstant.ASSIGNMENT_CONDITIONS || sectionName === FccGlobalConstant.TRANSFER_DETAILS)) {
      const availableAmtField = 'availableAmount';
      const lcAmtField = 'lcAmount';
      const utilizedAmtField = 'utilizedAmount';
      const lcAmount = this.stateService.getValue(sectionName, lcAmtField, false);
      const utilizedAmount = this.stateService.getValue(sectionName, utilizedAmtField, false);
      const remainingAvailableAmount = +lcAmount.replace(/[^0-9.]/g, '') - +utilizedAmount.replace(/[^0-9.]/g, '');
      const availableAmount = this.customCommasInCurrenciesPipe.transform(remainingAvailableAmount.toString(), this.currency);
      value.controls[availableAmtField].setValue(this.currency.concat(' ').concat(availableAmount));
    }
  }

  setAttachmentDetailsForPDF(sectionName, value, attachmentApiResponse) {
    const attachmentsList = [];
    if (attachmentApiResponse.length > 0) {
      for (const attachment of attachmentApiResponse) {
        const fileName = this.commonService.decodeHtml(attachment.file_name);
        const title = this.commonService.decodeHtml(attachment.title);
        const fileType = fileName.split('.').pop().toLowerCase();
        const attachmentResultObj: {
          'fileType': string,
          'title': string,
          'fileName': any,
          'fileSize': string
        } = {
          fileType,
          title,
          fileName,
          fileSize: attachment.file_size
        };
        attachmentsList.push(attachmentResultObj);
      }
    } else if (Object.keys(attachmentApiResponse).length > 0 && attachmentApiResponse.constructor === Object &&
      attachmentApiResponse.file_name !== null && attachmentApiResponse.file_name !== '' &&
      attachmentApiResponse.file_name !== undefined) {
      const fileName = this.commonService.decodeHtml(attachmentApiResponse.file_name);
      const title = this.commonService.decodeHtml(attachmentApiResponse.title);
      const fileType = fileName.split('.').pop().toLowerCase();
      const attachmentResultObj: {
        'fileType': string,
        'title': string,
        'fileName': any,
        'fileSize': string
      } = {
        fileType,
        title,
        fileName,
        fileSize: attachmentApiResponse.file_size
      };
      attachmentsList.push(attachmentResultObj);
    }
    const fileUploadTable = 'fileUploadTable';
    const columnHeaders = [];
    columnHeaders.push(this.translate.instant('fileType'));
    columnHeaders.push(this.translate.instant('title'));
    columnHeaders.push(this.translate.instant('fileName'));
    columnHeaders.push(this.translate.instant('fileSize'));
    value.controls[fileUploadTable][this.params].columns = columnHeaders;
    value.controls[fileUploadTable][this.params].data = attachmentsList;
    this.pdfData.set(sectionName, value);
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

  getCurrencySymbol(curCode: string): string {
    return this.currencySymbolDisplayEnabled ? curCode + "   " + this.commonService.getCurrencySymbol(curCode, '').trim() : curCode;
  }

  // todo - improve by standardizing
  setResponse(response) {
    this.showFailedMessage = false;
    this.multipleMessages = false;
    this.partiallySubmitted = false;
    this.showErrorTable = false;
    if (response.status === FccGlobalConstant.API_ERROR_CODE_500 || response.status === FccGlobalConstant.STATUS_404
      || response.status === FccGlobalConstant.API_ERROR_CODE_401 || response.status === FccGlobalConstant.API_ERROR_CODE_501) {
      this.isSuccess = false;
      this.submitMessage = response.error ? response.error
        : this.translate.instant('FCM_ERROR_TECH_0001');
      this.multipleMessages = false;
      this.showFailedMessage = true;
      this.partiallySubmitted = false;
      this.showErrorTable = false;
      return JSON.parse(response.transactionMeta);
    }
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
    } else if (response.error && JSON.parse(response.transactionMeta)[this.reauthDataAction] === FccConstants.SUBMIT_BULK_PAYMENT) {
      this.isSuccess = false;
      this.submitMessage = JSON.parse(response.error)[this.userLangaugeMessage];
      return JSON.parse(response.transactionMeta);
    } else if (response.error && (JSON.parse(response.transactionMeta)[this.reauthDataAction] === FccConstants.SUBMIT_BULK_BENE)) {
      this.isSuccess = false;
      this.submitMessage = JSON.parse(response.error)[this.userLangaugeMessage] ?
        JSON.parse(response.error)[this.userLangaugeMessage] : this.translate.instant('FCM_ERROR_TECH_0001');
      return JSON.parse(response.transactionMeta);
    } else if (response.error && JSON.parse(response.error).errors.length !== FccGlobalConstant.ZERO) {
      this.isSuccess = false;
      const option = this.commonService.getOptionQueryParameterFCM();
      this.beneProductCode = this.fcmErrorHandlingService.getFcmProductCode(option);
      if (this.beneProductCode === FccGlobalConstant.PRODUCT_BM) {
        this.showErrorTable = true;
        if (JSON.parse(response.error).errors.length <= FccGlobalConstant.LENGTH_5) {
          this.tableStyle = FccGlobalConstant.ERROR_TABLE_WITHOUT_CAROUSEL_STYLE;
        } else {
          this.tableStyle = FccGlobalConstant.ERROR_TABLE_WITH_CAROUSEL_STYLE;
        }
        if (JSON.parse(response.error).errors.length > 1) {
          for (const desc of JSON.parse(response.error).errors) {
            this.submitFcmMessage.push({
              accountNumber: desc.accountNumber,
              approveStatus: `${this.translate.instant(FccGlobalConstant.FAILED)}`,
              errorCode: desc.description
            });
          }
          this.multipleMessages = true;
          if (JSON.parse(response.error).cardResponse) {
            if (JSON.parse(response.error).cardResponse.successAccounts === FccGlobalConstant.LENGTH_0) {
              this.submitMessage = `${this.translate.instant(FccGlobalConstant.ALL_FAILED)}`;
              this.partiallySubmitted = false;
              this.showFailedMessage = true;
            } else {
              this.submitMessage = `${this.translate.instant(FccGlobalConstant.PARTIALLY_SUBMITTED)}`;
              this.partiallySubmitted = true;
              this.showFailedMessage = false;
              const errorCardValues = JSON.parse(response.error).cardResponse;
              const cardKeys = FccGlobalConstant.BENEFICIARY_ERROR_CARD_DETAIL_KEYS;
              let errorReviewData = {};
              for (let i = 0; i < cardKeys.length; i++) {
                if (cardKeys[i] === FccGlobalConstant.BENEFICIARY_ACCOUNT_NUMBER || cardKeys[i] === FccGlobalConstant.BENEFICIARY_BANK) {
                  errorReviewData = { key: cardKeys[i], value: FccGlobalConstant.MULTIPLE };
                } else {
                  errorReviewData = { key: cardKeys[i], value: errorCardValues[cardKeys[i]] };
                }
                this.errorReviewDetail.push(errorReviewData);
              }
            }
          }
        } else {
          this.submitMessage = JSON.parse(response.error).errors[0].description;
          this.multipleMessages = false;
          this.partiallySubmitted = false;
          this.showFailedMessage = true;

          if (JSON.parse(response.error).cardResponse &&
            JSON.parse(response.error).cardResponse.totalAccounts > FccGlobalConstant.LENGTH_1) {
            this.submitFcmMessage.push({
              accountNumber: JSON.parse(response.error).errors[0].accountNumber,
              approveStatus: `${this.translate.instant(FccGlobalConstant.FAILED)}`,
              errorCode: JSON.parse(response.error).errors[0].description
            });
            if (JSON.parse(response.error).cardResponse.successAccounts === FccGlobalConstant.LENGTH_0) {
              this.submitMessage = `${this.translate.instant(FccGlobalConstant.ALL_FAILED)}`;
              this.partiallySubmitted = false;
              this.showFailedMessage = true;
              this.multipleMessages = false;
            } else {
              this.submitMessage = `${this.translate.instant(FccGlobalConstant.PARTIALLY_SUBMITTED)}`;
              this.partiallySubmitted = true;
              this.showFailedMessage = false;
              this.multipleMessages = true;
              const errorCardValues = JSON.parse(response.error).cardResponse;
              const cardKeys = FccGlobalConstant.BENEFICIARY_ERROR_CARD_DETAIL_KEYS;
              let errorReviewData = {};
              for (let i = 0; i < cardKeys.length; i++) {
                if (cardKeys[i] === FccGlobalConstant.BENEFICIARY_ACCOUNT_NUMBER || cardKeys[i] === FccGlobalConstant.BENEFICIARY_BANK) {
                  errorReviewData = { key: cardKeys[i], value: FccGlobalConstant.MULTIPLE };
                } else {
                  errorReviewData = { key: cardKeys[i], value: errorCardValues[cardKeys[i]] };
                }
                this.errorReviewDetail.push(errorReviewData);
              }
            }
          }
        }
      } else {
        this.showErrorTable = false;
        if (JSON.parse(response.error).errors.length > 1) {
          for (const desc of JSON.parse(response.error).errors) {
            this.submitFcmMessage.push(desc.description);
          }
          this.multipleMessages = true;
        } else {
          if (JSON.parse(response.error).errors[0]?.Description) {
            this.submitMessage = JSON.parse(response.error).errors[0]?.Description;
          } else {
            this.submitMessage = JSON.parse(response.error).errors[0].description;
          }
          this.multipleMessages = false;
        }
        this.showFailedMessage = true;
      }
      return JSON.parse(response.transactionMeta);
    }
    this.isSuccess = true;
    this.showFailedMessage = false;
    this.multipleMessages = false;
    this.partiallySubmitted = false;
    this.showErrorTable = false;
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

  ngOnDestroy(): void {
      this.selectedTab$.unsubscribe();
  }
}
