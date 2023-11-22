import { TranslateService } from '@ngx-translate/core';
import { VariationDetails } from '../../../../common/model/variationDetails';
import { AbstractControl } from '@angular/forms';
import { Bank } from './Bank';
import { LinkedLicenses } from './linkedLicenses';
import { PartyDetails } from './PartyDetails';
import { IUCommonDataService } from '../service/iuCommonData.service';
import { Charges } from '../../../../common/model/charges.model';
import { Variation } from './Variation.model';
import { BaseRequest } from '../../../../common/model/BaseRequest.model';
import { Constants } from '../../../../common/constants';
import { LimitProduct } from '../../../../common/model/limitProduct';

export class IssuedUndertakingRequest extends BaseRequest {
  leadBankFlag: string;
  issuingBankTypeCode: BigInteger;
  advBankConfReq: string;
  recipientBank: Bank;
  issuingBank: Bank;
  confirmingBank: Bank;
  advisingBank: Bank;
  localAdviseThrough: Bank;
  processingBank: Bank;
  cuRecipientBank: Bank;
  adviseThruBank: Bank;
  requestedConfirmationParty: Bank;
  limitProduct: LimitProduct;
  cuBeneficiary: PartyDetails;
  cuContact: PartyDetails;
  tnxId: string;
  applicantReference: string;
  tnxTypeCode: string;
  purpose: string;
  bgExpDateTypeCode: string;
  advSendMode: string;
  bgDeliveryTo: string;
  bgDelvOrgUndertaking: string;
  bgSendAttachmentsBy: string;
  bgRenewForPeriod: string;
  bgRenewOnCode: string;
  bgRollingRenewForPeriod: string;
  bgRollingRenewOnCode: string;
  refId: string;
  bgRenewFlag: string;
  bgRollingRenewalFlag: string;
  bgAdviseRenewalFlag: string;
  contractReference: string;
  customerIdentifier: string;
  customerIdentifierOther: string;
  cuExpDateTypeCode: string;
  // cancellationReqFlag: string;
  custRefId: string;
  additionalCustRef: string;
  bgIssDateTypeCode: string;
  subProductCode: string;
  cuAmdDetails: string;
  subTnxTypeCode: string;
  bgAmdReqNo: string;
  bgAmdNo: string;
  linkedLicenses: LinkedLicenses;
  bgExpDate: string;
  boRefId: string;
  claimPresentDate: string;
  claimReference: string;
  tnxCurCode: string;
  tnxAmt: string;
  bgFeeActNo: string;
  bgPrincipalActNo: string;
  issDate: string;
  prodStatCode: string;
  bgFreeFormatText: string;
  bgReleaseAmt: string;
  bgAmdDetails: string;
  bgReleaseFlag: string;
  bgAmdDate: string;
  reasonReductionRelease: string;
  bgTextLanguage: string;
  cuTextLanguage: string;
  attids: string;
  reauthPerform: string;
  clientSideEncryption: string;
  reauthPassword: string;
  provisionalStatus: string;
  returnComments: string;
  bgAmt: string;
  parentTnxId: string;
  docRefNo: string;
  boComment: string;
  actionReqCode: string;
  charges: Charges;
  bgRenewalType: string;
  cuRenewalType: string;
  cuVariation: Variation;
  bgVariation: Variation;
  bgCrAvlByCode: string;
  bgCreditAvailableWithBank: Bank;
  anyBankName: Bank;
  cuCrAvlByCode: string;
  cuCreditAvailableWithBank: Bank;
  bgTransferIndicator: string;
  extendedDate: string;
  reqConfParty: string;
  cuTnxAmt: string;
  cuCurCode: string;
  cuAvailableAmt: string;
  bgAvailableAmt: string;
  maturityDate: string;
  latestResponseDate: string;
  guaranteeTypeCompanyId: string;
  guaranteeTypeName: string;
  bgTextDetailsCode: string;
  companyId: string;
  todoListId: string;
  tnxAmtCurCode: string;

  public constructor() {
    super();
  }

  public merge(init: Partial<IssuedUndertakingRequest>) {
    Object.assign(this, init);
  }

