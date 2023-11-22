import { CommonService } from '../../../../../../common/services/common.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from '../../services/utility.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FccGlobalConstant } from './../../../../../../common/core/fcc-global-constants';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { CustomCommasInCurrenciesPipe } from '../../pipes/custom-commas-in-currencies.pipe';
import { FilelistService } from '../../services/filelist.service';
import { PdfGeneratorService } from './../../../../../../common/services/pdf-generator.service';
import { FCCFormControl, FCCFormGroup } from '../../../../../../base/model/fcc-control.model';
import { TabPanelService } from '../../../../../../common/services/tab-panel.service';
import { TransactionDetailService } from '../../../../../../common/services/transactionDetail.service';
import { ProductStateService } from '../../../common/services/product-state.service';
import { ProductMappingService } from '../../../../../../common/services/productMapping.service';
import { FormModelService } from '../../../../../../common/services/form-model.service';
import { CurrencyConverterPipe } from '../../../../lc/initiation/pipes/currency-converter.pipe';

@Component({
  selector: 'fcc-form-submit',
  templateUrl: './form-submit.component.html',
  styleUrls: ['./form-submit.component.scss']
})

export class FormSubmitComponent implements OnInit {
  constructor(protected utilityService: UtilityService, protected translate: TranslateService,
    protected router: Router, protected leftSectionService: LeftSectionService,
    protected route: ActivatedRoute, protected customCommasInCurrenciesPipe: CustomCommasInCurrenciesPipe,
    protected fileList: FilelistService, protected pdfGeneratorService: PdfGeneratorService,
    protected commonService: CommonService, protected stateService: ProductStateService,
    protected transactionDetailService: TransactionDetailService, protected tabPanelService: TabPanelService,
    protected productMappingService: ProductMappingService, protected formModelService: FormModelService,
    protected currencyConverterPipe: CurrencyConverterPipe) { }
  sectionData: any;
  summaryRender: any[];
  dir: string = localStorage.getItem('langDir');
  lcmode = localStorage.getItem('lcmode') ? `${this.translate.instant(localStorage.getItem('lcmode'))}` : '';
  event = `${this.translate.instant('event')}`;
  success = `${this.translate.instant('success')}`;
  successMessage = `${this.translate.instant('successMessage')}`;
  newLetterOfCredit;
  LCListing;
  beneficiaryNameLabel = `${this.translate.instant('BENEFICIARY_NAME')}`;
  status = `${this.translate.instant('status')}`;
  expiresOn = `${this.translate.instant('expiresOn')}`;
  refId = '';
  tnxId = '';
  eventValue = '';
  statusValue = '';
  data: any;
  entityName: any;
  currency: any;
  beneficiaryNameValue: any;
  amountValue: any;
  expiryDate: any;
  value = 0;
  activeIndex = 0;
  channelsId = `${this.translate.instant('channelsId')}`;
  entity = `${this.translate.instant('entity')}`;
  amount = `${this.translate.instant('amount')}`;
  transmissionMode = `${this.translate.instant('transmissionMode')}`;
  templateName = `${this.translate.instant('templateName')}`;
  description = `${this.translate.instant('description')}`;
  newTemplate = `${this.translate.instant('newTemplate')}`;
  templateLanding = `${this.translate.instant('templateLanding')}`;
  isTemplateCreation = CommonService.isTemplateCreation;
  templateId;
  templateDescription;
  tnxTypeCode;
  tnxAmt: any;
  public progressBarmap = new Map([
    [FccGlobalConstant.GENERAL_DETAILS, false],
    [FccGlobalConstant.APPLICANT_BENEFICIARY, false],
    [FccGlobalConstant.BANK_DETAILS, false],
    [FccGlobalConstant.AMOUNT_CHARGE_DETAILS, false],
    [FccGlobalConstant.PAYMENT_DETAILS, false],
    [FccGlobalConstant.SHIPMENT_DETAILS, false],
    [FccGlobalConstant.NARRATIVE_DETAILS, false],
    [FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY, false]
  ]);
  i: any;
  flag = false;
  productCode;
  subProductCode;
  pdfDownloadIcon = this.translate.instant('pdfDownload');
  lcmodeParam: any;
  pdfData: Map<string, FCCFormGroup>;
  tabSectionControlMap: Map<string, Map<string, FCCFormControl>>;
  readonly params = 'params';
  readonly previewScreen = 'previewScreen';
  readonly grouphead = 'grouphead';
  translateLabel = 'translate';
  translateValue = 'translateValue';

