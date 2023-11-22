import { BaseRequest } from './../../../../common/model/BaseRequest.model';
import { AbstractControl } from '@angular/forms';
import { PartyDetails } from '../../../iu/common/model/PartyDetails';
import { VariationDetails } from '../../../../common/model/variationDetails';
import { Variation } from '../../../iu/common/model/Variation.model';
import { LinkedLicenses } from '../../../iu/common/model/linkedLicenses';
import { IUCommonDataService } from '../../../iu/common/service/iuCommonData.service';
import { Bank } from '../../../../model/bank.model';
import { Charges } from './../../../../../app/common/model/charges.model';
import { Constants } from '../../../../common/constants';


export class ReceivedUndertakingRequest extends BaseRequest {
  leadBankFlag: string;
  issuingBankTypeCode: BigInteger;
  advBankConfReq: string;
  issuingBank: Bank;
  confirmingBank: Bank;
  adviseThruBank: Bank;
  advisingBank: Bank;
  tnxId: string;
  applicantReference: string;
  applDate: string;
  tnxTypeCode: string;
  tnxStatCode: string;
  purpose: string;
  expDateTypeCode: string;
  advSendMode: string;
  reductionClause: string;
  delivery_to: string;
  delv_org_undertaking: string;
  send_attachments_by: string;
  bgRenewForPeriod: string;
  bgRenewOnCode: string;
  bgRollingRenewForPeriod: string;
  bgRollingRenewOnCode: string;
  refId: string;
  reductionAuthorised: string;
  bgRenewFlag: string;
  bgRollingRenewalFlag: string;
  bgAdviseRenewalFlag: string;
  contractReference: string;
  customerIdentifier: string;
  customerIdentifierOther: string;
  cancellation_req_flag: string;
  cust_ref_id: string;
  additional_cust_ref: string;
  issDateTypeCode: string;
  subProductCode: string;
  amd_details_lu: string;
  subTnxTypeCode: string;
  amdNo: string;
  linkedLicenses: LinkedLicenses;
  expDate: string;
  boRefId: string;
  claim_present_date: string;
  claim_reference: string;
  tnxCurCode: string;
  tnxAmt: string;
  bgFeeActNo: string;
  bgPrincipalActNo: string;
  issDate: string;
  adviseDate: string;
  prodStatCode: string;
  freeFormatText: string;
  release_amt: string;
  bgAmdDetails: string;
  bgReleaseFlag: string;
  bgAmdDate: string;
  reason_reduction_release: string;
  bgTextLanguage: string;
  attids: string;
  reauthPerform: string;
  clientSideEncryption: string;
  reauthPassword: string;
  provisional_status: string;
  returnComments: string;
  bgAmt: string;
  bgCurCode: string;
  parentTnxId: string;
  charges: Charges;
  brchCode: string;
  bgVariation: Variation;
  bgCrAvlByCode: string;
  bgCreditAvailableWithBank: Bank;
  productCode: string;
  maturityDate: string;
  latestResponseDate: string;
  actionReqCode: string;
  todoListId: string;

  public constructor() {
    super();
  }

  public merge(init: Partial<ReceivedUndertakingRequest>) {
    Object.assign(this, init);
  }
  public mergeBankDetailsSection(form: AbstractControl, iUCommonDataService: IUCommonDataService) {

    // Advise Thru bank
    this.adviseThruBank = new Bank();
    this.adviseThruBank.isoCode = form[`adviseThruBankSwiftCode`];
    this.adviseThruBank.name = form[`adviseThruBankName`];
    this.adviseThruBank.addressLine1 = form[`adviseThruBankAddressLine1`];
    this.adviseThruBank.addressLine2 = form[`adviseThruBankAddressLine2`];
    this.adviseThruBank.dom = form[`adviseThruBankDom`];
    this.adviseThruBank.addressLine4 = form[`adviseThruBankAddressLine4`];
    this.adviseThruBank.brchCode = `00001`;
    this.adviseThruBank.tnxId = this.tnxId;
    // issuing bank tab
    this.issuingBank = new Bank();
    this.issuingBank.isoCode = form[`issuingBankSwiftCode`];
    this.issuingBank.name = form[`issuingBankName`];
    this.issuingBank.addressLine1 = form[`issuingBankAddressLine1`];
    this.issuingBank.addressLine2 = form[`issuingBankAddressLine2`];
    this.issuingBank.dom = form[`issuingBankDom`];
    this.issuingBank.addressLine4 = form[`issuingBankAddressLine4`];
    this.issuingBank.brchCode = `00001`;
    this.issuingBank.tnxId = this.tnxId;

    // Confirming bank tab
    this.confirmingBank = new Bank();
    this.confirmingBank.isoCode = form[`confirmingBankSwiftCode`];
    this.confirmingBank.name = form[`confirmingBankName`];
    this.confirmingBank.addressLine1 = form[`confirmingBankAddressLine1`];
    this.confirmingBank.addressLine2 = form[`confirmingBankAddressLine2`];
    this.confirmingBank.dom = form[`confirmingBankDom`];
    this.confirmingBank.addressLine4 = form[`confirmingBankAddressLine4`];
    this.confirmingBank.brchCode = '00001';
    this.confirmingBank.tnxId = this.tnxId;

    this.advisingBank = new Bank();
    

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

  public mergeLicensesSection(form: AbstractControl) {
    this.linkedLicenses = new LinkedLicenses();
    this.linkedLicenses.license = [];
    this.linkedLicenses.license = form[`listOfLicenses`];
  }
  public mergeCreditAvlWithBankDetails(form: AbstractControl, undertakingType: string, iUCommonDataService: IUCommonDataService) {
    if (undertakingType === 'br') {
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
    }
  }
  public mergeChargesSection(form: AbstractControl) {
    this.charges = new Charges();
    this.charges.charge = [];
    this.charges.charge = form[`listOfCharges`];
  }
}
