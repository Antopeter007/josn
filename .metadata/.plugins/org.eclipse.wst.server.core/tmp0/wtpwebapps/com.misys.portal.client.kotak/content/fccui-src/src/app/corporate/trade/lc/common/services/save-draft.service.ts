import { ImportLetterOfCreditTemplate } from '../../initiation/model/importLetterOfCreditTemplate';
import { Account } from './../../initiation/model/account';
import { FccGlobalConstant } from '../../../../../common/core/fcc-global-constants';
import { OtherDetails } from './../../initiation/model/otherDetails';
import { FccGlobalConstantService } from '../../../../../common/core/fcc-global-constant.service';
import { CommonService } from './../../../../../common/services/common.service';
import { MessageService } from 'primeng/api';
import { Entities } from './../../../../../common/model/entities';
import { ImportLetterOfCreditSaveTransaction } from '../../initiation/model/importLetterOfCreditSaveTransaction';
import { MessageResponse } from '../../initiation/model/messageResponse';
import { LcDetailsSave } from '../../initiation/model/lcDetailsSave';
import { TransactionAddress } from '../../initiation/model/address';
import { Injectable } from '@angular/core';
import { UtilityService } from '../../initiation/services/utility.service';
import { Confirmation } from '../../initiation/model/confirmation';
import { PaymentDetails } from '../../initiation/model/paymentDetails';

import { ImportLetterOfCreditSaveResponse } from '../../initiation/model/importLetterOfCreditSaveResponse';
import { LcTypes } from '../../initiation/model/lcTypes';
import { Applicant } from '../../initiation/model/applicant';
import { AlternateApplicantDetails } from '../../initiation/model/alternateApplicantDetails';
import { Beneficiary } from '../../initiation/model/beneficiary';
import { Amount } from '../../initiation/model/amount';
import { Tolerance } from '../../initiation/model/tolerance';
import { Charge } from '../../initiation/model/charge';
import { Revolving } from '../../initiation/model/revolving';
import { Shipment } from '../../initiation/model/shipment';
import { IssuingBank } from '../../initiation/model/issuingBank';
import { Bank } from '../../initiation/model/bank';
import { License } from '../../initiation/model/license';
import { Narrative } from '../../initiation/model/narrative';
import { BankInstructions } from '../../initiation/model/bankInstructions';
import { Attachments } from '../../initiation/model/attachments';
import { DraftDetails } from '../../initiation/model/draftDetails';

import { ApplicableRule } from '../../initiation/model/applicableRule';
import { Tenor } from '../../initiation/model/tenor';
import { PresentationPeriod } from '../../initiation/model/presentationPeriod';
import { BehaviorSubject } from 'rxjs';
import { CorporateCommonService } from '../../../../../corporate/common/services/common.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductStateService } from './product-state.service';


@Injectable({
  providedIn: 'root'
})
export class SaveDraftService {
  statusCode = FccGlobalConstant.LENGTH_200 ;
  timerCode = 60000;
  minutesago = `${this.translateService.instant('minutesAgo')}`;
  savedJustNow = `${this.translateService.instant('savedJustNow')}`;
  generatedLcNumber = '';
  generateEventID;
  intervalId1;
  intervalId2;
  showProgresssSpinner = false;
  count = 1;
  savedTime = '';
  save = `${this.translateService.instant('save')}`;
  savedTimeTextShowvalue = false;
  public spinnerShow = new BehaviorSubject(false);
  public saveUrlStatus = new BehaviorSubject(this.save);
  public savedTimeTextShow = new BehaviorSubject(false);
  public savedTimeText = new BehaviorSubject(this.savedTime);
  entities = [];
  entity: Entities;
  entityName;
  applicantName;
  public map = new Map([
    [FccGlobalConstant.GENERAL_DETAILS, undefined],
    [FccGlobalConstant.APPLICANT_BENEFICIARY, undefined],
    [FccGlobalConstant.BANK_DETAILS, undefined],
    [FccGlobalConstant.AMOUNT_CHARGE_DETAILS, undefined],
    [FccGlobalConstant.PAYMENT_DETAILS, undefined],
    [FccGlobalConstant.SHIPMENT_DETAILS, undefined],
    [FccGlobalConstant.NARRATIVE_DETAILS, undefined],
    [FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY, undefined],
    [FccGlobalConstant.MODE_OF_TRANSMISSION, undefined]
  ]);
  sectionMap: Map<string, string>;
  saveLCAsTransaction;
  saveLCAsResponse;
  lcDetails = new LcDetailsSave();
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
  account = new Account();
  attachments = new Attachments();
  draftDetails = new DraftDetails();
  otherDetails = new OtherDetails();
  applicableRules = new ApplicableRule();
  tenor = new Tenor();
  periodOfPresentation = new PresentationPeriod();
  address = new TransactionAddress();
  messageDetails = new MessageResponse();
  successStatusCode = this.statusCode;
  saveMessgae = this.savedJustNow;
  saveMinuteMessgae = this.minutesago;
  inputDraweeDetails: any;
  etag;
  lcTemplateRequest = new ImportLetterOfCreditTemplate();
  templateCreated = true;
  constructor(protected utilityService: UtilityService, protected messageService: MessageService,
              protected commonService: CommonService, protected corporateCommonService: CorporateCommonService,
              protected fccGlobalConstantService: FccGlobalConstantService, protected translateService: TranslateService,
              protected router: Router, protected stateService: ProductStateService) { }

  putFormdata(key, data) {
    this.map.set(key, data);
  }

  getSectionData(key) {
    return this.map.get(key);
  }