  ngOnInit() {
    window.scroll(0, 0);
    this.lcmodeParam = this.route.snapshot.params.lcmode;
    const transmissionMode = this.lcmodeParam && this.lcmodeParam !== 'undefined' ?
      FccGlobalConstant.TRANS_MODE.concat('_').concat(this.lcmodeParam) : FccGlobalConstant.EMPTY_STRING;
    this.lcmode = transmissionMode ? `${this.translate.instant(transmissionMode)}` :
      FccGlobalConstant.EMPTY_STRING;
    this.subProductCode = this.route.snapshot.params.subProductCode;
    this.productCode = this.route.snapshot.params.productCode;
    this.refId = this.route.snapshot.params.id;
    this.tnxId = this.route.snapshot.params.tnxId;
    if (CommonService.isTemplateCreation) {
      // this.successMessage = this.route.snapshot.params.successMessage;
      this.entityName = this.route.snapshot.params.entity;
      this.templateId = this.route.snapshot.params.templateName;
      this.templateDescription = this.route.snapshot.params.templateDescription;
      this.successMessage = `${this.translate.instant('template')}` + '  ' +
        this.templateId + '  ' + `${this.translate.instant('savedSuccessfully')}`;
    } else if (this.route.snapshot.params.action === FccGlobalConstant.ACTION_APPROVED ||
      this.route.snapshot.params.action === FccGlobalConstant.ACTION_REJECTED) {
      this.successMessage = this.route.snapshot.params.messageId;
      this.statusValue = `${this.translate.instant(this.route.snapshot.params.action)}`;
      this.lcmode = this.lcmodeParam;
      const tnxTypCode = this.route.snapshot.params.tnxTypCode;
      this.eventValue = (tnxTypCode !== 'undefined') ? `${this.translate.instant(tnxTypCode)}` : '';
    } else {
      //  this.successMessage =   this.route.snapshot.params.messageId;
    }
    this.tnxTypeCode = this.route.snapshot.params.tnxTypeCode;
    this.entityName = this.route.snapshot.params.entity;
    this.currency = this.route.snapshot.params.currency;
    this.beneficiaryNameValue = this.route.snapshot.params.beneficiaryName;
    this.amountValue = this.route.snapshot.params.amount;
    this.expiryDate = this.route.snapshot.params.expiryDate;
    this.statusValue = `${this.translate.instant(this.route.snapshot.params.status)}`;
    if (this.entityName === 'undefined' || this.entityName === '' || this.entityName === null) {
      this.entity = `${this.translate.instant('applicantName')}`;
      this.entityName = this.route.snapshot.params.customerName;
    }
    const message = this.route.snapshot.params.messageId;
    if (message !== undefined && message !== null) {
      this.successMessage = message;
    } else {
      this.successMessage = `${this.translate.instant('successMessage',
        { productName: this.translate.instant(this.productCode) })}`;
    }
    this.eventValue = `${this.translate.instant('N002_' + this.tnxTypeCode)}`;
    this.tnxAmt = this.route.snapshot.params.tnxAmt;
    // this.amountValue = this.customCommasInCurrenciesPipe.transform(this.amountValue, this.currency);
    this.LCListing = `${this.translate.instant(this.productCode)} ${this.translate.instant('Listing')}`;
    this.newLetterOfCredit = `${this.translate.instant('NEW')} ${this.translate.instant(this.productCode)}`;
    if (this.productCode === FccGlobalConstant.PRODUCT_SG) {
      this.amount = this.translate.instant('guaranteeAmtHeader');
    }
    if (this.productCode === FccGlobalConstant.PRODUCT_LI) {
      this.amount = this.translate.instant('liAmtHeader');
    }
  }