  public mergeBankDetailsSection(form: AbstractControl, iUCommonDataService: IUCommonDataService) {
    // Recipient bank tab
    this.recipientBank = new Bank();
    this.leadBankFlag = form[`leadBankFlag`];
    if (form[`recipientBankAbbvNameHidden`] !== '' && form[`recipientBankAbbvNameHidden`] !== null) {
      this.recipientBank.abbvName = form[`recipientBankAbbvNameHidden`];
    } else {
      this.recipientBank.abbvName = iUCommonDataService.getBankDetails(form[`recipientBankAbbvName`]);
    }
    this.recipientBank.name = form[`recipientBankName`];
    this.recipientBank.isoCode = form[`leadBankIdentifier`];
    this.recipientBank.reference = form[`recipientBankCustomerReference`];
    this.recipientBank.brchCode = '00001';
    this.recipientBank.tnxId = this.tnxId;

    // Advising bank tab
    this.advisingBank = new Bank();
    this.advisingBank.isoCode = form[`advisingSwiftCode`];
    this.advisingBank.name = form[`advisingBankName`];
    this.advisingBank.addressLine1 = form[`advisingBankAddressLine1`];
    this.advisingBank.addressLine2 = form[`advisingBankAddressLine2`];
    this.advisingBank.dom = form[`advisingBankDom`];
    this.advisingBank.addressLine4 = form[`advisingBankAddressLine4`];
    if (form[`advBankConfReq`]) {
      this.reqConfParty = Constants.ADVISING_BANK;
    }
    this.advisingBank.brchCode = '00001';
    this.advisingBank.tnxId = this.tnxId;

    // Advise Thru bank
    this.adviseThruBank = new Bank();
    this.adviseThruBank.isoCode = form[`adviseThruSwiftCode`];
    this.adviseThruBank.name = form[`adviseThruBankName`];
    this.adviseThruBank.addressLine1 = form[`adviseThruBankAddressLine1`];
    this.adviseThruBank.addressLine2 = form[`adviseThruBankAddressLine2`];
    this.adviseThruBank.dom = form[`adviseThruBankDom`];
    this.adviseThruBank.addressLine4 = form[`adviseThruBankAddressLine4`];
    this.advisingBank.brchCode = '00001';
    this.advisingBank.tnxId = this.tnxId;
    if (form[`adviseThruBankConfReq`]) {
      this.reqConfParty = Constants.ADVISE_THRU_BANK;
    }
	
	// Advise Thru bank
    this.localAdviseThrough = new Bank();
    this.localAdviseThrough.isoCode = form[`localAdviseThroughSwiftCode`];
    this.localAdviseThrough.name = form[`localAdviseThroughName`];
    this.localAdviseThrough.addressLine1 = form[`localAdviseThroughAddressLine1`];
    this.localAdviseThrough.addressLine2 = form[`localAdviseThroughAddressLine2`];
    this.localAdviseThrough.dom = form[`localAdviseThroughDom`];
    this.localAdviseThrough.addressLine4 = form[`localAdviseThroughAddressLine4`];
    this.localAdviseThrough.brchCode = '00001';
    this.localAdviseThrough.tnxId = this.tnxId;
    if (form[`localAdviseThroughConfReq`]) {
      this.reqConfParty = Constants.LOCAL_ADVISE_THROUGH_BANK;
    }
	
    // issuing bank tab
    this.issuingBank = new Bank();
    this.issuingBankTypeCode = form[`issuingBankTypeCode`];
    this.issuingBank.isoCode = form[`issuingBankSwiftCode`];
    this.issuingBank.name = form[`issuingBankName`];
    this.issuingBank.addressLine1 = form[`issuingBankAddressLine1`];
    this.issuingBank.addressLine2 = form[`issuingBankAddressLine2`];
    this.issuingBank.dom = form[`issuingBankDom`];
    this.issuingBank.addressLine4 = form[`issuingBankAddressLine4`];
    this.issuingBank.brchCode = '00001';
    this.issuingBank.tnxId = this.tnxId;

    // Confirming bank tab
    this.confirmingBank = new Bank();
    this.confirmingBank.isoCode = form[`confirmingSwiftCode`];
    this.confirmingBank.name = form[`confirmingBankName`];
    this.confirmingBank.addressLine1 = form[`confirmingBankAddressLine1`];
    this.confirmingBank.addressLine2 = form[`confirmingBankAddressLine2`];
    this.confirmingBank.dom = form[`confirmingBankDom`];
    this.confirmingBank.addressLine4 = form[`confirmingBankAddressLine4`];
    this.confirmingBank.brchCode = '00001';
    this.confirmingBank.tnxId = this.tnxId;

    // Processing bank tab
    this.processingBank = new Bank();
    this.processingBank.isoCode = form[`processingSwiftCode`];
    this.processingBank.name = form[`processingBankName`];
    this.processingBank.addressLine1 = form[`processingBankAddressLine1`];
    this.processingBank.addressLine2 = form[`processingBankAddressLine2`];
    this.processingBank.dom = form[`processingBankDom`];
    this.processingBank.addressLine4 = form[`processingBankAddressLine4`];
    this.processingBank.brchCode = '00001';
    this.processingBank.tnxId = this.tnxId;

    // Requested Confirmation Party tab
    this.requestedConfirmationParty = new Bank();
    this.requestedConfirmationParty.isoCode = form[`requestedConfirmationPartySwiftCode`];
    this.requestedConfirmationParty.name = form[`requestedConfirmationPartyName`];
    this.requestedConfirmationParty.addressLine1 = form[`requestedConfirmationPartyAddressLine1`];
    this.requestedConfirmationParty.addressLine2 = form[`requestedConfirmationPartyAddressLine2`];
    this.requestedConfirmationParty.dom = form[`requestedConfirmationPartyDom`];
    this.requestedConfirmationParty.addressLine4 = form[`requestedConfirmationPartyAddressLine4`];
    this.requestedConfirmationParty.brchCode = '00001';
    this.requestedConfirmationParty.tnxId = this.tnxId;

  }

