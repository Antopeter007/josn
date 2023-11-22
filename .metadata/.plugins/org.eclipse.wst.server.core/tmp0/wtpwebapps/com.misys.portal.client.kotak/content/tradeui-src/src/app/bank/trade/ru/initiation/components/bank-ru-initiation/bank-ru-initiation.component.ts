import { LicenseService } from './../../../../../../common/services/license.service';
import { BankRuBankDetailsComponent } from './../bank-ru-bank-details/bank-ru-bank-details.component';
import { Constants } from './../../../../../../common/constants';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { IUCommonDataService } from './../../../../../../trade/iu/common/service/iuCommonData.service';
import { CommonDataService } from './../../../../../../common/services/common-data.service';
import { CommonService } from './../../../../../../common/services/common.service';
import { AuditService } from './../../../../../../common/services/audit.service';
import { ActionsComponent } from './../../../../../../common/components/actions/actions.component';
import { ReceivedUndertakingRequest } from './../../../../../../trade/ru/common/model/ReceivedUndertakingRequest';
import { ResponseService } from './../../../../../../common/services/response.service';
import { RUService } from './../../../../../../trade/ru/service/ru.service';
import { GeneratePdfService } from './../../../../../../common/services/generate-pdf.service';
import { TradeEventDetailsComponent } from './../../../../../../trade/common/components/event-details/event-details.component';
import { ReportingMessageDetailsComponent
 } from './../../../../../../bank/common/components/reporting-message-details/reporting-message-details.component';
import { TransactionDetailsComponent } from './../../../../../../bank/common/components/transaction-details/transaction-details.component';
import { InquiryConsolidatedChargesComponent
 } from './../../../../../../common/components/inquiry-consolidated-charges/inquiry-consolidated-charges.component';
import { BankRuGeneralDetailsComponent } from '../bank-ru-general-details/bank-ru-general-details.component';
import { BankApplicantBeneDetailsComponent } from '../bank-applicant-bene-details/bank-applicant-bene-details.component';
import { IUCommonAmountDetailsComponent } from './../../../../../../trade/iu/common/components/amount-details/amount-details.component';
import { RenewalDetailsComponent } from './../../../../../../trade/iu/initiation/components/renewal-details/renewal-details.component';
import { ReductionIncreaseComponent } from './../../../../../../trade/iu/initiation/components/reduction-increase/reduction-increase.component';
import { ShipmentDetailsComponent } from './../../../../../../trade/iu/initiation/components/shipment-details/shipment-details.component';
import { IuPaymentDetailsComponent } from './../../../../../../trade/iu/initiation/components/iu-payment-details/iu-payment-details.component';
import { IUCommonLicenseComponent } from './../../../../../../trade/iu/common/components/license/license.component';
import { ContractDetailsComponent } from './../../../../../../trade/iu/initiation/components/contract-details/contract-details.component';
import { UndertakingDetailsComponent
 } from './../../../../../../trade/iu/initiation/components/undertaking-details/undertaking-details.component';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { URLConstants } from './../../../../../../common//urlConstants';
import $ from 'jquery';
import { DatePipe } from '@angular/common';
import { validateWithCurrentDate } from '../../../../../../common/validators/common-validator';
import { CourierDetailsComponent } from './../../../../../../common/components/courier-details/courier-details.component';

const jqueryConst = $;

@Component({
  selector: 'fcc-ru-bank-initiation',
  templateUrl: './bank-ru-initiation.component.html',
  styleUrls: ['./bank-ru-initiation.component.scss']
})
export class BankRuInitiationComponent implements OnInit {

  ruInititationForm: UntypedFormGroup;
  rawValuesForm: UntypedFormGroup;
  contextPath: string;
  actionCode: string;
  private expDate: string;
  private finalRenewalExpDate: string;
  isSubmitEnabled = false;
  public viewMode = false;
  public mode: string;
  public tnxType;
  public jsonContent;
  public operation: string;
  public enableReauthPopup = false;
  public showForm = true;
  receivedUndertaking: ReceivedUndertakingRequest;
  responseMessage: string;
  public option;
  public bankDetails: string[] = [];
  isFormInvalid: boolean;
  public displayErrorDialog = false;
  public errorMessage: string;
  public errorTitle: string;
  hasCustomerAttach = false;
  hasBankAttach = false;