  saveFormData(key, data, requestType): any {
    // this.sectionMap = this.utilityService.getSummaryData();
    this.saveLCAsResponse = new ImportLetterOfCreditSaveResponse();
    this.saveLCAsTransaction = new ImportLetterOfCreditSaveTransaction();
    if (requestType === 'POST') {
      this.generalDetailsRequest(data);
    }
    if (requestType === 'UPDATE') {
      this.generalDetailsRequestForPut(this.getSectionData(FccGlobalConstant.GENERAL_DETAILS));
      this.applicantDetailsRequest(this.getSectionData(FccGlobalConstant.APPLICANT_BENEFICIARY));
      this.bankDetailsRequest(this.getSectionData(FccGlobalConstant.BANK_DETAILS));
      this.amountChargeDetailsRequest(this.getSectionData(FccGlobalConstant.AMOUNT_CHARGE_DETAILS));
      this.paymentDetailsRequest(this.getSectionData(FccGlobalConstant.PAYMENT_DETAILS));
      this.shipmentDetailsRequest(this.getSectionData(FccGlobalConstant.SHIPMENT_DETAILS));
      this.narrativeDetailsRequest(this.getSectionData(FccGlobalConstant.NARRATIVE_DETAILS));
      this.instructionForBankDetailsRequest(this.getSectionData(FccGlobalConstant.INSTRUCTIONS_FOR_THE_BANK_ONLY));

    }
    if (CommonService.isTemplateCreation) {
      return this.lcTemplateRequest;
    } else {
      return this.saveLCAsResponse;
    }
  }

  generalDetailsRequest(mapValue) {
    // const controlKeys = Object.keys(mapValue.controls);
    // controlKeys.forEach(element => {
    //   const field = mapValue.controls[element]['params'].apiClassMapping;
    //   if (field !== undefined) {
    //     const classInstance = this.getInstance(field);
    //     console.log(classInstance);
    //   }
    // });
    if (!CommonService.isTemplateCreation) {
    if (mapValue.value.requestOptionsLC === 'provisional') {
      this.otherDetails.provisional = true;
    } else {
      this.otherDetails.provisional = false;
    }
  }
    this.otherDetails.transactionType = 'NEW';
    // this.generalDetails.applicationDate = this.utilityService.transformDate(new Date());
    this.lcDetails.issueBy = mapValue.value.transmissionMode.toUpperCase();
    this.lcDetails.expiryDate = this.utilityService.transformDate(mapValue.value.expiryDate);
    this.lcDetails.expiryPlace = mapValue.value.placeOfExpiry;
    if (mapValue.value.confirmationOptions === 'mayadd') {
      this.confirmation.instruction = 'MAY-ADD';
    } else {
      this.confirmation.instruction = mapValue.value.confirmationOptions.toUpperCase();
    }
    this.applicableRules.id = mapValue.value.applicableRulesOptions.shortName;
    if (mapValue.value.applicableRulesOptions === 'EUCPLATESTVERSION') {
      this.applicableRules.id = ApplicableRule.IdEnum.EUCPLATESTVERSION;
    } else if (mapValue.value.applicableRulesOptions === 'EUCPURRLATESTVERSION') {
      this.applicableRules.id = ApplicableRule.IdEnum.EUCPURRLATESTVERSION;
    } else if (mapValue.value.applicableRulesOptions === 'ISPLATESTVERSION') {
      this.applicableRules.id = ApplicableRule.IdEnum.ISPLATESTVERSION;
    } else if (mapValue.value.applicableRulesOptions === 'UCPLATESTVERSION') {
      this.applicableRules.id = ApplicableRule.IdEnum.UCPLATESTVERSION;
    } else if (mapValue.value.applicableRulesOptions === 'UCPURRLATESTVERSION') {
      this.applicableRules.id = ApplicableRule.IdEnum.UCPURRLATESTVERSION;
    } else if (mapValue.value.applicableRulesOptions === 'OTHER') {
      this.applicableRules.id = ApplicableRule.IdEnum.OTHER;
      this.applicableRules.narrative = mapValue.value.otherApplicableRules;
    }
    if (this.applicableRules && this.applicableRules !== '' && this.applicableRules.id) {
      this.lcDetails.applicableRule = this.applicableRules;
    }
    this.lcType.transferable = false;
    this.lcType.revolving = false;
    this.lcType.standbyLC = false;
    // if (mapValue.value.featureofLCOptions[0] === 'irrevocable') {
    //     this.lcType.transferable = true;
    //   } else if (mapValue.value.featureofLCOptions === 'revolving') {
    //     this.lcType.revolving = true;
    //   } else if (mapValue.value.featureofLCOptions === 'nonTransferable') {
    //     this.lcType.standbyLC = true;
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
    this.lcDetails.senderReference = mapValue.value.customerReference;
    this.beneficiary.reference = mapValue.value.benefeciaryReference;
    if (this.entityName !== undefined) {
      this.applicant.entityName = this.applicantName;
      this.applicant.entityShortName = this.entityName;
    } else {
      this.applicant.entityName = this.applicantName;
    }
    this.saveLCAsTransaction.applicant = this.applicant;
    this.saveLCAsTransaction.lcDetails = this.lcDetails;
    this.saveLCAsTransaction.beneficiary = this.beneficiary;
    this.saveLCAsTransaction.lcType = this.lcType;
    this.saveLCAsTransaction.confirmation = this.confirmation;
    this.saveLCAsTransaction.otherDetails = this.otherDetails;
    this.saveLCAsTransaction.alternateApplicant = null;
    this.saveLCAsTransaction.beneficiary = null;
    this.saveLCAsTransaction.amount = null;
    this.saveLCAsTransaction.amountTolerance = null;
    this.saveLCAsTransaction.confirmation = null;
    this.saveLCAsTransaction.chargeDetail = null;
    this.saveLCAsTransaction.revolving = null;
    this.saveLCAsTransaction.paymentDetails = null;
    this.saveLCAsTransaction.shipment = null;
    this.saveLCAsTransaction.issuingBank = null;
    this.saveLCAsTransaction.advisingBank = null;
    this.saveLCAsTransaction.adviseThruBank = null;
    this.saveLCAsTransaction.license = null;
    this.saveLCAsTransaction.narrative = null;
    this.saveLCAsTransaction.bankInstructions = null;
    this.saveLCAsTransaction.attachments = null;
    this.saveLCAsResponse = this.saveLCAsTransaction;
    if (CommonService.isTemplateCreation) {
      this.lcTemplateRequest.applicant = this.applicant;
      this.lcTemplateRequest.lcDetails = this.lcDetails;
      this.lcTemplateRequest.beneficiary = this.beneficiary;
      this.lcTemplateRequest.lcType = this.lcType;
      this.lcTemplateRequest.confirmation = this.confirmation;
      this.lcTemplateRequest.otherDetails = this.otherDetails;
      this.lcTemplateRequest.alternateApplicant = null;
      this.lcTemplateRequest.beneficiary = null;
      this.lcTemplateRequest.amount = null;
      this.lcTemplateRequest.amountTolerance = null;
      this.lcTemplateRequest.confirmation = null;
      this.lcTemplateRequest.chargeDetail = null;
      this.lcTemplateRequest.revolving = null;
      this.lcTemplateRequest.paymentDetails = null;
      this.lcTemplateRequest.shipment = null;
      this.lcTemplateRequest.issuingBank = null;
      this.lcTemplateRequest.advisingBank = null;
      this.lcTemplateRequest.adviseThroughBank = null;
      this.lcTemplateRequest.license = null;
      this.lcTemplateRequest.narrative = null;
      this.lcTemplateRequest.bankInstructions = null;
      this.lcTemplateRequest.attachments = null;
      this.lcTemplateRequest.templateName = mapValue.value.templateName;
      this.lcTemplateRequest.templateDescription = mapValue.value.templateDescription;
    }
  }

