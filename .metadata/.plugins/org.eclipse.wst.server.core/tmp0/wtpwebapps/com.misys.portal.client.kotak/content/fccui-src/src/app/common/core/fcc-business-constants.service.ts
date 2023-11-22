import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FccBusinessConstantsService {
  static SWIFT = '01';
  static TELEX = '02';
  static COURIER = '03';
  static YES = 'Y';
  static NO = 'N';
  static EUCPLATESTVERSION_01 = '01';
  static EUCPURRLATESTVERSION_02 = '02';
  static ISPLATESTVERSION_03 = '03';
  static UCPLATESTVERSION_04 = '04';
  static UCPURRLATESTVERSION_05 = '05';
  static NONE_09 = '09';
  static OTHER_99 = '99';
  static CONFIRM_01 = '01';
  static MAYADD_02 = '02';
  static WITHOUT_03 = '03';
  static ISSUING_CHARGE_APPLICANT = '01';
  static ISSUING_CHARGE_BENEFICIARY = '02';
  static ISSUING_CHARGE_SPLIT = '08';
  static OUTSIDE_COUNTRY_CHARGE_APPLICANT = '01';
  static OUTSIDE_COUNTRY_CHARGE_BENEFICIARY = '02';
  static OUTSIDE_CHARGE_SPLIT = '08';
  static CONFIRMATION_CHARGE_APPLICANT = '01';
  static CONFIRMATION_CHARGE_BENEFICIARY = '02';
  static CONFIRMATION_CHARGE_SPLIT = '08';
  static CREDIT_AVL_PAYMENT = '01';
  static CREDIT_AVL_ACCEPTANCE = '02';
  static CREDIT_AVL_NEGOTIATION = '03';
  static CREDIT_AVL_DEFERRED = '04';
  static CREDIT_AVL_MIXED = '05';
  static CREDIT_AVL_DEMAND = '06';
  static PYMT_DRAFT_SIGHT = '01';
  static PYMT_DRAFT_MATURITYDATE = '02';
  static PYMT_DRAFT_CALC_MATURITY_DATE = '03';
  static BENE_TYPE_LI_TRANSPORATION = '01';
  static BENE_TYPE_LI_BUYER = '02';
}
