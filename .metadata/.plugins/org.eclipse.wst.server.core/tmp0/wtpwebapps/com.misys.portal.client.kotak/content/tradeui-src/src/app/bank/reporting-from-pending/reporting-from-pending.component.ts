import { BankInstructionsComponent } from './../../trade/iu/initiation/components/bank-instructions/bank-instructions.component';
import { ResponseService } from './../../common/services/response.service';
import { TradeCommonDataService } from './../../trade/common/services/trade-common-data.service';
import { validateWithCurrentDate } from '../../common/validators/common-validator';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { ActionsComponent } from '../../common/components/actions/actions.component';
import { ReauthDialogComponent } from '../../common/components/reauth-dialog/reauth-dialog.component';
import { IUCommonAmountDetailsComponent } from '../../trade/iu/common/components/amount-details/amount-details.component';
import {
  IUCommonApplicantDetailsComponent
} from '../../trade/iu/common/components/applicant-details-form/applicant-details-form.component';
import { IUCommonLicenseComponent } from '../../trade/iu/common/components/license/license.component';
import { IUCommonReturnCommentsComponent } from '../../trade/iu/common/components/return-comments/return-comments.component';
import { IssuedUndertakingRequest } from '../../trade/iu/common/model/IssuedUndertakingRequest';
import { ReceivedUndertakingRequest } from '../../trade/ru/common/model/ReceivedUndertakingRequest';
import { RUService } from '../../trade/ru/service/ru.service';
import { BankDetailsComponent } from '../../trade/iu/initiation/components/bank-details/bank-details.component';
import { ContractDetailsComponent } from '../../trade/iu/initiation/components/contract-details/contract-details.component';
import { IUGeneralDetailsComponent } from '../../trade/iu/initiation/components/iu-general-details/iu-general-details.component';
import { CuAmountDetailsComponent } from '../../trade/iu/initiation/components/cu-amount-details/cu-amount-details.component';
import { ReductionIncreaseComponent } from '../../trade/iu/initiation/components/reduction-increase/reduction-increase.component';
import {
  CuBeneficiaryDetailsComponent
} from '../../trade/iu/initiation/components/cu-beneficiary-details/cu-beneficiary-details.component';
import { CuGeneralDetailsComponent } from '../../trade/iu/initiation/components/cu-general-details/cu-general-details.component';
import { CuRenewalDetailsComponent } from '../../trade/iu/initiation/components/cu-renewal-details/cu-renewal-details.component';
import { CuUndertakingDetailsComponent } from '../../trade/iu/initiation/components/cu-undertaking-details/cu-undertaking-details.component';
import { CuReductionIncreaseComponent } from '../../trade/iu/initiation/components/cu-reduction-increase/cu-reduction-increase.component';
import { RenewalDetailsComponent } from '../../trade/iu/initiation/components/renewal-details/renewal-details.component';
import { UndertakingDetailsComponent } from '../../trade/iu/initiation/components/undertaking-details/undertaking-details.component';
import { ReportingMessageDetailsComponent } from '../common/components/reporting-message-details/reporting-message-details.component';
import { FileUploadComponent } from './../../common/components/fileupload-component/fileupload.component';
import {
  InquiryConsolidatedChargesComponent
} from './../../common/components/inquiry-consolidated-charges/inquiry-consolidated-charges.component';
import { Constants } from './../../common/constants';
import { AuditService } from './../../common/services/audit.service';
import { CommonDataService } from './../../common/services/common-data.service';
import { CommonService } from './../../common/services/common.service';
import { GeneratePdfService } from './../../common/services/generate-pdf.service';
import { LicenseService } from './../../common/services/license.service';
import { IUService } from './../../trade/iu/common/service/iu.service';
import { IUCommonDataService } from './../../trade/iu/common/service/iuCommonData.service';
import { TransactionDetailsComponent } from './../common/components/transaction-details/transaction-details.component';
import { UndertakingGeneralDetailsComponent } from '../../trade/iu/initiation/components/iu-undertaking-general-details/iu-undertaking-general-details.component';
import { CuBankDetailsComponent } from '../../trade/iu/initiation/components/cu-bank-details/cu-bank-details.component';
import { URLConstants } from './../../common/urlConstants';
import { IUCommonBeneficiaryDetailsComponent } from '../../trade/iu/common/components/beneficiary-details-form/beneficiary-details-form.component';
import { ShipmentDetailsComponent } from '../../trade/iu/initiation/components/shipment-details/shipment-details.component';
import { BankApplicantBeneDetailsComponent } from '../trade/ru/initiation/components/bank-applicant-bene-details/bank-applicant-bene-details.component';
import { MessageDetailsComponent } from '../common/components/message-details/message-details.component';
import $ from 'jquery';
import { BankRuGeneralDetailsComponent } from '../trade/ru/initiation/components/bank-ru-general-details/bank-ru-general-details.component';
import { IuPaymentDetailsComponent } from '../../trade/iu/initiation/components/iu-payment-details/iu-payment-details.component';
import { BankRuBankDetailsComponent } from '../trade/ru/initiation/components/bank-ru-bank-details/bank-ru-bank-details.component';
import { CuPaymentDetailsComponent } from '../../trade/iu/initiation/components/cu-payment-details/cu-payment-details.component';
import { CourierDetailsComponent } from './../../common/components/courier-details/courier-details.component';

const jqueryConst = $;

@Component({
  selector: 'fcc-bank-reporting-from-pending',
  templateUrl: './reporting-from-pending.component.html',
  styleUrls: ['./reporting-from-pending.component.scss']
})
export class ReportingFromPendingComponent implements OnInit {

  inititationForm: UntypedFormGroup;
  rawValuesForm: UntypedFormGroup;
  issuedundertaking: IssuedUndertakingRequest;
  receivedUndertaking: ReceivedUndertakingRequest;
  contextPath: string;
  actionCode: string;
  finalRenewalExpDate: string;
  cuFinalRenewalExpDate: string;
  cuExpDate: string;
  expDate: string;
  responseMessage: object;
  public bankDetails: string[] = [];
  public jsonContent;
  public showForm = true;
  public viewMode = false;
  public submitted = false;
  public luStatus = false;
  public displayDepuFlag = false;
  public facilityVisible = false;
  public entitySelected: string;
  moTnxDetailsDisplayStatus = true;
  public errorTitle: string;
  public tnxType;
  public displayErrorDialog = false;
  public errorMessage: string;
  public enableReauthPopup = false;
  public operation: string;
  public mode: string;
  public speciman: string;
  public documentId: string;
  public stylesheetname: string;
  public textTypeStandard: string;
  public invalidValue: string;
  private licenseValidError: string;
  public isNotProcessed = false;
  isSubmitEnabled = false;
  currencyDecimalMap = new Map<string, number>();
  hasCustomerAttach = false;
  hasBankAttach = false;
  viewRefId: string;
  viewTnxId: string;
  option: string;
  isFormInvalid: boolean;
  sectionName: string[] = [];

  @ViewChild(UndertakingGeneralDetailsComponent)
  undertakingGeneralDetailsChildComponent: UndertakingGeneralDetailsComponent;
  @ViewChild(IUGeneralDetailsComponent) iuGeneraldetailsChildComponent: IUGeneralDetailsComponent;
  @ViewChild(CuGeneralDetailsComponent) cuGeneraldetailsChildComponent: CuGeneralDetailsComponent;
  @ViewChild(CuBeneficiaryDetailsComponent) cuBeneficaryDetailsChildComponent: CuBeneficiaryDetailsComponent;
  @ViewChild(CuAmountDetailsComponent) cuAmountDetailsChildComponent: CuAmountDetailsComponent;
  @ViewChild(CuRenewalDetailsComponent) cuRenewalDetailsChildComponent: CuRenewalDetailsComponent;
  @ViewChild(CuReductionIncreaseComponent) cuReductionIncreaseComponent: CuReductionIncreaseComponent;
  @ViewChild(CuBankDetailsComponent) cuBankDetailsChildComponent: CuBankDetailsComponent;
  @ViewChild(CuUndertakingDetailsComponent) cuUndertakingChildComponent: CuUndertakingDetailsComponent;
  @ViewChild(IUCommonAmountDetailsComponent) amountDetailsChildComponent: IUCommonAmountDetailsComponent;
  @ViewChild(BankDetailsComponent) bankDetailsComponent: BankDetailsComponent;
  @ViewChild(ReauthDialogComponent) reauthDialogComponent: ReauthDialogComponent;
  @ViewChild(RenewalDetailsComponent) renewalDetailsComponent: RenewalDetailsComponent;
  @ViewChild(ReductionIncreaseComponent) iuReductionIncreaseComponent: ReductionIncreaseComponent;
  @ViewChild(IUCommonApplicantDetailsComponent) applicantDetailsComponent: IUCommonApplicantDetailsComponent;
  @ViewChild(ContractDetailsComponent) contractDetailsComponent: ContractDetailsComponent;
  @ViewChild(UndertakingDetailsComponent) undertakingChildComponent: UndertakingDetailsComponent;
  @ViewChild(BankInstructionsComponent) bankInstructionsComponent: BankInstructionsComponent;
  @ViewChild(IUCommonLicenseComponent) iuLicenseComponent: IUCommonLicenseComponent;
  @ViewChild(ActionsComponent) actionsComponent: ActionsComponent;
  @ViewChild(IUCommonReturnCommentsComponent) iuCommonReturnCommentsComponent: IUCommonReturnCommentsComponent;
  @ViewChild(ReportingMessageDetailsComponent) reportingMessageDetailsChildComponent: ReportingMessageDetailsComponent;
  @ViewChild(TransactionDetailsComponent) transactionDetailsChildComponent: TransactionDetailsComponent;
  @ViewChild(FileUploadComponent) fileUploadComponent: FileUploadComponent;
  @ViewChild(CourierDetailsComponent) courierDetailsComponent: CourierDetailsComponent;
  @ViewChild(InquiryConsolidatedChargesComponent)
  inquiryConsolidatedChargesComponent: InquiryConsolidatedChargesComponent;
  @ViewChild(IUCommonBeneficiaryDetailsComponent) beneficiaryDetailsComponent: IUCommonBeneficiaryDetailsComponent;
  @ViewChild(IuPaymentDetailsComponent) iuPaymentDetailsComponent: IuPaymentDetailsComponent;
  @ViewChild(CuPaymentDetailsComponent) cuPaymentDetailsComponent: CuPaymentDetailsComponent;
  @ViewChild(ShipmentDetailsComponent) shipmentDetailsComponent: ShipmentDetailsComponent;
  @ViewChild(BankApplicantBeneDetailsComponent) bankApplicantBeneDetailsComponent: BankApplicantBeneDetailsComponent;
  @ViewChild(MessageDetailsComponent) messageDetailsComponent: MessageDetailsComponent;
  @ViewChild(BankRuGeneralDetailsComponent) bankRuGeneralDetailsComponent: BankRuGeneralDetailsComponent;
  @ViewChild(BankRuBankDetailsComponent) ruBankDetailsComponent: BankRuBankDetailsComponent;

