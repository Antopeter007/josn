export class LCTransactions {

static lcMasterTransaction = {
  common: {
        screen: 'LetterOfCreditScreen',
        operation: 'SAVE',
        option: '',
        templateid: '-',
        tnxtype: '03',
        mode: 'DRAFT',
        referenceid: 'LC20080000100842',
        tnxid: ''
  },
  transaction: {
  lc_amt: '25000',
  tnx_amt: '20000',
  tnx_cur_code: 'USD',
  is798: 'N',
  old_ctl_dttm: '',
  old_inp_dttm: '',
  amd_chrg_brn_by_code: '07',
  lc_type: '01',
  org_term_year: '',
  org_inco_term: '',
  product_code: 'LC',
  sub_product_code: 'LCSTD',
  tol_booking_amt: '',
  version: '',
  appl_date: '21/08/2020',
  sub_tnx_type_code: '',
  amd_date: '28/08/2020',
  template_id: '',
  cust_ref_id: '',
  iss_date: '',
  exp_date: '07/08/2022',
  expiry_place: 'In Beneficiary\'s Country',
  provisional_status: 'N',
  eucp_version: '1.0',
  eucp_presentation_place: '',
  entity: 'FIN',
  applicant_name: 'SCOTTLEVER',
  applicant_address_line_1: 'Triveni Apartments',
  applicant_address_line_2: 'Pitam Pura',
  applicant_dom: 'NEW DELHI 110034',
  applicant_address_line_4: '',
  for_account_flag: 'N',
  alt_applicant_cust_ref: '',
  alt_applicant_name: 'ABC',
  alt_applicant_address_line_1: 'ABCD',
  alt_applicant_address_line_2: '',
  alt_applicant_dom: '',
  alt_applicant_address_line_4: '',
  alt_applicant_country: 'US',
  beneficiary_name: 'Bene',
  beneficiary_address_line_1: 'Crystal Office',
  beneficiary_address_line_2: 'Block C, South Wing',
  beneficiary_dom: 'Plot 34, Sector 12',
  beneficiary_address_line_4: '',
  beneficiary_country: 'IN',
  beneficiary_reference: '',
  irv_flag: 'Y',
  ntrf_flag: 'Y',
  stnd_by_lc_flag: 'N',
  revolving_flag: 'N',
  open_chrg_applicant: '',
  cfm_inst_code: '03',
  lc_cur_code: 'USD',
  pstv_tol_pct: '',
  neg_tol_pct: '',
  credit_available_with_bank_dom: '',
  open_chrg_brn_by_code: '01',
  credit_available_with_bank_type: '',
  corr_chrg_brn_by_code: '02',
  applicable_rules: '01',
  applicable_rules_text: '',
  revolve_period: '',
  revolve_frequency: '',
  revolve_time_no: '',
  cumulative_flag: 'N',
  notice_days: '',
  issuing_bank_name: 'Bank of Great Britain',
  issuing_bank_abbv_name: 'BGB',
  applicant_reference: 'Custref123',
  issuing_bank_customer_reference: 'Custref123',
  advising_bank_iso_code: '',
  advising_bank_name: '',
  advising_bank_address_line_1: '',
  advising_bank_address_line_2: '',
  advising_bank_dom: '',
  advising_bank_address_line_4: '',
  advising_bank_reference: '',
  advise_thru_bank_iso_code: '',
  advise_thru_bank_name: '',
  advise_thru_bank_address_line_1: '',
  advise_thru_bank_address_line_2: '',
  advise_thru_bank_dom: '',
  advise_thru_bank_address_line_4: '',
  advise_thru_bank_reference: '',
  req_conf_party_flag: '',
  cr_avl_by_code: '02',
  draft_term: '5 weeks from Airway bill',
  tenor_type: '03',
  tenor_maturity_date: '',
  tenor_days: '',
  tenor_period: '',
  tenor_from_after: '',
  tenor_days_type: '',
  tenor_type_details: '',
  drawee_details_bank_name: 'Advising Bank',
  ship_from: '',
  ship_loading: '',
  ship_discharge: '',
  ship_to: '',
  part_ship_detl: '',
  tran_ship_detl: '',
  last_ship_date: '',
  inco_term_year: '',
  DrawingTolerence_spl: '',
  inco_term: '',
  inco_place: '',
  transport_mode_nosend: '',
  transport_mode_text_nosend: '',
  transport_mode: '',
  CREATE_OPTION: '',
  lineItems: '',
  fake_total_cur_code: 'AED',
  fake_total_amt: '',
  total_net_cur_code: 'AED',
  total_net_amt: '',
  period_presentation_days: '',
  narrative_period_presentation: '',
  narrative_shipment_period: '',
  narrative_additional_amount: '',
  adv_send_mode: '03',
  delivery_channel: '',
  principal_act_no: '',
  fee_act_no: '',
  free_format_text: '',
  reauth_perform: '',
  reauth_password: '',
  narrative_description_goods: 'amending narratives without code words',
  amd_details: 'narrative amendment detais',
  narrative_documents_required: 'testing amendment',
  credit_available_with_bank_name: '',
  credit_available_with_bank_address_line_4: '',
  credit_available_with_bank_address_line_2: '',
  credit_available_with_bank_address_line_1: '',
  credit_available_with_bank_iso_code: '',
  credit_available_with_bank_reference: ''
}
  };

  getLCTransactions(refId: any, tnxId?: any): {} {
    return LCTransactions.lcMasterTransaction;
  }

}