  public mergeLicensesSection(form: AbstractControl) {
    this.linkedLicenses = new LinkedLicenses();
    this.linkedLicenses.license = [];
    this.linkedLicenses.license = form[`listOfLicenses`];
  }

  public mergeChargesSection(form: AbstractControl) {
    this.charges = new Charges();
    this.charges.charge = [];
    this.charges.charge = form[`listOfCharges`];
  }

  public mergeFacilityDetails(redIncrForm: AbstractControl) {
    this.limitProduct = new LimitProduct() ;
    this.limitProduct.facilityId = redIncrForm[`facilityHidden`];
    this.limitProduct.refId = this.refId;
    this.limitProduct.tnxId = this.tnxId;
    this.limitProduct.brchCode = '00001';
    this.limitProduct.companyId = this.companyId;
    this.limitProduct.facilityReference = redIncrForm[`facilityId`];
    this.limitProduct.limitId = redIncrForm[`limitHidden`];
    this.limitProduct.limitReference = redIncrForm[`limitId`];
    this.limitProduct.bookingAmount = redIncrForm[`bookingAmount`];
    this.limitProduct.bookingCurCode = redIncrForm[`bookingCurCode`];
   }

  public mergeCuBankDetailsSection(form: AbstractControl) {
    // Recipient bank tab
    this.cuRecipientBank = new Bank();
    this.cuRecipientBank.abbvName = form[`advisingBankName`];
    this.cuRecipientBank.name = form[`advisingBankName`];
    this.cuRecipientBank.addressLine1 = form[`advisingBankAddressLine1`];
    this.cuRecipientBank.addressLine2 = form[`advisingBankAddressLine1`];
    this.cuRecipientBank.dom = form[`advisingBankDom`];
    this.cuRecipientBank.addressLine4 = form[`advisingBankAddressLine4`];
    this.cuRecipientBank.isoCode = form[`advisingSwiftCode`];
    this.cuRecipientBank.brchCode = '00001';
    this.cuRecipientBank.tnxId = this.tnxId;
  }