  constructor(
    public fb: UntypedFormBuilder, public iuService: IUService, public ruService: RUService,
    public licenseService: LicenseService,
    public commonService: CommonService, public commonDataService: IUCommonDataService,
    public confirmationService: ConfirmationService, public translate: TranslateService,
    public router: Router, public activatedRoute: ActivatedRoute,
    public commonData: CommonDataService,
    public datePipe: DatePipe, public auditService: AuditService,
    public generatePdfService: GeneratePdfService, public el: ElementRef,
    public readonly tradeServices: TradeCommonDataService, protected responseService: ResponseService) { }

  ngOnInit() {
    this.contextPath = window[Constants.CONTEXT_PATH];
    this.actionCode = window[Constants.ACTION_CODE];
    let mode;
    let masterOrTnx;
    let templateid;
    let subproductcode;
    this.activatedRoute.params.subscribe(paramsId => {
      this.viewMode = paramsId.viewMode;
      this.viewRefId = paramsId.refId;
      this.viewTnxId = paramsId.tnxId;
      mode = paramsId.mode;
      this.mode = mode;
      this.tnxType = paramsId.tnxType;
      this.option = paramsId.option;
      masterOrTnx = paramsId.masterOrTnx;
      templateid = paramsId.templateid;
      subproductcode = paramsId.subproductcode;
    });
    if (mode === Constants.MODE_RELEASE && this.commonData.getOperation() !== Constants.TASKS_MONITORING) {
    this.commonData.setOperation(Constants.OPERATION_CREATE_RELEASEREJECT_REPORTING);
    } else if (this.commonData.getOperation() !== Constants.TASKS_MONITORING) {
    this.commonData.setOperation(Constants.OPERATION_CREATE_REPORTING);
    }
    if (this.viewMode) {
      this.commonDataService.setDisplayMode(Constants.MODE_VIEW);
      this.commonData.setDisplayMode(Constants.MODE_VIEW);
      if (masterOrTnx === 'tnx') {
        this.getTnxDetails();
        this.commonService.getBankDetails().subscribe(data => {
          this.bankDetails = data as string[];
        });
      } else if (masterOrTnx === 'master') {
        this.commonDataService.setDisplayMode(Constants.MODE_VIEW);
        this.getMasterDetails();
      }
    } else if (this.commonData.getOption() === Constants.SCRATCH || this.commonData.getMode() === Constants.MODE_DRAFT) {
      this.getTnxDetailsforDraft();
    }
    this.currencyDecimalMap = this.commonService.getCurrencyDecimalMap();

    this.commonService.getTnxDetails(this.viewRefId, this.viewTnxId, this.commonData.getProductCode(), this.actionCode)
      .subscribe(data => {
        this.jsonContent = data.transactionDetails as string[];
        if (this.jsonContent.facilityId || this.jsonContent.facilityDate !== null) {
          this.facilityVisible = true;
        }
      });
    this.createMainForm();
  }

  getTnxDetailsforDraft() {
      this.commonDataService.setRefId(this.viewRefId);
      this.commonDataService.setTnxId(this.viewTnxId);
      this.commonData.setRefId(this.viewRefId);
      this.commonData.setTnxId(this.viewTnxId);
      this.commonDataService.setMode(Constants.MODE_DRAFT);
      this.commonService.getTnxDetails(this.viewRefId, this.viewTnxId, this.commonData.getProductCode(), this.actionCode)
      .subscribe(data => {
        this.jsonContent = data.transactionDetails as string[];
        this.commonData.disableTnx = (this.jsonContent[`tnxTypeCode`] === Constants.TYPE_INQUIRE &&
         this.jsonContent[`subTnxTypeCode`] !== '88' && this.jsonContent[`subTnxTypeCode`] !== '89');
        if (this.commonData.disableTnx) {
        this.sectionName.forEach(value => {
                this.disableTnxDetails(value);
          });
        }
        this.isSubmitEnabled = ((this.commonData.getMode() === Constants.MODE_DRAFT) &&
                                (this.jsonContent.prodStatCode !== Constants.CODE_02));
        if ( this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
        ((this.jsonContent.guaranteeTypeName != null && this.jsonContent.guaranteeTypeName !== '') &&
        (this.jsonContent.guaranteeTypeCompanyId != null && this.jsonContent.guaranteeTypeCompanyId !== ''))) {
          this.commonDataService.setBankTemplateData(this.jsonContent);
        }
        this.commonDataService.setViewComments(true);
        if (this.jsonContent.purpose != null && (this.jsonContent.purpose === '02' || this.jsonContent.purpose === '03')) {
          this.commonDataService.setLUStatus(true);
          this.luStatus = true;
        }
      });
  }
  getMasterDetails() {
      this.commonService.getMasterDetails(this.viewRefId, this.commonData.getProductCode(), '').subscribe(data => {
      this.jsonContent = data.masterDetails as string[];
      this.commonDataService.setmasterorTnx('master');
      this.commonDataService.setOption(this.option);
      if (this.jsonContent.attachments && this.jsonContent.attachments.attachment !== '') {
        this.hasCustomerAttach = this.jsonContent.attachments.attachment.some(item => item.type === '01');
        this.hasBankAttach = this.jsonContent.attachments.attachment.some(item => item.type === '02');
      }
      if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
        this.commonDataService.setLUStatus(true);
        this.luStatus = true;
      }
    });
  }
  getTnxDetails() {
      this.commonService.getTnxDetails(this.viewRefId, this.viewTnxId, this.commonData.getProductCode(), '').subscribe(data => {
      this.jsonContent = data.transactionDetails as string[];
      this.commonDataService.setOption(this.option);
      if (this.jsonContent.attachments && this.jsonContent.attachments.attachment !== '') {
        this.hasCustomerAttach = this.jsonContent.attachments.attachment.some(item => item.type === '01');
        this.hasBankAttach = this.jsonContent.attachments.attachment.some(item => item.type === '02');
      }
      if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU &&
      ((this.jsonContent.guaranteeTypeName != null && this.jsonContent.guaranteeTypeName !== '') &&
        (this.jsonContent.guaranteeTypeCompanyId != null && this.jsonContent.guaranteeTypeCompanyId !== ''))) {
          this.commonDataService.setBankTemplateData(this.jsonContent);
        }
      this.isSubmitEnabled = (this.commonDataService.getMode() === Constants.MODE_RELEASE);
      this.commonData.disableTnx = (this.jsonContent[`tnxTypeCode`] === Constants.TYPE_INQUIRE &&
      this.option === Constants.OPTION_SUMMARY);
      if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
        this.commonDataService.setLUStatus(true);
        this.luStatus = true;
      }
    });
  }
  createMainForm() {
    return this.inititationForm = this.fb.group({});
  }

  disableTnxDetails(controlName: string) {
    const skipControl = [Constants.SECTION_REPORTING_MESSGE_DETAILS, Constants.SECTION_FILE_UPLOAD, Constants.SECTION_CHARGES,
      Constants.SECTION_COURIER_DETAILS];
    if (this.inititationForm.get(controlName) && !(skipControl.includes(controlName))) {
      this.inititationForm.get(controlName).disable();
    }
  }
  /**
   * After a form is initialized, we link it to our main form
   */
  addToForm(name: string, form: UntypedFormGroup) {
    this.inititationForm.setControl(name, form);
    if (name === Constants.SECTION_RU_APPLICANT_BEN_DETAILS) {
      this.inititationForm.setControl(Constants.SECTION_ALT_APPLICANT_DETAILS,
      this.inititationForm.get(Constants.SECTION_RU_APPLICANT_BEN_DETAILS).get(Constants.SECTION_ALT_APPLICANT_DETAILS));
    }
    this.sectionName.push(name);
    if (this.commonData.disableTnx) {
      this.disableTnxDetails(name);
    }
  }
  onSubmit() {
    if (this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('prodStatCode').value === '01' ||
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('prodStatCode').value === '04' ||
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('prodStatCode').value === '03' ||
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('prodStatCode').value === '08' ||
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('prodStatCode').value === '07' ) {
    this.actionsComponent.showProgressBar = true;
    this.showForm = false;
    this.submitted = true;
    if (this.commonData.getMode() === Constants.MODE_DRAFT && this.inquiryConsolidatedChargesComponent.charges.length !== 0) {
      this.inquiryConsolidatedChargesComponent.charges.forEach(charge => {
        charge.createdInSession = 'Y';
      });
    }
    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
    this.iuService.saveOrSubmitIU(this.contextPath + URLConstants.IU_SUBMIT,
      this.issuedundertaking).subscribe(
        data => {
          // If Reauth is enabled and if Reauth is failed , then we are showing Alert Pop up for Failure
          // else set Response data and navigate the page
          if (this.enableReauthPopup && data.response === Constants.RESPONSE_REAUTH_FAILURE) {
            this.actionsComponent.showProgressBar = false;
            this.reauthDialogComponent.onReauthSubmitCompletion(data.response);
          } else {
            this.commonService.setResponseData(data);
            this.router.navigate(['submitOrSave']);
          }
        }
      );
    } else if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
      this.ruService.saveOrSubmitRU(this.contextPath + URLConstants.RU_SUBMIT,
        this.receivedUndertaking).subscribe(
          data => {
            // If Reauth is enabled and if Reauth is failed , then we are showing Alert Pop up for Failure
            // else set Response data and navigate the page
            if (this.enableReauthPopup && data.response === Constants.RESPONSE_REAUTH_FAILURE) {
              this.actionsComponent.showProgressBar = false;
              this.reauthDialogComponent.onReauthSubmitCompletion(data.response);
            } else {
              this.commonService.setResponseData(data);
              this.router.navigate(['submitOrSave']);
            }
          }
        );
    }
  } else {
     // Display error message
     this.displayErrorDialog = true;
     this.translate.get('ERROR_TITLE').subscribe((value: string) => {
       this.errorTitle = value;
     });
     this.translate.get('MO_DECISION_ERROR').subscribe((value: string) => {
       this.errorMessage = value;
     });
  }
}

