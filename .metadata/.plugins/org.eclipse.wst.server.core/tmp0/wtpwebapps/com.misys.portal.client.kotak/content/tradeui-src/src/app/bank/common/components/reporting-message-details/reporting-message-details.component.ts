import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../../common/validators/validation.service';
import { CommonDataService } from '../../../../common/services/common-data.service';
import { IUCommonDataService } from '../../../../trade/iu/common/service/iuCommonData.service';
import { IUService } from '../../../../trade/iu/common/service/iu.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Constants } from './../../../../common/constants';
import { TradeCommonDataService } from '../../../../trade/common/services/trade-common-data.service';
import { DropdownOptions } from '../../../../trade/iu/common/model/DropdownOptions.model';
import { CommonService } from '../../../../common/services/common.service';
import { DownloadAttachmentService } from '../../../../common/services/downloadAttachment.service';
import { validateAmountField, validateClaimAmount, validateDateGreaterThanCurrentDate,
validateSwiftCharSet, validateDate, validateDateLessWithCurrentDate,
validateDateWithDateRange, validateDocumentAmount} from '../../../../common/validators/common-validator';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'fcc-trade-reporting-message-details',
  templateUrl: './reporting-message-details.component.html',
  styleUrls: ['./reporting-message-details.component.scss']
})
export class ReportingMessageDetailsComponent implements OnInit {

  public static CONFIRMATION_ICON = 'pi pi-exclamation-triangle';
  @Input() public bgRecord;
  prodStatusObj: any;
  actionReqObj: DropdownOptions [];
  public enableDocRefNo = false;
  public enableDocAmount = false;
  public docRefReq = false;
  public docAmtReq = false;
  public commentReq = false;
  public isClaimPresentation = false;
  claimPresentationDateSelected: string;
  yearRange: string;
  currencyDecimalMap = new Map<string, number>();
  @Output() formReady = new EventEmitter<UntypedFormGroup>();
  @Output() prodStatus = new EventEmitter<any>();
  @Output() adviseDate = new EventEmitter<any>();
  reportingMessageDetailsSection: UntypedFormGroup;
  public actionReqReadOnly = false;
  viewMode = false;
  dateFormat: string;
  prodStatCodeSelected: string;
  eventMessage: string;
  enableBankReference = false;
  enableComment = true;
  enableActionRequired = false;
  enableIssueDate = false;
  enableAdviseDate = false;
  enableMaturityDate = false;
  enableResponseDate = false;
  currentDate: any;
  adviseDateValidatorArray = [];
  isPendingMessageToBank = false;
  isReleaseReject = false;
  isExistingDraftMenu = false;
  isExistingUnsignedMode = false;
  isRUScratchUnsignedMode = false;
  enableAmendDate = false;
  amdDateSelected: string;
  amdNum: any;
  enableClaimDate = false;
  isRUDraftMode = false;
  actionRequiredClear = true;
  provisionalProdStatCodeSelected: string;
  showWording = false;
  provisionalStatCode: string;
  imagePath: string;
  renderAdvDisc: boolean;
  renderAdvDiscAck: boolean;
  previousProdCode:any;
  previousActionCode: any;

  constructor(public fb: UntypedFormBuilder, public validationService: ValidationService, public commonData: CommonDataService,
              public commonDataService: IUCommonDataService, public iuService: IUService,  public translate: TranslateService,
              public confirmationService: ConfirmationService, public tradeCommonDataService: TradeCommonDataService,
              public commonService: CommonService, public datePipe: DatePipe, public downloadAttachmentService: DownloadAttachmentService) { }