  @ViewChild(ActionsComponent)actionsComponent: ActionsComponent;
  @ViewChild(BankRuBankDetailsComponent) bankDetailsComponent: BankRuBankDetailsComponent;
  @ViewChild(TradeEventDetailsComponent) tradeEventDetailsComponent: TradeEventDetailsComponent;
  @ViewChild(ReportingMessageDetailsComponent) reportingMessageDetailsComponent: ReportingMessageDetailsComponent;
  @ViewChild(TransactionDetailsComponent) transactionDetailsComponent: TransactionDetailsComponent;
  @ViewChild(CourierDetailsComponent)
  courierDetailsComponent: CourierDetailsComponent;
  @ViewChild(InquiryConsolidatedChargesComponent)
  inquiryConsolidatedChargesComponent: InquiryConsolidatedChargesComponent;
  @ViewChild(BankRuGeneralDetailsComponent) bankRuGeneralDetailsComponent: BankRuGeneralDetailsComponent;
  @ViewChild(BankApplicantBeneDetailsComponent) bankApplicantBeneDetailsComponent: BankApplicantBeneDetailsComponent;
  @ViewChild(IUCommonAmountDetailsComponent) commonAmountDetailsComponent: IUCommonAmountDetailsComponent;
  @ViewChild(RenewalDetailsComponent) renewalDetailsComponent: RenewalDetailsComponent;
  @ViewChild(ReductionIncreaseComponent) reductionIncreaseComponent: ReductionIncreaseComponent;
  @ViewChild(ShipmentDetailsComponent) shipmentDetailsComponent: ShipmentDetailsComponent;
  @ViewChild(IuPaymentDetailsComponent) iuPaymentDetailsComponent: IuPaymentDetailsComponent;
  @ViewChild(IUCommonLicenseComponent) commonLicenseComponent: IUCommonLicenseComponent;
  @ViewChild(ContractDetailsComponent) contractDetailsComponent: ContractDetailsComponent;
  @ViewChild(UndertakingDetailsComponent) undertakingDetailsComponent: UndertakingDetailsComponent;


  constructor(protected fb: UntypedFormBuilder, protected activatedRoute: ActivatedRoute, protected router: Router,
              public commonDataService: IUCommonDataService, public commonData: CommonDataService,
              protected commonService: CommonService, protected auditService: AuditService,
              protected ruService: RUService, protected responseService: ResponseService,
              protected translate: TranslateService,  protected confirmationService: ConfirmationService,
              protected generatePdfService: GeneratePdfService, public el: ElementRef,
              public licenseService: LicenseService, public datePipe: DatePipe) { }

