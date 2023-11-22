import { IuPaymentDetailsComponent } from '../../trade/iu/initiation/components/iu-payment-details/iu-payment-details.component';
import { ShipmentDetailsComponent } from '../../trade/iu/initiation/components/shipment-details/shipment-details.component';
import { ReductionIncreaseComponent } from './../../trade/iu/initiation/components/reduction-increase/reduction-increase.component';
import { CuBankDetailsComponent } from './../../trade/iu/initiation/components/cu-bank-details/cu-bank-details.component';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './../../common/services/common.service';
import { CommonDataService } from './../../common/services/common-data.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Constants } from './../../common/constants';
import { IssuedUndertakingRequest } from './../../trade/iu/common/model/IssuedUndertakingRequest';
import { ActionsComponent } from './../../common/components/actions/actions.component';
import { validateWithCurrentDate, validateSwiftCharSet } from './../../common/validators/common-validator';
import { DatePipe } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { IUCommonDataService } from './../../trade/iu/common/service/iuCommonData.service';
import { IUService } from './../../trade/iu/common/service/iu.service';
import { CuRenewalDetailsComponent } from './../../trade/iu/initiation/components/cu-renewal-details/cu-renewal-details.component';
import { IUCommonAmountDetailsComponent } from './../../trade/iu/common/components/amount-details/amount-details.component';
import { BankDetailsComponent } from './../../trade/iu/initiation/components/bank-details/bank-details.component';
import { BankRuBankDetailsComponent } from './../trade/ru/initiation/components/bank-ru-bank-details/bank-ru-bank-details.component';
import { RenewalDetailsComponent } from './../../trade/iu/initiation/components/renewal-details/renewal-details.component';
import { IUCommonApplicantDetailsComponent
 } from './../../trade/iu/common/components/applicant-details-form/applicant-details-form.component';
import { ContractDetailsComponent } from './../../trade/iu/initiation/components/contract-details/contract-details.component';
import { UndertakingDetailsComponent } from './../../trade/iu/initiation/components/undertaking-details/undertaking-details.component';
import { GeneratePdfService } from './../../common/services/generate-pdf.service';
import { IUGeneralDetailsComponent } from './../../trade/iu/initiation/components/iu-general-details/iu-general-details.component';
import { CuGeneralDetailsComponent } from '../../trade/iu/initiation/components/cu-general-details/cu-general-details.component';
import { CuBeneficiaryDetailsComponent
 } from '../../trade/iu/initiation/components/cu-beneficiary-details/cu-beneficiary-details.component';
import { CuAmountDetailsComponent } from './../../trade/iu/initiation/components/cu-amount-details/cu-amount-details.component';
import { CuUndertakingDetailsComponent
 } from '../../trade/iu/initiation/components/cu-undertaking-details/cu-undertaking-details.component';
import { ReauthDialogComponent } from './../../common/components/reauth-dialog/reauth-dialog.component';
import { BankInstructionsComponent } from './../../trade/iu/initiation/components/bank-instructions/bank-instructions.component';
import { IUCommonLicenseComponent } from './../../trade/iu/common/components/license/license.component';
import { IUCommonReturnCommentsComponent } from './../../trade/iu/common/components/return-comments/return-comments.component';
import { ReportingMessageDetailsComponent } from '../common/components/reporting-message-details/reporting-message-details.component';
import { MessageDetailsComponent } from '../common/components/message-details/message-details.component';
import { TransactionDetailsComponent } from '../common/components/transaction-details/transaction-details.component';
import { FileUploadComponent } from './../../common/components/fileupload-component/fileupload.component';
import { InquiryConsolidatedChargesComponent
 } from './../../common/components/inquiry-consolidated-charges/inquiry-consolidated-charges.component';
import { ResponseService } from './../../common/services/response.service';
import { ValidationService } from '../../common/validators/validation.service';
import { ReturnCommentsComponent } from '../../common/components/return-comments/return-comments.component';
import { TradeEventDetailsComponent } from './../../trade/common/components/event-details/event-details.component';
import { UndertakingGeneralDetailsComponent } from '../../trade/iu/initiation/components/iu-undertaking-general-details/iu-undertaking-general-details.component';
import { URLConstants } from './../../common//urlConstants';
import { IUCommonBeneficiaryDetailsComponent } from '../../trade/iu/common/components/beneficiary-details-form/beneficiary-details-form.component';
import $ from 'jquery';
import { ReceivedUndertakingRequest } from '../../trade/ru/common/model/ReceivedUndertakingRequest';
import { RUService } from '../../trade/ru/service/ru.service';
import { BankRuGeneralDetailsComponent } from '../trade/ru/initiation/components/bank-ru-general-details/bank-ru-general-details.component';
import { BankApplicantBeneDetailsComponent } from '../trade/ru/initiation/components/bank-applicant-bene-details/bank-applicant-bene-details.component';
import { CuReductionIncreaseComponent } from '../../trade/iu/initiation/components/cu-reduction-increase/cu-reduction-increase.component';
import { CourierDetailsComponent } from './../../common/components/courier-details/courier-details.component';
const jqueryConst = $;

@Component({
    selector: 'fcc-common-reporting-from-existing',
    templateUrl: './reporting-from-existing.component.html',
    styleUrls: ['./reporting-from-existing.component.scss']
})
export class ReportingFromExistingComponent implements OnInit {
    public jsonContent;
    reportingFromExistingForm: UntypedFormGroup;
    rawValuesForm: UntypedFormGroup;
    protected licenseValidError: string;
    issuedundertaking: IssuedUndertakingRequest;
    receivedUndertaking: ReceivedUndertakingRequest;
    public showForm = true;
    contextPath: string;
    public luStatus = false;
    viewMode = false;
    public mode;
    public tnxType;
    operation: string;
    unsignedFormValid: boolean;
    hasCustomerAttach = false;
    hasBankAttach = false;
    isExistingDraftMenu = false;
    isSubmitEnabled = false;
    currentDate;

    @ViewChild(ActionsComponent) actionsComponent: ActionsComponent;
    @ViewChild(CuRenewalDetailsComponent) cuRenewalDetailsChildComponent: CuRenewalDetailsComponent;
    @ViewChild(IUCommonAmountDetailsComponent) amountDetailsChildComponent: IUCommonAmountDetailsComponent;
    @ViewChild(BankDetailsComponent) bankDetailsComponent: BankDetailsComponent;
    @ViewChild(BankRuBankDetailsComponent) bankRuDetailsComponent: BankRuBankDetailsComponent;
    @ViewChild(RenewalDetailsComponent) renewalDetailsComponent: RenewalDetailsComponent;
    @ViewChild(IUCommonApplicantDetailsComponent) applicantDetailsComponent: IUCommonApplicantDetailsComponent;
    @ViewChild(ContractDetailsComponent) contractDetailsComponent: ContractDetailsComponent;
    @ViewChild(UndertakingDetailsComponent) undertakingChildComponent: UndertakingDetailsComponent;
    @ViewChild(UndertakingGeneralDetailsComponent)
    undertakingGeneralDetailsChildComponent: UndertakingGeneralDetailsComponent;
    @ViewChild(IUGeneralDetailsComponent) iuGeneraldetailsChildComponent: IUGeneralDetailsComponent;
    @ViewChild(CuGeneralDetailsComponent) luGeneraldetailsChildComponent: CuGeneralDetailsComponent;
    @ViewChild(CuBeneficiaryDetailsComponent) cuBeneficaryDetailsChildComponent: CuBeneficiaryDetailsComponent;
    @ViewChild(CuAmountDetailsComponent) CuAmountDetailsChildComponent: CuAmountDetailsComponent;
    @ViewChild(CuBankDetailsComponent) luBankDetailsChildComponent: CuBankDetailsComponent;
    @ViewChild(CuUndertakingDetailsComponent) cuUndertakingChildComponent: CuUndertakingDetailsComponent;
    @ViewChild(ReauthDialogComponent) reauthDialogComponent: ReauthDialogComponent;
    @ViewChild(BankInstructionsComponent) bankInstructionsComponent: BankInstructionsComponent;
    @ViewChild(IUCommonLicenseComponent) iuLicenseComponent: IUCommonLicenseComponent;
    @ViewChild(IUCommonReturnCommentsComponent) iuCommonReturnCommentsComponent: IUCommonReturnCommentsComponent;
    @ViewChild(ReportingMessageDetailsComponent) reportingMessageDetailsComponent: ReportingMessageDetailsComponent;
    @ViewChild(TransactionDetailsComponent) transactionDetailsComponent: TransactionDetailsComponent;
    @ViewChild(FileUploadComponent) fileUploadComponent: FileUploadComponent;
    @ViewChild(CourierDetailsComponent) courierDetailsComponent: CourierDetailsComponent;
    @ViewChild(InquiryConsolidatedChargesComponent)
      inquiryConsolidatedChargesComponent: InquiryConsolidatedChargesComponent;
    @ViewChild(ReturnCommentsComponent) returnCommentsComponent: ReturnCommentsComponent;
    @ViewChild(TradeEventDetailsComponent) tradeEventDetailsComponent: TradeEventDetailsComponent;
    @ViewChild(IUCommonBeneficiaryDetailsComponent) beneficiaryDetailsComponent: IUCommonBeneficiaryDetailsComponent;
    @ViewChild(BankRuGeneralDetailsComponent) bankRuGeneralDetailsComponent: BankRuGeneralDetailsComponent;
    @ViewChild(BankApplicantBeneDetailsComponent) bankApplicantBeneDetailsComponent: BankApplicantBeneDetailsComponent;
    @ViewChild(ReductionIncreaseComponent) iuReductionIncreaseComponent: ReductionIncreaseComponent;
    @ViewChild(CuReductionIncreaseComponent) cuReductionIncreaseComponent: CuReductionIncreaseComponent;
    @ViewChild(IuPaymentDetailsComponent) iuPaymentDetailsComponent: IuPaymentDetailsComponent;
    @ViewChild(ShipmentDetailsComponent) shipmentDetailsComponent: ShipmentDetailsComponent;
    @ViewChild(MessageDetailsComponent) messageDetailsComponent: MessageDetailsComponent;