  generalDetailsRequestForPut(mapValue) {
    if (!CommonService.isTemplateCreation) {
        if (mapValue.value.requestOptionsLC === 'provisional') {
        this.otherDetails.provisional = true;
      } else {
        this.otherDetails.provisional = false;
      }
    }
    this.otherDetails.transactionType = 'NEW';
    // this.generalDetails.applicationDate = this.utilityService.transformDate(new Date());
    this.lcDetails.issueBy = mapValue.value.transmissionMode.toUpperCase();
    this.lcDetails.expiryDate = this.utilityService.transformDate(mapValue.value.expiryDate);
    this.lcDetails.expiryPlace = mapValue.value.placeOfExpiry;
    // temporary mapping
    // this.lcDetails.expiryPlace = 'London';
    if (mapValue.value.confirmationOptions === 'mayadd') {
      this.confirmation.instruction = 'MAY-ADD';
    } else {
      this.confirmation.instruction = mapValue.value.confirmationOptions.toUpperCase();
    }
    if (mapValue.value.applicableRulesOptions === 'EUCPLATESTVERSION') {
      this.applicableRules.id = ApplicableRule.IdEnum.EUCPLATESTVERSION;
    } else if (mapValue.value.applicableRulesOptions === 'EUCPURRLATESTVERSION') {
      this.applicableRules.id = ApplicableRule.IdEnum.EUCPURRLATESTVERSION;
    } else if (mapValue.value.applicableRulesOptions === 'ISPLATESTVERSION') {
      this.applicableRules.id = ApplicableRule.IdEnum.ISPLATESTVERSION;
    } else if (mapValue.value.applicableRulesOptions === 'UCPLATESTVERSION') {
      this.applicableRules.id = ApplicableRule.IdEnum.UCPLATESTVERSION;
    } else if (mapValue.value.applicableRulesOptions === 'UCPURRLATESTVERSION') {
      this.applicableRules.id = ApplicableRule.IdEnum.UCPURRLATESTVERSION;
    } else if (mapValue.value.applicableRulesOptions === 'OTHER') {
      this.applicableRules.id = ApplicableRule.IdEnum.OTHER;
      this.applicableRules.narrative = mapValue.value.otherApplicableRules;
    }
    if (this.applicableRules && this.applicableRules !== '' && this.applicableRules.id) {
      this.lcDetails.applicableRule = this.applicableRules;
    }
    this.lcType.transferable = false;
    this.lcType.revolving = false;
    this.lcType.standbyLC = false;
    for (let i = 0 ; i < mapValue.value.featureofLCOptions.length ; i++) {
      if (mapValue.value.featureofLCOptions[i] === 'irrevocable') {
            this.lcType.transferable = true;
          } else if (mapValue.value.featureofLCOptions[i] === 'revolving') {
            this.lcType.revolving = true;
          } else if (mapValue.value.featureofLCOptions[i] === 'nonTransferable') {
            this.lcType.standbyLC = true;
          }

    }
    this.lcDetails.senderReference = mapValue.value.customerReference;
    this.beneficiary.reference = mapValue.value.benefeciaryReference;
    if (this.entityName !== undefined) {
      this.applicant.entityName = this.applicantName;
      this.applicant.entityShortName = this.entityName;
    } else {
      this.applicant.entityName = this.applicantName;
    }
    if (CommonService.isTemplateCreation) {
      this.lcTemplateRequest.applicant = this.applicant;
      this.lcTemplateRequest.lcDetails = this.lcDetails;
      this.lcTemplateRequest.beneficiary = this.beneficiary;
      this.lcTemplateRequest.lcType = this.lcType;
      this.lcTemplateRequest.confirmation = this.confirmation;
      this.lcTemplateRequest.otherDetails = this.otherDetails;
      this.lcTemplateRequest.templateName = mapValue.value.templateName;
      this.lcTemplateRequest.templateDescription = mapValue.value.templateDescription;
    } else {
      this.saveLCAsTransaction.applicant = this.applicant;
      this.saveLCAsTransaction.lcDetails = this.lcDetails;
      this.saveLCAsTransaction.beneficiary = this.beneficiary;
      this.saveLCAsTransaction.lcType = this.lcType;
      this.saveLCAsTransaction.confirmation = this.confirmation;
      this.saveLCAsTransaction.otherDetails = this.otherDetails;
      this.saveLCAsResponse = this.saveLCAsTransaction;
      this.saveLCAsResponse.messageDetails = null;
    }
  }