  ngOnInit() {
    this.contextPath = window[Constants.CONTEXT_PATH];
    this.actionCode = window[Constants.ACTION_CODE];
    let viewRefId;
    let viewTnxId;
    let masterOrTnx;
    let templateid;
    let subproductcode;
    this.activatedRoute.params.subscribe(paramsId => {
      this.viewMode = paramsId.viewMode;
      viewRefId = paramsId.refId;
      viewTnxId = paramsId.tnxId;
      this.mode = paramsId.mode;
      this.tnxType = paramsId.tnxType;
      this.option = paramsId.option;
      masterOrTnx = paramsId.masterOrTnx;
      templateid = paramsId.templateid;
      subproductcode = paramsId.subproductcode;
    });
    this.commonData.setProductCode(Constants.PRODUCT_CODE_RU);
    if (this.viewMode) {
      if (masterOrTnx === 'tnx') {
        this.commonService.getTnxDetails(viewRefId, viewTnxId, 'BR', '').subscribe(data => {
          this.jsonContent = data.transactionDetails as string[];
          this.commonDataService.setDisplayMode(Constants.MODE_VIEW);
          this.commonData.setDisplayMode(Constants.MODE_VIEW);
          this.commonData.setOption(this.option);
          this.commonDataService.setPreviewOption(this.option);
          this.commonData.setEntity(this.jsonContent.entity);
          this.commonDataService.setmasterorTnx(masterOrTnx);
          if (this.jsonContent.attachments && this.jsonContent.attachments.attachment !== '') {
            this.hasCustomerAttach = this.jsonContent.attachments.attachment.some(item => item.type === '01');
            this.hasBankAttach = this.jsonContent.attachments.attachment.some(item => item.type === '02');
          }
        });
      } else if (masterOrTnx === Constants.MASTER) {
        this.commonService.getMasterDetails(viewRefId, 'BR', '').subscribe(data => {
          this.jsonContent = data.masterDetails as string[];
          this.commonDataService.setDisplayMode(Constants.MODE_VIEW);
          this.commonData.setDisplayMode(Constants.MODE_VIEW);
          this.commonData.setOption(this.option);
          this.commonDataService.setPreviewOption(this.option);
          this.commonData.setEntity(this.jsonContent.entity);
          this.commonDataService.setmasterorTnx(masterOrTnx);
          this.commonData.setmasterorTnx(masterOrTnx);
          if (this.jsonContent.attachments && this.jsonContent.attachments.attachment !== '') {
            this.hasCustomerAttach = this.jsonContent.attachments.attachment.some(item => item.type === '01');
            this.hasBankAttach = this.jsonContent.attachments.attachment.some(item => item.type === '02');
          }
        });
      }
      this.commonData.setProductCode(Constants.PRODUCT_CODE_RU);
      this.commonService.getBankDetails().subscribe(data => {
        this.bankDetails = data as string[];
      });
    } else if (this.mode === Constants.MODE_DRAFT) {
        this.commonDataService.setMode(Constants.MODE_DRAFT);
        this.commonData.setMode(Constants.MODE_DRAFT);
        this.commonDataService.setViewComments(true);
        this.commonDataService.setDisplayMode('edit');
        this.commonDataService.setRefId(viewRefId);
        this.commonDataService.setTnxId(viewTnxId);
        this.commonService.getTnxDetails(viewRefId, viewTnxId, 'BR', this.actionCode).subscribe(data => {
        this.jsonContent = data.transactionDetails as string[];
        this.commonData.setEntity(this.jsonContent.entity);
        this.commonData.setRefId(viewRefId);
        this.commonData.setTnxId(viewTnxId);
      });
    } else if (this.mode === Constants.MODE_UNSIGNED) {
      this.viewMode = true;
      this.commonDataService.setRefId(viewRefId);
      this.commonDataService.setTnxId(viewTnxId);
      this.commonDataService.setMode(Constants.MODE_UNSIGNED);
      this.commonData.setMode(Constants.MODE_UNSIGNED);
      this.commonService.getTnxDetails(viewRefId, viewTnxId, 'BR', '').subscribe(data => {
        this.jsonContent = data.transactionDetails as string[];
        if (this.jsonContent.tnxTypeCode === null || this.jsonContent.tnxTypeCode === '') {
          this.jsonContent.tnxTypeCode = '01';
        }
        this.commonDataService.setDisplayMode('view');
        this.commonData.setDisplayMode('view');
        this.commonData.setRefId(viewRefId);
        this.commonData.setTnxId(viewTnxId);
      });
    } else {
    this.ruService.getRuDefaultValues(this.contextPath + URLConstants.RU_DEFAULT_VALUES, this.actionCode).subscribe(data => {
      this.jsonContent = data.ruDefaultValues as string[];
      if (this.jsonContent.tnxTypeCode === null || this.jsonContent.tnxTypeCode === '') {
      this.jsonContent.tnxTypeCode = '01';
      }
      this.commonData.setOption(Constants.SCRATCH);
      this.commonData.setRefId(this.jsonContent.refId);
      this.commonData.setTnxId(this.jsonContent.tnxId);
    });

  }
    this.createMainForm();

  }

   createMainForm() {
    return this.ruInititationForm = this.fb.group({});
  }
  addToForm(name: string, form: UntypedFormGroup) {
    this.ruInititationForm.setControl(name, form);
   }
  onSave() {
    if (!this.isFormInvalid) {
    this.showForm = false;
    this.actionsComponent.showProgressBar = true;
    if (this.commonDataService.getMode() === Constants.MODE_DRAFT && this.inquiryConsolidatedChargesComponent.charges.length !== 0) {
      this.inquiryConsolidatedChargesComponent.charges.forEach(charge => {
        charge.createdInSession = 'Y';
      });
    }
    this.transformToReceivedUndertaking();
    this.ruService.saveOrSubmitRU(this.contextPath + URLConstants.RU_SAVE,
      this.receivedUndertaking).subscribe(
      data => {
        this.setResponse(data);
        this.router.navigate(['response']);
      });
    }
   }