  readonly amdRequestDateType = 'amendment request date';
  readonly expiryDateType = 'expiry date';
  readonly issueDateType = 'issue date';
  readonly responseDateType = 'response date';
  ngOnInit() {
    this.setSectionProperties();
    this.imagePath = this.commonService.getImagePath();
    this.reportingMessageDetailsSection = this.fb.group({
      prodStatCode: ['02', Validators.required],
      boRefId: ['', [Validators.maxLength(this.commonService.getCustRefIdLength())]],
      boComment: ['', Validators.maxLength(Constants.LENGTH_16500)],
      adviseDate: '',
      actionReqCode: '',
      docRefNo:  ['', Validators.maxLength(Constants.LENGTH_16)],
      tnxAmt: '',
      tnxAmtCurCode: '',
      claimReference: '',
      claimPresentDate: '',
      claimAmt: '',
      claimCurCode: '',
      issDate: '',
      amdReqNo: '',
      amdNo: '',
      bgAmdDate: '',
      latestResponseDate: '',
      maturityDate: '',
      provisionalProdStatCode: ['']
    });

    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU
    && this.bgRecord.tnxTypeCode === '01' && !this.isReleaseReject) {
      this.reportingMessageDetailsSection.get('boRefId').setValue(this.bgRecord.refId);
      this.enableAdviseDate = true;
      this.reportingMessageDetailsSection.get('adviseDate').setValue(this.bgRecord.adviseDate);
      this.reportingMessageDetailsSection.get('boComment').setValue(this.bgRecord.boComment);
      this.enableBankReference = true;
      this.enableComment = true;
      this.enableIssueDate = false;
      this.enableAdviseDate = true;
    }
    this.yearRange = this.commonService.getYearRange();
    this.onSetValidations();
    // Action Required needs to be loaded in all the screens
    if (this.bgRecord.prodStatCode && this.bgRecord.prodStatCode !== '' && this.bgRecord.prodStatCode !== null) {
      this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', this.bgRecord.prodStatCode);
    } else {
      this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '');
    }
    if (this.isPendingMessageToBank) {
      this.actionReqObj.length = 0;
      this.actionReqObj = [
        {label: this.commonService.getTranslation('CUSTOMER_INSTRUCTIONS'), value: '99'}
      ];
    }
    if (this.commonData.getProductCode() === 'BG' && this.bgRecord[`bgAmdReqNo`] && this.bgRecord[`bgAmdReqNo`] !== '' &&
    this.bgRecord[`bgAmdReqNo`] != null && (this.bgRecord[`prodStatCode`] === '01') && this.viewMode) {
      this.reportingMessageDetailsSection.get('amdReqNo').setValue(this.bgRecord[`bgAmdReqNo`]);
    }
    if (this.commonData.getProductCode() === 'BG' && this.bgRecord[`bgAmdNo`] && this.bgRecord[`bgAmdNo`] !== '' &&
    this.bgRecord[`bgAmdNo`] != null && (this.bgRecord[`prodStatCode`] === '08' || this.bgRecord[`prodStatCode`] === '31') &&
    this.viewMode) {
      this.reportingMessageDetailsSection.get('amdNo').setValue(this.bgRecord[`bgAmdNo`]);
      this.amdNum = this.bgRecord[`bgAmdNo`];
    }
    if (this.commonData.getProductCode() === 'BR' && this.bgRecord[`amdNo`] && this.bgRecord[`amdNo`] !== '' &&
     this.bgRecord[`amdNo`] != null && (this.bgRecord[`prodStatCode`] === '08' || this.bgRecord[`prodStatCode`] === '31') &&
    this.viewMode) {
      this.reportingMessageDetailsSection.get('amdNo').setValue(this.bgRecord[`amdNo`]);
      this.amdNum = this.bgRecord[`amdNo`];
    }
    if (this.bgRecord.tnxTypeCode === Constants.TYPE_NEW && this.commonData.getProductCode() === 'BR' &&
    this.commonData.getMode() === Constants.MODE_UNSIGNED) {
      this.isRUScratchUnsignedMode = true;
      this.setUnsignedDateFieldEditableForRuUnsigned();
    }
    if (this.bgRecord.tnxTypeCode === Constants.TYPE_NEW && this.commonData.getProductCode() === 'BR' &&
      this.commonData.getMode() === Constants.MODE_DRAFT) {
        this.isRUDraftMode = true;
      }
    this.initFieldValues();
    let eventDate;
    eventDate = this.amdDateSelected ;
    if (eventDate != null && eventDate !== '') {
      eventDate = this.commonService.getDateObject(eventDate);
    }
    this.commonService.setMinFirstDate(eventDate);
    this.enableDate();
    if (this.bgRecord.tnxTypeCode === Constants.TYPE_REPORTING &&
      this.commonData.getMode() === Constants.MODE_UNSIGNED) {
        this.isExistingUnsignedMode = true;
        this.setUnsignedDateFieldEditable();
      }
    if (this.bgRecord.tnxTypeCode === Constants.CODE_01 && this.enableBankReference &&
       this.commonData.getMode() !== Constants.MODE_UNSIGNED) {
        this.reportingMessageDetailsSection.get('boRefId').setValidators([Validators.required,
          Validators.maxLength(this.commonService.getCustRefIdLength())]);
        this.reportingMessageDetailsSection.get('boRefId').updateValueAndValidity();
      }
         // Emit the form group to the parent
    this.formReady.emit(this.reportingMessageDetailsSection);
  }
  setSectionProperties() {
    this.dateFormat = this.commonService.getDateFormat();
    this.currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.amdDateSelected = this.currentDate;
    this.isExistingDraftMenu = (this.bgRecord.tnxTypeCode === Constants.TYPE_REPORTING
      && this.commonData.getMode() === Constants.MODE_DRAFT);
    if (this.commonData.getDisplayMode() === Constants.MODE_VIEW && this.commonDataService.getMode() !== Constants.MODE_RELEASE) {
      this.viewMode = true;
    } else {
      this.viewMode = false;
    }
    if (Constants.OPTION_EXISTING === this.commonData.getOption() || this.isExistingDraftMenu) {
      this.enableDocRefNo = false;
      this.enableDocAmount = false;
      this.enableComment = true;
      this.enableMaturityDate = false;
      this.enableResponseDate = false;
      this.docRefReq = false;
      this.docAmtReq = false;
      this.commentReq = false;
    }
    this.isPendingMessageToBank = (this.commonData.getOperation() === Constants.OPERATION_CREATE_REPORTING &&
                                    this.bgRecord.tnxTypeCode === Constants.TYPE_INQUIRE);
    this.isReleaseReject = (this.commonData.getOperation() === Constants.OPERATION_CREATE_RELEASEREJECT_REPORTING &&
                                     this.bgRecord.subTnxStatCode === Constants.TYPE_STOPOVER);
  }

  getFileExt(fileName: string) {
    return fileName.split('.').pop();
  }

  getPreviousRecord(attachment: any) {
    if (attachment.constructor.name === 'Array') {
      return attachment;
    } else if (typeof attachment === 'object') {
      let attachArray = [];
      attachArray.push(attachment);
      return attachArray;
    } else {
      return false;
    }
  }

  renderAdviceDiscrepancyAck() {
    if (this.bgRecord.objectData.parent_tnx_details) {
      this.previousProdCode = this.bgRecord.objectData.parent_tnx_details.prod_stat_code;
      this.previousActionCode = this.bgRecord.objectData.parent_tnx_details.action_req_code;
      const validProdStatCodes = [Constants.N005_REJECTED,Constants.N005_ACCEPTED,Constants.N005_UPDATED,
          Constants.N005_PART_SIGHT_PAID,Constants.N005_FULL_SIGHT_PAID];
      this.renderAdvDiscAck = ((this.previousProdCode === Constants.N005_DISCREPANT || 
        this.previousActionCode === Constants.N042_DISCREPANCY_RESPONSE) && (validProdStatCodes.indexOf(this.bgRecord.prodStatCode) > -1) 
        && this.bgRecord.tnxStatCode !== Constants.N015_PENDING_VERIFY && this.bgRecord.tnxStatCode !== Constants.N015_PENDING_AUTHORISE
        && this.bgRecord.subProductCode === Constants.STAND_BY);
      this.renderAdvDisc = ((this.previousProdCode === Constants.N005_DISCREPANT || this.previousActionCode === Constants.N042_DISCREPANCY_RESPONSE) &&
        this.bgRecord.tnxStatCode !== Constants.N015_PENDING_SEND);
        return (this.renderAdvDiscAck || this.renderAdvDisc);
    } else {
      return false;
    }
  }

  renderPreviousComment() {
    if (this.bgRecord.objectData.parent_tnx_details && this.bgRecord.objectData.parent_tnx_details.bo_comment
      && this.commonService.isFieldsValuesExists([this.bgRecord.objectData.parent_tnx_details.bo_comment])) {
        return true;
    } else {
      return false;
    }
  }

  renderPreviousAttachment() {
    if (this.bgRecord.objectData.parent_tnx_details && this.bgRecord.objectData.parent_tnx_details.attachments &&
      this.bgRecord.objectData.parent_tnx_details.attachments !== 'undefined' &&
      this.getPreviousRecord(this.bgRecord.objectData.parent_tnx_details.attachments.attachment)) {
        return true;
    } else {
      return false;
    }
  }

  initFieldValues() {
    if (this.commonData.getMode() === Constants.MODE_DRAFT || Constants.SCRATCH === this.commonData.getOption()) {
    if (this.bgRecord.prodStatCode !== '' && Constants.OPTION_EXISTING !== this.commonData.getOption()
    && !(this.isRUDraftMode)) {
      this.reportingMessageDetailsSection.get('prodStatCode').setValue(this.bgRecord.prodStatCode);
    } else if ((this.isRUDraftMode)) {
      this.reportingMessageDetailsSection.get('prodStatCode').setValue('02');
    }
    if (this.isExistingDraftMenu) {
      this.updateExistingDraftModeDecision();
    }
    if (this.bgRecord.actionReqCode !== '') {
      this.reportingMessageDetailsSection.get('actionReqCode').setValue(this.bgRecord.actionReqCode);
    }
    if (this.isPendingMessageToBank && this.bgRecord.prodStatCode !== '' &&
    (this.bgRecord.subTnxTypeCode === '66' || this.bgRecord.subTnxTypeCode === '67')) {
      this.reportingMessageDetailsSection.get('prodStatCode').setValue('02');
    }
    if (this.bgRecord.prodStatCode !== '' && (this.bgRecord.prodStatCode === '84' ||
        this.bgRecord.prodStatCode === '85')) {
      this.isClaimPresentation = true;
      this.claimPresentationDateSelected = this.bgRecord.claimPresentDate;
      this.reportingMessageDetailsSection.patchValue({
        claimReference: this.bgRecord.claimReference,
        claimPresentDate: this.claimPresentationDateSelected,
        claimCurCode: ((this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
        this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode),
        claimAmt: this.bgRecord.claimAmt
      });
      this.yearRange = this.commonService.getYearRange();
    }
    this.enableBankersSectionFields();
    this.setProvisionalProdStatCode();
    this.patchValues();
   }
    if (this.isPendingMessageToBank && (this.bgRecord[`prodStatCode`] === '78' || this.bgRecord[`prodStatCode`] === '79')) {
    this.showWording = true;
  }
    this.setToCurrentDate();
  }

  private enableBankersSectionFields() {
    if (this.bgRecord.prodStatCode !== '' &&
      (this.bgRecord.prodStatCode === Constants.APPROVED_PROD_STAT_CODE || this.bgRecord.prodStatCode === '08')) {
      this.enableBankReference = true;
      this.enableComment = true;
      this.enableIssueDate = true;
      this.enableActionRequired = true;
      if (this.bgRecord.prodStatCode === Constants.APPROVED_PROD_STAT_CODE &&
        this.commonData.mode === Constants.MODE_DRAFT && this.bgRecord.tnxTypeCode === Constants.TYPE_REPORTING) {
        this.enableActionRequired = false;
      }
    }
    if (this.bgRecord.prodStatCode !== '' && this.bgRecord.prodStatCode === '03') {
      this.enableComment = true;
      this.enableActionRequired = true;
    }
  }

  setProvisionalProdStatCode() {
    if (Constants.SCRATCH === this.commonData.getOption() && (this.bgRecord[`prodStatCode`] === '98' ||
    this.bgRecord.prodStatCode === '78' || this.bgRecord.prodStatCode === '79')) {
      this.reportingMessageDetailsSection.get('prodStatCode').setValue('02');
    }
    if (this.commonData.getMode() === Constants.MODE_DRAFT && Constants.OPTION_EXISTING !== this.commonData.getOption()
    && this.bgRecord[`prodStatCode`] === '98') {
      this.enableActionRequired = true;
      this.enableBankReference = true;
      this.reportingMessageDetailsSection.get('prodStatCode').setValue('03');
    }
    if (this.isPendingMessageToBank && this.commonData.getMode() === Constants.MODE_DRAFT && this.bgRecord.prodStatCode !== '' &&
    (this.bgRecord.prodStatCode === '78' || this.bgRecord.prodStatCode === '79')) {
      this.reportingMessageDetailsSection.get('prodStatCode').setValue('03');
      this.reportingMessageDetailsSection.get('provisionalProdStatCode').setValue(this.bgRecord.prodStatCode);
      this.setActionWordingDecision();
    }
    if (this.isPendingMessageToBank && this.commonData.getMode() === Constants.MODE_DRAFT && this.bgRecord.prodStatCode !== '' &&
    (this.bgRecord.prodStatCode === '02' || this.bgRecord.prodStatCode === '01') &&
    (this.bgRecord.subTnxTypeCode === '88' || this.bgRecord.subTnxTypeCode === '89')) {
      this.reportingMessageDetailsSection.get('prodStatCode').setValue(this.bgRecord.prodStatCode);
      this.reportingMessageDetailsSection.get('provisionalProdStatCode').setValue('');
    }
    if (this.isPendingMessageToBank && this.commonData.getMode() === Constants.MODE_DRAFT && this.bgRecord.prodStatCode !== '' &&
    this.bgRecord.prodStatCode === '03' &&
    (this.bgRecord.subTnxTypeCode === '88' || this.bgRecord.subTnxTypeCode === '89')) {
      this.showWording = true;
      this.reportingMessageDetailsSection.get('prodStatCode').setValue(this.bgRecord.prodStatCode);
      this.reportingMessageDetailsSection.get('provisionalProdStatCode').setValue('');
      this.setWordingAcceptedIssueDate(this.bgRecord.prodStatCode);
    }
  }

  patchValues() {
    this.reportingMessageDetailsSection.patchValue({
      issDate: this.bgRecord.issDate,
      actionReqCode: this.bgRecord.actionReqCode,
      boRefId: this.bgRecord.boRefId,
      boComment: this.bgRecord.boComment,
      docRefNo: this.bgRecord.docRefNo,
      tnxAmtCurCode: ((this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode),
      tnxAmt: ((this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuTnxAmt : this.bgRecord.tnxAmt),
      bgAmdDate: this.bgRecord.bgAmdDate,
      latestResponseDate: this.bgRecord.latestResponseDate,
      maturityDate: this.bgRecord.maturityDate
    });
    if (this.bgRecord.prodStatCode === Constants.REJECT_PROD_STATUS_CODE) {
      this.commentReq = true;
      this.reportingMessageDetailsSection.get(`boComment`).setValidators([Validators.required,
         Validators.maxLength(Constants.LENGTH_16500)]);
      this.reportingMessageDetailsSection.get(`boComment`).updateValueAndValidity();
    }
    if (this.commonData.option === Constants.SCRATCH && this.commonDataService.getMode() === Constants.MODE_DRAFT &&
      this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
      this.reportingMessageDetailsSection.get('prodStatCode').setValue('02');
    }
   }

  setToCurrentDate() {
    const blankIssDateProdStatCode = ['78', '79', '98'];
    if ((this.commonDataService.getMode() === Constants.MODE_UNSIGNED ||
        this.commonData.getMode() !== Constants.MODE_DRAFT) && !this.isReleaseReject &&
        this.bgRecord.productCode === 'BG' && !(blankIssDateProdStatCode.includes(this.bgRecord.prodStatCode))) {
    this.reportingMessageDetailsSection.get('issDate').setValue(this.amdDateSelected);
    this.reportingMessageDetailsSection.get('bgAmdDate').setValue(this.amdDateSelected);
   }
  }

  updateExistingDraftModeDecision() {
    this.reportingMessageDetailsSection.get('prodStatCode').setValue('02');
    this.enableActionRequired = true;
    if (this.bgRecord.prodStatCode === '78' || this.bgRecord.prodStatCode === '79') {
      this.enableActionRequired = false;
      this.reportingMessageDetailsSection.get('actionReqCode').setValue('');
    } else if (this.bgRecord.prodStatCode !== '') {
      this.onProdStatChange(this.bgRecord.prodStatCode, '');
    }
  }
  onSetValidations() {
    const invalidProdStatCode = [Constants.PROD_STAT_CODE_FINAL_WORDING, Constants.PROD_STAT_CODE_WORDING_REVIEW,
      Constants.PROD_STAT_CODE_PROVISIONAL, Constants.REJECT_PROD_STATUS_CODE];
    if (Constants.SCRATCH === this.commonData.getOption() && this.bgRecord.prodStatCode && this.bgRecord.prodStatCode !== '02') {
    this.reportingMessageDetailsSection.get('boRefId').setValidators([Validators.required, Validators.maxLength(Constants.LENGTH_16)]);
    }
    if (((Constants.SCRATCH === this.commonData.getOption() && this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU
    && this.bgRecord.tnxTypeCode && this.bgRecord.tnxTypeCode === '01') || (Constants.MODE_UNSIGNED === this.commonDataService.getMode()
    && this.bgRecord.tnxTypeCode !== Constants.TYPE_REPORTING)) && !(invalidProdStatCode.indexOf(this.bgRecord.prodStatCode) > -1)) {
    this.reportingMessageDetailsSection.get('issDate').setValidators([Validators.required]);
    }
    if (Constants.SCRATCH === this.commonData.getOption() && this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU
    && this.bgRecord.tnxTypeCode && this.bgRecord.tnxTypeCode === '03') {
    this.reportingMessageDetailsSection.get('bgAmdDate').setValidators([Validators.required]);
    }
  }

  enableDate() {
    if (this.bgRecord.tnxTypeCode === '03' && this.bgRecord.productCode === 'BG' && this.viewMode) {
    this.enableAmendDate = true;
    }
    if (this.bgRecord.tnxTypeCode === '01' && this.bgRecord.productCode === 'BG' && this.viewMode) {
    this.enableIssueDate = true;
    }
    if (this.bgRecord.productCode === 'BG' && this.bgRecord.tnxTypeCode === '01' && this.bgRecord.provisionalStatus === 'Y') {
      this.enableIssueDate = false;
    }
    if (this.viewMode && this.bgRecord.prodStatCode !== '' &&
    this.bgRecord.prodStatCode === '03' && this.bgRecord.tnxTypeCode === Constants.TYPE_INQUIRE &&
    (this.bgRecord.subTnxTypeCode === '88' || this.bgRecord.subTnxTypeCode === '89')) {
      this.enableIssueDate = true;
    }
  }

  onProdStatChange(event, fromSection) {
    const prodStatusCode = this.reportingMessageDetailsSection.get('prodStatCode').value;
    this.reportingMessageDetailsSection.get('actionReqCode').setValue('');
    this.actionRequiredClear = true;
    const isFromReportingSection = 'fromReportingSection';
    this.reportingMessageDetailsSection.get(`boComment`).clearValidators();
    if (prodStatusCode === Constants.REJECT_PROD_STATUS_CODE) {
      this.commentReq = true;
      this.reportingMessageDetailsSection.get(`boComment`).setValidators([Validators.required,
         Validators.maxLength(Constants.LENGTH_16500)]);
    } else {
      this.commentReq = false;
      this.reportingMessageDetailsSection.get(`boComment`).setValidators([
        Validators.maxLength(Constants.LENGTH_16500)]);
    }
    this.reportingMessageDetailsSection.get(`boComment`).updateValueAndValidity();
    if (event === undefined) {
      event = this.commonData.getProdStatCode();
    }
    if (event !== '08' && event !== '31') {
      this.enableAmendDate = false;
    }
    if (event !== '84' && event !== '85') {
      this.isClaimPresentation = false;
    }
    this.commonData.isProdStatReject = false;
    this.reportingMessageDetailsSection.get('boRefId').setValue(this.bgRecord.refId);
    this.reportingMessageDetailsSection.get('bgAmdDate').setValue(this.bgRecord.bgAmdDate);
    this.manageDecission(prodStatusCode);

    if (event !== undefined) {
    if ((event === '08' || event === '09' || event === '31' || event === '78' || event === '79') && prodStatusCode !== '01') {
        this.commonData.disableTnx = false;
      } else {
        this.commonData.disableTnx = true;
      }
   }
    if (prodStatusCode !== '01' && fromSection !== isFromReportingSection) {
    this.manageProdStatEvents(event);
   }
    if (event === '78' || event === '79') {
     this.setActionWordingDecision();
   }
    this.manageDecissionForRU(prodStatusCode);
    if (this.bgRecord.productCode === 'BG' && this.bgRecord.tnxTypeCode === '01' &&
    (this.bgRecord.provisionalStatus === 'Y' || this.bgRecord.prodStatCode === '98')) {
      this.setWordingAcceptedIssueDate('');
    }
  }

  manageDecissionForRU(prodStatusCode) {
    if ((this.commonData.getProductCode() === 'BR' && this.bgRecord[`tnxTypeCode`] === '01')) {
      this.enableActionRequired = false;
      this.enableIssueDate = false;
      this.enableDocRefNo = false;
      if (prodStatusCode === '01') {
        this.enableAdviseDate = false;
        this.reportingMessageDetailsSection.get('adviseDate').setValue('');
        this.reportingMessageDetailsSection.get('adviseDate').setErrors(null);
        this.reportingMessageDetailsSection.get('adviseDate').setValidators(null);
      } else {
        this.enableBankReference = true;
        this.enableComment = true;
        this.enableAdviseDate = true;
        this.commonData.disableTnx = false;
        this.enableActionRequired = true;
        if (this.bgRecord.applDate !== '') {
        this.reportingMessageDetailsSection.get('adviseDate').setValue(this.bgRecord.applDate);
        }
        this.reportingMessageDetailsSection.get('adviseDate').setValidators(this.adviseDateValidatorArray);
      }
      this.prodStatus.emit(prodStatusCode);
    } else if ((Constants.OPTION_EXISTING === this.commonData.getOption() || this.isExistingDraftMenu) &&
      (this.commonData.getProdStatCode() === '08' || this.commonData.getProdStatCode() === '31') &&
      (prodStatusCode !== '01')) {
        this.enableAmendDate = true;
        this.prodStatus.emit(prodStatusCode);
    } else {
      this.prodStatus.emit(prodStatusCode);
    }
  }

  manageDecission(prodStatusCode) {
    if (prodStatusCode === '02') {
      this.enableBankReference = false;
      if (Constants.OPTION_EXISTING === this.commonData.getOption() || this.isExistingDraftMenu) {
      this.enableComment = true;
      } else {
      this.enableAmendDate = false;
      this.enableComment = false;
      this.enableActionRequired = false;
      this.enableIssueDate = false;
      }
    } else if (prodStatusCode === '01') {
      this.commonData.isProdStatReject = true;
      this.enableBankReference = false;
      this.enableComment = true;
      this.enableActionRequired = false;
      this.enableIssueDate = false;
      this.enableAmendDate = false;
    } else if (prodStatusCode === '04' || prodStatusCode === '03') {
      this.enableBankReference = true;
      this.enableComment = true;
      if (Constants.OPTION_EXISTING === this.commonData.getOption() || this.isExistingDraftMenu) {
        this.enableIssueDate = false;
      } else {
      this.enableActionRequired = true;
      this.enableIssueDate = true;
      }
    } else if (prodStatusCode === '08') {
      this.enableAmendDate = true;
      this.enableBankReference = true;
      this.enableComment = true;
      this.enableActionRequired = true;
    }
  }

  manageEventsForStandBy(event) {
    if (event === '12') {
      this.reportingMessageDetailsSection.get('tnxAmtCurCode').setValue(
        (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode
      );
      this.enableDocRefNo = true;
      this.enableDocAmount = true;
      this.enableMaturityDate = true;
      this.enableResponseDate = true;
      this.enableActionRequired = true;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '12');
      this.actionReqReadOnly = false;
      this.docRefReq = false;
      this.docAmtReq = true;
      this.commentReq = true;
      this.setValidatorsOnStatus(event);
    } else if (event === '14' || event === '15') {
      this.reportingMessageDetailsSection.get('tnxAmtCurCode').setValue(
        (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode
      );
      this.enableDocRefNo = false;
      this.enableDocAmount = true;
      this.enableMaturityDate = true;
      this.enableAmendDate = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.enableResponseDate = true;
      this.enableActionRequired = true;
      if ( event === '14') {
        this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '14');
      } else {
        this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '15');
      }
      this.actionReqReadOnly = false;
      this.docRefReq = false;
      this.docAmtReq = true;
      this.commentReq = false;
      this.setValidatorsOnStatus(event);
    } else if (event === '05' || event === '13') {
      this.reportingMessageDetailsSection.get('tnxAmtCurCode').setValue(
        (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode
      );
      this.enableDocRefNo = false;
      this.enableDocAmount = true;
      this.enableMaturityDate = true;
      this.enableResponseDate = false;
      this.enableAmendDate = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.enableActionRequired = false;
      this.docRefReq = false;
      this.docAmtReq = true;
      this.commentReq = false;
      this.setValidatorsOnStatus(event);
      this.setEventMessage(event);
    } else if (event === '26') {
      this.reportingMessageDetailsSection.get('tnxAmtCurCode').setValue(
        (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode
      );
      this.enableDocRefNo = true;
      this.enableDocAmount = true;
      this.enableMaturityDate = true;
      this.enableResponseDate = true;
      this.enableActionRequired = true;
      this.enableAmendDate = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '26');
      this.actionReqReadOnly = false;
      this.docRefReq = false;
      this.docAmtReq = true;
      this.commentReq = false;
      this.setValidatorsOnStatus(event);
    }
  }

  manageEventsNotForStadBy(event) {
    if (event === '11') {
      this.enableDocRefNo = false;
      this.enableDocAmount = false;
      this.enableMaturityDate = false;
      this.enableAmendDate = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.enableResponseDate = true;
      if (this.commonData.getProductCode() === 'BR') {
      this.enableActionRequired = true;
      this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '11');
      } else {
        this.enableActionRequired = false;
      }
      this.actionReqReadOnly = false;
      this.docRefReq = false;
      this.docAmtReq = false;
      this.commentReq = false;
      this.setValidatorsOnStatus(event);
    } else if (event === '84') { // Claim Presentation
      this.reportingMessageDetailsSection.get('claimCurCode').setValue(
        (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode
      );
      this.enableDocRefNo = false;
      this.enableDocAmount = false;
      this.enableMaturityDate = false;
      this.enableAmendDate = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.enableResponseDate = true;
      this.enableActionRequired = true;
      this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '84');
      this.actionReqReadOnly = false;
      this.isClaimPresentation = true;
      this.docRefReq = false;
      this.docAmtReq = false;
      this.commentReq = false;
      this.setValidatorsOnStatus(event);
    } else if (event === '85') { // Claim Settlement
      this.reportingMessageDetailsSection.get('claimCurCode').setValue(
        (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode
      );
      this.enableDocRefNo = false;
      this.enableDocAmount = false;
      this.enableMaturityDate = false;
      this.enableResponseDate = false;
      this.enableActionRequired = false;
      this.isClaimPresentation = true;
      this.enableAmendDate = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.docRefReq = false;
      this.docAmtReq = false;
      this.commentReq = false;
      this.setValidatorsOnStatus(event);
      this.setEventMessage(event);
    }
  }
  manageCommonEvents(event) {
    if (event === '10') {
      this.enableDocRefNo = false;
      this.enableDocAmount = false;
      this.enableAmendDate = false;
      this.enableMaturityDate = false;
      this.enableResponseDate = false;
      this.enableActionRequired = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.docRefReq = false;
      this.docAmtReq = false;
      this.commentReq = false;
      this.setValidatorsOnStatus(event);
    } else if (event === '24') {
      this.reportingMessageDetailsSection.get('tnxAmtCurCode').setValue(
        (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode
      );
      this.enableDocRefNo = true;
      this.enableDocAmount = true;
      this.enableMaturityDate = true;
      this.enableResponseDate = true;
      this.enableAmendDate = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.enableActionRequired = true;
      this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '24');
      this.actionReqReadOnly = false;
      this.docRefReq = false;
      this.docAmtReq = true;
      this.commentReq = false;
      this.setValidatorsOnStatus(event);
      this.setEventMessage(event);
    } else if (event === '14' || event === '15') {
      this.reportingMessageDetailsSection.get('tnxAmtCurCode').setValue(
        (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode
      );
      this.enableDocRefNo = false;
      this.enableDocAmount = true;
      this.enableMaturityDate = true;
      this.enableAmendDate = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.enableResponseDate = true;
      this.enableActionRequired = true;
      if ( event === '14') {
        this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '14');
      } else {
        this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '15');
      }
      this.actionReqReadOnly = false;
      this.docRefReq = false;
      this.docAmtReq = true;
      this.commentReq = false;
      this.setValidatorsOnStatus(event);
    } else if (event === '07') {
      this.enableDocRefNo = false;
      this.enableDocAmount = false;
      this.enableMaturityDate = false;
      this.enableResponseDate = false;
      this.enableActionRequired = false;
      this.enableAmendDate = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.docRefReq = false;
      this.docAmtReq = false;
      this.commentReq = true;
      this.setValidatorsOnStatus(event);
    }  else if (event === '04') {
      this.reportingMessageDetailsSection.get('tnxAmtCurCode').setValue(
        (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode
      );
      this.enableDocRefNo = false;
      this.enableDocAmount = true;
      this.enableMaturityDate = true;
      this.enableResponseDate = false;
      this.enableActionRequired = false;
      this.enableAmendDate = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.docRefReq = false;
      this.docAmtReq = true;
      this.commentReq = false;
      this.setValidatorsOnStatus(event);
      this.setEventMessage(event);
    } else if (event === '16' || event === '82' || event === '42' || event === '32') {
      this.enableDocRefNo = false;
      this.enableDocAmount = false;
      this.enableMaturityDate = false;
      this.enableAmendDate = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.enableResponseDate = false;
      this.enableActionRequired = false;
      this.docRefReq = false;
      this.docAmtReq = false;
      this.commentReq = false;
      this.setValidatorsOnStatus(event);
      if (event === '32') {
        this.setEventMessage(event);
      }
    } else if (event === '06') {
      this.enableDocRefNo = false;
      this.enableDocAmount = false;
      this.enableMaturityDate = false;
      this.enableAmendDate = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.enableResponseDate = true;
      if (this.commonData.getProductCode() === 'BR') {
      this.enableActionRequired = true;
      this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '06');
      } else {
        this.enableActionRequired = false;
      }
      this.actionReqReadOnly = false;
      this.docRefReq = false;
      this.docAmtReq = false;
      this.commentReq = false;
      this.setValidatorsOnStatus(event);
    } else if (event === '81') {
      this.enableDocRefNo = false;
      this.enableDocAmount = false;
      this.enableMaturityDate = false;
      this.enableAmendDate = false;
      this.reportingMessageDetailsSection.get('amdNo').setValue('');
      this.enableResponseDate = true;
      if (this.commonData.getProductCode() === 'BR') {
        this.enableActionRequired = true;
        this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '81');
       } else {
        this.enableActionRequired = false;
      }
      this.actionReqReadOnly = false;
      this.docRefReq = false;
      this.docAmtReq = false;
      this.commentReq = false;
      this.setValidatorsOnStatus(event);
      this.setEventMessage(event);
    }
  }

  manageEventsForAmend(event) {
    if (event === '08' || event === '31' || event === '09') {
      this.enableDocRefNo = false;
      this.enableDocAmount = false;
      this.enableActionRequired = true;
      this.actionReqReadOnly = false;
      if (event === '08' || event === '31') {
      this.enableAmendDate = true;
      this.reportingMessageDetailsSection.get('amdNo').setValue(this.amdNum);
      } else {
        this.enableAmendDate = false;
        this.reportingMessageDetailsSection.get('amdNo').setValue('');
      }
      this.enableMaturityDate = false;
      this.enableResponseDate = true;
      if (event === '08' || event === '09') {
        this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '08');
      } else {
        this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '31');
      }
      this.docRefReq = false;
      this.docAmtReq = false;
      this.commentReq = false;
      this.commonData.setProdStatCode(event);
      this.setValidatorsOnStatus(event);
    }

  }

  manageProdStatEvents(event) {
    if (event === '05' || event === '13' || event === '12' || event === '26' || event === '14' || event === '15') {
      this.manageEventsForStandBy(event);
    } else if (event === '11' || event === '84' || event === '85') {
      this.manageEventsNotForStadBy(event);
    } else if (event === '08' || event === '09' || event === '31') {
      this.manageEventsForAmend(event);
    } else {
      this.manageCommonEvents(event);
    }
  }
  onProdStatChangeMsgToBank() {
    const prodStatCode = this.reportingMessageDetailsSection.get('prodStatCode').value;
    this.reportingMessageDetailsSection.get(`boComment`).clearValidators();
    if (prodStatCode === Constants.REJECT_PROD_STATUS_CODE) {
      this.commentReq = true;
      this.reportingMessageDetailsSection.get(`boComment`).setValidators([Validators.required,
         Validators.maxLength(Constants.LENGTH_16500)]);
      this.reportingMessageDetailsSection.parent.get('fileUploadSection').get('bgSendAttachmentsBy').clearValidators();
      this.reportingMessageDetailsSection.parent.get('fileUploadSection').get('bgSendAttachmentsByOther').clearValidators();
    } else {
      this.commentReq = false;
      this.reportingMessageDetailsSection.get(`boComment`).setValidators([
        Validators.maxLength(Constants.LENGTH_16500)]);
      if (prodStatCode !== Constants.PENDING_PROD_STATUS_CODE) {
      this.reportingMessageDetailsSection.parent.get('fileUploadSection').get('bgSendAttachmentsBy').setValidators([Validators.required]);
      this.reportingMessageDetailsSection.parent.get('fileUploadSection').get('bgSendAttachmentsByOther')
      .setValidators([Validators.required]);
      } else {
      this.reportingMessageDetailsSection.parent.get('fileUploadSection').get('bgSendAttachmentsBy').clearValidators();
      this.reportingMessageDetailsSection.parent.get('fileUploadSection').get('bgSendAttachmentsByOther').clearValidators();
      }
    }
    this.reportingMessageDetailsSection.get(`boComment`).updateValueAndValidity();
    this.reportingMessageDetailsSection.parent.get('fileUploadSection').get('bgSendAttachmentsBy').updateValueAndValidity();
    this.reportingMessageDetailsSection.parent.get('fileUploadSection').get('bgSendAttachmentsByOther').updateValueAndValidity();
    if (this.isPendingMessageToBank && this.bgRecord.prodStatCode !== '' &&
    (this.bgRecord.subTnxTypeCode === '88' || this.bgRecord.subTnxTypeCode === '89')) {
      this.showWording = true;
      this.reportingMessageDetailsSection.get('provisionalProdStatCode').setValue('');
      this.setWordingAcceptedIssueDate(prodStatCode);
    }
    if (this.reportingMessageDetailsSection.get('provisionalProdStatCode') &&
    (this.reportingMessageDetailsSection.get('provisionalProdStatCode').value === null ||
     this.reportingMessageDetailsSection.get('provisionalProdStatCode').value === '')) {
     this.provisionalStatCode = '';
   }
    if (this.isReleaseReject) {
      this.enableComment = (prodStatCode === '02');
    } else {
    this.actionRequiredClear = true;
    this.enableComment = (prodStatCode === '04' || prodStatCode === '01' || prodStatCode === '07' ||
    (prodStatCode === Constants.CODE_03 && this.showWording));
    this.enableActionRequired = (prodStatCode === '04' || prodStatCode === '07' ||
    (prodStatCode === Constants.CODE_03 && this.showWording));
    this.actionReqObj.length = 0;
    this.actionReqObj = [
      {label: this.commonService.getTranslation('CUSTOMER_INSTRUCTIONS'), value: '99'}
    ]; }
    this.prodStatus.emit(prodStatCode);
  }

  generatePdf(generatePdfService) {
    generatePdfService.setSectionDetails('HEADER_BANKERS_SECTION', true, false, 'reportingMessageDetails');
  }

  generatePreviousPdf(generatePdfService) {
      generatePdfService.setSectionDetails('ADVICE_OF_DISCREPANCIES', true, false, 'adviceDiscrepancies');
  }

  setValidatorClaimAmount() {
    this.currencyDecimalMap = this.commonService.getCurrencyDecimalMap();
    this.reportingMessageDetailsSection.controls.claimAmt.clearValidators();
    const availAmt = ((this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
    this.bgRecord.purpose !== Constants.CODE_01) ?
    this.reportingMessageDetailsSection.parent.get('cuAmountDetailsSection').get('cuAvailableAmt') :
    this.reportingMessageDetailsSection.parent.get('amountDetailsSection').get('bgAvailableAmt')
    );
    this.reportingMessageDetailsSection.get('claimAmt').setValidators([validateAmountField(
    this.reportingMessageDetailsSection.get('claimCurCode').value, this.currencyDecimalMap.get(
      (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode
    )),
    validateClaimAmount(this.reportingMessageDetailsSection.get('claimAmt'), availAmt)]);
    this.reportingMessageDetailsSection.get('claimAmt').setValue(this.commonService.transformAmt(
         this.reportingMessageDetailsSection.get('claimAmt').value,
         (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode
         ));
    this.reportingMessageDetailsSection.controls.claimAmt.updateValueAndValidity();
    this.reportingMessageDetailsSection.updateValueAndValidity();
    }
    setValidatorDocumentAmount() {
      this.currencyDecimalMap = this.commonService.getCurrencyDecimalMap();
      const availAmt = ((this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ?
      this.reportingMessageDetailsSection.parent.get('cuAmountDetailsSection').get('cuAvailableAmt') :
      this.reportingMessageDetailsSection.parent.get('amountDetailsSection').get('bgAvailableAmt')
      );
      this.reportingMessageDetailsSection.get('tnxAmt').setValidators([validateAmountField(
      this.reportingMessageDetailsSection.get('tnxAmtCurCode').value, this.currencyDecimalMap.get(
        (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode
      )),
      validateDocumentAmount(this.reportingMessageDetailsSection.get('tnxAmt'), availAmt)]);
      this.reportingMessageDetailsSection.get('tnxAmt').setValue(this.commonService.transformAmt(
           this.reportingMessageDetailsSection.get('tnxAmt').value,
           (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      this.bgRecord.purpose !== Constants.CODE_01) ? this.bgRecord.cuCurCode : this.bgRecord.bgCurCode));
      this.reportingMessageDetailsSection.controls.tnxAmt.updateValueAndValidity();
      this.reportingMessageDetailsSection.updateValueAndValidity();
      }
  validateClaimPresentationDate() {
    this.reportingMessageDetailsSection.get('claimPresentDate').clearValidators();
    this.reportingMessageDetailsSection.get('claimPresentDate').setValidators([Validators.required,
    validateDateWithDateRange(this.reportingMessageDetailsSection.get('claimPresentDate').value,
      this.bgRecord.issDate, this.currentDate,
    Constants.CLAIM_DATE, Constants.ISSUANCE_DATE, Constants.CURRENT_DATE )]);
    this.reportingMessageDetailsSection.get('claimPresentDate').updateValueAndValidity();
  }
  validateClaimReference() {
    this.reportingMessageDetailsSection.get('claimReference').clearValidators();
    this.reportingMessageDetailsSection.get('claimReference').setValidators([Validators.required,
    Validators.maxLength(Constants.LENGTH_20), validateSwiftCharSet(Constants.X_CHAR)]);
    this.reportingMessageDetailsSection.get('claimReference').updateValueAndValidity();
  }
  setValidatorsOnStatus(event) {
    this.clearAllValidator();
    if (event === '84' || event === '85' ) {
      this.reportingMessageDetailsSection.get('claimReference').setValidators([Validators.required]);
      this.reportingMessageDetailsSection.get('claimPresentDate').setValidators([Validators.required]);
      this.reportingMessageDetailsSection.get('claimAmt').setValidators([Validators.required]);
      this.reportingMessageDetailsSection.updateValueAndValidity();
  } else if (event === '12') {
    this.reportingMessageDetailsSection.get('tnxAmt').setValidators([Validators.required]);
    this.reportingMessageDetailsSection.get('boComment').setValidators([Validators.required]);
    this.reportingMessageDetailsSection.get('docRefNo').setValidators([Validators.maxLength(Constants.LENGTH_16),
      validateSwiftCharSet(Constants.X_CHAR)]);
    this.reportingMessageDetailsSection.updateValueAndValidity();
  } else if (event === '24' || event === '26') {
    this.reportingMessageDetailsSection.get('tnxAmt').setValidators([Validators.required]);
    this.reportingMessageDetailsSection.get('docRefNo').setValidators([Validators.maxLength(Constants.LENGTH_16),
      validateSwiftCharSet(Constants.X_CHAR)]);
    this.reportingMessageDetailsSection.updateValueAndValidity();
  } else if (event === '05' || event === '13' || event === '14' || event === '15' || event === '04') {
    this.reportingMessageDetailsSection.get('tnxAmt').setValidators([Validators.required]);
  } else if (event === '07') {
    this.reportingMessageDetailsSection.get('boComment').setValidators([Validators.required]);
  } else if (event === '08' || event === '31') {
    this.reportingMessageDetailsSection.get('bgAmdDate').setValidators([Validators.required]);
    this.reportingMessageDetailsSection.updateValueAndValidity();
  }
    if (this.enableResponseDate) {
    this.setValidatorResponseDate();
  }
}
 clearAllValidator() {
  this.reportingMessageDetailsSection.controls.claimReference.clearValidators();
  this.reportingMessageDetailsSection.controls.claimPresentDate.clearValidators();
  this.reportingMessageDetailsSection.controls.claimAmt.clearValidators();
  this.reportingMessageDetailsSection.controls.claimReference.updateValueAndValidity();
  this.reportingMessageDetailsSection.controls.claimPresentDate.updateValueAndValidity();
  this.reportingMessageDetailsSection.controls.claimAmt.updateValueAndValidity();
  this.reportingMessageDetailsSection.controls.tnxAmt.clearValidators();
  this.reportingMessageDetailsSection.controls.tnxAmt.updateValueAndValidity();
  this.reportingMessageDetailsSection.controls.tnxAmtCurCode.clearValidators();
  this.reportingMessageDetailsSection.controls.tnxAmtCurCode.updateValueAndValidity();
  this.reportingMessageDetailsSection.controls.boComment.clearValidators();
  this.reportingMessageDetailsSection.controls.boComment.updateValueAndValidity();
  this.reportingMessageDetailsSection.controls.docRefNo.clearValidators();
  this.reportingMessageDetailsSection.controls.docRefNo.updateValueAndValidity();
  this.reportingMessageDetailsSection.controls.latestResponseDate.clearValidators();
  this.reportingMessageDetailsSection.controls.latestResponseDate.updateValueAndValidity();
  this.reportingMessageDetailsSection.controls.bgAmdDate.clearValidators();
  this.reportingMessageDetailsSection.controls.bgAmdDate.updateValueAndValidity();
  this.reportingMessageDetailsSection.updateValueAndValidity();
  this.reportingMessageDetailsSection.get('claimReference').setValue('');
  this.reportingMessageDetailsSection.get('claimAmt').setValue('');
  this.reportingMessageDetailsSection.get('tnxAmt').setValue('');
  this.reportingMessageDetailsSection.get('boComment').setValue('');
  this.reportingMessageDetailsSection.get('docRefNo').setValue('');
  this.reportingMessageDetailsSection.get('latestResponseDate').setValue('');
  this.reportingMessageDetailsSection.get('claimPresentDate').setValue('');
  this.reportingMessageDetailsSection.get('bgAmdDate').setValue('');
 }
setValidatorOnAdviseDate() {
  this.reportingMessageDetailsSection.get('adviseDate').clearValidators();
  this.reportingMessageDetailsSection.get('adviseDate').setValidators([
  validateDate(this.reportingMessageDetailsSection.get('adviseDate').value,
  this.currentDate,
  Constants.ADVISE_DATE, Constants.APPLICATION_DATE, Constants.GREATER_THAN),
  validateDate(this.reportingMessageDetailsSection.get('adviseDate').value,
  this.bgRecord.adviseDate,
  Constants.ADVISE_DATE, Constants.APPLICATION_DATE, Constants.LESSER_THAN)]);
  this.reportingMessageDetailsSection.get('adviseDate').updateValueAndValidity();
  this.adviseDate.emit(this.reportingMessageDetailsSection.get('adviseDate').value);
}
setValidatorAmendDate() {
  this.reportingMessageDetailsSection.get('bgAmdDate').clearValidators();
  this.reportingMessageDetailsSection.get('bgAmdDate').setValidators([Validators.required,
    validateDateWithDateRange(this.reportingMessageDetailsSection.get('bgAmdDate').value,
      this.bgRecord.issDate, this.currentDate,
    Constants.AMEND_DATE, Constants.ISSUANCE_DATE, Constants.CURRENT_DATE )]);
  this.reportingMessageDetailsSection.get('bgAmdDate').updateValueAndValidity();
}
setValidatorMaturityDate() {
  let date;
  date = Constants.MATURITY_DATE;
  if (this.isExistingUnsignedMode) {
   if (this.bgRecord.prodStatCode === '05' || this.bgRecord.prodStatCode === '13') {
    date = Constants.SETTLEMENT_DATE;
  } else if (this.bgRecord.prodStatCode === '14' || this.bgRecord.prodStatCode === '15') {
    date =  Constants.PAYMENT_DATE;
  }
  } else {
  if (this.commonData.getProdStatCode() === '05' || this.commonData.getProdStatCode() === '13') {
    date = Constants.SETTLEMENT_DATE;
  } else if (this.commonData.getProdStatCode() === '14' || this.commonData.getProdStatCode() === '15') {
    date =  Constants.PAYMENT_DATE;
  }
  }
  this.reportingMessageDetailsSection.get('maturityDate').clearValidators();
  this.reportingMessageDetailsSection.get('maturityDate').setValidators([
    validateDateLessWithCurrentDate(date, this.currentDate, false)]);
  this.reportingMessageDetailsSection.get('maturityDate').updateValueAndValidity();
}
setValidatorResponseDate() {
  let bgExpDate ;
  const date =  Constants.LATEST_RESPONSE_DATE;
  if (this.commonData.getProductCode() === 'BG') {
    bgExpDate = (this.reportingMessageDetailsSection.parent &&
      this.reportingMessageDetailsSection.parent.get('undertakingGeneralDetailsSection').get('bgExpDate')
      && this.reportingMessageDetailsSection.parent.get('undertakingGeneralDetailsSection').get('bgExpDate').value != null &&
      this.reportingMessageDetailsSection.parent.get('undertakingGeneralDetailsSection').get('bgExpDate').value !== '') ?
      this.reportingMessageDetailsSection.parent.get('undertakingGeneralDetailsSection').get('bgExpDate').value : this.bgRecord.bgExpDate;
  } else if (this.commonData.getProductCode() === 'BR') {
    bgExpDate = (this.reportingMessageDetailsSection.parent &&
    this.reportingMessageDetailsSection.parent.get('ruGeneraldetailsSection').get('expDate') &&
    this.reportingMessageDetailsSection.parent.get('ruGeneraldetailsSection').get('expDate').value !== null &&
    this.reportingMessageDetailsSection.parent.get('ruGeneraldetailsSection').get('expDate').value !== '') ?
     this.reportingMessageDetailsSection.parent.get('ruGeneraldetailsSection').get('expDate').value : this.bgRecord.expDate;
  }
  this.reportingMessageDetailsSection.get('latestResponseDate').clearValidators();
  this.reportingMessageDetailsSection.get('latestResponseDate').setValidators([
    validateDateLessWithCurrentDate(date, this.currentDate, false),
  validateDate(this.reportingMessageDetailsSection.get('latestResponseDate').value,
    bgExpDate,
    this.responseDateType, this.expiryDateType, Constants.GREATER_THAN)]);
  this.reportingMessageDetailsSection.get('latestResponseDate').updateValueAndValidity();
}
setValidatorUnsignedIssueDate() {
  this.reportingMessageDetailsSection.get('issDate').clearValidators();
  this.reportingMessageDetailsSection.get('issDate').setValidators([validateDateGreaterThanCurrentDate(this.currentDate,
    true), validateDate(this.reportingMessageDetailsSection.get('issDate').value, this.bgRecord.applDate,
    Constants.ISSUE_DATE, Constants.APPLICATION_DATE, Constants.LESSER_THAN)]);
  this.reportingMessageDetailsSection.get('issDate').updateValueAndValidity();
}
setValidatorUnsignedAmendDate() {
  this.reportingMessageDetailsSection.get('bgAmdDate').clearValidators();
  this.reportingMessageDetailsSection.get('bgAmdDate').setValidators([validateDateGreaterThanCurrentDate(this.currentDate,
    true), validateDate(this.reportingMessageDetailsSection.get('bgAmdDate').value, this.bgRecord.applDate,
    Constants.AMEND_DATE, Constants.APPLICATION_DATE, Constants.LESSER_THAN)]);
  this.reportingMessageDetailsSection.get('bgAmdDate').updateValueAndValidity();
}
setEventMessage(event) {
    let dialogHeader = '';
    this.translate.get('WARNING_TITLE').subscribe((value: string) => {
      dialogHeader = value;
    });
    const confirmationMessage = this.tradeCommonDataService.getConfirmationEventMessage(event);
    this.confirmationService.confirm({
      message: confirmationMessage,
      header: dialogHeader,
      icon: ReportingMessageDetailsComponent.CONFIRMATION_ICON,
      rejectVisible: false,
      key: 'resetWarningMsg',
      acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
      accept: () => {},
      });
}
setUnsignedDateFieldEditable() {
  this.reportingMessageDetailsSection.clearValidators();
  const maturityDateProdStatCode = ['05', '04', '12', '13', '26', '24', '14', '15'];
  if (this.bgRecord.prodStatCode === '08' || this.bgRecord.prodStatCode === '31') {
    this.enableAmendDate = true;
    this.reportingMessageDetailsSection.get('bgAmdDate').setValue(this.bgRecord.bgAmdDate);
    this.setValidatorAmendDate();
  } else if (this.bgRecord.prodStatCode === '84' || this.bgRecord.prodStatCode === '85') {
    this.enableClaimDate = true;
    this.reportingMessageDetailsSection.get('claimPresentDate').setValue(this.bgRecord.claimPresentDate);
    this.validateClaimPresentationDate();
  } else if (maturityDateProdStatCode.includes(this.bgRecord.prodStatCode)) {
    this.enableMaturityDate = true;
    this.reportingMessageDetailsSection.get('maturityDate').setValue(this.bgRecord.maturityDate);
    this.setValidatorMaturityDate();
  }
  this.reportingMessageDetailsSection.updateValueAndValidity();
}
setUnsignedDateFieldEditableForRuUnsigned() {
  this.reportingMessageDetailsSection.clearValidators();
  this.reportingMessageDetailsSection.get('adviseDate').setValidators([Validators.required]);
  this.setValidatorOnAdviseDate();
}
hasFieldValue(field): boolean {
  if (this.reportingMessageDetailsSection.get(field) &&
  this.reportingMessageDetailsSection.get(field).value !== null &&
  this.reportingMessageDetailsSection.get(field).value !== '') {
    return true;
  } else {
    return false;
  }
}
clearFieldValue(field) {
  this.reportingMessageDetailsSection.get(field).setValue('');
 }
onSelectWordingDecision() {
  if (this.provisionalStatCode === this.reportingMessageDetailsSection.get('provisionalProdStatCode').value) {
    this.reportingMessageDetailsSection.get('provisionalProdStatCode').setValue('');
    this.onProdStatChangeMsgToBank();
  }
  if (this.reportingMessageDetailsSection.get('provisionalProdStatCode') &&
this.reportingMessageDetailsSection.get('provisionalProdStatCode').value !== null &&
this.reportingMessageDetailsSection.get('provisionalProdStatCode').value !== '') {
this.provisionalStatCode = this.reportingMessageDetailsSection.get('provisionalProdStatCode').value;
this.prodStatus.emit(this.reportingMessageDetailsSection.get('provisionalProdStatCode').value);
this.setActionWordingDecision();
this.setWordingAcceptedIssueDate('');
}
 }
setActionWordingDecision() {
  this.actionRequiredClear = false;
  this.enableActionRequired = true;
  this.enableComment = true;
  this.actionReqObj = this.tradeCommonDataService.getBankActionReqCode('', '78');
}
setWordingAcceptedIssueDate(prodStatCode) {
  if (prodStatCode === '03') {
  this.enableIssueDate = true;
  this.reportingMessageDetailsSection.get(`issDate`).setValidators([Validators.required]);
  this.reportingMessageDetailsSection.get(`issDate`).setValue(this.currentDate);
  } else {
    this.enableIssueDate = false;
    this.reportingMessageDetailsSection.get(`issDate`).clearValidators();
    this.reportingMessageDetailsSection.get(`issDate`).setValue('');
  }
  this.reportingMessageDetailsSection.get(`issDate`).updateValueAndValidity();
}
}