onSubmitRetrieveUnsigned() {
  this.actionsComponent.showProgressBar = true;
  this.showForm = false;
  this.submitted = true;
  if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
  this.iuService.submitFromRetrieveUnsigned(this.issuedundertaking).subscribe(
    data => {
      this.responseMessage = data.message;
      this.commonService.setResponseData(data);
      if (data.subTnxTypeCode && data.subTnxTypeCode !== null && data.subTnxTypeCode !== '' ) {
      this.responseService.setSubTnxType(data.subTnxTypeCode);
      }
      this.router.navigate(['submitOrSave']);
    }
  );
  } else if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
    this.ruService.submitFromRetrieveUnsigned(this.contextPath + URLConstants.RU_SUBMIT_UNSIGNED,
      this.receivedUndertaking).subscribe(
     data => {
        this.responseMessage = data.message;
        this.commonService.setResponseData(data);
        if (data.subTnxTypeCode && data.subTnxTypeCode !== null && data.subTnxTypeCode !== '' ) {
        this.responseService.setSubTnxType(data.subTnxTypeCode);
        }
        this.router.navigate(['submitOrSave']);
      }
    );
  }
}

onSubmitReleaseReject() {
  this.actionsComponent.showProgressBar = true;
  this.showForm = false;
  this.submitted = true;
  if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
  this.iuService.submitFromReleaseReject(this.issuedundertaking).subscribe(
    data => {
      this.responseMessage = data.message;
      this.commonService.setResponseData(data);
      if (data.subTnxTypeCode && data.subTnxTypeCode !== null && data.subTnxTypeCode !== '' ) {
      this.responseService.setSubTnxType(data.subTnxTypeCode);
      }
      this.router.navigate(['submitOrSave']);
    }
  );
  } else if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
    this.ruService.submitFromReleaseReject(this.contextPath + URLConstants.RU_SUBMIT_REJECT_RELEASE,
      this.receivedUndertaking).subscribe(
     data => {
        this.responseMessage = data.message;
        this.commonService.setResponseData(data);
        if (data.subTnxTypeCode && data.subTnxTypeCode !== null && data.subTnxTypeCode !== '' ) {
        this.responseService.setSubTnxType(data.subTnxTypeCode);
        }
        this.router.navigate(['submitOrSave']);
      }
    );
  }
}

  openPreview() {
    const myWindow = window.open(
      `ReportingPopup/?option=FULL&referenceid=${
      this.commonDataService.getRefId()}&tnxid=${this.commonDataService.getTnxId()}&productcode=${this.commonData.getProductCode()}`,
      Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }


  handleEvents(operation) {
    this.operation = operation;
    if (operation === Constants.OPERATION_SUBMIT && this.mode !== Constants.MODE_UNSIGNED && this.mode !== Constants.MODE_RELEASE) {
      this.handleSubmit();
    } else if (operation === Constants.OPERATION_SUBMIT && this.mode === Constants.MODE_UNSIGNED) {
      this.submitUnsigned();
    } else if (operation === Constants.OPERATION_SUBMIT && this.mode === Constants.MODE_RELEASE) {
      this.transformForReleaseMode();
      this.onSubmitReleaseReject();
    } else if (operation === Constants.OPERATION_SAVE) {
      this.onSave();
    } else if (operation === Constants.OPERATION_CANCEL) {
      this.onCancel();
    } else if (operation === Constants.OPERATION_PREVIEW) {
      this.openPreview();
    } else if (operation === Constants.OPERATION_EXPORT) {
      this.generatePdf();
    }

  }

  private handleSubmit() {
    if (!this.commonData.disableTnx &&
       this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('prodStatCode').value !== '01' ) {
      this.validateForm();
      if (!(this.commonData.isDecisionReject)) {
        this.validateLS();
      }
    }
    let issubmitAllowed = ((this.inititationForm.valid || this.commonData.disableTnx) && this.licenseValidError === undefined);
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('boComment').markAllAsTouched();
    if (this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('prodStatCode').value === '01' &&
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('boComment').invalid) {
      issubmitAllowed = false;
      this.setRejectFieldError(true, 'FIELD_ERROR');
    } else if (this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('prodStatCode').value === '01' ) {
       this.validateFormOnSaveOrReject('FIELD_ERROR');
       issubmitAllowed = !this.isFormInvalid;
    } else if (this.fileUploadComponent.fileUploadSection.get('bgSendAttachmentsBy').invalid) {
      issubmitAllowed = false;
      this.fileUploadComponent.fileUploadSection.get('bgSendAttachmentsBy').markAllAsTouched();
      this.setFieldError();
    } else if (this.fileUploadComponent.fileUploadSection.get('bgSendAttachmentsBy').value === 'OTHR'
    && this.fileUploadComponent.fileUploadSection.get('bgSendAttachmentsByOther').invalid) {
      issubmitAllowed = false;
      this.fileUploadComponent.fileUploadSection.get('bgSendAttachmentsByOther').markAllAsTouched();
      this.setFieldError();
    }
    if (issubmitAllowed) {
      if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
        this.transformToIssuedUndertaking();
        this.onSubmit();
      } else if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
        this.transformToReceivedUndertaking();
        this.onSubmit();
      }
    }
  }

  private submitUnsigned() {
    if ((this.inititationForm.controls.reportingMessageDetailsComponent.get('issDate') &&
    !this.inititationForm.controls.reportingMessageDetailsComponent.get('issDate').valid &&
      this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('prodStatCode').value !== '01') &&
      (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU)) {
      this.setFieldError();
    } else {
      this.transformForUnsignedMode();
      this.onSubmitRetrieveUnsigned();
    }
  }

  setFieldError() {
    let message = '';
    let dialogHeader = '';
    this.translate.get('ERROR_TITLE').subscribe((value: string) => {
      dialogHeader = value;
    });
    this.translate.get('FIELD_ERROR').subscribe((value: string) => {
      message = value;
    });

    this.confirmationService.confirm({
      message,
      header: dialogHeader,
      icon: Constants.TRIANGLE_ICON,
      key: 'fieldErrorDialog',
      rejectVisible: false,
      acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
      accept: () => {
        const formGroupInvalid = this.el.nativeElement.querySelectorAll('.ng-invalid');
        if (formGroupInvalid) {
          const target = jqueryConst('.ng-invalid:not(form):first');
          jqueryConst('html,body').animate({ scrollTop: (target.offset().top - Constants.NUMERIC_TWENTY) }, 'slow', () => {
            target.trigger('focus');
          });
        }
      }
    });
  }

  transformForUnsignedMode() {
    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.inititationForm.getRawValue());
    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
    this.issuedundertaking = new IssuedUndertakingRequest();
    this.issuedundertaking.refId = this.commonDataService.getRefId();
    this.issuedundertaking.tnxId = this.commonDataService.getTnxId();
    this.issuedundertaking.tnxTypeCode = this.jsonContent.tnxTypeCode;
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_REPORTING_MESSGE_DETAILS]);
  } else if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
    this.receivedUndertaking = new ReceivedUndertakingRequest();
    this.receivedUndertaking.refId = this.commonDataService.getRefId();
    this.receivedUndertaking.tnxId = this.commonDataService.getTnxId();
    this.receivedUndertaking.tnxTypeCode = this.jsonContent.tnxTypeCode;
    this.receivedUndertaking.merge(this.rawValuesForm[Constants.SECTION_REPORTING_MESSGE_DETAILS]);
  }
}