   onSubmit() {
    this.actionsComponent.showProgressBar = true;
    this.showForm = false;
    if (this.commonDataService.getMode() === Constants.MODE_DRAFT && this.inquiryConsolidatedChargesComponent.charges.length !== 0) {
      this.inquiryConsolidatedChargesComponent.charges.forEach(charge => {
        charge.createdInSession = 'Y';
      });
    }
    this.ruService.saveOrSubmitRU(this.contextPath + URLConstants.RU_SUBMIT,
    this.receivedUndertaking).subscribe(
           (         data: { response: string; }) => {
        this.setResponse(data);
        this.router.navigate(['response']);
    });
  }
  validateAllFields(mainForm: UntypedFormGroup) {
    this.validateDateFieldsWithCurrentDate();
    mainForm.markAllAsTouched();
    if (!this.ruInititationForm.valid) {
      this.findInvalidField();
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
          icon: 'pi pi-exclamation-triangle',
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
  }

   transformToReceivedUndertaking() {
    const amountDetailsSection = 'amountDetailsSection';
    const contractDetails = 'contractDetails';
    const ruGeneraldetailsSection = 'ruGeneraldetailsSection';
    const renewalDetailsSection = 'renewalDetailsSection';
    const reportingMessageDetailsComponent = 'reportingMessageDetailsComponent';
    const ruApplicantBeneDetailsForm = 'ruApplicantBeneDetailsForm';
    const undertakingDetailsForm = 'undertakingDetailsForm';
    const ruBankDetailsSection = 'ruBankDetailsSection';
    const redIncForm = 'redIncForm';
    const shipmentDetailsSection = 'shipmentDetailsSection';
    const paymentDetailsForm = 'paymentDetailsForm';
    const License = 'License';
    const chargeForm = 'chargeForm';

    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.ruInititationForm.getRawValue());
    this.receivedUndertaking = new ReceivedUndertakingRequest();
    this.receivedUndertaking.refId = this.jsonContent.refId;
    this.receivedUndertaking.applDate = this.jsonContent.applDate;
    this.receivedUndertaking.tnxTypeCode = this.jsonContent.tnxTypeCode;
    this.receivedUndertaking.tnxId = this.jsonContent.tnxId;
    this.receivedUndertaking.attids = this.commonDataService.getAttIds();
    this.receivedUndertaking.brchCode = '00001';
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
    if (this.receivedUndertaking.prodStatCode === Constants.APPROVED_PROD_STAT_CODE) {
    this.receivedUndertaking.prodStatCode = '03';
   }
    this.receivedUndertaking.mergeBankDetailsSection(this.rawValuesForm[ruBankDetailsSection], this.commonDataService);
    if (this.ruInititationForm.get(redIncForm).get(`bgVariationType`).value) {
      this.receivedUndertaking.mergeVariationDetails(this.rawValuesForm[redIncForm], this.commonDataService);
    }
    if(this.rawValuesForm[ruGeneraldetailsSection].advisingBankReference){
      this.receivedUndertaking.advisingBank.reference = this.rawValuesForm[ruGeneraldetailsSection].advisingBankReference;
    }
    if (this.rawValuesForm[License].listOfLicenses !== '') {
      this.receivedUndertaking.mergeLicensesSection(this.rawValuesForm[License]);
    }
    if (this.rawValuesForm[chargeForm].listOfCharges !== '') {
      this.receivedUndertaking.mergeChargesSection(this.rawValuesForm[chargeForm]);
  }
    if (this.rawValuesForm[Constants.SECTION_COURIER_DETAILS] !== '') {
      this.receivedUndertaking.merge(this.rawValuesForm[Constants.SECTION_COURIER_DETAILS]);
    }

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
  validateForm() {
    this.validateAllFields(this.ruInititationForm);
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
    this.generatePdfService.generateFile(Constants.PRODUCT_CODE_RU, this.bankDetails);
    if (this.tradeEventDetailsComponent) {
      this.tradeEventDetailsComponent.generatePdf(this.generatePdfService);
    }
    if (this.commonDataService.getPreviewOption() !== Constants.OPTION_SUMMARY) {
      this.generatePdfForNonSummaryOption();
   }
    if (this.commonDataService.getmasterorTnx() === Constants.MASTER) {
       this.generatePdfService.saveFile(this.jsonContent.refId, '');
     } else {
      this.generatePdfService.saveFile(this.jsonContent.refId, this.jsonContent.tnxId);
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
    if ((this.jsonContent.attachments && this.jsonContent.attachments !== '') || (this.commonData.getIsBankUser()
     && this.commonDataService.getmasterorTnx() !== Constants.MASTER)) {
        this.generatePdfService.setSectionHeader('KEY_HEADER_FILE_UPLOAD', true);
      }
    if (this.jsonContent.attachments && this.jsonContent.attachments !== '' && this.commonData.getIsBankUser()) {
      if (this.hasCustomerAttach) {
        this.generatePdfService.setSubSectionHeader('CUSTOMER_FILES_UPLOAD', true);
        headers  = [];
        headers.push(this.commonService.getTranslation('KEY_FILE_TITLE'));
        headers.push(this.commonService.getTranslation('FILE_NAME'));
        data  = [];
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
        headers  = [];
        headers.push(this.commonService.getTranslation('KEY_FILE_TITLE'));
        headers.push(this.commonService.getTranslation('FILE_NAME'));
        data  = [];
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
      if (this.transactionDetailsComponent) {
      this.transactionDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.bankApplicantBeneDetailsComponent) {
        this.bankApplicantBeneDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.bankRuGeneralDetailsComponent) {
        this.bankRuGeneralDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.bankDetailsComponent) {
        this.bankDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.commonAmountDetailsComponent) {
        this.commonAmountDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.renewalDetailsComponent) {
        this.renewalDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.reductionIncreaseComponent) {
        this.reductionIncreaseComponent.generatePdf(this.generatePdfService);
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
      if (this.undertakingDetailsComponent) {
        this.undertakingDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.commonLicenseComponent) {
        this.commonLicenseComponent.generatePdf(this.generatePdfService);
      }
      if (this.reportingMessageDetailsComponent) {
        this.reportingMessageDetailsComponent.generatePdf(this.generatePdfService);
        }

      if(this.courierDetailsComponent)
      {
        // Courier Details
        this.courierDetailsComponent.generatePdf(this.generatePdfService);
      }

        // Charge Details
      this.generatePdfForChargeDetails();
       // Attachment Table
      this.generatePdfTableForAttachments();
  }
  setResponse(data) {
    this.responseMessage = data.message;
    this.responseService.setResponseMessage(data.message);
    this.responseService.setRefId(data.refId);
    this.responseService.setTnxId(data.tnxId);
    this.responseService.setTnxType(data.tnxTypeCode);
    this.responseService.setProductCode(Constants.PRODUCT_CODE_RU);
    if (this.operation === Constants.OPERATION_SUBMIT || this.operation === Constants.OPERATION_SAVE) {
      this.responseService.setOption(data.option);
      this.responseService.setSubTnxType(data.subTnxTypeCode);
    }
  }

  handleEvents(operation) {
    this.operation = operation;
    if (operation === Constants.OPERATION_SAVE) {
      this.validateFormOnSaveOrReject('ON_SAVE_FIELD_ERROR');
      this.onSave();
    } else if (operation === Constants.OPERATION_SUBMIT &&
      this.ruInititationForm.get(Constants.SECTION_REPORTING_MESSGE_DETAILS).get('prodStatCode').value ===
      Constants.REJECT_PROD_STATUS_CODE) {
       this.validateFormOnSaveOrReject('FIELD_ERROR');
       if (!this.isFormInvalid) {
        this.transformToReceivedUndertaking();
        this.onSubmit();
       }
    } else if (operation === Constants.OPERATION_SUBMIT  && this.mode !== Constants.MODE_UNSIGNED) {
      this.validateForm();
      if (this.ruInititationForm.valid) {
        this.transformToReceivedUndertaking();
        this.onSubmit();
        }
    }  else if (operation === Constants.OPERATION_CANCEL) {
      this.onCancel();
    } else if (operation === Constants.OPERATION_EXPORT) {
      this.generatePdf();
    } else if (operation === Constants.OPERATION_HELP) {
      this.openHelp();
    }  else if (operation === Constants.OPERATION_PREVIEW) {
      this.openPreview();
    } else if (operation === Constants.OPERATION_SUBMIT && this.mode === Constants.MODE_UNSIGNED) {
      if ((!this.ruInititationForm.controls.reportingMessageDetailsComponent.get('adviseDate').valid)) {
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
      } else {
        this.transformForUnsignedMode();
        this.onSubmitRetrieveUnsigned();
      }
    }
  }

  openPreview() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    url += Constants.PREVIEW_POPUP_SCREEN;

    const refId = this.commonDataService.getRefId();
    const tnxId = this.commonDataService.getTnxId();
    const productCode = this.commonData.getProductCode();

    const myWindow = window.open(`${url}/?option=FULL&referenceid=${refId}&tnxid=${tnxId}&productcode=${productCode}`,
    Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
}

transformForUnsignedMode() {
    this.rawValuesForm = new UntypedFormGroup({});
    Object.assign(this.rawValuesForm, this.ruInititationForm.getRawValue());
    this.receivedUndertaking = new ReceivedUndertakingRequest();
    this.receivedUndertaking.tnxTypeCode = Constants.TYPE_NEW;
    this.receivedUndertaking.refId = this.commonDataService.getRefId();
    this.receivedUndertaking.tnxId = this.commonDataService.getTnxId();
    this.receivedUndertaking.merge(this.rawValuesForm[Constants.SECTION_REPORTING_MESSGE_DETAILS]);
}
onSubmitRetrieveUnsigned() {
  this.actionsComponent.showProgressBar = true;
  this.showForm = false;
  this.ruService.submitFromRetrieveUnsigned(this.contextPath + URLConstants.RU_SUBMIT_UNSIGNED,
     this.receivedUndertaking).subscribe(
    data => {
      this.setResponse(data);
      this.router.navigate(['response']);
    }
  );
  }

  setConfInstValue(value) {
    this.bankDetailsComponent.checkConfirmingBankMandatory(value);
    this.commonAmountDetailsComponent.commonAmountDetailsChildComponent.checkConfirmingChargeManadatory(value);
  }

  openHelp() {
    const host = window.location.origin;
    let url = host + this.commonService.getBaseServletUrl();
    const userLanguage = this.commonService.getUserLanguage();
    const accessKey = Constants.HELP_RU_INITIATION;
    url += URLConstants.ONLINE_HELP;
    url += `/?helplanguage=${userLanguage}`;
    url += `&accesskey=${accessKey}`;
    const myWindow = window.open(url, Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
    myWindow.focus();
  }

  private findInvalidField() {
    const invalid = [];
    const issuingBank = [Constants.ISSUINGBANKTYPECODE, Constants.ISSUINGBANKSWIFTCODE, Constants.ISSUINGBANKNAME,
                         Constants.ISSUINGBANKADDRESSLINE1, Constants.ISSUINGBANKADDRESSLINE2, Constants.ISSUINGBANKDOM,
                         Constants.ISSUINGBANKADDRESSLINE4];
    const adviseThruBank = [Constants.ADVISETHRUSWIFTCODE, Constants.ADVISETHRUBANKNAME, Constants.ADVISETHRUBANKADDRESSLINE1,
                            Constants.ADVISETHRUBANKADDRESSLINE2, Constants.ADVISETHRUBANKDOM, Constants.ADVISETHRUBANKADDRESSLINE4];
    const confirmingbank = [Constants.CONFIRMINGSWIFTCODE, Constants.CONFIRMINGBANKNAME, Constants.CONFIRMINGBANKADDRESSLINE1,
                            Constants.CONFIRMINGBANKADDRESSLINE2, Constants.CONFIRMINGBANKDOM, Constants.CONFIRMINGBANKADDRESSLINE4];
    const controls = this.ruInititationForm.controls[`ruBankDetailsSection`][`controls`];
    for (const field in controls) {
        if (controls[field].invalid) {
            invalid.push(field);
        }
    }
    if (invalid.length !== 0) {
      const issuingTabInvalid = issuingBank.some(r => invalid.indexOf(r) >= 0);
      const adviseThruTabInvalid = adviseThruBank.some(r => invalid.indexOf(r) >= 0);
      const confirmingabInvalid = confirmingbank.some(r => invalid.indexOf(r) >= 0);
      let indexNo;
      if (issuingTabInvalid) {
        indexNo = Constants.NUMERIC_ZERO;
      } else if (!issuingTabInvalid && confirmingabInvalid) {
        indexNo = Constants.NUMERIC_ONE;
      } else if (!issuingTabInvalid && adviseThruTabInvalid && !confirmingabInvalid) {
        indexNo = Constants.NUMERIC_TWO;
      } else {
        indexNo = Constants.NUMERIC_THREE;
      }
      this.bankDetailsComponent.changeActiveIndex(indexNo);
    }
  }
  resetRenewalSection() {
    if (this.renewalDetailsComponent) {
      this.renewalDetailsComponent.ngOnInit();
    }
  }
  updateProdStatForSections(prodStatCode) {
    this.isSubmitEnabled = (prodStatCode !== '02');
    if (prodStatCode === '01') {
      this.commonData.isProdStatReject = true;
      this.reportingMessageDetailsComponent.reportingMessageDetailsSection
        .get('boRefId').clearValidators();
      this.reportingMessageDetailsComponent.reportingMessageDetailsSection
        .get('boRefId').disable();
    } else if (prodStatCode === '04') {
      this.reportingMessageDetailsComponent.reportingMessageDetailsSection
        .get('boRefId').enable();
      this.reportingMessageDetailsComponent.reportingMessageDetailsSection
        .get('prodStatCode').setValidators([Validators.required]);
      this.reportingMessageDetailsComponent.reportingMessageDetailsSection
        .get('boRefId').setValidators([Validators.required, Validators.maxLength(Constants.LENGTH_16)]);
    }
  }
  updateAdviseDate(updatedAdviseDate) {
    if (this.transactionDetailsComponent) {
    this.transactionDetailsComponent.adviseDate = updatedAdviseDate;
    }
  }
  setExpiryDateForExtension(expiryDateExt) {
    if (expiryDateExt !== '' && expiryDateExt !== null) {
        this.renewalDetailsComponent.commonRenewalDetails.setFinalExpiryDate('bg');
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
      }
      this.setMaxDate();
    }
  }
  setExpDate(expDate) {
    if (expDate !== '' && expDate !== null) {
     let expiryDate = expDate;
     if (expiryDate !== '' && expiryDate != null) {
        expiryDate = this.commonService.getDateObject(expiryDate);
      }
     this.expDate = expiryDate;
     this.setMaxDate();
    }
  }

  setMaxDate() {
    let form ;
    let renewalExpDate;
    let expDate;
    let firstDate;
    form = this.reductionIncreaseComponent;
    if (this.commonDataService.getExpDateType() !== '02') {
      this.finalRenewalExpDate = '';
    }
    renewalExpDate = this.finalRenewalExpDate;
    expDate = this.expDate;
    firstDate = form.redIncForm.get('bgVariationFirstDate') !== null ? form.redIncForm.get('bgVariationFirstDate').value : '';
    const renewalDetailSectionControl = this.ruInititationForm.get(Constants.SECTION_RENEWAL_DETAILS);
    if ((renewalExpDate === undefined || renewalExpDate === '')
    && this.commonDataService.getExpDateType() === '02') {
        renewalExpDate = ( renewalDetailSectionControl ?  renewalDetailSectionControl.get('bgFinalExpiryDate').value : '');
        renewalExpDate = renewalExpDate !== '' ? this.commonService.getDateObject(renewalExpDate) : '';
      }
    if (firstDate !== '' && firstDate != null) {
      firstDate = this.commonService.getDateObject(firstDate);
      firstDate = Date.parse(this.datePipe.transform(firstDate , Constants.DATE_FORMAT));
    }
    this.setMaximumFirstDateValidation(renewalExpDate, expDate, form, firstDate);
}

setMaximumFirstDateValidation(renewalExpDate: any, expDate: any, form: any, firstDate: string) {
  if (expDate === undefined || expDate === '') {
    expDate = this.ruInititationForm.get(Constants.SECTION_RU_GENERAL_DETAILS).get('expDate').value;
    expDate = expDate !== '' ? this.commonService.getDateObject(expDate) : '';
  }
  const formGroup = form.redIncForm;
  if (renewalExpDate !== '' && renewalExpDate !== undefined && renewalExpDate !== null) {
      this.commonService.maxDate = renewalExpDate;
      this.commonService.expiryDateType = Constants.EXTENSION_EXPIRY_TYPE ;
      renewalExpDate = Date.parse(this.datePipe.transform(renewalExpDate , Constants.DATE_FORMAT));
      this.commonService.validateDatewithExpiryDate(formGroup, 'bg');
      this.commonService.setMaxFirstDateValidations(firstDate, renewalExpDate, formGroup, 'bg',
                              Constants.EXTENSION_EXPIRY_TYPE);
  } else if (expDate !== '' && expDate !== undefined && expDate !== null) {
      this.commonService.maxDate = expDate;
      this.commonService.expiryDateType = Constants.EXPIRY_TYPE ;
      expDate = Date.parse(this.datePipe.transform(expDate , Constants.DATE_FORMAT));
      this.commonService.validateDatewithExpiryDate(formGroup, 'bg');
      this.commonService.setMaxFirstDateValidations(firstDate, expDate, formGroup, 'bg', Constants.EXPIRY_TYPE);
  }
}

public setVariationCurrCode(currCodeAndType: string) {
  if (currCodeAndType !== '' && currCodeAndType !== null) {
    const currCode = currCodeAndType.split(',')[0];
    const undertakingType = currCodeAndType.split(',')[1];
    let form;

    if (undertakingType === 'bg') {
      form = this.reductionIncreaseComponent;
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
    if (undertakingType === Constants.UNDERTAKING_TYPE_IU && this.reductionIncreaseComponent &&
    this.ruInititationForm.get(Constants.SECTION_INCR_DECR).get('bgVariationType').value) {
        this.reductionIncreaseComponent.commonReductionIncreaseChildComponent.validateForNullTnxAmtCurrencyField();
        this.reductionIncreaseComponent.commonReductionIncreaseChildComponent.reCalculateVariationAmount();
  }
}
}

  private validateDateFieldsWithCurrentDate() {
    const format = this.commonService.getUserLanguage() === Constants.LANGUAGE_US ? Constants.DATE_FORMAT : Constants.DATE_FORMAT_DMY;
    const currentDate = this.datePipe.transform(new Date(), format);

    if (this.bankRuGeneralDetailsComponent.ruGeneraldetailsSection.get('expDateTypeCode').value === Constants.CODE_02) {
      this.ruInititationForm.controls.ruGeneraldetailsSection.get('expDate').setValidators([validateWithCurrentDate(currentDate, true)]);
      this.ruInititationForm.controls.ruGeneraldetailsSection.get('expDate').updateValueAndValidity();
    } else {
      if (this.ruInititationForm.controls.ruGeneraldetailsSection.get('approxExpiryDate').value !== null &&
      this.ruInititationForm.controls.ruGeneraldetailsSection.get('approxExpiryDate').value !== ''
      ) {
      this.ruInititationForm.controls.ruGeneraldetailsSection.get('approxExpiryDate').setValidators(
        [validateWithCurrentDate(currentDate, false)]);
      this.ruInititationForm.controls.ruGeneraldetailsSection.get('approxExpiryDate').updateValueAndValidity();
      }
    }
    if (this.renewalDetailsComponent && this.renewalDetailsComponent.renewalDetailsSection.get('bgRenewalType').value) {
      this.ruInititationForm.controls.renewalDetailsSection.get('bgFinalExpiryDate').setValidators(
          [validateWithCurrentDate(currentDate, true)]);
      this.ruInititationForm.controls.renewalDetailsSection.get('bgFinalExpiryDate').updateValueAndValidity();
      if (this.ruInititationForm.controls.renewalDetailsSection.get('bgRenewalCalendarDate')) {
          this.ruInititationForm.controls.renewalDetailsSection.get('bgRenewalCalendarDate').setValidators(
            [validateWithCurrentDate(currentDate, true)]);
          this.ruInititationForm.controls.renewalDetailsSection.get('bgRenewalCalendarDate').updateValueAndValidity();
          }
    }
  }

  private validateFormOnSaveOrReject(popMessage: string) {
    this.isFormInvalid = false;
    let boCommontInvalid = false;
    if (this.ruInititationForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryAbbvName').value !== null &&
    this.ruInititationForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryAbbvName').value !== ''
    ) {
    const invalidControl = this.commonService.OnSaveFormValidation(this.ruInititationForm);
    this.ruInititationForm.controls.reportingMessageDetailsComponent.get(`boComment`).markAllAsTouched();
    if (this.ruInititationForm.controls.reportingMessageDetailsComponent.get(`prodStatCode`) &&
    this.ruInititationForm.controls.reportingMessageDetailsComponent.get(`prodStatCode`).value === Constants.REJECT_PROD_STATUS_CODE &&
    this.ruInititationForm.controls.reportingMessageDetailsComponent.get(`boComment`).invalid) {
       boCommontInvalid = true;
    }
    if (invalidControl || boCommontInvalid) {
      this.isFormInvalid = true;
      this.findInvalidField();
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
} else {
  this.displayErrorDialog = true;
  this.isFormInvalid = true;
  this.translate.get('ERROR_TITLE').subscribe((value: string) => {
    this.errorTitle = value;
  });
  this.translate.get('BENEFICIARY_MANDATORY_ERROR').subscribe((value: string) => {
    this.errorMessage = value;
  });
}
}
}