  applicantDetailsRequest(mapValue) {
    if (mapValue !== undefined) {
      if (CommonService.isTemplateCreation) {
        this.entityName = mapValue.value.applicantEntity.shortName;
        this.applicantName = mapValue.value.applicantEntity.name;
        if (this.applicantName === undefined) {
        this.applicantName = mapValue.value.applicantName;
        }
      }
      if (this.entityName !== undefined) {
        this.applicant.entityName = this.applicantName;
        this.applicant.entityShortName = this.entityName;
      } else {
        this.applicant.entityName = this.applicantName;
      }
      this.address = new TransactionAddress();
      if (this.lcDetails.issueBy === LcDetailsSave.IssueByEnum.SWIFT) {
        this.address.line1 = mapValue.value.applicantFirstAddress;
        this.address.line2 = mapValue.value.applicantSecondAddress;
        this.address.line3 = mapValue.value.applicantThirdAddress;
      } else {
        this.address.line1 = mapValue.value.applicantFullAddress;
      }
      this.applicant.address = this.address;
      this.alternateApplicant.name = mapValue.value.altApplicantName;
      if (this.lcDetails.issueBy === LcDetailsSave.IssueByEnum.SWIFT) {
        this.alternateApplicant.line1 = mapValue.value.altApplicantFirstAddress;
        this.alternateApplicant.line2 = mapValue.value.altApplicantSecondAddress;
        this.alternateApplicant.line3 = mapValue.value.altApplicantThirdAddress;
      } else {
        this.alternateApplicant.line1 = mapValue.value.altApplicantFullAddress;
      }
      this.alternateApplicant.country = mapValue.value.altApplicantcountry.shortName;

      this.beneficiary.name = mapValue.value.beneficiaryEntity.label;
      this.beneficiary.shortName = mapValue.value.beneficiaryEntity.shortName;

      this.address = new TransactionAddress();
      if (this.lcDetails.issueBy === LcDetailsSave.IssueByEnum.SWIFT) {
        this.address.line1 = mapValue.value.beneficiaryFirstAddress;
        this.address.line2 = mapValue.value.beneficiarySecondAddress;
        this.address.line3 = mapValue.value.beneficiaryThirdAddress;
      } else {
        this.address.line1 = mapValue.value.beneficiaryFullAddress;
      }
      this.beneficiary.address = this.address;
      this.beneficiary.country = mapValue.value.beneficiarycountry.shortName;
      if (CommonService.isTemplateCreation) {
        this.lcTemplateRequest.applicant = this.applicant;
        this.lcTemplateRequest.alternateApplicant = this.alternateApplicant;
        this.lcTemplateRequest.beneficiary = this.beneficiary;
        this.lcDetails.senderReference = mapValue.value.customerReference;
        this.lcTemplateRequest.lcDetails = this.lcDetails;
        this.otherDetails.transactionType = 'NEW';
        this.lcTemplateRequest.otherDetails = this.otherDetails;
        this.saveLCAsResponse = this.lcTemplateRequest;
     } else {
      this.saveLCAsTransaction.applicant = this.applicant;
      this.saveLCAsTransaction.alternateApplicant = this.alternateApplicant;
      this.saveLCAsTransaction.beneficiary = this.beneficiary;
      this.lcDetails.senderReference = mapValue.value.customerReference;
      this.saveLCAsTransaction.lcDetails = this.lcDetails;
      this.otherDetails.transactionType = 'NEW';
      this.saveLCAsTransaction.OtherDetails = this.otherDetails;
      this.saveLCAsResponse = this.saveLCAsTransaction;
      }
    }
  }