transformForReleaseMode() {
  this.rawValuesForm = new UntypedFormGroup({});
  Object.assign(this.rawValuesForm, this.inititationForm.getRawValue());
  if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
  this.issuedundertaking = new IssuedUndertakingRequest();
  this.issuedundertaking.refId = this.commonDataService.getRefId();
  this.issuedundertaking.tnxId = this.commonDataService.getTnxId();
  this.issuedundertaking.tnxTypeCode = this.jsonContent.tnxTypeCode;
  this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_REPORTING_MESSGE_DETAILS]);
  this.issuedundertaking.boRefId = this.commonDataService.getBORefId();
  this.issuedundertaking.attids = this.commonDataService.getAttIds();
} else if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
  this.receivedUndertaking = new ReceivedUndertakingRequest();
  this.receivedUndertaking.refId = this.commonDataService.getRefId();
  this.receivedUndertaking.tnxId = this.commonDataService.getTnxId();
  this.receivedUndertaking.tnxTypeCode = this.jsonContent.tnxTypeCode;
  this.receivedUndertaking.merge(this.rawValuesForm[Constants.SECTION_REPORTING_MESSGE_DETAILS]);
  this.receivedUndertaking.boRefId = this.commonDataService.getBORefId();
  this.receivedUndertaking.attids = this.commonDataService.getAttIds();
}
}

  transformToIssuedUndertaking() {
    // To fetch all control values i.e. including the fields which are disabled druing toggling
    this.rawValuesForm = new UntypedFormGroup({});
    this.inititationForm.setControl('altApplicantDetailsFormSection',
    this.inititationForm.get('ruApplicantBeneDetailsForm').get('altApplicantDetailsFormSection'));
    Object.assign(this.rawValuesForm, this.inititationForm.getRawValue());
    this.issuedundertaking = new IssuedUndertakingRequest();
    if (this.jsonContent.tnxTypeCode === '03' && this.commonData.getSubTnxTypeCode()) {
          this.issuedundertaking.subTnxTypeCode = this.commonData.getSubTnxTypeCode();
          this.issuedundertaking.tnxTypeCode = this.jsonContent.tnxTypeCode;
    } else {
      this.issuedundertaking.tnxTypeCode = this.jsonContent.tnxTypeCode;
      this.issuedundertaking.subTnxTypeCode = this.jsonContent.subTnxTypeCode;
    }

    this.issuedundertaking.prodStatCode =
      this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('prodStatCode').value;
    this.issuedundertaking.tnxId = this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].tnxId;
    if (this.rawValuesForm[Constants.SECTION_ALT_APPLICANT_DETAILS]) {
    this.rawValuesForm[Constants.SECTION_ALT_APPLICANT_DETAILS].forAccount = this.commonDataService.getCheckboxFlagValues(
      this.rawValuesForm[Constants.SECTION_ALT_APPLICANT_DETAILS].forAccount);
    }
    this.rawValuesForm[Constants.SECTION_AMOUNT_DETAILS].bgConsortium = this.commonDataService.getCheckboxFlagValues(
      this.rawValuesForm[Constants.SECTION_AMOUNT_DETAILS].bgConsortium);
    this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].bgTransferIndicator = this.commonDataService.getCheckboxFlagValues(
      this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].bgTransferIndicator);
    if (this.commonDataService.getExpDateType() === '02') {
      this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgRenewFlag = this.commonDataService.getCheckboxFlagValues(
        this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgRenewFlag);
      this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgAdviseRenewalFlag = this.commonDataService.getCheckboxFlagValues(
        this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgAdviseRenewalFlag);
      this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgRollingRenewalFlag = this.commonDataService.getCheckboxFlagValues(
        this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgRollingRenewalFlag);
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS]);
    }
    this.rawValuesForm[Constants.SECTION_BANK_DETAILS].leadBankFlag = this.commonDataService.getCheckboxFlagValues(
      this.rawValuesForm[Constants.SECTION_BANK_DETAILS].leadBankFlag);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_TRANSACTION_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_REPORTING_MESSGE_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_RU_APPLICANT_BEN_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_ALT_APPLICANT_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_BENEFICIARY_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_UNDERTAKING_GENERAL_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_AMOUNT_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_UNDERTAKING_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CONTRACT_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_BANK_INSTR]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS]);
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_BANK_INSTR]);
    this.issuedundertaking.provisionalStatus = this.commonDataService
      .getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].provisionalStatus);
    if (this.commonDataService.getSubProdCode() === Constants.STAND_BY) {
      this.issuedundertaking.bgCrAvlByCode = this.rawValuesForm[Constants.SECTION_PAYMENT_DETAILS].bgCrAvlByCode;
      this.issuedundertaking.mergeCreditAvlWithBankDetails(this.rawValuesForm[Constants.SECTION_PAYMENT_DETAILS],
        'bg', this.commonDataService);
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_SHIPMENT_DETAILS]);
    }
    if (this.inititationForm.get(Constants.SECTION_INCR_DECR).get(`bgVariationType`).value) {
      this.issuedundertaking.mergeVariationDetails(this.rawValuesForm[Constants.SECTION_INCR_DECR], this.commonDataService);
    }
    this.issuedundertaking.mergeBankDetailsSection(this.rawValuesForm[Constants.SECTION_BANK_DETAILS], this.commonDataService);
    if (this.rawValuesForm[Constants.SECTION_LICENSE].listOfLicenses !== '') {
      this.issuedundertaking.mergeLicensesSection(this.rawValuesForm[Constants.SECTION_LICENSE]);
    }
    if (this.rawValuesForm[Constants.SECTION_CHARGES].listOfCharges !== '') {
      this.issuedundertaking.mergeChargesSection(this.rawValuesForm[Constants.SECTION_CHARGES]);
    }
    if (this.commonDataService.getCUSubProdCode() === Constants.STAND_BY) {
      this.issuedundertaking.cuCrAvlByCode = this.rawValuesForm[Constants.SECTION_CU_PAYMENT_DETAILS].cuCrAvlByCode;
      this.issuedundertaking.mergeCreditAvlWithBankDetails(this.rawValuesForm[Constants.SECTION_CU_PAYMENT_DETAILS],
                                                          'cu', this.commonDataService);
    }
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_FILE_UPLOAD]);
    if (this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].purpose &&
    (Constants.cuPurposeList.includes(this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].purpose))) {
      this.rawValuesForm[Constants.SECTION_CU_AMOUNT_DETAILS].cuConsortium = this.commonDataService.getCheckboxFlagValues(
        this.rawValuesForm[Constants.SECTION_CU_AMOUNT_DETAILS].cuConsortium);
      this.rawValuesForm[Constants.SECTION_CU_GENERAL_DETAILS].cuTransferIndicator = this.commonDataService.getCheckboxFlagValues(
        this.rawValuesForm[Constants.SECTION_CU_GENERAL_DETAILS].cuTransferIndicator);
      if (this.commonDataService.getCUExpDateType() === '02') {
          this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuRenewFlag =
            this.commonDataService.getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuRenewFlag);
          this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuAdviseRenewalFlag =
            this.commonDataService.getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuAdviseRenewalFlag);
          this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuRollingRenewalFlag =
            this.commonDataService.getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuRollingRenewalFlag);
          this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS]);
        }
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_GENERAL_DETAILS]);
      this.issuedundertaking.mergeCuBeneficiaryAndContactDetails(this.rawValuesForm[Constants.SECTION_CU_BENEFICIARY]);
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_AMOUNT_DETAILS]);
      this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_UNDERTAKING_DETAILS]);
      if (this.inititationForm.get(Constants.SECTION_CU_INCR_DECR).get(`cuVariationType`).value) {
        this.issuedundertaking.mergeCuVariationDetails(this.rawValuesForm[Constants.SECTION_CU_INCR_DECR], this.commonDataService);
      }
    }
    this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_COURIER_DETAILS]);

    this.updateProdStatustoProvisional();
    this.issuedundertaking.attids = this.commonDataService.getAttIds();
  }

  updateProdStatustoProvisional() {
    if (this.issuedundertaking.prodStatCode === '03'
    && (this.jsonContent[`prodStatCode`] === '98' || this.jsonContent[`provisionalStatus`] === 'Y')) {
     this.issuedundertaking.prodStatCode = '98';
    }
    if (this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get(`prodStatCode`).value === '03' &&
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get(`provisionalProdStatCode`) &&
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get(`provisionalProdStatCode`).value != null &&
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get(`provisionalProdStatCode`).value !== '') {
      this.issuedundertaking.prodStatCode =
      this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get(`provisionalProdStatCode`).value;
    }
  }

  transformToReceivedUndertaking() {
    // To fetch all control values i.e. including the fields which are disabled druing toggling
    const amountDetailsSection = 'amountDetailsSection';
    const contractDetails = 'contractDetails';
    const ruGeneraldetailsSection = 'ruGeneraldetailsSection';
    const renewalDetailsSection = 'renewalDetailsSection';
    const reportingMessageDetailsComponent = 'reportingMessageDetailsComponent';
    const ruApplicantBeneDetailsForm = 'ruApplicantBeneDetailsForm';
    const undertakingDetailsForm = 'undertakingDetailsForm';
    const ruBankDetailsSection = 'ruBankDetailsSection';
    const redIncForm = 'redIncForm';
    const License = 'License';
    const chargeForm = 'chargeForm';
    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.inititationForm.getRawValue());
    this.receivedUndertaking = new ReceivedUndertakingRequest();
    this.receivedUndertaking.refId = this.commonData.getRefId();
    this.receivedUndertaking.tnxTypeCode = this.jsonContent.tnxTypeCode;
    this.receivedUndertaking.subTnxTypeCode = this.jsonContent.subTnxTypeCode;
    this.receivedUndertaking.tnxId = this.commonData.getTnxId();
    this.receivedUndertaking.attids = this.commonDataService.getAttIds();
    this.receivedUndertaking.tnxStatCode = this.commonDataService.getTnxStatCode();
    this.receivedUndertaking.brchCode = '00001';
    this.receivedUndertaking.tnxTypeCode = this.jsonContent.tnxTypeCode;
    this.receivedUndertaking.subTnxTypeCode = this.jsonContent.subTnxTypeCode;
    this.rawValuesForm[ruGeneraldetailsSection].bgTransferIndicator = this.commonDataService.
    getCheckboxFlagValues(this.rawValuesForm[ruGeneraldetailsSection].bgTransferIndicator);
    if (this.commonDataService.getExpDateType() === '02') {
    this.rawValuesForm[renewalDetailsSection].bgRenewFlag = this.commonDataService.
    getCheckboxFlagValues(this.rawValuesForm[renewalDetailsSection].bgRenewFlag);
    this.rawValuesForm[renewalDetailsSection].bgAdviseRenewalFlag = this.commonDataService.
    getCheckboxFlagValues(this.rawValuesForm[renewalDetailsSection].bgAdviseRenewalFlag);
    this.rawValuesForm[renewalDetailsSection].bgRollingRenewalFlag = this.commonDataService.
    getCheckboxFlagValues(this.rawValuesForm[renewalDetailsSection].bgRollingRenewalFlag);
    this.receivedUndertaking.merge(this.rawValuesForm[renewalDetailsSection]);
    }
    this.receivedUndertaking.merge(this.rawValuesForm[reportingMessageDetailsComponent]);
    this.receivedUndertaking.actionReqCode =
    this.inititationForm.controls.reportingMessageDetailsComponent.get('actionReqCode').value;
    this.receivedUndertaking.merge(this.rawValuesForm[ruGeneraldetailsSection]);
    this.receivedUndertaking.merge(this.rawValuesForm[Constants.SECTION_FILE_UPLOAD]);
    this.receivedUndertaking.merge(this.rawValuesForm[ruApplicantBeneDetailsForm]);
    this.receivedUndertaking.merge(this.rawValuesForm[amountDetailsSection]);
    this.receivedUndertaking.merge(this.rawValuesForm[undertakingDetailsForm]);
    this.receivedUndertaking.merge(this.rawValuesForm[contractDetails]);
    if (this.commonDataService.getSubProdCode() === Constants.STAND_BY) {
        this.receivedUndertaking.bgCrAvlByCode = this.rawValuesForm[Constants.SECTION_PAYMENT_DETAILS].bgCrAvlByCode;
        this.receivedUndertaking.mergeCreditAvlWithBankDetails(this.rawValuesForm[Constants.SECTION_PAYMENT_DETAILS],
          'br', this.commonDataService);
        this.receivedUndertaking.merge(this.rawValuesForm[Constants.SECTION_SHIPMENT_DETAILS]);
      }
    this.receivedUndertaking.mergeBankDetailsSection(this.rawValuesForm[ruBankDetailsSection], this.commonDataService);
    if (this.inititationForm.get(redIncForm).get(`bgVariationType`).value) {
        this.receivedUndertaking.mergeVariationDetails(this.rawValuesForm[redIncForm], this.commonDataService);
     }
    if (this.rawValuesForm[License].listOfLicenses !== '') {
        this.receivedUndertaking.mergeLicensesSection(this.rawValuesForm[License]);
     }
    if (this.rawValuesForm[chargeForm].listOfCharges !== '') {
        this.receivedUndertaking.mergeChargesSection(this.rawValuesForm[chargeForm]);
     }
    this.receivedUndertaking.attids = this.commonDataService.getAttIds();
    this.receivedUndertaking.merge(this.rawValuesForm[Constants.SECTION_TRANSACTION_DETAILS]);
    this.receivedUndertaking.merge(this.rawValuesForm[Constants.SECTION_COURIER_DETAILS]);

  }

  validateAllFields(mainForm: UntypedFormGroup) {
    mainForm.markAllAsTouched();
    const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');

    const counterDateFields: string[] = ['bgExpDate', 'bgApproxExpiryDate', 'bgFinalExpiryDate', 'bgRenewalCalendarDate'];
    const luDateFields: string[] = ['cuApproxExpiryDate', 'cuExpDate', 'cuFinalExpiryDate', 'cuRenewalCalendarDate'];
    const formName = (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU ? Constants.SECTION_UNDERTAKING_GENERAL_DETAILS :
    Constants.SECTION_RU_GENERAL_DETAILS );
    let isValidationReq = this.inititationForm.controls.undertakingGeneralDetailsSection.get('bgExpDateTypeCode').value === '02';
    counterDateFields.forEach(value => {
      if (value === 'bgExpDate' || value === 'bgApproxExpiryDate') {
        mainForm.get(formName).get(value)
          .setValidators(validateWithCurrentDate(currentDate, (value === 'bgExpDate' &&
          isValidationReq)));
        mainForm.get(formName).get(value).updateValueAndValidity();
      }
  });

    if (this.commonDataService.displayLUSection()) {
      isValidationReq = this.inititationForm.controls.cuGeneraldetailsSection.get('cuExpDateTypeCode').value === '02';
      luDateFields.forEach(value => {
        if (value === 'cuApproxExpiryDate' || value === 'cuExpDate') {
          mainForm.get(Constants.SECTION_CU_GENERAL_DETAILS).get(value).setValidators(validateWithCurrentDate(currentDate,
            (value === 'cuExpDate' && isValidationReq)));
          mainForm.get(Constants.SECTION_CU_GENERAL_DETAILS).get(value).updateValueAndValidity();
        }
      });
    }

    if (!this.inititationForm.valid &&
      this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('prodStatCode').value !== '01') {
          this.setFieldError();
    }
  }

  onSave() {
    this.actionsComponent.showProgressBar = true;
    this.showForm = false;
    this.submitted = true;
    if (this.commonData.getMode() === Constants.MODE_DRAFT && this.inquiryConsolidatedChargesComponent.charges.length !== 0) {
      this.inquiryConsolidatedChargesComponent.charges.forEach(charge => {
        charge.createdInSession = 'Y';
      });
    }
    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
    this.transformToIssuedUndertaking();
    this.iuService.saveOrSubmitIU(this.contextPath + URLConstants.IU_SAVE, this.issuedundertaking).subscribe(
      data => {
        this.commonService.setResponseData(data);
        this.router.navigate(['submitOrSave']);
      });
    } else if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
      this.transformToReceivedUndertaking();
      this.ruService.saveOrSubmitRU(this.contextPath + URLConstants.RU_SAVE, this.receivedUndertaking).subscribe(
        data => {
        this.commonService.setResponseData(data);
        this.router.navigate(['submitOrSave']);
      });
    }
  }

  resetLUForms(resetLUReq) {
    const array = resetLUReq.split(',');
    const isResetLU = array[0];

    if (isResetLU === 'true') {
      this.inititationForm.controls.cuGeneraldetailsSection.reset();
      this.inititationForm.controls.cuBeneficaryDetailsSection.reset();
      this.inititationForm.controls.cuAmountDetailsSection.reset();

      if (this.inititationForm.controls.cuRenewalDetailsSection) {
        this.inititationForm.controls.cuRenewalDetailsSection.reset();
      }
      if (this.inititationForm.controls.cuPaymentDetailsForm) {
        this.inititationForm.controls.cuPaymentDetailsForm.reset();
      }

      this.inititationForm.controls.cuUndertakingDetailsForm.reset();
      this.inititationForm.controls.cuRedIncForm.reset();

      this.inititationForm.removeControl(Constants.SECTION_CU_GENERAL_DETAILS);
      this.inititationForm.removeControl(Constants.SECTION_CU_BENEFICIARY);
      this.inititationForm.removeControl(Constants.SECTION_CU_AMOUNT_DETAILS);

      if (this.inititationForm.controls.cuRenewalDetailsSection) {
        this.inititationForm.removeControl(Constants.SECTION_CU_RENEWAL_DETAILS);
      }
      if (this.inititationForm.controls.cuPaymentDetailsForm) {
        this.inititationForm.removeControl(Constants.SECTION_CU_PAYMENT_DETAILS);
      }

      this.inititationForm.removeControl(Constants.SECTION_CU_UNDERTAKING_DETAILS);
      this.inititationForm.removeControl(Constants.SECTION_CU_INCR_DECR);
    }
  }

  setLUStatus(luStatus) {
    this.luStatus = luStatus;
    this.beneficiaryDetailsComponent.setValidationsOnBeneFields(!luStatus);
    if (luStatus) {
      this.commonDataService.setBeneMandatoryVal(false);
    } else {
      this.commonDataService.setBeneMandatoryVal(true);
    }
  }

  reloadApplicantDetails(flag) {
    this.applicantDetailsComponent.ngOnInit();
  }

  setConfInstValue(value) {
    this.bankDetailsComponent.commonBankDetailsComponent.checkConfirmingBankMandatory(value);
    this.amountDetailsChildComponent.commonAmountDetailsChildComponent.checkConfirmingChargeManadatory(value);
  }

  setCuConfInstValue(value) {
    this.cuAmountDetailsChildComponent.commonAmountDetailsChildComponent.checkCuConfirmingChargeManadatory(value);
  }

  resetRenewalSection(flag) {
    if (this.cuRenewalDetailsChildComponent) {
      if (!flag) {
        this.renewalDetailsComponent.ngOnInit();
      } else {
        if (this.cuRenewalDetailsChildComponent) {
          this.cuRenewalDetailsChildComponent.ngOnInit();
        }
      }
    }
  }
  setExpiryDateForExtension(expiryDateExt) {
    if (expiryDateExt !== '' && expiryDateExt !== null) {
      const undertakingType = expiryDateExt.split(',')[1];
      if (this.renewalDetailsComponent && undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        this.renewalDetailsComponent.commonRenewalDetails.setFinalExpiryDate(undertakingType);
     } else if ( this.renewalDetailsComponent && undertakingType === Constants.UNDERTAKING_TYPE_CU) {
        this.cuRenewalDetailsChildComponent.commonRenewalDetailsComponent.setFinalExpiryDate(undertakingType);
     }
    }
   }
  validateForm() {
    this.validateAllFields(this.inititationForm);
  }
  onCancel() {
    const host = window.location.origin;
    const url = host + this.commonService.getBaseServletUrl() + Constants.TRADE_ADMIN_LANDING_SCREEN;
    window.location.replace(url);
    this.auditService.audit().subscribe(
      data => {
      }
    );
  }

  closeWindow() {
    window.close();
  }

  onPrint() {
    window.print();
  }

  fetchBankDetails() {
    if (this.jsonContent && this.jsonContent !== null) {
      let bankAbbvName = '';
      if (this.jsonContent.productCode === 'BG' && this.jsonContent.recipientBank && this.jsonContent.recipientBank.abbvName) {
        bankAbbvName = this.jsonContent.recipientBank.abbvName;
      } else if (this.jsonContent.productCode === 'BR' && this.jsonContent.advisingBank && this.jsonContent.advisingBank.abbvName) {
        bankAbbvName = this.jsonContent.advisingBank.abbvName;
      }
      this.commonService.fetchBankDetails(bankAbbvName).subscribe(data => {
              this.bankDetails = data as string[];
      });
    }
  }

  generatePdf() {
    this.fetchBankDetails();
    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
    this.generatePdfService.generateFile(Constants.PRODUCT_CODE_IU, this.bankDetails);
    } else if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU) {
    this.generatePdfService.generateFile(Constants.PRODUCT_CODE_RU, this.bankDetails);
    }
    this.transactionDetailsChildComponent.generatePdf(this.generatePdfService);
    if (this.jsonContent[`tnxTypeCode`] === Constants.TYPE_INQUIRE && this.messageDetailsComponent) {
      this.messageDetailsComponent.generatePdf(this.generatePdfService);
    }
    if (this.iuGeneraldetailsChildComponent) {
      this.iuGeneraldetailsChildComponent.generatePdf(this.generatePdfService);
    }
    if (this.commonDataService.getPreviewOption() !== 'SUMMARY') {
      this.generatePdfForNonSummaryOption();
    }
    this.generatePdfForLicense();

    this.reportingMessageDetailsChildComponent.generatePdf(this.generatePdfService);
    if (this.courierDetailsComponent)
    {
      // Courier Details
      this.courierDetailsComponent.generatePdf(this.generatePdfService);
    }
    if (this.reportingMessageDetailsChildComponent.renderAdviceDiscrepancyAck()){
      this.generatePreviousBankAttachments();
    }
    // Charge Details
    this.generatePdfForChargeDetails();
    // Attachments table
    this.generatePdfTableForAttachments();

    if (this.commonDataService.getmasterorTnx() === 'master') {
      this.generatePdfService.saveFile(this.jsonContent.refId, '');
    } else {
      this.generatePdfService.saveFile(this.jsonContent.refId, this.jsonContent.tnxId);
    }
  }

  generatePreviousBankAttachments() {
    let headers: string[] = [];
    let data: any[] = [];
    let previousAttachments;
    this.reportingMessageDetailsChildComponent.generatePreviousPdf(this.generatePdfService);
    if (this.reportingMessageDetailsChildComponent.renderPreviousAttachment()) {
      previousAttachments =
      this.reportingMessageDetailsChildComponent.getPreviousRecord(this.jsonContent.objectData.parent_tnx_details.attachments.attachment);
    }
    if (previousAttachments && (previousAttachments !== '' && previousAttachments !== 'undefined') && this.commonData.getIsBankUser()) {
        this.generatePdfService.setSubSectionHeader('PREVIOUS_BANK_FILES_UPLOAD', true);
        headers = [];
        headers.push(this.commonService.getTranslation('KEY_FILE_TITLE'));
        headers.push(this.commonService.getTranslation('FILE_NAME'));
        data = [];
        for (const attachment of previousAttachments) {
          if (attachment.type === '02') {
            const row = [];
            row.push(attachment.title);
            row.push(attachment.file_name);
            data.push(row);
          }
      }
        this.generatePdfService.createTable(headers, data);
    }
  }

  generatePdfForCUSection() {
    if (this.cuGeneraldetailsChildComponent) {
      this.cuGeneraldetailsChildComponent.generatePdf(this.generatePdfService);
    }
    if (this.cuBeneficaryDetailsChildComponent) {
      this.cuBeneficaryDetailsChildComponent.generatePdf(this.generatePdfService);
    }
    if (this.cuAmountDetailsChildComponent) {
      this.cuAmountDetailsChildComponent.generatePdf(this.generatePdfService);
    }
    if (this.cuRenewalDetailsChildComponent) {
      this.cuRenewalDetailsChildComponent.generatePdf(this.generatePdfService);
    }
    if (this.cuReductionIncreaseComponent) {
      this.cuReductionIncreaseComponent.generatePdf(this.generatePdfService);
    }
    if (this.cuPaymentDetailsComponent) {
      this.cuPaymentDetailsComponent.generatePdf(this.generatePdfService);
    }
    if (this.cuBankDetailsChildComponent) {
      this.cuBankDetailsChildComponent.generatePdf(this.generatePdfService);
    }
    if (this.cuUndertakingChildComponent) {
      this.cuUndertakingChildComponent.generatePdf(this.generatePdfService);
    }
  }

  generatePdfForLicense() {
    if (this.iuLicenseComponent) {
      this.iuLicenseComponent.generatePdf(this.generatePdfService);
      if (this.iuCommonReturnCommentsComponent && this.jsonContent.returnComments && this.jsonContent.returnComments !== '' &&
        this.jsonContent.returnComments !== null) {
        this.iuCommonReturnCommentsComponent.generatePdf(this.generatePdfService);
      }
    }
  }

  generatePdfForChargeDetails() {
    if (this.commonDataService.getmasterorTnx() !== Constants.MASTER) {
      this.generatePdfService.setSectionHeader('HEADER_CHARGE_DETAILS', true);
    }
    if (this.jsonContent.charges && this.jsonContent.charges !== '' && this.commonDataService.getmasterorTnx() !== Constants.MASTER) {
      for (const charge of this.jsonContent.charges.charge) {
        if (charge.createdInSession !== '' && charge.createdInSession !== null) {
        this.generatePdfService.setSectionLabel('CHARGE', true);
        this.generatePdfService.setSectionContent(this.commonDataService.getChargeType(charge.chrgCode), true);

        this.generatePdfService.setSectionLabel('CHARGE_DESCRIPTION_LABEL', true);
        this.generatePdfService.setSectionContent(charge.additionalComment, false);

        this.generatePdfService.setSectionLabel('CHARGE_AMOUNT_LABEL', true);
        let chargeCurCode;
        if (charge.curCode && charge.curCode !== '') {
          chargeCurCode = charge.curCode;
        } else {
          chargeCurCode = charge.eqv_cur_code;
        }
        let chargeAmt;
        if (charge.amt && charge.amt !== '') {
          chargeAmt = charge.amt;
        } else {
          chargeAmt = charge.eqv_amt;
        }
        this.generatePdfService.setSectionContent((chargeCurCode + chargeAmt), false);

        this.generatePdfService.setSectionLabel('CHARGE_STATUS_LABEL', true);
        this.generatePdfService.setSectionContent(this.commonDataService.getChargeStatus(charge.status), true);

        this.generatePdfService.setSectionLabel('CHARGE_SETTLEMENT_DATE_LABEL', true);
        this.generatePdfService.setSectionContent(charge.settlementDate, false);
        }
      }
    }
  }

  generatePdfTableForAttachments() {
    let headers: string[] = [];
    let data: any[] = [];
    if ((this.jsonContent.attachments && this.jsonContent.attachments !== '') || this.commonData.getIsBankUser()) {
      this.generatePdfService.setSectionHeader('KEY_HEADER_FILE_UPLOAD', true);
    }
    if (this.jsonContent.attachments && this.jsonContent.attachments !== '' && this.commonData.getIsBankUser()) {
      if (this.hasCustomerAttach) {
        this.generatePdfService.setSubSectionHeader('CUSTOMER_FILES_UPLOAD', true);
        headers = [];
        headers.push(this.commonService.getTranslation('KEY_FILE_TITLE'));
        headers.push(this.commonService.getTranslation('FILE_NAME'));
        data = [];
        for (const attachment of this.jsonContent.attachments.attachment) {
          if (attachment.type === '01') {
            const row = [];
            row.push(attachment.title);
            row.push(attachment.fileName);
            data.push(row);
          }
      }
        this.generatePdfService.createTable(headers, data);
      }
      if (this.hasBankAttach) {
        this.generatePdfService.setSubSectionHeader('BANK_FILES_UPLOAD', true);
        headers = [];
        headers.push(this.commonService.getTranslation('KEY_FILE_TITLE'));
        headers.push(this.commonService.getTranslation('FILE_NAME'));
        data = [];
        for (const attachment of this.jsonContent.attachments.attachment) {
          if (attachment.type === '02') {
            const row = [];
            row.push(attachment.title);
            row.push(attachment.fileName);
            data.push(row);
          }
      }
        this.generatePdfService.createTable(headers, data);
      }
      this.generatePdfService.setSectionDetails('', false, false, 'sendAttachmentDetails');
    }
  }

  generatePdfForNonSummaryOption() {
      if (this.bankApplicantBeneDetailsComponent) {
        this.bankApplicantBeneDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.commonDataService.displayLUSection()) {
        this.generatePdfForCUSection();
      }
      if (this.bankDetailsComponent) {
        this.bankDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU && this.undertakingGeneralDetailsChildComponent) {
        this.undertakingGeneralDetailsChildComponent.generatePdf(this.generatePdfService);
      }
      if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_RU && this.bankRuGeneralDetailsComponent) {
        this.bankRuGeneralDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.amountDetailsChildComponent) {
        this.amountDetailsChildComponent.generatePdf(this.generatePdfService);
      }
      if (this.renewalDetailsComponent) {
        this.renewalDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.iuReductionIncreaseComponent) {
        this.iuReductionIncreaseComponent.generatePdf(this.generatePdfService);
      }
      if (this.iuPaymentDetailsComponent) {
        this.iuPaymentDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.shipmentDetailsComponent) {
        this.shipmentDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.contractDetailsComponent) {
        this.contractDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.undertakingChildComponent) {
        this.undertakingChildComponent.generatePdf(this.generatePdfService);
      }
      if (this.bankInstructionsComponent) {
        this.bankInstructionsComponent.generatePdf(this.generatePdfService);
      }
  }

  setRenewalExpDate(finalRenewalExpDateAndType) {
    if (finalRenewalExpDateAndType !== '' && finalRenewalExpDateAndType !== null) {
      let finalRenewalExpDate = finalRenewalExpDateAndType.split(',')[0];
      const undertakingType = finalRenewalExpDateAndType.split(',')[1];
      if (finalRenewalExpDate !== '' && finalRenewalExpDate != null) {
        finalRenewalExpDate = this.commonService.getDateObject(finalRenewalExpDate);
      }
      if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        this.finalRenewalExpDate = finalRenewalExpDate;
      } else {
        this.cuFinalRenewalExpDate = finalRenewalExpDate;
      }
      this.setMaxDate(undertakingType);
    }
  }

  setExpDate(expDateAndType) {
    if (expDateAndType !== '' && expDateAndType !== null) {
      let expiryDate = expDateAndType.split(',')[0];
      const undertakingType = expDateAndType.split(',')[1];
      if (expiryDate !== '' && expiryDate != null) {
        expiryDate = this.commonService.getDateObject(expiryDate);
      }
      if (undertakingType === Constants.UNDERTAKING_TYPE_IU) {
        this.expDate = expiryDate;
      } else {
        this.cuExpDate = expiryDate;
      }
      this.setMaxDate(undertakingType);
    }
  }

  setMaxDate(undertakingType: string) {
    let form ;
    let renewalExpDate;
    let expDate;
    let firstDate;
    form = this.iuReductionIncreaseComponent;
    if (undertakingType === Constants.UNDERTAKING_TYPE_IU && this.commonDataService.getExpDateType() !== '02') {
      this.finalRenewalExpDate = '';
    } else if (undertakingType === Constants.UNDERTAKING_TYPE_CU && this.commonDataService.getCUExpDateType() !== '02') {
      this.cuFinalRenewalExpDate = '';
    }
    renewalExpDate = this.finalRenewalExpDate;
    expDate = this.expDate;
    firstDate = form.redIncForm.get('bgVariationFirstDate') !== null ? form.redIncForm.get('bgVariationFirstDate').value : '';
    if (undertakingType === Constants.UNDERTAKING_TYPE_CU) {
      form = this.cuReductionIncreaseComponent;
      renewalExpDate = this.cuFinalRenewalExpDate;
      expDate = this.cuExpDate;
      firstDate = form.cuRedIncForm.get('cuVariationFirstDate') !== null ? form.cuRedIncForm.get('cuVariationFirstDate').value : '';
    }
    const renewalDetailSectionControl = this.inititationForm.get(Constants.SECTION_RENEWAL_DETAILS);
    if (undertakingType === Constants.UNDERTAKING_TYPE_IU && (renewalExpDate === undefined || renewalExpDate === '')
    && this.commonDataService.getExpDateType() === '02') {
        renewalExpDate = ( renewalDetailSectionControl ? renewalDetailSectionControl.get('bgFinalExpiryDate').value : '');
        renewalExpDate = renewalExpDate !== '' ? this.commonService.getDateObject(renewalExpDate) : '';
      } else if ((renewalExpDate === undefined || renewalExpDate === '') && this.commonDataService.getCUExpDateType() === '02') {
        renewalExpDate = this.inititationForm.get(Constants.SECTION_CU_RENEWAL_DETAILS) ?
        this.inititationForm.get(Constants.SECTION_CU_RENEWAL_DETAILS).get('cuFinalExpiryDate').value : '';
        renewalExpDate = renewalExpDate !== '' ? this.commonService.getDateObject(renewalExpDate) : '';
      }
    if (firstDate !== '' && firstDate != null) {
      firstDate = this.commonService.getDateObject(firstDate);
      firstDate = Date.parse(this.datePipe.transform(firstDate , Constants.DATE_FORMAT));
    }
    this.setMaximumFirstDateValidation(renewalExpDate, expDate, form, undertakingType, firstDate);
}

  setMaximumFirstDateValidation(renewalExpDate: any, expDate: any, form: any, undertakingType: string, firstDate: string) {
    if (undertakingType === Constants.UNDERTAKING_TYPE_IU && (expDate === undefined || expDate === '')) {
      expDate = this.inititationForm.get(Constants.SECTION_UNDERTAKING_GENERAL_DETAILS).get('bgExpDate').value;
      expDate = expDate !== '' ? this.commonService.getDateObject(expDate) : '';
    } else if (expDate === undefined || expDate === '') {
      expDate = this.inititationForm.get(Constants.SECTION_CU_GENERAL_DETAILS) ?
      this.inititationForm.get(Constants.SECTION_CU_GENERAL_DETAILS).get('cuExpDate').value : '';
      expDate = expDate !== '' ? this.commonService.getDateObject(expDate) : '';
    }
    const formGroup = undertakingType === Constants.UNDERTAKING_TYPE_IU ? form.redIncForm : form.cuRedIncForm;
    if (renewalExpDate !== '' && renewalExpDate !== undefined && renewalExpDate !== null) {
      if ( undertakingType === Constants.UNDERTAKING_TYPE_IU ) {
        this.commonService.maxDate = renewalExpDate;
        this.commonService.expiryDateType = Constants.EXTENSION_EXPIRY_TYPE ;
      } else {
        this.commonService.cuMaxDate = renewalExpDate;
        this.commonService.cuExpiryDateType = Constants.EXTENSION_EXPIRY_TYPE;
      }
      renewalExpDate = Date.parse(this.datePipe.transform(renewalExpDate , Constants.DATE_FORMAT));
      this.commonService.validateDatewithExpiryDate(formGroup, undertakingType);
      this.commonService.setMaxFirstDateValidations(firstDate, renewalExpDate, formGroup, undertakingType,
                                Constants.EXTENSION_EXPIRY_TYPE);
    } else if (expDate !== '' && expDate !== undefined && expDate !== null) {
      if ( undertakingType === Constants.UNDERTAKING_TYPE_IU ) {
        this.commonService.maxDate = expDate;
        this.commonService.expiryDateType = Constants.EXPIRY_TYPE ;
      } else {
        this.commonService.cuMaxDate = expDate;
        this.commonService.cuExpiryDateType = Constants.EXPIRY_TYPE;
      }
      expDate = Date.parse(this.datePipe.transform(expDate , Constants.DATE_FORMAT));
      this.commonService.validateDatewithExpiryDate(formGroup, undertakingType);
      this.commonService.setMaxFirstDateValidations(firstDate, expDate, formGroup, undertakingType, Constants.EXPIRY_TYPE);
    }
  }

  validateLS() {
    this.licenseValidError = undefined;
    if (this.iuLicenseComponent && this.iuLicenseComponent.uploadFile.licenseMap.length > 0) {
      let sum = 0;
      for (const license of this.iuLicenseComponent.uploadFile.licenseMap) {
        const amt: number = parseFloat(this.commonService.getNumberWithoutLanguageFormatting(license.lsAllocatedAmt));
        if (amt > 0) {
          sum = sum + amt;
        } else {
          this.licenseValidError = 'ERROR_ZERO_LS_AMT';
          break;
        }
      }

      if (this.licenseValidError === undefined && sum !== parseFloat(
        this.commonService.getNumberWithoutLanguageFormatting(this.amountDetailsChildComponent.amountDetailsSection.get('bgAmt').value))) {
        this.licenseValidError = 'ERROR_NOT_EQUAL_LS_AMT';
      }
    }
    if (this.licenseValidError !== undefined) {
      let message = '';
      let dialogHeader = '';
      this.translate.get('ERROR_TITLE').subscribe((value: string) => {
        dialogHeader = value;
      });
      this.translate.get(this.licenseValidError).subscribe((value: string) => {
        message = value;
      });

      this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: Constants.TRIANGLE_ICON,
        key: 'linkedLicenseErrorDialog',
        rejectVisible: false,
        acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
        accept: () => { }
      });
    }

  }
  public setVariationCurrCode(currCodeAndType: string) {
    if (currCodeAndType !== '' && currCodeAndType !== null) {
      const currCode = currCodeAndType.split(',')[0];
      const undertakingType = currCodeAndType.split(',')[1];
      let form;

      if (undertakingType === 'bg') {
        form = this.iuReductionIncreaseComponent;
      } else {
        form = this.cuReductionIncreaseComponent;
      }
      this.commonDataService.setCurCode(currCode, undertakingType);
      form.commonReductionIncreaseChildComponent.currCode = currCode;
      const reductionForm = form.commonReductionIncreaseChildComponent.sectionForm;
      if (reductionForm.get(`${undertakingType}VariationType`).value) {
        const tnxCurCodeControl = form.commonReductionIncreaseChildComponent.
          sectionForm.parent.get(undertakingType === 'bg' ? 'amountDetailsSection' : 'cuAmountDetailsSection')
          .get(undertakingType === 'bg' ? 'bgCurCode' : 'cuCurCode');
        const irregularVariationList = form.commonReductionIncreaseChildComponent.irregularList;
        for (const entry of irregularVariationList) {
          entry.variationCurCode = currCode;
        }
        this.commonService.transformAmtAndSetValidators(reductionForm.get(undertakingType === 'bg' ? 'bgVariationAmt' : 'cuVariationAmt'),
          tnxCurCodeControl, (undertakingType === 'bg' ? 'bgVariationCurCode' : 'cuVariationCurCode'));
      }
    }
  }