  public mergeCreditAvlWithBankDetails(form: AbstractControl, undertakingType: string, iUCommonDataService: IUCommonDataService) {
    if (undertakingType === 'bg') {
      this.bgCreditAvailableWithBank = new Bank();
      this.bgCreditAvailableWithBank.isoCode = '';
      if (form[`bgCreditAvailableWithBank`] === Constants.NUMERIC_STRING_NINTY_NINE) {
        this.bgCreditAvailableWithBank.name = form[`bgAnyBankName`];
        this.bgCreditAvailableWithBank.addressLine1 = form[`bgAnyBankAddressLine1`];
        this.bgCreditAvailableWithBank.addressLine2 = form[`bgAnyBankAddressLine2`];
        this.bgCreditAvailableWithBank.dom = form[`bgAnyBankDom`];
        this.bgCreditAvailableWithBank.addressLine4 = form[`bgAnyBankAddressLine4`];
        this.bgCreditAvailableWithBank.type = form[`bgCreditAvailableWithBank`];
      } else {
      this.bgCreditAvailableWithBank.name = iUCommonDataService.getCrAvailByBankName(form[`bgCreditAvailableWithBank`]);
      this.bgCreditAvailableWithBank.addressLine1 = '';
      this.bgCreditAvailableWithBank.addressLine2 = '';
      this.bgCreditAvailableWithBank.dom = '';
      this.bgCreditAvailableWithBank.addressLine4 = '';
      this.bgCreditAvailableWithBank.type = form[`bgCreditAvailableWithBank`];
      }
      this.bgCreditAvailableWithBank.brchCode = '00001';
      this.bgCreditAvailableWithBank.tnxId = this.tnxId;
    } else if (undertakingType === 'cu') {
      this.cuCreditAvailableWithBank = new Bank();
      this.cuCreditAvailableWithBank.isoCode = '';
      if (form[`cuCreditAvailableWithBank`] === Constants.NUMERIC_STRING_NINTY_NINE) {
        this.cuCreditAvailableWithBank.name = form[`cuAnyBankName`];
        this.cuCreditAvailableWithBank.addressLine1 = form[`cuAnyBankAddressLine1`];
        this.cuCreditAvailableWithBank.addressLine2 = form[`cuAnyBankAddressLine2`];
        this.cuCreditAvailableWithBank.dom = form[`cuAnyBankDom`];
        this.cuCreditAvailableWithBank.addressLine4 = form[`cuAnyBankAddressLine4`];
        this.cuCreditAvailableWithBank.type = form[`cuCreditAvailableWithBank`];
      } else {
      this.cuCreditAvailableWithBank.name = iUCommonDataService.getCrAvailByBankName(form[`cuCreditAvailableWithBank`]);
      this.cuCreditAvailableWithBank.addressLine1 = '';
      this.cuCreditAvailableWithBank.addressLine2 = '';
      this.cuCreditAvailableWithBank.dom = '';
      this.cuCreditAvailableWithBank.addressLine4 = '';
      this.cuCreditAvailableWithBank.brchCode = '00001';
      this.cuCreditAvailableWithBank.type = form[`cuCreditAvailableWithBank`];
      this.cuCreditAvailableWithBank.tnxId = this.tnxId;
    }
  }
}
  public mergeCuBeneficiaryAndContactDetails(form: AbstractControl) {
    this.cuBeneficiary = new PartyDetails();
    this.cuBeneficiary.name = form[`cuBeneficiaryName`];
    this.cuBeneficiary.addressLine1 = form[`cuBeneficiaryAddressLine1`];
    this.cuBeneficiary.addressLine2 = form[`cuBeneficiaryAddressLine2`];
    this.cuBeneficiary.dom = form[`cuBeneficiaryDom`];
    this.cuBeneficiary.addressLine4 = form[`cuBeneficiaryAddressLine4`];
    this.cuBeneficiary.country = form[`cuBeneficiaryCountry`];
    this.cuBeneficiary.beiCode = form[`cuBeiCode`];
    this.cuBeneficiary.reference = form[`cuBeneficiaryReference`];

    this.cuContact = new PartyDetails();
    this.cuContact.name = form[`cuContactName`];
    this.cuContact.addressLine1 = form[`cuContactAddressLine1`];
    this.cuContact.addressLine2 = form[`cuContactAddressLine2`];
    this.cuContact.dom = form[`cuContactDom`];
    this.cuContact.addressLine4 = form[`cuContactAddressLine4`];
  }