  bankDetailsRequest(mapValue) {
    if (mapValue !== undefined) {
      // this.issuingBank.bankShortName = mapValue.value.bankNameList.shortName;
      this.issuingBank.bankShortName = 'DEMOBANK';
      this.address = new TransactionAddress();
      this.issuingBank.issuersReference = mapValue.value.issuerReferenceList.shortName;
      this.advisingBank.bicCode = mapValue.value.advisingswiftCode;
      this.advisingBank.name = mapValue.value.advisingBankName;
      this.advisingBank.shortName = mapValue.value.advisingBankName;

      if (this.lcDetails.issueBy === LcDetailsSave.IssueByEnum.SWIFT) {
        this.address.line1 = mapValue.value.advisingBankFirstAddress;
        this.address.line2 = mapValue.value.advisingBankSecondAddress;
        this.address.line3 = mapValue.value.advisingBankThirdAddress;
      } else {
        this.address.line1 = mapValue.value.advisingBankFullAddress;
      }
      this.advisingBank.address = this.address;

      this.adviseThruBank.bicCode = mapValue.value.advThroughswiftCode;
      this.adviseThruBank.name = mapValue.value.adviceThroughName;
      this.adviseThruBank.shortName = mapValue.value.adviceThroughName;
      this.address = new TransactionAddress();
      if (this.lcDetails.issueBy === LcDetailsSave.IssueByEnum.SWIFT) {
        this.address.line1 = mapValue.value.adviceThroughFirstAddress;
        this.address.line2 = mapValue.value.adviceThroughSecondAddress;
        this.address.line3 = mapValue.value.adviceThroughThirdAddress;
      } else {
        this.address.line1 = mapValue.value.adviceThroughFullAddress;
      }
      this.adviseThruBank.address = this.address;
      if (this.confirmation.instruction === Confirmation.InstructionEnum.CONFIRM) {
        if (mapValue.value.counterPartyList === 'Advising Bank') {
          this.confirmation.requestedConfirmationPartyRole = Confirmation.RequestedConfirmationPartyRoleEnum.ADVISETHROUGHBANK;
        } else if (mapValue.value.counterPartyList === 'Advising Through') {
          this.confirmation.requestedConfirmationPartyRole = Confirmation.RequestedConfirmationPartyRoleEnum.ADVISETHROUGHBANK;
        } else if (mapValue.value.counterPartyList === 'Other') {
          this.confirmation.requestedConfirmationPartyRole = Confirmation.RequestedConfirmationPartyRoleEnum.ADVISETHROUGHBANK;
        }
        this.requestedConfirmationParty.bicCode = mapValue.value.confirmationPartySwiftCode;
        this.requestedConfirmationParty.name = mapValue.value.confirmationBankName;
        this.requestedConfirmationParty.shortName = mapValue.value.confirmationName;
        this.address = new TransactionAddress();
        if (this.lcDetails.issueBy === LcDetailsSave.IssueByEnum.SWIFT) {
          this.address.line1 = mapValue.value.confirmationFirstAddress;
          this.address.line2 = mapValue.value.confirmationSecondAddress;
          this.address.line3 = mapValue.value.confirmationThirdAddress;
        } else {
          this.address.line1 = mapValue.value.confirmationFullAddress;
        }
        this.requestedConfirmationParty.address = this.address;
        this.confirmation.requestedConfirmationParty = this.requestedConfirmationParty;
        if (CommonService.isTemplateCreation) {
          this.lcTemplateRequest.confirmation = this.confirmation;
        } else {
          this.saveLCAsTransaction.confirmation = this.confirmation;
        }
      }

      if (CommonService.isTemplateCreation) {
        this.lcTemplateRequest.issuingBank = this.issuingBank;
        this.lcTemplateRequest.advisingBank = this.advisingBank;
        this.lcTemplateRequest.adviseThroughBank = this.adviseThruBank;
      } else {
        this.saveLCAsTransaction.issuingBank = this.issuingBank;
        this.saveLCAsTransaction.advisingBank = this.advisingBank;
        this.saveLCAsTransaction.adviseThroughBank = this.adviseThruBank;
      }

      if (this.entityName !== undefined) {
        this.applicant.entityName = this.applicantName;
        this.applicant.entityShortName = this.entityName;
      } else {
        this.applicant.entityName = this.applicantName;
      }
      this.saveLCAsTransaction.applicant = this.applicant;
      this.saveLCAsResponse = this.saveLCAsTransaction;
      if (CommonService.isTemplateCreation) {
        this.lcTemplateRequest.applicant = this.applicant;
      }
    }
  }

  amountChargeDetailsRequest(mapValue) {
    if (mapValue !== undefined) {
      this.amount.currency = mapValue.value.currency.currencyCode;
      // Sending amount value with only decimals as per API confirmation
      const amt = mapValue.value.amount;
      this .amount.amount = amt !== null ? amt.replace(/[^0-9.]/g, '') : '';
      this.amountTolerance.maxPercentAmountTolerance = mapValue.value.percp;
      this.amountTolerance.minPercentAmountTolerance = mapValue.value.percm;

      if (mapValue.value.issuingBankCharges === 'issuingBankChargesApplicant') {
        this.chargeDetail.issuanceChargesPayableBy = Charge.IssuanceChargesPayableByEnum.APPLICANT;
      } else if (mapValue.value.issuingBankCharges === 'issuingBankChargesBeneficiary') {
        this.chargeDetail.issuanceChargesPayableBy = Charge.IssuanceChargesPayableByEnum.BENEFICIARY;
      } else {
        this.chargeDetail.issuanceChargesPayableBy = Charge.IssuanceChargesPayableByEnum.SHARED;
      }
      if (mapValue.value.outStdCurrency === 'outStdCurrencyApplicant') {
        this.chargeDetail.overseasChargesPayableBy = Charge.OverseasChargesPayableByEnum.APPLICANT;
      } else if (mapValue.value.outStdCurrency === 'outStdCurrencyBeneficiary') {
        this.chargeDetail.overseasChargesPayableBy = Charge.OverseasChargesPayableByEnum.BENEFICIARY;
      } else {
        this.chargeDetail.overseasChargesPayableBy = Charge.OverseasChargesPayableByEnum.SHARED;
      }
      if (this.confirmation.instruction === Confirmation.InstructionEnum.CONFIRM) {

      }
      if (mapValue.value.cumulativeCheckbox) {
        this.revolving.cumulative = true;
      } else {
        this.revolving.cumulative = false;
      }
      this.amountandChargeDetailsReq(mapValue);
    }

  }