  downloadPDF() {
    this.downloadPDFWithEventDetails();
  }

  setDirection() {
    if (this.dir === 'rtl') {
      return 'left';
    } else {
      return 'right';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initiateFromScratch(e) {
    this.utilityService.resetForm();
    this.fileList.resetList();
    this.fileList.resetDocumentList();
    this.router.navigate([FccGlobalConstant.PRODUCT_SCREEN], {
      queryParams: {
        productCode: this.productCode,
        subProductCode: this.subProductCode,
        mode: FccGlobalConstant.INITIATE,
        tnxTypeCode: FccGlobalConstant.N002_NEW
      },
    });
    this.leftSectionService.progressBarData.subscribe(
      data => {
        this.value = data;
      }
    );
    this.leftSectionService.progressBarData.next(0);
    // for (this.i of this.leftSectionService.items) {
    //   this.i.styleClass = '';
    // }


  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openDashboardListing(e: any) {
    this.utilityService.resetForm();
    this.fileList.resetList();
    this.fileList.resetDocumentList();
    this.router.navigate(['productListing'], {
      queryParams: {
        productCode: FccGlobalConstant.PRODUCT_LC,
        subProductCode: FccGlobalConstant.LCSTD, option: FccGlobalConstant.GENERAL
      }
    });
    this.leftSectionService.progressBarData.subscribe(
      data => {
        this.value = data;
      }
    );
    this.leftSectionService.progressBarData.next(0);
    // for (this.i of this.leftSectionService.items) {
    //   this.i.styleClass = '';
    // }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  openTemplateListing(e) {
    CommonService.isTemplateCreation = true;
    this.router.navigate(['productListing'], {
      queryParams: {
        productCode: FccGlobalConstant.PRODUCT_LC,
        subProductCode: FccGlobalConstant.LCSTD, option: FccGlobalConstant.TEMPLATE
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initiateTemplate(e) {
    CommonService.isTemplateCreation = true;
    this.leftSectionService.progressBarData.next(0);
    this.router.navigate(['productScreen'], {
      queryParams: {
        productCode: this.productCode, subProductCode: this.subProductCode, option: FccGlobalConstant.TEMPLATE,
        tnxTypeCode: this.tnxTypeCode
      }
    });
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
        const isGroupField = control[this.params][this.grouphead];
        let previewScreen = control[this.params][this.previewScreen];
        previewScreen = previewScreen === false ? false : true;
        if (fieldName && !isGroupField && previewScreen) {
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
    if ((this.productCode === FccGlobalConstant.PRODUCT_EL || this.productCode === FccGlobalConstant.PRODUCT_SR)
      && (sectionName === FccGlobalConstant.ASSIGNMENT_CONDITIONS || sectionName === FccGlobalConstant.TRANSFER_DETAILS)) {
      const availableAmtField = 'availableAmount';
      const lcAmtField = 'lcAmount';
      const utilizedAmtField = 'utilizedAmount';
      const lcAmount = this.stateService.getValue(sectionName, lcAmtField, false);
      const utilizedAmount = this.stateService.getValue(sectionName, utilizedAmtField, false);
      const remainingAvailableAmount = +this.commonService.replaceCurrency(lcAmount) -
        +this.commonService.replaceCurrency(utilizedAmount);
      const availableAmount = this.currencyConverterPipe.transform(remainingAvailableAmount.toString(),
        this.currency);
      value.controls[availableAmtField].setValue(this.currency.concat(' ').concat(availableAmount));
    }
  }

  setAttachmentDetailsForPDF(sectionName, value, attachmentApiResponse) {
    const attachmentsList = [];
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
}