  public setApplicantDetails(ruForm: AbstractControl, applicantForm: AbstractControl) {
    applicantForm[`entity`] = ruForm[`entity`];
    applicantForm[`applicantName`] = ruForm[`applicantName`];
    applicantForm[`applicantAbbvName`] = ruForm[`applicantAbbvName`];
    applicantForm[`applicantAddressLine1`] = ruForm[`applicantAddressLine1`];
    applicantForm[`applicantAddressLine2`] = ruForm[`applicantAddressLine2`];
    applicantForm[`applicantDom`] = ruForm[`applicantDom`];
    applicantForm[`applicantAddressLine4`] = ruForm[`applicantAddressLine4`];
    applicantForm[`applicantReference`] = ruForm[`applicantReference`];
  }

  public mergeVariationDetails(redIncrForm: AbstractControl, iuCommonDataService: IUCommonDataService) {
    if (redIncrForm[`bgVariationType`] === '01' ||
      (redIncrForm[`bgVariationType`] === '02' && redIncrForm[`bgVariationsLists`].length === 0)) {
      const regularMap: VariationDetails[] = [];
      regularMap.push(new VariationDetails(redIncrForm[`bgOperationType`],
        redIncrForm[`bgVariationFirstDate`],
        redIncrForm[`bgVariationPct`],
        redIncrForm[`bgVariationAmt`],
        redIncrForm[`bgVariationCurCode`], '01',
        redIncrForm[`bgVariationType`], redIncrForm[`bgAdviseEventFlag`],
        redIncrForm[`bgAdviseDaysPriorNb`], redIncrForm[`bgMaximumNbVariation`],
        redIncrForm[`bgVariationFrequency`], redIncrForm[`bgVariationPeriod`],
        redIncrForm[`bgVariationDayInMonth`], '01'));
      redIncrForm[`bgVariationsLists`] = regularMap;
    }
    for (const variation of redIncrForm[`bgVariationsLists`]) {
      variation.adviseFlag = iuCommonDataService.getCheckboxFlagValues(redIncrForm[`bgAdviseEventFlag`]);
      variation.adviseReductionDays = redIncrForm[`bgAdviseDaysPriorNb`];
    }
    if (redIncrForm[`bgVariationsLists`] !== '') {
      this.bgVariation = new Variation();
      this.bgVariation.variationLineItem = redIncrForm[`bgVariationsLists`];
    }
  }

  public mergeCuVariationDetails(cuRedIncrForm: AbstractControl, iuCommonDataService: IUCommonDataService) {
    if (cuRedIncrForm[`cuVariationType`] === '01' ||
      (cuRedIncrForm[`cuVariationType`] === '02' && cuRedIncrForm[`cuVariationsLists`].length === 0)) {
      const cuRegularMap: VariationDetails[] = [];
      cuRegularMap.push(new VariationDetails(cuRedIncrForm[`cuOperationType`],
        cuRedIncrForm[`cuVariationFirstDate`],
        cuRedIncrForm[`cuVariationPct`],
        cuRedIncrForm[`cuVariationAmt`],
        cuRedIncrForm[`cuVariationCurCode`], '01',
        cuRedIncrForm[`cuVariationType`], cuRedIncrForm[`cuAdviseEventFlag`],
        cuRedIncrForm[`cuAdviseDaysPriorNb`], cuRedIncrForm[`cuMaximumNbVariation`],
        cuRedIncrForm[`cuVariationFrequency`], cuRedIncrForm[`cuVariationPeriod`],
        cuRedIncrForm[`cuVariationDayInMonth`], '02'));
      cuRedIncrForm[`cuVariationsLists`] = cuRegularMap;
    }
     // let i = 0; i < cuRedIncrForm[`cuVariationsLists`].length; i++
    for (const variation of cuRedIncrForm[`cuVariationsLists`]) {
      variation.adviseFlag = iuCommonDataService.getCheckboxFlagValues(cuRedIncrForm[`cuAdviseEventFlag`]);
      variation.adviseReductionDays = cuRedIncrForm[`cuAdviseDaysPriorNb`];    }
    if (cuRedIncrForm[`cuVariationsLists`] !== '') {
      this.cuVariation = new Variation();
      this.cuVariation.variationLineItem = cuRedIncrForm[`cuVariationsLists`];
    }
  }
}