  amountandChargeDetailsReq(mapValue) {
    if (mapValue !== undefined) {
    if (CommonService.isTemplateCreation) {
      if (mapValue.value.revolveFrequency === 'days') {
       this.revolving.frequency = Revolving.FrequencyEnum.D;
     } else if (mapValue.value.revolveFrequency === 'weeks') {
       this.revolving.frequency = Revolving.FrequencyEnum.W;
     } else if (mapValue.value.revolveFrequency === 'months') {
       this.revolving.frequency = Revolving.FrequencyEnum.M;
     } else if (mapValue.value.revolveFrequency === 'years') {
       this.revolving.frequency = Revolving.FrequencyEnum.Y;
     }
   } else {
     this.revolving.frequency = mapValue.value.revolveFrequency;
   }
    this.revolving.period = mapValue.value.revolvePeriod;
    this.revolving.revolutions = mapValue.value.numberOfTimesToRevolve;
    this.revolving.noticeDays = mapValue.value.noticeDays;
    this.narrative.additionalAmount = mapValue.value.addAmtTextArea;
    this.saveLCAsTransaction.narrative = this.narrative;
    this.saveLCAsTransaction.revolving = this.revolving;
    this.saveLCAsTransaction.chargeDetail = this.chargeDetail;
    this.saveLCAsTransaction.amountTolerance = this.amountTolerance;
    this.saveLCAsTransaction.amount = this.amount;
    this.saveLCAsResponse = this.saveLCAsTransaction;
    if (CommonService.isTemplateCreation) {
    this.lcTemplateRequest.narrative = this.narrative;
    this.lcTemplateRequest.revolving = this.revolving;
    this.lcTemplateRequest.chargeDetail = this.chargeDetail;
    this.lcTemplateRequest.amountTolerance = this.amountTolerance;
    this.lcTemplateRequest.amount = this.amount;
   }
  }
  }
  paymentDetailsRequest(mapValue) {
    if (mapValue !== undefined) {
      this.paymentDetailsCreditAvailableWith(mapValue);
      this .paymentDetails.bankName = mapValue.controls.paymentDetailsBankName.value;
      this .address = new TransactionAddress();
      this .address.line1 = mapValue.controls.paymentDetailsBankFirstAddress.value;
      if (this .lcDetails.issueBy === LcDetailsSave.IssueByEnum.SWIFT) {
        this .address.line2 = mapValue.controls.paymentDetailsBankSecondAddress.value;
        this .address.line3 = mapValue.controls.paymentDetailsBankThirdAddress.value;
      }
      this .paymentDetails.address = this .address;
      this.draweeDetails(mapValue);
      if (mapValue.value.creditAvailableOptions === 'payment') {
        this .paymentDetails.creditAvailableBy = PaymentDetails.CreditAvailableByEnum.SIGHTPAYMENT;
        this .tenor.sight = 'SIGHT';
      } else if (mapValue.value.creditAvailableOptions === 'mixedPayment' ) {
        this .paymentDetails.creditAvailableBy = PaymentDetails.CreditAvailableByEnum.MIXEDPAYMENT;
        this .paymentDetails.mixedPayDetail = mapValue.value.inputTextAreaMixPayment;
      } else {
        if (mapValue.value.creditAvailableOptions.toUpperCase() === PaymentDetails.CreditAvailableByEnum.ACCEPTANCE) {
          this .paymentDetails.creditAvailableBy = PaymentDetails.CreditAvailableByEnum.ACCEPTANCE;
          this .paymentDetails.draftsDrawnOn = this.inputDraweeDetails;
          this .tenor.sight = null;
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

      this .saveLCAsTransaction.paymentDetails = this .paymentDetails;
      this.applicant.entityName = this.applicantName;
      if (this.entityName !== undefined) {
        this.applicant.entityName = this.applicantName;
      }
      this.saveLCAsTransaction.applicant = this.applicant;
      this.saveLCAsResponse = this.saveLCAsTransaction;
      if (CommonService.isTemplateCreation) {
        this.lcTemplateRequest.paymentDetails = this .paymentDetails;
        this.lcTemplateRequest.applicant = this.applicant;
      }
    }

  }
  paymentDetailsCreditAvailableWith(mapValue) {
    if (mapValue.value.paymentDetailsBankEntity.shortName === this.translateService.instant('issuingBank')) {
      this.paymentDetails.creditAvailableWith = PaymentDetails.CreditAvailableWithEnum.ISSUINGBANK;
    } else if (mapValue.value.paymentDetailsBankEntity.shortName === this.translateService.instant('otherBank')) {
      this.paymentDetails.creditAvailableWith = PaymentDetails.CreditAvailableWithEnum.OTHER;
    } else if (mapValue.value.paymentDetailsBankEntity.shortName === this.translateService.instant('anyBank')) {
      this.paymentDetails.creditAvailableWith = PaymentDetails.CreditAvailableWithEnum.ANYBANK;
    } else if (mapValue.value.paymentDetailsBankEntity.shortName === this.translateService.instant('advisingBank')) {
      this.paymentDetails.creditAvailableWith = PaymentDetails.CreditAvailableWithEnum.ADVISINGBANK;
    }
  }

  shipmentDetailsRequest(mapValue) {
    if (mapValue !== undefined) {
      this.shipment.from = mapValue.value.shipmentForm;
      this.shipment.to = mapValue.value.shipmentTo;
      this.shipment.portOfLoading = mapValue.value.shipmentPlaceOfLoading;
      this.shipment.portOfDischarge = mapValue.value.shipmentPlaceOfDischarge;
      this.shipment.date = this.utilityService.transformDate(mapValue.value.shipmentLastDate);
      this.shipment.period = mapValue.value.shipmentPeriodText;
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
      this.shipment.incoTerms = mapValue.value.purchaseTermsValue.label;
      this.shipment.incoPlace = mapValue.value.namedPlace;
      // this.shipment.incoRules = mapValue.value.incoTermsRules.label;
      this.saveLCAsTransaction.shipment = this.shipment;
      if (this.entityName !== undefined) {
        this.applicant.entityName = this.applicantName;
        this.applicant.entityShortName = this.entityName;
      } else {
        this.applicant.entityName = this.applicantName;
      }
      this.saveLCAsTransaction.applicant = this.applicant;
      this.saveLCAsResponse = this.saveLCAsTransaction;
    }
    if (CommonService.isTemplateCreation) {
      this.lcTemplateRequest.shipment = this.shipment;
      this.lcTemplateRequest.applicant = this.applicant;
    }
  }


  narrativeDetailsRequest(mapValue) {
    if (mapValue !== undefined) {
      this.narrative.goodsDescription = mapValue.value.descOfGoodsText;
      this.narrative.documentsRequired = mapValue.value.docRequiredText;
      this.narrative.additionalConditions = mapValue.value.addInstructionText;
      this.narrative.specialPaymentConditionsForBeneficiary = mapValue.value.splPaymentBeneText;
      this.periodOfPresentation = new PresentationPeriod();
      this.periodOfPresentation.presentationDays = mapValue.value.nbdays;
      this.periodOfPresentation.presentationPeriodNarrative = mapValue.value.periodOfPresentationText;
      this.narrative.presentationPeriod = this.periodOfPresentation;
      this.saveLCAsTransaction.narrative = this.narrative;
      if (this.entityName !== undefined) {
        this.applicant.entityName = this.applicantName;
        this.applicant.entityShortName = this.entityName;
      } else {
        this.applicant.entityName = this.applicantName;
      }
      this.saveLCAsTransaction.applicant = this.applicant;
      this.saveLCAsResponse = this.saveLCAsTransaction;
      if (CommonService.isTemplateCreation) {
        this.lcTemplateRequest.narrative = this.narrative;
        this.lcTemplateRequest.applicant = this.applicant;
      }
    }
  }

  instructionForBankDetailsRequest(mapValue) {
    if (mapValue !== undefined) {
      this.account = new Account();
      this.account.number = mapValue.value.principalAct.label;
      this.bankInstructions.principalAccount = this.account;
      this.account = new Account();
      this.account.number = mapValue.value.feeAct.label;
      this.bankInstructions.feeAccount = this.account;
      this.narrative.otherInformation = mapValue.value.otherInst;
      this.saveLCAsTransaction.bankInstructions = this.bankInstructions;
      this.saveLCAsResponse = this.saveLCAsTransaction;
      if (CommonService.isTemplateCreation) {
        this.lcTemplateRequest.bankInstructions = this.bankInstructions;
      }
    }

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
        if (mapValue.value.inputSelect.shortName === this.translateService.instant('airwaybill')) {
          this . tenor.start = Tenor.StartEnum.AIRWAYBILL;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('arrivalOfgoods')) {
          this . tenor.start = Tenor.StartEnum.ARRIVALOFGOODS;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('billOfexchange')) {
          this . tenor.start = Tenor.StartEnum.BILLOFEXCHANGE;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('billOflading')) {
          this . tenor.start = Tenor.StartEnum.BILLOFLADING;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('invoice')) {
          this . tenor.start = Tenor.StartEnum.INVOICE;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('shipmentdate')) {
          this . tenor.start = Tenor.StartEnum.SHIPMENTDATE;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('inputSwitchSight')) {
          this . tenor.start = Tenor.StartEnum.SIGHT;
        } else if (mapValue.value.inputSelect.shortName === this.translateService.instant('otherBank')) {
          this . tenor.start = Tenor.StartEnum.OTHER;
        }
  }
      this .tenor.period = mapValue.value.inputValNum;
    }
  }
 draweeDetails(mapValue) {
  if (mapValue.controls.inputDraweeDetail) {
    if (mapValue.controls.inputDraweeDetail.value === this.translateService.instant('issuingBank')) {
      this.inputDraweeDetails = FccGlobalConstant.ISSUINGBANK;
    } else if (mapValue.controls.inputDraweeDetail.value === this.translateService.instant('otherBank')) {
      this.inputDraweeDetails = FccGlobalConstant.OTHER;
    } else if (mapValue.controls.inputDraweeDetail.value === this.translateService.instant('anyBank')) {
      this.inputDraweeDetails = FccGlobalConstant.ANYBANK;
    } else if (mapValue.controls.inputDraweeDetail.value === this.translateService.instant('advisingBank')) {
      this.inputDraweeDetails = FccGlobalConstant.ADVISINGBANK;
    }
  }
 }
  changeSaveStatus(key, data) {
    if (this.generatedLcNumber === '') {
      this.commonService.getFormValues(this.fccGlobalConstantService.getStaticDataLimit(),
        this.fccGlobalConstantService.userEntities).subscribe(response => {
        if (response.status === this.statusCode) {
          this.entity = response.body;
          if (this.entity.items.length === 1 && (this.generatedLcNumber === undefined || this.generatedLcNumber === '')) {
            this.spinnerShow.next(true);
            this.saveUrlStatus.next(this.translateService.instant('saving'));
            this.entityName = this.entity.items[0].shortName;
            this.applicantName = this.entity.items[0].name;
            let saveLCAsDraft = new ImportLetterOfCreditSaveResponse();
            saveLCAsDraft = this.saveFormData(key, data, 'POST');
            this.commonService.saveFormData(saveLCAsDraft).subscribe(res => {
              this.generatedLcNumber = res.body.messageResponse.id;
              this.generateEventID = res.body.messageResponse.eventId;
              this.saveUrlStatus.next(this.translateService.instant('save'));
              this.spinnerShow.next(false);
              this.savedTimeTextShow.next(true);
              this.savedTimeText.next(this.savedJustNow);
              this.count = 1;
              this.intervalId1 = this.initializeInterval();
            }, () => {
              this.initializeSaveStatus();
            });
          }
          if (this.entity.items.length === 0 && (this.generatedLcNumber === undefined || this.generatedLcNumber === '')) {
            this.corporateCommonService.getValues(this.fccGlobalConstantService.corporateDetails).subscribe(res => {
              if (res.status === this.statusCode) {
                this.spinnerShow.next(true);
                this.save = this.translateService.instant('saving');
                this.saveUrlStatus.next(this.translateService.instant('saving'));
                this.applicantName = res.body.shortName;
                let saveLCAsDraft = new ImportLetterOfCreditSaveResponse();
                saveLCAsDraft = this.saveFormData(key, data, 'POST');
                this.commonService.saveFormData(saveLCAsDraft).subscribe(resp => {
                  this.generatedLcNumber = resp.body.messageResponse.id;
                  this.generateEventID = resp.body.messageResponse.eventId;
                  this.saveUrlStatus.next(this.translateService.instant('save'));
                  this.spinnerShow.next(false);
                  this.savedTimeTextShow.next(true);
                  this.savedTimeText.next(this.savedJustNow);
                  this.count = 1;
                  this.intervalId1 = this.initializeInterval();
                });
              } else {
                this.initializeSaveStatus();
              }
            });
          }
        } else {
          this.initializeSaveStatus();
        }
      }, () => {
        this.initializeSaveStatus();
      });
    }
    if (this.generatedLcNumber !== '') {
      this.generatedLcNumberIsNotBlank(key, data);
    }
  }
  saveLCTemplate(key, data) {
      this.spinnerShow.next(true);
      this.saveUrlStatus.next(this.translateService.instant('saving'));
      let lcTemplateRequest = new ImportLetterOfCreditTemplate();
      if (this.templateCreated) {
        lcTemplateRequest = this.saveFormData(key, data, 'UPDATE');
        this.saveTemplate(lcTemplateRequest);
      } else {
        lcTemplateRequest = this.saveFormData(key, data, 'POST');
        this.saveTemplate(lcTemplateRequest);
      }
  }

