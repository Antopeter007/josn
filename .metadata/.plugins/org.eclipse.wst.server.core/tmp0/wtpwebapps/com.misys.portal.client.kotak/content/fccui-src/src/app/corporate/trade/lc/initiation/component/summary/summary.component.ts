import { ReauthService } from './../../../../../../common/services/reauth.service';
import { Component, OnInit } from '@angular/core';
import { UtilityService } from '../../services/utility.service';
import { TranslateService } from '@ngx-translate/core';
import { FccGlobalConstant } from '../../../../../../common/core/fcc-global-constants';
import { Router } from '@angular/router';
import {
  ImportLetterOfCredit, LcDetails, LcTypes, Applicant, AlternateApplicantDetails,
  Beneficiary, Amount, Tolerance, Confirmation, Charge, Revolving, PaymentDetails, Shipment,
  IssuingBank, Bank, License, Narrative, BankInstructions, Attachments, DraftDetails,
  OtherDetails, ApplicableRule, TransactionAddress, Tenor, PresentationPeriod, Account
} from '../../model/models';
import { LeftSectionService } from '../../../../../common/services/leftSection.service';
import { FileMap } from '../../services/mfile';
import { FilelistService } from '../../services/filelist.service';
import { CommonService } from '../../../../../../common/services/common.service';
interface SummaryDetails {
  pagekey?: string;
  header?: string;
  label?: string;
  value?: string;
  isDate?: boolean;
  isTextArea?: boolean;
  status?: boolean;
}
@Component({
  selector: 'fcc-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  checked = true;
  saveTemplateStatus: boolean;
  summarDetails: any;
  summaryRender: SummaryDetails[] = [];
  generalDetail;
  module;
  applicationandbeneficiary = [];
  bankdetails: [];
  amountandchargeDetail: [];
  paymentDetail = [];
  data: any = [];
  submit = `${this .translateservice.instant('submit')}`;
  dir: string = localStorage.getItem('langDir');
  generaldetailstatus: boolean;
  submitButton: boolean;
  sectionMap: any;
  applicationDate: string;
  lcRequestForm = new ImportLetterOfCredit();
  lcDetails = new LcDetails();
  lcType = new LcTypes();
  applicant = new Applicant();
  alternateApplicant = new AlternateApplicantDetails();
  beneficiary = new Beneficiary();
  amount = new Amount();
  amountTolerance = new Tolerance();
  confirmation = new Confirmation();
  chargeDetail = new Charge();
  revolving = new Revolving();
  paymentDetails = new PaymentDetails();
  shipment = new Shipment();
  issuingBank = new IssuingBank();
  advisingBank = new Bank();
  adviseThruBank = new Bank();
  requestedConfirmationParty = new Bank();
  license = new License();
  narrative = new Narrative();
  bankInstructions = new BankInstructions();
  attachments = new Attachments();
  draftDetails = new DraftDetails();
  otherDetails = new OtherDetails();
  applicableRules = new ApplicableRule();
  address = new TransactionAddress();
  tenor = new Tenor();
  periodOfPresentation = new PresentationPeriod();
  account = new Account();
  applicantStatus: boolean;
  alternateapplicantdetailsStatus: boolean;
  beneficiaryStatus: boolean;
  goodsandDocStatus: boolean;
  otherDetailsStatus: boolean;
  responseData: any;
  issuingBankStatus: boolean;
  advisingBankStatus: boolean;
  adviceThroughStatus: boolean;
  requestedConfirmationPartyStatus: boolean;
  fileMap: FileMap[] = [];
  fileUploadColumns = [];
  inputDraweeDetails: any;
  valid = 'valid';
  dataObject;
  labelval;
  translatedvalue;
  constructor(
    protected utilityService: UtilityService, protected translateservice: TranslateService,
    protected router: Router, protected commonService: CommonService,
    protected leftSectionService: LeftSectionService, protected reauthService: ReauthService,
    public downloadFile: CommonService, protected uploadFile: FilelistService) { }

  ngOnInit() {
    window.scroll(0, 0);
    this .subheaderStatus();
    this .saveTemplateStatus = false;
    this .summaryRender = [];
    this .initializeDetails();
    this. submitButton = true;
    this. formValid();
  }

  formValid() {
    this .sectionMap = this .utilityService.getSummaryData();
    for (const [mapKey, mapValue] of this .sectionMap) {
      if ((mapKey === FccGlobalConstant.GENERAL_DETAILS || mapKey === FccGlobalConstant.APPLICANT_BENEFICIARY ||
        mapKey === FccGlobalConstant.BANK_DETAILS || mapKey === FccGlobalConstant.AMOUNT_CHARGE_DETAILS ||
         mapKey === FccGlobalConstant.PAYMENT_DETAILS || mapKey === FccGlobalConstant.SHIPMENT_DETAILS ||
         mapKey === FccGlobalConstant.NARRATIVE_DETAILS ||
          mapKey === FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY)
          && mapValue && mapValue[this.valid] === false) {
              this .submitButton = false;
              break;
            }
    }
  }
  subheaderStatus() {
    this.applicantStatus = false;
    this.alternateapplicantdetailsStatus = false;
    this.beneficiaryStatus = false;
    this.goodsandDocStatus = false;
    this.otherDetailsStatus = false;
    this.issuingBankStatus = false;
    this.advisingBankStatus = false;
    this.adviceThroughStatus = false;
    this.requestedConfirmationPartyStatus = false;
  }
  initializeDetails() {
    this.generaldetailstatus = false;
    this .module = 'Summary';
    this .summarDetails = this .utilityService.getSummaryData()[Symbol.iterator]();

    for (const [mapKey, mapValue] of this .summarDetails) {
      this.submitPayload(mapKey, mapValue);
      if (mapValue) {
        this .iterateControls(mapKey, mapValue);
      }

    }
  }
  submitPayload(title, mapValue) {
    if (title !== 'Payment Details') {
      return false;
    }
    Object.keys(mapValue).forEach(() => {
      if (mapValue.controls.inputDraweeDetail) {
        if (mapValue.controls.inputDraweeDetail.value === this.translateservice.instant('issuingBank')) {
          this.inputDraweeDetails = FccGlobalConstant.ISSUINGBANK;
        } else if (mapValue.controls.inputDraweeDetail.value === this.translateservice.instant('otherBank')) {
          this.inputDraweeDetails = FccGlobalConstant.OTHER;
        } else if (mapValue.controls.inputDraweeDetail.value === this.translateservice.instant('anyBank')) {
          this.inputDraweeDetails = FccGlobalConstant.ANYBANK;
        } else if (mapValue.controls.inputDraweeDetail.value === this.translateservice.instant('advisingBank')) {
          this.inputDraweeDetails = FccGlobalConstant.ADVISINGBANK;
        }
      }
    });
  }


  iterateControls(title, mapValue) {
    let value;
    if (!mapValue) {
      return false;
    }
    Object.keys(mapValue).forEach((key, index) => {
      if (index === 0) {
        value = mapValue.controls;
        this .inerateFields(title, value);
      }
    });
  }

  inerateFields(title, myvalue) {
    if (!myvalue) {
      return false;
    }
    Object.keys(myvalue).forEach((key) => {
      if ((myvalue[key].type !== 'spacer') || (myvalue[key].type !== 'DivControl')) {
        let tagname;
        if (myvalue[key].params.label === 'hideControl') {
          return false;
        }
        try {
          if (myvalue[key].params.tagName) { tagname = myvalue[key].params.tagName;
          } else {
            tagname = null;
          }
        } catch (e) { }

        this.generateSummary(myvalue[key], title, this.labelval, tagname, this.translatedvalue);
        this.checkemptySection(this.dataObject, title);
        this.ChangeSubheaderStatus(this.dataObject, myvalue[key].params.subheader);
        this.summaryRender.push(this.dataObject);
        this.generalDetailCreateHide(this.dataObject);
        /* code refactor */
      }
    });

    this.checkEmptySections();
  }

  generateSummaryinputDate(myvalueKey, title, labelval, tagname) {
    if (myvalueKey.params.label) {
      this .translateservice.get(myvalueKey.params.label).subscribe((res: any) => {
        labelval = res; }); }
    this.dataObject = {
      pagekey: title, header: title, label: labelval, value: myvalueKey.value, isDate: true, isTextArea: false,
      status: true, tagName: tagname,
    };
  }

  generateSummaryinputdropdown(myvalueKey, title, labelval, tagname) {
    if (myvalueKey.params.label && myvalueKey.value) {
      this .translateservice.get(myvalueKey.params.label).subscribe((res: any) => {
        labelval = res; }); }
    let dropdownval;
    if (myvalueKey.value.shortName !== undefined) { dropdownval = myvalueKey.value.shortName; }
    this.dataObject = {
      pagekey: title, header: title, label: labelval, value: dropdownval, isDate: false, isTextArea: true,
      status: true, tagName: tagname };
  }

  generateSummaryinputnarrative(myvalueKey, title, labelval, tagname) {
    if (myvalueKey.params.label && myvalueKey.value) {
      this .translateservice.get(myvalueKey.params.label).subscribe((res: any) => {
        labelval = res;
      });
    }
    this.dataObject = {
      pagekey: title, header: title, label: labelval, value: myvalueKey.value, isDate: false, isTextArea: true,
      status: true, tagName: tagname
    };
  }

  generateSummaryinputradio(myvalueKey, title, labelval, tagname, translatedvalue) {
    if (myvalueKey.params.label && myvalueKey.value) {
      this.translateservice.get(myvalueKey.value).subscribe((res: any) => { translatedvalue = res; }); }
    this.dataObject = {
      header: title, label: myvalueKey.params.label, value: translatedvalue, isDate: false, isTextArea: false,
      status: true, tagName: tagname
    };
  }

  generateSummaryinputtable(myvalueKey, title, labelval, tagname) {
    if (myvalueKey.params.label && myvalueKey.params.data.length) {
      this.fileUploadColumns = myvalueKey.params.columns;
      this.fileMap = myvalueKey.params.data;
      this.dataObject = { pagekey: title, header: title, label: myvalueKey.params.label, value: myvalueKey.params.label, isDate: false,
               isTextArea: false, status: true, tagName: tagname, tableColumns: this.fileUploadColumns, tableData: this.fileMap,
               key: 'fileUploadTable' };
  } else {
    this.dataObject = { pagekey: title, header: title, label: myvalueKey.params.label, value: myvalueKey.value, isDate: false,
               isTextArea: false, status: true, tagName: tagname, key: 'fileUploadTable' }; }


  }

  generateSummary( myvalueKey, title, labelval, tagname, translatedvalue) {
    if (myvalueKey.type === 'input-date') {
      this.generateSummaryinputDate(myvalueKey, title, labelval, tagname);
    } else if ((myvalueKey.type === 'input-dropdown') || (myvalueKey.type === 'input-dropdown-filter')) {
     this.generateSummaryinputdropdown(myvalueKey, title, labelval, tagname);
    } else if (myvalueKey.type === 'narrative-textarea') {
     this.generateSummaryinputnarrative(myvalueKey, title, labelval, tagname);
    } else if (myvalueKey.type === 'input-radio' || myvalueKey.type === 'input-radio-check') {
      this.generateSummaryinputradio(myvalueKey, title, labelval, tagname, translatedvalue);
    } else if (myvalueKey.type === 'input-table') {
      this.generateSummaryinputtable(myvalueKey, title, labelval, tagname);
    } else {
      if (myvalueKey.params.label && myvalueKey.value) {
        this .translateservice.get(myvalueKey.params.label).subscribe((res: any) => { labelval = res; }); }
      this.dataObject = { pagekey: title, header: title, label: labelval, value: myvalueKey.value, isDate: false, isTextArea: false,
        status: true, tagName: tagname }; }
}

  checkEmptySections() {
    let status;
    status = false;
    for (let i = this.summaryRender.length - 1; i > 0; i--) {

      if (!status) {
        if (this.summaryRender[i].value) {
          status = true;
        } else {
          this.summaryRender[i].header = '';
        }
      }

    }
  }

  ChangeSubheaderStatus(item, data) {
    if (!data) {
      return false;
    }
    if (data === 'Applicant' && item.value) {
      this.applicantStatus = true;
    }
    if (data === 'alternateapplicantdetails' && item.value) {
      this.alternateapplicantdetailsStatus = true;
    }
    if (data === 'beneficiary' && item.value) {
      this.beneficiaryStatus = true;
    }
    if (data === 'goodsandDoc' && item.value) {
      this.goodsandDocStatus = true;
    }
    if (data === 'otherDetails' && item.value) {
      this.otherDetailsStatus = true;
    }

    if (data === 'issuingBank' && item.value) {
      this.issuingBankStatus = true;
    }
    if (data === 'advisingBank' && item.value) {
      this.advisingBankStatus = true;
    }
    if (data === 'adviceThrough' && item.value) {
      this.adviceThroughStatus = true;
    }
    if (data === 'confirmationParty' && item.value) {
      this.requestedConfirmationPartyStatus = true;
    }
  }

  generalDetailCreateHide(data) {
    if (this.summaryRender.length > 0) {
      this.summaryRender.forEach(ele => {
        if (ele.label === 'CreateFrom' || ele.label === 'Create From' ||
         ele.label === 'Alternate Applicant Details' || ele.label === 'alternateapplicantdetails') {
          data.label = '';
          data.value = '';
        } else {
        }
      });
    }
  }
  checkemptysubtitle(data) {
    if (this.summaryRender.length > 0) {
      this.summaryRender.forEach(ele => {
        if (ele.pagekey === '') {
          data.tagName = '';
        } else {
        }
      });
    }
  }

  checkemptySection(data, title) {
    this.checkemptysubtitle(data);
    if (this.summaryRender.length > 0) {
      this.summaryRender.forEach(ele => {
        if (ele.header === title) {
          data.header = '';
        } else {
        }
      });
    }

  }

  setDirection() {
    if (this .dir === 'rtl') {
      return 'left';
    } else {
      return 'right';
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  submitForm(e) {
    this.sectionMap = this.utilityService.getSummaryData()[Symbol.iterator]();
    for (const [mapKey, mapValue] of this.sectionMap) {
      if (mapKey === FccGlobalConstant.GENERAL_DETAILS && mapValue) {
        this.generalDetailsRequest(mapValue);
      } else if (mapKey === FccGlobalConstant.APPLICANT_BENEFICIARY && mapValue) {
        this.applicantDetailsRequest(mapValue);
      } else if (mapKey === FccGlobalConstant.BANK_DETAILS && mapValue) {
        this.bankDetailsRequest(mapValue);
      } else if (mapKey === FccGlobalConstant.AMOUNT_CHARGE_DETAILS && mapValue) {
        this.amountChargeDetailsRequest(mapValue);
      } else if (mapKey === FccGlobalConstant.PAYMENT_DETAILS && mapValue) {
        this.paymentDetailsRequest(mapValue);
      } else if (mapKey === FccGlobalConstant.SHIPMENT_DETAILS && mapValue) {
        this.shipmentDetailsRequest(mapValue);
      } else if (mapKey === FccGlobalConstant.NARRATIVE_DETAILS && mapValue) {
        this.narrativeDetailsRequest(mapValue);
      } else if (mapKey === FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY && mapValue) {
        this.instructionForBankDetailsRequest(mapValue);
      }
    }

    // this.reauthService.reauthenticate(reauthData, FccGlobalConstant.reAuthComponentKey);
  }

  generalDetailsRequest(mapValue) {
    if (mapValue.value.requestType === FccGlobalConstant.PROVISIONAL) {
      this .otherDetails.provisional = true;
    } else {
      this .otherDetails.provisional = false;
    }
    this .otherDetails.transactionType = 'NEW';
    this .lcDetails.issueBy = mapValue.value.transmissionMode.toUpperCase();
    this .lcDetails.expiryDate = this .utilityService.transformDate(mapValue.value.expiryDate);
    this.lcDetails.expiryPlace = mapValue.value.placeOfExpiry;
    if (mapValue.value.confirmationOptions === FccGlobalConstant.MAYADD) {
      this .confirmation.instruction = 'MAY-ADD';
    } else {
      this .confirmation.instruction = mapValue.value.confirmationOptions.toUpperCase();
    }
    this .applicableRules.id = mapValue.value.applicableRulesOptions.shortName;
    if (mapValue.value.applicableRulesOptions === FccGlobalConstant.OTHER) {
      this.applicableRules.narrative = mapValue.value.otherApplicableRules;
    }
    // this .applicableRules.narrative = mapValue.value.otherApplicableRules;
    this .lcDetails.applicableRule = this .applicableRules;
    this .lcType.transferable = false;
    this .lcType.revolving = false;
    this .lcType.standbyLC = false;
    // if (mapValue.value.featureofLCOptions === FccGlobalConstant.IRREVOCABLE) {
    //     this .lcType.transferable = true;
    //   }
    // if (mapValue.value.featureofLCOptions === FccGlobalConstant.REVOLVING) {
    //     this .lcType.revolving = true;
    //   }
    // if (mapValue.value.featureofLCOptions === FccGlobalConstant.NON_TRANSFERABLE) {
    //     this .lcType.standbyLC = true;
    //   }
    for (let i = 0 ; i < mapValue.value.featureofLCOptions.length ; i++) {
      if (mapValue.value.featureofLCOptions[i] === 'irrevocable') {
            this.lcType.transferable = true;
          } else if (mapValue.value.featureofLCOptions[i] === 'revolving') {
            this.lcType.revolving = true;
          } else if (mapValue.value.featureofLCOptions[i] === 'nonTransferable') {
            this.lcType.standbyLC = true;
          }

    }
    this .lcDetails.senderReference = mapValue.value.customerReference;
    this .beneficiary.reference = mapValue.value.benefeciaryReference;

    this .lcRequestForm.lcDetails = this .lcDetails;
    this .lcRequestForm.beneficiary = this .beneficiary;
    this .lcRequestForm.lcType = this .lcType;
    this .lcRequestForm.confirmation = this .confirmation;
    this .lcRequestForm.otherDetails = this .otherDetails;
  }

  applicantDetailsRequest(mapValue) {
    if (mapValue.value.applicantEntity) {
      this .applicant.entityShortName = mapValue.value.applicantEntity.shortName;
    }
    this .applicant.entityName = mapValue.value.applicantName;
    if (this .lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
      this .address.line1 = mapValue.value.applicantFirstAddress;
      this .address.line2 = mapValue.value.applicantSecondAddress;
      this .address.line3 = mapValue.value.applicantThirdAddress;
    } else {
      this .address.line1 = mapValue.value.applicantFullAddress;
    }
    this .applicant.address = this .address;
    this .alternateApplicant.name = mapValue.value.altApplicantName;
    if (this .lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
        this .alternateApplicant.line1 = mapValue.value.altApplicantFirstAddress;
        this .alternateApplicant.line2 = mapValue.value.altApplicantSecondAddress;
        this .alternateApplicant.line3 = mapValue.value.altApplicantThirdAddress;
    } else {
        this .alternateApplicant.line1 = mapValue.value.altApplicantFullAddress;
    }
    this .alternateApplicant.country = mapValue.value.altApplicantcountry.shortName;
    this .beneficiary.name = mapValue.value.beneficiaryEntity.label;
    this .beneficiary.shortName = mapValue.value.beneficiaryEntity.shortName;
    this .address = new TransactionAddress();
    if (this .lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
        this .address.line1 = mapValue.value.beneficiaryFirstAddress;
        this .address.line2 = mapValue.value.beneficiarySecondAddress;
        this .address.line3 = mapValue.value.beneficiaryThirdAddress;
    } else {
        this .address.line1 = mapValue.value.beneficiaryFullAddress;
    }
    this .beneficiary.address = this .address;
    this .beneficiary.country = mapValue.value.beneficiarycountry.shortName;
    this .lcRequestForm.applicant = this .applicant;
    this .lcRequestForm.alternateApplicant = this .alternateApplicant;
    this .lcRequestForm.beneficiary = this .beneficiary;
  }

  bankDetailsRequest(mapValue) {
    this .issuingBank.bankShortName = mapValue.value.bankNameList.smallName;
    this .issuingBank.issuersReference = mapValue.value.issuerReferenceList.shortName;
    this .advisingBank.bicCode = mapValue.value.advisingswiftCode;
    this .advisingBank.name = mapValue.value.advisingBankName;
    this .address = new TransactionAddress();
    if (this .lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
      this .address.line1 = mapValue.value.advisingBankFirstAddress;
      this .address.line2 = mapValue.value.advisingBankSecondAddress;
      this .address.line3 = mapValue.value.advisingBankThirdAddress;
    } else {
      this .address.line1 = mapValue.value.advisingBankFullAddress;
    }
    this .advisingBank.address = this .address;

    this .adviseThruBank.bicCode = mapValue.value.swiftCode;
    this .adviseThruBank.name = mapValue.value.bankName;
    this .address = new TransactionAddress();
    if (this .lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
      this .address.line1 = mapValue.value.adviceThroughFirstAddress;
      this .address.line2 = mapValue.value.adviceThroughSecondAddress;
      this .address.line3 = mapValue.value.adviceThroughThirdAddress;
    } else {
      this .address.line1 = mapValue.value.adviceThroughFullAddress;
    }
    this .adviseThruBank.address = this .address;
    this . address = new TransactionAddress();
    if (this .confirmation.instruction === Confirmation.InstructionEnum.CONFIRM) {
      if (mapValue.value.counterPartyList === 'Advising Bank') {
        this .confirmation.requestedConfirmationPartyRole = Confirmation.RequestedConfirmationPartyRoleEnum.ADVISINGBANK;
      } else if (mapValue.value.counterPartyList === 'Advising Through') {
        this .confirmation.requestedConfirmationPartyRole = Confirmation.RequestedConfirmationPartyRoleEnum.ADVISETHROUGHBANK;
      } else if (mapValue.value.counterPartyList === 'Other') {
        this .confirmation.requestedConfirmationPartyRole = Confirmation.RequestedConfirmationPartyRoleEnum.OTHER;
      }
      this .requestedConfirmationParty.bicCode = mapValue.value.confirmationPartySwiftCode;
      this .requestedConfirmationParty.name = mapValue.value.confirmationBankName;
      if (this .lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
        this .address.line1 = mapValue.value.confirmationAddressFirstAddress;
        this .address.line2 = mapValue.value.confirmationAddressSecondAddress;
        this .address.line3 = mapValue.value.confirmationAddressThirdAddress;
      } else {
        this .address.line1 = mapValue.value.confirmationAddressFullAddress;
      }
    }
    this .requestedConfirmationParty.address = this .address;
    this .confirmation.requestedConfirmationParty = this .requestedConfirmationParty;
    this .lcRequestForm.confirmation = this .confirmation;
    this .lcRequestForm.issuingBank = this .issuingBank;
    this .lcRequestForm.advisingBank = this .advisingBank;
    this .lcRequestForm.adviseThroughBank = this .adviseThruBank;
  }

  amountChargeDetailsRequest(mapValue) {
    this .amount.currency = mapValue.value.currency.currencyCode;
    // Sending amount value with only decimals as per API confirmation
    const amt = mapValue.value.amount;
    this .amount.amount = amt.replace(/[^0-9.]/g, '');
    this .amountTolerance.maxPercentAmountTolerance = mapValue.value.percp;
    this .amountTolerance.minPercentAmountTolerance = mapValue.value.percm;

    if (mapValue.value.iss === 'issuingBankChargesApplicant') {
      this .chargeDetail.issuanceChargesPayableBy = Charge.IssuanceChargesPayableByEnum.APPLICANT;
    } else if (mapValue.value.iss === 'issuingBankChargesBeneficiary') {
      this .chargeDetail.issuanceChargesPayableBy = Charge.IssuanceChargesPayableByEnum.BENEFICIARY;
    } else {
      this.chargeDetail.issuanceChargesPayableBy = Charge.IssuanceChargesPayableByEnum.SHARED;
    }
    if (mapValue.value.corrc === 'outStdCurrencyApplicant') {
      this .chargeDetail.overseasChargesPayableBy = Charge.OverseasChargesPayableByEnum.APPLICANT;
    } else {
      this .chargeDetail.overseasChargesPayableBy = Charge.OverseasChargesPayableByEnum.BENEFICIARY;
    }
    if (this .confirmation.instruction === Confirmation.InstructionEnum.CONFIRM) {

    }
    if (mapValue.value.cumulativeCheckbox) {
      this .revolving.cumulative = true;
    } else {
      this .revolving.cumulative = false;
    }
    if (mapValue.value.revolveFrequency === 'days') {
      this .revolving.frequency = Revolving.FrequencyEnum.D;
    }
    if (mapValue.value.revolveFrequency === 'months') {
      this .revolving.frequency = Revolving.FrequencyEnum.M;
    }

    this .revolving.period = mapValue.value.revolvePeriod;
    this .revolving.revolutions = mapValue.value.numberOfTimesToRevolve;
    this .revolving.noticeDays = mapValue.value.noticeDays;
    this .narrative.additionalAmount = mapValue.value.addamt;

    this .lcRequestForm.narrative = this .narrative;
    this .lcRequestForm.revolving = this .revolving;
    this .lcRequestForm.chargeDetail = this .chargeDetail;
    this .lcRequestForm.amountTolerance = this .amountTolerance;
    this .lcRequestForm.amount = this .amount;
  }

  paymentDetailsRequest(mapValue) {

    if (mapValue.value.paymentDetailsBankEntity.shortName === this.translateservice.instant('issuingBank')) {
      this.paymentDetails.creditAvailableWith = PaymentDetails.CreditAvailableWithEnum.ISSUINGBANK;
    } else if (mapValue.value.paymentDetailsBankEntity.shortName === this.translateservice.instant('otherBank')) {
      this.paymentDetails.creditAvailableWith = PaymentDetails.CreditAvailableWithEnum.OTHER;
    } else if (mapValue.value.paymentDetailsBankEntity.shortName === this.translateservice.instant('anyBank')) {
      this.paymentDetails.creditAvailableWith = PaymentDetails.CreditAvailableWithEnum.ANYBANK;
    } else if (mapValue.value.paymentDetailsBankEntity.shortName === this.translateservice.instant('advisingBank')) {
      this.paymentDetails.creditAvailableWith = PaymentDetails.CreditAvailableWithEnum.ADVISINGBANK;
    }
    this .paymentDetails.bankName = mapValue.value.paymentDetailsBankName;
    this .address = new TransactionAddress();
    if (this .lcDetails.issueBy === LcDetails.IssueByEnum.SWIFT) {
      this .address.line1 = mapValue.value.paymentDetailsBankFirstAddress;
      this .address.line2 = mapValue.value.paymentDetailsBankSecondAddress;
      this .address.line3 = mapValue.value.paymentDetailsBankThirdAddress;
    } else {
      this .address.line1 = mapValue.value.paymentDetailsBankFirstAddress;
    }
    this .paymentDetails.address = this .address;
    if (mapValue.value.creditAvailableOptions === 'payment') {
      this .paymentDetails.creditAvailableBy = PaymentDetails.CreditAvailableByEnum.SIGHTPAYMENT;
      this .tenor.sight = 'SIGHT';
    } else if (mapValue.value.creditAvailableOptions === 'mixedPayment' ) {
      this .paymentDetails.creditAvailableBy = PaymentDetails.CreditAvailableByEnum.MIXEDPAYMENT;
      this .paymentDetails.mixedPayDetail = mapValue.value.inputTextAreaMixPayment;
    } else {
      if (mapValue.value.creditAvailableOptions.toUpperCase() === PaymentDetails.CreditAvailableByEnum.ACCEPTANCE) {
        this .paymentDetails.creditAvailableBy = PaymentDetails.CreditAvailableByEnum.ACCEPTANCE;
        this .tenor.sight = null;
        this .paymentDetails.draftsDrawnOn = this.inputDraweeDetails;
      }
      if (mapValue.value.creditAvailableOptions.toUpperCase() === PaymentDetails.CreditAvailableByEnum.NEGOTIATION) {
        this .paymentDetails.creditAvailableBy = PaymentDetails.CreditAvailableByEnum.NEGOTIATION;
        if (mapValue.value.paymentDraftWidget === 'Sight') {
          this .tenor.sight = 'SIGHT';
        } else {
          this .tenor.sight = null;
        }
        this .paymentDetails.draftsDrawnOn = this.inputDraweeDetails;
      }
      if (mapValue.value.creditAvailableOptions === 'deferredPayment') {
        this .tenor.sight = null;
        this.paymentDetails.creditAvailableBy = PaymentDetails.CreditAvailableByEnum.DEFERREDPAYMENT;
      }

      this .paymentOptions(mapValue);
    }
    this .paymentDetails.tenor = this .tenor;

    this .lcRequestForm.paymentDetails = this .paymentDetails;
  }

  shipmentDetailsRequest(mapValue) {
    this .shipment.from = mapValue.value.shipmentForm;
    this .shipment.to = mapValue.value.shipmentTo;
    this .shipment.portOfLoading = mapValue.value.shipmentPlaceOfLoading;
    this .shipment.portOfDischarge = mapValue.value.shipmentPlaceOfDischarge;
    if (mapValue.value.lastShipmentDate !== '') {
      this .shipment.date = this .utilityService.transformDate(mapValue.value.shipmentLastDate);
    } else {
      this .shipment.period = mapValue.value.shipmentPeriodText;
    }

    if (mapValue.value.partialshipmentvalue !== '') {
      if (mapValue.value.partialshipmentvalue === 'allowed') {
        this .shipment.partialShipment = Shipment.PartialShipmentEnum.ALLOWED;
      } else if (mapValue.value.partialshipmentvalue === 'notallowed') {
        this .shipment.partialShipment = Shipment.PartialShipmentEnum.NOTALLOWED;
      } else {
        this .shipment.partialShipment = Shipment.PartialShipmentEnum.CONDITIONAL;
      }
    }
    if (mapValue.value.transhipmentvalue !== '') {
      if (mapValue.value.transhipmentvalue === 'ALLOWEDT') {
        this .shipment.transhipment = Shipment.TranshipmentEnum.ALLOWED;
      } else if (mapValue.value.transhipmentvalue === 'NOT ALLOWEDT') {
        this .shipment.transhipment = Shipment.TranshipmentEnum.NOTALLOWED;
      } else {
        this .shipment.transhipment = Shipment.TranshipmentEnum.CONDITIONAL;
      }
    }
    this .shipment.incoTerms = mapValue.value.purchaseTermsValue.label;
    this .shipment.incoPlace = mapValue.value.namedPlace;
    this .lcRequestForm.shipment = this .shipment;
  }

  narrativeDetailsRequest(mapValue) {
    this .narrative.goodsDescription = mapValue.value.descOfGoodsText;
    this .narrative.documentsRequired = mapValue.value.docRequiredText;
    this .narrative.additionalConditions = mapValue.value.addInstructionText;
    this .narrative.specialPaymentConditionsForBeneficiary = mapValue.value.splPaymentBeneText;
    this .periodOfPresentation.presentationDays = mapValue.value.nbdays;
    this .periodOfPresentation.presentationPeriodNarrative = mapValue.value.periodOfPresentationText;
    this .narrative.presentationPeriod = this .periodOfPresentation;
    this .lcRequestForm.narrative = this .narrative;
  }

  instructionForBankDetailsRequest(mapValue) {
    this .account.number = mapValue.value.principalAct.label;
    this .bankInstructions.principalAccount = this .account;
    this .account.number = mapValue.value.feeAct.label;
    this .bankInstructions.feeAccount = this .account;
    this .narrative.otherInformation = mapValue.value.otherInst;
    this .lcRequestForm.bankInstructions = this .bankInstructions;
    this .lcRequestForm.narrative = this .narrative;
  }

  paymentOptions(mapValue) {
    if (mapValue.value.fixedMaturityPaymentDate !== '') {
      this . tenor.maturityDate = this .utilityService.transformDate(mapValue.value.fixedMaturityPaymentDate);
    } else {
      if (mapValue.value.inputDays.label === 'Days') {
        this . tenor.frequency = Tenor.FrequencyEnum.D;
      } else if (mapValue.value.inputDays.label === 'Weeks') {
        this . tenor.frequency = Tenor.FrequencyEnum.W;
      } else if (mapValue.value.inputDays.label === 'Months') {
        this . tenor.frequency = Tenor.FrequencyEnum.M;
      } else if (mapValue.value.inputDays.label === 'Years') {
        this . tenor.frequency = Tenor.FrequencyEnum.Y;
      }
      this . tenor.fromAfter = mapValue.value.inputFrom.label;
      if (mapValue.value.inputSelect) {
        if (mapValue.value.inputSelect.shortName === this.translateservice.instant('airwaybill')) {
          this . tenor.start = Tenor.StartEnum.AIRWAYBILL;
        } else if (mapValue.value.inputSelect.shortName === this.translateservice.instant('arrivalOfgoods')) {
          this . tenor.start = Tenor.StartEnum.ARRIVALOFGOODS;
        } else if (mapValue.value.inputSelect.shortName === this.translateservice.instant('billOfexchange')) {
          this . tenor.start = Tenor.StartEnum.BILLOFEXCHANGE;
        } else if (mapValue.value.inputSelect.shortName === this.translateservice.instant('billOflading')) {
          this . tenor.start = Tenor.StartEnum.BILLOFLADING;
        } else if (mapValue.value.inputSelect.shortName === this.translateservice.instant('invoice')) {
          this . tenor.start = Tenor.StartEnum.INVOICE;
        } else if (mapValue.value.inputSelect.shortName === this.translateservice.instant('shipmentdate')) {
          this . tenor.start = Tenor.StartEnum.SHIPMENTDATE;
        } else if (mapValue.value.inputSelect.shortName === this.translateservice.instant('inputSwitchSight')) {
          this . tenor.start = Tenor.StartEnum.SIGHT;
        } else if (mapValue.value.inputSelect.shortName === this.translateservice.instant('otherBank')) {
          this . tenor.start = Tenor.StartEnum.OTHER;
        }
  }
      this .tenor.period = mapValue.value.inputValNum;
    }
  }

  onClickDownload(event, index) {
    const id = this.uploadFile.getList()[index].attachmentId;
    const fileName = this.uploadFile.getList()[index].fileName;
    this.downloadFile.downloadAttachments(id).subscribe(
      response => {
        let fileType;
        if (response.type) {
          fileType = response.type;
        } else {
          fileType = 'application/octet-stream';
        }
        const newBlob = new Blob([response.body], { type: fileType });

        // IE doesn't allow using a blob object directly as link href
        // instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob);
            return;
        }

        const data = window.URL.createObjectURL(newBlob);
        const link = document.createElement('a');
        link.href = data;
        link.download = fileName;
        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

        window.URL.revokeObjectURL(data);
        link.remove();
    });
  }

}