public clearVariationAmtValidations(isTnxCurCodeAmtNullAndUndetakingType: string) {
    if (isTnxCurCodeAmtNullAndUndetakingType !== '' && isTnxCurCodeAmtNullAndUndetakingType !== null) {
      const undertakingType = isTnxCurCodeAmtNullAndUndetakingType.split(',')[1];
      if (undertakingType === Constants.UNDERTAKING_TYPE_IU && this.iuReductionIncreaseComponent &&
      this.inititationForm.get(Constants.SECTION_INCR_DECR).get('bgVariationType').value) {
          this.iuReductionIncreaseComponent.commonReductionIncreaseChildComponent.validateForNullTnxAmtCurrencyField();
          this.iuReductionIncreaseComponent.commonReductionIncreaseChildComponent.reCalculateVariationAmount();
    } else if (undertakingType === Constants.UNDERTAKING_TYPE_CU && this.cuReductionIncreaseComponent &&
      this.inititationForm.get(Constants.SECTION_CU_INCR_DECR).get('cuVariationType').value) {
          this.cuReductionIncreaseComponent.commonReductionIncreaseChildComponent.validateForNullTnxAmtCurrencyField();
          this.cuReductionIncreaseComponent.commonReductionIncreaseChildComponent.reCalculateVariationAmount();
    }
  }
  }
  updateProdStatForSections(statCode) {
      this.isSubmitEnabled = (statCode !== Constants.CODE_02);
      const isRejected = (statCode === Constants.REJECT_PROD_STATUS_CODE);
      if (isRejected && !(this.commonData.disableTnx)) {
        this.commonData.isDecisionReject = true;
        if (this.jsonContent.purpose === '01') {
          this.iuGeneraldetailsChildComponent.showLUStatus(false);
        } else if (this.jsonContent.purpose === '02' || this.jsonContent.purpose === '03') {
          this.iuGeneraldetailsChildComponent.showLUStatus(true);
          this.cuGeneraldetailsChildComponent.ngOnInit();
          this.cuBeneficaryDetailsChildComponent.ngOnInit();
          this.cuAmountDetailsChildComponent.ngOnInit();
          if (this.cuRenewalDetailsChildComponent) {
          this.cuRenewalDetailsChildComponent.ngOnInit();
          }
          this.cuUndertakingChildComponent.ngOnInit();
          if (this.cuGeneraldetailsChildComponent.cuGeneraldetailsSection.get('cuExpDate')) {
            this.cuGeneraldetailsChildComponent.cuGeneraldetailsSection.get('cuExpDate').disable();
          } else if (this.cuGeneraldetailsChildComponent.cuGeneraldetailsSection.get('cuApproxExpiryDate')) {
            this.cuGeneraldetailsChildComponent.cuGeneraldetailsSection.get('cuApproxExpiryDate').disable();
          }
      }
        this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
          .get('boRefId').clearValidators();
        this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
          .get('boRefId').setValue('');
        this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
          .get('boRefId').disable();
        this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
          .get('actionReqCode').setValue('');
        this.undertakingGeneralDetailsChildComponent.ngOnInit();
        if (this.undertakingGeneralDetailsChildComponent.undertakingGeneralDetailsSection.get('bgExpDate')) {
          this.undertakingGeneralDetailsChildComponent.undertakingGeneralDetailsSection.get('bgExpDate').disable();
        } else if (this.undertakingGeneralDetailsChildComponent.undertakingGeneralDetailsSection.get('bgApproxExpiryDate')) {
          this.undertakingGeneralDetailsChildComponent.undertakingGeneralDetailsSection.get('bgApproxExpiryDate').disable();
        }
        this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('issDate').clearValidators();
        this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('issDate').disable();
        this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('issDate').setValue('');
        this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('bgAmdDate').clearValidators();
        this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('bgAmdDate').disable();
        this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get('bgAmdDate').setValue('');
        this.amountDetailsChildComponent.ngOnInit();
        this.amountDetailsChildComponent.amountDetailsSection.get('bgAvailableAmt').setValue('');
        this.amountDetailsChildComponent.amountDetailsSection.get('bgLiabAmt').setValue('');
        this.amountDetailsChildComponent.amountDetailsSection.get('bgAvailableAmt').disable();
        this.amountDetailsChildComponent.amountDetailsSection.get('bgLiabAmt').disable();
        this.iuLicenseComponent.uploadFile.licenseMap.length = 0;
        this.iuLicenseComponent.ngOnInit();
        this.fileUploadComponent.filelist.length = 0;
        this.fileUploadComponent.ngOnInit();
        this.inquiryConsolidatedChargesComponent.chargesList.length = 0;
        this.inquiryConsolidatedChargesComponent.ngOnInit();
        if (this.renewalDetailsComponent) {
        this.renewalDetailsComponent.ngOnInit();
        }
        this.bankApplicantBeneDetailsComponent.ngOnInit();
        this.contractDetailsComponent.ngOnInit();
        this.undertakingChildComponent.ngOnInit();
      } else {
        this.updateSectionDetails();
      }
      this.setAmountValidation(statCode);
  }

  updateSectionDetails() {
    this.commonData.isDecisionReject = false;
    if (this.jsonContent.boRefId && this.jsonContent.boRefId != null && this.jsonContent.boRefId !== '' ) {
      this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
      .get('boRefId').setValue(this.jsonContent.boRefId);
      this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
      .get('boRefId').disable();
    } else {
      this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
      .get('boRefId').enable();
    }
    if (this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
      .get('prodStatCode').value === '08') {
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
      .get('bgAmdDate').enable();
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
      .get('bgAmdDate').setValidators([Validators.required]);
      } else {
      this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
      .get('issDate').enable();
      this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
      .get('issDate').setValidators([Validators.required]);
      }
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
      .get('prodStatCode').setValidators([Validators.required]);
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
      .get('boRefId').setValidators([Validators.required, Validators.maxLength(Constants.LENGTH_16)]);
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection
      .get('actionReqCode').setValue('');
    if (this.iuLicenseComponent) {
      this.iuLicenseComponent.uploadFile.licenseMap.length = 0;
      this.iuLicenseComponent.ngOnInit();
    }
  }
  setAmountValidation(statCode) {
    if (this.jsonContent.productCode === Constants.PRODUCT_CODE_IU && this.commonData.getOperation() ===
    Constants.OPERATION_CREATE_REPORTING && this.jsonContent.tnxTypeCode === Constants.TYPE_INQUIRE &&
    (this.jsonContent.subTnxTypeCode === '88' || this.jsonContent.subTnxTypeCode === '89')) {
    if ((this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get(`provisionalProdStatCode`) &&
    (this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get(`provisionalProdStatCode`).value === '78' ||
    this.reportingMessageDetailsChildComponent.reportingMessageDetailsSection.get(`provisionalProdStatCode`).value === '79')) ||
     statCode !== Constants.CODE_03) {
      this.amountDetailsChildComponent.amountDetailsSection.get('bgAvailableAmt').clearValidators();
      this.amountDetailsChildComponent.commonAmountDetailsChildComponent.isAmountRequired = false;
      if (this.iuGeneraldetailsChildComponent.generaldetailsSection.get('purpose').value === '01') {
        this.amountDetailsChildComponent.amountDetailsSection.get('bgLiabAmt').clearValidators();
        this.amountDetailsChildComponent.amountDetailsSection.get('bgLiabAmt').updateValueAndValidity();
      } else {
        this.cuAmountDetailsChildComponent.cuAmountDetailsSection.get('cuAvailableAmt').clearValidators();
        this.cuAmountDetailsChildComponent.cuAmountDetailsSection.get('cuAvailableAmt').updateValueAndValidity();
        this.cuAmountDetailsChildComponent.cuAmountDetailsSection.get('cuLiabAmt').clearValidators();
        this.cuAmountDetailsChildComponent.cuAmountDetailsSection.get('cuLiabAmt').updateValueAndValidity();
        this.cuAmountDetailsChildComponent.commonAmountDetailsChildComponent.isAmountRequired = false;
      }
    } else {
      this.amountDetailsChildComponent.amountDetailsSection.get('bgAvailableAmt').enable();
      this.amountDetailsChildComponent.amountDetailsSection.get('bgAvailableAmt').setValidators(Validators.required);
      this.amountDetailsChildComponent.commonAmountDetailsChildComponent.isAmountRequired = true;
      if (this.iuGeneraldetailsChildComponent.generaldetailsSection.get('purpose').value === '01') {
        this.amountDetailsChildComponent.amountDetailsSection.get('bgLiabAmt').enable();
        this.amountDetailsChildComponent.amountDetailsSection.get('bgLiabAmt').setValidators(Validators.required);
        this.amountDetailsChildComponent.amountDetailsSection.get('bgLiabAmt').updateValueAndValidity();
      } else {
        this.cuAmountDetailsChildComponent.cuAmountDetailsSection.get('cuAvailableAmt').setValidators(Validators.required);
        this.cuAmountDetailsChildComponent.cuAmountDetailsSection.get('cuAvailableAmt').updateValueAndValidity();
        this.cuAmountDetailsChildComponent.cuAmountDetailsSection.get('cuLiabAmt').setValidators(Validators.required);
        this.cuAmountDetailsChildComponent.cuAmountDetailsSection.get('cuLiabAmt').updateValueAndValidity();
        this.cuAmountDetailsChildComponent.commonAmountDetailsChildComponent.isAmountRequired = true;
      }
    }
    this.amountDetailsChildComponent.amountDetailsSection.get('bgAvailableAmt').updateValueAndValidity();
  }
}

  setValidatorsIfModeSwift(swiftModeSelected) {
    this.commonDataService.setAdvSendMode(swiftModeSelected);
    this.bankDetailsComponent.commonBankDetailsComponent.setValidatorsIfModeSwift(swiftModeSelected);
    this.undertakingChildComponent.commonUndertakingDetailsComponent.setValidatorsIfModeSwift(swiftModeSelected);
    this.cuUndertakingChildComponent.commonUndertakingDetailsComponent.setValidatorsIfModeSwift(swiftModeSelected);
  }
  private validateFormOnSaveOrReject(popMessage: string) {
    this.isFormInvalid = false;
    const invalidControl = this.commonService.OnSaveFormValidation(this.inititationForm);
    if (invalidControl) {
      this.isFormInvalid = true;
      this.findInvalidField();
      this.setRejectFieldError(false, popMessage);
  }
}