    public bankDetails: string[] = [];
    constructor(protected activatedRoute: ActivatedRoute, protected translate: TranslateService, protected commonService: CommonService,
                public commonDataService: CommonDataService, protected fb: UntypedFormBuilder,
                protected router: Router, protected datePipe: DatePipe,
                protected confirmationService: ConfirmationService,
                public iuCommonDataService: IUCommonDataService,
                protected iuService: IUService, protected generatePdfService: GeneratePdfService,
                protected responseService: ResponseService,
                protected validationService: ValidationService,
                protected ruService: RUService,
                public el: ElementRef) { }

    ngOnInit() {
        const CONTEXT_PATH = 'CONTEXT_PATH';
        this.contextPath = window[CONTEXT_PATH];
        this.commonDataService.disableTnx = true;
        this.currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
        const ProductCode = this.commonDataService.getProductCode();
        let viewRefId;
        let viewTnxId;
        let option;
        let mode;
        let masterOrTnx;
        this.activatedRoute.params.subscribe(paramsId => {
            viewRefId = paramsId.refId;
            viewTnxId = paramsId.tnxId;
            mode = paramsId.mode;
            this.mode = mode;
            option = paramsId.option;
            masterOrTnx = paramsId.masterOrTnx;
            this.viewMode = paramsId.viewMode;
            this.tnxType = paramsId.tnxType;
        });
        if (this.viewMode) {
          if (masterOrTnx === 'tnx') {
            this.commonService.getTnxDetails(viewRefId, viewTnxId, ProductCode , '').subscribe(data => {
              this.jsonContent = data.transactionDetails as string[];
              this.commonDataService.setDisplayMode('view');
              this.commonDataService.setProdStatCode(this.jsonContent[`prodStatCode`]);
              this.iuCommonDataService.setDisplayMode('view');
              this.commonDataService.setOption(option);
              this.commonDataService.setmasterorTnx('tnx');
              this.commonDataService.setViewComments(true);
              this.commonDataService.disableTnx = (this.jsonContent[`tnxTypeCode`] === Constants.TYPE_REPORTING &&
                                        option === Constants.OPTION_SUMMARY);
              if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
                this.iuCommonDataService.setLUStatus(true);
                this.luStatus = true;
              }
              if (this.jsonContent.attachments && this.jsonContent.attachments.attachment !== '') {
                this.hasCustomerAttach = this.jsonContent.attachments.attachment.some(item => item.type === '01');
                this.hasBankAttach = this.jsonContent.attachments.attachment.some(item => item.type === '02');
              }
            });
            this.commonService.getBankDetails().subscribe(data => {
                this.bankDetails = data as string[];
              });
          } else if (masterOrTnx === 'master') {
            this.commonService.getMasterDetails(viewRefId, ProductCode, '').subscribe(data => {
              this.jsonContent = data.masterDetails as string[];
              this.commonDataService.setDisplayMode('view');
              this.iuCommonDataService.setDisplayMode('view');
              this.commonDataService.setmasterorTnx('master');
              this.commonDataService.setOption(option);
              this.commonDataService.disableTnx = false;
              if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
                this.iuCommonDataService.setLUStatus(true);
                this.luStatus = true;
              }
              if (this.jsonContent.attachments && this.jsonContent.attachments.attachment !== '') {
                this.hasCustomerAttach = this.jsonContent.attachments.attachment.some(item => item.type === '01');
                this.hasBankAttach = this.jsonContent.attachments.attachment.some(item => item.type === '02');
              }
            });
            this.commonService.getBankDetails().subscribe(data => {
              this.bankDetails = data as string[];
            });
          }
        } else if (mode === Constants.MODE_DRAFT) {
            this.commonDataService.setRefId(viewRefId);
            this.iuCommonDataService.setRefId(viewRefId);
            this.commonDataService.setTnxId(viewTnxId);
            this.iuCommonDataService.setTnxId(viewTnxId);
            this.iuCommonDataService.setMode(Constants.MODE_DRAFT);
            this.commonService.getTnxDetails(viewRefId, viewTnxId, ProductCode, '').subscribe(data => {
              this.jsonContent = data.transactionDetails as string[];
              this.isExistingDraftMenu = (this.jsonContent.tnxTypeCode === Constants.TYPE_REPORTING
                && this.commonDataService.getMode() === Constants.MODE_DRAFT);
              this.commonDataService.setMode(Constants.MODE_DRAFT);
              this.commonDataService.disableTnx = ((this.jsonContent[`tnxTypeCode`] === Constants.TYPE_REPORTING
              || this.isExistingDraftMenu) && this.jsonContent[`prodStatCode`] !== '08' && this.jsonContent[`prodStatCode`] !== '31'
              && this.jsonContent[`prodStatCode`] !== '09' && this.jsonContent[`prodStatCode`] !== '78' &&
               this.jsonContent[`prodStatCode`] !== '79');
              this.commonDataService.setViewComments(true);
              if (this.jsonContent.purpose != null && (this.jsonContent.purpose === '02' || this.jsonContent.purpose === '03')) {
                this.iuCommonDataService.setLUStatus(true);
                this.luStatus = true;
              }
              this.iuCommonDataService.setSubProdCode(this.jsonContent.subProductCode, ProductCode);
            });
          } else if (mode === Constants.MODE_UNSIGNED) {
            this.viewMode = true;
            this.commonDataService.setRefId(viewRefId);
            this.commonDataService.setTnxId(viewTnxId);
            this.commonDataService.setDisplayMode(Constants.MODE_VIEW);
            this.iuCommonDataService.setDisplayMode(Constants.MODE_VIEW);
            this.commonDataService.setMode(Constants.MODE_UNSIGNED);
            this.commonService.getTnxDetails(viewRefId, viewTnxId, ProductCode, '').subscribe(data => {
              this.jsonContent = data.transactionDetails as string[];
              this.commonDataService.disableTnx = (this.jsonContent[`prodStatCode`] !== '08' && this.jsonContent[`prodStatCode`] !== '31'
              && this.jsonContent[`prodStatCode`] !== '09'  && this.jsonContent[`prodStatCode`] !== '78' &&
              this.jsonContent[`prodStatCode`] !== '79');
              if (this.jsonContent.purpose != null && (this.jsonContent.purpose === '02' || this.jsonContent.purpose === '03')) {
                this.iuCommonDataService.setLUStatus(true);
                this.luStatus = true;
              }
            });
          } else {
          this.commonService.getMasterDetails(viewRefId, ProductCode, '').subscribe(data => {
            this.jsonContent = data.masterDetails as string[];
            if (this.jsonContent.purpose != null && this.jsonContent.purpose !== '' && this.jsonContent.purpose !== '01') {
                this.iuCommonDataService.setLUStatus(true);
                this.luStatus = true;
            }
            this.commonDataService.disableTnx = (this.jsonContent[`prodStatCode`] !== '78' &&
            this.jsonContent[`prodStatCode`] !== '79' && this.jsonContent[`prodStatCode`] !== '98');
            this.iuCommonDataService.setSubProdCode(this.jsonContent.subProductCode, ProductCode);
        });
        }
        this.createMainForm();
    }

    createMainForm() {
        return this.reportingFromExistingForm = this.fb.group({});
    }

    disableTnxDetails(controlName: string) {
        const skipControl = [Constants.SECTION_REPORTING_MESSGE_DETAILS, Constants.SECTION_FILE_UPLOAD,
            Constants.SECTION_CHARGES, Constants.SECTION_TRANSACTION_DETAILS, Constants.SECTION_COURIER_DETAILS];
        if (this.reportingFromExistingForm.get(controlName) && !(skipControl.includes(controlName))) {
          this.reportingFromExistingForm.get(controlName).disable();
        }
        if (controlName === 'amountDetailsSection') {
        const enableAmountSection = ['07', '04', '05', '13', '11', '12', '14', '15', '81', '84', '26', '24'];
        if (enableAmountSection.includes(this.jsonContent[`prodStatCode`]) && (this.commonDataService.getMode() === Constants.MODE_DRAFT)) {
          this.enableAmountSectionFields();
        }
      }

      }
    /**
     * After a form is initialized, we link it to our main form
     */
    addToForm(name: string, form: UntypedFormGroup) {
        this.reportingFromExistingForm.setControl(name, form);
        if (this.commonDataService.disableTnx) {
            this.disableTnxDetails(name);
          }
        if (name === 'ruApplicantBeneDetailsForm' && this.commonDataService.getProductCode() === 'BG') {
            this.disableApplicantDetailsForBG();
        } else if (name === 'ruApplicantBeneDetailsForm' && this.commonDataService.getProductCode() === 'BR') {
          this.disablBenifDetailsForBR();
      }
    }

    handleEvents(operation) {
        this.operation = operation;
        if (operation === Constants.OPERATION_SAVE) {
            this.onSave();
        } else if (operation === Constants.OPERATION_SUBMIT && this.mode !== Constants.MODE_UNSIGNED) {
            this.validateForm();
            this.handleDescissions('SUBMIT');
            if (this.reportingFromExistingForm.valid && this.licenseValidError === undefined
              && this.commonDataService.getProductCode() === 'BG') {
                this.transformToIssuedUndertaking();
                this.onSubmit();
            } else if (this.reportingFromExistingForm.valid && this.licenseValidError === undefined
              && this.commonDataService.getProductCode() === 'BR') {
                this.transformToReceivedUndertaking();
                this.onSubmit();
            }
        } else if (operation === Constants.OPERATION_CANCEL) {
            this.onCancel();
        } else if (operation === Constants.OPERATION_PREVIEW) {
            this.openPreview();
        } else if (operation === Constants.OPERATION_EXPORT) {
            this.generatePdf();
        } else if (operation === Constants.OPERATION_SUBMIT && this.mode === Constants.MODE_UNSIGNED) {
          this.validateFormOnUnsignedSubmit();
          if (this.unsignedFormValid) {
            this.transformForUnsignedMode();
            this.onSubmitRetrieveUnsigned();
          }
        }
    }
    updateProdStatForDecision(prodstatcode) {
      this.isSubmitEnabled = (prodstatcode !== Constants.CODE_02);
    }
    updateProdStatForSections(statCode) {
      if (this.reportingMessageDetailsComponent) {
        this.reportingMessageDetailsComponent.onProdStatChange(statCode, '');
        if (this.commonDataService.disableTnx) {
           this.disableUndertakingSections();
           if (this.luStatus) {
               this.disableCounterUndertakingSections();
           }
          } else {
            this.enableUndertakingSections();
            if (this.luStatus) {
                this.enableCounterUndertakingSections();
            }
          }
        const correctProdStatus = (this.commonDataService.getProdStatCode() === '07' ||
        this.commonDataService.getProdStatCode() === '04' || this.commonDataService.getProdStatCode() === '05' ||
        this.commonDataService.getProdStatCode() === '13' || this.commonDataService.getProdStatCode() === '11' ||
        this.commonDataService.getProdStatCode() === '12' || this.commonDataService.getProdStatCode() === '14' ||
        this.commonDataService.getProdStatCode() === '15' || this.commonDataService.getProdStatCode() === '81' ||
        this.commonDataService.getProdStatCode() === '84' || this.commonDataService.getProdStatCode() === '26' ||
        this.commonDataService.getProdStatCode() === '24');
        if (this.commonDataService.disableTnx && correctProdStatus) {
              this.enableAmountSectionFields();
          }
        }
      if ((statCode === '08' || statCode === '31') && this.undertakingChildComponent) {
        this.undertakingChildComponent.commonUndertakingDetailsComponent.updateMOAmendStatus(true);
      } else {
        this.undertakingChildComponent.commonUndertakingDetailsComponent.updateMOAmendStatus(false);
      }
      if (this.commonDataService.getProductCode() === 'BR') {
       if (this.commonDataService.getProdStatCode() === '42' && this.commonDataService.disableTnx
      && !this.commonService.compareExpirydatewithCurrentDate(this.jsonContent.expDate)) {
        this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get('expDate').enable();
      }
    } else if (this.commonDataService.getProductCode() === 'BG' &&
        (this.commonDataService.getProdStatCode() === '42' && this.commonDataService.disableTnx
        && !this.commonService.compareExpirydatewithCurrentDate(this.jsonContent.bgExpDate))) {
        this.reportingFromExistingForm.controls.undertakingGeneralDetailsSection.get('bgExpDate').enable();



    }
  }

    enableAmountSectionFields() {
        if (this.reportingFromExistingForm.controls.amountDetailsSection) {
            this.reportingFromExistingForm.controls.amountDetailsSection.enable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgLiabAmt').enable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgAvailableAmt').enable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgAmt').disable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgConfChrgBorneByCode').disable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgConsortium').disable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgConsortiumDetails').disable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgCorrChrgBorneByCode').disable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgCurCode').disable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgNarrativeAdditionalAmount').disable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgNetExposureAmt').disable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgNetExposureCurCode').disable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgOpenChrgBorneByCode').disable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgToleranceNegativePct').disable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgTolerancePositivePct').disable();
        }
    }

    enableApplicantDetails() {
      if (this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm) {
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.enable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('applicantAbbvName').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('entity').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryAbbvName').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryName').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryAddressLine1').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryAddressLine2').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryDom').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryAddressLine4').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryReference').disable();
      }
  }
    disableApplicantDetailsForBG() {
      if (this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm) {
        this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('applicantAbbvName').disable();
        this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('applicantName').disable();
        this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('applicantAddressLine1').disable();
        this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('applicantAddressLine2').disable();
        this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('applicantDom').disable();
        this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('applicantAddressLine4').disable();
        this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('applicantReference').disable();
    }
    }
   disablBenifDetailsForBR() {
      if (this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm) {
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('entity').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryAbbvName').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryName').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryAddressLine1').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryAddressLine2').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryDom').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryAddressLine4').disable();
          this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.get('beneficiaryReference').disable();
      }
  }

    disableSectionsForBG() {
      if (this.reportingFromExistingForm.controls.generaldetailsSection) {
        this.reportingFromExistingForm.controls.generaldetailsSection.disable();
    }
      if (this.reportingFromExistingForm.controls.beneficiaryDetailsFormSection) {
        this.reportingFromExistingForm.controls.beneficiaryDetailsFormSection.disable();
    }
      if (this.reportingFromExistingForm.controls.applicantDetailsFormSection) {
        this.reportingFromExistingForm.controls.applicantDetailsFormSection.disable();
    }
      if (this.reportingFromExistingForm.get('ruApplicantBeneDetailsForm').get('altApplicantDetailsFormSection')) {
        this.reportingFromExistingForm.get('ruApplicantBeneDetailsForm').get('altApplicantDetailsFormSection').disable();
      }
      if (this.reportingFromExistingForm.controls.undertakingGeneralDetailsSection) {
        this.reportingFromExistingForm.controls.undertakingGeneralDetailsSection.disable();
     }
      if (this.reportingFromExistingForm.controls.bankDetailsSection) {
        this.reportingFromExistingForm.controls.bankDetailsSection.disable();
    }
    }

    disableSectionsForBR() {
      if (this.reportingFromExistingForm.controls.ruCommonApplicantBeneDetailsForm) {
        this.reportingFromExistingForm.controls.ruCommonApplicantBeneDetailsForm.disable();
    }
      if (this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm) {
      this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm.disable();
  }
      if (this.reportingFromExistingForm.controls.ruGeneraldetailsSection) {
          this.reportingFromExistingForm.controls.ruGeneraldetailsSection.disable();
      }
      if (this.reportingFromExistingForm.controls.ruBankDetailsSection) {
          this.reportingFromExistingForm.controls.ruBankDetailsSection.disable();
      }
      if (this.reportingFromExistingForm.controls.paymentDetailsForm) {
        this.reportingFromExistingForm.controls.paymentDetailsForm.disable();
    }
      if (this.reportingFromExistingForm.controls.shipmentDetailsSection) {
      this.reportingFromExistingForm.controls.shipmentDetailsSection.disable();
  }

    }

    disableUndertakingSections() {
      if (this.commonDataService.getProductCode() === 'BG') {
        this.disableSectionsForBG();
      }
      if (this.commonDataService.getProductCode() === 'BR') {
        this.disableSectionsForBR();
      }
      if (this.reportingFromExistingForm.controls.amountDetailsSection) {
            this.reportingFromExistingForm.controls.amountDetailsSection.disable();
        }
      if (this.reportingFromExistingForm.controls.renewalDetailsSection) {
            this.reportingFromExistingForm.controls.renewalDetailsSection.disable();
        }
      if (this.reportingFromExistingForm.controls.contractDetails) {
            this.reportingFromExistingForm.controls.contractDetails.disable();
        }
      if (this.reportingFromExistingForm.controls.redIncForm) {
          this.reportingFromExistingForm.controls.redIncForm.disable();
      }
      if (this.reportingFromExistingForm.controls.undertakingDetailsForm) {
            this.reportingFromExistingForm.controls.undertakingDetailsForm.disable();
        }
      if (this.reportingFromExistingForm.controls.paymentDetailsForm) {
          this.reportingFromExistingForm.controls.paymentDetailsForm.disable();
      }
      if (this.reportingFromExistingForm.controls.shipmentDetailsSection) {
        this.reportingFromExistingForm.controls.shipmentDetailsSection.disable();
      }
      if (this.reportingFromExistingForm.controls.bankInstructionsForm) {
        this.reportingFromExistingForm.controls.bankInstructionsForm.disable();
      }
      if (this.reportingFromExistingForm.controls.License) {
            this.reportingFromExistingForm.controls.License.disable();
        }
    }

    disableCounterUndertakingSections() {
       if (this.reportingFromExistingForm.controls.cuGeneraldetailsSection) {
        this.reportingFromExistingForm.controls.cuGeneraldetailsSection.disable();
       }
       if (this.reportingFromExistingForm.controls.cuUndertakingDetailsForm) {
        this.reportingFromExistingForm.controls.cuUndertakingDetailsForm.disable();
       }
       if (this.reportingFromExistingForm.controls.cuBeneficaryDetailsSection) {
        this.reportingFromExistingForm.controls.cuBeneficaryDetailsSection.disable();
       }
       if (this.reportingFromExistingForm.controls.cuAmountDetailsSection) {
        this.reportingFromExistingForm.controls.cuAmountDetailsSection.disable();
       }
       if (this.reportingFromExistingForm.controls.cuRenewalDetailsSection) {
        this.reportingFromExistingForm.controls.cuRenewalDetailsSection.disable();
       }
       if (this.reportingFromExistingForm.controls.cuBankDetailsSection) {
        this.reportingFromExistingForm.controls.cuBankDetailsSection.disable();
       }
       if (this.reportingFromExistingForm.controls.cuRedIncForm) {
        this.reportingFromExistingForm.controls.cuRedIncForm.disable();
       }
       if (this.reportingFromExistingForm.controls.cuPaymentDetailsForm) {
        this.reportingFromExistingForm.controls.cuPaymentDetailsForm.disable();
       }

    }
    enableSectionsForBG() {
      if (this.reportingFromExistingForm.controls.generaldetailsSection) {
        this.reportingFromExistingForm.controls.generaldetailsSection.enable();
    }
      if (this.reportingFromExistingForm.controls.beneficiaryDetailsFormSection) {
        this.reportingFromExistingForm.controls.beneficiaryDetailsFormSection.enable();
    }
      if (this.reportingFromExistingForm.controls.applicantDetailsFormSection) {
        this.reportingFromExistingForm.controls.applicantDetailsFormSection.enable();
    }
      if (this.reportingFromExistingForm.controls.undertakingGeneralDetailsSection) {
        this.reportingFromExistingForm.controls.undertakingGeneralDetailsSection.enable();
    }
      if (this.reportingFromExistingForm.controls.bankDetailsSection) {
        this.reportingFromExistingForm.controls.bankDetailsSection.enable();
        if (this.iuCommonDataService.getSubProdCode() === Constants.STAND_BY &&
          this.reportingFromExistingForm.controls.generaldetailsSection &&
           this.reportingFromExistingForm.controls.generaldetailsSection.get(`bgConfInstructions`) &&
           this.reportingFromExistingForm.controls.generaldetailsSection.get(`bgConfInstructions`).value !== '' &&
           this.reportingFromExistingForm.controls.generaldetailsSection.get(`bgConfInstructions`).value !== Constants.CODE_03 ) {
             this.bankDetailsComponent.commonBankDetailsComponent.onProductStatusChange();
           }

    }
  }

  enableRuGeneralDetailSection() {
    this.reportingFromExistingForm.controls.ruGeneraldetailsSection.enable();
    this.enableOrDisableRUGeneralDetailFields('bgTypeCode', 'bgTypeDetails', '99');
    this.enableOrDisableRUGeneralDetailFields('issDateTypeCode', 'issDateTypeDetails', '99');
    this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get('issuingBankReference').disable();
    this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get('advisingBankReference').reset();
    this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get('issDate').disable();
    this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get('bgTypeCode').disable();
    this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get('bgTypeDetails').disable();
  }

    enableSectionsForBR() {
      if (this.reportingFromExistingForm.controls.ruApplicantBeneDetailsForm) {
        this.enableApplicantDetails();
     }
      if (this.reportingFromExistingForm.controls.ruGeneraldetailsSection) {
        this.enableRuGeneralDetailSection();
       }
      if (this.reportingFromExistingForm.controls.ruBankDetailsSection) {
           this.reportingFromExistingForm.controls.ruBankDetailsSection.enable();
       }
    }

    enableUndertakingSections() {
      if (this.commonDataService.getProductCode() === 'BG') {
        this.enableSectionsForBG();
      }
      if (this.commonDataService.getProductCode() === 'BR') {
        this.enableSectionsForBR();
      }
      if (this.reportingFromExistingForm.controls.amountDetailsSection) {
            this.reportingFromExistingForm.controls.amountDetailsSection.enable();
            this.reportingFromExistingForm.controls.amountDetailsSection.get('bgNarrativeAdditionalAmount').disable();
        }
      if (this.reportingFromExistingForm.controls.renewalDetailsSection) {
            this.reportingFromExistingForm.controls.renewalDetailsSection.enable();
        }
      if (this.reportingFromExistingForm.controls.contractDetails) {
            this.reportingFromExistingForm.controls.contractDetails.enable();
        }
      if (this.reportingFromExistingForm.controls.undertakingDetailsForm) {
            this.reportingFromExistingForm.controls.undertakingDetailsForm.enable();
            if (this.commonDataService.getProductCode() === 'BR') {
            this.reportingFromExistingForm.controls.undertakingDetailsForm.get('bgTextTypeCode').disable();
        } else {
            this.enableOrDisableBgUndertakingDetailFields('bgTextTypeCode', 'bgTextTypeDetails', '99');
      }
        }
      if (this.reportingFromExistingForm.controls.redIncForm) {
          this.reportingFromExistingForm.controls.redIncForm.enable();
          if (this.reportingFromExistingForm.controls.redIncForm.get('bgVariationType').value === Constants.CODE_01) {
          if (this.reportingFromExistingForm.controls.redIncForm.get('bgVariationPct').value !== null &&
            this.reportingFromExistingForm.controls.redIncForm.get('bgVariationPct').value !== '') {
            this.reportingFromExistingForm.controls.redIncForm.get('bgVariationAmt').disable();
          } else if (this.reportingFromExistingForm.controls.redIncForm.get('bgVariationAmt').value !== null &&
            this.reportingFromExistingForm.controls.redIncForm.get('bgVariationAmt').value !== '' &&
            (this.reportingFromExistingForm.controls.redIncForm.get('bgVariationPct').value === null ||
              this.reportingFromExistingForm.controls.redIncForm.get('bgVariationPct').value === '')) {
            this.reportingFromExistingForm.controls.redIncForm.get('bgVariationPct').disable();
          }
        }
      }
      if (this.reportingFromExistingForm.controls.paymentDetailsForm) {
        this.reportingFromExistingForm.controls.paymentDetailsForm.enable();
    }
      if (this.reportingFromExistingForm.controls.shipmentDetailsSection) {
      this.reportingFromExistingForm.controls.shipmentDetailsSection.enable();
    }
      if (this.reportingFromExistingForm.controls.bankInstructionsForm) {
      this.reportingFromExistingForm.controls.bankInstructionsForm.enable();
    }
      if (this.reportingFromExistingForm.controls.License) {
            this.reportingFromExistingForm.controls.License.enable();
      }
    }

    enableCounterUndertakingSections() {
       if (this.reportingFromExistingForm.controls.cuGeneraldetailsSection) {
        this.reportingFromExistingForm.controls.cuGeneraldetailsSection.enable();
       }
       if (this.reportingFromExistingForm.controls.cuUndertakingDetailsForm) {
        this.reportingFromExistingForm.controls.cuUndertakingDetailsForm.enable();
        this.enableOrDisableCuUndertakingDetailFields('cuTextTypeCode', 'cuTextTypeDetails', '99');
       }
       if (this.reportingFromExistingForm.controls.cuBeneficaryDetailsSection) {
        this.reportingFromExistingForm.controls.cuBeneficaryDetailsSection.enable();
       }
       if (this.reportingFromExistingForm.controls.cuAmountDetailsSection) {
        this.reportingFromExistingForm.controls.cuAmountDetailsSection.enable();
       }
       if (this.reportingFromExistingForm.controls.cuRenewalDetailsSection) {
        this.reportingFromExistingForm.controls.cuRenewalDetailsSection.enable();
       }
       if (this.reportingFromExistingForm.controls.cuBankDetailsSection) {
        this.reportingFromExistingForm.controls.cuBankDetailsSection.enable();
       }
       if (this.reportingFromExistingForm.controls.cuRedIncForm) {
        this.reportingFromExistingForm.controls.cuRedIncForm.enable();
        if (this.reportingFromExistingForm.controls.cuRedIncForm.get('cuVariationType').value === Constants.CODE_01) {
          if (this.reportingFromExistingForm.controls.cuRedIncForm.get('cuVariationPct').value !== null &&
            this.reportingFromExistingForm.controls.cuRedIncForm.get('cuVariationPct').value !== '') {
            this.reportingFromExistingForm.controls.cuRedIncForm.get('cuVariationAmt').disable();
          } else if (this.reportingFromExistingForm.controls.cuRedIncForm.get('cuVariationAmt').value !== null &&
            this.reportingFromExistingForm.controls.cuRedIncForm.get('cuVariationAmt').value !== '' &&
            (this.reportingFromExistingForm.controls.cuRedIncForm.get('cuVariationPct').value === null ||
              this.reportingFromExistingForm.controls.cuRedIncForm.get('cuVariationPct').value === '')) {
            this.reportingFromExistingForm.controls.cuRedIncForm.get('cuVariationPct').disable();
          }
        }
      }
       if (this.reportingFromExistingForm.controls.cuPaymentDetailsForm) {
        this.reportingFromExistingForm.controls.cuPaymentDetailsForm.enable();
       }
    }

    onCancel() {
        const host = window.location.origin;
        const url = host + this.commonService.getBaseServletUrl() + Constants.TRADE_ADMIN_LANDING_SCREEN;
        window.location.replace(url);
    }

    onSubmit() {
    this.actionsComponent.showProgressBar = true;
    this.showForm = false;
    if (this.commonDataService.getMode() === Constants.MODE_DRAFT && this.inquiryConsolidatedChargesComponent.charges.length !== 0) {
      this.inquiryConsolidatedChargesComponent.charges.forEach(charge => {
        charge.createdInSession = 'Y';
      });
    }
    if ( this.commonDataService.getProductCode() === 'BG') {
    this.commonDataService.setProdStatCode(this.issuedundertaking.prodStatCode);
    this.iuService.saveOrSubmitIU(this.contextPath + URLConstants.IU_SUBMIT,
        this.issuedundertaking).subscribe(
            data => {
              this.response(data);
            }
        );
      } else if (this.commonDataService.getProductCode() === 'BR') {
      this.commonDataService.setProdStatCode(this.receivedUndertaking.prodStatCode);
      this.ruService.saveOrSubmitRU(this.contextPath + URLConstants.RU_SUBMIT,
        this.receivedUndertaking).subscribe(
                (         data: { response: string; }) => {
            this.response(data);
        });
      }
    }

    onSave() {
        this.actionsComponent.showProgressBar = true;
        this.showForm = false;
        this.handleDescissions('SAVE');
        if (this.commonDataService.getMode() === Constants.MODE_DRAFT && this.inquiryConsolidatedChargesComponent.charges.length !== 0) {
          this.inquiryConsolidatedChargesComponent.charges.forEach(charge => {
            charge.createdInSession = 'Y';
          });
        }
        if ( this.commonDataService.getProductCode() === 'BG') {
        this.transformToIssuedUndertaking();
        this.commonDataService.setProdStatCode(this.issuedundertaking.prodStatCode);
        this.iuService.saveOrSubmitIU(this.contextPath + URLConstants.IU_SAVE,
            this.issuedundertaking).subscribe(
                data => {
                  this.response(data);
                }
            );
        } else if ( this.commonDataService.getProductCode() === 'BR') {
          this.transformToReceivedUndertaking();
          this.commonDataService.setProdStatCode(this.receivedUndertaking.prodStatCode);
          this.ruService.saveOrSubmitRU(this.contextPath + URLConstants.RU_SAVE,
          this.receivedUndertaking).subscribe(
          data => {
          this.response(data);
        });
        }
    }

    response(data) {
      this.responseService.setResponse(data);
      this.router.navigate(['submitOrSave']);
    }

    validateForm() {
        this.validateAllFields(this.reportingFromExistingForm);
    }

    validateAllFields(mainForm: UntypedFormGroup) {
        mainForm.markAllAsTouched();
        if ( this.commonDataService.getProductCode() === 'BG') {
        const currentDate = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
        const counterDateFields: string[] = ['bgExpDate', 'bgApproxExpiryDate', 'bgFinalExpiryDate', 'bgRenewalCalendarDate'];

        for (const index of counterDateFields) {
            if ((index === 'bgExpDate' || (index === 'bgApproxExpiryDate' &&
            this.reportingFromExistingForm.controls.undertakingGeneralDetailsSection.get('bgApproxExpiryDate').value !== null &&
            this.reportingFromExistingForm.controls.undertakingGeneralDetailsSection.get('bgApproxExpiryDate').value !== '')) &&
            mainForm.get(Constants.SECTION_UNDERTAKING_GENERAL_DETAILS).get(index)) {
                mainForm.get(Constants.SECTION_UNDERTAKING_GENERAL_DETAILS).get(index).setValidators(validateWithCurrentDate(currentDate,
                    (index === 'bgExpDate' &&
                    this.reportingFromExistingForm.controls.undertakingGeneralDetailsSection.get('bgExpDateTypeCode').value === '02')
                     ? true : false));
                mainForm.get(Constants.SECTION_UNDERTAKING_GENERAL_DETAILS).get(index).updateValueAndValidity();
            }
        }
      } else if ( this.commonDataService.getProductCode() === 'BR' &&
      !this.commonDataService.disableTnx) {
        this.validateDateFieldsWithCurrentDate();
      }
        this.showInvalidFieldError();
    }

  showInvalidFieldError() {
        if (!this.reportingFromExistingForm.valid) {
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

    private validateDateFieldsWithCurrentDate() {
      const format = this.commonService.getUserLanguage() === Constants.LANGUAGE_US ? Constants.DATE_FORMAT : Constants.DATE_FORMAT_DMY;
      const currentDate = this.datePipe.transform(new Date(), format);

      if (this.bankRuGeneralDetailsComponent.ruGeneraldetailsSection.get('expDateTypeCode').value === Constants.CODE_02) {
        this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get('expDate').setValidators
        ([validateWithCurrentDate(currentDate, true)]);
        this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get('expDate').updateValueAndValidity();
      } else {
        if (this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get('approxExpiryDate').value !== null &&
        this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get('approxExpiryDate').value !== ''
        ) {
        this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get('approxExpiryDate').setValidators
        ([validateWithCurrentDate(currentDate, false)]);
        this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get('approxExpiryDate').updateValueAndValidity();
        }
      }
      if (this.renewalDetailsComponent && this.renewalDetailsComponent.renewalDetailsSection.get('bgRenewalType').value) {
        this.reportingFromExistingForm.controls.renewalDetailsSection.get('bgFinalExpiryDate').setValidators(
            [validateWithCurrentDate(currentDate, true)]);
        this.reportingFromExistingForm.controls.renewalDetailsSection.get('bgFinalExpiryDate').updateValueAndValidity();

        if (this.reportingFromExistingForm.controls.renewalDetailsSection.get('bgRenewalCalendarDate') &&
          this.reportingFromExistingForm.controls.renewalDetailsSection.get('bgRenewalCalendarDate').value != null &&
        this.reportingFromExistingForm.controls.renewalDetailsSection.get('bgRenewalCalendarDate').value !== '') {
            this.reportingFromExistingForm.controls.renewalDetailsSection.get('bgRenewalCalendarDate').setValidators(
              [validateWithCurrentDate(currentDate, true)]);
            this.reportingFromExistingForm.controls.renewalDetailsSection.get('bgRenewalCalendarDate').updateValueAndValidity();
            }
      }
    }

    transformToIssuedUndertaking() {
        const reportingMessageDetailsSection = 'reportingMessageDetailsComponent';
        const amountDetailsSection = 'amountDetailsSection';
        const contractDetailsSection = 'contractDetails';
        const bankDetailsSection = 'bankDetailsSection';
        const generaldetailsSection = 'generaldetailsSection';
        const undertakingDetailsSection = 'undertakingDetailsForm';
        const bankInstructionsSection = 'bankInstructionsForm';
        const license = 'License';
        const chargeSection = 'chargeForm';
        // To fetch all control values i.e. including the fields which are disabled druing toggling
        this.rawValuesForm = new UntypedFormGroup({});
        Object.assign(this.rawValuesForm, this.reportingFromExistingForm.getRawValue());
        this.issuedundertaking = new IssuedUndertakingRequest();
        this.issuedundertaking.tnxTypeCode = Constants.TYPE_REPORTING;
        this.issuedundertaking.tnxId = this.rawValuesForm[Constants.SECTION_UNDERTAKING_GENERAL_DETAILS].tnxId;
        this.issuedundertaking.merge(this.rawValuesForm[reportingMessageDetailsSection]);
        this.issuedundertaking.actionReqCode =
        this.reportingFromExistingForm.controls.reportingMessageDetailsComponent.get('actionReqCode').value;
        if (this.rawValuesForm[Constants.SECTION_ALT_APPLICANT_DETAILS]) {
        this.rawValuesForm[Constants.SECTION_ALT_APPLICANT_DETAILS].forAccount =
        this.iuCommonDataService.getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_ALT_APPLICANT_DETAILS].forAccount);
        }
        if (this.reportingFromExistingForm.controls.reportingMessageDetailsComponent.get('prodStatCode').value ===
        Constants.REJECT_PROD_STATUS_CODE) {
        this.issuedundertaking.prodStatCode =
        this.reportingFromExistingForm.controls.reportingMessageDetailsComponent.get('prodStatCode').value;
        } else {
          this.issuedundertaking.prodStatCode =
          this.reportingFromExistingForm.controls.transactionDetailsComponent.get('prodStatCode').value;
        }
        this.rawValuesForm[amountDetailsSection].bgConsortium =
        this.iuCommonDataService.getCheckboxFlagValues(this.rawValuesForm[amountDetailsSection].bgConsortium);
        this.rawValuesForm[Constants.SECTION_UNDERTAKING_GENERAL_DETAILS].bgTransferIndicator =
            this.iuCommonDataService.getCheckboxFlagValues(
                this.rawValuesForm[Constants.SECTION_UNDERTAKING_GENERAL_DETAILS].bgTransferIndicator);
        if (this.iuCommonDataService.getExpDateType() === '02') {
          this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgRenewFlag =
          this.iuCommonDataService.getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgRenewFlag);
          this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgAdviseRenewalFlag =
          this.iuCommonDataService.getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgAdviseRenewalFlag);
          this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgRollingRenewalFlag =
          this.iuCommonDataService.getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS].bgRollingRenewalFlag);
          this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_RENEWAL_DETAILS]);
        }
        this.rawValuesForm[bankDetailsSection].leadBankFlag =
        this.iuCommonDataService.getCheckboxFlagValues(this.rawValuesForm[bankDetailsSection].leadBankFlag);
        this.issuedundertaking.merge(this.rawValuesForm[generaldetailsSection]);
        this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_APPLICANT_DETAILS]);
        this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_ALT_APPLICANT_DETAILS]);
        this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_BENEFICIARY_DETAILS]);
        this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_UNDERTAKING_GENERAL_DETAILS]);
        this.issuedundertaking.merge(this.rawValuesForm[amountDetailsSection]);
        this.issuedundertaking.merge(this.rawValuesForm[undertakingDetailsSection]);
        this.issuedundertaking.provisionalStatus = this.iuCommonDataService
            .getCheckboxFlagValues(this.rawValuesForm[generaldetailsSection].provisionalStatus);
        this.issuedundertaking.merge(this.rawValuesForm[contractDetailsSection]);
        this.issuedundertaking.merge(this.rawValuesForm[bankInstructionsSection]);
        this.issuedundertaking.mergeBankDetailsSection(this.rawValuesForm[bankDetailsSection], this.iuCommonDataService);
        if (this.rawValuesForm[license].listOfLicenses !== '') {
            this.issuedundertaking.mergeLicensesSection(this.rawValuesForm[license]);
        }
        if (this.rawValuesForm[chargeSection].listOfCharges !== '') {
          this.issuedundertaking.mergeChargesSection(this.rawValuesForm[chargeSection]);
      }
        if (this.issuedundertaking.prodStatCode === '42'
        && !this.commonService.compareExpirydatewithCurrentDate(this.jsonContent.bgExpDate)) {
           this.issuedundertaking.bgExpDate = this.currentDate;
       }
        if (this.iuCommonDataService.getSubProdCode() === Constants.STAND_BY) {
        this.issuedundertaking.bgCrAvlByCode = this.rawValuesForm[Constants.SECTION_PAYMENT_DETAILS].bgCrAvlByCode;
        this.issuedundertaking.mergeCreditAvlWithBankDetails(this.rawValuesForm[Constants.SECTION_PAYMENT_DETAILS],
          'bg', this.iuCommonDataService);
        this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_SHIPMENT_DETAILS]);
      }
        if (this.reportingFromExistingForm.controls.redIncForm.get('bgVariationType').value) {
        this.issuedundertaking.mergeVariationDetails(this.rawValuesForm[Constants.SECTION_INCR_DECR], this.iuCommonDataService);
      }
        if (this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].purpose &&
    (Constants.cuPurposeList.includes(this.rawValuesForm[Constants.SECTION_GENERAL_DETAILS].purpose))) {
            this.rawValuesForm[Constants.SECTION_CU_AMOUNT_DETAILS].cuConsortium =
            this.iuCommonDataService.getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_CU_AMOUNT_DETAILS].cuConsortium);
            this.rawValuesForm[Constants.SECTION_CU_GENERAL_DETAILS].cuTransferIndicator =
            this.iuCommonDataService.getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_CU_GENERAL_DETAILS].cuTransferIndicator);
            if (this.iuCommonDataService.getCUExpDateType() === '02') {
              this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuRenewFlag =
              this.iuCommonDataService.getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuRenewFlag);
              this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuAdviseRenewalFlag =
              this.iuCommonDataService.getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuAdviseRenewalFlag);
              this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuRollingRenewalFlag =
              this.iuCommonDataService.getCheckboxFlagValues(this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS].cuRollingRenewalFlag);
              this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_RENEWAL_DETAILS]);
        }
            this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_GENERAL_DETAILS]);
            this.issuedundertaking.mergeCuBankDetailsSection(this.rawValuesForm[Constants.SECTION_BANK_DETAILS]);
            this.issuedundertaking.mergeCuBeneficiaryAndContactDetails(this.rawValuesForm[Constants.SECTION_CU_BENEFICIARY]);
            this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_AMOUNT_DETAILS]);
            this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_CU_UNDERTAKING_DETAILS]);
            if (this.reportingFromExistingForm.controls.cuRedIncForm.get('cuVariationType').value) {
              this.issuedundertaking.mergeCuVariationDetails(this.rawValuesForm[Constants.SECTION_CU_INCR_DECR], this.iuCommonDataService);
            }
            if (this.iuCommonDataService.getCUSubProdCode() === Constants.STAND_BY) {
              this.issuedundertaking.cuCrAvlByCode = this.rawValuesForm[Constants.SECTION_CU_PAYMENT_DETAILS].cuCrAvlByCode;
              this.issuedundertaking.mergeCreditAvlWithBankDetails(this.rawValuesForm[Constants.SECTION_CU_PAYMENT_DETAILS],
                                                                  'cu', this.iuCommonDataService);
            }
            const tnxAmtEditableSet = ['04', '05', '12', '13', '14', '15', '24', '26', '84', '85'];
            if (tnxAmtEditableSet.indexOf(this.issuedundertaking.prodStatCode) > -1 ) {
              this.issuedundertaking.cuTnxAmt = this.issuedundertaking.tnxAmt;
              this.issuedundertaking.tnxAmt = '';
            }

        }
        this.issuedundertaking.attids = this.iuCommonDataService.getAttIds();
        this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_FILE_UPLOAD]);
        this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_TRANSACTION_DETAILS]);
        this.issuedundertaking.merge(this.rawValuesForm[Constants.SECTION_COURIER_DETAILS]);

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
      Object.assign(this.rawValuesForm, this.reportingFromExistingForm.getRawValue());
      this.receivedUndertaking = new ReceivedUndertakingRequest();
      this.receivedUndertaking.refId = this.commonDataService.getRefId();
      this.receivedUndertaking.tnxTypeCode = Constants.TYPE_REPORTING;
      this.receivedUndertaking.tnxId = this.commonDataService.getTnxId();
      this.receivedUndertaking.attids = this.iuCommonDataService.getAttIds();
      this.receivedUndertaking.tnxStatCode = this.iuCommonDataService.getTnxStatCode();
      this.receivedUndertaking.brchCode = '00001';
      this.rawValuesForm[ruGeneraldetailsSection].bgTransferIndicator = this.iuCommonDataService.
        getCheckboxFlagValues(this.rawValuesForm[ruGeneraldetailsSection].bgTransferIndicator);
      if (this.iuCommonDataService.getExpDateType() === '02') {
        this.rawValuesForm[renewalDetailsSection].bgRenewFlag = this.iuCommonDataService.
          getCheckboxFlagValues(this.rawValuesForm[renewalDetailsSection].bgRenewFlag);
        this.rawValuesForm[renewalDetailsSection].bgAdviseRenewalFlag = this.iuCommonDataService.
          getCheckboxFlagValues(this.rawValuesForm[renewalDetailsSection].bgAdviseRenewalFlag);
        this.rawValuesForm[renewalDetailsSection].bgRollingRenewalFlag = this.iuCommonDataService.
          getCheckboxFlagValues(this.rawValuesForm[renewalDetailsSection].bgRollingRenewalFlag);
        this.receivedUndertaking.merge(this.rawValuesForm[renewalDetailsSection]);
      }
      this.receivedUndertaking.merge(this.rawValuesForm[reportingMessageDetailsComponent]);
      if (this.reportingFromExistingForm.controls.reportingMessageDetailsComponent.get('prodStatCode').value ===
        Constants.REJECT_PROD_STATUS_CODE) {
        this.receivedUndertaking.prodStatCode =
        this.reportingFromExistingForm.controls.reportingMessageDetailsComponent.get('prodStatCode').value;
      } else if (this.reportingFromExistingForm.controls.reportingMessageDetailsComponent.get('prodStatCode').value ===
        Constants.PENDING_PROD_STATUS_CODE) {
        this.receivedUndertaking.tnxStatCode = '04';
        this.receivedUndertaking.prodStatCode =
          this.reportingFromExistingForm.controls.transactionDetailsComponent.get('prodStatCode').value;
      } else {
          this.receivedUndertaking.prodStatCode =
          this.reportingFromExistingForm.controls.transactionDetailsComponent.get('prodStatCode').value;
      }
      this.receivedUndertaking.actionReqCode =
      this.reportingFromExistingForm.controls.reportingMessageDetailsComponent.get('actionReqCode').value;
      if (this.receivedUndertaking.prodStatCode === '42'
       && !this.commonService.compareExpirydatewithCurrentDate(this.jsonContent.expiryDate)) {
        this.receivedUndertaking.expDate = this.currentDate;
      }
      this.receivedUndertaking.merge(this.rawValuesForm[ruGeneraldetailsSection]);
      this.receivedUndertaking.merge(this.rawValuesForm[Constants.SECTION_FILE_UPLOAD]);
      this.receivedUndertaking.merge(this.rawValuesForm[ruApplicantBeneDetailsForm]);
      this.receivedUndertaking.merge(this.rawValuesForm[amountDetailsSection]);
      this.receivedUndertaking.merge(this.rawValuesForm[undertakingDetailsForm]);
      this.receivedUndertaking.merge(this.rawValuesForm[contractDetails]);
     
      if (this.iuCommonDataService.getSubProdCode() === Constants.STAND_BY) {
        this.receivedUndertaking.bgCrAvlByCode = this.rawValuesForm[Constants.SECTION_PAYMENT_DETAILS].bgCrAvlByCode;
        this.receivedUndertaking.mergeCreditAvlWithBankDetails(this.rawValuesForm[Constants.SECTION_PAYMENT_DETAILS],
          'br', this.iuCommonDataService);
        this.receivedUndertaking.merge(this.rawValuesForm[Constants.SECTION_SHIPMENT_DETAILS]);
      }
      /*if (this.receivedUndertaking.prodStatCode === Constants.APPROVED_PROD_STAT_CODE) {
      this.receivedUndertaking.prodStatCode = '03';
     }*/
      this.receivedUndertaking.mergeBankDetailsSection(this.rawValuesForm[ruBankDetailsSection], this.iuCommonDataService);
      if (this.reportingFromExistingForm.get(redIncForm) &&
          this.reportingFromExistingForm.get(redIncForm).get(`bgVariationType`).value) {
        this.receivedUndertaking.mergeVariationDetails(this.rawValuesForm[redIncForm], this.iuCommonDataService);
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
      this.receivedUndertaking.attids = this.iuCommonDataService.getAttIds();
      this.receivedUndertaking.merge(this.rawValuesForm[Constants.SECTION_TRANSACTION_DETAILS]);
      this.receivedUndertaking.merge(this.rawValuesForm[Constants.SECTION_FILE_UPLOAD]);
      this.receivedUndertaking.merge(this.rawValuesForm[Constants.SECTION_COURIER_DETAILS]);

    }

    handleDescissions(event) {
      if (event === 'SAVE') {
        this.iuCommonDataService.setTnxStatCode('05');
      } else if (event === 'SUBMIT') {
        this.iuCommonDataService.setTnxStatCode('04');
      }
    }

    openPreview() {
        const host = window.location.origin;
        let url = host + this.commonService.getBaseServletUrl();
        url += Constants.PREVIEW_POPUP_SCREEN;

        const refId = this.iuCommonDataService.getRefId();
        const tnxId = this.iuCommonDataService.getTnxId();
        const productCode = this.commonDataService.getProductCode();

        const myWindow = window.open(`${url}/?option=FULL&referenceid=${refId}&tnxid=${tnxId}&productcode=${productCode}`,
        Constants.TRANSACTION_POPUP, 'width=800,height=500,resizable=yes,scrollbars=yes');
        myWindow.focus();
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
        if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_IU) {
        this.generatePdfService.generateFile(Constants.PRODUCT_CODE_IU, this.bankDetails);
        } else if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_RU) {
        this.generatePdfService.generateFile(Constants.PRODUCT_CODE_RU, this.bankDetails);
        }
        this.transactionDetailsComponent.generatePdf(this.generatePdfService);
        if (this.jsonContent[`tnxTypeCode`] === Constants.TYPE_INQUIRE && this.messageDetailsComponent) {
          this.messageDetailsComponent.generatePdf(this.generatePdfService);
        }
        if (this.iuGeneraldetailsChildComponent) {
            this.iuGeneraldetailsChildComponent.generatePdf(this.generatePdfService);
        }
        if (this.iuCommonDataService.getPreviewOption() !== 'SUMMARY') {
          this.generatePdfForNonSummaryOption();
        }
        if (this.iuLicenseComponent) {
            this.iuLicenseComponent.generatePdf(this.generatePdfService);
        }
        if (this.iuCommonReturnCommentsComponent && this.jsonContent.returnComments && this.jsonContent.returnComments !== '' &&
            this.jsonContent.returnComments !== null) {
            this.iuCommonReturnCommentsComponent.generatePdf(this.generatePdfService);
        }
        this.reportingMessageDetailsComponent.generatePdf(this.generatePdfService);

        if(this.courierDetailsComponent)
        {
          // Courier Details
          this.courierDetailsComponent.generatePdf(this.generatePdfService);
        }
        
        // Charge Details
        this.generatePdfForChargeDetails();
        // Attachment Table
        this.generatePdfForAttachmentTable();
        if (this.commonDataService.getmasterorTnx() === 'master') {
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
          this.generatePdfService.setSectionContent(this.iuCommonDataService.getChargeType(charge.chrgCode), true);

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
          this.generatePdfService.setSectionContent(this.iuCommonDataService.getChargeStatus(charge.status), true);

          this.generatePdfService.setSectionLabel('CHARGE_SETTLEMENT_DATE_LABEL', true);
          this.generatePdfService.setSectionContent(charge.settlementDate, false);
        }
       }
      }
    }

    generatePdfForCUSection() {
        if (this.luGeneraldetailsChildComponent) {
            this.luGeneraldetailsChildComponent.generatePdf(this.generatePdfService);
        }
        if (this.cuBeneficaryDetailsChildComponent) {
            this.cuBeneficaryDetailsChildComponent.generatePdf(this.generatePdfService);
        }
        if (this.CuAmountDetailsChildComponent) {
            this.CuAmountDetailsChildComponent.generatePdf(this.generatePdfService);
        }
        if (this.cuRenewalDetailsChildComponent) {
            this.cuRenewalDetailsChildComponent.generatePdf(this.generatePdfService);
        }
        if (this.cuReductionIncreaseComponent) {
          this.cuReductionIncreaseComponent.generatePdf(this.generatePdfService);
        }
        if (this.luBankDetailsChildComponent) {
            this.luBankDetailsChildComponent.generatePdf(this.generatePdfService);
        }
        if (this.cuUndertakingChildComponent) {
            this.cuUndertakingChildComponent.generatePdf(this.generatePdfService);
        }
    }

    generatePdfForAttachmentTable() {
        let headers: string[] = [];
        let data: any[] = [];
        if (this.commonDataService.getIsBankUser() && this.commonDataService.getmasterorTnx() !== Constants.MASTER) {
          this.generatePdfService.setSectionHeader('KEY_HEADER_FILE_UPLOAD', true);
        }
        if (this.jsonContent.attachments && this.jsonContent.attachments !== '' && this.commonDataService.getIsBankUser()) {
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

    generatePdfForBankSection() {
      if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_IU) {
        if (this.bankDetailsComponent) {
         this.bankDetailsComponent.generatePdf(this.generatePdfService);
        }
        if (this.undertakingGeneralDetailsChildComponent) {
          this.undertakingGeneralDetailsChildComponent.generatePdf(this.generatePdfService);
        }
     }
      if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_RU) {
        if (this.bankRuGeneralDetailsComponent) {
         this.bankRuGeneralDetailsComponent.generatePdf(this.generatePdfService);
       }
        if (this.bankRuDetailsComponent) {
          this.bankRuDetailsComponent.generatePdf(this.generatePdfService);
        }
    }

    }

    generatePdfForNonSummaryOption() {
      if (this.bankApplicantBeneDetailsComponent) {
        this.bankApplicantBeneDetailsComponent.generatePdf(this.generatePdfService);
      }
      if (this.iuCommonDataService.displayLUSection()) {
         this.generatePdfForCUSection();
      }

      this.generatePdfForBankSection();

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
      if (this.returnCommentsComponent && this.jsonContent.returnComments && this.jsonContent.returnComments !== '' &&
        this.jsonContent.returnComments !== null) {
          this.returnCommentsComponent.generatePdf(this.generatePdfService);
        }
    }

    resetRenewalSection(flag) {
        if (!flag && this.renewalDetailsComponent) {
            this.renewalDetailsComponent.ngOnInit();
        } else {
            if (this.cuRenewalDetailsChildComponent) {
                this.cuRenewalDetailsChildComponent.ngOnInit();
            }
        }
    }

    setLUStatus(luStatus) {
        this.luStatus = luStatus;
        this.beneficiaryDetailsComponent.setValidationsOnBeneFields(!luStatus);
        if (luStatus) {
            this.iuCommonDataService.setBeneMandatoryVal(false);
        } else {
            this.iuCommonDataService.setBeneMandatoryVal(true);
        }
    }

    resetLUForms(resetLUReq) {
        const array = resetLUReq.split(',');
        const isBeneMandatory = array[1];
        const isResetLU = array[0];

        if (isBeneMandatory === 'true') {
            this.clearBeneficiaryFields();
        }

        if (isResetLU === 'true') {
            this.reportingFromExistingForm.controls.cuGeneraldetailsSection.reset();
            this.reportingFromExistingForm.controls.cuBeneficaryDetailsSection.reset();
            this.reportingFromExistingForm.controls.cuAmountDetailsSection.reset();

            if (this.reportingFromExistingForm.controls.cuRenewalDetailsSection) {
              this.reportingFromExistingForm.controls.cuRenewalDetailsSection.reset();
            }
            if (this.reportingFromExistingForm.controls.cuPaymentDetailsForm) {
              this.reportingFromExistingForm.controls.cuPaymentDetailsForm.reset();
            }

            this.reportingFromExistingForm.controls.cuBankDetailsSection.reset();
            this.reportingFromExistingForm.controls.cuUndertakingDetailsForm.reset();

            this.reportingFromExistingForm.removeControl(Constants.SECTION_CU_GENERAL_DETAILS);
            this.reportingFromExistingForm.removeControl(Constants.SECTION_CU_BENEFICIARY);
            this.reportingFromExistingForm.removeControl(Constants.SECTION_CU_AMOUNT_DETAILS);
            this.reportingFromExistingForm.removeControl(Constants.SECTION_CU_RENEWAL_DETAILS);

            if (this.reportingFromExistingForm.controls.cuRenewalDetailsSection) {
              this.reportingFromExistingForm.removeControl(Constants.SECTION_CU_RENEWAL_DETAILS);
            }
            if (this.reportingFromExistingForm.controls.cuPaymentDetailsForm) {
              this.reportingFromExistingForm.removeControl(Constants.SECTION_CU_PAYMENT_DETAILS);
            }

            this.reportingFromExistingForm.removeControl(Constants.SECTION_CU_BANK_DETAILS);
            this.reportingFromExistingForm.removeControl(Constants.SECTION_CU_UNDERTAKING_DETAILS);
        }
    }

    reloadApplicantDetails(flag) {
        this.applicantDetailsComponent.ngOnInit();
    }
    clearBeneficiaryFields() {
        this.reportingFromExistingForm.get(Constants.SECTION_BENEFICIARY_DETAILS).get('beneficiaryName').setValue('');
        this.reportingFromExistingForm.get(Constants.SECTION_BENEFICIARY_DETAILS).get('beneficiaryAddressLine1').setValue('');
        this.reportingFromExistingForm.get(Constants.SECTION_BENEFICIARY_DETAILS).get('beneficiaryAddressLine2').setValue('');
        this.reportingFromExistingForm.get(Constants.SECTION_BENEFICIARY_DETAILS).get('beneficiaryDom').setValue('');
        this.reportingFromExistingForm.get(Constants.SECTION_BENEFICIARY_DETAILS).get('beneficiaryAddressLine4').setValue('');
        this.reportingFromExistingForm.get(Constants.SECTION_BENEFICIARY_DETAILS).get('beneficiaryCountry').setValue('');
        this.reportingFromExistingForm.get(Constants.SECTION_BENEFICIARY_DETAILS).get('beiCode').setValue('');
    }

    transformForUnsignedMode() {
        this.rawValuesForm = new UntypedFormGroup({});
        Object.assign(this.rawValuesForm, this.reportingFromExistingForm.getRawValue());
        if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_IU) {
        this.issuedundertaking = new IssuedUndertakingRequest();
        this.issuedundertaking.tnxTypeCode = Constants.TYPE_REPORTING;
        this.issuedundertaking.refId = this.commonDataService.getRefId();
        this.issuedundertaking.tnxId = this.commonDataService.getTnxId();
        const maturityDateProdStatCode = ['04', '05', '12', '13', '14', '15', '24', '26'];
        if (this.jsonContent.prodStatCode === '08' || this.jsonContent.prodStatCode === '09' || this.jsonContent.prodStatCode === '31') {
          this.issuedundertaking.bgAmdDate =
          this.reportingFromExistingForm.controls.reportingMessageDetailsComponent.get('bgAmdDate').value;
        } else if (maturityDateProdStatCode.includes(this.jsonContent.prodStatCode)) {
          this.issuedundertaking.maturityDate =
          this.reportingFromExistingForm.controls.reportingMessageDetailsComponent.get('maturityDate').value;
        }
      } else if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_RU) {
        this.receivedUndertaking = new ReceivedUndertakingRequest();
        this.receivedUndertaking.tnxTypeCode = Constants.TYPE_REPORTING;
        this.receivedUndertaking.refId = this.commonDataService.getRefId();
        this.receivedUndertaking.tnxId = this.commonDataService.getTnxId();
        const maturityDateProdStatCode = ['05', '04', '12', '13', '26', '24', '14', '15'];
        if (this.jsonContent.prodStatCode === '08' || this.jsonContent.prodStatCode === '09' || this.jsonContent.prodStatCode === '31') {
          this.receivedUndertaking.bgAmdDate =
          this.reportingFromExistingForm.controls.reportingMessageDetailsComponent.get('bgAmdDate').value;
        } else if (maturityDateProdStatCode.includes(this.jsonContent.prodStatCode)) {
          this.receivedUndertaking.maturityDate =
          this.reportingFromExistingForm.controls.reportingMessageDetailsComponent.get('maturityDate').value;
        }
      }
    }

    onSubmitRetrieveUnsigned() {
        this.actionsComponent.showProgressBar = true;
        this.showForm = false;
        if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_IU) {
        this.iuService.submitFromRetrieveUnsigned(this.issuedundertaking).subscribe(
            data => {
                this.response(data);
            }
        );
      } else if (this.commonDataService.getProductCode() === Constants.PRODUCT_CODE_RU) {
        this.ruService.submitFromRetrieveUnsigned(this.contextPath + URLConstants.RU_SUBMIT_UNSIGNED,
           this.receivedUndertaking).subscribe(
          data => {
            this.response(data);
          }
        );
      }
    }

    validateFormOnUnsignedSubmit() {
      this.unsignedFormValid = true;
      this.reportingFromExistingForm.controls.reportingMessageDetailsComponent.markAllAsTouched();
      if (!this.reportingFromExistingForm.controls.reportingMessageDetailsComponent.valid) {
        this.unsignedFormValid = false;
        this.showInvalidFieldError();
      }
    }

    setExpiryDateForExtension(expiryDateExt) {
      if (expiryDateExt !== '' && expiryDateExt !== null) {
          this.renewalDetailsComponent.commonRenewalDetails.setFinalExpiryDate('bg');
      }
     }

    /*setExpDate(expDate) {
      if (expDate !== '' && expDate !== null) {
       let expiryDate = expDate;
       if (expiryDate !== '' && expiryDate != null) {
          expiryDate = this.commonService.getDateObject(expiryDate);
        }
       this.expDate = expiryDate;
       this.setMaxDate();
      }
    }*/

    setConfInstValue(value) {
      this.bankRuDetailsComponent.checkConfirmingBankMandatory(value);
      this.amountDetailsChildComponent.commonAmountDetailsChildComponent.checkConfirmingChargeManadatory(value);
    }
    setIUConfInstValue(value) {
      this.bankDetailsComponent.commonBankDetailsComponent.checkConfirmingBankMandatory(value);
      this.amountDetailsChildComponent.commonAmountDetailsChildComponent.checkConfirmingChargeManadatory(value);
    }

    enableOrDisableRUGeneralDetailFields(inputField: string, enabledField: string, expectedValue: string) {
      if (this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get(inputField).value === expectedValue) {
        this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get(enabledField).markAsUntouched({ onlySelf: true });
        this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get(enabledField).markAsPristine({ onlySelf: true });
        this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get(enabledField).updateValueAndValidity();
        this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get(enabledField).enable();
      } else {
        this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get(enabledField).setValue('');
        this.reportingFromExistingForm.controls.ruGeneraldetailsSection.get(enabledField).disable();
     }
    }

    enableOrDisableCuUndertakingDetailFields(inputField: string, enabledField: string, expectedValue: string) {
      if (this.reportingFromExistingForm.controls.cuUndertakingDetailsForm.get(inputField).value === expectedValue) {
        this.reportingFromExistingForm.controls.cuUndertakingDetailsForm.get(enabledField).markAsUntouched({ onlySelf: true });
        this.reportingFromExistingForm.controls.cuUndertakingDetailsForm.get(enabledField).markAsPristine({ onlySelf: true });
        this.reportingFromExistingForm.controls.cuUndertakingDetailsForm.get(enabledField).updateValueAndValidity();
        this.reportingFromExistingForm.controls.cuUndertakingDetailsForm.get(enabledField).enable();
      } else {
        this.reportingFromExistingForm.controls.cuUndertakingDetailsForm.get(enabledField).setValue('');
        this.reportingFromExistingForm.controls.cuUndertakingDetailsForm.get(enabledField).disable();
     }
    }
    enableOrDisableBgUndertakingDetailFields(inputField: string, enabledField: string, expectedValue: string) {
      if (this.reportingFromExistingForm.controls.undertakingDetailsForm.get(inputField).value === expectedValue) {
        this.reportingFromExistingForm.controls.undertakingDetailsForm.get(enabledField).markAsUntouched({ onlySelf: true });
        this.reportingFromExistingForm.controls.undertakingDetailsForm.get(enabledField).markAsPristine({ onlySelf: true });
        this.reportingFromExistingForm.controls.undertakingDetailsForm.get(enabledField).updateValueAndValidity();
        this.reportingFromExistingForm.controls.undertakingDetailsForm.get(enabledField).enable();
      } else {
        this.reportingFromExistingForm.controls.undertakingDetailsForm.get(enabledField).setValue('');
        this.reportingFromExistingForm.controls.undertakingDetailsForm.get(enabledField).disable();
     }
    }

}