  saveTemplate(templateData: any) {
     this.commonService.saveLCTemplateData(templateData).subscribe(res => {
      if (res.status === this.statusCode) {
            this.templateCreated = true;
            this.saveUrlStatus.next(this.translateService.instant('save'));
            this.spinnerShow.next(false);
            this.savedTimeTextShow.next(true);
            this.savedTimeText.next(this.savedJustNow);
            this.count = 1;
            this.intervalId1 = this.initializeInterval();
            const responseData = {
              entity: (res.body.applicant.entityName) ? res.body.applicant.entityName : '' ,
              templateDescription: (res.body.templateDescription) ? res.body.templateDescription : '',
              templateName: res.body.templateName,
              successMessage: res.body.messageResponse.message
            };
            this.router.navigate(['/submit'], { skipLocationChange: false, state: { response: JSON.stringify(responseData) } });
            }
          },
          (error: HttpErrorResponse) => {
            if (error.status === FccGlobalConstant.HTTP_RESPONSE_BAD_REQUEST) {
              // eslint-disable-next-line no-console
              console.log('test');
            }
          });
  }
  generatedLcNumberIsNotBlank(key: any, data: any) {

      //  this.save = 'Saving..';
      this.savedTimeTextShow.next(false);
      this.saveUrlStatus.next(this.translateService.instant('saving'));
      this.spinnerShow.next(true);
      const saveLCAsDraft = this.saveFormData(key, data, 'UPDATE');
      this.commonService.fetchEtagVersion(this.generateEventID).subscribe(resetag => {
      if (resetag.status === this.statusCode) {
      const etagResponse = resetag.headers.get(FccGlobalConstant.etag).replace(/"/g, '');
      this.etag = etagResponse;
      this.commonService.updateSavedFormData(this.generateEventID, this.etag, saveLCAsDraft).subscribe(res => {
        if (res.status === this.statusCode) {
          this.saveUrlStatus.next(this.translateService.instant('save'));
          this.spinnerShow.next(false);
          this.savedTimeTextShow.next(true);
          this.savedTimeText.next(this.translateService.instant('savedNow'));
          this.count = 1;
          if (this.intervalId2) {
            clearInterval(this.intervalId2);
          }
          this.intervalId2 = setInterval(() => {
            if (this.intervalId1) {
              clearInterval(this.intervalId1);
            }
            this.savedTimeText.next(this.translateService.instant('saved') + this.count + this.translateService.instant('minuteAgo'));
            this.count = this.count + 1;
          }, this.timerCode);
        } else {
          this.initializeSaveStatus();
        }
      }, () => {
        this.initializeSaveStatus();
      });
    }
    });


  }
initializeInterval() {
  return [setInterval(() => {
    if (this.count === 1) {
      this.savedTimeText.next(this.translateService.instant('saved') + this.count + this.translateService.instant('minuteAgo'));
    } else {
      this.savedTimeText.next(this.translateService.instant('saved') +
      this.count + this.translateService.instant('minutesAgo'));
    }
    this.count = this.count + 1;
  }, this.timerCode) ];
}

  initializeSaveStatus() {
    if (this.intervalId2) {
      clearInterval(this.intervalId2);
    }
    if (this.intervalId1) {
      clearInterval(this.intervalId1);
    }

    this.saveUrlStatus.next(this.translateService.instant('save'));
    this.savedTimeTextShow.next(false);
    this.spinnerShow.next(false);

  }

  initializeSaveStatusOnDestroy() {
    if (this.intervalId2) {
      clearInterval(this.intervalId2);
    }

    if (this.intervalId1) {
      clearInterval(this.intervalId1);
    }

    this.count = 1;
    this.saveUrlStatus.next(this.translateService.instant('save'));
    this.savedTimeTextShow.next(false);
    this.spinnerShow.next(false);
    this.map.clear();

  }


  subjectInitialization() {
    this.savedTimeTextShow.next(false);
    this.spinnerShow.subscribe(
      data => {
        this.showProgresssSpinner = data;
      }
    );
    this.saveUrlStatus.subscribe(
      data => {
        this.save = data;
      }
    );
    this.savedTimeTextShow.subscribe(
      data => {
        this.savedTimeTextShowvalue = data;
      }
    );
    this.savedTimeText.subscribe(
      data => {
        this.savedTime = data;
      }
    );
  }

  identifySectionName(sectionName) {
    this.changeSaveStatus(sectionName, this.stateService.getSectionData(sectionName));
  }

  identifySectionNameForSave(sectionName) {
    this.changeSaveStatus(sectionName, this.getSectionData(sectionName));
  }

  public showToasterMessage(msg) {
    return this.messageService.add(msg);
  }

  getInstance(className): any {
    const newInstance = Object.create(window[`${className}`].prototype);
    newInstance.constructor.apply(newInstance, []);
    return newInstance;
  }

}