private setRejectFieldError(boCommontInvalid: boolean, popMessage: string) {
  let message = '';
  let dialogHeader = '';
  this.translate.get('ERROR_TITLE').subscribe((value: string) => {
        dialogHeader = value;
      });
  this.translate.get(popMessage).subscribe((value: string) => {
        message = value;
      });

  this.confirmationService.confirm({
        message,
        header: dialogHeader,
        icon: Constants.TRIANGLE_ICON,
        key: 'fieldErrorDialog',
        rejectVisible: false,
        acceptLabel: this.commonService.getTranslation('USER_ACTION_OK'),
        accept: () => {
          let target ;
          const formGroupInvalid = this.el.nativeElement.querySelectorAll('.ng-invalid.ng-dirty.ng-touched.fieldError');
          if (formGroupInvalid || boCommontInvalid) {
            if (boCommontInvalid) {
              target = jqueryConst('.ng-invalid.fieldError:not(form):last');
            } else {
             target = jqueryConst('.ng-invalid.ng-dirty.ng-touched.fieldError:not(form):first');
            }
            jqueryConst('html,body').animate({ scrollTop: (target.offset().top - Constants.NUMERIC_TWENTY) }, 'slow', () => {
              target.trigger('focus');
            });
          }
        }
    });
}

private findInvalidField() {
  const invalid = [];
  const issuingBank = [Constants.ISSUINGBANKTYPECODE, Constants.ISSUINGBANKSWIFTCODE, Constants.ISSUINGBANKNAME,
                       Constants.ISSUINGBANKADDRESSLINE1, Constants.ISSUINGBANKADDRESSLINE2, Constants.ISSUINGBANKDOM,
                       Constants.ISSUINGBANKADDRESSLINE4];
  const advisingBank = [Constants.ADVISINGSWIFTCODE, Constants.ADVISINGBANKNAME, Constants.ADVISINGBANKADDRESSLINE1,
                        Constants.ADVISINGBANKADDRESSLINE2, Constants.ADVISINGBANKDOM, Constants.ADVISINGBANKADDRESSLINE4,
                        Constants.ADVBANKCONFREQ];
  const localAdviseThroughBank = [Constants.LOCALADVISETHROUGHSWIFTCODE, Constants.LOCALADVISETHROUGHNAME,
                                  Constants.LOCALADVISETHROUGHADDRESSLINE1, Constants.LOCALADVISETHROUGHADDRESSLINE2,
Constants.LOCALADVISETHROUGHDOM, Constants.LOCALADVISETHROUGHADDRESSLINE4];
  const adviseThruBank = [Constants.ADVISETHRUSWIFTCODE, Constants.ADVISETHRUBANKNAME, Constants.ADVISETHRUBANKADDRESSLINE1,
                          Constants.ADVISETHRUBANKADDRESSLINE2, Constants.ADVISETHRUBANKDOM, Constants.ADVISETHRUBANKADDRESSLINE4];
  const confirmingbank = [Constants.CONFIRMINGSWIFTCODE, Constants.CONFIRMINGBANKNAME, Constants.CONFIRMINGBANKADDRESSLINE1,
                          Constants.CONFIRMINGBANKADDRESSLINE2, Constants.CONFIRMINGBANKDOM, Constants.CONFIRMINGBANKADDRESSLINE4];
  this.checkInvalidControl(invalid);
  if (invalid.length !== 0) {
    const issuingTabInvalid = issuingBank.some(r => invalid.indexOf(r) >= 0);
    const adviseThruTabInvalid = adviseThruBank.some(r => invalid.indexOf(r) >= 0);
    const confirmingTabInvalid = confirmingbank.some(r => invalid.indexOf(r) >= 0);
    let indexNo;
    if (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU) {
    const advisingTabInvalid = advisingBank.some(r => invalid.indexOf(r) >= 0);
    const localAdviseThroughTabInvalid = localAdviseThroughBank.some(r => invalid.indexOf(r) >= 0);
    if (issuingTabInvalid) {
      indexNo = Constants.NUMERIC_ZERO;
    } else if (!issuingTabInvalid && advisingTabInvalid) {
      indexNo = Constants.NUMERIC_ONE;
    } else if (!issuingTabInvalid && !advisingTabInvalid && adviseThruTabInvalid) {
      indexNo = Constants.NUMERIC_TWO;
    } else if (!issuingTabInvalid && !advisingTabInvalid && !adviseThruTabInvalid && localAdviseThroughTabInvalid) {
      indexNo = Constants.NUMERIC_THREE;
    } else {
      indexNo = Constants.NUMERIC_FOUR;
    }
    this.bankDetailsComponent.commonBankDetailsComponent.changeActiveIndex(indexNo);
  } else {
    if (issuingTabInvalid) {
      indexNo = Constants.NUMERIC_ZERO;
    } else if (!issuingTabInvalid && confirmingTabInvalid) {
      indexNo = Constants.NUMERIC_ONE;
    } else if (!issuingTabInvalid && adviseThruTabInvalid && !confirmingTabInvalid &&
      this.ruBankDetailsComponent.isConfirmingBankMandatory) {
        indexNo = Constants.NUMERIC_TWO;
    } else if (!issuingTabInvalid && adviseThruTabInvalid && !confirmingTabInvalid) {
      indexNo = Constants.NUMERIC_ONE;
    } else {
      indexNo = Constants.NUMERIC_THREE;
    }
    this.ruBankDetailsComponent.changeActiveIndex(indexNo);
  }
  }
  }
checkInvalidControl( invalid: any[]) {
  const controls = (this.commonData.getProductCode() === Constants.PRODUCT_CODE_IU ?
  this.inititationForm.controls[`bankDetailsSection`][`controls`] : this.inititationForm.controls[`ruBankDetailsSection`][`controls`] );
  for (const field in controls) {
    if (controls[field].invalid) {
        invalid.push(field);
    }
}
}
}
